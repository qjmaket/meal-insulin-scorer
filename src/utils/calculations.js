// ─────────────────────────────────────────────────────────
// CALCULATIONS UTILITY
// BMR: Mifflin-St Jeor
// Body fat: US Navy circumference method (fallback to direct input)
// TDEE: BMR × activity multiplier
// Macros: protein first (1g/lb lean mass), remaining 55% fat / 45% carbs
// ─────────────────────────────────────────────────────────

/**
 * Convert lbs to kg
 */
export function lbsToKg(lbs) {
  return lbs * 0.453592;
}

/**
 * Convert total inches to cm
 */
export function inchesToCm(inches) {
  return inches * 2.54;
}

/**
 * Convert ft+in to total inches
 */
export function heightToInches(feet, inches) {
  return feet * 12 + inches;
}

/**
 * US Navy body fat % estimate from circumferences
 * Male:   %BF = 86.010 × log10(waist − neck) − 70.041 × log10(height) + 36.76
 * Female: %BF = 163.205 × log10(waist + hip − neck) − 97.684 × log10(height) − 78.387
 * All measurements in inches
 */
export function navyBodyFat({ sex, waist, neck, hip, heightIn }) {
  if (sex === 'male') {
    if (!waist || !neck || !heightIn) return null;
    const diff = waist - neck;
    if (diff <= 0) return null;
    return 86.010 * Math.log10(diff) - 70.041 * Math.log10(heightIn) + 36.76;
  } else {
    if (!waist || !neck || !hip || !heightIn) return null;
    const sum = waist + hip - neck;
    if (sum <= 0) return null;
    return 163.205 * Math.log10(sum) - 97.684 * Math.log10(heightIn) - 78.387;
  }
}

/**
 * BMR — Mifflin-St Jeor
 * Male:   (10 × kg) + (6.25 × cm) − (5 × age) + 5
 * Female: (10 × kg) + (6.25 × cm) − (5 × age) − 161
 */
export function calcBMR({ sex, weightLbs, heightIn, age }) {
  const kg = lbsToKg(weightLbs);
  const cm = inchesToCm(heightIn);
  const base = (10 * kg) + (6.25 * cm) - (5 * age);
  return sex === 'male' ? base + 5 : base - 161;
}

/**
 * Activity multipliers
 */
const ACTIVITY_MULTIPLIERS = {
  sedentary:        1.2,
  lightly_active:   1.375,
  moderately_active: 1.55,
  very_active:      1.725,
};

export function calcTDEE({ bmr, activityLevel }) {
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] ?? 1.55;
  return bmr * multiplier;
}

/**
 * Goal-based calorie target
 * fat_loss:      −18% of TDEE
 * maintenance:   TDEE
 * muscle_gain:   +15% of TDEE
 */
export function calcCalorieTarget({ tdee, goal }) {
  const adjustments = {
    fat_loss:     0.82,
    maintenance:  1.0,
    muscle_gain:  1.15,
  };
  return tdee * (adjustments[goal] ?? 1.0);
}

/**
 * Macro targets
 * Protein: 1g per lb of lean mass
 * Remaining calories split 55% fat / 45% carbs
 */
export function calcMacros({ calorieTarget, weightLbs, bodyFatPct }) {
  const leanMass = weightLbs * (1 - bodyFatPct / 100);
  const proteinG = leanMass; // 1g per lb lean mass
  const proteinCals = proteinG * 4;
  const remaining = Math.max(0, calorieTarget - proteinCals);
  const fatCals = remaining * 0.55;
  const carbCals = remaining * 0.45;
  return {
    protein: Math.round(proteinG),
    fat:     Math.round(fatCals / 9),
    carbs:   Math.round(carbCals / 4),
    leanMass: Math.round(leanMass * 10) / 10,
  };
}

/**
 * Run full profile calculation pipeline
 * Returns null for any field that can't be calculated
 */
export function calcProfile(profile) {
  const {
    sex, age, weightLbs,
    heightFeet, heightInches,
    bodyFatPct, bodyFatSource,
    waist, neck, hip,
    activityLevel, goal,
  } = profile;

  if (!weightLbs || !heightFeet || !age || !sex) return null;

  const heightIn = heightToInches(Number(heightFeet), Number(heightInches || 0));

  // Body fat — prefer direct ZOZOFIT input, fall back to Navy method
  let bfPct = null;
  if (bodyFatSource === 'direct' && bodyFatPct) {
    bfPct = Number(bodyFatPct);
  } else if (bodyFatSource === 'navy') {
    bfPct = navyBodyFat({ sex, waist: Number(waist), neck: Number(neck), hip: Number(hip), heightIn });
  }

  const bmr = calcBMR({ sex, weightLbs: Number(weightLbs), heightIn, age: Number(age) });
  const tdee = calcTDEE({ bmr, activityLevel });
  const calorieTarget = calcCalorieTarget({ tdee, goal });
  const macros = bfPct !== null
    ? calcMacros({ calorieTarget, weightLbs: Number(weightLbs), bodyFatPct: bfPct })
    : null;

  return {
    heightIn,
    bfPct: bfPct ? Math.round(bfPct * 10) / 10 : null,
    bmr:   Math.round(bmr),
    tdee:  Math.round(tdee),
    calorieTarget: Math.round(calorieTarget),
    macros,
  };
}

/**
 * Suggested meal times by day type
 * Based on QJ's actual schedule
 */
export const SUGGESTED_WINDOWS = {
  training:   { breakFast: '07:00', meals: ['07:00', '13:00', '19:00'], closeWindow: '23:00' },
  game:       { breakFast: '06:00', meals: ['06:00', '12:30', '19:00', '21:00'], closeWindow: '22:00' },
  rest:       { breakFast: '10:00', meals: ['10:00', '13:30', '18:00'], closeWindow: '21:00' },
  recovery:   { breakFast: '11:00', meals: ['11:00', '14:00', '19:00'], closeWindow: '23:00' },
};

/**
 * Get day type from profile schedule
 */
export function getDayType(profile, date = new Date()) {
  const dow = date.getDay(); // 0=Sun, 1=Mon, ... 6=Sat
  const schedule = profile.weekSchedule || {};
  return schedule[dow] || 'rest';
}

/**
 * Format minutes as h m string
 */
export function formatDuration(minutes) {
  if (minutes < 60) return `${Math.round(minutes)}m`;
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

/**
 * Get fasting duration in minutes from a timestamp string
 */
export function fastingDuration(lastFoodTime) {
  if (!lastFoodTime) return null;
  const last = new Date(lastFoodTime);
  const now = new Date();
  return (now - last) / 60000;
}
