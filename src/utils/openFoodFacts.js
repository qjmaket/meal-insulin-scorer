// ─────────────────────────────────────────────────────────
// OPEN FOOD FACTS API INTEGRATION
// Search endpoint: legacy v1 /cgi/search.pl (supports full-text)
// Nutriments field naming: carbohydrates_100g, fiber_100g,
//   proteins_100g, fat_100g, energy-kcal_100g
// No API key required. Commercial use permitted under ODbL.
// Rate limit: reasonable use — no hard published limit for small apps.
// ─────────────────────────────────────────────────────────

const BASE_URL = 'https://world.openfoodfacts.org';
const USER_AGENT = 'MealInsulinScorer/1.0 (nutrition research app)';

/**
 * GI lookup table for common foods
 * Keyed by lowercase search terms that appear in product names
 * Used to match OFF results to known GI values
 */
const GI_LOOKUP = [
  // Grains
  { terms: ['white rice', 'jasmine rice'],          gi: 73 },
  { terms: ['brown rice'],                          gi: 50 },
  { terms: ['basmati rice'],                        gi: 57 },
  { terms: ['wild rice'],                           gi: 45 },
  { terms: ['white bread', 'white sandwich bread'], gi: 75 },
  { terms: ['whole wheat bread', 'wholemeal bread'],gi: 69 },
  { terms: ['sourdough'],                           gi: 54 },
  { terms: ['pumpernickel'],                        gi: 41 },
  { terms: ['rye bread'],                           gi: 58 },
  { terms: ['ezekiel', 'sprouted bread'],           gi: 36 },
  { terms: ['bagel'],                               gi: 72 },
  { terms: ['rolled oats', 'old fashioned oats'],   gi: 55 },
  { terms: ['steel cut oats', 'steel-cut oats'],    gi: 42 },
  { terms: ['instant oats', 'quick oats'],          gi: 79 },
  { terms: ['white pasta', 'spaghetti', 'penne', 'fettuccine'], gi: 49 },
  { terms: ['whole wheat pasta', 'whole grain pasta'], gi: 42 },
  { terms: ['quinoa'],                              gi: 53 },
  { terms: ['barley'],                              gi: 28 },
  { terms: ['bulgur'],                              gi: 46 },
  { terms: ['couscous'],                            gi: 65 },
  { terms: ['corn tortilla'],                       gi: 52 },
  { terms: ['flour tortilla'],                      gi: 30 },
  { terms: ['rice cake'],                           gi: 82 },
  { terms: ['popcorn'],                             gi: 65 },
  { terms: ['millet'],                              gi: 71 },
  { terms: ['buckwheat'],                           gi: 49 },
  // Fruits
  { terms: ['apple'],                               gi: 36 },
  { terms: ['banana'],                              gi: 51 },
  { terms: ['orange'],                              gi: 43 },
  { terms: ['watermelon'],                          gi: 76 },
  { terms: ['strawberr'],                           gi: 40 },
  { terms: ['blueberr'],                            gi: 53 },
  { terms: ['cherr'],                               gi: 20 },
  { terms: ['grape'],                               gi: 59 },
  { terms: ['mango'],                               gi: 51 },
  { terms: ['pear'],                                gi: 38 },
  { terms: ['peach'],                               gi: 42 },
  { terms: ['pineapple'],                           gi: 59 },
  { terms: ['kiwi'],                                gi: 50 },
  { terms: ['grapefruit'],                          gi: 25 },
  { terms: ['cantaloupe', 'rockmelon'],             gi: 65 },
  { terms: ['plum'],                                gi: 24 },
  { terms: ['apricot'],                             gi: 34 },
  { terms: ['raspberr'],                            gi: 32 },
  { terms: ['blackberr'],                           gi: 25 },
  // Vegetables
  { terms: ['sweet potato', 'yam'],                 gi: 44 },
  { terms: ['white potato', 'russet potato', 'baked potato'], gi: 78 },
  { terms: ['corn', 'sweet corn'],                  gi: 52 },
  { terms: ['peas', 'green peas'],                  gi: 51 },
  { terms: ['beet', 'beetroot'],                    gi: 64 },
  { terms: ['carrot'],                              gi: 35 },
  { terms: ['parsnip'],                             gi: 52 },
  { terms: ['turnip'],                              gi: 62 },
  // Legumes
  { terms: ['chickpea', 'garbanzo'],                gi: 28 },
  { terms: ['red lentil'],                          gi: 26 },
  { terms: ['green lentil', 'lentil'],              gi: 30 },
  { terms: ['black bean'],                          gi: 30 },
  { terms: ['kidney bean'],                         gi: 24 },
  { terms: ['pinto bean'],                          gi: 39 },
  { terms: ['navy bean'],                           gi: 31 },
  { terms: ['edamame', 'soybeans'],                 gi: 18 },
  { terms: ['hummus'],                              gi: 6  },
  { terms: ['peanut butter'],                       gi: 14 },
  // Dairy
  { terms: ['whole milk'],                          gi: 31 },
  { terms: ['skim milk', 'nonfat milk'],            gi: 32 },
  { terms: ['greek yogurt', 'greek yoghurt'],       gi: 11 },
  { terms: ['yogurt', 'yoghurt'],                   gi: 36 },
  { terms: ['ice cream'],                           gi: 51 },
  { terms: ['oat milk'],                            gi: 69 },
  { terms: ['almond milk'],                         gi: 25 },
  { terms: ['soy milk', 'soya milk'],               gi: 34 },
  // Beverages
  { terms: ['orange juice'],                        gi: 50 },
  { terms: ['apple juice'],                         gi: 44 },
  { terms: ['grape juice'],                         gi: 52 },
  { terms: ['coca-cola', 'coke'],                   gi: 63 },
  { terms: ['sports drink', 'gatorade', 'powerade'],gi: 78 },
  { terms: ['vitaminwater', 'vitamin water'],       gi: 55 },
  // Snacks / sweets
  { terms: ['dark chocolate'],                      gi: 23 },
  { terms: ['milk chocolate'],                      gi: 43 },
  { terms: ['honey'],                               gi: 61 },
  { terms: ['maple syrup'],                         gi: 54 },
  { terms: ['white sugar', 'granulated sugar'],     gi: 65 },
  { terms: ['pretzel'],                             gi: 83 },
  { terms: ['potato chip', 'potato crisp'],         gi: 56 },
  { terms: ['french fries', 'chips'],               gi: 63 },
  { terms: ['donut', 'doughnut'],                   gi: 76 },
  { terms: ['granola bar'],                         gi: 61 },
  { terms: ['dates', 'medjool'],                    gi: 42 },
  { terms: ['raisin'],                              gi: 64 },
];

/**
 * Match a product name to the best GI value from the lookup table
 * Returns null if no match found (honest — do not guess)
 */
export function lookupGI(productName) {
  if (!productName) return null;
  const lower = productName.toLowerCase();
  for (const entry of GI_LOOKUP) {
    if (entry.terms.some(term => lower.includes(term))) {
      return entry.gi;
    }
  }
  return null;
}

/**
 * Parse a nutriments object from OFF into our standard per-100g fields
 * Returns null for any field that's genuinely missing
 */
function parseNutriments(nutriments) {
  if (!nutriments) return null;
  return {
    carbP100:    nutriments['carbohydrates_100g']   ?? null,
    fiberP100:   nutriments['fiber_100g']           ?? null,
    proteinP100: nutriments['proteins_100g']        ?? null,
    fatP100:     nutriments['fat_100g']             ?? null,
    kcalP100:    nutriments['energy-kcal_100g']     ?? null,
  };
}

/**
 * Convert an OFF product object to our app's food entry format
 */
function offProductToFood(product) {
  const name = product.product_name || product.product_name_en || 'Unknown product';
  const brand = product.brands ? ` (${product.brands.split(',')[0].trim()})` : '';
  const fullName = `${name}${brand}`;

  const nutriments = parseNutriments(product.nutriments);
  if (!nutriments) return null;

  // Require at minimum carb data to be useful for scoring
  if (nutriments.carbP100 === null) return null;

  const gi = lookupGI(name);

  // Build portions from serving size if available
  const portions = [];
  if (product.serving_size) {
    portions.push({ label: product.serving_size, g: product.serving_quantity || 100 });
  }
  portions.push({ label: '100g', g: 100 });

  return {
    id: `off_${product.code || Math.random()}`,
    name: gi ? fullName : `${fullName} (GI estimated)`,
    category: 'Search Result',
    gi: gi ?? null,           // null = no known GI
    giSource: gi ? 'lookup' : 'unknown',
    carbP100:    nutriments.carbP100    ?? 0,
    fiberP100:   nutriments.fiberP100   ?? 0,
    proteinP100: nutriments.proteinP100 ?? 0,
    fatP100:     nutriments.fatP100     ?? 0,
    kcalP100:    nutriments.kcalP100    ?? null,
    portions: portions.length > 0 ? portions : [{ label: '100g', g: 100 }],
    source: 'openfoodfacts',
  };
}

/**
 * Search Open Food Facts by text query
 * Uses legacy v1 endpoint — the only OFF endpoint supporting full-text search
 * Returns array of food objects in our app format
 */
export async function searchOpenFoodFacts(query) {
  if (!query || query.length < 2) return [];

  const params = new URLSearchParams({
    search_terms: query,
    search_simple: '1',
    action: 'process',
    json: '1',
    page_size: '8',
    fields: 'code,product_name,product_name_en,brands,serving_size,serving_quantity,nutriments',
  });

  const url = `${BASE_URL}/cgi/search.pl?${params.toString()}`;

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
    });

    if (!res.ok) return [];

    const data = await res.json();
    if (!data.products || !Array.isArray(data.products)) return [];

    return data.products
      .map(offProductToFood)
      .filter(Boolean)
      .slice(0, 6);
  } catch (err) {
    console.warn('Open Food Facts search failed:', err);
    return [];
  }
}
