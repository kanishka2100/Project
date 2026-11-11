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
    category: "Pastas & Italian",
    tagline: "Gourmet cafe pasta with rich umami, engineered for fast cafe ticket times without costly truffle oil.",
    isMostSearched: true,
    rating: 4.9,
    reviewsCount: 51,
    image: "./assets/recipes/wild-mushroom-truffle-pasta.jpg",
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
        photo: "./assets/recipes/wild-mushroom-truffle-pasta.jpg",
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
        photo: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80",
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
    image: "./assets/recipes/malabar-coconut-paneer-curry.jpg",
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
        photo: "./assets/recipes/malabar-coconut-paneer-curry.jpg",
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
    image: "./assets/recipes/artisan-karak-masala-chai.jpg",
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
        photo: "./assets/recipes/artisan-karak-masala-chai.jpg",
        helpfulCount: 78
      }
    ]
  },
  {
    id: "tandoori-garlic-butter-naan",
    title: "Tandoori Garlic Butter Naan",
    category: "Breads & Naan",
    tagline: "Restaurant-grade charred garlic naan with bubbly blisters, optimized for home kitchens without a tandoor.",
    isMostSearched: true,
    rating: 4.97,
    reviewsCount: 165,
    image: "./assets/recipes/tandoori-garlic-butter-naan.jpg",
    prepTime: "25 mins",
    cookTime: "5 mins",
    difficulty: "Medium",
    dietary: ["Vegetarian"],
    basePortionPersons: 1,
    baseCostPerPerson: 0.45,
    suggestedRetailPrice: 2.20,
    baseCalories: 290,
    baseMacros: { protein: 8, carbs: 48, fat: 9, fiber: 2 },
    budgetAlternative: {
      active: false,
      title: "Desi Ghee & Clarified Butter Blend (No High-Cost Butter Spoilage)",
      savingsPerPerson: 0.15,
      savingsPercent: "33%",
      newCostPerPerson: 0.30,
      description: "When commercial dairy butter runs out or proves too costly, FlavorShift AI uses a fragrant browned ghee wash that delivers deeper caramelized flavor.",
      swapRatio: "For every 20g Butter → Use 15g Desi Ghee brushed while piping hot",
      tasteImpact: "High Sensory Match. Authentic rustic aroma with crisp, golden bubbles.",
      textureImpact: "Soft, pillowy interior with crisp tandoori blistered crust.",
      humanTasteValidation: {
        score: "9.8 / 10",
        verifiedCooks: 112,
        agreementPercent: "Validated in kitchen taste trials",
        badge: "HTV Verified Gold"
      },
      replacedItems: [
        { original: "Imported Table Butter (20g)", replacedWith: "Farmhouse Desi Ghee Wash", reason: "Prevents sogginess, enhances tandoor aroma", tasteMatch: "High Parity" }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "Whole-Wheat Multigrain Naan (Yogurt Leavened)",
      calorieSaving: "-75 kcal",
      newCalories: 215,
      newMacros: { protein: 10, carbs: 36, fat: 4, fiber: 5 },
      description: "Replaces 60% refined all-purpose flour (maida) with fine-milled whole wheat and probiotic curd for easy digestion."
    },
    ingredients: [
      { name: "Fine All-Purpose Flour (Maida)", qtyPerPerson: 100, unit: "g flour", cost: 0.12, category: "Bakery", isReplaceable: true, replaceableType: "calorie" },
      { name: "Fresh Curd / Greek Yogurt (for leavening)", qtyPerPerson: 35, unit: "g curd", cost: 0.08, category: "Dairy" },
      { name: "Warm Milk or Water", qtyPerPerson: 40, unit: "ml liquid", cost: 0.04, category: "Dairy" },
      { name: "Fresh Minced Garlic & Coriander", qtyPerPerson: 15, unit: "g fresh", cost: 0.06, category: "Produce" },
      { name: "Salted Table Butter", qtyPerPerson: 20, unit: "g butter", cost: 0.12, category: "Dairy", isReplaceable: true, replaceableType: "budget-calorie-vegan" },
      { name: "Baking Powder & Nigella Seeds (Kalonji)", qtyPerPerson: 0.5, unit: "tsp blend", cost: 0.03, category: "Spices" }
    ],
    steps: [
      "Knead flour with yogurt, pinch of baking powder, and warm milk until a soft, elastic dough forms; rest for 20 minutes under a damp cloth.",
      "Divide into balls and stretch into classic teardrop shape; press minced garlic and kalonji seeds onto the top surface.",
      "Brush the underside lightly with water and slap onto an inverted smoking-hot cast-iron tawa until bubbles form.",
      "Flip the tawa upside down directly over high gas flame for 30 seconds to get signature tandoori leopard char blisters.",
      "Brush generously with melted garlic butter or FlavorShift ghee wash and serve piping hot."
    ],
    reviews: [
      {
        id: "naan-rev-1",
        author: "Chef Harpreet Singh",
        cafeName: "Dhaba Craft, Amritsar",
        rating: 5,
        date: "2 days ago",
        verifiedCafe: true,
        text: "The inverted tawa technique with garlic-ghee brushing gives the exact restaurant clay oven texture without requiring commercial tandoor equipment.",
        photo: "./assets/recipes/tandoori-garlic-butter-naan.jpg",
        helpfulCount: 64
      }
    ]
  },
  {
    id: "classic-penne-arrabbiata",
    title: "Classic Italian Penne all'Arrabbiata",
    category: "Pastas & Italian",
    tagline: "Vibrant Roman pasta in a fiery garlic, San Marzano tomato, and extra-virgin olive oil emulsion.",
    isMostSearched: true,
    rating: 4.93,
    reviewsCount: 138,
    image: "./assets/recipes/classic-penne-arrabbiata.jpg",
    prepTime: "8 mins",
    cookTime: "12 mins",
    difficulty: "Easy",
    dietary: ["Vegetarian", "Vegan"],
    basePortionPersons: 1,
    baseCostPerPerson: 1.35,
    suggestedRetailPrice: 6.50,
    baseCalories: 430,
    baseMacros: { protein: 14, carbs: 68, fat: 12, fiber: 6 },
    budgetAlternative: {
      active: false,
      title: "Roma Plum Tomato Puree + Sundried Tomato Paste (No Imported Canned Tomatoes)",
      savingsPerPerson: 0.55,
      savingsPercent: "40%",
      newCostPerPerson: 0.80,
      description: "When imported Italian San Marzano canned tomatoes are too expensive, FlavorShift AI blends concentrated fresh Roma tomatoes with caramelized garlic oil.",
      swapRatio: "For 150g San Marzano Canned Tomatoes → Use 120g Ripe Roma puree + 1 tsp tomato concentrate paste",
      tasteImpact: "High Sensory Match. Robust tangy sweetness with balanced heat.",
      textureImpact: "Silky emulsified sauce that coats each ribbed penne tube flawlessly.",
      humanTasteValidation: {
        score: "9.7 / 10",
        verifiedCooks: 94,
        agreementPercent: "Validated in kitchen taste trials",
        badge: "HTV Verified Gold"
      },
      replacedItems: [
        { original: "Imported San Marzano Canned Tomatoes", replacedWith: "Slow-reduced Local Roma Tomato Reduction", reason: "Saves ₹45/portion; identical natural umami", tasteMatch: "High Parity" }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "Durum Wheat & Zucchini Ribbon Penne",
      calorieSaving: "-140 kcal",
      newCalories: 290,
      newMacros: { protein: 12, carbs: 44, fat: 7, fiber: 8 },
      description: "Blends 50% al dente durum wheat penne with 50% spiralized zucchini ribbons for rich volume with half the starch."
    },
    ingredients: [
      { name: "Bronze-Cut Durum Wheat Penne", qtyPerPerson: 90, unit: "g dry pasta", cost: 0.40, category: "Grains" },
      { name: "Crushed Ripe Roma Tomatoes", qtyPerPerson: 160, unit: "g ripe tomatoes", cost: 0.35, category: "Produce", isReplaceable: true, replaceableType: "budget" },
      { name: "Extra Virgin Olive Oil", qtyPerPerson: 1.5, unit: "tablespoons", cost: 0.30, category: "Pantry" },
      { name: "Fresh Garlic Cloves (sliced)", qtyPerPerson: 3, unit: "cloves", cost: 0.10, category: "Produce" },
      { name: "Dried Red Pepper Flakes (Peperoncino)", qtyPerPerson: 0.75, unit: "tsp flakes", cost: 0.05, category: "Spices" },
      { name: "Fresh Sweet Italian Basil", qtyPerPerson: 5, unit: "fresh leaves", cost: 0.10, category: "Herbs" },
      { name: "Sea Salt & Freshly Cracked Black Pepper", qtyPerPerson: 0.5, unit: "tsp blend", cost: 0.05, category: "Spices" }
    ],
    steps: [
      "Bring heavily salted water to a rolling boil; cook penne until perfectly al dente (1 minute under package directions).",
      "In a wide skillet, gently heat extra virgin olive oil with thinly sliced garlic and crushed chili flakes until fragrant and pale golden.",
      "Pour in crushed tomato puree and simmer gently for 8 minutes until sauce thickens and oil begins to shimmer.",
      "Transfer penne directly into the sauce along with 1/4 cup starchy pasta cooking water; toss vigorously to create a glossy emulsion.",
      "Tear fresh sweet basil over the pasta, finish with a drizzle of raw olive oil, and serve hot."
    ],
    reviews: [
      {
        id: "penne-rev-1",
        author: "Marco Rossi",
        cafeName: "Bistro Trattoria, Bengaluru",
        rating: 5,
        date: "3 days ago",
        verifiedCafe: true,
        text: "Using the starchy pasta water emulsification with reduced Roma tomatoes gives the sauce an authentic cling without needing butter or sugar.",
        photo: "./assets/recipes/classic-penne-arrabbiata.jpg",
        helpfulCount: 52
      }
    ]
  },
  {
    id: "hakka-street-style-noodles",
    title: "Chili-Garlic Veg Hakka Noodles",
    category: "Noodles & Wok",
    tagline: "High-heat wok-tossed noodles with shredded crunchy vegetables, toasted garlic, and dark scallion oil.",
    isMostSearched: true,
    rating: 4.95,
    reviewsCount: 148,
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&auto=format&fit=crop&q=80",
    prepTime: "12 mins",
    cookTime: "6 mins",
    difficulty: "Easy",
    dietary: ["Vegetarian", "Vegan"],
    basePortionPersons: 1,
    baseCostPerPerson: 0.85,
    suggestedRetailPrice: 4.80,
    baseCalories: 380,
    baseMacros: { protein: 11, carbs: 62, fat: 10, fiber: 5 },
    budgetAlternative: {
      active: false,
      title: "Toasted Sesame & Mustard Oil Bloom (No Expensive Chili-Crunch Oil)",
      savingsPerPerson: 0.30,
      savingsPercent: "35%",
      newCostPerPerson: 0.55,
      description: "Creates an aromatic wok-seasoned base using whole crushed garlic and toasted sesame oil that delivers authentic charred street flavor.",
      swapRatio: "Replace imported chili crisp oil with 1 tbsp neutral cooking oil bloomed with dry red chilies and garlic",
      tasteImpact: "High Sensory Match. Smoky, savory, and satisfying wok-hei aromatics.",
      textureImpact: "Springy noodles that stay separate and firm without becoming clumped.",
      humanTasteValidation: {
        score: "9.7 / 10",
        verifiedCooks: 105,
        agreementPercent: "Validated in kitchen taste trials",
        badge: "HTV Verified Gold"
      },
      replacedItems: [
        { original: "Imported Chili Crisp Oil", replacedWith: "In-house Garlic Scallion Bloom Oil", reason: "Saves ₹25 per plate with intense wok aroma", tasteMatch: "High Parity" }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "50/50 Hakka Noodles & Sliced Cabbage Slaw",
      calorieSaving: "-120 kcal",
      newCalories: 260,
      newMacros: { protein: 9, carbs: 42, fat: 6, fiber: 7 },
      description: "Doubles the finely shredded green cabbage and bell pepper volume to deliver high-satiety crunch with reduced carbohydrate density."
    },
    ingredients: [
      { name: "Hakka Eggless Wheat Noodles", qtyPerPerson: 90, unit: "g dry noodles", cost: 0.30, category: "Grains" },
      { name: "Crisp Green Bell Peppers & Cabbage", qtyPerPerson: 80, unit: "g shredded", cost: 0.20, category: "Produce" },
      { name: "Fresh Garlic & Ginger (finely minced)", qtyPerPerson: 20, unit: "g fresh", cost: 0.10, category: "Produce" },
      { name: "Naturally Brewed Dark Soy Sauce", qtyPerPerson: 1, unit: "tablespoon", cost: 0.08, category: "Pantry" },
      { name: "Chili-Garlic Paste & Rice Vinegar", qtyPerPerson: 1, unit: "tablespoon blend", cost: 0.07, category: "Pantry" },
      { name: "Cold-Pressed Sesame & Wok Oil", qtyPerPerson: 1, unit: "tablespoon", cost: 0.07, category: "Pantry", isReplaceable: true, replaceableType: "budget" },
      { name: "Spring Onion Greens (Scallions)", qtyPerPerson: 15, unit: "g chopped", cost: 0.03, category: "Produce" }
    ],
    steps: [
      "Boil noodles in salted water until 85% done; immediately drain, rinse with cold water, and toss with a few drops of oil to stop cooking.",
      "Get a carbon-steel wok or heavy skillet smoking hot; swirl in wok oil until shimmering.",
      "Add minced ginger, garlic, and sliced green chilies; stir-fry vigorously for 20 seconds without burning.",
      "Toss in shredded cabbage, carrots, and bell peppers on highest flame for 90 seconds to maintain blistered, crunchy snap.",
      "Drop in cooled noodles, drizzle dark soy sauce and chili-garlic paste around the rim of the wok, and toss rapidly for 2 minutes.",
      "Finish with fresh spring onion greens and a crack of black pepper before plating immediately."
    ],
    reviews: [
      {
        id: "noodles-rev-1",
        author: "Chef Vikram Nair",
        cafeName: "Wok & Roll Bistro, Pune",
        rating: 5,
        date: "Yesterday",
        verifiedCafe: true,
        text: "The high-heat toss and cold-water rinse technique makes every strand springy with zero clumpiness. Customer favorite!",
        photo: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80",
        helpfulCount: 71
      }
    ]
  },
  {
    id: "crispy-mysore-masala-dosa",
    title: "Crispy Golden Mysore Masala Dosa",
    category: "South Indian",
    tagline: "Traditional fermented rice-lentil crepe smeared with spicy red garlic chutney and spiced potato masala.",
    isMostSearched: true,
    rating: 4.98,
    reviewsCount: 195,
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&auto=format&fit=crop&q=80",
    prepTime: "15 mins",
    cookTime: "5 mins",
    difficulty: "Medium",
    dietary: ["Vegetarian", "Gluten-Free", "Vegan"],
    basePortionPersons: 1,
    baseCostPerPerson: 0.65,
    suggestedRetailPrice: 3.80,
    baseCalories: 340,
    baseMacros: { protein: 9, carbs: 54, fat: 10, fiber: 6 },
    budgetAlternative: {
      active: false,
      title: "Cold-Pressed Sesame Oil Roast (Dairy-Free & Budget Saver)",
      savingsPerPerson: 0.20,
      savingsPercent: "30%",
      newCostPerPerson: 0.45,
      description: "When clarified butter (ghee) is costly or when vegan preferences are desired, FlavorShift AI uses authentic cold-pressed sesame gingelly oil for an ultra-crisp golden crust.",
      swapRatio: "For 15g Ghee → Use 12g cold-pressed gingelly sesame oil brushed around edges",
      tasteImpact: "High Sensory Match. Deep roasted nutty aroma with paper-crisp shatter.",
      textureImpact: "Extra crisp golden bottom with tender, fluffy inner lace.",
      humanTasteValidation: {
        score: "9.9 / 10",
        verifiedCooks: 142,
        agreementPercent: "Validated in kitchen taste trials",
        badge: "HTV Verified Gold"
      },
      replacedItems: [
        { original: "Desi Ghee (for roasting)", replacedWith: "Cold-Pressed Gingelly Sesame Oil", reason: "Delivers traditional temple-style aroma at half the fat expenditure", tasteMatch: "High Parity" }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "Sprouted Moong & Oats Masala Dosa (Pesarattu-Style)",
      calorieSaving: "-110 kcal",
      newCalories: 230,
      newMacros: { protein: 14, carbs: 34, fat: 5, fiber: 8 },
      description: "Swaps white rice batter for slow-fermented whole sprouted green gram and rolled oats for low glycemic index and high dietary protein."
    },
    ingredients: [
      { name: "Fermented Dosa Batter (Rice & Urad Dal)", qtyPerPerson: 120, unit: "ml batter", cost: 0.20, category: "Grains" },
      { name: "Spiced Potato Mash (Aloo Bhaji with Mustard Seeds)", qtyPerPerson: 80, unit: "g potato filling", cost: 0.15, category: "Produce" },
      { name: "Mysore Fiery Red Garlic-Byadgi Chutney", qtyPerPerson: 20, unit: "g red chutney", cost: 0.10, category: "Spices" },
      { name: "Desi Ghee or Cold-Pressed Sesame Oil", qtyPerPerson: 15, unit: "ml roast oil", cost: 0.12, category: "Dairy", isReplaceable: true, replaceableType: "budget-calorie-vegan" },
      { name: "Fresh Coconut & Green Chili Chutney", qtyPerPerson: 40, unit: "g side chutney", cost: 0.08, category: "Produce" }
    ],
    steps: [
      "Heat a seasoned heavy cast-iron tawa until water droplets sizzle and evaporate immediately; wipe lightly with half an onion.",
      "Pour a ladle of fermented batter into the center and spiral outwards into a thin, even circle.",
      "Drizzle melted ghee (or FlavorShift cold-pressed sesame oil) around the outer perimeter and center.",
      "When the surface turns golden-amber, smear a tablespoon of fiery Mysore red garlic paste across the entire dosa surface.",
      "Spoon spiced potato bhaji in the center, fold into a crisp cylinder or envelope, and serve with fresh coconut chutney."
    ],
    reviews: [
      {
        id: "dosa-rev-1",
        author: "Kavitha Raman",
        cafeName: "Dakshin Tiffin Room, Chennai",
        rating: 5,
        date: "Yesterday",
        verifiedCafe: true,
        text: "The sesame oil alternative creates an even crunchier crust than ghee and gives that unmistakable nostalgic aroma. Brilliant calculation!",
        photo: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80",
        helpfulCount: 88
      }
    ]
  },
  {
    id: "steamed-soft-idli-sambar",
    title: "Melt-in-Mouth Steamed Idli & Udupi Sambar",
    category: "South Indian",
    tagline: "Cloud-soft fermented steamed rice cakes served with aromatic lentil-vegetable Udupi sambar.",
    isMostSearched: false,
    rating: 4.94,
    reviewsCount: 124,
    image: "./assets/recipes/steamed-soft-idli-sambar.jpg",
    prepTime: "10 mins",
    cookTime: "12 mins",
    difficulty: "Easy",
    dietary: ["Vegetarian", "Gluten-Free", "Vegan"],
    basePortionPersons: 1,
    baseCostPerPerson: 0.55,
    suggestedRetailPrice: 3.20,
    baseCalories: 260,
    baseMacros: { protein: 9, carbs: 50, fat: 2, fiber: 6 },
    budgetAlternative: {
      active: false,
      title: "In-House Roasted Sambar Spice Masala (No Stale Store Powder)",
      savingsPerPerson: 0.15,
      savingsPercent: "27%",
      newCostPerPerson: 0.40,
      description: "Blooms whole coriander, fenugreek, and chana dal in seconds to give Udupi temple-style aroma without branded packaged powders.",
      swapRatio: "1.5 tsp roasted coriander-fenugreek blend replaces commercial sambar masala packet",
      tasteImpact: "High Sensory Match. Complex, comforting sweet-tangy lentil broth.",
      textureImpact: "Featherlight, pillow-soft idlis that absorb sambar completely.",
      humanTasteValidation: {
        score: "9.8 / 10",
        verifiedCooks: 82,
        agreementPercent: "Validated in kitchen taste trials",
        badge: "HTV Verified Gold"
      },
      replacedItems: [
        { original: "Branded Packaged Sambar Powder", replacedWith: "Freshly Roasted Spice Masala Bloom", reason: "Zero preservatives, 3x volatile aroma", tasteMatch: "High Parity" }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "Quinoa & Foxtail Millet Steamed Idli",
      calorieSaving: "-70 kcal",
      newCalories: 190,
      newMacros: { protein: 11, carbs: 32, fat: 2, fiber: 7 },
      description: "Replaces 50% white idli rice with fiber-dense foxtail millet and organic quinoa for prolonged sustained energy."
    },
    ingredients: [
      { name: "Steamed Idli Cakes (Fermented Batter)", qtyPerPerson: 3, unit: "steamed idlis", cost: 0.25, category: "Grains" },
      { name: "Toor Dal & Drumstick Sambar Broth", qtyPerPerson: 180, unit: "ml sambar", cost: 0.18, category: "Produce", isReplaceable: true, replaceableType: "budget" },
      { name: "Fresh Grated Coconut Chutney with Mustard Tadka", qtyPerPerson: 40, unit: "g side chutney", cost: 0.08, category: "Produce" },
      { name: "Fresh Curry Leaves & Asafoetida (Hing)", qtyPerPerson: 0.5, unit: "tsp blend", cost: 0.04, category: "Spices" }
    ],
    steps: [
      "Lightly grease idli plates with oil; fill molds 3/4th with aerated fermented batter.",
      "Steam over high pressure for 10 minutes until a toothpick inserted into center comes out clean; rest 2 minutes before un-molding.",
      "In a saucepan, simmer cooked toor dal with drumstick, shallots, tamarind pulp, and freshly roasted sambar spices.",
      "Temper with mustard seeds, dried red chilies, hing, and fresh curry leaves in hot oil.",
      "Float idlis directly in deep sambar bowl and top with fresh cilantro and a dab of cold coconut chutney."
    ],
    reviews: [
      {
        id: "idli-rev-1",
        author: "Siddharth Menon",
        cafeName: "Madras Cafe, Bangalore",
        rating: 5,
        date: "3 days ago",
        verifiedCafe: true,
        text: "The freshly bloomed sambar spices make all the difference. Super soft idlis that soak in every drop of flavor.",
        photo: "./assets/recipes/steamed-soft-idli-sambar.jpg",
        helpfulCount: 46
      }
    ]
  },
  {
    id: "wood-fired-margherita-pizza",
    title: "Artisanal Margherita Pizza",
    category: "Pastas & Italian",
    tagline: "Crisp leopard-spotted Italian crust with crushed San Marzano tomatoes, fresh mozzarella, and sweet basil.",
    isMostSearched: true,
    rating: 4.96,
    reviewsCount: 172,
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&auto=format&fit=crop&q=80",
    prepTime: "20 mins",
    cookTime: "8 mins",
    difficulty: "Medium",
    dietary: ["Vegetarian"],
    basePortionPersons: 1,
    baseCostPerPerson: 1.60,
    suggestedRetailPrice: 8.50,
    baseCalories: 580,
    baseMacros: { protein: 24, carbs: 72, fat: 22, fiber: 4 },
    budgetAlternative: {
      active: false,
      title: "Fresh Strained Paneer & Domestic Mozzarella Melt (No High-Import Dairy Markup)",
      savingsPerPerson: 0.60,
      savingsPercent: "37%",
      newCostPerPerson: 1.00,
      description: "When imported Italian buffalo mozzarella is unavailable or expensive, blends fresh domestic mozzarella with mild strained curd for equal stringy stretch and milky sweetness.",
      swapRatio: "70g Domestic Mozzarella + 20g Strained Fresh Cottage Cheese replaces 90g imported Fior di Latte",
      tasteImpact: "High Sensory Match. Creamy, milky stretch with balanced acidic tomato bite.",
      textureImpact: "Gooey melted cheese pull with blistered, airy sourdough crust.",
      humanTasteValidation: {
        score: "9.8 / 10",
        verifiedCooks: 118,
        agreementPercent: "Validated in kitchen taste trials",
        badge: "HTV Verified Gold"
      },
      replacedItems: [
        { original: "Imported Italian Buffalo Mozzarella", replacedWith: "Domestic Low-Moisture Mozzarella & Cottage Curd Blend", reason: "Prevents soggy crust and saves ₹60/pie", tasteMatch: "High Parity" }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "Thin-Crust Whole Wheat & Cauliflower Crust Pizza",
      calorieSaving: "-190 kcal",
      newCalories: 390,
      newMacros: { protein: 22, carbs: 46, fat: 12, fiber: 8 },
      description: "Bakes a crisp, ultra-thin crust enriched with finely grated cauliflower and whole wheat flour."
    },
    ingredients: [
      { name: "Slow-Fermented Neapolitan Pizza Dough", qtyPerPerson: 180, unit: "g dough ball", cost: 0.40, category: "Bakery" },
      { name: "Crushed Plum Tomato Reduction", qtyPerPerson: 70, unit: "g sauce", cost: 0.25, category: "Produce" },
      { name: "Fresh Mozzarella / Fior di Latte", qtyPerPerson: 90, unit: "g sliced cheese", cost: 0.65, category: "Dairy", isReplaceable: true, replaceableType: "budget-calorie-vegan" },
      { name: "Extra Virgin Olive Oil", qtyPerPerson: 1, unit: "tablespoon", cost: 0.18, category: "Pantry" },
      { name: "Fresh Genovese Sweet Basil & Sea Salt", qtyPerPerson: 6, unit: "fresh leaves", cost: 0.12, category: "Herbs" }
    ],
    steps: [
      "Preheat oven with pizza stone or heavy cast-iron pan to maximum heat (250°C / 480°F) for 40 minutes.",
      "Gently stretch fermented dough from center outwards onto semolina-dusted board, keeping a puffy outer rim (cornicione).",
      "Spoon crushed plum tomato sauce thinly over dough; arrange torn fresh mozzarella pieces evenly.",
      "Slide onto smoking-hot stone/pan; bake 6 to 8 minutes until cheese is bubbling and crust develops charred leopard blisters.",
      "Remove from heat, scatter fresh basil leaves, drizzle with extra virgin olive oil, and slice immediately."
    ],
    reviews: [
      {
        id: "pizza-rev-1",
        author: "Chef Antonio L.",
        cafeName: "Napoli Bistro, Mumbai",
        rating: 5,
        date: "2 days ago",
        verifiedCafe: true,
        text: "The domestic mozzarella blend completely solves the watery crust issue common with home ovens. Fantastic rise on the crust!",
        photo: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&auto=format&fit=crop&q=80",
        helpfulCount: 92
      }
    ]
  },
  {
    id: "classic-italian-tiramisu",
    title: "Artisanal Espresso Tiramisu",
    category: "Bakery & Desserts",
    tagline: "Airy espresso-soaked savoiardi ladyfingers layered with velvety mascarpone sabayon and dusted dark cocoa.",
    isMostSearched: true,
    rating: 4.98,
    reviewsCount: 184,
    image: "./assets/recipes/classic-italian-tiramisu.jpg",
    prepTime: "20 mins",
    cookTime: "0 mins",
    difficulty: "Medium",
    dietary: ["Vegetarian"],
    basePortionPersons: 1,
    baseCostPerPerson: 1.85,
    suggestedRetailPrice: 7.50,
    baseCalories: 420,
    baseMacros: { protein: 8, carbs: 42, fat: 26, fiber: 2 },
    budgetAlternative: {
      active: false,
      title: "Hung Curd & Double-Cottage Cream Velvet (No Costly Imported Mascarpone)",
      savingsPerPerson: 0.85,
      savingsPercent: "46%",
      newCostPerPerson: 1.00,
      description: "When imported Italian mascarpone is too expensive, FlavorShift AI blends ultra-smooth hung curd with fresh malai cream and vanilla bean.",
      swapRatio: "For 100g Mascarpone → Use 60g Strained Hung Curd + 40g Fresh Malai Cream whisked silky",
      tasteImpact: "High Sensory Match. Velvety, milky richness with gentle clean sweetness.",
      textureImpact: "Micro-smooth, stable mousse consistency that holds sharp cafe slice edges.",
      humanTasteValidation: {
        score: "9.8 / 10",
        verifiedCooks: 115,
        agreementPercent: "Validated in kitchen taste trials",
        badge: "HTV Verified Gold"
      },
      replacedItems: [
        { original: "Imported Italian Mascarpone Cheese", replacedWith: "Farmhouse Hung Curd & Velvet Malai Puree", reason: "Cuts dessert expenditure by 46% without curdling", tasteMatch: "High Parity" }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "Skinny Greek Yogurt & Espresso Cloud Parfait",
      calorieSaving: "-180 kcal",
      newCalories: 240,
      newMacros: { protein: 15, carbs: 28, fat: 8, fiber: 2 },
      description: "Uses non-fat whipped Greek yogurt sweetened with organic monkfruit extract and whole wheat sponge."
    },
    ingredients: [
      { name: "Crisp Italian Ladyfingers (Savoiardi)", qtyPerPerson: 4, unit: "biscuits", cost: 0.40, category: "Bakery" },
      { name: "Velvety Mascarpone Cheese", qtyPerPerson: 90, unit: "g cheese", cost: 0.90, category: "Dairy", isReplaceable: true, replaceableType: "budget-calorie-vegan" },
      { name: "Fresh Double Espresso Shot", qtyPerPerson: 50, unit: "ml fresh brew", cost: 0.25, category: "Pantry" },
      { name: "Pure Vanilla Bean Extract & Sugar", qtyPerPerson: 1, unit: "tsp blend", cost: 0.15, category: "Sweetener", isReplaceable: true, replaceableType: "calorie" },
      { name: "Dutch Processed 100% Dark Cocoa Powder", qtyPerPerson: 1, unit: "tsp dusting", cost: 0.15, category: "Pantry" }
    ],
    steps: [
      "Brew intense dark roast espresso and let cool to room temperature in a shallow dipping bowl.",
      "In a chilled bowl, whisk mascarpone (or FlavorShift hung curd-malai cream) with vanilla and sweetening until glossy soft peaks form.",
      "Quickly dip ladyfingers into espresso for 1 second per side; arrange as a snug foundation layer in serving cup.",
      "Pipe or spoon half of the velvet cream over the biscuits; repeat with a second soaked layer.",
      "Chill for minimum 2 hours to set; dust heavily with Dutch dark cocoa powder before serving."
    ],
    reviews: [
      {
        id: "tiramisu-rev-1",
        author: "Camilla Bernardi",
        cafeName: "Espresso & Dolce, Milan & New Delhi",
        rating: 5,
        date: "Yesterday",
        verifiedCafe: true,
        text: "The hung curd-malai velvet alternative has the exact mouth-cling of Lombardy mascarpone. A masterpiece for cafe margins!",
        photo: "./assets/recipes/classic-italian-tiramisu.jpg",
        helpfulCount: 76
      }
    ]
  },
  {
    id: "warm-dark-chocolate-lava-cake",
    title: "Molten Dark Chocolate Lava Cake",
    category: "Bakery & Desserts",
    tagline: "Individual warm chocolate sponge with a luscious flowing molten ganache center.",
    isMostSearched: true,
    rating: 4.99,
    reviewsCount: 210,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80",
    prepTime: "12 mins",
    cookTime: "10 mins",
    difficulty: "Medium",
    dietary: ["Vegetarian"],
    basePortionPersons: 1,
    baseCostPerPerson: 1.40,
    suggestedRetailPrice: 6.80,
    baseCalories: 490,
    baseMacros: { protein: 7, carbs: 54, fat: 28, fiber: 4 },
    budgetAlternative: {
      active: false,
      title: "Single-Origin Domestic 70% Cocoa Melt (No High-Duty Belgian Couverture)",
      savingsPerPerson: 0.50,
      savingsPercent: "35%",
      newCostPerPerson: 0.90,
      description: "Employs high-fat domestic Indian single-origin cocoa mass blended with cold-pressed coconut butter for an ultra-glossy river of lava.",
      swapRatio: "For 60g Imported Couverture → Use 45g Cocoa mass + 15g butter blend",
      tasteImpact: "High Sensory Match. Intense bittersweet dark cocoa profile with zero waxy feel.",
      textureImpact: "Tender cake walls with warm, free-flowing silky chocolate center.",
      humanTasteValidation: {
        score: "9.9 / 10",
        verifiedCooks: 130,
        agreementPercent: "Validated in kitchen taste trials",
        badge: "HTV Verified Gold"
      },
      replacedItems: [
        { original: "Imported Belgian 70% Dark Couverture", replacedWith: "South Indian Single-Origin Artisanal Dark Cocoa Mass", reason: "Saves ₹42/cake with deeper fruity terroir notes", tasteMatch: "High Parity" }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "Avocado & Dark Cocoa Clean Molten Pot",
      calorieSaving: "-190 kcal",
      newCalories: 300,
      newMacros: { protein: 8, carbs: 32, fat: 16, fiber: 8 },
      description: "Replaces 60% butter with velvety Hass avocado puree and organic allulose sweetener for guilt-free indulgence."
    },
    ingredients: [
      { name: "70% Dark Chocolate Callets", qtyPerPerson: 60, unit: "g chocolate", cost: 0.65, category: "Bakery", isReplaceable: true, replaceableType: "budget" },
      { name: "Unsalted Dairy Table Butter", qtyPerPerson: 35, unit: "g butter", cost: 0.35, category: "Dairy", isReplaceable: true, replaceableType: "calorie-vegan" },
      { name: "Whole Egg or Flax-Emulsion", qtyPerPerson: 1, unit: "egg / emulsion", cost: 0.15, category: "Dairy", isReplaceable: true, replaceableType: "vegan" },
      { name: "Fine All-Purpose Flour", qtyPerPerson: 20, unit: "g flour", cost: 0.05, category: "Bakery" },
      { name: "Raw Cane Sugar & Sea Salt", qtyPerPerson: 25, unit: "g blend", cost: 0.10, category: "Sweetener" },
      { name: "Tahitian Vanilla Extract", qtyPerPerson: 0.5, unit: "tsp", cost: 0.10, category: "Pantry" }
    ],
    steps: [
      "Melt dark chocolate and butter together gently over a bain-marie (hot water bath) until silky and glossy.",
      "Whisk egg and cane sugar in a bowl until pale and frothy.",
      "Fold melted chocolate mixture into the egg froth; gently sift in flour and a pinch of flaky salt.",
      "Pour batter into a buttered, cocoa-dusted ramekin up to 3/4 full.",
      "Bake at 200°C (395°F) for exactly 9–10 minutes until the edges are firm but center jiggles gently.",
      "Invert immediately onto a dessert plate, dust with powdered sugar, and serve with fresh berries."
    ],
    reviews: [
      {
        id: "lava-rev-1",
        author: "Chef Rohan Sen",
        cafeName: "The Chocolate Box, Kolkata",
        rating: 5,
        date: "3 days ago",
        verifiedCafe: true,
        text: "The exact 9-minute bake time yields a picture-perfect molten core every single time. One of our top 3 profit items.",
        photo: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80",
        helpfulCount: 89
      }
    ]
  },
  {
    id: "vanilla-bean-panna-cotta",
    title: "Vanilla Bean Panna Cotta with Berry Coulis",
    category: "Bakery & Desserts",
    tagline: "Silky, delicate chilled Italian cream custard infused with Madagascar vanilla bean and tart raspberry glaze.",
    isMostSearched: false,
    rating: 4.92,
    reviewsCount: 98,
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&auto=format&fit=crop&q=80",
    prepTime: "10 mins",
    cookTime: "5 mins",
    difficulty: "Easy",
    dietary: ["Vegetarian", "Gluten-Free"],
    basePortionPersons: 1,
    baseCostPerPerson: 1.20,
    suggestedRetailPrice: 5.50,
    baseCalories: 320,
    baseMacros: { protein: 5, carbs: 26, fat: 22, fiber: 2 },
    budgetAlternative: {
      active: false,
      title: "Thick Whole Milk & Coconut Milk Silk (No High-Cost Whipping Cream)",
      savingsPerPerson: 0.45,
      savingsPercent: "37%",
      newCostPerPerson: 0.75,
      description: "Combines reduced whole farmhouse milk with coconut milk for the same luxurious mouth-coating wobble at reduced dairy expense.",
      swapRatio: "For 100ml Heavy Cream → Use 60ml Whole Milk + 40ml Coconut Milk",
      tasteImpact: "High Sensory Match. Clean floral vanilla profile with tropical undertones.",
      textureImpact: "Gentle, delicate wobble that melts instantly on the palate.",
      humanTasteValidation: {
        score: "9.7 / 10",
        verifiedCooks: 78,
        agreementPercent: "Validated in kitchen taste trials",
        badge: "HTV Verified Gold"
      },
      replacedItems: [
        { original: "Imported 35% Dairy Whipping Cream", replacedWith: "Farmhouse Full-Cream & Coconut Milk Infusion", reason: "Prevents heavy dairy aftertaste while cutting costs", tasteMatch: "High Parity" }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "Almond Milk & Agar-Agar Light Wobble",
      calorieSaving: "-170 kcal",
      newCalories: 150,
      newMacros: { protein: 4, carbs: 14, fat: 8, fiber: 3 },
      description: "Uses unsweetened vanilla almond milk set with plant-based agar-agar for an ultra-clean 150-calorie dessert."
    },
    ingredients: [
      { name: "Fresh Dairy Whipping Cream", qtyPerPerson: 100, unit: "ml cream", cost: 0.55, category: "Dairy", isReplaceable: true, replaceableType: "budget-calorie-vegan" },
      { name: "Whole Farmhouse Milk", qtyPerPerson: 50, unit: "ml milk", cost: 0.15, category: "Dairy" },
      { name: "Plant-Based Agar-Agar or Gelatin", qtyPerPerson: 2, unit: "g setting agent", cost: 0.15, category: "Pantry" },
      { name: "Madagascar Vanilla Pod Seeds", qtyPerPerson: 0.5, unit: "pod seeds", cost: 0.15, category: "Spices" },
      { name: "Wild Raspberry & Strawberry Reduction", qtyPerPerson: 35, unit: "g coulis", cost: 0.20, category: "Produce" }
    ],
    steps: [
      "Simmer cream, milk, scraped vanilla seeds, and sugar in a saucepan over gentle heat for 3 minutes without boiling.",
      "Sprinkle agar-agar flakes into the warm liquid, whisking thoroughly for 90 seconds until completely dissolved.",
      "Pour through a fine mesh strainer into small glass jars or dariole molds.",
      "Refrigerate for minimum 3 hours until gently set with signature panna cotta wobble.",
      "Top with fresh tart berry coulis and fresh mint leaves right before serving."
    ],
    reviews: [
      {
        id: "panna-rev-1",
        author: "Elena Rostova",
        cafeName: "Cafe Bellini, Goa",
        rating: 5,
        date: "4 days ago",
        verifiedCafe: true,
        text: "The coconut-milk blend gives it such a fresh, modern lightness. Guests rave about the melt-in-mouth texture.",
        photo: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80",
        helpfulCount: 54
      }
    ]
  },
  {
    id: "gulab-jamun-cheesecake-fusion",
    title: "Gulab Jamun Saffron Cheesecake",
    category: "Bakery & Desserts",
    tagline: "East-meets-west cafe fusion pairing cardamom graham cracker crust with saffron cream and embedded mini gulab jamuns.",
    isMostSearched: true,
    rating: 4.97,
    reviewsCount: 168,
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&auto=format&fit=crop&q=80",
    prepTime: "25 mins",
    cookTime: "30 mins",
    difficulty: "Medium",
    dietary: ["Vegetarian"],
    basePortionPersons: 1,
    baseCostPerPerson: 1.65,
    suggestedRetailPrice: 7.20,
    baseCalories: 460,
    baseMacros: { protein: 9, carbs: 52, fat: 24, fiber: 2 },
    budgetAlternative: {
      active: false,
      title: "Chenna (Fresh Cottage Curd) & Cream Cheese Blend (No 100% Imported Cheese)",
      savingsPerPerson: 0.70,
      savingsPercent: "42%",
      newCostPerPerson: 0.95,
      description: "Combines freshly curdled warm cow milk chenna with cream cheese to replicate Philadelphia richness at domestic milk prices.",
      swapRatio: "50g Whipped Soft Chenna + 40g Cream Cheese replaces 90g imported cream cheese",
      tasteImpact: "High Sensory Match. Subtle sweet lactic curd with saffron and rose water notes.",
      textureImpact: "Dense, creamy, velvet sliceability that holds embedded gulab jamuns firmly.",
      humanTasteValidation: {
        score: "9.8 / 10",
        verifiedCooks: 110,
        agreementPercent: "Validated in kitchen taste trials",
        badge: "HTV Verified Gold"
      },
      replacedItems: [
        { original: "Imported Philadelphia Cream Cheese", replacedWith: "Whipped Fresh Soft Chenna Curd", reason: "Prevents heavy dense aftertaste and saves ₹58/portion", tasteMatch: "High Parity" }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "Hung Greek Yogurt & Stevia Baked Pot",
      calorieSaving: "-160 kcal",
      newCalories: 300,
      newMacros: { protein: 14, carbs: 36, fat: 12, fiber: 3 },
      description: "Bakes strained high-protein Greek yogurt with crushed digestive biscuits and sugar-free rose essence."
    },
    ingredients: [
      { name: "Cream Cheese / Soft Chenna Blend", qtyPerPerson: 90, unit: "g cheese curd", cost: 0.70, category: "Dairy", isReplaceable: true, replaceableType: "budget" },
      { name: "Mini Soft Gulab Jamuns (drained)", qtyPerPerson: 2, unit: "pieces", cost: 0.35, category: "Bakery" },
      { name: "Crushed Graham Crackers / Digestive Biscuits", qtyPerPerson: 35, unit: "g crumbs", cost: 0.20, category: "Bakery" },
      { name: "Kashmiri Saffron & Green Cardamom Powder", qtyPerPerson: 0.5, unit: "tsp blend", cost: 0.25, category: "Spices" },
      { name: "Melted Butter (for crust binding)", qtyPerPerson: 15, unit: "g butter", cost: 0.15, category: "Dairy" }
    ],
    steps: [
      "Mix crushed digestive biscuits with melted butter and cardamom; press tightly into base of springform pan or mold.",
      "Whisk cream cheese and whipped chenna with sugar, saffron milk infusion, and a splash of rose water until micro-smooth.",
      "Pour half the cheese batter over the crust; arrange drained mini gulab jamuns evenly across the surface.",
      "Cover with remaining batter, smooth the top, and bake in a water bath at 160°C (320°F) for 35 minutes until just set.",
      "Chill overnight in refrigerator; slice cleanly and garnish with slivered pistachios and dried rose petals."
    ],
    reviews: [
      {
        id: "fusion-rev-1",
        author: "Chef Meera Kapoor",
        cafeName: "Saffron & Sage Bistro, Chandigarh",
        rating: 5,
        date: "2 days ago",
        verifiedCafe: true,
        text: "The chenna blend gives it a lighter, cleaner finish than heavy cream cheese alone. It sells out before 4 PM every day!",
        photo: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&auto=format&fit=crop&q=80",
        helpfulCount: 81
      }
    ]
  },
  {
    id: "fudgy-avocado-chocolate-brownie",
    title: "Double Dark Chocolate Fudgy Brownie",
    category: "Bakery & Desserts",
    tagline: "Decadent crinkle-top chocolate brownie with fudgy gooey centers and roasted walnut chunks.",
    isMostSearched: false,
    rating: 4.94,
    reviewsCount: 112,
    image: "https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=800&auto=format&fit=crop&q=80",
    prepTime: "15 mins",
    cookTime: "22 mins",
    difficulty: "Easy",
    dietary: ["Vegetarian"],
    basePortionPersons: 1,
    baseCostPerPerson: 1.10,
    suggestedRetailPrice: 4.80,
    baseCalories: 380,
    baseMacros: { protein: 6, carbs: 46, fat: 20, fiber: 4 },
    budgetAlternative: {
      active: false,
      title: "Toasted Sunflower Seeds & Cocoa Butter (No High-Cost Imported Walnuts)",
      savingsPerPerson: 0.35,
      savingsPercent: "32%",
      newCostPerPerson: 0.75,
      description: "When imported California walnuts are too expensive, uses toasted salted pumpkin and sunflower seeds for equal nutty crunch.",
      swapRatio: "25g Toasted Sunflower & Pumpkin seed mix replaces 25g walnuts",
      tasteImpact: "High Sensory Match. Deep roasted crunch with intense bittersweet cocoa.",
      textureImpact: "Chewy edges with gooey, fudgy center and crisp, papery crinkle crust.",
      humanTasteValidation: {
        score: "9.8 / 10",
        verifiedCooks: 92,
        agreementPercent: "Validated in kitchen taste trials",
        badge: "HTV Verified Gold"
      },
      replacedItems: [
        { original: "Imported California Walnuts (25g)", replacedWith: "Toasted Roasted Sunflower & Pumpkin Seeds", reason: "Allergen-friendly crunch that saves ₹28 per brownie slice", tasteMatch: "High Parity" }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "Skinny Sweet Potato & Dark Cocoa Brownie",
      calorieSaving: "-150 kcal",
      newCalories: 230,
      newMacros: { protein: 7, carbs: 32, fat: 9, fiber: 6 },
      description: "Uses pureed steamed sweet potato to replace 70% butter and refined flour for moist, dense fudge texture."
    },
    ingredients: [
      { name: "55% Semi-Sweet Dark Chocolate", qtyPerPerson: 50, unit: "g chocolate", cost: 0.45, category: "Bakery" },
      { name: "Pure Dairy Table Butter", qtyPerPerson: 30, unit: "g butter", cost: 0.25, category: "Dairy", isReplaceable: true, replaceableType: "calorie" },
      { name: "Brown Cane Sugar & Vanilla", qtyPerPerson: 30, unit: "g blend", cost: 0.15, category: "Sweetener" },
      { name: "Unbleached Pastry Flour", qtyPerPerson: 25, unit: "g flour", cost: 0.08, category: "Bakery" },
      { name: "Roughly Chopped Walnuts or Seeds", qtyPerPerson: 20, unit: "g nuts", cost: 0.17, category: "Pantry", isReplaceable: true, replaceableType: "budget" }
    ],
    steps: [
      "Melt dark chocolate and butter together until silky smooth; let cool slightly.",
      "Whisk eggs (or yogurt substitute) with brown sugar vigorously for 3 minutes until pale and frothy.",
      "Gently fold melted chocolate into the whipped eggs; fold in flour and cocoa powder with a spatula.",
      "Stir in chopped walnuts or toasted seeds, reserving a few for the top.",
      "Pour into parchment-lined pan; bake at 175°C (350°F) for 22 minutes until a toothpick has moist crumbs.",
      "Cool completely before slicing into clean cafe squares."
    ],
    reviews: [
      {
        id: "brownie-rev-1",
        author: "Karan Mehta",
        cafeName: "Bean & Batter Bakery, Delhi",
        rating: 5,
        date: "5 days ago",
        verifiedCafe: true,
        text: "The crinkle top and dense fudge texture are phenomenal. Customers love pairing it with our flat whites.",
        photo: "https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=600&auto=format&fit=crop&q=80",
        helpfulCount: 68
      }
    ]
  },
  {
    id: "quinoa-avocado-superfood-bowl",
    title: "Mediterranean Quinoa & Avocado Power Bowl",
    category: "Diet Conscious",
    tagline: "Nutrient-packed clean bowl featuring fluffy quinoa, crisp cucumbers, ripe avocado, chickpeas, and lemon tahini dressing.",
    isMostSearched: true,
    rating: 4.96,
    reviewsCount: 145,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80",
    prepTime: "12 mins",
    cookTime: "15 mins",
    difficulty: "Easy",
    dietary: ["Vegetarian", "Gluten-Free", "Vegan"],
    basePortionPersons: 1,
    baseCostPerPerson: 1.55,
    suggestedRetailPrice: 6.80,
    baseCalories: 380,
    baseMacros: { protein: 16, carbs: 48, fat: 15, fiber: 11 },
    budgetAlternative: {
      active: false,
      title: "Broken Wheat (Dalia) & White Sesame Drizzle (No High-Import Quinoa)",
      savingsPerPerson: 0.60,
      savingsPercent: "38%",
      newCostPerPerson: 0.95,
      description: "Swaps imported organic quinoa with roasted nutty domestic broken wheat dalia and homemade sesame tahini for identical mouthfeel.",
      swapRatio: "70g Steamed Dalia replaces 70g cooked quinoa",
      tasteImpact: "High Sensory Match. Earthy, nutty grains with vibrant citrus-herb dressing.",
      textureImpact: "Fluffy, hearty grain base with crisp vegetable snap and creamy avocado.",
      humanTasteValidation: {
        score: "9.8 / 10",
        verifiedCooks: 104,
        agreementPercent: "Validated in kitchen taste trials",
        badge: "HTV Verified Gold"
      },
      replacedItems: [
        { original: "Imported South American Quinoa", replacedWith: "Slow-Steamed Roasted Broken Wheat (Dalia)", reason: "Saves ₹50/bowl; high sustained satiety", tasteMatch: "High Parity" }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "Cauliflower Rice & Cucumber Shred Slaw Base",
      calorieSaving: "-130 kcal",
      newCalories: 250,
      newMacros: { protein: 12, carbs: 22, fat: 12, fiber: 10 },
      description: "Replaces half the grains with fresh riced cauliflower for an ultra-low carbohydrate macro profile."
    },
    ingredients: [
      { name: "Fluffy Steamed White Quinoa", qtyPerPerson: 80, unit: "g cooked grains", cost: 0.50, category: "Grains", isReplaceable: true, replaceableType: "budget" },
      { name: "Sliced Hass Avocado", qtyPerPerson: 50, unit: "g fresh avocado", cost: 0.45, category: "Produce" },
      { name: "Spiced Boiled Chickpeas (Kabuli Chana)", qtyPerPerson: 60, unit: "g legumes", cost: 0.20, category: "Produce" },
      { name: "Cherry Tomatoes & Persian Cucumber", qtyPerPerson: 70, unit: "g fresh dice", cost: 0.20, category: "Produce" },
      { name: "Lemon Tahini & Extra Virgin Olive Oil Dressing", qtyPerPerson: 25, unit: "ml dressing", cost: 0.20, category: "Pantry" }
    ],
    steps: [
      "Rinse quinoa thoroughly to remove saponins; cook in seasoned vegetable broth until translucent and fluffy.",
      "Toss boiled chickpeas with smoked paprika, cumin, and sea salt in a hot dry pan for 2 minutes to crisp the skin.",
      "Assemble grain foundation in a wide stoneware salad bowl.",
      "Arrange sliced avocado, cherry tomato halves, diced cucumber, and spiced chickpeas in clean color-blocked sections.",
      "Whisk fresh lemon juice, tahini, minced garlic, and cold water into a silky dressing; drizzle liberally over bowl before serving."
    ],
    reviews: [
      {
        id: "bowl-rev-1",
        author: "Tara Singhania",
        cafeName: "Pure & Raw Kitchen, Mumbai",
        rating: 5,
        date: "2 days ago",
        verifiedCafe: true,
        text: "The lemon-tahini dressing ties every single component together. Outstanding clean macros for fitness clients.",
        photo: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80",
        helpfulCount: 73
      }
    ]
  },
  {
    id: "grilled-tofu-edamame-buddha-bowl",
    title: "Sesame-Ginger Tofu Buddha Bowl",
    category: "Diet Conscious",
    tagline: "Clean plant-protein bowl with crispy pan-seared organic tofu, steamed edamame, purple cabbage, and toasted sesame glaze.",
    isMostSearched: false,
    rating: 4.93,
    reviewsCount: 118,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80",
    prepTime: "15 mins",
    cookTime: "10 mins",
    difficulty: "Easy",
    dietary: ["Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free"],
    basePortionPersons: 1,
    baseCostPerPerson: 1.45,
    suggestedRetailPrice: 6.50,
    baseCalories: 340,
    baseMacros: { protein: 22, carbs: 32, fat: 14, fiber: 9 },
    budgetAlternative: {
      active: false,
      title: "Sprouted Green Moong & Roasted Peanut Crunch (No Expensive Edamame)",
      savingsPerPerson: 0.50,
      savingsPercent: "34%",
      newCostPerPerson: 0.95,
      description: "When frozen Japanese edamame is high cost, substitutes tender steamed sprouted whole moong beans and crushed roasted peanuts.",
      swapRatio: "50g Sprouted Moong replaces 50g Edamame beans",
      tasteImpact: "High Sensory Match. Fresh, earthy legume sweetness with savory garlic crunch.",
      textureImpact: "Crisp outer tofu shell with tender, chewy protein and fresh raw vegetables.",
      humanTasteValidation: {
        score: "9.7 / 10",
        verifiedCooks: 86,
        agreementPercent: "Validated in kitchen taste trials",
        badge: "HTV Verified Gold"
      },
      replacedItems: [
        { original: "Imported Frozen Edamame Beans", replacedWith: "Steamed Fresh Sprouted Moong", reason: "Saves ₹40/bowl while providing equal plant protein", tasteMatch: "High Parity" }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "Air-Fried Tofu & Zucchini Noodle Base",
      calorieSaving: "-110 kcal",
      newCalories: 230,
      newMacros: { protein: 20, carbs: 16, fat: 10, fiber: 8 },
      description: "Air-fries the marinated tofu without oil and swaps rice for crisp raw zucchini ribbons."
    },
    ingredients: [
      { name: "Organic Firm Pressed Tofu Cubes", qtyPerPerson: 120, unit: "g tofu", cost: 0.55, category: "Produce" },
      { name: "Steamed Edamame / Sprouted Beans", qtyPerPerson: 50, unit: "g legumes", cost: 0.35, category: "Produce", isReplaceable: true, replaceableType: "budget" },
      { name: "Shredded Purple Cabbage & Carrots", qtyPerPerson: 80, unit: "g vegetables", cost: 0.20, category: "Produce" },
      { name: "Tamari Soy & Grated Ginger Glaze", qtyPerPerson: 20, unit: "ml sauce", cost: 0.15, category: "Pantry" },
      { name: "Toasted White & Black Sesame Seeds", qtyPerPerson: 1, unit: "tsp garnish", cost: 0.10, category: "Pantry" },
      { name: "Steamed Brown Jasmine Rice", qtyPerPerson: 70, unit: "g cooked rice", cost: 0.10, category: "Grains" }
    ],
    steps: [
      "Press tofu with paper towels to extract moisture; toss cubes in tamari, garlic powder, and cornstarch.",
      "Sear in a hot skillet with a teaspoon of oil for 7 minutes, turning until all sides are deep golden and crisp.",
      "Steam edamame or sprouted moong with sea salt for 3 minutes until tender-crisp.",
      "Lay warm brown rice in a bowl, arranging crisp tofu, purple cabbage, and edamame around the perimeter.",
      "Drizzle with sesame-ginger dressing and sprinkle with toasted sesame seeds and sliced scallions."
    ],
    reviews: [
      {
        id: "tofu-rev-1",
        author: "Devika Rao",
        cafeName: "Zen Vitality Cafe, Hyderabad",
        rating: 5,
        date: "Yesterday",
        verifiedCafe: true,
        text: "The cornstarch crust makes the tofu outrageously crunchy without deep-frying. Excellent nutritional profile.",
        photo: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80",
        helpfulCount: 62
      }
    ]
  },
  {
    id: "greek-tzatziki-grain-salad",
    title: "Chilled Greek Tzatziki & Lentil Salad",
    category: "Diet Conscious",
    tagline: "Cooling cafe salad of brown lentils, crisp bell peppers, and homemade cucumber-garlic Greek yogurt dressing.",
    isMostSearched: false,
    rating: 4.91,
    reviewsCount: 92,
    image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=800&auto=format&fit=crop&q=80",
    prepTime: "10 mins",
    cookTime: "10 mins",
    difficulty: "Easy",
    dietary: ["Vegetarian", "Gluten-Free"],
    basePortionPersons: 1,
    baseCostPerPerson: 1.15,
    suggestedRetailPrice: 5.20,
    baseCalories: 290,
    baseMacros: { protein: 18, carbs: 38, fat: 8, fiber: 10 },
    budgetAlternative: {
      active: false,
      title: "Desi Brown Masoor & Strained Dahi Tzatziki (No Imported Puy Lentils)",
      savingsPerPerson: 0.40,
      savingsPercent: "35%",
      newCostPerPerson: 0.75,
      description: "Replaces imported French green lentils with domestic whole brown masoor dal cooked al dente.",
      swapRatio: "80g Whole Brown Masoor replaces 80g imported lentils",
      tasteImpact: "High Sensory Match. Earthy, savory lentils balanced by tart cucumber-dill yogurt.",
      textureImpact: "Firm, non-mushy lentil bite with refreshing cooling creaminess.",
      humanTasteValidation: {
        score: "9.8 / 10",
        verifiedCooks: 75,
        agreementPercent: "Validated in kitchen taste trials",
        badge: "HTV Verified Gold"
      },
      replacedItems: [
        { original: "Imported French Green Lentils", replacedWith: "Farm Fresh Whole Brown Masoor", reason: "Zero mushiness, saves ₹35/portion", tasteMatch: "High Parity" }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "Low-Fat Cucumber & Fresh Mint Dressing",
      calorieSaving: "-70 kcal",
      newCalories: 220,
      newMacros: { protein: 16, carbs: 32, fat: 3, fiber: 10 },
      description: "Prepares tzatziki using 0% fat strained yogurt with fresh mint and grated English cucumber."
    },
    ingredients: [
      { name: "Al Dente Whole Brown Lentils", qtyPerPerson: 90, unit: "g cooked lentils", cost: 0.30, category: "Produce", isReplaceable: true, replaceableType: "budget" },
      { name: "Strained Greek Yogurt (Tzatziki Base)", qtyPerPerson: 80, unit: "g yogurt", cost: 0.40, category: "Dairy" },
      { name: "English Cucumber (grated & squeezed)", qtyPerPerson: 50, unit: "g cucumber", cost: 0.15, category: "Produce" },
      { name: "Extra Virgin Olive Oil & Lemon Juice", qtyPerPerson: 15, unit: "ml blend", cost: 0.15, category: "Pantry" },
      { name: "Fresh Dill, Minced Garlic & Sea Salt", qtyPerPerson: 1, unit: "tsp blend", cost: 0.15, category: "Herbs" }
    ],
    steps: [
      "Cook whole lentils in water with a bay leaf until tender but still holding their shape (do not overcook); chill thoroughly.",
      "Grate English cucumber, toss with a pinch of salt, and squeeze tightly in cheesecloth to extract excess liquid.",
      "Stir squeezed cucumber into thick Greek yogurt with minced garlic, fresh chopped dill, lemon juice, and olive oil.",
      "Toss chilled lentils with diced red onions, bell peppers, and half of the tzatziki sauce.",
      "Transfer to salad bowl, dollop remaining tzatziki over the top, and finish with a crack of black pepper."
    ],
    reviews: [
      {
        id: "tzatziki-rev-1",
        author: "Arjun Verma",
        cafeName: "Olive & Herb Eatery, Delhi",
        rating: 5,
        date: "6 days ago",
        verifiedCafe: true,
        text: "The lentil-tzatziki combination is hearty, refreshing, and deeply satisfying. Perfect lunch prep item.",
        photo: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=600&auto=format&fit=crop&q=80",
        helpfulCount: 43
      }
    ]
  },
  {
    id: "spinach-paneer-protein-wrap",
    title: "Vibrant Spinach & Grilled Paneer Wrap",
    category: "Diet Conscious",
    tagline: "Whole-wheat flatbread wrap stuffed with tandoori-spiced grilled paneer strips, baby spinach, and mint-yogurt chutney.",
    isMostSearched: true,
    rating: 4.95,
    reviewsCount: 132,
    image: "./assets/recipes/spinach-paneer-protein-wrap.jpg",
    prepTime: "10 mins",
    cookTime: "8 mins",
    difficulty: "Easy",
    dietary: ["Vegetarian"],
    basePortionPersons: 1,
    baseCostPerPerson: 1.25,
    suggestedRetailPrice: 5.50,
    baseCalories: 360,
    baseMacros: { protein: 20, carbs: 36, fat: 16, fiber: 6 },
    budgetAlternative: {
      active: false,
      title: "Desi Tawa-Grilled Tofu & Paneer Mix (Cost & Saturated Fat Cutter)",
      savingsPerPerson: 0.40,
      savingsPercent: "32%",
      newCostPerPerson: 0.85,
      description: "Blends 50% firm organic tofu with 50% fresh paneer to maintain bouncy bite while cutting dairy fat expenditure.",
      swapRatio: "50g Tofu + 50g Paneer replaces 100g pure paneer",
      tasteImpact: "High Sensory Match. Smoky tandoori spices mask tofu, delivering pure paneer flavor.",
      textureImpact: "Firm, succulent grilled bites wrapped in warm, toasted flatbread.",
      humanTasteValidation: {
        score: "9.8 / 10",
        verifiedCooks: 96,
        agreementPercent: "Validated in kitchen taste trials",
        badge: "HTV Verified Gold"
      },
      replacedItems: [
        { original: "100% Full-Fat Malai Paneer", replacedWith: "50/50 Tawa Grilled Paneer & Firm Tofu Blend", reason: "Saves ₹32/wrap with superior protein-to-fat balance", tasteMatch: "High Parity" }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "Low-Carb Lettuce & Roti Wrap",
      calorieSaving: "-110 kcal",
      newCalories: 250,
      newMacros: { protein: 21, carbs: 18, fat: 11, fiber: 7 },
      description: "Swaps white tortilla for thin whole-wheat phulka rolled in crisp romaine lettuce leaves."
    },
    ingredients: [
      { name: "Fresh Malai Paneer or Tofu Strips", qtyPerPerson: 100, unit: "g strips", cost: 0.60, category: "Dairy", isReplaceable: true, replaceableType: "budget" },
      { name: "Whole Wheat Roti / Tortilla Wrap", qtyPerPerson: 1, unit: "wrap", cost: 0.25, category: "Bakery" },
      { name: "Fresh Baby Spinach & Sliced Bell Peppers", qtyPerPerson: 60, unit: "g vegetables", cost: 0.18, category: "Produce" },
      { name: "Spicy Mint & Coriander Greek Yogurt Chutney", qtyPerPerson: 30, unit: "g sauce", cost: 0.12, category: "Dairy" },
      { name: "Tandoori Tikka Spices & Lemon Juice", qtyPerPerson: 1, unit: "tsp blend", cost: 0.10, category: "Spices" }
    ],
    steps: [
      "Toss paneer or paneer-tofu strips in tandoori spices, lemon juice, and a drop of mustard oil; sear in a cast-iron skillet for 4 minutes until charred.",
      "Warm the whole wheat roti on dry tawa for 20 seconds per side until pliable.",
      "Spread mint-coriander yogurt chutney down the center of the warm wrap.",
      "Layer fresh washed baby spinach leaves, grilled paneer strips, and crunchy sliced onions.",
      "Tightly fold bottom upward, roll into a snug cylinder, cut diagonally, and serve wrapped in parchment paper."
    ],
    reviews: [
      {
        id: "wrap-rev-1",
        author: "Pooja Malhotra",
        cafeName: "FitBytes Cafe, Gurgaon",
        rating: 5,
        date: "Yesterday",
        verifiedCafe: true,
        text: "The tofu-paneer blend absorbs the tandoori char so well nobody can distinguish it. Our number one fitness order!",
        photo: "./assets/recipes/spinach-paneer-protein-wrap.jpg",
        helpfulCount: 77
      }
    ]
  },
  {
    id: "zesty-kale-roasted-chickpea-salad",
    title: "Crunchy Garlic Kale & Chickpea Caesar",
    category: "Diet Conscious",
    tagline: "Massaged curly kale tossed with crispy garlic-roasted chickpeas, shaved Parmesan, and creamy cashew Caesar dressing.",
    isMostSearched: false,
    rating: 4.90,
    reviewsCount: 88,
    image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=800&auto=format&fit=crop&q=80",
    prepTime: "12 mins",
    cookTime: "15 mins",
    difficulty: "Easy",
    dietary: ["Vegetarian", "Gluten-Free", "Vegan"],
    basePortionPersons: 1,
    baseCostPerPerson: 1.30,
    suggestedRetailPrice: 5.80,
    baseCalories: 310,
    baseMacros: { protein: 14, carbs: 32, fat: 15, fiber: 9 },
    budgetAlternative: {
      active: false,
      title: "Baby Spinach & Roasted Moong Crunch (No Imported Curly Kale)",
      savingsPerPerson: 0.45,
      savingsPercent: "35%",
      newCostPerPerson: 0.85,
      description: "When organic imported kale is out of stock, uses crisp fresh baby palak and spiced roasted lentils for identical hearty texture.",
      swapRatio: "80g Baby Spinach replaces 80g massaged kale",
      tasteImpact: "High Sensory Match. Tangy, savory garlic Caesar punch with zero bitterness.",
      textureImpact: "Tender, hearty greens with crunchy roasted chickpea croutons.",
      humanTasteValidation: {
        score: "9.7 / 10",
        verifiedCooks: 72,
        agreementPercent: "Validated in kitchen taste trials",
        badge: "HTV Verified Gold"
      },
      replacedItems: [
        { original: "Imported Organic Curly Kale", replacedWith: "Farm Fresh Crisp Baby Palak", reason: "Zero bitterness, saves ₹40/salad", tasteMatch: "High Parity" }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "Light Lemon-Mustard Vinaigrette Toss",
      calorieSaving: "-110 kcal",
      newCalories: 200,
      newMacros: { protein: 11, carbs: 26, fat: 6, fiber: 9 },
      description: "Replaces creamy cashew dressing with a light Dijon mustard, lemon juice, and apple cider vinegar emulsion."
    },
    ingredients: [
      { name: "Fresh Curly Kale (stemmed & chopped)", qtyPerPerson: 90, unit: "g fresh greens", cost: 0.50, category: "Produce", isReplaceable: true, replaceableType: "budget" },
      { name: "Oven-Roasted Crunchy Chickpeas", qtyPerPerson: 50, unit: "g croutons", cost: 0.25, category: "Produce" },
      { name: "Silky Cashew & Garlic Caesar Dressing", qtyPerPerson: 30, unit: "ml dressing", cost: 0.30, category: "Pantry" },
      { name: "Shaved Aged Vegetarian Parmesan or Nutritional Yeast", qtyPerPerson: 15, unit: "g cheese", cost: 0.15, category: "Dairy" },
      { name: "Fresh Lemon Juice & Extra Virgin Olive Oil", qtyPerPerson: 10, unit: "ml blend", cost: 0.10, category: "Pantry" }
    ],
    steps: [
      "Remove tough center stems from kale leaves; tear into bite-sized pieces.",
      "Drizzle with 1/2 tsp olive oil and a pinch of salt; massage firmly with fingers for 90 seconds until leaves turn dark emerald and silky tender.",
      "Toss cooked chickpeas with olive oil, garlic powder, and paprika; bake at 200°C for 18 minutes until shatter-crisp.",
      "Pour creamy cashew Caesar dressing over the massaged kale; toss thoroughly to coat every leaf.",
      "Garnish with hot crunchy chickpea croutons and shaved cheese before serving."
    ],
    reviews: [
      {
        id: "kale-rev-1",
        author: "Dr. Alistair Grant",
        cafeName: "The Nutrition Lab, London & Mumbai",
        rating: 5,
        date: "4 days ago",
        verifiedCafe: true,
        text: "The chickpea crouton concept is phenomenal for gluten-free customers. Crunchy, garlic-rich, and super clean.",
        photo: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=600&auto=format&fit=crop&q=80",
        helpfulCount: 51
      }
    ]
  },
  {
    id: "classic-shakshuka-poached-eggs",
    title: "Artisanal Skillet Shakshuka",
    category: "Breakfast & Morning",
    tagline: "North African skillet eggs gently poached in a spiced bell pepper, ripe tomato, and cumin reduction.",
    isMostSearched: true,
    rating: 4.97,
    reviewsCount: 156,
    image: "https://images.unsplash.com/photo-1590412200988-a436970781fa?w=800&auto=format&fit=crop&q=80",
    prepTime: "8 mins",
    cookTime: "14 mins",
    difficulty: "Easy",
    dietary: ["Vegetarian", "Gluten-Free"],
    basePortionPersons: 1,
    baseCostPerPerson: 1.35,
    suggestedRetailPrice: 6.20,
    baseCalories: 340,
    baseMacros: { protein: 18, carbs: 22, fat: 20, fiber: 5 },
    budgetAlternative: {
      active: false,
      title: "Desi Roma Puree & Cottage Cheese Crumbles (No Imported Feta Markup)",
      savingsPerPerson: 0.45,
      savingsPercent: "33%",
      newCostPerPerson: 0.90,
      description: "Replaces high-priced Greek imported feta with freshly crumbled salted paneer and slow-simmered local Roma tomatoes.",
      swapRatio: "30g Crumbled Paneer + lemon zest replaces 30g imported feta",
      tasteImpact: "High Sensory Match. Savory cumin-spiced warmth with creamy yolk richness.",
      textureImpact: "Runny golden egg yolks swimming in thick, chunky spiced tomato gravy.",
      humanTasteValidation: {
        score: "9.8 / 10",
        verifiedCooks: 112,
        agreementPercent: "Validated in kitchen taste trials",
        badge: "HTV Verified Gold"
      },
      replacedItems: [
        { original: "Imported Greek Barrel Feta (30g)", replacedWith: "Crumbled Farmhouse Paneer with Lemon Salt", reason: "Prevents excessive saltiness while saving ₹38/portion", tasteMatch: "High Parity" }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "Egg White & Roasted Pepper Skillet",
      calorieSaving: "-110 kcal",
      newCalories: 230,
      newMacros: { protein: 22, carbs: 18, fat: 8, fiber: 5 },
      description: "Uses 1 whole egg + 2 egg whites poached in rich vegetable reduction for high protein and low dietary cholesterol."
    },
    ingredients: [
      { name: "Farm Fresh Large Free-Range Eggs", qtyPerPerson: 2, unit: "eggs", cost: 0.40, category: "Produce" },
      { name: "Crushed Ripe Roma Tomatoes & Bell Peppers", qtyPerPerson: 180, unit: "g spiced base", cost: 0.40, category: "Produce" },
      { name: "Extra Virgin Olive Oil", qtyPerPerson: 1, unit: "tablespoon", cost: 0.18, category: "Pantry" },
      { name: "Smoked Paprika, Cumin & Ground Coriander", qtyPerPerson: 1, unit: "tsp blend", cost: 0.12, category: "Spices" },
      { name: "Crumbled Feta or Farmhouse Paneer", qtyPerPerson: 30, unit: "g cheese", cost: 0.25, category: "Dairy", isReplaceable: true, replaceableType: "budget" }
    ],
    steps: [
      "In a small cast-iron skillet, heat olive oil; sauté diced onions and red bell peppers until soft and lightly caramelized.",
      "Add minced garlic, cumin, and smoked paprika, stirring for 45 seconds until aromatic.",
      "Pour in crushed tomatoes; simmer for 8 minutes until sauce is thick and saucy.",
      "Use the back of a spoon to create two wells in the simmering sauce; crack an egg gently into each well.",
      "Cover skillet and cook over low heat for 5–6 minutes until whites are just set and yolks remain runny.",
      "Garnish with crumbled feta or paneer, fresh cilantro, and serve sizzling hot with toasted sourdough."
    ],
    reviews: [
      {
        id: "shakshuka-rev-1",
        author: "Chef Zaid Mansoor",
        cafeName: "Levant Morning Cafe, Bangalore",
        rating: 5,
        date: "Yesterday",
        verifiedCafe: true,
        text: "The cast-iron skillet presentation keeps the shakshuka sizzling right until the customer's table. High margin staple!",
        photo: "https://images.unsplash.com/photo-1590412200988-a436970781fa?w=600&auto=format&fit=crop&q=80",
        helpfulCount: 94
      }
    ]
  },
  {
    id: "overnight-chia-berry-pudding",
    title: "Almond Milk Chia & Wild Berry Parfait",
    category: "Breakfast & Morning",
    tagline: "Slow-hydrated organic black chia seeds steeped in vanilla almond milk, layered with fresh berry compote and granola.",
    isMostSearched: false,
    rating: 4.93,
    reviewsCount: 104,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
    prepTime: "5 mins",
    cookTime: "0 mins",
    difficulty: "Easy",
    dietary: ["Vegetarian", "Gluten-Free", "Vegan", "Dairy-Free"],
    basePortionPersons: 1,
    baseCostPerPerson: 1.10,
    suggestedRetailPrice: 4.80,
    baseCalories: 260,
    baseMacros: { protein: 8, carbs: 34, fat: 11, fiber: 12 },
    budgetAlternative: {
      active: false,
      title: "Fresh Toned Milk & Basil Seeds (Sabja) Silk (No High-Import Chia)",
      savingsPerPerson: 0.40,
      savingsPercent: "36%",
      newCostPerPerson: 0.70,
      description: "When imported chia seeds are high cost, uses sweet basil seeds (sabja) which hydrate in 15 minutes with cooling Ayurvedic properties.",
      swapRatio: "25g Sabja seeds replaces 25g Chia seeds",
      tasteImpact: "High Sensory Match. Subtle floral vanilla creaminess with popping texture.",
      textureImpact: "Delicate jelly pearls suspended in chilled aromatic milk.",
      humanTasteValidation: {
        score: "9.8 / 10",
        verifiedCooks: 84,
        agreementPercent: "Validated in kitchen taste trials",
        badge: "HTV Verified Gold"
      },
      replacedItems: [
        { original: "Imported Organic Chia Seeds", replacedWith: "Cooling Sweet Basil Seeds (Sabja)", reason: "Hydrates 4x faster and saves ₹32 per jar", tasteMatch: "High Parity" }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "Stevia & Unsweetened Coconut Water Gel",
      calorieSaving: "-100 kcal",
      newCalories: 160,
      newMacros: { protein: 5, carbs: 18, fat: 8, fiber: 11 },
      description: "Hydrates seeds in tender coconut water with zero added cane sugars for clean electrolyte hydration."
    },
    ingredients: [
      { name: "Organic Black Chia Seeds", qtyPerPerson: 25, unit: "g seeds", cost: 0.40, category: "Produce", isReplaceable: true, replaceableType: "budget" },
      { name: "Unsweetened Vanilla Almond Milk", qtyPerPerson: 120, unit: "ml plant milk", cost: 0.30, category: "Dairy" },
      { name: "Wild Blackberry & Blueberry Compote", qtyPerPerson: 40, unit: "g compote", cost: 0.25, category: "Produce" },
      { name: "Toasted Rolled Oats Granola", qtyPerPerson: 20, unit: "g crunch", cost: 0.15, category: "Grains" }
    ],
    steps: [
      "Whisk chia seeds into vanilla almond milk with a drop of pure maple syrup; stir again after 5 minutes to prevent clumping.",
      "Cover and chill overnight (or minimum 4 hours) in glass jars until thick, pudding-like consistency develops.",
      "Spoon wild berry compote at the bottom of serving tumbler.",
      "Layer chilled chia pudding over the berries.",
      "Crown with toasted crunchy granola and sliced fresh strawberries right before service."
    ],
    reviews: [
      {
        id: "chia-rev-1",
        author: "Natasha Roy",
        cafeName: "The Morning Spot, Mumbai",
        rating: 5,
        date: "3 days ago",
        verifiedCafe: true,
        text: "Zero cook-time item that we prep in 50-jar batches every evening. Customers love the grab-and-go convenience.",
        photo: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80",
        helpfulCount: 65
      }
    ]
  },
  {
    id: "fluffy-buttermilk-pancakes",
    title: "Fluffy Golden Buttermilk Pancakes",
    category: "Breakfast & Morning",
    tagline: "Thick, cloud-like diner pancakes served with melted cultured butter and warm amber maple syrup.",
    isMostSearched: true,
    rating: 4.96,
    reviewsCount: 178,
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&auto=format&fit=crop&q=80",
    prepTime: "10 mins",
    cookTime: "8 mins",
    difficulty: "Easy",
    dietary: ["Vegetarian"],
    basePortionPersons: 1,
    baseCostPerPerson: 0.95,
    suggestedRetailPrice: 4.90,
    baseCalories: 390,
    baseMacros: { protein: 10, carbs: 62, fat: 12, fiber: 2 },
    budgetAlternative: {
      active: false,
      title: "Fresh Milk & Lemon Curdle Leaven (No Specialty Buttermilk Buying)",
      savingsPerPerson: 0.25,
      savingsPercent: "26%",
      newCostPerPerson: 0.70,
      description: "When commercial cultured buttermilk is missing, adds 1 tbsp fresh lemon juice to warm whole milk for instant lactic lift.",
      swapRatio: "120ml Milk + 1 tsp lemon juice replaces 120ml packaged buttermilk",
      tasteImpact: "High Sensory Match. Sweet, buttery vanilla aroma with gentle tang.",
      textureImpact: "Extra fluffy, 1-inch tall pancakes that soak syrup effortlessly.",
      humanTasteValidation: {
        score: "9.9 / 10",
        verifiedCooks: 122,
        agreementPercent: "Validated in kitchen taste trials",
        badge: "HTV Verified Gold"
      },
      replacedItems: [
        { original: "Commercial Cultured Buttermilk Carton", replacedWith: "Farm Fresh Milk & Lemon Curdle Brew", reason: "Zero kitchen spoilage, saves ₹20 per stack", tasteMatch: "High Parity" }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "Oat Flour & Banana Protein Pancakes",
      calorieSaving: "-130 kcal",
      newCalories: 260,
      newMacros: { protein: 14, carbs: 42, fat: 5, fiber: 6 },
      description: "Blends rolled oats with ripe banana and egg whites for naturally sweetened morning protein."
    },
    ingredients: [
      { name: "Unbleached Pastry Flour", qtyPerPerson: 80, unit: "g flour", cost: 0.20, category: "Bakery" },
      { name: "Fresh Milk & Lemon Curdle / Buttermilk", qtyPerPerson: 120, unit: "ml liquid", cost: 0.25, category: "Dairy", isReplaceable: true, replaceableType: "budget" },
      { name: "Farm Fresh Egg", qtyPerPerson: 1, unit: "egg", cost: 0.15, category: "Produce" },
      { name: "Melted Table Butter & Baking Powder", qtyPerPerson: 15, unit: "g blend", cost: 0.15, category: "Dairy" },
      { name: "Warm Maple Syrup & Fresh Berries", qtyPerPerson: 30, unit: "ml drizzle", cost: 0.20, category: "Sweetener" }
    ],
    steps: [
      "Whisk flour, baking powder, a pinch of baking soda, and sugar in a large bowl.",
      "In a separate bowl, whisk buttermilk (or milk-lemon curdle), egg, and melted butter.",
      "Gently combine wet and dry ingredients with a fork; leave batter lumpy and let rest for 6 minutes (do not over-mix).",
      "Ladle onto a medium-hot buttered griddle; cook until bubbles form on top and burst.",
      "Flip gently and cook for 90 seconds until golden brown on both sides.",
      "Stack high, crown with butter pat, and pour warm maple syrup over the top."
    ],
    reviews: [
      {
        id: "pancakes-rev-1",
        author: "Chef Emily Vance",
        cafeName: "Morning Maple Diner, Chicago",
        rating: 5,
        date: "2 days ago",
        verifiedCafe: true,
        text: "The resting step creates immense steam pockets. Tallest and fluffiest pancakes we've ever served.",
        photo: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&auto=format&fit=crop&q=80",
        helpfulCount: 82
      }
    ]
  },
  {
    id: "mumbai-street-kanda-poha",
    title: "Rustic Mumbai Kanda Batata Poha",
    category: "Breakfast & Morning",
    tagline: "Light, fluffy flattened rice tempered with mustard seeds, crunchy peanuts, turmeric, and fresh lime juice.",
    isMostSearched: true,
    rating: 4.95,
    reviewsCount: 160,
    image: "./assets/recipes/mumbai-street-kanda-poha.jpg",
    prepTime: "8 mins",
    cookTime: "8 mins",
    difficulty: "Easy",
    dietary: ["Vegetarian", "Gluten-Free", "Vegan"],
    basePortionPersons: 1,
    baseCostPerPerson: 0.40,
    suggestedRetailPrice: 2.20,
    baseCalories: 270,
    baseMacros: { protein: 7, carbs: 46, fat: 7, fiber: 4 },
    budgetAlternative: {
      active: false,
      title: "Toasted Roasted Chana Dal (No Expensive Nut Oil)",
      savingsPerPerson: 0.12,
      savingsPercent: "30%",
      newCostPerPerson: 0.28,
      description: "When raw peanuts are costly or when nut-free allergen requests occur, uses golden roasted chana dal for equal crunchy pop.",
      swapRatio: "15g Roasted Chana replaces 15g raw peanuts",
      tasteImpact: "High Sensory Match. Golden turmeric aromatics with tangy lemon finish.",
      textureImpact: "Featherlight, non-sticky rice flakes with crispy savory tempering.",
      humanTasteValidation: {
        score: "9.8 / 10",
        verifiedCooks: 110,
        agreementPercent: "Validated in kitchen taste trials",
        badge: "HTV Verified Gold"
      },
      replacedItems: [
        { original: "Raw Shelled Peanuts", replacedWith: "Roasted Split Bengal Gram (Chana Dal)", reason: "Nut-free allergen safety and 30% lower ingredient cost", tasteMatch: "High Parity" }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "50/50 Red Rice Poha & Steamed Green Peas",
      calorieSaving: "-60 kcal",
      newCalories: 210,
      newMacros: { protein: 8, carbs: 36, fat: 4, fiber: 6 },
      description: "Uses unpolished red rice flakes and double sweet peas for low glycemic index."
    },
    ingredients: [
      { name: "Thick Flattened Rice (Jada Poha)", qtyPerPerson: 80, unit: "g dry flakes", cost: 0.15, category: "Grains" },
      { name: "Finely Chopped Red Onions & Potatoes", qtyPerPerson: 60, unit: "g produce", cost: 0.10, category: "Produce" },
      { name: "Raw Peanuts or Roasted Gram", qtyPerPerson: 15, unit: "g nuts/gram", cost: 0.05, category: "Produce", isReplaceable: true, replaceableType: "budget" },
      { name: "Mustard Seeds, Curry Leaves & Green Chilies", qtyPerPerson: 1, unit: "tsp tadka", cost: 0.05, category: "Spices" },
      { name: "Fresh Coriander, Fresh Coconut & Lime Juice", qtyPerPerson: 15, unit: "g garnish", cost: 0.05, category: "Produce" }
    ],
    steps: [
      "Rinse thick poha gently in a colander under running water for 30 seconds; drain well and let rest for 5 minutes (it will absorb water and become soft).",
      "Heat oil in a kadai; fry peanuts until golden and crunchy, remove and set aside.",
      "In the same oil, add mustard seeds, green chilies, and fresh curry leaves until they crackle.",
      "Add finely diced potatoes and onions with turmeric powder; sauté covered over low flame until potatoes are fork-tender.",
      "Gently fluff softened poha with a fork; fold into the kadai with salt and sugar; steam covered for 2 minutes.",
      "Squeeze fresh lime juice, top with fried peanuts, fresh grated coconut, and chopped coriander."
    ],
    reviews: [
      {
        id: "poha-rev-1",
        author: "Sunita Gokhale",
        cafeName: "Katta Morning Cafe, Pune",
        rating: 5,
        date: "Yesterday",
        verifiedCafe: true,
        text: "The quick colander rinse keeps every single grain separate without turning soggy or clumping together. Perfect texture!",
        photo: "./assets/recipes/mumbai-street-kanda-poha.jpg",
        helpfulCount: 79
      }
    ]
  },
  {
    id: "classic-french-omelette-sourdough",
    title: "Classic French Herb Omelette & Sourdough",
    category: "Breakfast & Morning",
    tagline: "Silky, custardy French rolled omelette infused with fresh tarragon and chives, served alongside buttered sourdough.",
    isMostSearched: false,
    rating: 4.94,
    reviewsCount: 110,
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80",
    prepTime: "5 mins",
    cookTime: "3 mins",
    difficulty: "Medium",
    dietary: ["Vegetarian"],
    basePortionPersons: 1,
    baseCostPerPerson: 1.15,
    suggestedRetailPrice: 5.80,
    baseCalories: 330,
    baseMacros: { protein: 19, carbs: 18, fat: 21, fiber: 2 },
    budgetAlternative: {
      active: false,
      title: "Desi Ghee Glaze & Local Farm Eggs (No French Butter Cost)",
      savingsPerPerson: 0.35,
      savingsPercent: "30%",
      newCostPerPerson: 0.80,
      description: "Replaces imported European churned butter with aromatic domestic clarified butter for a rich golden sheen.",
      swapRatio: "15g Desi Ghee replaces 20g imported European butter",
      tasteImpact: "High Sensory Match. Velvety, melt-in-mouth egg custard with savory chives.",
      textureImpact: "Pale yellow exterior with soft, creamy scrambled interior core.",
      humanTasteValidation: {
        score: "9.8 / 10",
        verifiedCooks: 88,
        agreementPercent: "Validated in kitchen taste trials",
        badge: "HTV Verified Gold"
      },
      replacedItems: [
        { original: "Imported Normandy European Cultured Butter", replacedWith: "Farmhouse Clarified Desi Ghee", reason: "Prevents browning and cuts fat cost by 30%", tasteMatch: "High Parity" }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "2-White 1-Whole Egg Light Roll",
      calorieSaving: "-90 kcal",
      newCalories: 240,
      newMacros: { protein: 21, carbs: 18, fat: 10, fiber: 2 },
      description: "Combines 2 egg whites with 1 yolk whisked with sparkling water for high volume and reduced dietary lipids."
    },
    ingredients: [
      { name: "Farm Fresh Free-Range Eggs", qtyPerPerson: 3, unit: "eggs", cost: 0.50, category: "Produce" },
      { name: "Unsalted Churned Table Butter", qtyPerPerson: 20, unit: "g butter", cost: 0.20, category: "Dairy", isReplaceable: true, replaceableType: "budget" },
      { name: "Fresh Chives, Parsley & Chervil", qtyPerPerson: 1, unit: "tablespoon herbs", cost: 0.15, category: "Herbs" },
      { name: "Toasted Artisanal Sourdough Slice", qtyPerPerson: 1, unit: "slice", cost: 0.25, category: "Bakery" },
      { name: "Flaky Sea Salt & White Pepper", qtyPerPerson: 0.5, unit: "tsp blend", cost: 0.05, category: "Spices" }
    ],
    steps: [
      "Crack eggs into a bowl; whisk thoroughly with a fork until whites and yolks are completely uniform with zero streaks.",
      "Heat a non-stick 8-inch skillet over medium heat; melt butter until foaming without turning brown.",
      "Pour eggs in; immediately shake pan vigorously with one hand while stirring rapidly in small circles with a silicone spatula.",
      "When curds are creamy and barely set, smooth the surface and pull pan off heat.",
      "Tilt pan and roll the omelette into a neat cigar shape onto a warm plate.",
      "Brush top with a dab of butter for shine, scatter fresh chives, and serve with toasted sourdough."
    ],
    reviews: [
      {
        id: "omelette-rev-1",
        author: "Chef Pierre Blanc",
        cafeName: "Bistro Matin, Mumbai",
        rating: 5,
        date: "3 days ago",
        verifiedCafe: true,
        text: "The rapid circular stirring technique produces a breathtaking velvety core with zero browning. Pure culinary elegance.",
        photo: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80",
        helpfulCount: 61
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
