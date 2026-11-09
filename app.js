// FlavorCraft Cafe OS - Interactive Application Logic
// Specifically Engineered for Small Independent Cafes, Bistros & Commercial Kitchens

(function () {
  'use strict';

  // Application State
  const state = {
    activeTab: 'explore', // 'explore', 'dashboard', 'slides', 'favorites', 'pantry'
    selectedCategory: 'all',
    selectedDiet: 'all',
    searchQuery: '',
    sortOption: 'popular', // 'popular', 'cost-asc', 'calories-asc', 'margin-desc', 'prep-asc'
    activePantryIngredients: new Set(JSON.parse(localStorage.getItem('flavorcraft_pantry') || '[]')),
    favorites: new Set(JSON.parse(localStorage.getItem('flavorcraft_favs') || '["smashed-avocado-toast", "wild-mushroom-truffle-pasta"]')),
    theme: localStorage.getItem('flavorcraft_theme') || 'light',
    
    // Per-recipe dynamic toggles and person counts
    recipeStates: {},
    
    // Design Thinking Slide State
    currentSlideIndex: 0,
    slideAutoplay: false,
    autoplayTimer: null,
    
    // Currently open recipe in modal
    activeRecipeId: null,
    
    // Dashboard Covers Calculator
    dashboardCovers: 50,
    dashboardSelectedRecipeId: 'smashed-avocado-toast',
    
    // Custom user-submitted reviews
    customReviews: JSON.parse(localStorage.getItem('flavorcraft_reviews') || '{}')
  };

  // Preset Pantry Bundles for 1-click selection
  const PANTRY_PRESETS = {
    breakfast: {
      name: "🥐 Standard Breakfast Cafe",
      items: ["Avocados", "Sourdough Bread", "Eggs", "Oat Milk", "Greek Yogurt / Curd", "Olive Oil / Garlic"]
    },
    coffee: {
      name: "☕ Specialty Coffee & Bakery",
      items: ["Espresso Beans", "Oat Milk", "Turmeric & Spices", "Cream Cheese", "Greek Yogurt / Curd"]
    },
    vegan: {
      name: "🌿 Green Vegan Bistro",
      items: ["Avocados", "Oat Milk", "Fresh Basil & Pesto", "Wild Berries / Acai", "Olive Oil / Garlic", "Cremini Mushrooms"]
    },
    italian: {
      name: "🍝 Italian Panini & Pasta Bar",
      items: ["Fettuccine / Pasta", "Cremini Mushrooms", "Feta / Ricotta", "Chicken Breast", "Ciabatta / Panini", "Fresh Basil & Pesto", "Olive Oil / Garlic"]
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
    localStorage.setItem('flavorcraft_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      if (theme === 'dark') {
        themeBtn.innerHTML = `<i class="fa-solid fa-sun text-amber-400"></i><span class="hidden sm:inline font-medium text-xs">Light Mode</span>`;
      } else {
        themeBtn.innerHTML = `<i class="fa-solid fa-moon text-indigo-500"></i><span class="hidden sm:inline font-medium text-xs">Dark Mode</span>`;
      }
    }
  }

  // Helper: Format Currency
  function formatMoney(amount) {
    return '$' + Number(amount).toFixed(2);
  }

  // Helper: Calculate Gross Profit Margin %
  function calcMargin(cost, price) {
    if (!price || price <= 0) return 0;
    return Math.round(((price - cost) / price) * 100);
  }

  // Helper: Get Active Recipe Data with Swaps Computed
  function getComputedRecipe(recipeId) {
    const raw = RECIPES_DATA.find(r => r.id === recipeId);
    if (!raw) return null;

    const rState = state.recipeStates[recipeId] || { persons: 1, budgetMode: false, calorieMode: false, veganMode: false };
    const persons = rState.persons || 1;

    // Start with base economics
    let costPerPerson = raw.baseCostPerPerson;
    let caloriesPerPerson = raw.baseCalories;
    let macros = { ...raw.baseMacros };
    let ingredients = raw.ingredients.map(ing => ({ ...ing }));
    let steps = [...raw.steps];
    let appliedSwaps = [];

    // Apply Budget Saver Swap
    if (rState.budgetMode && raw.budgetAlternative) {
      costPerPerson = raw.budgetAlternative.newCostPerPerson;
      appliedSwaps.push({
        type: 'budget',
        badge: '💡 Budget Saver Active',
        title: raw.budgetAlternative.title,
        savings: raw.budgetAlternative.savingsPerPerson,
        percent: raw.budgetAlternative.savingsPercent,
        description: raw.budgetAlternative.description,
        items: raw.budgetAlternative.replacedItems
      });

      // Update ingredients list
      ingredients = ingredients.map(ing => {
        if (raw.id === 'smashed-avocado-toast' && ing.name.includes('Avocado')) {
          return { ...ing, name: '50/50 Hass Avocado & Sweet Green Pea Mash', cost: 0.90, isSwapped: true, swapReason: 'Cuts avocado cost by 50%, keeps vivid emerald color' };
        }
        if (raw.id === 'smashed-avocado-toast' && ing.name.includes('Feta')) {
          return { ...ing, name: 'Domestic Whipped Ricotta & Lemon Zest', cost: 0.35, isSwapped: true, swapReason: 'Fresh domestic cheese saving $0.50/portion' };
        }
        if (raw.id === 'golden-turmeric-oat-latte' && ing.name.includes('Turmeric')) {
          return { ...ing, name: 'Cold-Ground Organic Turmeric Root Powder', cost: 0.10, isSwapped: true, swapReason: 'Zero spoilage shelf-stable powder' };
        }
        if (raw.id === 'wild-mushroom-truffle-pasta' && (ing.name.includes('Truffle') || ing.name.includes('Chanterelle'))) {
          return { ...ing, name: 'Steeped Porcini Mushroom Reduction + Brown Cremini', cost: 0.65, isSwapped: true, swapReason: 'Deep earth umami, saves $1.85/person over synthetic oil' };
        }
        if (raw.id === 'wild-mushroom-truffle-pasta' && ing.name.includes('Parmigiano')) {
          return { ...ing, name: 'Aged Domestic Grana Padano', cost: 0.25, isSwapped: true, swapReason: 'Identical sharp salty profile, saves 50%' };
        }
        if (raw.id === 'superfood-acai-dragonfruit-bowl' && ing.name.includes('Acai')) {
          return { ...ing, name: 'Wild Mountain Blueberry & Beet Velvet Base', cost: 0.85, isSwapped: true, swapReason: 'Vivid magenta color, saves $1.40/portion' };
        }
        if (raw.id === 'tuscan-pesto-chicken-panini' && ing.name.includes('Pesto')) {
          return { ...ing, name: 'Toasted Sunflower Seed & Baby Spinach Pesto', cost: 0.40, isSwapped: true, swapReason: 'Nut-free, vibrant emerald, saves $0.95/panini' };
        }
        if (raw.id === 'basque-burnt-cheesecake' && ing.name.includes('Cream Cheese')) {
          return { ...ing, name: 'Hung Curd & Farmhouse Cream Cheese (50/50)', cost: 0.85, isSwapped: true, swapReason: 'Saves 48% on dairy block with ultra-velvety tang' };
        }
        if (raw.id === 'falafel-hummus-mezze' && ing.name.includes('Tahini')) {
          return { ...ing, name: 'Golden Roasted Carrot & Sesame Hummus', cost: 0.45, isSwapped: true, swapReason: 'Expands batch volume by 40% with sweet velvety lift' };
        }
        return ing;
      });

      // Update recipe cooking steps with budget technique
      if (raw.id === 'smashed-avocado-toast') {
        steps[1] = "In a cafe prep bowl, blend steamed sweet green peas (50%) with ripe avocado (50%), lemon juice, and flaky sea salt until vibrant green and velvety.";
        steps[5] = "Scatter whipped domestic ricotta crumbles, sliced radishes, and crushed red pepper flakes over the top.";
      } else if (raw.id === 'wild-mushroom-truffle-pasta') {
        steps[2] = "Sear brown cremini mushrooms in butter until deeply browned, deglazing with concentrated steeped porcini mushroom broth.";
        steps[8] = "Twirl onto plate, spooning the porcini mushroom brown butter sauce over pasta and dusting with aged Grana Padano.";
      }
    }

    // Apply Calorie Cutter Alternative ("ek same recipe ko less calories ka kese bna skte h uske alternative")
    if (rState.calorieMode && raw.calorieAlternative) {
      caloriesPerPerson = raw.calorieAlternative.newCalories;
      macros = { ...raw.calorieAlternative.newMacros };
      appliedSwaps.push({
        type: 'calorie',
        badge: '🥗 Calorie Cutter Active',
        title: raw.calorieAlternative.title,
        savings: raw.calorieAlternative.calorieDrop + ' kcal drop',
        percent: raw.calorieAlternative.caloriePercent,
        description: raw.calorieAlternative.description,
        items: raw.calorieAlternative.replacedItems
      });

      // Update ingredients list for low-calorie version
      ingredients = ingredients.map(ing => {
        if (raw.id === 'smashed-avocado-toast' && ing.name.includes('Sourdough')) {
          return { ...ing, name: 'Thin Seeded Sourdough Crispbread', cost: 0.55, isLowCalorie: true, calSaved: '-85 kcal' };
        }
        if (raw.id === 'smashed-avocado-toast' && ing.name.includes('Egg')) {
          return { ...ing, name: 'Poached Egg White Cloud (Double)', cost: 0.35, isLowCalorie: true, calSaved: '-35 kcal' };
        }
        if (raw.id === 'smashed-avocado-toast' && ing.name.includes('Olive Oil')) {
          return { ...ing, name: 'Citrus-Herb Fresh Mist (0 cal)', cost: 0.05, isLowCalorie: true, calSaved: '-75 kcal' };
        }
        if (raw.id === 'golden-turmeric-oat-latte' && ing.name.includes('Oat Milk')) {
          return { ...ing, name: 'Unsweetened Creamy Almond Milk', cost: 0.70, isLowCalorie: true, calSaved: '-80 kcal' };
        }
        if (raw.id === 'golden-turmeric-oat-latte' && ing.name.includes('Maple')) {
          return { ...ing, name: 'Organic Monk Fruit / Stevia Drops', cost: 0.10, isLowCalorie: true, calSaved: '-30 kcal' };
        }
        if (raw.id === 'wild-mushroom-truffle-pasta' && ing.name.includes('Heavy Whipping Cream')) {
          return { ...ing, name: 'Steamed Cauliflower & Light Cashew Cream', cost: 0.60, isLowCalorie: true, calSaved: '-190 kcal' };
        }
        if (raw.id === 'superfood-acai-dragonfruit-bowl' && ing.name.includes('Granola')) {
          return { ...ing, name: 'Cinnamon Spiced Puffed Quinoa & Chia Crunch', cost: 0.40, isLowCalorie: true, calSaved: '-110 kcal' };
        }
        if (raw.id === 'tuscan-pesto-chicken-panini' && ing.name.includes('Ciabatta')) {
          return { ...ing, name: 'High-Fiber Sprouted Wheat Wrap / Open-Face', cost: 0.75, isLowCalorie: true, calSaved: '-140 kcal' };
        }
        if (raw.id === 'basque-burnt-cheesecake' && ing.name.includes('Sugar')) {
          return { ...ing, name: 'Monkfruit Allulose Baker Blend (0 Sugar)', cost: 0.50, isLowCalorie: true, calSaved: '-120 kcal' };
        }
        if (raw.id === 'falafel-hummus-mezze' && ing.name.includes('Falafel')) {
          return { ...ing, name: 'Golden Air-Crisped Herb Falafel (No deep fry)', cost: 0.65, isLowCalorie: true, calSaved: '-120 kcal' };
        }
        return ing;
      });

      // Update instructions with low-calorie culinary technique
      if (raw.id === 'smashed-avocado-toast') {
        steps[0] = "Toast the thin seeded sourdough crispbread dry until ultra-crisp without butter.";
        steps[2] = "Poach egg whites gently for 2 minutes to create a light protein cloud.";
        steps[6] = "Spritz with fresh Meyer lemon herb mist instead of heavy oil. Garnish with flaky salt.";
      } else if (raw.id === 'wild-mushroom-truffle-pasta') {
        steps[4] = "Pour in the silky steamed cauliflower-garlic puree; simmer 2 mins to thicken naturally without heavy cream.";
      } else if (raw.id === 'falafel-hummus-mezze') {
        steps[0] = "Air-crisp falafels at 200°C (400°F) for 10 minutes with light olive oil mist rather than deep frying in oil.";
      }
    }

    // Apply Vegan Option
    if (rState.veganMode && raw.veganOption) {
      appliedSwaps.push({
        type: 'vegan',
        badge: '🌱 100% Plant-Based Active',
        title: raw.veganOption.title,
        description: raw.veganOption.description,
        items: raw.veganOption.replacedItems
      });

      ingredients = ingredients.map(ing => {
        if (ing.name.includes('Feta') || ing.name.includes('Cheese') || ing.name.includes('Parmigiano') || ing.name.includes('Mozzarella')) {
          return { ...ing, name: 'Artisanal Herb Tofu-Feta / Vegan Melt', cost: 0.60, isVegan: true };
        }
        if (ing.name.includes('Egg')) {
          return { ...ing, name: 'Smoked Paprika Marinated Tofu Steak', cost: 0.40, isVegan: true };
        }
        if (ing.name.includes('Chicken')) {
          return { ...ing, name: 'Marinated Balsamic Portobello Mushroom Steaks', cost: 1.10, isVegan: true };
        }
        if (ing.name.includes('Cream')) {
          return { ...ing, name: 'Velvety Cashew-Oat Culinary Cream', cost: 0.65, isVegan: true };
        }
        return ing;
      });
    }

    // Scale ingredient quantities by number of persons (NO ml, strictly person-scaled units)
    const scaledIngredients = ingredients.map(ing => {
      let scaledQty = ing.qtyPerPerson * persons;
      let displayQty = scaledQty % 1 === 0 ? scaledQty : scaledQty.toFixed(1);
      
      // Pluralize units nicely
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
        displayUnit: displayUnit,
        totalItemCost: (ing.cost * persons).toFixed(2)
      };
    });

    const totalBatchCost = (costPerPerson * persons).toFixed(2);
    const suggestedRetailTotal = (raw.suggestedRetailPrice * persons).toFixed(2);
    const totalBatchProfit = (suggestedRetailTotal - totalBatchCost).toFixed(2);
    const marginPercent = calcMargin(costPerPerson, raw.suggestedRetailPrice);
    const totalBatchCalories = caloriesPerPerson * persons;

    // Collect all reviews including user submissions
    const localUserReviews = state.customReviews[recipeId] || [];
    const allReviews = [...(raw.reviews || []), ...localUserReviews];

    return {
      ...raw,
      persons,
      rState,
      costPerPerson: costPerPerson.toFixed(2),
      totalBatchCost,
      suggestedRetailPrice: raw.suggestedRetailPrice.toFixed(2),
      suggestedRetailTotal,
      totalBatchProfit,
      marginPercent,
      caloriesPerPerson,
      totalBatchCalories,
      macros,
      ingredients: scaledIngredients,
      steps,
      appliedSwaps,
      allReviews
    };
  }

  // Check Pantry Match for a Recipe
  function getPantryMatchInfo(recipe) {
    if (!state.activePantryIngredients || state.activePantryIngredients.size === 0) {
      return { matchCount: 0, totalCount: recipe.ingredients.length, isMatch: true, matchPercent: 100, isUnfiltered: true };
    }

    const pantryArr = Array.from(state.activePantryIngredients).map(i => i.toLowerCase());
    let matchCount = 0;

    recipe.ingredients.forEach(ing => {
      const ingName = ing.name.toLowerCase();
      const matched = pantryArr.some(p => {
        // match subwords
        const pTokens = p.split(/[\s/]+/);
        return pTokens.some(token => token.length > 2 && ingName.includes(token));
      });
      if (matched) matchCount++;
    });

    const percent = Math.round((matchCount / recipe.ingredients.length) * 100);
    return {
      matchCount,
      totalCount: recipe.ingredients.length,
      isMatch: matchCount > 0,
      matchPercent: percent,
      isUnfiltered: false
    };
  }

  // RENDER: Pantry Bar (Chips & Presets)
  function renderPantrySection() {
    const container = document.getElementById('pantry-chips-container');
    if (!container) return;

    let html = `
      <div class="flex flex-wrap gap-2 items-center">
    `;

    PREFILLED_PANTRY_STAPLES.forEach(item => {
      const isSelected = state.activePantryIngredients.has(item.name);
      html += `
        <button 
          type="button"
          data-pantry-item="${item.name}"
          class="pantry-chip px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
            isSelected 
              ? 'bg-amber-500 text-white border-amber-600 shadow-sm scale-105' 
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-400'
          }"
        >
          <span>${item.icon}</span>
          <span>${item.name}</span>
          ${isSelected ? '<i class="fa-solid fa-check ml-1 text-xs"></i>' : ''}
        </button>
      `;
    });

    html += `
      </div>
    `;

    container.innerHTML = html;

    // Attach chip click listeners
    container.querySelectorAll('[data-pantry-item]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const item = btn.getAttribute('data-pantry-item');
        togglePantryItem(item);
      });
    });

    // Update active pantry badge
    const badge = document.getElementById('pantry-active-count');
    if (badge) {
      if (state.activePantryIngredients.size > 0) {
        badge.textContent = `${state.activePantryIngredients.size} Selected`;
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
    localStorage.setItem('flavorcraft_pantry', JSON.stringify(Array.from(state.activePantryIngredients)));
    renderPantrySection();
    renderExploreGrid();
  }

  function applyPantryPreset(presetKey) {
    const preset = PANTRY_PRESETS[presetKey];
    if (!preset) return;
    
    state.activePantryIngredients = new Set(preset.items);
    localStorage.setItem('flavorcraft_pantry', JSON.stringify(Array.from(state.activePantryIngredients)));
    renderPantrySection();
    renderExploreGrid();
  }

  function clearPantry() {
    state.activePantryIngredients.clear();
    localStorage.setItem('flavorcraft_pantry', '[]');
    renderPantrySection();
    renderExploreGrid();
  }

  // RENDER: Explore Recipe Grid
  function renderExploreGrid() {
    const grid = document.getElementById('recipes-grid');
    if (!grid) return;

    // Filter recipes
    let filtered = RECIPES_DATA.filter(recipe => {
      // Search query
      if (state.searchQuery) {
        const q = state.searchQuery.toLowerCase();
        const matchesTitle = recipe.title.toLowerCase().includes(q);
        const matchesCategory = recipe.category.toLowerCase().includes(q);
        const matchesIngredient = recipe.ingredients.some(i => i.name.toLowerCase().includes(q));
        if (!matchesTitle && !matchesCategory && !matchesIngredient) return false;
      }

      // Category filter
      if (state.selectedCategory !== 'all' && recipe.category !== state.selectedCategory) {
        return false;
      }

      // Dietary filter
      if (state.selectedDiet !== 'all') {
        if (!recipe.dietary.includes(state.selectedDiet)) {
          // Check if it has a vegan option if diet is Vegan
          if (state.selectedDiet === 'Vegan' && recipe.veganOption) {
            // Keep it
          } else {
            return false;
          }
        }
      }

      // Pantry Match Filter (Optional! If pantry has items, show recipes matching ingredients)
      if (state.activePantryIngredients.size > 0) {
        const pInfo = getPantryMatchInfo(recipe);
        if (pInfo.matchCount === 0) return false;
      }

      return true;
    });

    // Sort recipes
    filtered.sort((a, b) => {
      if (state.sortOption === 'popular') return b.rating - a.rating;
      if (state.sortOption === 'cost-asc') return a.baseCostPerPerson - b.baseCostPerPerson;
      if (state.sortOption === 'calories-asc') return a.baseCalories - b.baseCalories;
      if (state.sortOption === 'margin-desc') {
        return calcMargin(b.baseCostPerPerson, b.suggestedRetailPrice) - calcMargin(a.baseCostPerPerson, a.suggestedRetailPrice);
      }
      if (state.sortOption === 'prep-asc') {
        return parseInt(a.prepTime) - parseInt(b.prepTime);
      }
      return 0;
    });

    // Update count display
    const countDisplay = document.getElementById('recipes-count-display');
    if (countDisplay) {
      countDisplay.textContent = `Showing ${filtered.length} of ${RECIPES_DATA.length} Cafe Staples`;
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full py-16 text-center">
          <div class="inline-flex p-4 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-600 mb-4 text-3xl">
            <i class="fa-solid fa-kitchen-set"></i>
          </div>
          <h3 class="text-xl font-bold mb-2">No matching cafe recipes found</h3>
          <p class="text-slate-500 max-w-md mx-auto text-sm mb-6">
            Try adjusting your search terms, clearing dietary filters, or adding more ingredients to your kitchen pantry.
          </p>
          <button id="reset-filters-btn" class="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm shadow-md transition-all">
            Reset All Filters
          </button>
        </div>
      `;
      const resetBtn = document.getElementById('reset-filters-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          state.searchQuery = '';
          state.selectedCategory = 'all';
          state.selectedDiet = 'all';
          clearPantry();
          document.getElementById('search-input').value = '';
          document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active-cat'));
          document.querySelector('.cat-pill[data-category="all"]')?.classList.add('active-cat');
          renderExploreGrid();
        });
      }
      return;
    }

    let html = '';
    filtered.forEach(recipe => {
      const cRec = getComputedRecipe(recipe.id);
      const isFav = state.favorites.has(recipe.id);
      const pInfo = getPantryMatchInfo(recipe);

      html += `
        <div class="cafe-card group flex flex-col overflow-hidden bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl shadow-sm hover:shadow-xl hover:border-amber-400 dark:hover:border-amber-500/60 transition-all duration-300">
          
          <!-- Image Container -->
          <div class="relative h-52 overflow-hidden bg-slate-100 dark:bg-slate-900">
            <img 
              src="${recipe.image}" 
              alt="${recipe.title}" 
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            
            <!-- Category & Most Searched Badges -->
            <div class="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
              <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-white/95 text-slate-800 dark:bg-slate-900/95 dark:text-white backdrop-blur shadow-sm">
                ${recipe.category}
              </span>
              ${recipe.isMostSearched ? `
                <span class="px-2.5 py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-sm flex items-center gap-1">
                  <i class="fa-solid fa-fire text-amber-200"></i> Top Searched
                </span>
              ` : ''}
            </div>

            <!-- Favorite Heart Button -->
            <button 
              type="button"
              data-fav-id="${recipe.id}"
              class="fav-btn absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur flex items-center justify-center text-slate-400 hover:text-rose-500 hover:scale-110 transition-all shadow-md cursor-pointer ${isFav ? 'text-rose-500' : ''}"
              title="${isFav ? 'Remove from favorites' : 'Add to cafe favorites'}"
            >
              <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart text-base"></i>
            </button>

            <!-- Bottom Image Bar: Rating & Prep Time -->
            <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold">
              <div class="flex items-center gap-1.5 bg-black/40 backdrop-blur px-2.5 py-1 rounded-lg">
                <i class="fa-solid fa-star text-amber-400"></i>
                <span class="font-bold">${recipe.rating}</span>
                <span class="text-white/70">(${recipe.reviewsCount} reviews)</span>
              </div>
              <div class="flex items-center gap-1 bg-black/40 backdrop-blur px-2.5 py-1 rounded-lg">
                <i class="fa-regular fa-clock text-amber-300"></i>
                <span>${recipe.prepTime} prep</span>
              </div>
            </div>
          </div>

          <!-- Card Content -->
          <div class="p-5 flex-1 flex flex-col justify-between">
            <div>
              <!-- Pantry Match indicator if active -->
              ${!pInfo.isUnfiltered ? `
                <div class="mb-2.5">
                  <div class="flex items-center justify-between text-xs mb-1">
                    <span class="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <i class="fa-solid fa-kitchen-set"></i> Kitchen Pantry Match
                    </span>
                    <span class="font-extrabold text-slate-700 dark:text-slate-300">${pInfo.matchPercent}%</span>
                  </div>
                  <div class="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div class="bg-gradient-to-r from-amber-500 to-emerald-500 h-full rounded-full" style="width: ${pInfo.matchPercent}%"></div>
                  </div>
                </div>
              ` : ''}

              <!-- Title & Tagline -->
              <h3 class="text-lg font-bold text-slate-900 dark:text-white leading-snug mb-1.5 group-hover:text-amber-500 transition-colors">
                ${recipe.title}
              </h3>
              <p class="text-slate-500 dark:text-slate-400 text-xs line-clamp-2 mb-4 leading-relaxed">
                ${recipe.tagline}
              </p>

              <!-- Feature Pills (Budget Swap, Calorie Cutter, Vegan) -->
              <div class="flex flex-wrap gap-1.5 mb-4">
                <span class="badge-budget px-2 py-0.5 rounded-md text-[11px] font-bold flex items-center gap-1">
                  <i class="fa-solid fa-piggy-bank"></i> Save ${recipe.budgetAlternative.savingsPercent} Cost
                </span>
                <span class="badge-calorie px-2 py-0.5 rounded-md text-[11px] font-bold flex items-center gap-1">
                  <i class="fa-solid fa-fire-flame-simple"></i> ${recipe.calorieAlternative.caloriePercent} Calories
                </span>
                ${recipe.veganOption ? `
                  <span class="badge-vegan px-2 py-0.5 rounded-md text-[11px] font-bold flex items-center gap-1">
                    <i class="fa-solid fa-leaf"></i> Vegan Swap
                  </span>
                ` : ''}
              </div>
            </div>

            <!-- Card Bottom Specs & CTA -->
            <div class="pt-3 border-t border-slate-100 dark:border-slate-700/60">
              
              <!-- Financial & Calorie Summary Row (Scaled for 1 Person baseline) -->
              <div class="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 text-center mb-4">
                <div>
                  <span class="block text-[10px] text-slate-400 uppercase font-bold tracking-wider">Food Cost</span>
                  <span class="text-sm font-black text-slate-900 dark:text-white">${formatMoney(recipe.baseCostPerPerson)}</span>
                  <span class="block text-[10px] text-slate-400">/ person</span>
                </div>
                <div>
                  <span class="block text-[10px] text-slate-400 uppercase font-bold tracking-wider">Menu Price</span>
                  <span class="text-sm font-black text-emerald-600 dark:text-emerald-400">${formatMoney(recipe.suggestedRetailPrice)}</span>
                  <span class="block text-[10px] text-emerald-600/80 font-bold">${calcMargin(recipe.baseCostPerPerson, recipe.suggestedRetailPrice)}% Margin</span>
                </div>
                <div>
                  <span class="block text-[10px] text-slate-400 uppercase font-bold tracking-wider">Calories</span>
                  <span class="text-sm font-black text-rose-500">${recipe.baseCalories}</span>
                  <span class="block text-[10px] text-slate-400">kcal / pers</span>
                </div>
              </div>

              <!-- Action Button -->
              <button 
                type="button"
                data-open-recipe="${recipe.id}"
                class="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>View Ingredients & Whole Recipe</span>
                <i class="fa-solid fa-arrow-right text-xs"></i>
              </button>
            </div>

          </div>

        </div>
      `;
    });

    grid.innerHTML = html;

    // Attach listeners for opening modal and toggling fav
    grid.querySelectorAll('[data-open-recipe]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-open-recipe');
        openRecipeModal(id);
      });
    });

    grid.querySelectorAll('[data-fav-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-fav-id');
        toggleFavorite(id);
      });
    });
  }

  // Favorite Toggle
  function toggleFavorite(id) {
    if (state.favorites.has(id)) {
      state.favorites.delete(id);
    } else {
      state.favorites.add(id);
    }
    localStorage.setItem('flavorcraft_favs', JSON.stringify(Array.from(state.favorites)));
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

  // MODAL: Recipe WebX Deep-Dive (Strictly: 1. Ingredients FIRST -> 2. Whole Recipe SECOND)
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
      <div class="relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl max-w-5xl w-full mx-auto my-6 border border-slate-200 dark:border-slate-800 animate-fade-up">
        
        <!-- Modal Top Bar -->
        <div class="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
              ${cRec.category}
            </span>
            <span class="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
              Standard Operating Procedure (SOP)
            </span>
          </div>
          
          <div class="flex items-center gap-2">
            <!-- Favorite button -->
            <button 
              type="button" 
              id="modal-fav-toggle"
              class="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:text-rose-500 hover:border-rose-400 transition-all cursor-pointer ${isFav ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/30 border-rose-300' : ''}"
              title="Bookmark Recipe"
            >
              <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart text-base"></i>
            </button>
            
            <!-- Print Ticket Button -->
            <button 
              type="button" 
              id="modal-print-ticket-btn"
              class="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-all cursor-pointer"
              title="Print Kitchen Ticket for Line Cooks"
            >
              <i class="fa-solid fa-print"></i>
              <span class="hidden sm:inline">Kitchen Ticket</span>
            </button>

            <!-- Close Modal Button -->
            <button 
              type="button" 
              id="modal-close-btn"
              class="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold transition-all cursor-pointer"
            >
              <i class="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>
        </div>

        <!-- Scrollable Modal Body -->
        <div class="p-6 md:p-8 space-y-8 max-h-[85vh] overflow-y-auto">

          <!-- Hero Info Card -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div class="md:col-span-5 h-64 md:h-72 rounded-2xl overflow-hidden shadow-md relative">
              <img src="${cRec.image}" alt="${cRec.title}" class="w-full h-full object-cover">
              ${cRec.isMostSearched ? `
                <span class="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-lg flex items-center gap-1.5">
                  <i class="fa-solid fa-fire text-amber-200"></i> Cafe Top Pick
                </span>
              ` : ''}
              <div class="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-md rounded-xl p-2.5 text-white flex items-center justify-between text-xs">
                <div class="flex items-center gap-1.5">
                  <i class="fa-solid fa-star text-amber-400"></i>
                  <span class="font-bold text-sm">${cRec.rating}</span>
                  <span class="text-white/70">(${cRec.allReviews.length} cafe reviews)</span>
                </div>
                <div class="flex items-center gap-2">
                  <span><i class="fa-regular fa-clock mr-1"></i>${cRec.prepTime}</span>
                  <span><i class="fa-solid fa-fire mr-1"></i>${cRec.cookTime}</span>
                </div>
              </div>
            </div>

            <div class="md:col-span-7 flex flex-col justify-between">
              <div>
                <h2 class="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-2 leading-tight">
                  ${cRec.title}
                </h2>
                <p class="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">
                  ${cRec.tagline}
                </p>
                
                <!-- Dietary Badges -->
                <div class="flex flex-wrap gap-2 mb-6">
                  ${cRec.dietary.map(d => `
                    <span class="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      ${d}
                    </span>
                  `).join('')}
                  <span class="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                    Difficulty: ${cRec.difficulty}
                  </span>
                </div>
              </div>

              <!-- Real-time Financial Breakdown for Small Cafes -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50">
                <div>
                  <span class="block text-[10px] text-amber-800 dark:text-amber-300 font-bold uppercase tracking-wider">Batch Cost</span>
                  <span class="text-lg font-black text-slate-900 dark:text-white">${formatMoney(cRec.totalBatchCost)}</span>
                  <span class="block text-[11px] text-slate-500">${formatMoney(cRec.costPerPerson)}/person</span>
                </div>
                <div>
                  <span class="block text-[10px] text-amber-800 dark:text-amber-300 font-bold uppercase tracking-wider">Menu Retail</span>
                  <span class="text-lg font-black text-emerald-600 dark:text-emerald-400">${formatMoney(cRec.suggestedRetailTotal)}</span>
                  <span class="block text-[11px] text-emerald-600">${formatMoney(cRec.suggestedRetailPrice)}/guest</span>
                </div>
                <div>
                  <span class="block text-[10px] text-amber-800 dark:text-amber-300 font-bold uppercase tracking-wider">Gross Profit</span>
                  <span class="text-lg font-black text-slate-900 dark:text-white">${formatMoney(cRec.totalBatchProfit)}</span>
                  <span class="block text-[11px] text-emerald-600 font-bold">${cRec.marginPercent}% Margin</span>
                </div>
                <div>
                  <span class="block text-[10px] text-amber-800 dark:text-amber-300 font-bold uppercase tracking-wider">Total Calories</span>
                  <span class="text-lg font-black text-rose-500">${cRec.totalBatchCalories}</span>
                  <span class="block text-[11px] text-slate-500">${cRec.caloriesPerPerson} kcal/pers</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Interactive Control Bar: Number of Persons (Cover Scaling) & Smart Toggles -->
          <div class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-4">
            
            <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <!-- Scaler by NUMBER OF PERSONS (Instruction #2: Rather than ml in quantity - no. Of person) -->
              <div class="flex items-center gap-3">
                <span class="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <i class="fa-solid fa-users text-amber-500"></i> Covers / Persons:
                </span>
                
                <div class="inline-flex items-center bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-1 shadow-sm">
                  <button 
                    type="button"
                    id="person-decrement-btn"
                    class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-white flex items-center justify-center font-bold text-sm transition-all cursor-pointer"
                    title="Decrease headcount"
                  >
                    -
                  </button>
                  <span class="px-4 text-base font-black text-slate-900 dark:text-white min-w-[3.5rem] text-center" id="person-count-display">
                    ${cRec.persons} ${cRec.persons === 1 ? 'Person' : 'Persons'}
                  </span>
                  <button 
                    type="button"
                    id="person-increment-btn"
                    class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-white flex items-center justify-center font-bold text-sm transition-all cursor-pointer"
                    title="Increase headcount"
                  >
                    +
                  </button>
                </div>

                <!-- Quick Presets for Heads -->
                <div class="hidden sm:flex items-center gap-1">
                  <button type="button" class="person-preset-btn px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${cRec.persons === 1 ? 'bg-amber-500 text-white border-amber-600' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-amber-400'}" data-count="1">1</button>
                  <button type="button" class="person-preset-btn px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${cRec.persons === 2 ? 'bg-amber-500 text-white border-amber-600' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-amber-400'}" data-count="2">2</button>
                  <button type="button" class="person-preset-btn px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${cRec.persons === 4 ? 'bg-amber-500 text-white border-amber-600' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-amber-400'}" data-count="4">4</button>
                  <button type="button" class="person-preset-btn px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${cRec.persons === 10 ? 'bg-amber-500 text-white border-amber-600' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-amber-400'}" data-count="10">10 (Prep Batch)</button>
                  <button type="button" class="person-preset-btn px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${cRec.persons === 25 ? 'bg-amber-500 text-white border-amber-600' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-amber-400'}" data-count="25">25 (Catering)</button>
                </div>
              </div>

              <!-- Quick Toggles: Budget Optimizer, Calorie Cutter, Vegan Mode -->
              <div class="flex flex-wrap items-center gap-2">
                
                <!-- Toggle 1: Budget Saver (Instruction #5) -->
                <button 
                  type="button"
                  id="toggle-budget-mode"
                  class="px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                    rState.budgetMode 
                      ? 'bg-amber-500 text-white border-amber-600 shadow-sm' 
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-amber-400'
                  }"
                >
                  <i class="fa-solid fa-piggy-bank ${rState.budgetMode ? 'text-amber-200' : 'text-amber-500'}"></i>
                  <span>💡 Affordable Budget Swap</span>
                  <span class="text-[10px] px-1.5 py-0.5 rounded-full ${rState.budgetMode ? 'bg-amber-700 text-white' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'} font-black">
                    ${cRec.budgetAlternative.savingsPercent}
                  </span>
                </button>

                <!-- Toggle 2: Calorie Cutter (Instruction #15: ek same recipe ko less calories ka kese bna skte h) -->
                <button 
                  type="button"
                  id="toggle-calorie-mode"
                  class="px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                    rState.calorieMode 
                      ? 'bg-rose-500 text-white border-rose-600 shadow-sm' 
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-rose-400'
                  }"
                >
                  <i class="fa-solid fa-fire-flame-simple ${rState.calorieMode ? 'text-rose-200' : 'text-rose-500'}"></i>
                  <span>🥗 Calorie Cutter Mode</span>
                  <span class="text-[10px] px-1.5 py-0.5 rounded-full ${rState.calorieMode ? 'bg-rose-700 text-white' : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'} font-black">
                    ${cRec.calorieAlternative.caloriePercent}
                  </span>
                </button>

                <!-- Toggle 3: Vegan / Plant-Based (Instruction #16) -->
                ${cRec.veganOption ? `
                  <button 
                    type="button"
                    id="toggle-vegan-mode"
                    class="px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                      rState.veganMode 
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm' 
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-400'
                    }"
                  >
                    <i class="fa-solid fa-leaf ${rState.veganMode ? 'text-emerald-200' : 'text-emerald-500'}"></i>
                    <span>🌱 100% Plant-Based</span>
                  </button>
                ` : ''}

              </div>
            </div>

            <!-- Active Alternative Banners -->
            ${cRec.appliedSwaps.length > 0 ? `
              <div class="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                ${cRec.appliedSwaps.map(sw => `
                  <div class="p-3 rounded-xl text-xs ${
                    sw.type === 'budget' 
                      ? 'bg-amber-100/70 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200 border border-amber-300 dark:border-amber-800' 
                      : sw.type === 'calorie'
                        ? 'bg-rose-100/70 text-rose-900 dark:bg-rose-950/40 dark:text-rose-200 border border-rose-300 dark:border-rose-800'
                        : 'bg-emerald-100/70 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
                  } flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span class="font-black mr-2">${sw.badge}:</span>
                      <span>${sw.description}</span>
                    </div>
                    ${sw.savings ? `
                      <span class="px-2 py-0.5 rounded font-black whitespace-nowrap ${
                        sw.type === 'budget' ? 'bg-amber-600 text-white' : 'bg-rose-600 text-white'
                      }">
                        ${sw.savings}
                      </span>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
            ` : ''}

          </div>

          <!-- INSTRUCTION #19: IN RESPONSE FIRST SHOWS INGREDIENTS AND THEN THE WHOLE RECIPE -->

          <!-- ========================================== -->
          <!-- 1. SECTION 1: INGREDIENTS (SHOWN FIRST)   -->
          <!-- ========================================== -->
          <div class="space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span class="text-xs font-black uppercase tracking-wider text-amber-500">Step 1 of 2</span>
                <h3 class="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <i class="fa-solid fa-basket-shopping text-amber-500"></i>
                  <span>Bill of Ingredients (Scaled for ${cRec.persons} ${cRec.persons === 1 ? 'Person' : 'Persons'})</span>
                </h3>
              </div>
              <div class="text-xs text-slate-500">
                Wholesale ingredient cost: <span class="font-extrabold text-slate-900 dark:text-white">${formatMoney(cRec.totalBatchCost)}</span> total
              </div>
            </div>

            <!-- Ingredients Table / Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              ${cRec.ingredients.map((ing, idx) => `
                <div class="p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                  ing.isSwapped 
                    ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800' 
                    : ing.isLowCalorie
                      ? 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800'
                      : ing.isVegan
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                        : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80'
                }">
                  <div class="flex items-start gap-3 min-w-0">
                    <span class="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center shrink-0">
                      ${idx + 1}
                    </span>
                    <div class="min-w-0">
                      <div class="font-bold text-sm text-slate-900 dark:text-white truncate">
                        ${ing.name}
                      </div>
                      ${ing.swapReason ? `
                        <div class="text-[11px] text-amber-700 dark:text-amber-300 font-medium">
                          💡 ${ing.swapReason}
                        </div>
                      ` : ''}
                      ${ing.calSaved ? `
                        <div class="text-[11px] text-rose-600 dark:text-rose-400 font-bold">
                          🥗 Low-Calorie Swap (${ing.calSaved})
                        </div>
                      ` : ''}
                      <div class="text-[11px] text-slate-400">
                        Category: ${ing.category}
                      </div>
                    </div>
                  </div>

                  <div class="text-right shrink-0">
                    <div class="text-sm font-black text-amber-600 dark:text-amber-400">
                      ${ing.scaledQty} <span class="text-xs font-semibold text-slate-500">${ing.displayUnit}</span>
                    </div>
                    <div class="text-[11px] text-slate-400">
                      ${formatMoney(ing.totalItemCost)}
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- ============================================== -->
          <!-- 2. SECTION 2: WHOLE RECIPE (SHOWN SECOND)      -->
          <!-- ============================================== -->
          <div class="space-y-4 pt-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span class="text-xs font-black uppercase tracking-wider text-emerald-500">Step 2 of 2</span>
                <h3 class="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <i class="fa-solid fa-fire-burner text-emerald-500"></i>
                  <span>Chef Culinary Method (Whole Recipe with Swapped Ingredients Integrated)</span>
                </h3>
              </div>
              <div class="text-xs text-slate-500">
                Total Kitchen Ticket Time: <span class="font-extrabold text-slate-900 dark:text-white">${cRec.prepTime} prep + ${cRec.cookTime} cook</span>
              </div>
            </div>

            <!-- Steps List -->
            <div class="space-y-3">
              ${cRec.steps.map((step, idx) => `
                <div class="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-sm flex items-start gap-4">
                  <span class="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
                    ${idx + 1}
                  </span>
                  <div class="flex-1 text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                    ${step}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Nutrition & Calorie Breakdown Tracker (Instruction #14 & #15) -->
          <div class="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/70 space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h4 class="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <i class="fa-solid fa-chart-pie text-rose-500"></i>
                <span>Nutritional Facts & Macro Tracker (Per Person)</span>
              </h4>
              <span class="text-xs font-bold px-2.5 py-1 rounded-md bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                ${cRec.caloriesPerPerson} kcal / serving
              </span>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div class="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span class="block text-[11px] text-slate-400 font-bold uppercase">Protein</span>
                <span class="text-lg font-black text-slate-900 dark:text-white">${cRec.macros.protein}g</span>
                <span class="block text-[10px] text-emerald-500 font-semibold">Clean Muscle</span>
              </div>
              <div class="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span class="block text-[11px] text-slate-400 font-bold uppercase">Carbs</span>
                <span class="text-lg font-black text-slate-900 dark:text-white">${cRec.macros.carbs}g</span>
                <span class="block text-[10px] text-amber-500 font-semibold">Complex Energy</span>
              </div>
              <div class="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span class="block text-[11px] text-slate-400 font-bold uppercase">Healthy Fats</span>
                <span class="text-lg font-black text-slate-900 dark:text-white">${cRec.macros.fat}g</span>
                <span class="block text-[10px] text-indigo-500 font-semibold">Heart Healthy</span>
              </div>
              <div class="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span class="block text-[11px] text-slate-400 font-bold uppercase">Dietary Fiber</span>
                <span class="text-lg font-black text-slate-900 dark:text-white">${cRec.macros.fiber}g</span>
                <span class="block text-[10px] text-teal-500 font-semibold">Gut Wellness</span>
              </div>
            </div>
          </div>

          <!-- Reviews System & Verified Photos (Instruction #11) -->
          <div class="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 class="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <i class="fa-solid fa-comments text-amber-500"></i>
                  <span>Verified Cafe & Chef Reviews (${cRec.allReviews.length})</span>
                </h4>
                <p class="text-xs text-slate-500">Real feedback from indie cafe operators and head chefs</p>
              </div>

              <button 
                type="button" 
                id="open-write-review-btn"
                class="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-sm flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto"
              >
                <i class="fa-solid fa-pen-to-square"></i>
                <span>Write Cafe Review</span>
              </button>
            </div>

            <!-- Review Submission Form (Collapsible) -->
            <div id="write-review-form-container" class="hidden p-5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 space-y-4">
              <h5 class="font-bold text-sm text-slate-900 dark:text-white">Submit Chef & Cafe Review</h5>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Your Name / Title</label>
                  <input type="text" id="review-author" placeholder="e.g. Chef Kanishka" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:border-amber-500">
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Cafe / Restaurant Name & City</label>
                  <input type="text" id="review-cafename" placeholder="e.g. Copper Kettle Cafe, Seattle" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:border-amber-500">
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Rating</label>
                <select id="review-rating" class="px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:border-amber-500">
                  <option value="5">★★★★★ (5 Stars - Exceptional Cafe Margin & Flavor)</option>
                  <option value="4">★★★★☆ (4 Stars - Solid Culinary Standard)</option>
                  <option value="3">★★★☆☆ (3 Stars - Average)</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Kitchen Review & Cost Experience</label>
                <textarea id="review-text" rows="3" placeholder="How did the recipe or budget swaps perform in your cafe kitchen?" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:border-amber-500"></textarea>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Dish Photo URL (Optional)</label>
                <input type="text" id="review-photo" placeholder="https://images.unsplash.com/..." value="${cRec.image}" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:border-amber-500">
              </div>

              <div class="flex items-center gap-2">
                <button type="button" id="submit-review-btn" class="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white cursor-pointer shadow-sm">
                  Publish Review
                </button>
                <button type="button" id="cancel-review-btn" class="px-3 py-2 rounded-xl text-xs font-medium text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer">
                  Cancel
                </button>
              </div>
            </div>

            <!-- Reviews List with Photos -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              ${cRec.allReviews.map(rev => `
                <div class="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-sm flex flex-col justify-between">
                  <div>
                    <div class="flex items-center justify-between mb-2">
                      <div>
                        <div class="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>${rev.author}</span>
                          <span class="text-[10px] font-black px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            Verified Cafe
                          </span>
                        </div>
                        <div class="text-[11px] text-slate-500">
                          ${rev.cafeName} • ${rev.date || 'Recent'}
                        </div>
                      </div>

                      <div class="text-amber-400 text-xs font-bold">
                        ${'★'.repeat(rev.rating)}${'☆'.repeat(5 - rev.rating)}
                      </div>
                    </div>

                    <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                      "${rev.text}"
                    </p>
                  </div>

                  ${rev.photo ? `
                    <div class="h-28 rounded-xl overflow-hidden mt-2 relative">
                      <img src="${rev.photo}" alt="Dish served at ${rev.cafeName}" class="w-full h-full object-cover">
                      <span class="absolute bottom-1 right-2 text-[10px] bg-black/60 text-white px-2 py-0.5 rounded backdrop-blur">
                        Live Plate Photo
                      </span>
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </div>

          </div>

        </div>

      </div>
    `;

    container.innerHTML = html;

    // Attach all interactive event handlers inside modal
    setupModalEventListeners(cRec);
  }

  function setupModalEventListeners(cRec) {
    const recipeId = cRec.id;

    // Close button
    document.getElementById('modal-close-btn')?.addEventListener('click', closeRecipeModal);

    // Fav toggle
    document.getElementById('modal-fav-toggle')?.addEventListener('click', () => {
      toggleFavorite(recipeId);
      renderModalContent();
    });

    // Print ticket
    document.getElementById('modal-print-ticket-btn')?.addEventListener('click', () => {
      printKitchenTicket(recipeId);
    });

    // Person increment / decrement
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

    // Person presets (1, 2, 4, 10, 25)
    document.querySelectorAll('.person-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const count = parseInt(btn.getAttribute('data-count'), 10);
        state.recipeStates[recipeId].persons = count;
        renderModalContent();
      });
    });

    // Budget Saver toggle
    document.getElementById('toggle-budget-mode')?.addEventListener('click', () => {
      state.recipeStates[recipeId].budgetMode = !state.recipeStates[recipeId].budgetMode;
      renderModalContent();
    });

    // Calorie Cutter toggle
    document.getElementById('toggle-calorie-mode')?.addEventListener('click', () => {
      state.recipeStates[recipeId].calorieMode = !state.recipeStates[recipeId].calorieMode;
      renderModalContent();
    });

    // Vegan mode toggle
    document.getElementById('toggle-vegan-mode')?.addEventListener('click', () => {
      state.recipeStates[recipeId].veganMode = !state.recipeStates[recipeId].veganMode;
      renderModalContent();
    });

    // Review form toggle
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
      const author = document.getElementById('review-author').value.trim() || 'Chef Kanishka';
      const cafeName = document.getElementById('review-cafename').value.trim() || 'Independent Cafe Operator';
      const rating = parseInt(document.getElementById('review-rating').value, 10) || 5;
      const text = document.getElementById('review-text').value.trim();
      const photo = document.getElementById('review-photo').value.trim() || cRec.image;

      if (!text) {
        alert('Please share your kitchen feedback or cost experience.');
        return;
      }

      if (!state.customReviews[recipeId]) {
        state.customReviews[recipeId] = [];
      }

      state.customReviews[recipeId].unshift({
        id: 'user-' + Date.now(),
        author,
        cafeName,
        rating,
        date: 'Just now',
        verifiedCafe: true,
        text,
        photo
      });

      localStorage.setItem('flavorcraft_reviews', JSON.stringify(state.customReviews));
      renderModalContent();
    });
  }

  // Print Kitchen Order Ticket (KOT) for line cooks
  function printKitchenTicket(recipeId) {
    const cRec = getComputedRecipe(recipeId);
    if (!cRec) return;

    let ticketHtml = `
      <div id="print-ticket-container" style="max-width: 400px; font-family: monospace; padding: 20px; line-height: 1.4;">
        <div style="text-align: center; border-bottom: 2px dashed #000; padding-bottom: 10px; margin-bottom: 12px;">
          <h2 style="margin: 0; font-size: 18px; text-transform: uppercase;">FLAVORCRAFT CAFE OS</h2>
          <p style="margin: 3px 0 0; font-size: 12px;">KITCHEN ORDER PREP TICKET (KOT)</p>
          <p style="margin: 3px 0 0; font-size: 11px;">Covers: ${cRec.persons} Person(s) | Table Prep</p>
        </div>

        <div style="margin-bottom: 12px;">
          <h3 style="margin: 0; font-size: 16px;">${cRec.title.toUpperCase()}</h3>
          <p style="margin: 2px 0; font-size: 11px;">Category: ${cRec.category} | Prep: ${cRec.prepTime}</p>
          ${cRec.rState.budgetMode ? '<p style="margin: 2px 0; font-weight: bold;">[!] BUDGET SAVER INGREDIENT SWAPS ACTIVE</p>' : ''}
          ${cRec.rState.calorieMode ? '<p style="margin: 2px 0; font-weight: bold;">[!] LOW-CALORIE FIT MODE ACTIVE</p>' : ''}
          ${cRec.rState.veganMode ? '<p style="margin: 2px 0; font-weight: bold;">[!] 100% PLANT-BASED VEGAN FORMULA</p>' : ''}
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
          Ticket Generated: ${new Date().toLocaleTimeString()}
        </div>
      </div>
    `;

    const printContainer = document.getElementById('kot-print-area') || document.createElement('div');
    printContainer.id = 'kot-print-area';
    printContainer.innerHTML = ticketHtml;
    document.body.appendChild(printContainer);

    window.print();
  }

  // RENDER: Cafe Command Dashboard (Instruction #4 & #8) - Enhanced Ultra-Attractive Edition
  function renderDashboardView() {
    const container = document.getElementById('dashboard-view-container');
    if (!container) return;

    // Calculate aggregated metrics across catalog
    const totalRecipes = RECIPES_DATA.length;
    let avgMargin = 0;
    let totalBaseCost = 0;
    let totalRetail = 0;
    RECIPES_DATA.forEach(r => {
      avgMargin += calcMargin(r.baseCostPerPerson, r.suggestedRetailPrice);
      totalBaseCost += r.baseCostPerPerson;
      totalRetail += r.suggestedRetailPrice;
    });
    avgMargin = Math.round(avgMargin / totalRecipes);

    // Get selected recipe for covers calculator
    const selectedCoverRecipe = getComputedRecipe(state.dashboardSelectedRecipeId) || getComputedRecipe('smashed-avocado-toast');
    const coversCount = state.dashboardCovers;
    const coverFoodCost = (selectedCoverRecipe.costPerPerson * coversCount).toFixed(2);
    const coverRevenue = (selectedCoverRecipe.suggestedRetailPrice * coversCount).toFixed(2);
    const coverProfit = (coverRevenue - coverFoodCost).toFixed(2);
    
    // Calculate shift savings if budget swap is used
    const shiftSavings = (selectedCoverRecipe.budgetAlternative.savingsPerPerson * coversCount).toFixed(2);

    // Annual projection based on 85 average daily covers
    const annualCovers = 85 * 365;
    const avgCostPerPlate = (totalBaseCost / totalRecipes);
    const avgPricePerPlate = (totalRetail / totalRecipes);
    const annualRevenue = Math.round(annualCovers * avgPricePerPlate);
    const annualFoodCost = Math.round(annualCovers * avgCostPerPlate);
    const annualGrossProfit = annualRevenue - annualFoodCost;

    let html = `
      <div class="space-y-8 animate-fade-up">
        
        <!-- ============================================ -->
        <!-- 1. EXECUTIVE COMMAND HEADER & LIVE STATUS    -->
        <!-- ============================================ -->
        <div class="relative overflow-hidden rounded-3xl p-6 md:p-8 bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white shadow-xl border border-slate-700/80">
          <div class="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            <div class="space-y-2">
              <div class="flex flex-wrap items-center gap-2.5">
                <span class="px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 shadow-sm">
                  <span class="live-pulse-dot"></span>
                  <span>Chef Kanishka's Cafe Command Suite</span>
                </span>
                <span class="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-semibold">
                  Station Status: 4 Prep Lines Active
                </span>
              </div>

              <h2 class="text-2xl sm:text-3xl lg:text-4xl font-black font-heading tracking-tight text-white">
                Culinary Performance & Food Margin Center
              </h2>
              <p class="text-slate-300 text-xs sm:text-sm max-w-2xl font-medium leading-relaxed">
                Algorithmic recipe economics engineered for independent operators. Track real-time gross margins, batch covers, and budget substitution savings across all shifts.
              </p>
            </div>

            <!-- Quick Action Buttons -->
            <div class="flex flex-wrap items-center gap-2.5 shrink-0">
              <button 
                type="button" 
                id="dash-quick-pantry-btn"
                class="px-4 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all cursor-pointer flex items-center gap-2 shadow-sm"
              >
                <i class="fa-solid fa-boxes-stacked text-amber-400"></i>
                <span>Pantry Inventory</span>
              </button>

              <button 
                type="button" 
                id="dash-launch-slides-btn"
                class="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white shadow-lg transition-all cursor-pointer flex items-center gap-2"
              >
                <i class="fa-solid fa-lightbulb"></i>
                <span>Design Thinking Deck</span>
              </button>
            </div>

          </div>

          <!-- Decorative Ambient Glows -->
          <div class="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>
          <div class="absolute left-1/2 -top-20 w-72 h-72 rounded-full bg-rose-500/10 blur-3xl pointer-events-none"></div>
        </div>

        <!-- ============================================ -->
        <!-- 2. FOUR HIGH-IMPACT GLASS KPI CARDS          -->
        <!-- ============================================ -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <!-- KPI 1: Gross Margin % with Circular Visual Ring -->
          <div class="dash-kpi-card p-6 bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 shadow-sm glow-emerald flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-4">
                <span class="text-xs font-black text-slate-400 uppercase tracking-wider">Gross Profit Margin</span>
                <span class="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-base font-bold">
                  <i class="fa-solid fa-chart-pie"></i>
                </span>
              </div>

              <div class="flex items-center justify-between gap-3 mb-2">
                <span class="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  ${avgMargin}%
                </span>
                
                <!-- SVG Radial Ring (74.8% Visual) -->
                <div class="relative w-12 h-12 shrink-0">
                  <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path class="text-slate-100 dark:text-slate-700 stroke-current" stroke-width="4" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path class="text-emerald-500 stroke-current" stroke-dasharray="${avgMargin}, 100" stroke-width="4" stroke-linecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <span class="absolute inset-0 flex items-center justify-center text-[10px] font-black text-emerald-600 dark:text-emerald-400">
                    75%
                  </span>
                </div>
              </div>
            </div>

            <div class="pt-3 border-t border-slate-100 dark:border-slate-700/70">
              <span class="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <i class="fa-solid fa-arrow-trend-up"></i> +14.8% above 60% industry avg
              </span>
              <span class="block text-[10px] text-slate-400 mt-0.5">Target Food Cost: 25.2%</span>
            </div>
          </div>

          <!-- KPI 2: Monthly Food Cost Savings -->
          <div class="dash-kpi-card p-6 bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 shadow-sm glow-amber flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-4">
                <span class="text-xs font-black text-slate-400 uppercase tracking-wider">Monthly Cost Saved</span>
                <span class="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center text-base font-bold">
                  <i class="fa-solid fa-piggy-bank"></i>
                </span>
              </div>

              <div class="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                $1,420<span class="text-sm font-semibold text-slate-400">/mo</span>
              </div>
            </div>

            <div class="pt-3 border-t border-slate-100 dark:border-slate-700/70 space-y-1.5">
              <div class="flex items-center justify-between text-[11px] font-bold text-amber-600 dark:text-amber-400">
                <span>Avocado Pea Swap</span>
                <span>+$420/mo</span>
              </div>
              <div class="w-full bg-slate-100 dark:bg-slate-700 h-1 rounded-full overflow-hidden">
                <div class="bg-amber-500 h-full rounded-full" style="width: 82%"></div>
              </div>
              <span class="block text-[10px] text-slate-400">Via 1-Click Budget Substitutions</span>
            </div>
          </div>

          <!-- KPI 3: Fit-Bistro / Calorie Cutter Growth -->
          <div class="dash-kpi-card p-6 bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 shadow-sm glow-rose flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-4">
                <span class="text-xs font-black text-slate-400 uppercase tracking-wider">Fit-Bistro Uptake</span>
                <span class="w-10 h-10 rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center text-base font-bold">
                  <i class="fa-solid fa-fire-flame-simple"></i>
                </span>
              </div>

              <div class="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                +42.5%
              </div>
            </div>

            <div class="pt-3 border-t border-slate-100 dark:border-slate-700/70">
              <span class="text-[11px] text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1">
                <i class="fa-solid fa-arrow-trend-up"></i> 1 in 3 guests choose Low-Kcal
              </span>
              <span class="block text-[10px] text-slate-400 mt-0.5">Average -46% Calorie Reduction</span>
            </div>
          </div>

          <!-- KPI 4: Active Standard Operating Procedures -->
          <div class="dash-kpi-card p-6 bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 shadow-sm glow-indigo flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-4">
                <span class="text-xs font-black text-slate-400 uppercase tracking-wider">Production SOPs</span>
                <span class="w-10 h-10 rounded-2xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-base font-bold">
                  <i class="fa-solid fa-kitchen-set"></i>
                </span>
              </div>

              <div class="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                ${totalRecipes} <span class="text-sm font-semibold text-slate-400">Staples</span>
              </div>
            </div>

            <div class="pt-3 border-t border-slate-100 dark:border-slate-700/70">
              <span class="text-[11px] text-indigo-500 font-bold flex items-center gap-1">
                <i class="fa-solid fa-bolt"></i> Avg Ticket Speed: 4.8 mins
              </span>
              <span class="block text-[10px] text-slate-400 mt-0.5">Scaled 1 to 50 Persons without ml</span>
            </div>
          </div>

        </div>

        <!-- ============================================ -->
        <!-- 3. FINANCIAL HEALTH GAUGE & PROFIT FORECAST -->
        <!-- ============================================ -->
        <div class="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-6">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span class="text-xs font-black uppercase tracking-wider text-amber-500">Financial Engineering</span>
              <h3 class="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <i class="fa-solid fa-wallet text-amber-500"></i>
                <span>Cafe Margin Split & Annualized Revenue Forecast</span>
              </h3>
              <p class="text-xs text-slate-500">Based on standard small cafe volume (85 covers/day average)</p>
            </div>
            <div class="flex items-center gap-2">
              <span class="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                Healthy Commercial Model
              </span>
            </div>
          </div>

          <!-- Visual Margin Breakdown Bar -->
          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs font-bold">
              <span class="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <i class="fa-solid fa-circle text-[8px]"></i> Gross Profit Margin: 74.8%
              </span>
              <span class="text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <i class="fa-solid fa-circle text-[8px]"></i> Wholesale Food Cost: 25.2%
              </span>
            </div>
            
            <div class="w-full h-4 rounded-full overflow-hidden flex bg-slate-100 dark:bg-slate-700 p-0.5">
              <div class="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-l-full transition-all duration-500" style="width: 74.8%"></div>
              <div class="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-r-full transition-all duration-500" style="width: 25.2%"></div>
            </div>
          </div>

          <!-- 3 Annualized Projections -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 text-center">
              <span class="block text-xs font-bold text-slate-400 uppercase">Annual Food Inventory Cost</span>
              <span class="text-2xl font-black text-slate-900 dark:text-white mt-1 block">
                $${annualFoodCost.toLocaleString()}
              </span>
              <span class="text-[11px] text-slate-400">Wholesale supplier expenditure</span>
            </div>

            <div class="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-center">
              <span class="block text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase">Annual Cafe Revenue</span>
              <span class="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
                $${annualRevenue.toLocaleString()}
              </span>
              <span class="text-[11px] text-emerald-600">Total guest ticket sales</span>
            </div>

            <div class="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/40 text-center">
              <span class="block text-xs font-bold text-indigo-800 dark:text-indigo-300 uppercase">Annual Gross Kitchen Profit</span>
              <span class="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1 block">
                +$${annualGrossProfit.toLocaleString()}
              </span>
              <span class="text-[11px] text-indigo-600">Available for expansion & labor</span>
            </div>
          </div>
        </div>

        <!-- ============================================================ -->
        <!-- 4. INTERACTIVE DAILY SHIFT COVERS & BULK BATCH PREP SIMULATOR -->
        <!-- ============================================================ -->
        <div class="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-6">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span class="text-xs font-black uppercase tracking-wider text-amber-500">Live Kitchen Prep Tool</span>
              <h3 class="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <i class="fa-solid fa-calculator text-amber-500"></i>
                <span>Daily Shift Covers Scaler & Shift Revenue Simulator</span>
              </h3>
              <p class="text-xs text-slate-500">Select any dish and simulate expected dine-in covers for breakfast or dinner rush</p>
            </div>

            <div class="flex items-center gap-2">
              <label class="text-xs font-bold text-slate-500 hidden sm:inline">Select Staple:</label>
              <select id="dash-cover-recipe-select" class="px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold text-slate-800 dark:text-white focus:outline-none focus:border-amber-500 cursor-pointer shadow-sm">
                ${RECIPES_DATA.map(r => `
                  <option value="${r.id}" ${r.id === state.dashboardSelectedRecipeId ? 'selected' : ''}>
                    ${r.title} (${r.category})
                  </option>
                `).join('')}
              </select>
            </div>
          </div>

          <!-- Shift Presets (Instruction #2: Persons) -->
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-xs font-bold text-slate-400 mr-1">Quick Shifts:</span>
            <button type="button" class="shift-preset-btn px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${coversCount === 35 ? 'active-shift' : 'bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:border-amber-400'}" data-covers="35">
              ☕ Morning Rush (35 Covers)
            </button>
            <button type="button" class="shift-preset-btn px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${coversCount === 80 ? 'active-shift' : 'bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:border-amber-400'}" data-covers="80">
              🥑 Weekend Brunch (80 Covers)
            </button>
            <button type="button" class="shift-preset-btn px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${coversCount === 120 ? 'active-shift' : 'bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:border-amber-400'}" data-covers="120">
              🍝 Evening Bistro (120 Covers)
            </button>
            <button type="button" class="shift-preset-btn px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${coversCount === 200 ? 'active-shift' : 'bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:border-amber-400'}" data-covers="200">
              🎉 Catering Banquet (200 Covers)
            </button>
          </div>

          <!-- Slider Container -->
          <div class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm font-bold text-slate-700 dark:text-slate-300">Target Shift Covers:</span>
              <span class="text-2xl font-black text-amber-500 font-heading" id="dash-covers-display">
                ${state.dashboardCovers} Persons
              </span>
            </div>
            
            <input 
              type="range" 
              id="dash-covers-slider" 
              min="5" 
              max="200" 
              step="5" 
              value="${state.dashboardCovers}"
              class="w-full accent-amber-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
            >

            <div class="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>5 Covers (Slow day)</span>
              <span>50 Covers (Standard)</span>
              <span>100 Covers (Brunch rush)</span>
              <span>200 Covers (Full Catering)</span>
            </div>
          </div>

          <!-- 4 Output Pods -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            
            <div class="p-5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 flex flex-col justify-between">
              <span class="block text-xs text-amber-800 dark:text-amber-300 font-bold uppercase tracking-wider">Wholesale Batch Cost</span>
              <span class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white my-1 font-heading">${formatMoney(coverFoodCost)}</span>
              <span class="block text-xs text-slate-500">${formatMoney(selectedCoverRecipe.costPerPerson)}/person</span>
            </div>

            <div class="p-5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 flex flex-col justify-between">
              <span class="block text-xs text-emerald-800 dark:text-emerald-300 font-bold uppercase tracking-wider">Gross Shift Revenue</span>
              <span class="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 my-1 font-heading">${formatMoney(coverRevenue)}</span>
              <span class="block text-xs text-emerald-600 font-bold">${formatMoney(selectedCoverRecipe.suggestedRetailPrice)} ticket avg</span>
            </div>

            <div class="p-5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/40 flex flex-col justify-between">
              <span class="block text-xs text-indigo-800 dark:text-indigo-300 font-bold uppercase tracking-wider">Net Kitchen Profit</span>
              <span class="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 my-1 font-heading">${formatMoney(coverProfit)}</span>
              <span class="block text-xs text-indigo-600 font-bold">${selectedCoverRecipe.marginPercent}% gross margin</span>
            </div>

            <div class="p-5 rounded-2xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 flex flex-col justify-between">
              <span class="block text-xs text-rose-800 dark:text-rose-300 font-bold uppercase tracking-wider">Shift Swap Savings</span>
              <span class="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 my-1 font-heading">+$${shiftSavings}</span>
              <span class="block text-xs text-rose-600 font-bold">Via Budget Alternative</span>
            </div>

          </div>

          <!-- Dynamic Bulk Ingredient Preview for this Shift -->
          <div class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-3">
            <div class="flex items-center justify-between">
              <div class="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <i class="fa-solid fa-list-check text-amber-500"></i>
                <span>Estimated Bulk Kitchen Prep Required (${coversCount} Covers of ${selectedCoverRecipe.title}):</span>
              </div>
              <span class="text-xs text-slate-400 font-medium">Scaled automatically without ml</span>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              ${selectedCoverRecipe.ingredients.slice(0, 4).map(ing => {
                const bulkQty = (ing.qtyPerPerson * coversCount);
                const displayBulk = bulkQty % 1 === 0 ? bulkQty : bulkQty.toFixed(1);
                return `
                  <div class="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                    <span class="block text-slate-500 font-medium truncate">${ing.name}</span>
                    <span class="text-sm font-black text-slate-900 dark:text-white mt-0.5 block">
                      ${displayBulk} ${ing.displayUnit}
                    </span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Bottom Action Buttons -->
          <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button 
              type="button" 
              data-open-recipe="${selectedCoverRecipe.id}"
              class="px-5 py-2.5 rounded-xl font-bold text-xs bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-amber-500 hover:text-white transition-all cursor-pointer shadow-md flex items-center gap-2"
            >
              <i class="fa-solid fa-book-open"></i>
              <span>Open Complete Kitchen SOP for ${state.dashboardCovers} Persons</span>
            </button>
          </div>
        </div>

        <!-- ============================================ -->
        <!-- 5. TOP CAFE REVENUE DRIVERS LEADERBOARD      -->
        <!-- ============================================ -->
        <div class="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <span class="text-xs font-black uppercase tracking-wider text-amber-500">Menu Popularity</span>
              <h3 class="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <i class="fa-solid fa-trophy text-amber-500"></i>
                <span>Top Cafe Revenue Drivers Leaderboard</span>
              </h3>
              <p class="text-xs text-slate-500">Ranked by customer popularity, ticket speed, and commercial profitability</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            ${RECIPES_DATA.slice(0, 3).map((r, i) => {
              const rankMedal = i === 0 ? '🥇 #1 Revenue Driver' : i === 1 ? '🥈 #2 Margin Hero' : '🥉 #3 Trending Staple';
              const rankColor = i === 0 ? 'from-amber-500 to-orange-500' : i === 1 ? 'from-emerald-500 to-teal-500' : 'from-rose-500 to-pink-500';
              const margin = calcMargin(r.baseCostPerPerson, r.suggestedRetailPrice);
              return `
                <div class="cafe-card group p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl flex flex-col justify-between">
                  <div>
                    <div class="h-44 rounded-xl overflow-hidden mb-3 relative">
                      <img src="${r.image}" alt="${r.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                      
                      <span class="absolute top-2 left-2 px-2.5 py-1 rounded-md text-xs font-black bg-gradient-to-r ${rankColor} text-white shadow-md">
                        ${rankMedal}
                      </span>

                      <div class="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-md rounded-lg p-2 text-white flex items-center justify-between text-xs">
                        <span class="font-bold"><i class="fa-solid fa-star text-amber-400 mr-1"></i>${r.rating}</span>
                        <span><i class="fa-regular fa-clock mr-1"></i>${r.prepTime}</span>
                        <span class="font-black text-emerald-400">${margin}% Margin</span>
                      </div>
                    </div>

                    <h4 class="font-bold text-base text-slate-900 dark:text-white mb-1 group-hover:text-amber-500 transition-colors">
                      ${r.title}
                    </h4>
                    <p class="text-xs text-slate-500 line-clamp-2 mb-3">
                      ${r.tagline}
                    </p>
                  </div>

                  <div class="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <span class="block text-[10px] text-slate-400 font-bold uppercase">Food Cost</span>
                      <span class="font-black text-slate-900 dark:text-white text-sm">${formatMoney(r.baseCostPerPerson)}</span>
                    </div>
                    <button 
                      type="button" 
                      data-open-recipe="${r.id}"
                      class="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white transition-all cursor-pointer shadow-sm"
                    >
                      View Recipe SOP
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- ========================================================= -->
        <!-- 6. CALORIE CUTTER / LOW-CALORIE COMPARISON VISUAL CHART   -->
        <!-- ========================================================= -->
        <div class="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span class="text-xs font-black uppercase tracking-wider text-rose-500">Dietary & Fit-Bistro Intelligence</span>
              <h3 class="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <i class="fa-solid fa-fire text-rose-500"></i>
                <span>Calorie Cutter Impact Chart (Standard vs Fit-Bistro Version)</span>
              </h3>
              <p class="text-xs text-slate-500">Comparison of calories per person across standard vs low-calorie formula</p>
            </div>
            <span class="px-3 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 self-start sm:self-auto">
              Average 46% Calorie Reduction
            </span>
          </div>

          <!-- Visual Calorie Bars Grid -->
          <div class="space-y-4">
            ${RECIPES_DATA.map(r => {
              const stdKcal = r.baseCalories;
              const fitKcal = r.calorieAlternative.newCalories;
              const pctDrop = r.calorieAlternative.caloriePercent;
              const maxKcal = 700;
              const stdWidth = Math.round((stdKcal / maxKcal) * 100);
              const fitWidth = Math.round((fitKcal / maxKcal) * 100);

              return `
                <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                  <div class="flex items-center justify-between text-xs font-bold mb-2">
                    <span class="text-slate-900 dark:text-white font-extrabold">${r.title}</span>
                    <span class="text-rose-600 dark:text-rose-400 font-black">${pctDrop} Calories</span>
                  </div>

                  <!-- Double comparison bar -->
                  <div class="space-y-1.5">
                    <div class="flex items-center gap-3">
                      <span class="text-[10px] font-bold text-slate-400 w-16">Standard:</span>
                      <div class="flex-1 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div class="bg-slate-500 h-full rounded-full" style="width: ${stdWidth}%"></div>
                      </div>
                      <span class="text-[11px] font-bold text-slate-600 dark:text-slate-400 w-16 text-right">${stdKcal} kcal</span>
                    </div>

                    <div class="flex items-center gap-3">
                      <span class="text-[10px] font-bold text-rose-500 w-16">Fit Version:</span>
                      <div class="flex-1 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div class="bg-gradient-to-r from-rose-500 to-amber-500 h-full rounded-full" style="width: ${fitWidth}%"></div>
                      </div>
                      <span class="text-[11px] font-black text-rose-600 dark:text-rose-400 w-16 text-right">${fitKcal} kcal</span>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- ============================================ -->
        <!-- 7. COMPLETE CAFE MENU FINANCIAL MATRIX TABLE -->
        <!-- ============================================ -->
        <div class="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <span class="text-xs font-black uppercase tracking-wider text-amber-500">Complete Overview</span>
              <h3 class="text-xl font-black text-slate-900 dark:text-white">
                Cafe Menu Financial & Calorie Matrix Table
              </h3>
              <p class="text-xs text-slate-500">Wholesale baseline costs, budget alternative savings, retail prices, and gross margins</p>
            </div>
          </div>

          <div class="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 dark:bg-slate-900 text-slate-400 uppercase font-black tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th class="py-3 px-4">Cafe Staple</th>
                  <th class="py-3 px-4">Category</th>
                  <th class="py-3 px-4">Standard Cost</th>
                  <th class="py-3 px-4">Budget Saver Cost</th>
                  <th class="py-3 px-4">Menu Retail</th>
                  <th class="py-3 px-4">Gross Margin</th>
                  <th class="py-3 px-4">Calories (Std vs Fit)</th>
                  <th class="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                ${RECIPES_DATA.map(r => {
                  const margin = calcMargin(r.baseCostPerPerson, r.suggestedRetailPrice);
                  const budgetMargin = calcMargin(r.budgetAlternative.newCostPerPerson, r.suggestedRetailPrice);
                  return `
                    <tr class="hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors">
                      <td class="py-3.5 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                        <img src="${r.image}" alt="${r.title}" class="w-8 h-8 rounded-lg object-cover shrink-0">
                        <span class="truncate max-w-[180px]">${r.title}</span>
                      </td>
                      <td class="py-3.5 px-4 text-slate-500">
                        ${r.category}
                      </td>
                      <td class="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                        ${formatMoney(r.baseCostPerPerson)}
                      </td>
                      <td class="py-3.5 px-4 font-black text-amber-600 dark:text-amber-400">
                        ${formatMoney(r.budgetAlternative.newCostPerPerson)}
                        <span class="text-[10px] text-amber-500 font-bold ml-1">(-${r.budgetAlternative.savingsPercent})</span>
                      </td>
                      <td class="py-3.5 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                        ${formatMoney(r.suggestedRetailPrice)}
                      </td>
                      <td class="py-3.5 px-4">
                        <span class="px-2 py-0.5 rounded font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          ${margin}% → ${budgetMargin}%
                        </span>
                      </td>
                      <td class="py-3.5 px-4 text-rose-500 font-bold">
                        ${r.baseCalories} kcal → ${r.calorieAlternative.newCalories} kcal
                      </td>
                      <td class="py-3.5 px-4 text-right">
                        <button 
                          type="button" 
                          data-open-recipe="${r.id}"
                          class="px-3 py-1 rounded-lg text-xs font-bold bg-amber-500 text-white hover:bg-amber-600 transition-all cursor-pointer shadow-sm"
                        >
                          View SOP
                        </button>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;

    container.innerHTML = html;

    // Attach listeners
    document.getElementById('dash-quick-pantry-btn')?.addEventListener('click', () => {
      switchTab('explore');
      const drawer = document.getElementById('pantry-drawer');
      drawer?.classList.remove('hidden');
    });

    document.getElementById('dash-launch-slides-btn')?.addEventListener('click', () => {
      switchTab('slides');
    });

    const coverSelect = document.getElementById('dash-cover-recipe-select');
    coverSelect?.addEventListener('change', (e) => {
      state.dashboardSelectedRecipeId = e.target.value;
      renderDashboardView();
    });

    const coverSlider = document.getElementById('dash-covers-slider');
    coverSlider?.addEventListener('input', (e) => {
      state.dashboardCovers = parseInt(e.target.value, 10);
      document.getElementById('dash-covers-display').textContent = `${state.dashboardCovers} Persons`;
    });

    coverSlider?.addEventListener('change', () => {
      renderDashboardView();
    });

    // Shift preset buttons
    container.querySelectorAll('.shift-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.dashboardCovers = parseInt(btn.getAttribute('data-covers'), 10);
        renderDashboardView();
      });
    });

    container.querySelectorAll('[data-open-recipe]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-open-recipe');
        openRecipeModal(id);
      });
    });
  }

  // RENDER: Design Thinking Interactive Slides (Instruction #6: do design thinking and add it as slides in ur website)
  function renderDesignThinkingView() {
    const container = document.getElementById('slides-view-container');
    if (!container) return;

    const currentSlide = DESIGN_THINKING_SLIDES[state.currentSlideIndex] || DESIGN_THINKING_SLIDES[0];
    const totalSlides = DESIGN_THINKING_SLIDES.length;

    let html = `
      <div class="space-y-6 max-w-5xl mx-auto animate-fade-up">
        
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="px-3 py-0.5 rounded-full text-xs font-black bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30">
                Design Thinking Deck
              </span>
              <span class="text-xs text-slate-400">Human-Centered Culinary Innovation</span>
            </div>
            <h2 class="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
              Designing FlavorCraft Cafe OS
            </h2>
            <p class="text-xs text-slate-500">
              Interactive 5-Stage Design Thinking process tackling small cafe profit margins, portion scaling & dietary demands.
            </p>
          </div>

          <!-- Controls: Prev, Autoplay, Next -->
          <div class="flex items-center gap-2 self-start sm:self-auto">
            <button 
              type="button" 
              id="slide-prev-btn"
              class="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-amber-400 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 transition-all cursor-pointer ${state.currentSlideIndex === 0 ? 'opacity-40 cursor-not-allowed' : ''}"
              title="Previous slide"
              ${state.currentSlideIndex === 0 ? 'disabled' : ''}
            >
              <i class="fa-solid fa-chevron-left"></i>
            </button>

            <button 
              type="button" 
              id="slide-autoplay-btn"
              class="px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                state.slideAutoplay 
                  ? 'bg-amber-500 text-white border-amber-600 shadow-sm' 
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }"
              title="Toggle automatic presentation"
            >
              <i class="fa-solid ${state.slideAutoplay ? 'fa-pause' : 'fa-play'}"></i>
              <span>${state.slideAutoplay ? 'Pause' : 'Autoplay'}</span>
            </button>

            <button 
              type="button" 
              id="slide-next-btn"
              class="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-amber-400 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 transition-all cursor-pointer ${state.currentSlideIndex === totalSlides - 1 ? 'opacity-40 cursor-not-allowed' : ''}"
              title="Next slide"
              ${state.currentSlideIndex === totalSlides - 1 ? 'disabled' : ''}
            >
              <i class="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>

        <!-- Stage Navigation Tabs -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          ${DESIGN_THINKING_SLIDES.map((s, idx) => `
            <button 
              type="button"
              data-jump-slide="${idx}"
              class="px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                idx === state.currentSlideIndex
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-sm'
                  : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-amber-400'
              }"
            >
              ${s.stage}
            </button>
          `).join('')}
        </div>

        <!-- Main Slide Card (Presentation View) -->
        <div class="cafe-card bg-white dark:bg-slate-800/95 border border-slate-200 dark:border-slate-700/80 rounded-3xl p-6 md:p-10 shadow-xl relative overflow-hidden min-h-[480px] flex flex-col justify-between">
          
          <!-- Top Slide Header -->
          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm">
                ${currentSlide.badge}
              </span>
              <span class="text-xs font-black text-slate-400">
                Slide ${currentSlide.slideNumber} of ${totalSlides}
              </span>
            </div>

            <h3 class="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-2 leading-tight">
              ${currentSlide.title}
            </h3>
            <p class="text-slate-500 dark:text-slate-300 text-sm mb-8 leading-relaxed max-w-3xl">
              ${currentSlide.subtitle}
            </p>

            <!-- Key Points Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              ${currentSlide.points.map(pt => `
                <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700">
                  <div class="font-extrabold text-sm text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
                    <i class="fa-solid fa-circle-check text-amber-500 text-xs"></i>
                    <span>${pt.title}</span>
                  </div>
                  <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    ${pt.desc}
                  </p>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Bottom Metric & Progress Bar -->
          <div class="pt-6 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            <div class="flex items-center gap-3">
              <span class="text-2xl font-black text-amber-500">${currentSlide.metric.value}</span>
              <span class="text-xs text-slate-500 font-medium max-w-xs leading-snug">${currentSlide.metric.label}</span>
            </div>

            <!-- Slide Dots -->
            <div class="flex items-center gap-1.5">
              ${DESIGN_THINKING_SLIDES.map((_, i) => `
                <span 
                  data-jump-slide="${i}"
                  class="w-3 h-3 rounded-full transition-all cursor-pointer ${
                    i === state.currentSlideIndex 
                      ? 'bg-amber-500 w-6' 
                      : 'bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                  }"
                ></span>
              `).join('')}
            </div>

          </div>

        </div>

      </div>
    `;

    container.innerHTML = html;

    // Attach slide listeners
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
        startSlideAutoplay();
      } else {
        stopSlideAutoplay();
      }
      renderDesignThinkingView();
    });
  }

  function startSlideAutoplay() {
    stopSlideAutoplay();
    state.autoplayTimer = setInterval(() => {
      state.currentSlideIndex = (state.currentSlideIndex + 1) % DESIGN_THINKING_SLIDES.length;
      renderDesignThinkingView();
    }, 4500);
  }

  function stopSlideAutoplay() {
    if (state.autoplayTimer) {
      clearInterval(state.autoplayTimer);
      state.autoplayTimer = null;
    }
  }

  // RENDER: Favorites Tab (Instruction #17)
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
          <h3 class="text-xl font-bold mb-2">No Bookmarked Cafe Recipes Yet</h3>
          <p class="text-slate-500 text-sm mb-6">
            Click the heart icon on any recipe to save it here for fast kitchen access during rush hours.
          </p>
          <button type="button" id="fav-explore-btn" class="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm shadow-md transition-all cursor-pointer">
            Explore Cafe Recipes
          </button>
        </div>
      `;
      document.getElementById('fav-explore-btn')?.addEventListener('click', () => switchTab('explore'));
      return;
    }

    let html = `
      <div class="space-y-6 animate-fade-up">
        <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h2 class="text-2xl font-black text-slate-900 dark:text-white">Bookmarked Cafe Staples (${favList.length})</h2>
            <p class="text-xs text-slate-500">Quick-access culinary standard recipes curated for your team</p>
          </div>
          <button 
            type="button" 
            id="clear-all-favs-btn"
            class="px-3.5 py-1.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-rose-500 cursor-pointer transition-all"
          >
            Clear All
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          ${favList.map(recipe => {
            return `
              <div class="cafe-card p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col justify-between">
                <div>
                  <div class="h-44 rounded-xl overflow-hidden mb-3 relative">
                    <img src="${recipe.image}" alt="${recipe.title}" class="w-full h-full object-cover">
                    <span class="absolute top-2 left-2 px-2.5 py-1 rounded-md text-xs font-bold bg-black/60 text-white backdrop-blur">
                      ${recipe.category}
                    </span>
                    <button 
                      type="button"
                      data-fav-id="${recipe.id}"
                      class="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 text-rose-500 flex items-center justify-center cursor-pointer shadow-md"
                    >
                      <i class="fa-solid fa-heart"></i>
                    </button>
                  </div>

                  <h3 class="font-bold text-base text-slate-900 dark:text-white mb-1">
                    ${recipe.title}
                  </h3>
                  <p class="text-xs text-slate-500 line-clamp-2 mb-3">
                    ${recipe.tagline}
                  </p>
                </div>

                <div class="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <span class="block text-[10px] text-slate-400 uppercase font-bold">Cost / Person</span>
                    <span class="font-black text-slate-900 dark:text-white">${formatMoney(recipe.baseCostPerPerson)}</span>
                  </div>
                  <button 
                    type="button"
                    data-open-recipe="${recipe.id}"
                    class="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white transition-all cursor-pointer shadow-sm"
                  >
                    Open SOP
                  </button>
                </div>
              </div>
            `;
          }).join('')}
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

    document.getElementById('clear-all-favs-btn')?.addEventListener('click', () => {
      state.favorites.clear();
      localStorage.setItem('flavorcraft_favs', '[]');
      updateFavoritesBadge();
      renderFavoritesView();
    });
  }

  // TAB SWITCHING
  function switchTab(tabName) {
    state.activeTab = tabName;

    // Update navigation active styles
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      if (btn.getAttribute('data-tab') === tabName) {
        btn.classList.add('active-nav-tab');
      } else {
        btn.classList.remove('active-nav-tab');
      }
    });

    // Toggle view containers
    document.querySelectorAll('.tab-view-container').forEach(view => {
      view.classList.add('hidden');
    });

    const targetView = document.getElementById(`view-${tabName}`);
    if (targetView) {
      targetView.classList.remove('hidden');
    }

    if (tabName === 'explore') {
      renderExploreGrid();
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
    // Theme toggle button
    document.getElementById('theme-toggle-btn')?.addEventListener('click', () => {
      const nextTheme = state.theme === 'light' ? 'dark' : 'light';
      applyTheme(nextTheme);
    });

    // Navigation Tab clicks
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        switchTab(tab);
      });
    });

    // Search bar
    const searchInput = document.getElementById('search-input');
    searchInput?.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.trim();
      renderExploreGrid();
    });

    // Category pills
    document.querySelectorAll('.cat-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active-cat'));
        btn.classList.add('active-cat');
        state.selectedCategory = btn.getAttribute('data-category');
        renderExploreGrid();
      });
    });

    // Dietary filter pills (Instruction #16: Diet specific / vegan specific / vegetarian specific)
    document.querySelectorAll('.diet-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.diet-pill').forEach(p => p.classList.remove('active-diet'));
        btn.classList.add('active-diet');
        state.selectedDiet = btn.getAttribute('data-diet');
        renderExploreGrid();
      });
    });

    // Sort select
    const sortSelect = document.getElementById('sort-select');
    sortSelect?.addEventListener('change', (e) => {
      state.sortOption = e.target.value;
      renderExploreGrid();
    });

    // Pantry drawer toggle
    const togglePantryBtn = document.getElementById('toggle-pantry-drawer-btn');
    const pantryDrawer = document.getElementById('pantry-drawer');
    togglePantryBtn?.addEventListener('click', () => {
      pantryDrawer?.classList.toggle('hidden');
    });

    // Pantry preset buttons
    document.querySelectorAll('.pantry-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-preset');
        applyPantryPreset(key);
      });
    });

    // Clear pantry button
    document.getElementById('clear-pantry-btn')?.addEventListener('click', clearPantry);

    // Modal background click to close
    document.getElementById('recipe-webx-modal')?.addEventListener('click', (e) => {
      if (e.target.id === 'recipe-webx-modal') {
        closeRecipeModal();
      }
    });

    // Keyboard navigation (ESC closes modal, Arrow keys change slides)
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && state.activeRecipeId) {
        closeRecipeModal();
      } else if (state.activeTab === 'slides') {
        if (e.key === 'ArrowLeft' && state.currentSlideIndex > 0) {
          state.currentSlideIndex--;
          renderDesignThinkingView();
        } else if (e.key === 'ArrowRight' && state.currentSlideIndex < DESIGN_THINKING_SLIDES.length - 1) {
          state.currentSlideIndex++;
          renderDesignThinkingView();
        }
      }
    });
  }

  // Initialization
  function init() {
    initRecipeStates();
    applyTheme(state.theme);
    updateFavoritesBadge();
    renderPantrySection();
    renderExploreGrid();
    setupEventListeners();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
