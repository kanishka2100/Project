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
    category: "Pastas & Mains",
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
        { original: "100% Imported Cream Cheese (150g)", replacedWith: "Equal Blend Hung Farmhouse Curd & Cream Cheese", reason: "Replaces half the cream cheese using house-strained curd for mild tang" }
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
    category: "Pastas & Mains",
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
