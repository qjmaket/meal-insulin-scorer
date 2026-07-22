// ============================================================
// MEAL INSULIN SCORER — FOOD DATABASE v2
// 300 foods across 10 categories
// GI values: University of Sydney Glycemic Index Database
// Nutritional data: USDA FoodData Central
// ============================================================

export const FOOD_DB = [

  // ─────────────────────────────────────────────
  // CATEGORY 1: GRAINS (30 foods, IDs 1–30)
  // ─────────────────────────────────────────────
  { id: 1,  name: "White rice (cooked)",           category: "Grains",       gi: 73, carbP100: 28.0, fiberP100: 0.4, proteinP100: 2.7,  fatP100: 0.3,  portions: [{ label: "½ cup", g: 93  }, { label: "1 cup", g: 186 }, { label: "1½ cups", g: 279 }] },
  { id: 2,  name: "Brown rice (cooked)",            category: "Grains",       gi: 50, carbP100: 23.0, fiberP100: 1.8, proteinP100: 2.6,  fatP100: 0.9,  portions: [{ label: "½ cup", g: 98  }, { label: "1 cup", g: 195 }, { label: "1½ cups", g: 293 }] },
  { id: 3,  name: "White bread",                   category: "Grains",       gi: 75, carbP100: 49.0, fiberP100: 2.7, proteinP100: 9.0,  fatP100: 3.2,  portions: [{ label: "1 slice", g: 30 }, { label: "2 slices", g: 60 }] },
  { id: 4,  name: "Whole wheat bread",             category: "Grains",       gi: 69, carbP100: 41.0, fiberP100: 6.9, proteinP100: 13.0, fatP100: 3.4,  portions: [{ label: "1 slice", g: 32 }, { label: "2 slices", g: 64 }] },
  { id: 5,  name: "Sourdough bread",               category: "Grains",       gi: 54, carbP100: 45.0, fiberP100: 2.4, proteinP100: 9.0,  fatP100: 1.8,  portions: [{ label: "1 slice", g: 35 }, { label: "2 slices", g: 70 }] },
  { id: 6,  name: "Rolled oats (cooked)",          category: "Grains",       gi: 55, carbP100: 12.0, fiberP100: 1.7, proteinP100: 2.5,  fatP100: 1.4,  aliases: ["oatmeal"], portions: [{ label: "½ cup", g: 117 }, { label: "1 cup", g: 234 }] },
  { id: 7,  name: "Steel-cut oats (cooked)",       category: "Grains",       gi: 42, carbP100: 12.0, fiberP100: 2.0, proteinP100: 2.5,  fatP100: 1.2,  portions: [{ label: "½ cup", g: 117 }, { label: "1 cup", g: 234 }] },
  { id: 8,  name: "Instant oats (cooked)",         category: "Grains",       gi: 79, carbP100: 14.0, fiberP100: 1.4, proteinP100: 2.2,  fatP100: 1.4,  portions: [{ label: "½ cup", g: 117 }, { label: "1 cup", g: 234 }] },
  { id: 9,  name: "White pasta (cooked)",          category: "Grains",       gi: 49, carbP100: 25.0, fiberP100: 1.8, proteinP100: 5.8,  fatP100: 0.9,  portions: [{ label: "½ cup", g: 70  }, { label: "1 cup", g: 140 }, { label: "2 cups", g: 280 }] },
  { id: 10, name: "Whole wheat pasta (cooked)",    category: "Grains",       gi: 42, carbP100: 24.0, fiberP100: 4.5, proteinP100: 5.3,  fatP100: 0.5,  portions: [{ label: "½ cup", g: 70  }, { label: "1 cup", g: 140 }, { label: "2 cups", g: 280 }] },
  { id: 11, name: "Quinoa (cooked)",               category: "Grains",       gi: 53, carbP100: 22.0, fiberP100: 2.8, proteinP100: 4.4,  fatP100: 1.9,  portions: [{ label: "½ cup", g: 93  }, { label: "1 cup", g: 185 }] },
  { id: 12, name: "Corn tortilla",                 category: "Grains",       gi: 52, carbP100: 48.0, fiberP100: 3.6, proteinP100: 5.7,  fatP100: 2.5,  portions: [{ label: "1 small (6in)", g: 26 }, { label: "2 tortillas", g: 52 }] },
  { id: 13, name: "Flour tortilla",                category: "Grains",       gi: 30, carbP100: 45.0, fiberP100: 1.9, proteinP100: 7.5,  fatP100: 7.3,  portions: [{ label: "1 medium (8in)", g: 45 }, { label: "1 large (10in)", g: 72 }] },
  { id: 14, name: "White bagel",                   category: "Grains",       gi: 72, carbP100: 52.0, fiberP100: 2.1, proteinP100: 10.0, fatP100: 1.3,  portions: [{ label: "½ bagel", g: 49 }, { label: "1 whole", g: 98 }] },
  { id: 15, name: "Pumpernickel bread",            category: "Grains",       gi: 41, carbP100: 48.0, fiberP100: 7.5, proteinP100: 8.5,  fatP100: 3.3,  portions: [{ label: "1 slice", g: 32 }, { label: "2 slices", g: 64 }] },
  { id: 16, name: "Rice cakes",                    category: "Grains",       gi: 82, carbP100: 81.0, fiberP100: 0.4, proteinP100: 7.3,  fatP100: 1.5,  portions: [{ label: "1 cake", g: 9  }, { label: "3 cakes", g: 27 }] },
  { id: 17, name: "Popcorn (air-popped)",          category: "Grains",       gi: 65, carbP100: 74.0, fiberP100: 14.5,proteinP100: 12.0, fatP100: 4.5,  portions: [{ label: "1 cup", g: 8   }, { label: "3 cups", g: 24 }] },
  { id: 18, name: "Barley (cooked)",               category: "Grains",       gi: 28, carbP100: 28.0, fiberP100: 3.8, proteinP100: 2.3,  fatP100: 0.4,  portions: [{ label: "½ cup", g: 79  }, { label: "1 cup", g: 157 }] },
  { id: 19, name: "Bulgur (cooked)",               category: "Grains",       gi: 46, carbP100: 19.0, fiberP100: 4.5, proteinP100: 3.1,  fatP100: 0.2,  portions: [{ label: "½ cup", g: 91  }, { label: "1 cup", g: 182 }] },
  { id: 20, name: "Couscous (cooked)",             category: "Grains",       gi: 65, carbP100: 23.0, fiberP100: 1.4, proteinP100: 3.8,  fatP100: 0.2,  portions: [{ label: "½ cup", g: 90  }, { label: "1 cup", g: 180 }] },
  { id: 21, name: "Jasmine rice (cooked)",         category: "Grains",       gi: 68, carbP100: 29.0, fiberP100: 0.3, proteinP100: 2.5,  fatP100: 0.2,  portions: [{ label: "½ cup", g: 93  }, { label: "1 cup", g: 186 }] },
  { id: 22, name: "Basmati rice (cooked)",         category: "Grains",       gi: 57, carbP100: 26.0, fiberP100: 0.6, proteinP100: 3.0,  fatP100: 0.4,  portions: [{ label: "½ cup", g: 93  }, { label: "1 cup", g: 186 }] },
  { id: 23, name: "Wild rice (cooked)",            category: "Grains",       gi: 45, carbP100: 21.0, fiberP100: 1.8, proteinP100: 4.0,  fatP100: 0.3,  portions: [{ label: "½ cup", g: 82  }, { label: "1 cup", g: 164 }] },
  { id: 24, name: "Rye bread",                     category: "Grains",       gi: 58, carbP100: 47.0, fiberP100: 5.8, proteinP100: 8.5,  fatP100: 3.3,  portions: [{ label: "1 slice", g: 32 }, { label: "2 slices", g: 64 }] },
  { id: 25, name: "Ezekiel bread (sprouted)",      category: "Grains",       gi: 36, carbP100: 35.0, fiberP100: 8.5, proteinP100: 9.0,  fatP100: 0.5,  portions: [{ label: "1 slice", g: 34 }, { label: "2 slices", g: 68 }] },
  { id: 26, name: "Gluten-free bread",             category: "Grains",       gi: 76, carbP100: 48.0, fiberP100: 2.0, proteinP100: 3.5,  fatP100: 4.0,  portions: [{ label: "1 slice", g: 30 }, { label: "2 slices", g: 60 }] },
  { id: 27, name: "Lentil pasta (cooked)",         category: "Grains",       gi: 40, carbP100: 23.0, fiberP100: 4.8, proteinP100: 13.0, fatP100: 1.1,  portions: [{ label: "½ cup", g: 70  }, { label: "1 cup", g: 140 }] },
  { id: 28, name: "Chickpea pasta (cooked)",       category: "Grains",       gi: 45, carbP100: 25.0, fiberP100: 5.5, proteinP100: 11.0, fatP100: 2.2,  portions: [{ label: "½ cup", g: 70  }, { label: "1 cup", g: 140 }] },
  { id: 29, name: "Millet (cooked)",               category: "Grains",       gi: 71, carbP100: 23.0, fiberP100: 1.3, proteinP100: 3.5,  fatP100: 1.0,  portions: [{ label: "½ cup", g: 87  }, { label: "1 cup", g: 174 }] },
  { id: 30, name: "Buckwheat (cooked)",            category: "Grains",       gi: 49, carbP100: 20.0, fiberP100: 2.7, proteinP100: 3.4,  fatP100: 0.6,  portions: [{ label: "½ cup", g: 84  }, { label: "1 cup", g: 168 }] },

  // CATEGORY 2: PROTEIN (30 foods, IDs 31–60)
  { id: 31, name: "Chicken breast (grilled)",      category: "Protein",      gi: 0,  carbP100: 0.0,  fiberP100: 0.0, proteinP100: 31.0, fatP100: 3.6,  portions: [{ label: "3 oz", g: 85  }, { label: "4 oz", g: 113 }, { label: "6 oz", g: 170 }] },
  { id: 32, name: "Salmon (baked)",                category: "Protein",      gi: 0,  carbP100: 0.0,  fiberP100: 0.0, proteinP100: 25.0, fatP100: 13.0, portions: [{ label: "3 oz", g: 85  }, { label: "4 oz", g: 113 }, { label: "6 oz", g: 170 }] },
  { id: 33, name: "Tuna (canned, water)",          category: "Protein",      gi: 0,  carbP100: 0.0,  fiberP100: 0.0, proteinP100: 29.0, fatP100: 0.8,  portions: [{ label: "3 oz", g: 85  }, { label: "1 can (5oz)", g: 142 }] },
  { id: 34, name: "Eggs (whole)",                  category: "Protein",      gi: 0,  carbP100: 1.1,  fiberP100: 0.0, proteinP100: 13.0, fatP100: 11.0, portions: [{ label: "1 egg", g: 50  }, { label: "2 eggs", g: 100 }, { label: "3 eggs", g: 150 }] },
  { id: 35, name: "Ground beef (lean, cooked)",    category: "Protein",      gi: 0,  carbP100: 0.0,  fiberP100: 0.0, proteinP100: 26.0, fatP100: 15.0, portions: [{ label: "3 oz", g: 85  }, { label: "4 oz", g: 113 }] },
  { id: 36, name: "Turkey breast (cooked)",        category: "Protein",      gi: 0,  carbP100: 0.0,  fiberP100: 0.0, proteinP100: 29.0, fatP100: 1.8,  portions: [{ label: "3 oz", g: 85  }, { label: "4 oz", g: 113 }] },
  { id: 37, name: "Shrimp (cooked)",               category: "Protein",      gi: 0,  carbP100: 0.9,  fiberP100: 0.0, proteinP100: 24.0, fatP100: 1.7,  portions: [{ label: "3 oz", g: 85  }, { label: "4 oz", g: 113 }] },
  { id: 38, name: "Whey protein shake",            category: "Protein",      gi: 17, carbP100: 8.0,  fiberP100: 0.0, proteinP100: 73.0, fatP100: 4.0,  portions: [{ label: "1 scoop", g: 30 }, { label: "2 scoops", g: 60 }] },
  { id: 39, name: "Greek yogurt (plain, nonfat)",  category: "Protein",      gi: 11, carbP100: 6.0,  fiberP100: 0.0, proteinP100: 10.0, fatP100: 0.4,  portions: [{ label: "½ cup", g: 114 }, { label: "1 cup", g: 227 }] },
  { id: 40, name: "Cottage cheese (lowfat)",       category: "Protein",      gi: 10, carbP100: 3.4,  fiberP100: 0.0, proteinP100: 11.0, fatP100: 1.0,  portions: [{ label: "½ cup", g: 113 }, { label: "1 cup", g: 226 }] },
  { id: 41, name: "Chicken thigh (cooked)",        category: "Protein",      gi: 0,  carbP100: 0.0,  fiberP100: 0.0, proteinP100: 26.0, fatP100: 11.0, portions: [{ label: "1 thigh", g: 94  }, { label: "2 thighs", g: 188 }] },
  { id: 42, name: "Pork loin (cooked)",            category: "Protein",      gi: 0,  carbP100: 0.0,  fiberP100: 0.0, proteinP100: 29.0, fatP100: 7.0,  portions: [{ label: "3 oz", g: 85  }, { label: "4 oz", g: 113 }] },
  { id: 43, name: "Tilapia (cooked)",              category: "Protein",      gi: 0,  carbP100: 0.0,  fiberP100: 0.0, proteinP100: 26.0, fatP100: 3.0,  portions: [{ label: "3 oz", g: 85  }, { label: "4 oz", g: 113 }] },
  { id: 44, name: "Cod (baked)",                   category: "Protein",      gi: 0,  carbP100: 0.0,  fiberP100: 0.0, proteinP100: 23.0, fatP100: 0.9,  portions: [{ label: "3 oz", g: 85  }, { label: "4 oz", g: 113 }] },
  { id: 45, name: "Sardines (canned, oil)",        category: "Protein",      gi: 0,  carbP100: 0.0,  fiberP100: 0.0, proteinP100: 25.0, fatP100: 11.0, portions: [{ label: "2 sardines", g: 48 }, { label: "1 can (3.75oz)", g: 106 }] },
  { id: 46, name: "Egg whites",                   category: "Protein",      gi: 0,  carbP100: 0.7,  fiberP100: 0.0, proteinP100: 11.0, fatP100: 0.2,  portions: [{ label: "2 whites", g: 66  }, { label: "3 whites", g: 99 }] },
  { id: 47, name: "Lamb (cooked)",                 category: "Protein",      gi: 0,  carbP100: 0.0,  fiberP100: 0.0, proteinP100: 28.0, fatP100: 14.0, portions: [{ label: "3 oz", g: 85  }, { label: "4 oz", g: 113 }] },
  { id: 48, name: "Bison (cooked)",                category: "Protein",      gi: 0,  carbP100: 0.0,  fiberP100: 0.0, proteinP100: 29.0, fatP100: 6.0,  portions: [{ label: "3 oz", g: 85  }, { label: "4 oz", g: 113 }] },
  { id: 49, name: "Halibut (cooked)",              category: "Protein",      gi: 0,  carbP100: 0.0,  fiberP100: 0.0, proteinP100: 27.0, fatP100: 2.9,  portions: [{ label: "3 oz", g: 85  }, { label: "4 oz", g: 113 }] },
  { id: 50, name: "Scallops (cooked)",             category: "Protein",      gi: 0,  carbP100: 3.2,  fiberP100: 0.0, proteinP100: 20.0, fatP100: 1.2,  portions: [{ label: "3 oz", g: 85  }] },
  { id: 51, name: "Turkey ground (lean, cooked)",  category: "Protein",      gi: 0,  carbP100: 0.0,  fiberP100: 0.0, proteinP100: 27.0, fatP100: 8.0,  portions: [{ label: "3 oz", g: 85  }, { label: "4 oz", g: 113 }] },
  { id: 52, name: "Chicken sausage",               category: "Protein",      gi: 0,  carbP100: 2.0,  fiberP100: 0.0, proteinP100: 19.0, fatP100: 9.0,  portions: [{ label: "1 link", g: 75  }, { label: "2 links", g: 150 }] },
  { id: 53, name: "Beef steak (sirloin, cooked)",  category: "Protein",      gi: 0,  carbP100: 0.0,  fiberP100: 0.0, proteinP100: 27.0, fatP100: 8.0,  portions: [{ label: "3 oz", g: 85  }, { label: "6 oz", g: 170 }] },
  { id: 54, name: "Pea protein shake",             category: "Protein",      gi: 15, carbP100: 5.0,  fiberP100: 0.5, proteinP100: 80.0, fatP100: 2.0,  portions: [{ label: "1 scoop", g: 30 }, { label: "2 scoops", g: 60 }] },
  { id: 55, name: "Tempeh",                        category: "Protein",      gi: 15, carbP100: 9.0,  fiberP100: 4.3, proteinP100: 19.0, fatP100: 11.0, portions: [{ label: "3 oz", g: 85  }, { label: "4 oz", g: 113 }] },
  { id: 56, name: "Tofu (firm)",                   category: "Protein",      gi: 15, carbP100: 2.8,  fiberP100: 0.3, proteinP100: 8.0,  fatP100: 4.8,  portions: [{ label: "½ cup", g: 126 }, { label: "1 cup", g: 252 }] },
  { id: 57, name: "Deli turkey (sliced)",          category: "Protein",      gi: 0,  carbP100: 2.5,  fiberP100: 0.0, proteinP100: 18.0, fatP100: 1.5,  portions: [{ label: "2 slices", g: 57 }, { label: "4 slices", g: 114 }] },
  { id: 58, name: "Bacon (cooked)",                category: "Protein",      gi: 0,  carbP100: 1.4,  fiberP100: 0.0, proteinP100: 37.0, fatP100: 43.0, portions: [{ label: "2 strips", g: 17  }, { label: "4 strips", g: 34 }] },
  { id: 59, name: "Crab (cooked)",                 category: "Protein",      gi: 0,  carbP100: 0.0,  fiberP100: 0.0, proteinP100: 19.0, fatP100: 1.5,  portions: [{ label: "3 oz", g: 85  }] },
  { id: 60, name: "Lobster (cooked)",              category: "Protein",      gi: 0,  carbP100: 1.3,  fiberP100: 0.0, proteinP100: 20.0, fatP100: 0.6,  portions: [{ label: "3 oz", g: 85  }] },

  // CATEGORY 3: VEGETABLES (35 foods, IDs 61–95)
  { id: 61, name: "Broccoli (cooked)",             category: "Vegetables",   gi: 10, carbP100: 7.0,  fiberP100: 2.6, proteinP100: 2.8,  fatP100: 0.3,  portions: [{ label: "½ cup", g: 46  }, { label: "1 cup", g: 91 }, { label: "2 cups", g: 182 }] },
  { id: 62, name: "Spinach (raw)",                 category: "Vegetables",   gi: 15, carbP100: 3.6,  fiberP100: 2.2, proteinP100: 2.9,  fatP100: 0.4,  portions: [{ label: "1 cup", g: 30  }, { label: "2 cups", g: 60 }, { label: "3 cups", g: 90 }] },
  { id: 63, name: "Kale (raw)",                    category: "Vegetables",   gi: 10, carbP100: 9.0,  fiberP100: 3.6, proteinP100: 4.3,  fatP100: 0.9,  portions: [{ label: "1 cup chopped", g: 67 }, { label: "2 cups", g: 134 }] },
  { id: 64, name: "Bell pepper (raw)",             category: "Vegetables",   gi: 15, carbP100: 6.0,  fiberP100: 2.1, proteinP100: 1.0,  fatP100: 0.3,  portions: [{ label: "½ medium", g: 60 }, { label: "1 medium", g: 119 }] },
  { id: 65, name: "Tomato (raw)",                  category: "Vegetables",   gi: 15, carbP100: 3.9,  fiberP100: 1.2, proteinP100: 0.9,  fatP100: 0.2,  portions: [{ label: "½ cup diced", g: 90 }, { label: "1 medium", g: 123 }] },
  { id: 66, name: "Carrots (raw)",                 category: "Vegetables",   gi: 35, carbP100: 10.0, fiberP100: 2.8, proteinP100: 0.9,  fatP100: 0.2,  portions: [{ label: "1 medium", g: 61 }, { label: "1 cup chopped", g: 128 }] },
  { id: 67, name: "Sweet potato (boiled)",         category: "Vegetables",   gi: 44, carbP100: 20.0, fiberP100: 3.0, proteinP100: 1.6,  fatP100: 0.1,  portions: [{ label: "½ cup mashed", g: 100 }, { label: "1 medium", g: 130 }] },
  { id: 68, name: "White potato (boiled)",         category: "Vegetables",   gi: 78, carbP100: 17.0, fiberP100: 1.8, proteinP100: 1.9,  fatP100: 0.1,  portions: [{ label: "½ cup diced", g: 75 }, { label: "1 medium", g: 150 }] },
  { id: 69, name: "Cauliflower (cooked)",          category: "Vegetables",   gi: 15, carbP100: 5.0,  fiberP100: 2.3, proteinP100: 2.0,  fatP100: 0.4,  portions: [{ label: "½ cup", g: 62 }, { label: "1 cup", g: 124 }] },
  { id: 70, name: "Zucchini (cooked)",             category: "Vegetables",   gi: 15, carbP100: 3.1,  fiberP100: 1.0, proteinP100: 1.2,  fatP100: 0.2,  portions: [{ label: "½ cup", g: 90 }, { label: "1 cup", g: 180 }] },
  { id: 71, name: "Asparagus (cooked)",            category: "Vegetables",   gi: 15, carbP100: 3.9,  fiberP100: 2.1, proteinP100: 2.9,  fatP100: 0.2,  portions: [{ label: "5 spears", g: 67 }, { label: "1 cup", g: 134 }] },
  { id: 72, name: "Cucumber (raw)",                category: "Vegetables",   gi: 15, carbP100: 3.6,  fiberP100: 0.5, proteinP100: 0.7,  fatP100: 0.1,  portions: [{ label: "½ cup sliced", g: 52 }, { label: "1 cup", g: 104 }] },
  { id: 73, name: "Corn (cooked)",                 category: "Vegetables",   gi: 52, carbP100: 19.0, fiberP100: 2.0, proteinP100: 3.3,  fatP100: 1.4,  portions: [{ label: "½ cup kernels", g: 77 }, { label: "1 cup", g: 154 }, { label: "1 ear", g: 77 }] },
  { id: 74, name: "Peas (cooked)",                 category: "Vegetables",   gi: 51, carbP100: 14.0, fiberP100: 4.4, proteinP100: 5.4,  fatP100: 0.4,  portions: [{ label: "½ cup", g: 80 }, { label: "1 cup", g: 160 }] },
  { id: 75, name: "Beets (cooked)",                category: "Vegetables",   gi: 64, carbP100: 10.0, fiberP100: 2.0, proteinP100: 1.7,  fatP100: 0.2,  portions: [{ label: "½ cup sliced", g: 85 }, { label: "1 cup", g: 170 }] },
  { id: 76, name: "Avocado",                       category: "Vegetables",   gi: 15, carbP100: 9.0,  fiberP100: 6.7, proteinP100: 2.0,  fatP100: 15.0, portions: [{ label: "¼ avocado", g: 50 }, { label: "½ avocado", g: 100 }, { label: "1 whole", g: 200 }] },
  { id: 77, name: "Onion (raw)",                   category: "Vegetables",   gi: 10, carbP100: 9.3,  fiberP100: 1.7, proteinP100: 1.1,  fatP100: 0.1,  portions: [{ label: "¼ cup diced", g: 40 }, { label: "½ cup", g: 80 }] },
  { id: 78, name: "Garlic",                        category: "Vegetables",   gi: 10, carbP100: 33.0, fiberP100: 2.1, proteinP100: 6.4,  fatP100: 0.5,  portions: [{ label: "1 clove", g: 3  }, { label: "3 cloves", g: 9 }] },
  { id: 79, name: "Brussels sprouts (cooked)",     category: "Vegetables",   gi: 15, carbP100: 9.0,  fiberP100: 3.8, proteinP100: 3.4,  fatP100: 0.3,  portions: [{ label: "½ cup", g: 78 }, { label: "1 cup", g: 156 }] },
  { id: 80, name: "Mushrooms (cooked)",            category: "Vegetables",   gi: 10, carbP100: 4.4,  fiberP100: 1.1, proteinP100: 2.5,  fatP100: 0.3,  portions: [{ label: "½ cup", g: 78 }, { label: "1 cup", g: 156 }] },
  { id: 81, name: "Green beans (cooked)",          category: "Vegetables",   gi: 15, carbP100: 7.0,  fiberP100: 3.4, proteinP100: 1.9,  fatP100: 0.2,  portions: [{ label: "½ cup", g: 62 }, { label: "1 cup", g: 125 }] },
  { id: 82, name: "Eggplant (cooked)",             category: "Vegetables",   gi: 15, carbP100: 8.7,  fiberP100: 2.5, proteinP100: 0.8,  fatP100: 0.2,  portions: [{ label: "½ cup", g: 50 }, { label: "1 cup", g: 100 }] },
  { id: 83, name: "Celery (raw)",                  category: "Vegetables",   gi: 15, carbP100: 3.0,  fiberP100: 1.6, proteinP100: 0.7,  fatP100: 0.2,  portions: [{ label: "2 stalks", g: 80 }, { label: "1 cup chopped", g: 101 }] },
  { id: 84, name: "Lettuce (romaine)",             category: "Vegetables",   gi: 15, carbP100: 3.3,  fiberP100: 2.1, proteinP100: 1.2,  fatP100: 0.3,  portions: [{ label: "1 cup shredded", g: 47 }, { label: "2 cups", g: 94 }] },
  { id: 85, name: "Cabbage (cooked)",              category: "Vegetables",   gi: 10, carbP100: 6.0,  fiberP100: 2.3, proteinP100: 1.3,  fatP100: 0.1,  portions: [{ label: "½ cup", g: 75 }, { label: "1 cup", g: 150 }] },
  { id: 86, name: "Artichoke (cooked)",            category: "Vegetables",   gi: 15, carbP100: 11.0, fiberP100: 5.4, proteinP100: 3.5,  fatP100: 0.4,  portions: [{ label: "1 medium", g: 120 }] },
  { id: 87, name: "Leeks (cooked)",                category: "Vegetables",   gi: 15, carbP100: 11.0, fiberP100: 1.8, proteinP100: 0.9,  fatP100: 0.3,  portions: [{ label: "½ cup", g: 52 }, { label: "1 cup", g: 104 }] },
  { id: 88, name: "Butternut squash (cooked)",     category: "Vegetables",   gi: 51, carbP100: 10.0, fiberP100: 2.0, proteinP100: 0.9,  fatP100: 0.1,  portions: [{ label: "½ cup cubed", g: 82 }, { label: "1 cup", g: 164 }] },
  { id: 89, name: "Acorn squash (cooked)",         category: "Vegetables",   gi: 75, carbP100: 14.0, fiberP100: 2.1, proteinP100: 1.1,  fatP100: 0.1,  portions: [{ label: "½ cup", g: 103 }, { label: "1 cup", g: 205 }] },
  { id: 90, name: "Parsnips (cooked)",             category: "Vegetables",   gi: 52, carbP100: 13.0, fiberP100: 3.6, proteinP100: 1.2,  fatP100: 0.3,  portions: [{ label: "½ cup", g: 78 }, { label: "1 cup", g: 156 }] },
  { id: 91, name: "Turnips (cooked)",              category: "Vegetables",   gi: 62, carbP100: 5.1,  fiberP100: 2.0, proteinP100: 0.9,  fatP100: 0.1,  portions: [{ label: "½ cup", g: 78 }, { label: "1 cup", g: 156 }] },
  { id: 92, name: "Radishes (raw)",                category: "Vegetables",   gi: 15, carbP100: 3.4,  fiberP100: 1.6, proteinP100: 0.7,  fatP100: 0.1,  portions: [{ label: "5 radishes", g: 45 }, { label: "1 cup sliced", g: 116 }] },
  { id: 93, name: "Swiss chard (cooked)",          category: "Vegetables",   gi: 15, carbP100: 3.6,  fiberP100: 1.6, proteinP100: 1.9,  fatP100: 0.1,  portions: [{ label: "½ cup", g: 88 }, { label: "1 cup", g: 175 }] },
  { id: 94, name: "Bok choy (cooked)",             category: "Vegetables",   gi: 10, carbP100: 2.0,  fiberP100: 1.0, proteinP100: 1.6,  fatP100: 0.2,  portions: [{ label: "½ cup", g: 85 }, { label: "1 cup", g: 170 }] },
  { id: 95, name: "Arugula (raw)",                 category: "Vegetables",   gi: 15, carbP100: 3.7,  fiberP100: 1.6, proteinP100: 2.6,  fatP100: 0.7,  portions: [{ label: "1 cup", g: 20 }, { label: "2 cups", g: 40 }] },

  // CATEGORY 4: FRUITS (30 foods, IDs 96–125)
  { id: 96,  name: "Apple",                        category: "Fruits",       gi: 36, carbP100: 14.0, fiberP100: 2.4, proteinP100: 0.3,  fatP100: 0.2,  portions: [{ label: "1 small", g: 120 }, { label: "1 medium", g: 182 }] },
  { id: 97,  name: "Banana",                       category: "Fruits",       gi: 51, carbP100: 23.0, fiberP100: 2.6, proteinP100: 1.1,  fatP100: 0.3,  portions: [{ label: "1 small", g: 81 }, { label: "1 medium", g: 118 }, { label: "1 large", g: 136 }] },
  { id: 98,  name: "Orange",                       category: "Fruits",       gi: 43, carbP100: 12.0, fiberP100: 2.4, proteinP100: 0.9,  fatP100: 0.1,  portions: [{ label: "1 medium", g: 131 }, { label: "1 large", g: 184 }] },
  { id: 99,  name: "Watermelon",                   category: "Fruits",       gi: 76, carbP100: 8.0,  fiberP100: 0.4, proteinP100: 0.6,  fatP100: 0.2,  portions: [{ label: "1 cup diced", g: 152 }, { label: "2 cups", g: 304 }, { label: "1 wedge", g: 286 }] },
  { id: 100, name: "Strawberries",                 category: "Fruits",       gi: 40, carbP100: 8.0,  fiberP100: 2.0, proteinP100: 0.7,  fatP100: 0.3,  portions: [{ label: "½ cup", g: 76 }, { label: "1 cup", g: 152 }] },
  { id: 101, name: "Blueberries",                  category: "Fruits",       gi: 53, carbP100: 14.0, fiberP100: 2.4, proteinP100: 0.7,  fatP100: 0.3,  portions: [{ label: "½ cup", g: 74 }, { label: "1 cup", g: 148 }] },
  { id: 102, name: "Cherries",                     category: "Fruits",       gi: 20, carbP100: 16.0, fiberP100: 2.1, proteinP100: 1.1,  fatP100: 0.3,  portions: [{ label: "½ cup", g: 69 }, { label: "1 cup", g: 138 }] },
  { id: 103, name: "Grapes",                       category: "Fruits",       gi: 59, carbP100: 17.0, fiberP100: 0.9, proteinP100: 0.7,  fatP100: 0.2,  portions: [{ label: "½ cup", g: 76 }, { label: "1 cup", g: 151 }] },
  { id: 104, name: "Mango",                        category: "Fruits",       gi: 51, carbP100: 15.0, fiberP100: 1.6, proteinP100: 0.8,  fatP100: 0.4,  portions: [{ label: "½ cup diced", g: 83 }, { label: "1 cup", g: 165 }] },
  { id: 105, name: "Pear",                         category: "Fruits",       gi: 38, carbP100: 15.0, fiberP100: 3.1, proteinP100: 0.4,  fatP100: 0.1,  portions: [{ label: "1 medium", g: 178 }] },
  { id: 106, name: "Peach",                        category: "Fruits",       gi: 42, carbP100: 10.0, fiberP100: 1.5, proteinP100: 0.9,  fatP100: 0.3,  portions: [{ label: "1 medium", g: 150 }] },
  { id: 107, name: "Pineapple",                    category: "Fruits",       gi: 59, carbP100: 13.0, fiberP100: 1.4, proteinP100: 0.5,  fatP100: 0.1,  portions: [{ label: "½ cup chunks", g: 83 }, { label: "1 cup", g: 165 }] },
  { id: 108, name: "Kiwi",                         category: "Fruits",       gi: 50, carbP100: 15.0, fiberP100: 3.0, proteinP100: 1.1,  fatP100: 0.5,  portions: [{ label: "1 medium", g: 76 }, { label: "2 medium", g: 152 }] },
  { id: 109, name: "Grapefruit",                   category: "Fruits",       gi: 25, carbP100: 11.0, fiberP100: 1.6, proteinP100: 0.8,  fatP100: 0.1,  portions: [{ label: "½ grapefruit", g: 123 }, { label: "1 whole", g: 246 }] },
  { id: 110, name: "Cantaloupe",                   category: "Fruits",       gi: 65, carbP100: 8.0,  fiberP100: 0.9, proteinP100: 0.8,  fatP100: 0.2,  portions: [{ label: "1 cup cubed", g: 160 }] },
  { id: 111, name: "Plum",                         category: "Fruits",       gi: 24, carbP100: 11.0, fiberP100: 1.4, proteinP100: 0.7,  fatP100: 0.3,  portions: [{ label: "1 medium", g: 66 }, { label: "2 medium", g: 132 }] },
  { id: 112, name: "Apricot",                      category: "Fruits",       gi: 34, carbP100: 11.0, fiberP100: 2.0, proteinP100: 1.4,  fatP100: 0.4,  portions: [{ label: "2 medium", g: 70 }, { label: "4 medium", g: 140 }] },
  { id: 113, name: "Raspberries",                  category: "Fruits",       gi: 32, carbP100: 12.0, fiberP100: 6.5, proteinP100: 1.2,  fatP100: 0.7,  portions: [{ label: "½ cup", g: 62 }, { label: "1 cup", g: 123 }] },
  { id: 114, name: "Blackberries",                 category: "Fruits",       gi: 25, carbP100: 10.0, fiberP100: 5.3, proteinP100: 1.4,  fatP100: 0.5,  portions: [{ label: "½ cup", g: 72 }, { label: "1 cup", g: 144 }] },
  { id: 115, name: "Pomegranate seeds",            category: "Fruits",       gi: 35, carbP100: 19.0, fiberP100: 4.0, proteinP100: 1.7,  fatP100: 1.2,  portions: [{ label: "½ cup", g: 87 }, { label: "1 cup", g: 174 }] },
  { id: 116, name: "Papaya",                       category: "Fruits",       gi: 60, carbP100: 11.0, fiberP100: 1.7, proteinP100: 0.5,  fatP100: 0.3,  portions: [{ label: "1 cup cubed", g: 140 }] },
  { id: 117, name: "Lychee",                       category: "Fruits",       gi: 50, carbP100: 17.0, fiberP100: 1.3, proteinP100: 0.8,  fatP100: 0.4,  portions: [{ label: "5 lychee", g: 60 }, { label: "10 lychee", g: 120 }] },
  { id: 118, name: "Dragon fruit",                 category: "Fruits",       gi: 48, carbP100: 13.0, fiberP100: 3.0, proteinP100: 1.2,  fatP100: 0.4,  portions: [{ label: "½ cup", g: 86 }, { label: "1 cup", g: 172 }] },
  { id: 119, name: "Fig (fresh)",                  category: "Fruits",       gi: 61, carbP100: 19.0, fiberP100: 2.9, proteinP100: 0.8,  fatP100: 0.3,  portions: [{ label: "2 medium", g: 100 }] },
  { id: 120, name: "Honeydew melon",               category: "Fruits",       gi: 62, carbP100: 9.1,  fiberP100: 0.8, proteinP100: 0.5,  fatP100: 0.1,  portions: [{ label: "1 cup cubed", g: 170 }] },
  { id: 121, name: "Nectarine",                    category: "Fruits",       gi: 43, carbP100: 10.0, fiberP100: 1.7, proteinP100: 1.1,  fatP100: 0.3,  portions: [{ label: "1 medium", g: 142 }] },
  { id: 122, name: "Passion fruit",                category: "Fruits",       gi: 30, carbP100: 23.0, fiberP100: 10.4,proteinP100: 2.2,  fatP100: 0.7,  portions: [{ label: "2 fruits", g: 36 }, { label: "¼ cup pulp", g: 59 }] },
  { id: 123, name: "Tangerine / mandarin",         category: "Fruits",       gi: 47, carbP100: 13.0, fiberP100: 1.8, proteinP100: 0.8,  fatP100: 0.3,  portions: [{ label: "1 medium", g: 88 }, { label: "2 medium", g: 176 }] },
  { id: 124, name: "Guava",                        category: "Fruits",       gi: 12, carbP100: 14.0, fiberP100: 5.4, proteinP100: 2.6,  fatP100: 1.0,  portions: [{ label: "1 medium", g: 55 }, { label: "1 cup", g: 165 }] },
  { id: 125, name: "Coconut (fresh shredded)",     category: "Fruits",       gi: 45, carbP100: 15.0, fiberP100: 9.0, proteinP100: 3.3,  fatP100: 33.0, portions: [{ label: "¼ cup", g: 23 }, { label: "½ cup", g: 47 }] },

  // CATEGORY 5: LEGUMES (20 foods, IDs 126–145)
  { id: 126, name: "Chickpeas (cooked)",           category: "Legumes",      gi: 28, carbP100: 27.0, fiberP100: 7.6, proteinP100: 9.0,  fatP100: 2.6,  portions: [{ label: "½ cup", g: 82 }, { label: "1 cup", g: 164 }] },
  { id: 127, name: "Red lentils (cooked)",         category: "Legumes",      gi: 26, carbP100: 20.0, fiberP100: 7.9, proteinP100: 9.0,  fatP100: 0.4,  portions: [{ label: "½ cup", g: 99 }, { label: "1 cup", g: 198 }] },
  { id: 128, name: "Green lentils (cooked)",       category: "Legumes",      gi: 30, carbP100: 20.0, fiberP100: 7.9, proteinP100: 9.0,  fatP100: 0.4,  portions: [{ label: "½ cup", g: 99 }, { label: "1 cup", g: 198 }] },
  { id: 129, name: "Black beans (cooked)",         category: "Legumes",      gi: 30, carbP100: 23.0, fiberP100: 8.7, proteinP100: 8.9,  fatP100: 0.5,  portions: [{ label: "½ cup", g: 86 }, { label: "1 cup", g: 172 }] },
  { id: 130, name: "Kidney beans (cooked)",        category: "Legumes",      gi: 24, carbP100: 22.0, fiberP100: 6.4, proteinP100: 8.7,  fatP100: 0.5,  portions: [{ label: "½ cup", g: 89 }, { label: "1 cup", g: 177 }] },
  { id: 131, name: "Edamame (shelled)",            category: "Legumes",      gi: 18, carbP100: 10.0, fiberP100: 5.2, proteinP100: 11.0, fatP100: 5.2,  portions: [{ label: "½ cup", g: 78 }, { label: "1 cup", g: 155 }] },
  { id: 132, name: "Pinto beans (cooked)",         category: "Legumes",      gi: 39, carbP100: 22.0, fiberP100: 9.0, proteinP100: 9.0,  fatP100: 0.7,  portions: [{ label: "½ cup", g: 86 }, { label: "1 cup", g: 171 }] },
  { id: 133, name: "Navy beans (cooked)",          category: "Legumes",      gi: 31, carbP100: 26.0, fiberP100: 10.5,proteinP100: 8.2,  fatP100: 0.6,  portions: [{ label: "½ cup", g: 91 }, { label: "1 cup", g: 182 }] },
  { id: 134, name: "Butter beans / lima (cooked)", category: "Legumes",      gi: 32, carbP100: 20.0, fiberP100: 7.0, proteinP100: 7.8,  fatP100: 0.4,  portions: [{ label: "½ cup", g: 91 }, { label: "1 cup", g: 182 }] },
  { id: 135, name: "Split peas (cooked)",          category: "Legumes",      gi: 25, carbP100: 21.0, fiberP100: 8.1, proteinP100: 8.3,  fatP100: 0.4,  portions: [{ label: "½ cup", g: 98 }, { label: "1 cup", g: 196 }] },
  { id: 136, name: "Hummus",                       category: "Legumes",      gi: 6,  carbP100: 14.0, fiberP100: 3.9, proteinP100: 4.9,  fatP100: 9.6,  portions: [{ label: "2 tbsp", g: 30 }, { label: "¼ cup", g: 60 }] },
  { id: 137, name: "Fava beans (cooked)",          category: "Legumes",      gi: 40, carbP100: 20.0, fiberP100: 5.4, proteinP100: 7.9,  fatP100: 0.4,  portions: [{ label: "½ cup", g: 85 }, { label: "1 cup", g: 170 }] },
  { id: 138, name: "Mung beans (cooked)",          category: "Legumes",      gi: 31, carbP100: 19.0, fiberP100: 7.6, proteinP100: 7.0,  fatP100: 0.4,  portions: [{ label: "½ cup", g: 101 }, { label: "1 cup", g: 202 }] },
  { id: 139, name: "Black-eyed peas (cooked)",     category: "Legumes",      gi: 33, carbP100: 21.0, fiberP100: 6.5, proteinP100: 7.7,  fatP100: 0.5,  portions: [{ label: "½ cup", g: 86 }, { label: "1 cup", g: 171 }] },
  { id: 140, name: "Cannellini beans (cooked)",    category: "Legumes",      gi: 31, carbP100: 22.0, fiberP100: 6.3, proteinP100: 7.3,  fatP100: 0.3,  portions: [{ label: "½ cup", g: 90 }, { label: "1 cup", g: 179 }] },
  { id: 141, name: "Soybeans (cooked)",            category: "Legumes",      gi: 15, carbP100: 9.9,  fiberP100: 6.0, proteinP100: 17.0, fatP100: 9.0,  portions: [{ label: "½ cup", g: 90 }, { label: "1 cup", g: 180 }] },
  { id: 142, name: "Baked beans (canned)",         category: "Legumes",      gi: 48, carbP100: 17.0, fiberP100: 3.5, proteinP100: 4.8,  fatP100: 0.5,  portions: [{ label: "½ cup", g: 127 }, { label: "1 cup", g: 254 }] },
  { id: 143, name: "Refried beans (canned)",       category: "Legumes",      gi: 38, carbP100: 16.0, fiberP100: 5.5, proteinP100: 5.5,  fatP100: 1.5,  portions: [{ label: "½ cup", g: 125 }] },
  { id: 144, name: "Peanuts (dry roasted)",        category: "Legumes",      gi: 14, carbP100: 21.0, fiberP100: 8.0, proteinP100: 24.0, fatP100: 50.0, portions: [{ label: "1 oz", g: 28 }, { label: "¼ cup", g: 37 }] },
  { id: 145, name: "Peanut butter (natural)",      category: "Legumes",      gi: 14, carbP100: 20.0, fiberP100: 6.0, proteinP100: 25.0, fatP100: 50.0, portions: [{ label: "1 tbsp", g: 16 }, { label: "2 tbsp", g: 32 }] },

  // CATEGORY 6: DAIRY (20 foods, IDs 146–165)
  { id: 146, name: "Whole milk",                   category: "Dairy",        gi: 31, carbP100: 4.8,  fiberP100: 0.0, proteinP100: 3.2,  fatP100: 3.3,  portions: [{ label: "½ cup", g: 122 }, { label: "1 cup", g: 244 }] },
  { id: 147, name: "Skim milk",                    category: "Dairy",        gi: 32, carbP100: 5.0,  fiberP100: 0.0, proteinP100: 3.4,  fatP100: 0.2,  portions: [{ label: "½ cup", g: 122 }, { label: "1 cup", g: 244 }] },
  { id: 148, name: "2% milk",                      category: "Dairy",        gi: 31, carbP100: 4.8,  fiberP100: 0.0, proteinP100: 3.3,  fatP100: 2.0,  portions: [{ label: "½ cup", g: 122 }, { label: "1 cup", g: 244 }] },
  { id: 149, name: "Cheddar cheese",               category: "Dairy",        gi: 0,  carbP100: 1.3,  fiberP100: 0.0, proteinP100: 25.0, fatP100: 33.0, portions: [{ label: "1 oz", g: 28 }, { label: "2 oz", g: 56 }] },
  { id: 150, name: "Mozzarella (part-skim)",       category: "Dairy",        gi: 0,  carbP100: 2.2,  fiberP100: 0.0, proteinP100: 22.0, fatP100: 17.0, portions: [{ label: "1 oz", g: 28 }, { label: "¼ cup shredded", g: 28 }] },
  { id: 151, name: "Greek yogurt (full-fat)",      category: "Dairy",        gi: 11, carbP100: 4.1,  fiberP100: 0.0, proteinP100: 9.0,  fatP100: 5.0,  portions: [{ label: "½ cup", g: 113 }, { label: "1 cup", g: 227 }] },
  { id: 152, name: "Regular yogurt (plain)",       category: "Dairy",        gi: 36, carbP100: 7.0,  fiberP100: 0.0, proteinP100: 4.7,  fatP100: 1.6,  portions: [{ label: "½ cup", g: 113 }, { label: "1 cup", g: 245 }] },
  { id: 153, name: "Flavored yogurt (fruit)",      category: "Dairy",        gi: 33, carbP100: 19.0, fiberP100: 0.0, proteinP100: 4.4,  fatP100: 1.5,  portions: [{ label: "1 container (6oz)", g: 170 }] },
  { id: 154, name: "Parmesan (grated)",            category: "Dairy",        gi: 0,  carbP100: 3.2,  fiberP100: 0.0, proteinP100: 38.0, fatP100: 29.0, portions: [{ label: "2 tbsp", g: 10 }, { label: "¼ cup", g: 25 }] },
  { id: 155, name: "Feta cheese",                  category: "Dairy",        gi: 0,  carbP100: 4.1,  fiberP100: 0.0, proteinP100: 14.0, fatP100: 21.0, portions: [{ label: "1 oz crumbled", g: 28 }, { label: "¼ cup", g: 38 }] },
  { id: 156, name: "Brie cheese",                  category: "Dairy",        gi: 0,  carbP100: 0.5,  fiberP100: 0.0, proteinP100: 21.0, fatP100: 28.0, portions: [{ label: "1 oz", g: 28 }] },
  { id: 157, name: "Cream cheese",                 category: "Dairy",        gi: 0,  carbP100: 2.7,  fiberP100: 0.0, proteinP100: 5.9,  fatP100: 35.0, portions: [{ label: "1 tbsp", g: 14 }, { label: "2 tbsp", g: 28 }] },
  { id: 158, name: "Sour cream",                   category: "Dairy",        gi: 0,  carbP100: 3.6,  fiberP100: 0.0, proteinP100: 2.4,  fatP100: 21.0, portions: [{ label: "2 tbsp", g: 29 }, { label: "¼ cup", g: 58 }] },
  // FLAGGED: duplicate entries conflicted on real values (protein/carb); kept this one
  // as a judgment call with no third source to arbitrate — verify against USDA if precision matters here.
  { id: 159, name: "Kefir (plain)",                category: "Dairy",        gi: 30, carbP100: 4.5,  fiberP100: 0.0, proteinP100: 4.0,  fatP100: 3.5,  portions: [{ label: "½ cup", g: 120 }, { label: "1 cup", g: 240 }] },
  { id: 160, name: "Ice cream (vanilla, full fat)", category: "Dairy",       gi: 51, carbP100: 23.0, fiberP100: 0.0, proteinP100: 3.5,  fatP100: 11.0, portions: [{ label: "½ cup", g: 66 }, { label: "1 cup", g: 132 }] },
  { id: 161, name: "Oat milk",                     category: "Dairy",        gi: 69, carbP100: 7.0,  fiberP100: 0.8, proteinP100: 1.0,  fatP100: 1.5,  portions: [{ label: "½ cup", g: 120 }, { label: "1 cup", g: 240 }] },
  { id: 162, name: "Almond milk (unsweetened)",    category: "Dairy",        gi: 25, carbP100: 0.5,  fiberP100: 0.3, proteinP100: 0.4,  fatP100: 1.1,  portions: [{ label: "½ cup", g: 120 }, { label: "1 cup", g: 240 }] },
  { id: 163, name: "Soy milk (unsweetened)",       category: "Dairy",        gi: 34, carbP100: 1.7,  fiberP100: 0.4, proteinP100: 3.3,  fatP100: 1.8,  portions: [{ label: "½ cup", g: 120 }, { label: "1 cup", g: 240 }] },
  { id: 164, name: "Whipped cream",                category: "Dairy",        gi: 0,  carbP100: 2.8,  fiberP100: 0.0, proteinP100: 1.5,  fatP100: 27.0, portions: [{ label: "2 tbsp", g: 15 }, { label: "¼ cup", g: 30 }] },
  { id: 165, name: "Ricotta (part-skim)",          category: "Dairy",        gi: 27, carbP100: 5.1,  fiberP100: 0.0, proteinP100: 11.0, fatP100: 7.9,  portions: [{ label: "¼ cup", g: 62 }, { label: "½ cup", g: 124 }] },

  // CATEGORY 7: NUTS & SEEDS (20 foods, IDs 166–185)
  { id: 166, name: "Almonds (raw)",                category: "Nuts & Seeds", gi: 0,  carbP100: 22.0, fiberP100: 12.5,proteinP100: 21.0, fatP100: 50.0, portions: [{ label: "1 oz (~23 nuts)", g: 28 }, { label: "¼ cup", g: 36 }] },
  { id: 167, name: "Walnuts",                      category: "Nuts & Seeds", gi: 15, carbP100: 14.0, fiberP100: 6.7, proteinP100: 15.0, fatP100: 65.0, portions: [{ label: "1 oz (~14 halves)", g: 28 }, { label: "¼ cup", g: 29 }] },
  { id: 168, name: "Chia seeds",                   category: "Nuts & Seeds", gi: 1,  carbP100: 42.0, fiberP100: 34.4,proteinP100: 17.0, fatP100: 31.0, portions: [{ label: "1 tbsp", g: 12 }, { label: "2 tbsp", g: 24 }] },
  { id: 169, name: "Flaxseed (ground)",            category: "Nuts & Seeds", gi: 15, carbP100: 29.0, fiberP100: 27.3,proteinP100: 18.0, fatP100: 42.0, portions: [{ label: "1 tbsp", g: 10 }, { label: "2 tbsp", g: 20 }] },
  { id: 170, name: "Pumpkin seeds",                category: "Nuts & Seeds", gi: 10, carbP100: 15.0, fiberP100: 3.9, proteinP100: 19.0, fatP100: 49.0, portions: [{ label: "1 oz", g: 28 }, { label: "¼ cup", g: 32 }] },
  { id: 171, name: "Sunflower seeds",              category: "Nuts & Seeds", gi: 35, carbP100: 20.0, fiberP100: 8.6, proteinP100: 21.0, fatP100: 51.0, portions: [{ label: "1 oz", g: 28 }, { label: "¼ cup", g: 35 }] },
  { id: 172, name: "Cashews",                      category: "Nuts & Seeds", gi: 22, carbP100: 30.0, fiberP100: 3.3, proteinP100: 18.0, fatP100: 44.0, portions: [{ label: "1 oz (~18 nuts)", g: 28 }, { label: "¼ cup", g: 32 }] },
  { id: 173, name: "Pecans",                       category: "Nuts & Seeds", gi: 10, carbP100: 14.0, fiberP100: 9.6, proteinP100: 9.0,  fatP100: 72.0, portions: [{ label: "1 oz (~20 halves)", g: 28 }, { label: "¼ cup", g: 27 }] },
  { id: 174, name: "Pistachios",                   category: "Nuts & Seeds", gi: 15, carbP100: 28.0, fiberP100: 10.6,proteinP100: 20.0, fatP100: 45.0, portions: [{ label: "1 oz (~49 nuts)", g: 28 }, { label: "¼ cup", g: 31 }] },
  { id: 175, name: "Macadamia nuts",               category: "Nuts & Seeds", gi: 10, carbP100: 14.0, fiberP100: 8.6, proteinP100: 8.0,  fatP100: 76.0, portions: [{ label: "1 oz (~11 nuts)", g: 28 }, { label: "¼ cup", g: 34 }] },
  { id: 176, name: "Brazil nuts",                  category: "Nuts & Seeds", gi: 0,  carbP100: 12.0, fiberP100: 7.5, proteinP100: 14.0, fatP100: 66.0, portions: [{ label: "1 oz (~6 nuts)", g: 28 }] },
  { id: 177, name: "Hazelnuts",                    category: "Nuts & Seeds", gi: 15, carbP100: 17.0, fiberP100: 9.7, proteinP100: 15.0, fatP100: 61.0, portions: [{ label: "1 oz (~21 nuts)", g: 28 }, { label: "¼ cup", g: 34 }] },
  { id: 178, name: "Hemp seeds",                   category: "Nuts & Seeds", gi: 15, carbP100: 8.7,  fiberP100: 4.0, proteinP100: 32.0, fatP100: 49.0, portions: [{ label: "1 tbsp", g: 10 }, { label: "3 tbsp", g: 30 }] },
  { id: 179, name: "Sesame seeds",                 category: "Nuts & Seeds", gi: 35, carbP100: 23.0, fiberP100: 11.8,proteinP100: 18.0, fatP100: 50.0, portions: [{ label: "1 tbsp", g: 9 }, { label: "2 tbsp", g: 18 }] },
  { id: 180, name: "Tahini (sesame paste)",        category: "Nuts & Seeds", gi: 40, carbP100: 21.0, fiberP100: 9.3, proteinP100: 17.0, fatP100: 54.0, portions: [{ label: "1 tbsp", g: 15 }, { label: "2 tbsp", g: 30 }] },
  { id: 181, name: "Pine nuts",                    category: "Nuts & Seeds", gi: 15, carbP100: 13.0, fiberP100: 3.7, proteinP100: 14.0, fatP100: 68.0, portions: [{ label: "1 oz", g: 28 }, { label: "2 tbsp", g: 17 }] },
  { id: 182, name: "Almond butter",                category: "Nuts & Seeds", gi: 0,  carbP100: 20.0, fiberP100: 10.5,proteinP100: 21.0, fatP100: 56.0, portions: [{ label: "1 tbsp", g: 16 }, { label: "2 tbsp", g: 32 }] },
  { id: 183, name: "Coconut flakes (unsweetened)", category: "Nuts & Seeds", gi: 45, carbP100: 15.0, fiberP100: 9.0, proteinP100: 3.3,  fatP100: 33.0, portions: [{ label: "2 tbsp", g: 14 }, { label: "¼ cup", g: 23 }] },
  { id: 184, name: "Poppy seeds",                  category: "Nuts & Seeds", gi: 35, carbP100: 28.0, fiberP100: 19.5,proteinP100: 18.0, fatP100: 42.0, portions: [{ label: "1 tbsp", g: 9 }] },
  { id: 185, name: "Mixed nuts (roasted, salted)", category: "Nuts & Seeds", gi: 15, carbP100: 22.0, fiberP100: 5.0, proteinP100: 10.0, fatP100: 34.0, portions: [{ label: "¼ cup", g: 36 }, { label: "½ cup", g: 72 }] },

  // CATEGORY 8: FATS & OILS (15 foods, IDs 186–200)
  { id: 186, name: "Olive oil (extra virgin)",     category: "Fats & Oils",  gi: 0,  carbP100: 0.0,  fiberP100: 0.0, proteinP100: 0.0,  fatP100: 100.0,portions: [{ label: "1 tsp", g: 5 }, { label: "1 tbsp", g: 14 }, { label: "2 tbsp", g: 28 }] },
  { id: 187, name: "Butter (unsalted)",            category: "Fats & Oils",  gi: 0,  carbP100: 0.1,  fiberP100: 0.0, proteinP100: 0.9,  fatP100: 81.0, portions: [{ label: "1 tsp", g: 5 }, { label: "1 tbsp", g: 14 }] },
  { id: 188, name: "Coconut oil",                  category: "Fats & Oils",  gi: 0,  carbP100: 0.0,  fiberP100: 0.0, proteinP100: 0.0,  fatP100: 100.0,portions: [{ label: "1 tsp", g: 5 }, { label: "1 tbsp", g: 14 }] },
  { id: 189, name: "Avocado oil",                  category: "Fats & Oils",  gi: 0,  carbP100: 0.0,  fiberP100: 0.0, proteinP100: 0.0,  fatP100: 100.0,portions: [{ label: "1 tsp", g: 5 }, { label: "1 tbsp", g: 14 }] },
  { id: 190, name: "Ghee (clarified butter)",      category: "Fats & Oils",  gi: 0,  carbP100: 0.0,  fiberP100: 0.0, proteinP100: 0.0,  fatP100: 100.0,portions: [{ label: "1 tsp", g: 5 }, { label: "1 tbsp", g: 14 }] },
  { id: 191, name: "Sesame oil",                   category: "Fats & Oils",  gi: 0,  carbP100: 0.0,  fiberP100: 0.0, proteinP100: 0.0,  fatP100: 100.0,portions: [{ label: "1 tsp", g: 5 }, { label: "1 tbsp", g: 14 }] },
  { id: 192, name: "Canola oil",                   category: "Fats & Oils",  gi: 0,  carbP100: 0.0,  fiberP100: 0.0, proteinP100: 0.0,  fatP100: 100.0,portions: [{ label: "1 tsp", g: 5 }, { label: "1 tbsp", g: 14 }] },
  { id: 193, name: "MCT oil",                      category: "Fats & Oils",  gi: 0,  carbP100: 0.0,  fiberP100: 0.0, proteinP100: 0.0,  fatP100: 100.0,portions: [{ label: "1 tsp", g: 5 }, { label: "1 tbsp", g: 14 }] },
  { id: 194, name: "Mayonnaise (regular)",         category: "Fats & Oils",  gi: 0,  carbP100: 0.6,  fiberP100: 0.0, proteinP100: 0.9,  fatP100: 79.0, portions: [{ label: "1 tbsp", g: 14 }] },
  { id: 195, name: "Vinaigrette dressing",         category: "Fats & Oils",  gi: 0,  carbP100: 3.0,  fiberP100: 0.0, proteinP100: 0.2,  fatP100: 12.0, portions: [{ label: "1 tbsp", g: 16 }, { label: "2 tbsp", g: 32 }] },
  { id: 196, name: "Ranch dressing",               category: "Fats & Oils",  gi: 0,  carbP100: 5.0,  fiberP100: 0.0, proteinP100: 0.9,  fatP100: 17.0, portions: [{ label: "2 tbsp", g: 30 }] },
  { id: 197, name: "Lard (pork fat)",              category: "Fats & Oils",  gi: 0,  carbP100: 0.0,  fiberP100: 0.0, proteinP100: 0.0,  fatP100: 100.0,portions: [{ label: "1 tbsp", g: 13 }] },
  { id: 198, name: "Beef tallow",                  category: "Fats & Oils",  gi: 0,  carbP100: 0.0,  fiberP100: 0.0, proteinP100: 0.0,  fatP100: 100.0,portions: [{ label: "1 tbsp", g: 13 }] },
  { id: 199, name: "Flaxseed oil",                 category: "Fats & Oils",  gi: 0,  carbP100: 0.0,  fiberP100: 0.0, proteinP100: 0.0,  fatP100: 100.0,portions: [{ label: "1 tsp", g: 5 }, { label: "1 tbsp", g: 14 }] },
  { id: 200, name: "Walnut oil",                   category: "Fats & Oils",  gi: 0,  carbP100: 0.0,  fiberP100: 0.0, proteinP100: 0.0,  fatP100: 100.0,portions: [{ label: "1 tsp", g: 5 }, { label: "1 tbsp", g: 14 }] },

  // CATEGORY 9: BEVERAGES (20 foods, IDs 201–220)
  { id: 201, name: "Orange juice (fresh squeezed)",category: "Beverages",    gi: 50, carbP100: 10.0, fiberP100: 0.2, proteinP100: 0.7,  fatP100: 0.2,  portions: [{ label: "4 oz", g: 124 }, { label: "8 oz", g: 248 }] },
  { id: 202, name: "Coca-Cola",                    category: "Beverages",    gi: 63, carbP100: 11.0, fiberP100: 0.0, proteinP100: 0.0,  fatP100: 0.0,  portions: [{ label: "8 oz", g: 237 }, { label: "12 oz can", g: 355 }] },
  { id: 203, name: "Apple juice (unsweetened)",    category: "Beverages",    gi: 44, carbP100: 12.0, fiberP100: 0.2, proteinP100: 0.1,  fatP100: 0.1,  portions: [{ label: "4 oz", g: 124 }, { label: "8 oz", g: 248 }] },
  { id: 204, name: "Green tea (unsweetened)",      category: "Beverages",    gi: 0,  carbP100: 0.3,  fiberP100: 0.0, proteinP100: 0.2,  fatP100: 0.0,  portions: [{ label: "8 oz", g: 240 }] },
  { id: 205, name: "Black coffee (unsweetened)",   category: "Beverages",    gi: 0,  carbP100: 0.0,  fiberP100: 0.0, proteinP100: 0.3,  fatP100: 0.0,  portions: [{ label: "8 oz", g: 240 }] },
  { id: 206, name: "Sports drink (Gatorade)",      category: "Beverages",    gi: 78, carbP100: 6.0,  fiberP100: 0.0, proteinP100: 0.0,  fatP100: 0.0,  portions: [{ label: "8 oz", g: 240 }, { label: "20 oz", g: 591 }] },
  { id: 207, name: "Grape juice (unsweetened)",    category: "Beverages",    gi: 52, carbP100: 14.0, fiberP100: 0.1, proteinP100: 0.5,  fatP100: 0.2,  portions: [{ label: "4 oz", g: 124 }, { label: "8 oz", g: 248 }] },
  { id: 208, name: "Tomato juice",                 category: "Beverages",    gi: 38, carbP100: 4.2,  fiberP100: 0.4, proteinP100: 0.9,  fatP100: 0.1,  portions: [{ label: "8 oz", g: 243 }] },
  { id: 209, name: "Kombucha",                     category: "Beverages",    gi: 0,  carbP100: 2.5,  fiberP100: 0.0, proteinP100: 0.0,  fatP100: 0.0,  portions: [{ label: "8 oz", g: 240 }, { label: "16 oz", g: 480 }] },
  { id: 210, name: "Lemonade (sweetened)",         category: "Beverages",    gi: 54, carbP100: 11.0, fiberP100: 0.1, proteinP100: 0.1,  fatP100: 0.1,  portions: [{ label: "8 oz", g: 240 }] },
  // FLAGGED: duplicate entries conflicted on real values (protein/carb); kept this one
  // as a judgment call with no third source to arbitrate — verify against USDA if precision matters here.
  { id: 211, name: "Coconut water",                category: "Beverages",    gi: 54, carbP100: 4.7,  fiberP100: 1.1, proteinP100: 0.7,  fatP100: 0.2,  portions: [{ label: "8 oz", g: 240 }, { label: "16 oz", g: 480 }] },
  { id: 212, name: "Diet soda (0 sugar)",          category: "Beverages",    gi: 0,  carbP100: 0.0,  fiberP100: 0.0, proteinP100: 0.0,  fatP100: 0.0,  portions: [{ label: "12 oz can", g: 355 }] },
  { id: 213, name: "Red wine",                     category: "Beverages",    gi: 0,  carbP100: 2.7,  fiberP100: 0.0, proteinP100: 0.1,  fatP100: 0.0,  portions: [{ label: "5 oz glass", g: 148 }] },
  { id: 214, name: "Beer (regular)",               category: "Beverages",    gi: 66, carbP100: 3.5,  fiberP100: 0.0, proteinP100: 0.5,  fatP100: 0.0,  portions: [{ label: "12 oz", g: 355 }] },
  { id: 215, name: "Pineapple juice",              category: "Beverages",    gi: 46, carbP100: 13.0, fiberP100: 0.2, proteinP100: 0.4,  fatP100: 0.1,  portions: [{ label: "4 oz", g: 124 }, { label: "8 oz", g: 248 }] },
  { id: 216, name: "Banana & berry smoothie",      category: "Beverages",    gi: 50, carbP100: 14.0, fiberP100: 1.5, proteinP100: 1.2,  fatP100: 0.4,  portions: [{ label: "8 oz", g: 240 }, { label: "16 oz", g: 480 }] },
  { id: 217, name: "Chocolate milk (2%)",          category: "Beverages",    gi: 34, carbP100: 11.0, fiberP100: 0.3, proteinP100: 3.4,  fatP100: 2.0,  portions: [{ label: "8 oz", g: 250 }] },
  { id: 218, name: "Bone broth",                   category: "Beverages",    gi: 0,  carbP100: 0.5,  fiberP100: 0.0, proteinP100: 6.0,  fatP100: 1.5,  portions: [{ label: "1 cup", g: 240 }] },
  { id: 219, name: "Herbal tea (unsweetened)",     category: "Beverages",    gi: 0,  carbP100: 0.2,  fiberP100: 0.0, proteinP100: 0.0,  fatP100: 0.0,  portions: [{ label: "8 oz", g: 240 }] },
  { id: 220, name: "Sparkling water",              category: "Beverages",    gi: 0,  carbP100: 0.0,  fiberP100: 0.0, proteinP100: 0.0,  fatP100: 0.0,  portions: [{ label: "8 oz", g: 240 }, { label: "12 oz", g: 355 }] },

  // CATEGORY 10: SNACKS & SWEETS (40 foods, IDs 221–260)
  { id: 221, name: "Dark chocolate (70%+)",        category: "Snacks & Sweets", gi: 23, carbP100: 46.0, fiberP100: 10.9,proteinP100: 7.8,  fatP100: 43.0, portions: [{ label: "½ oz (1 square)", g: 14 }, { label: "1 oz", g: 28 }] },
  { id: 222, name: "Milk chocolate",               category: "Snacks & Sweets", gi: 43, carbP100: 59.0, fiberP100: 1.7, proteinP100: 7.3,  fatP100: 30.0, portions: [{ label: "1 oz", g: 28 }] },
  { id: 223, name: "White sugar",                  category: "Snacks & Sweets", gi: 65, carbP100: 100.0,fiberP100: 0.0, proteinP100: 0.0,  fatP100: 0.0,  portions: [{ label: "1 tsp", g: 4 }, { label: "1 tbsp", g: 12 }] },
  { id: 224, name: "Honey",                        category: "Snacks & Sweets", gi: 61, carbP100: 82.0, fiberP100: 0.2, proteinP100: 0.3,  fatP100: 0.0,  portions: [{ label: "1 tsp", g: 7 }, { label: "1 tbsp", g: 21 }] },
  { id: 225, name: "Maple syrup (pure)",           category: "Snacks & Sweets", gi: 54, carbP100: 67.0, fiberP100: 0.0, proteinP100: 0.0,  fatP100: 0.1,  portions: [{ label: "1 tbsp", g: 20 }, { label: "2 tbsp", g: 40 }] },
  { id: 226, name: "Agave nectar",                 category: "Snacks & Sweets", gi: 11, carbP100: 76.0, fiberP100: 0.0, proteinP100: 0.1,  fatP100: 0.5,  portions: [{ label: "1 tsp", g: 7 }, { label: "1 tbsp", g: 21 }] },
  { id: 227, name: "Potato chips",                 category: "Snacks & Sweets", gi: 56, carbP100: 52.0, fiberP100: 4.4, proteinP100: 7.0,  fatP100: 35.0, portions: [{ label: "1 oz (~15 chips)", g: 28 }] },
  { id: 228, name: "Pretzels",                     category: "Snacks & Sweets", gi: 83, carbP100: 79.0, fiberP100: 2.6, proteinP100: 9.0,  fatP100: 3.6,  portions: [{ label: "1 oz", g: 28 }, { label: "½ cup", g: 60 }] },
  { id: 229, name: "Corn chips (Fritos)",          category: "Snacks & Sweets", gi: 72, carbP100: 56.0, fiberP100: 4.7, proteinP100: 7.0,  fatP100: 32.0, portions: [{ label: "1 oz", g: 28 }] },
  { id: 230, name: "Graham crackers",              category: "Snacks & Sweets", gi: 74, carbP100: 75.0, fiberP100: 2.8, proteinP100: 8.7,  fatP100: 9.6,  portions: [{ label: "2 crackers", g: 28 }] },
  { id: 231, name: "Saltine crackers",             category: "Snacks & Sweets", gi: 74, carbP100: 74.0, fiberP100: 2.2, proteinP100: 10.0, fatP100: 8.6,  portions: [{ label: "5 crackers", g: 15 }, { label: "10 crackers", g: 30 }] },
  { id: 232, name: "Whole grain crackers",         category: "Snacks & Sweets", gi: 67, carbP100: 67.0, fiberP100: 7.1, proteinP100: 10.0, fatP100: 12.0, portions: [{ label: "5 crackers", g: 28 }] },
  { id: 234, name: "Granola bar (oat-based)",      category: "Snacks & Sweets", gi: 61, carbP100: 64.0, fiberP100: 3.6, proteinP100: 7.7,  fatP100: 14.0, portions: [{ label: "1 bar", g: 47 }] },
  { id: 235, name: "Protein bar (typical)",        category: "Snacks & Sweets", gi: 50, carbP100: 38.0, fiberP100: 5.0, proteinP100: 20.0, fatP100: 10.0, portions: [{ label: "1 bar", g: 60 }] },
  { id: 236, name: "Donut (glazed)",               category: "Snacks & Sweets", gi: 76, carbP100: 53.0, fiberP100: 1.2, proteinP100: 6.3,  fatP100: 20.0, portions: [{ label: "1 medium", g: 60 }] },
  { id: 237, name: "Jelly beans",                  category: "Snacks & Sweets", gi: 80, carbP100: 93.0, fiberP100: 0.0, proteinP100: 0.0,  fatP100: 0.1,  portions: [{ label: "10 beans", g: 28 }] },
  { id: 238, name: "Gummy bears",                  category: "Snacks & Sweets", gi: 78, carbP100: 77.0, fiberP100: 0.0, proteinP100: 6.8,  fatP100: 0.1,  portions: [{ label: "10 pieces", g: 34 }] },
  { id: 239, name: "Chocolate chip cookie",        category: "Snacks & Sweets", gi: 55, carbP100: 64.0, fiberP100: 1.7, proteinP100: 5.4,  fatP100: 23.0, portions: [{ label: "1 medium", g: 16 }, { label: "2 cookies", g: 32 }] },
  { id: 240, name: "Brownie",                      category: "Snacks & Sweets", gi: 43, carbP100: 60.0, fiberP100: 1.8, proteinP100: 5.3,  fatP100: 20.0, portions: [{ label: "1 piece (2in sq)", g: 56 }] },
  { id: 241, name: "Blueberry muffin",             category: "Snacks & Sweets", gi: 59, carbP100: 54.0, fiberP100: 1.3, proteinP100: 6.0,  fatP100: 12.0, portions: [{ label: "1 large muffin", g: 113 }] },
  { id: 242, name: "Pancakes (plain)",             category: "Snacks & Sweets", gi: 67, carbP100: 40.0, fiberP100: 1.3, proteinP100: 5.5,  fatP100: 5.0,  portions: [{ label: "1 medium (4in)", g: 38 }, { label: "2 pancakes", g: 76 }] },
  { id: 243, name: "Waffles (plain)",              category: "Snacks & Sweets", gi: 76, carbP100: 38.0, fiberP100: 0.8, proteinP100: 7.9,  fatP100: 9.0,  portions: [{ label: "1 waffle", g: 75 }] },
  { id: 244, name: "French fries",                 category: "Snacks & Sweets", gi: 63, carbP100: 36.0, fiberP100: 3.4, proteinP100: 3.6,  fatP100: 14.0, portions: [{ label: "Small (2.5oz)", g: 71 }, { label: "Medium (4oz)", g: 113 }] },
  { id: 245, name: "Tortilla chips",               category: "Snacks & Sweets", gi: 63, carbP100: 65.0, fiberP100: 4.4, proteinP100: 7.8,  fatP100: 22.0, portions: [{ label: "1 oz (~12 chips)", g: 28 }] },
  { id: 246, name: "Croissant",                    category: "Snacks & Sweets", gi: 67, carbP100: 46.0, fiberP100: 1.8, proteinP100: 8.2,  fatP100: 21.0, portions: [{ label: "1 medium", g: 57 }] },
  { id: 247, name: "Dates (dried)",                category: "Snacks & Sweets", gi: 42, carbP100: 75.0, fiberP100: 8.0, proteinP100: 2.5,  fatP100: 0.4,  portions: [{ label: "2 dates", g: 24 }, { label: "4 dates", g: 48 }] },
  { id: 248, name: "Dried apricots",               category: "Snacks & Sweets", gi: 30, carbP100: 63.0, fiberP100: 7.3, proteinP100: 3.4,  fatP100: 0.5,  portions: [{ label: "¼ cup", g: 33 }, { label: "½ cup", g: 65 }] },
  { id: 249, name: "Raisins",                      category: "Snacks & Sweets", gi: 64, carbP100: 79.0, fiberP100: 3.7, proteinP100: 3.1,  fatP100: 0.5,  portions: [{ label: "¼ cup", g: 36 }, { label: "½ cup", g: 72 }] },
  { id: 250, name: "Peanut butter cups",           category: "Snacks & Sweets", gi: 46, carbP100: 60.0, fiberP100: 1.8, proteinP100: 9.1,  fatP100: 30.0, portions: [{ label: "2 standard cups", g: 42 }] },
  { id: 251, name: "Popcorn (buttered)",           category: "Snacks & Sweets", gi: 65, carbP100: 60.0, fiberP100: 7.2, proteinP100: 8.3,  fatP100: 22.0, portions: [{ label: "1 cup", g: 11 }, { label: "3 cups", g: 33 }] },
  { id: 252, name: "Granola (plain)",              category: "Snacks & Sweets", gi: 62, carbP100: 66.0, fiberP100: 5.3, proteinP100: 10.0, fatP100: 15.0, portions: [{ label: "¼ cup", g: 30 }, { label: "½ cup", g: 61 }] },
  { id: 253, name: "Rice crackers",                category: "Snacks & Sweets", gi: 91, carbP100: 82.0, fiberP100: 1.6, proteinP100: 7.8,  fatP100: 1.5,  portions: [{ label: "5 crackers", g: 15 }, { label: "10 crackers", g: 30 }] },
  { id: 255, name: "Chocolate-covered almonds",    category: "Snacks & Sweets", gi: 20, carbP100: 38.0, fiberP100: 6.0, proteinP100: 12.0, fatP100: 43.0, portions: [{ label: "1 oz", g: 28 }, { label: "¼ cup", g: 40 }] },
  { id: 256, name: "Pita chips",                   category: "Snacks & Sweets", gi: 68, carbP100: 65.0, fiberP100: 3.4, proteinP100: 9.5,  fatP100: 16.0, portions: [{ label: "1 oz (~11 chips)", g: 28 }] },
  { id: 257, name: "Energy bar (Clif Bar)",        category: "Snacks & Sweets", gi: 57, carbP100: 64.0, fiberP100: 5.5, proteinP100: 10.0, fatP100: 7.0,  portions: [{ label: "1 bar", g: 68 }] },
  { id: 258, name: "Fruit leather / rollup",       category: "Snacks & Sweets", gi: 70, carbP100: 84.0, fiberP100: 0.5, proteinP100: 0.5,  fatP100: 0.5,  portions: [{ label: "1 strip", g: 21 }] },
  { id: 259, name: "Bagel chips",                  category: "Snacks & Sweets", gi: 72, carbP100: 72.0, fiberP100: 2.9, proteinP100: 11.0, fatP100: 9.0,  portions: [{ label: "1 oz", g: 28 }] },
  { id: 260, name: "Kettle corn",                  category: "Snacks & Sweets", gi: 65, carbP100: 68.0, fiberP100: 5.0, proteinP100: 8.0,  fatP100: 16.0, portions: [{ label: "1 cup", g: 11 }, { label: "3 cups", g: 33 }] },

  // Beverages (expanding to 30)
  { id: 270, name: "Kombucha (original)",          category: "Beverages",       gi: 25, carbP100: 7.0,  fiberP100: 0.0, proteinP100: 0.3,  fatP100: 0.0,  portions: [{ label: "8 oz", g: 240 }, { label: "1 bottle (16 oz)", g: 480 }] },

  // Fats & Oils (expanding to 25)
  { id: 272, name: "Ghee",                         category: "Fats & Oils",     gi: 0,  carbP100: 0.0,  fiberP100: 0.0, proteinP100: 0.1,  fatP100: 99.5, portions: [{ label: "1 tsp", g: 5 }, { label: "1 tbsp", g: 14 }] },
  { id: 276, name: "Sour cream (full fat)",        category: "Fats & Oils",     gi: 0,  carbP100: 4.3,  fiberP100: 0.0, proteinP100: 2.1,  fatP100: 20.0, portions: [{ label: "1 tbsp", g: 12 }, { label: "¼ cup", g: 60 }] },
  { id: 277, name: "Heavy cream",                  category: "Fats & Oils",     gi: 0,  carbP100: 2.8,  fiberP100: 0.0, proteinP100: 2.0,  fatP100: 36.0, portions: [{ label: "1 tbsp", g: 15 }, { label: "2 tbsp", g: 30 }] },
  { id: 278, name: "Tahini",                       category: "Fats & Oils",     gi: 35, carbP100: 21.0, fiberP100: 9.3, proteinP100: 17.0, fatP100: 53.0, portions: [{ label: "1 tbsp", g: 15 }, { label: "2 tbsp", g: 30 }] },

  // Dairy (expanding to 30)
  { id: 285, name: "String cheese",                category: "Dairy",           gi: 0,  carbP100: 2.4,  fiberP100: 0.0, proteinP100: 8.0,  fatP100: 6.0,  portions: [{ label: "1 stick", g: 28 }] },

  // Grains additions
  { id: 292, name: "English muffin (whole wheat)", category: "Grains",          gi: 45, carbP100: 36.0, fiberP100: 4.4, proteinP100: 7.5,  fatP100: 1.5,  portions: [{ label: "1 muffin", g: 57 }] },
  { id: 293, name: "Pita bread (white)",           category: "Grains",          gi: 57, carbP100: 55.0, fiberP100: 2.2, proteinP100: 9.0,  fatP100: 1.7,  portions: [{ label: "½ pita (4in)", g: 28 }, { label: "1 pita (6in)", g: 60 }] },
  { id: 294, name: "Rice noodles (cooked)",        category: "Grains",          gi: 61, carbP100: 22.0, fiberP100: 1.8, proteinP100: 1.8,  fatP100: 0.2,  portions: [{ label: "½ cup", g: 88 }, { label: "1 cup", g: 176 }] },
  { id: 295, name: "Soba noodles (cooked)",        category: "Grains",          gi: 46, carbP100: 21.0, fiberP100: 2.0, proteinP100: 5.1,  fatP100: 0.1,  portions: [{ label: "½ cup", g: 85 }, { label: "1 cup", g: 170 }] },

  // Vegetable additions
  { id: 298, name: "Cabbage (raw)",                category: "Vegetables",      gi: 10, carbP100: 5.8,  fiberP100: 2.5, proteinP100: 1.3,  fatP100: 0.1,  portions: [{ label: "1 cup shredded", g: 89 }, { label: "2 cups", g: 178 }] },


//Supplements
{ id: 301, name: "Spirulina tablets (Sunlit Best Organics)", 
  category: "Supplements", gi: 0, 
  carbP100: 10.0, fiberP100: 10.0, proteinP100: 66.7, fatP100: 0.0, 
  portions: [
    { label: "12 tablets (3g)", g: 3 }, 
    { label: "24 tablets (6g)", g: 6 }
  ] },

{ id: 302, name: "Chlorella tablets (Sunlit Best Organics)", 
  category: "Supplements", gi: 0, 
  carbP100: 10.0, fiberP100: 10.0, proteinP100: 66.7, fatP100: 0.0, 
  portions: [
    { label: "12 tablets (3g)", g: 3 }, 
    { label: "24 tablets (6g)", g: 6 }
  ] },

{ id: 303, name: "Premier Protein shake (estimated GI)", 
  category: "Supplements", gi: 25, 
  carbP100: 0.9, fiberP100: 0.0, proteinP100: 9.2, fatP100: 0.9, 
  portions: [{ label: "1 shake (11 fl oz)", g: 325 }] },

{ id: 304, name: "Publix Dark Chocolate Almonds (estimated GI)", 
  category: "Snacks & Sweets", gi: 20, 
  carbP100: 50.0, fiberP100: 6.7, proteinP100: 10.0, fatP100: 36.7, 
  portions: [{ label: "8 pieces (1 serving)", g: 30 }, { label: "16 pieces", g: 60 }] },

{ id: 305, name: "Vitaminwater PwrC Dragonfruit (estimated GI)", 
  category: "Beverages", gi: 55, 
  carbP100: 4.6, fiberP100: 0.0, proteinP100: 0.0, fatP100: 0.0, 
  portions: [{ label: "1 bottle (20 fl oz)", g: 591 }, { label: "½ bottle", g: 296 }] },

{ id: 306, name: "Perfect Amino Powder (estimated GI)", 
  category: "Supplements", gi: 0, 
  carbP100: 0.0, fiberP100: 0.0, proteinP100: 76.6, fatP100: 0.0, 
  portions: [{ label: "1 scoop (6.53g)", g: 6.53 }, { label: "2 scoops", g: 13 }] },

{ id: 307, name: "Water", 
  category: "Beverages", gi: 0, 
  carbP100: 0.0, fiberP100: 0.0, proteinP100: 0.0, fatP100: 0.0, 
  portions: [
    { label: "8 oz (1 cup)", g: 240 },
    { label: "12 oz", g: 355 },
    { label: "16 oz", g: 480 },
    { label: "20 oz", g: 591 },
  ] },

{ id: 308, name: "Chick-fil-A Grilled Filet",
  category: "Protein", gi: 0,
  carbP100: 10.9, fiberP100: 0.0, proteinP100: 21.8, fatP100: 10.9,
  portions: [{ label: "1 filet (approx 110g)", g: 110 }] },

{ id: 309, name: "Chick-fil-A Waffle Potato Fries - Medium (estimated GI)",
  category: "Snacks & Sweets", gi: 63,
  carbP100: 36.0, fiberP100: 4.0, proteinP100: 4.0, fatP100: 19.2,
  portions: [
    { label: "Medium serving", g: 125 },
    { label: "Small serving", g: 85 },
    { label: "Large serving", g: 170 },
  ] },

// Buttery Biscuit — official Chick-fil-A item, weight independently confirmed at 81g
{ id: 310, name: "Chick-fil-A Buttery Biscuit (estimated GI)", category: "Grains",
  gi: 72, carbP100: 45.7, fiberP100: 2.5, proteinP100: 4.9, fatP100: 18.5,
  portions: [{ label: "1 biscuit", g: 81 }] },

// Weight = verified 81g biscuit + 1 USDA large egg (50g). Macros as given, high confidence.
{ id: 311, name: "Chick-fil-A Egg Biscuit, 1 egg (estimated GI)", category: "Grains",
  gi: 70, carbP100: 28.2, fiberP100: 1.5, proteinP100: 6.9, fatP100: 14.9,
  portions: [{ label: "1 biscuit", g: 131 }] },

// Weight = verified 81g biscuit + 2 USDA large eggs (100g).
{ id: 312, name: "Chick-fil-A Egg Biscuit, 2 egg (estimated GI)", category: "Grains",
  gi: 70, carbP100: 20.4, fiberP100: 1.1, proteinP100: 7.7, fatP100: 13.3,
  portions: [{ label: "1 biscuit", g: 181 }] },

// Macros and weight (893g) both confirmed directly from Chick-fil-A's official site.
// Only the GI value below remains an estimate — sweetened tea isn't lab-tested for GI;
// treated as comparable to a sugar-sweetened soda (~60-65 range), not sourced.

{ id: 313, name: "Chick-fil-A Sweetened Iced Tea, Large (estimated GI)", category: "Beverages",
  gi: 65, carbP100: 4.9, fiberP100: 0.0, proteinP100: 0.0, fatP100: 0.0,
  portions: [{ label: "1 large (32 oz)", g: 893 }] },

// Macros: per-100g values derived from USDA FoodData Central general apple data,
// consistent across multiple sources. Honeycrisp-specific USDA FDC entry not directly
// confirmed this session — treat macros at ~80% confidence, not primary-source verified.
// GI: 38, pooled mean from Atkinson et al. 2021 International GI Tables (raw apples),
// recalled from prior session — ~85% confidence. Perplexity's "36" cited a secondary
// aggregator, not a primary source; 38 is traceable to peer-reviewed pooled data.
// Fiber: Perplexity's 5g/serving implies 2.7g/100g; USDA general apple data suggests
// 2.4g/100g. I used 2.4 — closer to what the primary source supports.

{ id: 314, name: "Honeycrisp Apple", category: "Fruits",
  gi: 38, carbP100: 13.8, fiberP100: 2.4, proteinP100: 0.3, fatP100: 0.1,
  portions: [{ label: "1 medium (with skin)", g: 182 }] },

// Homemade Beef Chili — recipe: 1lb 80/20 ground beef (cooked/drained),
// 1 can (16oz) dark red kidney beans (drained), 1 can (16oz) plain tomato sauce,
// chili seasoning blend. Serves 4 (~265g/serving).
// GI: weighted average by carb contribution (kidney beans GI 24 per Atkinson 2021,
// tomato sauce GI 31 per USDA FoodStruct). Macros USDA-sourced this session.
// Adjust serving portion below to match your actual bowl size.

{ id: 315, name: "Homemade Beef & Bean Chili (1 bowl, ~265g)", category: "Protein",
  gi: 26, carbP100: 7.7, fiberP100: 2.2, proteinP100: 10.8, fatP100: 6.2,
  portions: [
    { label: "1 bowl / 4-serving recipe", g: 265 },
    { label: "1 bowl / 6-serving recipe", g: 176 },
    { label: "Large bowl (2 cups)", g: 480 },
  ] },

{ id: 316, name: "Publix Deli Fried Chicken Tenders (estimated GI)", category: "Protein", gi: 52, carbP100: 13.2, fiberP100: 1.3, proteinP100: 24.7, fatP100: 10.8, portions: [{ label: "4 chicken tenders", g: 454 }] },

{ id: 317, name: "Publix French Hamburger Rolls", category: "Grains", gi: 73, carbP100: 50.8, fiberP100: 1.6, proteinP100: 9.5, fatP100: 2.4, portions: [{ label: "1 roll", g: 63 }] },

{ id: 318, name: "Heinz Original BBQ Sauce (estimated GI)", category: "Snacks & Sweets", gi: 60, carbP100: 68.0, fiberP100: 0.0, proteinP100: 0.0, fatP100: 0.0, portions: [{ label: "1 tbsp", g: 18 }, { label: "2 tbsp", g: 36 }, { label: "1 oz cup", g: 30 }] },

{ id: 319, name: "Chick-fil-A Breakfast Filet (estimated GI)", category: "Protein", gi: 52, carbP100: 11.3, fiberP100: 0.0, proteinP100: 21.1, fatP100: 11.3, portions: [{ label: "1 breakfast filet", g: 71 }] },

{ id: 320, name: "Olé Xtreme Wellness High Fiber Carb Friendly Tortilla wraps (estimated GI)", category: "Grains", gi: 25, carbP100: 35.6, fiberP100: 26.7, proteinP100: 8.9, fatP100: 3.3, portions: [{ label: "1 tortilla", g: 45 }] },

{ id: 321, name: "Publix Ground Chuck Hamburger Patty", category: "Protein", gi: 0, carbP100: 0.0, fiberP100: 0.0, proteinP100: 15.5, fatP100: 18.0, portions: [{ label: "1 hamburger patty", g: 122 }] },

{ id: 322, name: "Baby Carrots", category: "Vegetables", gi: 35, carbP100: 8.2, fiberP100: 3.5, proteinP100: 1.2, fatP100: 0.0, portions: [{ label: "13 baby carrots", g: 85 }, { label: "1 baby carrot", g: 6.5 }] },

{ id: 323, name: "Barbacoa", category: "Protein", gi: 0, giSource: "estimated", carbP100: 1.8, fiberP100: 0.9, proteinP100: 21.2, fatP100: 6.2, portions: [{ label: "4 oz", g: 113 }, { label: "double", g: 227 }] },
  { id: 324, name: "Chicken (Chipotle)", category: "Protein", gi: 0, giSource: "estimated", carbP100: 0.0, fiberP100: 0.0, proteinP100: 28.2, fatP100: 6.2, portions: [{ label: "4 oz", g: 113 }, { label: "double", g: 227 }] },
  { id: 325, name: "Carnitas", category: "Protein", gi: 0, giSource: "estimated", carbP100: 0.0, fiberP100: 0.0, proteinP100: 20.3, fatP100: 10.6, portions: [{ label: "4 oz", g: 113 }, { label: "double", g: 227 }] },
  { id: 326, name: "Steak (Chipotle)", category: "Protein", gi: 0, giSource: "estimated", carbP100: 0.9, fiberP100: 0.9, proteinP100: 18.5, fatP100: 5.3, portions: [{ label: "4 oz", g: 113 }, { label: "double", g: 227 }] },
  { id: 327, name: "Sofritas", category: "Protein", gi: 15, giSource: "estimated", carbP100: 7.9, fiberP100: 2.6, proteinP100: 7.1, fatP100: 8.8, portions: [{ label: "4 oz", g: 113 }, { label: "double", g: 227 }] },
  { id: 328, name: "Cilantro-Lime Brown Rice (Chipotle)", category: "Grains", gi: 50, giSource: "estimated", carbP100: 31.7, fiberP100: 1.8, proteinP100: 3.5, fatP100: 5.3, portions: [{ label: "4 oz", g: 113 }, { label: "double", g: 227 }] },
  { id: 329, name: "Cilantro-Lime White Rice (Chipotle)", category: "Grains", gi: 65, giSource: "estimated", carbP100: 35.3, fiberP100: 0.9, proteinP100: 3.5, fatP100: 3.5, portions: [{ label: "4 oz", g: 113 }, { label: "double", g: 227 }] },
  { id: 330, name: "Black Beans (Chipotle)", category: "Legumes", gi: 30, giSource: "estimated", carbP100: 19.4, fiberP100: 6.2, proteinP100: 7.1, fatP100: 1.3, portions: [{ label: "4 oz", g: 113 }, { label: "double", g: 227 }] },
  { id: 331, name: "Pinto Beans (Chipotle)", category: "Legumes", gi: 39, giSource: "estimated", carbP100: 18.5, fiberP100: 7.1, proteinP100: 7.1, fatP100: 1.3, portions: [{ label: "4 oz", g: 113 }, { label: "double", g: 227 }] },
  { id: 332, name: "Fajita Vegetables (Chipotle)", category: "Vegetables", gi: 15, giSource: "estimated", carbP100: 8.8, fiberP100: 1.8, proteinP100: 1.8, fatP100: 0.0, portions: [{ label: "2 oz", g: 57 }, { label: "double", g: 113 }] },
  { id: 333, name: "Fresh Tomato Salsa (Chipotle)", category: "Condiments", gi: 15, giSource: "estimated", carbP100: 3.5, fiberP100: 0.9, proteinP100: 0.0, fatP100: 0.0, portions: [{ label: "4 oz", g: 113 }, { label: "double", g: 227 }] },
  { id: 334, name: "Roasted Chili-Corn Salsa (Chipotle)", category: "Condiments", gi: 45, giSource: "estimated", carbP100: 14.1, fiberP100: 2.6, proteinP100: 2.6, fatP100: 1.3, portions: [{ label: "4 oz", g: 113 }, { label: "double", g: 227 }] },
  { id: 335, name: "Tomatillo-Green Chili Salsa (Chipotle)", category: "Condiments", gi: 15, giSource: "estimated", carbP100: 7.1, fiberP100: 0.0, proteinP100: 0.0, fatP100: 0.0, portions: [{ label: "2 fl oz", g: 57 }, { label: "double", g: 113 }] },
  { id: 336, name: "Tomatillo-Red Chili Salsa (Chipotle)", category: "Condiments", gi: 15, giSource: "estimated", carbP100: 7.1, fiberP100: 1.8, proteinP100: 0.0, fatP100: 0.0, portions: [{ label: "2 fl oz", g: 57 }, { label: "double", g: 113 }] },
  { id: 337, name: "Cheese (Chipotle shredded)", category: "Dairy", gi: 0, giSource: "estimated", carbP100: 3.5, fiberP100: 0.0, proteinP100: 21.2, fatP100: 28.3, portions: [{ label: "1 oz", g: 28 }, { label: "double", g: 57 }] },
  { id: 338, name: "Sour Cream (Chipotle)", category: "Dairy", gi: 0, giSource: "estimated", carbP100: 3.5, fiberP100: 0.0, proteinP100: 3.5, fatP100: 15.9, portions: [{ label: "2 oz", g: 57 }, { label: "double", g: 113 }] },
  { id: 339, name: "Guacamole (Chipotle)", category: "Fats", gi: 15, giSource: "estimated", carbP100: 7.1, fiberP100: 5.3, proteinP100: 1.8, fatP100: 19.4, portions: [{ label: "4 oz", g: 113 }, { label: "double", g: 227 }] },
  { id: 340, name: "Queso Blanco (Chipotle side)", category: "Dairy", gi: 0, giSource: "estimated", carbP100: 6.2, fiberP100: 0.0, proteinP100: 8.8, fatP100: 15.9, portions: [{ label: "4 oz", g: 113 }, { label: "double", g: 227 }] },
  { id: 341, name: "Supergreens Salad Mix (Chipotle)", category: "Vegetables", gi: 10, giSource: "estimated", carbP100: 3.5, fiberP100: 2.4, proteinP100: 1.2, fatP100: 0.0, portions: [{ label: "3 oz", g: 85 }, { label: "double", g: 170 }] },
  { id: 342, name: "Romaine Lettuce (Chipotle)", category: "Vegetables", gi: 10, giSource: "estimated", carbP100: 3.5, fiberP100: 3.5, proteinP100: 0.0, fatP100: 0.0, portions: [{ label: "1 oz", g: 28 }, { label: "double", g: 57 }] },
  { id: 343, name: "Flour Tortilla - burrito (Chipotle)", category: "Grains", gi: 30, giSource: "estimated", carbP100: 49.5, fiberP100: 3.0, proteinP100: 7.9, fatP100: 8.9, portions: [{ label: "1 tortilla", g: 101 }, { label: "double", g: 202 }] },
  { id: 344, name: "Flour Tortilla - taco (Chipotle)", category: "Grains", gi: 30, giSource: "estimated", carbP100: 50.0, fiberP100: 1.9, proteinP100: 7.7, fatP100: 9.6, portions: [{ label: "1 tortilla", g: 26 }, { label: "double", g: 52 }] },
  { id: 345, name: "Crispy Corn Tortilla (Chipotle)", category: "Grains", gi: 52, giSource: "estimated", carbP100: 41.7, fiberP100: 4.2, proteinP100: 4.2, fatP100: 12.5, portions: [{ label: "1 tortilla", g: 24 }, { label: "double", g: 48 }] },
  { id: 346, name: "Tortilla Chips (Chipotle)", category: "Grains", gi: 63, giSource: "estimated", carbP100: 64.4, fiberP100: 6.2, proteinP100: 6.2, fatP100: 22.0, portions: [{ label: "4 oz", g: 113 }, { label: "double", g: 227 }] },
  { id: 347, name: "Chipotle-Honey Vinaigrette", category: "Condiments", gi: 35, giSource: "estimated", carbP100: 31.7, fiberP100: 1.8, proteinP100: 1.8, fatP100: 28.2, portions: [{ label: "2 fl oz", g: 57 }, { label: "double", g: 113 }] },
  { id: 348, name: "Organic Milk (Chipotle)", category: "Dairy", gi: 30, giSource: "estimated", carbP100: 5.3, fiberP100: 0.0, proteinP100: 3.5, fatP100: 1.1, portions: [{ label: "8 fl oz", g: 227 }, { label: "double", g: 454 }] },
  { id: 349, name: "Organic Chocolate Milk (Chipotle)", category: "Dairy", gi: 34, giSource: "estimated", carbP100: 10.6, fiberP100: 0.4, proteinP100: 4.0, fatP100: 1.3, portions: [{ label: "8 fl oz", g: 227 }, { label: "double", g: 454 }] },
  { id: 350, name: "Organic Apple Juice (Chipotle)", category: "Beverages", gi: 41, giSource: "estimated", carbP100: 13.1, fiberP100: 0.0, proteinP100: 0.0, fatP100: 0.0, portions: [{ label: "6.75 fl oz", g: 191 }, { label: "double", g: 383 }] },

{ id: 351, name: "Safe Catch Wild Ahi Yellowfin Tuna", category: "Protein", gi: 0, carbP100: 0.0, fiberP100: 0.0, proteinP100: 30.6, fatP100: 0.6, portions: [{ label: "3 oz", g: 85 }, { label: "1 can", g: 128 }] },
];

export const CATEGORIES = [...new Set(FOOD_DB.map(f => f.category))];

// Small stemmer — strips common plural suffixes so "biscuits" matches
// "Biscuit" and similar. This is deliberately narrow (English plural
// suffixes only); it is not a general fuzzy-match or spelling-correction
// layer, which would be a much bigger, less predictable feature.
export function normalizeWord(w) {
  if (w.endsWith('ies') && w.length > 4) return w.slice(0, -3) + 'y'; // berries -> berry
  if (w.endsWith('es') && w.length > 3 && /(?:[sxz]|[cs]h)$/.test(w.slice(0, -2))) return w.slice(0, -2); // boxes -> box
  if (w.endsWith('s') && !w.endsWith('ss') && w.length > 3) return w.slice(0, -1); // oats -> oat
  return w;
}

/**
 * Check whether a single name plausibly matches a query, using the same
 * tokenized + plural-stemmed logic as searchFoods. Exported so other
 * sources (e.g. Open Food Facts results) can filter by actual relevance
 * to the query instead of trusting an external ranking — OFF's legacy
 * search endpoint matches on fields beyond the product name and can
 * return results with no visible connection to what was typed.
 */
export function isRelevantMatch(name, query) {
  if (!name || !query) return false;
  const nameLower = name.toLowerCase();
  const q = query.toLowerCase().trim();
  const qNorm = normalizeWord(q);

  if (nameLower.includes(q)) return true;

  const nameWords = nameLower.replace(/[^\w\s]/g, ' ').split(/\s+/).map(normalizeWord).filter(w => w.length >= 3);
  return nameWords.some(w =>
    w === qNorm ||
    w.startsWith(qNorm) ||               // name word is longer (e.g. name "oatmealish" vs query "oat")
    (qNorm.length >= 3 && qNorm.startsWith(w)) // query is longer (e.g. query "oatmeal" vs name word "oat")
  );
}

export function searchFoods(query) {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase().trim();
  const qNorm = normalizeWord(q);

  return FOOD_DB
    .filter(f => {
      const nameLower = f.name.toLowerCase();

      // Fast path — preserves all matches the old exact-substring check found
      if (nameLower.includes(q)) return true;

      // Tokenized fallback — catches plural/singular mismatches generically
      // (e.g. "biscuits" typed in full vs. "Biscuit" stored singular)
      const nameWords = nameLower.replace(/[^\w\s]/g, ' ').split(/\s+/).map(normalizeWord);
      if (nameWords.some(w => w === qNorm || w.startsWith(qNorm))) return true;

      // Explicit aliases — for genuine synonyms no stemming rule can catch
      // (e.g. "oatmeal" typed in full vs. "Rolled oats" stored). Opt-in per
      // entry; add sparingly as real misses are noticed, not preemptively.
      if (f.aliases && f.aliases.some(a => a.toLowerCase().includes(q))) return true;

      return false;
    })
    .sort((a, b) => {
      const aStart = a.name.toLowerCase().startsWith(q) ? 0 : 1;
      const bStart = b.name.toLowerCase().startsWith(q) ? 0 : 1;
      return aStart - bStart || a.name.localeCompare(b.name);
    })
    .slice(0, 10);
}

export function getFoodById(id) {
  return FOOD_DB.find(f => f.id === id);
}

export function calcGL(food, grams) {
  const carbs = (food.carbP100 / 100) * grams;
  return (food.gi * carbs) / 100;
}

export function calcFiber(food, grams) {
  return (food.fiberP100 / 100) * grams;
}

export function calcCarbs(food, grams) {
  return (food.carbP100 / 100) * grams;
}

export function calcProtein(food, grams) {
  return (food.proteinP100 / 100) * grams;
}

export function calcFat(food, grams) {
  return (food.fatP100 / 100) * grams;
}

export function getMealScore(items) {
  if (!items.length) return null;
  const totalGL      = items.reduce((s, i) => s + calcGL(i.food, i.grams), 0);
  const totalFiber   = items.reduce((s, i) => s + calcFiber(i.food, i.grams), 0);
  const totalCarbs   = items.reduce((s, i) => s + calcCarbs(i.food, i.grams), 0);
  const totalProtein = items.reduce((s, i) => s + calcProtein(i.food, i.grams), 0);
  const totalFat     = items.reduce((s, i) => s + calcFat(i.food, i.grams), 0);
  const avgGI = totalCarbs > 0
    ? items.reduce((s, i) => s + i.food.gi * calcCarbs(i.food, i.grams), 0) / totalCarbs
    : 0;
  const fiberOffset = Math.min(totalFiber * 0.5, totalGL * 0.4);
  const netScore    = Math.max(0, totalGL - fiberOffset);
  let rating, color;
  if (netScore < 10)       { rating = "Low";      color = "#00C9A7"; }
  else if (netScore <= 20) { rating = "Moderate";  color = "#F5A623"; }
  else                     { rating = "High";      color = "#E84545"; }
  return { totalGL, totalFiber, totalCarbs, totalProtein, totalFat, avgGI, fiberOffset, netScore, rating, color };
}
