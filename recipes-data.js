// FlavorShift AI - Culinary Ingredient Substitution & Kitchen Tasting Guide
// Core Recipe and Ingredient Database with High-Resolution Visual Culinary Assets

const RECIPES_DATA = [
  {
    id: "paneer-butter-masala",
    title: "Velvety Paneer Butter Masala (Makhani)",
    category: "Cafe & Bistro Curries",
    tagline: "Classic spiced tomato-butter curry with adapted options for when fresh dairy cream is unavailable.",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=900&auto=format&fit=crop&q=85",
    prepTime: "10 mins",
    cookTime: "15 mins",
    difficulty: "Medium",
    dietary: ["Vegetarian", "Gluten-Free"],
    basePortionPersons: 1,
    heroFlavor: "Creamy, Buttery & Aromatic Kashmiri Spices",

    budgetAlternative: {
      active: false,
      title: "Soaked Golden Cashew & Milk Velvet Emulsion (No Fresh Cream Needed)",
      description: "When dairy fresh cream is unavailable, this swap uses a soaked cashew-nut emulsion blended with warm milk. Provides a rich, glossy finish that simmers smoothly without splitting.",
      swapRatio: "For every 100g Fresh Cream → Use 60g Soaked Cashew Paste + 40g Warm Milk (or Whisked Fresh Malai)",
      tasteImpact: "Preserves the rich, lightly sweet and tangy balance of traditional makhani gravy.",
      textureImpact: "Thick and smooth consistency that coats paneer evenly under gentle simmer.",
      replacedItems: [
        { original: "Dairy Fresh Heavy Cream (100ml)", replacedWith: "Soaked Cashew & Milk Velvet Puree (60g + 40g)", reason: "Replaces dairy cream fat body and helps prevent gravy separation under heat" },
        { original: "Salted Butter", replacedWith: "Clarified Butter / Desi Ghee Blend", reason: "Offers nutty aroma with longer shelf stability" }
      ]
    },

    calorieAlternative: {
      active: false,
      title: "Lighter Protein Makhani (Greek Yogurt & Blanched Silken Tofu Cream)",
      description: "Uses whisked strained Greek yogurt blended with silken tofu instead of heavy dairy cream, paired with lightly seared low-fat paneer and reduced cooking butter.",
      replacedItems: [
        { original: "Heavy Whipping Cream", replacedWith: "Silky Whisked Greek Yogurt & Silken Tofu Emulsion" },
        { original: "Excess Cooking Butter", replacedWith: "Measured Cold-Pressed Oil + Tomato Glaze" }
      ]
    },

    veganOption: {
      active: false,
      title: "Plant-Based Tofu Makhani with Coconut-Cashew Silk",
      description: "Replaces dairy paneer with pressed firm organic tofu and swaps dairy cream with soaked cashew-coconut blossom silk.",
      replacedItems: [
        { original: "Dairy Milk Paneer", replacedWith: "Herb & Turmeric Marinated Pressed Firm Tofu" },
        { original: "Dairy Fresh Cream", replacedWith: "Soaked Cashew & Coconut Emulsion" }
      ]
    },

    ingredients: [
      { name: "Fresh Malai Paneer Cubes", qtyPerPerson: 150, unit: "g fresh cubes", category: "Dairy", isReplaceable: true, replaceableType: "calorie-vegan", icon: "🧀" },
      { name: "Fresh Dairy Cream", qtyPerPerson: 60, unit: "g velvety", category: "Dairy", isReplaceable: true, replaceableType: "budget-calorie-vegan", icon: "🥛" },
      { name: "Ripe Roma Tomato Puree", qtyPerPerson: 1.5, unit: "medium tomatoes", category: "Produce", icon: "🍅" },
      { name: "Salted Butter / Ghee", qtyPerPerson: 1.5, unit: "tablespoons", category: "Dairy", isReplaceable: true, replaceableType: "calorie", icon: "🧈" },
      { name: "Ginger-Garlic Fresh Paste", qtyPerPerson: 1, unit: "teaspoon", category: "Produce", icon: "🧄" },
      { name: "Kashmiri Degi Mirch & Garam Masala", qtyPerPerson: 1, unit: "teaspoon blend", category: "Spices", icon: "🌶️" },
      { name: "Roasted Kasuri Methi (Fenugreek)", qtyPerPerson: 0.5, unit: "teaspoon crushed", category: "Herbs", icon: "🌿" },
      { name: "Honey or Raw Jaggery", qtyPerPerson: 0.5, unit: "teaspoon", category: "Pantry", icon: "🍯" }
    ],

    steps: [
      "In a wide heavy-bottomed pan, heat butter or oil over gentle heat. Add ginger-garlic paste and saute for 45 seconds until fragrant.",
      "Pour in spiced ripe tomato reduction, stirring continuously until fat separates from the masala base.",
      "Prepare your Cream Swap: If using Cashew-Milk velvet, blend soaked cashews with warm milk until smooth; if using lighter mode, whisk Greek yogurt with silken tofu puree.",
      "Gently fold the cream alternative into the simmering tomato gravy, maintaining low heat to preserve smooth emulsion texture.",
      "Slide fresh paneer cubes gently into the bubbling makhani gravy, coating each piece without breaking.",
      "Crush roasted Kasuri Methi between your palms directly over the curry to release aromatic oils.",
      "Simmer for 3 minutes, finish with a light swirl of cream substitute, and serve warm with naan or jeera rice."
    ],

    reviews: []
  },

  {
    id: "smashed-avocado-toast",
    title: "Signature Smashed Avocado & Feta Toast",
    category: "Brunch & Toast",
    tagline: "Brunch staple adapted with green pea and ricotta alternatives when ripe avocados or imported feta are scarce.",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=900&auto=format&fit=crop&q=85",
    prepTime: "8 mins",
    cookTime: "5 mins",
    difficulty: "Easy",
    dietary: ["Vegetarian"],
    basePortionPersons: 1,
    heroFlavor: "Citrusy, Bright Green Creaminess & Poached Egg",

    budgetAlternative: {
      active: false,
      title: "Green Pea & Hass Avocado Blend + Ricotta Crumbles",
      description: "Blends sweet tender green peas with ripe Hass avocado to stretch yield while keeping a bright green mash. Swaps imported Greek feta with whipped domestic ricotta.",
      swapRatio: "Equal Parts Blanched Sweet Green Peas + Hass Avocado Mash",
      tasteImpact: "Fresh, bright, buttery profile with mild garden sweetness.",
      textureImpact: "Thick, spreadable mash that holds vibrant green color longer before browning.",
      replacedItems: [
        { original: "Hass Avocado (1 whole per person)", replacedWith: "Equal-Part Hass Avocado & Sweet Green Pea Mash", reason: "Stretches avocado yield and maintains bright green color on display" },
        { original: "Imported Greek Barrel-Aged Feta", replacedWith: "Fresh Ricotta Crumbles with Lemon Zest", reason: "Locally accessible soft cheese with a clean milky tang" }
      ]
    },

    calorieAlternative: {
      active: false,
      title: "Lighter Avocado & Egg-White Crisp Toast",
      description: "Swaps thick buttered sourdough for thin seeded crispbread, uses poached egg whites in place of a full yolk, and replaces heavy oil drizzle with fresh lemon mist.",
      replacedItems: [
        { original: "Thick Artisanal Sourdough (butter toasted)", replacedWith: "Toasted Thin Seeded Sourdough Crispbread" },
        { original: "Extra Virgin Olive Oil Drizzle", replacedWith: "Fresh Meyer Lemon & Herb Spritz" },
        { original: "Whole Poached Egg", replacedWith: "Poached Egg Whites with Za'atar" }
      ]
    },

    veganOption: {
      active: false,
      title: "Plant-Based Avocado & Tofu-Feta Toast",
      description: "Substitutes feta with herb-marinated firm tofu crumbles and poached egg with seasoned grilled smoky tofu slices.",
      replacedItems: [
        { original: "Greek Feta Cheese", replacedWith: "Herb & Garlic Marinated Firm Tofu Crumbles" },
        { original: "Poached Free-Range Egg", replacedWith: "Smoked Paprika Grilled Tofu Slice" }
      ]
    },

    ingredients: [
      { name: "Artisan Sourdough Bread", qtyPerPerson: 1, unit: "thick slice", category: "Bakery", isReplaceable: true, replaceableType: "calorie", icon: "🍞" },
      { name: "Fresh Hass Avocado", qtyPerPerson: 1, unit: "medium ripe", category: "Produce", isReplaceable: true, replaceableType: "budget", icon: "🥑" },
      { name: "Greek Barrel-Aged Feta", qtyPerPerson: 30, unit: "g (crumbled)", category: "Dairy", isReplaceable: true, replaceableType: "budget-vegan", icon: "🧀" },
      { name: "Free-Range Farm Egg", qtyPerPerson: 1, unit: "large egg", category: "Poultry", isReplaceable: true, replaceableType: "calorie-vegan", icon: "🍳" },
      { name: "Extra Virgin Olive Oil", qtyPerPerson: 1, unit: "tablespoon", category: "Oils", isReplaceable: true, replaceableType: "calorie", icon: "🫒" },
      { name: "Fresh Meyer Lemon Juice", qtyPerPerson: 1, unit: "teaspoon", category: "Produce", icon: "🍋" },
      { name: "Crushed Aleppo Red Pepper Flakes", qtyPerPerson: 0.5, unit: "pinch", category: "Spices", icon: "🌶️" },
      { name: "Radish & Micro Pea Shoots", qtyPerPerson: 10, unit: "g garnish", category: "Produce", icon: "🌱" },
      { name: "Maldon Flaky Sea Salt", qtyPerPerson: 1, unit: "pinch", category: "Pantry", icon: "🧂" }
    ],

    steps: [
      "Lightly toast the sourdough slice until golden brown with a crisp crust and tender crumb.",
      "In a prep bowl, roughly mash the Hass avocado (or green pea blend) with lemon juice, sea salt, and cracked pepper.",
      "Poach the farm egg in simmering water for 3 minutes until white is set and yolk remains liquid.",
      "Generously spread the avocado mash edge-to-edge across the toasted sourdough.",
      "Gently place the warm poached egg in the center.",
      "Scatter crumbled feta (or whipped ricotta), sliced radishes, micro pea shoots, and crushed red pepper flakes.",
      "Finish with citrus-herb mist or extra virgin olive oil drizzle and flaky sea salt."
    ],

    reviews: []
  },

  {
    id: "wild-mushroom-truffle-pasta",
    title: "Truffle-Style Wild Mushroom Fettuccine",
    category: "Pastas & Italian",
    tagline: "Savory mushroom pasta engineered with steeped dried porcini broth in place of costly truffle oil.",
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=900&auto=format&fit=crop&q=85",
    prepTime: "10 mins",
    cookTime: "12 mins",
    difficulty: "Medium",
    dietary: ["Vegetarian"],
    basePortionPersons: 1,
    heroFlavor: "Earthy Woodland Umami, Roasted Garlic & Parmesan Gloss",

    budgetAlternative: {
      active: false,
      title: "Porcini-Infused Brown Cremini with Garlic Butter & Domestic Grana",
      description: "Replaces wild chanterelles and truffle oil with caramelized brown cremini mushrooms deglazed in steeped dried porcini mushroom broth and garlic brown butter. Swaps aged Parmigiano with domestic Grana Padano.",
      swapRatio: "15g Steeped Porcini Broth + 100g Brown Creminis instead of 1 tsp Truffle Oil",
      tasteImpact: "Natural earthy umami depth without overpowering synthetic truffle notes.",
      textureImpact: "Cohesive glossy sauce that clings evenly to hot fettuccine noodles.",
      replacedItems: [
        { original: "Black Truffle Oil & Wild Chanterelles", replacedWith: "Steeped Porcini Mushroom Reduction + Brown Creminis", reason: "Replaces truffle oil with natural mushroom umami and pantry creminis" },
        { original: "24-Month Parmigiano-Reggiano", replacedWith: "Aged Domestic Grana Padano", reason: "Similar salty umami finish with wider regional availability" }
      ]
    },

    calorieAlternative: {
      active: false,
      title: "Light Mushroom Fettuccine (Cauliflower-Cashew Sauce)",
      description: "Replaces heavy whipping cream with a blended puree of steamed cauliflower and light cashew cream, and reduces pan butter.",
      replacedItems: [
        { original: "Heavy Whipping Cream", replacedWith: "Silky Steamed Cauliflower & Garlic Puree" },
        { original: "Excess Pan Butter", replacedWith: "1 tsp Cold-Pressed Olive Oil + Mushroom Broth" }
      ]
    },

    veganOption: {
      active: false,
      title: "Plant-Based Creamy Mushroom Pasta",
      description: "Uses cashew-garlic cream and replaces hard dairy cheese with toasted savory nutritional yeast flakes.",
      replacedItems: [
        { original: "Heavy Cream & Butter", replacedWith: "Soaked Raw Cashew & Shallot Emulsion" },
        { original: "Parmesan Cheese", replacedWith: "Toasted Nutritional Yeast & Walnut Dust" }
      ]
    },

    ingredients: [
      { name: "Fresh Egg Fettuccine Pasta", qtyPerPerson: 120, unit: "g fresh", category: "Pasta", isReplaceable: true, replaceableType: "calorie", icon: "🍝" },
      { name: "Wild Chanterelle & Cremini Mushrooms", qtyPerPerson: 100, unit: "g sliced", category: "Produce", isReplaceable: true, replaceableType: "budget", icon: "🍄" },
      { name: "Heavy Whipping Cream", qtyPerPerson: 80, unit: "g rich", category: "Dairy", isReplaceable: true, replaceableType: "calorie-vegan", icon: "🥛" },
      { name: "White Truffle Infused Olive Oil", qtyPerPerson: 1, unit: "teaspoon finish", category: "Oils", isReplaceable: true, replaceableType: "budget", icon: "🫒" },
      { name: "Aged Parmigiano-Reggiano", qtyPerPerson: 25, unit: "g grated", category: "Dairy", isReplaceable: true, replaceableType: "budget-vegan", icon: "🧀" },
      { name: "Shallot & Fresh Garlic Cloves", qtyPerPerson: 2, unit: "cloves minced", category: "Produce", icon: "🧄" },
      { name: "Fresh Garden Thyme Leaves", qtyPerPerson: 2, unit: "sprigs", category: "Produce", icon: "🌿" },
      { name: "Cracked Black Peppercorns & Sea Salt", qtyPerPerson: 1, unit: "pinch", category: "Spices", icon: "🧂" }
    ],

    steps: [
      "Cook fresh fettuccine in salted boiling water for 3 minutes until al dente.",
      "In a wide pan, sear sliced mushrooms in butter or oil until deeply browned and caramelized.",
      "Add minced shallots, garlic, and fresh thyme, tossing for 60 seconds until fragrant.",
      "Pour in the cream (or cauliflower-cashew emulsion / steeped porcini broth) and simmer 2 minutes to thicken.",
      "Transfer al dente pasta directly into the sauce with pasta water to bind.",
      "Toss vigorously to coat; remove from heat and fold in grated cheese.",
      "Plate into warm bowls, garnishing with cracked pepper and fresh thyme."
    ],

    reviews: []
  },

  {
    id: "basque-burnt-cheesecake",
    title: "San Sebastian Basque Burnt Cheesecake",
    category: "Bakery & Desserts",
    tagline: "Caramelized crust cheesecake adapted for kitchens blending domestic hung curd with cream cheese.",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=900&auto=format&fit=crop&q=85",
    prepTime: "12 mins",
    cookTime: "35 mins",
    difficulty: "Medium",
    dietary: ["Vegetarian", "Gluten-Free"],
    basePortionPersons: 1,
    heroFlavor: "Caramelized Toffee Crust with Custardy Center",

    budgetAlternative: {
      active: false,
      title: "Hung Curd & Cream Cheese Equal Blend",
      description: "Blends strained farmhouse curd (Chakka) equally with cream cheese. Yields a blistered caramelized top with a lighter, subtly tangy custard center.",
      swapRatio: "Equal Parts Chilled Hung Curd + Cream Cheese",
      tasteImpact: "Clean lactic tang that balances baked sugar caramelization.",
      textureImpact: "Smooth, creamy center without graininess.",
      replacedItems: [
        { original: "Full Imported Cream Cheese (150g)", replacedWith: "Equal Blend Hung Farmhouse Curd & Cream Cheese", reason: "Replaces half the cream cheese using house-strained curd for mild tang" }
      ]
    },

    calorieAlternative: {
      active: false,
      title: "Lighter Sweetener & Yogurt Basque Slice",
      description: "Replaces refined white sugar with non-caloric baker sweetener blend, and uses skimmed evaporated milk with Greek yogurt.",
      replacedItems: [
        { original: "Refined White Sugar", replacedWith: "Allulose-Monkfruit Baker Blend" },
        { original: "Heavy Cream", replacedWith: "Skimmed Evaporated Milk + Vanilla" }
      ]
    },

    veganOption: {
      active: false,
      title: "Cashew & Silken Tofu Basque Cake",
      description: "Blends soaked raw cashews, silken tofu, cornstarch, and lemon juice for a dairy-free bake.",
      replacedItems: [
        { original: "Cream Cheese & Eggs", replacedWith: "Blended Cashew-Tofu Custard Emulsion" }
      ]
    },

    ingredients: [
      { name: "Full-Fat Cream Cheese (or Curd Blend)", qtyPerPerson: 120, unit: "g block", category: "Dairy", isReplaceable: true, replaceableType: "budget", icon: "🧀" },
      { name: "Heavy Whipping Cream", qtyPerPerson: 40, unit: "g velvety", category: "Dairy", isReplaceable: true, replaceableType: "calorie", icon: "🥛" },
      { name: "Farm Fresh Whole Eggs", qtyPerPerson: 1, unit: "large egg", category: "Poultry", icon: "🥚" },
      { name: "Organic Cane Sugar", qtyPerPerson: 30, unit: "g baker", category: "Pantry", isReplaceable: true, replaceableType: "calorie", icon: "🍬" },
      { name: "Pure Madagascar Vanilla Extract", qtyPerPerson: 0.5, unit: "teaspoon", category: "Flavors", icon: "🌾" },
      { name: "Cornstarch (Gluten-Free)", qtyPerPerson: 1, unit: "teaspoon binder", category: "Pantry", icon: "🥣" }
    ],

    steps: [
      "Preheat convection oven to 220°C (430°F).",
      "In a mixer, beat softened cream cheese (or hung curd blend) with sugar until smooth and lump-free.",
      "Add eggs one at a time, whisking gently to avoid incorporating excess air bubbles.",
      "Pour in cream and vanilla extract, folding in cornstarch smoothly.",
      "Line a springform mold with crumpled parchment paper extending above the rim.",
      "Bake for 32 minutes until surface is deeply caramelized and center has a gentle wobble.",
      "Cool to room temperature before slicing to achieve the signature soft center."
    ],

    reviews: []
  },

  {
    id: "golden-turmeric-oat-latte",
    title: "Artisan Golden Turmeric & Spiced Oat Latte",
    category: "Coffee & Drinks",
    tagline: "Warm spiced beverage using shelf-stable organic turmeric powder in place of fresh root.",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=900&auto=format&fit=crop&q=85",
    prepTime: "3 mins",
    cookTime: "3 mins",
    difficulty: "Easy",
    dietary: ["Vegan", "Vegetarian", "Gluten-Free", "Dairy-Free"],
    basePortionPersons: 1,
    heroFlavor: "Golden Spice Warmth, Ceylon Cinnamon & Oat Microfoam",

    budgetAlternative: {
      active: false,
      title: "Organic Turmeric Root Powder & Extract Swap",
      description: "Replaces perishable fresh turmeric root and vanilla bean pods with ground organic turmeric powder and pure vanilla extract.",
      swapRatio: "1 tsp Ground Turmeric Powder instead of 15g Fresh Root",
      tasteImpact: "Consistent golden hue and earthy spice warmth with lower prep waste.",
      textureImpact: "Fine suspension in steamed oat milk microfoam.",
      replacedItems: [
        { original: "Fresh grated turmeric root & vanilla pod", replacedWith: "Ground organic turmeric powder & pure vanilla extract", reason: "Reduces prep grating and avoids fresh root spoilage" }
      ]
    },

    calorieAlternative: {
      active: false,
      title: "Lighter Spiced Almond Milk Elixir",
      description: "Replaces sweetened barista oat milk with unsweetened almond milk and uses liquid monk fruit drops instead of syrup.",
      replacedItems: [
        { original: "Barista Edition Oat Milk", replacedWith: "Unsweetened Vanilla Almond Milk" },
        { original: "Pure Maple Syrup", replacedWith: "Organic Monk Fruit Drops" }
      ]
    },

    veganOption: {
      active: false,
      title: "Plant-Based Formula",
      description: "Naturally plant-based when prepared with oat milk and pure maple syrup.",
      replacedItems: []
    },

    ingredients: [
      { name: "Barista Edition Oat Milk", qtyPerPerson: 1, unit: "cup equivalent", category: "Plant Milk", isReplaceable: true, replaceableType: "calorie", icon: "🥛" },
      { name: "Fresh Turmeric Root (or powder)", qtyPerPerson: 1, unit: "teaspoon", category: "Spices", isReplaceable: true, replaceableType: "budget", icon: "🫚" },
      { name: "Fresh Ginger Juice", qtyPerPerson: 0.5, unit: "teaspoon", category: "Produce", icon: "🫚" },
      { name: "Ceylon Cinnamon & Black Pepper", qtyPerPerson: 0.25, unit: "teaspoon blend", category: "Spices", icon: "🪵" },
      { name: "Pure Maple Syrup", qtyPerPerson: 1, unit: "tablespoon", category: "Sweetener", isReplaceable: true, replaceableType: "calorie", icon: "🍁" }
    ],

    steps: [
      "In a steaming pitcher, whisk turmeric, ginger juice, Ceylon cinnamon, black pepper, and maple syrup into a smooth paste.",
      "Add cold oat milk into the pitcher and stir to incorporate.",
      "Steam milk using espresso steam wand to 65°C (150°F) to generate microfoam.",
      "Pour into an 8oz ceramic mug with a slow center pour.",
      "Dust top with cinnamon and serve warm."
    ],

    reviews: []
  },

  {
    id: "mediterranean-falafel-bowl",
    title: "Crispy Herb Falafel Mezze Glow Bowl",
    category: "Brunch & Toast",
    tagline: "Herb-packed baked or air-fried falafel bowl with a sesame-sunflower alternative when tahini is out of stock.",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=900&auto=format&fit=crop&q=85",
    prepTime: "12 mins",
    cookTime: "8 mins",
    difficulty: "Easy",
    dietary: ["Vegan", "Vegetarian", "Gluten-Free"],
    basePortionPersons: 1,
    heroFlavor: "Coriander-Cumin Crunch, Creamy Garlic Seed Dressing & Sumac Zing",

    budgetAlternative: {
      active: false,
      title: "Toasted Sesame & Sunflower Seed Silk (Tahini Alternative)",
      description: "Blends lightly toasted white sesame seeds with sunflower seeds and lemon juice to create a pourable nutty dressing when jarred Lebanese tahini is unavailable.",
      swapRatio: "For 50g Tahini → 30g Lightly Toasted Sesame + 20g Sunflower Seed Puree + 1 tsp Lemon",
      tasteImpact: "Creamy, toasted, savory profile with fresh citrus lift.",
      textureImpact: "Smooth drizzle consistency when whipped with cold water.",
      replacedItems: [
        { original: "Jarred Specialty Roasted Tahini", replacedWith: "Toasted Sesame & Sunflower Seed Dressing", reason: "Reproduces sesame emulsion from whole pantry seeds" }
      ]
    },

    calorieAlternative: {
      active: false,
      title: "Air-Crisped Falafel Bowl with Light Citrus Dressing",
      description: "Air-fries falafels with minimal oil mist instead of deep-frying, and uses light lemon-dill dressing (yogurt optional if non-vegan).",
      replacedItems: [
        { original: "Deep Fry Oil", replacedWith: "Air-Fryer Crisp with Avocado Oil Spritz" },
        { original: "Heavy Oil Drizzle", replacedWith: "Lemon-Herb Dressing" }
      ]
    },

    veganOption: {
      active: false,
      title: "Plant-Based Mezze Formula",
      description: "Naturally vegan when served with pure seed tahini sauce and olive oil drizzle.",
      replacedItems: []
    },

    ingredients: [
      { name: "Soaked Kabuli Chickpeas & Fresh Herbs", qtyPerPerson: 120, unit: "g ground mix", category: "Produce", icon: "🧆" },
      { name: "Roasted Sesame Tahini", qtyPerPerson: 40, unit: "g velvety", category: "Pantry", isReplaceable: true, replaceableType: "budget", icon: "🫙" },
      { name: "Organic Baby Spinach & Wild Arugula", qtyPerPerson: 50, unit: "g greens", category: "Produce", icon: "🥗" },
      { name: "Persian Cucumbers & Cherry Tomatoes", qtyPerPerson: 80, unit: "g diced", category: "Produce", icon: "🥒" },
      { name: "Pickled Sumac Red Onions", qtyPerPerson: 20, unit: "g tangy", category: "Produce", icon: "🧅" },
      { name: "Extra Virgin Olive Oil / Oil Spritz", qtyPerPerson: 1, unit: "tablespoon", category: "Oils", isReplaceable: true, replaceableType: "calorie", icon: "🫒" },
      { name: "Coriander, Cumin, Garlic & Sea Salt", qtyPerPerson: 1, unit: "teaspoon blend", category: "Spices", icon: "🌿" }
    ],

    steps: [
      "Blend soaked chickpeas with garlic, fresh parsley, cilantro, cumin, coriander, and sea salt into a coarse meal.",
      "Shape into 5 bite-sized patties and air-fry at 195°C (385°F) for 10 minutes until golden and crisp.",
      "Whisk tahini (or sesame-sunflower puree) with ice-cold water, lemon juice, and minced garlic until pale and smooth.",
      "Build bowl base with tender baby greens, diced Persian cucumber, and cherry tomatoes.",
      "Arrange crisp falafels over the salad bed.",
      "Top with pickled onions and drizzle with sesame-garlic sauce."
    ],

    reviews: []
  },

  {
    id: "artisan-margherita-sourdough-pizza",
    title: "Neapolitan Sourdough Pizza with Buffalo Melt",
    category: "Pastas & Italian",
    tagline: "Crisp blistered sourdough pizza balancing moisture by blending low-moisture mozzarella and fresh ricotta.",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900&auto=format&fit=crop&q=85",
    prepTime: "15 mins",
    cookTime: "6 mins",
    difficulty: "Medium",
    dietary: ["Vegetarian"],
    basePortionPersons: 1,
    heroFlavor: "Blistered Fermented Crust, Tomato Acidity & Fresh Basil",

    budgetAlternative: {
      active: false,
      title: "Low-Moisture Mozzarella & Ricotta Cream Melt",
      description: "Blends domestic whole-milk mozzarella with whipped fresh ricotta to imitate wet buffalo mozzarella richness while preventing watery pooling in the crust center.",
      swapRatio: "70g Domestic Whole Milk Mozzarella + 30g Fresh Ricotta Cream",
      tasteImpact: "Creamy, milky cheese pull with balanced saltiness.",
      textureImpact: "Melts into golden blisters without leaving excess whey on the crust.",
      replacedItems: [
        { original: "Imported Buffalo Mozzarella (100g)", replacedWith: "Domestic Whole Milk Mozzarella & Ricotta Blend", reason: "Matches creamy mouthfeel while reducing excess moisture release on bake" }
      ]
    },

    calorieAlternative: {
      active: false,
      title: "Thin-Stretch Crust with Part-Skim Mozzarella",
      description: "Stretches fermented sourdough thinner and substitutes part-skim mozzarella.",
      replacedItems: [
        { original: "Full Fat Mozzarella", replacedWith: "Part-Skim Moisture-Managed Mozzarella" },
        { original: "Thick Crust Dough Ball", replacedWith: "Thin-Stretched Fermented Crust" }
      ]
    },

    veganOption: {
      active: false,
      title: "Plant-Based Cashew Mozzarella Melt",
      description: "Uses cultured cashew-tapioca melt styled for high-heat oven baking.",
      replacedItems: [
        { original: "Dairy Mozzarella", replacedWith: "Cultured Cashew-Tapioca Stretchy Melt" }
      ]
    },

    ingredients: [
      { name: "Fermented Artisan Sourdough Dough Ball", qtyPerPerson: 180, unit: "g dough", category: "Bakery", icon: "🥖" },
      { name: "Buffalo Mozzarella", qtyPerPerson: 100, unit: "g fresh", category: "Dairy", isReplaceable: true, replaceableType: "budget-vegan", icon: "🧀" },
      { name: "Crushed Plum Tomatoes", qtyPerPerson: 80, unit: "g sauce", category: "Produce", icon: "🍅" },
      { name: "Fresh Genovese Sweet Basil Leaves", qtyPerPerson: 6, unit: "fresh leaves", category: "Herbs", icon: "🌿" },
      { name: "Extra Virgin Olive Oil", qtyPerPerson: 1, unit: "teaspoon", category: "Oils", icon: "🫒" },
      { name: "Maldon Sea Salt & Dried Oregano", qtyPerPerson: 0.5, unit: "pinch", category: "Spices", icon: "🧂" }
    ],

    steps: [
      "Preheat pizza stone or steel to maximum 250°C (500°F) for 45 minutes.",
      "Gently stretch sourdough ball using fingertips into a 10-inch round, preserving airy rim.",
      "Spoon crushed tomato puree in concentric spirals, leaving a 1-inch border.",
      "Scatter fresh mozzarella (or ricotta-mozzarella blend) evenly across the pie.",
      "Bake for 5-6 minutes until cheese bubbles with golden spots and crust is charred.",
      "Top with fresh basil leaves and light olive oil drizzle before slicing."
    ],

    reviews: []
  },

  {
    id: "dark-chocolate-lava-souffle",
    title: "Molten Dark Chocolate Lava Soufflé",
    category: "Bakery & Desserts",
    tagline: "Warm molten cake with an option to substitute baking chocolate bars using Dutch cocoa powder and espresso.",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=900&auto=format&fit=crop&q=85",
    prepTime: "10 mins",
    cookTime: "11 mins",
    difficulty: "Medium",
    dietary: ["Vegetarian"],
    basePortionPersons: 1,
    heroFlavor: "Bittersweet Dark Cacao Warmth & Vanilla",

    budgetAlternative: {
      active: false,
      title: "Dutch-Processed Dark Cocoa & Espresso Fudge Silk",
      description: "Combines dark Dutch-processed cocoa powder with butter and warm espresso liquid to replicate melted dark baking chocolate bars.",
      swapRatio: "For 100g Baking Chocolate → 45g Dutch Cocoa + 40g Butter + 15g Espresso Water",
      tasteImpact: "Deep dark cocoa character enhanced by subtle roasted coffee notes.",
      textureImpact: "Bakes with crisp outer cake sides and a soft spoonable center.",
      replacedItems: [
        { original: "Specialty Dark Baking Chocolate Bar", replacedWith: "Dutch Cocoa & Espresso Brown Butter Silk", reason: "Creates rich chocolate batter using standard pantry cocoa and butter" }
      ]
    },

    calorieAlternative: {
      active: false,
      title: "Lighter Avocado-Cacao Molten Pot",
      description: "Replaces baking butter and cane sugar with ripe mashed avocado, whipped egg whites, and non-caloric sweetener.",
      replacedItems: [
        { original: "Sugar & Salted Butter", replacedWith: "Mashed Avocado + Monk Fruit Drops" },
        { original: "Extra Egg Yolks", replacedWith: "Whipped Egg Whites" }
      ]
    },

    veganOption: {
      active: false,
      title: "Plant-Based Molten Lava Soufflé",
      description: "Blends whipped aquafaba foam, dark cocoa, coconut oil, and almond milk for an egg-free cake.",
      replacedItems: [
        { original: "Dairy Butter & Eggs", replacedWith: "Aquafaba & Coconut Oil" }
      ]
    },

    ingredients: [
      { name: "Dark Cacao Chocolate / Cocoa Blend", qtyPerPerson: 70, unit: "g gourmet", category: "Bakery", isReplaceable: true, replaceableType: "budget", icon: "🍫" },
      { name: "Unsalted Creamery Butter", qtyPerPerson: 40, unit: "g softened", category: "Dairy", isReplaceable: true, replaceableType: "calorie-vegan", icon: "🧈" },
      { name: "Whole Eggs & Yolks", qtyPerPerson: 1.5, unit: "farm eggs", category: "Poultry", icon: "🥚" },
      { name: "Raw Unrefined Cane Sugar", qtyPerPerson: 25, unit: "g baker", category: "Pantry", isReplaceable: true, replaceableType: "calorie", icon: "🍬" },
      { name: "Unbleached Pastry Flour", qtyPerPerson: 15, unit: "g sifted", category: "Bakery", icon: "🌾" },
      { name: "Madagascar Vanilla & Pinch Sea Salt", qtyPerPerson: 0.5, unit: "teaspoon", category: "Flavors", icon: "🧂" }
    ],

    steps: [
      "Preheat convection oven to 200°C (400°F). Butter and cocoa-dust ramekins.",
      "Melt dark chocolate (or whisk cocoa silk mix) with butter over a gentle water bath until glossy.",
      "Whisk eggs and sugar until pale and thick with ribbon trails.",
      "Fold melted chocolate gently into egg foam without deflating aeration.",
      "Sift in flour and salt, folding gently until no dry streaks remain.",
      "Divide batter into prepared ramekins and bake for 11 minutes until edges set while center remains soft.",
      "Invert onto warm dessert plates and serve immediately."
    ],

    reviews: []
  },

  {
    id: "matcha-pistachio-cloud-latte",
    title: "Kyoto Matcha & Pistachio Cold Cloud",
    category: "Coffee & Drinks",
    tagline: "Whisked matcha over iced oat milk, with a toasted pumpkin seed (pepita) swap for specialty pistachio butter.",
    image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=900&auto=format&fit=crop&q=85",
    prepTime: "4 mins",
    cookTime: "1 min",
    difficulty: "Easy",
    dietary: ["Vegan", "Vegetarian", "Gluten-Free", "Dairy-Free"],
    basePortionPersons: 1,
    heroFlavor: "Earthy Green Tea, Toasted Nutty Silk & Chilled Foam",

    budgetAlternative: {
      active: false,
      title: "Toasted Pumpkin Seed & Almond Silk Cold Foam",
      description: "Blends roasted green pumpkin seed (pepita) butter with oat milk and a drop of almond extract to mimic the pastel hue and nutty richness of imported pistachio paste.",
      swapRatio: "1 tbsp Pistachio Butter → 1.5 tbsp Toasted Pepita Butter + 1 drop Almond Extract",
      tasteImpact: "Toasted nutty sweetness paired with subtle almond aroma and pastel green hue.",
      textureImpact: "Whipped cold foam that pours smoothly over iced matcha.",
      replacedItems: [
        { original: "Specialty Pistachio Butter (20g)", replacedWith: "Toasted Green Pepita Silk & Almond Foam", reason: "Reproduces green hue and toasted nut body with accessible seed butter" }
      ]
    },

    calorieAlternative: {
      active: false,
      title: "Unsweetened Matcha Cold Foam",
      description: "Uses unsweetened almond milk and frothing pea protein foam without added syrups.",
      replacedItems: [
        { original: "Sweetened Oat Milk", replacedWith: "Unsweetened Vanilla Almond Milk" },
        { original: "Syrup Sweetener", replacedWith: "Unsweetened Frothable Cold Foam" }
      ]
    },

    veganOption: {
      active: false,
      title: "Plant-Based Formula",
      description: "Prepared using plant-based oat or almond milk and seed butter foam.",
      replacedItems: []
    },

    ingredients: [
      { name: "Ceremonial Grade Matcha Powder", qtyPerPerson: 2.5, unit: "g sifted", category: "Flavors", icon: "🍵" },
      { name: "Barista Edition Oat Milk", qtyPerPerson: 180, unit: "g chilled", category: "Plant Milk", isReplaceable: true, replaceableType: "calorie", icon: "🥛" },
      { name: "Pistachio Butter (or Pepita Silk)", qtyPerPerson: 20, unit: "g paste", category: "Dry Fruits", isReplaceable: true, replaceableType: "budget", icon: "🥜" },
      { name: "Agave Nectar or Simple Syrup", qtyPerPerson: 1, unit: "teaspoon", category: "Sweetener", isReplaceable: true, replaceableType: "calorie", icon: "🍯" },
      { name: "Spring Water & Clear Ice Cubes", qtyPerPerson: 100, unit: "ml prep", category: "Pantry", icon: "🧊" }
    ],

    steps: [
      "In a bowl, whisk sifted matcha powder with 60ml warm water (75°C / 167°F) using a bamboo whisk until frothy.",
      "In a cold frother, blend pistachio butter (or toasted pepita butter) with chilled oat milk into an aerated foam.",
      "Fill a tall glass with ice cubes and pour chilled oat milk about two-thirds full.",
      "Gently float whisked green matcha over the milk using a bar spoon.",
      "Spoon nut or seed cold foam on top and dust lightly with matcha."
    ],

    reviews: []
  },
  {
    id: "dal-makhani-bistro",
    title: "Slow-Simmered Dal Makhani",
    category: "Cafe & Bistro Curries",
    tagline: "Slow-cooked black lentils, perfected with FlavorShift AI using soaked cashews & churned curd when dairy cream is missing.",
    image: "./assets/recipes/slow-simmered-dal-makhani.jpg",
    prepTime: "15 mins",
    cookTime: "40 mins",
    difficulty: "Medium",
    dietary: ["Vegetarian", "Gluten-Free"],
    basePortionPersons: 1,
    budgetAlternative: {
      active: false,
      title: "Cashew Emulsion & Slow-Roasted Tomato Reduction (No Cream Needed)",
      description: "Replaces excessive fresh cream and block butter with a velvet cashew-milk puree and roasted tomato concentrate.",
      swapRatio: "For 80ml heavy cream → Use 45g cashew puree + 35ml warm skim milk",
      tasteImpact: "Retains velvety, slow-cooked mouthfeel with subtle smoky notes.",
      textureImpact: "Creamy, glossy sheen with no curdling or oil separation.",
      replacedItems: [
        { original: "Heavy Cream (80ml)", replacedWith: "Blended Cashew-Milk Velvet (80g)", reason: "Delivers a silky slow-cooked mouthfeel without heavy dairy cream" }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "Light & Wholesome Protein Dal Makhani",
      description: "Eliminates heavy dairy fat by folding in hung curd and vegetable broth while preserving signature warmth.",
      replacedItems: [
        { original: "Block Butter & Cream (60g)", replacedWith: "Hung Curd & Smoked Jeera Glaze" }
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
      { name: "Whole Black Urad & Rajma", qtyPerPerson: 90, unit: "g soaked", category: "Grains & Pulses" },
      { name: "Dairy Fresh Cream", qtyPerPerson: 50, unit: "ml", category: "Dairy", isReplaceable: true, replaceableType: "budget-calorie-vegan" },
      { name: "Salted Butter", qtyPerPerson: 1.5, unit: "tbsp", category: "Dairy", isReplaceable: true, replaceableType: "calorie" },
      { name: "Smoked Tomato & Ginger Gravy", qtyPerPerson: 100, unit: "ml", category: "Produce" },
      { name: "Kashmiri Chilli & Garam Masala", qtyPerPerson: 1, unit: "tsp", category: "Spices" }
    ],
    steps: [
      "Pressure-cook soaked whole black urad and kidney beans with ginger until fork-tender.",
      "In a heavy pot, simmer pureed ripe tomatoes and spices until the aromatics soften.",
      "Whisk your cashew puree into warm water to form a uniform emulsion.",
      "Gently fold the emulsion into the dal over low heat, allowing the starches to meld for 15 minutes.",
      "Finish with crushed fenugreek and serve piping hot."
    ],
    reviews: []
  },
  {
    id: "royal-shahi-paneer",
    title: "Shahi Paneer in White Velvet Gravy",
    category: "Cafe & Bistro Curries",
    tagline: "Mughlai royal curry re-engineered when khoya (mawa) or melon seeds are unavailable or overpriced.",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80",
    prepTime: "12 mins",
    cookTime: "18 mins",
    difficulty: "Medium",
    dietary: ["Vegetarian", "Gluten-Free"],
    basePortionPersons: 1,
    budgetAlternative: {
      active: false,
      title: "Poppy Seed & Milk Powder Velvet (No Khoya/Mawa)",
      description: "Substitutes expensive evaporated milk solids (khoya) with skim milk powder and soaked white poppy seeds.",
      swapRatio: "For 50g Khoya → Use 30g Skim Milk Powder + 20ml Warm Milk + pinch of cardamom",
      tasteImpact: "Sweet aromatic profile with royal cardamon and saffron notes.",
      textureImpact: "Dense, creamy, clings perfectly to paneer.",
      replacedItems: [
        { original: "Traditional Khoya / Mawa (50g)", replacedWith: "Skim Milk Powder & Poppy Puree (50g)", reason: "Prevents graininess using accessible pantry milk powder" }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "Low-Calorie Shahi Paneer (Almond Milk & Low-Fat Paneer)",
      description: "Replaces heavy dairy fats with unsweetened almond milk and steamed low-fat cottage cheese.",
      replacedItems: [
        { original: "Full-Fat Khoya & Cream", replacedWith: "Steamed Almond Puree & Skim Curd" }
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
      { name: "Malai Paneer Cubes", qtyPerPerson: 140, unit: "g", category: "Dairy", isReplaceable: true, replaceableType: "calorie-vegan" },
      { name: "Commercial Khoya / Mawa", qtyPerPerson: 40, unit: "g", category: "Dairy", isReplaceable: true, replaceableType: "budget-calorie-vegan" },
      { name: "White Onion & Cashew Paste", qtyPerPerson: 80, unit: "g", category: "Produce" },
      { name: "Green Cardamom & Saffron", qtyPerPerson: 0.5, unit: "tsp", category: "Spices" },
      { name: "Desi Ghee", qtyPerPerson: 1, unit: "tbsp", category: "Dairy", isReplaceable: true, replaceableType: "calorie" }
    ],
    steps: [
      "Saute whole cardamom and cinnamon in ghee until fragrant.",
      "Whisk onion paste and cook gently on low flame to maintain a pale ivory color.",
      "Blend milk powder and warm milk into a rich slurry, folding into the simmering gravy.",
      "Gently add paneer cubes and let them absorb the royal saffron gravy for 4 minutes.",
      "Serve garnished with slivered almonds and a whisper of saffron."
    ],
    reviews: []
  },
  {
    id: "punjabi-chole-bhature",
    title: "Amritsari Pindi Chole Masala",
    category: "Cafe & Bistro Curries",
    tagline: "Robust spiced dark chickpeas, formulated with FlavorShift AI for when Anardana or Amla is out of stock.",
    image: "./assets/recipes/amritsari-pindi-chole.jpg",
    prepTime: "10 mins",
    cookTime: "25 mins",
    difficulty: "Easy",
    dietary: ["Vegetarian", "Vegan"],
    basePortionPersons: 1,
    budgetAlternative: {
      active: false,
      title: "Black Tea Steep & Tamarind Extract (No Pomegranate Seeds/Anardana)",
      description: "Replaces costly dried pomegranate seeds (anardana) with steeped Assam black tea and tart tamarind pulp for signature dark color and acidity.",
      swapRatio: "For 2 tsp Anardana → Use 1 tbsp Tamarind Extract + 50ml Steeped Dark Black Tea",
      tasteImpact: "Deep earthy tang with authentic rustic bitterness.",
      textureImpact: "Dark, clinging masala sauce adhering evenly to chickpeas.",
      replacedItems: [
        { original: "Dried Wild Anardana Powder (2 tsp)", replacedWith: "Tamarind Pulp & Assam Tea Reduction", reason: "Adds signature dark tea depth and tart tang without whole anardana" }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "Zero-Oil Roasted Spice Chole",
      description: "Roasted ground spices bloomed in chickpea cooking liquor with zero added oil or ghee.",
      replacedItems: [
        { original: "Refined Oil & Ghee (2 tbsp)", replacedWith: "Simmered Chickpea Aquafaba Glaze" }
      ]
    },
    veganOption: {
      active: false,
      title: "Naturally  Vegan Amritsari Chole",
      description: "Naturally plant-based, simmered with whole spices, black salt, and ginger juliennes.",
      replacedItems: []
    },
    ingredients: [
      { name: "Boiled Kabuli Chickpeas", qtyPerPerson: 180, unit: "g", category: "Grains & Pulses" },
      { name: "Dried Anardana (Pomegranate)", qtyPerPerson: 1.5, unit: "tsp", category: "Spices", isReplaceable: true, replaceableType: "budget" },
      { name: "Chole Spice Blend & Kasuri Methi", qtyPerPerson: 1, unit: "tbsp", category: "Spices" },
      { name: "Mustard Oil / Ghee", qtyPerPerson: 1, unit: "tbsp", category: "Produce", isReplaceable: true, replaceableType: "calorie" },
      { name: "Fresh Ginger & Green Chillies", qtyPerPerson: 1, unit: "tbsp julienned", category: "Produce" }
    ],
    steps: [
      "Simmer boiled chickpeas with steeped tea water and a bay leaf to impart the traditional dark hue.",
      "Dry-roast coriander, cumin, black cardamom, and red chilli powder in a skillet.",
      "Stir tamarind reduction and the roasted spices into the chickpeas, mashing slightly to thicken.",
      "Pour a sizzling ginger-chilli tadka over the bubbling chole and cover for 2 minutes to trap aromas.",
      "Serve with fluffy bhature or steamed basmati rice."
    ],
    reviews: []
  },
  {
    id: "hyderabadi-veg-biryani",
    title: "Dum Pukht Hyderabadi Biryani",
    category: "Cafe & Bistro Curries",
    tagline: "Fragrant basmati layered with vegetables, optimized with FlavorShift AI when pure saffron or kewra is missing.",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&auto=format&fit=crop&q=80",
    prepTime: "20 mins",
    cookTime: "30 mins",
    difficulty: "Hard",
    dietary: ["Vegetarian", "Gluten-Free"],
    basePortionPersons: 1,
    budgetAlternative: {
      active: false,
      title: "Turmeric-Cardamom Essence & Rose Water (No Saffron)",
      description: "Replaces precious saffron threads with cold-pressed turmeric infusion, crushed green cardamom, and culinary rose hydrosol.",
      swapRatio: "For 0.2g Saffron → Use 1/4 tsp Golden Turmeric + 1 tsp Rose Hydrosol + 2 crushed Cardamom pods",
      tasteImpact: "Captures the intoxicating floral aromatics and vibrant royal tint.",
      textureImpact: "Individual grains stay slender, aromatic, and fluffy without discoloration.",
      replacedItems: [
        { original: "Pure Kashmir Mongra Saffron (0.2g)", replacedWith: "Cardamom-Rose Bloom & Organic Turmeric Infusion", reason: "Provides golden hue and cardamom-floral aroma without saffron threads" }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "Light Dum Biryani with Cauliflower Rice Blend",
      description: "Combines  aged basmati with  steamed riced cauliflower and replaces deep-fried onions with air-crisped shallots.",
      replacedItems: [
        { original: "Fried Birista Onions & Ghee (3 tbsp)", replacedWith: "Air-Crisped Shallots & Vegetable Mist" }
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
      { name: "Aged Long-Grain Basmati Rice", qtyPerPerson: 90, unit: "g dry", category: "Grains & Pulses" },
      { name: "Mixed Farm Vegetables (Carrot, Beans, Peas)", qtyPerPerson: 100, unit: "g", category: "Produce" },
      { name: "Pure Saffron Strands", qtyPerPerson: 0.15, unit: "g", category: "Spices", isReplaceable: true, replaceableType: "budget" },
      { name: "Desi Ghee & Fried Onions (Birista)", qtyPerPerson: 2, unit: "tbsp", category: "Dairy", isReplaceable: true, replaceableType: "calorie" },
      { name: "Mint & Coriander Leaves", qtyPerPerson: 1, unit: "handful", category: "Herbs" }
    ],
    steps: [
      "Par-boil soaked aged basmati with cloves, star anise, and cinnamon until  cooked; drain thoroughly.",
      "Saute vegetables with spiced yogurt marinade in a heavy handi until fragrant.",
      "Prepare your FlavorShift floral aroma swap: bloom turmeric and crushed cardamom in warm rose water.",
      "Layer rice over spiced vegetables, drizzling the golden floral essence and mint leaves across the top.",
      "Seal with dough or tight foil for 18 minutes on low heat (Dum) to allow gentle steam circulation.",
      "Gently fluff rice with a flat spoon and serve with mint raita."
    ],
    reviews: []
  },
  {
    id: "palak-paneer-velvet",
    title: "Vibrant Garlic Palak Paneer",
    category: "Cafe & Bistro Curries",
    tagline: "Vivid emerald spinach curry, formulated with FlavorShift AI to prevent dull browning without baking soda.",
    image: "https://images.unsplash.com/photo-1589647363585-f4a7d3877b10?w=800&auto=format&fit=crop&q=80",
    prepTime: "10 mins",
    cookTime: "12 mins",
    difficulty: "Easy",
    dietary: ["Vegetarian", "Gluten-Free"],
    basePortionPersons: 1,
    budgetAlternative: {
      active: false,
      title: "Sweet Green Pea & Ice-Shocked Spinach Puree (No Heavy Cream)",
      description: "Blanches spinach with sweet green peas and an immediate ice-bath shock, yielding a naturally sweet, emerald sauce that stays bright for hours.",
      swapRatio: "For 50ml Fresh Cream → Use 40g Blanched Green Pea Mash + 10ml Warm Water",
      tasteImpact: "Natural sweetness balances spinach bitterness with zero cream required.",
      textureImpact: "Silkier emulsion with natural pectin body and radiant chlorophyll color.",
      replacedItems: [
        { original: "Heavy Cream (50ml)", replacedWith: "Blanched Sweet Pea Puree", reason: "Maintains natural sweet green depth and saves  per plate" }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "Clean Fit Palak Tofu Puree",
      description: "Uses air-fried high-protein organic tofu and skips finishing butter entirely.",
      replacedItems: [
        { original: "Malai Paneer Cubes (140g)", replacedWith: "Firm Organic Tofu Cubes" },
        { original: "Cooking Butter (1 tbsp)", replacedWith: "Garlic Olive Mist" }
      ]
    },
    veganOption: {
      active: false,
      title: " Plant-Based Garlic Palak Tofu",
      description: "Naturally vegan using organic firm tofu simmered in garlic-infused spinach sauce.",
      replacedItems: [
        { original: "Dairy Paneer", replacedWith: "Pressed Organic Tofu" }
      ]
    },
    ingredients: [
      { name: "Fresh Tender Spinach Leaves", qtyPerPerson: 200, unit: "g", category: "Produce" },
      { name: "Malai Paneer Cubes", qtyPerPerson: 120, unit: "g", category: "Dairy", isReplaceable: true, replaceableType: "calorie-vegan" },
      { name: "Fresh Cooking Cream", qtyPerPerson: 40, unit: "ml", category: "Dairy", isReplaceable: true, replaceableType: "budget" },
      { name: "Garlic Cloves (Finely Minced)", qtyPerPerson: 4, unit: "cloves", category: "Produce" },
      { name: "Cumin & Green Chillies", qtyPerPerson: 1, unit: "tsp", category: "Spices" }
    ],
    steps: [
      "Blanch spinach leaves and green peas in boiling water for exactly 75 seconds, then plunge into ice water.",
      "Puree into a silkily vibrant emerald green sauce.",
      "Saute minced garlic and cumin in a pan until golden and fragrant.",
      "Pour spinach-pea puree into pan, gently folding in paneer cubes over low heat.",
      "Simmer for only 2 minutes to preserve vibrant color and nutrients; serve warm."
    ],
    reviews: []
  },
  {
    id: "kashmiri-dum-aloo",
    title: "Kashmiri Shahi Dum Aloo",
    category: "Cafe & Bistro Curries",
    tagline: "Baby potatoes steeped in fennel & dry ginger gravy, perfected when Kashmiri degi mirch is scarce.",
    image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&auto=format&fit=crop&q=80",
    prepTime: "15 mins",
    cookTime: "25 mins",
    difficulty: "Medium",
    dietary: ["Vegetarian", "Gluten-Free"],
    basePortionPersons: 1,
    budgetAlternative: {
      active: false,
      title: "Beetroot-Paprika Infusion (No Costly Kashmiri Chillies)",
      description: "Extracts deep crimson natural hue from grated beetroot water and sweet smoked paprika.",
      swapRatio: "For 2 tbsp Kashmiri Chilli → Use 1 tbsp Paprika + 15ml Beetroot Liquor",
      tasteImpact: "Clean warmth with signature fennel-ginger foundation.",
      textureImpact: "Silky curd-based gravy thoroughly permeating pierced potatoes.",
      replacedItems: [
        { original: "Imported Kashmiri Whole Mirch", replacedWith: "Smoked Paprika & Beetroot Color Glaze", reason: "Produces vibrant orange sheen and warm aromatics without costly whole pods" }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "Air-Crisped Baby Potato Dum Aloo",
      description: "Air-fries poked baby potatoes instead of deep oil frying, simmered in low-fat whisked curd.",
      replacedItems: [
        { original: "Deep-Frying Oil (3 tbsp)", replacedWith: "Air-Frying with Light Mustard Spray" }
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
      { name: "Peeled Baby Potatoes (Pricked)", qtyPerPerson: 180, unit: "g", category: "Produce" },
      { name: "Whisked Fresh Yogurt (Dahi)", qtyPerPerson: 100, unit: "g", category: "Dairy", isReplaceable: true, replaceableType: "vegan" },
      { name: "Kashmiri Chilli & Fennel Powder (Saunf)", qtyPerPerson: 1.5, unit: "tbsp", category: "Spices", isReplaceable: true, replaceableType: "budget" },
      { name: "Dry Ginger Powder (Sonth)", qtyPerPerson: 0.5, unit: "tsp", category: "Spices" },
      { name: "Mustard Oil", qtyPerPerson: 1, unit: "tbsp", category: "Produce", isReplaceable: true, replaceableType: "calorie" }
    ],
    steps: [
      "Prick baby potatoes thoroughly with a fork and air-fry or shallow roast until golden.",
      "Whisk yogurt with fennel powder, dry ginger, and paprika-beetroot crimson infusion.",
      "Heat mustard oil to smoking point, cool slightly, then stir in asafoetida and spices.",
      "Gradually add the whisked yogurt mixture on low flame, stirring continuously to prevent splitting.",
      "Add potatoes, seal with lid, and slow-cook on dum for 12 minutes to infuse flavours."
    ],
    reviews: []
  },
  {
    id: "coastal-malabar-paneer",
    title: "Malabar Coconut Curry with Paneer",
    category: "Cafe & Bistro Curries",
    tagline: "Fragrant Kerala curry, re-engineered when fresh grated coconut or coconut milk is unavailable.",
    image: "./assets/recipes/malabar-coconut-paneer-curry.jpg",
    prepTime: "12 mins",
    cookTime: "15 mins",
    difficulty: "Easy",
    dietary: ["Vegetarian", "Gluten-Free"],
    basePortionPersons: 1,
    budgetAlternative: {
      active: false,
      title: "Desiccated Coconut Steep & Oat Milk Silk (No Canned Coconut Milk)",
      description: "Steeps inexpensive dry bakery desiccated coconut in warm oat milk to extract fresh coconut creaminess without canned milk cost.",
      swapRatio: "For 150ml canned coconut milk → Use 40g desiccated coconut blended with 110ml warm oat milk",
      tasteImpact: "Captures pristine tropical coconut aroma and sweetness.",
      textureImpact: "Velvety, smooth, doesn't split under high tamarind acid.",
      replacedItems: [
        { original: "Canned Coconut Milk (150ml)", replacedWith: "Steeped Desiccated Coconut & Oat Emulsion", reason: "Freshly pressed spice base eliminates pricey pre-packaged blends" }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "Light Malabar Tofu Curry",
      description: "Utilizes organic firm tofu cubes in a lightened coconut-vegetable broth with curry leaves.",
      replacedItems: [
        { original: "Full Fat Paneer & Rich Coconut Cream", replacedWith: "Light Coconut Broth & Seared Tofu" }
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
      { name: "Fresh Paneer or Tofu Cubes", qtyPerPerson: 130, unit: "g", category: "Dairy", isReplaceable: true, replaceableType: "calorie-vegan" },
      { name: "Canned / Fresh Coconut Milk", qtyPerPerson: 140, unit: "ml", category: "Pantry", isReplaceable: true, replaceableType: "budget" },
      { name: "Fresh Curry Leaves & Shallots", qtyPerPerson: 1, unit: "handful", category: "Produce" },
      { name: "Mustard Seeds, Fenugreek & Kokum", qtyPerPerson: 1, unit: "tsp", category: "Spices" },
      { name: "Coconut Oil", qtyPerPerson: 1, unit: "tbsp", category: "Produce", isReplaceable: true, replaceableType: "calorie" }
    ],
    steps: [
      "Splutter mustard seeds and fenugreek in warm coconut oil with crisp curry leaves.",
      "Saute sliced shallots and green chillies until translucent and sweet.",
      "Blend steeped desiccated coconut and oat milk into a smooth ivory cream.",
      "Add turmeric and kokum or tamarind water to develop the signature tangy profile.",
      "Pour in the coconut emulsion, add paneer or tofu cubes, and simmer for 3 minutes before taking off flame."
    ],
    reviews: []
  },
  {
    id: "methi-matar-malai",
    title: "Methi Matar Malai Royale",
    category: "Cafe & Bistro Curries",
    tagline: "Fenugreek and sweet green pea delicacy, formulated when dairy fresh malai is out of stock.",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=80",
    prepTime: "12 mins",
    cookTime: "14 mins",
    difficulty: "Medium",
    dietary: ["Vegetarian", "Gluten-Free"],
    basePortionPersons: 1,
    budgetAlternative: {
      active: false,
      title: "Sunflower Seed & Milk Velvet (No Heavy Cream / Malai)",
      description: "Replaces high-priced cashew paste and dairy malai with toasted sunflower seed puree and warm toned milk.",
      swapRatio: "For 70g Cream → Use 40g Soaked Sunflower Seed Butter + 30ml Milk",
      tasteImpact: "Silky nutty finish perfectly balancing bitter fresh fenugreek.",
      textureImpact: "Glossy ivory sauce coating each pea evenly.",
      replacedItems: [
        { original: "Fresh Dairy Malai / Cream (70g)", replacedWith: "Toasted Sunflower Seed Emulsion", reason: "Light nutty emulsion complements fresh fenugreek leaves without dairy malai" }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "Slim Methi Matar with Greek Yogurt Silk",
      description: "Uses whisked strained curd and green pea puree instead of butter and heavy cream.",
      replacedItems: [
        { original: "Heavy Cream (70g)", replacedWith: "Strained Greek Yogurt & Milk Velvet" }
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
      { name: "Fresh Fenugreek Leaves (Methi)", qtyPerPerson: 80, unit: "g chopped", category: "Herbs" },
      { name: "Sweet Green Peas (Matar)", qtyPerPerson: 90, unit: "g", category: "Produce" },
      { name: "Fresh Dairy Malai / Cream", qtyPerPerson: 60, unit: "g", category: "Dairy", isReplaceable: true, replaceableType: "budget-calorie-vegan" },
      { name: "Onion, Ginger & Green Chilli Puree", qtyPerPerson: 60, unit: "g", category: "Produce" },
      { name: "Garam Masala & Green Cardamom", qtyPerPerson: 0.5, unit: "tsp", category: "Spices" }
    ],
    steps: [
      "Saute chopped fenugreek leaves in a dry skillet with a pinch of salt to draw out excess bitterness.",
      "Cook onion-ginger-cardamom paste gently until fragrant and translucent.",
      "Whisk your sunflower seed puree or cream substitute into warm milk until micro-smooth.",
      "Add boiled sweet green peas and the sauteed methi leaves into the aromatic base.",
      "Gently incorporate the cream alternative on low flame, simmer for 3 minutes, and serve warm with rotis."
    ],
    reviews: []
  },
  {
    id: "kadai-paneer-bistro",
    title: "Smoky Bistro Kadai Paneer",
    category: "Cafe & Bistro Curries",
    tagline: "Crunchy bell peppers & paneer tossed with freshly pounded coriander & dry red chillies.",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&auto=format&fit=crop&q=80",
    prepTime: "10 mins",
    cookTime: "15 mins",
    difficulty: "Easy",
    dietary: ["Vegetarian", "Gluten-Free"],
    basePortionPersons: 1,
    budgetAlternative: {
      active: false,
      title: "Toasted Coriander-Fennel Bloom & Tomato Reduction (No Costly Specialty Pastes)",
      description: "Replaces commercial bottled kadai pastes with hand-crushed whole seeds bloomed in hot oil for instant aroma release.",
      swapRatio: "For 2 tbsp jarred Kadai paste → Use 1 tbsp freshly roasted whole coriander & black pepper",
      tasteImpact: "Robust rustic aroma with crisp vegetable crunch.",
      textureImpact: "Coating gravy that clings tightly to seared paneer cubes.",
      replacedItems: [
        { original: "Commercial Kadai Gravy Base", replacedWith: "Freshly Roasted Spice Bloom & Tomato Glaze", reason: "Freshly toasted dry spices outperform commercial jarred paste" }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "Air-Seared Fit Kadai Paneer",
      description: "Air-sears paneer and peppers with 1 tsp cold-pressed oil, maintaining vegetable crunch and protein density.",
      replacedItems: [
        { original: "Deep Sauté Oil (2.5 tbsp)", replacedWith: "Air-Sear with Spice Mist" }
      ]
    },
    veganOption: {
      active: false,
      title: " Plant-Based Kadai Tofu",
      description: "Firm tofu seared with bell peppers and whole cracked coriander.",
      replacedItems: [
        { original: "Dairy Paneer", replacedWith: "Firm Organic Tofu" }
      ]
    },
    ingredients: [
      { name: "Malai Paneer Cubes", qtyPerPerson: 150, unit: "g", category: "Dairy", isReplaceable: true, replaceableType: "calorie-vegan" },
      { name: "Crisp Green & Red Bell Peppers", qtyPerPerson: 80, unit: "g diced", category: "Produce" },
      { name: "Ripe Tomato & Onion Reduction", qtyPerPerson: 100, unit: "ml", category: "Produce" },
      { name: "Kadai Masala (Cracked Coriander & Pepper)", qtyPerPerson: 1, unit: "tbsp", category: "Spices" },
      { name: "Refined Oil or Ghee", qtyPerPerson: 1.5, unit: "tbsp", category: "Produce", isReplaceable: true, replaceableType: "calorie" }
    ],
    steps: [
      "In a traditional iron wok (kadai), heat oil until lightly smoking.",
      "Flash-sear diced onions and bell peppers for 90 seconds to retain crisp crunch.",
      "Add freshly crushed coriander seeds, Kashmiri chillies, and ginger juliennes.",
      "Pour in tomato reduction and toss paneer cubes briskly to coat without breaking.",
      "Finish with fresh cilantro leaves and serve immediately with hot butter naan."
    ],
    reviews: []
  },
  {
    id: "masala-chai-bistro",
    title: "Artisan Karak Masala Chai",
    category: "Coffee & Drinks",
    tagline: "Slow-brewed spiced milk tea, formulated with FlavorShift AI for when whole spices or full-cream milk are missing.",
    image: "./assets/recipes/artisan-karak-masala-chai.jpg",
    prepTime: "3 mins",
    cookTime: "7 mins",
    difficulty: "Easy",
    dietary: ["Vegetarian", "Gluten-Free"],
    basePortionPersons: 1,
    budgetAlternative: {
      active: false,
      title: "Whole Spice Decoction & Toned Milk (No Costly Specialty Syrups)",
      description: "Replaces commercial pre-mixed chai syrups with a concentrated ginger-cardamom-cinnamon boiled reduction and dairy-toned milk.",
      swapRatio: "For 30ml Chai Syrup → Use 1 crushed green cardamom pod + slice of fresh ginger + 1 pinch cinnamon",
      tasteImpact: "Natural invigorating warmth without artificial sugary aftertaste.",
      textureImpact: "Velvety, frothy top with creamy authentic mouthfeel.",
      replacedItems: [
        { original: "Commercial Bottled Chai Syrup", replacedWith: "Fresh Ginger & Green Cardamom Simmer", reason: "Whole simmered spice decoction avoids overly sweet bottled syrups" }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "Slim Spiced Chai with Stevia & Skim Milk",
      description: "Replaces granulated white sugar and full-fat buffalo milk with skim milk and natural stevia leaf extract.",
      replacedItems: [
        { original: "Refined White Sugar (2 tsp)", replacedWith: "Natural Stevia Leaf Drops" },
        { original: "Full Fat Milk (100ml)", replacedWith: "Skimmed Milk" }
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
      { name: "Strong Assam CTC Black Tea", qtyPerPerson: 1.5, unit: "tsp", category: "Pantry" },
      { name: "Fresh Dairy Milk", qtyPerPerson: 100, unit: "ml", category: "Dairy", isReplaceable: true, replaceableType: "budget-calorie-vegan" },
      { name: "Fresh Ginger & Cardamom", qtyPerPerson: 1, unit: "crushed piece", category: "Produce" },
      { name: "Cinnamon & Clove", qtyPerPerson: 0.5, unit: "pinch", category: "Spices" },
      { name: "Raw Cane Sugar or Jaggery", qtyPerPerson: 1.5, unit: "tsp", category: "Sweetener", isReplaceable: true, replaceableType: "calorie" }
    ],
    steps: [
      "Crush fresh ginger and cardamom pods in a mortar to release volatile aromatic oils.",
      "Bring water to a rolling boil with the crushed spices and let steep for 2 minutes.",
      "Add strong Assam CTC black tea and simmer for 60 seconds until a deep amber liquor forms.",
      "Pour in fresh milk (or barista oat milk for vegan mode) and bring to a gentle frothing boil twice.",
      "Strain through a fine sieve into an artisan clay kulhad or ceramic mug and serve steaming hot."
    ],
    reviews: []
  },
  {
    id: "tandoori-garlic-butter-naan",
    title: "Tandoori Garlic Butter Naan",
    category: "Breads & Naan",
    tagline: "Restaurant-grade charred garlic naan with bubbly blisters, optimized for home kitchens without a tandoor.",
    image: "./assets/recipes/tandoori-garlic-butter-naan.jpg",
    prepTime: "25 mins",
    cookTime: "5 mins",
    difficulty: "Medium",
    dietary: ["Vegetarian"],
    basePortionPersons: 1,
    budgetAlternative: {
      active: false,
      title: "Desi Ghee & Clarified Butter Blend (No High-Cost Butter Spoilage)",
      description: "When commercial dairy butter runs out or proves too costly, FlavorShift AI uses a fragrant browned ghee wash that delivers deeper caramelized flavor.",
      swapRatio: "For every 20g Butter → Use 15g Desi Ghee brushed while piping hot",
      tasteImpact: "Authentic rustic aroma with crisp, golden bubbles.",
      textureImpact: "Soft, pillowy interior with crisp tandoori blistered crust.",
      replacedItems: [
        { original: "Imported Table Butter (20g)", replacedWith: "Farmhouse Desi Ghee Wash", reason: "Prevents sogginess, enhances tandoor aroma" }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "Whole-Wheat Multigrain Naan (Yogurt Leavened)",
      description: "Replaces refined all-purpose flour (maida) with fine-milled whole wheat and probiotic curd for easy digestion."
    },
    ingredients: [
      { name: "Fine All-Purpose Flour (Maida)", qtyPerPerson: 100, unit: "g flour", category: "Bakery", isReplaceable: true, replaceableType: "calorie" },
      { name: "Fresh Curd / Greek Yogurt (for leavening)", qtyPerPerson: 35, unit: "g curd", category: "Dairy" },
      { name: "Warm Milk or Water", qtyPerPerson: 40, unit: "ml liquid", category: "Dairy" },
      { name: "Fresh Minced Garlic & Coriander", qtyPerPerson: 15, unit: "g fresh", category: "Produce" },
      { name: "Salted Table Butter", qtyPerPerson: 20, unit: "g butter", category: "Dairy", isReplaceable: true, replaceableType: "budget-calorie-vegan" },
      { name: "Baking Powder & Nigella Seeds (Kalonji)", qtyPerPerson: 0.5, unit: "tsp blend", category: "Spices" }
    ],
    steps: [
      "Knead flour with yogurt, pinch of baking powder, and warm milk until a soft, elastic dough forms; rest for 20 minutes under a damp cloth.",
      "Divide into balls and stretch into classic teardrop shape; press minced garlic and kalonji seeds onto the top surface.",
      "Brush the underside lightly with water and slap onto an inverted smoking-hot cast-iron tawa until bubbles form.",
      "Flip the tawa upside down directly over high gas flame for 30 seconds to get signature tandoori leopard char blisters.",
      "Brush generously with melted garlic butter or FlavorShift ghee wash and serve piping hot."
    ],
    reviews: []
  },
  {
    id: "classic-penne-arrabbiata",
    title: "Classic Italian Penne all'Arrabbiata",
    category: "Pastas & Italian",
    tagline: "Vibrant Roman pasta in a fiery garlic, San Marzano tomato, and extra-virgin olive oil emulsion.",
    image: "./assets/recipes/classic-penne-arrabbiata.jpg",
    prepTime: "8 mins",
    cookTime: "12 mins",
    difficulty: "Easy",
    dietary: ["Vegetarian", "Vegan"],
    basePortionPersons: 1,
    budgetAlternative: {
      active: false,
      title: "Roma Plum Tomato Puree + Sundried Tomato Paste (No Imported Canned Tomatoes)",
      description: "When imported Italian San Marzano canned tomatoes are too expensive, FlavorShift AI blends concentrated fresh Roma tomatoes with caramelized garlic oil.",
      swapRatio: "For 150g San Marzano Canned Tomatoes → Use 120g Ripe Roma puree + 1 tsp tomato concentrate paste",
      tasteImpact: "Robust tangy sweetness with balanced heat.",
      textureImpact: "Silky emulsified sauce that coats each ribbed penne tube flawlessly.",
      replacedItems: [
        { original: "Imported San Marzano Canned Tomatoes", replacedWith: "Slow-reduced Local Roma Tomato Reduction", reason: "identical natural umami" }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "Durum Wheat & Zucchini Ribbon Penne",
      description: "Blends al dente durum wheat penne with equal parts spiralized zucchini ribbons for rich volume with lighter starch balance."
    },
    ingredients: [
      { name: "Bronze-Cut Durum Wheat Penne", qtyPerPerson: 90, unit: "g dry pasta", category: "Grains" },
      { name: "Crushed Ripe Roma Tomatoes", qtyPerPerson: 160, unit: "g ripe tomatoes", category: "Produce", isReplaceable: true, replaceableType: "budget" },
      { name: "Extra Virgin Olive Oil", qtyPerPerson: 1.5, unit: "tablespoons", category: "Pantry" },
      { name: "Fresh Garlic Cloves (sliced)", qtyPerPerson: 3, unit: "cloves", category: "Produce" },
      { name: "Dried Red Pepper Flakes (Peperoncino)", qtyPerPerson: 0.75, unit: "tsp flakes", category: "Spices" },
      { name: "Fresh Sweet Italian Basil", qtyPerPerson: 5, unit: "fresh leaves", category: "Herbs" },
      { name: "Sea Salt & Freshly Cracked Black Pepper", qtyPerPerson: 0.5, unit: "tsp blend", category: "Spices" }
    ],
    steps: [
      "Bring heavily salted water to a rolling boil; cook penne until perfectly al dente (1 minute under package directions).",
      "In a wide skillet, gently heat extra virgin olive oil with thinly sliced garlic and crushed chili flakes until fragrant and pale golden.",
      "Pour in crushed tomato puree and simmer gently for 8 minutes until sauce thickens and oil begins to shimmer.",
      "Transfer penne directly into the sauce along with 1/4 cup starchy pasta cooking water; toss vigorously to create a glossy emulsion.",
      "Tear fresh sweet basil over the pasta, finish with a drizzle of raw olive oil, and serve hot."
    ],
    reviews: []
  },
  {
    id: "hakka-street-style-noodles",
    title: "Chili-Garlic Veg Hakka Noodles",
    category: "Noodles & Wok",
    tagline: "High-heat wok-tossed noodles with shredded crunchy vegetables, toasted garlic, and dark scallion oil.",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&auto=format&fit=crop&q=80",
    prepTime: "12 mins",
    cookTime: "6 mins",
    difficulty: "Easy",
    dietary: ["Vegetarian", "Vegan"],
    basePortionPersons: 1,
    budgetAlternative: {
      active: false,
      title: "Toasted Sesame & Mustard Oil Bloom (No Expensive Chili-Crunch Oil)",
      description: "Creates an aromatic wok-seasoned base using whole crushed garlic and toasted sesame oil that delivers authentic charred street flavor.",
      swapRatio: "Replace imported chili crisp oil with 1 tbsp neutral cooking oil bloomed with dry red chilies and garlic",
      tasteImpact: "Smoky, savory, and satisfying wok-hei aromatics.",
      textureImpact: "Springy noodles that stay separate and firm without becoming clumped.",
      replacedItems: [
        { original: "Imported Chili Crisp Oil", replacedWith: "In-house Garlic Scallion Bloom Oil", reason: "Delivers intense wok aroma" }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "Equal-blend Hakka Noodles & Sliced Cabbage Slaw",
      description: "Doubles the finely shredded green cabbage and bell pepper volume to deliver high-satiety crunch with reduced carbohydrate density."
    },
    ingredients: [
      { name: "Hakka Eggless Wheat Noodles", qtyPerPerson: 90, unit: "g dry noodles", category: "Grains" },
      { name: "Crisp Green Bell Peppers & Cabbage", qtyPerPerson: 80, unit: "g shredded", category: "Produce" },
      { name: "Fresh Garlic & Ginger (finely minced)", qtyPerPerson: 20, unit: "g fresh", category: "Produce" },
      { name: "Naturally Brewed Dark Soy Sauce", qtyPerPerson: 1, unit: "tablespoon", category: "Pantry" },
      { name: "Chili-Garlic Paste & Rice Vinegar", qtyPerPerson: 1, unit: "tablespoon blend", category: "Pantry" },
      { name: "Cold-Pressed Sesame & Wok Oil", qtyPerPerson: 1, unit: "tablespoon", category: "Pantry", isReplaceable: true, replaceableType: "budget" },
      { name: "Spring Onion Greens (Scallions)", qtyPerPerson: 15, unit: "g chopped", category: "Produce" }
    ],
    steps: [
      "Boil noodles in salted water until  done; immediately drain, rinse with cold water, and toss with a few drops of oil to stop cooking.",
      "Get a carbon-steel wok or heavy skillet smoking hot; swirl in wok oil until shimmering.",
      "Add minced ginger, garlic, and sliced green chilies; stir-fry vigorously for 20 seconds without burning.",
      "Toss in shredded cabbage, carrots, and bell peppers on highest flame for 90 seconds to maintain blistered, crunchy snap.",
      "Drop in cooled noodles, drizzle dark soy sauce and chili-garlic paste around the rim of the wok, and toss rapidly for 2 minutes.",
      "Finish with fresh spring onion greens and a crack of black pepper before plating immediately."
    ],
    reviews: []
  },
  {
    id: "crispy-mysore-masala-dosa",
    title: "Crispy Golden Mysore Masala Dosa",
    category: "South Indian",
    tagline: "Traditional fermented rice-lentil crepe smeared with spicy red garlic chutney and spiced potato masala.",
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&auto=format&fit=crop&q=80",
    prepTime: "15 mins",
    cookTime: "5 mins",
    difficulty: "Medium",
    dietary: ["Vegetarian", "Gluten-Free", "Vegan"],
    basePortionPersons: 1,
    budgetAlternative: {
      active: false,
      title: "Cold-Pressed Sesame Oil Roast (Dairy-Free & Budget Saver)",
      description: "When clarified butter (ghee) is costly or when vegan preferences are desired, FlavorShift AI uses authentic cold-pressed sesame gingelly oil for an ultra-crisp golden crust.",
      swapRatio: "For 15g Ghee → Use 12g cold-pressed gingelly sesame oil brushed around edges",
      tasteImpact: "Deep roasted nutty aroma with paper-crisp shatter.",
      textureImpact: "Extra crisp golden bottom with tender, fluffy inner lace.",
      replacedItems: [
        { original: "Desi Ghee (for roasting)", replacedWith: "Cold-Pressed Gingelly Sesame Oil", reason: "Delivers traditional temple-style aroma at half the fat expenditure" }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "Sprouted Moong & Oats Masala Dosa (Pesarattu-Style)",
      description: "Swaps white rice batter for slow-fermented whole sprouted green gram and rolled oats for low glycemic index and high dietary protein."
    },
    ingredients: [
      { name: "Fermented Dosa Batter (Rice & Urad Dal)", qtyPerPerson: 120, unit: "ml batter", category: "Grains" },
      { name: "Spiced Potato Mash (Aloo Bhaji with Mustard Seeds)", qtyPerPerson: 80, unit: "g potato filling", category: "Produce" },
      { name: "Mysore Fiery Red Garlic-Byadgi Chutney", qtyPerPerson: 20, unit: "g red chutney", category: "Spices" },
      { name: "Desi Ghee or Cold-Pressed Sesame Oil", qtyPerPerson: 15, unit: "ml roast oil", category: "Dairy", isReplaceable: true, replaceableType: "budget-calorie-vegan" },
      { name: "Fresh Coconut & Green Chili Chutney", qtyPerPerson: 40, unit: "g side chutney", category: "Produce" }
    ],
    steps: [
      "Heat a seasoned heavy cast-iron tawa until water droplets sizzle and evaporate immediately; wipe lightly with half an onion.",
      "Pour a ladle of fermented batter into the center and spiral outwards into a thin, even circle.",
      "Drizzle melted ghee (or FlavorShift cold-pressed sesame oil) around the outer perimeter and center.",
      "When the surface turns golden-amber, smear a tablespoon of fiery Mysore red garlic paste across the entire dosa surface.",
      "Spoon spiced potato bhaji in the center, fold into a crisp cylinder or envelope, and serve with fresh coconut chutney."
    ],
    reviews: []
  },
  {
    id: "steamed-soft-idli-sambar",
    title: "Melt-in-Mouth Steamed Idli & Udupi Sambar",
    category: "South Indian",
    tagline: "Cloud-soft fermented steamed rice cakes served with aromatic lentil-vegetable Udupi sambar.",
    image: "./assets/recipes/steamed-soft-idli-sambar.jpg",
    prepTime: "10 mins",
    cookTime: "12 mins",
    difficulty: "Easy",
    dietary: ["Vegetarian", "Gluten-Free", "Vegan"],
    basePortionPersons: 1,
    budgetAlternative: {
      active: false,
      title: "In-House Roasted Sambar Spice Masala (No Stale Store Powder)",
      description: "Blooms whole coriander, fenugreek, and chana dal in seconds to give Udupi temple-style aroma without branded packaged powders.",
      swapRatio: "1.5 tsp roasted coriander-fenugreek blend replaces commercial sambar masala packet",
      tasteImpact: "Complex, comforting sweet-tangy lentil broth.",
      textureImpact: "Featherlight, pillow-soft idlis that absorb sambar completely.",
      replacedItems: [
        { original: "Branded Packaged Sambar Powder", replacedWith: "Freshly Roasted Spice Masala Bloom", reason: "Zero preservatives, 3x volatile aroma" }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "Quinoa & Foxtail Millet Steamed Idli",
      description: "Replaces half the white idli rice with fiber-dense foxtail millet and organic quinoa for prolonged sustained energy."
    },
    ingredients: [
      { name: "Steamed Idli Cakes (Fermented Batter)", qtyPerPerson: 3, unit: "steamed idlis", category: "Grains" },
      { name: "Toor Dal & Drumstick Sambar Broth", qtyPerPerson: 180, unit: "ml sambar", category: "Produce", isReplaceable: true, replaceableType: "budget" },
      { name: "Fresh Grated Coconut Chutney with Mustard Tadka", qtyPerPerson: 40, unit: "g side chutney", category: "Produce" },
      { name: "Fresh Curry Leaves & Asafoetida (Hing)", qtyPerPerson: 0.5, unit: "tsp blend", category: "Spices" }
    ],
    steps: [
      "Lightly grease idli plates with oil; fill molds 3/4th with aerated fermented batter.",
      "Steam over high pressure for 10 minutes until a toothpick inserted into center comes out clean; rest 2 minutes before un-molding.",
      "In a saucepan, simmer cooked toor dal with drumstick, shallots, tamarind pulp, and freshly roasted sambar spices.",
      "Temper with mustard seeds, dried red chilies, hing, and fresh curry leaves in hot oil.",
      "Float idlis directly in deep sambar bowl and top with fresh cilantro and a dab of cold coconut chutney."
    ],
    reviews: []
  },
  {
    id: "wood-fired-margherita-pizza",
    title: "Artisanal Margherita Pizza",
    category: "Pastas & Italian",
    tagline: "Crisp leopard-spotted Italian crust with crushed San Marzano tomatoes, fresh mozzarella, and sweet basil.",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&auto=format&fit=crop&q=80",
    prepTime: "20 mins",
    cookTime: "8 mins",
    difficulty: "Medium",
    dietary: ["Vegetarian"],
    basePortionPersons: 1,
    budgetAlternative: {
      active: false,
      title: "Fresh Strained Paneer & Domestic Mozzarella Melt (No High-Import Dairy Markup)",
      description: "When imported Italian buffalo mozzarella is unavailable or expensive, blends fresh domestic mozzarella with mild strained curd for equal stringy stretch and milky sweetness.",
      swapRatio: "70g Domestic Mozzarella + 20g Strained Fresh Cottage Cheese replaces 90g imported Fior di Latte",
      tasteImpact: "Creamy, milky stretch with balanced acidic tomato bite.",
      textureImpact: "Gooey melted cheese pull with blistered, airy sourdough crust.",
      replacedItems: [
        { original: "Imported Italian Buffalo Mozzarella", replacedWith: "Domestic Low-Moisture Mozzarella & Cottage Curd Blend", reason: "Prevents soggy crust and saves " }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "Thin-Crust Whole Wheat & Cauliflower Crust Pizza",
      description: "Bakes a crisp, ultra-thin crust enriched with finely grated cauliflower and whole wheat flour."
    },
    ingredients: [
      { name: "Slow-Fermented Neapolitan Pizza Dough", qtyPerPerson: 180, unit: "g dough ball", category: "Bakery" },
      { name: "Crushed Plum Tomato Reduction", qtyPerPerson: 70, unit: "g sauce", category: "Produce" },
      { name: "Fresh Mozzarella / Fior di Latte", qtyPerPerson: 90, unit: "g sliced cheese", category: "Dairy", isReplaceable: true, replaceableType: "budget-calorie-vegan" },
      { name: "Extra Virgin Olive Oil", qtyPerPerson: 1, unit: "tablespoon", category: "Pantry" },
      { name: "Fresh Genovese Sweet Basil & Sea Salt", qtyPerPerson: 6, unit: "fresh leaves", category: "Herbs" }
    ],
    steps: [
      "Preheat oven with pizza stone or heavy cast-iron pan to maximum heat (250°C / 480°F) for 40 minutes.",
      "Gently stretch fermented dough from center outwards onto semolina-dusted board, keeping a puffy outer rim (cornicione).",
      "Spoon crushed plum tomato sauce thinly over dough; arrange torn fresh mozzarella pieces evenly.",
      "Slide onto smoking-hot stone/pan; bake 6 to 8 minutes until cheese is bubbling and crust develops charred leopard blisters.",
      "Remove from heat, scatter fresh basil leaves, drizzle with extra virgin olive oil, and slice immediately."
    ],
    reviews: []
  },
  {
    id: "classic-italian-tiramisu",
    title: "Artisanal Espresso Tiramisu",
    category: "Bakery & Desserts",
    tagline: "Airy espresso-soaked savoiardi ladyfingers layered with velvety mascarpone sabayon and dusted dark cocoa.",
    image: "./assets/recipes/classic-italian-tiramisu.jpg",
    prepTime: "20 mins",
    cookTime: "0 mins",
    difficulty: "Medium",
    dietary: ["Vegetarian"],
    basePortionPersons: 1,
    budgetAlternative: {
      active: false,
      title: "Hung Curd & Double-Cottage Cream Velvet (No Costly Imported Mascarpone)",
      description: "When imported Italian mascarpone is too expensive, FlavorShift AI blends ultra-smooth hung curd with fresh malai cream and vanilla bean.",
      swapRatio: "For 100g Mascarpone → Use 60g Strained Hung Curd + 40g Fresh Malai Cream whisked silky",
      tasteImpact: "Velvety, milky richness with gentle clean sweetness.",
      textureImpact: "Micro-smooth, stable mousse consistency that holds sharp cafe slice edges.",
      replacedItems: [
        { original: "Imported Italian Mascarpone Cheese", replacedWith: "Farmhouse Hung Curd & Velvet Malai Puree", reason: "Cuts dessert expenditure by  without curdling" }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "Skinny Greek Yogurt & Espresso Cloud Parfait",
      description: "Uses non-fat whipped Greek yogurt sweetened with organic monkfruit extract and whole wheat sponge."
    },
    ingredients: [
      { name: "Crisp Italian Ladyfingers (Savoiardi)", qtyPerPerson: 4, unit: "biscuits", category: "Bakery" },
      { name: "Velvety Mascarpone Cheese", qtyPerPerson: 90, unit: "g cheese", category: "Dairy", isReplaceable: true, replaceableType: "budget-calorie-vegan" },
      { name: "Fresh Double Espresso Shot", qtyPerPerson: 50, unit: "ml fresh brew", category: "Pantry" },
      { name: "Pure Vanilla Bean Extract & Sugar", qtyPerPerson: 1, unit: "tsp blend", category: "Sweetener", isReplaceable: true, replaceableType: "calorie" },
      { name: "Dutch Processed  Dark Cocoa Powder", qtyPerPerson: 1, unit: "tsp dusting", category: "Pantry" }
    ],
    steps: [
      "Brew intense dark roast espresso and let cool to room temperature in a shallow dipping bowl.",
      "In a chilled bowl, whisk mascarpone (or FlavorShift hung curd-malai cream) with vanilla and sweetening until glossy soft peaks form.",
      "Quickly dip ladyfingers into espresso for 1 second per side; arrange as a snug foundation layer in serving cup.",
      "Pipe or spoon half of the velvet cream over the biscuits; repeat with a second soaked layer.",
      "Chill for minimum 2 hours to set; dust heavily with Dutch dark cocoa powder before serving."
    ],
    reviews: []
  },
  {
    id: "warm-dark-chocolate-lava-cake",
    title: "Molten Dark Chocolate Lava Cake",
    category: "Bakery & Desserts",
    tagline: "Individual warm chocolate sponge with a luscious flowing molten ganache center.",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80",
    prepTime: "12 mins",
    cookTime: "10 mins",
    difficulty: "Medium",
    dietary: ["Vegetarian"],
    basePortionPersons: 1,
    budgetAlternative: {
      active: false,
      title: "Single-Origin Domestic Dark Cocoa Melt (No High-Duty Belgian Couverture)",
      description: "Employs high-fat domestic Indian single-origin cocoa mass blended with cold-pressed coconut butter for an ultra-glossy river of lava.",
      swapRatio: "For 60g Imported Couverture → Use 45g Cocoa mass + 15g butter blend",
      tasteImpact: "Intense bittersweet dark cocoa profile with zero waxy feel.",
      textureImpact: "Tender cake walls with warm, free-flowing silky chocolate center.",
      replacedItems: [
        { original: "Imported Belgian Dark Couverture", replacedWith: "South Indian Single-Origin Artisanal Dark Cocoa Mass", reason: "Saves  with deeper fruity terroir notes" }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "Avocado & Dark Cocoa Clean Molten Pot",
      description: "Replaces butter with velvety Hass avocado puree and organic allulose sweetener for guilt-free indulgence."
    },
    ingredients: [
      { name: " Dark Chocolate Callets", qtyPerPerson: 60, unit: "g chocolate", category: "Bakery", isReplaceable: true, replaceableType: "budget" },
      { name: "Unsalted Dairy Table Butter", qtyPerPerson: 35, unit: "g butter", category: "Dairy", isReplaceable: true, replaceableType: "calorie-vegan" },
      { name: "Whole Egg or Flax-Emulsion", qtyPerPerson: 1, unit: "egg / emulsion", category: "Dairy", isReplaceable: true, replaceableType: "vegan" },
      { name: "Fine All-Purpose Flour", qtyPerPerson: 20, unit: "g flour", category: "Bakery" },
      { name: "Raw Cane Sugar & Sea Salt", qtyPerPerson: 25, unit: "g blend", category: "Sweetener" },
      { name: "Tahitian Vanilla Extract", qtyPerPerson: 0.5, unit: "tsp", category: "Pantry" }
    ],
    steps: [
      "Melt dark chocolate and butter together gently over a bain-marie (hot water bath) until silky and glossy.",
      "Whisk egg and cane sugar in a bowl until pale and frothy.",
      "Fold melted chocolate mixture into the egg froth; gently sift in flour and a pinch of flaky salt.",
      "Pour batter into a buttered, cocoa-dusted ramekin up to 3/4 full.",
      "Bake at 200°C (395°F) for exactly 9–10 minutes until the edges are firm but center jiggles gently.",
      "Invert immediately onto a dessert plate, dust with powdered sugar, and serve with fresh berries."
    ],
    reviews: []
  },
  {
    id: "vanilla-bean-panna-cotta",
    title: "Vanilla Bean Panna Cotta with Berry Coulis",
    category: "Bakery & Desserts",
    tagline: "Silky, delicate chilled Italian cream custard infused with Madagascar vanilla bean and tart raspberry glaze.",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&auto=format&fit=crop&q=80",
    prepTime: "10 mins",
    cookTime: "5 mins",
    difficulty: "Easy",
    dietary: ["Vegetarian", "Gluten-Free"],
    basePortionPersons: 1,
    budgetAlternative: {
      active: false,
      title: "Thick Whole Milk & Coconut Milk Silk (No High-Cost Whipping Cream)",
      description: "Combines reduced whole farmhouse milk with coconut milk for the same luxurious mouth-coating wobble at reduced dairy expense.",
      swapRatio: "For 100ml Heavy Cream → Use 60ml Whole Milk + 40ml Coconut Milk",
      tasteImpact: "Clean floral vanilla profile with tropical undertones.",
      textureImpact: "Gentle, delicate wobble that melts instantly on the palate.",
      replacedItems: [
        { original: "Dairy Whipping Cream", replacedWith: "Farmhouse Full-Cream & Coconut Milk Infusion", reason: "Prevents heavy dairy aftertaste while cutting costs" }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "Almond Milk & Agar-Agar Light Wobble",
      description: "Uses unsweetened vanilla almond milk set with plant-based agar-agar for an ultra-clean 150-calorie dessert."
    },
    ingredients: [
      { name: "Fresh Dairy Whipping Cream", qtyPerPerson: 100, unit: "ml cream", category: "Dairy", isReplaceable: true, replaceableType: "budget-calorie-vegan" },
      { name: "Whole Farmhouse Milk", qtyPerPerson: 50, unit: "ml milk", category: "Dairy" },
      { name: "Plant-Based Agar-Agar or Gelatin", qtyPerPerson: 2, unit: "g setting agent", category: "Pantry" },
      { name: "Madagascar Vanilla Pod Seeds", qtyPerPerson: 0.5, unit: "pod seeds", category: "Spices" },
      { name: "Wild Raspberry & Strawberry Reduction", qtyPerPerson: 35, unit: "g coulis", category: "Produce" }
    ],
    steps: [
      "Simmer cream, milk, scraped vanilla seeds, and sugar in a saucepan over gentle heat for 3 minutes without boiling.",
      "Sprinkle agar-agar flakes into the warm liquid, whisking thoroughly for 90 seconds until completely dissolved.",
      "Pour through a fine mesh strainer into small glass jars or dariole molds.",
      "Refrigerate for minimum 3 hours until gently set with signature panna cotta wobble.",
      "Top with fresh tart berry coulis and fresh mint leaves right before serving."
    ],
    reviews: []
  },
  {
    id: "gulab-jamun-cheesecake-fusion",
    title: "Gulab Jamun Saffron Cheesecake",
    category: "Bakery & Desserts",
    tagline: "East-meets-west cafe fusion pairing cardamom graham cracker crust with saffron cream and embedded mini gulab jamuns.",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&auto=format&fit=crop&q=80",
    prepTime: "25 mins",
    cookTime: "30 mins",
    difficulty: "Medium",
    dietary: ["Vegetarian"],
    basePortionPersons: 1,
    budgetAlternative: {
      active: false,
      title: "Chenna (Fresh Cottage Curd) & Cream Cheese Blend (Local Artisanal Blend)",
      description: "Combines freshly curdled warm cow milk chenna with cream cheese to replicate Philadelphia richness at domestic milk prices.",
      swapRatio: "50g Whipped Soft Chenna + 40g Cream Cheese replaces 90g imported cream cheese",
      tasteImpact: "Subtle sweet lactic curd with saffron and rose water notes.",
      textureImpact: "Dense, creamy, velvet sliceability that holds embedded gulab jamuns firmly.",
      replacedItems: [
        { original: "Imported Philadelphia Cream Cheese", replacedWith: "Whipped Fresh Soft Chenna Curd", reason: "Prevents heavy dense aftertaste and saves " }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "Hung Greek Yogurt & Stevia Baked Pot",
      description: "Bakes strained high-protein Greek yogurt with crushed digestive biscuits and sugar-free rose essence."
    },
    ingredients: [
      { name: "Cream Cheese / Soft Chenna Blend", qtyPerPerson: 90, unit: "g cheese curd", category: "Dairy", isReplaceable: true, replaceableType: "budget" },
      { name: "Mini Soft Gulab Jamuns (drained)", qtyPerPerson: 2, unit: "pieces", category: "Bakery" },
      { name: "Crushed Graham Crackers / Digestive Biscuits", qtyPerPerson: 35, unit: "g crumbs", category: "Bakery" },
      { name: "Kashmiri Saffron & Green Cardamom Powder", qtyPerPerson: 0.5, unit: "tsp blend", category: "Spices" },
      { name: "Melted Butter (for crust binding)", qtyPerPerson: 15, unit: "g butter", category: "Dairy" }
    ],
    steps: [
      "Mix crushed digestive biscuits with melted butter and cardamom; press tightly into base of springform pan or mold.",
      "Whisk cream cheese and whipped chenna with sugar, saffron milk infusion, and a splash of rose water until micro-smooth.",
      "Pour half the cheese batter over the crust; arrange drained mini gulab jamuns evenly across the surface.",
      "Cover with remaining batter, smooth the top, and bake in a water bath at 160°C (320°F) for 35 minutes until just set.",
      "Chill overnight in refrigerator; slice cleanly and garnish with slivered pistachios and dried rose petals."
    ],
    reviews: []
  },
  {
    id: "fudgy-avocado-chocolate-brownie",
    title: "Double Dark Chocolate Fudgy Brownie",
    category: "Bakery & Desserts",
    tagline: "Decadent crinkle-top chocolate brownie with fudgy gooey centers and roasted walnut chunks.",
    image: "https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=800&auto=format&fit=crop&q=80",
    prepTime: "15 mins",
    cookTime: "22 mins",
    difficulty: "Easy",
    dietary: ["Vegetarian"],
    basePortionPersons: 1,
    budgetAlternative: {
      active: false,
      title: "Toasted Sunflower Seeds & Cocoa Butter (No High-Cost Imported Walnuts)",
      description: "When imported California walnuts are too expensive, uses toasted salted pumpkin and sunflower seeds for equal nutty crunch.",
      swapRatio: "25g Toasted Sunflower & Pumpkin seed mix replaces 25g walnuts",
      tasteImpact: "Deep roasted crunch with intense bittersweet cocoa.",
      textureImpact: "Chewy edges with gooey, fudgy center and crisp, papery crinkle crust.",
      replacedItems: [
        { original: "Imported California Walnuts (25g)", replacedWith: "Toasted Roasted Sunflower & Pumpkin Seeds", reason: "Allergen-friendly crunch that saves  per brownie slice" }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "Skinny Sweet Potato & Dark Cocoa Brownie",
      description: "Uses pureed steamed sweet potato to replace much of the butter and refined flour for moist, dense fudge texture."
    },
    ingredients: [
      { name: " Semi-Sweet Dark Chocolate", qtyPerPerson: 50, unit: "g chocolate", category: "Bakery" },
      { name: "Pure Dairy Table Butter", qtyPerPerson: 30, unit: "g butter", category: "Dairy", isReplaceable: true, replaceableType: "calorie" },
      { name: "Brown Cane Sugar & Vanilla", qtyPerPerson: 30, unit: "g blend", category: "Sweetener" },
      { name: "Unbleached Pastry Flour", qtyPerPerson: 25, unit: "g flour", category: "Bakery" },
      { name: "Roughly Chopped Walnuts or Seeds", qtyPerPerson: 20, unit: "g nuts", category: "Pantry", isReplaceable: true, replaceableType: "budget" }
    ],
    steps: [
      "Melt dark chocolate and butter together until silky smooth; let cool slightly.",
      "Whisk eggs (or yogurt substitute) with brown sugar vigorously for 3 minutes until pale and frothy.",
      "Gently fold melted chocolate into the whipped eggs; fold in flour and cocoa powder with a spatula.",
      "Stir in chopped walnuts or toasted seeds, reserving a few for the top.",
      "Pour into parchment-lined pan; bake at 175°C (350°F) for 22 minutes until a toothpick has moist crumbs.",
      "Cool completely before slicing into clean cafe squares."
    ],
    reviews: []
  },
  {
    id: "quinoa-avocado-superfood-bowl",
    title: "Mediterranean Quinoa & Avocado Power Bowl",
    category: "Diet Conscious",
    tagline: "Nutrient-packed clean bowl featuring fluffy quinoa, crisp cucumbers, ripe avocado, chickpeas, and lemon tahini dressing.",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80",
    prepTime: "12 mins",
    cookTime: "15 mins",
    difficulty: "Easy",
    dietary: ["Vegetarian", "Gluten-Free", "Vegan"],
    basePortionPersons: 1,
    budgetAlternative: {
      active: false,
      title: "Broken Wheat (Dalia) & White Sesame Drizzle (No High-Import Quinoa)",
      description: "Swaps imported organic quinoa with roasted nutty domestic broken wheat dalia and homemade sesame tahini for identical mouthfeel.",
      swapRatio: "70g Steamed Dalia replaces 70g cooked quinoa",
      tasteImpact: "Earthy, nutty grains with vibrant citrus-herb dressing.",
      textureImpact: "Fluffy, hearty grain base with crisp vegetable snap and creamy avocado.",
      replacedItems: [
        { original: "Imported South American Quinoa", replacedWith: "Slow-Steamed Roasted Broken Wheat (Dalia)", reason: "high sustained satiety" }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "Cauliflower Rice & Cucumber Shred Slaw Base",
      description: "Replaces half the grains with fresh riced cauliflower for an ultra-low carbohydrate macro profile."
    },
    ingredients: [
      { name: "Fluffy Steamed White Quinoa", qtyPerPerson: 80, unit: "g cooked grains", category: "Grains", isReplaceable: true, replaceableType: "budget" },
      { name: "Sliced Hass Avocado", qtyPerPerson: 50, unit: "g fresh avocado", category: "Produce" },
      { name: "Spiced Boiled Chickpeas (Kabuli Chana)", qtyPerPerson: 60, unit: "g legumes", category: "Produce" },
      { name: "Cherry Tomatoes & Persian Cucumber", qtyPerPerson: 70, unit: "g fresh dice", category: "Produce" },
      { name: "Lemon Tahini & Extra Virgin Olive Oil Dressing", qtyPerPerson: 25, unit: "ml dressing", category: "Pantry" }
    ],
    steps: [
      "Rinse quinoa thoroughly to remove saponins; cook in seasoned vegetable broth until translucent and fluffy.",
      "Toss boiled chickpeas with smoked paprika, cumin, and sea salt in a hot dry pan for 2 minutes to crisp the skin.",
      "Assemble grain foundation in a wide stoneware salad bowl.",
      "Arrange sliced avocado, cherry tomato halves, diced cucumber, and spiced chickpeas in clean color-blocked sections.",
      "Whisk fresh lemon juice, tahini, minced garlic, and cold water into a silky dressing; drizzle liberally over bowl before serving."
    ],
    reviews: []
  },
  {
    id: "grilled-tofu-edamame-buddha-bowl",
    title: "Sesame-Ginger Tofu Buddha Bowl",
    category: "Diet Conscious",
    tagline: "Clean plant-protein bowl with crispy pan-seared organic tofu, steamed edamame, purple cabbage, and toasted sesame glaze.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80",
    prepTime: "15 mins",
    cookTime: "10 mins",
    difficulty: "Easy",
    dietary: ["Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free"],
    basePortionPersons: 1,
    budgetAlternative: {
      active: false,
      title: "Sprouted Green Moong & Roasted Peanut Crunch (No Expensive Edamame)",
      description: "When frozen Japanese edamame is high cost, substitutes tender steamed sprouted whole moong beans and crushed roasted peanuts.",
      swapRatio: "50g Sprouted Moong replaces 50g Edamame beans",
      tasteImpact: "Fresh, earthy legume sweetness with savory garlic crunch.",
      textureImpact: "Crisp outer tofu shell with tender, chewy protein and fresh raw vegetables.",
      replacedItems: [
        { original: "Imported Frozen Edamame Beans", replacedWith: "Steamed Fresh Sprouted Moong", reason: "Provides tender sprouted legume texture and plant protein" }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "Air-Fried Tofu & Zucchini Noodle Base",
      description: "Air-fries the marinated tofu without oil and swaps rice for crisp raw zucchini ribbons."
    },
    ingredients: [
      { name: "Organic Firm Pressed Tofu Cubes", qtyPerPerson: 120, unit: "g tofu", category: "Produce" },
      { name: "Steamed Edamame / Sprouted Beans", qtyPerPerson: 50, unit: "g legumes", category: "Produce", isReplaceable: true, replaceableType: "budget" },
      { name: "Shredded Purple Cabbage & Carrots", qtyPerPerson: 80, unit: "g vegetables", category: "Produce" },
      { name: "Tamari Soy & Grated Ginger Glaze", qtyPerPerson: 20, unit: "ml sauce", category: "Pantry" },
      { name: "Toasted White & Black Sesame Seeds", qtyPerPerson: 1, unit: "tsp garnish", category: "Pantry" },
      { name: "Steamed Brown Jasmine Rice", qtyPerPerson: 70, unit: "g cooked rice", category: "Grains" }
    ],
    steps: [
      "Press tofu with paper towels to extract moisture; toss cubes in tamari, garlic powder, and cornstarch.",
      "Sear in a hot skillet with a teaspoon of oil for 7 minutes, turning until all sides are deep golden and crisp.",
      "Steam edamame or sprouted moong with sea salt for 3 minutes until tender-crisp.",
      "Lay warm brown rice in a bowl, arranging crisp tofu, purple cabbage, and edamame around the perimeter.",
      "Drizzle with sesame-ginger dressing and sprinkle with toasted sesame seeds and sliced scallions."
    ],
    reviews: []
  },
  {
    id: "greek-tzatziki-grain-salad",
    title: "Chilled Greek Tzatziki & Lentil Salad",
    category: "Diet Conscious",
    tagline: "Cooling cafe salad of brown lentils, crisp bell peppers, and homemade cucumber-garlic Greek yogurt dressing.",
    image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=800&auto=format&fit=crop&q=80",
    prepTime: "10 mins",
    cookTime: "10 mins",
    difficulty: "Easy",
    dietary: ["Vegetarian", "Gluten-Free"],
    basePortionPersons: 1,
    budgetAlternative: {
      active: false,
      title: "Desi Brown Masoor & Strained Dahi Tzatziki (No Imported Puy Lentils)",
      description: "Replaces imported French green lentils with domestic whole brown masoor dal cooked al dente.",
      swapRatio: "80g Whole Brown Masoor replaces 80g imported lentils",
      tasteImpact: "Earthy, savory lentils balanced by tart cucumber-dill yogurt.",
      textureImpact: "Firm, non-mushy lentil bite with refreshing cooling creaminess.",
      replacedItems: [
        { original: "Imported French Green Lentils", replacedWith: "Farm Fresh Whole Brown Masoor", reason: "Holds firm tender shape in chilled salads" }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "Low-Fat Cucumber & Fresh Mint Dressing",
      description: "Prepares tzatziki using fat-free strained yogurt with fresh mint and grated English cucumber."
    },
    ingredients: [
      { name: "Al Dente Whole Brown Lentils", qtyPerPerson: 90, unit: "g cooked lentils", category: "Produce", isReplaceable: true, replaceableType: "budget" },
      { name: "Strained Greek Yogurt (Tzatziki Base)", qtyPerPerson: 80, unit: "g yogurt", category: "Dairy" },
      { name: "English Cucumber (grated & squeezed)", qtyPerPerson: 50, unit: "g cucumber", category: "Produce" },
      { name: "Extra Virgin Olive Oil & Lemon Juice", qtyPerPerson: 15, unit: "ml blend", category: "Pantry" },
      { name: "Fresh Dill, Minced Garlic & Sea Salt", qtyPerPerson: 1, unit: "tsp blend", category: "Herbs" }
    ],
    steps: [
      "Cook whole lentils in water with a bay leaf until tender but still holding their shape (do not overcook); chill thoroughly.",
      "Grate English cucumber, toss with a pinch of salt, and squeeze tightly in cheesecloth to extract excess liquid.",
      "Stir squeezed cucumber into thick Greek yogurt with minced garlic, fresh chopped dill, lemon juice, and olive oil.",
      "Toss chilled lentils with diced red onions, bell peppers, and half of the tzatziki sauce.",
      "Transfer to salad bowl, dollop remaining tzatziki over the top, and finish with a crack of black pepper."
    ],
    reviews: []
  },
  {
    id: "spinach-paneer-protein-wrap",
    title: "Vibrant Spinach & Grilled Paneer Wrap",
    category: "Diet Conscious",
    tagline: "Whole-wheat flatbread wrap stuffed with tandoori-spiced grilled paneer strips, baby spinach, and mint-yogurt chutney.",
    image: "./assets/recipes/spinach-paneer-protein-wrap.jpg",
    prepTime: "10 mins",
    cookTime: "8 mins",
    difficulty: "Easy",
    dietary: ["Vegetarian"],
    basePortionPersons: 1,
    budgetAlternative: {
      active: false,
      title: "Desi Tawa-Grilled Tofu & Paneer Mix (Cost & Saturated Fat Cutter)",
      description: "Blends firm organic tofu with equal parts fresh paneer to maintain bouncy bite while creating a lighter high-protein filling.",
      swapRatio: "50g Tofu + 50g Paneer replaces 100g pure paneer",
      tasteImpact: "Smoky tandoori spices mask tofu, delivering pure paneer flavor.",
      textureImpact: "Firm, succulent grilled bites wrapped in warm, toasted flatbread.",
      replacedItems: [
        { original: "Full-Fat Malai Paneer", replacedWith: "Equal-blend Tawa Grilled Paneer & Firm Tofu Blend", reason: "Saves  with superior protein-to-fat balance" }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "Low-Carb Lettuce & Roti Wrap",
      description: "Swaps white tortilla for thin whole-wheat phulka rolled in crisp romaine lettuce leaves."
    },
    ingredients: [
      { name: "Fresh Malai Paneer or Tofu Strips", qtyPerPerson: 100, unit: "g strips", category: "Dairy", isReplaceable: true, replaceableType: "budget" },
      { name: "Whole Wheat Roti / Tortilla Wrap", qtyPerPerson: 1, unit: "wrap", category: "Bakery" },
      { name: "Fresh Baby Spinach & Sliced Bell Peppers", qtyPerPerson: 60, unit: "g vegetables", category: "Produce" },
      { name: "Spicy Mint & Coriander Greek Yogurt Chutney", qtyPerPerson: 30, unit: "g sauce", category: "Dairy" },
      { name: "Tandoori Tikka Spices & Lemon Juice", qtyPerPerson: 1, unit: "tsp blend", category: "Spices" }
    ],
    steps: [
      "Toss paneer or paneer-tofu strips in tandoori spices, lemon juice, and a drop of mustard oil; sear in a cast-iron skillet for 4 minutes until charred.",
      "Warm the whole wheat roti on dry tawa for 20 seconds per side until pliable.",
      "Spread mint-coriander yogurt chutney down the center of the warm wrap.",
      "Layer fresh washed baby spinach leaves, grilled paneer strips, and crunchy sliced onions.",
      "Tightly fold bottom upward, roll into a snug cylinder, cut diagonally, and serve wrapped in parchment paper."
    ],
    reviews: []
  },
  {
    id: "zesty-kale-roasted-chickpea-salad",
    title: "Crunchy Garlic Kale & Chickpea Caesar",
    category: "Diet Conscious",
    tagline: "Massaged curly kale tossed with crispy garlic-roasted chickpeas, shaved Parmesan, and creamy cashew Caesar dressing.",
    image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=800&auto=format&fit=crop&q=80",
    prepTime: "12 mins",
    cookTime: "15 mins",
    difficulty: "Easy",
    dietary: ["Vegetarian", "Gluten-Free", "Vegan"],
    basePortionPersons: 1,
    budgetAlternative: {
      active: false,
      title: "Baby Spinach & Roasted Moong Crunch (No Imported Curly Kale)",
      description: "When organic imported kale is out of stock, uses crisp fresh baby palak and spiced roasted lentils for identical hearty texture.",
      swapRatio: "80g Baby Spinach replaces 80g massaged kale",
      tasteImpact: "Tangy, savory garlic Caesar punch with zero bitterness.",
      textureImpact: "Tender, hearty greens with crunchy roasted chickpea croutons.",
      replacedItems: [
        { original: "Imported Organic Curly Kale", replacedWith: "Farm Fresh Crisp Baby Palak", reason: "Tender local baby leaves with mild earthy bite" }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "Light Lemon-Mustard Vinaigrette Toss",
      description: "Replaces creamy cashew dressing with a light Dijon mustard, lemon juice, and apple cider vinegar emulsion."
    },
    ingredients: [
      { name: "Fresh Curly Kale (stemmed & chopped)", qtyPerPerson: 90, unit: "g fresh greens", category: "Produce", isReplaceable: true, replaceableType: "budget" },
      { name: "Oven-Roasted Crunchy Chickpeas", qtyPerPerson: 50, unit: "g croutons", category: "Produce" },
      { name: "Silky Cashew & Garlic Caesar Dressing", qtyPerPerson: 30, unit: "ml dressing", category: "Pantry" },
      { name: "Shaved Aged Vegetarian Parmesan or Nutritional Yeast", qtyPerPerson: 15, unit: "g cheese", category: "Dairy" },
      { name: "Fresh Lemon Juice & Extra Virgin Olive Oil", qtyPerPerson: 10, unit: "ml blend", category: "Pantry" }
    ],
    steps: [
      "Remove tough center stems from kale leaves; tear into bite-sized pieces.",
      "Drizzle with 1/2 tsp olive oil and a pinch of salt; massage firmly with fingers for 90 seconds until leaves turn dark emerald and silky tender.",
      "Toss cooked chickpeas with olive oil, garlic powder, and paprika; bake at 200°C for 18 minutes until shatter-crisp.",
      "Pour creamy cashew Caesar dressing over the massaged kale; toss thoroughly to coat every leaf.",
      "Garnish with hot crunchy chickpea croutons and shaved cheese before serving."
    ],
    reviews: []
  },
  {
    id: "classic-shakshuka-poached-eggs",
    title: "Artisanal Skillet Shakshuka",
    category: "Breakfast & Morning",
    tagline: "North African skillet eggs gently poached in a spiced bell pepper, ripe tomato, and cumin reduction.",
    image: "https://images.unsplash.com/photo-1590412200988-a436970781fa?w=800&auto=format&fit=crop&q=80",
    prepTime: "8 mins",
    cookTime: "14 mins",
    difficulty: "Easy",
    dietary: ["Vegetarian", "Gluten-Free"],
    basePortionPersons: 1,
    budgetAlternative: {
      active: false,
      title: "Desi Roma Puree & Cottage Cheese Crumbles (No Imported Feta Markup)",
      description: "Replaces high-priced Greek imported feta with freshly crumbled salted paneer and slow-simmered local Roma tomatoes.",
      swapRatio: "30g Crumbled Paneer + lemon zest replaces 30g imported feta",
      tasteImpact: "Savory cumin-spiced warmth with creamy yolk richness.",
      textureImpact: "Runny golden egg yolks swimming in thick, chunky spiced tomato gravy.",
      replacedItems: [
        { original: "Imported Greek Barrel Feta (30g)", replacedWith: "Crumbled Farmhouse Paneer with Lemon Salt", reason: "Prevents excessive saltiness while saving " }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "Egg White & Roasted Pepper Skillet",
      description: "Uses 1 whole egg + 2 egg whites poached in rich vegetable reduction for high protein and low dietary cholesterol."
    },
    ingredients: [
      { name: "Farm Fresh Large Free-Range Eggs", qtyPerPerson: 2, unit: "eggs", category: "Produce" },
      { name: "Crushed Ripe Roma Tomatoes & Bell Peppers", qtyPerPerson: 180, unit: "g spiced base", category: "Produce" },
      { name: "Extra Virgin Olive Oil", qtyPerPerson: 1, unit: "tablespoon", category: "Pantry" },
      { name: "Smoked Paprika, Cumin & Ground Coriander", qtyPerPerson: 1, unit: "tsp blend", category: "Spices" },
      { name: "Crumbled Feta or Farmhouse Paneer", qtyPerPerson: 30, unit: "g cheese", category: "Dairy", isReplaceable: true, replaceableType: "budget" }
    ],
    steps: [
      "In a small cast-iron skillet, heat olive oil; sauté diced onions and red bell peppers until soft and lightly caramelized.",
      "Add minced garlic, cumin, and smoked paprika, stirring for 45 seconds until aromatic.",
      "Pour in crushed tomatoes; simmer for 8 minutes until sauce is thick and saucy.",
      "Use the back of a spoon to create two wells in the simmering sauce; crack an egg gently into each well.",
      "Cover skillet and cook over low heat for 5–6 minutes until whites are just set and yolks remain runny.",
      "Garnish with crumbled feta or paneer, fresh cilantro, and serve sizzling hot with toasted sourdough."
    ],
    reviews: []
  },
  {
    id: "overnight-chia-berry-pudding",
    title: "Almond Milk Chia & Wild Berry Parfait",
    category: "Breakfast & Morning",
    tagline: "Slow-hydrated organic black chia seeds steeped in vanilla almond milk, layered with fresh berry compote and granola.",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
    prepTime: "5 mins",
    cookTime: "0 mins",
    difficulty: "Easy",
    dietary: ["Vegetarian", "Gluten-Free", "Vegan", "Dairy-Free"],
    basePortionPersons: 1,
    budgetAlternative: {
      active: false,
      title: "Fresh Toned Milk & Basil Seeds (Sabja) Silk (No High-Import Chia)",
      description: "When imported chia seeds are high cost, uses sweet basil seeds (sabja) which hydrate in 15 minutes with cooling Ayurvedic properties.",
      swapRatio: "25g Sabja seeds replaces 25g Chia seeds",
      tasteImpact: "Subtle floral vanilla creaminess with popping texture.",
      textureImpact: "Delicate jelly pearls suspended in chilled aromatic milk.",
      replacedItems: [
        { original: "Imported Organic Chia Seeds", replacedWith: "Cooling Sweet Basil Seeds (Sabja)", reason: "Hydrates 4x faster and saves  per jar" }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "Stevia & Unsweetened Coconut Water Gel",
      description: "Hydrates seeds in tender coconut water with zero added cane sugars for clean electrolyte hydration."
    },
    ingredients: [
      { name: "Organic Black Chia Seeds", qtyPerPerson: 25, unit: "g seeds", category: "Produce", isReplaceable: true, replaceableType: "budget" },
      { name: "Unsweetened Vanilla Almond Milk", qtyPerPerson: 120, unit: "ml plant milk", category: "Dairy" },
      { name: "Wild Blackberry & Blueberry Compote", qtyPerPerson: 40, unit: "g compote", category: "Produce" },
      { name: "Toasted Rolled Oats Granola", qtyPerPerson: 20, unit: "g crunch", category: "Grains" }
    ],
    steps: [
      "Whisk chia seeds into vanilla almond milk with a drop of pure maple syrup; stir again after 5 minutes to prevent clumping.",
      "Cover and chill overnight (or minimum 4 hours) in glass jars until thick, pudding-like consistency develops.",
      "Spoon wild berry compote at the bottom of serving tumbler.",
      "Layer chilled chia pudding over the berries.",
      "Crown with toasted crunchy granola and sliced fresh strawberries right before service."
    ],
    reviews: []
  },
  {
    id: "fluffy-buttermilk-pancakes",
    title: "Fluffy Golden Buttermilk Pancakes",
    category: "Breakfast & Morning",
    tagline: "Thick, cloud-like diner pancakes served with melted cultured butter and warm amber maple syrup.",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&auto=format&fit=crop&q=80",
    prepTime: "10 mins",
    cookTime: "8 mins",
    difficulty: "Easy",
    dietary: ["Vegetarian"],
    basePortionPersons: 1,
    budgetAlternative: {
      active: false,
      title: "Fresh Milk & Lemon Curdle Leaven (No Specialty Buttermilk Buying)",
      description: "When commercial cultured buttermilk is missing, adds 1 tbsp fresh lemon juice to warm whole milk for instant lactic lift.",
      swapRatio: "120ml Milk + 1 tsp lemon juice replaces 120ml packaged buttermilk",
      tasteImpact: "Sweet, buttery vanilla aroma with gentle tang.",
      textureImpact: "Extra fluffy, 1-inch tall pancakes that soak syrup effortlessly.",
      replacedItems: [
        { original: "Commercial Cultured Buttermilk Carton", replacedWith: "Farm Fresh Milk & Lemon Curdle Brew", reason: "Fresh on-demand souring with zero carton waste" }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "Oat Flour & Banana Protein Pancakes",
      description: "Blends rolled oats with ripe banana and egg whites for naturally sweetened morning protein."
    },
    ingredients: [
      { name: "Unbleached Pastry Flour", qtyPerPerson: 80, unit: "g flour", category: "Bakery" },
      { name: "Fresh Milk & Lemon Curdle / Buttermilk", qtyPerPerson: 120, unit: "ml liquid", category: "Dairy", isReplaceable: true, replaceableType: "budget" },
      { name: "Farm Fresh Egg", qtyPerPerson: 1, unit: "egg", category: "Produce" },
      { name: "Melted Table Butter & Baking Powder", qtyPerPerson: 15, unit: "g blend", category: "Dairy" },
      { name: "Warm Maple Syrup & Fresh Berries", qtyPerPerson: 30, unit: "ml drizzle", category: "Sweetener" }
    ],
    steps: [
      "Whisk flour, baking powder, a pinch of baking soda, and sugar in a large bowl.",
      "In a separate bowl, whisk buttermilk (or milk-lemon curdle), egg, and melted butter.",
      "Gently combine wet and dry ingredients with a fork; leave batter lumpy and let rest for 6 minutes (do not over-mix).",
      "Ladle onto a medium-hot buttered griddle; cook until bubbles form on top and burst.",
      "Flip gently and cook for 90 seconds until golden brown on both sides.",
      "Stack high, crown with butter pat, and pour warm maple syrup over the top."
    ],
    reviews: []
  },
  {
    id: "mumbai-street-kanda-poha",
    title: "Rustic Mumbai Kanda Batata Poha",
    category: "Breakfast & Morning",
    tagline: "Light, fluffy flattened rice tempered with mustard seeds, crunchy peanuts, turmeric, and fresh lime juice.",
    image: "./assets/recipes/mumbai-street-kanda-poha.jpg",
    prepTime: "8 mins",
    cookTime: "8 mins",
    difficulty: "Easy",
    dietary: ["Vegetarian", "Gluten-Free", "Vegan"],
    basePortionPersons: 1,
    budgetAlternative: {
      active: false,
      title: "Toasted Roasted Chana Dal (No Expensive Nut Oil)",
      description: "When raw peanuts are costly or when nut-free allergen requests occur, uses golden roasted chana dal for equal crunchy pop.",
      swapRatio: "15g Roasted Chana replaces 15g raw peanuts",
      tasteImpact: "Golden turmeric aromatics with tangy lemon finish.",
      textureImpact: "Featherlight, non-sticky rice flakes with crispy savory tempering.",
      replacedItems: [
        { original: "Raw Shelled Peanuts", replacedWith: "Roasted Split Bengal Gram (Chana Dal)", reason: "Nut-free allergen safety and  lower ingredient cost" }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "Equal-blend Red Rice Poha & Steamed Green Peas",
      description: "Uses unpolished red rice flakes and double sweet peas for low glycemic index."
    },
    ingredients: [
      { name: "Thick Flattened Rice (Jada Poha)", qtyPerPerson: 80, unit: "g dry flakes", category: "Grains" },
      { name: "Finely Chopped Red Onions & Potatoes", qtyPerPerson: 60, unit: "g produce", category: "Produce" },
      { name: "Raw Peanuts or Roasted Gram", qtyPerPerson: 15, unit: "g nuts/gram", category: "Produce", isReplaceable: true, replaceableType: "budget" },
      { name: "Mustard Seeds, Curry Leaves & Green Chilies", qtyPerPerson: 1, unit: "tsp tadka", category: "Spices" },
      { name: "Fresh Coriander, Fresh Coconut & Lime Juice", qtyPerPerson: 15, unit: "g garnish", category: "Produce" }
    ],
    steps: [
      "Rinse thick poha gently in a colander under running water for 30 seconds; drain well and let rest for 5 minutes (it will absorb water and become soft).",
      "Heat oil in a kadai; fry peanuts until golden and crunchy, remove and set aside.",
      "In the same oil, add mustard seeds, green chilies, and fresh curry leaves until they crackle.",
      "Add finely diced potatoes and onions with turmeric powder; sauté covered over low flame until potatoes are fork-tender.",
      "Gently fluff softened poha with a fork; fold into the kadai with salt and sugar; steam covered for 2 minutes.",
      "Squeeze fresh lime juice, top with fried peanuts, fresh grated coconut, and chopped coriander."
    ],
    reviews: []
  },
  {
    id: "classic-french-omelette-sourdough",
    title: "Classic French Herb Omelette & Sourdough",
    category: "Breakfast & Morning",
    tagline: "Silky, custardy French rolled omelette infused with fresh tarragon and chives, served alongside buttered sourdough.",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80",
    prepTime: "5 mins",
    cookTime: "3 mins",
    difficulty: "Medium",
    dietary: ["Vegetarian"],
    basePortionPersons: 1,
    budgetAlternative: {
      active: false,
      title: "Desi Ghee Glaze & Local Farm Eggs (No French Butter Cost)",
      description: "Replaces imported European churned butter with aromatic domestic clarified butter for a rich golden sheen.",
      swapRatio: "15g Desi Ghee replaces 20g imported European butter",
      tasteImpact: "Velvety, melt-in-mouth egg custard with savory chives.",
      textureImpact: "Pale yellow exterior with soft, creamy scrambled interior core.",
      replacedItems: [
        { original: "Imported Normandy European Cultured Butter", replacedWith: "Farmhouse Clarified Desi Ghee", reason: "Prevents browning and cuts fat cost by " }
      ]
    },
    calorieAlternative: {
      active: false,
      title: "2-White 1-Whole Egg Light Roll",
      description: "Combines 2 egg whites with 1 yolk whisked with sparkling water for high volume and reduced dietary lipids."
    },
    ingredients: [
      { name: "Farm Fresh Free-Range Eggs", qtyPerPerson: 3, unit: "eggs", category: "Produce" },
      { name: "Unsalted Churned Table Butter", qtyPerPerson: 20, unit: "g butter", category: "Dairy", isReplaceable: true, replaceableType: "budget" },
      { name: "Fresh Chives, Parsley & Chervil", qtyPerPerson: 1, unit: "tablespoon herbs", category: "Herbs" },
      { name: "Toasted Artisanal Sourdough Slice", qtyPerPerson: 1, unit: "slice", category: "Bakery" },
      { name: "Flaky Sea Salt & White Pepper", qtyPerPerson: 0.5, unit: "tsp blend", category: "Spices" }
    ],
    steps: [
      "Crack eggs into a bowl; whisk thoroughly with a fork until whites and yolks are completely uniform with zero streaks.",
      "Heat a non-stick 8-inch skillet over medium heat; melt butter until foaming without turning brown.",
      "Pour eggs in; immediately shake pan vigorously with one hand while stirring rapidly in small circles with a silicone spatula.",
      "When curds are creamy and barely set, smooth the surface and pull pan off heat.",
      "Tilt pan and roll the omelette into a neat cigar shape onto a warm plate.",
      "Brush top with a dab of butter for shine, scatter fresh chives, and serve with toasted sourdough."
    ],
    reviews: []
  }
];

// Curated Ingredient Swap Profiles for the Swap Lab
const FLAVORSHIFT_SWAP_DATABASE = [
  {
    targetIngredient: "Fresh Cream",
    commonInDishes: ["Paneer Butter Masala", "Dal Makhani", "Pasta Alfredo", "Cream of Tomato Soup"],
    reasonForSwap: "Dairy stockouts, spoilage, or non-dairy kitchen requirements",
    originalPhoto: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80",
    dishPhoto: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80",
    targetRecipeId: "paneer-butter-masala",
    alternatives: [
      {
        name: "Soaked Cashew & Warm Milk Puree",
        type: "Balanced Culinary Match",
        ratio: "100g Cream = 60g Cashew Paste + 40g Milk",
        tasteDesc: "Rich, mildly sweet nuttiness well-suited to spiced tomato gravies.",
        textureDesc: "Smooth emulsion that stays stable under gentle simmering without curdling.",
        photo: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80"
      },
      {
        name: "Whisked Fresh Malai & Hung Curd",
        type: "Pantry Kitchen Alternative",
        ratio: "100g Cream = 50g Malai + 50g Whisked Curd",
        tasteDesc: "Mild dairy creaminess balanced with gentle cultured tang.",
        textureDesc: "Glossy finish when whisked thoroughly off direct high heat.",
        photo: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80"
      },
      {
        name: "Strained Greek Yogurt & Silken Tofu Puree",
        type: "Lighter / High-Protein Option",
        ratio: "100g Cream = 70g Greek Yogurt + 30g Blanched Tofu",
        tasteDesc: "Clean, lighter savory profile without heavy creaminess.",
        textureDesc: "Smooth when added over low flame at the end of cooking.",
        photo: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80"
      }
    ]
  },
  {
    targetIngredient: "Hass Avocado",
    commonInDishes: ["Avocado Toast", "Guacamole", "Green Salad Bowls"],
    reasonForSwap: "Unripe stock, rapid oxidation/browning, or high seasonal prices",
    originalPhoto: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80",
    dishPhoto: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=600&auto=format&fit=crop&q=80",
    targetRecipeId: "smashed-avocado-toast",
    alternatives: [
      {
        name: "Equal-Part Sweet Green Pea & Avocado Mash",
        type: "Balanced Culinary Match",
        ratio: "1 Avocado = 1/2 Avocado + 1/2 cup Steamed Sweet Peas",
        tasteDesc: "Fresh, lightly sweet garden flavor that pairs well with lemon and salt.",
        textureDesc: "Spreadable mash that maintains bright green color during service.",
        photo: "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=600&auto=format&fit=crop&q=80"
      },
      {
        name: "Edamame & Lime Herb Puree",
        type: "Seed / Legume Alternative",
        ratio: "1 Avocado = 1 cup Shelled Steamed Edamame + Lime",
        tasteDesc: "Clean, nutty bean base lifted by citrus juice and herbs.",
        textureDesc: "Whipped spreadable paste with hearty texture.",
        photo: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80"
      }
    ]
  },
  {
    targetIngredient: "Black Truffle Oil",
    commonInDishes: ["Wild Mushroom Fettuccine", "Truffle Fries", "Risotto"],
    reasonForSwap: "Pantry substitution using natural dried mushrooms instead of flavored oil",
    originalPhoto: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80",
    dishPhoto: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&auto=format&fit=crop&q=80",
    targetRecipeId: "wild-mushroom-truffle-pasta",
    alternatives: [
      {
        name: "Steeped Porcini Mushroom Broth & Brown Garlic Butter",
        type: "Balanced Culinary Match",
        ratio: "1 tsp Truffle Oil = 1 tbsp Steeped Porcini Broth + 1 tsp Brown Butter",
        tasteDesc: "Savory woodland umami paired with nutty toasted garlic butter.",
        textureDesc: "Emulsifies cleanly with starchy pasta cooking water.",
        photo: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&auto=format&fit=crop&q=80"
      }
    ]
  },
  {
    targetIngredient: "Mascarpone & Cream Cheese",
    commonInDishes: ["Basque Cheesecake", "Tiramisu", "Creamy Polenta"],
    reasonForSwap: "High dairy cheese cost or pantry stockout during baking prep",
    originalPhoto: "https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=600&auto=format&fit=crop&q=80",
    dishPhoto: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&auto=format&fit=crop&q=80",
    targetRecipeId: "basque-burnt-cheesecake",
    alternatives: [
      {
        name: "Hung Farmhouse Curd + Heavy Cream (Equal Blend)",
        type: "Balanced Culinary Match",
        ratio: "100g Mascarpone = 50g Hung Curd + 50g Whipped Cream",
        tasteDesc: "Mild dairy richness balanced with delicate cultured tang.",
        textureDesc: "Thick, bakeable custard consistency.",
        photo: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80"
      },
      {
        name: "Whipped Fresh Ricotta + Butter",
        type: "Pantry Kitchen Alternative",
        ratio: "100g Mascarpone = 80g Ricotta + 20g Melted Butter",
        tasteDesc: "Mild, lightly sweet milky finish.",
        textureDesc: "Smooth once whipped thoroughly in a food processor.",
        photo: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&auto=format&fit=crop&q=80"
      }
    ]
  },
  {
    targetIngredient: "Pine Nuts",
    commonInDishes: ["Basil Pesto Pasta", "Mezze Salads", "Herb Dressings"],
    reasonForSwap: "Nut allergies, high ingredient cost, or limited pantry stock",
    originalPhoto: "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?w=600&auto=format&fit=crop&q=80",
    dishPhoto: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80",
    targetRecipeId: null,
    alternatives: [
      {
        name: "Toasted Sunflower Seeds & Walnuts",
        type: "Seed / Pantry Alternative",
        ratio: "50g Pine Nuts = 30g Sunflower Seeds + 20g Toasted Walnuts",
        tasteDesc: "Mild toasted seed warmth without harsh bitterness.",
        textureDesc: "Grinds and emulsifies smoothly into pesto and herb sauces.",
        photo: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80"
      }
    ]
  }
];

// Pre-filled Pantry Staples for selection
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

// Design Thinking Slides (Conceptual Architecture & Workflow)
const DESIGN_THINKING_SLIDES = [
  {
    slideNumber: 1,
    stage: "Design Thinking Overview",
    title: "FlavorShift: Practical Culinary Ingredient Alternatives",
    subtitle: "Helping cooks adapt recipes when key ingredients are unavailable or dietary needs change",
    badge: "Stage 01: Context",
    icon: "compass",
    points: [
      {
        title: "The Missing Ingredient Challenge",
        desc: "Prep often stalls when ingredients like fresh cream, mascarpone, or pine nuts run out. Guessing substitutions can curdle sauces or disrupt texture."
      },
      {
        title: "Structured Swap Ratios",
        desc: "Provides practical gram-for-gram substitution pairs alongside texture and heat-stability instructions."
      },
      {
        title: "Local Kitchen Tasting Log",
        desc: "Cooks can test swaps on their own stove and store personal notes directly in the browser."
      }
    ],
    metric: { value: "3 Core Pillars", label: "Ratio Conversion, Recipe Adaptation & Personal Tasting Notes" }
  },
  {
    slideNumber: 2,
    stage: "Stage 1: Empathize",
    title: "Understanding Everyday Kitchen Friction",
    subtitle: "Mapping common pain points around missing ingredients and menu adaptation",
    badge: "Stage 02: Empathy",
    icon: "users",
    points: [
      {
        title: "Mid-Prep Substitutions",
        desc: "Discovering missing cream mid-simmer often leads to adding plain cold milk, which lacks fat body and can separate in acidic tomato gravies."
      },
      {
        title: "Ingredient Volatility",
        desc: "Seasonal swings in avocado quality or imported cheese availability push small kitchens to adjust sourcing flexibly."
      },
      {
        title: "What Cooks Need",
        desc: "1) Clear conversion ratios, 2) Notes on texture & heat handling, and 3) A structured checklist scaled to exact headcount."
      }
    ],
    metric: { value: "Core Pain Point", label: "Need for scaled replacement ratios and heat-handling guidance" }
  },
  {
    slideNumber: 3,
    stage: "Stage 2: Define",
    title: "Core Problem Statements & Design Goals",
    subtitle: "Framing culinary substitution needs into clear interactive modules",
    badge: "Stage 03: Define",
    icon: "target",
    points: [
      {
        title: "HMW #1: Communicate Conversion Ratios Clearly?",
        desc: "Show exact replacement pairs (such as soaked cashews and warm milk replacing fresh cream) scaled cleanly to cover count."
      },
      {
        title: "HMW #2: Adapt Instructions Inline?",
        desc: "Update recipe preparation steps dynamically so cooks know when and at what heat to fold in each swap."
      },
      {
        title: "HMW #3: Capture Tasting Observations?",
        desc: "Provide a lightweight local tasting form so each cook can document texture, heat stability, and taste notes."
      }
    ],
    metric: { value: "Focus Goal", label: "Clear kitchen ratios, adapted steps, and personal tasting feedback" }
  },
  {
    slideNumber: 4,
    stage: "Stage 3: Ideate",
    title: "The FlavorShift Workflow Architecture",
    subtitle: "Organizing substitution guidance by culinary goal",
    badge: "Stage 04: Ideate",
    icon: "lightbulb",
    points: [
      {
        title: "Pillar 1: Culinary Role Pairing",
        desc: "Matches replacement bases by culinary function—emulsion richness, thickening, umami depth, or moisture retention."
      },
      {
        title: "Pillar 2: Multi-Path Swap Modes",
        desc: "Offers Pantry/Budget, Lighter, and Plant-Based variations directly inside each recipe."
      },
      {
        title: "Pillar 3: Browser-Persisted Notes",
        desc: "Stores submitted trial observations in localStorage without requiring external accounts."
      }
    ],
    metric: { value: "3 Swap Modes", label: "Budget-Friendly, Lighter, and Plant-Based toggles inside recipes" }
  },
  {
    slideNumber: 5,
    stage: "Stage 4: Prototype",
    title: "Interactive Swap Lab & Recipe Explorer",
    subtitle: "Bringing conversion ratios and prep scaling into a zero-build static web app",
    badge: "Stage 05: Prototype",
    icon: "layout",
    points: [
      {
        title: "Swap Lab Inspector",
        desc: "Select a missing ingredient to inspect candidate substitutes, culinary ratios, and texture behavior."
      },
      {
        title: "Dynamic Recipe Scaling & Steps",
        desc: "Adjust person counts and switch swap modes to recalculate ingredient quantities and update cooking steps."
      },
      {
        title: "Thermal Kitchen Prep Ticket",
        desc: "Generate a clean, printable prep sheet showing scaled ingredients and adapted line steps."
      }
    ],
    metric: { value: "9 Dishes · 5 Swaps", label: "Interactive recipes and swap profiles built in the catalog" }
  },
  {
    slideNumber: 6,
    stage: "Stage 5: Test & Iterate",
    title: "User-Led Kitchen Testing Loop",
    subtitle: "Validating recipes personally through local tasting notes and custom cost inputs",
    badge: "Stage 06: Iteration",
    icon: "check-circle",
    points: [
      {
        title: "Personal Tasting Records",
        desc: "Instead of canned testimonials, cooks log their own observations on sauce emulsion, heat stability, and diner reaction."
      },
      {
        title: "Local Price Inputs",
        desc: "Operators enter their own supplier costs per portion in the simulator to calculate margins tailored to their market."
      },
      {
        title: "Iterative Menu Adaptation",
        desc: "Bookmark frequently adapted recipes for quick reference on prep shifts."
      }
    ],
    metric: { value: "Local Storage", label: "Tasting logs and favorites saved directly in your browser" }
  }
];
