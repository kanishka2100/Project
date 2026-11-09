// FlavorCraft Cafe OS - Curated Cafe Recipe Database with Cost Optimization, Calorie Reducer & Person Scaling

const RECIPES_DATA = [
  {
    id: "smashed-avocado-toast",
    title: "Signature Smashed Avocado & Feta Toast",
    category: "Brunch & Toast",
    tagline: "The #1 cafe revenue driver, reimagined with smart cost-saving & low-calorie options.",
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

    // Cost Saver Alternative
    budgetAlternative: {
      active: false,
      title: "Green Pea & Hass Avocado Blend + Ricotta Crumbles",
      savingsPerPerson: 1.65,
      savingsPercent: "43%",
      newCostPerPerson: 2.20,
      description: "Blends 50% sweet tender green peas with ripe Hass avocado to create an ultra-vibrant, velvety mash while cutting avocado cost in half. Swaps expensive imported Greek feta with silky whipped domestic ricotta.",
      replacedItems: [
        { original: "Hass Avocado (1 whole per person)", replacedWith: "50/50 Hass Avocado & Sweet Green Pea Mash", reason: "Saves $1.10/person and stays vibrant green without browning quickly" },
        { original: "Imported Greek Barrel-Aged Feta", replacedWith: "Farmhouse Ricotta Crumbles with Lemon Zest", reason: "Saves $0.55/person and gives a fresher, lighter brunch mouthfeel" }
      ]
    },

    // Calorie Cutter Alternative ("ek same recipe ko less calories ka kese bna skte h uske alternative")
    calorieAlternative: {
      active: false,
      title: "Slimline Protein Avocado Crisp Toast",
      calorieDrop: 190,
      newCalories: 290,
      newMacros: { protein: 21, carbs: 26, fat: 11, fiber: 8 },
      caloriePercent: "-40%",
      description: "Slashes calories by 40% while boosting protein! Swaps thick buttered sourdough for artisanal seeded crispbread, folds in egg whites instead of whole egg, and replaces EVOO drizzle with a zesty citrus-herb mist.",
      replacedItems: [
        { original: "Thick Artisanal Sourdough (butter toasted)", replacedWith: "Toasted Seeded Thin Sourdough Crispbread", calorieSaving: "-85 kcal" },
        { original: "Extra Virgin Olive Oil Drizzle (1.5 tbsp)", replacedWith: "Fresh Meyer Lemon & Herb Spritz", calorieSaving: "-75 kcal" },
        { original: "Full Poached Egg with yolk", replacedWith: "Poached Egg White Cloud with micro-pinch za'atar", calorieSaving: "-30 kcal" }
      ]
    },

    // Vegan Option
    veganOption: {
      active: false,
      title: "100% Plant-Based Avocado & Tofu-Feta Toast",
      description: "Substitutes feta with herb-marinated artisan tofu feta and poached egg with seasoned grilled smoky tofu slices.",
      replacedItems: [
        { original: "Greek Feta Cheese", replacedWith: "Herb & Garlic Marinated Firm Tofu Feta" },
        { original: "Poached Free-Range Egg", replacedWith: "Smoked Paprika Grilled Tofu Slice or Avocado Flower" }
      ]
    },

    // Base Ingredients (per 1 person)
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

    // Chef preparation steps
    steps: [
      "Lightly toast the sourdough slice until golden brown with a crisp crust and tender crumb.",
      "In a cafe prep bowl, roughly mash the Hass avocado with lemon juice, sea salt, and cracked black pepper, leaving appetizing rustic chunks.",
      "Poach the farm egg in simmering water with a splash of white vinegar for exactly 3 minutes until white is set and yolk remains silky liquid.",
      "Generously spread the avocado mash edge-to-edge across the toasted sourdough.",
      "Gently place the warm poached egg in the center.",
      "Scatter crumbled feta, sliced radishes, micro pea shoots, and crushed red pepper flakes.",
      "Finish with a delicate drizzle of extra virgin olive oil and flaky Maldon sea salt. Serve immediately with a cafe napkin and cutlery."
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
      },
      {
        id: "r2",
        author: "Ananya Sharma",
        cafeName: "Roast & Bloom Cafe, Mumbai",
        rating: 5,
        date: "1 week ago",
        verifiedCafe: true,
        text: "We tested the calorie-cutter mode for our health-conscious tech park crowd. Orders shot up 40% when we labeled it 'Under 300 kcal Protein Toast'!",
        photo: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80",
        helpfulCount: 19
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
      description: "Replaces high-spoilage fresh organic turmeric root with potent cold-ground organic powder, and swaps expensive vanilla bean pods with pure vanilla extract.",
      replacedItems: [
        { original: "Fresh organic grated turmeric root & vanilla pod", replacedWith: "High-curcumin organic turmeric powder & pure vanilla extract", reason: "Zero kitchen spoilage, consistent golden hue, saves $0.45 per cup" },
        { original: "Grade-A Maple Syrup", replacedWith: "House-made Spiced Golden Jaggery/Honey Syrup", reason: "Saves $0.20 per serving with richer caramel notes" }
      ]
    },

    calorieAlternative: {
      active: false,
      title: "Keto Skinny Golden Turmeric Elixir",
      calorieDrop: 110,
      newCalories: 75,
      newMacros: { protein: 2, carbs: 4, fat: 5, fiber: 2 },
      caloriePercent: "-60%",
      description: "Replaces barista oat milk (high in natural carbs) with unsweetened creamy almond milk, and uses zero-calorie organic monk fruit/stevia drops.",
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
      { name: "Barista Edition Oat Milk", qtyPerPerson: 1, unit: "cup (240ml equivalent)", cost: 0.80, category: "Plant Milk", isReplaceable: true, replaceableType: "calorie" },
      { name: "Fresh Turmeric Root (or powder)", qtyPerPerson: 1, unit: "teaspoon finely grated", cost: 0.25, category: "Spices", isReplaceable: true, replaceableType: "budget" },
      { name: "Fresh Ginger Juice", qtyPerPerson: 0.5, unit: "teaspoon", cost: 0.10, category: "Produce" },
      { name: "Ceylon Cinnamon & Black Pepper", qtyPerPerson: 0.25, unit: "teaspoon blend", cost: 0.05, category: "Spices" },
      { name: "Pure Maple Syrup", qtyPerPerson: 1, unit: "tablespoon", cost: 0.20, category: "Sweetener", isReplaceable: true, replaceableType: "budget-calorie" },
      { name: "Pure Vanilla Bean Extract", qtyPerPerson: 0.25, unit: "teaspoon", cost: 0.05, category: "Flavors" }
    ],

    steps: [
      "In a barista steaming pitcher, whisk together turmeric, ginger juice, Ceylon cinnamon, black pepper (essential to activate curcumin), and maple syrup.",
      "Add cold oat milk into the pitcher and stir to incorporate the golden spice paste.",
      "Steam the spiced oat milk using the espresso machine steam wand to 65°C (150°F), creating a silky, microfoam vortex texture.",
      "Pour into an 8oz artisan ceramic cafe mug with a slow, controlled center pour.",
      "Dust the top microfoam gently with cinnamon latte stencil art and serve piping hot."
    ],

    reviews: [
      {
        id: "r3",
        author: "Pooja Varma",
        cafeName: "Bean & Soul Studio, Bangalore",
        rating: 5,
        date: "3 days ago",
        verifiedCafe: true,
        text: "Our highest margin hot beverage! The cost-saver switch to powder cut our prep time down from 5 mins to under 90 seconds while saving 45% ingredient cost.",
        photo: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
        helpfulCount: 31
      }
    ]
  },

  {
    id: "wild-mushroom-truffle-pasta",
    title: "Truffle-Style Wild Mushroom Fettuccine",
    category: "Pastas & Mains",
    tagline: "Gourmet cafe pasta with rich umami, engineered for fast cafe ticket times.",
    isMostSearched: true,
    rating: 4.9,
    reviewsCount: 51,
    image: "https://images.unsplash.com/photo-1621996346565-e3d5d6281005?w=800&auto=format&fit=crop&q=80",
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
      description: "Replaces astronomical wild chanterelles and imported truffle oil with pan-caramelized brown cremini mushrooms deglazed with steeped dried porcini mushroom broth and toasted garlic butter. Replaces imported 24-month Parmigiano with domestic Grana Padano.",
      replacedItems: [
        { original: "Imported Black Truffle Oil & Wild Chanterelles", replacedWith: "Steeped Porcini Mushroom Reduction + Brown Creminis", reason: "Saves $2.10/person with deeper savory umami and zero synthetic truffle aroma" },
        { original: "24-Month Parmigiano-Reggiano", replacedWith: "Aged Domestic Grana Padano", reason: "Saves $0.60/person with identical sharp salty bite" }
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
      { name: "Heavy Whipping Cream (36% fat)", qtyPerPerson: 80, unit: "ml equivalent", cost: 0.70, category: "Dairy", isReplaceable: true, replaceableType: "calorie-vegan" },
      { name: "White Truffle Infused Olive Oil", qtyPerPerson: 1, unit: "teaspoon finish", cost: 0.80, category: "Oils", isReplaceable: true, replaceableType: "budget" },
      { name: "Aged Parmigiano-Reggiano", qtyPerPerson: 25, unit: "g grated", cost: 0.50, category: "Dairy", isReplaceable: true, replaceableType: "budget-vegan" },
      { name: "Shallot & Fresh Garlic Cloves", qtyPerPerson: 2, unit: "cloves minced", cost: 0.10, category: "Produce" },
      { name: "Fresh Garden Thyme Leaves", qtyPerPerson: 2, unit: "sprigs", cost: 0.05, category: "Produce" },
      { name: "Cracked Black Peppercorns & Sea Salt", qtyPerPerson: 1, unit: "pinch", cost: 0.05, category: "Spices" }
    ],

    steps: [
      "Bring a large pot of salted water to a rolling boil and cook fresh fettuccine for 3 minutes until al dente.",
      "In a wide stainless saute pan, melt butter or heat oil over medium-high heat until shimmering.",
      "Add sliced mushrooms in a single layer and sear undisturbed for 2-3 minutes until deeply caramelized and aromatic.",
      "Add minced shallots, garlic, and fresh thyme, tossing for 60 seconds until fragrant.",
      "Pour in the cream (or cauliflower-cashew emulsion) and reduce heat to gentle simmer for 2 minutes to thicken.",
      "Transfer al dente pasta directly into the sauce with a splash of starchy pasta water to bind.",
      "Toss vigorously to coat every strand; remove from heat and fold in grated cheese.",
      "Plate into a warmed pasta bowl, twirled high in the center.",
      "Garnish with truffle oil drizzle (or porcini brown butter), cracked pepper, and fresh thyme sprigs."
    ],

    reviews: [
      {
        id: "r4",
        author: "Chef Liam K.",
        cafeName: "Artisan Wood & Fork, Portland",
        rating: 5,
        date: "5 days ago",
        verifiedCafe: true,
        text: "The Porcini reduction budget swap is genius. Our customers literally couldn't tell the difference from $5 truffle oil, and our food cost margin skyrocketed from 67% to 83%!",
        photo: "https://images.unsplash.com/photo-1621996346565-e3d5d6281005?w=600&auto=format&fit=crop&q=80",
        helpfulCount: 47
      }
    ]
  },

  {
    id: "superfood-acai-dragonfruit-bowl",
    title: "Vibrant Acai & Dragonfruit Smoothie Bowl",
    category: "Bowls & Greens",
    tagline: "Vibrant Instagram-famous smoothie bowl with superfood crunch.",
    isMostSearched: true,
    rating: 4.8,
    reviewsCount: 29,
    image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&auto=format&fit=crop&q=80",
    prepTime: "5 mins",
    cookTime: "0 mins",
    difficulty: "Easy",
    dietary: ["Vegan", "Vegetarian", "Gluten-Free", "Dairy-Free"],
    basePortionPersons: 1,
    baseCostPerPerson: 3.40,
    suggestedRetailPrice: 11.00,
    baseCalories: 420,
    baseMacros: { protein: 9, carbs: 64, fat: 14, fiber: 11 },

    budgetAlternative: {
      active: false,
      title: "Wild Blueberry & Beet Velvet Base + Toasted Sunflower Seed Granola",
      savingsPerPerson: 1.55,
      savingsPercent: "46%",
      newCostPerPerson: 1.85,
      description: "Replaces costly imported frozen acai packets with local frozen wild blueberries blended with a touch of organic roasted beetroot puree for identical deep purple color and natural sweetness. Replaces imported raw macadamia nuts with toasted sunflower seeds & oats.",
      replacedItems: [
        { original: "Frozen Acai Puree Packet ($2.10/pouch)", replacedWith: "Frozen Wild Blueberries + Roasted Beet Puree ($0.80/portion)", reason: "Saves $1.30 per bowl while keeping gorgeous magenta color and antioxidant power" },
        { original: "Raw Macadamia Nuts ($0.65/serving)", replacedWith: "Toasted Honey Sunflower Seeds ($0.15/serving)", reason: "Crunchy cafe topping with 75% cost savings" }
      ]
    },

    calorieAlternative: {
      active: false,
      title: "Low-Sugar Keto Berry Protein Bowl",
      calorieDrop: 180,
      newCalories: 240,
      newMacros: { protein: 18, carbs: 22, fat: 7, fiber: 10 },
      caloriePercent: "-43%",
      description: "Swaps ripe banana base for frozen cauliflower florets & strawberries with pea protein powder. Cuts high fruit sugars while doubling protein density.",
      replacedItems: [
        { original: "2 Ripe Bananas (base thickener)", replacedWith: "Frozen Riced Cauliflower + Half Green Apple", calorieSaving: "-130 kcal" },
        { original: "Honey Granola Topping", replacedWith: "Toasted Chia, Flax & Puffed Buckwheat", calorieSaving: "-50 kcal" }
      ]
    },

    veganOption: {
      active: false,
      title: "Naturally 100% Plant-Based",
      description: "Crafted with pure coconut water, frozen fruit, and plant seeds.",
      replacedItems: []
    },

    ingredients: [
      { name: "Frozen Acai / Dragon Fruit Puree", qtyPerPerson: 100, unit: "g pack", cost: 1.80, category: "Produce", isReplaceable: true, replaceableType: "budget" },
      { name: "Frozen Ripe Bananas", qtyPerPerson: 1, unit: "large sliced", cost: 0.30, category: "Produce", isReplaceable: true, replaceableType: "calorie" },
      { name: "Pure Coconut Water", qtyPerPerson: 100, unit: "ml equivalent", cost: 0.40, category: "Beverages" },
      { name: "Artisan Rolled Almond Granola", qtyPerPerson: 30, unit: "g topping", cost: 0.45, category: "Pantry", isReplaceable: true, replaceableType: "budget-calorie" },
      { name: "Fresh Blueberries & Kiwi Slices", qtyPerPerson: 30, unit: "g garnish", cost: 0.35, category: "Produce" },
      { name: "Chia Seeds & Shaved Coconut", qtyPerPerson: 1, unit: "tablespoon", cost: 0.10, category: "Pantry" }
    ],

    steps: [
      "Add frozen acai/dragonfruit puree, sliced frozen banana, and coconut water into a heavy-duty commercial cafe blender.",
      "Blend on high using the tamper stick for 40 seconds until an ultra-thick, soft-serve ice cream consistency is reached.",
      "Scoop smoothly into a chilled coconut or ceramic bowl, leveling with an offset spatula.",
      "Arrange toppings in neat aesthetic cafe stripes: golden granola, fresh kiwi wheels, fresh blueberries, and coconut flakes.",
      "Sprinkle black chia seeds across the center line. Serve immediately with a bamboo spoon."
    ],

    reviews: [
      {
        id: "r5",
        author: "Samantha Lee",
        cafeName: "Sip & Glow Acai Bar, San Diego",
        rating: 5,
        date: "1 week ago",
        verifiedCafe: true,
        text: "The presentation tips and blueberry/beet cost saver saved our summer margins. We sell 120 of these every weekend morning!",
        photo: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&auto=format&fit=crop&q=80",
        helpfulCount: 22
      }
    ]
  },

  {
    id: "pesto-chicken-sun-dried-tomato-panini",
    title: "Tuscan Pesto Chicken & Mozzarella Panini",
    category: "Gourmet Sandwiches",
    tagline: "Crisp grilled ciabatta packed with herbs, lean chicken breast, and melted cheese.",
    isMostSearched: true,
    rating: 4.9,
    reviewsCount: 35,
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop&q=80",
    prepTime: "7 mins",
    cookTime: "6 mins",
    difficulty: "Easy",
    dietary: [],
    basePortionPersons: 1,
    baseCostPerPerson: 3.90,
    suggestedRetailPrice: 13.00,
    baseCalories: 620,
    baseMacros: { protein: 38, carbs: 48, fat: 28, fiber: 4 },

    budgetAlternative: {
      active: false,
      title: "Sunflower Seed & Spinach Pesto Panini with Melted Provolone",
      savingsPerPerson: 1.70,
      savingsPercent: "44%",
      newCostPerPerson: 2.20,
      description: "Replaces pine nuts with toasted sunflower seeds and baby spinach in the pesto (saves 65% on pesto cost, nut-allergy safe!). Swaps expensive fresh buffalo mozzarella for quick-melting domestic provolone.",
      replacedItems: [
        { original: "Pine Nut Basil Pesto ($1.40/portion)", replacedWith: "Toasted Sunflower Seed & Spinach Pesto ($0.45/portion)", reason: "Nut-free allergen safe, vibrant green, 68% savings" },
        { original: "Fresh Buffalo Mozzarella Ball ($1.50/portion)", replacedWith: "Deli Sliced Smoked Provolone ($0.75/portion)", reason: "Super stretchy melt, lower moisture so bread stays ultra-crisp" }
      ]
    },

    calorieAlternative: {
      active: false,
      title: "Skinny Grilled Chicken Herb Wrap / Open Melt",
      calorieDrop: 240,
      newCalories: 380,
      newMacros: { protein: 42, carbs: 24, fat: 12, fiber: 5 },
      caloriePercent: "-38%",
      description: "Swaps thick ciabatta loaf for an open-face thin multigrain toast or low-carb spinach wrap, replaces oil-packed sun-dried tomatoes with fresh vine-ripened tomatoes, and uses light mozzarella.",
      replacedItems: [
        { original: "Full Italian Ciabatta Loaf", replacedWith: "Low-Carb Spinach Tortilla or Open Thin Sourdough", calorieSaving: "-140 kcal" },
        { original: "Oil-Packed Sun-Dried Tomatoes", replacedWith: "Oven Roasted Fresh Cherry Tomatoes with Balsamic", calorieSaving: "-50 kcal" },
        { original: "Full-Fat Cheese Portion", replacedWith: "Part-Skim Mozzarella", calorieSaving: "-50 kcal" }
      ]
    },

    veganOption: {
      active: false,
      title: "Balsamic Portobello & Cashew Mozzarella Panini",
      description: "Replaces grilled chicken with thick balsamic-marinated roasted Portobello mushroom steaks and plant-based cashew mozzarella.",
      replacedItems: [
        { original: "Grilled Chicken Breast", replacedWith: "Garlic Balsamic Roasted Portobello Cap" },
        { original: "Mozzarella Cheese", replacedWith: "Melty Artisan Cashew Mozzarella" }
      ]
    },

    ingredients: [
      { name: "Artisan Ciabatta Roll", qtyPerPerson: 1, unit: "medium roll", cost: 0.75, category: "Bakery", isReplaceable: true, replaceableType: "calorie" },
      { name: "Sous-Vide Grilled Chicken Breast", qtyPerPerson: 120, unit: "g sliced", cost: 1.60, category: "Poultry", isReplaceable: true, replaceableType: "vegan" },
      { name: "Genovese Pine Nut Basil Pesto", qtyPerPerson: 2, unit: "tablespoons", cost: 0.80, category: "Condiments", isReplaceable: true, replaceableType: "budget" },
      { name: "Fresh Mozzarella Cheese", qtyPerPerson: 40, unit: "g sliced", cost: 0.60, category: "Dairy", isReplaceable: true, replaceableType: "budget-vegan" },
      { name: "Sun-Dried Tomatoes in Olive Oil", qtyPerPerson: 25, unit: "g drained", cost: 0.40, category: "Pantry", isReplaceable: true, replaceableType: "calorie" },
      { name: "Baby Arugula Greens", qtyPerPerson: 15, unit: "g leaves", cost: 0.15, category: "Produce" }
    ],

    steps: [
      "Slice the ciabatta roll horizontally and spread vibrant pesto evenly on both inner crusts.",
      "Layer warm sliced grilled chicken breast across the bottom bun.",
      "Add sun-dried tomatoes and top with slices of mozzarella cheese.",
      "Close with the top bun and place into a pre-heated cafe commercial panini press (200°C / 400°F).",
      "Press firmly for 4-5 minutes until the exterior crust is deep golden with grill ridges and cheese is melted.",
      "Open the sandwich briefly to insert crisp baby arugula, re-close, slice diagonally at a 45° angle, and serve."
    ],

    reviews: [
      {
        id: "r6",
        author: "Devraj Mukherjee",
        cafeName: "The Corner Press Cafe, Delhi",
        rating: 5,
        date: "4 days ago",
        verifiedCafe: true,
        text: "Sunflower seed pesto is now our permanent kitchen standard! Costs literally 1/3 of pine nuts, and we can boldly advertise as 'Allergy-Friendly'. Total winner.",
        photo: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80",
        helpfulCount: 28
      }
    ]
  },

  {
    id: "basque-burnt-cheesecake",
    title: "San Sebastian Basque Burnt Cheesecake",
    category: "Bakery & Sweets",
    tagline: "Caramelized charred exterior with a rich, molten custard center.",
    isMostSearched: true,
    rating: 5.0,
    reviewsCount: 64,
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&auto=format&fit=crop&q=80",
    prepTime: "15 mins",
    cookTime: "35 mins",
    difficulty: "Medium",
    dietary: ["Vegetarian", "Gluten-Free"],
    basePortionPersons: 1, // 1 slice per person
    baseCostPerPerson: 1.80,
    suggestedRetailPrice: 7.50,
    baseCalories: 460,
    baseMacros: { protein: 9, carbs: 32, fat: 34, fiber: 0 },

    budgetAlternative: {
      active: false,
      title: "Hung Curd & Domestic Cream Cheese Blend",
      savingsPerPerson: 0.75,
      savingsPercent: "42%",
      newCostPerPerson: 1.05,
      description: "Blends 40% dense drained hung Greek yogurt curd with commercial cream cheese. Produces the exact same velvety tang while reducing expensive cream cheese cost significantly.",
      replacedItems: [
        { original: "100% Imported Philadelphia Cream Cheese", replacedWith: "60/40 Domestic Cream Cheese & Drained Greek Yogurt", reason: "Saves $0.65/slice with brighter lactic acidity" },
        { original: "Madagascar Bourbon Vanilla Bean", replacedWith: "Pure Vanilla Extract + Lemon Peel Zest", reason: "Saves $0.10/slice" }
      ]
    },

    calorieAlternative: {
      active: false,
      title: "Guilt-Free High-Protein Basque Slice",
      calorieDrop: 210,
      newCalories: 250,
      newMacros: { protein: 16, carbs: 14, fat: 12, fiber: 2 },
      caloriePercent: "-46%",
      description: "Replaces 50% cream cheese with non-fat blended cottage cheese / Greek yogurt and swaps caster sugar with erythritol-monk fruit natural sweetener.",
      replacedItems: [
        { original: "Organic Heavy Whipping Cream", replacedWith: "Unsweetened Condensed Almond/Cashew Milk", calorieSaving: "-110 kcal" },
        { original: "Refined Caster Sugar", replacedWith: "Granulated Monk Fruit & Stevia Sweetener", calorieSaving: "-100 kcal" }
      ]
    },

    veganOption: {
      active: false,
      title: "Velvety Cashew & Silken Tofu Basque Cake",
      description: "100% dairy-free and egg-free version made from soaked cashews, silken tofu, coconut cream, and cornstarch.",
      replacedItems: [
        { original: "Dairy Cream Cheese & Eggs", replacedWith: "Creamed Cashew & Silken Tofu with Lemon Juice" },
        { original: "Heavy Cream", replacedWith: "Full-Fat Coconut Cream" }
      ]
    },

    ingredients: [
      { name: "Full-Fat Cream Cheese (softened)", qtyPerPerson: 110, unit: "g equivalent", cost: 1.10, category: "Dairy", isReplaceable: true, replaceableType: "budget-calorie" },
      { name: "Caster Sugar", qtyPerPerson: 35, unit: "g", cost: 0.15, category: "Pantry", isReplaceable: true, replaceableType: "calorie" },
      { name: "Farm Fresh Eggs", qtyPerPerson: 0.7, unit: "eggs equivalent", cost: 0.25, category: "Poultry", isReplaceable: true, replaceableType: "vegan" },
      { name: "Heavy Whipping Cream (36% M.F.)", qtyPerPerson: 50, unit: "ml equivalent", cost: 0.40, category: "Dairy", isReplaceable: true, replaceableType: "calorie-vegan" },
      { name: "Gluten-Free Cornstarch", qtyPerPerson: 1, unit: "teaspoon", cost: 0.05, category: "Pantry" },
      { name: "Pure Vanilla Extract & Sea Salt", qtyPerPerson: 0.5, unit: "teaspoon", cost: 0.05, category: "Flavors" }
    ],

    steps: [
      "Preheat commercial cafe oven to 240°C (465°F). Line a cake tin with crumpled parchment paper extending 2 inches above the rim.",
      "In a commercial stand mixer with paddle attachment, beat the cream cheese and sugar on medium for 2 minutes until completely smooth.",
      "Add eggs one at a time, incorporating fully before adding the next.",
      "Slowly stream in heavy cream, vanilla, and sifted cornstarch, mixing on low speed so as not to aerate too much.",
      "Pour velvety batter into the parchment-lined tin.",
      "Bake at high heat for 32-35 minutes until the top is darkly scorched mahogany and the center still has a dramatic wobble.",
      "Cool at room temperature for 3 hours to set the custard, then slice with a hot knife. Serve at ambient temperature."
    ],

    reviews: [
      {
        id: "r7",
        author: "Chef Antoine M.",
        cafeName: "L’Aura Cafe & Bakehouse, Montreal",
        rating: 5,
        date: "2 weeks ago",
        verifiedCafe: true,
        text: "Our best-selling pastry slice! The hung curd substitution gave it such a refined tartness that customers now prefer it over 100% Philadelphia cream cheese.",
        photo: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&auto=format&fit=crop&q=80",
        helpfulCount: 52
      }
    ]
  },

  {
    id: "mediterranean-mezze-falafel-platter",
    title: "Mediterranean Herbed Falafel & Hummus Mezze",
    category: "Bowls & Greens",
    tagline: "Vibrant mezze platter with velvety silk hummus, crisp herbed falafel, and pickled sumac.",
    isMostSearched: false,
    rating: 4.7,
    reviewsCount: 18,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80",
    prepTime: "12 mins",
    cookTime: "8 mins",
    difficulty: "Medium",
    dietary: ["Vegan", "Vegetarian", "Dairy-Free"],
    basePortionPersons: 1,
    baseCostPerPerson: 2.30,
    suggestedRetailPrice: 10.50,
    baseCalories: 510,
    baseMacros: { protein: 18, carbs: 62, fat: 22, fiber: 14 },

    budgetAlternative: {
      active: false,
      title: "Sesame-Sunflower Seed Tahini & Roasted Carrot Hummus",
      savingsPerPerson: 0.90,
      savingsPercent: "39%",
      newCostPerPerson: 1.40,
      description: "Blends sweet roasted carrots into the hummus to increase yield by 35% with a vibrant amber tone, and uses house-toasted sunflower-sesame blend instead of pure imported tahini.",
      replacedItems: [
        { original: "Pure Imported Lebanese Tahini ($1.10/portion)", replacedWith: "Toasted Sesame & Sunflower Butter ($0.45/portion)", reason: "Creamy, nutty, and 59% less expensive" }
      ]
    },

    calorieAlternative: {
      active: false,
      title: "Air-Crisped Falafel & Crisp Cucumber Dippers",
      calorieDrop: 220,
      newCalories: 290,
      newMacros: { protein: 15, carbs: 36, fat: 8, fiber: 12 },
      caloriePercent: "-43%",
      description: "Air-bakes the falafel balls with olive oil spray instead of deep oil frying (-140 kcal) and serves with chilled cucumber planks and bell pepper spears instead of white flour pita (-80 kcal).",
      replacedItems: [
        { original: "Deep-Fried Falafel in Canola Oil", replacedWith: "Air-Baked Herbed Falafel (crisped with olive oil mist)", calorieSaving: "-140 kcal" },
        { original: "Fluffy White Wheat Pita", replacedWith: "Crisp Persian Cucumber Spears & Carrot Planks", calorieSaving: "-80 kcal" }
      ]
    },

    veganOption: {
      active: false,
      title: "Naturally 100% Plant-Based",
      description: "Wholesome vegan chickpeas, herbs, tahini, and fresh produce.",
      replacedItems: []
    },

    ingredients: [
      { name: "Soaked Raw Chickpeas (herbed falafel base)", qtyPerPerson: 90, unit: "g soaked", cost: 0.40, category: "Legumes" },
      { name: "Velvety Tahini Hummus Spread", qtyPerPerson: 80, unit: "g spread", cost: 0.70, category: "Condiments", isReplaceable: true, replaceableType: "budget" },
      { name: "Warm Artisan Pita Flatbread", qtyPerPerson: 1, unit: "round pita", cost: 0.45, category: "Bakery", isReplaceable: true, replaceableType: "calorie" },
      { name: "Kalamata Olives & Pickled Sumac Onions", qtyPerPerson: 30, unit: "g blend", cost: 0.40, category: "Produce" },
      { name: "Fresh Parsley, Cilantro & Mint Herbs", qtyPerPerson: 20, unit: "g bunch", cost: 0.25, category: "Produce" },
      { name: "Cold-Pressed EVOO & Za'atar Spice", qtyPerPerson: 1, unit: "tablespoon", cost: 0.15, category: "Spices" }
    ],

    steps: [
      "Shape fresh falafel mix into 4 golf-ball sized rounds and deep-fry at 180°C (350°F) for 4 mins (or air-bake) until dark golden brown.",
      "Spoon velvety hummus onto the plate and use the back of a warm spoon to swipe an artistic cafe well.",
      "Drizzle extra virgin olive oil into the well and dust with za'atar spices.",
      "Place warm, fragrant falafels alongside the hummus.",
      "Arrange pickled sumac onions, kalamata olives, and warm sliced pita wedges.",
      "Garnish with fresh mint leaves and serve with cafe tahini drizzle on the side."
    ],

    reviews: [
      {
        id: "r8",
        author: "Farah Al-Mansoor",
        cafeName: "Olive & Fig Mezze Bar, Austin",
        rating: 5,
        date: "3 weeks ago",
        verifiedCafe: true,
        text: "The roasted carrot hummus idea expanded our batch yield tremendously. Bright orange color stands out in photos and customers rave about it!",
        photo: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80",
        helpfulCount: 16
      }
    ]
  }
];

// Pre-filled Cafe Pantry Staples for quick 1-click selection
const PREFILLED_PANTRY_STAPLES = [
  { name: "Avocados", category: "Produce", icon: "🥑" },
  { name: "Sourdough Bread", category: "Bakery", icon: "🍞" },
  { name: "Espresso Beans", category: "Coffee", icon: "☕" },
  { name: "Oat Milk", category: "Dairy/Plant", icon: "🥛" },
  { name: "Eggs", category: "Poultry", icon: "🥚" },
  { name: "Cremini Mushrooms", category: "Produce", icon: "🍄" },
  { name: "Feta / Ricotta", category: "Dairy", icon: "🧀" },
  { name: "Fettuccine / Pasta", category: "Grains", icon: "🍝" },
  { name: "Chicken Breast", category: "Poultry", icon: "🍗" },
  { name: "Fresh Basil & Pesto", category: "Herbs", icon: "🌿" },
  { name: "Turmeric & Spices", category: "Spices", icon: "✨" },
  { name: "Greek Yogurt / Curd", category: "Dairy", icon: "🥣" },
  { name: "Wild Berries / Acai", category: "Fruits", icon: "🫐" },
  { name: "Olive Oil / Garlic", category: "Pantry", icon: "🧄" },
  { name: "Ciabatta / Panini", category: "Bakery", icon: "🥪" },
  { name: "Cream Cheese", category: "Bakery", icon: "🍰" }
];

// Design Thinking Slides for Small Cafes & Restaurants
const DESIGN_THINKING_SLIDES = [
  {
    slideNumber: 1,
    stage: "Design Thinking Overview",
    title: "Solving the Small Cafe Profit & Nutrition Dilemma",
    subtitle: "A Human-Centered Culinary Operating System for Independent Food Operators",
    accentColor: "from-amber-500 to-orange-500",
    badge: "Stage 01: Context",
    icon: "compass",
    points: [
      {
        title: "The Reality of Small Cafes",
        desc: "Small cafes operate on razor-thin net margins (typically 3% to 7%). Ingredient volatility, food waste from rigid recipe sizes, and sudden dietary shifts threaten survival."
      },
      {
        title: "The Guest Dilemma",
        desc: "Modern cafe customers demand hyper-specific dining: lower calories, vegan options, clean ingredients, yet expect fast ticket turnaround and gourmet presentation."
      },
      {
        title: "The FlavorCraft Mission",
        desc: "Empower small independent cafes with algorithmic culinary engineering: portion scaling by person, smart ingredient cost-savers, and instant calorie cutters."
      }
    ],
    metric: { value: "68%", label: "Average Small Cafe Failure Rate in First 3 Years Due to Food Cost Leaks" }
  },
  {
    slideNumber: 2,
    stage: "Stage 1: Empathize",
    title: "Listening to Small Cafe Owners & Baristas",
    subtitle: "Deep ethnographic interviews across 35 independent cafes, cloud kitchens & bistros",
    accentColor: "from-blue-500 to-cyan-500",
    badge: "Stage 02: Empathy",
    icon: "users",
    points: [
      {
        title: "Persona: Chef-Owner Kanishka (32, Indie Cafe & Bistro Operator)",
        desc: "'I love culinary creativity, but tracking complex grams and ml during peak rush hours causes portion inconsistency. When avocado prices jump, my signature toast loses margin. FlavorCraft gives me instant person scaling and budget swaps.'"
      },
      {
        title: "Persona: Barista Dev (26, Specialty Coffee Bar)",
        desc: "'Customers ask: Can I get this iced latte with less sugar and fewer calories? I freeze up because recalculating the syrup and plant milk ratios on the fly slows down service.'"
      },
      {
        title: "Key Empathy Finding",
        desc: "Kitchen staff don't want complex ERP spreadsheets; they want visual recipe cards scaled directly to table covers (1 person, 4 persons, 20-person batch) with 1-click alternative swaps."
      }
    ],
    metric: { value: "32% Waste", label: "Average Kitchen Ingredient Spoilage from Fixed-Batch Prep" }
  },
  {
    slideNumber: 3,
    stage: "Stage 2: Define",
    title: "Core Problem Statements & HMW Questions",
    subtitle: "Framing the culinary challenges into actionable design challenges",
    accentColor: "from-emerald-500 to-teal-500",
    badge: "Stage 03: Define",
    icon: "target",
    points: [
      {
        title: "HMW #1: Scale Portions by Human Headcount?",
        desc: "How might we replace complex milliliters and grams with direct 'Number of Persons' scaling so cooks immediately know how much sourdough, eggs, and cheese to prep?"
      },
      {
        title: "HMW #2: Protect Margins Without Losing Gourmet Appeal?",
        desc: "How might we dynamically suggest affordable ingredient swaps (e.g. green pea blend for avocado, porcini butter for truffle oil) that preserve customer satisfaction while boosting margins by 40%?"
      },
      {
        title: "HMW #3: Satisfy Calorie & Dietary Demands Instantly?",
        desc: "How might we provide a 1-click 'Calorie Cutter' mode that tells kitchen staff how to slash 40% calories from the same recipe without compromising flavor?"
      }
    ],
    metric: { value: "28-32%", label: "Target Golden Food Cost % for High-Profit Small Cafes" }
  },
  {
    slideNumber: 4,
    stage: "Stage 3: Ideate",
    title: "Brainstorming Culinary Solutions & Architecture",
    subtitle: "Divergent brainstorming yielding three breakthrough cafe modules",
    accentColor: "from-purple-500 to-pink-500",
    badge: "Stage 04: Ideate",
    icon: "lightbulb",
    points: [
      {
        title: "Innovation 1: Dual-Layer Dynamic Recipe Engine",
        desc: "When a budget or calorie toggle is activated, both the Ingredient Bill of Materials AND the Chef Preparation steps automatically re-render with the replacement instructions."
      },
      {
        title: "Innovation 2: Person-Centric Yield Matrix",
        desc: "Instant portion multiplier for 1 person (dine-in guest), 2 persons (table order), 10 persons (rush hour prep), and 50 persons (catering order)."
      },
      {
        title: "Innovation 3: Cafe Financial Health Indicator",
        desc: "Real-time Gross Profit Margin % calculator, wholesale ingredient cost tracker, and estimated annual cafe savings display."
      }
    ],
    metric: { value: "1,420+", label: "Average Monthly Cost Saved per Cafe Using Smart Ingredient Swaps" }
  },
  {
    slideNumber: 5,
    stage: "Stage 4: Prototype",
    title: "FlavorCraft Cafe OS: The Interactive WebX Interface",
    subtitle: "Transforming design thinking wireframes into a high-utility, vibrant cafe system",
    accentColor: "from-amber-500 to-rose-500",
    badge: "Stage 05: Prototype",
    icon: "layout",
    points: [
      {
        title: "Vibrant & High-Contrast Visual UI",
        desc: "Bright appetizing colors, crisp photography, and dark/light modes suitable for both sunlit morning cafe counters and dim evening bistro lighting."
      },
      {
        title: "Sequential Recipe Hierarchy",
        desc: "Strictly renders Ingredients and Portions FIRST, followed by Chef Steps SECOND, ensuring kitchen line staff never mismeasure."
      },
      {
        title: "Interactive Review & Community Proof",
        desc: "Peer reviews verified by fellow cafe owners with real dish photos to build culinary confidence in budget substitutes."
      }
    ],
    metric: { value: "0ms Build", label: "Zero-Dependency Production Architecture for Any Browser" }
  },
  {
    slideNumber: 6,
    stage: "Stage 5: Test & Validate",
    title: "Pilot Results with 14 Independent Cafes & Bistros",
    subtitle: "Real-world validation measuring speed, margin improvements, and customer ratings",
    accentColor: "from-green-500 to-emerald-600",
    badge: "Stage 06: Test & Impact",
    icon: "check-circle",
    points: [
      {
        title: "Food Cost Reduced by 24.8%",
        desc: "Participating cafes using the Budget Saver swaps cut their weekly produce expenditure by nearly a quarter without customer complaints."
      },
      {
        title: "35% Faster Ticket Prep Speed",
        desc: "Cooks reported that person-scaled instructions eliminated mental math and confusion during busy peak rush hours."
      },
      {
        title: "42% Spike in Health-Conscious Orders",
        desc: "Introducing 'Calorie Cutter' alternatives gave cafes a distinct marketing advantage over local chains."
      }
    ],
    metric: { value: "98.4%", label: "Chef Satisfaction Score Across All Pilot Partner Cafes" }
  }
];
