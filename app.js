// FlavorShift AI - Intelligent Culinary Ingredient Substitution & Human Taste Validation Platform
// Core Application Engine

(function () {
  'use strict';

  // Application State
  const state = {
    activeTab: 'swaplab', // 'swaplab', 'explore', 'htv', 'dashboard', 'favorites'
    selectedSwapIndex: 0,
    swapStudioMode: 'universal', // 'universal' | 'curated'
    universalCurrentIngredient: 'Fresh Cream',
    universalCurrentDishName: 'Paneer Butter Masala',
    universalCurrentDishContext: 'Curries & Gravies',
    universalCompareMode: false,
    selectedSubstitutedAlt: '',
    substitutedRecipePersons: 1,
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
        <section class="relative overflow-hidden rounded-3xl bg-forest dark:bg-[#1A2620] text-ivory shadow-xl p-6 sm:p-10 lg:p-12 border border-beige-200/20 glow-card reveal-on-scroll">
          <div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

            <div class="lg:col-span-7 space-y-5">
              <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ivory/15 backdrop-blur-md text-xs font-bold tracking-wider text-beige uppercase border border-ivory/20">
                <i class="fa-solid fa-wand-magic-sparkles text-terracotta"></i>
                <span>Culinary Substitution & Portion Studio</span>
              </div>

              <h1 class="font-heading font-black text-3xl sm:text-5xl lg:text-[3.15rem] tracking-tight leading-[1.12]">
                Culinary Precision When Ingredients Run Short.<br>
                <span class="text-terracotta font-serif italic">Chef-Calibrated Ratios</span> for Real Kitchens.
              </h1>

              <p class="text-ivory/90 text-base sm:text-lg leading-relaxed font-normal max-w-2xl font-sans">
                Substitute scarce or dietary ingredients cleanly without losing sauce emulsion, aroma depth, or texture—across ${RECIPES_DATA.length} curated kitchen recipes.
              </p>

              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-center">
                <div class="bg-forest-800/80 dark:bg-black/40 backdrop-blur-md rounded-2xl p-3 border border-beige-200/15">
                  <span class="block text-xl font-black text-ivory font-heading">${RECIPES_DATA.length} Dishes</span>
                  <span class="text-xs text-beige/85 font-bold uppercase tracking-wider">Recipe Library</span>
                </div>
                <div class="bg-forest-800/80 dark:bg-black/40 backdrop-blur-md rounded-2xl p-3 border border-beige-200/15">
                  <span class="block text-xl font-black text-terracotta font-heading">${presetShowcase.length || FLAVORSHIFT_SWAP_DATABASE.length} Presets</span>
                  <span class="text-xs text-beige/85 font-bold uppercase tracking-wider">Quick Swaps</span>
                </div>
                <div class="bg-forest-800/80 dark:bg-black/40 backdrop-blur-md rounded-2xl p-3 border border-beige-200/15">
                  <span class="block text-xl font-black text-sage-300 font-heading">1+ Covers</span>
                  <span class="text-xs text-beige/85 font-bold uppercase tracking-wider">Portion Scaling</span>
                </div>
                <div class="bg-forest-800/80 dark:bg-black/40 backdrop-blur-md rounded-2xl p-3 border border-beige-200/15">
                  <span class="block text-xl font-black text-peach font-heading">Local Log</span>
                  <span class="text-xs text-beige/85 font-bold uppercase tracking-wider">Tasting Notes</span>
                </div>
              </div>

              <div class="pt-2 flex flex-wrap items-center gap-3.5">
                <a href="#ai-swaplab-stage" class="terracotta-btn px-6 py-3.5 rounded-2xl text-sm font-bold flex items-center gap-2 cursor-pointer shadow-md">
                  <i class="fa-solid fa-magnifying-glass"></i>
                  <span>Open Swap Prompt Studio</span>
                </a>
                <button type="button" data-hero-action="explore" class="px-6 py-3.5 rounded-2xl text-sm font-bold flex items-center gap-2 cursor-pointer bg-ivory/15 hover:bg-ivory/25 text-ivory border border-ivory/30 backdrop-blur-sm transition-all">
                  <span>Browse ${RECIPES_DATA.length} Catalog Dishes</span>
                  <i class="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>

            <!-- Sorted 2x2 Culinary Dish Mosaic (Zero Videos) -->
            <div class="lg:col-span-5 grid grid-cols-2 gap-3.5">
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
                  <div class="absolute bottom-2.5 left-3 right-3">
                    <span class="block text-sm font-bold text-ivory leading-tight truncate">${card.label}</span>
                    <span class="block text-xs text-peach/90 truncate mt-0.5">${card.sub}</span>
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
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#1f1a16] px-6 py-4 rounded-2xl border border-beige-200 dark:border-stone-800 shadow-xs">
            <div class="flex items-center gap-2.5">
              <i class="fa-solid fa-flask-vial text-terracotta text-lg"></i>
              <h2 class="font-heading font-bold text-xl sm:text-2xl text-forest dark:text-ivory">Swap Workspace</h2>
            </div>

            <div class="inline-flex p-1 rounded-xl bg-ivory dark:bg-[#181410] border border-beige-200 dark:border-stone-800">
              <button
                type="button"
                data-swap-studio-mode="universal"
                class="px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
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
                class="px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
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
          <div class="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1f1a16] border border-beige-200 dark:border-stone-800 shadow-sm space-y-6 glow-card">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-beige-200 dark:border-stone-800 pb-4">
              <div>
                <span class="text-xs font-bold uppercase tracking-wider text-terracotta font-mono">UNIVERSAL INGREDIENT PROMPT</span>
                <h3 class="text-2xl sm:text-3xl font-bold font-heading text-forest dark:text-ivory flex items-center gap-2.5 mt-1">
                  <i class="fa-solid fa-magnifying-glass text-terracotta text-xl"></i>
                  <span>What Ingredient Are You Substituting Today?</span>
                </h3>
              </div>
              <span class="text-sm text-stone-500 font-accent italic">Context-aware kitchen ratios, texture notes & allergens</span>
            </div>

            <!-- Executive Chef Quick-Prompt Starters -->
            <div class="p-4 rounded-2xl bg-ivory/80 dark:bg-[#181410] border border-beige-200/80 dark:border-stone-800 space-y-2.5">
              <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-forest dark:text-sage-300 font-mono">
                <i class="fa-solid fa-sparkles text-terracotta"></i>
                <span>QUICK KITCHEN SCENARIOS (CLICK TO TEST PROMPT)</span>
              </div>
              <div class="flex flex-wrap gap-2">
                ${[
                  { label: '“Out of heavy cream for rich Indian curry”', ing: 'Fresh Cream', ctx: 'Curries & Gravies', dish: 'Paneer Butter Masala' },
                  { label: '“Need a dairy-free aged cheese swap for pasta”', ing: 'Parmesan', ctx: 'Pastas & Sauces', dish: 'Wild Mushroom Fettuccine' },
                  { label: '“Eggless baking binder for sponges & muffins”', ing: 'Eggs', ctx: 'Baking & Cakes', dish: 'San Sebastian Basque Cake' },
                  { label: '“Warm saffron color & aroma alternative for rice”', ing: 'Saffron', ctx: 'Curries & Gravies', dish: 'Paneer Butter Masala' },
                  { label: '“Nut-free toasted crunch for pesto & salads”', ing: 'Pine Nuts', ctx: 'Salads & Dressings', dish: 'Smashed Avocado Toast' }
                ].map(p => `
                  <button
                    type="button"
                    data-prompt-ing="${p.ing}"
                    data-prompt-ctx="${p.ctx}"
                    data-prompt-dish="${p.dish}"
                    class="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer text-left ${
                      currentIng && currentIng.toLowerCase() === p.ing.toLowerCase() && currentCtx === p.ctx
                        ? 'bg-terracotta text-white border-terracotta shadow-sm'
                        : 'bg-white dark:bg-stone-900 border-beige-200 dark:border-stone-700 text-espresso dark:text-ivory hover:border-terracotta'
                    }"
                  >
                    ${p.label}
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Search Bar + Dish Context + Analyze CTA -->
            <div class="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-end">
              <div class="md:col-span-6 relative">
                <label for="universal-ingredient-input" class="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5 ml-1">TARGET INGREDIENT</label>
                <div class="relative">
                  <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-sm"></i>
                  <input
                    type="text"
                    id="universal-ingredient-input"
                    value="${currentIng || ''}"
                    placeholder="Type any ingredient (Milk, Paneer, Mushroom, Miso, Gochuj..."
                    class="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-ivory dark:bg-[#181410] border border-beige-200 dark:border-stone-800 text-sm sm:text-base font-semibold text-forest dark:text-ivory placeholder:text-stone-400 focus:outline-none focus:border-terracotta transition-all shadow-xs"
                  />
                  <button
                    type="button"
                    id="universal-search-clear-btn"
                    class="${currentIng ? '' : 'hidden'} absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-beige-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-forest dark:hover:text-ivory flex items-center justify-center text-xs cursor-pointer"
                    title="Clear input"
                  >
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>

              <div class="md:col-span-4 relative">
                <label for="universal-dish-context-select" class="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5 ml-1">CULINARY DISH CONTEXT</label>
                <div class="relative">
                  <i class="fa-solid fa-bowl-food absolute left-4 top-1/2 -translate-y-1/2 text-terracotta text-sm"></i>
                  <select
                    id="universal-dish-context-select"
                    class="w-full pl-11 pr-9 py-3.5 rounded-2xl bg-ivory dark:bg-[#181410] border border-beige-200 dark:border-stone-800 text-sm sm:text-base font-bold text-espresso dark:text-ivory focus:outline-none focus:border-terracotta cursor-pointer appearance-none shadow-xs"
                  >
                    ${dishContexts.map(ctx => `<option value="${ctx}" ${ctx === currentCtx ? 'selected' : ''}>${ctx}</option>`).join('')}
                  </select>
                  <i class="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 text-xs pointer-events-none"></i>
                </div>
              </div>

              <div class="md:col-span-2">
                <button
                  type="button"
                  id="universal-analyze-btn"
                  class="w-full py-3.5 px-4 rounded-2xl text-sm sm:text-base font-bold terracotta-btn text-white transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <i class="fa-solid fa-bolt"></i>
                  <span>Analyze</span>
                </button>
              </div>
            </div>

            <!-- Common Pantry Targets -->
            ${presetShowcase.length > 0 ? `
              <div class="flex flex-wrap items-center gap-2 pt-1">
                <span class="text-xs font-bold text-stone-500 mr-1">Common Pantry Targets:</span>
                ${presetShowcase.slice(0, 12).map(p => `
                  <button
                    type="button"
                    data-universal-chip="${p.name}"
                    class="px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                      currentIng && currentIng.toLowerCase() === p.name.toLowerCase()
                        ? 'bg-forest text-ivory border-forest shadow-xs'
                        : 'bg-ivory dark:bg-[#181410] border border-beige-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-terracotta'
                    }"
                  >
                    <i class="${p.icon} text-xs text-terracotta"></i>
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
                  </div>
                </div>
              ` : uResult.status === 'recognized' ? (() => {
                const rawAlts = uResult.alternatives || [];
                const alts = rawAlts.slice(0, 3);
                while (alts.length < 3) {
                  alts.push({
                    name: 'Chef-Calibrated Whole Food Alternative',
                    type: 'Functional Kitchen Emulsion',
                    ratio: '1:1 by volume or weight',
                    calcMethod: 'Functional moisture and lipid balance',
                    tasteDesc: 'Neutral, creamy culinary medium that absorbs dish flavors.',
                    textureDesc: 'Smooth consistency matching target viscosity.',
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
                  <div class="pt-6 border-t border-beige-200 dark:border-stone-800 space-y-6">
                    <!-- Top Summary Bar (Matching Image 2) -->
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-beige-200 dark:border-stone-800">
                      <div class="space-y-1.5">
                        <div class="flex flex-wrap items-center gap-2">
                          <span class="px-3 py-1 rounded-full text-xs font-bold bg-peach/50 text-terracotta border border-terracotta/30 flex items-center gap-1.5">
                            <i class="${uResult.icon || 'fa-solid fa-utensils'} text-xs"></i> Missing: ${uResult.ingredientName}
                          </span>
                          <span class="px-3 py-1 rounded-full text-xs font-bold bg-beige-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                            ${uResult.category}
                          </span>
                          <span class="px-3 py-1 rounded-full text-xs font-bold bg-sage-100 dark:bg-stone-800 text-forest dark:text-sage-300">
                            Target Dish: ${currentDish || matchedRecipe.title}
                          </span>
                        </div>
                        <p class="text-sm text-stone-600 dark:text-stone-300">
                          <strong>Culinary Role:</strong> ${(uResult.functions || []).join(', ')} • <strong>Profile:</strong> ${uResult.flavorProfile}
                        </p>
                      </div>
                      <div class="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          id="toggle-compare-mode-btn"
                          class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer flex items-center gap-2 ${
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

                    <!-- Comparison Matrix Table -->
                    ${state.universalCompareMode ? `
                      <div class="overflow-x-auto p-4 rounded-2xl bg-ivory/70 dark:bg-[#181410] border border-beige-200 dark:border-stone-800">
                        <table class="w-full text-left text-xs sm:text-sm border-collapse">
                          <thead>
                            <tr class="border-b border-beige-200 dark:border-stone-800 text-xs uppercase tracking-wider text-stone-500">
                              <th class="py-2.5 px-3">Alternative</th>
                              <th class="py-2.5 px-3">Score</th>
                              <th class="py-2.5 px-3">Conversion Ratio</th>
                              <th class="py-2.5 px-3">Taste Notes</th>
                              <th class="py-2.5 px-3">Dietary & Allergens</th>
                              <th class="py-2.5 px-3 text-right">Select</th>
                            </tr>
                          </thead>
                          <tbody class="divide-y divide-beige-200/70 dark:divide-stone-800">
                            ${alts.map(alt => `
                              <tr>
                                <td class="py-3 px-3 font-bold text-forest dark:text-ivory">
                                  ${alt.name}
                                  <span class="block text-xs font-normal text-terracotta mt-0.5">${alt.type}</span>
                                </td>
                                <td class="py-3 px-3 font-mono font-bold text-xs text-terracotta">${alt.score != null ? alt.score : 85}/100</td>
                                <td class="py-3 px-3 font-mono text-xs sm:text-sm text-espresso dark:text-stone-200">${alt.ratio}</td>
                                <td class="py-3 px-3 text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-[220px]">${alt.tasteDesc}</td>
                                <td class="py-3 px-3">
                                  <div class="flex flex-wrap gap-1">
                                    ${(alt.dietary || []).map(d => `<span class="px-2 py-0.5 rounded text-[11px] font-bold bg-sage-100 dark:bg-stone-800 text-forest dark:text-sage-300">${d}</span>`).join('')}
                                  </div>
                                </td>
                                <td class="py-3 px-3 text-right">
                                  <button type="button" data-select-alt="${alt.name}" class="px-3 py-1.5 rounded-lg bg-terracotta text-white font-bold text-xs cursor-pointer">Select</button>
                                </td>
                              </tr>
                            `).join('')}
                          </tbody>
                        </table>
                      </div>
                    ` : ''}

                    <!-- Top 3 Alternatives Header (Matching Image 2) -->
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                      <h4 class="text-xs sm:text-sm font-bold uppercase tracking-wider text-stone-500 font-mono">
                        TOP 3 ALTERNATIVE INGREDIENTS (CLICK TO APPLY TO COMPLETE RECIPE)
                      </h4>
                      <span class="text-xs text-stone-500 dark:text-stone-400 font-accent italic">
                        Select any alternative below to view updated complete recipe
                      </span>
                    </div>

                    <!-- Exactly 3 Alternative Cards (Matching Image 2) -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
                      ${alts.map((alt, idx) => {
                        const isSelected = state.selectedSubstitutedAlt === alt.name;
                        const optionHeader = alt.type 
                          ? `OPTION ${idx + 1}: ${alt.type.toUpperCase()}`
                          : idx === 0 
                            ? 'OPTION 1: BUDGET & HOUSEHOLD ESSENTIAL' 
                            : idx === 1 
                              ? 'OPTION 2: BEST PLANT-BASED / VEGAN CREAM' 
                              : 'OPTION 3: BEST TASTE & TEXTURE MATCH';

                        return `
                          <div
                            data-select-alt="${alt.name}"
                            class="editorial-card p-5 sm:p-6 rounded-3xl flex flex-col justify-between transition-all duration-300 cursor-pointer ${
                              isSelected
                                ? 'bg-white dark:bg-[#1c1713] border-2 border-terracotta shadow-xl ring-2 ring-terracotta/20'
                                : 'bg-ivory/70 dark:bg-[#181410] border border-beige-200 dark:border-stone-800 hover:border-terracotta/60 hover:shadow-md'
                            }"
                          >
                            <div class="space-y-3.5">
                              <!-- Option Badge + Status -->
                              <div class="flex items-center justify-between gap-2">
                                <span class="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider font-mono ${
                                  idx === 0 
                                    ? 'bg-forest text-ivory' 
                                    : idx === 1 
                                      ? 'bg-sage-600 text-white' 
                                      : 'bg-terracotta text-white'
                                }">
                                  ${optionHeader}
                                </span>
                                ${isSelected ? `
                                  <span class="text-xs font-bold text-terracotta flex items-center gap-1 font-mono">
                                    <i class="fa-solid fa-circle-dot"></i> Selected
                                  </span>
                                ` : ''}
                              </div>

                              <!-- Flavor Identity Engine Score Badge [SAMPLE] -->
                              <div class="flex items-center justify-between text-xs font-mono font-bold text-forest dark:text-ivory pt-1 border-t border-beige-200/50 dark:border-stone-800/50">
                                <span class="flex items-center gap-1.5">
                                  <i class="fa-solid fa-chart-simple text-terracotta text-xs"></i>
                                  <span>Score: <strong class="text-terracotta text-sm">${alt.score != null ? alt.score : 85}/100</strong></span>
                                  <span class="text-[9px] px-1.5 py-0.5 rounded bg-beige-200/60 dark:bg-stone-800 text-stone-500 font-semibold">[SAMPLE]</span>
                                </span>
                                <span class="text-[11px] text-stone-500 font-mono font-medium">
                                  F:${Math.round((alt.flavorSimilarity != null ? alt.flavorSimilarity : 0.88) * 100)}% · R:${Math.round((alt.recipeCompatibility != null ? alt.recipeCompatibility : 0.85) * 100)}% · C:${Math.round((alt.costEfficiency != null ? alt.costEfficiency : 0.80) * 100)}%
                                </span>
                              </div>

                              <!-- Alternative Title -->
                              <h4 class="text-xl font-bold font-heading text-forest dark:text-ivory leading-snug">
                                ${alt.name}
                              </h4>

                              <!-- Conversion Ratio Box (Matching Image 2) -->
                              <div class="p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-beige-200 dark:border-stone-800">
                                <span class="block text-[10px] font-bold uppercase tracking-wider text-terracotta font-mono">
                                  CONVERSION RATIO
                                </span>
                                <span class="block text-sm font-bold font-mono text-forest dark:text-ivory mt-1 leading-snug">
                                  ${alt.ratio}
                                </span>
                                ${alt.calcMethod ? `
                                  <span class="block text-xs text-stone-500 mt-1 leading-normal">
                                    ${alt.calcMethod}
                                  </span>
                                ` : ''}
                              </div>

                              <!-- Flavor Note -->
                              <p class="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                                <strong>Flavor:</strong> ${alt.tasteDesc}
                                ${alt.contributions ? `
                                  <span class="block text-[11px] text-stone-500 dark:text-stone-400 mt-1 font-mono">
                                    Contributions: Flavor ${alt.contributions.flavor}pts + Recipe ${alt.contributions.recipe}pts + Cost ${alt.contributions.cost}pts = ${alt.score}pts.
                                  </span>
                                ` : ''}
                              </p>

                              <!-- Texture & Handling -->
                              ${alt.textureDesc ? `
                                <p class="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                                  <strong>Texture & Handling:</strong> ${alt.textureDesc}
                                </p>
                              ` : ''}

                              <!-- Dietary Badges (Matching Image 2) -->
                              <div class="flex flex-wrap gap-1.5 pt-1">
                                ${(alt.dietary || []).map(tag => `
                                  <span class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-sage-100/80 dark:bg-stone-800 text-forest dark:text-sage-300">
                                    ${tag}
                                  </span>
                                `).join('')}
                                ${(alt.allergens && alt.allergens.length && alt.allergens[0] !== 'None')
                                  ? alt.allergens.map(a => `<span class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-peach/50 text-terracotta">${a}</span>`).join('')
                                  : `<span class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-beige-100 dark:bg-stone-800 text-stone-500">No Major Allergens</span>`
                                }
                              </div>
                            </div>

                            <!-- Button at Bottom (Matching Image 2) -->
                            <div class="pt-5 mt-auto">
                              <button
                                type="button"
                                data-select-alt="${alt.name}"
                                class="w-full py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                                  isSelected
                                    ? 'bg-terracotta text-white shadow-md'
                                    : 'bg-forest hover:bg-forest/90 text-white shadow-xs'
                                }"
                              >
                                <i class="fa-solid ${isSelected ? 'fa-check' : 'fa-hand-pointer'}"></i>
                                <span>${isSelected ? 'Selected Substitute' : 'Select Substitute'}</span>
                              </button>
                            </div>
                          </div>
                        `;
                      }).join('')}
                    </div>

                    ${(uResult.excludedAlternatives && uResult.excludedAlternatives.length > 0) ? `
                      <div class="p-4 rounded-2xl bg-ivory/80 dark:bg-stone-900 border border-beige-200 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-300 space-y-2">
                        <span class="font-bold text-forest dark:text-ivory flex items-center gap-1.5 font-mono uppercase tracking-wider text-[11px]">
                          <i class="fa-solid fa-shield-halved text-terracotta"></i>
                          <span>Safety Gate: Excluded Candidates (${uResult.excludedAlternatives.length})</span>
                        </span>
                        <div class="flex flex-wrap gap-2 pt-1">
                          ${uResult.excludedAlternatives.map(ex => `
                            <span class="px-2.5 py-1 rounded-xl bg-peach/30 text-terracotta border border-terracotta/20 text-xs font-mono">
                              <strong>${ex.name}:</strong> ${ex.rejectionReason}
                            </span>
                          `).join('')}
                        </div>
                      </div>
                    ` : ''}

                    <!-- Foodoscope Live RecipeDB & Molecular Intelligence Context -->
                    <div id="swaplab-foodoscope-context" class="p-4 sm:p-5 rounded-2xl bg-forest/5 dark:bg-[#181410] border border-beige-200 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div class="flex items-center gap-3">
                        <div class="w-9 h-9 rounded-xl bg-forest/10 dark:bg-stone-800 text-forest dark:text-sage-300 flex items-center justify-center text-sm shrink-0">
                          <i class="fa-solid fa-cloud text-terracotta"></i>
                        </div>
                        <div>
                          <div class="flex items-center gap-2">
                            <span class="text-xs font-mono font-bold text-forest dark:text-ivory">
                              Foodoscope RecipeDB Context
                            </span>
                            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-sage-100 dark:bg-emerald-950/40 text-forest dark:text-sage-300 border border-sage-300/40 font-mono">
                              Live API Connected
                            </span>
                          </div>
                          <p id="swaplab-foodoscope-context-text" class="text-xs text-stone-500 font-mono mt-0.5">
                            Cross-referencing 118,000+ RecipeDB records for "${uResult.ingredientName}" in ${currentDish || matchedRecipe.title}...
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        id="swaplab-explore-recipedb-btn"
                        class="px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-stone-900 border border-beige-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-terracotta flex items-center gap-1.5 cursor-pointer whitespace-nowrap self-start sm:self-center transition-all shadow-xs"
                      >
                        <i class="fa-solid fa-arrow-up-right-from-square text-[10px] text-terracotta"></i>
                        <span>Explore RecipeDB Matches</span>
                      </button>
                    </div>

                    <!-- Complete Recipe with the Selected Substitute Replacing Original Missing Ingredient -->
                    <div id="substituted-recipe-card" class="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1c1713] border-2 border-terracotta/40 dark:border-stone-800 shadow-xl space-y-6">
                      
                      <!-- Header & Banner -->
                      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-beige-200 dark:border-stone-800 pb-5">
                        <div class="space-y-1.5">
                          <div class="flex flex-wrap items-center gap-2">
                            <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-terracotta text-white font-mono flex items-center gap-1.5 shadow-xs">
                              <i class="fa-solid fa-utensils"></i> Complete Adapted Recipe
                            </span>
                            <span class="px-3 py-1 rounded-full text-xs font-bold bg-sage-100 dark:bg-stone-800 text-forest dark:text-sage-300">
                              ${subRecipe.category}
                            </span>
                            <span class="text-xs text-stone-500 font-medium">
                              Prep: ${subRecipe.prepTime} • Cook: ${subRecipe.cookTime} • ${subRecipe.difficulty}
                            </span>
                          </div>
                          <h3 class="text-2xl sm:text-3xl font-black font-heading text-forest dark:text-ivory">
                            ${subRecipe.title}
                          </h3>
                          <p class="text-xs sm:text-sm text-stone-600 dark:text-stone-300">
                            Complete recipe updated with <strong class="text-terracotta">${activeAlt.name}</strong> replacing <strong class="line-through text-stone-400">${uResult.ingredientName}</strong>.
                          </p>
                        </div>

                        <!-- Portions Scaler Controls -->
                        <div class="flex items-center gap-2 shrink-0 bg-ivory dark:bg-stone-900 border border-beige-200 dark:border-stone-800 rounded-2xl p-2 shadow-xs">
                          <span class="text-xs font-bold uppercase tracking-wider text-stone-500 ml-2">Portions:</span>
                          <button
                            type="button"
                            data-sub-portion="-1"
                            class="w-8 h-8 rounded-xl bg-white dark:bg-stone-800 border border-beige-200 dark:border-stone-700 text-forest dark:text-ivory hover:bg-terracotta hover:text-white flex items-center justify-center font-bold text-sm cursor-pointer transition-all"
                            title="Decrease portions"
                          >
                            <i class="fa-solid fa-minus text-xs"></i>
                          </button>
                          <span id="sub-recipe-portion-count" class="font-mono font-bold text-sm sm:text-base text-forest dark:text-ivory px-2 min-w-[5.5rem] text-center">
                            ${subRecipe.portions} ${subRecipe.portions === 1 ? 'Cover' : 'Covers'}
                          </span>
                          <button
                            type="button"
                            data-sub-portion="1"
                            class="w-8 h-8 rounded-xl bg-white dark:bg-stone-800 border border-beige-200 dark:border-stone-700 text-forest dark:text-ivory hover:bg-terracotta hover:text-white flex items-center justify-center font-bold text-sm cursor-pointer transition-all"
                            title="Increase portions"
                          >
                            <i class="fa-solid fa-plus text-xs"></i>
                          </button>
                        </div>
                      </div>

                      <!-- Visual Substitution Summary Strip -->
                      <div class="p-4 sm:p-5 rounded-2xl bg-peach/25 dark:bg-[#251e18] border border-terracotta/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div class="flex items-center gap-3">
                          <div class="w-10 h-10 rounded-xl bg-terracotta text-white flex items-center justify-center text-sm shrink-0 shadow-xs">
                            <i class="fa-solid fa-arrows-rotate"></i>
                          </div>
                          <div>
                            <span class="block text-[10px] font-bold uppercase text-stone-500 font-mono tracking-wider">Active Substitution</span>
                            <div class="flex items-center gap-2 mt-0.5">
                              <span class="text-xs line-through text-stone-400">${uResult.ingredientName}</span>
                              <i class="fa-solid fa-arrow-right text-[10px] text-terracotta"></i>
                              <span class="text-sm font-bold text-forest dark:text-ivory">${activeAlt.name}</span>
                            </div>
                          </div>
                        </div>
                        <div class="sm:text-right">
                          <span class="block text-[10px] font-bold uppercase text-terracotta font-mono">Calibrated Conversion Ratio</span>
                          <span class="text-xs sm:text-sm font-mono font-bold text-forest dark:text-ivory block mt-0.5">${activeAlt.ratio}</span>
                        </div>
                      </div>

                      <!-- Two-Column Layout: Bill of Ingredients (Left) + Adapted Method (Right) -->
                      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        
                        <!-- Left: Complete Bill of Ingredients -->
                        <div class="lg:col-span-5 space-y-3">
                          <div class="flex items-center justify-between pb-1 border-b border-beige-200 dark:border-stone-800">
                            <h4 class="font-heading font-bold text-base sm:text-lg text-forest dark:text-ivory flex items-center gap-2">
                              <i class="fa-solid fa-clipboard-list text-terracotta"></i>
                              <span>Bill of Ingredients (${subRecipe.portions} ${subRecipe.portions === 1 ? 'Portion' : 'Portions'})</span>
                            </h4>
                            <span class="text-[11px] font-mono text-terracotta font-bold">1 Swapped</span>
                          </div>

                          <div class="space-y-2">
                            ${subRecipe.ingredients.map(ing => `
                              <div class="p-3 rounded-2xl flex items-center justify-between gap-3 transition-all ${
                                ing.isSubstituted
                                  ? 'bg-peach/30 dark:bg-stone-900 border-2 border-terracotta shadow-sm'
                                  : 'bg-ivory/60 dark:bg-[#181410] border border-beige-200 dark:border-stone-800'
                              }">
                                <div class="min-w-0">
                                  <div class="flex items-center gap-2">
                                    <span class="text-sm font-bold truncate text-forest dark:text-ivory ${ing.isSubstituted ? 'text-terracotta dark:text-peach' : ''}">
                                      ${ing.name}
                                    </span>
                                    ${ing.isSubstituted ? `
                                      <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-terracotta text-white uppercase font-mono shrink-0">
                                        <i class="fa-solid fa-arrows-rotate"></i> Swap
                                      </span>
                                    ` : ''}
                                  </div>
                                  ${ing.isSubstituted ? `
                                    <span class="block text-[11px] text-stone-500 mt-0.5">
                                      Replaced: <span class="line-through">${ing.originalName}</span> • <span class="font-mono text-terracotta font-bold">${ing.swapRatio}</span>
                                    </span>
                                  ` : ''}
                                </div>
                                <span class="font-mono text-xs sm:text-sm font-bold text-forest dark:text-ivory shrink-0 bg-white dark:bg-stone-800 px-2.5 py-1 rounded-xl border border-beige-200 dark:border-stone-700">
                                  ${ing.scaledQty} ${ing.displayUnit}
                                </span>
                              </div>
                            `).join('')}
                          </div>
                        </div>

                        <!-- Right: Adapted Cooking Instructions -->
                        <div class="lg:col-span-7 space-y-3">
                          <div class="flex items-center justify-between pb-1 border-b border-beige-200 dark:border-stone-800">
                            <h4 class="font-heading font-bold text-base sm:text-lg text-forest dark:text-ivory flex items-center gap-2">
                              <i class="fa-solid fa-fire-burner text-terracotta"></i>
                              <span>Cooking Instructions (Adapted for ${activeAlt.name})</span>
                            </h4>
                            <span class="text-[11px] text-stone-500 font-accent italic">Step-by-step culinary method</span>
                          </div>

                          <div class="space-y-3">
                            ${subRecipe.steps.map((st, sIdx) => `
                              <div class="p-4 rounded-2xl transition-all ${
                                st.isSubstitutedStep
                                  ? 'bg-peach/25 dark:bg-stone-900 border-2 border-terracotta/70 shadow-sm'
                                  : 'bg-ivory/60 dark:bg-[#181410] border border-beige-200 dark:border-stone-800'
                              }">
                                <div class="flex items-center justify-between gap-2 mb-1.5">
                                  <span class="text-xs font-bold uppercase tracking-wider font-mono ${
                                    st.isSubstitutedStep ? 'text-terracotta font-black flex items-center gap-1.5' : 'text-stone-500'
                                  }">
                                    ${st.isSubstitutedStep ? `<i class="fa-solid fa-fire text-terracotta"></i> Step ${sIdx + 1}: Adapted Substitute Handling` : `Step ${sIdx + 1}`}
                                  </span>
                                  ${st.isSubstitutedStep ? `
                                    <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-terracotta text-white uppercase font-mono">
                                      Active Modification
                                    </span>
                                  ` : ''}
                                </div>
                                <p class="text-xs sm:text-sm text-espresso dark:text-stone-200 leading-relaxed font-sans">
                                  ${st.text}
                                </p>
                              </div>
                            `).join('')}
                          </div>
                        </div>

                      </div>

                      <!-- Substituted Recipe Action Bar -->
                      <div class="pt-4 border-t border-beige-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3">
                        <div class="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            data-open-sub-modal="${subRecipe.id}"
                            class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold terracotta-btn text-white transition-all cursor-pointer shadow-md flex items-center gap-2"
                          >
                            <i class="fa-solid fa-expand"></i>
                            <span>Open in Full Recipe Studio</span>
                          </button>
                          <button
                            type="button"
                            data-print-sub-ticket="${subRecipe.id}"
                            class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-ivory dark:bg-stone-900 border border-beige-200 dark:border-stone-800 text-espresso dark:text-ivory hover:border-terracotta transition-all cursor-pointer flex items-center gap-2"
                          >
                            <i class="fa-solid fa-print text-terracotta"></i>
                            <span>Print Prep Ticket</span>
                          </button>
                        </div>
                        <button
                          type="button"
                          data-log-sub-test="${subRecipe.id}"
                          class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold sage-btn transition-all cursor-pointer flex items-center gap-2"
                        >
                          <i class="fa-solid fa-star text-white"></i>
                          <span>Log Kitchen Test & Rating</span>
                        </button>
                      </div>

                    </div>
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
      ApiService.searchByIngredient(uResult.ingredientName, currentDish, 3).then(matches => {
        const contextEl = document.getElementById('swaplab-foodoscope-context-text');
        if (contextEl) {
          if (matches && matches.length) {
            const titles = matches.map(m => m.Recipe_title || m.title).slice(0, 2).join(', ');
            contextEl.innerHTML = `Identified <strong>${matches.length}+ verified RecipeDB dishes</strong> using <em>${uResult.ingredientName}</em> (e.g. "${titles}").`;
          } else {
            contextEl.textContent = `Calibrated for "${uResult.ingredientName}" via Foodoscope flavor chemistry & 40-recipe kitchen catalog.`;
          }
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

  // ========================================================
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
              Culinary Recipe Library.<br>
              <span class="text-terracotta font-serif italic">Scale Portions & Explore</span> Live Databases.
            </h1>

            <p class="text-ivory/90 text-base md:text-lg leading-relaxed font-normal">
              Switch between our 40 chef-crafted kitchen recipes with dynamic portion scaling, or search across 118,000+ global computational recipes directly from the live Foodoscope RecipeDB API.
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
        if (q) renderFoodoscopeGrid(q);
      });

      fSearchInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const q = fSearchInput.value.trim();
          if (q) renderFoodoscopeGrid(q);
        }
      });

      container.querySelectorAll('[data-foodoscope-quick]').forEach(btn => {
        btn.addEventListener('click', () => {
          const chip = btn.getAttribute('data-foodoscope-quick');
          if (fSearchInput) fSearchInput.value = chip;
          renderFoodoscopeGrid(chip);
        });
      });

      // Initial render for foodoscope grid
      renderFoodoscopeGrid(state.foodoscopeQuery || 'Biryani');
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
  async function renderFoodoscopeGrid(queryToSearch) {
    const grid = document.getElementById('foodoscope-recipes-grid');
    const countDisplay = document.getElementById('foodoscope-count-display');
    if (!grid) return;

    const query = queryToSearch !== undefined ? queryToSearch : (state.foodoscopeQuery || 'Biryani');
    state.foodoscopeQuery = query;

    grid.innerHTML = `
      <div class="col-span-full py-12 text-center space-y-3">
        <div class="w-10 h-10 border-4 border-terracotta border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p class="text-sm font-bold text-forest dark:text-ivory">Querying Foodoscope RecipeDB for "${query}"...</p>
        <p class="text-xs text-stone-500 font-mono">Token: voGqE62...Yts · API: api.foodoscope.com</p>
      </div>
    `;

    try {
      const results = await ApiService.searchRecipes(query, 12);
      state.foodoscopeResults = results || [];

      if (countDisplay) {
        countDisplay.textContent = `Found ${state.foodoscopeResults.length} Foodoscope Recipes`;
      }

      if (!state.foodoscopeResults.length) {
        grid.innerHTML = `
          <div class="col-span-full p-8 rounded-3xl bg-white dark:bg-[#1f1a16] border border-beige-200 dark:border-stone-800 text-center space-y-3">
            <i class="fa-solid fa-magnifying-glass text-3xl text-terracotta"></i>
            <h4 class="font-heading font-bold text-xl text-forest dark:text-ivory">No Recipes Found for "${query}"</h4>
            <p class="text-xs text-stone-500 max-w-md mx-auto">Try common dish keywords like "Paneer", "Curry", "Pasta", "Cake", "Biryani", "Soup", or "Salmon".</p>
          </div>
        `;
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
        const imgUrl = r.img_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80';

        cardsHtml += `
          <div class="recipe-card group rounded-3xl overflow-hidden bg-white dark:bg-[#1f1a16] border border-beige-200 dark:border-stone-800 hover:border-terracotta shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div>
              <div class="relative h-48 w-full overflow-hidden bg-beige-100 dark:bg-stone-900">
                <img
                  src="${imgUrl}"
                  alt="${title}"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80'"
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
              </div>
            </div>

            <div class="p-5 pt-0 space-y-2">
              <button
                type="button"
                data-foodoscope-inspect="${recipeId}"
                class="w-full py-2.5 px-3 rounded-xl text-xs font-bold terracotta-btn text-white transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
              >
                <i class="fa-solid fa-chart-pie"></i>
                <span>Inspect RecipeDB Nutrition & Utensils</span>
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
    } catch (err) {
      grid.innerHTML = `
        <div class="col-span-full p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 text-center space-y-2">
          <p class="text-sm font-bold text-rose-700 dark:text-rose-300">Foodoscope API query encountered an error.</p>
          <p class="text-xs text-stone-500">${err?.message || 'Check network connection or try again.'}</p>
        </div>
      `;
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

    const info = await ApiService.getRecipeInfo(recipeId);
    if (!info) {
      container.innerHTML = `
        <div class="relative bg-white dark:bg-[#181410] rounded-3xl overflow-hidden shadow-2xl max-w-3xl w-full mx-auto my-6 border border-beige-200 dark:border-stone-800 p-8 space-y-4 text-center">
          <div class="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-600 flex items-center justify-center mx-auto text-xl">
            <i class="fa-solid fa-triangle-exclamation"></i>
          </div>
          <h3 class="font-heading font-bold text-xl text-forest dark:text-ivory">Recipe #${recipeId} Details Not Available</h3>
          <p class="text-xs text-stone-500">The specific record could not be fetched from Foodoscope RecipeDB. Try another recipe.</p>
          <button type="button" onclick="document.getElementById('recipe-webx-modal').classList.add('hidden'); document.body.classList.remove('overflow-hidden');" class="px-5 py-2.5 rounded-xl terracotta-btn text-white text-xs font-bold cursor-pointer">
            Close
          </button>
        </div>
      `;
      return;
    }

    const title = info.Recipe_title || info.title || `Recipe #${recipeId}`;
    const calories = info.Calories || info.CaloriesNum || '—';
    const carbs = info['Carbohydrate, by difference (g)'] || '—';
    const protein = info['Protein (g)'] || '—';
    const fat = info['Total lipid (fat) (g)'] || '—';
    const energyKcal = info['Energy (kcal)'] || '—';
    const region = info.Region || 'Global';
    const subRegion = info.Sub_region || '';
    const continent = info.Continent || '';
    const servings = info.servings || '2';
    const totalTime = info.total_time || '—';
    const utensils = info.UtensilsList || (info.Utensils ? info.Utensils.split('||') : []);
    const processes = info.Processes ? info.Processes.split('||') : [];
    const ingredients = info.ingredients || [];

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
          <div>
            <h2 class="font-heading font-black text-2xl sm:text-3xl text-forest dark:text-ivory">
              ${title}
            </h2>
            <p class="text-xs text-stone-500 mt-1 font-mono">
              Source: ${info.Source || 'Foodoscope Computational Gastronomy RecipeDB'}
            </p>
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
                ${processes.length ? processes.map(p => `<span class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-peach/40 dark:bg-stone-800 text-espresso dark:text-beige border border-terracotta/30 capitalize">${p}</span>`).join('') : '<span class="text-xs text-stone-400">Simmer / saute</span>'}
              </div>
            </div>
          </div>

          ${ingredients.length ? `
            <div class="p-5 rounded-2xl bg-white dark:bg-[#1f1a16] border border-beige-200 dark:border-stone-800 space-y-2.5">
              <h4 class="text-xs font-bold uppercase tracking-wider text-forest dark:text-ivory font-mono flex items-center gap-1.5">
                <i class="fa-solid fa-basket-shopping text-terracotta"></i>
                <span>Recorded Ingredients (${ingredients.length})</span>
              </h4>
              <div class="flex flex-wrap gap-2">
                ${ingredients.map(ing => `<span class="px-3 py-1.5 rounded-xl text-xs font-medium bg-ivory dark:bg-stone-900 text-forest dark:text-ivory border border-beige-200 dark:border-stone-800">${ing}</span>`).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Modal Action CTA -->
          <div class="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-beige-200 dark:border-stone-800">
            <span class="text-xs text-stone-500">Total Cooking Time: <strong>${totalTime} mins</strong> · Servings: <strong>${servings}</strong></span>
            <button
              type="button"
              onclick="document.getElementById('recipe-webx-modal').classList.add('hidden'); document.body.classList.remove('overflow-hidden');"
              class="px-6 py-3 rounded-2xl terracotta-btn text-white text-xs font-bold cursor-pointer"
            >
              Done Reading
            </button>
          </div>
        </div>
      </div>
    `;
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
    setTimeout(initScrollAnimations, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
