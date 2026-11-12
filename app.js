// FlavorShift AI - Intelligent Culinary Ingredient Substitution & Human Taste Validation Platform
// Core Application Engine

(function () {
  'use strict';

  // Application State
  const state = {
    activeTab: 'swaplab', // 'swaplab', 'explore', 'htv', 'dashboard', 'slides', 'favorites'
    selectedSwapIndex: 0,
    swapStudioMode: 'universal', // 'universal' | 'curated'
    universalCurrentIngredient: 'Fresh Cream',
    universalCurrentDishContext: 'General / All Dishes',
    universalCompareMode: false,
    selectedCategory: 'all',
    selectedDiet: 'all',
    searchQuery: '',
    swapSearchQuery: '',
    sortOption: 'default',
    currency: localStorage.getItem('flavorshift_currency') || '₹',
    activePantryIngredients: new Set(JSON.parse(localStorage.getItem('flavorshift_pantry') || '[]')),
    favorites: new Set(JSON.parse(localStorage.getItem('flavorshift_favs') || '["paneer-butter-masala", "wild-mushroom-truffle-pasta", "artisan-margherita-sourdough-pizza"]')),
    theme: localStorage.getItem('flavorshift_theme') || 'light',
    
    // Per-recipe dynamic toggles and person counts
    recipeStates: {},
    
    // Design Thinking Slide State
    currentSlideIndex: 0,
    slideAutoplay: false,
    autoplayTimer: null,
    
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
    htvSubmissions: JSON.parse(localStorage.getItem('flavorshift_htv_submissions') || '[]')
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
        themeBtn.innerHTML = `<i class="fa-solid fa-sun text-terracotta"></i><span class="hidden sm:inline font-medium text-xs">Light</span>`;
      } else {
        themeBtn.innerHTML = `<i class="fa-solid fa-moon text-forest"></i><span class="hidden sm:inline font-medium text-xs">Dark</span>`;
      }
    }
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

  // ========================================================
  // RENDER: FLAVORSHIFT AI SWAP LAB (FLAGSHIP FEATURE)
  // ========================================================
  function renderSwapLabView() {
    const container = document.getElementById('swaplab-view-container');
    if (!container) return;

    const activeSwap = FLAVORSHIFT_SWAP_DATABASE[state.selectedSwapIndex] || FLAVORSHIFT_SWAP_DATABASE[0];
    const currentIng = state.universalCurrentIngredient;
    const currentCtx = state.universalCurrentDishContext || 'General / All Dishes';
    const dishContexts = [
      'General / All Dishes',
      'Curries & Gravies',
      'Baking & Cakes',
      'Tea & Beverages',
      'Pastas & Sauces',
      'Salads & Dressings',
      'Breakfast & Bowls'
    ];
    let uResult = null;
    if (typeof UniversalIngredientEngine !== 'undefined' && currentIng) {
      try {
        uResult = UniversalIngredientEngine.analyzeIngredient(currentIng, currentCtx);
      } catch (e) {
        console.warn('Universal engine lookup fallback:', e);
      }
    }
    const presetShowcase = (typeof UniversalIngredientEngine !== 'undefined' && UniversalIngredientEngine.PRESET_SHOWCASE)
      ? UniversalIngredientEngine.PRESET_SHOWCASE
      : [];

    let html = `
      <div class="space-y-8 animate-fade-up max-w-6xl mx-auto">

        <!-- ============================================== -->
        <!-- SECTION 1: EDITORIAL HERO & DISH SHOWCASE      -->
        <!-- ============================================== -->
        <section class="relative overflow-hidden rounded-3xl bg-forest dark:bg-[#1A2620] text-ivory shadow-xl p-6 sm:p-8 lg:p-10 border border-beige-200/20 glow-card reveal-on-scroll">
          <div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-7 items-center">

            <div class="lg:col-span-7 space-y-4">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ivory/15 backdrop-blur-md text-[11px] font-bold tracking-wider text-beige uppercase border border-ivory/20">
                <i class="fa-solid fa-wand-magic-sparkles text-terracotta"></i>
                <span>Culinary Substitution & Scaling Studio</span>
              </div>

              <h1 class="font-heading font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-[1.15]">
                Adapt Recipes Thoughtfully.<br>
                <span class="text-terracotta font-serif italic">Practical Swaps</span> Built for Real Kitchens.
              </h1>

              <p class="text-ivory/85 text-sm leading-relaxed font-normal max-w-2xl font-sans">
                Search any missing ingredient for practical kitchen ratios, texture & simmer guidance, per-person recipe scaling, and local tasting notes.
              </p>

              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-center">
                <div class="bg-forest-800/80 dark:bg-black/40 backdrop-blur-md rounded-2xl p-2.5 border border-beige-200/15">
                  <span class="block text-lg font-black text-ivory font-heading">${RECIPES_DATA.length} Dishes</span>
                  <span class="text-[10px] text-beige/80 font-bold uppercase tracking-wider">Recipe Library</span>
                </div>
                <div class="bg-forest-800/80 dark:bg-black/40 backdrop-blur-md rounded-2xl p-2.5 border border-beige-200/15">
                  <span class="block text-lg font-black text-terracotta font-heading">${presetShowcase.length || FLAVORSHIFT_SWAP_DATABASE.length} Presets</span>
                  <span class="text-[10px] text-beige/80 font-bold uppercase tracking-wider">Quick Swaps</span>
                </div>
                <div class="bg-forest-800/80 dark:bg-black/40 backdrop-blur-md rounded-2xl p-2.5 border border-beige-200/15">
                  <span class="block text-lg font-black text-sage-300 font-heading">1+ Covers</span>
                  <span class="text-[10px] text-beige/80 font-bold uppercase tracking-wider">Portion Scaling</span>
                </div>
                <div class="bg-forest-800/80 dark:bg-black/40 backdrop-blur-md rounded-2xl p-2.5 border border-beige-200/15">
                  <span class="block text-lg font-black text-peach font-heading">Local Log</span>
                  <span class="text-[10px] text-beige/80 font-bold uppercase tracking-wider">Tasting Notes</span>
                </div>
              </div>

              <div class="pt-2 flex flex-wrap items-center gap-3">
                <a href="#ai-swaplab-stage" class="terracotta-btn px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md">
                  <i class="fa-solid fa-magnifying-glass"></i>
                  <span>Search Ingredient Swap</span>
                </a>
                <button type="button" data-hero-action="explore" class="px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 cursor-pointer bg-ivory/15 hover:bg-ivory/25 text-ivory border border-ivory/30 backdrop-blur-sm transition-all">
                  <span>Browse ${RECIPES_DATA.length} Catalog Dishes</span>
                  <i class="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>

            <!-- Sorted 2x2 Culinary Dish Mosaic (Zero Videos) -->
            <div class="lg:col-span-5 grid grid-cols-2 gap-3">
              ${[
                { id: 'paneer-butter-masala', label: 'Paneer Butter Masala', sub: 'Cashew Cream Swap', img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80' },
                { id: 'dal-makhani-bistro', label: 'Slow-Simmered Dal Makhani', sub: 'Cream-Free Emulsion', img: './assets/recipes/slow-simmered-dal-makhani.jpg' },
                { id: 'classic-penne-arrabbiata', label: 'Penne all\'Arrabbiata', sub: 'Roma Tomato Reduction', img: './assets/recipes/classic-penne-arrabbiata.jpg' },
                { id: 'masala-chai-bistro', label: 'Karak Masala Chai', sub: 'Whole Spice Decoction', img: './assets/recipes/artisan-karak-masala-chai.jpg' }
              ].map(card => `
                <button
                  type="button"
                  data-open-hero-recipe="${card.id}"
                  class="group text-left rounded-2xl overflow-hidden border border-beige-200/20 bg-black/30 relative aspect-[4/3] shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-terracotta"
                >
                  <img src="${card.img}" alt="${card.label}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
                  <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"></div>
                  <div class="absolute bottom-2 left-2.5 right-2.5">
                    <span class="block text-[11px] font-bold text-ivory leading-tight truncate">${card.label}</span>
                    <span class="block text-[10px] text-peach/90 truncate">${card.sub}</span>
                  </div>
                </button>
              `).join('')}
            </div>

          </div>
        </section>

        <!-- ============================================== -->
        <!-- SECTION 2: SORTED SWAP STUDIO (2 CLEAN MODES)  -->
        <!-- ============================================== -->
        <section id="ai-swaplab-stage" class="space-y-5 reveal-on-scroll">

          <!-- Segmented Studio Mode Switcher -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#1f1a16] px-5 py-3.5 rounded-2xl border border-beige-200 dark:border-stone-800 shadow-xs">
            <div class="flex items-center gap-2">
              <i class="fa-solid fa-flask-vial text-terracotta"></i>
              <h2 class="font-heading font-bold text-base sm:text-lg text-forest dark:text-ivory">Swap Workspace</h2>
            </div>

            <div class="inline-flex p-1 rounded-xl bg-ivory dark:bg-[#181410] border border-beige-200 dark:border-stone-800">
              <button
                type="button"
                data-swap-studio-mode="universal"
                class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  state.swapStudioMode !== 'curated'
                    ? 'bg-forest text-ivory shadow-xs'
                    : 'text-stone-600 dark:text-stone-300 hover:text-terracotta'
                }"
              >
                <i class="fa-solid fa-magnifying-glass"></i>
                <span>Universal Search</span>
              </button>
              <button
                type="button"
                data-swap-studio-mode="curated"
                class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  state.swapStudioMode === 'curated'
                    ? 'bg-forest text-ivory shadow-xs'
                    : 'text-stone-600 dark:text-stone-300 hover:text-terracotta'
                }"
              >
                <i class="fa-solid fa-images"></i>
                <span>Visual Dish Pair Guides (${FLAVORSHIFT_SWAP_DATABASE.length})</span>
              </button>
            </div>
          </div>

          ${state.swapStudioMode !== 'curated' ? `
          <!-- Universal Ingredient Intelligence Lookup (Any Ingredient + Dish Context) -->
          <div class="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1f1a16] border border-beige-200 dark:border-stone-800 shadow-sm space-y-5 glow-card">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-beige-200 dark:border-stone-800 pb-3">
              <div>
                <span class="text-xs font-bold uppercase tracking-wider text-terracotta font-mono">Universal Ingredient Lookup</span>
                <h3 class="text-xl sm:text-2xl font-bold font-heading text-forest dark:text-ivory flex items-center gap-2 mt-0.5">
                  <i class="fa-solid fa-magnifying-glass text-terracotta text-lg"></i>
                  <span>Search Any Culinary Ingredient</span>
                </h3>
              </div>
              <span class="text-xs text-stone-500 font-accent italic">Context-aware ratios, culinary behavior, and allergen guidance</span>
            </div>

            <!-- Search Bar + Dish Context + Analyze CTA -->
            <div class="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
              <div class="md:col-span-6 relative">
                <label for="universal-ingredient-input" class="block text-[10px] font-bold uppercase text-stone-400 mb-1 ml-1">Ingredient Name</label>
                <div class="relative">
                  <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs"></i>
                  <input
                    type="text"
                    id="universal-ingredient-input"
                    value="${currentIng || ''}"
                    placeholder="Try Milk, Paneer, Mushroom, Saffron, Miso, Gochujang, Eggs..."
                    class="w-full pl-9 pr-9 py-3 rounded-2xl bg-ivory dark:bg-[#181410] border border-beige-200 dark:border-stone-800 text-xs sm:text-sm font-semibold text-forest dark:text-ivory placeholder:text-stone-400 focus:outline-none focus:border-terracotta transition-all"
                  />
                  <button
                    type="button"
                    id="universal-search-clear-btn"
                    class="${currentIng ? '' : 'hidden'} absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-beige-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-forest dark:hover:text-ivory flex items-center justify-center text-[10px] cursor-pointer"
                    title="Clear input"
                  >
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>

              <div class="md:col-span-4 relative">
                <label for="universal-dish-context-select" class="block text-[10px] font-bold uppercase text-stone-400 mb-1 ml-1">Dish Context</label>
                <div class="relative">
                  <i class="fa-solid fa-bowl-food absolute left-3.5 top-1/2 -translate-y-1/2 text-terracotta text-xs"></i>
                  <select
                    id="universal-dish-context-select"
                    class="w-full pl-9 pr-8 py-3 rounded-2xl bg-ivory dark:bg-[#181410] border border-beige-200 dark:border-stone-800 text-xs sm:text-sm font-bold text-espresso dark:text-ivory focus:outline-none focus:border-terracotta cursor-pointer appearance-none"
                  >
                    ${dishContexts.map(ctx => `<option value="${ctx}" ${ctx === currentCtx ? 'selected' : ''}>${ctx}</option>`).join('')}
                  </select>
                  <i class="fa-solid fa-chevron-down absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs pointer-events-none"></i>
                </div>
              </div>

              <div class="md:col-span-2">
                <button
                  type="button"
                  id="universal-analyze-btn"
                  class="w-full py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold terracotta-btn text-white transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <i class="fa-solid fa-bolt"></i>
                  <span>Analyze</span>
                </button>
              </div>
            </div>

            <!-- Preset Showcase Pills -->
            ${presetShowcase.length > 0 ? `
              <div class="flex flex-wrap items-center gap-1.5 pt-1">
                <span class="text-[11px] font-bold text-stone-400 mr-1">Quick picks:</span>
                ${presetShowcase.slice(0, 12).map(p => `
                  <button
                    type="button"
                    data-universal-chip="${p.name}"
                    class="px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                      currentIng && currentIng.toLowerCase() === p.name.toLowerCase()
                        ? 'bg-forest text-ivory border-forest shadow-xs'
                        : 'bg-ivory dark:bg-[#181410] border-beige-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:border-terracotta'
                    }"
                  >
                    <i class="${p.icon} text-[10px] text-terracotta"></i>
                    <span>${p.name}</span>
                  </button>
                `).join('')}
              </div>
            ` : ''}

            <!-- Universal Engine Output -->
            <div id="universal-results-container">
              ${!uResult ? '' : uResult.status === 'invalid' ? `
                <div class="p-6 rounded-2xl bg-peach/30 dark:bg-stone-900/80 border border-terracotta/40 text-center space-y-3">
                  <div class="w-12 h-12 rounded-full bg-terracotta/15 text-terracotta flex items-center justify-center mx-auto text-lg">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                  </div>
                  <h4 class="text-lg font-black font-heading text-forest dark:text-ivory">Ingredient Unrecognized</h4>
                  <p class="text-xs font-medium text-espresso dark:text-stone-200 max-w-xl mx-auto">${uResult.message}</p>
                  <p class="text-[11px] text-stone-500 max-w-xl mx-auto">${uResult.suggestion}</p>
                  <div class="pt-1 flex flex-wrap items-center justify-center gap-2">
                    <button type="button" id="try-another-ingredient-btn" class="px-4 py-2 rounded-xl text-xs font-bold terracotta-btn text-white cursor-pointer">Try Another Ingredient</button>
                    <button type="button" data-universal-chip="Milk" class="px-3 py-2 rounded-xl text-xs font-bold bg-white dark:bg-[#181410] border border-beige-200 dark:border-stone-800 text-espresso dark:text-ivory cursor-pointer">Test "Milk"</button>
                    <button type="button" data-universal-chip="Paneer" class="px-3 py-2 rounded-xl text-xs font-bold bg-white dark:bg-[#181410] border border-beige-200 dark:border-stone-800 text-espresso dark:text-ivory cursor-pointer">Test "Paneer"</button>
                  </div>
                </div>
              ` : uResult.status === 'recognized' ? (() => {
                const alts = uResult.alternatives || [];
                const topAlt = alts[0] || { name: 'Culinary Alternative', ratio: '' };
                return `
                  <div class="pt-4 border-t border-beige-200 dark:border-stone-800 space-y-5">
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div class="space-y-1">
                        <div class="flex flex-wrap items-center gap-2">
                          <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-peach/50 text-terracotta border border-terracotta/30 flex items-center gap-1">
                            <i class="${uResult.icon || 'fa-solid fa-utensils'} text-[10px]"></i> ${uResult.ingredientName}
                          </span>
                          <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-beige-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                            ${uResult.category}
                          </span>
                          <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sage-100 dark:bg-stone-800 text-forest dark:text-sage-300">
                            Context: ${uResult.dishContext}
                          </span>
                        </div>
                        <p class="text-xs text-stone-500 dark:text-stone-400">
                          <strong>Role:</strong> ${(uResult.functions || []).join(', ')} • <strong>Profile:</strong> ${uResult.flavorProfile}
                        </p>
                      </div>
                      <div class="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          id="toggle-compare-mode-btn"
                          class="px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                            state.universalCompareMode
                              ? 'bg-forest text-ivory border-forest shadow-sm'
                              : 'bg-ivory dark:bg-[#181410] border-beige-200 dark:border-stone-800 text-espresso dark:text-ivory hover:border-terracotta'
                          }"
                        >
                          <i class="fa-solid fa-table-columns"></i>
                          <span>${state.universalCompareMode ? 'Hide Comparison' : 'Compare Matrix'}</span>
                        </button>
                      </div>
                    </div>

                    ${state.universalCompareMode ? `
                      <div class="overflow-x-auto p-4 rounded-2xl bg-ivory/70 dark:bg-[#181410] border border-beige-200 dark:border-stone-800">
                        <table class="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr class="border-b border-beige-200 dark:border-stone-800 text-[10px] uppercase tracking-wider text-stone-400">
                              <th class="py-2 px-3">Alternative</th>
                              <th class="py-2 px-3">Conversion Ratio</th>
                              <th class="py-2 px-3">Culinary Method</th>
                              <th class="py-2 px-3">Taste Notes</th>
                              <th class="py-2 px-3">Dietary & Allergens</th>
                              <th class="py-2 px-3 text-right">Select</th>
                            </tr>
                          </thead>
                          <tbody class="divide-y divide-beige-200/70 dark:divide-stone-800">
                            ${alts.map(alt => `
                              <tr>
                                <td class="py-2.5 px-3 font-bold text-forest dark:text-ivory">
                                  ${alt.name}
                                  <span class="block text-[10px] font-normal text-terracotta">${alt.type}</span>
                                </td>
                                <td class="py-2.5 px-3 font-mono text-[11px] text-espresso dark:text-stone-200">${alt.ratio}</td>
                                <td class="py-2.5 px-3 text-[11px] text-stone-500">${alt.calcMethod || 'Functional balance'}</td>
                                <td class="py-2.5 px-3 text-[11px] text-stone-600 dark:text-stone-300 max-w-[200px]">${alt.tasteDesc}</td>
                                <td class="py-2.5 px-3">
                                  <div class="flex flex-wrap gap-1">
                                    ${(alt.dietary || []).map(d => `<span class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-sage-100 dark:bg-stone-800 text-forest dark:text-sage-300">${d}</span>`).join('')}
                                  </div>
                                </td>
                                <td class="py-2.5 px-3 text-right">
                                  <button type="button" data-select-alt="${alt.name}" class="px-2.5 py-1 rounded-lg bg-terracotta text-white font-bold text-[11px] cursor-pointer">Select</button>
                                </td>
                              </tr>
                            `).join('')}
                          </tbody>
                        </table>
                      </div>
                    ` : ''}

                    <div class="grid grid-cols-1 ${alts.length === 2 ? 'md:grid-cols-2' : alts.length >= 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3'} gap-4">
                      ${alts.map((alt, idx) => `
                        <div class="editorial-card p-5 bg-ivory/70 dark:bg-[#181410] border border-beige-200 dark:border-stone-800 rounded-2xl flex flex-col justify-between space-y-3">
                          <div class="space-y-2.5">
                            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block ${
                              idx === 0 ? 'bg-forest text-ivory' : idx === 1 ? 'bg-sage text-white' : 'bg-terracotta text-white'
                            }">
                              Option ${idx + 1}: ${alt.type}
                            </span>
                            <h4 class="text-base font-bold font-heading text-forest dark:text-ivory leading-snug">${alt.name}</h4>
                            <div class="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-beige-200 dark:border-stone-800">
                              <span class="block text-[10px] font-bold uppercase text-terracotta font-mono">Conversion Ratio:</span>
                              <span class="text-xs font-bold text-forest dark:text-ivory block font-mono mt-0.5">${alt.ratio}</span>
                              <span class="block text-[10px] text-stone-400 mt-1">${alt.calcMethod || 'Functional culinary balance'}</span>
                            </div>
                            <p class="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">
                              <strong>Flavor:</strong> ${alt.contextNotes && alt.contextNotes[uResult.dishContext] ? alt.contextNotes[uResult.dishContext] : alt.tasteDesc}
                            </p>
                            <p class="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed">
                              <strong>Texture:</strong> ${alt.textureDesc}
                            </p>
                            <div class="flex flex-wrap gap-1 pt-1">
                              ${(alt.dietary || []).map(tag => `<span class="px-2 py-0.5 rounded text-[9px] font-bold bg-sage-100 dark:bg-stone-800 text-forest dark:text-sage-300">${tag}</span>`).join('')}
                              ${(alt.allergens && alt.allergens.length && alt.allergens[0] !== 'None')
                                ? alt.allergens.map(a => `<span class="px-2 py-0.5 rounded text-[9px] font-bold bg-peach/50 text-terracotta">${a}</span>`).join('')
                                : '<span class="px-2 py-0.5 rounded text-[9px] font-bold bg-beige-100 dark:bg-stone-800 text-stone-500">No Major Allergens</span>'}
                            </div>
                          </div>
                          <button type="button" data-select-alt="${alt.name}" class="w-full py-2 px-3 rounded-xl text-xs font-bold forest-btn cursor-pointer">
                            Select Substitute
                          </button>
                        </div>
                      `).join('')}
                    </div>

                    ${(uResult.volatiles && uResult.volatiles.length) ? `
                      <div class="p-4 rounded-2xl bg-ivory/60 dark:bg-[#181410] border border-beige-200 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <div>
                          <span class="font-bold text-forest dark:text-ivory">Key Aroma Notes: </span>
                          <span class="text-stone-600 dark:text-stone-300 font-mono text-[11px]">${uResult.volatiles.join(' • ')}</span>
                        </div>
                        <span class="text-[11px] text-stone-400 italic">${uResult.source}</span>
                      </div>
                    ` : ''}
                  </div>
                `;
              })() : ''}
            </div>
          ` : `
          <!-- Step 1: Curated Target Ingredient Visual Selector -->
          <div class="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1f1a16] border border-beige-200 dark:border-stone-800 shadow-sm space-y-4 glow-card">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-beige-200 dark:border-stone-800 pb-3">
              <div>
                <span class="text-xs font-bold uppercase tracking-wider text-terracotta font-mono">Step 1: Choose Ingredient to Swap</span>
                <h3 class="text-xl sm:text-2xl font-bold font-heading text-forest dark:text-ivory flex items-center gap-2 mt-0.5">
                  <i class="fa-solid fa-fire text-terracotta text-lg"></i>
                  <span>What's Missing or Out of Stock in Your Kitchen Right Now?</span>
                </h3>
              </div>
              <span class="text-xs text-stone-500 font-accent italic">Select or search an ingredient below to view curated swap options</span>
            </div>

            <!-- In-menu Ingredient Search Panel -->
            <div class="relative max-w-md pt-1">
              <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs mt-0.5"></i>
              <input 
                type="text" 
                id="swaplab-search-input"
                value="${state.swapSearchQuery || ''}"
                placeholder="Search target ingredients (Cream, Avocado, Truffle, Nuts)..." 
                class="w-full pl-9 pr-9 py-2 rounded-xl bg-ivory dark:bg-[#181410] border border-beige-200 dark:border-stone-800 text-xs sm:text-sm font-medium text-forest dark:text-ivory placeholder:text-stone-400 focus:outline-none focus:border-terracotta transition-all"
              />
              <button 
                type="button" 
                id="swaplab-search-clear-btn" 
                class="${state.swapSearchQuery ? '' : 'hidden'} absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 w-5 h-5 rounded-full bg-beige-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-forest dark:hover:text-ivory flex items-center justify-center text-[10px] transition-all cursor-pointer"
                title="Clear search"
              >
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>

            <!-- Quick Ingredient Selection Chips with Food Photography -->
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
              ${FLAVORSHIFT_SWAP_DATABASE.map((item, idx) => {
                const q = (state.swapSearchQuery || '').toLowerCase();
                const isVisible = !q || item.targetIngredient.toLowerCase().includes(q) || item.commonInDishes.some(d => d.toLowerCase().includes(q)) || item.alternatives.some(a => a.name.toLowerCase().includes(q));
                return `
                <button 
                  type="button" 
                  data-swap-idx="${idx}"
                  class="swap-select-chip p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${isVisible ? '' : 'hidden'} ${
                    idx === state.selectedSwapIndex 
                      ? 'bg-forest text-ivory border-forest shadow-md scale-[1.02]' 
                      : 'bg-ivory dark:bg-[#181410] border-beige-200 dark:border-stone-800 text-espresso dark:text-ivory hover:border-terracotta'
                  }"
                >
                  <div class="h-20 w-full rounded-xl overflow-hidden relative shadow-xs">
                    <img src="${item.originalPhoto}" alt="${item.targetIngredient}" class="w-full h-full object-cover">
                    <span class="absolute bottom-1 right-1.5 text-[10px] bg-black/60 backdrop-blur text-beige px-1.5 py-0.5 rounded-md font-mono">
                      ${idx === 0 ? '🥛 Dairy' : idx === 1 ? '🥑 Produce' : idx === 2 ? '🍄 Umami' : idx === 3 ? '🧀 Cheese' : '🥜 Nuts'}
                    </span>
                  </div>
                  <div>
                    <span class="font-bold text-sm block leading-tight font-heading">${item.targetIngredient}</span>
                    <span class="text-[11px] opacity-80 block truncate mt-0.5 font-sans">${item.commonInDishes[0]}</span>
                  </div>
                </button>
              `;
              }).join('')}
            </div>
          </div>

          <!-- Step 2: Culinary Substitution Analysis & Photographic Comparison -->
          <div class="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1f1a16] border border-beige-200 dark:border-stone-800 shadow-xl space-y-6">
            
            <!-- Selected Ingredient & Dish Side-by-Side Visual Banner -->
            <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center border-b border-beige-200 dark:border-stone-800 pb-6">
              
              <div class="md:col-span-7 space-y-2">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="px-3 py-1 rounded-full text-xs font-bold bg-peach/50 text-terracotta border border-terracotta/30">
                    Target: ${activeSwap.targetIngredient}
                  </span>
                  <span class="text-xs text-stone-500 dark:text-stone-400 font-medium">
                    Common In: ${activeSwap.commonInDishes.join(', ')}
                  </span>
                </div>

                <h3 class="text-2xl sm:text-3xl font-black font-heading text-forest dark:text-ivory leading-tight">
                  Curated Alternatives for <span class="text-terracotta font-serif italic">"${activeSwap.targetIngredient}"</span>
                </h3>
                
                <p class="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-sans leading-relaxed">
                  Kitchen Context: <span class="text-terracotta font-semibold">${activeSwap.reasonForSwap}</span>
                </p>
              </div>

              <!-- Photographic Preview Pair (Original vs Dish) -->
              <div class="md:col-span-5 flex items-center gap-3">
                <div class="flex-1 rounded-2xl overflow-hidden border border-beige-200 dark:border-stone-700 shadow-md relative aspect-[4/3] food-img-hover">
                  <img src="${activeSwap.originalPhoto}" alt="Original" class="w-full h-full object-cover">
                  <span class="absolute bottom-1.5 left-1.5 right-1.5 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-lg text-center truncate">
                    ${activeSwap.targetIngredient}
                  </span>
                </div>

                <div class="text-terracotta font-black text-xl shrink-0">
                  <i class="fa-solid fa-arrow-right-arrow-left"></i>
                </div>

                <div class="flex-1 rounded-2xl overflow-hidden border border-terracotta/40 shadow-md relative aspect-[4/3] food-img-hover">
                  <img src="${activeSwap.dishPhoto}" alt="Dish" class="w-full h-full object-cover">
                  <span class="absolute bottom-1.5 left-1.5 right-1.5 bg-terracotta/95 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg text-center truncate">
                    ${activeSwap.commonInDishes[0]}
                  </span>
                </div>
              </div>

            </div>

            <!-- Alternative Cards with Food Photography -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              ${activeSwap.alternatives.map((alt, i) => {
                const badgeColor = i === 0 
                  ? 'bg-forest text-ivory' 
                  : i === 1 
                    ? 'bg-sage text-white' 
                    : 'bg-terracotta text-white';

                return `
                  <div class="editorial-card p-5 bg-ivory/60 dark:bg-[#181410] border border-beige-200 dark:border-stone-800 rounded-3xl flex flex-col justify-between space-y-4">
                    <div>
                      <!-- Alternative Food Image -->
                      <div class="h-36 rounded-2xl overflow-hidden mb-3.5 relative shadow-xs food-img-hover">
                        <img src="${alt.photo}" alt="${alt.name}" class="w-full h-full object-cover">
                        <span class="absolute top-2 left-2 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${badgeColor} shadow-md">
                          ${alt.type}
                        </span>
                      </div>

                      <h4 class="text-base sm:text-lg font-bold font-heading text-forest dark:text-ivory mb-2 leading-snug">
                        ${alt.name}
                      </h4>

                      <!-- Exact Ratio Box -->
                      <div class="p-3 rounded-2xl bg-white dark:bg-stone-900 border border-beige-200 dark:border-stone-800 mb-3 shadow-xs">
                        <span class="block text-[10px] font-bold uppercase text-terracotta tracking-wider font-mono">Kitchen Conversion Ratio:</span>
                        <span class="text-xs font-bold text-forest dark:text-ivory mt-0.5 block leading-relaxed font-mono">
                          ${alt.ratio}
                        </span>
                      </div>

                      <!-- Taste & Texture Qualitative Notes -->
                      <div class="space-y-2.5 text-xs">
                        <div>
                          <span class="text-stone-600 dark:text-stone-300 font-semibold flex items-center gap-1 mb-0.5">
                            <i class="fa-solid fa-face-smile text-terracotta"></i> Flavor Notes:
                          </span>
                          <p class="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed font-sans">
                            ${alt.tasteDesc}
                          </p>
                        </div>

                        <div class="pt-2 border-t border-beige-200/80 dark:border-stone-800">
                          <span class="font-semibold text-stone-600 dark:text-stone-300 block mb-0.5 flex items-center gap-1">
                            <i class="fa-solid fa-water text-sage-600"></i> Texture & Handling:
                          </span>
                          <p class="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed font-sans">
                            ${alt.textureDesc}
                          </p>
                        </div>
                      </div>
                    </div>

                    <!-- Action -->
                    <div class="pt-3 border-t border-beige-200 dark:border-stone-800">
                      ${activeSwap.targetRecipeId ? `
                        <button 
                          type="button" 
                          data-test-recipe="${activeSwap.targetRecipeId}"
                          class="w-full py-2.5 px-3 rounded-xl text-xs font-bold forest-btn transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                        >
                          <i class="fa-solid fa-fire-burner text-terracotta"></i>
                          <span>Open Recipe with Swap</span>
                        </button>
                      ` : `
                        <button 
                          type="button" 
                          data-hero-action="explore"
                          class="w-full py-2.5 px-3 rounded-xl text-xs font-bold forest-btn transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                        >
                          <i class="fa-solid fa-utensils text-terracotta"></i>
                          <span>Browse Recipe Catalog</span>
                        </button>
                      `}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>

          </div>
          `}

        </section>

        <!-- ============================================== -->
        <!-- SECTION 3: SORTED KITCHEN TOOLKIT & WORKFLOW   -->
        <!-- ============================================== -->
        <section class="space-y-4 reveal-on-scroll">
          <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-forest dark:text-sage-400 font-mono">
                Kitchen Toolkit & Workflow
              </span>
              <h2 class="font-heading font-black text-2xl text-forest dark:text-ivory">
                Everything You Need in Four Steps
              </h2>
            </div>
            <p class="text-xs text-stone-500 dark:text-stone-400 font-accent italic">
              Explore menus, toggle swaps, plan costs, and print scaled prep tickets.
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="editorial-card p-5 bg-white dark:bg-[#1f1a16] border border-beige-200 dark:border-stone-800 rounded-2xl flex flex-col justify-between space-y-3">
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-xl font-black text-terracotta/50 font-heading">01</span>
                  <i class="fa-solid fa-utensils text-terracotta"></i>
                </div>
                <h4 class="font-heading font-bold text-base text-forest dark:text-ivory">Catalog & Scaler</h4>
                <p class="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                  Browse ${RECIPES_DATA.length} dishes across 10 categories with per-person ingredient scaling and swap toggles.
                </p>
              </div>
              <button type="button" data-hero-action="explore" class="sage-btn w-full py-2 px-3 rounded-xl text-xs font-bold text-center cursor-pointer">
                View Menus →
              </button>
            </div>

            <div class="editorial-card p-5 bg-white dark:bg-[#1f1a16] border border-beige-200 dark:border-stone-800 rounded-2xl flex flex-col justify-between space-y-3">
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-xl font-black text-sage-600/50 font-heading">02</span>
                  <i class="fa-solid fa-users-viewfinder text-sage-600"></i>
                </div>
                <h4 class="font-heading font-bold text-base text-forest dark:text-ivory">Kitchen Tasting Log</h4>
                <p class="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                  Test substitutes on your own stove and save personal ratings and flavor notes locally.
                </p>
              </div>
              <button type="button" data-hero-action="htv" class="sage-btn w-full py-2 px-3 rounded-xl text-xs font-bold text-center cursor-pointer">
                Open Tasting Log →
              </button>
            </div>

            <div class="editorial-card p-5 bg-white dark:bg-[#1f1a16] border border-beige-200 dark:border-stone-800 rounded-2xl flex flex-col justify-between space-y-3">
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-xl font-black text-terracotta/50 font-heading">03</span>
                  <i class="fa-solid fa-chart-pie text-terracotta"></i>
                </div>
                <h4 class="font-heading font-bold text-base text-forest dark:text-ivory">Batch Cost Calculator</h4>
                <p class="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                  Enter your own portion costs and menu prices across 5–200 covers to check shift margins.
                </p>
              </div>
              <button type="button" data-hero-action="dashboard" class="sage-btn w-full py-2 px-3 rounded-xl text-xs font-bold text-center cursor-pointer">
                Open Calculator →
              </button>
            </div>

            <div class="editorial-card p-5 bg-white dark:bg-[#1f1a16] border border-beige-200 dark:border-stone-800 rounded-2xl flex flex-col justify-between space-y-3">
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-xl font-black text-forest-400/50 font-heading">04</span>
                  <i class="fa-solid fa-receipt text-forest dark:text-sage-300"></i>
                </div>
                <h4 class="font-heading font-bold text-base text-forest dark:text-ivory">Prep Tickets</h4>
                <p class="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                  Format and print scaled ingredient checklists and adapted cooking steps for prep stations.
                </p>
              </div>
              <button type="button" data-print-sample="paneer-butter-masala" class="sage-btn w-full py-2 px-3 rounded-xl text-xs font-bold text-center cursor-pointer">
                Print Sample Ticket →
              </button>
            </div>
          </div>
        </section>

      </div>
    `;

    container.innerHTML = html;

    // Segmented Swap Studio Mode Switcher
    container.querySelectorAll('[data-swap-studio-mode]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.swapStudioMode = btn.getAttribute('data-swap-studio-mode');
        renderSwapLabView();
      });
    });

    // Hero Showcase Dish Clicks
    container.querySelectorAll('[data-open-hero-recipe]').forEach(btn => {
      btn.addEventListener('click', () => {
        openRecipeModal(btn.getAttribute('data-open-hero-recipe'));
      });
    });

    // Universal Ingredient Lookup Events
    const uInput = container.querySelector('#universal-ingredient-input');
    const uClear = container.querySelector('#universal-search-clear-btn');
    const uSelect = container.querySelector('#universal-dish-context-select');
    const uAnalyze = container.querySelector('#universal-analyze-btn');

    const runUniversalLookup = () => {
      const val = uInput ? uInput.value.trim() : '';
      if (!val) return;
      state.universalCurrentIngredient = val;
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

    container.querySelectorAll('[data-universal-chip]').forEach(chip => {
      chip.addEventListener('click', () => {
        state.universalCurrentIngredient = chip.getAttribute('data-universal-chip');
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

    container.querySelectorAll('[data-select-alt]').forEach(btn => {
      btn.addEventListener('click', () => {
        const altName = btn.getAttribute('data-select-alt');
        showNotification('Substitute Selected', `Selected "${altName}" for ${state.universalCurrentIngredient || 'your recipe'}.`, 'success');
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

  // ========================================================
  // RENDER: EXPLORE MENUS & CATALOG VIEW
  // ========================================================
  function renderExploreView() {
    const container = document.getElementById('explore-view-container');
    if (!container) return;

    let html = `
      <div class="space-y-8 animate-fade-up">

        <!-- Dynamic Explore Banner -->
        <div class="relative rounded-3xl overflow-hidden bg-forest dark:bg-[#1A2620] text-ivory border border-beige-200/20 shadow-xl p-8 md:p-12">
          <div class="relative z-10 max-w-3xl space-y-4">
            <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-ivory/15 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-beige">
              <i class="fa-solid fa-utensils text-terracotta"></i>
              <span>Culinary Recipe Library</span>
            </div>

            <h1 class="font-heading font-black text-3xl sm:text-4xl md:text-5xl leading-tight tracking-tight text-ivory">
              Culinary Recipe Library.<br>
              <span class="text-terracotta font-serif italic">Scale Portions & Toggle Swaps</span> Live.
            </h1>

            <p class="text-ivory/85 text-sm md:text-base leading-relaxed font-normal">
              Each dish supports dynamic per-person quantity scaling, culinary ingredient swaps for out-of-stock or dietary preferences, and printable prep sheets.
            </p>
          </div>

          <div class="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
        </div>

        <!-- Search, Categories, Dietary Filters & Sort Bar -->
        <div class="space-y-4 p-6 rounded-3xl bg-white/90 dark:bg-[#1f1a16]/90 border border-beige-200/80 dark:border-stone-800/80 shadow-sm">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="relative flex-1 max-w-lg">
              <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-sm"></i>
              <input 
                type="text" 
                id="search-input"
                placeholder="Search recipes or ingredients (Cream, Truffle, Avocado, Cocoa)..." 
                class="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-[#181410] border border-beige-200 dark:border-stone-800 text-xs sm:text-sm font-medium text-forest dark:text-ivory placeholder:text-stone-400 focus:outline-none focus:border-terracotta shadow-sm transition-all"
              >
            </div>

            <div class="flex items-center gap-2 shrink-0">
              <span class="text-xs font-bold text-stone-400 hidden sm:inline">Sort by:</span>
              <select 
                id="sort-select"
                class="px-3.5 py-3 rounded-2xl bg-white dark:bg-[#181410] border border-beige-200 dark:border-stone-800 text-xs font-bold text-espresso dark:text-stone-200 focus:outline-none focus:border-terracotta shadow-sm cursor-pointer"
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
            <button type="button" data-category="all" class="cat-pill active-cat px-4 py-2 rounded-xl text-xs font-bold border border-beige-200 dark:border-stone-800 bg-white dark:bg-[#1f1a16] text-stone-700 dark:text-stone-300 hover:border-terracotta transition-all whitespace-nowrap cursor-pointer">
              All Menus (${RECIPES_DATA.length})
            </button>
            <button type="button" data-category="Cafe & Bistro Curries" class="cat-pill px-4 py-2 rounded-xl text-xs font-bold border border-beige-200 dark:border-stone-800 bg-white dark:bg-[#1f1a16] text-stone-700 dark:text-stone-300 hover:border-terracotta transition-all whitespace-nowrap cursor-pointer">
              🍛 Indian Curries & Makhani
            </button>
            <button type="button" data-category="Breads & Naan" class="cat-pill px-4 py-2 rounded-xl text-xs font-bold border border-beige-200 dark:border-stone-800 bg-white dark:bg-[#1f1a16] text-stone-700 dark:text-stone-300 hover:border-terracotta transition-all whitespace-nowrap cursor-pointer">
              🫓 Breads & Naan
            </button>
            <button type="button" data-category="South Indian" class="cat-pill px-4 py-2 rounded-xl text-xs font-bold border border-beige-200 dark:border-stone-800 bg-white dark:bg-[#1f1a16] text-stone-700 dark:text-stone-300 hover:border-terracotta transition-all whitespace-nowrap cursor-pointer">
              🥥 South Indian
            </button>
            <button type="button" data-category="Pastas & Italian" class="cat-pill px-4 py-2 rounded-xl text-xs font-bold border border-beige-200 dark:border-stone-800 bg-white dark:bg-[#1f1a16] text-stone-700 dark:text-stone-300 hover:border-terracotta transition-all whitespace-nowrap cursor-pointer">
              🍝 Pastas & Italian
            </button>
            <button type="button" data-category="Noodles & Wok" class="cat-pill px-4 py-2 rounded-xl text-xs font-bold border border-beige-200 dark:border-stone-800 bg-white dark:bg-[#1f1a16] text-stone-700 dark:text-stone-300 hover:border-terracotta transition-all whitespace-nowrap cursor-pointer">
              🍜 Noodles & Wok
            </button>
            <button type="button" data-category="Brunch & Toast" class="cat-pill px-4 py-2 rounded-xl text-xs font-bold border border-beige-200 dark:border-stone-800 bg-white dark:bg-[#1f1a16] text-stone-700 dark:text-stone-300 hover:border-terracotta transition-all whitespace-nowrap cursor-pointer">
              🥑 Brunch & Bowls
            </button>
            <button type="button" data-category="Breakfast & Morning" class="cat-pill px-4 py-2 rounded-xl text-xs font-bold border border-beige-200 dark:border-stone-800 bg-white dark:bg-[#1f1a16] text-stone-700 dark:text-stone-300 hover:border-terracotta transition-all whitespace-nowrap cursor-pointer">
              🍳 Breakfast & Morning
            </button>
            <button type="button" data-category="Diet Conscious" class="cat-pill px-4 py-2 rounded-xl text-xs font-bold border border-beige-200 dark:border-stone-800 bg-white dark:bg-[#1f1a16] text-stone-700 dark:text-stone-300 hover:border-terracotta transition-all whitespace-nowrap cursor-pointer">
              🥗 Diet Conscious
            </button>
            <button type="button" data-category="Bakery & Desserts" class="cat-pill px-4 py-2 rounded-xl text-xs font-bold border border-beige-200 dark:border-stone-800 bg-white dark:bg-[#1f1a16] text-stone-700 dark:text-stone-300 hover:border-terracotta transition-all whitespace-nowrap cursor-pointer">
              🍰 Bakery & Desserts
            </button>
            <button type="button" data-category="Coffee & Drinks" class="cat-pill px-4 py-2 rounded-xl text-xs font-bold border border-beige-200 dark:border-stone-800 bg-white dark:bg-[#1f1a16] text-stone-700 dark:text-stone-300 hover:border-terracotta transition-all whitespace-nowrap cursor-pointer">
              ☕ Artisan Coffee & Matcha
            </button>
          </div>

          <!-- Diet Focus Pills -->
          <div class="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span class="font-bold text-stone-400 shrink-0 mr-1">Diet Focus:</span>
            <button type="button" data-diet="all" class="diet-pill active-diet px-3 py-1.5 rounded-lg font-bold border border-beige-200 dark:border-stone-800 bg-white dark:bg-[#1f1a16] text-stone-700 dark:text-stone-300 hover:border-sage-500 cursor-pointer transition-all">
              All Diets
            </button>
            <button type="button" data-diet="Vegetarian" class="diet-pill px-3 py-1.5 rounded-lg font-bold border border-beige-200 dark:border-stone-800 bg-white dark:bg-[#1f1a16] text-stone-700 dark:text-stone-300 hover:border-sage-500 cursor-pointer transition-all flex items-center gap-1">
              <i class="fa-solid fa-seedling text-sage-600"></i> Vegetarian
            </button>
            <button type="button" data-diet="Vegan" class="diet-pill px-3 py-1.5 rounded-lg font-bold border border-beige-200 dark:border-stone-800 bg-white dark:bg-[#1f1a16] text-stone-700 dark:text-stone-300 hover:border-sage-500 cursor-pointer transition-all flex items-center gap-1">
              <i class="fa-solid fa-leaf text-sage-600"></i> Vegan Option
            </button>
            <button type="button" data-diet="Gluten-Free" class="diet-pill px-3 py-1.5 rounded-lg font-bold border border-beige-200 dark:border-stone-800 bg-white dark:bg-[#1f1a16] text-stone-700 dark:text-stone-300 hover:border-sage-500 cursor-pointer transition-all">
              🌾 Gluten-Free
            </button>
          </div>
        </div>

        <!-- Recipe Cards Grid Section -->
        <div>
          <div class="flex items-center justify-between mb-4">
            <span id="recipes-count-display" class="text-xs font-black uppercase tracking-wider text-stone-500">
              Showing Recipes
            </span>
            <span class="text-xs text-sage-700 dark:text-sage-400 font-bold flex items-center gap-1">
              <i class="fa-solid fa-kitchen-set"></i> Toggle swap modes on any card to preview changes
            </span>
          </div>

          <div id="recipes-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
        </div>

      </div>
    `;

    container.innerHTML = html;

    // Attach Search, Category, Diet, and Sort Listeners
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

    // Initial render of the grid
    renderExploreGrid();
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
            <div class="p-5 space-y-3">
              <div>
                <h3 class="text-lg font-black text-forest dark:text-ivory leading-snug group-hover:text-terracotta transition-colors">
                  ${recipe.title}
                </h3>
                <p class="text-stone-500 dark:text-stone-400 text-xs line-clamp-2 mt-1 leading-relaxed font-medium">
                  ${recipe.tagline}
                </p>
              </div>

              <!-- Key Ingredient Icons -->
              <div class="flex items-center gap-1.5 py-1">
                <span class="text-[11px] font-bold text-stone-400 mr-1">Includes:</span>
                ${recipe.ingredients.slice(0, 5).map(ing => `
                  <span class="w-6 h-6 rounded-lg bg-beige-100 dark:bg-stone-800/60 flex items-center justify-center text-xs" title="${ing.name}">
                    ${ing.icon || '🌿'}
                  </span>
                `).join('')}
                ${extraIngredients > 0 ? `<span class="text-[10px] text-stone-400">+${extraIngredients} more</span>` : ''}
              </div>

              <!-- Quick Swaps Bar -->
              <div class="flex flex-wrap gap-1.5 pt-1">
                <button 
                  type="button" 
                  data-card-swap-toggle="budget" 
                  data-recipe-id="${recipe.id}"
                  class="px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
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
                  class="px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
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
                    class="px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
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
            <div class="grid grid-cols-3 gap-2 py-2 px-3 rounded-2xl bg-ivory dark:bg-stone-900 text-center mb-3 border border-beige-100 dark:border-stone-800/60">
              <div>
                <span class="block text-[10px] text-stone-400 uppercase font-bold tracking-wider">Prep / Cook</span>
                <span class="text-xs font-black text-forest dark:text-ivory">${recipe.prepTime}</span>
                <span class="block text-[10px] text-stone-400">+ ${recipe.cookTime}</span>
              </div>
              <div>
                <span class="block text-[10px] text-stone-400 uppercase font-bold tracking-wider">Ingredients</span>
                <span class="text-sm font-black text-sage-700 dark:text-sage-400">${recipe.ingredients.length}</span>
                <span class="block text-[10px] text-stone-400">items</span>
              </div>
              <div>
                <span class="block text-[10px] text-stone-400 uppercase font-bold tracking-wider">Skill</span>
                <span class="text-xs font-black text-terracotta">${recipe.difficulty}</span>
                <span class="block text-[10px] text-stone-400">${rState.budgetMode || rState.calorieMode || rState.veganMode ? 'Swap Active' : 'Standard'}</span>
              </div>
            </div>

            <button 
              type="button"
              data-open-recipe="${recipe.id}"
              class="w-full py-3 px-4 rounded-2xl font-bold text-xs forest-btn text-white hover:scale-[1.01] shadow-md hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
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
            <div class="flex items-center gap-2 mb-1.5">
              <span class="px-3 py-0.5 rounded-full text-xs font-black bg-sage-100 dark:bg-sage-900/40 text-forest dark:text-sage-300 border border-sage-300/60 dark:border-sage-700 flex items-center gap-1.5 shadow-xs">
                <i class="fa-solid fa-clipboard-list text-terracotta"></i> Local Kitchen Log
              </span>
              <span class="text-xs text-stone-400 font-semibold">Personal Taste & Texture Notes</span>
            </div>
            <h2 class="text-2xl md:text-3xl font-black text-forest dark:text-ivory">
              Record Substitutions in Your Own Kitchen
            </h2>
            <p class="text-xs text-stone-500 mt-1">
              Log how a swap behaves on your stove—sauce emulsion, seasoning balance, and feedback saved directly in your browser.
            </p>
          </div>

          <button 
            type="button" 
            id="htv-open-submit-modal"
            class="px-4 py-2.5 rounded-xl text-xs font-bold forest-btn text-white shadow-md flex items-center gap-2 cursor-pointer self-start md:self-auto transition-transform hover:scale-105"
          >
            <i class="fa-solid fa-clipboard-check"></i>
            <span>Log Kitchen Tasting Test</span>
          </button>
        </div>

        <!-- 3 Factual Status Cards (No Invented Statistics) -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="p-6 rounded-3xl bg-white dark:bg-[#1f1a16] border border-beige-200 dark:border-stone-800 text-center shadow-sm">
            <span class="text-4xl font-black text-sage-600 font-heading">${submissions.length}</span>
            <span class="block text-xs font-bold text-stone-700 dark:text-stone-300 mt-1.5">Your Logged Kitchen Trials</span>
            <span class="block text-[11px] text-stone-400 mt-0.5">Entries saved in this browser</span>
          </div>

          <div class="p-6 rounded-3xl bg-white dark:bg-[#1f1a16] border border-beige-200 dark:border-stone-800 text-center shadow-sm">
            <span class="text-4xl font-black text-terracotta font-heading">${RECIPES_DATA.length}</span>
            <span class="block text-xs font-bold text-stone-700 dark:text-stone-300 mt-1.5">Catalog Dishes Available</span>
            <span class="block text-[11px] text-stone-400 mt-0.5">All ready for personal tasting notes</span>
          </div>

          <div class="p-6 rounded-3xl bg-white dark:bg-[#1f1a16] border border-beige-200 dark:border-stone-800 text-center shadow-sm">
            <span class="text-2xl sm:text-3xl font-black text-forest dark:text-ivory font-heading">Local Only</span>
            <span class="block text-xs font-bold text-stone-700 dark:text-stone-300 mt-2">Browser Storage</span>
            <span class="block text-[11px] text-stone-400 mt-0.5">No unverified public ratings included</span>
          </div>
        </div>

        <!-- Interactive Submission Drawer / Form -->
        <div id="htv-submission-box" class="hidden p-6 rounded-3xl bg-peach/30 dark:bg-stone-900 border border-terracotta/40 dark:border-stone-700 space-y-4 shadow-lg">
          <div class="flex items-center justify-between">
            <h4 class="font-black text-base text-forest dark:text-ivory flex items-center gap-2">
              <i class="fa-solid fa-flask-vial text-terracotta"></i>
              <span>Log Your Kitchen Taste Observations</span>
            </h4>
            <button type="button" id="close-htv-form-btn" class="w-8 h-8 rounded-full bg-beige-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center font-bold cursor-pointer">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div>
              <label class="block font-bold text-stone-700 dark:text-stone-300 mb-1">Your Name / Role</label>
              <input type="text" id="htv-input-author" placeholder="e.g. Home Cook / Chef" class="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#181410] border border-beige-200 dark:border-stone-800">
            </div>
            <div>
              <label class="block font-bold text-stone-700 dark:text-stone-300 mb-1">Kitchen / Location (Optional)</label>
              <input type="text" id="htv-input-kitchen" placeholder="e.g. Home Kitchen" class="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#181410] border border-beige-200 dark:border-stone-800">
            </div>
            <div>
              <label class="block font-bold text-stone-700 dark:text-stone-300 mb-1">Recipe Tested</label>
              <select id="htv-input-recipe" class="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#181410] border border-beige-200 dark:border-stone-800 font-bold">
                ${RECIPES_DATA.map(r => `<option value="${r.title}">${r.title}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block font-bold text-stone-700 dark:text-stone-300 mb-1">Your Tasting Rating</label>
              <select id="htv-input-rating" class="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#181410] border border-beige-200 dark:border-stone-800 font-bold">
                <option value="5">★★★★★ (5 - Worked very well)</option>
                <option value="4">★★★★☆ (4 - Good texture & taste)</option>
                <option value="3">★★★☆☆ (3 - Minor differences)</option>
                <option value="2">★★☆☆☆ (2 - Needs adjustment)</option>
                <option value="1">★☆☆☆☆ (1 - Did not work)</option>
              </select>
            </div>
          </div>

          <div class="text-xs">
            <label class="block font-bold text-stone-700 dark:text-stone-300 mb-1">Cooking & Taste Notes</label>
            <textarea id="htv-input-comment" rows="3" placeholder="Share how the substitute handled cooking heat, texture, and flavor..." class="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#181410] border border-beige-200 dark:border-stone-800"></textarea>
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
  function renderDashboardView() {
    const container = document.getElementById('dashboard-view-container');
    if (!container) return;

    const totalRecipes = RECIPES_DATA.length;
    const totalSwaps = FLAVORSHIFT_SWAP_DATABASE.length;
    const customRevCount = Object.values(state.customReviews).reduce((acc, list) => acc + list.length, 0);
    const totalNotesCount = state.htvSubmissions.length + customRevCount;

    const selectedCoverRecipe = getComputedRecipe(state.dashboardSelectedRecipeId) || getComputedRecipe('paneer-butter-masala');

    function computeDashMetrics() {
      const covers = state.dashboardCovers;
      const baseCost = parseFloat(state.dashBaseCost);
      const altCost = parseFloat(state.dashAltCost);
      const retail = parseFloat(state.dashRetailPrice);

      const validBase = !isNaN(baseCost) && baseCost >= 0 ? baseCost : null;
      const validAlt = !isNaN(altCost) && altCost >= 0 ? altCost : null;
      const validRetail = !isNaN(retail) && retail > 0 ? retail : null;

      const baseTotal = validBase !== null ? formatMoney(validBase * covers) : 'Enter cost';
      const altTotal = validAlt !== null ? formatMoney(validAlt * covers) : 'Enter alt cost';
      const diffTotal = (validBase !== null && validAlt !== null)
        ? ((validBase - validAlt) * covers >= 0 ? '+' : '-') + formatMoney(Math.abs((validBase - validAlt) * covers))
        : '—';
      const altMargin = (validAlt !== null && validRetail !== null)
        ? `${calcMargin(validAlt, validRetail)}% margin`
        : (validBase !== null && validRetail !== null ? `${calcMargin(validBase, validRetail)}% base margin` : 'Enter menu price');

      const revenueTotal = validRetail !== null ? formatMoney(validRetail * covers) : '—';

      return { baseTotal, altTotal, diffTotal, altMargin, revenueTotal, covers };
    }

    const m = computeDashMetrics();

    let html = `
      <div class="space-y-8 animate-fade-up">
        
        <div class="relative overflow-hidden rounded-3xl p-6 md:p-8 bg-forest dark:bg-[#1A2620] text-ivory shadow-xl border border-beige-200/20">
          <div class="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div class="space-y-2">
              <div class="flex flex-wrap items-center gap-2.5">
                <span class="px-3 py-1 rounded-full text-xs font-black bg-ivory/15 text-beige border border-beige-200/30 flex items-center gap-1.5 shadow-sm">
                  <i class="fa-solid fa-calculator text-terracotta"></i>
                  <span>User-Driven Cost & Margin Calculator</span>
                </span>
              </div>

              <h2 class="text-2xl sm:text-3xl lg:text-4xl font-black font-heading tracking-tight text-ivory">
                Kitchen Batch Cost & Margin Simulator
              </h2>
              <p class="text-ivory/80 text-xs sm:text-sm max-w-2xl font-medium leading-relaxed">
                Enter your own supplier costs per portion and menu price to calculate batch totals and gross margins across 5–200 covers.
              </p>
            </div>

            <div class="flex flex-wrap items-center gap-2.5 shrink-0">
              <button type="button" id="dash-quick-pantry-btn" class="px-4 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-ivory border border-white/20 backdrop-blur transition-all cursor-pointer flex items-center gap-2 shadow-sm">
                <i class="fa-solid fa-boxes-stacked text-terracotta"></i>
                <span>Pantry Stock</span>
              </button>
              <button type="button" id="dash-launch-slides-btn" class="px-4 py-2.5 rounded-xl text-xs font-bold terracotta-btn text-white shadow-lg transition-all cursor-pointer flex items-center gap-2">
                <i class="fa-solid fa-lightbulb"></i>
                <span>Design Thinking Deck</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 4 Factual Summary Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="dash-kpi-card p-6 bg-white dark:bg-[#1f1a16] border border-beige-200 dark:border-stone-800 shadow-sm flex flex-col justify-between rounded-3xl">
            <div>
              <div class="flex items-center justify-between mb-4">
                <span class="text-xs font-black text-stone-400 uppercase tracking-wider">Catalog Recipes</span>
                <span class="w-10 h-10 rounded-2xl bg-forest/15 text-sage-700 dark:text-sage-400 flex items-center justify-center font-bold">
                  <i class="fa-solid fa-utensils"></i>
                </span>
              </div>
              <span class="text-3xl font-black text-forest dark:text-ivory tracking-tight">${totalRecipes}</span>
            </div>
            <div class="pt-3 border-t border-beige-100 dark:border-stone-800">
              <span class="text-[11px] text-sage-700 dark:text-sage-400 font-bold">Dishes available in menu library</span>
            </div>
          </div>

          <div class="dash-kpi-card p-6 bg-white dark:bg-[#1f1a16] border border-beige-200 dark:border-stone-800 shadow-sm flex flex-col justify-between rounded-3xl">
            <div>
              <div class="flex items-center justify-between mb-4">
                <span class="text-xs font-black text-stone-400 uppercase tracking-wider">Swap Profiles</span>
                <span class="w-10 h-10 rounded-2xl bg-terracotta/15 text-terracotta flex items-center justify-center font-bold">
                  <i class="fa-solid fa-flask-vial"></i>
                </span>
              </div>
              <span class="text-3xl font-black text-forest dark:text-ivory tracking-tight">${totalSwaps}</span>
            </div>
            <div class="pt-3 border-t border-beige-100 dark:border-stone-800">
              <span class="text-[11px] text-terracotta font-bold">Target ingredients in Swap Lab</span>
            </div>
          </div>

          <div class="dash-kpi-card p-6 bg-white dark:bg-[#1f1a16] border border-beige-200 dark:border-stone-800 shadow-sm flex flex-col justify-between rounded-3xl">
            <div>
              <div class="flex items-center justify-between mb-4">
                <span class="text-xs font-black text-stone-400 uppercase tracking-wider">Saved Notes</span>
                <span class="w-10 h-10 rounded-2xl bg-sage-100 dark:bg-stone-800 text-sage-700 dark:text-sage-300 flex items-center justify-center font-bold">
                  <i class="fa-solid fa-clipboard-list"></i>
                </span>
              </div>
              <span class="text-3xl font-black text-forest dark:text-ivory tracking-tight">${totalNotesCount}</span>
            </div>
            <div class="pt-3 border-t border-beige-100 dark:border-stone-800">
              <span class="text-[11px] text-stone-500 font-bold">User notes stored in browser</span>
            </div>
          </div>

          <div class="dash-kpi-card p-6 bg-white dark:bg-[#1f1a16] border border-beige-200 dark:border-stone-800 shadow-sm flex flex-col justify-between rounded-3xl">
            <div>
              <div class="flex items-center justify-between mb-4">
                <span class="text-xs font-black text-stone-400 uppercase tracking-wider">Slider Range</span>
                <span class="w-10 h-10 rounded-2xl bg-peach/50 text-terracotta flex items-center justify-center font-bold">
                  <i class="fa-solid fa-sliders"></i>
                </span>
              </div>
              <span class="text-3xl font-black text-forest dark:text-ivory tracking-tight">5–200</span>
            </div>
            <div class="pt-3 border-t border-beige-100 dark:border-stone-800">
              <span class="text-[11px] text-stone-500 font-bold">Covers supported in calculator below</span>
            </div>
          </div>
        </div>

        <!-- Interactive Calculator -->
        <div class="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#1f1a16] border border-beige-200 dark:border-stone-800 shadow-sm space-y-6">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span class="text-xs font-black uppercase tracking-wider text-terracotta">Kitchen Batch Calculator</span>
              <h3 class="text-xl font-black text-forest dark:text-ivory flex items-center gap-2">
                <i class="fa-solid fa-calculator text-terracotta"></i>
                <span>Custom Covers Cost & Margin Simulator</span>
              </h3>
              <p class="text-xs text-stone-500">Calculations update strictly from the values you enter below (zero pre-filled mock prices)</p>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <select id="dash-currency-select" aria-label="Select currency" class="px-3 py-2.5 text-xs rounded-xl border border-beige-200 dark:border-stone-800 bg-ivory dark:bg-[#181410] font-bold text-espresso dark:text-ivory focus:outline-none focus:border-terracotta cursor-pointer shadow-sm">
                <option value="₹" ${state.currency === '₹' ? 'selected' : ''}>₹ INR</option>
                <option value="$" ${state.currency === '$' ? 'selected' : ''}>$ USD</option>
              </select>
              <select id="dash-cover-recipe-select" class="px-3.5 py-2.5 text-xs rounded-xl border border-beige-200 dark:border-stone-800 bg-ivory dark:bg-[#181410] font-bold text-espresso dark:text-ivory focus:outline-none focus:border-terracotta cursor-pointer shadow-sm">
                ${RECIPES_DATA.map(r => `
                  <option value="${r.id}" ${r.id === state.dashboardSelectedRecipeId ? 'selected' : ''}>
                    ${r.title}
                  </option>
                `).join('')}
              </select>
            </div>
          </div>

          <!-- User Pricing Inputs -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label class="block font-bold text-stone-700 dark:text-stone-300 mb-1">Your Standard Cost / Portion (<span class="dash-currency-symbol">${state.currency}</span>)</label>
              <input type="number" step="0.01" min="0" id="dash-base-cost-input" value="${state.dashBaseCost}" placeholder="e.g. 120" class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-[#181410] border border-beige-200 dark:border-stone-800 font-mono font-bold text-forest dark:text-ivory focus:outline-none focus:border-terracotta">
            </div>
            <div>
              <label class="block font-bold text-stone-700 dark:text-stone-300 mb-1">Your Swapped Cost / Portion (<span class="dash-currency-symbol">${state.currency}</span>)</label>
              <input type="number" step="0.01" min="0" id="dash-alt-cost-input" value="${state.dashAltCost}" placeholder="e.g. 85" class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-[#181410] border border-beige-200 dark:border-stone-800 font-mono font-bold text-forest dark:text-ivory focus:outline-none focus:border-terracotta">
            </div>
            <div>
              <label class="block font-bold text-stone-700 dark:text-stone-300 mb-1">Your Menu Price / Portion (<span class="dash-currency-symbol">${state.currency}</span>)</label>
              <input type="number" step="0.01" min="0" id="dash-retail-price-input" value="${state.dashRetailPrice}" placeholder="e.g. 320" class="w-full px-3.5 py-2.5 rounded-xl bg-ivory dark:bg-[#181410] border border-beige-200 dark:border-stone-800 font-mono font-bold text-forest dark:text-ivory focus:outline-none focus:border-terracotta">
            </div>
          </div>

          <div class="p-5 rounded-2xl bg-ivory dark:bg-[#181410]/60 border border-beige-200 dark:border-stone-800 space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm font-bold text-stone-700 dark:text-stone-300">Target Shift Covers (${selectedCoverRecipe.title}):</span>
              <span class="text-2xl font-black text-terracotta font-heading" id="dash-covers-display">
                ${m.covers} Persons
              </span>
            </div>
            
            <input 
              type="range" 
              id="dash-covers-slider" 
              min="5" 
              max="200" 
              step="5" 
              value="${state.dashboardCovers}"
              class="w-full accent-terracotta cursor-pointer"
            >
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <div class="p-5 rounded-2xl bg-peach/30 dark:bg-stone-900 border border-peach dark:border-stone-800">
              <span class="block text-xs text-terracotta font-bold uppercase">Standard Batch Cost</span>
              <span id="dash-out-base-total" class="block text-2xl font-black text-forest dark:text-ivory my-1">${m.baseTotal}</span>
              <span class="block text-xs text-stone-500">Based on your standard cost</span>
            </div>

            <div class="p-5 rounded-2xl bg-sage-50 dark:bg-stone-900 border border-sage-200 dark:border-stone-800">
              <span class="block text-xs text-sage-700 dark:text-sage-300 font-bold uppercase">Swapped Batch Cost</span>
              <span id="dash-out-alt-total" class="block text-2xl font-black text-forest dark:text-ivory my-1">${m.altTotal}</span>
              <span class="block text-xs text-stone-500">Based on your alt cost</span>
            </div>

            <div class="p-5 rounded-2xl bg-beige/40 dark:bg-stone-900 border border-beige-300 dark:border-stone-800">
              <span class="block text-xs text-espresso dark:text-beige font-bold uppercase">Gross Revenue</span>
              <span id="dash-out-revenue" class="block text-2xl font-black text-forest dark:text-ivory my-1">${m.revenueTotal}</span>
              <span id="dash-out-margin" class="block text-xs text-sage-700 dark:text-sage-400 font-bold">${m.altMargin}</span>
            </div>

            <div class="p-5 rounded-2xl bg-peach/40 dark:bg-stone-900 border border-terracotta/30 dark:border-stone-800">
              <span class="block text-xs text-terracotta font-bold uppercase">Net Cost Difference</span>
              <span id="dash-out-savings" class="block text-2xl font-black text-terracotta my-1">${m.diffTotal}</span>
              <span class="block text-xs text-stone-500">Across selected covers</span>
            </div>
          </div>
        </div>

      </div>
    `;

    container.innerHTML = html;

    function refreshDashNumbers() {
      const updated = computeDashMetrics();
      const setTxt = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
      setTxt('dash-covers-display', `${updated.covers} Persons`);
      setTxt('dash-out-base-total', updated.baseTotal);
      setTxt('dash-out-alt-total', updated.altTotal);
      setTxt('dash-out-revenue', updated.revenueTotal);
      setTxt('dash-out-margin', updated.altMargin);
      setTxt('dash-out-savings', updated.diffTotal);
    }

    document.getElementById('dash-quick-pantry-btn')?.addEventListener('click', () => {
      switchTab('explore');
      document.getElementById('pantry-drawer')?.classList.remove('hidden');
    });

    document.getElementById('dash-launch-slides-btn')?.addEventListener('click', () => {
      switchTab('slides');
    });

    document.getElementById('dash-currency-select')?.addEventListener('change', (e) => {
      state.currency = e.target.value;
      localStorage.setItem('flavorshift_currency', state.currency);
      document.querySelectorAll('.dash-currency-symbol').forEach(el => { el.textContent = state.currency; });
      refreshDashNumbers();
    });

    document.getElementById('dash-cover-recipe-select')?.addEventListener('change', (e) => {
      state.dashboardSelectedRecipeId = e.target.value;
      renderDashboardView();
    });

    document.getElementById('dash-base-cost-input')?.addEventListener('input', (e) => {
      state.dashBaseCost = e.target.value;
      refreshDashNumbers();
    });

    document.getElementById('dash-alt-cost-input')?.addEventListener('input', (e) => {
      state.dashAltCost = e.target.value;
      refreshDashNumbers();
    });

    document.getElementById('dash-retail-price-input')?.addEventListener('input', (e) => {
      state.dashRetailPrice = e.target.value;
      refreshDashNumbers();
    });

    const coverSlider = document.getElementById('dash-covers-slider');
    coverSlider?.addEventListener('input', (e) => {
      state.dashboardCovers = parseInt(e.target.value, 10);
      refreshDashNumbers();
    });
  }

  // ========================================================
  // RENDER: DESIGN THINKING SLIDES
  // ========================================================
  function renderDesignThinkingView() {
    const container = document.getElementById('slides-view-container');
    if (!container) return;

    const currentSlide = DESIGN_THINKING_SLIDES[state.currentSlideIndex] || DESIGN_THINKING_SLIDES[0];
    const totalSlides = DESIGN_THINKING_SLIDES.length;

    let html = `
      <div class="space-y-6 max-w-5xl mx-auto animate-fade-up">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-beige-200 dark:border-stone-800 pb-4">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="px-3 py-0.5 rounded-full text-xs font-black bg-peach/40 text-terracotta border border-terracotta/30">
                Design Thinking Deck
              </span>
              <span class="text-xs text-stone-400 font-semibold">FlavorShift Product Workflow</span>
            </div>
            <h2 class="text-2xl md:text-3xl font-black text-forest dark:text-ivory">
              Designing FlavorShift AI
            </h2>
            <p class="text-xs text-stone-500">
              5-Stage Design Thinking overview covering culinary substitution workflows and local user feedback.
            </p>
          </div>

          <div class="flex items-center gap-2">
            <button type="button" id="slide-prev-btn" class="w-10 h-10 rounded-xl bg-white dark:bg-[#1f1a16] border border-beige-200 dark:border-stone-800 hover:border-terracotta flex items-center justify-center font-bold text-stone-700 dark:text-stone-300 transition-all cursor-pointer ${state.currentSlideIndex === 0 ? 'opacity-40 cursor-not-allowed' : ''}" ${state.currentSlideIndex === 0 ? 'disabled' : ''}>
              <i class="fa-solid fa-chevron-left"></i>
            </button>
            <button type="button" id="slide-autoplay-btn" class="px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${state.slideAutoplay ? 'bg-terracotta text-white' : 'bg-white dark:bg-[#1f1a16] border-beige-200 dark:border-stone-800 text-stone-700 dark:text-stone-300'}">
              <i class="fa-solid ${state.slideAutoplay ? 'fa-pause' : 'fa-play'}"></i>
              <span>${state.slideAutoplay ? 'Pause' : 'Autoplay'}</span>
            </button>
            <button type="button" id="slide-next-btn" class="w-10 h-10 rounded-xl bg-white dark:bg-[#1f1a16] border border-beige-200 dark:border-stone-800 hover:border-terracotta flex items-center justify-center font-bold text-stone-700 dark:text-stone-300 transition-all cursor-pointer ${state.currentSlideIndex === totalSlides - 1 ? 'opacity-40 cursor-not-allowed' : ''}" ${state.currentSlideIndex === totalSlides - 1 ? 'disabled' : ''}>
              <i class="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>

        <div class="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          ${DESIGN_THINKING_SLIDES.map((s, idx) => `
            <button type="button" data-jump-slide="${idx}" class="px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${idx === state.currentSlideIndex ? 'bg-forest dark:bg-ivory text-ivory dark:text-forest border-transparent shadow-sm' : 'bg-white dark:bg-[#1f1a16] text-stone-600 dark:text-stone-400 border-beige-200 dark:border-stone-800'}">
              ${s.stage}
            </button>
          `).join('')}
        </div>

        <div class="editorial-card bg-white dark:bg-[#1f1a16]/95 border border-beige-200 dark:border-stone-800 rounded-3xl p-6 md:p-10 shadow-xl relative min-h-[460px] flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider terracotta-btn text-white shadow-sm">
                ${currentSlide.badge}
              </span>
              <span class="text-xs font-black text-stone-400">
                Slide ${currentSlide.slideNumber} of ${totalSlides}
              </span>
            </div>

            <h3 class="text-2xl md:text-3xl font-black text-forest dark:text-ivory mb-2 leading-tight">
              ${currentSlide.title}
            </h3>
            <p class="text-stone-500 dark:text-stone-300 text-sm mb-8 leading-relaxed max-w-3xl">
              ${currentSlide.subtitle}
            </p>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              ${currentSlide.points.map(pt => `
                <div class="p-4 rounded-2xl bg-ivory dark:bg-stone-900 border border-beige-200 dark:border-stone-800">
                  <div class="font-extrabold text-sm text-forest dark:text-ivory mb-2 flex items-center gap-1.5">
                    <i class="fa-solid fa-circle-check text-terracotta text-xs"></i>
                    <span>${pt.title}</span>
                  </div>
                  <p class="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
                    ${pt.desc}
                  </p>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="pt-6 border-t border-beige-100 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <span class="text-2xl font-black text-terracotta">${currentSlide.metric.value}</span>
              <span class="text-xs text-stone-500 font-medium max-w-xs leading-snug">${currentSlide.metric.label}</span>
            </div>

            <div class="flex items-center gap-1.5">
              ${DESIGN_THINKING_SLIDES.map((_, i) => `
                <span data-jump-slide="${i}" class="w-3 h-3 rounded-full transition-all cursor-pointer ${i === state.currentSlideIndex ? 'bg-terracotta w-6' : 'bg-beige-300 dark:bg-stone-800'}"></span>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;

    document.getElementById('slide-prev-btn')?.addEventListener('click', () => {
      if (state.currentSlideIndex > 0) {
        state.currentSlideIndex--;
        renderDesignThinkingView();
      }
    });

    document.getElementById('slide-next-btn')?.addEventListener('click', () => {
      if (state.currentSlideIndex < totalSlides - 1) {
        state.currentSlideIndex++;
        renderDesignThinkingView();
      }
    });

    document.querySelectorAll('[data-jump-slide]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.currentSlideIndex = parseInt(btn.getAttribute('data-jump-slide'), 10);
        renderDesignThinkingView();
      });
    });

    document.getElementById('slide-autoplay-btn')?.addEventListener('click', () => {
      state.slideAutoplay = !state.slideAutoplay;
      if (state.slideAutoplay) {
        stopSlideAutoplay();
        state.autoplayTimer = setInterval(() => {
          state.currentSlideIndex = (state.currentSlideIndex + 1) % DESIGN_THINKING_SLIDES.length;
          renderDesignThinkingView();
        }, 4500);
      } else {
        stopSlideAutoplay();
      }
      renderDesignThinkingView();
    });
  }

  function stopSlideAutoplay() {
    if (state.autoplayTimer) {
      clearInterval(state.autoplayTimer);
      state.autoplayTimer = null;
    }
  }

  // ========================================================
  // RENDER: FAVORITES VIEW
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
                        <div class="text-[11px] text-terracotta dark:text-amber-300 font-medium">
                          💡 ${ing.swapReason}
                        </div>
                      ` : ''}
                      <div class="text-[11px] text-stone-400">
                        Category: ${ing.category}
                      </div>
                    </div>
                  </div>

                  <div class="text-right shrink-0">
                    <div class="text-sm font-black text-terracotta dark:text-amber-400">
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
                <h3 class="text-xl font-black text-forest dark:text-ivory flex items-center gap-2">
                  <i class="fa-solid fa-fire-burner text-sage-600"></i>
                  <span>Chef Culinary Method (Swapped Ingredients Integrated Seamlessly)</span>
                </h3>
              </div>
              <div class="text-xs text-stone-500">
                Ticket Time: <span class="font-extrabold text-forest dark:text-ivory">${cRec.prepTime} prep + ${cRec.cookTime} cook</span>
              </div>
            </div>

            <div class="space-y-3">
              ${cRec.steps.map((step, idx) => `
                <div class="p-4 rounded-2xl bg-white dark:bg-[#1f1a16]/90 border border-beige-200 dark:border-stone-800/80 shadow-sm flex items-start gap-4">
                  <span class="w-8 h-8 rounded-xl terracotta-btn text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
                    ${idx + 1}
                  </span>
                  <div class="flex-1 text-sm text-espresso dark:text-slate-200 leading-relaxed font-medium">
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
    } else if (tabName === 'slides') {
      renderDesignThinkingView();
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
    setTimeout(initScrollAnimations, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
