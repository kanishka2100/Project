// FlavorShift AI - Intelligent Culinary Ingredient Substitution & Human Taste Validation Platform
// Core Recipe and Ingredient Database with High-Resolution Visual Culinary Assets

const RECIPES_DATA = [
  {
    id: "paneer-butter-masala",
    title: "Velvety Paneer Butter Masala (Makhani)",
    category: "Cafe & Bistro Curries",
    tagline: "India's beloved makhani classic, optimized with FlavorShift AI for when Fresh Cream is missing or too costly.",
    isMostSearched: true,
    rating: 4.96,
    reviewsCount: 142,
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=900&auto=format&fit=crop&q=85",
    prepTime: "10 mins",
    cookTime: "15 mins",
    difficulty: "Medium",
    dietary: ["Vegetarian", "Gluten-Free"],
    basePortionPersons: 1,
    baseCostPerPerson: 2.10,
    suggestedRetailPrice: 8.50,
    baseCalories: 560,
    baseMacros: { protein: 22, carbs: 24, fat: 42, fiber: 5 },
    heroFlavor: "Creamy, Buttery & Aromatic Kashmiri Spices",

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
        { original: "Commercial Dairy Fresh Heavy Cream (100ml)", replacedWith: "Soaked Cashew & Milk Velvet Puree (60g + 40g)", reason: "Saves ₹55 / $0.95 per portion; prevents gravy separation under heat", tasteMatch: "98%" },
        { original: "Imported European Salted Butter", replacedWith: "Farm Fresh Desi Ghee & Clarified Butter Blend", reason: "Adds authentic rustic caramel aroma while cutting fat expenditure", tasteMatch: "99%" }
      ]
    },

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

    veganOption: {
      active: false,
      title: "100% Plant-Based Tofu Makhani with Coconut-Cashew Silk",
      description: "Replaces dairy paneer with pressed firm organic tofu and swaps dairy cream with soaked cashew-coconut blossom silk.",
      replacedItems: [
        { original: "Dairy Milk Paneer", replacedWith: "Herb & Turmeric Marinated Pressed Organic Firm Tofu" },
        { original: "Dairy Fresh Cream", replacedWith: "Rich Soaked Cashew & Coconut Blossom Emulsion" }
      ]
    },

    ingredients: [
      { name: "Fresh Malai Paneer Cubes", qtyPerPerson: 150, unit: "g fresh cubes", cost: 0.90, category: "Dairy", isReplaceable: true, replaceableType: "calorie-vegan", icon: "🧀" },
      { name: "Fresh Commercial Dairy Cream", qtyPerPerson: 60, unit: "g velvety", cost: 0.65, category: "Dairy", isReplaceable: true, replaceableType: "budget-calorie-vegan", icon: "🥛" },
      { name: "Ripe Roma Tomato Puree", qtyPerPerson: 1.5, unit: "medium tomatoes", cost: 0.20, category: "Produce", icon: "🍅" },
      { name: "Salted Butter / Ghee", qtyPerPerson: 1.5, unit: "tablespoons", cost: 0.20, category: "Dairy", isReplaceable: true, replaceableType: "calorie", icon: "🧈" },
      { name: "Ginger-Garlic Fresh Paste", qtyPerPerson: 1, unit: "teaspoon", cost: 0.05, category: "Produce", icon: "🧄" },
      { name: "Kashmiri Degi Mirch & Garam Masala", qtyPerPerson: 1, unit: "teaspoon blend", cost: 0.04, category: "Spices", icon: "🌶️" },
      { name: "Roasted Kasuri Methi (Fenugreek)", qtyPerPerson: 0.5, unit: "teaspoon crushed", cost: 0.03, category: "Herbs", icon: "🌿" },
      { name: "Honey or Raw Jaggery", qtyPerPerson: 0.5, unit: "teaspoon", cost: 0.03, category: "Pantry", icon: "🍯" }
    ],

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
        photo: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80",
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
    rating: 4.92,
    reviewsCount: 78,
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=900&auto=format&fit=crop&q=85",
    prepTime: "8 mins",
    cookTime: "5 mins",
    difficulty: "Easy",
    dietary: ["Vegetarian"],
    basePortionPersons: 1,
    baseCostPerPerson: 3.85,
    suggestedRetailPrice: 12.50,
    baseCalories: 480,
    baseMacros: { protein: 16, carbs: 42, fat: 28, fiber: 9 },
    heroFlavor: "Citrusy, Bright Green Butteriness & Poached Egg Velvet",

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
      { name: "Artisan Sourdough Bread", qtyPerPerson: 1, unit: "thick slice", cost: 0.65, category: "Bakery", isReplaceable: true, replaceableType: "calorie", icon: "🍞" },
      { name: "Fresh Hass Avocado", qtyPerPerson: 1, unit: "medium ripe", cost: 1.80, category: "Produce", isReplaceable: true, replaceableType: "budget", icon: "🥑" },
      { name: "Greek Barrel-Aged Feta", qtyPerPerson: 30, unit: "g (crumbled)", cost: 0.85, category: "Dairy", isReplaceable: true, replaceableType: "budget-vegan", icon: "🧀" },
      { name: "Free-Range Farm Egg", qtyPerPerson: 1, unit: "large egg", cost: 0.35, category: "Poultry", isReplaceable: true, replaceableType: "calorie-vegan", icon: "🍳" },
      { name: "Extra Virgin Olive Oil", qtyPerPerson: 1, unit: "tablespoon", cost: 0.15, category: "Oils", isReplaceable: true, replaceableType: "calorie", icon: "🫒" },
      { name: "Fresh Meyer Lemon Juice", qtyPerPerson: 1, unit: "teaspoon", cost: 0.05, category: "Produce", icon: "🍋" },
      { name: "Crushed Aleppo Red Pepper Flakes", qtyPerPerson: 0.5, unit: "pinch", cost: 0.02, category: "Spices", icon: "🌶️" },
      { name: "Radish & Micro Pea Shoots", qtyPerPerson: 10, unit: "g garnish", cost: 0.18, category: "Produce", icon: "🌱" },
      { name: "Maldon Flaky Sea Salt", qtyPerPerson: 1, unit: "pinch", cost: 0.02, category: "Pantry", icon: "🧂" }
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
    rating: 4.95,
    reviewsCount: 94,
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=900&auto=format&fit=crop&q=85",
    prepTime: "10 mins",
    cookTime: "12 mins",
    difficulty: "Medium",
    dietary: ["Vegetarian"],
    basePortionPersons: 1,
    baseCostPerPerson: 4.80,
    suggestedRetailPrice: 17.50,
    baseCalories: 640,
    baseMacros: { protein: 22, carbs: 68, fat: 31, fiber: 5 },
    heroFlavor: "Earth Woodland Umami, Roasted Garlic & Parmesan Gloss",

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
      { name: "Fresh Egg Fettuccine Pasta", qtyPerPerson: 120, unit: "g fresh", cost: 0.90, category: "Pasta", isReplaceable: true, replaceableType: "calorie", icon: "🍝" },
      { name: "Wild Chanterelle & Cremini Mushrooms", qtyPerPerson: 100, unit: "g sliced", cost: 1.70, category: "Produce", isReplaceable: true, replaceableType: "budget", icon: "🍄" },
      { name: "Heavy Whipping Cream (36% fat)", qtyPerPerson: 80, unit: "g equivalent", cost: 0.70, category: "Dairy", isReplaceable: true, replaceableType: "calorie-vegan", icon: "🥛" },
      { name: "White Truffle Infused Olive Oil", qtyPerPerson: 1, unit: "teaspoon finish", cost: 0.80, category: "Oils", isReplaceable: true, replaceableType: "budget", icon: "🫒" },
      { name: "Aged Parmigiano-Reggiano", qtyPerPerson: 25, unit: "g grated", cost: 0.50, category: "Dairy", isReplaceable: true, replaceableType: "budget-vegan", icon: "🧀" },
      { name: "Shallot & Fresh Garlic Cloves", qtyPerPerson: 2, unit: "cloves minced", cost: 0.10, category: "Produce", icon: "🧄" },
      { name: "Fresh Garden Thyme Leaves", qtyPerPerson: 2, unit: "sprigs", cost: 0.05, category: "Produce", icon: "🌿" },
      { name: "Cracked Black Peppercorns & Sea Salt", qtyPerPerson: 1, unit: "pinch", cost: 0.05, category: "Spices", icon: "🧂" }
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
        photo: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&auto=format&fit=crop&q=80",
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
    rating: 4.94,
    reviewsCount: 86,
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=900&auto=format&fit=crop&q=85",
    prepTime: "12 mins",
    cookTime: "35 mins",
    difficulty: "Medium",
    dietary: ["Vegetarian", "Gluten-Free"],
    basePortionPersons: 1,
    baseCostPerPerson: 2.10,
    suggestedRetailPrice: 8.50,
    baseCalories: 460,
    baseMacros: { protein: 9, carbs: 32, fat: 34, fiber: 0 },
    heroFlavor: "Burnt Toffee Caramel Crust with Custardy Molten Center",

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
      { name: "Full-Fat Cream Cheese (or Curd Blend)", qtyPerPerson: 120, unit: "g block", cost: 1.20, category: "Dairy", isReplaceable: true, replaceableType: "budget", icon: "🧀" },
      { name: "Heavy Whipping Cream", qtyPerPerson: 40, unit: "g velvety", cost: 0.35, category: "Dairy", isReplaceable: true, replaceableType: "calorie", icon: "🥛" },
      { name: "Farm Fresh Whole Eggs", qtyPerPerson: 1, unit: "large egg", cost: 0.30, category: "Poultry", icon: "🥚" },
      { name: "Organic Cane Sugar", qtyPerPerson: 30, unit: "g baker", cost: 0.10, category: "Pantry", isReplaceable: true, replaceableType: "calorie", icon: "🍬" },
      { name: "Pure Madagascar Vanilla Extract", qtyPerPerson: 0.5, unit: "teaspoon", cost: 0.10, category: "Flavors", icon: "🌾" },
      { name: "Cornstarch (Gluten-Free)", qtyPerPerson: 1, unit: "teaspoon binder", cost: 0.05, category: "Pantry", icon: "🥣" }
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
    rating: 4.88,
    reviewsCount: 62,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=900&auto=format&fit=crop&q=85",
    prepTime: "3 mins",
    cookTime: "3 mins",
    difficulty: "Easy",
    dietary: ["Vegan", "Vegetarian", "Gluten-Free", "Dairy-Free"],
    basePortionPersons: 1,
    baseCostPerPerson: 1.45,
    suggestedRetailPrice: 6.25,
    baseCalories: 185,
    baseMacros: { protein: 4, carbs: 24, fat: 7, fiber: 3 },
    heroFlavor: "Golden Spice Warmth, Ceylon Cinnamon & Silk Oat Microfoam",

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
      { name: "Barista Edition Oat Milk", qtyPerPerson: 1, unit: "cup equivalent", cost: 0.80, category: "Plant Milk", isReplaceable: true, replaceableType: "calorie", icon: "🥛" },
      { name: "Fresh Turmeric Root (or powder)", qtyPerPerson: 1, unit: "teaspoon", cost: 0.25, category: "Spices", isReplaceable: true, replaceableType: "budget", icon: "🫚" },
      { name: "Fresh Ginger Juice", qtyPerPerson: 0.5, unit: "teaspoon", cost: 0.10, category: "Produce", icon: "🫚" },
      { name: "Ceylon Cinnamon & Black Pepper", qtyPerPerson: 0.25, unit: "teaspoon blend", cost: 0.05, category: "Spices", icon: "🪵" },
      { name: "Pure Maple Syrup", qtyPerPerson: 1, unit: "tablespoon", cost: 0.20, category: "Sweetener", isReplaceable: true, replaceableType: "calorie", icon: "🍁" }
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
    id: "mediterranean-falafel-bowl",
    title: "Crispy Herb Falafel Mezze Glow Bowl",
    category: "Brunch & Toast",
    tagline: "Vibrant Mediterranean cafe bowl with golden herbed chickpea falafels, ruby sumac pickled onions & tahini drizzle.",
    isMostSearched: true,
    rating: 4.93,
    reviewsCount: 57,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=900&auto=format&fit=crop&q=85",
    prepTime: "12 mins",
    cookTime: "8 mins",
    difficulty: "Easy",
    dietary: ["Vegan", "Vegetarian", "Gluten-Free"],
    basePortionPersons: 1,
    baseCostPerPerson: 2.30,
    suggestedRetailPrice: 11.50,
    baseCalories: 510,
    baseMacros: { protein: 19, carbs: 58, fat: 22, fiber: 14 },
    heroFlavor: "Coriander-Cumin Crunch, Creamy Roasted Garlic Tahini & Sumac Zing",

    budgetAlternative: {
      active: false,
      title: "Toasted Sesame & Sunflower Seed Silk (No Expensive Imported Tahini)",
      savingsPerPerson: 0.90,
      savingsPercent: "39%",
      newCostPerPerson: 1.40,
      description: "Imported Lebanese tahini is steep. FlavorShift AI whips lightly toasted white sesame seeds with golden sunflower seeds and fresh lemon to provide identical nutty richness at 39% lower ingredient cost.",
      swapRatio: "For 50g Tahini → 30g Lightly Toasted Sesame + 20g Sunflower Seed Puree + 1 tsp Lemon",
      tasteImpact: "97% Taste Match. Creamy, nutty, and savory with delicate lemon tang.",
      textureImpact: "Luxurious ribbons that coat falafels evenly.",
      humanTasteValidation: { score: "9.8 / 10", verifiedCooks: 104, agreementPercent: "97% rated consistency identical to Lebanese paste", badge: "HTV Verified Gold" },
      replacedItems: [
        { original: "Imported Specialty Roasted Tahini", replacedWith: "Toasted Sesame & Sunflower Silk Dressing", reason: "Saves $0.90 per bowl while keeping velvety drizzle mouthfeel", tasteMatch: "97%" }
      ]
    },

    calorieAlternative: {
      active: false,
      title: "Air-Crisped Protein Falafel Bowl with Greek Yogurt Dip",
      calorieDrop: 180,
      newCalories: 330,
      newMacros: { protein: 24, carbs: 42, fat: 8, fiber: 13 },
      caloriePercent: "-35%",
      description: "Air-fries falafels with avocado oil mist instead of deep frying in heavy oil. Swaps heavy oil drizzle for lemon-herb Greek yogurt sauce.",
      humanTasteValidation: { score: "9.4 / 10", verifiedCooks: 68, agreementPercent: "93% positive" },
      replacedItems: [
        { original: "Deep Fry Oil Absorption (4 tbsp)", replacedWith: "Air-Fryer Crisp with Avocado Oil Spritz", calorieSaving: "-130 kcal" },
        { original: "Heavy Olive Oil Dressing", replacedWith: "Lemon-Dill Strained Yogurt Sauce", calorieSaving: "-50 kcal" }
      ]
    },

    veganOption: {
      active: false,
      title: "100% Certified Plant-Based Mezze Formula",
      description: "Naturally vegan when served with pure seed tahini sauce and olive oil drizzle.",
      replacedItems: []
    },

    ingredients: [
      { name: "Soaked Kabuli Chickpeas & Fresh Herbs", qtyPerPerson: 120, unit: "g ground mix", cost: 0.50, category: "Produce", icon: "🧆" },
      { name: "Imported Roasted Sesame Tahini", qtyPerPerson: 40, unit: "g velvety", cost: 0.70, category: "Pantry", isReplaceable: true, replaceableType: "budget", icon: "🫙" },
      { name: "Organic Baby Spinach & Wild Arugula", qtyPerPerson: 50, unit: "g greens", cost: 0.35, category: "Produce", icon: "🥗" },
      { name: "Persian Cucumbers & Cherry Tomatoes", qtyPerPerson: 80, unit: "g diced", cost: 0.35, category: "Produce", icon: "🥒" },
      { name: "Pickled Sumac Red Onions", qtyPerPerson: 20, unit: "g tangy", cost: 0.15, category: "Produce", icon: "🧅" },
      { name: "Extra Virgin Olive Oil / Oil Spritz", qtyPerPerson: 1, unit: "tablespoon", cost: 0.20, category: "Oils", isReplaceable: true, replaceableType: "calorie", icon: "🫒" },
      { name: "Coriander, Cumin, Garlic & Sea Salt", qtyPerPerson: 1, unit: "teaspoon blend", cost: 0.05, category: "Spices", icon: "🌿" }
    ],

    steps: [
      "Blend soaked chickpeas with garlic, fresh parsley, cilantro, cumin, coriander, and sea salt into a coarse meal.",
      "Shape into 5 bite-sized patties and air-fry at 195°C (385°F) for 10 minutes until deeply golden and crispy.",
      "Whisk tahini (or sesame-sunflower puree) with ice-cold water, lemon juice, and minced garlic until pale and silky.",
      "Build bowl base with tender baby greens, diced Persian cucumber, and ripe cherry tomatoes.",
      "Arrange crispy hot falafels over the salad bed.",
      "Top with ruby sumac pickled onions and drizzle generously with velvety tahini sauce."
    ],

    reviews: [
      {
        id: "r-falafel",
        author: "Chef Samira H.",
        cafeName: "Cedars Green Bistro, Brooklyn",
        rating: 5,
        date: "4 days ago",
        verifiedCafe: true,
        text: "The sesame-sunflower seed substitution solved our tahini supply chain squeeze. It tastes even fresher and keeps the falafel bowl margin at an astounding 81%!",
        photo: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80",
        helpfulCount: 41
      }
    ]
  },

  {
    id: "artisan-margherita-sourdough-pizza",
    title: "Neapolitan Sourdough Pizza with Buffalo Melt",
    category: "Pastas & Mains",
    tagline: "Wood-fired style artisan sourdough pizza, blistered to perfection with San Marzano tomatoes and melted curd silk.",
    isMostSearched: true,
    rating: 4.96,
    reviewsCount: 112,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900&auto=format&fit=crop&q=85",
    prepTime: "15 mins",
    cookTime: "6 mins",
    difficulty: "Medium",
    dietary: ["Vegetarian"],
    basePortionPersons: 1,
    baseCostPerPerson: 3.10,
    suggestedRetailPrice: 15.00,
    baseCalories: 680,
    baseMacros: { protein: 26, carbs: 84, fat: 24, fiber: 6 },
    heroFlavor: "Blistered Fermented Crust, San Marzano Sweet Acidity & Fresh Basil Melt",

    budgetAlternative: {
      active: false,
      title: "Hand-Stretched Low-Moisture Mozzarella & Ricotta Cream Melt",
      savingsPerPerson: 1.45,
      savingsPercent: "46%",
      newCostPerPerson: 1.65,
      description: "Imported fresh Italian Buffalo Mozzarella costs up to $3 per pizza ball. FlavorShift AI blends fresh whole milk mozzarella with a touch of creamy ricotta to create an identical stretchy, blistered milky pool without watery crust pooling.",
      swapRatio: "70g Domestic Whole Milk Mozzarella + 30g Fresh Ricotta Cream",
      tasteImpact: "98% Taste Match. Creamy, milky, and salty with perfect pull.",
      textureImpact: "Golden blistered cheese bubbles with zero watery leakage on the sourdough crust.",
      humanTasteValidation: { score: "9.9 / 10", verifiedCooks: 122, agreementPercent: "98% preferred this crust stability over wet buffalo mozzarella", badge: "HTV Verified Gold" },
      replacedItems: [
        { original: "Imported Italian Buffalo Mozzarella (125g)", replacedWith: "Domestic Whole Milk Mozzarella & Ricotta Blend", reason: "Saves $1.45/pizza and eliminates soggy center pooling", tasteMatch: "98%" }
      ]
    },

    calorieAlternative: {
      active: false,
      title: "Thin Crust Protein Pizza with Light Buffalo Curd",
      calorieDrop: 260,
      newCalories: 420,
      newMacros: { protein: 32, carbs: 54, fat: 10, fiber: 5 },
      caloriePercent: "-38%",
      description: "Ultra-thin fermented crust with part-skim mozzarella and nutritional yeast dust, cutting carbs and fats significantly.",
      humanTasteValidation: { score: "9.3 / 10", verifiedCooks: 71, agreementPercent: "91% positive" },
      replacedItems: [
        { original: "Full Fat Mozzarella (120g)", replacedWith: "Part-Skim Moisture-Managed Mozzarella", calorieSaving: "-160 kcal" },
        { original: "Thick Crust Dough (220g)", replacedWith: "Thin Stretch Fermented Sourdough Crust (140g)", calorieSaving: "-100 kcal" }
      ]
    },

    veganOption: {
      active: false,
      title: "100% Plant-Based Cashew Mozzarella Melt",
      description: "Uses cultured cashew-tapioca cheese that melts and bubbles authentically under high oven heat.",
      replacedItems: [
        { original: "Dairy Mozzarella", replacedWith: "Cultured Organic Cashew-Tapioca Stretchy Melt" }
      ]
    },

    ingredients: [
      { name: "Fermented Artisan Sourdough Dough Ball", qtyPerPerson: 180, unit: "g dough", cost: 0.60, category: "Bakery", icon: "🥖" },
      { name: "Imported Italian Buffalo Mozzarella", qtyPerPerson: 100, unit: "g fresh", cost: 1.80, category: "Dairy", isReplaceable: true, replaceableType: "budget-vegan", icon: "🧀" },
      { name: "San Marzano D.O.P. Crushed Tomatoes", qtyPerPerson: 80, unit: "g sauce", cost: 0.40, category: "Produce", icon: "🍅" },
      { name: "Fresh Genovese Sweet Basil Leaves", qtyPerPerson: 6, unit: "fresh leaves", cost: 0.15, category: "Herbs", icon: "🌿" },
      { name: "Extra Virgin Olive Oil", qtyPerPerson: 1, unit: "teaspoon", cost: 0.10, category: "Oils", icon: "🫒" },
      { name: "Maldon Sea Salt & Dried Oregano", qtyPerPerson: 0.5, unit: "pinch", cost: 0.05, category: "Spices", icon: "🧂" }
    ],

    steps: [
      "Preheat pizza stone or steel to maximum 250°C (500°F) for 45 minutes.",
      "Gently stretch sourdough ball using fingertips into a 10-inch round, preserving airy rim (cornicione).",
      "Spoon crushed San Marzano tomato puree in concentric spirals, leaving a 1-inch border.",
      "Tear fresh mozzarella (or ricotta-mozzarella blend) evenly across the pie.",
      "Bake for 5-6 minutes until cheese is vigorously bubbling with golden blisters and crust is charred.",
      "Scatter fresh Genovese basil leaves and drizzle cold-pressed extra virgin olive oil before slicing."
    ],

    reviews: [
      {
        id: "r-pizza",
        author: "Chef Paolo R.",
        cafeName: "Bella Luna Trattoria, Chicago",
        rating: 5,
        date: "3 days ago",
        verifiedCafe: true,
        text: "Using the whole milk mozzarella + ricotta blend was a revelation. It stops the infamous 'soggy center' from wet buffalo cheese, cooks faster, and cuts food cost by 46%!",
        photo: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80",
        helpfulCount: 54
      }
    ]
  },

  {
    id: "dark-chocolate-lava-souffle",
    title: "Belgian Molten Dark Chocolate Lava Soufflé",
    category: "Bakery & Desserts",
    tagline: "Decadent dessert with warm molten chocolate river core, engineered without expensive Valrhona chocolate.",
    isMostSearched: false,
    rating: 4.97,
    reviewsCount: 103,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=900&auto=format&fit=crop&q=85",
    prepTime: "10 mins",
    cookTime: "11 mins",
    difficulty: "Medium",
    dietary: ["Vegetarian"],
    basePortionPersons: 1,
    baseCostPerPerson: 2.40,
    suggestedRetailPrice: 9.75,
    baseCalories: 490,
    baseMacros: { protein: 8, carbs: 46, fat: 31, fiber: 5 },
    heroFlavor: "Deep 70% Cacao Bittersweet Warmth, Vanilla Bean & Molten Fudge",

    budgetAlternative: {
      active: false,
      title: "Dutch-Processed Dark Cocoa & Espresso Fudge Silk",
      savingsPerPerson: 1.20,
      savingsPercent: "50%",
      newCostPerPerson: 1.20,
      description: "Imported French chocolate bars carry massive wholesale markups. FlavorShift AI combines Dutch-processed dark cocoa powder with clarified butter and a hint of fresh espresso shot to mimic 72% single-origin molten chocolate at 50% less cost.",
      swapRatio: "For 100g Baking Chocolate → 45g Dutch Cocoa + 40g Butter + 15g Espresso Water",
      tasteImpact: "98% Match. Intensely rich, dark chocolate aroma with balanced sweetness.",
      textureImpact: "Volcanic molten core that flows smoothly when pierced with a spoon.",
      humanTasteValidation: { score: "9.9 / 10", verifiedCooks: 110, agreementPercent: "98% diners rated molten center superior to commercial blocks", badge: "HTV Verified Gold" },
      replacedItems: [
        { original: "Imported Valrhona Baking Chocolate Bar (100g)", replacedWith: "Dutch Cocoa & Espresso Brown Butter Silk", reason: "Saves $1.20/portion with richer cacao depth", tasteMatch: "98%" }
      ]
    },

    calorieAlternative: {
      active: false,
      title: "Keto Skinny Molten Chocolate Pot (Avocado-Cacao)",
      calorieDrop: 220,
      newCalories: 270,
      newMacros: { protein: 12, carbs: 16, fat: 16, fiber: 7 },
      caloriePercent: "-45%",
      description: "Replaces heavy butter and sugar with ripe mashed avocado, monk fruit, and egg whites.",
      humanTasteValidation: { score: "9.2 / 10", verifiedCooks: 58, agreementPercent: "90% positive" },
      replacedItems: [
        { original: "Sugar & Salted Butter (60g)", replacedWith: "Silky Avocado Mash + Monk Fruit Baker Drops", calorieSaving: "-180 kcal" },
        { original: "Extra Egg Yolks", replacedWith: "Fluffy Whipped Egg Whites", calorieSaving: "-40 kcal" }
      ]
    },

    veganOption: {
      active: false,
      title: "100% Plant-Based Molten Lava Souffle",
      description: "Blends aquafaba whipped foam, dark cocoa, coconut oil, and almond milk for a completely egg-free molten flow.",
      replacedItems: [
        { original: "Dairy Butter & Eggs", replacedWith: "Organic Aquafaba & Cold-Pressed Coconut Butter" }
      ]
    },

    ingredients: [
      { name: "70% Dark Cacao Chocolate / Cocoa Blend", qtyPerPerson: 70, unit: "g gourmet", cost: 1.20, category: "Bakery", isReplaceable: true, replaceableType: "budget", icon: "🍫" },
      { name: "Unsalted Grass-Fed Butter", qtyPerPerson: 40, unit: "g creamery", cost: 0.45, category: "Dairy", isReplaceable: true, replaceableType: "calorie-vegan", icon: "🧈" },
      { name: "Whole Eggs & Yolks", qtyPerPerson: 1.5, unit: "farm eggs", cost: 0.40, category: "Poultry", icon: "🥚" },
      { name: "Raw Unrefined Cane Sugar", qtyPerPerson: 25, unit: "g baker", cost: 0.15, category: "Pantry", isReplaceable: true, replaceableType: "calorie", icon: "🍬" },
      { name: "Unbleached Pastry Flour", qtyPerPerson: 15, unit: "g sifted", cost: 0.10, category: "Bakery", icon: "🌾" },
      { name: "Madagascar Vanilla & Pinch Sea Salt", qtyPerPerson: 0.5, unit: "teaspoon", cost: 0.10, category: "Flavors", icon: "🧂" }
    ],

    steps: [
      "Preheat cafe convection oven to 200°C (400°F). Generously butter and cocoa-dust ramekins.",
      "Gently melt dark chocolate with butter over a gentle water bath until smooth and glossy.",
      "Whisk eggs and sugar until pale, tripled in volume, and forming ribbon trails.",
      "Fold melted chocolate gently into egg foam without deflating the aeration.",
      "Sift in flour and salt, folding with a rubber spatula just until no streaks remain.",
      "Divide batter into prepared ramekins. Bake for exactly 11 minutes until edges are set and center remains soft.",
      "Invert onto warm dessert plates, dust with powdered sugar, and serve immediately with vanilla bean gelato."
    ],

    reviews: [
      {
        id: "r-choco",
        author: "Pastry Chef Nicole V.",
        cafeName: "Atelier Chocolat, Montreal",
        rating: 5,
        date: "2 days ago",
        verifiedCafe: true,
        text: "Our most requested weekend dessert! The cocoa & espresso butter ratio gives a richer, less cloying sweetness than pure chocolate bars, saving us $120 weekly.",
        photo: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80",
        helpfulCount: 63
      }
    ]
  },

  {
    id: "matcha-pistachio-cloud-latte",
    title: "Kyoto Ceremonial Matcha Pistachio Cold Cloud",
    category: "Coffee & Drinks",
    tagline: "Vibrant emerald ceremonial matcha poured over iced oat milk, crowned with velvety pistachio cream cold foam.",
    isMostSearched: false,
    rating: 4.91,
    reviewsCount: 49,
    image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=900&auto=format&fit=crop&q=85",
    prepTime: "4 mins",
    cookTime: "1 min",
    difficulty: "Easy",
    dietary: ["Vegan", "Vegetarian", "Gluten-Free", "Dairy-Free"],
    basePortionPersons: 1,
    baseCostPerPerson: 1.65,
    suggestedRetailPrice: 6.95,
    baseCalories: 160,
    baseMacros: { protein: 5, carbs: 18, fat: 6, fiber: 3 },
    heroFlavor: "Earthy Umami Green Tea, Toasted Pistachio Silk & Chilled Foam",

    budgetAlternative: {
      active: false,
      title: "Toasted Pumpkin Seed & Almond Silk Cold Foam",
      savingsPerPerson: 0.75,
      savingsPercent: "45%",
      newCostPerPerson: 0.90,
      description: "Imported pistachio butter costs over $45/kg. FlavorShift AI blends roasted green pumpkin seed (pepita) butter with almond milk to achieve the exact pastel green hue and toasted nutty sweetness at 45% lower cost.",
      swapRatio: "1 tbsp Pistachio Butter → 1.5 tbsp Toasted Pepita Butter + 1 drop Natural Almond Extract",
      tasteImpact: "96% Taste Match. Toasted nutty sweetness with bright green cold foam aesthetics.",
      textureImpact: "Dense microfoam that floats effortlessly atop iced matcha for 15+ minutes.",
      humanTasteValidation: { score: "9.7 / 10", verifiedCooks: 83, agreementPercent: "96% couldn't distinguish from expensive pistachio butter", badge: "HTV Verified Gold" },
      replacedItems: [
        { original: "Imported Sicilian Pistachio Butter (25g)", replacedWith: "Toasted Green Pepita Silk & Almond Foam", reason: "Saves $0.75 per drink and retains pastel green aesthetics", tasteMatch: "96%" }
      ]
    },

    calorieAlternative: {
      active: false,
      title: "Zero-Sugar Matcha Protein Cloud",
      calorieDrop: 85,
      newCalories: 75,
      newMacros: { protein: 9, carbs: 3, fat: 2, fiber: 2 },
      caloriePercent: "-53%",
      description: "Unsweetened cashew-almond milk with vanilla whey or pea protein cold foam sweetened with organic monkfruit.",
      humanTasteValidation: { score: "9.4 / 10", verifiedCooks: 46, agreementPercent: "93% positive" },
      replacedItems: [
        { original: "Sweetened Vanilla Oat Milk", replacedWith: "Unsweetened Vanilla Almond Milk", calorieSaving: "-55 kcal" },
        { original: "Heavy Whipping Cream Foam", replacedWith: "Chilled Frothable Pea Protein Cold Foam", calorieSaving: "-30 kcal" }
      ]
    },

    veganOption: {
      active: false,
      title: "100% Certified Plant-Based Formula",
      description: "Naturally plant-based with oat milk and seed butter foam.",
      replacedItems: []
    },

    ingredients: [
      { name: "Ceremonial Grade Uji Matcha Powder", qtyPerPerson: 2.5, unit: "g sifted", cost: 0.70, category: "Flavors", icon: "🍵" },
      { name: "Barista Edition Oat Milk", qtyPerPerson: 180, unit: "g chilled", cost: 0.40, category: "Plant Milk", isReplaceable: true, replaceableType: "calorie", icon: "🥛" },
      { name: "Pure Sicilian Pistachio Butter (or Pepita Silk)", qtyPerPerson: 20, unit: "g paste", cost: 0.80, category: "Dry Fruits", isReplaceable: true, replaceableType: "budget", icon: "🥜" },
      { name: "Pure Agave Nectar or Simple Syrup", qtyPerPerson: 1, unit: "teaspoon", cost: 0.10, category: "Sweetener", isReplaceable: true, replaceableType: "calorie", icon: "🍯" },
      { name: "Pure Spring Water & Clear Ice Cubes", qtyPerPerson: 100, unit: "ml prep", cost: 0.05, category: "Pantry", icon: "🧊" }
    ],

    steps: [
      "In a traditional chawan bowl, whisk sifted ceremonial matcha with 60ml of 75°C (167°F) water using a bamboo chasen until a thick jade froth forms.",
      "In a cold frothing cup, blend pistachio butter (or toasted pepita silk) with cold oat milk until aerated into a stiff cold foam.",
      "Fill a tall faceted glass with crystal-clear ice cubes and pour chilled oat milk to 70% height.",
      "Gently float the whisked jade matcha over the milk using the back of a bar spoon.",
      "Crown with a generous layer of pistachio cold foam and dust with a pinch of matcha powder."
    ],

    reviews: [
      {
        id: "r-matcha",
        author: "Barista Jin T.",
        cafeName: "Kissa Cloud Studio, Seattle",
        rating: 5,
        date: "Yesterday",
        verifiedCafe: true,
        text: "The pepita green seed substitution is a miracle! It gives the exact same pastel green foam and rich nutty creaminess without costing $45 a jar. Customer favorite all summer!",
        photo: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&auto=format&fit=crop&q=80",
        helpfulCount: 38
      }
    ]
  }
];

// Interactive FlavorShift AI Substitution Database for the Instant Swap Lab
const FLAVORSHIFT_SWAP_DATABASE = [
  {
    targetIngredient: "Fresh Cream",
    commonInDishes: ["Paneer Butter Masala", "Dal Makhani", "Pasta Alfredo", "Cream of Tomato Soup"],
    reasonForSwap: "High dairy fat cost, short fridge shelf-life, or out of stock",
    originalPhoto: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80",
    dishPhoto: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80",
    targetRecipeId: "paneer-butter-masala",
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
        htvScore: "9.8 / 10 (142 validations)",
        photo: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80"
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
        htvScore: "9.6 / 10 (98 validations)",
        photo: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80"
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
        htvScore: "9.4 / 10 (76 validations)",
        photo: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80"
      }
    ]
  },
  {
    targetIngredient: "Hass Avocado",
    commonInDishes: ["Avocado Toast", "Guacamole", "Green Salad Bowls"],
    reasonForSwap: "Wholesale price volatility, rapid browning spoilage & scarcity",
    originalPhoto: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80",
    dishPhoto: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=600&auto=format&fit=crop&q=80",
    targetRecipeId: "smashed-avocado-toast",
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
        htvScore: "9.7 / 10 (114 validations)",
        photo: "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=600&auto=format&fit=crop&q=80"
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
        htvScore: "9.3 / 10 (68 validations)",
        photo: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80"
      }
    ]
  },
  {
    targetIngredient: "Black Truffle Oil",
    commonInDishes: ["Wild Mushroom Fettuccine", "Truffle Fries", "Risotto"],
    reasonForSwap: "Exorbitant cost & synthetic 2,4-dithiapentane perfume aroma",
    originalPhoto: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80",
    dishPhoto: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&auto=format&fit=crop&q=80",
    targetRecipeId: "wild-mushroom-truffle-pasta",
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
        htvScore: "9.9 / 10 (136 validations)",
        photo: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&auto=format&fit=crop&q=80"
      }
    ]
  },
  {
    targetIngredient: "Mascarpone & Cream Cheese",
    commonInDishes: ["Basque Cheesecake", "Tiramisu", "Creamy Polenta"],
    reasonForSwap: "Extremely expensive imported dairy product",
    originalPhoto: "https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=600&auto=format&fit=crop&q=80",
    dishPhoto: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&auto=format&fit=crop&q=80",
    targetRecipeId: "basque-burnt-cheesecake",
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
        htvScore: "9.7 / 10 (112 validations)",
        photo: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80"
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
        htvScore: "9.4 / 10 (84 validations)",
        photo: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&auto=format&fit=crop&q=80"
      }
    ]
  },
  {
    targetIngredient: "Pine Nuts",
    commonInDishes: ["Basil Pesto Pasta", "Mezze Bowls", "Salads"],
    reasonForSwap: "Exorbitant ingredient price (₹3,000+/kg or $40/lb)",
    originalPhoto: "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?w=600&auto=format&fit=crop&q=80",
    dishPhoto: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80",
    targetRecipeId: "mediterranean-falafel-bowl",
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
        htvScore: "9.8 / 10 (94 validations)",
        photo: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80"
      }
    ]
  }
];

// Pre-filled Pantry Staples for 1-click selection with appetizing icons & food categories
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
  { name: "Cream Cheese", category: "Bakery", icon: "🍰" },
  { name: "Chickpeas & Tahini", category: "Pantry", icon: "🧆" },
  { name: "Matcha & Oat Milk", category: "Drinks", icon: "🍵" },
  { name: "Dark Cacao Cocoa", category: "Bakery", icon: "🍫" }
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
