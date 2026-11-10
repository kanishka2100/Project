// FlavorShift AI - Intelligent Culinary Ingredient Substitution & Human Taste Validation Platform
// Empowers cooks, cloud kitchens & cafes to swap missing or expensive ingredients without compromising taste.

const RECIPES_DATA = [
  {
    id: "paneer-butter-masala",
    title: "Velvety Paneer Butter Masala (Makhani)",
    category: "Cafe & Bistro Curries",
    tagline: "India's beloved makhani classic, optimized with FlavorShift AI for when Fresh Cream is missing or too costly.",
    isMostSearched: true,
    rating: 4.96,
    reviewsCount: 142,
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=80",
    prepTime: "10 mins",
    cookTime: "15 mins",
    difficulty: "Medium",
    dietary: ["Vegetarian", "Gluten-Free"],
    basePortionPersons: 1,
    baseCostPerPerson: 2.10,
    suggestedRetailPrice: 8.50,
    baseCalories: 560,
    baseMacros: { protein: 22, carbs: 24, fat: 42, fiber: 5 },

    // Primary FlavorShift AI Alternative for Missing / Expensive Ingredient (Fresh Cream)
    budgetAlternative: {
      active: false,
      title: "Soaked Golden Cashew & Milk Velvet Emulsion (No Fresh Cream Needed)",
      savingsPerPerson: 0.95,
      savingsPercent: "45%",
      newCostPerPerson: 1.15,
      description: "When commercial dairy fresh cream is unavailable or too expensive, FlavorShift AI replaces it with a silky soaked cashew-nut emulsion whisked with warm milk. Delivers an identical buttery mouthfeel and glossy sheen without curdling under high simmer.",
      swapRatio: "For every 100g Fresh Cream → Use 60g Soaked Cashew Paste + 40g Warm Milk (or Whisked Fresh Malai)",
      tasteImpact: "98% Taste Similarity Score. Preserves the signature rich, sweet-tangy makhani flavor notes with zero artificial aftertaste.",
      textureImpact: "Thick, velvety, and micro-smooth; clings tightly to paneer cubes with superior emulsion stability.",
      humanTasteValidation: {
        score: "9.8 / 10",
        verifiedCooks: 142,
        agreementPercent: "97% say indistinguishable from restaurant fresh cream",
        badge: "HTV Verified Gold"
      },
      replacedItems: [
        { original: "Commercial Dairy Fresh Heavy Cream (100ml)", replacedWith: "Soaked Cashew & Milk Velvet Puree (60g + 40g)", reason: "Saves ₹80 per portion; prevents gravy separation under heat", tasteMatch: "98%" },
        { original: "Imported European Salted Butter", replacedWith: "Farm Fresh Desi Ghee & Clarified Butter Blend", reason: "Adds authentic rustic caramel aroma while cutting fat expenditure", tasteMatch: "99%" }
      ]
    },

    // Calorie Cutter Alternative ("ek same recipe ko less calories ka kese bna skte h uske alternative")
    calorieAlternative: {
      active: false,
      title: "Fit-Bistro Protein Makhani (Greek Yogurt & Blanched Silken Tofu Cream)",
      calorieDrop: 240,
      newCalories: 320,
      newMacros: { protein: 29, carbs: 18, fat: 12, fiber: 6 },
      caloriePercent: "-43%",
      description: "Slashes 240 calories and cuts heavy saturated fats by 68%! Replaces heavy fresh cream with velvety strained Greek curd blended with silken tofu. Uses air-seared low-fat paneer cubes to pack 29g clean protein.",
      humanTasteValidation: {
        score: "9.5 / 10",
        verifiedCooks: 98,
        agreementPercent: "94% felt completely satisfied with clean, guilt-free mouthfeel"
      },
      replacedItems: [
        { original: "Heavy Whipping Cream (1/2 cup)", replacedWith: "Silky Whisked Greek Yogurt & Silken Tofu Emulsion", calorieSaving: "-160 kcal" },
        { original: "Excess Cooking Butter (3 tbsp)", replacedWith: "1 tsp Cold-Pressed Mustard/Olive Oil + Tomato Glaze", calorieSaving: "-80 kcal" }
      ]
    },

    // Vegan Option
    veganOption: {
      active: false,
      title: "100% Plant-Based Tofu Makhani with Coconut-Cashew Silk",
      description: "Replaces dairy paneer with pressed firm organic tofu and swaps dairy cream with soaked cashew-coconut blossom silk.",
      replacedItems: [
        { original: "Dairy Milk Paneer", replacedWith: "Herb & Turmeric Marinated Pressed Organic Firm Tofu" },
        { original: "Dairy Fresh Cream", replacedWith: "Rich Soaked Cashew & Coconut Blossom Emulsion" }
      ]
    },

    // Ingredients per 1 Person
    ingredients: [
      { name: "Fresh Malai Paneer Cubes", qtyPerPerson: 150, unit: "g fresh cubes", cost: 0.90, category: "Dairy", isReplaceable: true, replaceableType: "calorie-vegan" },
      { name: "Fresh Commercial Dairy Cream", qtyPerPerson: 60, unit: "g velvety", cost: 0.65, category: "Dairy", isReplaceable: true, replaceableType: "budget-calorie-vegan" },
      { name: "Ripe Roma Tomato Puree", qtyPerPerson: 1.5, unit: "medium tomatoes", cost: 0.20, category: "Produce" },
      { name: "Salted Butter / Ghee", qtyPerPerson: 1.5, unit: "tablespoons", cost: 0.20, category: "Dairy", isReplaceable: true, replaceableType: "calorie" },
      { name: "Ginger-Garlic Fresh Paste", qtyPerPerson: 1, unit: "teaspoon", cost: 0.05, category: "Produce" },
      { name: "Kashmiri Degi Mirch & Garam Masala", qtyPerPerson: 1, unit: "teaspoon blend", cost: 0.04, category: "Spices" },
      { name: "Roasted Kasuri Methi (Fenugreek)", qtyPerPerson: 0.5, unit: "teaspoon crushed", cost: 0.03, category: "Herbs" },
      { name: "Honey or Raw Jaggery", qtyPerPerson: 0.5, unit: "teaspoon", cost: 0.03, category: "Pantry" }
    ],

    // Chef Steps
    steps: [
      "In a wide heavy-bottomed cafe pan, heat butter or oil over gentle heat. Add ginger-garlic paste and saute for 45 seconds until fragrant.",
      "Pour in spiced ripe tomato reduction, stirring continuously until oil separates from the masala base.",
      "Prepare your FlavorShift AI Cream Swap: If using Cashew-Milk velvet, blend soaked cashews with warm milk until micro-smooth; if using low-calorie mode, whisk Greek yogurt with silken tofu puree.",
      "Gently fold the cream alternative into the simmering tomato gravy, maintaining low heat to preserve velvety emulsion texture.",
      "Slide fresh paneer cubes gently into the bubbling makhani gravy, coating each piece without breaking.",
      "Crush roasted Kasuri Methi between your palms directly over the curry to release aromatic essential oils.",
      "Simmer for exactly 3 minutes, finish with a micro-drizzle of cream substitute and serve with warm naan or jeera rice."
    ],

    reviews: [
      {
        id: "htv-1",
        author: "Chef Vikram Mehta",
        cafeName: "Saffron Cloud Kitchen, Gurugram",
        rating: 5,
        date: "Yesterday",
        verifiedCafe: true,
        text: "Human Taste Validation Test: We ran out of Amul Fresh Cream on a Saturday dinner rush. Used FlavorShift AI's 60/40 Soaked Cashew-Milk blend. 28 guests ordered it; ZERO complaints, 2 guests specifically complimented how velvety the gravy was. Saved ₹680 on cream alone!",
        photo: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80",
        helpfulCount: 52
      },
      {
        id: "htv-2",
        author: "Rhea Sen",
        cafeName: "Urban Tadka Bistro, Pune",
        rating: 5,
        date: "3 days ago",
        verifiedCafe: true,
        text: "The taste & texture analysis is shockingly accurate. Cashew paste adds the exact same fatty sweetness as 30% dairy cream. This feature is a lifesaver for small restaurants.",
        photo: "./assets/recipes/slow-simmered-dal-makhani.jpg",
        helpfulCount: 39
      }
    ]
  },

  {
    id: "smashed-avocado-toast",
    title: "Signature Smashed Avocado & Feta Toast",
    category: "Brunch & Toast",
    tagline: "The #1 cafe revenue driver, reimagined with FlavorShift AI when Hass avocados or Greek feta are overpriced.",
    isMostSearched: true,
    rating: 4.9,
    reviewsCount: 38,
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80",
    prepTime: "8 mins",
    cookTime: "5 mins",
    difficulty: "Easy",
    dietary: ["Vegetarian"],
    basePortionPersons: 1,
    baseCostPerPerson: 3.85,
    suggestedRetailPrice: 12.50,
    baseCalories: 480,
    baseMacros: { protein: 16, carbs: 42, fat: 28, fiber: 9 },

    budgetAlternative: {
      active: false,
      title: "Green Pea & Hass Avocado Blend + Ricotta Crumbles",
      savingsPerPerson: 1.65,
      savingsPercent: "43%",
      newCostPerPerson: 2.20,
      description: "Blends 50% sweet tender green peas with ripe Hass avocado to create an ultra-vibrant, velvety mash while cutting avocado cost in half. Swaps expensive imported Greek feta with silky whipped domestic ricotta.",
      swapRatio: "50% Blanched Sweet Green Peas + 50% Hass Avocado Mash",
      tasteImpact: "96% Taste Match. Fresh, bright, buttery with subtle garden sweetness.",
      textureImpact: "Thick, spreadable rustic mash that resists enzymatic browning twice as long as pure avocado.",
      humanTasteValidation: {
        score: "9.7 / 10",
        verifiedCooks: 114,
        agreementPercent: "96% of brunch diners praised the vivid green color & fresh taste",
        badge: "HTV Verified Gold"
      },
      replacedItems: [
        { original: "Hass Avocado (1 whole per person)", replacedWith: "50/50 Hass Avocado & Sweet Green Pea Mash", reason: "Saves $1.10/person and stays vibrant green without browning quickly", tasteMatch: "96%" },
        { original: "Imported Greek Barrel-Aged Feta", replacedWith: "Farmhouse Ricotta Crumbles with Lemon Zest", reason: "Saves $0.55/person and gives a fresher, lighter brunch mouthfeel", tasteMatch: "95%" }
      ]
    },

    calorieAlternative: {
      active: false,
      title: "Slimline Protein Avocado Crisp Toast",
      calorieDrop: 190,
      newCalories: 290,
      newMacros: { protein: 21, carbs: 26, fat: 11, fiber: 8 },
      caloriePercent: "-40%",
      description: "Slashes calories by 40% while boosting protein! Swaps thick buttered sourdough for artisanal seeded crispbread, folds in egg whites instead of whole egg, and replaces EVOO drizzle with a zesty citrus-herb mist.",
      humanTasteValidation: { score: "9.3 / 10", verifiedCooks: 82, agreementPercent: "92% positive" },
      replacedItems: [
        { original: "Thick Artisanal Sourdough (butter toasted)", replacedWith: "Toasted Seeded Thin Sourdough Crispbread", calorieSaving: "-85 kcal" },
        { original: "Extra Virgin Olive Oil Drizzle (1.5 tbsp)", replacedWith: "Fresh Meyer Lemon & Herb Spritz", calorieSaving: "-75 kcal" },
        { original: "Full Poached Egg with yolk", replacedWith: "Poached Egg White Cloud with micro-pinch za'atar", calorieSaving: "-30 kcal" }
      ]
    },

    veganOption: {
      active: false,
      title: "100% Plant-Based Avocado & Tofu-Feta Toast",
      description: "Substitutes feta with herb-marinated artisan tofu feta and poached egg with seasoned grilled smoky tofu slices.",
      replacedItems: [
        { original: "Greek Feta Cheese", replacedWith: "Herb & Garlic Marinated Firm Tofu Feta" },
        { original: "Poached Free-Range Egg", replacedWith: "Smoked Paprika Grilled Tofu Slice or Avocado Flower" }
      ]
    },

    ingredients: [
      { name: "Artisan Sourdough Bread", qtyPerPerson: 1, unit: "thick slice", cost: 0.65, category: "Bakery", isReplaceable: true, replaceableType: "calorie" },
      { name: "Fresh Hass Avocado", qtyPerPerson: 1, unit: "medium ripe", cost: 1.80, category: "Produce", isReplaceable: true, replaceableType: "budget" },
      { name: "Greek Barrel-Aged Feta", qtyPerPerson: 30, unit: "g (crumbled)", cost: 0.85, category: "Dairy", isReplaceable: true, replaceableType: "budget-vegan" },
      { name: "Free-Range Farm Egg", qtyPerPerson: 1, unit: "large egg", cost: 0.35, category: "Poultry", isReplaceable: true, replaceableType: "calorie-vegan" },
      { name: "Extra Virgin Olive Oil", qtyPerPerson: 1, unit: "tablespoon", cost: 0.15, category: "Oils", isReplaceable: true, replaceableType: "calorie" },
      { name: "Fresh Meyer Lemon Juice", qtyPerPerson: 1, unit: "teaspoon", cost: 0.05, category: "Produce" },
      { name: "Crushed Aleppo Red Pepper Flakes", qtyPerPerson: 0.5, unit: "pinch", cost: 0.02, category: "Spices" },
      { name: "Radish & Micro Pea Shoots", qtyPerPerson: 10, unit: "g garnish", cost: 0.18, category: "Produce" },
      { name: "Maldon Flaky Sea Salt", qtyPerPerson: 1, unit: "pinch", cost: 0.02, category: "Pantry" }
    ],

    steps: [
      "Lightly toast the sourdough slice until golden brown with a crisp crust and tender crumb.",
      "In a cafe prep bowl, roughly mash the Hass avocado (or green pea blend) with lemon juice, sea salt, and cracked pepper.",
      "Poach the farm egg in simmering water for exactly 3 minutes until white is set and yolk remains silky liquid.",
      "Generously spread the avocado mash edge-to-edge across the toasted sourdough.",
      "Gently place the warm poached egg in the center.",
      "Scatter crumbled feta (or whipped ricotta), sliced radishes, micro pea shoots, and crushed red pepper flakes.",
      "Finish with citrus-herb mist or light extra virgin olive oil drizzle and flaky Maldon sea salt."
    ],

    reviews: [
      {
        id: "r1",
        author: "Chef Marco D.",
        cafeName: "The Daily Grind Bistro, Austin",
        rating: 5,
        date: "2 days ago",
        verifiedCafe: true,
        text: "The green pea budget alternative is an absolute game-changer for our weekend brunch rush! Food cost dropped from 31% to 18% and our customers loved the brighter green color.",
        photo: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=600&auto=format&fit=crop&q=80",
        helpfulCount: 24
      }
    ]
  },

  {
    id: "wild-mushroom-truffle-pasta",
    title: "Truffle-Style Wild Mushroom Fettuccine",
    category: "Pastas & Mains",
    tagline: "Gourmet cafe pasta with rich umami, engineered for fast cafe ticket times without costly truffle oil.",
    isMostSearched: true,
    rating: 4.9,
    reviewsCount: 51,
    image: "https://images.unsplash.com/photo-1750943041213-db8328856b48?w=800&auto=format&fit=crop&q=80",
    prepTime: "10 mins",
    cookTime: "12 mins",
    difficulty: "Medium",
    dietary: ["Vegetarian"],
    basePortionPersons: 1,
    baseCostPerPerson: 4.80,
    suggestedRetailPrice: 17.50,
    baseCalories: 640,
    baseMacros: { protein: 22, carbs: 68, fat: 31, fiber: 5 },

    budgetAlternative: {
      active: false,
      title: "Porcini-Infused Brown Cremini with Garlic Butter & Domestic Grana",
      savingsPerPerson: 2.70,
      savingsPercent: "56%",
      newCostPerPerson: 2.10,
      description: "Replaces astronomical wild chanterelles and synthetic truffle oil with caramelized brown cremini mushrooms deglazed in steeped dried porcini mushroom broth and garlic brown butter. Swaps 24-month Parmigiano with domestic Grana Padano.",
      swapRatio: "15g Steeped Porcini Broth + 100g Brown Creminis instead of 1 tsp Truffle Oil",
      tasteImpact: "97% Taste Match. Authentic, deep, woodland umami flavor without synthetic chemical aroma.",
      textureImpact: "Cohesive velvety gloss that clings evenly to hot fettuccine noodles.",
      humanTasteValidation: {
        score: "9.9 / 10",
        verifiedCooks: 136,
        agreementPercent: "98% preferred real porcini reduction over synthetic truffle oil",
        badge: "HTV Verified Gold"
      },
      replacedItems: [
        { original: "Imported Black Truffle Oil & Wild Chanterelles", replacedWith: "Steeped Porcini Mushroom Reduction + Brown Creminis", reason: "Saves $2.10/person with deeper savory umami and zero synthetic truffle aroma", tasteMatch: "97%" },
        { original: "24-Month Parmigiano-Reggiano", replacedWith: "Aged Domestic Grana Padano", reason: "Saves $0.60/person with identical sharp salty bite", tasteMatch: "99%" }
      ]
    },

    calorieAlternative: {
      active: false,
      title: "Light Velvety Mushroom Fettuccine (Cauliflower-Cashew Cream)",
      calorieDrop: 290,
      newCalories: 350,
      newMacros: { protein: 18, carbs: 45, fat: 9, fiber: 7 },
      caloriePercent: "-45%",
      description: "Replaces heavy whipping cream with a velvety blend of steamed cauliflower and light cashew cream. Swaps heavy butter pan frying with light olive oil mist.",
      humanTasteValidation: { score: "9.4 / 10", verifiedCooks: 74, agreementPercent: "93% positive" },
      replacedItems: [
        { original: "Heavy Whipping Cream (1/2 cup)", replacedWith: "Silky Steamed Cauliflower & Garlic Cream", calorieSaving: "-190 kcal" },
        { original: "European Salted Butter (2 tbsp)", replacedWith: "1 tsp Cold Pressed Olive Oil + Mushroom Broth", calorieSaving: "-100 kcal" }
      ]
    },

    veganOption: {
      active: false,
      title: "100% Plant-Based Creamy Truffle Pasta",
      description: "Uses cashew-garlic cream and replaces cheese with toasted savory nutritional yeast flakes.",
      replacedItems: [
        { original: "Heavy Cream & Butter", replacedWith: "Soaked Raw Cashew & Shallot Emulsion" },
        { original: "Parmesan Cheese", replacedWith: "Toasted Nutritional Yeast & Walnut Dust" }
      ]
    },

    ingredients: [
      { name: "Fresh Egg Fettuccine Pasta", qtyPerPerson: 120, unit: "g fresh", cost: 0.90, category: "Pasta", isReplaceable: true, replaceableType: "calorie" },
      { name: "Wild Chanterelle & Cremini Mushrooms", qtyPerPerson: 100, unit: "g sliced", cost: 1.70, category: "Produce", isReplaceable: true, replaceableType: "budget" },
      { name: "Heavy Whipping Cream (36% fat)", qtyPerPerson: 80, unit: "g equivalent", cost: 0.70, category: "Dairy", isReplaceable: true, replaceableType: "calorie-vegan" },
      { name: "White Truffle Infused Olive Oil", qtyPerPerson: 1, unit: "teaspoon finish", cost: 0.80, category: "Oils", isReplaceable: true, replaceableType: "budget" },
      { name: "Aged Parmigiano-Reggiano", qtyPerPerson: 25, unit: "g grated", cost: 0.50, category: "Dairy", isReplaceable: true, replaceableType: "budget-vegan" },
      { name: "Shallot & Fresh Garlic Cloves", qtyPerPerson: 2, unit: "cloves minced", cost: 0.10, category: "Produce" },
      { name: "Fresh Garden Thyme Leaves", qtyPerPerson: 2, unit: "sprigs", cost: 0.05, category: "Produce" },
      { name: "Cracked Black Peppercorns & Sea Salt", qtyPerPerson: 1, unit: "pinch", cost: 0.05, category: "Spices" }
    ],

    steps: [
      "Cook fresh fettuccine in salted boiling water for 3 minutes until al dente.",
      "In a wide pan, sear sliced mushrooms in butter or oil until deeply browned and caramelized.",
      "Add minced shallots, garlic, and fresh thyme, tossing for 60 seconds until fragrant.",
      "Pour in the cream (or cauliflower-cashew emulsion / steeped porcini broth) and simmer 2 minutes to thicken.",
      "Transfer al dente pasta directly into the sauce with pasta water to bind.",
      "Toss vigorously to coat; remove from heat and fold in grated cheese.",
      "Plate into warm bowls twirled high, garnishing with cracked pepper and thyme."
    ],

    reviews: [
      {
        id: "r4",
        author: "Chef Liam K.",
        cafeName: "Artisan Wood & Fork, Portland",
        rating: 5,
        date: "5 days ago",
        verifiedCafe: true,
        text: "The Porcini reduction budget swap is genius. Our customers couldn't tell the difference from $5 truffle oil, and our food cost margin skyrocketed from 67% to 83%!",
        photo: "https://images.unsplash.com/photo-1621996346565-e3d5d6281005?w=600&auto=format&fit=crop&q=80",
        helpfulCount: 47
      }
    ]
  },

  {
    id: "basque-burnt-cheesecake",
    title: "San Sebastian Basque Burnt Cheesecake",
    category: "Bakery & Desserts",
    tagline: "Iconic cafe dessert with caramelized crust, baked affordably with FlavorShift AI's dairy blend.",
    isMostSearched: true,
    rating: 4.9,
    reviewsCount: 46,
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&auto=format&fit=crop&q=80",
    prepTime: "12 mins",
    cookTime: "35 mins",
    difficulty: "Medium",
    dietary: ["Vegetarian", "Gluten-Free"],
    basePortionPersons: 1,
    baseCostPerPerson: 2.10,
    suggestedRetailPrice: 8.50,
    baseCalories: 460,
    baseMacros: { protein: 9, carbs: 32, fat: 34, fiber: 0 },

    budgetAlternative: {
      active: false,
      title: "Hung Curd & Domestic Cream Cheese Blend (50/50)",
      savingsPerPerson: 1.15,
      savingsPercent: "55%",
      newCostPerPerson: 0.95,
      description: "Swaps 50% expensive imported Philadelphia block cheese with rich hung farmhouse curd (Chakka). Provides an authentic San Sebastian caramelized blistered top with a creamier, lighter custardy molten center.",
      swapRatio: "50% Chilled Hung Curd + 50% Cream Cheese",
      tasteImpact: "98% Match. Enhanced tanginess that balances sweetness perfectly.",
      textureImpact: "Melting molten center with zero graininess.",
      humanTasteValidation: {
        score: "9.8 / 10",
        verifiedCooks: 118,
        agreementPercent: "97% rated texture superior to 100% heavy cream cheese",
        badge: "HTV Verified Gold"
      },
      replacedItems: [
        { original: "100% Imported Cream Cheese (150g)", replacedWith: "50/50 Hung Farmhouse Curd & Cream Cheese", reason: "Saves $1.15/slice with enhanced lactic tang", tasteMatch: "98%" }
      ]
    },

    calorieAlternative: {
      active: false,
      title: "Guilt-Free High-Protein Basque Slice",
      calorieDrop: 210,
      newCalories: 250,
      newMacros: { protein: 18, carbs: 14, fat: 12, fiber: 2 },
      caloriePercent: "-46%",
      description: "Replaces refined baker's sugar with monkfruit sweetener, and blends low-fat Greek yogurt with whey isolate.",
      humanTasteValidation: { score: "9.2 / 10", verifiedCooks: 65, agreementPercent: "91% positive" },
      replacedItems: [
        { original: "Refined White Sugar (40g)", replacedWith: "Allulose-Monkfruit Baker Blend (0 cal)", calorieSaving: "-150 kcal" },
        { original: "Heavy Cream (40g)", replacedWith: "Skimmed Evaporated Milk + Vanilla", calorieSaving: "-60 kcal" }
      ]
    },

    veganOption: {
      active: false,
      title: "Velvety Cashew & Silken Tofu Basque Cake",
      description: "Blends soaked raw cashews, organic silken tofu, cornstarch, and lemon juice.",
      replacedItems: [
        { original: "Cream Cheese & Eggs", replacedWith: "Blended Cashew-Tofu Custard Emulsion" }
      ]
    },

    ingredients: [
      { name: "Full-Fat Cream Cheese (or Curd Blend)", qtyPerPerson: 120, unit: "g block", cost: 1.20, category: "Dairy", isReplaceable: true, replaceableType: "budget" },
      { name: "Heavy Whipping Cream", qtyPerPerson: 40, unit: "g velvety", cost: 0.35, category: "Dairy", isReplaceable: true, replaceableType: "calorie" },
      { name: "Farm Fresh Whole Eggs", qtyPerPerson: 1, unit: "large egg", cost: 0.30, category: "Poultry" },
      { name: "Organic Cane Sugar", qtyPerPerson: 30, unit: "g baker", cost: 0.10, category: "Pantry", isReplaceable: true, replaceableType: "calorie" },
      { name: "Pure Madagascar Vanilla Extract", qtyPerPerson: 0.5, unit: "teaspoon", cost: 0.10, category: "Flavors" },
      { name: "Cornstarch (Gluten-Free)", qtyPerPerson: 1, unit: "teaspoon binder", cost: 0.05, category: "Pantry" }
    ],

    steps: [
      "Preheat cafe convection oven to 220°C (430°F) with fan on.",
      "In a mixer, beat softened cream cheese (or hung curd blend) with sugar until velvety and lump-free.",
      "Add eggs one at a time, whisking gently to avoid incorporating excessive air bubbles.",
      "Pour in cream and vanilla extract, folding in cornstarch smoothly.",
      "Line a springform mold with crumpled parchment paper extending above the rim.",
      "Bake for 32 minutes until surface is deeply caramelized and center has an appetizing gentle jiggle.",
      "Cool to room temperature before slicing to achieve the signature molten center."
    ],

    reviews: [
      {
        id: "r6",
        author: "Chef Claire B.",
        cafeName: "Petite Brulerie, Montreal",
        rating: 5,
        date: "1 week ago",
        verifiedCafe: true,
        text: "The 50/50 hung curd substitution is phenomenal! It gives the cheesecake a delicate lactic tang that cuts through the sweetness. Our kitchen margin jumped from 61% to 84%.",
        photo: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&auto=format&fit=crop&q=80",
        helpfulCount: 35
      }
    ]
  },

  {
    id: "golden-turmeric-oat-latte",
    title: "Artisan Golden Turmeric & Spiced Oat Latte",
    category: "Coffee & Drinks",
    tagline: "High-margin anti-inflammatory cafe favorite with velvety microfoam.",
    isMostSearched: true,
    rating: 4.8,
    reviewsCount: 42,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80",
    prepTime: "3 mins",
    cookTime: "3 mins",
    difficulty: "Easy",
    dietary: ["Vegan", "Vegetarian", "Gluten-Free", "Dairy-Free"],
    basePortionPersons: 1,
    baseCostPerPerson: 1.45,
    suggestedRetailPrice: 6.25,
    baseCalories: 185,
    baseMacros: { protein: 4, carbs: 24, fat: 7, fiber: 3 },

    budgetAlternative: {
      active: false,
      title: "Organic Turmeric Root Powder & Spiced Wildflower Honey",
      savingsPerPerson: 0.65,
      savingsPercent: "45%",
      newCostPerPerson: 0.80,
      description: "Replaces high-spoilage fresh turmeric root with potent cold-ground organic powder, and swaps expensive vanilla pods with pure extract.",
      swapRatio: "1 tsp Cold-Ground Turmeric Powder instead of 15g Fresh Root",
      tasteImpact: "98% Match. Consistent golden hue with zero kitchen spoilage.",
      textureImpact: "Silky microfoam suspension without grit.",
      humanTasteValidation: { score: "9.7 / 10", verifiedCooks: 89, agreementPercent: "96% positive", badge: "HTV Verified Gold" },
      replacedItems: [
        { original: "Fresh organic grated turmeric root & vanilla pod", replacedWith: "High-curcumin organic turmeric powder & pure vanilla extract", reason: "Zero kitchen spoilage, consistent golden hue, saves $0.45 per cup", tasteMatch: "98%" }
      ]
    },

    calorieAlternative: {
      active: false,
      title: "Keto Skinny Golden Turmeric Elixir",
      calorieDrop: 110,
      newCalories: 75,
      newMacros: { protein: 2, carbs: 4, fat: 5, fiber: 2 },
      caloriePercent: "-60%",
      description: "Replaces barista oat milk with unsweetened creamy almond milk, and uses zero-calorie organic monk fruit drops.",
      humanTasteValidation: { score: "9.3 / 10", verifiedCooks: 54, agreementPercent: "92% positive" },
      replacedItems: [
        { original: "Barista Edition Oat Milk (240ml)", replacedWith: "Unsweetened Vanilla Almond Milk", calorieSaving: "-80 kcal" },
        { original: "Pure Maple Syrup (1 tbsp)", replacedWith: "Organic Liquid Stevia / Monk Fruit Drops", calorieSaving: "-30 kcal" }
      ]
    },

    veganOption: {
      active: false,
      title: "100% Certified Vegan Formula",
      description: "Naturally plant-based when prepared with organic maple or agave syrup.",
      replacedItems: []
    },

    ingredients: [
      { name: "Barista Edition Oat Milk", qtyPerPerson: 1, unit: "cup equivalent", cost: 0.80, category: "Plant Milk", isReplaceable: true, replaceableType: "calorie" },
      { name: "Fresh Turmeric Root (or powder)", qtyPerPerson: 1, unit: "teaspoon", cost: 0.25, category: "Spices", isReplaceable: true, replaceableType: "budget" },
      { name: "Fresh Ginger Juice", qtyPerPerson: 0.5, unit: "teaspoon", cost: 0.10, category: "Produce" },
      { name: "Ceylon Cinnamon & Black Pepper", qtyPerPerson: 0.25, unit: "teaspoon blend", cost: 0.05, category: "Spices" },
      { name: "Pure Maple Syrup", qtyPerPerson: 1, unit: "tablespoon", cost: 0.20, category: "Sweetener", isReplaceable: true, replaceableType: "calorie" }
    ],

    steps: [
      "In a steaming pitcher, whisk turmeric, ginger juice, Ceylon cinnamon, black pepper, and maple syrup into a golden paste.",
      "Add cold oat milk into the pitcher and stir to incorporate.",
      "Steam milk using espresso steam wand to 65°C (150°F) to generate silky microfoam.",
      "Pour into an 8oz artisan ceramic mug with a slow center pour.",
      "Dust top with cinnamon stencil art and serve piping hot."
    ],

    reviews: [
      {
        id: "r3",
        author: "Pooja Varma",
        cafeName: "Bean & Soul Studio, Bangalore",
        rating: 5,
        date: "3 days ago",
        verifiedCafe: true,
        text: "Our highest margin beverage! Powder switch cut ticket time from 5 mins to under 90 seconds while saving 45% ingredient cost.",
        photo: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
        helpfulCount: 31
      }
    ]
  },
  {
    id: "dal-makhani-bistro",
    title: "Slow-Simmered Dal Makhani",
    category: "Cafe & Bistro Curries",
    tagline: "Slow-cooked black lentils, perfected with FlavorShift AI using soaked cashews & churned curd when dairy cream is missing.",
    isMostSearched: true,
    rating: 4.95,
    reviewsCount: 168,
    image: "./assets/recipes/slow-simmered-dal-makhani.jpg",
    prepTime: "15 mins",
    cookTime: "40 mins",
    difficulty: "Medium",
    dietary: ["Vegetarian", "Gluten-Free"],
    basePortionPersons: 1,
    baseCostPerPerson: 1.40,
    suggestedRetailPrice: 6.50,
    baseCalories: 480,
    baseMacros: { protein: 18, carbs: 45, fat: 26, fiber: 11 },
    budgetAlternative: {
      active: false,
      title: "Cashew Emulsion & Slow-Roasted Tomato Reduction (No Cream Needed)",
      savingsPerPerson: 0.65,
      savingsPercent: "46%",
      newCostPerPerson: 0.75,
      description: "Replaces excessive fresh cream and block butter with a velvet cashew-milk puree and roasted tomato concentrate.",
      swapRatio: "For 80ml heavy cream → Use 45g cashew puree + 35ml warm skim milk",
      tasteImpact: "98% Sensory Match. Retains velvety, slow-cooked mouthfeel with subtle smoky notes.",
      textureImpact: "Creamy, glossy sheen with no curdling or oil separation.",
      humanTasteValidation: {
        score: "9.8 / 10",
        verifiedCooks: 135,
        agreementPercent: "98% rating indistinguishable from slow-churned restaurant dal",
        badge: "HTV Verified Gold"
      },
      replacedItems: [
        { original: "Heavy Cream (80ml)", replacedWith: "Blended Cashew-Milk Velvet (80g)", reason: "Saves ₹55 per portion with silky mouthfeel", tasteMatch: "98%" }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "Light & Wholesome Protein Dal Makhani",
      calorieDrop: 190,
      newCalories: 290,
      newMacros: { protein: 22, carbs: 44, fat: 6, fiber: 12 },
      caloriePercent: "-40%",
      description: "Eliminates heavy dairy fat by folding in hung curd and vegetable broth while preserving signature warmth.",
      humanTasteValidation: {
        score: "9.4 / 10",
        verifiedCooks: 82,
        agreementPercent: "93% pleased with rich earthy profile without bloating"
      },
      replacedItems: [
        { original: "Block Butter & Cream (60g)", replacedWith: "Hung Curd & Smoked Jeera Glaze", calorieSaving: "-190 kcal" }
      ]
    },
    veganOption: {
      active: false,
      title: "Vegan Earth Dal with Coconut-Cashew Velvet",
      description: "Utilizes cold-pressed coconut oil and rich cashew milk for a completely dairy-free slow dal.",
      replacedItems: [
        { original: "Dairy Butter", replacedWith: "Cold-Pressed Mustard & Coconut Oil" },
        { original: "Fresh Dairy Cream", replacedWith: "Soaked Cashew Silk" }
      ]
    },
    ingredients: [
      { name: "Whole Black Urad & Rajma", qtyPerPerson: 90, unit: "g soaked", cost: 0.40, category: "Grains & Pulses" },
      { name: "Dairy Fresh Cream", qtyPerPerson: 50, unit: "ml", cost: 0.45, category: "Dairy", isReplaceable: true, replaceableType: "budget-calorie-vegan" },
      { name: "Salted Butter", qtyPerPerson: 1.5, unit: "tbsp", cost: 0.25, category: "Dairy", isReplaceable: true, replaceableType: "calorie" },
      { name: "Smoked Tomato & Ginger Gravy", qtyPerPerson: 100, unit: "ml", cost: 0.15, category: "Produce" },
      { name: "Kashmiri Chilli & Garam Masala", qtyPerPerson: 1, unit: "tsp", cost: 0.15, category: "Spices" }
    ],
    steps: [
      "Pressure-cook soaked whole black urad and kidney beans with ginger until fork-tender.",
      "In a heavy pot, simmer pureed ripe tomatoes and spices until the aromatics soften.",
      "Whisk your cashew puree into warm water to form a uniform emulsion.",
      "Gently fold the emulsion into the dal over low heat, allowing the starches to meld for 15 minutes.",
      "Finish with crushed fenugreek and serve piping hot."
    ],
    reviews: [
      {
        id: "dal-rev-1",
        author: "Chef Harpreet Singh",
        cafeName: "Amritsar Gourmet Dhaba, Delhi",
        rating: 5,
        date: "2 days ago",
        verifiedCafe: true,
        text: "The cashew-milk substitute gave us the exact gloss and cling customers expect, cutting cream costs dramatically.",
        photo: "./assets/recipes/slow-simmered-dal-makhani.jpg",
        helpfulCount: 44
      }
    ]
  },
  {
    id: "royal-shahi-paneer",
    title: "Shahi Paneer in White Velvet Gravy",
    category: "Cafe & Bistro Curries",
    tagline: "Mughlai royal curry re-engineered when khoya (mawa) or melon seeds are unavailable or overpriced.",
    isMostSearched: false,
    rating: 4.92,
    reviewsCount: 110,
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80",
    prepTime: "12 mins",
    cookTime: "18 mins",
    difficulty: "Medium",
    dietary: ["Vegetarian", "Gluten-Free"],
    basePortionPersons: 1,
    baseCostPerPerson: 2.25,
    suggestedRetailPrice: 8.90,
    baseCalories: 540,
    baseMacros: { protein: 24, carbs: 22, fat: 38, fiber: 4 },
    budgetAlternative: {
      active: false,
      title: "Poppy Seed & Milk Powder Velvet (No Khoya/Mawa)",
      savingsPerPerson: 0.90,
      savingsPercent: "40%",
      newCostPerPerson: 1.35,
      description: "Substitutes expensive evaporated milk solids (khoya) with skim milk powder and soaked white poppy seeds.",
      swapRatio: "For 50g Khoya → Use 30g Skim Milk Powder + 20ml Warm Milk + pinch of cardamom",
      tasteImpact: "97% Match. Sweet aromatic profile with royal cardamon and saffron notes.",
      textureImpact: "Dense, creamy, clings perfectly to paneer.",
      humanTasteValidation: {
        score: "9.7 / 10",
        verifiedCooks: 92,
        agreementPercent: "96% validated equal rich decadence",
        badge: "HTV Verified Gold"
      },
      replacedItems: [
        { original: "Traditional Khoya / Mawa (50g)", replacedWith: "Skim Milk Powder & Poppy Puree (50g)", reason: "Saves ₹75 per cover; prevents grainy separation", tasteMatch: "97%" }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "Low-Calorie Shahi Paneer (Almond Milk & Low-Fat Paneer)",
      calorieDrop: 210,
      newCalories: 330,
      newMacros: { protein: 26, carbs: 16, fat: 12, fiber: 5 },
      caloriePercent: "-39%",
      description: "Replaces heavy dairy fats with unsweetened almond milk and steamed low-fat cottage cheese.",
      humanTasteValidation: {
        score: "9.4 / 10",
        verifiedCooks: 67,
        agreementPercent: "92% delighted by royal flavor profile with light feel"
      },
      replacedItems: [
        { original: "Full-Fat Khoya & Cream", replacedWith: "Steamed Almond Puree & Skim Curd", calorieSaving: "-210 kcal" }
      ]
    },
    veganOption: {
      active: false,
      title: "Plant-Based Shahi Tofu in Cashew Cream",
      description: "Tofu cubes nestled in cardamom-infused blended cashew and almond milk.",
      replacedItems: [
        { original: "Dairy Paneer", replacedWith: "Silken Firm Organic Tofu" },
        { original: "Khoya & Dairy Milk", replacedWith: "Cashew & Almond Silk" }
      ]
    },
    ingredients: [
      { name: "Malai Paneer Cubes", qtyPerPerson: 140, unit: "g", cost: 0.90, category: "Dairy", isReplaceable: true, replaceableType: "calorie-vegan" },
      { name: "Commercial Khoya / Mawa", qtyPerPerson: 40, unit: "g", cost: 0.65, category: "Dairy", isReplaceable: true, replaceableType: "budget-calorie-vegan" },
      { name: "White Onion & Cashew Paste", qtyPerPerson: 80, unit: "g", cost: 0.40, category: "Produce" },
      { name: "Green Cardamom & Saffron", qtyPerPerson: 0.5, unit: "tsp", cost: 0.20, category: "Spices" },
      { name: "Desi Ghee", qtyPerPerson: 1, unit: "tbsp", cost: 0.10, category: "Dairy", isReplaceable: true, replaceableType: "calorie" }
    ],
    steps: [
      "Saute whole cardamom and cinnamon in ghee until fragrant.",
      "Whisk onion paste and cook gently on low flame to maintain a pale ivory color.",
      "Blend milk powder and warm milk into a rich slurry, folding into the simmering gravy.",
      "Gently add paneer cubes and let them absorb the royal saffron gravy for 4 minutes.",
      "Serve garnished with slivered almonds and a whisper of saffron."
    ],
    reviews: [
      {
        id: "shahi-rev-1",
        author: "Meenakshi Sundaram",
        cafeName: "Dawat Royal Kitchen, Lucknow",
        rating: 5,
        date: "5 days ago",
        verifiedCafe: true,
        text: "The milk powder + poppy seed swap created the exact royal richness of khoya without any graininess.",
        photo: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80",
        helpfulCount: 39
      }
    ]
  },
  {
    id: "punjabi-chole-bhature",
    title: "Amritsari Pindi Chole Masala",
    category: "Cafe & Bistro Curries",
    tagline: "Robust spiced dark chickpeas, formulated with FlavorShift AI for when Anardana or Amla is out of stock.",
    isMostSearched: true,
    rating: 4.94,
    reviewsCount: 155,
    image: "./assets/recipes/amritsari-pindi-chole.jpg",
    prepTime: "10 mins",
    cookTime: "25 mins",
    difficulty: "Easy",
    dietary: ["Vegetarian", "Vegan"],
    basePortionPersons: 1,
    baseCostPerPerson: 0.95,
    suggestedRetailPrice: 5.20,
    baseCalories: 410,
    baseMacros: { protein: 16, carbs: 62, fat: 12, fiber: 14 },
    budgetAlternative: {
      active: false,
      title: "Black Tea Steep & Tamarind Extract (No Pomegranate Seeds/Anardana)",
      savingsPerPerson: 0.35,
      savingsPercent: "37%",
      newCostPerPerson: 0.60,
      description: "Replaces costly dried pomegranate seeds (anardana) with steeped Assam black tea and tart tamarind pulp for signature dark color and acidity.",
      swapRatio: "For 2 tsp Anardana → Use 1 tbsp Tamarind Extract + 50ml Steeped Dark Black Tea",
      tasteImpact: "99% Sensory Match. Deep earthy tang with authentic rustic bitterness.",
      textureImpact: "Dark, clinging masala sauce adhering evenly to chickpeas.",
      humanTasteValidation: {
        score: "9.9 / 10",
        verifiedCooks: 118,
        agreementPercent: "99% could not tell difference from Old Delhi street chole",
        badge: "HTV Verified Gold"
      },
      replacedItems: [
        { original: "Dried Wild Anardana Powder (2 tsp)", replacedWith: "Tamarind Pulp & Assam Tea Reduction", reason: "Saves ₹30 per portion while giving identical dark rustic hue", tasteMatch: "99%" }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "Zero-Oil Roasted Spice Chole",
      calorieDrop: 120,
      newCalories: 290,
      newMacros: { protein: 16, carbs: 58, fat: 2, fiber: 14 },
      caloriePercent: "-29%",
      description: "Roasted ground spices bloomed in chickpea cooking liquor with zero added oil or ghee.",
      humanTasteValidation: {
        score: "9.6 / 10",
        verifiedCooks: 74,
        agreementPercent: "95% found it deeply satisfying and digestible"
      },
      replacedItems: [
        { original: "Refined Oil & Ghee (2 tbsp)", replacedWith: "Simmered Chickpea Aquafaba Glaze", calorieSaving: "-120 kcal" }
      ]
    },
    veganOption: {
      active: false,
      title: "Naturally 100% Vegan Amritsari Chole",
      description: "Naturally plant-based, simmered with whole spices, black salt, and ginger juliennes.",
      replacedItems: []
    },
    ingredients: [
      { name: "Boiled Kabuli Chickpeas", qtyPerPerson: 180, unit: "g", cost: 0.40, category: "Grains & Pulses" },
      { name: "Dried Anardana (Pomegranate)", qtyPerPerson: 1.5, unit: "tsp", cost: 0.30, category: "Spices", isReplaceable: true, replaceableType: "budget" },
      { name: "Chole Spice Blend & Kasuri Methi", qtyPerPerson: 1, unit: "tbsp", cost: 0.10, category: "Spices" },
      { name: "Mustard Oil / Ghee", qtyPerPerson: 1, unit: "tbsp", cost: 0.10, category: "Produce", isReplaceable: true, replaceableType: "calorie" },
      { name: "Fresh Ginger & Green Chillies", qtyPerPerson: 1, unit: "tbsp julienned", cost: 0.05, category: "Produce" }
    ],
    steps: [
      "Simmer boiled chickpeas with steeped tea water and a bay leaf to impart the traditional dark hue.",
      "Dry-roast coriander, cumin, black cardamom, and red chilli powder in a skillet.",
      "Stir tamarind reduction and the roasted spices into the chickpeas, mashing slightly to thicken.",
      "Pour a sizzling ginger-chilli tadka over the bubbling chole and cover for 2 minutes to trap aromas.",
      "Serve with fluffy bhature or steamed basmati rice."
    ],
    reviews: [
      {
        id: "chole-rev-1",
        author: "Kavita Narang",
        cafeName: "Old Town Cafe, Chandigarh",
        rating: 5,
        date: "4 days ago",
        verifiedCafe: true,
        text: "The tea-tamarind substitute creates that quintessential dark, tangy Pindi flavor at a fraction of the cost of whole anardana.",
        photo: "./assets/recipes/amritsari-pindi-chole.jpg",
        helpfulCount: 57
      }
    ]
  },
  {
    id: "hyderabadi-veg-biryani",
    title: "Dum Pukht Hyderabadi Biryani",
    category: "Cafe & Bistro Curries",
    tagline: "Fragrant basmati layered with vegetables, optimized with FlavorShift AI when pure saffron or kewra is missing.",
    isMostSearched: true,
    rating: 4.97,
    reviewsCount: 185,
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&auto=format&fit=crop&q=80",
    prepTime: "20 mins",
    cookTime: "30 mins",
    difficulty: "Hard",
    dietary: ["Vegetarian", "Gluten-Free"],
    basePortionPersons: 1,
    baseCostPerPerson: 1.80,
    suggestedRetailPrice: 7.80,
    baseCalories: 520,
    baseMacros: { protein: 12, carbs: 78, fat: 18, fiber: 8 },
    budgetAlternative: {
      active: false,
      title: "Turmeric-Cardamom Essence & Rose Water (No Saffron)",
      savingsPerPerson: 0.70,
      savingsPercent: "39%",
      newCostPerPerson: 1.10,
      description: "Replaces astronomical ₹3,500/10g saffron threads with cold-pressed turmeric infusion, crushed green cardamom, and culinary rose hydrosol.",
      swapRatio: "For 0.2g Saffron → Use 1/4 tsp Golden Turmeric + 1 tsp Rose Hydrosol + 2 crushed Cardamom pods",
      tasteImpact: "98% Sensory Match. Captures the intoxicating floral aromatics and vibrant royal tint.",
      textureImpact: "Individual grains stay slender, aromatic, and fluffy without discoloration.",
      humanTasteValidation: {
        score: "9.8 / 10",
        verifiedCooks: 140,
        agreementPercent: "97% rated the floral bouquet indistinguishable from saffron milk",
        badge: "HTV Verified Gold"
      },
      replacedItems: [
        { original: "Pure Kashmir Mongra Saffron (0.2g)", replacedWith: "Cardamom-Rose Bloom & Organic Turmeric Infusion", reason: "Saves ₹60 per serving without chemical essence flavor", tasteMatch: "98%" }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "Light Dum Biryani with Cauliflower Rice Blend",
      calorieDrop: 180,
      newCalories: 340,
      newMacros: { protein: 14, carbs: 52, fat: 8, fiber: 10 },
      caloriePercent: "-35%",
      description: "Combines 60% aged basmati with 40% steamed riced cauliflower and replaces deep-fried onions with air-crisped shallots.",
      humanTasteValidation: {
        score: "9.5 / 10",
        verifiedCooks: 90,
        agreementPercent: "94% felt completely full and energised without post-meal fatigue"
      },
      replacedItems: [
        { original: "Fried Birista Onions & Ghee (3 tbsp)", replacedWith: "Air-Crisped Shallots & Vegetable Mist", calorieSaving: "-180 kcal" }
      ]
    },
    veganOption: {
      active: false,
      title: "Plant-Based Dum Biryani with Coconut Milk Garnish",
      description: "Dairy-free layering using cold-pressed virgin coconut oil and cashew curd.",
      replacedItems: [
        { original: "Dairy Ghee & Curd", replacedWith: "Coconut Milk & Cashew Yogurt" }
      ]
    },
    ingredients: [
      { name: "Aged Long-Grain Basmati Rice", qtyPerPerson: 90, unit: "g dry", cost: 0.45, category: "Grains & Pulses" },
      { name: "Mixed Farm Vegetables (Carrot, Beans, Peas)", qtyPerPerson: 100, unit: "g", cost: 0.35, category: "Produce" },
      { name: "Pure Saffron Strands", qtyPerPerson: 0.15, unit: "g", cost: 0.60, category: "Spices", isReplaceable: true, replaceableType: "budget" },
      { name: "Desi Ghee & Fried Onions (Birista)", qtyPerPerson: 2, unit: "tbsp", cost: 0.30, category: "Dairy", isReplaceable: true, replaceableType: "calorie" },
      { name: "Mint & Coriander Leaves", qtyPerPerson: 1, unit: "handful", cost: 0.10, category: "Herbs" }
    ],
    steps: [
      "Par-boil soaked aged basmati with cloves, star anise, and cinnamon until 70% cooked; drain thoroughly.",
      "Saute vegetables with spiced yogurt marinade in a heavy handi until fragrant.",
      "Prepare your FlavorShift floral aroma swap: bloom turmeric and crushed cardamom in warm rose water.",
      "Layer rice over spiced vegetables, drizzling the golden floral essence and mint leaves across the top.",
      "Seal with dough or tight foil for 18 minutes on low heat (Dum) to allow gentle steam circulation.",
      "Gently fluff rice with a flat spoon and serve with mint raita."
    ],
    reviews: [
      {
        id: "biryani-rev-1",
        author: "Zainab Begum",
        cafeName: "Nizam Heritage Kitchen, Hyderabad",
        rating: 5,
        date: "3 days ago",
        verifiedCafe: true,
        text: "The floral aroma bloom was remarkable. Diners praised the aromatic nuance while our banquet cost per portion dropped by nearly ₹60.",
        photo: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80",
        helpfulCount: 62
      }
    ]
  },
  {
    id: "palak-paneer-velvet",
    title: "Vibrant Garlic Palak Paneer",
    category: "Cafe & Bistro Curries",
    tagline: "Vivid emerald spinach curry, formulated with FlavorShift AI to prevent dull browning without baking soda.",
    isMostSearched: false,
    rating: 4.93,
    reviewsCount: 118,
    image: "https://images.unsplash.com/photo-1589647363585-f4a7d3877b10?w=800&auto=format&fit=crop&q=80",
    prepTime: "10 mins",
    cookTime: "12 mins",
    difficulty: "Easy",
    dietary: ["Vegetarian", "Gluten-Free"],
    basePortionPersons: 1,
    baseCostPerPerson: 1.60,
    suggestedRetailPrice: 6.90,
    baseCalories: 430,
    baseMacros: { protein: 21, carbs: 14, fat: 32, fiber: 7 },
    budgetAlternative: {
      active: false,
      title: "Sweet Green Pea & Ice-Shocked Spinach Puree (No Heavy Cream)",
      savingsPerPerson: 0.60,
      savingsPercent: "38%",
      newCostPerPerson: 1.00,
      description: "Blanches spinach with sweet green peas and an immediate ice-bath shock, yielding a naturally sweet, emerald sauce that stays bright for hours.",
      swapRatio: "For 50ml Fresh Cream → Use 40g Blanched Green Pea Mash + 10ml Warm Water",
      tasteImpact: "98% Sensory Match. Natural sweetness balances spinach bitterness with zero cream required.",
      textureImpact: "Silkier emulsion with natural pectin body and radiant chlorophyll color.",
      humanTasteValidation: {
        score: "9.7 / 10",
        verifiedCooks: 104,
        agreementPercent: "96% preferred the naturally sweet and vibrant finish",
        badge: "HTV Verified Gold"
      },
      replacedItems: [
        { original: "Heavy Cream (50ml)", replacedWith: "Blanched Sweet Pea Puree", reason: "Maintains natural sweet green depth and saves ₹50 per plate", tasteMatch: "98%" }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "Clean Fit Palak Tofu Puree",
      calorieDrop: 160,
      newCalories: 270,
      newMacros: { protein: 24, carbs: 12, fat: 14, fiber: 8 },
      caloriePercent: "-37%",
      description: "Uses air-fried high-protein organic tofu and skips finishing butter entirely.",
      humanTasteValidation: {
        score: "9.5 / 10",
        verifiedCooks: 71,
        agreementPercent: "93% loved the refreshing garlic-spinach profile"
      },
      replacedItems: [
        { original: "Malai Paneer Cubes (140g)", replacedWith: "Firm Organic Tofu Cubes", calorieSaving: "-110 kcal" },
        { original: "Cooking Butter (1 tbsp)", replacedWith: "Garlic Olive Mist", calorieSaving: "-50 kcal" }
      ]
    },
    veganOption: {
      active: false,
      title: "100% Plant-Based Garlic Palak Tofu",
      description: "Naturally vegan using organic firm tofu simmered in garlic-infused spinach sauce.",
      replacedItems: [
        { original: "Dairy Paneer", replacedWith: "Pressed Organic Tofu" }
      ]
    },
    ingredients: [
      { name: "Fresh Tender Spinach Leaves", qtyPerPerson: 200, unit: "g", cost: 0.40, category: "Produce" },
      { name: "Malai Paneer Cubes", qtyPerPerson: 120, unit: "g", cost: 0.70, category: "Dairy", isReplaceable: true, replaceableType: "calorie-vegan" },
      { name: "Fresh Cooking Cream", qtyPerPerson: 40, unit: "ml", cost: 0.35, category: "Dairy", isReplaceable: true, replaceableType: "budget" },
      { name: "Garlic Cloves (Finely Minced)", qtyPerPerson: 4, unit: "cloves", cost: 0.05, category: "Produce" },
      { name: "Cumin & Green Chillies", qtyPerPerson: 1, unit: "tsp", cost: 0.10, category: "Spices" }
    ],
    steps: [
      "Blanch spinach leaves and green peas in boiling water for exactly 75 seconds, then plunge into ice water.",
      "Puree into a silkily vibrant emerald green sauce.",
      "Saute minced garlic and cumin in a pan until golden and fragrant.",
      "Pour spinach-pea puree into pan, gently folding in paneer cubes over low heat.",
      "Simmer for only 2 minutes to preserve vibrant color and nutrients; serve warm."
    ],
    reviews: [
      {
        id: "palak-rev-1",
        author: "Ananya Deshmukh",
        cafeName: "Green Leaf Cafe, Pune",
        rating: 5,
        date: "6 days ago",
        verifiedCafe: true,
        text: "The ice-shocked pea puree method keeps our palak looking radiant green under display heat lamps all evening.",
        photo: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80",
        helpfulCount: 41
      }
    ]
  },
  {
    id: "kashmiri-dum-aloo",
    title: "Kashmiri Shahi Dum Aloo",
    category: "Cafe & Bistro Curries",
    tagline: "Baby potatoes steeped in fennel & dry ginger gravy, perfected when Kashmiri degi mirch is scarce.",
    isMostSearched: false,
    rating: 4.89,
    reviewsCount: 94,
    image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&auto=format&fit=crop&q=80",
    prepTime: "15 mins",
    cookTime: "25 mins",
    difficulty: "Medium",
    dietary: ["Vegetarian", "Gluten-Free"],
    basePortionPersons: 1,
    baseCostPerPerson: 1.10,
    suggestedRetailPrice: 5.50,
    baseCalories: 380,
    baseMacros: { protein: 8, carbs: 54, fat: 15, fiber: 7 },
    budgetAlternative: {
      active: false,
      title: "Beetroot-Paprika Infusion (No Costly Kashmiri Chillies)",
      savingsPerPerson: 0.35,
      savingsPercent: "32%",
      newCostPerPerson: 0.75,
      description: "Extracts deep crimson natural hue from grated beetroot water and sweet smoked paprika.",
      swapRatio: "For 2 tbsp Kashmiri Chilli → Use 1 tbsp Paprika + 15ml Beetroot Liquor",
      tasteImpact: "98% Sensory Match. Clean warmth with signature fennel-ginger foundation.",
      textureImpact: "Silky curd-based gravy thoroughly permeating pierced potatoes.",
      humanTasteValidation: {
        score: "9.7 / 10",
        verifiedCooks: 76,
        agreementPercent: "95% found the crimson tone and mild warmth indistinguishable",
        badge: "HTV Verified Gold"
      },
      replacedItems: [
        { original: "Imported Kashmiri Whole Mirch", replacedWith: "Smoked Paprika & Beetroot Color Glaze", reason: "Saves ₹30 per portion without artificial red food coloring", tasteMatch: "98%" }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "Air-Crisped Baby Potato Dum Aloo",
      calorieDrop: 140,
      newCalories: 240,
      newMacros: { protein: 9, carbs: 46, fat: 4, fiber: 7 },
      caloriePercent: "-37%",
      description: "Air-fries poked baby potatoes instead of deep oil frying, simmered in low-fat whisked curd.",
      humanTasteValidation: {
        score: "9.4 / 10",
        verifiedCooks: 58,
        agreementPercent: "91% praised the crisp outer skin and guilt-free sauce"
      },
      replacedItems: [
        { original: "Deep-Frying Oil (3 tbsp)", replacedWith: "Air-Frying with Light Mustard Spray", calorieSaving: "-140 kcal" }
      ]
    },
    veganOption: {
      active: false,
      title: "Cashew-Curd Kashmiri Dum Aloo",
      description: "Dairy-free version using fermented cashew curd whipped with dry ginger and fennel.",
      replacedItems: [
        { original: "Dairy Yogurt", replacedWith: "Fermented Cashew Yogurt" }
      ]
    },
    ingredients: [
      { name: "Peeled Baby Potatoes (Pricked)", qtyPerPerson: 180, unit: "g", cost: 0.35, category: "Produce" },
      { name: "Whisked Fresh Yogurt (Dahi)", qtyPerPerson: 100, unit: "g", cost: 0.30, category: "Dairy", isReplaceable: true, replaceableType: "vegan" },
      { name: "Kashmiri Chilli & Fennel Powder (Saunf)", qtyPerPerson: 1.5, unit: "tbsp", cost: 0.25, category: "Spices", isReplaceable: true, replaceableType: "budget" },
      { name: "Dry Ginger Powder (Sonth)", qtyPerPerson: 0.5, unit: "tsp", cost: 0.10, category: "Spices" },
      { name: "Mustard Oil", qtyPerPerson: 1, unit: "tbsp", cost: 0.10, category: "Produce", isReplaceable: true, replaceableType: "calorie" }
    ],
    steps: [
      "Prick baby potatoes thoroughly with a fork and air-fry or shallow roast until golden.",
      "Whisk yogurt with fennel powder, dry ginger, and paprika-beetroot crimson infusion.",
      "Heat mustard oil to smoking point, cool slightly, then stir in asafoetida and spices.",
      "Gradually add the whisked yogurt mixture on low flame, stirring continuously to prevent splitting.",
      "Add potatoes, seal with lid, and slow-cook on dum for 12 minutes to infuse flavours."
    ],
    reviews: [
      {
        id: "aloo-rev-1",
        author: "Rahul Kaul",
        cafeName: "Sheen Kashmiri Bistro, Jammu",
        rating: 5,
        date: "1 week ago",
        verifiedCafe: true,
        text: "The beetroot-paprika color method is pure culinary genius—brilliant ruby red color without synthetic dyes.",
        photo: "https://images.unsplash.com/photo-1546833998-877b37c2e5c4?w=600&auto=format&fit=crop&q=80",
        helpfulCount: 35
      }
    ]
  },
  {
    id: "coastal-malabar-paneer",
    title: "Malabar Coconut Curry with Paneer",
    category: "Cafe & Bistro Curries",
    tagline: "Fragrant Kerala curry, re-engineered when fresh grated coconut or coconut milk is unavailable.",
    isMostSearched: false,
    rating: 4.91,
    reviewsCount: 102,
    image: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=800&auto=format&fit=crop&q=80",
    prepTime: "12 mins",
    cookTime: "15 mins",
    difficulty: "Easy",
    dietary: ["Vegetarian", "Gluten-Free"],
    basePortionPersons: 1,
    baseCostPerPerson: 1.70,
    suggestedRetailPrice: 6.80,
    baseCalories: 460,
    baseMacros: { protein: 20, carbs: 18, fat: 35, fiber: 6 },
    budgetAlternative: {
      active: false,
      title: "Desiccated Coconut Steep & Oat Milk Silk (No Canned Coconut Milk)",
      savingsPerPerson: 0.65,
      savingsPercent: "38%",
      newCostPerPerson: 1.05,
      description: "Steeps inexpensive dry bakery desiccated coconut in warm oat milk to extract fresh coconut creaminess without canned milk cost.",
      swapRatio: "For 150ml canned coconut milk → Use 40g desiccated coconut blended with 110ml warm oat milk",
      tasteImpact: "98% Sensory Match. Captures pristine tropical coconut aroma and sweetness.",
      textureImpact: "Velvety, smooth, doesn't split under high tamarind acid.",
      humanTasteValidation: {
        score: "9.8 / 10",
        verifiedCooks: 88,
        agreementPercent: "97% couldn't differentiate from fresh Kerala first-press coconut milk",
        badge: "HTV Verified Gold"
      },
      replacedItems: [
        { original: "Canned Coconut Milk (150ml)", replacedWith: "Steeped Desiccated Coconut & Oat Emulsion", reason: "Saves ₹55 per bowl; zero metallic can taste", tasteMatch: "98%" }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "Light Malabar Tofu Curry",
      calorieDrop: 170,
      newCalories: 290,
      newMacros: { protein: 22, carbs: 16, fat: 15, fiber: 7 },
      caloriePercent: "-37%",
      description: "Utilizes organic firm tofu cubes in a lightened coconut-vegetable broth with curry leaves.",
      humanTasteValidation: {
        score: "9.5 / 10",
        verifiedCooks: 64,
        agreementPercent: "92% enjoyed the light, aromatic broth"
      },
      replacedItems: [
        { original: "Full Fat Paneer & Rich Coconut Cream", replacedWith: "Light Coconut Broth & Seared Tofu", calorieSaving: "-170 kcal" }
      ]
    },
    veganOption: {
      active: false,
      title: "Authentic Coastal Vegan Malabar Curry",
      description: "Naturally plant-based when prepared with tofu or vegetable medley.",
      replacedItems: [
        { original: "Dairy Paneer", replacedWith: "Pressed Organic Tofu" }
      ]
    },
    ingredients: [
      { name: "Fresh Paneer or Tofu Cubes", qtyPerPerson: 130, unit: "g", cost: 0.75, category: "Dairy", isReplaceable: true, replaceableType: "calorie-vegan" },
      { name: "Canned / Fresh Coconut Milk", qtyPerPerson: 140, unit: "ml", cost: 0.55, category: "Pantry", isReplaceable: true, replaceableType: "budget" },
      { name: "Fresh Curry Leaves & Shallots", qtyPerPerson: 1, unit: "handful", cost: 0.15, category: "Produce" },
      { name: "Mustard Seeds, Fenugreek & Kokum", qtyPerPerson: 1, unit: "tsp", cost: 0.15, category: "Spices" },
      { name: "Coconut Oil", qtyPerPerson: 1, unit: "tbsp", cost: 0.10, category: "Produce", isReplaceable: true, replaceableType: "calorie" }
    ],
    steps: [
      "Splutter mustard seeds and fenugreek in warm coconut oil with crisp curry leaves.",
      "Saute sliced shallots and green chillies until translucent and sweet.",
      "Blend steeped desiccated coconut and oat milk into a smooth ivory cream.",
      "Add turmeric and kokum or tamarind water to develop the signature tangy profile.",
      "Pour in the coconut emulsion, add paneer or tofu cubes, and simmer for 3 minutes before taking off flame."
    ],
    reviews: [
      {
        id: "malabar-rev-1",
        author: "Siddharth Nair",
        cafeName: "Backwater Coast Bistro, Kochi",
        rating: 5,
        date: "4 days ago",
        verifiedCafe: true,
        text: "The desiccated coconut steep technique gave our cafe the freshness of morning grated coconut without kitchen prep time.",
        photo: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=600&auto=format&fit=crop&q=80",
        helpfulCount: 47
      }
    ]
  },
  {
    id: "methi-matar-malai",
    title: "Methi Matar Malai Royale",
    category: "Cafe & Bistro Curries",
    tagline: "Fenugreek and sweet green pea delicacy, formulated when dairy fresh malai is out of stock.",
    isMostSearched: false,
    rating: 4.88,
    reviewsCount: 88,
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=80",
    prepTime: "12 mins",
    cookTime: "14 mins",
    difficulty: "Medium",
    dietary: ["Vegetarian", "Gluten-Free"],
    basePortionPersons: 1,
    baseCostPerPerson: 1.50,
    suggestedRetailPrice: 6.20,
    baseCalories: 450,
    baseMacros: { protein: 14, carbs: 26, fat: 32, fiber: 8 },
    budgetAlternative: {
      active: false,
      title: "Sunflower Seed & Milk Velvet (No Heavy Cream / Malai)",
      savingsPerPerson: 0.55,
      savingsPercent: "37%",
      newCostPerPerson: 0.95,
      description: "Replaces high-priced cashew paste and dairy malai with toasted sunflower seed puree and warm toned milk.",
      swapRatio: "For 70g Cream → Use 40g Soaked Sunflower Seed Butter + 30ml Milk",
      tasteImpact: "97% Sensory Match. Silky nutty finish perfectly balancing bitter fresh fenugreek.",
      textureImpact: "Glossy ivory sauce coating each pea evenly.",
      humanTasteValidation: {
        score: "9.7 / 10",
        verifiedCooks: 72,
        agreementPercent: "95% found the balance of bitterness and sweetness flawless",
        badge: "HTV Verified Gold"
      },
      replacedItems: [
        { original: "Fresh Dairy Malai / Cream (70g)", replacedWith: "Toasted Sunflower Seed Emulsion", reason: "Saves ₹45 per cover with zero heaviness", tasteMatch: "97%" }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "Slim Methi Matar with Greek Yogurt Silk",
      calorieDrop: 170,
      newCalories: 280,
      newMacros: { protein: 16, carbs: 24, fat: 12, fiber: 9 },
      caloriePercent: "-38%",
      description: "Uses whisked strained curd and green pea puree instead of butter and heavy cream.",
      humanTasteValidation: {
        score: "9.4 / 10",
        verifiedCooks: 56,
        agreementPercent: "92% enjoyed the clean, herbal finish"
      },
      replacedItems: [
        { original: "Heavy Cream (70g)", replacedWith: "Strained Greek Yogurt & Milk Velvet", calorieSaving: "-170 kcal" }
      ]
    },
    veganOption: {
      active: false,
      title: "Vegan Methi Matar with Almond Cream",
      description: "Fenugreek leaves and sweet peas folded into aromatic almond-cashew silk.",
      replacedItems: [
        { original: "Dairy Malai", replacedWith: "Almond-Cashew Emulsion" }
      ]
    },
    ingredients: [
      { name: "Fresh Fenugreek Leaves (Methi)", qtyPerPerson: 80, unit: "g chopped", cost: 0.25, category: "Herbs" },
      { name: "Sweet Green Peas (Matar)", qtyPerPerson: 90, unit: "g", cost: 0.30, category: "Produce" },
      { name: "Fresh Dairy Malai / Cream", qtyPerPerson: 60, unit: "g", cost: 0.55, category: "Dairy", isReplaceable: true, replaceableType: "budget-calorie-vegan" },
      { name: "Onion, Ginger & Green Chilli Puree", qtyPerPerson: 60, unit: "g", cost: 0.25, category: "Produce" },
      { name: "Garam Masala & Green Cardamom", qtyPerPerson: 0.5, unit: "tsp", cost: 0.15, category: "Spices" }
    ],
    steps: [
      "Saute chopped fenugreek leaves in a dry skillet with a pinch of salt to draw out excess bitterness.",
      "Cook onion-ginger-cardamom paste gently until fragrant and translucent.",
      "Whisk your sunflower seed puree or cream substitute into warm milk until micro-smooth.",
      "Add boiled sweet green peas and the sauteed methi leaves into the aromatic base.",
      "Gently incorporate the cream alternative on low flame, simmer for 3 minutes, and serve warm with rotis."
    ],
    reviews: [
      {
        id: "methi-rev-1",
        author: "Pooja Chhabra",
        cafeName: "Saffron Spices Bistro, Indore",
        rating: 5,
        date: "1 week ago",
        verifiedCafe: true,
        text: "The sunflower seed puree is a game-changer. Nutty, velvety, and cut our kitchen sauce prep cost by 37%.",
        photo: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&auto=format&fit=crop&q=80",
        helpfulCount: 38
      }
    ]
  },
  {
    id: "kadai-paneer-bistro",
    title: "Smoky Bistro Kadai Paneer",
    category: "Cafe & Bistro Curries",
    tagline: "Crunchy bell peppers & paneer tossed with freshly pounded coriander & dry red chillies.",
    isMostSearched: true,
    rating: 4.95,
    reviewsCount: 160,
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&auto=format&fit=crop&q=80",
    prepTime: "10 mins",
    cookTime: "15 mins",
    difficulty: "Easy",
    dietary: ["Vegetarian", "Gluten-Free"],
    basePortionPersons: 1,
    baseCostPerPerson: 1.85,
    suggestedRetailPrice: 7.20,
    baseCalories: 490,
    baseMacros: { protein: 23, carbs: 19, fat: 36, fiber: 6 },
    budgetAlternative: {
      active: false,
      title: "Toasted Coriander-Fennel Bloom & Tomato Reduction (No Costly Specialty Pastes)",
      savingsPerPerson: 0.55,
      savingsPercent: "30%",
      newCostPerPerson: 1.30,
      description: "Replaces commercial bottled kadai pastes with hand-crushed whole seeds bloomed in hot oil for instant aroma release.",
      swapRatio: "For 2 tbsp jarred Kadai paste → Use 1 tbsp freshly roasted whole coriander & black pepper",
      tasteImpact: "99% Sensory Match. Robust rustic aroma with crisp vegetable crunch.",
      textureImpact: "Coating gravy that clings tightly to seared paneer cubes.",
      humanTasteValidation: {
        score: "9.9 / 10",
        verifiedCooks: 130,
        agreementPercent: "98% preferred the freshly crushed whole spice bloom",
        badge: "HTV Verified Gold"
      },
      replacedItems: [
        { original: "Commercial Kadai Gravy Base", replacedWith: "Freshly Roasted Spice Bloom & Tomato Glaze", reason: "Saves ₹45 per cover while delivering fresh, smoky zest", tasteMatch: "99%" }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "Air-Seared Fit Kadai Paneer",
      calorieDrop: 160,
      newCalories: 330,
      newMacros: { protein: 26, carbs: 16, fat: 18, fiber: 7 },
      caloriePercent: "-33%",
      description: "Air-sears paneer and peppers with 1 tsp cold-pressed oil, maintaining vegetable crunch and protein density.",
      humanTasteValidation: {
        score: "9.6 / 10",
        verifiedCooks: 85,
        agreementPercent: "94% loved the crisp texture without greasy aftertaste"
      },
      replacedItems: [
        { original: "Deep Sauté Oil (2.5 tbsp)", replacedWith: "Air-Sear with Spice Mist", calorieSaving: "-160 kcal" }
      ]
    },
    veganOption: {
      active: false,
      title: "100% Plant-Based Kadai Tofu",
      description: "Firm tofu seared with bell peppers and whole cracked coriander.",
      replacedItems: [
        { original: "Dairy Paneer", replacedWith: "Firm Organic Tofu" }
      ]
    },
    ingredients: [
      { name: "Malai Paneer Cubes", qtyPerPerson: 150, unit: "g", cost: 0.90, category: "Dairy", isReplaceable: true, replaceableType: "calorie-vegan" },
      { name: "Crisp Green & Red Bell Peppers", qtyPerPerson: 80, unit: "g diced", cost: 0.35, category: "Produce" },
      { name: "Ripe Tomato & Onion Reduction", qtyPerPerson: 100, unit: "ml", cost: 0.30, category: "Produce" },
      { name: "Kadai Masala (Cracked Coriander & Pepper)", qtyPerPerson: 1, unit: "tbsp", cost: 0.15, category: "Spices" },
      { name: "Refined Oil or Ghee", qtyPerPerson: 1.5, unit: "tbsp", cost: 0.15, category: "Produce", isReplaceable: true, replaceableType: "calorie" }
    ],
    steps: [
      "In a traditional iron wok (kadai), heat oil until lightly smoking.",
      "Flash-sear diced onions and bell peppers for 90 seconds to retain crisp crunch.",
      "Add freshly crushed coriander seeds, Kashmiri chillies, and ginger juliennes.",
      "Pour in tomato reduction and toss paneer cubes briskly to coat without breaking.",
      "Finish with fresh cilantro leaves and serve immediately with hot butter naan."
    ],
    reviews: [
      {
        id: "kadai-rev-1",
        author: "Manish Rawat",
        cafeName: "Flavours of Punjab, Gurugram",
        rating: 5,
        date: "2 days ago",
        verifiedCafe: true,
        text: "The freshly bloomed coriander spice swap brings out a restaurant-grade wok aroma that customers love.",
        photo: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&auto=format&fit=crop&q=80",
        helpfulCount: 51
      }
    ]
  },
  {
    id: "masala-chai-bistro",
    title: "Artisan Karak Masala Chai",
    category: "Coffee & Drinks",
    tagline: "Slow-brewed spiced milk tea, formulated with FlavorShift AI for when whole spices or full-cream milk are missing.",
    isMostSearched: true,
    rating: 4.98,
    reviewsCount: 220,
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80",
    prepTime: "3 mins",
    cookTime: "7 mins",
    difficulty: "Easy",
    dietary: ["Vegetarian", "Gluten-Free"],
    basePortionPersons: 1,
    baseCostPerPerson: 0.35,
    suggestedRetailPrice: 2.20,
    baseCalories: 140,
    baseMacros: { protein: 4, carbs: 18, fat: 6, fiber: 0 },
    budgetAlternative: {
      active: false,
      title: "Whole Spice Decoction & Toned Milk (No Costly Specialty Syrups)",
      savingsPerPerson: 0.12,
      savingsPercent: "34%",
      newCostPerPerson: 0.23,
      description: "Replaces commercial pre-mixed chai syrups with a concentrated ginger-cardamom-cinnamon boiled reduction and dairy-toned milk.",
      swapRatio: "For 30ml Chai Syrup → Use 1 crushed green cardamom pod + slice of fresh ginger + 1 pinch cinnamon",
      tasteImpact: "100% Sensory Match. Natural invigorating warmth without artificial sugary aftertaste.",
      textureImpact: "Velvety, frothy top with creamy authentic mouthfeel.",
      humanTasteValidation: {
        score: "10 / 10",
        verifiedCooks: 180,
        agreementPercent: "99% preferred this fresh brew over processed chai concentrate",
        badge: "HTV Verified Gold"
      },
      replacedItems: [
        { original: "Commercial Bottled Chai Syrup", replacedWith: "Fresh Ginger & Green Cardamom Simmer", reason: "Saves ₹10 per cup; completely natural flavor", tasteMatch: "100%" }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "Slim Spiced Chai with Stevia & Skim Milk",
      calorieDrop: 80,
      newCalories: 60,
      newMacros: { protein: 4, carbs: 8, fat: 1, fiber: 0 },
      caloriePercent: "-57%",
      description: "Replaces granulated white sugar and full-fat buffalo milk with skim milk and natural stevia leaf extract.",
      humanTasteValidation: {
        score: "9.6 / 10",
        verifiedCooks: 110,
        agreementPercent: "95% delighted by warming spices without sugar crash"
      },
      replacedItems: [
        { original: "Refined White Sugar (2 tsp)", replacedWith: "Natural Stevia Leaf Drops", calorieSaving: "-32 kcal" },
        { original: "Full Fat Milk (100ml)", replacedWith: "Skimmed Milk", calorieSaving: "-48 kcal" }
      ]
    },
    veganOption: {
      active: false,
      title: "Creamy Oat-Milk Masala Chai",
      description: "Brewed with premium barista oat milk that foams and clings identically to dairy milk.",
      replacedItems: [
        { original: "Dairy Milk", replacedWith: "Barista Oat Milk" }
      ]
    },
    ingredients: [
      { name: "Strong Assam CTC Black Tea", qtyPerPerson: 1.5, unit: "tsp", cost: 0.10, category: "Pantry" },
      { name: "Fresh Dairy Milk", qtyPerPerson: 100, unit: "ml", cost: 0.12, category: "Dairy", isReplaceable: true, replaceableType: "budget-calorie-vegan" },
      { name: "Fresh Ginger & Cardamom", qtyPerPerson: 1, unit: "crushed piece", cost: 0.08, category: "Produce" },
      { name: "Cinnamon & Clove", qtyPerPerson: 0.5, unit: "pinch", cost: 0.03, category: "Spices" },
      { name: "Raw Cane Sugar or Jaggery", qtyPerPerson: 1.5, unit: "tsp", cost: 0.02, category: "Sweetener", isReplaceable: true, replaceableType: "calorie" }
    ],
    steps: [
      "Crush fresh ginger and cardamom pods in a mortar to release volatile aromatic oils.",
      "Bring water to a rolling boil with the crushed spices and let steep for 2 minutes.",
      "Add strong Assam CTC black tea and simmer for 60 seconds until a deep amber liquor forms.",
      "Pour in fresh milk (or barista oat milk for vegan mode) and bring to a gentle frothing boil twice.",
      "Strain through a fine sieve into an artisan clay kulhad or ceramic mug and serve steaming hot."
    ],
    reviews: [
      {
        id: "chai-rev-1",
        author: "Tanvi Sharma",
        cafeName: "Chai Story Cafe, New Delhi",
        rating: 5,
        date: "Yesterday",
        verifiedCafe: true,
        text: "The freshly crushed spice ratio completely elevated our daily orders. Zero need for expensive pre-made concentrates.",
        photo: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80",
        helpfulCount: 78
      }
    ]
  }
];

// Interactive FlavorShift AI Substitution Database for the Instant Swap Lab
const FLAVORSHIFT_SWAP_DATABASE = [
  {
    targetIngredient: "Fresh Cream",
    commonInDishes: ["Paneer Butter Masala", "Dal Makhani", "Pasta Alfredo", "Cream of Tomato Soup"],
    reasonForSwap: "High cost, short shelf-life, or out of stock in fridge",
    alternatives: [
      {
        name: "Soaked Cashew & Warm Milk Puree",
        type: "Best Taste & Texture Match",
        ratio: "100g Cream = 60g Cashew Paste + 40g Milk",
        tasteScore: "98% Match",
        tasteDesc: "Rich, nutty sweetness with identical makhani buttery notes.",
        textureDesc: "Micro-smooth, stable emulsion that doesn't split under high heat.",
        costChange: "-55% Cost",
        calChange: "-12% Calories",
        htvScore: "9.8 / 10 (142 validations)"
      },
      {
        name: "Whisked Fresh Malai & Hung Curd",
        type: "Budget & Household Essential",
        ratio: "100g Cream = 50g Malai + 50g Whisked Curd",
        tasteScore: "95% Match",
        tasteDesc: "Pleasant dairy creaminess with subtle tangy lift.",
        textureDesc: "Glossy and rich; blend off-heat to preserve gloss.",
        costChange: "-65% Cost",
        calChange: "-18% Calories",
        htvScore: "9.6 / 10 (98 validations)"
      },
      {
        name: "Strained Greek Yogurt & Silken Tofu Puree",
        type: "Low-Calorie / Fit-Bistro",
        ratio: "100g Cream = 70g Greek Yogurt + 30g Blanched Tofu",
        tasteScore: "91% Match",
        tasteDesc: "Light, clean savory taste with zero greasy heaviness.",
        textureDesc: "Velvety smooth; simmer on lowest flame.",
        costChange: "-40% Cost",
        calChange: "-58% Calories (High Protein)",
        htvScore: "9.4 / 10 (76 validations)"
      }
    ]
  },
  {
    targetIngredient: "Mascarpone Cheese",
    commonInDishes: ["Tiramisu", "Cheesecake", "Creamy Polenta"],
    reasonForSwap: "Extremely expensive imported dairy product",
    alternatives: [
      {
        name: "Hung Farmhouse Curd + Heavy Cream (50/50)",
        type: "Best Taste & Texture Match",
        ratio: "100g Mascarpone = 50g Hung Curd + 50g Whipped Cream",
        tasteScore: "97% Match",
        tasteDesc: "Delicate dairy richness with authentic refreshing tang.",
        textureDesc: "Thick, spreadable, pipeable consistency.",
        costChange: "-58% Cost",
        calChange: "-22% Calories",
        htvScore: "9.7 / 10 (112 validations)"
      },
      {
        name: "Whipped Fresh Ricotta + Butter",
        type: "Budget-Saver Alternative",
        ratio: "100g Mascarpone = 80g Ricotta + 20g Melted Butter",
        tasteScore: "93% Match",
        tasteDesc: "Milky, smooth, and mild.",
        textureDesc: "Silky after 60 seconds food processor whip.",
        costChange: "-45% Cost",
        calChange: "-15% Calories",
        htvScore: "9.4 / 10 (84 validations)"
      }
    ]
  },
  {
    targetIngredient: "Hass Avocado",
    commonInDishes: ["Avocado Toast", "Guacamole", "Green Salad Bowls"],
    reasonForSwap: "High wholesale fruit prices and rapid browning spoilage",
    alternatives: [
      {
        name: "50/50 Sweet Green Pea & Avocado Mash",
        type: "Best Taste & Texture Match",
        ratio: "1 Avocado = 1/2 Avocado + 1/2 cup Steamed Sweet Peas",
        tasteScore: "96% Match",
        tasteDesc: "Vibrant, buttery, garden-fresh savory bite.",
        textureDesc: "Thick rustic mash that stays bright green for 24 hours.",
        costChange: "-43% Cost",
        calChange: "-35% Calories",
        htvScore: "9.7 / 10 (114 validations)"
      },
      {
        name: "Edamame & Lime Herb Puree",
        type: "High-Protein / Low-Cost",
        ratio: "1 Avocado = 1 cup Shelled Steamed Edamame",
        tasteScore: "92% Match",
        tasteDesc: "Clean, nutty, and savory.",
        textureDesc: "Velvety smooth paste.",
        costChange: "-52% Cost",
        calChange: "+14g Protein / -25% Calories",
        htvScore: "9.3 / 10 (68 validations)"
      }
    ]
  },
  {
    targetIngredient: "Black Truffle Oil",
    commonInDishes: ["Wild Mushroom Fettuccine", "Truffle Fries", "Risotto"],
    reasonForSwap: "Overpriced, synthetic chemical perfume",
    alternatives: [
      {
        name: "Steeped Porcini Mushroom Broth & Brown Garlic Butter",
        type: "Best Taste & Texture Match",
        ratio: "1 tsp Truffle Oil = 1 tbsp Concentrated Porcini Broth + 1 tsp Brown Butter",
        tasteScore: "98% Match",
        tasteDesc: "Authentic forest umami with deep toasted garlic undertones.",
        textureDesc: "Glossy sauce coat with natural mushroom clinging power.",
        costChange: "-62% Cost",
        calChange: "Equivalent",
        htvScore: "9.9 / 10 (136 validations)"
      }
    ]
  },
  {
    targetIngredient: "Pine Nuts",
    commonInDishes: ["Basil Pesto Pasta", "Mezze Bowls", "Salads"],
    reasonForSwap: "Exorbitant ingredient price (₹3,000+/kg)",
    alternatives: [
      {
        name: "Toasted Sunflower Seeds & Toasted Walnuts",
        type: "Best Taste & Texture Match",
        ratio: "50g Pine Nuts = 30g Sunflower Seeds + 20g Walnuts",
        tasteScore: "97% Match",
        tasteDesc: "Toasted nutty warmth with zero bitterness.",
        textureDesc: "Emulsifies into green pesto with identical creamy emulsion.",
        costChange: "-74% Cost",
        calChange: "-8% Calories",
        htvScore: "9.8 / 10 (94 validations)"
      }
    ]
  }
];

// Pre-filled Pantry Staples for 1-click selection
const PREFILLED_PANTRY_STAPLES = [
  { name: "Paneer / Tofu", category: "Dairy/Plant", icon: "🧀" },
  { name: "Fresh Cream / Malai", category: "Dairy", icon: "🥛" },
  { name: "Cashews / Nuts", category: "Dry Fruits", icon: "🥜" },
  { name: "Greek Yogurt / Curd", category: "Dairy", icon: "🥣" },
  { name: "Tomatoes / Puree", category: "Produce", icon: "🍅" },
  { name: "Butter / Ghee", category: "Dairy", icon: "🧈" },
  { name: "Avocados", category: "Produce", icon: "🥑" },
  { name: "Sourdough / Bread", category: "Bakery", icon: "🍞" },
  { name: "Fettuccine / Pasta", category: "Grains", icon: "🍝" },
  { name: "Cremini Mushrooms", category: "Produce", icon: "🍄" },
  { name: "Kasuri Methi & Spices", category: "Spices", icon: "🌿" },
  { name: "Cream Cheese", category: "Bakery", icon: "🍰" }
];

// Design Thinking Slides for FlavorShift AI & Human Taste Validation
const DESIGN_THINKING_SLIDES = [
  {
    slideNumber: 1,
    stage: "Design Thinking Overview",
    title: "FlavorShift AI: Zero-Compromise Culinary Ingredient Alternatives",
    subtitle: "Empowering cooks & food operators when key ingredients are missing or overpriced",
    accentColor: "from-amber-500 to-orange-500",
    badge: "Stage 01: Context",
    icon: "compass",
    points: [
      {
        title: "The Missing Ingredient Crisis",
        desc: "Cooking stops when an ingredient like fresh cream, mascarpone, or pine nuts is absent or too costly. Cooks either abandon dishes or end up with ruined taste."
      },
      {
        title: "The FlavorShift AI Breakthrough",
        desc: "An AI culinary engine that predicts exact replacement ratios, models taste & texture compatibility, and ensures cost and calorie balance."
      },
      {
        title: "Human Taste Validation (HTV)",
        desc: "AI recommendations are validated through verified real-kitchen tests by chefs and home cooks so users cook with 100% confidence."
      }
    ],
    metric: { value: "98.2%", label: "Average Human Taste Validation Score across 142 Kitchen Tests" }
  },
  {
    slideNumber: 2,
    stage: "Stage 1: Empathize",
    title: "Listening to Kitchen Operators & Home Cooks",
    subtitle: "Field interviews revealing real cooking friction with missing ingredients",
    accentColor: "from-blue-500 to-cyan-500",
    badge: "Stage 02: Empathy",
    icon: "users",
    points: [
      {
        title: "Persona: Chef-Cook (Paneer Butter Masala)",
        desc: "'I'm in the middle of cooking Paneer Butter Masala and find no fresh cream in the fridge. Substituting blindly with milk makes the gravy watery and acidic.'"
      },
      {
        title: "Persona: Cloud Kitchen Manager",
        desc: "'Dairy cream prices rose 30% this season. We need an alternative that cuts cost without customers complaining about lack of richness.'"
      },
      {
        title: "Key Empathy Finding",
        desc: "Users don't just want a list of substitutes; they need: 1) Exact conversion ratios, 2) Expected taste & texture changes, and 3) Community proof from real cooks."
      }
    ],
    metric: { value: "73%", label: "Home cooks who compromise dish quality or give up when missing 1 ingredient" }
  },
  {
    slideNumber: 3,
    stage: "Stage 2: Define",
    title: "Core Problem Statements & HMW Questions",
    subtitle: "Framing the culinary substitution challenge into actionable product modules",
    accentColor: "from-emerald-500 to-teal-500",
    badge: "Stage 03: Define",
    icon: "target",
    points: [
      {
        title: "HMW #1: Predict Exact Replacement Quantity & Ratios?",
        desc: "How might we tell cooks precisely how many grams of cashew paste and milk replace 100ml of fresh cream so the sauce consistency is perfect?"
      },
      {
        title: "HMW #2: Analyze Flavor Compatibility & Texture?",
        desc: "How might we model fat emulsion, sweetness, umami, and mouthfeel so the alternative dish tastes indistinguishable from the original?"
      },
      {
        title: "HMW #3: Prove Quality via Human Taste Validation?",
        desc: "How might we build an empirical feedback loop where verified kitchen trials score the substitute's taste, sweetness, and consistency?"
      }
    ],
    metric: { value: "0% Compromise", label: "FlavorShift Core Benchmark for Taste & Texture Match" }
  },
  {
    slideNumber: 4,
    stage: "Stage 3: Ideate",
    title: "The FlavorShift AI Engine Architecture",
    subtitle: "Three pillars powering intelligent culinary substitutions",
    accentColor: "from-purple-500 to-pink-500",
    badge: "Stage 04: Ideate",
    icon: "lightbulb",
    points: [
      {
        title: "Pillar 1: Flavor & Texture Compatibility Engine",
        desc: "Analyzes ingredient moisture content, fat emulsion properties, and aromatic compounds to generate the closest possible taste match."
      },
      {
        title: "Pillar 2: Multi-Objective Optimization (Cost vs Calorie)",
        desc: "Generates tailored paths: a Best Taste Match, a Budget-Saver Alternative (cutting cost 55%), and a Low-Calorie Fit Alternative."
      },
      {
        title: "Pillar 3: Human Taste Validation (HTV) Protocol",
        desc: "Crowdsourced blind taste ratings from real kitchens that validate AI suggestions before they become trusted presets."
      }
    ],
    metric: { value: "55% Savings", label: "Average Food Cost Drop per Recipe with FlavorShift Alternatives" }
  },
  {
    slideNumber: 5,
    stage: "Stage 4: Prototype",
    title: "FlavorShift AI Platform & Interactive Swap Lab",
    subtitle: "Turning substitution science into an intuitive, instant culinary companion",
    accentColor: "from-amber-500 to-rose-500",
    badge: "Stage 05: Prototype",
    icon: "layout",
    points: [
      {
        title: "Instant AI Swap Lab",
        desc: "Select any dish and any missing/expensive ingredient to instantly receive tested alternative options with exact conversion measurements."
      },
      {
        title: "Sequential Recipe Re-Writer",
        desc: "Dynamically updates cooking instructions to show exactly when and how to blend and incorporate the alternative ingredient."
      },
      {
        title: "Live HTV Rating & Proof Cards",
        desc: "Displays real photos and community taste validation scores right on the recipe card."
      }
    ],
    metric: { value: "< 1 Sec", label: "Instant Alternative Ratio & Taste Analysis Speed" }
  },
  {
    slideNumber: 6,
    stage: "Stage 5: Test & Validate",
    title: "Kitchen Validation Pilot Results",
    subtitle: "Real-world testing across 142 kitchen sessions with home cooks & cafe chefs",
    accentColor: "from-green-500 to-emerald-600",
    badge: "Stage 06: Test & Impact",
    icon: "check-circle",
    points: [
      {
        title: "97.4% Taste Indistinguishability",
        desc: "In blind tasting of Paneer Butter Masala (Cashew-Milk vs Fresh Cream), 97% of diners could not distinguish the alternative."
      },
      {
        title: "₹55 - ₹120 Saved per Dish Batch",
        desc: "Home cooks and cafes reported major savings without sacrificing the luxurious restaurant-style texture."
      },
      {
        title: "High Adoption of Calorie-Cutter Mode",
        desc: "Health-conscious cooks loved having a tested way to slash 240 calories from classic butter masala."
      }
    ],
    metric: { value: "98.8 / 10", label: "Overall Human Taste Validation Score for Cashew Cream Makhani" }
  }
];
