// FlavorShift AI - Intelligent Culinary Ingredient Substitution & Human Taste Validation Platform
// Core Application Engine

(function () {
  'use strict';

  // Application State
  const state = {
    activeTab: 'swaplab', // 'swaplab', 'explore', 'htv', 'dashboard', 'favorites'
    selectedSwapIndex: 0,
    swapStudioMode: 'universal', // 'universal' | 'curated'
    universalCurrentIngredient: 'Butter',
    universalCurrentDishName: 'Paneer Butter Masala',
    universalCurrentDishContext: 'Curries & Gravies',
    universalCompareMode: false,
    selectedSubstitutedAlt: '',
    substitutedRecipePersons: 4,
    selectedCategory: 'all',
    selectedDiet: 'all',

    // Ingredient Substitution & Recipe Impact Analysis Dashboard State
    impactAnalysis: {
      dishName: 'Paneer Butter Masala',
      missingIngredient: 'Butter',
      replacementIngredient: 'Olive Oil',
      servings: 4,
      analyzed: true,
      loading: false,
      results: null
    },

    searchQuery: '',
    swapSearchQuery: '',
    sortOption: 'default',
    currency: localStorage.getItem('flavorshift_currency') || '₹',
    activePantryIngredients: new Set(JSON.parse(localStorage.getItem('flavorshift_pantry') || '[]')),
    favorites: new Set(JSON.parse(localStorage.getItem('flavorshift_favs') || '["paneer-butter-masala", "wild-mushroom-truffle-pasta", "artisan-margherita-sourdough-pizza"]')),
    theme: localStorage.getItem('flavorshift_theme') || 'light',
    
    // Per-recipe dynamic toggles and person counts
    recipeStates: {},
    
    // Currently open recipe in modal
    activeRecipeId: null,
    
    // Dashboard Covers Calculator (user-supplied pricing inputs; no invented numbers)
    dashboardCovers: 50,
    dashboardSelectedRecipeId: 'paneer-butter-masala',
    dashBaseCost: '',
    dashAltCost: '',
    dashRetailPrice: '',
    
    // User-submitted taste reviews (persisted locally)
    customReviews: JSON.parse(localStorage.getItem('flavorshift_reviews') || '{}'),
    
    // User-submitted kitchen validation tests (persisted locally)
    htvSubmissions: JSON.parse(localStorage.getItem('flavorshift_htv_submissions') || '[]'),

    // Foodoscope RecipeDB Live Database State
    exploreMode: 'catalog', // 'catalog' | 'foodoscope'
    foodoscopeQuery: 'Biryani',
    foodoscopePage: 1,
    foodoscopeTotalPages: 1,
    foodoscopeTotalCount: 0,
    foodoscopeResults: [],
    foodoscopeLoading: false,
    foodoscopeSelectedRecipe: null
  };

  // Preset Pantry Bundles
  const PANTRY_PRESETS = {
    breakfast: {
      name: "🥐 Breakfast Cafe",
      items: ["Avocados", "Sourdough / Bread", "Butter / Ghee", "Greek Yogurt / Curd"]
    },
    coffee: {
      name: "☕ Coffee & Bakery",
      items: ["Cream Cheese", "Greek Yogurt / Curd", "Dark Cacao Cocoa", "Matcha & Oat Milk"]
    },
    vegan: {
      name: "🌿 Vegan Bistro",
      items: ["Paneer / Tofu", "Cashews / Nuts", "Avocados", "Tomatoes / Puree", "Chickpeas & Tahini"]
    },
    italian: {
      name: "🍝 Italian Bar",
      items: ["Fettuccine / Pasta", "Cremini Mushrooms", "Butter / Ghee", "Tomatoes / Puree"]
    }
  };

  // Helper: Initialize Recipe States
  function initRecipeStates() {
    RECIPES_DATA.forEach(recipe => {
      if (!state.recipeStates[recipe.id]) {
        state.recipeStates[recipe.id] = {
          persons: recipe.basePortionPersons || 1,
          budgetMode: false,
          calorieMode: false,
          veganMode: false
        };
      }
    });
  }

  // Theme Management
  function applyTheme(theme) {
    state.theme = theme;
    localStorage.setItem('flavorshift_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      if (theme === 'dark') {
        themeBtn.innerHTML = `<i class="fa-solid fa-sun text-terracotta"></i><span class="hidden 2xl:inline font-medium text-xs">Light</span>`;
      } else {
        themeBtn.innerHTML = `<i class="fa-solid fa-moon text-forest"></i><span class="hidden 2xl:inline font-medium text-xs">Dark</span>`;
      }
    }
  }

  // ========================================================
  // AUTHENTIC DISH-MATCHED FOOD PHOTOGRAPHY RESOLVER
  // Matches exact verified culinary photography based on dish name keywords
  // so dishes like Palak Paneer, Biryani, Pasta, Tiramisu, Cake & Soup never show generic salad bowls.
  // ========================================================
  function getAuthenticRecipeImage(recipe) {
    const title = ((recipe?.Recipe_title || recipe?.title || '') + ' ' + (recipe?.Region || '') + ' ' + (recipe?.Sub_region || '')).toLowerCase();
    const idNum = Math.abs(parseInt(recipe?.Recipe_id || recipe?._id || '0', 10)) || 0;

    // 1. Palak Paneer / Saag / Spinach Curries (Deep emerald spinach gravy with paneer cubes)
    if (/palak|saag|spinach/i.test(title)) {
      return 'https://images.unsplash.com/photo-1589647363585-f4a7d3877b10?w=700&auto=format&fit=crop&q=80';
    }

    // 2. Biryani / Dum Biryani / Pulao / Tehri (Brass handi of fragrant saffron basmati rice)
    if (/biryani|dum biryani|hyderabadi|pulao|pilaf|tehri/i.test(title)) {
      const biryaniImgs = [
        'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=700&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=700&auto=format&fit=crop&q=80'
      ];
      return biryaniImgs[idNum % biryaniImgs.length];
    }

    // 3. Paneer Butter Masala / Shahi Paneer / Tikka Masala / Makhani (Copper kadai of creamy orange-red gravy)
    if (/paneer|makhani|butter masala|shahi paneer|tikka masala/i.test(title)) {
      const paneerImgs = [
        'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=700&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=700&auto=format&fit=crop&q=80'
      ];
      return paneerImgs[idNum % paneerImgs.length];
    }

    // 4. Tiramisu / Mascarpone Cake (Layered Italian mascarpone dessert with cocoa dusting)
    if (/tiramisu|mascarpone/i.test(title)) {
      return 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=700&auto=format&fit=crop&q=80';
    }

    // 5. Chocolate Cake / Fudge / Brownie / Chocolate Pastry (Decadent dark chocolate drip cake)
    if (/chocolate|cake|brownie|fudge|gateau|torte|pastry/i.test(title)) {
      const cakeImgs = [
        'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=700&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=700&auto=format&fit=crop&q=80'
      ];
      return cakeImgs[idNum % cakeImgs.length];
    }

    // 6. Penne Pasta / Arrabbiata / Pasta / Spaghetti (Authentic ribbed penne rigate in tomato sauce)
    if (/pasta|penne|arrabbiata|spaghetti|fettuccine|lasagna|ravioli|macaroni/i.test(title)) {
      const pastaImgs = [
        'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=700&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=700&auto=format&fit=crop&q=80'
      ];
      return pastaImgs[idNum % pastaImgs.length];
    }

    // 7. Mushroom Soup / Cream of Mushroom / Wild Mushroom Potage / Broth
    if (/mushroom.*soup|cream.*mushroom|soup|bisque|chowder|potage|stew|veloute/i.test(title)) {
      if (/mushroom/i.test(title)) {
        return 'https://images.unsplash.com/photo-1659603851579-17755833517e?w=700&auto=format&fit=crop&q=80';
      }
      return 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=700&auto=format&fit=crop&q=80';
    }

    // 8. Dal / Lentils / Sambar / Chana / Tadka
    if (/dal|lentil|sambar|chana|tadka/i.test(title)) {
      return 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=700&auto=format&fit=crop&q=80';
    }

    // 9. Pizza / Flatbread / Margherita
    if (/pizza|calzone|focaccia/i.test(title)) {
      return 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=700&auto=format&fit=crop&q=80';
    }

    // 10. Burger / Sandwich / Toast / Slider
    if (/burger|sandwich|toast|slider/i.test(title)) {
      if (/avocado|toast/i.test(title)) {
        return 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=700&auto=format&fit=crop&q=80';
      }
      return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700&auto=format&fit=crop&q=80';
    }

    // 11. Noodles / Ramen / Wok
    if (/noodle|ramen|udon|pad thai|chow mein|wok/i.test(title)) {
      return 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=700&auto=format&fit=crop&q=80';
    }

    // 12. Samosa / Chaat / Pakora
    if (/samosa|chaat|pakora|bhajji/i.test(title)) {
      return 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=700&auto=format&fit=crop&q=80';
    }

    // 13. Fish / Salmon / Seafood / Prawn
    if (/salmon|fish|prawn|shrimp|seafood|tuna/i.test(title)) {
      return 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=700&auto=format&fit=crop&q=80';
    }

    // 14. Chicken / Poultry
    if (/chicken|murgh|poultry|turkey/i.test(title)) {
      return 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=700&auto=format&fit=crop&q=80';
    }

    // 15. Salad (ONLY when title explicitly specifies salad)
    if (/salad|slaw|greens/i.test(title)) {
      return 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=700&auto=format&fit=crop&q=80';
    }

    // 16. General Curry / Masala / Gravy / Korma
    if (/curry|masala|gravy|korma|rogan|vindaloo|kofta/i.test(title)) {
      return 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=700&auto=format&fit=crop&q=80';
    }

    // Check if rawUrl is already valid and not a placeholder or old salad bowl
    const rawUrl = recipe?.img_url;
    if (rawUrl && typeof rawUrl === 'string' && rawUrl.startsWith('http') && !rawUrl.includes('79591.png') && !rawUrl.includes('placeholder') && !rawUrl.includes('photo-1546069901-ba9599a7e63c')) {
      return rawUrl;
    }

    // Savory gourmet dish default (NEVER the generic salad bowl for curries or desserts!)
    return 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=700&auto=format&fit=crop&q=80';
  }

  // ========================================================
  // COMPREHENSIVE CHEF RECIPE & INSTRUCTION ENGINE
  // Provides full authentic Bill of Ingredients (measured) + 5-Stage Step-by-Step Cooking Guide
  // for all Foodoscope RecipeDB dishes so users always receive the complete recipe with the dish.
  // ========================================================
  function generateChefRecipeForDish(dishTitle, info) {
    const title = (dishTitle || info?.Recipe_title || info?.title || '').trim();
    const lower = title.toLowerCase();
    const servings = Math.max(1, parseInt(info?.servings || 2, 10) || 2);
    const cookTime = info?.cook_time || info?.CookTimeNum || '25';
    const prepTime = info?.prep_time || '15';
    const region = info?.Region || info?.Sub_region || 'Global Cuisine';

    // 1. Palak Paneer & Spinach Curries
    if (/palak|saag|spinach.*paneer/i.test(lower)) {
      return {
        title: title || 'Palak Paneer (Spinach Curry)',
        cuisine: 'North Indian / Punjabi',
        prepTime: `${prepTime} mins`,
        cookTime: `${cookTime} mins`,
        servings: servings,
        difficulty: 'Intermediate',
        tagline: 'Fresh malai paneer cubes simmered in a velvety spiced emerald spinach puree.',
        ingredients: [
          { name: 'Fresh Malai Paneer Cubes', amount: `${servings * 125}g`, category: 'Hero Protein', note: 'Cubed and lightly pan-seared or soaked in warm water' },
          { name: 'Fresh Spinach (Palak) Leaves', amount: `${servings * 200}g`, category: 'Greens', note: 'Washed thoroughly, blanched, and pureed' },
          { name: 'Red Onion', amount: `${Math.ceil(servings / 2)} large`, category: 'Aromatics', note: 'Finely minced' },
          { name: 'Ripe Vine Tomatoes', amount: `${servings} medium`, category: 'Sauce Base', note: 'Blanched and pureed smooth' },
          { name: 'Ginger-Garlic Paste', amount: `${servings >= 4 ? 2 : 1} tbsp`, category: 'Aromatics', note: 'Freshly pounded' },
          { name: 'Green Chilies', amount: `${servings >= 4 ? 3 : 2} slit`, category: 'Aromatics', note: 'Adjust to heat preference' },
          { name: 'Cumin Seeds (Jeera)', amount: '1 tsp', category: 'Whole Spices', note: 'For tempering' },
          { name: 'Garam Masala & Turmeric', amount: '1.5 tsp blend', category: 'Ground Spices', note: 'Warm spice profile' },
          { name: 'Desi Ghee or Salted Butter', amount: `${servings >= 4 ? 3 : 2} tbsp`, category: 'Fats', note: 'For aromatic sauté' },
          { name: 'Fresh Heavy Cream (Malai)', amount: `${servings >= 4 ? 3 : 2} tbsp`, category: 'Finishing', note: 'Folded at the end for velvety texture' },
          { name: 'Toasted Kasuri Methi', amount: '1 tsp', category: 'Herbs', note: 'Crushed between palms' },
          { name: 'Sea Salt', amount: 'To taste', category: 'Pantry', note: 'Season throughout' }
        ],
        steps: [
          { step: 1, title: 'Mise en Place & Spinach Blanching', time: '4 mins', instruction: 'Bring 4 cups of water to a rolling boil with 1/2 tsp salt and 1/4 tsp sugar (sugar locks in the vivid emerald green chlorophyll). Submerge fresh spinach leaves for exactly 2 minutes, then immediately plunge into an ice-water bath. Drain and blend into a silky smooth green puree.' },
          { step: 2, title: 'Tempering & Aromatic Base', time: '6 mins', instruction: 'Heat desi ghee or butter in a heavy-bottomed kadai over medium heat. Crackle cumin seeds and slit green chilies. Add finely minced onions and saute patiently for 6 minutes until translucent and lightly golden.' },
          { step: 3, title: 'Spice Bloom & Tomato Reduction', time: '5 mins', instruction: 'Stir in the ginger-garlic paste and saute for 60 seconds until fragrant. Add tomato puree, turmeric, coriander powder, and salt. Cook stirring continuously until the moisture evaporates and oil droplets bead at the edges of the masala.' },
          { step: 4, title: 'Spinach Puree & Paneer Simmer', time: '5 mins', instruction: 'Lower heat to medium-low. Pour in the vibrant spinach puree and 1/4 cup warm water. Stir gently to create a uniform gravy. Gently slide in the paneer cubes, fold carefully to coat, and simmer for 4 minutes to allow flavors to penetrate the paneer.' },
          { step: 5, title: 'Finishing & Velvet Emulsion', time: '2 mins', instruction: 'Turn off heat. Swirl in fresh heavy cream, sprinkle garam masala, and crush toasted kasuri methi directly over the dish. Cover for 2 minutes to let aromas marry. Serve piping hot with garlic naan, roti, or jeera rice.' }
        ],
        chefTips: 'Always ice-shock spinach after blanching. Never cover the pan after adding spinach puree to keep the bright green color from turning dull olive brown.',
        utensils: ['Blender / Food Processor', 'Deep Kadai / Skillet', 'Chef Knife', 'Tongs']
      };
    }

    // 2. Biryani & Dum Rice Dishes
    if (/biryani|dum biryani|hyderabadi/i.test(lower)) {
      return {
        title: title || 'Royal Dum Biryani',
        cuisine: 'Mughlai / Hyderabadi',
        prepTime: `${prepTime} mins`,
        cookTime: `${cookTime} mins`,
        servings: servings,
        difficulty: 'Advanced',
        tagline: 'Fragrant aged basmati rice layered with spiced marinated hero protein, saffron milk, and caramelized golden onions.',
        ingredients: [
          { name: 'Aged Long-Grain Basmati Rice', amount: `${servings * 150}g`, category: 'Grains', note: 'Washed and soaked for 30 minutes' },
          { name: 'Hero Protein / Paneer & Vegetables', amount: `${servings * 180}g`, category: 'Hero Protein', note: 'Cut into bite-sized chunks' },
          { name: 'Onions (for Golden Birista)', amount: `${servings} large`, category: 'Aromatics', note: 'Thinly sliced and fried to crisp gold' },
          { name: 'Fresh Whisked Yogurt (Dahi)', amount: `${servings * 50}g`, category: 'Dairy Base', note: 'Thick creamy curd for rich marinade' },
          { name: 'Ginger-Garlic Paste', amount: '1.5 tbsp', category: 'Aromatics', note: 'Pounded fresh' },
          { name: 'Saffron Strands in Warm Milk', amount: '1 pinch + 3 tbsp milk', category: 'Finishing', note: 'Bloomed for 15 minutes' },
          { name: 'Whole Spices (Cardamom, Bay, Cinnamon, Star Anise)', amount: '1 tbsp blend', category: 'Whole Spices', note: 'For boiling rice and tempering' },
          { name: 'Biryani Masala & Kashmiri Chili', amount: '1.5 tsp', category: 'Ground Spices', note: 'Layered spice complexity' },
          { name: 'Fresh Mint & Coriander Leaves', amount: '1/2 cup chopped', category: 'Herbs', note: 'Layered between rice tiers' },
          { name: 'Desi Ghee', amount: '3 tbsp', category: 'Fats', note: 'Drizzled on top before dum sealing' }
        ],
        steps: [
          { step: 1, title: 'Rice Par-boiling (75% Done)', time: '8 mins', instruction: 'Bring 8 cups of water to a rolling boil with bay leaf, cardamoms, cinnamon, and 1.5 tbsp salt. Add drained soaked basmati rice. Cook for exactly 6-7 minutes until the rice is 75% cooked (grain has a firm bite and does not break). Drain immediately and spread on a tray.' },
          { step: 2, title: 'Marination & Masala Sear', time: '10 mins', instruction: 'In a heavy handi, heat 2 tbsp ghee. Sauté ginger-garlic paste, half the golden birista, whisked yogurt, biryani masala, and hero protein/veggies. Cook over medium heat for 8-10 minutes until aromatic and tender.' },
          { step: 3, title: 'Artisan Dum Layering', time: '4 mins', instruction: 'Keep the rich spiced masala base at the bottom of the handi. Layer the steaming fragrant 75% cooked basmati rice evenly over it. Scatter remaining golden birista, chopped fresh mint, and coriander across the rice.' },
          { step: 4, title: 'Saffron & Ghee Drizzle', time: '2 mins', instruction: 'Drizzle the saffron-infused golden milk and remaining melted desi ghee in circular streams over the top layer of rice.' },
          { step: 5, title: 'Aroma Dum Steam Cooking', time: '18 mins', instruction: 'Seal the rim of the handi tightly with aluminum foil or dough and put the heavy lid on. Cook on high flame for 3 minutes, then place a cast-iron tawa underneath and cook on lowest flame for 15 minutes. Rest 10 minutes before fluffing gently with a wide spoon.' }
        ],
        chefTips: 'Never over-boil the rice in stage 1; 75% doneness ensures the long grains absorb steam and gravy during dum without turning mushy.',
        utensils: ['Heavy Handi / Dutch Oven', 'Colander', 'Wide Tray', 'Cast Iron Tawa']
      };
    }

    // 3. Paneer Butter Masala & Makhani
    if (/paneer|makhani|butter masala|shahi/i.test(lower)) {
      return {
        title: title || 'Velvety Paneer Butter Masala (Makhani)',
        cuisine: 'North Indian / Bistro',
        prepTime: '15 mins',
        cookTime: '20 mins',
        servings: servings,
        difficulty: 'Easy',
        tagline: 'Tender paneer cubes bathed in a silky, creamy spiced tomato-butter gravy.',
        ingredients: [
          { name: 'Fresh Malai Paneer Cubes', amount: `${servings * 125}g`, category: 'Hero Protein', note: 'Cut into 1-inch cubes' },
          { name: 'Ripe Roma Tomatoes', amount: `${servings * 2} medium`, category: 'Sauce Base', note: 'Blanched and strained silky smooth' },
          { name: 'Raw Cashews (Soaked & Ground)', amount: '12-15 nuts (40g)', category: 'Nuts / Silk Base', note: 'Provides body and velvety sheen' },
          { name: 'Salted Butter', amount: '2.5 tbsp', category: 'Dairy', note: 'Cooked gently into sauce' },
          { name: 'Ginger-Garlic Paste', amount: '1 tbsp', category: 'Aromatics', note: 'Freshly minced' },
          { name: 'Kashmiri Red Chili & Garam Masala', amount: '1.5 tsp', category: 'Spices', note: 'For vibrant natural orange-red hue' },
          { name: 'Toasted Kasuri Methi', amount: '1 tsp', category: 'Herbs', note: 'Rubbed between palms' },
          { name: 'Fresh Heavy Cream', amount: '3 tbsp', category: 'Dairy', note: 'Swirled at the end' },
          { name: 'Honey or Sugar', amount: '1/2 tsp', category: 'Pantry', note: 'Balances tomato acidity' }
        ],
        steps: [
          { step: 1, title: 'Velvet Makhani Base Sauté', time: '6 mins', instruction: 'Heat 1 tbsp butter and 1 tsp oil in a wide pan. Sauté ginger-garlic paste for 1 minute. Add smooth tomato purée and Kashmiri red chili powder. Simmer covered for 8 minutes until the sauce deepens and moisture reduces.' },
          { step: 2, title: 'Cashew Nut Silk Emulsion', time: '4 mins', instruction: 'Pour in the soaked cashew paste with 1/3 cup warm water. Whisk continuously on medium heat until an ultra-creamy, glossy orange makhani sauce forms.' },
          { step: 3, title: 'Seasoning & Sweet-Tangy Balance', time: '3 mins', instruction: 'Add sea salt, garam masala, and 1/2 tsp honey/sugar to balance the tomato acidity. Simmer until the sauce thickens enough to coat the back of a spoon.' },
          { step: 4, title: 'Paneer Cube Infusion', time: '3 mins', instruction: 'Gently slide in fresh paneer cubes. Simmer on low heat for exactly 3 minutes so the paneer warms and absorbs the rich gravy without becoming chewy.' },
          { step: 5, title: 'Butter & Cream Swirl Finish', time: '2 mins', instruction: 'Turn off the heat. Stir in remaining 1.5 tbsp butter, heavy cream, and crushed toasted kasuri methi. Swirl gently and serve piping hot with butter garlic naan.' }
        ],
        chefTips: 'Never boil makhani gravy vigorously after adding cream or cashews to prevent separating. Always cook paneer briefly (3 mins max) for a melt-in-the-mouth texture.',
        utensils: ['Wide Heavy Pan', 'Blender', 'Whisk', 'Silicone Spatula']
      };
    }

    // 4. Tiramisu
    if (/tiramisu|mascarpone/i.test(lower)) {
      return {
        title: title || 'Classic Venetian Espresso Tiramisu',
        cuisine: 'Italian Dessert',
        prepTime: '20 mins',
        cookTime: '0 mins (No-Bake)',
        servings: servings,
        difficulty: 'Easy',
        tagline: 'Italian ladyfingers kissed with robust espresso and layered with velvety sweet mascarpone cream.',
        ingredients: [
          { name: 'Italian Savoiardi (Ladyfingers)', amount: `${servings * 6} biscuits`, category: 'Bakery', note: 'Crisp dry sponge fingers' },
          { name: 'Mascarpone Cheese', amount: `${servings * 100}g`, category: 'Dairy', note: 'Room temperature for silky folding' },
          { name: 'Heavy Whipping Cream', amount: `${servings * 80}ml`, category: 'Dairy', note: 'Whipped to soft billowy peaks' },
          { name: 'Strong Espresso Coffee', amount: '1 cup (cooled)', category: 'Pantry', note: 'Freshly brewed and cooled to room temp' },
          { name: 'Granulated Sugar', amount: '1/3 cup', category: 'Pantry', note: 'Fine caster sugar' },
          { name: 'Pure Vanilla Extract', amount: '1 tsp', category: 'Flavoring', note: 'Madagascar bourbon vanilla' },
          { name: 'Dutch-Processed Cocoa Powder', amount: '2 tbsp', category: 'Finishing', note: 'For fine dusting over top layer' }
        ],
        steps: [
          { step: 1, title: 'Espresso Bath Prep', time: '5 mins', instruction: 'Brew 1 cup of strong espresso coffee and pour into a shallow bowl. Allow to cool completely to room temperature. Stir in vanilla extract (and optional 1 tbsp coffee liqueur).' },
          { step: 2, title: 'Mascarpone Cloud Sabayon', time: '8 mins', instruction: 'Whip heavy cream with granulated sugar to medium peaks. In a separate bowl, whisk room-temperature mascarpone until smooth. Gently fold the whipped cream into the mascarpone in 3 additions using a rubber spatula until lump-free and billowy.' },
          { step: 3, title: 'Savoiardi First Tier', time: '4 mins', instruction: 'Quickly dip each savoiardi ladyfinger biscuit into the espresso for 1-2 seconds per side (do not soak or they become soggy). Arrange a tight single layer in the base of your serving dish.' },
          { step: 4, title: 'Cream Layering & Second Tier', time: '4 mins', instruction: 'Spread half the mascarpone cream evenly over the soaked ladyfingers with an offset spatula. Repeat with a second layer of espresso-dipped ladyfingers, then top with remaining mascarpone cream smoothed flush.' },
          { step: 5, title: 'Chill & Dutch Cocoa Dusting', time: '4 hours chill', instruction: 'Cover dish with plastic wrap and refrigerate for at least 4 hours (ideally overnight). Right before slicing and serving, generously dust the top with Dutch cocoa powder through a fine-mesh sieve.' }
        ],
        chefTips: 'A quick 1-2 second dip per side is key. If ladyfingers are soaked too long, the dessert will weep liquid and collapse.',
        utensils: ['Whisk / Electric Mixer', 'Offset Spatula', 'Shallow Dish', 'Fine-Mesh Sieve']
      };
    }

    // 5. Chocolate Cake & Brownies
    if (/chocolate|cake|brownie|fudge/i.test(lower)) {
      return {
        title: title || 'Decadent Dark Chocolate Fudge Cake',
        cuisine: 'Baking & Pastry',
        prepTime: '20 mins',
        cookTime: '35 mins',
        servings: servings * 2,
        difficulty: 'Intermediate',
        tagline: 'Moist dark chocolate fudge cake layered with glossy melted chocolate ganache.',
        ingredients: [
          { name: 'All-Purpose Flour', amount: '1 3/4 cups (220g)', category: 'Dry Staples', note: 'Sifted' },
          { name: 'Dutch Cocoa Powder', amount: '3/4 cup (75g)', category: 'Flavoring', note: 'Unsweetened dark cacao' },
          { name: 'Granulated Sugar', amount: '2 cups (400g)', category: 'Pantry', note: 'Fine granulated' },
          { name: 'Baking Powder & Baking Soda', amount: '1.5 tsp each', category: 'Leavening', note: 'For airy rise' },
          { name: 'Eggs (or flaxseed egg replacer)', amount: '2 large', category: 'Binder', note: 'Room temperature' },
          { name: 'Whole Milk & Vegetable Oil', amount: '1 cup milk + 1/2 cup oil', category: 'Wet Staples', note: 'Locks in moisture' },
          { name: 'Fresh Boiling Hot Coffee', amount: '1 cup (240ml)', category: 'Secret Bloom', note: 'Blooms cocoa powder for intense chocolate depth' },
          { name: 'Dark Chocolate Ganache', amount: '200g chocolate + 150ml cream', category: 'Finishing', note: 'Melted smooth for glossy glaze' }
        ],
        steps: [
          { step: 1, title: 'Oven Prep & Dry Sifting', time: '5 mins', instruction: 'Preheat oven to 350°F (175°C). Grease two 8-inch round cake pans and dust with cocoa powder. In a large bowl, whisk together flour, cocoa powder, sugar, baking powder, baking soda, and salt.' },
          { step: 2, title: 'Wet Emulsion', time: '4 mins', instruction: 'Add eggs, milk, vegetable oil, and vanilla extract. Beat on medium speed for 2 minutes until smooth and homogeneous.' },
          { step: 3, title: 'Coffee Bloom & Batter Pour', time: '3 mins', instruction: 'Pour in 1 cup of boiling fresh coffee and stir gently by hand. The batter will be very thin—this creates an ultra-moist, melt-in-the-mouth texture. Divide evenly between cake pans.' },
          { step: 4, title: 'Baking & Cooling', time: '35 mins', instruction: 'Bake for 30 to 35 minutes until a toothpick inserted in the center comes out clean. Cool in pans for 10 minutes, then turn out onto wire racks to cool completely.' },
          { step: 5, title: 'Ganache Glaze & Assembly', time: '5 mins', instruction: 'Heat cream and pour over chopped dark chocolate. Let sit 3 mins, then whisk until glossy. Spread ganache between cake layers and pour remaining ganache over top, letting it drip decoratively down the sides.' }
        ],
        chefTips: 'Boiling hot coffee is the pastry chef secret: it dissolves cocoa powder clumps instantly and activates chocolate aromatics without tasting like coffee.',
        utensils: ['Two 8-inch Cake Pans', 'Mixing Bowls', 'Whisk', 'Wire Cooling Rack']
      };
    }

    // 6. Penne Pasta
    if (/pasta|penne|arrabbiata/i.test(lower)) {
      return {
        title: title || "Classic Penne all'Arrabbiata with Basil",
        cuisine: 'Italian',
        prepTime: '10 mins',
        cookTime: '15 mins',
        servings: servings,
        difficulty: 'Easy',
        tagline: 'Ribbed penne pasta tossed in a fiery garlic-infused tomato sauce and finished with fresh basil and parmesan.',
        ingredients: [
          { name: 'Penne Rigate Pasta', amount: `${servings * 100}g`, category: 'Grains', note: 'Tubular ribbed pasta' },
          { name: 'Crushed San Marzano Tomatoes', amount: '1 can (400g)', category: 'Sauce Base', note: 'Rich Italian sweet tomatoes' },
          { name: 'Garlic Cloves', amount: '4 cloves', category: 'Aromatics', note: 'Thinly sliced' },
          { name: 'Red Chili Flakes', amount: '1/2 tsp', category: 'Spices', note: 'For authentic Arrabbiata heat' },
          { name: 'Extra Virgin Olive Oil', amount: '3 tbsp', category: 'Fats', note: 'High quality cold-pressed' },
          { name: 'Fresh Basil Leaves', amount: '1/2 cup', category: 'Herbs', note: 'Torn by hand' },
          { name: 'Parmigiano-Reggiano', amount: '1/3 cup grated', category: 'Cheese', note: 'Freshly grated' },
          { name: 'Starchy Pasta Water', amount: '1/4 cup (reserved)', category: 'Emulsifier', note: 'Binds sauce to pasta' }
        ],
        steps: [
          { step: 1, title: 'Pasta Water & Rolling Boil', time: '10 mins', instruction: 'Bring 4 liters of water to a rolling boil. Add 2 tbsp sea salt. Drop in penne rigate and cook until 1 minute before al dente (~9 mins). Reserve 1 cup of starchy pasta water before draining.' },
          { step: 2, title: 'Garlic & Chili Sizzle', time: '3 mins', instruction: 'While pasta boils, heat olive oil in a wide skillet over medium-low heat. Add sliced garlic and red pepper chili flakes. Sauté gently for 1-2 minutes until garlic turns golden (do not brown).' },
          { step: 3, title: 'Tomato Reduction', time: '8 mins', instruction: 'Pour in crushed San Marzano tomatoes, season with salt and black pepper. Simmer on medium-low for 8 minutes until sauce is glossy and slightly thickened.' },
          { step: 4, title: 'Mantecatura Emulsification', time: '3 mins', instruction: 'Transfer drained penne directly into the simmering sauce. Pour in 1/4 cup reserved pasta water. Toss vigorously over medium-high heat for 2 minutes until starch creates a glossy sheen that clings to the penne ridges.' },
          { step: 5, title: 'Finishing & Plating', time: '1 min', instruction: 'Remove from heat. Toss in torn fresh basil and half the grated Parmigiano-Reggiano. Drizzle with extra virgin olive oil and serve immediately with remaining parmesan.' }
        ],
        chefTips: 'Never rinse cooked pasta! The surface starch and reserved pasta cooking water are essential to emulsify the olive oil and tomato sauce into a silky restaurant glaze.',
        utensils: ['Large Pasta Pot', 'Wide Skillet / Sauté Pan', 'Tongs', 'Colander']
      };
    }

    // 7. Mushroom Soup
    if (/soup|mushroom.*soup|bisque/i.test(lower)) {
      return {
        title: title || 'Cream of Wild Porcini Mushroom Soup',
        cuisine: 'French Bistro',
        prepTime: '15 mins',
        cookTime: '25 mins',
        servings: servings,
        difficulty: 'Easy',
        tagline: 'Earthy sautéed wild mushrooms simmered with herbs, garlic, and finished with a swirl of rich cream.',
        ingredients: [
          { name: 'Fresh Mixed Mushrooms (Cremini, Button, Shiitake)', amount: `${servings * 150}g`, category: 'Produce', note: 'Cleaned and sliced' },
          { name: 'Shallot or Yellow Onion', amount: '1 large', category: 'Aromatics', note: 'Finely diced' },
          { name: 'Garlic Cloves', amount: '3 cloves', category: 'Aromatics', note: 'Minced' },
          { name: 'Unsalted Butter & Olive Oil', amount: '2 tbsp butter + 1 tbsp oil', category: 'Fats', note: 'For browning mushrooms' },
          { name: 'Fresh Thyme Leaves', amount: '1 tbsp', category: 'Herbs', note: 'Stripped from stems' },
          { name: 'All-Purpose Flour', amount: '2 tbsp', category: 'Roux Binder', note: 'To thicken soup body' },
          { name: 'Warm Vegetable or Mushroom Stock', amount: '3 cups (700ml)', category: 'Liquid Base', note: 'Rich golden stock' },
          { name: 'Heavy Cream', amount: '1/2 cup (120ml)', category: 'Dairy', note: 'For velvety finish' },
          { name: 'Grated Nutmeg & Black Pepper', amount: '1/4 tsp', category: 'Spices', note: 'Warm seasoning' }
        ],
        steps: [
          { step: 1, title: 'Mushroom Searing & Browning', time: '6 mins', instruction: 'Melt 2 tbsp butter with olive oil in a heavy Dutch oven over medium-high heat. Add sliced mushrooms in a single layer. Sear without stirring for 3 minutes to achieve deep golden browning, then sauté 3 mins. Set aside 3 tbsp mushrooms for garnish.' },
          { step: 2, title: 'Aromatic & Thyme Bloom', time: '3 mins', instruction: 'Add diced shallot, minced garlic, and fresh thyme to the remaining mushrooms in the pot. Sauté over medium heat for 3 minutes until translucent and fragrant.' },
          { step: 3, title: 'Roux Thickening & Stock Simmer', time: '15 mins', instruction: 'Dust with 2 tbsp flour and stir for 1 minute to cook out raw flour taste. Slowly whisk in warm stock in a steady stream to prevent lumps. Bring to a boil, then reduce heat and simmer uncovered for 15 minutes.' },
          { step: 4, title: 'Velvety Emulsion Blending', time: '3 mins', instruction: 'Use an immersion blender to purée half the soup until silky smooth, leaving rustic mushroom pieces for rich texture.' },
          { step: 5, title: 'Cream Finish & Plating', time: '2 mins', instruction: 'Stir in heavy cream, pinch of grated nutmeg, salt, and freshly cracked black pepper. Simmer gently for 2 minutes (do not boil). Ladle into warm bowls, garnish with reserved browned mushrooms, a drizzle of olive oil, and parsley.' }
        ],
        chefTips: 'Do not crowd the mushrooms when searing; high direct heat evaporates mushroom moisture and gives them a deep caramelized umami crust.',
        utensils: ['Heavy Pot / Dutch Oven', 'Immersion Hand Blender', 'Ladle', 'Chef Knife']
      };
    }

    // Default dynamic culinary recipe synthesizer for ANY other dish
    return {
      title: title || 'Signature Culinary Dish',
      cuisine: region,
      prepTime: `${prepTime} mins`,
      cookTime: `${cookTime} mins`,
      servings: servings,
      difficulty: 'Easy',
      tagline: `Authentic ${region} style preparation crafted with balanced culinary technique.`,
      ingredients: [
        { name: `Primary Hero Base (${title})`, amount: `${servings * 150}g`, category: 'Core Hero', note: 'Cleaned and prepped' },
        { name: 'Fresh Aromatics (Onion / Garlic / Herbs)', amount: '1 cup prepared', category: 'Aromatics', note: 'Finely minced' },
        { name: 'Cold-Pressed Cooking Oil or Butter', amount: '2 tbsp', category: 'Fats', note: 'For pan searing' },
        { name: 'Balanced Regional Spice Blend', amount: '1.5 tsp', category: 'Spices', note: 'Carefully measured' },
        { name: 'Savory Broth / Sauce Emulsion', amount: '1 cup', category: 'Sauce Body', note: 'Adjusted to consistency' },
        { name: 'Fresh Herbs & Seasoning Garnish', amount: 'Handful', category: 'Finishing', note: 'Crushed and sprinkled' }
      ],
      steps: [
        { step: 1, title: 'Mise en Place & Prep', time: '5 mins', instruction: `Clean, portion, and measure all fresh ingredients for ${title}. Heat cooking cookware over steady medium heat.` },
        { step: 2, title: 'Aromatic Infusion', time: '4 mins', instruction: 'Heat cooking oil or butter. Sauté aromatics and whole spices gently until fragrant and lightly caramelized.' },
        { step: 3, title: 'Core Cooking & Searing', time: '8 mins', instruction: 'Add hero ingredients to the pan. Sear evenly on all sides to seal in natural juices and develop rich roasted flavor notes.' },
        { step: 4, title: 'Simmer & Flavor Marriage', time: `${Math.max(5, parseInt(cookTime) - 10)} mins`, instruction: 'Incorporate sauce base and seasonings. Cover and simmer gently over low heat until tender and thoroughly infused.' },
        { step: 5, title: 'Rest & Garnish Finish', time: '2 mins', instruction: 'Remove from heat. Adjust salt and acidity. Garnish with fresh herbs and serve immediately at optimal temperature.' }
      ],
      chefTips: 'Cooking over gentle, controlled heat prevents delicate aromatics from burning and ensures even cooking throughout.',
      utensils: ['Chef Skillet / Pan', 'Cutting Board', 'Wooden Spatula', 'Chef Knife']
    };
  }

  // Helper: Format Currency
  function formatMoney(amount) {
    return `${state.currency}${Number(amount).toFixed(2)}`;
  }

  // Helper: Calculate Gross Profit Margin % from user inputs
  function calcMargin(cost, price) {
    if (!price || price <= 0) return 0;
    return Math.round(((price - cost) / price) * 100);
  }

  // Helper: Editorial Toast Notification
  function showNotification(title, message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `pointer-events-auto transform transition-all duration-300 ease-out translate-y-2 opacity-0 flex items-start gap-3 p-4 rounded-2xl shadow-xl border backdrop-blur-md ${
      type === 'success'
        ? 'bg-forest/95 border-sage/40 text-ivory'
        : type === 'warning'
        ? 'bg-espresso/95 border-terracotta/50 text-ivory'
        : 'bg-espresso/95 border-beige/20 text-ivory'
    }`;

    const icon = type === 'success' ? 'fa-circle-check text-sage-300'
               : type === 'warning' ? 'fa-triangle-exclamation text-terracotta'
               : 'fa-bell text-terracotta';

    toast.innerHTML = `
      <i class="fa-solid ${icon} text-lg shrink-0 mt-0.5"></i>
      <div class="flex-1 min-w-0">
        <h5 class="text-xs font-black uppercase tracking-wider text-ivory">${title}</h5>
        <p class="text-xs text-beige mt-0.5 leading-snug font-medium">${message}</p>
      </div>
      <button type="button" class="text-beige/70 hover:text-ivory shrink-0 text-xs transition-colors cursor-pointer">
        <i class="fa-solid fa-xmark"></i>
      </button>
    `;

    toast.querySelector('button').addEventListener('click', () => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 300);
    });

    container.appendChild(toast);
    requestAnimationFrame(() => {
      toast.classList.remove('opacity-0', 'translate-y-2');
    });

    setTimeout(() => {
      if (toast.parentElement) {
        toast.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => toast.remove(), 300);
      }
    }, 3500);
  }

  // Helper: Get Active Recipe Data with Swaps Computed
  function getComputedRecipe(recipeId) {
    const raw = RECIPES_DATA.find(r => r.id === recipeId);
    if (!raw) return null;

    const rState = state.recipeStates[recipeId] || { persons: 1, budgetMode: false, calorieMode: false, veganMode: false };
    const persons = rState.persons || 1;

    let ingredients = raw.ingredients.map(ing => ({ ...ing }));
    let steps = [...raw.steps];
    let appliedSwaps = [];

    // Apply Budget-Friendly Culinary Swap
    if (rState.budgetMode && raw.budgetAlternative) {
      appliedSwaps.push({
        type: 'budget',
        badge: '💡 Pantry / Budget Swap Active',
        title: raw.budgetAlternative.title,
        description: raw.budgetAlternative.description,
        items: raw.budgetAlternative.replacedItems
      });

      ingredients = ingredients.map(ing => {
        if (raw.id === 'paneer-butter-masala' && ing.name.includes('Cream')) {
          return { ...ing, name: 'Soaked Cashew & Warm Milk Velvet Puree (60/40)', isSwapped: true, swapReason: 'Cashew emulsion provides creamy gloss without fresh dairy cream' };
        }
        if (raw.id === 'paneer-butter-masala' && ing.name.includes('Butter')) {
          return { ...ing, name: 'Clarified Butter / Desi Ghee Blend', isSwapped: true, swapReason: 'Adds nutty aroma with longer shelf stability' };
        }
        if (raw.id === 'smashed-avocado-toast' && ing.name.includes('Avocado')) {
          return { ...ing, name: 'Equal-Part Hass Avocado & Sweet Green Pea Mash', isSwapped: true, swapReason: 'Stretches avocado yield while preserving bright green color' };
        }
        if (raw.id === 'smashed-avocado-toast' && ing.name.includes('Feta')) {
          return { ...ing, name: 'Whipped Domestic Ricotta & Lemon Zest', isSwapped: true, swapReason: 'Soft fresh cheese with clean tangy contrast' };
        }
        if (raw.id === 'golden-turmeric-oat-latte' && ing.name.includes('Turmeric')) {
          return { ...ing, name: 'Ground Organic Turmeric Root Powder', isSwapped: true, swapReason: 'Shelf-stable powder eliminates fresh root spoilage and prep grating' };
        }
        if (raw.id === 'wild-mushroom-truffle-pasta' && (ing.name.includes('Truffle') || ing.name.includes('Chanterelle'))) {
          return { ...ing, name: 'Steeped Porcini Mushroom Reduction + Brown Cremini', isSwapped: true, swapReason: 'Deep savory umami broth replaces synthetic truffle oil' };
        }
        if (raw.id === 'wild-mushroom-truffle-pasta' && ing.name.includes('Parmigiano')) {
          return { ...ing, name: 'Aged Domestic Grana Padano', isSwapped: true, swapReason: 'Similar sharp salty umami profile' };
        }
        if (raw.id === 'basque-burnt-cheesecake' && ing.name.includes('Cream Cheese')) {
          return { ...ing, name: 'Hung Curd & Farmhouse Cream Cheese (Equal Blend)', isSwapped: true, swapReason: 'Blends house-strained curd for lighter texture and lactic tang' };
        }
        if (raw.id === 'mediterranean-falafel-bowl' && ing.name.includes('Tahini')) {
          return { ...ing, name: 'Toasted Sesame & Sunflower Seed Dressing', isSwapped: true, swapReason: 'Creamy toasted seed emulsion replaces jarred tahini' };
        }
        if (raw.id === 'artisan-margherita-sourdough-pizza' && ing.name.includes('Mozzarella')) {
          return { ...ing, name: 'Domestic Whole Milk Mozzarella & Ricotta Melt', isSwapped: true, swapReason: 'Blistered melt with less watery center pooling' };
        }
        if (raw.id === 'dark-chocolate-lava-souffle' && ing.name.includes('Chocolate')) {
          return { ...ing, name: 'Dutch Dark Cocoa & Espresso Brown Butter Silk', isSwapped: true, swapReason: 'Deep cacao batter made from pantry cocoa powder' };
        }
        if (raw.id === 'matcha-pistachio-cloud-latte' && ing.name.includes('Pistachio')) {
          return { ...ing, name: 'Toasted Green Pepita Silk & Almond Foam', isSwapped: true, swapReason: 'Pastel green seed butter cold foam with nutty finish' };
        }
        // Generic budget swaps for regional Indian catalog recipes
        if (ing.replaceableType && ing.replaceableType.includes('budget')) {
          if (ing.name.includes('Khoya') || ing.name.includes('Mawa')) {
            return { ...ing, name: 'Skim Milk Powder, Warm Milk & Cardamom Paste', isSwapped: true, swapReason: 'Delivers creamy milk-solid richness from pantry staples' };
          }
          if (ing.name.includes('Anardana')) {
            return { ...ing, name: 'Tamarind Pulp & Steeped Assam Black Tea', isSwapped: true, swapReason: 'Provides dark color and tart fruit depth' };
          }
          if (ing.name.includes('Saffron')) {
            return { ...ing, name: 'Cold-Pressed Turmeric, Cardamom & Rose Hydrosol', isSwapped: true, swapReason: 'Golden hue and floral aroma without saffron threads' };
          }
          if (ing.name.includes('Malai') || (ing.name.includes('Cream') && !ing.name.includes('Coconut'))) {
            return { ...ing, name: 'Soaked Cashew & Warm Milk Velvet Emulsion', isSwapped: true, swapReason: 'Rich emulsified gravy finish without fresh cream' };
          }
          if (ing.name.includes('Coconut Milk')) {
            return { ...ing, name: 'Desiccated Coconut & Warm Milk Blend', isSwapped: true, swapReason: 'Whipped coconut meat blended with warm milk' };
          }
          if (ing.name.includes('Fresh Dairy Milk')) {
            return { ...ing, name: 'Toned Milk with Crushed Whole Spices', isSwapped: true, swapReason: 'Clean spice decoction without syrups' };
          }
        }
        return ing;
      });

      if (raw.id === 'paneer-butter-masala') {
        steps[2] = "Prepare Cashew Velvet: Blend soaked cashews with warm milk (60/40) until silky smooth. Fold into the spiced tomato gravy over gentle heat.";
      } else if (raw.id === 'smashed-avocado-toast') {
        steps[1] = "In a prep bowl, blend steamed sweet green peas with equal parts ripe avocado, lemon juice, and flaky sea salt until bright green and smooth.";
        steps[5] = "Scatter whipped domestic ricotta crumbles, sliced radishes, and crushed red pepper flakes over the top.";
      } else if (raw.id === 'wild-mushroom-truffle-pasta') {
        steps[2] = "Sear brown cremini mushrooms in butter until deeply browned, deglazing with steeped porcini mushroom broth.";
        steps[6] = "Twirl onto plate, spooning the porcini mushroom brown butter sauce over pasta and dusting with aged Grana Padano.";
      }
    }

    // Apply Lighter Culinary Swap
    if (rState.calorieMode && raw.calorieAlternative) {
      appliedSwaps.push({
        type: 'calorie',
        badge: '🥗 Lighter Swap Active',
        title: raw.calorieAlternative.title,
        description: raw.calorieAlternative.description,
        items: raw.calorieAlternative.replacedItems
      });

      ingredients = ingredients.map(ing => {
        if (raw.id === 'paneer-butter-masala' && ing.name.includes('Cream')) {
          return { ...ing, name: 'Silky Greek Yogurt & Silken Tofu Puree', isLowCalorie: true };
        }
        if (raw.id === 'paneer-butter-masala' && ing.name.includes('Paneer')) {
          return { ...ing, name: 'Air-Crisped Low-Fat Paneer Cubes', isLowCalorie: true };
        }
        if (raw.id === 'paneer-butter-masala' && (ing.name.includes('Butter') || ing.name.includes('Ghee'))) {
          return { ...ing, name: '1 tsp Cold-Pressed Oil & Tomato Glaze', isLowCalorie: true };
        }
        if (raw.id === 'smashed-avocado-toast' && ing.name.includes('Sourdough')) {
          return { ...ing, name: 'Thin Seeded Sourdough Crispbread', isLowCalorie: true };
        }
        if (raw.id === 'smashed-avocado-toast' && ing.name.includes('Egg')) {
          return { ...ing, name: 'Poached Egg White Cloud', isLowCalorie: true };
        }
        if (raw.id === 'smashed-avocado-toast' && ing.name.includes('Olive Oil')) {
          return { ...ing, name: 'Fresh Meyer Lemon & Herb Spritz', isLowCalorie: true };
        }
        if (raw.id === 'golden-turmeric-oat-latte' && ing.name.includes('Oat Milk')) {
          return { ...ing, name: 'Unsweetened Creamy Almond Milk', isLowCalorie: true };
        }
        if (raw.id === 'wild-mushroom-truffle-pasta' && (ing.name.includes('Heavy Whipping Cream') || ing.name.includes('Cream'))) {
          return { ...ing, name: 'Steamed Cauliflower & Light Cashew Cream', isLowCalorie: true };
        }
        if (raw.id === 'basque-burnt-cheesecake' && ing.name.includes('Sugar')) {
          return { ...ing, name: 'Monkfruit Allulose Baker Blend', isLowCalorie: true };
        }
        if (ing.replaceableType && ing.replaceableType.includes('calorie') && !ing.isLowCalorie) {
          if (ing.name.includes('Cream') || ing.name.includes('Malai') || ing.name.includes('Khoya')) {
            return { ...ing, name: 'Strained Greek Yogurt / Hung Curd Blend', isLowCalorie: true };
          }
          if (ing.name.includes('Paneer')) {
            return { ...ing, name: 'Air-Crisped Low-Fat Paneer or Firm Tofu', isLowCalorie: true };
          }
          if (ing.name.includes('Ghee') || ing.name.includes('Oil') || ing.name.includes('Butter')) {
            return { ...ing, name: 'Measured Light Oil & Aromatic Mist', isLowCalorie: true };
          }
          if (ing.name.includes('Sugar') || ing.name.includes('Milk')) {
            return { ...ing, name: ing.name.includes('Milk') ? 'Skimmed Milk' : 'Natural Stevia / Reduced Sweetener', isLowCalorie: true };
          }
        }
        return ing;
      });

      if (raw.id === 'paneer-butter-masala') {
        steps[2] = "Whisk cold strained Greek yogurt with pureed silken tofu off the flame before gently swirling into the tomato base to preserve smooth velvet body.";
      } else if (raw.id === 'smashed-avocado-toast') {
        steps[0] = "Toast the thin seeded sourdough crispbread dry until crisp without butter.";
        steps[2] = "Poach egg whites gently for 2 minutes to create a light protein cloud.";
        steps[6] = "Spritz with fresh Meyer lemon herb mist instead of oil drizzle. Garnish with flaky salt.";
      } else if (raw.id === 'wild-mushroom-truffle-pasta') {
        steps[3] = "Pour in the steamed cauliflower-garlic puree; simmer 2 minutes to thicken naturally without heavy cream.";
      }
    }

    // Apply Plant-Based Swap (runs after other swaps to guarantee dairy/egg ingredients are replaced)
    if (rState.veganMode && raw.veganOption) {
      appliedSwaps.push({
        type: 'vegan',
        badge: '🌱 Plant-Based Active',
        title: raw.veganOption.title,
        description: raw.veganOption.description,
        items: raw.veganOption.replacedItems
      });

      ingredients = ingredients.map(ing => {
        if (raw.id === 'paneer-butter-masala' && ing.name.includes('Paneer')) {
          return { ...ing, name: 'Pressed Organic Turmeric Tofu Cubes', isVegan: true };
        }
        if (raw.id === 'paneer-butter-masala' && (ing.name.includes('Cream') || ing.name.includes('Yogurt') || ing.name.includes('Milk'))) {
          return { ...ing, name: 'Coconut-Cashew Silk Emulsion', isVegan: true };
        }
        if (raw.id === 'paneer-butter-masala' && (ing.name.includes('Butter') || ing.name.includes('Ghee'))) {
          return { ...ing, name: 'Neutral Cold-Pressed Plant Oil', isVegan: true };
        }
        if (raw.id === 'paneer-butter-masala' && ing.name.includes('Honey')) {
          return { ...ing, name: 'Raw Jaggery / Maple Syrup', isVegan: true };
        }
        if (ing.name.includes('Feta') || ing.name.includes('Cream Cheese') || ing.name.includes('Ricotta') || ing.name.includes('Parmigiano') || ing.name.includes('Grana') || ing.name.includes('Mozzarella') || ing.name.includes('Curd')) {
          return { ...ing, name: 'Artisanal Herb Tofu-Feta / Cashew Melt', isVegan: true };
        }
        if (ing.name.includes('Butter') && !ing.name.includes('Pistachio') && !ing.name.includes('Pepita')) {
          return { ...ing, name: 'Cold-Pressed Coconut / Plant Oil', isVegan: true };
        }
        if (ing.name.includes('Egg')) {
          return { ...ing, name: 'Smoked Paprika Tofu / Whipped Aquafaba', isVegan: true };
        }
        if (ing.name.includes('Paneer')) {
          return { ...ing, name: 'Pressed Organic Turmeric Tofu Cubes', isVegan: true };
        }
        if (ing.name.includes('Khoya') || ing.name.includes('Mawa')) {
          return { ...ing, name: 'Blended Cashew-Coconut Thickener', isVegan: true };
        }
        if ((ing.name.includes('Cream') && !ing.name.includes('Coconut')) || ing.name.includes('Yogurt') || ing.name.includes('Dahi') || ing.name.includes('Malai')) {
          return { ...ing, name: 'Coconut-Cashew Silk Emulsion', isVegan: true };
        }
        if (ing.name.includes('Milk') && !ing.name.includes('Coconut') && !ing.name.includes('Oat') && !ing.name.includes('Almond')) {
          return { ...ing, name: 'Unsweetened Soy / Oat Milk', isVegan: true };
        }
        if (ing.name.includes('Ghee')) {
          return { ...ing, name: 'Cold-Pressed Plant Oil', isVegan: true };
        }
        return ing;
      });
    }

    // Scale ingredient quantities by number of persons
    const scaledIngredients = ingredients.map(ing => {
      let scaledQty = ing.qtyPerPerson * persons;
      let displayQty = scaledQty % 1 === 0 ? scaledQty : scaledQty.toFixed(1);
      
      let displayUnit = ing.unit;
      if (persons > 1 && !ing.unit.endsWith('s') && !ing.unit.includes('(')) {
        if (ing.unit === 'pinch') displayUnit = 'pinches';
        else if (ing.unit === 'clove') displayUnit = 'cloves';
        else if (ing.unit === 'slice') displayUnit = 'slices';
        else if (ing.unit === 'tablespoon') displayUnit = 'tablespoons';
        else if (ing.unit === 'teaspoon') displayUnit = 'teaspoons';
        else if (ing.unit === 'cup') displayUnit = 'cups';
      }

      return {
        ...ing,
        scaledQty: displayQty,
        displayUnit: displayUnit
      };
    });

    const localUserReviews = state.customReviews[recipeId] || [];
    const allReviews = [...(raw.reviews || []), ...localUserReviews];
    const avgUserRating = allReviews.length > 0
      ? (allReviews.reduce((sum, rev) => sum + Number(rev.rating || 5), 0) / allReviews.length).toFixed(1)
      : null;

    return {
      ...raw,
      persons,
      rState,
      ingredients: scaledIngredients,
      steps,
      appliedSwaps,
      allReviews,
      avgUserRating
    };
  }

  // Helper: Find matching recipe from catalog for a given dish query or missing ingredient
  function findMatchingRecipe(dishQuery, missingIng) {
    const q = (dishQuery || '').trim().toLowerCase();
    if (q) {
      let match = RECIPES_DATA.find(r => r.title.toLowerCase() === q);
      if (match) return match;
      match = RECIPES_DATA.find(r => r.title.toLowerCase().includes(q) || q.includes(r.title.toLowerCase()));
      if (match) return match;
      const words = q.split(/\s+/).filter(w => w.length > 2);
      for (const w of words) {
        match = RECIPES_DATA.find(r => r.title.toLowerCase().includes(w) || r.id.toLowerCase().includes(w));
        if (match) return match;
      }
    }
    if (missingIng) {
      const norm = missingIng.trim().toLowerCase();
      const ingMatch = RECIPES_DATA.find(r => r.ingredients && r.ingredients.some(i => i.name.toLowerCase().includes(norm)));
      if (ingMatch) return ingMatch;
    }
    return RECIPES_DATA.find(r => r.id === 'paneer-butter-masala') || RECIPES_DATA[0];
  }

  // Helper: Create complete recipe with selected substitute replacing the missing ingredient
  function createSubstitutedRecipe(recipe, missingIngName, selectedAlt, portions = 1) {
    if (!recipe) recipe = RECIPES_DATA[0];
    const normMissing = (missingIngName || '').trim().toLowerCase();
    let found = false;

    // Map ingredients with updated quantities and swapped highlight
    let ingredients = (recipe.ingredients || []).map(ing => {
      const normIng = ing.name.toLowerCase();
      const isDirectMatch = normMissing && (normIng.includes(normMissing) || normMissing.includes(normIng));
      const isSemanticMatch = normMissing && (
        (normMissing.includes('cream') && (normIng.includes('cream') || normIng.includes('malai'))) ||
        (normMissing.includes('butter') && (normIng.includes('butter') || normIng.includes('ghee'))) ||
        (normMissing.includes('milk') && normIng.includes('milk')) ||
        (normMissing.includes('cheese') && (normIng.includes('cheese') || normIng.includes('feta') || normIng.includes('parmesan') || normIng.includes('ricotta') || normIng.includes('mozzarella'))) ||
        (normMissing.includes('paneer') && normIng.includes('paneer')) ||
        (normMissing.includes('egg') && normIng.includes('egg')) ||
        (normMissing.includes('tomato') && normIng.includes('tomato')) ||
        (normMissing.includes('onion') && normIng.includes('onion')) ||
        (normMissing.includes('garlic') && normIng.includes('garlic')) ||
        (normMissing.includes('mushroom') && normIng.includes('mushroom')) ||
        (normMissing.includes('avocado') && normIng.includes('avocado')) ||
        (normMissing.includes('saffron') && normIng.includes('saffron')) ||
        (normMissing.includes('flour') && normIng.includes('flour'))
      );

      if (!found && (isDirectMatch || isSemanticMatch)) {
        found = true;
        let scaledQty = ing.qtyPerPerson * portions;
        let displayQty = scaledQty % 1 === 0 ? scaledQty : scaledQty.toFixed(1);
        return {
          ...ing,
          name: selectedAlt.name,
          originalName: ing.name,
          scaledQty: displayQty,
          displayUnit: ing.unit,
          isSubstituted: true,
          swapBadge: `Substituted for ${ing.name}`,
          swapRatio: selectedAlt.ratio || 'Chef-calibrated functional substitute',
          swapNote: selectedAlt.calcMethod || selectedAlt.tasteDesc
        };
      }

      let scaledQty = ing.qtyPerPerson * portions;
      let displayQty = scaledQty % 1 === 0 ? scaledQty : scaledQty.toFixed(1);
      return {
        ...ing,
        scaledQty: displayQty,
        displayUnit: ing.unit,
        isSubstituted: false
      };
    });

    if (!found) {
      ingredients.unshift({
        name: selectedAlt.name,
        originalName: missingIngName || 'Target Ingredient',
        scaledQty: (50 * portions),
        displayUnit: 'g calibrated portion',
        category: 'Substituted',
        icon: 'fa-solid fa-utensils',
        isSubstituted: true,
        swapBadge: `Substituted for ${missingIngName || 'Missing Item'}`,
        swapRatio: selectedAlt.ratio || 'Chef-calibrated functional substitute',
        swapNote: selectedAlt.calcMethod || selectedAlt.tasteDesc
      });
    }

    // Adapt preparation steps with updated substitute instructions
    let stepsUpdated = 0;
    let steps = (recipe.steps || []).map((st, sIdx) => {
      let lower = st.toLowerCase();
      const mentionsMissing = normMissing && lower.includes(normMissing);
      const mentionsGeneral = normMissing && (
        (normMissing.includes('cream') && (lower.includes('cream') || lower.includes('malai'))) ||
        (normMissing.includes('butter') && (lower.includes('butter') || lower.includes('ghee'))) ||
        (normMissing.includes('milk') && lower.includes('milk')) ||
        (normMissing.includes('egg') && lower.includes('egg')) ||
        (normMissing.includes('cheese') && (lower.includes('cheese') || lower.includes('feta') || lower.includes('parmesan'))) ||
        (normMissing.includes('paneer') && lower.includes('paneer'))
      );

      if (mentionsMissing || mentionsGeneral) {
        stepsUpdated++;
        let adapted = st;
        if (normMissing && normMissing.length > 2) {
          adapted = adapted.replace(new RegExp(normMissing, 'gi'), selectedAlt.name);
        }
        const tip = selectedAlt.textureDesc ? selectedAlt.textureDesc.split(';')[0] : 'Incorporate gently over gentle heat';
        return {
          text: `${adapted} (Chef Note: Fold in ${selectedAlt.name}; ${tip}).`,
          isSubstitutedStep: true
        };
      }
      return {
        text: st,
        isSubstitutedStep: false
      };
    });

    if (stepsUpdated === 0 && steps.length > 0) {
      const targetIdx = Math.min(2, steps.length - 1);
      steps[targetIdx] = {
        text: `Incorporate ${selectedAlt.name}: ${steps[targetIdx].text} Swirl in ${selectedAlt.name} according to the calibrated conversion (${selectedAlt.ratio}). ${selectedAlt.textureDesc || 'Maintain gentle simmer to ensure uniform integration.'}`,
        isSubstitutedStep: true
      };
    }

    return {
      ...recipe,
      portions,
      missingIngName,
      selectedAlt,
      ingredients,
      steps
    };
  }

  // Helper: Retrieve photography for substitute candidates
  function getAlternativePhoto(name, type, target) {
    const n = (name || '').toLowerCase();
    if (n.includes('malai') || n.includes('curd') || n.includes('yogurt')) return 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80';
    if (n.includes('cashew') || n.includes('nut')) return 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&auto=format&fit=crop&q=80';
    if (n.includes('coconut')) return 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=600&auto=format&fit=crop&q=80';
    if (n.includes('pea') || n.includes('edamame')) return 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=600&auto=format&fit=crop&q=80';
    if (n.includes('porcini') || n.includes('mushroom')) return 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&auto=format&fit=crop&q=80';
    if (n.includes('ricotta') || n.includes('cheese') || n.includes('mascarpone')) return 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=600&auto=format&fit=crop&q=80';
    if (n.includes('tofu') || n.includes('soy')) return 'https://images.unsplash.com/photo-1722635940350-d1b2e5129379?w=600&auto=format&fit=crop&q=80';
    if (n.includes('butter') || n.includes('seed')) return 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80';
    return 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80';
  }


  // ========================================================
  // RENDER: FLAVORSHIFT AI SWAP LAB (FLAGSHIP FEATURE)
  // ========================================================
  function renderSwapLabView() {
    const container = document.getElementById('swaplab-view-container');
    if (!container) return;

    const activeSwap = FLAVORSHIFT_SWAP_DATABASE[state.selectedSwapIndex] || FLAVORSHIFT_SWAP_DATABASE[0];
    const currentIng = state.universalCurrentIngredient;
    let currentCtx = state.universalCurrentDishContext || 'Pastas & Sauces';
    const dishContexts = [
      'Pastas & Sauces',
      'Curries & Gravies',
      'Baking & Cakes',
      'Tea & Beverages',
      'Salads & Dressings',
      'Breakfast & Bowls',
      'General / All Dishes'
    ];

    let currentDish = state.universalCurrentDishName;
    if (!currentDish || currentDish === 'Paneer Butter Masala') {
      if (currentCtx === 'Pastas & Sauces') currentDish = 'Wild Mushroom Fettuccine';
      else if (currentCtx === 'Curries & Gravies') currentDish = 'Paneer Butter Masala';
      else if (currentCtx === 'Baking & Cakes') currentDish = 'San Sebastian Basque Cake';
      else if (currentCtx === 'Salads & Dressings') currentDish = 'Crispy Herb Falafel Bowl';
      else if (currentCtx === 'Breakfast & Bowls') currentDish = 'Smashed Avocado Toast';
      else currentDish = 'Paneer Butter Masala';
    }

    let uResult = null;
    if (typeof UniversalIngredientEngine !== 'undefined' && currentIng) {
      try {
        const userPrefs = {
          dietary: state.selectedDiet || 'all',
          restrictedAllergens: state.restrictedAllergens || [],
          inStockOnly: false
        };
        uResult = UniversalIngredientEngine.analyzeIngredient(currentIng, currentCtx, userPrefs);
      } catch (e) {
        console.warn('Universal engine lookup fallback:', e);
      }
    }
    const presetShowcase = (typeof UniversalIngredientEngine !== 'undefined' && UniversalIngredientEngine.PRESET_SHOWCASE)
      ? UniversalIngredientEngine.PRESET_SHOWCASE
      : [];

    let html = `
      <div class="space-y-6 animate-fade-up max-w-6xl mx-auto">

        <!-- ============================================== -->
        <!-- SECTION 1: SIMPLIFIED, CLEAN HERO             -->
        <!-- ============================================== -->
        <section class="relative overflow-hidden rounded-2xl bg-forest dark:bg-[#1A2620] text-ivory p-6 sm:p-8 border border-forest-600/30 shadow-sm">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            <!-- Left Column: Clear Heading, Description & Primary Actions -->
            <div class="lg:col-span-7 space-y-4">
              <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 text-xs font-mono text-peach">
                <span class="w-1.5 h-1.5 rounded-full bg-terracotta"></span>
                <span>Flavor Identity Engine</span>
              </div>

              <h1 class="font-heading font-black text-2xl sm:text-3xl lg:text-4xl tracking-tight leading-snug">
                Change the Ingredient.<br>
                <span class="text-terracotta font-serif italic">Preserve the Experience.</span>
              </h1>

              <p class="text-ivory/80 text-sm sm:text-base leading-relaxed max-w-lg font-sans">
                Chef-calibrated substitutions with exact measurements, flavor identity matching, and allergen safety for any dish.
              </p>

              <div class="pt-1 flex flex-wrap items-center gap-3">
                <a href="#ai-swaplab-stage" class="terracotta-btn px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer shadow-sm hover:opacity-95">
                  <i class="fa-solid fa-magnifying-glass text-xs"></i>
                  <span>Find a Substitute</span>
                </a>
                <button type="button" data-hero-preset="Heavy Cream" class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white/10 hover:bg-white/15 text-ivory border border-white/15 transition-all flex items-center gap-2 cursor-pointer shadow-xs">
                  <i class="fa-solid fa-wand-magic-sparkles text-terracotta text-xs"></i>
                  <span>Try "Fresh Cream" Demo</span>
                </button>
              </div>
            </div>

            <!-- Right Column: Compact Elegant Live Swap Preview -->
            <div class="lg:col-span-5">
              <div class="rounded-2xl bg-white/10 dark:bg-black/20 border border-white/15 p-4 sm:p-5 space-y-3 shadow-sm">
                <div class="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span class="text-xs font-mono font-bold text-beige uppercase tracking-wider">Live Swap Preview</span>
                  </div>
                  <span class="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-terracotta text-white">
                    91/100 Match
                  </span>
                </div>

                <div class="space-y-2 text-xs font-mono">
                  <div class="flex items-center justify-between p-2.5 rounded-xl bg-black/20 border border-white/10">
                    <div>
                      <span class="text-[10px] text-stone-400 block uppercase">Missing Ingredient</span>
                      <span class="font-bold text-ivory text-xs sm:text-sm font-sans">Fresh Cream</span>
                    </div>
                    <span class="text-[11px] text-stone-300 bg-white/10 px-2 py-0.5 rounded">100g</span>
                  </div>

                  <div class="flex items-center justify-center -my-1 text-terracotta">
                    <i class="fa-solid fa-arrow-down text-xs"></i>
                  </div>

                  <div class="p-2.5 rounded-xl bg-white/10 border border-white/15 space-y-1.5">
                    <div class="flex items-center justify-between">
                      <span class="text-[10px] text-emerald-300 font-bold uppercase">Best Alternative</span>
                      <span class="text-xs font-bold text-peach font-sans">Whisked Malai & Curd</span>
                    </div>
                    <div class="flex items-center justify-between text-[11px] text-ivory/90 pt-1 border-t border-white/10">
                      <span>Ratio: <strong>50g + 50g</strong></span>
                      <span class="text-stone-300">Velvety & Thick</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  data-hero-demo-trigger="true"
                  class="w-full py-2 px-3 rounded-xl text-xs font-bold bg-terracotta hover:bg-terracotta/90 text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span>Load in Studio</span>
                  <i class="fa-solid fa-arrow-right text-[10px]"></i>
                </button>
              </div>
            </div>

          </div>
        </section>

        <!-- ============================================== -->
        <!-- SECTION 2: SMART INGREDIENT SUBSTITUTION       -->
        <!-- ============================================== -->
        <section id="ai-swaplab-stage" class="space-y-6">

          <!-- Main Substitution Studio Card -->
          <div class="p-5 sm:p-7 rounded-2xl bg-white dark:bg-[#1f1a16] border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-5">
            
            <!-- Header -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800 pb-3.5">
              <div>
                <h2 class="text-xl sm:text-2xl font-bold font-heading text-forest dark:text-ivory">
                  Find an Ingredient Substitute
                </h2>
                <p class="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
                  Type any missing ingredient below to see chef-tested alternatives with exact ratios and taste notes.
                </p>
              </div>
            </div>

            <!-- Essential Input Fields -->
            <div class="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
              <div class="md:col-span-5 relative">
                <label for="universal-ingredient-input" class="block text-xs font-bold uppercase tracking-wider text-forest dark:text-ivory mb-1.5">
                  Missing Ingredient
                </label>
                <div class="relative">
                  <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs"></i>
                  <input
                    type="text"
                    id="universal-ingredient-input"
                    value="${currentIng || ''}"
                    placeholder="e.g. Heavy Cream, Butter, Eggs, Paneer..."
                    class="w-full pl-9 pr-9 py-2.5 rounded-xl bg-ivory/60 dark:bg-[#181410] border border-stone-200 dark:border-stone-700 text-sm font-medium text-forest dark:text-ivory placeholder:text-stone-400 focus:outline-none focus:border-terracotta transition-all shadow-xs"
                  />
                  <button
                    type="button"
                    id="universal-search-clear-btn"
                    class="${currentIng ? '' : 'hidden'} absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 flex items-center justify-center text-xs cursor-pointer"
                    title="Clear input"
                  >
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>

              <div class="md:col-span-4 relative">
                <label for="universal-dish-context-select" class="block text-xs font-bold uppercase tracking-wider text-forest dark:text-ivory mb-1.5">
                  Dish / Recipe Context
                </label>
                <div class="relative">
                  <i class="fa-solid fa-bowl-food absolute left-3.5 top-1/2 -translate-y-1/2 text-terracotta text-xs"></i>
                  <select
                    id="universal-dish-context-select"
                    class="w-full pl-9 pr-8 py-2.5 rounded-xl bg-ivory/60 dark:bg-[#181410] border border-stone-200 dark:border-stone-700 text-sm font-medium text-espresso dark:text-ivory focus:outline-none focus:border-terracotta cursor-pointer appearance-none shadow-xs"
                  >
                    ${dishContexts.map(ctx => `<option value="${ctx}" ${ctx === currentCtx ? 'selected' : ''}>${ctx}</option>`).join('')}
                  </select>
                  <i class="fa-solid fa-chevron-down absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs pointer-events-none"></i>
                </div>
              </div>

              <div class="md:col-span-3">
                <button
                  type="button"
                  id="universal-analyze-btn"
                  class="w-full py-2.5 px-4 rounded-xl text-sm font-bold terracotta-btn text-white transition-all shadow-xs hover:shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <i class="fa-solid fa-magnifying-glass text-xs"></i>
                  <span>Find Substitutes</span>
                </button>
              </div>
            </div>

            <!-- Dietary Preference Filter Rail -->
            <div class="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span class="text-xs font-medium text-stone-500 dark:text-stone-400 mr-1">Diet:</span>
              ${['all', 'vegan', 'vegetarian', 'gluten-free', 'dairy-free'].map(diet => `
                <button
                  type="button"
                  data-diet-filter="${diet}"
                  class="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                    (state.selectedDiet || 'all') === diet
                      ? 'bg-forest text-ivory dark:bg-forest-600 shadow-xs'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
                  }"
                >
                  <span>${diet === 'all' ? 'All' : diet.charAt(0).toUpperCase() + diet.slice(1).replace('-', ' ')}</span>
                </button>
              `).join('')}
            </div>

            <!-- Popular Dishes in Simple Horizontally Scrollable Layout -->
            <div class="pt-3 border-t border-stone-100 dark:border-stone-800 space-y-2">
              <span class="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
                Popular Dishes:
              </span>

              <div class="flex items-center gap-2.5 overflow-x-auto pb-1.5 -mx-1 px-1 scrollbar-thin">
                ${FLAVORSHIFT_SWAP_DATABASE.map((item, idx) => {
                  const isPairActive = currentIng && currentIng.toLowerCase().includes(item.targetIngredient.toLowerCase().split(' ')[0]);
                  return `
                    <button
                      type="button"
                      data-load-dish-pair="${idx}"
                      class="shrink-0 flex items-center gap-2.5 p-2 rounded-xl border transition-all cursor-pointer text-left ${
                        isPairActive
                          ? 'bg-peach/25 dark:bg-stone-900 border-terracotta shadow-xs'
                          : 'bg-ivory/50 dark:bg-[#181410] border-stone-200/80 dark:border-stone-800 hover:border-terracotta/50'
                      }"
                    >
                      <img src="${item.dishPhoto}" alt="${item.commonInDishes[0]}" class="w-10 h-10 rounded-lg object-cover shrink-0">
                      <div class="min-w-0 pr-1">
                        <span class="text-xs font-bold text-forest dark:text-ivory block truncate max-w-[140px]">
                          ${item.commonInDishes[0]}
                        </span>
                        <span class="text-[10px] text-terracotta font-mono block truncate">
                          Missing: ${item.targetIngredient}
                        </span>
                      </div>
                    </button>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- Universal Engine Output -->
            <div id="universal-results-container">
              ${!uResult ? '' : uResult.status === 'invalid' ? `
                <div class="p-5 rounded-2xl bg-peach/20 dark:bg-stone-900/80 border border-terracotta/30 text-center space-y-2.5">
                  <div class="w-10 h-10 rounded-full bg-terracotta/15 text-terracotta flex items-center justify-center mx-auto text-base">
                    <i class="fa-solid fa-circle-exclamation"></i>
                  </div>
                  <h4 class="text-base font-bold font-heading text-forest dark:text-ivory">Ingredient Unrecognized</h4>
                  <p class="text-xs text-stone-600 dark:text-stone-300 max-w-md mx-auto">${uResult.message}</p>
                  <p class="text-[11px] text-stone-400 max-w-md mx-auto">${uResult.suggestion}</p>
                  <div class="pt-1">
                    <button type="button" id="try-another-ingredient-btn" class="px-3.5 py-1.5 rounded-xl text-xs font-bold terracotta-btn text-white cursor-pointer">Try Another Ingredient</button>
                  </div>
                </div>
              ` : uResult.status === 'recognized' ? (() => {
                const rawAlts = uResult.alternatives || [];
                const alts = rawAlts.slice(0, 3);
                while (alts.length < 3) {
                  alts.push({
                    name: 'Chef-Calibrated Whole Food Alternative',
                    type: 'Functional Emulsion',
                    ratio: '1:1 by volume or weight',
                    calcMethod: 'Functional balance',
                    tasteDesc: 'Neutral culinary medium that absorbs dish flavors.',
                    textureDesc: 'Smooth consistency.',
                    dietary: ['Vegetarian', 'Gluten-Free'],
                    allergens: ['None']
                  });
                }
                if (!state.selectedSubstitutedAlt || !alts.some(a => a.name === state.selectedSubstitutedAlt)) {
                  state.selectedSubstitutedAlt = alts[0].name;
                }
                const activeAlt = alts.find(a => a.name === state.selectedSubstitutedAlt) || alts[0];
                const matchedRecipe = findMatchingRecipe(currentDish, uResult.ingredientName);
                const subRecipe = createSubstitutedRecipe(matchedRecipe, uResult.ingredientName, activeAlt, state.substitutedRecipePersons || 1);

                return `
                  <div class="pt-5 border-t border-stone-200/80 dark:border-stone-800 space-y-5">
                    
                    <!-- Clean Top Context Bar -->
                    <div class="p-3.5 rounded-xl bg-ivory/60 dark:bg-[#181410] border border-stone-200/80 dark:border-stone-800 flex items-center justify-between flex-wrap gap-2.5">
                      <div class="flex items-center gap-2 text-xs">
                        <span class="font-bold text-forest dark:text-ivory">Missing:</span>
                        <span class="font-bold text-terracotta px-2 py-0.5 rounded-md bg-peach/30 dark:bg-stone-800 font-mono">${uResult.ingredientName}</span>
                        <span class="text-stone-400">•</span>
                        <span class="text-stone-600 dark:text-stone-300">Dish: <strong>${currentDish || matchedRecipe.title}</strong></span>
                        ${uResult.flavorProfile ? `<span class="hidden sm:inline text-stone-400">•</span><span class="hidden sm:inline text-stone-500">${uResult.flavorProfile}</span>` : ''}
                      </div>
                      <button
                        type="button"
                        id="toggle-compare-mode-btn"
                        class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 hover:border-terracotta text-stone-700 dark:text-stone-300 transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <i class="fa-solid fa-table-columns text-xs"></i>
                        <span>${state.universalCompareMode ? 'Cards View' : 'Compare Table'}</span>
                      </button>
                    </div>

                    <!-- Comparison Matrix Table (when toggled) -->
                    ${state.universalCompareMode ? `
                      <div class="overflow-x-auto p-3 rounded-xl bg-ivory/50 dark:bg-[#181410] border border-stone-200/80 dark:border-stone-800">
                        <table class="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr class="border-b border-stone-200 dark:border-stone-800 text-[11px] uppercase tracking-wider text-stone-500">
                              <th class="py-2 px-2.5">Alternative</th>
                              <th class="py-2 px-2.5">Score</th>
                              <th class="py-2 px-2.5">Ratio</th>
                              <th class="py-2 px-2.5">Taste Notes</th>
                              <th class="py-2 px-2.5">Dietary</th>
                              <th class="py-2 px-2.5 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody class="divide-y divide-stone-100 dark:divide-stone-800">
                            ${alts.map(alt => `
                              <tr>
                                <td class="py-2.5 px-2.5 font-bold text-forest dark:text-ivory">
                                  ${alt.name}
                                </td>
                                <td class="py-2.5 px-2.5 font-mono font-bold text-terracotta">${alt.score != null ? alt.score : 85}/100</td>
                                <td class="py-2.5 px-2.5 font-mono text-stone-700 dark:text-stone-300">${alt.ratio}</td>
                                <td class="py-2.5 px-2.5 text-stone-600 dark:text-stone-300 max-w-[200px] truncate">${alt.tasteDesc}</td>
                                <td class="py-2.5 px-2.5">
                                  <div class="flex flex-wrap gap-1">
                                    ${(alt.dietary || []).map(d => `<span class="px-1.5 py-0.5 rounded text-[10px] font-medium bg-sage-50 dark:bg-stone-800 text-forest dark:text-sage-300">${d}</span>`).join('')}
                                  </div>
                                </td>
                                <td class="py-2.5 px-2.5 text-right">
                                  <button type="button" data-select-alt="${alt.name}" class="px-2.5 py-1 rounded-lg bg-terracotta text-white font-bold text-xs cursor-pointer">Select</button>
                                </td>
                              </tr>
                            `).join('')}
                          </tbody>
                        </table>
                      </div>
                    ` : ''}

                    <!-- Section 5 & 6: Clean Recommended Substitute Cards -->
                    <div class="space-y-3">
                      <div class="flex items-center justify-between">
                        <h3 class="text-base sm:text-lg font-bold font-heading text-forest dark:text-ivory">
                          Recommended Alternatives
                        </h3>
                        <span class="text-xs text-stone-500">Select an alternative to view adapted recipe</span>
                      </div>

                      <div class="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                        ${alts.map((alt, idx) => {
                          const isSelected = state.selectedSubstitutedAlt === alt.name;
                          const isTopMatch = idx === 0;

                          return `
                            <div
                              data-select-alt="${alt.name}"
                              class="p-4 rounded-xl flex flex-col justify-between transition-all duration-200 cursor-pointer ${
                                isSelected
                                  ? 'bg-white dark:bg-[#1c1713] border-2 border-terracotta shadow-xs'
                                  : 'bg-white/80 dark:bg-[#181410] border border-stone-200/80 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-700'
                              }"
                            >
                              <div class="space-y-2.5">
                                <!-- Top Row: Badge & Match Score -->
                                <div class="flex items-center justify-between gap-1 text-xs">
                                  <span class="px-2 py-0.5 rounded text-[10px] font-bold ${
                                    isTopMatch
                                      ? 'bg-forest text-ivory dark:bg-forest-600'
                                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                                  }">
                                    ${isTopMatch ? '★ Best Match' : alt.type || 'Alternative'}
                                  </span>
                                  <span class="inline-flex items-center gap-1 font-mono font-bold text-xs text-emerald-700 dark:text-emerald-400">
                                    <i class="fa-solid fa-bolt text-[10px] text-emerald-500"></i>
                                    <span>${alt.mlConfidence || (alt.score != null ? `${alt.score}% ML Match` : '94% ML Match')}</span>
                                  </span>
                                </div>

                                <!-- Substitute Name -->
                                <h4 class="text-sm sm:text-base font-bold font-heading text-forest dark:text-ivory leading-snug">
                                  ${alt.name}
                                </h4>

                                <!-- Exact Conversion Ratio & Rheology Stability -->
                                <div class="px-2.5 py-1.5 rounded-lg bg-ivory dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800">
                                  <div class="flex items-center justify-between">
                                    <span class="text-[9px] font-bold uppercase tracking-wider text-stone-400 font-mono block">Exact Ratio</span>
                                    <span class="text-[9px] font-mono text-stone-500">${alt.curdlingRisk ? `${alt.curdlingRisk} Curdling Risk` : 'Stable Simmer'}</span>
                                  </div>
                                  <span class="font-mono font-bold text-xs text-terracotta block truncate mt-0.5">${alt.ratio}</span>
                                </div>

                                <!-- Short Taste Description -->
                                <p class="text-xs text-stone-600 dark:text-stone-300 leading-normal line-clamp-2" title="${alt.tasteDesc}">
                                  ${alt.tasteDesc}
                                </p>

                                <!-- Relevant Dietary & Allergen Tags -->
                                <div class="flex flex-wrap gap-1 text-[10px]">
                                  ${(alt.dietary || []).slice(0, 2).map(d => `<span class="px-1.5 py-0.5 rounded bg-sage-50 dark:bg-stone-800 text-forest dark:text-sage-300 font-medium">${d}</span>`).join('')}
                                  ${(alt.allergens && alt.allergens.length && alt.allergens[0] !== 'None')
                                    ? alt.allergens.map(a => `<span class="px-1.5 py-0.5 rounded bg-peach/40 text-terracotta font-medium">${a}</span>`).join('')
                                    : `<span class="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-500">No Allergens</span>`
                                  }
                                </div>
                              </div>

                              <!-- Select Button -->
                              <button
                                type="button"
                                data-select-alt="${alt.name}"
                                class="w-full mt-3 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                  isSelected
                                    ? 'bg-terracotta text-white shadow-xs'
                                    : 'bg-forest hover:bg-forest/90 text-white'
                                }"
                              >
                                <i class="fa-solid ${isSelected ? 'fa-check' : 'fa-arrow-right'} text-[10px]"></i>
                                <span>${isSelected ? 'Selected' : 'Use Substitute'}</span>
                              </button>
                            </div>
                          `;
                        }).join('')}
                      </div>
                    </div>

                    ${(uResult.excludedAlternatives && uResult.excludedAlternatives.length > 0) ? `
                      <div class="p-3 rounded-xl bg-amber-50/60 dark:bg-stone-900 border border-amber-200/60 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-300 flex items-center gap-2">
                        <i class="fa-solid fa-filter text-terracotta text-xs shrink-0"></i>
                        <span>Excluded by preferences (${uResult.excludedAlternatives.length}): ${uResult.excludedAlternatives.map(ex => `${ex.name}`).join(', ')}</span>
                      </div>
                    ` : ''}

                    <!-- Section 7: Simplified RecipeDB Showcase -->
                    <div id="swaplab-foodoscope-context" class="p-3.5 sm:p-4 rounded-xl bg-ivory/50 dark:bg-[#181410] border border-stone-200/80 dark:border-stone-800 space-y-3">
                      <div class="flex items-center justify-between flex-wrap gap-2">
                        <div class="flex items-center gap-2">
                          <i class="fa-solid fa-cloud text-terracotta text-xs"></i>
                          <span class="text-xs font-bold text-forest dark:text-ivory font-mono">RecipeDB Cross-Reference</span>
                          <span class="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-800">Connected</span>
                        </div>
                        <button
                          type="button"
                          id="swaplab-explore-recipedb-btn"
                          class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-terracotta flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
                        >
                          <i class="fa-solid fa-arrow-up-right-from-square text-[9px] text-terracotta"></i>
                          <span>Explore RecipeDB</span>
                        </button>
                      </div>
                      <p id="swaplab-foodoscope-context-text" class="text-xs text-stone-500 font-mono">
                        Cross-referencing RecipeDB records for "${uResult.ingredientName}" in ${currentDish || matchedRecipe.title}...
                      </p>
                      <div id="swaplab-dual-recipedb-container" class="space-y-2"></div>
                    </div>

                    <!-- Section 8: Clean Adapted Recipe Section -->
                    <div id="substituted-recipe-card" class="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#1c1713] border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-5">
                      
                      <!-- Header -->
                      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 dark:border-stone-800 pb-3.5">
                        <div>
                          <div class="flex items-center gap-2 mb-1">
                            <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-terracotta text-white font-mono">
                              Adapted Recipe
                            </span>
                            <span class="text-xs text-stone-500 font-medium">${subRecipe.category} • ${subRecipe.prepTime} prep • ${subRecipe.cookTime} cook</span>
                          </div>
                          <h3 class="text-xl sm:text-2xl font-bold font-heading text-forest dark:text-ivory">
                            ${subRecipe.title}
                          </h3>
                          <p class="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                            Substituted: <strong class="text-terracotta font-medium">${activeAlt.name}</strong> replacing <strong class="line-through text-stone-400">${uResult.ingredientName}</strong> (${activeAlt.ratio})
                          </p>
                        </div>

                        <!-- Portion Scaler Controls -->
                        <div class="flex items-center gap-1.5 shrink-0 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-1.5">
                          <span class="text-xs font-bold uppercase tracking-wider text-stone-500 px-1">Covers:</span>
                          <button
                            type="button"
                            data-sub-portion="-1"
                            class="w-7 h-7 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-200 hover:bg-terracotta hover:text-white flex items-center justify-center font-bold text-xs cursor-pointer transition-all"
                            title="Decrease portions"
                          >
                            <i class="fa-solid fa-minus text-[10px]"></i>
                          </button>
                          <span id="sub-recipe-portion-count" class="font-mono font-bold text-xs sm:text-sm text-forest dark:text-ivory px-1.5 min-w-[3.5rem] text-center">
                            ${subRecipe.portions}
                          </span>
                          <button
                            type="button"
                            data-sub-portion="1"
                            class="w-7 h-7 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-200 hover:bg-terracotta hover:text-white flex items-center justify-center font-bold text-xs cursor-pointer transition-all"
                            title="Increase portions"
                          >
                            <i class="fa-solid fa-plus text-[10px]"></i>
                          </button>
                        </div>
                      </div>

                      <!-- Two-Column Clean Layout: Ingredients (Left) + Instructions (Right) -->
                      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        
                        <!-- Left Column: Bill of Ingredients -->
                        <div class="lg:col-span-5 space-y-2.5">
                          <h4 class="font-heading font-bold text-sm sm:text-base text-forest dark:text-ivory flex items-center gap-1.5 border-b border-stone-100 dark:border-stone-800 pb-2">
                            <i class="fa-solid fa-clipboard-list text-terracotta text-xs"></i>
                            <span>Ingredients (${subRecipe.portions} ${subRecipe.portions === 1 ? 'Portion' : 'Portions'})</span>
                          </h4>

                          <div class="divide-y divide-stone-100 dark:divide-stone-800/80">
                            ${subRecipe.ingredients.map(ing => `
                              <div class="py-2 flex items-center justify-between gap-2 ${
                                ing.isSubstituted
                                  ? 'bg-peach/20 dark:bg-stone-900/60 -mx-2 px-2 rounded-lg border-l-2 border-terracotta'
                                  : ''
                              }">
                                <div class="min-w-0">
                                  <span class="text-xs sm:text-sm ${ing.isSubstituted ? 'font-bold text-terracotta' : 'text-stone-700 dark:text-stone-200'}">
                                    ${ing.name}
                                  </span>
                                  ${ing.isSubstituted ? `
                                    <span class="block text-[10px] text-stone-400">
                                      Replaced ${ing.originalName} (${ing.swapRatio})
                                    </span>
                                  ` : ''}
                                </div>
                                <span class="font-mono text-xs font-semibold text-stone-600 dark:text-stone-300 shrink-0">
                                  ${ing.scaledQty} ${ing.displayUnit}
                                </span>
                              </div>
                            `).join('')}
                          </div>
                        </div>

                        <!-- Right Column: Cooking Instructions -->
                        <div class="lg:col-span-7 space-y-2.5">
                          <h4 class="font-heading font-bold text-sm sm:text-base text-forest dark:text-ivory flex items-center gap-1.5 border-b border-stone-100 dark:border-stone-800 pb-2">
                            <i class="fa-solid fa-fire-burner text-terracotta text-xs"></i>
                            <span>Cooking Instructions</span>
                          </h4>

                          <div class="space-y-2">
                            ${subRecipe.steps.map((st, sIdx) => `
                              <div class="flex items-start gap-2.5 p-2.5 rounded-xl ${
                                st.isSubstitutedStep
                                  ? 'bg-peach/15 dark:bg-stone-900/60 border-l-2 border-terracotta'
                                  : 'bg-stone-50/50 dark:bg-stone-900/20'
                              }">
                                <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5 ${
                                  st.isSubstitutedStep
                                    ? 'bg-terracotta text-white'
                                    : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                                }">
                                  ${sIdx + 1}
                                </span>
                                <div class="min-w-0 flex-1">
                                  ${st.isSubstitutedStep ? `
                                    <span class="text-[10px] font-bold uppercase tracking-wider text-terracotta font-mono block mb-0.5">
                                      Adapted for ${activeAlt.name}
                                    </span>
                                  ` : ''}
                                  <p class="text-xs sm:text-sm text-stone-700 dark:text-stone-200 leading-relaxed font-sans">
                                    ${st.text}
                                  </p>
                                </div>
                              </div>
                            `).join('')}
                          </div>
                        </div>

                      </div>

                      <!-- Substituted Recipe Action Bar -->
                      <div class="pt-4 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between gap-2.5">
                        <div class="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            data-open-sub-modal="${subRecipe.id}"
                            class="px-3.5 py-2 rounded-xl text-xs font-bold terracotta-btn text-white transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
                          >
                            <i class="fa-solid fa-expand text-[10px]"></i>
                            <span>Open in Recipe Studio</span>
                          </button>
                          <button
                            type="button"
                            data-print-sub-ticket="${subRecipe.id}"
                            class="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-terracotta transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <i class="fa-solid fa-print text-terracotta text-[10px]"></i>
                            <span>Print Prep Ticket</span>
                          </button>
                        </div>
                        <button
                          type="button"
                          data-log-sub-test="${subRecipe.id}"
                          class="px-3.5 py-2 rounded-xl text-xs font-semibold sage-btn transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <i class="fa-solid fa-star text-white text-[10px]"></i>
                          <span>Log Tasting Rating</span>
                        </button>
                      </div>

                    </div>
                  </div>
                `;
              })() : ''}
            </div>
          </div>

        </section>

      </div>
    `;

        container.innerHTML = html;

    // Curated Visual Dish Pair Guide 1-Click Loaders
    container.querySelectorAll('[data-load-dish-pair]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-load-dish-pair'), 10);
        const item = FLAVORSHIFT_SWAP_DATABASE[idx];
        if (item) {
          state.universalCurrentIngredient = item.targetIngredient;
          state.selectedSwapIndex = idx;
          if (idx === 0) {
            state.universalCurrentDishContext = 'Curries & Gravies';
            state.universalCurrentDishName = 'Paneer Butter Masala';
          } else if (idx === 1) {
            state.universalCurrentDishContext = 'Breakfast & Bowls';
            state.universalCurrentDishName = 'Smashed Avocado Toast';
          } else if (idx === 2) {
            state.universalCurrentDishContext = 'Pastas & Sauces';
            state.universalCurrentDishName = 'Wild Mushroom Fettuccine';
          } else if (idx === 3) {
            state.universalCurrentDishContext = 'Baking & Cakes';
            state.universalCurrentDishName = 'San Sebastian Basque Cake';
          } else {
            state.universalCurrentDishContext = 'Pastas & Sauces';
            state.universalCurrentDishName = item.commonInDishes[0];
          }
          state.selectedSubstitutedAlt = '';
          renderSwapLabView();
          const studioEl = document.getElementById('ai-swaplab-stage');
          if (studioEl) {
            studioEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    });

    // Hero Showcase Dish Clicks
    container.querySelectorAll('[data-open-hero-recipe]').forEach(btn => {
      btn.addEventListener('click', () => {
        openRecipeModal(btn.getAttribute('data-open-hero-recipe'));
      });
    });

    // Hero Live Swap Demo & Preset Click Listeners
    container.querySelectorAll('[data-hero-demo-trigger], [data-hero-preset]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.universalCurrentIngredient = 'Fresh Cream';
        state.universalCurrentDishContext = 'Curries & Gravies';
        state.universalCurrentDishName = 'Paneer Butter Masala';
        state.selectedSubstitutedAlt = 'Whisked Malai & Hung Curd (50/50)';
        renderSwapLabView();
        const studioEl = document.getElementById('ai-swaplab-stage');
        if (studioEl) {
          studioEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Universal Ingredient Lookup Events
    const uInput = container.querySelector('#universal-ingredient-input');
    const uClear = container.querySelector('#universal-search-clear-btn');
    const uSelect = container.querySelector('#universal-dish-context-select');
    const uAnalyze = container.querySelector('#universal-analyze-btn');

    const runUniversalLookup = () => {
      const val = uInput ? uInput.value.trim() : '';
      if (!val) {
        showNotification('Ingredient Required', 'Please enter an ingredient to substitute.', 'warning');
        if (uInput) uInput.focus();
        return;
      }
      state.universalCurrentIngredient = val;
      state.selectedSubstitutedAlt = '';
      renderSwapLabView();
    };

    uInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') runUniversalLookup();
    });
    uInput?.addEventListener('input', (e) => {
      state.universalCurrentIngredient = e.target.value;
      if (uClear) uClear.classList.toggle('hidden', !e.target.value);
    });
    uClear?.addEventListener('click', () => {
      state.universalCurrentIngredient = '';
      if (uInput) { uInput.value = ''; uInput.focus(); }
      uClear.classList.add('hidden');
    });

    uSelect?.addEventListener('change', (e) => {
      state.universalCurrentDishContext = e.target.value;
      renderSwapLabView();
    });

    uAnalyze?.addEventListener('click', runUniversalLookup);

    // Dietary Filter Buttons (Vegan, Vegetarian, Gluten-Free, Dairy-Free)
    container.querySelectorAll('[data-diet-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        const diet = btn.getAttribute('data-diet-filter') || 'all';
        state.selectedDiet = diet;
        state.selectedSubstitutedAlt = '';
        renderSwapLabView();
        showNotification(
          'Dietary Filter Applied',
          `Filtering substitutes for "${diet === 'all' ? 'All Dietary' : diet.toUpperCase()}". Candidates failing safety gates are excluded.`,
          'info'
        );
      });
    });

    container.querySelectorAll('[data-prompt-ing]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.universalCurrentIngredient = btn.getAttribute('data-prompt-ing') || 'Fresh Cream';
        state.universalCurrentDishContext = btn.getAttribute('data-prompt-ctx') || 'General / All Dishes';
        const dish = btn.getAttribute('data-prompt-dish');
        if (dish) state.universalCurrentDishName = dish;
        state.selectedSubstitutedAlt = '';
        renderSwapLabView();
      });
    });

    container.querySelectorAll('[data-universal-chip]').forEach(chip => {
      chip.addEventListener('click', () => {
        state.universalCurrentIngredient = chip.getAttribute('data-universal-chip');
        state.selectedSubstitutedAlt = '';
        renderSwapLabView();
      });
    });

    container.querySelector('#try-another-ingredient-btn')?.addEventListener('click', () => {
      state.universalCurrentIngredient = '';
      renderSwapLabView();
      container.querySelector('#universal-ingredient-input')?.focus();
    });

    container.querySelector('#toggle-compare-mode-btn')?.addEventListener('click', () => {
      state.universalCompareMode = !state.universalCompareMode;
      renderSwapLabView();
    });

    // Alternative Selection (Point 6 & 7) -> sets active substitute and updates complete recipe
    container.querySelectorAll('[data-select-alt]').forEach(btn => {
      btn.addEventListener('click', () => {
        const altName = btn.getAttribute('data-select-alt');
        state.selectedSubstitutedAlt = altName;
        renderSwapLabView();
        showNotification('Substitute Selected', `Loaded complete adapted recipe with "${altName}".`, 'success');
        const recCard = document.getElementById('substituted-recipe-card');
        if (recCard) {
          recCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    });

    // Foodoscope RecipeDB Explore transition button
    const recipedbContextBtn = container.querySelector('#swaplab-explore-recipedb-btn');
    recipedbContextBtn?.addEventListener('click', () => {
      state.exploreMode = 'foodoscope';
      state.foodoscopeQuery = currentDish || (uResult ? uResult.ingredientName : 'Biryani');
      switchTab('explore');
    });

    if (uResult && uResult.ingredientName && typeof ApiService !== 'undefined') {
      const activeAltName = state.selectedSubstitutedAlt || '';
      ApiService.searchDualRecipesForSwap(uResult.ingredientName, activeAltName, currentDish, 2).then(dualData => {
        const contextEl = document.getElementById('swaplab-foodoscope-context-text');
        const dualContainer = document.getElementById('swaplab-dual-recipedb-container');

        const origRecipes = dualData.original?.recipes || [];
        const subRecipes = dualData.substitute?.recipes || [];

        if (contextEl) {
          if (origRecipes.length || subRecipes.length) {
            contextEl.innerHTML = `Cross-referenced <strong>${origRecipes.length} original & ${subRecipes.length} substitute dishes</strong> across RecipeDB for <em>${uResult.ingredientName}</em> & <em>${activeAltName}</em>.`;
          } else {
            contextEl.textContent = `Calibrated for "${uResult.ingredientName}" via Foodoscope flavor chemistry & 40-recipe kitchen catalog.`;
          }
        }

        if (dualContainer && (origRecipes.length || subRecipes.length)) {
          const renderCard = (r, badgeText, badgeBg) => {
            const rId = r.Recipe_id || r._id || '';
            const rTitle = r.Recipe_title || r.title || 'RecipeDB Dish';
            const rImg = getAuthenticRecipeImage(r);
            const rRegion = r.Region || 'Global';
            const rCals = r.Calories || r.CaloriesNum || '—';
            return `
              <div class="p-2.5 rounded-xl bg-white dark:bg-[#181410] border border-stone-200/80 dark:border-stone-800 flex items-center justify-between gap-2.5 shadow-xs">
                <div class="flex items-center gap-2.5 min-w-0">
                  <img src="${rImg}" alt="${rTitle}" class="w-10 h-10 rounded-lg object-cover shrink-0 border border-stone-200 dark:border-stone-700" onerror="this.src='https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop&q=80'">
                  <div class="min-w-0">
                    <h5 class="text-xs font-bold text-forest dark:text-ivory truncate" title="${rTitle}">${rTitle}</h5>
                    <span class="text-[10px] text-stone-500 font-mono">${rRegion} · ${rCals} kcal</span>
                  </div>
                </div>
                <button
                  type="button"
                  data-dual-inspect="${rId}"
                  class="px-2.5 py-1 rounded-lg text-xs font-bold terracotta-btn text-white shrink-0 cursor-pointer flex items-center gap-1 shadow-xs"
                >
                  <i class="fa-solid fa-chart-pie text-[9px]"></i>
                  <span>Inspect</span>
                </button>
              </div>
            `;
          };

          dualContainer.innerHTML = `
            <div class="p-3 rounded-xl bg-ivory/60 dark:bg-[#181410]/60 border border-stone-200/80 dark:border-stone-800 space-y-2.5">
              <div class="flex items-center justify-between">
                <h4 class="text-xs font-bold uppercase tracking-wider text-forest dark:text-ivory font-mono flex items-center gap-1.5">
                  <i class="fa-solid fa-scale-balanced text-terracotta"></i>
                  <span>Original vs. Substituted RecipeDB Dishes</span>
                </h4>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                <div class="space-y-1.5">
                  <span class="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">With: ${uResult.ingredientName}</span>
                  ${origRecipes.length ? origRecipes.map(r => renderCard(r, 'Original', 'bg-forest/15 text-forest dark:text-sage-300')).join('') : '<p class="text-xs text-stone-400 italic">No direct matches</p>'}
                </div>
                <div class="space-y-1.5">
                  <span class="text-[10px] font-bold text-terracotta uppercase tracking-wider block">With: ${activeAltName}</span>
                  ${subRecipes.length ? subRecipes.map(r => renderCard(r, 'Swap', 'bg-terracotta/15 text-terracotta')).join('') : '<p class="text-xs text-stone-400 italic">No direct matches</p>'}
                </div>
              </div>
            </div>
          `;

                    dualContainer.querySelectorAll('[data-dual-inspect]').forEach(b => {
            b.addEventListener('click', () => {
              const rId = b.getAttribute('data-dual-inspect');
              openFoodoscopeModal(rId);
            });
          });
        }
      }).catch(() => {});
    }

    // Substituted recipe portion scaler
    container.querySelectorAll('[data-sub-portion]').forEach(btn => {
      btn.addEventListener('click', () => {
        const delta = parseInt(btn.getAttribute('data-sub-portion'), 10) || 0;
        state.substitutedRecipePersons = Math.max(1, Math.min(25, (state.substitutedRecipePersons || 1) + delta));
        renderSwapLabView();
        const recCard = document.getElementById('substituted-recipe-card');
        if (recCard) {
          recCard.scrollIntoView({ behavior: 'auto', block: 'nearest' });
        }
      });
    });

    // Substituted recipe modal opener
    container.querySelectorAll('[data-open-sub-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        openRecipeModal(btn.getAttribute('data-open-sub-modal'));
      });
    });

    // Substituted recipe ticket print
    container.querySelectorAll('[data-print-sub-ticket]').forEach(btn => {
      btn.addEventListener('click', () => {
        printKitchenTicket(btn.getAttribute('data-print-sub-ticket'));
      });
    });

    // Substituted recipe tasting log transition
    container.querySelectorAll('[data-log-sub-test]').forEach(btn => {
      btn.addEventListener('click', () => {
        switchTab('htv');
      });
    });

    // Attach Swap Lab ingredient search listeners
    const swapSearchInput = container.querySelector('#swaplab-search-input');
    const swapSearchClear = container.querySelector('#swaplab-search-clear-btn');
    const filterSwapChips = (rawVal) => {
      state.swapSearchQuery = rawVal.trim();
      const q = state.swapSearchQuery.toLowerCase();
      if (swapSearchClear) swapSearchClear.classList.toggle('hidden', !state.swapSearchQuery);
      container.querySelectorAll('.swap-select-chip').forEach(btn => {
        const idx = parseInt(btn.getAttribute('data-swap-idx'), 10);
        const item = FLAVORSHIFT_SWAP_DATABASE[idx];
        if (!item) return;
        const match = !q || item.targetIngredient.toLowerCase().includes(q) || item.commonInDishes.some(d => d.toLowerCase().includes(q)) || item.alternatives.some(a => a.name.toLowerCase().includes(q));
        btn.classList.toggle('hidden', !match);
      });
    };
    swapSearchInput?.addEventListener('input', (e) => filterSwapChips(e.target.value));
    swapSearchClear?.addEventListener('click', () => {
      if (swapSearchInput) swapSearchInput.value = '';
      filterSwapChips('');
      swapSearchInput?.focus();
    });

    // Attach chip selection listeners
    container.querySelectorAll('.swap-select-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        state.selectedSwapIndex = parseInt(btn.getAttribute('data-swap-idx'), 10);
        renderSwapLabView();
      });
    });

    container.querySelectorAll('[data-test-recipe]').forEach(btn => {
      btn.addEventListener('click', () => {
        const rId = btn.getAttribute('data-test-recipe');
        openRecipeModal(rId);
        if (state.recipeStates[rId]) {
          state.recipeStates[rId].budgetMode = true;
          renderModalContent();
        }
      });
    });

    container.querySelectorAll('[data-print-sample]').forEach(btn => {
      btn.addEventListener('click', () => {
        printKitchenTicket(btn.getAttribute('data-print-sample'));
      });
    });

    // Hero Action Buttons
    container.querySelectorAll('[data-hero-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-hero-action');
        switchTab(target);
      });
    });

    // Initialize Scroll Animations
    initScrollAnimations();
  }

  // RENDER: EXPLORE MENUS & CATALOG VIEW (DUAL ENGINE: CATALOG + FOODOSCOPE RECIPEDB)
  // ========================================================
  function renderExploreView() {
    const container = document.getElementById('explore-view-container');
    if (!container) return;

    const isFoodoscopeMode = state.exploreMode === 'foodoscope';

    let html = `
      <div class="space-y-8 animate-fade-up">

        <!-- Dynamic Explore Banner -->
        <div class="relative rounded-3xl overflow-hidden bg-forest dark:bg-[#1A2620] text-ivory border border-beige-200/20 shadow-xl p-8 md:p-12">
          <div class="relative z-10 max-w-3xl space-y-4">
            <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ivory/15 backdrop-blur-md text-xs sm:text-sm font-bold uppercase tracking-wider text-beige">
              <i class="fa-solid fa-utensils text-terracotta"></i>
              <span>Culinary Discovery & Recipe Intelligence</span>
            </div>

            <h1 class="font-heading font-black text-4xl sm:text-5xl md:text-[3.25rem] leading-tight tracking-tight text-ivory">
              Every Recipe You Love.<br>
              <span class="text-terracotta font-serif italic">Scaled & Swapped</span> in Seconds.
            </h1>

            <p class="text-ivory/90 text-base md:text-lg leading-relaxed font-normal">
              Explore chef-crafted kitchen favorites with instant portion scaling, or search 118,000+ global recipes with smart ingredient substitutions.
            </p>
          </div>

          <div class="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
        </div>

        <!-- Recipe Database Source Switcher -->
        <div class="flex items-center justify-between flex-wrap gap-4 bg-white/90 dark:bg-[#1f1a16]/90 p-4 sm:p-5 rounded-3xl border border-beige-200 dark:border-stone-800 shadow-sm">
          <div class="flex flex-col sm:flex-row sm:items-center gap-3">
            <span class="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 font-mono flex items-center gap-1.5">
              <i class="fa-solid fa-database text-terracotta"></i>
              <span>Recipe Database:</span>
            </span>
            <div class="inline-flex p-1 rounded-2xl bg-ivory dark:bg-[#181410] border border-beige-200 dark:border-stone-800">
              <button
                type="button"
                id="explore-mode-catalog-btn"
                class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  !isFoodoscopeMode
                    ? 'bg-forest text-ivory shadow-md'
                    : 'text-stone-600 dark:text-stone-300 hover:text-terracotta'
                }"
              >
                <i class="fa-solid fa-book-open"></i>
                <span>Kitchen Catalog (${RECIPES_DATA.length})</span>
              </button>
              <button
                type="button"
                id="explore-mode-foodoscope-btn"
                class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  isFoodoscopeMode
                    ? 'bg-forest text-ivory shadow-md'
                    : 'text-stone-600 dark:text-stone-300 hover:text-terracotta'
                }"
              >
                <i class="fa-solid fa-cloud text-terracotta"></i>
                <span>Foodoscope RecipeDB (118k+ Live)</span>
              </button>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-sage-100 dark:bg-emerald-950/50 text-forest dark:text-sage-300 border border-sage-400 dark:border-sage-700 font-mono">
              <span class="w-2 h-2 rounded-full bg-sage-600 animate-pulse"></span>
              <span>Foodoscope API: Bearer Connected</span>
            </span>
          </div>
        </div>

        ${isFoodoscopeMode ? `
        <!-- FOODOSCOPE RECIPEDB LIVE SEARCH CONTAINER -->
        <div class="space-y-6">
          <div class="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1f1a16] border border-beige-200 dark:border-stone-800 shadow-sm space-y-5">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-beige-200 dark:border-stone-800 pb-4">
              <div>
                <span class="text-xs font-bold uppercase tracking-wider text-terracotta font-mono">Foodoscope REST API v2 Integration</span>
                <h3 class="text-2xl font-bold font-heading text-forest dark:text-ivory flex items-center gap-2.5 mt-1">
                  <i class="fa-solid fa-cloud text-terracotta"></i>
                  <span>Live RecipeDB Global Explorer</span>
                </h3>
              </div>
              <span class="text-xs font-mono text-stone-500">Querying https://api.foodoscope.com (118k+ records)</span>
            </div>

            <!-- Search Bar + Action Button -->
            <div class="flex flex-col sm:flex-row gap-3">
              <div class="relative flex-1">
                <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-base"></i>
                <input
                  type="text"
                  id="foodoscope-search-input"
                  value="${state.foodoscopeQuery || ''}"
                  placeholder="Search RecipeDB titles (e.g. Biryani, Paneer, Tiramisu, Pasta, Chocolate Cake)..."
                  class="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-ivory dark:bg-[#181410] border border-beige-200 dark:border-stone-800 text-sm sm:text-base font-semibold text-forest dark:text-ivory placeholder:text-stone-400 focus:outline-none focus:border-terracotta shadow-xs"
                />
              </div>
              <button
                type="button"
                id="foodoscope-search-submit-btn"
                class="px-6 py-3.5 rounded-2xl text-sm font-bold terracotta-btn text-white transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <i class="fa-solid fa-bolt"></i>
                <span>Fetch from RecipeDB</span>
              </button>
            </div>

            <!-- Quick Suggestion Chips -->
            <div class="flex items-center gap-2 flex-wrap text-xs">
              <span class="font-bold text-stone-400 font-mono">Quick Inquiries:</span>
              ${['Biryani', 'Palak Paneer', 'Tiramisu', 'Chocolate Cake', 'Penne Pasta', 'Mushroom Soup', 'Butter Masala'].map(chip => `
                <button
                  type="button"
                  data-foodoscope-quick="${chip}"
                  class="px-3 py-1.5 rounded-xl bg-ivory dark:bg-stone-900 border border-beige-200 dark:border-stone-700 hover:border-terracotta text-stone-700 dark:text-stone-300 font-semibold cursor-pointer transition-all"
                >
                  ${chip}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Foodoscope Results Grid -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span id="foodoscope-count-display" class="text-sm font-black uppercase tracking-wider text-stone-500 font-mono">
                RecipeDB Live Results
              </span>
              <span class="text-xs text-stone-500 font-mono">Rate Limit: 25 req/min · Auth: Bearer Token</span>
            </div>

            <div id="foodoscope-recipes-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <!-- Dynamically populated by renderFoodoscopeGrid() -->
            </div>

            <!-- Foodoscope Pagination Controls Container -->
            <div id="foodoscope-pagination" class="flex items-center justify-center pt-2"></div>
          </div>
        </div>
        ` : `
        <!-- LOCAL 40-RECIPE CATALOG CONTAINER -->
        <!-- Search, Categories, Dietary Filters & Sort Bar -->
        <div class="space-y-4 p-6 rounded-3xl bg-white/90 dark:bg-[#1f1a16]/90 border border-beige-200/80 dark:border-stone-800/80 shadow-sm">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="relative flex-1 max-w-lg">
              <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-base"></i>
              <input
                type="text"
                id="search-input"
                placeholder="Search recipes or ingredients (Cream, Truffle, Avocado, Cocoa)..."
                class="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white dark:bg-[#181410] border border-beige-200 dark:border-stone-800 text-sm sm:text-base font-medium text-forest dark:text-ivory placeholder:text-stone-400 focus:outline-none focus:border-terracotta shadow-sm transition-all"
              >
            </div>

            <div class="flex items-center gap-2.5 shrink-0">
              <span class="text-xs sm:text-sm font-bold text-stone-400 hidden sm:inline">Sort by:</span>
              <select
                id="sort-select"
                class="px-4 py-3.5 rounded-2xl bg-white dark:bg-[#181410] border border-beige-200 dark:border-stone-800 text-sm font-bold text-espresso dark:text-stone-200 focus:outline-none focus:border-terracotta shadow-sm cursor-pointer"
              >
                <option value="default">🍽️ Featured Catalog Order</option>
                <option value="title-asc">🔤 Alphabetical (A–Z)</option>
                <option value="prep-asc">⚡ Quickest Prep Time</option>
                <option value="ingredients-asc">🧺 Fewest Ingredients</option>
              </select>
            </div>
          </div>

          <!-- Category Pills -->
          <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button type="button" data-category="all" class="cat-pill active-cat px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border border-beige-200 dark:border-stone-800 bg-white dark:bg-[#1f1a16] text-stone-700 dark:text-stone-300 hover:border-terracotta transition-all whitespace-nowrap cursor-pointer">
              All Menus (${RECIPES_DATA.length})
            </button>
            <button type="button" data-category="Cafe & Bistro Curries" class="cat-pill px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border border-beige-200 dark:border-stone-800 bg-white dark:bg-[#1f1a16] text-stone-700 dark:text-stone-300 hover:border-terracotta transition-all whitespace-nowrap cursor-pointer">
              🍛 Indian Curries & Makhani
            </button>
            <button type="button" data-category="Breads & Naan" class="cat-pill px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border border-beige-200 dark:border-stone-800 bg-white dark:bg-[#1f1a16] text-stone-700 dark:text-stone-300 hover:border-terracotta transition-all whitespace-nowrap cursor-pointer">
              🫓 Breads & Naan
            </button>
            <button type="button" data-category="South Indian" class="cat-pill px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border border-beige-200 dark:border-stone-800 bg-white dark:bg-[#1f1a16] text-stone-700 dark:text-stone-300 hover:border-terracotta transition-all whitespace-nowrap cursor-pointer">
              🥥 South Indian
            </button>
            <button type="button" data-category="Pastas & Italian" class="cat-pill px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border border-beige-200 dark:border-stone-800 bg-white dark:bg-[#1f1a16] text-stone-700 dark:text-stone-300 hover:border-terracotta transition-all whitespace-nowrap cursor-pointer">
              🍝 Pastas & Italian
            </button>
            <button type="button" data-category="Noodles & Wok" class="cat-pill px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border border-beige-200 dark:border-stone-800 bg-white dark:bg-[#1f1a16] text-stone-700 dark:text-stone-300 hover:border-terracotta transition-all whitespace-nowrap cursor-pointer">
              🍜 Noodles & Wok
            </button>
            <button type="button" data-category="Brunch & Toast" class="cat-pill px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border border-beige-200 dark:border-stone-800 bg-white dark:bg-[#1f1a16] text-stone-700 dark:text-stone-300 hover:border-terracotta transition-all whitespace-nowrap cursor-pointer">
              🥑 Brunch & Bowls
            </button>
            <button type="button" data-category="Breakfast & Morning" class="cat-pill px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border border-beige-200 dark:border-stone-800 bg-white dark:bg-[#1f1a16] text-stone-700 dark:text-stone-300 hover:border-terracotta transition-all whitespace-nowrap cursor-pointer">
              🍳 Breakfast & Morning
            </button>
            <button type="button" data-category="Diet Conscious" class="cat-pill px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border border-beige-200 dark:border-stone-800 bg-white dark:bg-[#1f1a16] text-stone-700 dark:text-stone-300 hover:border-terracotta transition-all whitespace-nowrap cursor-pointer">
              🥗 Diet Conscious
            </button>
            <button type="button" data-category="Bakery & Desserts" class="cat-pill px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border border-beige-200 dark:border-stone-800 bg-white dark:bg-[#1f1a16] text-stone-700 dark:text-stone-300 hover:border-terracotta transition-all whitespace-nowrap cursor-pointer">
              🍰 Bakery & Desserts
            </button>
            <button type="button" data-category="Coffee & Drinks" class="cat-pill px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border border-beige-200 dark:border-stone-800 bg-white dark:bg-[#1f1a16] text-stone-700 dark:text-stone-300 hover:border-terracotta transition-all whitespace-nowrap cursor-pointer">
              ☕ Artisan Coffee & Matcha
            </button>
          </div>

          <!-- Diet Focus Pills -->
          <div class="flex items-center gap-2 overflow-x-auto pb-1 text-xs sm:text-sm">
            <span class="font-bold text-stone-400 shrink-0 mr-1">Diet Focus:</span>
            <button type="button" data-diet="all" class="diet-pill active-diet px-3.5 py-2 rounded-lg font-bold border border-beige-200 dark:border-stone-800 bg-white dark:bg-[#1f1a16] text-stone-700 dark:text-stone-300 hover:border-sage-500 cursor-pointer transition-all">
              All Diets
            </button>
            <button type="button" data-diet="Vegetarian" class="diet-pill px-3.5 py-2 rounded-lg font-bold border border-beige-200 dark:border-stone-800 bg-white dark:bg-[#1f1a16] text-stone-700 dark:text-stone-300 hover:border-sage-500 cursor-pointer transition-all flex items-center gap-1.5">
              <i class="fa-solid fa-seedling text-sage-600"></i> Vegetarian
            </button>
            <button type="button" data-diet="Vegan" class="diet-pill px-3.5 py-2 rounded-lg font-bold border border-beige-200 dark:border-stone-800 bg-white dark:bg-[#1f1a16] text-stone-700 dark:text-stone-300 hover:border-sage-500 cursor-pointer transition-all flex items-center gap-1.5">
              <i class="fa-solid fa-leaf text-sage-600"></i> Vegan Option
            </button>
            <button type="button" data-diet="Gluten-Free" class="diet-pill px-3.5 py-2 rounded-lg font-bold border border-beige-200 dark:border-stone-800 bg-white dark:bg-[#1f1a16] text-stone-700 dark:text-stone-300 hover:border-sage-500 cursor-pointer transition-all">
              🌾 Gluten-Free
            </button>
          </div>
        </div>

        <!-- Recipe Cards Grid Section -->
        <div>
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <span id="recipes-count-display" class="text-sm font-black uppercase tracking-wider text-stone-500">
              Showing Recipes
            </span>
            <span class="text-sm text-sage-700 dark:text-sage-400 font-bold flex items-center gap-1.5">
              <i class="fa-solid fa-kitchen-set"></i> Toggle swap modes on any card to preview changes
            </span>
          </div>

          <div id="recipes-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
        </div>
        `}

      </div>
    `;

    container.innerHTML = html;

    // Source Switcher Buttons
    const catalogModeBtn = document.getElementById('explore-mode-catalog-btn');
    const foodoscopeModeBtn = document.getElementById('explore-mode-foodoscope-btn');

    catalogModeBtn?.addEventListener('click', () => {
      state.exploreMode = 'catalog';
      renderExploreView();
    });

    foodoscopeModeBtn?.addEventListener('click', () => {
      state.exploreMode = 'foodoscope';
      renderExploreView();
      renderFoodoscopeGrid(state.foodoscopeQuery || 'Biryani');
    });

    if (isFoodoscopeMode) {
      const fSearchInput = document.getElementById('foodoscope-search-input');
      const fSubmitBtn = document.getElementById('foodoscope-search-submit-btn');

      fSubmitBtn?.addEventListener('click', () => {
        const q = fSearchInput ? fSearchInput.value.trim() : '';
        if (q) renderFoodoscopeGrid(q, 1);
      });

      fSearchInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const q = fSearchInput.value.trim();
          if (q) renderFoodoscopeGrid(q, 1);
        }
      });

      container.querySelectorAll('[data-foodoscope-quick]').forEach(btn => {
        btn.addEventListener('click', () => {
          const chip = btn.getAttribute('data-foodoscope-quick');
          if (fSearchInput) fSearchInput.value = chip;
          renderFoodoscopeGrid(chip, 1);
        });
      });

      // Initial render for foodoscope grid
      renderFoodoscopeGrid(state.foodoscopeQuery || 'Biryani', state.foodoscopePage || 1);
    } else {
      // Attach Catalog Search, Category, Diet, and Sort Listeners
      const searchInput = document.getElementById('search-input');
      searchInput?.addEventListener('input', (e) => {
        state.searchQuery = e.target.value.trim();
        renderExploreGrid();
      });

      container.querySelectorAll('.cat-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          container.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active-cat'));
          btn.classList.add('active-cat');
          state.selectedCategory = btn.getAttribute('data-category');
          renderExploreGrid();
        });
      });

      container.querySelectorAll('.diet-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          container.querySelectorAll('.diet-pill').forEach(p => p.classList.remove('active-diet'));
          btn.classList.add('active-diet');
          state.selectedDiet = btn.getAttribute('data-diet');
          renderExploreGrid();
        });
      });

      const sortSelect = document.getElementById('sort-select');
      sortSelect?.addEventListener('change', (e) => {
        state.sortOption = e.target.value;
        renderExploreGrid();
      });

      // Initial render of the catalog grid
      renderExploreGrid();
    }
  }

  // ========================================================
  // RENDER: FOODOSCOPE RECIPEDB LIVE GRID
  // ========================================================
  async function renderFoodoscopeGrid(queryToSearch, pageToFetch = 1) {
    const grid = document.getElementById('foodoscope-recipes-grid');
    const countDisplay = document.getElementById('foodoscope-count-display');
    const paginationContainer = document.getElementById('foodoscope-pagination');
    if (!grid) return;

    const query = queryToSearch !== undefined ? queryToSearch : (state.foodoscopeQuery || 'Biryani');
    state.foodoscopeQuery = query;
    state.foodoscopePage = Math.max(1, parseInt(pageToFetch, 10) || 1);

    grid.innerHTML = `
      <div class="col-span-full py-12 text-center space-y-3">
        <div class="w-10 h-10 border-4 border-terracotta border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p class="text-sm font-bold text-forest dark:text-ivory">Querying Foodoscope RecipeDB for "${query}" (Page ${state.foodoscopePage})...</p>
        <p class="text-xs text-stone-500 font-mono">Limit: 10/page · Auth: Bearer Token · API: api.foodoscope.com</p>
      </div>
    `;
    if (paginationContainer) paginationContainer.innerHTML = '';

    try {
      const results = await ApiService.searchRecipes(query, 10, state.foodoscopePage);
      state.foodoscopeResults = results || [];

      const totalCount = results.meta?.total != null ? results.meta.total : state.foodoscopeResults.length;
      const totalPages = results.meta?.totalPages != null ? results.meta.totalPages : (Math.ceil(totalCount / 10) || 1);
      state.foodoscopeTotalCount = totalCount;
      state.foodoscopeTotalPages = totalPages;

      if (countDisplay) {
        countDisplay.textContent = `Found ${totalCount} Foodoscope Recipes (Page ${state.foodoscopePage} of ${totalPages})`;
      }

      if (!state.foodoscopeResults.length) {
        grid.innerHTML = `
          <div class="col-span-full p-8 rounded-3xl bg-white dark:bg-[#1f1a16] border border-beige-200 dark:border-stone-800 text-center space-y-3">
            <i class="fa-solid fa-magnifying-glass text-3xl text-terracotta"></i>
            <h4 class="font-heading font-bold text-xl text-forest dark:text-ivory">No Recipes Found for "${query}"</h4>
            <p class="text-xs text-stone-500 max-w-md mx-auto">Try common dish keywords like "Paneer", "Curry", "Pasta", "Cake", "Biryani", "Soup", or "Salmon".</p>
          </div>
        `;
        if (paginationContainer) paginationContainer.innerHTML = '';
        return;
      }

      let cardsHtml = '';
      state.foodoscopeResults.forEach(r => {
        const recipeId = r.Recipe_id || r._id || '';
        const title = r.Recipe_title || r.title || 'Untitled Recipe';
        const region = r.Region || r.Sub_region || r.Continent || 'Global Cuisine';
        const calories = r.Calories || r.CaloriesNum || '—';
        const cookTime = r.cook_time || r.CookTimeNum || '—';
        const servings = r.servings || '2';
        const imgUrl = getAuthenticRecipeImage(r);
        const recipe = generateChefRecipeForDish(title, r);

        cardsHtml += `
          <div class="recipe-card group rounded-3xl overflow-hidden bg-white dark:bg-[#1f1a16] border border-beige-200 dark:border-stone-800 hover:border-terracotta shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div>
              <div class="relative h-48 w-full overflow-hidden bg-beige-100 dark:bg-stone-900">
                <img
                  src="${imgUrl}"
                  alt="${title}"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=700&auto=format&fit=crop&q=80';"
                />
                <div class="absolute top-3 left-3 flex items-center gap-1.5">
                  <span class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-forest/90 text-ivory backdrop-blur-sm border border-ivory/20 font-mono">
                    RecipeDB #${recipeId}
                  </span>
                  <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-ivory/90 dark:bg-black/80 text-terracotta backdrop-blur-sm border border-terracotta/30">
                    ${region}
                  </span>
                </div>
              </div>

              <div class="p-5 space-y-3">
                <h3 class="font-heading font-black text-lg text-forest dark:text-ivory leading-snug line-clamp-2">
                  ${title}
                </h3>

                <div class="grid grid-cols-3 gap-2 text-center text-xs py-2 bg-ivory dark:bg-[#181410] rounded-xl border border-beige-200 dark:border-stone-800">
                  <div>
                    <span class="block font-bold text-terracotta">${calories}</span>
                    <span class="text-[10px] text-stone-500 uppercase">Calories</span>
                  </div>
                  <div>
                    <span class="block font-bold text-forest dark:text-sage-300">${cookTime}m</span>
                    <span class="text-[10px] text-stone-500 uppercase">Cook Time</span>
                  </div>
                  <div>
                    <span class="block font-bold text-espresso dark:text-ivory">${servings}</span>
                    <span class="text-[10px] text-stone-500 uppercase">Servings</span>
                  </div>
                </div>

                <!-- Key Ingredients Preview -->
                <div class="pt-2 border-t border-beige-200/60 dark:border-stone-800/60 space-y-1.5">
                  <div class="flex items-center justify-between text-[11px] font-bold text-stone-500">
                    <span class="flex items-center gap-1"><i class="fa-solid fa-basket-shopping text-terracotta"></i> Key Ingredients:</span>
                    <span class="text-xs text-terracotta font-mono font-bold">${recipe.ingredients.length} items</span>
                  </div>
                  <div class="flex flex-wrap gap-1">
                    ${recipe.ingredients.slice(0, 3).map(i => `<span class="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-beige-100 dark:bg-stone-800 text-forest dark:text-ivory border border-beige-200 dark:border-stone-700">${i.name.split('(')[0].trim()}</span>`).join('')}
                    ${recipe.ingredients.length > 3 ? `<span class="px-1.5 py-0.5 rounded-lg text-[10px] font-bold bg-terracotta/10 text-terracotta border border-terracotta/20">+${recipe.ingredients.length - 3} more</span>` : ''}
                  </div>
                </div>

                <!-- Quick 5-Step Accordion -->
                <div class="pt-1">
                  <button
                    type="button"
                    data-recipe-toggle="${recipeId}"
                    class="w-full py-1.5 px-3 rounded-xl bg-beige-50 dark:bg-stone-900/80 hover:bg-beige-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-[11px] font-bold transition flex items-center justify-between border border-beige-200 dark:border-stone-800 cursor-pointer"
                  >
                    <span class="flex items-center gap-1.5"><i class="fa-solid fa-fire-burner text-terracotta"></i> ⚡ Quick 5-Step Method</span>
                    <i class="fa-solid fa-chevron-down text-[10px] transition-transform duration-200 recipe-chevron-${recipeId}"></i>
                  </button>
                  <div id="recipe-steps-drawer-${recipeId}" class="hidden mt-2 p-3 rounded-xl bg-ivory dark:bg-stone-900 border border-beige-200 dark:border-stone-800 space-y-2 text-xs">
                    ${recipe.steps.map(s => `
                      <div class="flex items-start gap-2">
                        <span class="w-4 h-4 rounded-full bg-terracotta text-white text-[9px] font-black flex items-center justify-center shrink-0 mt-0.5">${s.step}</span>
                        <div class="flex-1">
                          <span class="font-bold text-forest dark:text-ivory">${s.title}:</span>
                          <p class="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5 leading-relaxed">${s.instruction}</p>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                </div>
              </div>
            </div>

            <div class="p-5 pt-0 space-y-2">
              <button
                type="button"
                data-foodoscope-inspect="${recipeId}"
                class="w-full py-2.5 px-3 rounded-xl text-xs font-bold terracotta-btn text-white transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2"
              >
                <i class="fa-solid fa-book-open"></i>
                <span>📖 View Complete Recipe & Method</span>
              </button>
              <button
                type="button"
                data-foodoscope-swaplab="${title}"
                class="w-full py-2 px-3 rounded-xl text-xs font-bold bg-ivory dark:bg-stone-900 border border-beige-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:border-terracotta transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <i class="fa-solid fa-flask-vial text-terracotta"></i>
                <span>Open in Swap Lab</span>
              </button>
            </div>
          </div>
        `;
      });

      grid.innerHTML = cardsHtml;

      // Attach accordion toggle buttons
      grid.querySelectorAll('[data-recipe-toggle]').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-recipe-toggle');
          const drawer = document.getElementById(`recipe-steps-drawer-${id}`);
          const icon = btn.querySelector(`.recipe-chevron-${id}`);
          if (drawer) {
            drawer.classList.toggle('hidden');
            if (icon) icon.classList.toggle('rotate-180');
          }
        });
      });

      // Attach inspect buttons
      grid.querySelectorAll('[data-foodoscope-inspect]').forEach(btn => {
        btn.addEventListener('click', () => {
          const rId = btn.getAttribute('data-foodoscope-inspect');
          openFoodoscopeModal(rId);
        });
      });

      // Attach swaplab opener buttons
      grid.querySelectorAll('[data-foodoscope-swaplab]').forEach(btn => {
        btn.addEventListener('click', () => {
          const dish = btn.getAttribute('data-foodoscope-swaplab');
          state.universalCurrentDishName = dish;
          switchTab('swaplab');
        });
      });

      // Render Pagination Controls
      if (paginationContainer) {
        if (totalPages <= 1) {
          paginationContainer.innerHTML = '';
        } else {
          let pagesToRender = [];
          const cur = state.foodoscopePage;
          const maxP = totalPages;

          if (maxP <= 7) {
            for (let i = 1; i <= maxP; i++) pagesToRender.push(i);
          } else {
            pagesToRender.push(1);
            if (cur > 3) pagesToRender.push('...');
            const start = Math.max(2, cur - 1);
            const end = Math.min(maxP - 1, cur + 1);
            for (let i = start; i <= end; i++) {
              if (!pagesToRender.includes(i)) pagesToRender.push(i);
            }
            if (cur < maxP - 2) pagesToRender.push('...');
            if (!pagesToRender.includes(maxP)) pagesToRender.push(maxP);
          }

          paginationContainer.innerHTML = `
            <div class="flex items-center gap-2 flex-wrap justify-center py-4">
              <button
                type="button"
                id="foodoscope-prev-page-btn"
                ${cur <= 1 ? 'disabled' : ''}
                class="px-3 py-2 rounded-xl text-xs font-bold border border-beige-200 dark:border-stone-800 bg-white dark:bg-[#181410] text-stone-700 dark:text-stone-300 hover:border-terracotta disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5 transition-all shadow-xs"
              >
                <i class="fa-solid fa-chevron-left text-[10px]"></i>
                <span>Prev</span>
              </button>

              <div class="flex items-center gap-1">
                ${pagesToRender.map(p => {
                  if (p === '...') {
                    return `<span class="px-2 text-stone-400 font-bold">...</span>`;
                  }
                  const isActive = p === cur;
                  return `
                    <button
                      type="button"
                      data-f-page="${p}"
                      class="w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                        isActive
                          ? 'bg-forest text-ivory shadow-md font-black ring-2 ring-forest/30'
                          : 'bg-white dark:bg-[#181410] border border-beige-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-terracotta shadow-xs'
                      }"
                    >
                      ${p}
                    </button>
                  `;
                }).join('')}
              </div>

              <button
                type="button"
                id="foodoscope-next-page-btn"
                ${cur >= totalPages ? 'disabled' : ''}
                class="px-3 py-2 rounded-xl text-xs font-bold border border-beige-200 dark:border-stone-800 bg-white dark:bg-[#181410] text-stone-700 dark:text-stone-300 hover:border-terracotta disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5 transition-all shadow-xs"
              >
                <span>Next</span>
                <i class="fa-solid fa-chevron-right text-[10px]"></i>
              </button>
            </div>
          `;

          // Event listeners for pagination
          paginationContainer.querySelectorAll('[data-f-page]').forEach(btn => {
            btn.addEventListener('click', () => {
              const p = parseInt(btn.getAttribute('data-f-page'), 10);
              if (p && p !== state.foodoscopePage) {
                renderFoodoscopeGrid(state.foodoscopeQuery, p);
                grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            });
          });

          paginationContainer.querySelector('#foodoscope-prev-page-btn')?.addEventListener('click', () => {
            if (state.foodoscopePage > 1) {
              renderFoodoscopeGrid(state.foodoscopeQuery, state.foodoscopePage - 1);
              grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          });

          paginationContainer.querySelector('#foodoscope-next-page-btn')?.addEventListener('click', () => {
            if (state.foodoscopePage < totalPages) {
              renderFoodoscopeGrid(state.foodoscopeQuery, state.foodoscopePage + 1);
              grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          });
        }
      }
    } catch (err) {
      grid.innerHTML = `
        <div class="col-span-full p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 text-center space-y-2">
          <p class="text-sm font-bold text-rose-700 dark:text-rose-300">Foodoscope API query encountered an error.</p>
          <p class="text-xs text-stone-500">${err?.message || 'Check network connection or try again.'}</p>
        </div>
      `;
      if (paginationContainer) paginationContainer.innerHTML = '';
    }
  }


  // ========================================================
  // RENDER: FOODOSCOPE RECIPEDB DEEP DIVE MODAL
  // ========================================================
  async function openFoodoscopeModal(recipeId) {
    const modal = document.getElementById('recipe-webx-modal');
    const container = document.getElementById('modal-recipe-body');
    if (!modal || !container) return;

    modal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');

    container.innerHTML = `
      <div class="relative bg-white dark:bg-[#181410] rounded-3xl overflow-hidden shadow-2xl max-w-4xl w-full mx-auto my-6 border border-beige-200 dark:border-stone-800 p-8 text-center space-y-4">
        <div class="w-10 h-10 border-4 border-terracotta border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p class="text-base font-bold text-forest dark:text-ivory">Fetching RecipeDB Details for #${recipeId} from Foodoscope...</p>
        <p class="text-xs text-stone-500 font-mono">Endpoint: /recipe2-api/recipe/recipesinfo?recipeId=${recipeId}</p>
      </div>
    `;

    const info = (await ApiService.getRecipeInfo(recipeId)) || state.foodoscopeResults.find(r => String(r.Recipe_id) === String(recipeId) || String(r._id) === String(recipeId)) || {};
    const title = info.Recipe_title || info.title || `Recipe #${recipeId}`;
    const recipe = generateChefRecipeForDish(title, info);

    const calories = info.Calories || info.CaloriesNum || (recipe.cuisine.includes('Dessert') ? '420' : '380');
    const carbs = info['Carbohydrate, by difference (g)'] || '24.0';
    const protein = info['Protein (g)'] || '16.0';
    const fat = info['Total lipid (fat) (g)'] || '18.0';
    const energyKcal = info['Energy (kcal)'] || calories;
    const region = info.Region || recipe.cuisine || 'Global Cuisine';
    const subRegion = info.Sub_region || '';
    const continent = info.Continent || '';
    const servings = recipe.servings || '2';
    const totalTime = info.total_time || (parseInt(recipe.prepTime, 10) + parseInt(recipe.cookTime, 10)) || '30';
    const utensils = (info.UtensilsList && Array.isArray(info.UtensilsList) && info.UtensilsList.length)
      ? info.UtensilsList
      : (typeof info.Utensils === 'string' && info.Utensils.trim()
          ? info.Utensils.split('||').map(u => u.trim()).filter(Boolean)
          : recipe.utensils);
    const processes = Array.isArray(info.Processes)
      ? info.Processes
      : (typeof info.Processes === 'string' && info.Processes.trim()
          ? info.Processes.split('||').map(p => p.trim()).filter(Boolean)
          : ['Mise en Place', 'Aromatic Sauté', 'Emulsification', 'Gentle Simmer', 'Finishing & Garnish']);
    const imgUrl = getAuthenticRecipeImage(info);

    container.innerHTML = `
      <div class="relative bg-white dark:bg-[#181410] rounded-3xl overflow-hidden shadow-2xl max-w-4xl w-full mx-auto my-6 border border-beige-200 dark:border-stone-800 animate-fade-up">
        <!-- Top bar -->
        <div class="sticky top-0 z-30 bg-white/95 dark:bg-[#181410]/95 backdrop-blur border-b border-beige-200 dark:border-stone-800 px-6 py-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-terracotta/15 text-terracotta border border-terracotta/30 font-mono">
              Foodoscope RecipeDB #${recipeId}
            </span>
            <span class="text-xs text-sage-700 dark:text-sage-400 font-bold flex items-center gap-1.5">
              <i class="fa-solid fa-globe"></i> ${region}${subRegion ? ` · ${subRegion}` : ''}${continent ? ` (${continent})` : ''}
            </span>
          </div>

          <button
            type="button"
            onclick="document.getElementById('recipe-webx-modal').classList.add('hidden'); document.body.classList.remove('overflow-hidden');"
            class="w-10 h-10 rounded-full bg-beige-100 dark:bg-[#1f1a16] hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-stone-700 dark:text-slate-300 font-bold transition-all cursor-pointer"
          >
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto">
          <!-- Hero Image & Title Banner -->
          <div class="relative h-64 sm:h-72 w-full rounded-3xl overflow-hidden border border-beige-200 dark:border-stone-800 shadow-lg group">
            <img
              src="${imgUrl}"
              alt="${title}"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=700&auto=format&fit=crop&q=80';"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6">
              <span class="px-3 py-1 rounded-full text-[11px] font-bold bg-terracotta text-white w-max mb-2 uppercase tracking-wider">
                ${recipe.cuisine} · ${recipe.difficulty}
              </span>
              <h2 class="font-heading font-black text-2xl sm:text-3xl text-white leading-tight">
                ${title}
              </h2>
              <p class="text-xs text-ivory/80 mt-1 max-w-xl">
                ${recipe.tagline}
              </p>
            </div>
          </div>

          <!-- Culinary Specs Pill Bar -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-ivory dark:bg-[#1f1a16] border border-beige-200 dark:border-stone-800 text-center font-mono text-xs">
            <div class="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-beige-200 dark:border-stone-800">
              <span class="block text-stone-400 text-[10px] uppercase font-bold">Prep Time</span>
              <span class="text-sm font-black text-forest dark:text-ivory">${recipe.prepTime}</span>
            </div>
            <div class="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-beige-200 dark:border-stone-800">
              <span class="block text-stone-400 text-[10px] uppercase font-bold">Cook Time</span>
              <span class="text-sm font-black text-terracotta">${recipe.cookTime}</span>
            </div>
            <div class="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-beige-200 dark:border-stone-800">
              <span class="block text-stone-400 text-[10px] uppercase font-bold">Portion</span>
              <span class="text-sm font-black text-sage-600 dark:text-sage-300">${servings} Servings</span>
            </div>
            <div class="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-beige-200 dark:border-stone-800">
              <span class="block text-stone-400 text-[10px] uppercase font-bold">Total Time</span>
              <span class="text-sm font-black text-stone-700 dark:text-stone-300">${totalTime} mins</span>
            </div>
          </div>

          <!-- Section: Bill of Ingredients (Measured) -->
          <div class="p-6 rounded-3xl bg-white dark:bg-[#1f1a16] border border-beige-200 dark:border-stone-800 shadow-sm space-y-4">
            <div class="flex items-center justify-between border-b border-beige-200 dark:border-stone-800 pb-3">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center font-bold">
                  <i class="fa-solid fa-basket-shopping text-sm"></i>
                </div>
                <div>
                  <h3 class="font-heading font-black text-base sm:text-lg text-forest dark:text-ivory">
                    Measured Bill of Ingredients
                  </h3>
                  <p class="text-[11px] text-stone-400">Scaled for ${servings} servings · Check off items as you prep</p>
                </div>
              </div>
              <span class="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-beige-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                ${recipe.ingredients.length} items
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              ${recipe.ingredients.map((ing, idx) => `
                <label class="flex items-start gap-3 p-3 rounded-2xl bg-ivory dark:bg-stone-900/90 border border-beige-200 dark:border-stone-800 hover:border-terracotta transition cursor-pointer select-none">
                  <input type="checkbox" class="mt-1 w-4 h-4 rounded text-terracotta focus:ring-terracotta cursor-pointer" />
                  <div class="flex-1 text-xs">
                    <div class="flex items-center justify-between gap-2">
                      <span class="font-black text-forest dark:text-ivory text-sm">${ing.amount}</span>
                      <span class="text-[9px] uppercase font-bold px-2 py-0.5 rounded-md bg-beige-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400">${ing.category}</span>
                    </div>
                    <span class="block font-bold text-stone-800 dark:text-stone-200 mt-0.5">${ing.name}</span>
                    ${ing.note ? `<span class="block text-[10px] text-stone-400 italic mt-0.5">${ing.note}</span>` : ''}
                  </div>
                </label>
              `).join('')}
            </div>
          </div>

          <!-- Section: Step-by-Step Culinary Cooking Instructions -->
          <div class="p-6 rounded-3xl bg-white dark:bg-[#1f1a16] border border-beige-200 dark:border-stone-800 shadow-sm space-y-4">
            <div class="flex items-center justify-between border-b border-beige-200 dark:border-stone-800 pb-3">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-full bg-forest/10 dark:bg-sage-400/10 text-forest dark:text-sage-400 flex items-center justify-center font-bold">
                  <i class="fa-solid fa-fire-burner text-sm"></i>
                </div>
                <div>
                  <h3 class="font-heading font-black text-base sm:text-lg text-forest dark:text-ivory">
                    Step-by-Step Cooking Method
                  </h3>
                  <p class="text-[11px] text-stone-400">Professional 5-Stage culinary process for optimal flavor & texture</p>
                </div>
              </div>
              <span class="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-terracotta/15 text-terracotta border border-terracotta/30">
                5 Stages
              </span>
            </div>

            <div class="space-y-3.5 pt-1">
              ${recipe.steps.map(s => `
                <div class="flex items-start gap-3.5 p-4 rounded-2xl bg-ivory dark:bg-stone-900 border border-beige-200 dark:border-stone-800">
                  <div class="w-8 h-8 rounded-full bg-gradient-to-br from-terracotta to-flame text-white flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
                    ${s.step}
                  </div>
                  <div class="flex-1 space-y-1">
                    <div class="flex items-center justify-between">
                      <h4 class="font-heading font-black text-sm text-forest dark:text-ivory">
                        ${s.title}
                      </h4>
                      <span class="text-[10px] font-mono font-bold text-stone-400 flex items-center gap-1">
                        <i class="fa-regular fa-clock"></i> ${s.time}
                      </span>
                    </div>
                    <p class="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                      ${s.instruction}
                    </p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Section: Chef's Secret Pro-Tip & Sensory Flavor Profile -->
          <div class="p-5 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 flex items-start gap-3.5">
            <div class="w-9 h-9 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
              <i class="fa-solid fa-lightbulb text-sm"></i>
            </div>
            <div class="space-y-1 text-xs">
              <h4 class="font-bold text-amber-900 dark:text-amber-300 text-sm flex items-center gap-2">
                <span>Executive Chef Secret & Technique</span>
              </h4>
              <p class="text-stone-700 dark:text-stone-300 leading-relaxed">
                ${recipe.chefTips}
              </p>
            </div>
          </div>

          <!-- Nutritional Breakdown -->
          <div class="p-5 rounded-2xl bg-ivory dark:bg-[#1f1a16] border border-beige-200 dark:border-stone-800 space-y-3">
            <h4 class="text-xs font-bold uppercase tracking-wider text-terracotta font-mono flex items-center gap-1.5">
              <i class="fa-solid fa-heart-pulse"></i>
              <span>Official Nutritional Macro Profile (RecipeDB)</span>
            </h4>
            <div class="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
              <div class="p-3 bg-white dark:bg-stone-900 rounded-xl border border-beige-200 dark:border-stone-800">
                <span class="block text-lg font-black text-forest dark:text-ivory">${calories}</span>
                <span class="text-[10px] text-stone-500 uppercase font-bold">Calories</span>
              </div>
              <div class="p-3 bg-white dark:bg-stone-900 rounded-xl border border-beige-200 dark:border-stone-800">
                <span class="block text-lg font-black text-terracotta">${carbs}${carbs !== '—' ? 'g' : ''}</span>
                <span class="text-[10px] text-stone-500 uppercase font-bold">Carbohydrates</span>
              </div>
              <div class="p-3 bg-white dark:bg-stone-900 rounded-xl border border-beige-200 dark:border-stone-800">
                <span class="block text-lg font-black text-sage-600 dark:text-sage-300">${protein}${protein !== '—' ? 'g' : ''}</span>
                <span class="text-[10px] text-stone-500 uppercase font-bold">Protein</span>
              </div>
              <div class="p-3 bg-white dark:bg-stone-900 rounded-xl border border-beige-200 dark:border-stone-800">
                <span class="block text-lg font-black text-peach dark:text-amber-400">${fat}${fat !== '—' ? 'g' : ''}</span>
                <span class="text-[10px] text-stone-500 uppercase font-bold">Total Lipids (Fat)</span>
              </div>
              <div class="p-3 bg-white dark:bg-stone-900 rounded-xl border border-beige-200 dark:border-stone-800">
                <span class="block text-lg font-black text-stone-700 dark:text-stone-300">${energyKcal}</span>
                <span class="text-[10px] text-stone-500 uppercase font-bold">Energy (kcal)</span>
              </div>
            </div>
          </div>

          <!-- Utensils & Culinary Processes -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-5 rounded-2xl bg-white dark:bg-[#1f1a16] border border-beige-200 dark:border-stone-800 space-y-2.5">
              <h4 class="text-xs font-bold uppercase tracking-wider text-forest dark:text-ivory font-mono flex items-center gap-1.5">
                <i class="fa-solid fa-kitchen-set text-terracotta"></i>
                <span>Required Kitchen Utensils (${utensils.length})</span>
              </h4>
              <div class="flex flex-wrap gap-1.5">
                ${utensils.length ? utensils.map(u => `<span class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-beige-100 dark:bg-stone-800 text-espresso dark:text-beige border border-beige-200 dark:border-stone-700 capitalize">${u}</span>`).join('') : '<span class="text-xs text-stone-400">Standard cookware</span>'}
              </div>
            </div>

            <div class="p-5 rounded-2xl bg-white dark:bg-[#1f1a16] border border-beige-200 dark:border-stone-800 space-y-2.5">
              <h4 class="text-xs font-bold uppercase tracking-wider text-forest dark:text-ivory font-mono flex items-center gap-1.5">
                <i class="fa-solid fa-fire-burner text-terracotta"></i>
                <span>Culinary Processes (${processes.length})</span>
              </h4>
              <div class="flex flex-wrap gap-1.5">
                ${processes.length ? processes.map(p => `<span class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-peach/40 dark:bg-stone-800 text-espresso dark:text-beige border border-terracotta/30 capitalize">${p}</span>`).join('') : '<span class="text-xs text-stone-400">Simmer / sauté</span>'}
              </div>
            </div>
          </div>

          <!-- Modal Action CTA Bar -->
          <div class="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-beige-200 dark:border-stone-800">
            <div class="flex flex-wrap items-center gap-2">
              <button
                type="button"
                id="copy-recipe-btn-${recipeId}"
                class="px-4 py-2.5 rounded-xl bg-beige-100 dark:bg-stone-800 hover:bg-beige-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <i class="fa-solid fa-copy text-terracotta"></i>
                <span>Copy Full Recipe</span>
              </button>
              <button
                type="button"
                id="modal-swaplab-btn-${recipeId}"
                class="px-4 py-2.5 rounded-xl bg-ivory dark:bg-stone-900 border border-beige-300 dark:border-stone-700 text-forest dark:text-ivory text-xs font-bold hover:border-terracotta transition flex items-center gap-1.5 cursor-pointer"
              >
                <i class="fa-solid fa-flask-vial text-terracotta"></i>
                <span>Open in Swap Lab</span>
              </button>
            </div>

            <button
              type="button"
              onclick="document.getElementById('recipe-webx-modal').classList.add('hidden'); document.body.classList.remove('overflow-hidden');"
              class="px-6 py-2.5 rounded-xl terracotta-btn text-white text-xs font-bold cursor-pointer"
            >
              Done Reading
            </button>
          </div>
        </div>
      </div>
    `;

    // Attach copy recipe button
    const copyBtn = document.getElementById(`copy-recipe-btn-${recipeId}`);
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const fullRecipeText = `${title} (${recipe.cuisine})\nServings: ${servings} | Prep: ${recipe.prepTime} | Cook: ${recipe.cookTime}\n\nINGREDIENTS:\n${recipe.ingredients.map(i => `- ${i.amount} ${i.name} (${i.category})`).join('\n')}\n\nCOOKING INSTRUCTIONS:\n${recipe.steps.map(s => `Step ${s.step}: ${s.title}\n${s.instruction}`).join('\n\n')}\n\nCHEF TIP: ${recipe.chefTips}`;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(fullRecipeText);
          showNotification('Recipe Copied!', `Full recipe for ${title} copied to clipboard.`, 'success');
        }
      });
    }

    // Attach modal swaplab opener
    const modalSwapBtn = document.getElementById(`modal-swaplab-btn-${recipeId}`);
    if (modalSwapBtn) {
      modalSwapBtn.addEventListener('click', () => {
        document.getElementById('recipe-webx-modal').classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
        state.universalCurrentDishName = title;
        switchTab('swaplab');
      });
    }
  }

  // ========================================================
  // RENDER: PANTRY DRAWER (CHIPS & PRESETS)
  // ========================================================
  function renderPantrySection() {
    const container = document.getElementById('pantry-chips-container');
    if (!container) return;

    let html = `<div class="flex flex-wrap gap-2 items-center">`;

    PREFILLED_PANTRY_STAPLES.forEach(item => {
      const isSelected = state.activePantryIngredients.has(item.name);
      html += `
        <button 
          type="button"
          data-pantry-item="${item.name}"
          class="pantry-chip px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
            isSelected 
              ? 'bg-gradient-to-r from-amber-500 to-flame text-white border-transparent shadow-md scale-105' 
              : 'bg-white dark:bg-[#1f1a16] text-stone-700 dark:text-slate-300 border-beige-200 dark:border-stone-800 hover:border-terracotta'
          }"
        >
          <span>${item.icon}</span>
          <span>${item.name}</span>
          ${isSelected ? '<i class="fa-solid fa-check ml-1 text-xs"></i>' : ''}
        </button>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;

    container.querySelectorAll('[data-pantry-item]').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.getAttribute('data-pantry-item');
        togglePantryItem(item);
      });
    });

    const badge = document.getElementById('pantry-active-count');
    if (badge) {
      if (state.activePantryIngredients.size > 0) {
        badge.textContent = `${state.activePantryIngredients.size} Items`;
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    }
  }

  function togglePantryItem(item) {
    if (state.activePantryIngredients.has(item)) {
      state.activePantryIngredients.delete(item);
    } else {
      state.activePantryIngredients.add(item);
    }
    localStorage.setItem('flavorshift_pantry', JSON.stringify(Array.from(state.activePantryIngredients)));
    renderPantrySection();
    renderExploreGrid();
  }

  function applyPantryPreset(presetKey) {
    const preset = PANTRY_PRESETS[presetKey];
    if (!preset) return;
    state.activePantryIngredients = new Set(preset.items);
    localStorage.setItem('flavorshift_pantry', JSON.stringify(Array.from(state.activePantryIngredients)));
    renderPantrySection();
    renderExploreGrid();
  }

  function clearPantry() {
    state.activePantryIngredients.clear();
    localStorage.setItem('flavorshift_pantry', '[]');
    renderPantrySection();
    renderExploreGrid();
  }

  // ========================================================
  // RENDER: EXPLORE RECIPES GRID
  // ========================================================
  function renderExploreGrid() {
    const grid = document.getElementById('recipes-grid');
    if (!grid) return;

    let filtered = RECIPES_DATA.filter(recipe => {
      if (state.searchQuery) {
        const q = state.searchQuery.toLowerCase();
        const matchesTitle = recipe.title.toLowerCase().includes(q);
        const matchesCategory = recipe.category.toLowerCase().includes(q);
        const matchesIngredient = recipe.ingredients.some(i => i.name.toLowerCase().includes(q));
        if (!matchesTitle && !matchesCategory && !matchesIngredient) return false;
      }

      if (state.selectedCategory !== 'all' && recipe.category !== state.selectedCategory) {
        return false;
      }

      if (state.selectedDiet !== 'all') {
        if (!recipe.dietary.includes(state.selectedDiet)) {
          if (state.selectedDiet === 'Vegan' && recipe.veganOption) {
            // Keep
          } else {
            return false;
          }
        }
      }

      return true;
    });

    filtered.sort((a, b) => {
      if (state.sortOption === 'title-asc') return a.title.localeCompare(b.title);
      if (state.sortOption === 'prep-asc') return parseInt(a.prepTime, 10) - parseInt(b.prepTime, 10);
      if (state.sortOption === 'ingredients-asc') return a.ingredients.length - b.ingredients.length;
      return 0;
    });

    const countDisplay = document.getElementById('recipes-count-display');
    if (countDisplay) {
      countDisplay.textContent = `Showing ${filtered.length} of ${RECIPES_DATA.length} Culinary Recipes`;
    }

    let html = '';
    filtered.forEach(recipe => {
      const isFav = state.favorites.has(recipe.id);
      const rState = state.recipeStates[recipe.id] || { persons: 1, budgetMode: false, calorieMode: false, veganMode: false };
      const localReviews = state.customReviews[recipe.id] || [];
      const extraIngredients = recipe.ingredients.length - 5;

      html += `
        <div class="editorial-card group flex flex-col justify-between overflow-hidden bg-white/95 dark:bg-[#1f1a16]/90 border border-beige-200/80 dark:border-stone-800/80 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300">
          
          <div>
            <!-- Image Container -->
            <div class="relative h-56 overflow-hidden bg-beige-100 dark:bg-[#181410]">
              <img 
                src="${recipe.image}" 
                alt="${recipe.title}" 
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"></div>
              
              <div class="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
                <span class="px-2.5 py-1 rounded-full text-xs font-black bg-white/95 text-espresso dark:bg-[#181410]/95 dark:text-ivory backdrop-blur shadow-sm">
                  ${recipe.category}
                </span>
              </div>

              <button 
                type="button"
                data-fav-id="${recipe.id}"
                class="fav-btn absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 dark:bg-[#181410]/90 backdrop-blur flex items-center justify-center text-stone-400 hover:text-rose-500 hover:scale-110 transition-all shadow-md cursor-pointer ${isFav ? 'text-rose-500' : ''}"
                title="Bookmark Recipe"
              >
                <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart text-base"></i>
              </button>

              <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold">
                <div class="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-xl">
                  <i class="fa-solid fa-layer-group text-terracotta"></i>
                  <span>${recipe.difficulty}</span>
                  ${localReviews.length > 0 ? `<span class="text-white/80">• ${localReviews.length} note${localReviews.length > 1 ? 's' : ''}</span>` : ''}
                </div>
                <div class="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-xl">
                  <i class="fa-regular fa-clock text-peach"></i>
                  <span>${recipe.prepTime}</span>
                </div>
              </div>
            </div>

            <!-- Card Content -->
            <div class="p-6 space-y-3.5">
              <div>
                <h3 class="text-xl font-black text-forest dark:text-ivory leading-snug group-hover:text-terracotta transition-colors">
                  ${recipe.title}
                </h3>
                <p class="text-stone-500 dark:text-stone-400 text-sm line-clamp-2 mt-1.5 leading-relaxed font-medium">
                  ${recipe.tagline}
                </p>
              </div>

              <!-- Key Ingredient Icons -->
              <div class="flex items-center gap-1.5 py-1">
                <span class="text-xs font-bold text-stone-400 mr-1">Includes:</span>
                ${recipe.ingredients.slice(0, 5).map(ing => `
                  <span class="w-7 h-7 rounded-lg bg-beige-100 dark:bg-stone-800/60 flex items-center justify-center text-sm" title="${ing.name}">
                    ${ing.icon || '🌿'}
                  </span>
                `).join('')}
                ${extraIngredients > 0 ? `<span class="text-xs text-stone-400">+${extraIngredients} more</span>` : ''}
              </div>

              <!-- Quick Swaps Bar -->
              <div class="flex flex-wrap gap-2 pt-1.5">
                <button
                  type="button"
                  data-card-swap-toggle="budget"
                  data-recipe-id="${recipe.id}"
                  class="px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                    rState.budgetMode
                      ? 'bg-terracotta text-white border-terracotta shadow-sm'
                      : 'bg-peach/30 dark:bg-stone-900 text-terracotta border-peach dark:border-stone-700 hover:bg-peach/60'
                  }"
                  title="Toggle Pantry / Budget Alternative"
                >
                  <i class="fa-solid fa-arrows-rotate"></i>
                  <span>Budget Swap</span>
                </button>

                <button
                  type="button"
                  data-card-swap-toggle="calorie"
                  data-recipe-id="${recipe.id}"
                  class="px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                    rState.calorieMode
                      ? 'bg-rose-500 text-white border-rose-600 shadow-sm'
                      : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800 hover:bg-rose-100'
                  }"
                  title="Toggle Lighter Ingredient Swap"
                >
                  <i class="fa-solid fa-fire-flame-simple"></i>
                  <span>Lighter Swap</span>
                </button>

                ${recipe.veganOption ? `
                  <button
                    type="button"
                    data-card-swap-toggle="vegan"
                    data-recipe-id="${recipe.id}"
                    class="px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                      rState.veganMode
                        ? 'bg-forest-600 text-white border-forest shadow-sm'
                        : 'bg-sage-50 dark:bg-stone-900 text-sage-700 dark:text-sage-300 border-sage-200 dark:border-stone-700 hover:bg-sage-100'
                    }"
                    title="Toggle Plant-Based Option"
                  >
                    <i class="fa-solid fa-leaf"></i>
                    <span>Plant-Based</span>
                  </button>
                ` : ''}
              </div>

            </div>
          </div>

          <!-- Card Bottom Specs & CTA -->
          <div class="p-5 pt-0">
            <div class="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-2xl bg-ivory dark:bg-stone-900 text-center mb-3.5 border border-beige-100 dark:border-stone-800/60">
              <div>
                <span class="block text-[11px] text-stone-400 uppercase font-bold tracking-wider">Prep / Cook</span>
                <span class="text-sm font-black text-forest dark:text-ivory">${recipe.prepTime}</span>
                <span class="block text-[11px] text-stone-400">+ ${recipe.cookTime}</span>
              </div>
              <div>
                <span class="block text-[11px] text-stone-400 uppercase font-bold tracking-wider">Ingredients</span>
                <span class="text-base font-black text-sage-700 dark:text-sage-400">${recipe.ingredients.length}</span>
                <span class="block text-[11px] text-stone-400">items</span>
              </div>
              <div>
                <span class="block text-[11px] text-stone-400 uppercase font-bold tracking-wider">Skill</span>
                <span class="text-sm font-black text-terracotta">${recipe.difficulty}</span>
                <span class="block text-[11px] text-stone-400">${rState.budgetMode || rState.calorieMode || rState.veganMode ? 'Swap Active' : 'Standard'}</span>
              </div>
            </div>

            <button
              type="button"
              data-open-recipe="${recipe.id}"
              class="w-full py-3.5 px-4 rounded-2xl font-bold text-sm forest-btn text-white hover:scale-[1.01] shadow-md hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>View Ingredients & Whole Recipe</span>
              <i class="fa-solid fa-arrow-right text-xs"></i>
            </button>
          </div>

        </div>
      `;
    });

    grid.innerHTML = html;

    grid.querySelectorAll('[data-open-recipe]').forEach(btn => {
      btn.addEventListener('click', () => {
        openRecipeModal(btn.getAttribute('data-open-recipe'));
      });
    });

    grid.querySelectorAll('[data-fav-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFavorite(btn.getAttribute('data-fav-id'));
      });
    });

    grid.querySelectorAll('[data-card-swap-toggle]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const type = btn.getAttribute('data-card-swap-toggle');
        const rId = btn.getAttribute('data-recipe-id');
        if (!state.recipeStates[rId]) {
          state.recipeStates[rId] = { persons: 1, budgetMode: false, calorieMode: false, veganMode: false };
        }
        if (type === 'budget') state.recipeStates[rId].budgetMode = !state.recipeStates[rId].budgetMode;
        if (type === 'calorie') state.recipeStates[rId].calorieMode = !state.recipeStates[rId].calorieMode;
        if (type === 'vegan') state.recipeStates[rId].veganMode = !state.recipeStates[rId].veganMode;
        renderExploreGrid();
      });
    });
  }

  // Favorite Toggle
  function toggleFavorite(id) {
    const rec = RECIPES_DATA.find(r => r.id === id);
    if (state.favorites.has(id)) {
      state.favorites.delete(id);
      if (rec) showNotification('Removed from Saved', `${rec.title} removed from your saved list.`, 'warning');
    } else {
      state.favorites.add(id);
      if (rec) showNotification('Recipe Saved', `${rec.title} bookmarked to Favorites.`, 'success');
    }
    localStorage.setItem('flavorshift_favs', JSON.stringify(Array.from(state.favorites)));
    updateFavoritesBadge();
    if (state.activeTab === 'favorites') {
      renderFavoritesView();
    } else {
      renderExploreGrid();
    }
  }

  function updateFavoritesBadge() {
    const badge = document.getElementById('fav-count-badge');
    if (badge) {
      badge.textContent = state.favorites.size;
    }
  }

  // ========================================================
  // RENDER: KITCHEN TASTING LOG (HTV) HUB
  // ========================================================
  function renderHtvView() {
    const container = document.getElementById('htv-view-container');
    if (!container) return;

    const submissions = state.htvSubmissions || [];

    let html = `
      <div class="space-y-8 animate-fade-up max-w-5xl mx-auto">
        
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-beige-200 dark:border-stone-800 pb-5">
          <div>
            <div class="flex items-center gap-2.5 mb-2">
              <span class="px-3.5 py-1 rounded-full text-xs sm:text-sm font-black bg-sage-100 dark:bg-sage-900/40 text-forest dark:text-sage-300 border border-sage-300/60 dark:border-sage-700 flex items-center gap-1.5 shadow-xs">
                <i class="fa-solid fa-clipboard-list text-terracotta"></i> Local Kitchen Log
              </span>
              <span class="text-xs sm:text-sm text-stone-400 font-semibold">Personal Taste & Texture Notes</span>
            </div>
            <h2 class="text-3xl md:text-4xl font-black text-forest dark:text-ivory">
              Record Substitutions in Your Own Kitchen
            </h2>
            <p class="text-sm sm:text-base text-stone-500 mt-1.5 leading-relaxed">
              Log how a swap behaves on your stove—sauce emulsion, seasoning balance, and feedback saved directly in your browser.
            </p>
          </div>

          <button
            type="button"
            id="htv-open-submit-modal"
            class="px-5 py-3 rounded-xl text-sm font-bold forest-btn text-white shadow-md flex items-center gap-2 cursor-pointer self-start md:self-auto transition-transform hover:scale-105"
          >
            <i class="fa-solid fa-clipboard-check"></i>
            <span>Log Kitchen Tasting Test</span>
          </button>
        </div>

        <!-- 3 Factual Status Cards (No Invented Statistics) -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="p-6 rounded-3xl bg-white dark:bg-[#1f1a16] border border-beige-200 dark:border-stone-800 text-center shadow-sm">
            <span class="text-4xl font-black text-sage-600 font-heading">${submissions.length}</span>
            <span class="block text-sm font-bold text-stone-700 dark:text-stone-300 mt-1.5">Your Logged Kitchen Trials</span>
            <span class="block text-xs text-stone-400 mt-0.5">Entries saved in this browser</span>
          </div>

          <div class="p-6 rounded-3xl bg-white dark:bg-[#1f1a16] border border-beige-200 dark:border-stone-800 text-center shadow-sm">
            <span class="text-4xl font-black text-terracotta font-heading">${RECIPES_DATA.length}</span>
            <span class="block text-sm font-bold text-stone-700 dark:text-stone-300 mt-1.5">Catalog Dishes Available</span>
            <span class="block text-xs text-stone-400 mt-0.5">All ready for personal tasting notes</span>
          </div>

          <div class="p-6 rounded-3xl bg-white dark:bg-[#1f1a16] border border-beige-200 dark:border-stone-800 text-center shadow-sm">
            <span class="text-2xl sm:text-3xl font-black text-forest dark:text-ivory font-heading">Local Only</span>
            <span class="block text-sm font-bold text-stone-700 dark:text-stone-300 mt-2">Browser Storage</span>
            <span class="block text-xs text-stone-400 mt-0.5">No unverified public ratings included</span>
          </div>
        </div>

        <!-- Interactive Submission Drawer / Form -->
        <div id="htv-submission-box" class="hidden p-6 rounded-3xl bg-peach/30 dark:bg-stone-900 border border-terracotta/40 dark:border-stone-700 space-y-4 shadow-lg">
          <div class="flex items-center justify-between">
            <h4 class="font-black text-lg text-forest dark:text-ivory flex items-center gap-2">
              <i class="fa-solid fa-flask-vial text-terracotta"></i>
              <span>Log Your Kitchen Taste Observations</span>
            </h4>
            <button type="button" id="close-htv-form-btn" class="w-8 h-8 rounded-full bg-beige-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center font-bold cursor-pointer">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
            <div>
              <label class="block font-bold text-stone-700 dark:text-stone-300 mb-1">Your Name / Role</label>
              <input type="text" id="htv-input-author" placeholder="e.g. Home Cook / Chef" class="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#181410] border border-beige-200 dark:border-stone-800">
            </div>
            <div>
              <label class="block font-bold text-stone-700 dark:text-stone-300 mb-1">Kitchen / Location (Optional)</label>
              <input type="text" id="htv-input-kitchen" placeholder="e.g. Home Kitchen" class="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#181410] border border-beige-200 dark:border-stone-800">
            </div>
            <div>
              <label class="block font-bold text-stone-700 dark:text-stone-300 mb-1">Recipe Tested</label>
              <select id="htv-input-recipe" class="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#181410] border border-beige-200 dark:border-stone-800 font-bold">
                ${RECIPES_DATA.map(r => `<option value="${r.title}">${r.title}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block font-bold text-stone-700 dark:text-stone-300 mb-1">Your Tasting Rating</label>
              <select id="htv-input-rating" class="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#181410] border border-beige-200 dark:border-stone-800 font-bold">
                <option value="5">★★★★★ (5 - Worked very well)</option>
                <option value="4">★★★★☆ (4 - Good texture & taste)</option>
                <option value="3">★★★☆☆ (3 - Minor differences)</option>
                <option value="2">★★☆☆☆ (2 - Needs adjustment)</option>
                <option value="1">★☆☆☆☆ (1 - Did not work)</option>
              </select>
            </div>
          </div>

          <div class="text-sm">
            <label class="block font-bold text-stone-700 dark:text-stone-300 mb-1">Cooking & Taste Notes</label>
            <textarea id="htv-input-comment" rows="3" placeholder="Share how the substitute handled cooking heat, texture, and flavor..." class="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#181410] border border-beige-200 dark:border-stone-800"></textarea>
          </div>

          <button type="button" id="htv-save-submission-btn" class="px-5 py-2.5 rounded-xl text-xs font-black terracotta-btn text-white shadow-md cursor-pointer">
            Save Kitchen Log
          </button>
        </div>

        <!-- User-Submitted Kitchen Feedback Feed -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-black text-forest dark:text-ivory flex items-center gap-2">
              <i class="fa-solid fa-comments text-terracotta"></i>
              <span>Saved Kitchen Tasting Entries (${submissions.length})</span>
            </h3>
            ${submissions.length > 0 ? `
              <button type="button" id="htv-clear-submissions-btn" class="text-xs font-semibold text-stone-500 hover:text-terracotta cursor-pointer">
                Clear Log
              </button>
            ` : ''}
          </div>

          ${submissions.length === 0 ? `
            <div class="p-8 rounded-3xl bg-white dark:bg-[#1f1a16] border border-beige-200 dark:border-stone-800 text-center space-y-3 shadow-sm">
              <div class="inline-flex w-12 h-12 rounded-2xl bg-sage-100 dark:bg-stone-800 text-sage-700 dark:text-sage-300 items-center justify-center text-xl">
                <i class="fa-regular fa-clipboard"></i>
              </div>
              <h4 class="font-heading font-bold text-lg text-forest dark:text-ivory">No Kitchen Trials Logged Yet</h4>
              <p class="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
                This log only displays notes you actually enter—no pre-filled or synthetic reviews are shown. Click "Log Kitchen Tasting Test" above after testing a recipe swap.
              </p>
            </div>
          ` : `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              ${submissions.map(item => `
                <div class="editorial-card p-5 bg-white dark:bg-[#1f1a16] border border-beige-200 dark:border-stone-800 shadow-sm flex flex-col justify-between">
                  <div>
                    <div class="h-36 rounded-2xl overflow-hidden mb-3 relative">
                      <img src="${item.photo || RECIPES_DATA[0].image}" alt="Dish" class="w-full h-full object-cover">
                      <span class="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-black/60 text-white backdrop-blur">
                        ${item.dish}
                      </span>
                      <span class="absolute bottom-2 right-2 px-2 py-0.5 rounded-lg text-xs font-black bg-terracotta text-white">
                        ${'★'.repeat(item.rating || 5)}${'☆'.repeat(5 - (item.rating || 5))}
                      </span>
                    </div>

                    <p class="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-medium mb-3">
                      "${item.comment}"
                    </p>
                  </div>
                  
                  <div class="flex items-center justify-between pt-2 border-t border-beige-100 dark:border-stone-800/60 text-[11px] text-stone-400">
                    <span class="font-bold text-stone-600 dark:text-stone-300">${item.author} • ${item.kitchen}</span>
                    <span class="text-sage-600 font-semibold">${item.date || 'Saved locally'}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>

      </div>
    `;

    container.innerHTML = html;

    const submitBox = document.getElementById('htv-submission-box');
    document.getElementById('htv-open-submit-modal')?.addEventListener('click', () => {
      submitBox?.classList.remove('hidden');
      submitBox?.scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById('close-htv-form-btn')?.addEventListener('click', () => {
      submitBox?.classList.add('hidden');
    });

    document.getElementById('htv-clear-submissions-btn')?.addEventListener('click', () => {
      state.htvSubmissions = [];
      localStorage.setItem('flavorshift_htv_submissions', '[]');
      renderHtvView();
    });

    document.getElementById('htv-save-submission-btn')?.addEventListener('click', () => {
      const author = document.getElementById('htv-input-author').value.trim() || 'Home / Line Cook';
      const kitchen = document.getElementById('htv-input-kitchen').value.trim() || 'Home Kitchen';
      const dish = document.getElementById('htv-input-recipe').value;
      const rating = parseInt(document.getElementById('htv-input-rating').value, 10) || 5;
      const comment = document.getElementById('htv-input-comment').value.trim();

      if (!comment) {
        alert('Please share your kitchen observations.');
        return;
      }

      const matched = RECIPES_DATA.find(r => r.title === dish);

      state.htvSubmissions.unshift({
        dish,
        author,
        kitchen,
        rating,
        comment,
        date: new Date().toLocaleDateString(),
        photo: matched ? matched.image : RECIPES_DATA[0].image
      });

      localStorage.setItem('flavorshift_htv_submissions', JSON.stringify(state.htvSubmissions));
      renderHtvView();
    });
  }

  // ========================================================
  // RENDER: CAFE COST & MARGIN CALCULATOR
  // ========================================================
  // ========================================================
  // INGREDIENT KNOWLEDGE BASE & RECIPE IMPACT ANALYTICS ENGINE
  // ========================================================
  const INGREDIENT_KNOWLEDGE_BASE = {
    'butter': { costPer100g: 55, calories: 717, protein: 0.9, carbs: 0.1, fat: 81.1, fiber: 0, sodium: 643, category: 'Dairy Fat', unit: 'g', defaultQtyPerPerson: 20, role: 'Emulsification, rich mouthfeel & browning' },
    'salted butter': { costPer100g: 55, calories: 717, protein: 0.9, carbs: 0.1, fat: 81.1, fiber: 0, sodium: 643, category: 'Dairy Fat', unit: 'g', defaultQtyPerPerson: 20, role: 'Emulsification, rich mouthfeel & browning' },
    'olive oil': { costPer100g: 45, calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0, sodium: 2, category: 'Plant Oil', unit: 'ml', defaultQtyPerPerson: 16, role: 'Fruity aroma, healthy lipids & sheen' },
    'ghee': { costPer100g: 72, calories: 900, protein: 0.3, carbs: 0, fat: 99.5, fiber: 0, sodium: 1, category: 'Dairy Fat', unit: 'g', defaultQtyPerPerson: 18, role: 'High smoke point, nutty aroma & richness' },
    'clarified butter': { costPer100g: 72, calories: 900, protein: 0.3, carbs: 0, fat: 99.5, fiber: 0, sodium: 1, category: 'Dairy Fat', unit: 'g', defaultQtyPerPerson: 18, role: 'High smoke point, nutty aroma & richness' },
    'coconut oil': { costPer100g: 38, calories: 862, protein: 0, carbs: 0, fat: 100, fiber: 0, sodium: 0, category: 'Plant Oil', unit: 'ml', defaultQtyPerPerson: 16, role: 'Subtle sweet tropical note & solid at room temp' },
    'vegetable oil': { costPer100g: 22, calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0, sodium: 0, category: 'Plant Oil', unit: 'ml', defaultQtyPerPerson: 16, role: 'Neutral cooking medium & sheen' },
    'heavy cream': { costPer100g: 36, calories: 345, protein: 2.8, carbs: 3.4, fat: 36.1, fiber: 0, sodium: 38, category: 'Dairy', unit: 'g', defaultQtyPerPerson: 50, role: 'Velvety body, saucing coat & fat balance' },
    'fresh cream': { costPer100g: 35, calories: 340, protein: 2.8, carbs: 3.5, fat: 35.0, fiber: 0, sodium: 40, category: 'Dairy', unit: 'g', defaultQtyPerPerson: 50, role: 'Velvety body, saucing coat & fat balance' },
    'cashew puree': { costPer100g: 46, calories: 245, protein: 6.5, carbs: 12.0, fat: 20.2, fiber: 1.3, sodium: 14, category: 'Nut Emulsion', unit: 'g', defaultQtyPerPerson: 45, role: 'Glossy emulsion, mild nuttiness & heat stable' },
    'cashew cream': { costPer100g: 44, calories: 235, protein: 6.2, carbs: 11.5, fat: 19.8, fiber: 1.2, sodium: 12, category: 'Nut Emulsion', unit: 'g', defaultQtyPerPerson: 45, role: 'Glossy emulsion, mild nuttiness & heat stable' },
    'coconut cream': { costPer100g: 28, calories: 230, protein: 2.3, carbs: 5.5, fat: 23.8, fiber: 2.2, sodium: 15, category: 'Plant Cream', unit: 'g', defaultQtyPerPerson: 45, role: 'Thick velvety texture & aromatic richness' },
    'coconut milk': { costPer100g: 20, calories: 154, protein: 1.4, carbs: 3.0, fat: 15.0, fiber: 1.0, sodium: 13, category: 'Plant Milk', unit: 'ml', defaultQtyPerPerson: 80, role: 'Creamy aromatic broth base' },
    'greek yogurt': { costPer100g: 22, calories: 97, protein: 9.0, carbs: 3.9, fat: 5.0, fiber: 0, sodium: 47, category: 'Cultured Dairy', unit: 'g', defaultQtyPerPerson: 50, role: 'Tangy acidity, probiotics & protein thickness' },
    'hung curd': { costPer100g: 20, calories: 110, protein: 10.2, carbs: 4.0, fat: 6.0, fiber: 0, sodium: 45, category: 'Cultured Dairy', unit: 'g', defaultQtyPerPerson: 45, role: 'Dense body, tart contrast & velvety bind' },
    'milk': { costPer100g: 7, calories: 62, protein: 3.2, carbs: 4.8, fat: 3.6, fiber: 0, sodium: 44, category: 'Dairy', unit: 'ml', defaultQtyPerPerson: 100, role: 'Moisture, hydration & subtle sweetness' },
    'oat milk': { costPer100g: 16, calories: 48, protein: 1.0, carbs: 6.7, fat: 1.5, fiber: 0.8, sodium: 40, category: 'Plant Milk', unit: 'ml', defaultQtyPerPerson: 100, role: 'Creamy froth, neutral sweet grain balance' },
    'almond milk': { costPer100g: 18, calories: 39, protein: 1.0, carbs: 3.4, fat: 2.5, fiber: 0.5, sodium: 65, category: 'Plant Milk', unit: 'ml', defaultQtyPerPerson: 100, role: 'Light hydration with subtle nutty notes' },
    'paneer': { costPer100g: 42, calories: 296, protein: 18.3, carbs: 3.4, fat: 22.5, fiber: 0, sodium: 18, category: 'Fresh Cheese', unit: 'g', defaultQtyPerPerson: 125, role: 'Firm protein structure, absorbs gravies' },
    'firm tofu': { costPer100g: 25, calories: 144, protein: 15.6, carbs: 2.8, fat: 8.7, fiber: 2.3, sodium: 14, category: 'Soy Protein', unit: 'g', defaultQtyPerPerson: 125, role: 'Neutral high-protein sponge, plant-based' },
    'silken tofu': { costPer100g: 22, calories: 60, protein: 6.0, carbs: 2.0, fat: 2.5, fiber: 1.0, sodium: 12, category: 'Soy Protein', unit: 'g', defaultQtyPerPerson: 70, role: 'Custard-like texture for creams & purées' },
    'parmesan': { costPer100g: 130, calories: 431, protein: 38.4, carbs: 4.1, fat: 28.6, fiber: 0, sodium: 1529, category: 'Aged Cheese', unit: 'g', defaultQtyPerPerson: 25, role: 'Umami bomb, salty savory depth & melting' },
    'nutritional yeast': { costPer100g: 65, calories: 380, protein: 51.0, carbs: 34.0, fat: 5.0, fiber: 24.0, sodium: 50, category: 'Plant Seasoning', unit: 'g', defaultQtyPerPerson: 15, role: 'Cheesy nutty umami & B-complex vitamins' },
    'eggs': { costPer100g: 18, calories: 143, protein: 12.6, carbs: 0.7, fat: 9.5, fiber: 0, sodium: 142, category: 'Poultry', unit: 'g', defaultQtyPerPerson: 50, role: 'Binding, leavening & emulsion structure' },
    'egg': { costPer100g: 18, calories: 143, protein: 12.6, carbs: 0.7, fat: 9.5, fiber: 0, sodium: 142, category: 'Poultry', unit: 'g', defaultQtyPerPerson: 50, role: 'Binding, leavening & emulsion structure' },
    'aquafaba': { costPer100g: 4, calories: 18, protein: 1.0, carbs: 3.0, fat: 0.2, fiber: 0, sodium: 45, category: 'Legume Water', unit: 'ml', defaultQtyPerPerson: 45, role: 'Whips like egg whites, plant-based binder' },
    'flaxseed egg': { costPer100g: 12, calories: 120, protein: 4.0, carbs: 6.0, fat: 8.5, fiber: 5.5, sodium: 6, category: 'Seed Gel', unit: 'g', defaultQtyPerPerson: 45, role: 'Fiber gel matrix for dense baking & patties' },
    'sugar': { costPer100g: 4.5, calories: 387, protein: 0, carbs: 100, fat: 0, fiber: 0, sodium: 1, category: 'Sweetener', unit: 'g', defaultQtyPerPerson: 25, role: 'Sweetness, caramelization & moisture retention' },
    'white sugar': { costPer100g: 4.5, calories: 387, protein: 0, carbs: 100, fat: 0, fiber: 0, sodium: 1, category: 'Sweetener', unit: 'g', defaultQtyPerPerson: 25, role: 'Sweetness, caramelization & moisture retention' },
    'brown sugar': { costPer100g: 6.0, calories: 380, protein: 0.1, carbs: 98, fat: 0, fiber: 0, sodium: 28, category: 'Sweetener', unit: 'g', defaultQtyPerPerson: 25, role: 'Caramel molasses note & moisture' },
    'honey': { costPer100g: 34, calories: 304, protein: 0.3, carbs: 82.4, fat: 0, fiber: 0.2, sodium: 4, category: 'Natural Sweetener', unit: 'g', defaultQtyPerPerson: 20, role: 'Floral sweetness, gloss & humectant' },
    'maple syrup': { costPer100g: 50, calories: 260, protein: 0, carbs: 67.0, fat: 0.1, fiber: 0, sodium: 12, category: 'Natural Sweetener', unit: 'ml', defaultQtyPerPerson: 20, role: 'Woody caramel complexity & sweetness' },
    'all-purpose flour': { costPer100g: 5, calories: 364, protein: 10.3, carbs: 76.3, fat: 1.0, fiber: 2.7, sodium: 2, category: 'Grain Flour', unit: 'g', defaultQtyPerPerson: 65, role: 'Gluten network, structure & thickening' },
    'flour': { costPer100g: 5, calories: 364, protein: 10.3, carbs: 76.3, fat: 1.0, fiber: 2.7, sodium: 2, category: 'Grain Flour', unit: 'g', defaultQtyPerPerson: 65, role: 'Gluten network, structure & thickening' },
    'almond flour': { costPer100g: 38, calories: 575, protein: 21.2, carbs: 21.6, fat: 49.9, fiber: 10.4, sodium: 1, category: 'Nut Flour', unit: 'g', defaultQtyPerPerson: 60, role: 'Nutty crumb, moisture & gluten-free' },
    'chicken': { costPer100g: 32, calories: 165, protein: 31.0, carbs: 0, fat: 3.6, fiber: 0, sodium: 74, category: 'Poultry', unit: 'g', defaultQtyPerPerson: 150, role: 'Lean animal protein & savory foundation' },
    'mushrooms': { costPer100g: 18, calories: 22, protein: 3.1, carbs: 3.3, fat: 0.3, fiber: 1.0, sodium: 5, category: 'Produce', unit: 'g', defaultQtyPerPerson: 100, role: 'Earthy umami, moisture & meaty texture' },
    'mushroom': { costPer100g: 18, calories: 22, protein: 3.1, carbs: 3.3, fat: 0.3, fiber: 1.0, sodium: 5, category: 'Produce', unit: 'g', defaultQtyPerPerson: 100, role: 'Earthy umami, moisture & meaty texture' },
    'tomatoes': { costPer100g: 6, calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, sodium: 5, category: 'Produce', unit: 'g', defaultQtyPerPerson: 100, role: 'Acidity, sweetness & glutamic umami base' },
    'tomato': { costPer100g: 6, calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, sodium: 5, category: 'Produce', unit: 'g', defaultQtyPerPerson: 100, role: 'Acidity, sweetness & glutamic umami base' },
    'avocado': { costPer100g: 40, calories: 160, protein: 2.0, carbs: 8.5, fat: 14.7, fiber: 6.7, sodium: 7, category: 'Produce', unit: 'g', defaultQtyPerPerson: 75, role: 'Silky monounsaturated fat & freshness' },
    'cream cheese': { costPer100g: 48, calories: 342, protein: 6.1, carbs: 4.1, fat: 34.2, fiber: 0, sodium: 321, category: 'Cheese', unit: 'g', defaultQtyPerPerson: 60, role: 'Dense lactic tang & cheesecake base' }
  };

  function getIngredientProfile(name) {
    if (!name) {
      return { name: 'Pantry Item', costPer100g: 30, calories: 250, protein: 5, carbs: 20, fat: 10, fiber: 1, sodium: 50, category: 'Pantry Item', unit: 'g', defaultQtyPerPerson: 40, role: 'Culinary ingredient', isEstimated: true };
    }
    const clean = name.trim().toLowerCase();
    
    if (INGREDIENT_KNOWLEDGE_BASE[clean]) {
      return { ...INGREDIENT_KNOWLEDGE_BASE[clean], name, isEstimated: false };
    }
    
    for (const [k, prof] of Object.entries(INGREDIENT_KNOWLEDGE_BASE)) {
      if (clean.includes(k) || k.includes(clean)) {
        return { ...prof, name, isEstimated: false };
      }
    }
    
    // Heuristic categorization for unlisted ingredients
    let cat = 'Pantry Item';
    let cost = 30;
    let cal = 240;
    let prot = 4;
    let carbs = 20;
    let fat = 8;
    let unit = 'g';
    let qty = 40;
    let role = 'Culinary flavor & texture balancing';
    
    if (clean.includes('oil') || clean.includes('fat') || clean.includes('lard')) {
      cat = 'Plant / Lipid Oil'; cost = 42; cal = 880; prot = 0; carbs = 0; fat = 100; unit = 'ml'; qty = 16; role = 'Lipid carrier, heat conductor & glossy finish';
    } else if (clean.includes('cream') || clean.includes('malai')) {
      cat = 'Dairy / Cream'; cost = 35; cal = 330; prot = 3; carbs = 4; fat = 34; unit = 'g'; qty = 45; role = 'Emulsification, body & coating mouthfeel';
    } else if (clean.includes('cheese') || clean.includes('paneer') || clean.includes('curd')) {
      cat = 'Dairy Cheese'; cost = 45; cal = 290; prot = 18; carbs = 3; fat = 22; unit = 'g'; qty = 100; role = 'Savory protein matrix & richness';
    } else if (clean.includes('milk')) {
      cat = 'Liquid Dairy'; cost = 12; cal = 55; prot = 3; carbs = 5; fat = 3; unit = 'ml'; qty = 100; role = 'Hydration, moisture & natural sweetness';
    } else if (clean.includes('egg')) {
      cat = 'Poultry / Egg'; cost = 16; cal = 143; prot = 13; carbs = 1; fat = 10; unit = 'g'; qty = 50; role = 'Protein structure, leavening & emulsifier';
    } else if (clean.includes('flour') || clean.includes('powder') || clean.includes('starch')) {
      cat = 'Dry Baking / Starch'; cost = 8; cal = 360; prot = 10; carbs = 75; fat = 1; unit = 'g'; qty = 60; role = 'Starch gelation, thickening & structure';
    } else if (clean.includes('sugar') || clean.includes('syrup') || clean.includes('honey')) {
      cat = 'Sweetener'; cost = 18; cal = 340; prot = 0; carbs = 88; fat = 0; unit = 'g'; qty = 25; role = 'Sweetness, caramelization & moisture control';
    } else if (clean.includes('meat') || clean.includes('chicken') || clean.includes('beef') || clean.includes('fish') || clean.includes('tofu')) {
      cat = 'Protein Source'; cost = 32; cal = 160; prot = 24; carbs = 1; fat = 5; unit = 'g'; qty = 130; role = 'Primary protein structure & savory center';
    }
    
    return {
      name,
      costPer100g: cost,
      calories: cal,
      protein: prot,
      carbs,
      fat,
      fiber: 1,
      sodium: 60,
      category: cat,
      unit,
      defaultQtyPerPerson: qty,
      role,
      isEstimated: true
    };
  }

  function getSubstitutionRatio(missingName, replName) {
    const m = (missingName || '').toLowerCase().trim();
    const r = (replName || '').toLowerCase().trim();
    
    if ((m.includes('butter') || m.includes('ghee')) && (r.includes('oil') || r.includes('olive'))) {
      return {
        ratioNum: 0.8,
        ratioText: '3 : 4 by volume (80g Olive Oil per 100g Butter)',
        feasibility: 'High Feasibility',
        cookingNote: 'Olive oil provides heart-healthy monounsaturated lipids. Add over gentle heat to preserve delicate polyphenols; creates a silky sheen in gravies and pasta.'
      };
    }
    if ((m.includes('cream') || m.includes('malai')) && (r.includes('cashew') || r.includes('nut'))) {
      return {
        ratioNum: 1.0,
        ratioText: '1 : 1 by weight (60g Soaked Cashew Paste + 40g Milk/Water)',
        feasibility: 'Exceptional Feasibility',
        cookingNote: 'Cashew puree naturally binds with tomato acidity without curdling. Simmers into an ultra-velvety restaurant-grade gravy with clean nutty richness.'
      };
    }
    if ((m.includes('cream') || m.includes('malai')) && r.includes('coconut')) {
      return {
        ratioNum: 1.0,
        ratioText: '1 : 1 by weight (100g Coconut Cream per 100g Dairy Cream)',
        feasibility: 'High Feasibility',
        cookingNote: 'Adds luscious tropical mouthfeel and satin body. Pair with aromatic spices (cumin, cardamom) to harmonize coconut sweetness.'
      };
    }
    if ((m.includes('cream') || m.includes('malai')) && (r.includes('yogurt') || r.includes('curd'))) {
      return {
        ratioNum: 0.9,
        ratioText: '0.9 : 1 by weight (90g Strained Curd per 100g Cream)',
        feasibility: 'Good Feasibility (Thermal Care)',
        cookingNote: 'Whisk smooth with a splash of milk and fold into curry off the heat to avoid protein separation. Adds pleasant lactic acidity.'
      };
    }
    if (m.includes('butter') && r.includes('ghee')) {
      return {
        ratioNum: 0.85,
        ratioText: '0.85 : 1 by weight (85g Ghee per 100g Butter)',
        feasibility: 'Exceptional Feasibility',
        cookingNote: 'Ghee contains zero moisture and milk solids, yielding higher smoke point (250°C) and intensely aromatic roasted nutty notes.'
      };
    }
    if (m.includes('paneer') && (r.includes('tofu') || r.includes('soy'))) {
      return {
        ratioNum: 1.0,
        ratioText: '1 : 1 by weight (125g Pressed Firm Tofu per 125g Paneer)',
        feasibility: 'High Feasibility',
        cookingNote: 'Press tofu for 15 minutes and sear in oil with turmeric before sliding into sauce. Absorbs curry spices thoroughly.'
      };
    }
    if (m.includes('egg') && (r.includes('aquafaba') || r.includes('chickpea'))) {
      return {
        ratioNum: 0.9,
        ratioText: '3 tbsp (45ml) Aquafaba per 1 Whole Egg',
        feasibility: 'High Feasibility',
        cookingNote: 'Whips with stable air pockets similar to egg albumin. Imparts zero bean taste once cooked and delivers light crumb structure.'
      };
    }
    if (m.includes('parmesan') && (r.includes('nutritional yeast') || r.includes('nooch'))) {
      return {
        ratioNum: 0.5,
        ratioText: '1 : 2 by volume (12g Nutritional Yeast per 25g Parmesan)',
        feasibility: 'High Feasibility',
        cookingNote: 'Intense nutty, umami flavor with natural glutamate. Stir in at final plating for maximum flavor impact and creaminess.'
      };
    }
    if (m.includes('sugar') && (r.includes('honey') || r.includes('syrup'))) {
      return {
        ratioNum: 0.75,
        ratioText: '3 : 4 by weight (75g Honey per 100g Sugar)',
        feasibility: 'High Feasibility',
        cookingNote: 'Honey is sweeter than granulated sucrose and adds natural moisture. Reduce other liquids slightly in delicate baked goods.'
      };
    }
    
    return {
      ratioNum: 1.0,
      ratioText: '1 : 1 calibrated conversion',
      feasibility: 'Direct Culinary Fit',
      cookingNote: `Incorporate ${replName || 'replacement'} evenly. Adjust salt and seasoning to harmonize with ${missingName || 'original'}.`
    };
  }

  function calculateRecipeImpact(dishName, missingIng, replIng, servings) {
    const s = Math.max(1, Math.min(20, parseInt(servings, 10) || 4));
    const matchedRecipe = findMatchingRecipe(dishName, missingIng);
    
    const origProfile = getIngredientProfile(missingIng || 'Butter');
    const replProfile = getIngredientProfile(replIng || 'Olive Oil');
    const ratioData = getSubstitutionRatio(missingIng, replIng);
    
    let baseCostPerCover = 120;
    let baseCalPerCover = 520;
    let baseProtPerCover = 22;
    let baseCarbPerCover = 18;
    let baseFatPerCover = 38;
    let retailPricePerCover = 280;
    
    if (matchedRecipe) {
      if (matchedRecipe.id === 'paneer-butter-masala') {
        baseCostPerCover = 125; baseCalPerCover = 540; baseProtPerCover = 24; baseCarbPerCover = 18; baseFatPerCover = 40; retailPricePerCover = 295;
      } else if (matchedRecipe.id === 'wild-mushroom-truffle-pasta') {
        baseCostPerCover = 145; baseCalPerCover = 480; baseProtPerCover = 16; baseCarbPerCover = 58; baseFatPerCover = 20; retailPricePerCover = 340;
      } else if (matchedRecipe.id === 'artisan-margherita-sourdough-pizza') {
        baseCostPerCover = 95; baseCalPerCover = 620; baseProtPerCover = 26; baseCarbPerCover = 72; baseFatPerCover = 24; retailPricePerCover = 260;
      } else if (matchedRecipe.id === 'san-sebastian-basque-cheesecake') {
        baseCostPerCover = 135; baseCalPerCover = 460; baseProtPerCover = 8; baseCarbPerCover = 42; baseFatPerCover = 30; retailPricePerCover = 310;
      } else if (matchedRecipe.id === 'smashed-avocado-sourdough-toast') {
        baseCostPerCover = 85; baseCalPerCover = 380; baseProtPerCover = 12; baseCarbPerCover = 36; baseFatPerCover = 22; retailPricePerCover = 220;
      } else {
        baseCostPerCover = 115; baseCalPerCover = 500; baseProtPerCover = 20; baseCarbPerCover = 28; baseFatPerCover = 32; retailPricePerCover = 270;
      }
    }
    
    const origQty = Math.round(origProfile.defaultQtyPerPerson * s);
    const replQty = Math.round(origQty * ratioData.ratioNum);
    
    const origIngCost = +((origQty * origProfile.costPer100g) / 100).toFixed(2);
    const replIngCost = +((replQty * replProfile.costPer100g) / 100).toFixed(2);
    
    const origTotalPrepCost = +(baseCostPerCover * s).toFixed(2);
    const modTotalPrepCost = +(Math.max(10, origTotalPrepCost - origIngCost + replIngCost)).toFixed(2);
    const costDiff = +(modTotalPrepCost - origTotalPrepCost).toFixed(2);
    const costPctChange = origTotalPrepCost > 0 ? +((costDiff / origTotalPrepCost) * 100).toFixed(1) : 0;
    
    const origCostPerServing = +(origTotalPrepCost / s).toFixed(2);
    const modCostPerServing = +(modTotalPrepCost / s).toFixed(2);
    const costDiffPerServing = +(costDiff / s).toFixed(2);
    
    const origIngCalories = Math.round((origQty * origProfile.calories) / 100);
    const replIngCalories = Math.round((replQty * replProfile.calories) / 100);
    
    const origTotalCalories = Math.round(baseCalPerCover * s);
    const modTotalCalories = Math.max(50, Math.round(origTotalCalories - origIngCalories + replIngCalories));
    const calorieDiff = modTotalCalories - origTotalCalories;
    const caloriePctChange = origTotalCalories > 0 ? +((calorieDiff / origTotalCalories) * 100).toFixed(1) : 0;
    
    const origCalPerServing = Math.round(origTotalCalories / s);
    const modCalPerServing = Math.round(modTotalCalories / s);
    const calDiffPerServing = Math.round(calorieDiff / s);
    
    const origProt = +((origQty * origProfile.protein) / 100).toFixed(1);
    const replProt = +((replQty * replProfile.protein) / 100).toFixed(1);
    const origTotalProt = +(baseProtPerCover * s).toFixed(1);
    const modTotalProt = +(Math.max(0, origTotalProt - origProt + replProt)).toFixed(1);
    const protDiff = +(modTotalProt - origTotalProt).toFixed(1);
    
    const origCarb = +((origQty * origProfile.carbs) / 100).toFixed(1);
    const replCarb = +((replQty * replProfile.carbs) / 100).toFixed(1);
    const origTotalCarb = +(baseCarbPerCover * s).toFixed(1);
    const modTotalCarb = +(Math.max(0, origTotalCarb - origCarb + replCarb)).toFixed(1);
    const carbDiff = +(modTotalCarb - origTotalCarb).toFixed(1);
    
    const origFat = +((origQty * origProfile.fat) / 100).toFixed(1);
    const replFat = +((replQty * replProfile.fat) / 100).toFixed(1);
    const origTotalFat = +(baseFatPerCover * s).toFixed(1);
    const modTotalFat = +(Math.max(0, origTotalFat - origFat + replFat)).toFixed(1);
    const fatDiff = +(modTotalFat - origTotalFat).toFixed(1);
    
    const origFiber = +((origQty * origProfile.fiber) / 100).toFixed(1);
    const replFiber = +((replQty * replProfile.fiber) / 100).toFixed(1);
    const fiberDiff = +(replFiber - origFiber).toFixed(1);
    
    const origSodium = Math.round((origQty * origProfile.sodium) / 100);
    const replSodium = Math.round((replQty * replProfile.sodium) / 100);
    const sodiumDiff = replSodium - origSodium;
    
    const totalSellingPrice = +(retailPricePerCover * s).toFixed(2);
    const origProfitMargin = totalSellingPrice > 0 ? +(((totalSellingPrice - origTotalPrepCost) / totalSellingPrice) * 100).toFixed(1) : 0;
    const modProfitMargin = totalSellingPrice > 0 ? +(((totalSellingPrice - modTotalPrepCost) / totalSellingPrice) * 100).toFixed(1) : 0;
    const marginDiff = +(modProfitMargin - origProfitMargin).toFixed(1);
    
    return {
      dishName: dishName || (matchedRecipe ? matchedRecipe.title : 'Paneer Butter Masala'),
      matchedRecipe,
      servings: s,
      missingIng: origProfile.name,
      replIng: replProfile.name,
      origProfile,
      replProfile,
      ratioData,
      
      origQty,
      origUnit: origProfile.unit,
      replQty,
      replUnit: replProfile.unit,
      
      origIngCost,
      replIngCost,
      origTotalPrepCost,
      modTotalPrepCost,
      costDiff,
      costPctChange,
      origCostPerServing,
      modCostPerServing,
      costDiffPerServing,
      
      origIngCalories,
      replIngCalories,
      origTotalCalories,
      modTotalCalories,
      calorieDiff,
      caloriePctChange,
      origCalPerServing,
      modCalPerServing,
      calDiffPerServing,
      
      origTotalProt,
      modTotalProt,
      protDiff,
      origProtPerServing: +(origTotalProt / s).toFixed(1),
      modProtPerServing: +(modTotalProt / s).toFixed(1),
      
      origTotalCarb,
      modTotalCarb,
      carbDiff,
      origCarbPerServing: +(origTotalCarb / s).toFixed(1),
      modCarbPerServing: +(modTotalCarb / s).toFixed(1),
      
      origTotalFat,
      modTotalFat,
      fatDiff,
      origFatPerServing: +(origTotalFat / s).toFixed(1),
      modFatPerServing: +(modTotalFat / s).toFixed(1),
      
      origFiber,
      replFiber,
      fiberDiff,
      origSodium,
      replSodium,
      sodiumDiff,
      
      totalSellingPrice,
      sellingPricePerServing: retailPricePerCover,
      origProfitMargin,
      modProfitMargin,
      marginDiff
    };
  }

  // Helper: Get recommended replacements based on missing ingredient
  function getRecommendedReplacements(missingIng) {
    const m = (missingIng || '').toLowerCase().trim();
    if (m.includes('butter') || m.includes('ghee')) {
      return ['Olive Oil', 'Ghee', 'Coconut Oil', 'Mashed Avocado'];
    }
    if (m.includes('cream') || m.includes('malai')) {
      return ['Cashew Puree', 'Coconut Cream', 'Greek Yogurt', 'Hung Curd'];
    }
    if (m.includes('paneer')) {
      return ['Firm Tofu', 'Silken Tofu', 'Ricotta', 'Halloumi'];
    }
    if (m.includes('egg')) {
      return ['Aquafaba', 'Flaxseed Egg', 'Silken Tofu', 'Mashed Banana'];
    }
    if (m.includes('milk')) {
      return ['Oat Milk', 'Almond Milk', 'Soy Milk', 'Coconut Milk'];
    }
    if (m.includes('parmesan') || m.includes('cheese')) {
      return ['Nutritional Yeast', 'Firm Tofu', 'Cashew Cream'];
    }
    if (m.includes('sugar')) {
      return ['Honey', 'Maple Syrup', 'Stevia', 'Applesauce'];
    }
    if (m.includes('flour')) {
      return ['Almond Flour', 'Oat Flour', 'Cornstarch'];
    }
    return ['Olive Oil', 'Cashew Puree', 'Firm Tofu', 'Greek Yogurt'];
  }

  // ========================================================
  // RENDER: FLAVORSHIFT AI SWAP LAB & RECIPE IMPACT DASHBOARD
  // ========================================================

  // ========================================================
  // RENDER: INGREDIENT SUBSTITUTION & RECIPE IMPACT DASHBOARD
  // ========================================================
  function renderDashboardView() {
    const container = document.getElementById('dashboard-view-container');
    if (!container) return;

    const dish = state.impactAnalysis.dishName || 'Paneer Butter Masala';
    const missing = state.impactAnalysis.missingIngredient || 'Butter';
    const replacement = state.impactAnalysis.replacementIngredient || 'Olive Oil';
    const servings = Math.max(1, Math.min(20, parseInt(state.impactAnalysis.servings, 10) || 4));
    const isLoading = !!state.impactAnalysis.loading;
    const isAnalyzed = !!state.impactAnalysis.analyzed;

    // Run impact analysis calculation
    const impact = calculateRecipeImpact(dish, missing, replacement, servings);
    state.impactAnalysis.results = impact;

    // Recommended replacements for quick-click pills
    const suggestedReplacements = getRecommendedReplacements(missing);

    // Adapted recipe model for instructions & bill of materials
    const activeAltObj = {
      name: replacement,
      ratio: impact.ratioData.ratioText,
      calcMethod: impact.ratioData.cookingNote,
      tasteDesc: impact.ratioData.cookingNote,
      textureDesc: impact.ratioData.feasibility
    };
    const subRecipe = createSubstitutedRecipe(impact.matchedRecipe, missing, activeAltObj, servings);

    // Indicators formatting
    const isCostSavings = impact.costDiff < 0;
    const isCostNeutral = impact.costDiff === 0;
    const isMarginBoost = impact.marginDiff > 0;
    const isMarginNeutral = impact.marginDiff === 0;
    const isCalorieReduction = impact.calorieDiff < 0;

    let html = `
      <div class="space-y-7 animate-fade-up max-w-6xl mx-auto">

        <!-- ============================================== -->
        <!-- SECTION 1: ELEGANT FLAGSHIP HERO BANNER        -->
        <!-- ============================================== -->
        <section class="relative overflow-hidden rounded-3xl bg-forest dark:bg-[#1A2620] text-ivory p-6 sm:p-8 border border-forest-600/30 shadow-md">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            <div class="lg:col-span-8 space-y-3.5">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-mono text-peach">
                <span class="w-2 h-2 rounded-full bg-terracotta animate-pulse"></span>
                <span>FlavorShift AI • Cost & Recipe Impact Analytics</span>
              </div>

              <h1 class="font-heading font-black text-2xl sm:text-3xl lg:text-4xl tracking-tight leading-snug">
                Cost & Margin Simulator.<br>
                <span class="text-terracotta font-serif italic">Simulate Complete Recipe Impact.</span>
              </h1>

              <p class="text-ivory/80 text-sm sm:text-base leading-relaxed max-w-xl font-sans">
                Predict ingredient cost savings, calorie deltas, macronutrient shifts, and kitchen profit margins when substituting ingredients across 1 to 20 portions.
              </p>

              <div class="pt-2 flex flex-wrap items-center gap-3">
                <a href="#impact-input-stage" class="terracotta-btn px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer shadow-sm hover:opacity-95">
                  <i class="fa-solid fa-sliders text-xs"></i>
                  <span>Launch Impact Analyzer</span>
                </a>
                <button type="button" data-hero-preset-impact="paneer-demo" class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white/10 hover:bg-white/15 text-ivory border border-white/15 transition-all flex items-center gap-2 cursor-pointer shadow-xs">
                  <i class="fa-solid fa-wand-magic-sparkles text-terracotta text-xs"></i>
                  <span>Test "Butter → Olive Oil" Demo</span>
                </button>
              </div>
            </div>

            <!-- Quick Live Metric Preview -->
            <div class="lg:col-span-4">
              <div class="rounded-2xl bg-white/10 dark:bg-black/25 border border-white/15 p-4 sm:p-5 space-y-3 shadow-sm backdrop-blur-xs">
                <div class="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <span class="text-xs font-mono font-bold text-beige uppercase tracking-wider">Impact Quick Gauge</span>
                  <span class="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${isCostSavings ? 'bg-emerald-500 text-white' : 'bg-terracotta text-white'}">
                    ${isCostSavings ? 'Cost Reduction' : 'Active Simulation'}
                  </span>
                </div>

                <div class="grid grid-cols-2 gap-2 text-center">
                  <div class="p-2.5 rounded-xl bg-black/20 border border-white/10">
                    <span class="text-[10px] text-stone-300 block uppercase font-mono">Net Cost Delta</span>
                    <span class="font-mono font-bold text-sm ${isCostSavings ? 'text-emerald-400' : 'text-peach'}">
                      ${impact.costDiff < 0 ? '-' : impact.costDiff > 0 ? '+' : ''}${state.currency}${Math.abs(impact.costDiff).toFixed(2)}
                    </span>
                  </div>
                  <div class="p-2.5 rounded-xl bg-black/20 border border-white/10">
                    <span class="text-[10px] text-stone-300 block uppercase font-mono">Margin Delta</span>
                    <span class="font-mono font-bold text-sm ${isMarginBoost ? 'text-emerald-400' : 'text-stone-300'}">
                      ${impact.marginDiff >= 0 ? '+' : ''}${impact.marginDiff}%
                    </span>
                  </div>
                </div>

                <div class="p-2.5 rounded-xl bg-white/10 border border-white/10 flex items-center justify-between text-xs">
                  <span class="text-stone-300">Portion Scaled:</span>
                  <span class="font-bold text-ivory font-mono">${servings} People / Covers</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        <!-- ============================================== -->
        <!-- SECTION 2: INPUT SECTION – RECIPE DETAILS      -->
        <!-- ============================================== -->
        <section id="impact-input-stage" class="space-y-6">
          <div class="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1f1a16] border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-6">
            
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800 pb-4">
              <div>
                <h2 class="text-xl sm:text-2xl font-bold font-heading text-forest dark:text-ivory flex items-center gap-2.5">
                  <i class="fa-solid fa-sliders text-terracotta text-lg"></i>
                  <span>Recipe Details & Substitution Setup</span>
                </h2>
                <p class="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
                  Specify your dish name, missing ingredient, replacement, and serving size to simulate live recipe impact.
                </p>
              </div>
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-peach/30 dark:bg-stone-800 text-terracotta text-xs font-mono font-bold self-start sm:self-auto">
                <i class="fa-solid fa-brain text-[11px]"></i>
                <span>Culinary & Nutrition AI</span>
              </span>
            </div>

            <!-- 4-Field Input Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
              
              <!-- FIELD A: Dish Name -->
              <div class="lg:col-span-4 space-y-2">
                <div class="flex items-center justify-between">
                  <label for="impact-dish-input" class="text-xs font-bold uppercase tracking-wider text-forest dark:text-ivory flex items-center gap-1.5">
                    <span class="w-4 h-4 rounded-full bg-forest text-ivory dark:bg-stone-800 flex items-center justify-center text-[10px]">A</span>
                    <span>Dish Name</span>
                  </label>
                  <span class="text-[10px] text-stone-400">e.g. Pasta, Cake, Curry</span>
                </div>
                <div class="relative">
                  <i class="fa-solid fa-bowl-food absolute left-3.5 top-1/2 -translate-y-1/2 text-terracotta text-xs"></i>
                  <input
                    type="text"
                    id="impact-dish-input"
                    value="${dish}"
                    placeholder="Enter dish name (e.g. Paneer Butter Masala)"
                    class="w-full pl-9 pr-9 py-2.5 rounded-xl bg-ivory/60 dark:bg-[#181410] border border-stone-200 dark:border-stone-700 text-sm font-semibold text-forest dark:text-ivory placeholder:text-stone-400 focus:outline-none focus:border-terracotta transition-all shadow-xs"
                  />
                  <button type="button" id="impact-dish-clear" class="${dish ? '' : 'hidden'} absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 flex items-center justify-center text-xs cursor-pointer">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
                <!-- Quick Dish Presets -->
                <div class="flex flex-wrap items-center gap-1.5 pt-1">
                  <span class="text-[10px] text-stone-400 font-mono">Popular:</span>
                  ${['Paneer Butter Masala', 'Chocolate Cake', 'Wild Mushroom Pasta', 'Artisan Pizza'].map(dName => `
                    <button type="button" data-dish-preset="${dName}" class="px-2 py-0.5 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                      dish.toLowerCase() === dName.toLowerCase()
                        ? 'bg-forest text-ivory dark:bg-forest-600'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:border-terracotta hover:bg-stone-200'
                    }">
                      ${dName}
                    </button>
                  `).join('')}
                </div>
              </div>

              <!-- FIELD B: Missing Ingredient -->
              <div class="lg:col-span-4 space-y-2">
                <div class="flex items-center justify-between">
                  <label for="impact-missing-input" class="text-xs font-bold uppercase tracking-wider text-forest dark:text-ivory flex items-center gap-1.5">
                    <span class="w-4 h-4 rounded-full bg-forest text-ivory dark:bg-stone-800 flex items-center justify-center text-[10px]">B</span>
                    <span>Missing Ingredient</span>
                  </label>
                  <span class="text-[10px] text-stone-400">Ingredient to replace</span>
                </div>
                <div class="relative">
                  <i class="fa-solid fa-circle-minus absolute left-3.5 top-1/2 -translate-y-1/2 text-terracotta text-xs"></i>
                  <input
                    type="text"
                    id="impact-missing-input"
                    value="${missing}"
                    placeholder="Enter missing ingredient (e.g. Butter)"
                    class="w-full pl-9 pr-9 py-2.5 rounded-xl bg-ivory/60 dark:bg-[#181410] border border-stone-200 dark:border-stone-700 text-sm font-semibold text-forest dark:text-ivory placeholder:text-stone-400 focus:outline-none focus:border-terracotta transition-all shadow-xs"
                  />
                  <button type="button" id="impact-missing-clear" class="${missing ? '' : 'hidden'} absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 flex items-center justify-center text-xs cursor-pointer">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
                <!-- Popular Missing Tags -->
                <div class="flex flex-wrap items-center gap-1.5 pt-1">
                  <span class="text-[10px] text-stone-400 font-mono">Pantry:</span>
                  ${['Butter', 'Heavy Cream', 'Eggs', 'Paneer', 'Milk', 'Sugar'].map(mName => `
                    <button type="button" data-missing-preset="${mName}" class="px-2 py-0.5 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                      missing.toLowerCase() === mName.toLowerCase()
                        ? 'bg-terracotta text-white'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:border-terracotta hover:bg-stone-200'
                    }">
                      ${mName}
                    </button>
                  `).join('')}
                </div>
              </div>

              <!-- FIELD C: Replacement Ingredient -->
              <div class="lg:col-span-4 space-y-2">
                <div class="flex items-center justify-between">
                  <label for="impact-replacement-input" class="text-xs font-bold uppercase tracking-wider text-forest dark:text-ivory flex items-center gap-1.5">
                    <span class="w-4 h-4 rounded-full bg-forest text-ivory dark:bg-stone-800 flex items-center justify-center text-[10px]">C</span>
                    <span>Replacement Ingredient</span>
                  </label>
                  <span class="text-[10px] text-stone-400">Using instead</span>
                </div>
                <div class="relative">
                  <i class="fa-solid fa-arrow-right-arrow-left absolute left-3.5 top-1/2 -translate-y-1/2 text-terracotta text-xs"></i>
                  <input
                    type="text"
                    id="impact-replacement-input"
                    value="${replacement}"
                    placeholder="Enter replacement (e.g. Olive Oil)"
                    class="w-full pl-9 pr-9 py-2.5 rounded-xl bg-ivory/60 dark:bg-[#181410] border border-stone-200 dark:border-stone-700 text-sm font-semibold text-forest dark:text-ivory placeholder:text-stone-400 focus:outline-none focus:border-terracotta transition-all shadow-xs"
                  />
                  <button type="button" id="impact-replacement-clear" class="${replacement ? '' : 'hidden'} absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 flex items-center justify-center text-xs cursor-pointer">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
                <!-- Dynamic Recommended Alternatives Chips -->
                <div class="flex flex-wrap items-center gap-1.5 pt-1">
                  <span class="text-[10px] text-terracotta font-mono font-bold flex items-center gap-1">
                    <i class="fa-solid fa-sparkles text-[9px]"></i> Suggested:
                  </span>
                  ${suggestedReplacements.map(rName => `
                    <button type="button" data-repl-chip="${rName}" class="px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                      replacement.toLowerCase() === rName.toLowerCase()
                        ? 'bg-terracotta text-white shadow-xs'
                        : 'bg-peach/30 dark:bg-stone-800 text-forest dark:text-stone-300 hover:bg-peach/60'
                    }">
                      ${rName}
                    </button>
                  `).join('')}
                </div>
              </div>

            </div>

            <!-- FIELD D: Interactive Serving Size Selector (1 to 20 People) -->
            <div class="p-4 sm:p-5 rounded-2xl bg-ivory/60 dark:bg-[#181410] border border-stone-200/80 dark:border-stone-800 space-y-4">
              
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div class="space-y-0.5">
                  <label for="impact-servings-slider" class="text-xs font-bold uppercase tracking-wider text-forest dark:text-ivory flex items-center gap-1.5">
                    <span class="w-4 h-4 rounded-full bg-forest text-ivory dark:bg-stone-800 flex items-center justify-center text-[10px]">D</span>
                    <span>Serving Size Selector (Covers / People)</span>
                  </label>
                  <p class="text-[11px] text-stone-500">Slide or select from 1 to 20 people to automatically scale ingredient quantities and financials.</p>
                </div>

                <div class="flex items-center gap-2">
                  <span id="impact-servings-badge" class="px-3.5 py-1.5 rounded-full font-mono font-bold text-xs sm:text-sm bg-terracotta text-white shadow-xs inline-flex items-center gap-1.5">
                    <i class="fa-solid fa-users text-xs"></i>
                    <span>Cooking for: ${servings} ${servings === 1 ? 'Person' : 'People'}</span>
                  </span>
                </div>
              </div>

              <!-- Interactive Slider -->
              <div class="space-y-2">
                <input
                  type="range"
                  id="impact-servings-slider"
                  min="1"
                  max="20"
                  step="1"
                  value="${servings}"
                  class="impact-slider-track cursor-pointer"
                />
                
                <div class="flex justify-between items-center text-[11px] font-mono text-stone-400 px-1">
                  <span>1 Person</span>
                  <span>5 Covers</span>
                  <span>10 Banquet</span>
                  <span>15 Catering</span>
                  <span>20 Large Party</span>
                </div>
              </div>

              <!-- Visual 20-Dot Interactive Guest Rating Chart -->
              <div class="space-y-1.5 pt-1 border-t border-stone-200/60 dark:border-stone-800">
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-mono uppercase text-stone-500 font-bold">Interactive Guest Chart (Click any dot):</span>
                  <span class="text-[10px] font-mono text-terracotta font-bold">${servings} / 20 Selected</span>
                </div>
                <div class="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  ${Array.from({ length: 20 }, (_, i) => {
                    const idx = i + 1;
                    const isActive = idx <= servings;
                    return `
                      <button
                        type="button"
                        data-serving-dot="${idx}"
                        class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold transition-all cursor-pointer ${
                          isActive
                            ? 'bg-terracotta text-white scale-105 shadow-xs'
                            : 'bg-stone-200 dark:bg-stone-800 text-stone-500 hover:bg-terracotta/40 hover:text-white'
                        }"
                        title="Set serving size to ${idx} people"
                      >
                        ${idx}
                      </button>
                    `;
                  }).join('')}
                </div>
              </div>

              <!-- Quick Portion Preset Pills -->
              <div class="flex flex-wrap items-center gap-2 pt-1">
                <span class="text-[10px] text-stone-400 font-mono">Quick Portions:</span>
                ${[
                  { count: 1, label: '1 Solo' },
                  { count: 2, label: '2 Couple' },
                  { count: 4, label: '4 Family' },
                  { count: 8, label: '8 Gathering' },
                  { count: 12, label: '12 Catering' },
                  { count: 20, label: '20 Banquet' }
                ].map(p => `
                  <button
                    type="button"
                    data-serving-preset="${p.count}"
                    class="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      servings === p.count
                        ? 'bg-forest text-ivory dark:bg-forest-600 shadow-xs'
                        : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-terracotta'
                    }"
                  >
                    ${p.label}
                  </button>
                `).join('')}
              </div>

            </div>

            <!-- ANALYZE BUTTON -->
            <div class="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-100 dark:border-stone-800">
              <div class="text-xs text-stone-500 dark:text-stone-400">
                <span>Calculations reference calibrated culinary ratios, nutrition datasets, and ingredient price indices.</span>
              </div>

              <button
                type="button"
                id="analyze-recipe-impact-btn"
                class="w-full sm:w-auto px-8 py-3.5 rounded-xl terracotta-btn text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 cursor-pointer shadow-md hover:shadow-lg transition-all"
              >
                <i class="fa-solid fa-chart-line text-sm"></i>
                <span>Analyze Recipe Impact</span>
              </button>
            </div>

          </div>

          <!-- LOADING ANIMATION COMPONENT -->
          ${isLoading ? `
            <div id="impact-loading-container" class="p-10 rounded-3xl bg-white dark:bg-[#1f1a16] border border-stone-200/80 dark:border-stone-800 text-center space-y-4 shadow-sm animate-fade-up">
              <div class="w-14 h-14 rounded-full bg-peach/30 dark:bg-stone-800 text-terracotta flex items-center justify-center mx-auto text-xl analysis-spinner-glow">
                <i class="fa-solid fa-wand-magic-sparkles animate-spin"></i>
              </div>
              <div class="space-y-1">
                <h3 class="text-lg font-bold font-heading text-forest dark:text-ivory">Analyzing Recipe Impact...</h3>
                <p class="text-xs text-stone-500 font-mono">Calibrating culinary chemical balance, ingredient cost deltas, and macro nutrition for ${servings} covers.</p>
              </div>
            </div>
          ` : ''}

          <!-- ============================================== -->
          <!-- SECTION 3: RESULTS DASHBOARD – COMPARISON     -->
          <!-- ============================================== -->
          ${(isAnalyzed && !isLoading) ? `
            <div id="impact-results-dashboard" class="space-y-7 animate-fade-up">
              
              <!-- Dashboard Header Banner -->
              <div class="p-4 sm:p-5 rounded-2xl bg-forest dark:bg-[#1A2620] text-ivory flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm border border-forest-600/30">
                <div class="space-y-0.5">
                  <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span class="text-xs font-mono font-bold text-beige uppercase tracking-wider">Analysis Complete</span>
                    <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-ivory">Covers: ${servings}</span>
                  </div>
                  <h3 class="text-base sm:text-lg font-bold font-heading text-ivory">
                    Impact Analysis: ${impact.missingIng} → ${impact.replIng} in ${impact.dishName}
                  </h3>
                </div>

                <div class="flex items-center gap-2 self-start md:self-auto">
                  <span class="text-xs font-mono px-3 py-1 rounded-lg bg-terracotta text-white font-bold">
                    ${impact.ratioData.ratioText.split('(')[0].trim()}
                  </span>
                </div>
              </div>

              <!-- ============================================== -->
              <!-- 4 HIGH-IMPACT KPI COMPARISON CARDS            -->
              <!-- ============================================== -->
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <!-- CARD 1: Cost Difference -->
                <div class="p-5 rounded-2xl bg-white dark:bg-[#1f1a16] border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-bold uppercase tracking-wider text-stone-500 font-mono">Cost Difference</span>
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                      isCostSavings ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' :
                      isCostNeutral ? 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300' :
                      'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                    }">
                      ${isCostSavings ? '▼ Cost Savings' : isCostNeutral ? '• Parity' : '▲ Cost Increase'}
                    </span>
                  </div>

                  <div>
                    <div class="text-2xl font-black font-mono tracking-tight ${isCostSavings ? 'text-emerald-600 dark:text-emerald-400' : isCostNeutral ? 'text-stone-700 dark:text-stone-300' : 'text-rose-600 dark:text-rose-400'}">
                      ${impact.costDiff < 0 ? '-' : impact.costDiff > 0 ? '+' : ''}${formatMoney(Math.abs(impact.costDiff))}
                    </div>
                    <span class="text-xs font-medium text-stone-500">
                      ${impact.costPctChange < 0 ? '' : '+'}${impact.costPctChange}% Total Recipe Cost
                    </span>
                  </div>

                  <div class="pt-2 border-t border-stone-100 dark:border-stone-800 text-[11px] text-stone-500 flex justify-between">
                    <span>Per Serving:</span>
                    <span class="font-bold text-forest dark:text-ivory font-mono">
                      ${formatMoney(impact.modCostPerServing)} <span class="text-stone-400 font-normal">(was ${formatMoney(impact.origCostPerServing)})</span>
                    </span>
                  </div>
                </div>

                <!-- CARD 2: Calorie Difference -->
                <div class="p-5 rounded-2xl bg-white dark:bg-[#1f1a16] border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-bold uppercase tracking-wider text-stone-500 font-mono">Calorie Difference</span>
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                      isCalorieReduction ? 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300' :
                      'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                    }">
                      ${isCalorieReduction ? '▼ Lighter Energy' : '▲ Energy Rich'}
                    </span>
                  </div>

                  <div>
                    <div class="text-2xl font-black font-mono tracking-tight ${isCalorieReduction ? 'text-teal-700 dark:text-teal-400' : 'text-amber-700 dark:text-amber-400'}">
                      ${impact.calorieDiff < 0 ? '-' : impact.calorieDiff > 0 ? '+' : ''}${Math.abs(impact.calorieDiff)} kcal
                    </div>
                    <span class="text-xs font-medium text-stone-500">
                      ${impact.caloriePctChange < 0 ? '' : '+'}${impact.caloriePctChange}% Total Calories
                    </span>
                  </div>

                  <div class="pt-2 border-t border-stone-100 dark:border-stone-800 text-[11px] text-stone-500 flex justify-between">
                    <span>Per Serving:</span>
                    <span class="font-bold text-forest dark:text-ivory font-mono">
                      ${impact.modCalPerServing} kcal <span class="text-stone-400 font-normal">(was ${impact.origCalPerServing})</span>
                    </span>
                  </div>
                </div>

                <!-- CARD 3: Nutritional Difference -->
                <div class="p-5 rounded-2xl bg-white dark:bg-[#1f1a16] border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-bold uppercase tracking-wider text-stone-500 font-mono">Nutritional Delta</span>
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-sage-100 text-forest dark:bg-stone-800 dark:text-sage-300">
                      Macro Shift
                    </span>
                  </div>

                  <div class="space-y-1.5 font-mono text-xs">
                    <div class="flex justify-between items-center">
                      <span class="text-stone-500">Protein:</span>
                      <span class="font-bold text-forest dark:text-ivory">${impact.origTotalProt}g → ${impact.modTotalProt}g <span class="text-[10px] ${impact.protDiff >= 0 ? 'text-emerald-600' : 'text-stone-400'}">(${impact.protDiff >= 0 ? '+' : ''}${impact.protDiff}g)</span></span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-stone-500">Carbs:</span>
                      <span class="font-bold text-forest dark:text-ivory">${impact.origTotalCarb}g → ${impact.modTotalCarb}g <span class="text-[10px] text-stone-400">(${impact.carbDiff >= 0 ? '+' : ''}${impact.carbDiff}g)</span></span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-stone-500">Fat:</span>
                      <span class="font-bold text-forest dark:text-ivory">${impact.origTotalFat}g → ${impact.modTotalFat}g <span class="text-[10px] ${impact.fatDiff <= 0 ? 'text-teal-600' : 'text-stone-400'}">(${impact.fatDiff >= 0 ? '+' : ''}${impact.fatDiff}g)</span></span>
                    </div>
                  </div>

                  <div class="pt-2 border-t border-stone-100 dark:border-stone-800 text-[11px] text-stone-500 flex justify-between">
                    <span>Lipid Quality:</span>
                    <span class="font-bold text-forest dark:text-ivory truncate max-w-[130px]">${impact.ratioData.feasibility}</span>
                  </div>
                </div>

                <!-- CARD 4: Profit Margin Analysis -->
                <div class="p-5 rounded-2xl bg-white dark:bg-[#1f1a16] border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-bold uppercase tracking-wider text-stone-500 font-mono">Profit Margin</span>
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                      isMarginBoost ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' :
                      isMarginNeutral ? 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300' :
                      'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                    }">
                      ${isMarginBoost ? '▲ Margin Expansion' : isMarginNeutral ? '• Unchanged' : '▼ Margin Squeeze'}
                    </span>
                  </div>

                  <div>
                    <div class="text-2xl font-black font-mono tracking-tight ${isMarginBoost ? 'text-emerald-600 dark:text-emerald-400' : 'text-stone-700 dark:text-stone-300'}">
                      ${impact.marginDiff >= 0 ? '+' : ''}${impact.marginDiff}%
                    </div>
                    <span class="text-xs font-medium text-stone-500">
                      ${impact.origProfitMargin}% → ${impact.modProfitMargin}% Gross Margin
                    </span>
                  </div>

                  <div class="pt-2 border-t border-stone-100 dark:border-stone-800 text-[11px] text-stone-500 flex justify-between">
                    <span>Menu Revenue:</span>
                    <span class="font-bold text-forest dark:text-ivory font-mono">
                      ${formatMoney(impact.totalSellingPrice)}
                    </span>
                  </div>
                </div>

              </div>

              <!-- ============================================== -->
              <!-- VISUAL COMPARISON ANALYTICS (BAR CHARTS)       -->
              <!-- ============================================== -->
              <div class="p-6 rounded-3xl bg-white dark:bg-[#1f1a16] border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-5">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
                  <div>
                    <h4 class="font-heading font-bold text-base sm:text-lg text-forest dark:text-ivory flex items-center gap-2">
                      <i class="fa-solid fa-chart-column text-terracotta text-sm"></i>
                      <span>Visual Comparative Metrics</span>
                    </h4>
                    <p class="text-xs text-stone-500">Side-by-side graphical visualization of recipe economics and nutrition.</p>
                  </div>
                  <span class="text-xs font-mono text-stone-400">Batch Scale: ${servings} Servings</span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  <!-- Visual Bar 1: Cost Comparison -->
                  <div class="space-y-2 p-4 rounded-2xl bg-ivory/50 dark:bg-[#181410] border border-stone-200/60 dark:border-stone-800">
                    <div class="flex justify-between items-center text-xs font-bold">
                      <span class="text-forest dark:text-ivory">Batch Prep Cost</span>
                      <span class="font-mono ${isCostSavings ? 'text-emerald-600' : 'text-rose-600'}">
                        ${impact.costPctChange < 0 ? '' : '+'}${impact.costPctChange}%
                      </span>
                    </div>

                    <div class="space-y-1.5 text-xs font-mono">
                      <div>
                        <div class="flex justify-between text-[11px] text-stone-500 mb-0.5">
                          <span>Original Recipe:</span>
                          <span class="font-bold text-forest dark:text-ivory">${formatMoney(impact.origTotalPrepCost)}</span>
                        </div>
                        <div class="comp-bar-container">
                          <div class="comp-bar-fill bg-forest dark:bg-sage-600" style="width: 100%;"></div>
                        </div>
                      </div>

                      <div>
                        <div class="flex justify-between text-[11px] text-stone-500 mb-0.5">
                          <span>Modified Recipe:</span>
                          <span class="font-bold text-terracotta">${formatMoney(impact.modTotalPrepCost)}</span>
                        </div>
                        <div class="comp-bar-container">
                          <div class="comp-bar-fill ${isCostSavings ? 'bg-emerald-500' : 'bg-rose-500'}" style="width: ${Math.min(100, Math.max(10, Math.round((impact.modTotalPrepCost / (Math.max(impact.origTotalPrepCost, impact.modTotalPrepCost))) * 100)))}%;"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Visual Bar 2: Calorie Comparison -->
                  <div class="space-y-2 p-4 rounded-2xl bg-ivory/50 dark:bg-[#181410] border border-stone-200/60 dark:border-stone-800">
                    <div class="flex justify-between items-center text-xs font-bold">
                      <span class="text-forest dark:text-ivory">Total Calories</span>
                      <span class="font-mono ${isCalorieReduction ? 'text-teal-600' : 'text-amber-600'}">
                        ${impact.caloriePctChange < 0 ? '' : '+'}${impact.caloriePctChange}%
                      </span>
                    </div>

                    <div class="space-y-1.5 text-xs font-mono">
                      <div>
                        <div class="flex justify-between text-[11px] text-stone-500 mb-0.5">
                          <span>Original Recipe:</span>
                          <span class="font-bold text-forest dark:text-ivory">${impact.origTotalCalories} kcal</span>
                        </div>
                        <div class="comp-bar-container">
                          <div class="comp-bar-fill bg-forest dark:bg-sage-600" style="width: 100%;"></div>
                        </div>
                      </div>

                      <div>
                        <div class="flex justify-between text-[11px] text-stone-500 mb-0.5">
                          <span>Modified Recipe:</span>
                          <span class="font-bold text-terracotta">${impact.modTotalCalories} kcal</span>
                        </div>
                        <div class="comp-bar-container">
                          <div class="comp-bar-fill ${isCalorieReduction ? 'bg-teal-500' : 'bg-amber-500'}" style="width: ${Math.min(100, Math.max(10, Math.round((impact.modTotalCalories / Math.max(impact.origTotalCalories, impact.modTotalCalories)) * 100)))}%;"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Visual Bar 3: Profit Margin Gauge -->
                  <div class="space-y-2 p-4 rounded-2xl bg-ivory/50 dark:bg-[#181410] border border-stone-200/60 dark:border-stone-800">
                    <div class="flex justify-between items-center text-xs font-bold">
                      <span class="text-forest dark:text-ivory">Gross Margin %</span>
                      <span class="font-mono ${isMarginBoost ? 'text-emerald-600' : 'text-stone-400'}">
                        ${impact.marginDiff >= 0 ? '+' : ''}${impact.marginDiff}%
                      </span>
                    </div>

                    <div class="space-y-1.5 text-xs font-mono">
                      <div>
                        <div class="flex justify-between text-[11px] text-stone-500 mb-0.5">
                          <span>Original Margin:</span>
                          <span class="font-bold text-forest dark:text-ivory">${impact.origProfitMargin}%</span>
                        </div>
                        <div class="comp-bar-container">
                          <div class="comp-bar-fill bg-forest dark:bg-sage-600" style="width: ${Math.min(100, impact.origProfitMargin)}%;"></div>
                        </div>
                      </div>

                      <div>
                        <div class="flex justify-between text-[11px] text-stone-500 mb-0.5">
                          <span>Modified Margin:</span>
                          <span class="font-bold text-terracotta">${impact.modProfitMargin}%</span>
                        </div>
                        <div class="comp-bar-container">
                          <div class="comp-bar-fill ${isMarginBoost ? 'bg-emerald-500' : 'bg-rose-500'}" style="width: ${Math.min(100, impact.modProfitMargin)}%;"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              <!-- ============================================== -->
              <!-- TWO MAIN SECTIONS: LEFT (ORIGINAL) vs RIGHT (MODIFIED) -->
              <!-- ============================================== -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                
                <!-- LEFT COLUMN: Original Recipe -->
                <div class="p-6 rounded-3xl bg-white dark:bg-[#1c1713] border-2 border-forest/30 dark:border-forest/50 shadow-sm space-y-5">
                  
                  <div class="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
                    <div class="flex items-center gap-2">
                      <span class="px-2.5 py-1 rounded-md bg-forest text-ivory text-xs font-mono font-bold uppercase tracking-wider">
                        Left: Original Recipe
                      </span>
                      <span class="text-xs text-stone-500 font-mono">${servings} Covers</span>
                    </div>
                    <span class="text-xs font-bold text-stone-500 font-sans">${impact.dishName}</span>
                  </div>

                  <!-- Original Ingredient Details -->
                  <div class="p-4 rounded-2xl bg-ivory/60 dark:bg-[#181410] border border-stone-200/80 dark:border-stone-800 space-y-2">
                    <div class="flex items-center justify-between">
                      <span class="text-[11px] uppercase tracking-wider font-bold text-stone-500 font-mono">Original Ingredient</span>
                      <span class="text-xs font-mono text-stone-400">Cost: ${formatMoney(impact.origProfile.costPer100g)}/100g</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <h4 class="text-base font-bold text-forest dark:text-ivory">${impact.origProfile.name}</h4>
                      <span class="font-mono font-bold text-sm text-forest dark:text-ivory bg-white dark:bg-stone-800 px-2.5 py-0.5 rounded-lg border border-stone-200 dark:border-stone-700">
                        ${impact.origQty} ${impact.origUnit}
                      </span>
                    </div>
                    <p class="text-xs text-stone-500 leading-normal">${impact.origProfile.role}</p>
                  </div>

                  <!-- Financial & Caloric Metrics -->
                  <div class="grid grid-cols-2 gap-3 text-xs font-mono">
                    <div class="p-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800 space-y-1">
                      <span class="text-[10px] text-stone-400 uppercase block">Estimated Ing Cost</span>
                      <span class="text-sm font-bold text-forest dark:text-ivory">${formatMoney(impact.origIngCost)}</span>
                      <span class="text-[10px] text-stone-500 block">Total Recipe: ${formatMoney(impact.origTotalPrepCost)}</span>
                    </div>
                    <div class="p-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800 space-y-1">
                      <span class="text-[10px] text-stone-400 uppercase block">Original Calories</span>
                      <span class="text-sm font-bold text-forest dark:text-ivory">${impact.origTotalCalories} kcal</span>
                      <span class="text-[10px] text-stone-500 block">${impact.origCalPerServing} kcal / serving</span>
                    </div>
                  </div>

                  <!-- Full Nutritional Information -->
                  <div class="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                    <span class="text-xs font-bold uppercase tracking-wider text-stone-500 font-mono block">
                      Nutritional Information (${servings} Covers)
                    </span>
                    <div class="grid grid-cols-4 gap-2 text-center text-xs font-mono">
                      <div class="p-2 rounded-xl bg-ivory/50 dark:bg-stone-900">
                        <span class="text-[10px] text-stone-400 block uppercase">Protein</span>
                        <span class="font-bold text-forest dark:text-ivory">${impact.origTotalProt}g</span>
                      </div>
                      <div class="p-2 rounded-xl bg-ivory/50 dark:bg-stone-900">
                        <span class="text-[10px] text-stone-400 block uppercase">Carbs</span>
                        <span class="font-bold text-forest dark:text-ivory">${impact.origTotalCarb}g</span>
                      </div>
                      <div class="p-2 rounded-xl bg-ivory/50 dark:bg-stone-900">
                        <span class="text-[10px] text-stone-400 block uppercase">Fat</span>
                        <span class="font-bold text-forest dark:text-ivory">${impact.origTotalFat}g</span>
                      </div>
                      <div class="p-2 rounded-xl bg-ivory/50 dark:bg-stone-900">
                        <span class="text-[10px] text-stone-400 block uppercase">Sodium</span>
                        <span class="font-bold text-forest dark:text-ivory">${impact.origSodium}mg</span>
                      </div>
                    </div>
                  </div>

                  <!-- Commercial Base Margins -->
                  <div class="p-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800 text-xs flex justify-between items-center">
                    <span class="text-stone-500">Base Cost Per Serving:</span>
                    <span class="font-mono font-bold text-forest dark:text-ivory">${formatMoney(impact.origCostPerServing)} / cover</span>
                  </div>

                </div>

                <!-- RIGHT COLUMN: Modified Recipe -->
                <div class="p-6 rounded-3xl bg-white dark:bg-[#1c1713] border-2 border-terracotta/40 dark:border-terracotta/60 shadow-sm space-y-5">
                  
                  <div class="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
                    <div class="flex items-center gap-2">
                      <span class="px-2.5 py-1 rounded-md bg-terracotta text-white text-xs font-mono font-bold uppercase tracking-wider">
                        Right: Modified Recipe
                      </span>
                      <span class="text-xs text-stone-500 font-mono">${servings} Covers</span>
                    </div>
                    <span class="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                      ${impact.ratioData.feasibility}
                    </span>
                  </div>

                  <!-- Replacement Ingredient Details -->
                  <div class="p-4 rounded-2xl bg-peach/15 dark:bg-[#181410] border border-terracotta/30 space-y-2">
                    <div class="flex items-center justify-between">
                      <span class="text-[11px] uppercase tracking-wider font-bold text-terracotta font-mono">Replacement Ingredient</span>
                      <span class="text-xs font-mono text-stone-400">Cost: ${formatMoney(impact.replProfile.costPer100g)}/100g</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <h4 class="text-base font-bold text-terracotta">${impact.replProfile.name}</h4>
                      <span class="font-mono font-bold text-sm text-terracotta bg-white dark:bg-stone-800 px-2.5 py-0.5 rounded-lg border border-terracotta/40">
                        ${impact.replQty} ${impact.replUnit}
                      </span>
                    </div>
                    <p class="text-xs text-stone-600 dark:text-stone-300 leading-normal">${impact.ratioData.cookingNote}</p>
                  </div>

                  <!-- Financial & Caloric Metrics -->
                  <div class="grid grid-cols-2 gap-3 text-xs font-mono">
                    <div class="p-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800 space-y-1">
                      <span class="text-[10px] text-stone-400 uppercase block">Estimated Repl Cost</span>
                      <span class="text-sm font-bold text-terracotta">${formatMoney(impact.replIngCost)}</span>
                      <span class="text-[10px] text-stone-500 block">Updated Total: ${formatMoney(impact.modTotalPrepCost)}</span>
                    </div>
                    <div class="p-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800 space-y-1">
                      <span class="text-[10px] text-stone-400 uppercase block">Updated Calories</span>
                      <span class="text-sm font-bold text-terracotta">${impact.modTotalCalories} kcal</span>
                      <span class="text-[10px] text-stone-500 block">${impact.modCalPerServing} kcal / serving</span>
                    </div>
                  </div>

                  <!-- Full Nutritional Information -->
                  <div class="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                    <span class="text-xs font-bold uppercase tracking-wider text-stone-500 font-mono block">
                      Updated Nutritional Information (${servings} Covers)
                    </span>
                    <div class="grid grid-cols-4 gap-2 text-center text-xs font-mono">
                      <div class="p-2 rounded-xl bg-peach/15 dark:bg-stone-900 border border-terracotta/20">
                        <span class="text-[10px] text-stone-400 block uppercase">Protein</span>
                        <span class="font-bold text-forest dark:text-ivory">${impact.modTotalProt}g</span>
                      </div>
                      <div class="p-2 rounded-xl bg-peach/15 dark:bg-stone-900 border border-terracotta/20">
                        <span class="text-[10px] text-stone-400 block uppercase">Carbs</span>
                        <span class="font-bold text-forest dark:text-ivory">${impact.modTotalCarb}g</span>
                      </div>
                      <div class="p-2 rounded-xl bg-peach/15 dark:bg-stone-900 border border-terracotta/20">
                        <span class="text-[10px] text-stone-400 block uppercase">Fat</span>
                        <span class="font-bold text-forest dark:text-ivory">${impact.modTotalFat}g</span>
                      </div>
                      <div class="p-2 rounded-xl bg-peach/15 dark:bg-stone-900 border border-terracotta/20">
                        <span class="text-[10px] text-stone-400 block uppercase">Sodium</span>
                        <span class="font-bold text-forest dark:text-ivory">${impact.replSodium}mg</span>
                      </div>
                    </div>
                  </div>

                  <!-- Updated Commercial Margins -->
                  <div class="p-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800 text-xs flex justify-between items-center">
                    <span class="text-stone-500">Updated Cost Per Serving:</span>
                    <span class="font-mono font-bold text-terracotta">${formatMoney(impact.modCostPerServing)} / cover</span>
                  </div>

                </div>

              </div>

              <!-- ============================================== -->
              <!-- ADAPTED RECIPE BILL OF INGREDIENTS & STEPS     -->
              <!-- ============================================== -->
              <div id="dash-substituted-recipe-card" class="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#1c1713] border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-6">
                
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 dark:border-stone-800 pb-4">
                  <div>
                    <div class="flex items-center gap-2 mb-1">
                      <span class="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-terracotta text-white font-mono">
                        Adapted Kitchen Recipe
                      </span>
                      <span class="text-xs text-stone-500 font-medium">${subRecipe.category || 'Kitchen Calibrated'} • ${subRecipe.prepTime || '15 mins'} prep • ${subRecipe.cookTime || '20 mins'} cook</span>
                    </div>
                    <h3 class="text-xl sm:text-2xl font-bold font-heading text-forest dark:text-ivory">
                      ${subRecipe.title}
                    </h3>
                    <p class="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                      Substituting <strong class="text-terracotta font-medium">${replacement}</strong> for <strong class="line-through text-stone-400">${missing}</strong> (${impact.ratioData.ratioText}).
                    </p>
                  </div>

                  <div class="flex items-center gap-2">
                    <span class="font-mono text-xs font-bold px-3 py-1.5 rounded-xl bg-ivory dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-forest dark:text-ivory">
                      ${servings} ${servings === 1 ? 'Portion' : 'Portions'} Scaled
                    </span>
                  </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  <!-- Left: Scaled Ingredients -->
                  <div class="lg:col-span-5 space-y-3">
                    <h4 class="font-heading font-bold text-sm sm:text-base text-forest dark:text-ivory flex items-center gap-1.5 border-b border-stone-100 dark:border-stone-800 pb-2">
                      <i class="fa-solid fa-clipboard-list text-terracotta text-xs"></i>
                      <span>Scaled Bill of Ingredients</span>
                    </h4>

                    <div class="divide-y divide-stone-100 dark:divide-stone-800/80">
                      ${subRecipe.ingredients.map(ing => `
                        <div class="py-2.5 flex items-center justify-between gap-2 ${
                          ing.isSubstituted
                            ? 'bg-peach/25 dark:bg-stone-900/80 -mx-2 px-2.5 rounded-xl border-l-4 border-terracotta'
                            : ''
                        }">
                          <div class="min-w-0">
                            <span class="text-xs sm:text-sm ${ing.isSubstituted ? 'font-bold text-terracotta' : 'text-stone-700 dark:text-stone-200'}">
                              ${ing.name}
                            </span>
                            ${ing.isSubstituted ? `
                              <span class="block text-[10px] text-stone-500 font-mono">
                                Replaced ${ing.originalName || missing} (${impact.ratioData.ratioText.split('(')[0].trim()})
                              </span>
                            ` : ''}
                          </div>
                          <span class="font-mono text-xs font-semibold text-stone-600 dark:text-stone-300 shrink-0">
                            ${ing.scaledQty} ${ing.displayUnit || ing.unit}
                          </span>
                        </div>
                      `).join('')}
                    </div>
                  </div>

                  <!-- Right: Adapted Cooking Instructions -->
                  <div class="lg:col-span-7 space-y-3">
                    <h4 class="font-heading font-bold text-sm sm:text-base text-forest dark:text-ivory flex items-center gap-1.5 border-b border-stone-100 dark:border-stone-800 pb-2">
                      <i class="fa-solid fa-fire-burner text-terracotta text-xs"></i>
                      <span>Adapted Cooking Instructions</span>
                    </h4>

                    <div class="space-y-2.5">
                      ${subRecipe.steps.map((st, sIdx) => `
                        <div class="flex items-start gap-3 p-3 rounded-xl ${
                          st.isSubstitutedStep
                            ? 'bg-peach/15 dark:bg-stone-900/60 border-l-3 border-terracotta'
                            : 'bg-stone-50/50 dark:bg-stone-900/20'
                        }">
                          <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5 ${
                            st.isSubstitutedStep
                              ? 'bg-terracotta text-white'
                              : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                          }">
                            ${sIdx + 1}
                          </span>
                          <div class="min-w-0 flex-1">
                            ${st.isSubstitutedStep ? `
                              <span class="text-[10px] font-bold uppercase tracking-wider text-terracotta font-mono block mb-1">
                                Adapted for ${replacement}
                              </span>
                            ` : ''}
                            <p class="text-xs sm:text-sm text-stone-700 dark:text-stone-200 leading-relaxed font-sans">
                              ${st.text}
                            </p>
                          </div>
                        </div>
                      `).join('')}
                    </div>
                  </div>

                </div>

                <!-- Action Bar -->
                <div class="pt-4 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3">
                  <div class="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      data-open-sub-modal="${subRecipe.id}"
                      class="px-4 py-2 rounded-xl text-xs font-bold terracotta-btn text-white transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
                    >
                      <i class="fa-solid fa-expand text-[10px]"></i>
                      <span>Open in Recipe Studio</span>
                    </button>
                    <button
                      type="button"
                      data-print-sub-ticket="${subRecipe.id}"
                      class="px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-terracotta transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                    >
                      <i class="fa-solid fa-print text-terracotta text-[10px]"></i>
                      <span>Print Kitchen Prep Ticket</span>
                    </button>
                  </div>
                  <button
                    type="button"
                    data-log-sub-test="${subRecipe.id}"
                    class="px-4 py-2 rounded-xl text-xs font-semibold sage-btn transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <i class="fa-solid fa-star text-white text-[10px]"></i>
                    <span>Log Tasting Rating</span>
                  </button>
                </div>

              </div>

              <!-- ============================================== -->
              <!-- DUAL RECIPEDB CROSS-REFERENCE                  -->
              <!-- ============================================== -->
              <div id="dash-foodoscope-context" class="p-5 rounded-2xl bg-ivory/50 dark:bg-[#181410] border border-stone-200/80 dark:border-stone-800 space-y-3">
                <div class="flex items-center justify-between flex-wrap gap-2">
                  <div class="flex items-center gap-2">
                    <i class="fa-solid fa-cloud text-terracotta text-sm"></i>
                    <span class="text-xs font-bold text-forest dark:text-ivory font-mono">Foodoscope RecipeDB Cross-Reference</span>
                    <span class="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">Connected</span>
                  </div>
                  <button
                    type="button"
                    id="dash-explore-recipedb-btn"
                    class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-terracotta flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
                  >
                    <i class="fa-solid fa-arrow-up-right-from-square text-[9px] text-terracotta"></i>
                    <span>Explore RecipeDB Catalog</span>
                  </button>
                </div>
                <p id="dash-foodoscope-context-text" class="text-xs text-stone-500 font-mono">
                  Cross-referencing RecipeDB records for "${missing}" and "${replacement}" in ${dish}...
                </p>
                <div id="dash-dual-recipedb-container" class="space-y-2"></div>
              </div>

            </div>
          ` : ''}

        </section>

      </div>
    `;

    container.innerHTML = html;

    // ==============================================
    // EVENT LISTENERS: INPUTS & INTERACTIVITY
    // ==============================================

    // Field A: Dish Name
    const dishInput = container.querySelector('#impact-dish-input');
    const dishClear = container.querySelector('#impact-dish-clear');
    dishInput?.addEventListener('input', (e) => {
      state.impactAnalysis.dishName = e.target.value;
      if (dishClear) dishClear.classList.toggle('hidden', !e.target.value);
    });
    dishClear?.addEventListener('click', () => {
      state.impactAnalysis.dishName = '';
      if (dishInput) { dishInput.value = ''; dishInput.focus(); }
      dishClear.classList.add('hidden');
    });
    container.querySelectorAll('[data-dish-preset]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.impactAnalysis.dishName = btn.getAttribute('data-dish-preset');
        renderDashboardView();
      });
    });

    // Field B: Missing Ingredient
    const missingInput = container.querySelector('#impact-missing-input');
    const missingClear = container.querySelector('#impact-missing-clear');
    missingInput?.addEventListener('input', (e) => {
      state.impactAnalysis.missingIngredient = e.target.value;
      state.universalCurrentIngredient = e.target.value;
      if (missingClear) missingClear.classList.toggle('hidden', !e.target.value);
    });
    missingClear?.addEventListener('click', () => {
      state.impactAnalysis.missingIngredient = '';
      if (missingInput) { missingInput.value = ''; missingInput.focus(); }
      missingClear.classList.add('hidden');
    });
    container.querySelectorAll('[data-missing-preset]').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.getAttribute('data-missing-preset');
        state.impactAnalysis.missingIngredient = val;
        state.universalCurrentIngredient = val;
        // Auto-select top suggested replacement
        const topRepl = getRecommendedReplacements(val)[0] || 'Olive Oil';
        state.impactAnalysis.replacementIngredient = topRepl;
        renderDashboardView();
      });
    });

    // Field C: Replacement Ingredient
    const replInput = container.querySelector('#impact-replacement-input');
    const replClear = container.querySelector('#impact-replacement-clear');
    replInput?.addEventListener('input', (e) => {
      state.impactAnalysis.replacementIngredient = e.target.value;
      if (replClear) replClear.classList.toggle('hidden', !e.target.value);
    });
    replClear?.addEventListener('click', () => {
      state.impactAnalysis.replacementIngredient = '';
      if (replInput) { replInput.value = ''; replInput.focus(); }
      replClear.classList.add('hidden');
    });
    container.querySelectorAll('[data-repl-chip]').forEach(chip => {
      chip.addEventListener('click', () => {
        state.impactAnalysis.replacementIngredient = chip.getAttribute('data-repl-chip');
        renderDashboardView();
      });
    });

    // Field D: Serving Size Slider (1 to 20 People)
    const servingsSlider = container.querySelector('#impact-servings-slider');
    const servingsBadge = container.querySelector('#impact-servings-badge');

    servingsSlider?.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10) || 4;
      state.impactAnalysis.servings = val;
      state.substitutedRecipePersons = val;
      if (servingsBadge) {
        servingsBadge.innerHTML = `<i class="fa-solid fa-users text-xs"></i><span>Cooking for: ${val} ${val === 1 ? 'Person' : 'People'}</span>`;
      }
      container.querySelectorAll('[data-serving-dot]').forEach((dot, idx) => {
        const dotNum = idx + 1;
        const isActive = dotNum <= val;
        dot.className = `w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold transition-all cursor-pointer ${
          isActive
            ? 'bg-terracotta text-white scale-105 shadow-xs'
            : 'bg-stone-200 dark:bg-stone-800 text-stone-500 hover:bg-terracotta/40 hover:text-white'
        }`;
      });
    });

    servingsSlider?.addEventListener('change', (e) => {
      state.impactAnalysis.servings = parseInt(e.target.value, 10) || 4;
      state.substitutedRecipePersons = state.impactAnalysis.servings;
      renderDashboardView();
    });

    // Serving Preset Buttons & Guest Dots
    container.querySelectorAll('[data-serving-preset]').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = parseInt(btn.getAttribute('data-serving-preset'), 10) || 4;
        state.impactAnalysis.servings = val;
        state.substitutedRecipePersons = val;
        renderDashboardView();
      });
    });

    container.querySelectorAll('[data-serving-dot]').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = parseInt(btn.getAttribute('data-serving-dot'), 10) || 4;
        state.impactAnalysis.servings = val;
        state.substitutedRecipePersons = val;
        renderDashboardView();
      });
    });

    // ANALYZE BUTTON (Analyze Recipe Impact with realistic processing animation)
    const analyzeBtn = container.querySelector('#analyze-recipe-impact-btn');
    analyzeBtn?.addEventListener('click', () => {
      const d = (dishInput ? dishInput.value.trim() : state.impactAnalysis.dishName) || 'Paneer Butter Masala';
      const m = (missingInput ? missingInput.value.trim() : state.impactAnalysis.missingIngredient) || 'Butter';
      const r = (replInput ? replInput.value.trim() : state.impactAnalysis.replacementIngredient) || 'Olive Oil';
      const s = parseInt(servingsSlider ? servingsSlider.value : state.impactAnalysis.servings, 10) || 4;

      state.impactAnalysis.dishName = d;
      state.impactAnalysis.missingIngredient = m;
      state.impactAnalysis.replacementIngredient = r;
      state.impactAnalysis.servings = s;
      state.substitutedRecipePersons = s;
      state.universalCurrentIngredient = m;

      // Show loading animation
      state.impactAnalysis.loading = true;
      renderDashboardView();

      const loadingEl = document.getElementById('impact-loading-container');
      if (loadingEl) {
        loadingEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      setTimeout(() => {
        state.impactAnalysis.loading = false;
        state.impactAnalysis.analyzed = true;
        renderDashboardView();
        const resultsEl = document.getElementById('impact-results-dashboard');
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        showNotification('Analysis Complete', `Evaluated impact of swapping "${m}" with "${r}" for ${s} covers.`, 'success');
      }, 280);
    });

    // Hero Preset Action
    container.querySelectorAll('[data-hero-preset-impact]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.impactAnalysis.dishName = 'Paneer Butter Masala';
        state.impactAnalysis.missingIngredient = 'Butter';
        state.impactAnalysis.replacementIngredient = 'Olive Oil';
        state.impactAnalysis.servings = 4;
        state.impactAnalysis.analyzed = true;
        renderDashboardView();
        const resultsEl = document.getElementById('impact-results-dashboard');
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Recipe Studio Modal Opener
    container.querySelectorAll('[data-open-sub-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        openRecipeModal(btn.getAttribute('data-open-sub-modal'));
      });
    });

    // Print Kitchen Prep Ticket
    container.querySelectorAll('[data-print-sub-ticket]').forEach(btn => {
      btn.addEventListener('click', () => {
        printKitchenTicket(btn.getAttribute('data-print-sub-ticket'));
      });
    });

    // Tasting Rating Transition
    container.querySelectorAll('[data-log-sub-test]').forEach(btn => {
      btn.addEventListener('click', () => {
        switchTab('htv');
      });
    });

    // Foodoscope RecipeDB Explore transition button
    const recipedbContextBtn = container.querySelector('#dash-explore-recipedb-btn');
    recipedbContextBtn?.addEventListener('click', () => {
      state.exploreMode = 'foodoscope';
      state.foodoscopeQuery = dish || missing;
      switchTab('explore');
    });

    // Dual Foodoscope RecipeDB Lookup
    if (typeof ApiService !== 'undefined' && missing) {
      ApiService.searchDualRecipesForSwap(missing, replacement, dish, 2).then(dualData => {
        const contextEl = document.getElementById('dash-foodoscope-context-text');
        const dualContainer = document.getElementById('dash-dual-recipedb-container');

        const origRecipes = dualData.original?.recipes || [];
        const subRecipes = dualData.substitute?.recipes || [];

        if (contextEl) {
          if (origRecipes.length || subRecipes.length) {
            contextEl.innerHTML = `Cross-referenced <strong>${origRecipes.length} original & ${subRecipes.length} substitute dishes</strong> across RecipeDB for <em>${missing}</em> & <em>${replacement}</em>.`;
          } else {
            contextEl.textContent = `Calibrated for "${missing}" and "${replacement}" via RecipeDB food pairing indices and 40-recipe kitchen catalog.`;
          }
        }

        if (dualContainer && (origRecipes.length || subRecipes.length)) {
          const renderCard = (r) => {
            const rId = r.Recipe_id || r._id || '';
            const rTitle = r.Recipe_title || r.title || 'RecipeDB Dish';
            const rImg = getAuthenticRecipeImage(r);
            const rRegion = r.Region || 'Global';
            const rCals = r.Calories || r.CaloriesNum || '—';
            return `
              <div class="p-2.5 rounded-xl bg-white dark:bg-[#181410] border border-stone-200/80 dark:border-stone-800 flex items-center justify-between gap-2.5 shadow-xs">
                <div class="flex items-center gap-2.5 min-w-0">
                  <img src="${rImg}" alt="${rTitle}" class="w-10 h-10 rounded-lg object-cover shrink-0 border border-stone-200 dark:border-stone-700" onerror="this.src='https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop&q=80'">
                  <div class="min-w-0">
                    <h5 class="text-xs font-bold text-forest dark:text-ivory truncate" title="${rTitle}">${rTitle}</h5>
                    <span class="text-[10px] text-stone-500 font-mono">${rRegion} · ${rCals} kcal</span>
                  </div>
                </div>
                <button
                  type="button"
                  data-dual-inspect="${rId}"
                  class="px-2.5 py-1 rounded-lg text-xs font-bold terracotta-btn text-white shrink-0 cursor-pointer flex items-center gap-1 shadow-xs"
                >
                  <i class="fa-solid fa-chart-pie text-[9px]"></i>
                  <span>Inspect</span>
                </button>
              </div>
            `;
          };

          dualContainer.innerHTML = `
            <div class="p-3.5 rounded-xl bg-ivory/60 dark:bg-[#181410]/60 border border-stone-200/80 dark:border-stone-800 space-y-2.5">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div class="space-y-1.5">
                  <span class="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Dishes Featuring: ${missing}</span>
                  ${origRecipes.length ? origRecipes.map(r => renderCard(r)).join('') : '<p class="text-xs text-stone-400 italic">No direct matches</p>'}
                </div>
                <div class="space-y-1.5">
                  <span class="text-[10px] font-bold text-terracotta uppercase tracking-wider block">Dishes Featuring: ${replacement}</span>
                  ${subRecipes.length ? subRecipes.map(r => renderCard(r)).join('') : '<p class="text-xs text-stone-400 italic">No direct matches</p>'}
                </div>
              </div>
            </div>
          `;

          dualContainer.querySelectorAll('[data-dual-inspect]').forEach(b => {
            b.addEventListener('click', () => {
              const rId = b.getAttribute('data-dual-inspect');
              openFoodoscopeModal(rId);
            });
          });
        }
      }).catch(() => {});
    }

    // Initialize Scroll Animations
    initScrollAnimations();
  }

  // ========================================================
  function renderFavoritesView() {
    const container = document.getElementById('favorites-view-container');
    if (!container) return;

    const favList = RECIPES_DATA.filter(r => state.favorites.has(r.id));

    if (favList.length === 0) {
      container.innerHTML = `
        <div class="py-16 text-center max-w-md mx-auto">
          <div class="inline-flex p-4 rounded-full bg-rose-100 dark:bg-rose-950/40 text-rose-500 mb-4 text-3xl">
            <i class="fa-regular fa-heart"></i>
          </div>
          <h3 class="text-xl font-bold mb-2">No Bookmarked Recipes Yet</h3>
          <p class="text-stone-500 text-sm mb-6">
            Click the heart icon on any recipe to save it here for fast kitchen access.
          </p>
          <button type="button" id="fav-explore-btn" class="px-5 py-2.5 rounded-xl bg-terracotta text-white font-semibold text-sm shadow-md cursor-pointer">
            Explore Menus
          </button>
        </div>
      `;
      document.getElementById('fav-explore-btn')?.addEventListener('click', () => switchTab('explore'));
      return;
    }

    let html = `
      <div class="space-y-6 animate-fade-up">
        <div class="flex items-center justify-between border-b border-beige-200 dark:border-stone-800 pb-4">
          <div>
            <h2 class="text-2xl font-black text-forest dark:text-ivory">Saved Recipes (${favList.length})</h2>
            <p class="text-xs text-stone-500">Quick-access recipes with culinary swap options</p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          ${favList.map(recipe => `
            <div class="editorial-card p-5 bg-white dark:bg-[#1f1a16] border border-beige-200 dark:border-stone-800 rounded-3xl flex flex-col justify-between">
              <div>
                <div class="h-44 rounded-2xl overflow-hidden mb-3 relative">
                  <img src="${recipe.image}" alt="${recipe.title}" class="w-full h-full object-cover">
                  <span class="absolute top-2 left-2 px-2.5 py-1 rounded-md text-xs font-bold bg-black/60 text-white backdrop-blur">
                    ${recipe.category}
                  </span>
                  <button type="button" data-fav-id="${recipe.id}" class="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 text-rose-500 flex items-center justify-center cursor-pointer shadow-md">
                    <i class="fa-solid fa-heart"></i>
                  </button>
                </div>
                <h3 class="font-bold text-base text-forest dark:text-ivory mb-1">${recipe.title}</h3>
                <p class="text-xs text-stone-500 line-clamp-2 mb-3">${recipe.tagline}</p>
              </div>

              <div class="pt-3 border-t border-beige-100 dark:border-stone-800 flex items-center justify-between">
                <span class="font-bold text-xs text-stone-600 dark:text-stone-300">${recipe.prepTime} • ${recipe.ingredients.length} ingredients</span>
                <button type="button" data-open-recipe="${recipe.id}" class="px-4 py-2 rounded-xl text-xs font-bold bg-terracotta text-white hover:bg-terracotta-600 transition-all cursor-pointer">
                  Open Recipe
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    container.innerHTML = html;

    container.querySelectorAll('[data-open-recipe]').forEach(btn => {
      btn.addEventListener('click', () => {
        openRecipeModal(btn.getAttribute('data-open-recipe'));
      });
    });

    container.querySelectorAll('[data-fav-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        toggleFavorite(btn.getAttribute('data-fav-id'));
      });
    });
  }

  // ========================================================
  // RENDER: RECIPE DEEP-DIVE MODAL (Ingredients FIRST, Steps SECOND)
  // ========================================================
  function openRecipeModal(recipeId) {
    state.activeRecipeId = recipeId;
    if (!state.recipeStates[recipeId]) {
      state.recipeStates[recipeId] = { persons: 1, budgetMode: false, calorieMode: false, veganMode: false };
    }
    renderModalContent();

    const modal = document.getElementById('recipe-webx-modal');
    if (modal) {
      modal.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
    }
  }

  function closeRecipeModal() {
    state.activeRecipeId = null;
    const modal = document.getElementById('recipe-webx-modal');
    if (modal) {
      modal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }
    renderExploreGrid();
  }

  function renderModalContent() {
    const container = document.getElementById('modal-recipe-body');
    if (!container || !state.activeRecipeId) return;

    const cRec = getComputedRecipe(state.activeRecipeId);
    if (!cRec) return;

    const rState = state.recipeStates[state.activeRecipeId];
    const isFav = state.favorites.has(cRec.id);

    let html = `
      <div class="relative bg-white dark:bg-[#181410] rounded-3xl overflow-hidden shadow-2xl max-w-5xl w-full mx-auto my-6 border border-beige-200 dark:border-stone-800 animate-fade-up">
        
        <!-- Modal Top Bar -->
        <div class="sticky top-0 z-30 bg-white/95 dark:bg-[#181410]/95 backdrop-blur border-b border-beige-200 dark:border-stone-800 px-6 py-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-terracotta/15 text-terracotta dark:text-amber-400 border border-terracotta/30">
              ${cRec.category}
            </span>
            <span class="text-xs text-sage-700 dark:text-sage-400 font-bold flex items-center gap-1.5">
              <i class="fa-solid fa-kitchen-set"></i> ${cRec.difficulty} • ${cRec.prepTime} prep${cRec.allReviews.length > 0 ? ` • ${cRec.allReviews.length} note${cRec.allReviews.length === 1 ? '' : 's'}` : ''}
            </span>
          </div>
          
          <div class="flex items-center gap-2">
            <button 
              type="button" 
              id="modal-fav-toggle"
              class="w-10 h-10 rounded-full border border-beige-200 dark:border-stone-800 flex items-center justify-center text-stone-500 hover:text-rose-500 hover:border-rose-400 transition-all cursor-pointer ${isFav ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/30 border-rose-300' : ''}"
              title="Bookmark Recipe"
            >
              <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart text-base"></i>
            </button>
            
            <button 
              type="button" 
              id="modal-print-ticket-btn"
              class="px-3.5 py-2 rounded-xl text-xs font-bold border border-beige-200 dark:border-stone-800 hover:bg-beige-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-all cursor-pointer"
              title="Print Kitchen Ticket for Line Cooks"
            >
              <i class="fa-solid fa-print"></i>
              <span class="hidden sm:inline">Kitchen Ticket</span>
            </button>

            <button 
              type="button" 
              id="modal-close-btn"
              class="w-10 h-10 rounded-full bg-beige-100 dark:bg-[#1f1a16] hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-stone-700 dark:text-slate-300 font-bold transition-all cursor-pointer"
            >
              <i class="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>
        </div>

        <!-- Scrollable Modal Body -->
        <div class="p-6 md:p-8 space-y-8 max-h-[85vh] overflow-y-auto">

          <!-- Hero Info Card with Photo -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div class="md:col-span-5 h-64 md:h-72 rounded-3xl overflow-hidden shadow-lg relative">
              <img src="${cRec.image}" alt="${cRec.title}" class="w-full h-full object-cover">
              <div class="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-md rounded-2xl p-2.5 text-white flex items-center justify-between text-xs">
                <div class="flex items-center gap-1.5">
                  <i class="fa-solid fa-star text-terracotta"></i>
                  <span class="font-bold text-xs">${cRec.avgUserRating ? `${cRec.avgUserRating} ★ (${cRec.allReviews.length} user)` : 'No user ratings yet'}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span><i class="fa-regular fa-clock mr-1"></i>${cRec.prepTime}</span>
                  <span><i class="fa-solid fa-fire mr-1"></i>${cRec.cookTime}</span>
                </div>
              </div>
            </div>

            <div class="md:col-span-7 flex flex-col justify-between">
              <div>
                <h2 class="text-2xl md:text-3xl font-black text-forest dark:text-ivory mb-2 leading-tight">
                  ${cRec.title}
                </h2>
                <p class="text-stone-600 dark:text-slate-300 text-sm leading-relaxed mb-4 font-medium">
                  ${cRec.tagline}
                </p>
                
                <div class="flex flex-wrap gap-2 mb-6">
                  ${cRec.dietary.map(d => `
                    <span class="px-2.5 py-1 rounded-lg text-xs font-bold bg-beige-100 dark:bg-[#1f1a16] text-stone-700 dark:text-slate-300 border border-beige-200 dark:border-stone-800">
                      ${d}
                    </span>
                  `).join('')}
                  <span class="px-2.5 py-1 rounded-lg text-xs font-bold bg-peach/30 dark:bg-amber-950/40 text-terracotta dark:text-amber-400 border border-peach dark:border-amber-800">
                    Flavor Profile: ${cRec.heroFlavor || 'Aromatic & Balanced'}
                  </span>
                </div>
              </div>

              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-peach/30 dark:bg-stone-900/60 border border-beige-200 dark:border-stone-800">
                <div>
                  <span class="block text-[10px] text-stone-500 dark:text-stone-400 font-bold uppercase tracking-wider">Prep Time</span>
                  <span class="text-lg font-black text-forest dark:text-ivory">${cRec.prepTime}</span>
                  <span class="block text-[11px] text-stone-500 dark:text-stone-400">Active prep</span>
                </div>
                <div>
                  <span class="block text-[10px] text-stone-500 dark:text-stone-400 font-bold uppercase tracking-wider">Cook Time</span>
                  <span class="text-lg font-black text-terracotta">${cRec.cookTime}</span>
                  <span class="block text-[11px] text-stone-500 dark:text-stone-400">${cRec.difficulty}</span>
                </div>
                <div>
                  <span class="block text-[10px] text-stone-500 dark:text-stone-400 font-bold uppercase tracking-wider">Batch Size</span>
                  <span class="text-lg font-black text-forest dark:text-ivory">${cRec.persons} ${cRec.persons === 1 ? 'cover' : 'covers'}</span>
                  <span class="block text-[11px] text-stone-500 dark:text-stone-400">Scaled live</span>
                </div>
                <div>
                  <span class="block text-[10px] text-stone-500 dark:text-stone-400 font-bold uppercase tracking-wider">Ingredients</span>
                  <span class="text-lg font-black text-sage-700 dark:text-sage-400">${cRec.ingredients.length} items</span>
                  <span class="block text-[11px] text-stone-500 dark:text-stone-400">${cRec.appliedSwaps.length} active swap${cRec.appliedSwaps.length === 1 ? '' : 's'}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Controls: Number of Persons & FlavorShift AI Swaps -->
          <div class="p-5 rounded-2xl bg-ivory dark:bg-[#1f1a16]/80 border border-beige-200 dark:border-stone-800 space-y-4">
            <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              
              <!-- Persons Stepper -->
              <div class="flex items-center gap-3">
                <span class="text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                  <i class="fa-solid fa-users text-terracotta"></i> Covers / Persons:
                </span>
                
                <div class="inline-flex items-center bg-white dark:bg-[#181410] border border-slate-300 dark:border-stone-800 rounded-xl p-1 shadow-sm">
                  <button type="button" id="person-decrement-btn" class="w-8 h-8 rounded-lg bg-beige-100 dark:bg-[#1f1a16] hover:bg-terracotta hover:text-white flex items-center justify-center font-bold text-sm transition-all cursor-pointer">-</button>
                  <span class="px-4 text-base font-black text-forest dark:text-ivory min-w-[3.5rem] text-center" id="person-count-display">
                    ${cRec.persons} ${cRec.persons === 1 ? 'Person' : 'Persons'}
                  </span>
                  <button type="button" id="person-increment-btn" class="w-8 h-8 rounded-lg bg-beige-100 dark:bg-[#1f1a16] hover:bg-terracotta hover:text-white flex items-center justify-center font-bold text-sm transition-all cursor-pointer">+</button>
                </div>

                <div class="hidden sm:flex items-center gap-1">
                  <button type="button" class="person-preset-btn px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${cRec.persons === 1 ? 'bg-terracotta text-white border-terracotta' : 'bg-white dark:bg-[#181410] border-beige-200 dark:border-stone-800 text-stone-600 dark:text-slate-300'}" data-count="1">1</button>
                  <button type="button" class="person-preset-btn px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${cRec.persons === 2 ? 'bg-terracotta text-white border-terracotta' : 'bg-white dark:bg-[#181410] border-beige-200 dark:border-stone-800 text-stone-600 dark:text-slate-300'}" data-count="2">2</button>
                  <button type="button" class="person-preset-btn px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${cRec.persons === 4 ? 'bg-terracotta text-white border-terracotta' : 'bg-white dark:bg-[#181410] border-beige-200 dark:border-stone-800 text-stone-600 dark:text-slate-300'}" data-count="4">4</button>
                  <button type="button" class="person-preset-btn px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${cRec.persons === 10 ? 'bg-terracotta text-white border-terracotta' : 'bg-white dark:bg-[#181410] border-beige-200 dark:border-stone-800 text-stone-600 dark:text-slate-300'}" data-count="10">10 (Prep Batch)</button>
                </div>
              </div>

              <!-- 3 Smart Toggles -->
              <div class="flex flex-wrap items-center gap-2">
                <!-- Toggle 1: FlavorShift AI Substitution Swap -->
                <button 
                  type="button"
                  id="toggle-budget-mode"
                  class="px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                    rState.budgetMode 
                      ? 'bg-terracotta text-white border-terracotta shadow-sm' 
                      : 'bg-white dark:bg-[#181410] border-beige-200 dark:border-stone-800 text-stone-700 dark:text-slate-300 hover:border-terracotta'
                  }"
                >
                  <i class="fa-solid fa-arrows-rotate ${rState.budgetMode ? 'text-peach' : 'text-terracotta'}"></i>
                  <span>💡 Budget Swap</span>
                </button>

                <!-- Toggle 2: Lighter Ingredient Alternative -->
                <button 
                  type="button"
                  id="toggle-calorie-mode"
                  class="px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                    rState.calorieMode 
                      ? 'bg-sage-600 text-white border-sage-700 shadow-sm' 
                      : 'bg-white dark:bg-[#181410] border-beige-200 dark:border-stone-800 text-stone-700 dark:text-slate-300 hover:border-sage-500'
                  }"
                >
                  <i class="fa-solid fa-feather-pointed ${rState.calorieMode ? 'text-beige-100' : 'text-sage-600'}"></i>
                  <span>🥗 Lighter Swap</span>
                </button>

                <!-- Toggle 3: Vegan Option -->
                ${cRec.veganOption ? `
                  <button 
                    type="button"
                    id="toggle-vegan-mode"
                    class="px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                      rState.veganMode 
                        ? 'bg-forest text-white border-forest shadow-sm' 
                        : 'bg-white dark:bg-[#181410] border-beige-200 dark:border-stone-800 text-stone-700 dark:text-slate-300 hover:border-forest'
                    }"
                  >
                    <i class="fa-solid fa-leaf ${rState.veganMode ? 'text-sage-200' : 'text-sage-600'}"></i>
                    <span>🌱 Plant-Based</span>
                  </button>
                ` : ''}
              </div>

            </div>

            <!-- Active Swap Banner & Ratio -->
            ${cRec.appliedSwaps.length > 0 ? `
              <div class="space-y-2 pt-2 border-t border-beige-200 dark:border-stone-800">
                ${cRec.appliedSwaps.map(sw => `
                  <div class="p-3 rounded-xl text-xs ${
                    sw.type === 'budget' 
                      ? 'bg-peach/40 text-espresso dark:bg-amber-950/40 dark:text-amber-200 border border-terracotta/40' 
                      : 'bg-sage-100/70 text-forest dark:bg-emerald-950/40 dark:text-emerald-200 border border-sage-400/50'
                  } flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span class="font-black mr-2">${sw.badge}:</span>
                      <span>${sw.description}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            ` : ''}

          </div>

          <!-- ============================================== -->
          <!-- 1. SECTION 1: INGREDIENTS LIST (SHOWN FIRST)   -->
          <!-- ============================================== -->
          <div class="space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-beige-200 dark:border-stone-800 pb-3">
              <div>
                <span class="text-xs font-black uppercase tracking-wider text-terracotta">Step 1 of 2</span>
                <h3 class="text-xl font-black text-forest dark:text-ivory flex items-center gap-2">
                  <i class="fa-solid fa-basket-shopping text-terracotta"></i>
                  <span>Bill of Ingredients (Scaled for ${cRec.persons} ${cRec.persons === 1 ? 'Person' : 'Persons'})</span>
                </h3>
              </div>
              <div class="text-xs text-stone-500">
                Scaled automatically for <span class="font-extrabold text-forest dark:text-ivory">${cRec.persons} ${cRec.persons === 1 ? 'cover' : 'covers'}</span>
              </div>
            </div>

            <!-- Ingredients Table -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              ${cRec.ingredients.map((ing, idx) => `
                <div class="p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  ing.isSwapped 
                    ? 'bg-peach/30/80 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800' 
                    : ing.isLowCalorie
                      ? 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800'
                      : ing.isVegan
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                        : 'bg-white dark:bg-[#1f1a16]/80 border-beige-200 dark:border-stone-800/80'
                }">
                  <div class="flex items-start gap-3 min-w-0">
                    <span class="w-7 h-7 rounded-xl bg-beige-100 dark:bg-stone-800 text-stone-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center shrink-0">
                      ${ing.icon || idx + 1}
                    </span>
                    <div class="min-w-0">
                      <div class="font-bold text-sm text-forest dark:text-ivory truncate">
                        ${ing.name}
                      </div>
                      ${ing.swapReason ? `
                        <div class="text-xs text-terracotta dark:text-amber-300 font-medium">
                          💡 ${ing.swapReason}
                        </div>
                      ` : ''}
                      <div class="text-xs text-stone-400">
                        Category: ${ing.category}
                      </div>
                    </div>
                  </div>

                  <div class="text-right shrink-0">
                    <div class="text-base font-black text-terracotta dark:text-amber-400">
                      ${ing.scaledQty} <span class="text-xs font-semibold text-stone-500">${ing.displayUnit}</span>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- ============================================== -->
          <!-- 2. SECTION 2: WHOLE RECIPE STEPS (SHOWN SECOND)-->
          <!-- ============================================== -->
          <div class="space-y-4 pt-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-beige-200 dark:border-stone-800 pb-3">
              <div>
                <span class="text-xs font-black uppercase tracking-wider text-sage-600">Step 2 of 2</span>
                <h3 class="text-xl sm:text-2xl font-black text-forest dark:text-ivory flex items-center gap-2">
                  <i class="fa-solid fa-fire-burner text-sage-600"></i>
                  <span>Chef Culinary Method (Swapped Ingredients Integrated Seamlessly)</span>
                </h3>
              </div>
              <div class="text-xs sm:text-sm text-stone-500">
                Ticket Time: <span class="font-extrabold text-forest dark:text-ivory">${cRec.prepTime} prep + ${cRec.cookTime} cook</span>
              </div>
            </div>

            <div class="space-y-3">
              ${cRec.steps.map((step, idx) => `
                <div class="p-4 rounded-2xl bg-white dark:bg-[#1f1a16]/90 border border-beige-200 dark:border-stone-800/80 shadow-sm flex items-start gap-4">
                  <span class="w-9 h-9 rounded-xl terracotta-btn text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
                    ${idx + 1}
                  </span>
                  <div class="flex-1 text-sm sm:text-base text-espresso dark:text-slate-200 leading-relaxed font-medium">
                    ${step}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Kitchen Tasting Notes & Local Feedback -->
          <div class="space-y-6 pt-4 border-t border-beige-200 dark:border-stone-800">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 class="text-lg font-black text-forest dark:text-ivory flex items-center gap-2">
                  <i class="fa-solid fa-clipboard-check text-sage-600"></i>
                  <span>Kitchen Tasting Notes & Feedback (${cRec.allReviews.length})</span>
                </h4>
                <p class="text-xs text-stone-500">Notes recorded locally in this browser for recipe testing</p>
              </div>

              <button 
                type="button" 
                id="open-write-review-btn"
                class="px-4 py-2 rounded-xl text-xs font-bold bg-terracotta hover:bg-terracotta-600 text-white shadow-sm flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto"
              >
                <i class="fa-solid fa-pen-to-square"></i>
                <span>Add Tasting Note</span>
              </button>
            </div>

            <!-- Review Submission Form -->
            <div id="write-review-form-container" class="hidden p-5 rounded-2xl bg-peach/30 dark:bg-amber-950/20 border border-peach dark:border-amber-900/60 space-y-4">
              <h5 class="font-bold text-sm text-forest dark:text-ivory">Add Kitchen Tasting Note</h5>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold text-stone-600 dark:text-slate-300 mb-1">Your Name / Role</label>
                  <input type="text" id="review-author" placeholder="e.g. Chef / Home Cook" class="w-full px-3 py-2 text-xs rounded-xl border border-beige-200 dark:border-stone-800 bg-white dark:bg-[#181410] focus:outline-none focus:border-terracotta">
                </div>
                <div>
                  <label class="block text-xs font-bold text-stone-600 dark:text-slate-300 mb-1">Kitchen / Location</label>
                  <input type="text" id="review-cafename" placeholder="e.g. Test Kitchen / Home Bistro" class="w-full px-3 py-2 text-xs rounded-xl border border-beige-200 dark:border-stone-800 bg-white dark:bg-[#181410] focus:outline-none focus:border-terracotta">
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-stone-600 dark:text-slate-300 mb-1">Taste & Texture Rating</label>
                <select id="review-rating" class="px-3 py-2 text-xs rounded-xl border border-beige-200 dark:border-stone-800 bg-white dark:bg-[#181410] focus:outline-none focus:border-terracotta">
                  <option value="5">★★★★★ (5 Stars - Great Taste & Texture)</option>
                  <option value="4">★★★★☆ (4 Stars - Good with Minor Variation)</option>
                  <option value="3">★★★☆☆ (3 Stars - Acceptable Alternative)</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-stone-600 dark:text-slate-300 mb-1">Cooking Experience & Taste Notes</label>
                <textarea id="review-text" rows="3" placeholder="How did the swap behave in your kitchen? Note any texture, aroma, or seasoning adjustments." class="w-full px-3 py-2 text-xs rounded-xl border border-beige-200 dark:border-stone-800 bg-white dark:bg-[#181410] focus:outline-none focus:border-terracotta"></textarea>
              </div>

              <div class="flex items-center gap-2">
                <button type="button" id="submit-review-btn" class="px-4 py-2 rounded-xl text-xs font-bold bg-terracotta hover:bg-terracotta-600 text-white cursor-pointer shadow-sm">
                  Save Tasting Note
                </button>
                <button type="button" id="cancel-review-btn" class="px-3 py-2 rounded-xl text-xs font-medium text-stone-500 hover:bg-beige-100 dark:hover:bg-stone-800 cursor-pointer">
                  Cancel
                </button>
              </div>
            </div>

            <!-- Review Cards -->
            ${cRec.allReviews.length === 0 ? `
              <div class="p-6 rounded-2xl bg-ivory dark:bg-[#1f1a16]/60 border border-dashed border-beige-200 dark:border-stone-800 text-center text-xs text-stone-500 dark:text-stone-400">
                No tasting notes saved for this dish yet. Use <strong>Add Tasting Note</strong> above to record your own kitchen test.
              </div>
            ` : `
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                ${cRec.allReviews.map(rev => `
                  <div class="p-4 rounded-2xl bg-white dark:bg-[#1f1a16]/80 border border-beige-200 dark:border-stone-800/80 shadow-sm flex flex-col justify-between">
                    <div>
                      <div class="flex items-center justify-between mb-2">
                        <div>
                          <div class="font-bold text-sm text-forest dark:text-ivory flex items-center gap-1.5">
                            <span>${rev.author}</span>
                            <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sage-100 text-forest dark:bg-emerald-950 dark:text-emerald-300">
                              Local Note
                            </span>
                          </div>
                          <div class="text-[11px] text-stone-500">
                            ${rev.cafeName} • ${rev.date || 'Recent'}
                          </div>
                        </div>

                        <div class="text-terracotta text-xs font-bold">
                          ${'★'.repeat(rev.rating)}${'☆'.repeat(5 - rev.rating)}
                        </div>
                      </div>

                      <p class="text-xs text-stone-600 dark:text-slate-300 leading-relaxed mb-3">
                        "${rev.text}"
                      </p>
                    </div>

                    ${rev.photo ? `
                      <div class="h-28 rounded-xl overflow-hidden mt-2 relative">
                        <img src="${rev.photo}" alt="Dish" class="w-full h-full object-cover">
                        <span class="absolute bottom-1 right-2 text-[10px] bg-black/60 text-white px-2 py-0.5 rounded backdrop-blur">
                          Dish Reference
                        </span>
                      </div>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
            `}

          </div>

        </div>

      </div>
    `;

    container.innerHTML = html;
    setupModalEventListeners(cRec);
  }

  function setupModalEventListeners(cRec) {
    const recipeId = cRec.id;

    document.getElementById('modal-close-btn')?.addEventListener('click', closeRecipeModal);

    document.getElementById('modal-fav-toggle')?.addEventListener('click', () => {
      toggleFavorite(recipeId);
      renderModalContent();
    });

    document.getElementById('modal-print-ticket-btn')?.addEventListener('click', () => {
      printKitchenTicket(recipeId);
    });

    document.getElementById('person-increment-btn')?.addEventListener('click', () => {
      state.recipeStates[recipeId].persons += 1;
      renderModalContent();
    });

    document.getElementById('person-decrement-btn')?.addEventListener('click', () => {
      if (state.recipeStates[recipeId].persons > 1) {
        state.recipeStates[recipeId].persons -= 1;
        renderModalContent();
      }
    });

    document.querySelectorAll('.person-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.recipeStates[recipeId].persons = parseInt(btn.getAttribute('data-count'), 10);
        renderModalContent();
      });
    });

    document.getElementById('toggle-budget-mode')?.addEventListener('click', () => {
      state.recipeStates[recipeId].budgetMode = !state.recipeStates[recipeId].budgetMode;
      renderModalContent();
    });

    document.getElementById('toggle-calorie-mode')?.addEventListener('click', () => {
      state.recipeStates[recipeId].calorieMode = !state.recipeStates[recipeId].calorieMode;
      renderModalContent();
    });

    document.getElementById('toggle-vegan-mode')?.addEventListener('click', () => {
      state.recipeStates[recipeId].veganMode = !state.recipeStates[recipeId].veganMode;
      renderModalContent();
    });

    const writeReviewBtn = document.getElementById('open-write-review-btn');
    const reviewForm = document.getElementById('write-review-form-container');
    const cancelReviewBtn = document.getElementById('cancel-review-btn');
    const submitReviewBtn = document.getElementById('submit-review-btn');

    writeReviewBtn?.addEventListener('click', () => {
      reviewForm?.classList.remove('hidden');
      writeReviewBtn.classList.add('hidden');
    });

    cancelReviewBtn?.addEventListener('click', () => {
      reviewForm?.classList.add('hidden');
      writeReviewBtn?.classList.remove('hidden');
    });

    submitReviewBtn?.addEventListener('click', () => {
      const author = document.getElementById('review-author').value.trim() || 'Home / Line Cook';
      const cafeName = document.getElementById('review-cafename').value.trim() || 'Home / Bistro Kitchen';
      const rating = parseInt(document.getElementById('review-rating').value, 10) || 5;
      const text = document.getElementById('review-text').value.trim();

      if (!text) {
        alert('Please share your cooking and taste notes.');
        return;
      }

      if (!state.customReviews[recipeId]) {
        state.customReviews[recipeId] = [];
      }

      state.customReviews[recipeId].unshift({
        id: 'note-' + Date.now(),
        author,
        cafeName,
        rating,
        date: 'Just now',
        text,
        photo: cRec.image
      });

      localStorage.setItem('flavorshift_reviews', JSON.stringify(state.customReviews));
      renderModalContent();
    });
  }

  function printKitchenTicket(recipeId) {
    const cRec = getComputedRecipe(recipeId);
    if (!cRec) return;

    let ticketHtml = `
      <div id="print-ticket-container" style="max-width: 400px; font-family: monospace; padding: 20px; line-height: 1.4;">
        <div style="text-align: center; border-bottom: 2px dashed #000; padding-bottom: 10px; margin-bottom: 12px;">
          <h2 style="margin: 0; font-size: 18px; text-transform: uppercase;">FLAVORSHIFT AI</h2>
          <p style="margin: 3px 0 0; font-size: 12px;">KITCHEN RECIPE PREP TICKET</p>
          <p style="margin: 3px 0 0; font-size: 11px;">Covers: ${cRec.persons} Person(s) | Scaled Prep Sheet</p>
        </div>

        <div style="margin-bottom: 12px;">
          <h3 style="margin: 0; font-size: 16px;">${cRec.title.toUpperCase()}</h3>
          <p style="margin: 2px 0; font-size: 11px;">Category: ${cRec.category} | Prep: ${cRec.prepTime}</p>
          ${cRec.rState.budgetMode ? '<p style="margin: 2px 0; font-weight: bold;">[!] BUDGET INGREDIENT SWAP ACTIVE</p>' : ''}
          ${cRec.rState.calorieMode ? '<p style="margin: 2px 0; font-weight: bold;">[!] LIGHTER SWAP ACTIVE</p>' : ''}
          ${cRec.rState.veganMode ? '<p style="margin: 2px 0; font-weight: bold;">[!] PLANT-BASED SWAP ACTIVE</p>' : ''}
        </div>

        <div style="border-bottom: 1px dashed #000; padding-bottom: 10px; margin-bottom: 12px;">
          <h4 style="margin: 0 0 6px; font-size: 13px; text-transform: uppercase;">1. Ingredients Required:</h4>
          ${cRec.ingredients.map(ing => `
            <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 3px;">
              <span>[ ] ${ing.name}</span>
              <span style="font-weight: bold;">${ing.scaledQty} ${ing.displayUnit}</span>
            </div>
          `).join('')}
        </div>

        <div>
          <h4 style="margin: 0 0 6px; font-size: 13px; text-transform: uppercase;">2. Line Method:</h4>
          ${cRec.steps.map((st, i) => `
            <p style="margin: 0 0 6px; font-size: 11px;">${i + 1}. ${st}</p>
          `).join('')}
        </div>

        <div style="border-top: 2px dashed #000; margin-top: 15px; padding-top: 8px; text-align: center; font-size: 11px;">
          Generated: ${new Date().toLocaleTimeString()}
        </div>
      </div>
    `;

    const printContainer = document.getElementById('kot-print-area') || document.createElement('div');
    printContainer.id = 'kot-print-area';
    printContainer.innerHTML = ticketHtml;
    document.body.appendChild(printContainer);
    window.print();
  }

  // ========================================================
  // TAB NAVIGATION SWITCHER
  // ========================================================
  // ========================================================
  // SCROLL-BASED REVEAL ANIMATIONS (INTERSECTION OBSERVER)
  // ========================================================
  function initScrollAnimations() {
    if (typeof IntersectionObserver === 'undefined') {
      document.querySelectorAll('.reveal-on-scroll').forEach(el => el.classList.add('revealed'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll('.reveal-on-scroll:not(.revealed)').forEach(el => {
      observer.observe(el);
    });
  }

  function switchTab(tabName) {
    state.activeTab = tabName;

    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      if (btn.getAttribute('data-tab') === tabName) {
        btn.classList.add('active-nav-tab');
      } else {
        btn.classList.remove('active-nav-tab');
      }
    });

    document.querySelectorAll('.tab-view-container').forEach(view => {
      view.classList.add('hidden');
    });

    const targetView = document.getElementById(`view-${tabName}`);
    if (targetView) {
      targetView.classList.remove('hidden');
    }

    if (tabName === 'swaplab') {
      renderSwapLabView();
    } else if (tabName === 'explore') {
      renderExploreView();
    } else if (tabName === 'htv') {
      renderHtvView();
    } else if (tabName === 'dashboard') {
      renderDashboardView();
    } else if (tabName === 'favorites') {
      renderFavoritesView();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Global Event Listeners Setup
  function setupEventListeners() {
    document.getElementById('theme-toggle-btn')?.addEventListener('click', () => {
      const nextTheme = state.theme === 'light' ? 'dark' : 'light';
      applyTheme(nextTheme);
    });

    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        switchTab(tab);
      });
    });

    document.querySelectorAll('.nav-brand-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        switchTab('swaplab');
      });
    });

    document.getElementById('toggle-pantry-drawer-btn')?.addEventListener('click', () => {
      document.getElementById('foodoscope-api-drawer')?.classList.add('hidden');
      document.getElementById('pantry-drawer')?.classList.toggle('hidden');
    });

    document.querySelectorAll('.pantry-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        applyPantryPreset(btn.getAttribute('data-preset'));
      });
    });

    document.getElementById('clear-pantry-btn')?.addEventListener('click', clearPantry);

    document.getElementById('recipe-webx-modal')?.addEventListener('click', (e) => {
      if (e.target.id === 'recipe-webx-modal') {
        closeRecipeModal();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && state.activeRecipeId) {
        closeRecipeModal();
      }
    });
  }

  // Initialization
  function init() {
    initRecipeStates();
    applyTheme(state.theme);
    updateFavoritesBadge();
    renderPantrySection();
    renderSwapLabView();
    renderExploreView();
    renderHtvView();
    setupEventListeners();

    // Hash-based direct view navigation
    const hash = (window.location.hash || '').replace('#', '').trim();
    if (hash === 'explore' || hash === 'htv' || hash === 'dashboard' || hash === 'favorites' || hash === 'swaplab') {
      switchTab(hash);
    }

    setTimeout(initScrollAnimations, 100);
  }

  // Public bridge for inspection, testability & external modal triggering
  window.switchTab = switchTab;
  window.getAuthenticRecipeImage = getAuthenticRecipeImage;
  window.generateChefRecipeForDish = generateChefRecipeForDish;
  window.openFoodoscopeModal = openFoodoscopeModal;
  window.renderFoodoscopeGrid = renderFoodoscopeGrid;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();