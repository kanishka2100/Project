// FlavorShift AI - Intelligent Culinary Ingredient Substitution & Human Taste Validation Platform
// Core Application Engine

(function () {
  'use strict';

  // Application State
  const state = {
    activeTab: 'swaplab', // 'swaplab', 'explore', 'htv', 'dashboard', 'slides', 'favorites'
    selectedSwapIndex: 0,
    selectedCategory: 'all',
    selectedDiet: 'all',
    searchQuery: '',
    sortOption: 'popular',
    activePantryIngredients: new Set(JSON.parse(localStorage.getItem('flavorshift_pantry') || '[]')),
    favorites: new Set(JSON.parse(localStorage.getItem('flavorshift_favs') || '["paneer-butter-masala", "wild-mushroom-truffle-pasta", "artisan-margherita-sourdough-pizza"]')),
    theme: localStorage.getItem('flavorshift_theme') || 'light',
    
    // Video Controller State
    ambientVideoEnabled: localStorage.getItem('flavorshift_video_enabled') !== 'false',
    currentVideoScene: 'sizzle', // 'sizzle', 'prep', 'fire'
    videoSources: {
      sizzle: './assets/videos/culinary-loop.mp4',
      prep: './assets/videos/kitchen-prep.mp4',
      fire: './assets/videos/food-sizzle.webm'
    },
    
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
    dashboardSelectedRecipeId: 'paneer-butter-masala',
    
    // User-submitted HTV taste reviews
    customReviews: JSON.parse(localStorage.getItem('flavorshift_reviews') || '{}'),
    
    // User-submitted HTV validation tests
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
        themeBtn.innerHTML = `<i class="fa-solid fa-sun text-amber-400"></i><span class="hidden sm:inline font-medium text-xs">Light</span>`;
      } else {
        themeBtn.innerHTML = `<i class="fa-solid fa-moon text-indigo-500"></i><span class="hidden sm:inline font-medium text-xs">Dark</span>`;
      }
    }
  }

  // Video Management
  function setAmbientVideo(enabled) {
    state.ambientVideoEnabled = enabled;
    localStorage.setItem('flavorshift_video_enabled', enabled ? 'true' : 'false');
    const bgVideo = document.getElementById('ambient-video-backdrop');
    const statusText = document.getElementById('video-status-text');
    const globalVid = document.getElementById('global-ambient-video');

    if (bgVideo) {
      if (enabled) {
        bgVideo.style.opacity = state.theme === 'dark' ? '0.25' : '0.35';
        if (globalVid && globalVid.paused) {
          globalVid.play().catch(() => {});
        }
      } else {
        bgVideo.style.opacity = '0';
        if (globalVid && !globalVid.paused) {
          globalVid.pause();
        }
      }
    }

    if (statusText) {
      statusText.textContent = enabled ? 'ON' : 'OFF';
      statusText.className = enabled ? 'text-[11px] font-black text-flame' : 'text-[11px] font-black text-slate-400';
    }
  }

  function changeVideoScene(sceneKey) {
    if (!state.videoSources[sceneKey]) return;
    state.currentVideoScene = sceneKey;
    const src = state.videoSources[sceneKey];

    const globalVid = document.getElementById('global-ambient-video');
    if (globalVid) {
      globalVid.src = src;
      if (state.ambientVideoEnabled) {
        globalVid.play().catch(() => {});
      }
    }

    const heroVid = document.getElementById('hero-sizzle-video');
    if (heroVid) {
      heroVid.src = src;
      heroVid.play().catch(() => {});
    }

    // Update active scene buttons
    document.querySelectorAll('[data-video-scene]').forEach(btn => {
      if (btn.getAttribute('data-video-scene') === sceneKey) {
        btn.classList.add('bg-flame', 'text-white', 'border-flame');
        btn.classList.remove('bg-black/40', 'text-white/80', 'border-white/20');
      } else {
        btn.classList.remove('bg-flame', 'text-white', 'border-flame');
        btn.classList.add('bg-black/40', 'text-white/80', 'border-white/20');
      }
    });
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
        badge: '💡 FlavorShift AI Swap Active',
        title: raw.budgetAlternative.title,
        savings: raw.budgetAlternative.savingsPerPerson ? `$${raw.budgetAlternative.savingsPerPerson.toFixed(2)}/portion saved` : '',
        percent: raw.budgetAlternative.savingsPercent,
        description: raw.budgetAlternative.description,
        items: raw.budgetAlternative.replacedItems
      });

      // Update ingredients list
      ingredients = ingredients.map(ing => {
        if (raw.id === 'paneer-butter-masala' && ing.name.includes('Cream')) {
          return { ...ing, name: 'Soaked Cashew & Warm Milk Velvet Puree (60/40)', cost: 0.30, isSwapped: true, swapReason: '98% Taste Match: Cashew emulsion provides identical creamy gloss, saves 55%' };
        }
        if (raw.id === 'paneer-butter-masala' && ing.name.includes('Butter')) {
          return { ...ing, name: 'Desi Ghee & Clarified Butter Blend', cost: 0.15, isSwapped: true, swapReason: 'Authentic caramel aroma, zero wastage' };
        }
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
        if (raw.id === 'basque-burnt-cheesecake' && ing.name.includes('Cream Cheese')) {
          return { ...ing, name: 'Hung Curd & Farmhouse Cream Cheese (50/50)', cost: 0.85, isSwapped: true, swapReason: 'Saves 55% with enhanced lactic tang' };
        }
        if (raw.id === 'mediterranean-falafel-bowl' && ing.name.includes('Tahini')) {
          return { ...ing, name: 'Toasted Sesame & Sunflower Silk Dressing', cost: 0.35, isSwapped: true, swapReason: 'Velvety nutty drizzle saving 39%' };
        }
        if (raw.id === 'artisan-margherita-sourdough-pizza' && ing.name.includes('Mozzarella')) {
          return { ...ing, name: 'Domestic Whole Milk Mozzarella & Ricotta Melt', cost: 0.95, isSwapped: true, swapReason: 'Stretchy golden blisters with zero soggy center' };
        }
        if (raw.id === 'dark-chocolate-lava-souffle' && ing.name.includes('Chocolate')) {
          return { ...ing, name: 'Dutch Dark Cocoa & Espresso Brown Butter Silk', cost: 0.60, isSwapped: true, swapReason: 'Volcanic molten flow, saves 50%' };
        }
        if (raw.id === 'matcha-pistachio-cloud-latte' && ing.name.includes('Pistachio')) {
          return { ...ing, name: 'Toasted Green Pepita Silk & Almond Foam', cost: 0.35, isSwapped: true, swapReason: 'Pastel green microfoam at 45% savings' };
        }
        return ing;
      });

      // Update recipe cooking steps with budget technique
      if (raw.id === 'paneer-butter-masala') {
        steps[2] = "Prepare FlavorShift AI Cashew Velvet: Blend 60g soaked cashews with 40g warm milk until silky smooth. Fold into the spiced tomato gravy over gentle heat; it forms an ultra-stable emulsion that will not split.";
      } else if (raw.id === 'smashed-avocado-toast') {
        steps[1] = "In a cafe prep bowl, blend steamed sweet green peas (50%) with ripe avocado (50%), lemon juice, and flaky sea salt until vibrant green and velvety.";
        steps[5] = "Scatter whipped domestic ricotta crumbles, sliced radishes, and crushed red pepper flakes over the top.";
      } else if (raw.id === 'wild-mushroom-truffle-pasta') {
        steps[2] = "Sear brown cremini mushrooms in butter until deeply browned, deglazing with concentrated steeped porcini mushroom broth.";
        steps[6] = "Twirl onto plate, spooning the porcini mushroom brown butter sauce over pasta and dusting with aged Grana Padano.";
      }
    }

    // Apply Calorie Cutter Alternative
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
        if (raw.id === 'paneer-butter-masala' && ing.name.includes('Cream')) {
          return { ...ing, name: 'Silky Greek Yogurt & Silken Tofu Puree', cost: 0.25, isLowCalorie: true, calSaved: '-160 kcal' };
        }
        if (raw.id === 'paneer-butter-masala' && ing.name.includes('Paneer')) {
          return { ...ing, name: 'Air-Crisped Low-Fat Paneer Cubes (29g Protein)', cost: 0.80, isLowCalorie: true, calSaved: '-80 kcal' };
        }
        if (raw.id === 'paneer-butter-masala' && ing.name.includes('Butter')) {
          return { ...ing, name: '1 tsp Cold-Pressed Oil & Tomato Glaze', cost: 0.05, isLowCalorie: true, calSaved: '-80 kcal' };
        }
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
        if (raw.id === 'wild-mushroom-truffle-pasta' && ing.name.includes('Heavy Whipping Cream')) {
          return { ...ing, name: 'Steamed Cauliflower & Light Cashew Cream', cost: 0.60, isLowCalorie: true, calSaved: '-190 kcal' };
        }
        if (raw.id === 'basque-burnt-cheesecake' && ing.name.includes('Sugar')) {
          return { ...ing, name: 'Monkfruit Allulose Baker Blend (0 Sugar)', cost: 0.50, isLowCalorie: true, calSaved: '-120 kcal' };
        }
        return ing;
      });

      // Update instructions with low-calorie culinary technique
      if (raw.id === 'paneer-butter-masala') {
        steps[2] = "Whisk cold strained Greek yogurt with pureed silken tofu off the flame before gently swirling into the tomato base to retain smooth velvet body without excess fat.";
      } else if (raw.id === 'smashed-avocado-toast') {
        steps[0] = "Toast the thin seeded sourdough crispbread dry until ultra-crisp without butter.";
        steps[2] = "Poach egg whites gently for 2 minutes to create a light protein cloud.";
        steps[6] = "Spritz with fresh Meyer lemon herb mist instead of heavy oil. Garnish with flaky salt.";
      } else if (raw.id === 'wild-mushroom-truffle-pasta') {
        steps[3] = "Pour in the silky steamed cauliflower-garlic puree; simmer 2 mins to thicken naturally without heavy cream.";
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
        if (raw.id === 'paneer-butter-masala' && ing.name.includes('Paneer')) {
          return { ...ing, name: 'Pressed Organic Turmeric Tofu Cubes', cost: 0.70, isVegan: true };
        }
        if (raw.id === 'paneer-butter-masala' && ing.name.includes('Cream')) {
          return { ...ing, name: 'Coconut-Cashew Silk Emulsion', cost: 0.35, isVegan: true };
        }
        if (ing.name.includes('Feta') || ing.name.includes('Cream Cheese') || ing.name.includes('Parmigiano') || ing.name.includes('Mozzarella')) {
          return { ...ing, name: 'Artisanal Herb Tofu-Feta / Cashew Melt', cost: 0.60, isVegan: true };
        }
        if (ing.name.includes('Egg')) {
          return { ...ing, name: 'Smoked Paprika Marinated Tofu Steak', cost: 0.40, isVegan: true };
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
        displayUnit: displayUnit,
        totalItemCost: (ing.cost * persons).toFixed(2)
      };
    });

    const totalBatchCost = (costPerPerson * persons).toFixed(2);
    const suggestedRetailTotal = (raw.suggestedRetailPrice * persons).toFixed(2);
    const totalBatchProfit = (suggestedRetailTotal - totalBatchCost).toFixed(2);
    const marginPercent = calcMargin(costPerPerson, raw.suggestedRetailPrice);
    const totalBatchCalories = caloriesPerPerson * persons;

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

  // ========================================================
  // RENDER: FLAVORSHIFT AI SWAP LAB (FLAGSHIP FEATURE)
  // ========================================================
  function renderSwapLabView() {
    const container = document.getElementById('swaplab-view-container');
    if (!container) return;

    const activeSwap = FLAVORSHIFT_SWAP_DATABASE[state.selectedSwapIndex] || FLAVORSHIFT_SWAP_DATABASE[0];

    let html = `
      <div class="space-y-8 animate-fade-up max-w-6xl mx-auto">
        
        <!-- Interactive Sizzle Video & Culinary Hero -->
        <div class="relative overflow-hidden rounded-3xl gradient-flame text-white shadow-2xl p-6 sm:p-10 border border-white/20">
          
          <div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div class="lg:col-span-7 space-y-4">
              <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider">
                <i class="fa-solid fa-wand-magic-sparkles text-amber-300"></i>
                <span>FlavorShift AI Substitution Engine</span>
              </div>
              
              <h1 class="font-heading font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight">
                Never Compromise on Taste.<br>
                <span class="text-amber-200">Swap Missing or Expensive Ingredients</span> with AI.
              </h1>
              
              <p class="text-white/90 text-sm sm:text-base leading-relaxed font-medium max-w-2xl">
                Cooking <strong>Paneer Butter Masala</strong> without Fresh Cream? Or crafting gourmet pasta without $40 truffle oil? FlavorShift AI calculates the exact replacement ratio, models texture & flavor compatibility, and proves it through <strong>Human Taste Validation (HTV)</strong>.
              </p>

              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 text-center">
                <div class="bg-black/25 backdrop-blur-md rounded-2xl p-3 border border-white/15">
                  <span class="block text-2xl font-black text-white">98.2%</span>
                  <span class="text-[10px] text-white/80 font-bold uppercase tracking-wider">Taste Similarity</span>
                </div>
                <div class="bg-black/25 backdrop-blur-md rounded-2xl p-3 border border-white/15">
                  <span class="block text-2xl font-black text-amber-200">1-50 Covers</span>
                  <span class="text-[10px] text-white/80 font-bold uppercase tracking-wider">Exact Scaling</span>
                </div>
                <div class="bg-black/25 backdrop-blur-md rounded-2xl p-3 border border-white/15">
                  <span class="block text-2xl font-black text-emerald-200">40-65%</span>
                  <span class="text-[10px] text-white/80 font-bold uppercase tracking-wider">Wholesale Savings</span>
                </div>
                <div class="bg-black/25 backdrop-blur-md rounded-2xl p-3 border border-white/15">
                  <span class="block text-2xl font-black text-rose-200">-45% Kcal</span>
                  <span class="text-[10px] text-white/80 font-bold uppercase tracking-wider">Calorie Reducer</span>
                </div>
              </div>

              <!-- Quick Video Reel Switcher Buttons -->
              <div class="pt-2 flex flex-wrap items-center gap-2 text-xs">
                <span class="font-bold text-white/80 mr-1 flex items-center gap-1.5">
                  <span class="live-pulse-red"></span> Sizzle Cam:
                </span>
                <button type="button" data-video-scene="sizzle" class="px-3 py-1.5 rounded-xl font-bold border transition-all cursor-pointer ${state.currentVideoScene === 'sizzle' ? 'bg-flame text-white border-flame shadow-md' : 'bg-black/30 text-white/80 border-white/20 hover:bg-black/50'}">
                  🔥 Flambé & Sauté
                </button>
                <button type="button" data-video-scene="prep" class="px-3 py-1.5 rounded-xl font-bold border transition-all cursor-pointer ${state.currentVideoScene === 'prep' ? 'bg-flame text-white border-flame shadow-md' : 'bg-black/30 text-white/80 border-white/20 hover:bg-black/50'}">
                  🔪 Master Prep
                </button>
                <button type="button" data-video-scene="fire" class="px-3 py-1.5 rounded-xl font-bold border transition-all cursor-pointer ${state.currentVideoScene === 'fire' ? 'bg-flame text-white border-flame shadow-md' : 'bg-black/30 text-white/80 border-white/20 hover:bg-black/50'}">
                  🥘 Simmering Fire
                </button>
              </div>

            </div>

            <!-- Live Video Showcase Player Card -->
            <div class="lg:col-span-5 relative rounded-3xl overflow-hidden shadow-2xl border-2 border-white/30 bg-black/40 group aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3]">
              <video 
                id="hero-sizzle-video" 
                autoplay 
                muted 
                loop 
                playsinline 
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              >
                <source src="${state.videoSources[state.currentVideoScene]}" type="video/mp4">
                <source src="./assets/videos/culinary-loop.mp4" type="video/mp4">
              </video>
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none"></div>

              <div class="absolute top-3 left-3 flex items-center gap-2">
                <span class="px-2.5 py-1 rounded-full text-[11px] font-black uppercase bg-black/60 backdrop-blur-md text-white border border-white/20 flex items-center gap-1.5">
                  <span class="live-pulse-red"></span> Culinary Video Reel
                </span>
              </div>

              <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                <span class="font-bold flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-xl">
                  <i class="fa-solid fa-kitchen-set text-amber-400"></i>
                  <span>Live Test Kitchen Stream</span>
                </span>
                
                <div class="flex items-center gap-2">
                  <button type="button" id="hero-video-play-btn" class="w-8 h-8 rounded-xl bg-black/60 backdrop-blur-md text-white hover:bg-flame flex items-center justify-center cursor-pointer transition-colors shadow">
                    <i class="fa-solid fa-pause text-xs"></i>
                  </button>
                  <button type="button" id="hero-video-mute-btn" class="w-8 h-8 rounded-xl bg-black/60 backdrop-blur-md text-white hover:bg-flame flex items-center justify-center cursor-pointer transition-colors shadow">
                    <i class="fa-solid fa-volume-xmark text-xs"></i>
                  </button>
                </div>
              </div>
            </div>

          </div>

          <div class="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
        </div>

        <!-- Step 1: Interactive Target Ingredient Selector -->
        <div class="p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-slate-800/95 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4 glow-card">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700/60 pb-3">
            <div>
              <span class="text-xs font-black uppercase tracking-wider text-flame">Step 1: Choose Ingredient to Swap</span>
              <h3 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <i class="fa-solid fa-fire text-flame"></i>
                <span>What's Missing or Too Costly in Your Kitchen Right Now?</span>
              </h3>
            </div>
            <span class="text-xs text-slate-500 font-medium">Click any ingredient below to trigger FlavorShift AI</span>
          </div>

          <!-- Quick Ingredient Selection Chips with Food Photography -->
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
            ${FLAVORSHIFT_SWAP_DATABASE.map((item, idx) => `
              <button 
                type="button" 
                data-swap-idx="${idx}"
                class="swap-select-chip p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                  idx === state.selectedSwapIndex 
                    ? 'bg-gradient-to-br from-amber-500 via-flame to-berry-500 text-white border-transparent shadow-lg shadow-flame/20 scale-[1.02]' 
                    : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-flame'
                }"
              >
                <div class="h-20 w-full rounded-xl overflow-hidden relative shadow-sm">
                  <img src="${item.originalPhoto}" alt="${item.targetIngredient}" class="w-full h-full object-cover">
                  <span class="absolute bottom-1 right-1.5 text-xs bg-black/60 backdrop-blur text-white px-1.5 py-0.5 rounded-md font-mono">
                    ${idx === 0 ? '🥛 Dairy' : idx === 1 ? '🥑 Produce' : idx === 2 ? '🍄 Umami' : idx === 3 ? '🧀 Cheese' : '🥜 Nuts'}
                  </span>
                </div>
                <div>
                  <span class="font-black text-sm block leading-tight">${item.targetIngredient}</span>
                  <span class="text-[11px] opacity-80 block truncate mt-0.5">${item.commonInDishes[0]}</span>
                </div>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Step 2: AI Substitution Analysis & Photographic Comparison -->
        <div class="p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-slate-800/95 border border-slate-200/80 dark:border-slate-700/80 shadow-xl space-y-6">
          
          <!-- Selected Ingredient & Dish Side-by-Side Visual Banner -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center border-b border-slate-200/80 dark:border-slate-700/80 pb-6">
            
            <div class="md:col-span-7 space-y-2">
              <div class="flex flex-wrap items-center gap-2">
                <span class="px-3 py-1 rounded-full text-xs font-black bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                  Target: ${activeSwap.targetIngredient}
                </span>
                <span class="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  Common In: ${activeSwap.commonInDishes.join(', ')}
                </span>
              </div>

              <h3 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                AI Predicted Alternatives for <span class="text-gradient-flame">"${activeSwap.targetIngredient}"</span>
              </h3>
              
              <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                Culinary Friction: <span class="text-rose-600 dark:text-rose-400 font-bold">${activeSwap.reasonForSwap}</span>
              </p>
            </div>

            <!-- Photographic Preview Pair (Original vs Dish) -->
            <div class="md:col-span-5 flex items-center gap-3">
              <div class="flex-1 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md relative aspect-[4/3]">
                <img src="${activeSwap.originalPhoto}" alt="Original" class="w-full h-full object-cover">
                <span class="absolute bottom-1.5 left-1.5 right-1.5 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-lg text-center truncate">
                  ${activeSwap.targetIngredient}
                </span>
              </div>

              <div class="text-flame font-black text-xl shrink-0">
                <i class="fa-solid fa-arrow-right-arrow-left"></i>
              </div>

              <div class="flex-1 rounded-2xl overflow-hidden border border-amber-400 shadow-md relative aspect-[4/3]">
                <img src="${activeSwap.dishPhoto}" alt="Dish" class="w-full h-full object-cover">
                <span class="absolute bottom-1.5 left-1.5 right-1.5 bg-flame/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg text-center truncate">
                  ${activeSwap.commonInDishes[0]}
                </span>
              </div>
            </div>

          </div>

          <!-- 3 AI Alternative Cards with Food Photography -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            ${activeSwap.alternatives.map((alt, i) => {
              const badgeBg = i === 0 
                ? 'from-amber-500 to-flame text-white' 
                : i === 1 
                  ? 'from-emerald-500 to-teal-500 text-white' 
                  : 'from-berry-500 to-pink-500 text-white';

              return `
                <div class="cafe-card p-5 bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/80 rounded-3xl flex flex-col justify-between space-y-4">
                  <div>
                    <!-- Alternative Food Image -->
                    <div class="h-36 rounded-2xl overflow-hidden mb-3.5 relative shadow-sm">
                      <img src="${alt.photo}" alt="${alt.name}" class="w-full h-full object-cover">
                      <span class="absolute top-2 left-2 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r ${badgeBg} shadow-md">
                        ${alt.type}
                      </span>
                      <span class="absolute bottom-2 right-2 px-2 py-0.5 rounded-lg text-[11px] font-black bg-black/70 text-amber-300 backdrop-blur">
                        ${alt.tasteScore}
                      </span>
                    </div>

                    <h4 class="text-base sm:text-lg font-black text-slate-900 dark:text-white mb-2 leading-snug">
                      ${alt.name}
                    </h4>

                    <!-- Exact Ratio Box -->
                    <div class="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-3 shadow-xs">
                      <span class="block text-[10px] font-black uppercase text-amber-500 tracking-wider">Exact Replacement Ratio:</span>
                      <span class="text-xs font-black text-slate-900 dark:text-white mt-0.5 block leading-relaxed font-mono">
                        ${alt.ratio}
                      </span>
                    </div>

                    <!-- Taste & Texture Impact Matrix -->
                    <div class="space-y-2.5 text-xs">
                      <div>
                        <div class="flex items-center justify-between font-bold mb-0.5">
                          <span class="text-slate-600 dark:text-slate-300 flex items-center gap-1">
                            <i class="fa-solid fa-face-smile text-amber-500"></i> Taste Compatibility:
                          </span>
                          <span class="font-black text-amber-600 dark:text-amber-400">${alt.tasteScore}</span>
                        </div>
                        <p class="text-[11px] text-slate-500 leading-relaxed font-medium">
                          ${alt.tasteDesc}
                        </p>
                      </div>

                      <div class="pt-2 border-t border-slate-200/60 dark:border-slate-800">
                        <span class="font-bold text-slate-600 dark:text-slate-300 block mb-0.5 flex items-center gap-1">
                          <i class="fa-solid fa-water text-cyan-500"></i> Texture & Mouthfeel:
                        </span>
                        <p class="text-[11px] text-slate-500 leading-relaxed font-medium">
                          ${alt.textureDesc}
                        </p>
                      </div>

                      <!-- Cost & Calorie Impact -->
                      <div class="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold">
                        <span class="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">${alt.costChange}</span>
                        <span class="text-rose-500 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-md">${alt.calChange}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Human Taste Validation Score & Action -->
                  <div class="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2">
                    <div class="flex items-center justify-between text-xs">
                      <span class="text-slate-400 font-bold">HTV Taste Score:</span>
                      <span class="font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <i class="fa-solid fa-star text-amber-400"></i> ${alt.htvScore}
                      </span>
                    </div>

                    <button 
                      type="button" 
                      data-test-recipe="${activeSwap.targetRecipeId || 'paneer-butter-masala'}"
                      class="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 via-flame to-berry-500 hover:scale-[1.02] text-white transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                    >
                      <i class="fa-solid fa-fire-burner"></i>
                      <span>Open Full Recipe with this Swap</span>
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>

        </div>

      </div>
    `;

    container.innerHTML = html;

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

    // Video Scene Switcher Listeners
    container.querySelectorAll('[data-video-scene]').forEach(btn => {
      btn.addEventListener('click', () => {
        const sc = btn.getAttribute('data-video-scene');
        changeVideoScene(sc);
      });
    });

    // Hero video play/pause
    const heroVid = document.getElementById('hero-sizzle-video');
    const playBtn = document.getElementById('hero-video-play-btn');
    playBtn?.addEventListener('click', () => {
      if (heroVid) {
        if (heroVid.paused) {
          heroVid.play();
          playBtn.innerHTML = `<i class="fa-solid fa-pause text-xs"></i>`;
        } else {
          heroVid.pause();
          playBtn.innerHTML = `<i class="fa-solid fa-play text-xs"></i>`;
        }
      }
    });

    // Hero video mute/unmute
    const muteBtn = document.getElementById('hero-video-mute-btn');
    muteBtn?.addEventListener('click', () => {
      if (heroVid) {
        heroVid.muted = !heroVid.muted;
        muteBtn.innerHTML = heroVid.muted 
          ? `<i class="fa-solid fa-volume-xmark text-xs"></i>` 
          : `<i class="fa-solid fa-volume-high text-xs"></i>`;
      }
    });
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
        <div class="relative rounded-3xl overflow-hidden gradient-flame p-8 md:p-12 text-white shadow-xl">
          <div class="relative z-10 max-w-3xl space-y-4">
            <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider">
              <i class="fa-solid fa-utensils text-amber-300"></i>
              <span>Artisan Cafe & Cloud Kitchen Menu</span>
            </div>

            <h1 class="font-heading font-black text-3xl sm:text-4xl md:text-5xl leading-tight tracking-tight">
              Culinary Recipe Library.<br>
              <span class="text-amber-200">Scale Persons & Trigger Swaps</span> Live.
            </h1>

            <p class="text-white/90 text-sm md:text-base leading-relaxed font-medium">
              Every dish features exact gram-level measurements scaled by person count (1 to 50 covers), tested AI substitutions for missing or expensive ingredients, and verified human taste scores.
            </p>
          </div>

          <div class="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
        </div>

        <!-- Search, Categories, Dietary Filters & Sort Bar -->
        <div class="space-y-4 p-6 rounded-3xl bg-white/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="relative flex-1 max-w-lg">
              <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
              <input 
                type="text" 
                id="search-input"
                placeholder="Search recipes, missing ingredients (Cream, Truffle, Avocado, Cocoa)..." 
                class="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-flame shadow-sm transition-all"
              >
            </div>

            <div class="flex items-center gap-2 shrink-0">
              <span class="text-xs font-bold text-slate-400 hidden sm:inline">Sort by:</span>
              <select 
                id="sort-select"
                class="px-3.5 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-flame shadow-sm cursor-pointer"
              >
                <option value="popular">🔥 Most Popular & Searched</option>
                <option value="cost-asc">💰 Lowest Food Cost ($ / Person)</option>
                <option value="calories-asc">🥗 Lowest Calories (kcal / Person)</option>
                <option value="margin-desc">📈 Highest Profit Margin (%)</option>
                <option value="prep-asc">⚡ Fastest Kitchen Ticket (&lt;10m)</option>
              </select>
            </div>
          </div>

          <!-- Category Pills -->
          <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button type="button" data-category="all" class="cat-pill active-cat px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-400 transition-all whitespace-nowrap cursor-pointer">
              All Menus (9)
            </button>
            <button type="button" data-category="Cafe & Bistro Curries" class="cat-pill px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-400 transition-all whitespace-nowrap cursor-pointer">
              🍛 Indian Curries & Makhani
            </button>
            <button type="button" data-category="Brunch & Toast" class="cat-pill px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-400 transition-all whitespace-nowrap cursor-pointer">
              🥑 Brunch, Toast & Bowls
            </button>
            <button type="button" data-category="Pastas & Mains" class="cat-pill px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-400 transition-all whitespace-nowrap cursor-pointer">
              🍝 Pastas & Sourdough Pizza
            </button>
            <button type="button" data-category="Bakery & Desserts" class="cat-pill px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-400 transition-all whitespace-nowrap cursor-pointer">
              🍰 Bakery & Soufflé
            </button>
            <button type="button" data-category="Coffee & Drinks" class="cat-pill px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-400 transition-all whitespace-nowrap cursor-pointer">
              ☕ Artisan Coffee & Matcha
            </button>
          </div>

          <!-- Diet Focus Pills -->
          <div class="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span class="font-bold text-slate-400 shrink-0 mr-1">Diet Focus:</span>
            <button type="button" data-diet="all" class="diet-pill active-diet px-3 py-1.5 rounded-lg font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-500 cursor-pointer transition-all">
              All Diets
            </button>
            <button type="button" data-diet="Vegetarian" class="diet-pill px-3 py-1.5 rounded-lg font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-500 cursor-pointer transition-all flex items-center gap-1">
              <i class="fa-solid fa-seedling text-emerald-500"></i> Vegetarian
            </button>
            <button type="button" data-diet="Vegan" class="diet-pill px-3 py-1.5 rounded-lg font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-500 cursor-pointer transition-all flex items-center gap-1">
              <i class="fa-solid fa-leaf text-emerald-500"></i> 100% Vegan
            </button>
            <button type="button" data-diet="Gluten-Free" class="diet-pill px-3 py-1.5 rounded-lg font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-500 cursor-pointer transition-all">
              🌾 Gluten-Free
            </button>
          </div>
        </div>

        <!-- Recipe Cards Grid Section -->
        <div>
          <div class="flex items-center justify-between mb-4">
            <span id="recipes-count-display" class="text-xs font-black uppercase tracking-wider text-slate-500">
              Showing Recipes
            </span>
            <span class="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
              <i class="fa-solid fa-check-double"></i> All Swaps Backed by Human Taste Validation (HTV)
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
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-400'
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

    const countDisplay = document.getElementById('recipes-count-display');
    if (countDisplay) {
      countDisplay.textContent = `Showing ${filtered.length} of ${RECIPES_DATA.length} Culinary Recipes`;
    }

    let html = '';
    filtered.forEach(recipe => {
      const isFav = state.favorites.has(recipe.id);
      const rState = state.recipeStates[recipe.id] || { persons: 1, budgetMode: false, calorieMode: false, veganMode: false };
      const persons = rState.persons || 1;

      // Calculate cost based on active toggle
      let activeCost = recipe.baseCostPerPerson;
      if (rState.budgetMode && recipe.budgetAlternative) {
        activeCost = recipe.budgetAlternative.newCostPerPerson;
      }
      let activeCalories = recipe.baseCalories;
      if (rState.calorieMode && recipe.calorieAlternative) {
        activeCalories = recipe.calorieAlternative.newCalories;
      }

      const margin = calcMargin(activeCost, recipe.suggestedRetailPrice);

      html += `
        <div class="cafe-card group flex flex-col justify-between overflow-hidden bg-white/95 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300">
          
          <div>
            <!-- Image Container -->
            <div class="relative h-56 overflow-hidden bg-slate-100 dark:bg-slate-900">
              <img 
                src="${recipe.image}" 
                alt="${recipe.title}" 
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"></div>
              
              <div class="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
                <span class="px-2.5 py-1 rounded-full text-xs font-black bg-white/95 text-slate-800 dark:bg-slate-900/95 dark:text-white backdrop-blur shadow-sm">
                  ${recipe.category}
                </span>
                ${recipe.isMostSearched ? `
                  <span class="px-2.5 py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-sm flex items-center gap-1">
                    <i class="fa-solid fa-fire text-amber-200"></i> Top Pick
                  </span>
                ` : ''}
              </div>

              <button 
                type="button"
                data-fav-id="${recipe.id}"
                class="fav-btn absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur flex items-center justify-center text-slate-400 hover:text-rose-500 hover:scale-110 transition-all shadow-md cursor-pointer ${isFav ? 'text-rose-500' : ''}"
                title="Bookmark Recipe"
              >
                <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart text-base"></i>
              </button>

              <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold">
                <div class="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-xl">
                  <i class="fa-solid fa-star text-amber-400"></i>
                  <span class="font-bold">${recipe.rating}</span>
                  <span class="text-white/70">(${recipe.reviewsCount} tests)</span>
                </div>
                <div class="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-xl">
                  <i class="fa-regular fa-clock text-amber-300"></i>
                  <span>${recipe.prepTime}</span>
                </div>
              </div>
            </div>

            <!-- Card Content -->
            <div class="p-5 space-y-3">
              <div>
                <h3 class="text-lg font-black text-slate-900 dark:text-white leading-snug group-hover:text-flame transition-colors">
                  ${recipe.title}
                </h3>
                <p class="text-slate-500 dark:text-slate-400 text-xs line-clamp-2 mt-1 leading-relaxed font-medium">
                  ${recipe.tagline}
                </p>
              </div>

              <!-- Key Ingredient Icons -->
              <div class="flex items-center gap-1.5 py-1">
                <span class="text-[11px] font-bold text-slate-400 mr-1">Includes:</span>
                ${recipe.ingredients.slice(0, 5).map(ing => `
                  <span class="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-700/60 flex items-center justify-center text-xs" title="${ing.name}">
                    ${ing.icon || '🌿'}
                  </span>
                `).join('')}
                <span class="text-[10px] text-slate-400">+${recipe.ingredients.length - 5} more</span>
              </div>

              <!-- Quick Swaps Bar -->
              <div class="flex flex-wrap gap-1.5 pt-1">
                <button 
                  type="button" 
                  data-card-swap-toggle="budget" 
                  data-recipe-id="${recipe.id}"
                  class="px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                    rState.budgetMode 
                      ? 'bg-amber-500 text-white border-amber-600 shadow-sm' 
                      : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:bg-amber-100'
                  }"
                  title="Toggle AI Budget Alternative"
                >
                  <i class="fa-solid fa-arrows-rotate"></i>
                  <span>Swap: ${recipe.budgetAlternative.savingsPercent}</span>
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
                  title="Toggle Calorie Cutter Mode"
                >
                  <i class="fa-solid fa-fire-flame-simple"></i>
                  <span>${recipe.calorieAlternative.caloriePercent}</span>
                </button>

                ${recipe.veganOption ? `
                  <button 
                    type="button" 
                    data-card-swap-toggle="vegan" 
                    data-recipe-id="${recipe.id}"
                    class="px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                      rState.veganMode 
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm' 
                        : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
                    }"
                    title="Toggle Plant-Based Option"
                  >
                    <i class="fa-solid fa-leaf"></i>
                    <span>Vegan</span>
                  </button>
                ` : ''}
              </div>

            </div>
          </div>

          <!-- Card Bottom Specs & CTA -->
          <div class="p-5 pt-0">
            <div class="grid grid-cols-3 gap-2 py-2 px-3 rounded-2xl bg-slate-50 dark:bg-slate-750 text-center mb-3 border border-slate-100 dark:border-slate-700/60">
              <div>
                <span class="block text-[10px] text-slate-400 uppercase font-bold tracking-wider">Food Cost</span>
                <span class="text-sm font-black text-slate-900 dark:text-white">${formatMoney(activeCost)}</span>
                <span class="block text-[10px] text-slate-400">/ person</span>
              </div>
              <div>
                <span class="block text-[10px] text-slate-400 uppercase font-bold tracking-wider">Menu Price</span>
                <span class="text-sm font-black text-emerald-600 dark:text-emerald-400">${formatMoney(recipe.suggestedRetailPrice)}</span>
                <span class="block text-[10px] text-emerald-600 font-bold">${margin}% Margin</span>
              </div>
              <div>
                <span class="block text-[10px] text-slate-400 uppercase font-bold tracking-wider">Calories</span>
                <span class="text-sm font-black text-rose-500">${activeCalories}</span>
                <span class="block text-[10px] text-slate-400">kcal</span>
              </div>
            </div>

            <button 
              type="button"
              data-open-recipe="${recipe.id}"
              class="w-full py-3 px-4 rounded-2xl font-bold text-xs bg-gradient-to-r from-amber-500 via-flame to-berry-500 hover:scale-[1.01] text-white shadow-md hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
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
    if (state.favorites.has(id)) {
      state.favorites.delete(id);
    } else {
      state.favorites.add(id);
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
  // RENDER: HUMAN TASTE VALIDATION (HTV) HUB
  // ========================================================
  function renderHtvView() {
    const container = document.getElementById('htv-view-container');
    if (!container) return;

    let html = `
      <div class="space-y-8 animate-fade-up max-w-5xl mx-auto">
        
        <!-- HTV Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div>
            <div class="flex items-center gap-2 mb-1.5">
              <span class="px-3 py-0.5 rounded-full text-xs font-black bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 shadow-xs">
                <span class="live-pulse-dot"></span> HTV Community Protocol
              </span>
              <span class="text-xs text-slate-400 font-semibold">Empirical Taste Verification</span>
            </div>
            <h2 class="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
              Validating AI Recommendations in Real Kitchens
            </h2>
            <p class="text-xs text-slate-500 mt-1">
              AI models fat emulsion, sweetness & aroma compounds; verified chefs and home cooks test and rate blind taste consistency.
            </p>
          </div>

          <button 
            type="button" 
            id="htv-open-submit-modal"
            class="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-md flex items-center gap-2 cursor-pointer self-start md:self-auto transition-transform hover:scale-105"
          >
            <i class="fa-solid fa-clipboard-check"></i>
            <span>Submit Kitchen Validation Test</span>
          </button>
        </div>

        <!-- 3 Empirical Trust Metrics -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center shadow-sm">
            <span class="text-4xl font-black text-emerald-500 font-heading">98.2%</span>
            <span class="block text-xs font-bold text-slate-700 dark:text-slate-300 mt-1.5">Blind Taste Indistinguishability</span>
            <span class="block text-[11px] text-slate-400 mt-0.5">98 in 100 diners could not tell the ingredient was swapped</span>
          </div>

          <div class="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center shadow-sm">
            <span class="text-4xl font-black text-amber-500 font-heading">580+</span>
            <span class="block text-xs font-bold text-slate-700 dark:text-slate-300 mt-1.5">Kitchen Trials Completed</span>
            <span class="block text-[11px] text-slate-400 mt-0.5">Across cloud kitchens, cafes, and home stoves</span>
          </div>

          <div class="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center shadow-sm">
            <span class="text-4xl font-black text-rose-500 font-heading">0%</span>
            <span class="block text-xs font-bold text-slate-700 dark:text-slate-300 mt-1.5">Quality Compromise</span>
            <span class="block text-[11px] text-slate-400 mt-0.5">Only alternatives scoring ≥90% are accepted into database</span>
          </div>
        </div>

        <!-- Interactive Submission Drawer / Form -->
        <div id="htv-submission-box" class="hidden p-6 rounded-3xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 space-y-4 shadow-lg">
          <div class="flex items-center justify-between">
            <h4 class="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
              <i class="fa-solid fa-flask-vial text-amber-500"></i>
              <span>Submit Your Own Kitchen Taste Validation</span>
            </h4>
            <button type="button" id="close-htv-form-btn" class="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Your Name / Title</label>
              <input type="text" id="htv-input-author" placeholder="e.g. Chef Vikram / Baker" class="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700">
            </div>
            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Kitchen / Cafe & City</label>
              <input type="text" id="htv-input-kitchen" placeholder="e.g. Olive Cafe, Delhi" class="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700">
            </div>
            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Recipe Tested</label>
              <select id="htv-input-recipe" class="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-bold">
                ${RECIPES_DATA.map(r => `<option value="${r.title}">${r.title}</option>`).join('')}
              </select>
            </div>
          </div>

          <div class="text-xs">
            <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Test Observations & Patrons Reaction</label>
            <textarea id="htv-input-comment" rows="3" placeholder="Share how the substitute held up under cooking heat, sauce emulsion, and diner feedback..." class="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"></textarea>
          </div>

          <button type="button" id="htv-save-submission-btn" class="px-5 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-flame text-white shadow-md cursor-pointer">
            Publish Kitchen Validation
          </button>
        </div>

        <!-- Verified Kitchen Feedback Feed -->
        <div class="space-y-4">
          <h3 class="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <i class="fa-solid fa-comments text-amber-500"></i>
            <span>Verified Cook Feedback & Kitchen Validation Tests</span>
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${[
              {
                dish: "Paneer Butter Masala (Cashew Velvet)",
                author: "Chef Vikram M.",
                kitchen: "Saffron Cloud Kitchen, Gurugram",
                rating: 5,
                comment: "Saved our Saturday rush! Cashew paste emulsion is naturally thick, glossy, and never splits like commercial dairy cream.",
                photo: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80"
              },
              {
                dish: "Neapolitan Sourdough Pizza (Mozzarella-Ricotta)",
                author: "Chef Paolo R.",
                kitchen: "Bella Luna Trattoria, Chicago",
                rating: 5,
                comment: "Stopped the soggy center entirely! Blending whole milk mozzarella with ricotta gives an authentic stretchy blistered crust at 46% lower cost.",
                photo: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80"
              },
              {
                dish: "Basque Cheesecake (Hung Curd Swap)",
                author: "Chef Claire B.",
                kitchen: "Montreal Bakery Studio",
                rating: 5,
                comment: "50/50 hung curd cut our cream cheese cost in half and gave the molten center an authentic San Sebastian lactic tang.",
                photo: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&auto=format&fit=crop&q=80"
              },
              {
                dish: "Wild Mushroom Fettuccine (Porcini Reduction)",
                author: "Liam K.",
                kitchen: "Artisan Wood & Fork, Portland",
                rating: 5,
                comment: "Zero synthetic chemical perfume. Dried porcini broth reduction gave a far more sophisticated earthy umami than overpriced truffle oil.",
                photo: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&auto=format&fit=crop&q=80"
              },
              {
                dish: "Smashed Avocado Toast (Sweet Green Pea Mash)",
                author: "Marco D.",
                kitchen: "Daily Grind Bistro, Austin",
                rating: 5,
                comment: "50% pea blend kept the toast bright green until table service without turning brown, cutting our avocado bill by 43%.",
                photo: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80"
              },
              {
                dish: "Matcha Cold Foam (Pepita Silk)",
                author: "Barista Jin T.",
                kitchen: "Kissa Cloud Studio, Seattle",
                rating: 5,
                comment: "The toasted green pumpkin seed foam looks identical to pistachio butter and stays suspended for 15 minutes. Huge hit with patrons!",
                photo: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&auto=format&fit=crop&q=80"
              },
              ...state.htvSubmissions
            ].map(item => `
              <div class="cafe-card p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
                <div>
                  <div class="h-36 rounded-2xl overflow-hidden mb-3 relative">
                    <img src="${item.photo || 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80'}" alt="Dish" class="w-full h-full object-cover">
                    <span class="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-black/60 text-white backdrop-blur">
                      ${item.dish}
                    </span>
                    <span class="absolute bottom-2 right-2 px-2 py-0.5 rounded-lg text-xs font-black bg-amber-500 text-white">
                      ${'★'.repeat(item.rating || 5)}
                    </span>
                  </div>

                  <p class="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium mb-3">
                    "${item.comment}"
                  </p>
                </div>
                
                <div class="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/60 text-[11px] text-slate-400">
                  <span class="font-bold text-slate-600 dark:text-slate-300">${item.author} • ${item.kitchen}</span>
                  <span class="text-emerald-500 font-bold flex items-center gap-1"><i class="fa-solid fa-circle-check"></i> HTV Validated</span>
                </div>
              </div>
            `).join('')}
          </div>
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

    document.getElementById('htv-save-submission-btn')?.addEventListener('click', () => {
      const author = document.getElementById('htv-input-author').value.trim() || 'Verified Cook';
      const kitchen = document.getElementById('htv-input-kitchen').value.trim() || 'Artisan Cafe Kitchen';
      const dish = document.getElementById('htv-input-recipe').value;
      const comment = document.getElementById('htv-input-comment').value.trim();

      if (!comment) {
        alert('Please share your kitchen observations.');
        return;
      }

      state.htvSubmissions.unshift({
        dish,
        author,
        kitchen,
        rating: 5,
        comment,
        photo: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80'
      });

      localStorage.setItem('flavorshift_htv_submissions', JSON.stringify(state.htvSubmissions));
      renderHtvView();
    });
  }

  // ========================================================
  // RENDER: CAFE COST & MARGIN DASHBOARD
  // ========================================================
  function renderDashboardView() {
    const container = document.getElementById('dashboard-view-container');
    if (!container) return;

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

    const selectedCoverRecipe = getComputedRecipe(state.dashboardSelectedRecipeId) || getComputedRecipe('paneer-butter-masala');
    const coversCount = state.dashboardCovers;
    const coverFoodCost = (selectedCoverRecipe.costPerPerson * coversCount).toFixed(2);
    const coverRevenue = (selectedCoverRecipe.suggestedRetailPrice * coversCount).toFixed(2);
    const coverProfit = (coverRevenue - coverFoodCost).toFixed(2);
    const shiftSavings = (selectedCoverRecipe.budgetAlternative.savingsPerPerson * coversCount).toFixed(2);

    let html = `
      <div class="space-y-8 animate-fade-up">
        
        <div class="relative overflow-hidden rounded-3xl p-6 md:p-8 bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white shadow-xl border border-slate-700">
          <div class="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div class="space-y-2">
              <div class="flex flex-wrap items-center gap-2.5">
                <span class="px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 shadow-sm">
                  <span class="live-pulse-dot"></span>
                  <span>FlavorShift AI Culinary Financial Suite</span>
                </span>
                <span class="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-semibold">
                  Commercial Kitchen Operations
                </span>
              </div>

              <h2 class="text-2xl sm:text-3xl lg:text-4xl font-black font-heading tracking-tight text-white">
                Food Cost Savings & Profit Center
              </h2>
              <p class="text-slate-300 text-xs sm:text-sm max-w-2xl font-medium leading-relaxed">
                Track how smart ingredient swaps protect your restaurant margins against wholesale inflation without customer complaints.
              </p>
            </div>

            <div class="flex flex-wrap items-center gap-2.5 shrink-0">
              <button type="button" id="dash-quick-pantry-btn" class="px-4 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur transition-all cursor-pointer flex items-center gap-2 shadow-sm">
                <i class="fa-solid fa-boxes-stacked text-amber-400"></i>
                <span>Pantry Stock</span>
              </button>
              <button type="button" id="dash-launch-slides-btn" class="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-flame text-white shadow-lg transition-all cursor-pointer flex items-center gap-2">
                <i class="fa-solid fa-lightbulb"></i>
                <span>Design Thinking Deck</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 4 KPI Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="dash-kpi-card p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-4">
                <span class="text-xs font-black text-slate-400 uppercase tracking-wider">Gross Profit Margin</span>
                <span class="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center font-bold">
                  <i class="fa-solid fa-chart-pie"></i>
                </span>
              </div>
              <span class="text-3xl font-black text-slate-900 dark:text-white tracking-tight">${avgMargin}%</span>
            </div>
            <div class="pt-3 border-t border-slate-100 dark:border-slate-700">
              <span class="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                <i class="fa-solid fa-arrow-trend-up"></i> +14.8% above industry average
              </span>
            </div>
          </div>

          <div class="dash-kpi-card p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-4">
                <span class="text-xs font-black text-slate-400 uppercase tracking-wider">Monthly Swaps Saved</span>
                <span class="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-600 flex items-center justify-center font-bold">
                  <i class="fa-solid fa-piggy-bank"></i>
                </span>
              </div>
              <span class="text-3xl font-black text-slate-900 dark:text-white tracking-tight">$1,420<span class="text-sm font-semibold text-slate-400">/mo</span></span>
            </div>
            <div class="pt-3 border-t border-slate-100 dark:border-slate-700">
              <span class="text-[11px] text-amber-600 font-bold">Paneer & Pasta Cream Swaps: +$680</span>
            </div>
          </div>

          <div class="dash-kpi-card p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-4">
                <span class="text-xs font-black text-slate-400 uppercase tracking-wider">Fit-Bistro Uptake</span>
                <span class="w-10 h-10 rounded-2xl bg-rose-500/15 text-rose-600 flex items-center justify-center font-bold">
                  <i class="fa-solid fa-fire"></i>
                </span>
              </div>
              <span class="text-3xl font-black text-slate-900 dark:text-white tracking-tight">+42.5%</span>
            </div>
            <div class="pt-3 border-t border-slate-100 dark:border-slate-700">
              <span class="text-[11px] text-rose-600 font-bold">Low-Calorie orders surging</span>
            </div>
          </div>

          <div class="dash-kpi-card p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-4">
                <span class="text-xs font-black text-slate-400 uppercase tracking-wider">HTV Agreement Rate</span>
                <span class="w-10 h-10 rounded-2xl bg-indigo-500/15 text-indigo-600 flex items-center justify-center font-bold">
                  <i class="fa-solid fa-award"></i>
                </span>
              </div>
              <span class="text-3xl font-black text-slate-900 dark:text-white tracking-tight">98.2%</span>
            </div>
            <div class="pt-3 border-t border-slate-100 dark:border-slate-700">
              <span class="text-[11px] text-indigo-500 font-bold">580+ kitchen validations</span>
            </div>
          </div>
        </div>

        <!-- Shift Scaler -->
        <div class="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span class="text-xs font-black uppercase tracking-wider text-flame">Live Kitchen Prep Tool</span>
              <h3 class="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <i class="fa-solid fa-calculator text-flame"></i>
                <span>Daily Shift Covers Batch Scaler & Revenue Simulator</span>
              </h3>
              <p class="text-xs text-slate-500">Simulate wholesale ingredient cost and profits across guest counts</p>
            </div>

            <div class="flex items-center gap-2">
              <select id="dash-cover-recipe-select" class="px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold text-slate-800 dark:text-white focus:outline-none focus:border-flame cursor-pointer shadow-sm">
                ${RECIPES_DATA.map(r => `
                  <option value="${r.id}" ${r.id === state.dashboardSelectedRecipeId ? 'selected' : ''}>
                    ${r.title}
                  </option>
                `).join('')}
              </select>
            </div>
          </div>

          <div class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm font-bold text-slate-700 dark:text-slate-300">Target Shift Covers:</span>
              <span class="text-2xl font-black text-flame font-heading" id="dash-covers-display">
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
              class="w-full accent-flame cursor-pointer"
            >
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <div class="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
              <span class="block text-xs text-amber-800 dark:text-amber-300 font-bold uppercase">Wholesale Cost</span>
              <span class="text-2xl font-black text-slate-900 dark:text-white my-1">${formatMoney(coverFoodCost)}</span>
              <span class="block text-xs text-slate-500">${formatMoney(selectedCoverRecipe.costPerPerson)}/cover</span>
            </div>

            <div class="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900">
              <span class="block text-xs text-emerald-800 dark:text-emerald-300 font-bold uppercase">Gross Revenue</span>
              <span class="text-2xl font-black text-emerald-600 dark:text-emerald-400 my-1">${formatMoney(coverRevenue)}</span>
              <span class="block text-xs text-emerald-600 font-bold">${formatMoney(selectedCoverRecipe.suggestedRetailPrice)} ticket</span>
            </div>

            <div class="p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900">
              <span class="block text-xs text-indigo-800 dark:text-indigo-300 font-bold uppercase">Kitchen Profit</span>
              <span class="text-2xl font-black text-indigo-600 dark:text-indigo-400 my-1">${formatMoney(coverProfit)}</span>
              <span class="block text-xs text-indigo-600 font-bold">${selectedCoverRecipe.marginPercent}% margin</span>
            </div>

            <div class="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900">
              <span class="block text-xs text-rose-800 dark:text-rose-300 font-bold uppercase">Shift Swap Savings</span>
              <span class="text-2xl font-black text-rose-600 dark:text-rose-400 my-1">+$${shiftSavings}</span>
              <span class="block text-xs text-rose-600 font-bold">Via AI Alternative</span>
            </div>
          </div>
        </div>

      </div>
    `;

    container.innerHTML = html;

    document.getElementById('dash-quick-pantry-btn')?.addEventListener('click', () => {
      switchTab('explore');
      document.getElementById('pantry-drawer')?.classList.remove('hidden');
    });

    document.getElementById('dash-launch-slides-btn')?.addEventListener('click', () => {
      switchTab('slides');
    });

    document.getElementById('dash-cover-recipe-select')?.addEventListener('change', (e) => {
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
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="px-3 py-0.5 rounded-full text-xs font-black bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30">
                Design Thinking Deck
              </span>
              <span class="text-xs text-slate-400 font-semibold">FlavorShift AI Innovation Process</span>
            </div>
            <h2 class="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
              Designing FlavorShift AI
            </h2>
            <p class="text-xs text-slate-500">
              5-Stage Design Thinking process tackling missing ingredient substitution, conversion ratios & Human Taste Validation.
            </p>
          </div>

          <div class="flex items-center gap-2">
            <button type="button" id="slide-prev-btn" class="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-flame flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 transition-all cursor-pointer ${state.currentSlideIndex === 0 ? 'opacity-40 cursor-not-allowed' : ''}" ${state.currentSlideIndex === 0 ? 'disabled' : ''}>
              <i class="fa-solid fa-chevron-left"></i>
            </button>
            <button type="button" id="slide-autoplay-btn" class="px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${state.slideAutoplay ? 'bg-flame text-white' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'}">
              <i class="fa-solid ${state.slideAutoplay ? 'fa-pause' : 'fa-play'}"></i>
              <span>${state.slideAutoplay ? 'Pause' : 'Autoplay'}</span>
            </button>
            <button type="button" id="slide-next-btn" class="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-flame flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 transition-all cursor-pointer ${state.currentSlideIndex === totalSlides - 1 ? 'opacity-40 cursor-not-allowed' : ''}" ${state.currentSlideIndex === totalSlides - 1 ? 'disabled' : ''}>
              <i class="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>

        <div class="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          ${DESIGN_THINKING_SLIDES.map((s, idx) => `
            <button type="button" data-jump-slide="${idx}" class="px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${idx === state.currentSlideIndex ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-sm' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'}">
              ${s.stage}
            </button>
          `).join('')}
        </div>

        <div class="cafe-card bg-white dark:bg-slate-800/95 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 md:p-10 shadow-xl relative min-h-[460px] flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-flame text-white shadow-sm">
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

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              ${currentSlide.points.map(pt => `
                <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700">
                  <div class="font-extrabold text-sm text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
                    <i class="fa-solid fa-circle-check text-flame text-xs"></i>
                    <span>${pt.title}</span>
                  </div>
                  <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    ${pt.desc}
                  </p>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="pt-6 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <span class="text-2xl font-black text-flame">${currentSlide.metric.value}</span>
              <span class="text-xs text-slate-500 font-medium max-w-xs leading-snug">${currentSlide.metric.label}</span>
            </div>

            <div class="flex items-center gap-1.5">
              ${DESIGN_THINKING_SLIDES.map((_, i) => `
                <span data-jump-slide="${i}" class="w-3 h-3 rounded-full transition-all cursor-pointer ${i === state.currentSlideIndex ? 'bg-flame w-6' : 'bg-slate-300 dark:bg-slate-700'}"></span>
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
          <p class="text-slate-500 text-sm mb-6">
            Click the heart icon on any recipe to save it here for fast kitchen access.
          </p>
          <button type="button" id="fav-explore-btn" class="px-5 py-2.5 rounded-xl bg-flame text-white font-semibold text-sm shadow-md cursor-pointer">
            Explore Menus
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
            <h2 class="text-2xl font-black text-slate-900 dark:text-white">Saved Recipes (${favList.length})</h2>
            <p class="text-xs text-slate-500">Quick-access recipes with FlavorShift AI alternatives</p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          ${favList.map(recipe => `
            <div class="cafe-card p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl flex flex-col justify-between">
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
                <h3 class="font-bold text-base text-slate-900 dark:text-white mb-1">${recipe.title}</h3>
                <p class="text-xs text-slate-500 line-clamp-2 mb-3">${recipe.tagline}</p>
              </div>

              <div class="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <span class="font-black text-slate-900 dark:text-white">${formatMoney(recipe.baseCostPerPerson)}/person</span>
                <button type="button" data-open-recipe="${recipe.id}" class="px-4 py-2 rounded-xl text-xs font-bold bg-flame text-white hover:bg-flame-600 transition-all cursor-pointer">
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
      <div class="relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl max-w-5xl w-full mx-auto my-6 border border-slate-200 dark:border-slate-800 animate-fade-up">
        
        <!-- Modal Top Bar -->
        <div class="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
              ${cRec.category}
            </span>
            <span class="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
              <i class="fa-solid fa-check-double"></i> HTV Validated (${cRec.rating} ★)
            </span>
          </div>
          
          <div class="flex items-center gap-2">
            <button 
              type="button" 
              id="modal-fav-toggle"
              class="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:text-rose-500 hover:border-rose-400 transition-all cursor-pointer ${isFav ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/30 border-rose-300' : ''}"
              title="Bookmark Recipe"
            >
              <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart text-base"></i>
            </button>
            
            <button 
              type="button" 
              id="modal-print-ticket-btn"
              class="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-all cursor-pointer"
              title="Print Kitchen Ticket for Line Cooks"
            >
              <i class="fa-solid fa-print"></i>
              <span class="hidden sm:inline">Kitchen Ticket</span>
            </button>

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

          <!-- Hero Info Card with Photo -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div class="md:col-span-5 h-64 md:h-72 rounded-3xl overflow-hidden shadow-lg relative">
              <img src="${cRec.image}" alt="${cRec.title}" class="w-full h-full object-cover">
              ${cRec.isMostSearched ? `
                <span class="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-lg flex items-center gap-1.5">
                  <i class="fa-solid fa-fire text-amber-200"></i> Top Pick
                </span>
              ` : ''}
              <div class="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-md rounded-2xl p-2.5 text-white flex items-center justify-between text-xs">
                <div class="flex items-center gap-1.5">
                  <i class="fa-solid fa-star text-amber-400"></i>
                  <span class="font-bold text-sm">${cRec.rating}</span>
                  <span class="text-white/70">(${cRec.allReviews.length} reviews)</span>
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
                <p class="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4 font-medium">
                  ${cRec.tagline}
                </p>
                
                <div class="flex flex-wrap gap-2 mb-6">
                  ${cRec.dietary.map(d => `
                    <span class="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      ${d}
                    </span>
                  `).join('')}
                  <span class="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                    Flavor Profile: ${cRec.heroFlavor || 'Aromatic & Balanced'}
                  </span>
                </div>
              </div>

              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50">
                <div>
                  <span class="block text-[10px] text-amber-800 dark:text-amber-300 font-bold uppercase tracking-wider">Batch Cost</span>
                  <span class="text-lg font-black text-slate-900 dark:text-white">${formatMoney(cRec.totalBatchCost)}</span>
                  <span class="block text-[11px] text-slate-500">${formatMoney(cRec.costPerPerson)}/person</span>
                </div>
                <div>
                  <span class="block text-[10px] text-amber-800 dark:text-amber-300 font-bold uppercase tracking-wider">Menu Retail</span>
                  <span class="text-lg font-black text-emerald-600 dark:text-emerald-400">${formatMoney(cRec.suggestedRetailTotal)}</span>
                  <span class="block text-[11px] text-emerald-600">${formatMoney(cRec.suggestedRetailPrice)}/person</span>
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

          <!-- Controls: Number of Persons & FlavorShift AI Swaps -->
          <div class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4">
            <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              
              <!-- Persons Stepper -->
              <div class="flex items-center gap-3">
                <span class="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <i class="fa-solid fa-users text-amber-500"></i> Covers / Persons:
                </span>
                
                <div class="inline-flex items-center bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-1 shadow-sm">
                  <button type="button" id="person-decrement-btn" class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-flame hover:text-white flex items-center justify-center font-bold text-sm transition-all cursor-pointer">-</button>
                  <span class="px-4 text-base font-black text-slate-900 dark:text-white min-w-[3.5rem] text-center" id="person-count-display">
                    ${cRec.persons} ${cRec.persons === 1 ? 'Person' : 'Persons'}
                  </span>
                  <button type="button" id="person-increment-btn" class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-flame hover:text-white flex items-center justify-center font-bold text-sm transition-all cursor-pointer">+</button>
                </div>

                <div class="hidden sm:flex items-center gap-1">
                  <button type="button" class="person-preset-btn px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${cRec.persons === 1 ? 'bg-flame text-white border-flame' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}" data-count="1">1</button>
                  <button type="button" class="person-preset-btn px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${cRec.persons === 2 ? 'bg-flame text-white border-flame' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}" data-count="2">2</button>
                  <button type="button" class="person-preset-btn px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${cRec.persons === 4 ? 'bg-flame text-white border-flame' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}" data-count="4">4</button>
                  <button type="button" class="person-preset-btn px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${cRec.persons === 10 ? 'bg-flame text-white border-flame' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}" data-count="10">10 (Prep Batch)</button>
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
                      ? 'bg-amber-500 text-white border-amber-600 shadow-sm' 
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-amber-400'
                  }"
                >
                  <i class="fa-solid fa-arrows-rotate ${rState.budgetMode ? 'text-amber-200' : 'text-amber-500'}"></i>
                  <span>💡 FlavorShift AI Swap</span>
                  <span class="text-[10px] px-1.5 py-0.5 rounded-full ${rState.budgetMode ? 'bg-amber-700 text-white' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'} font-black">
                    ${cRec.budgetAlternative.savingsPercent}
                  </span>
                </button>

                <!-- Toggle 2: Calorie Cutter Alternative -->
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

                <!-- Toggle 3: Vegan Option -->
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

            <!-- Active Swap Banner & Ratio -->
            ${cRec.appliedSwaps.length > 0 ? `
              <div class="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                ${cRec.appliedSwaps.map(sw => `
                  <div class="p-3 rounded-xl text-xs ${
                    sw.type === 'budget' 
                      ? 'bg-amber-100/70 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200 border border-amber-300 dark:border-amber-800' 
                      : 'bg-rose-100/70 text-rose-900 dark:bg-rose-950/40 dark:text-rose-200 border border-rose-300 dark:border-rose-800'
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

          <!-- ============================================== -->
          <!-- 1. SECTION 1: INGREDIENTS LIST (SHOWN FIRST)   -->
          <!-- ============================================== -->
          <div class="space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span class="text-xs font-black uppercase tracking-wider text-flame">Step 1 of 2</span>
                <h3 class="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <i class="fa-solid fa-basket-shopping text-flame"></i>
                  <span>Bill of Ingredients (Scaled for ${cRec.persons} ${cRec.persons === 1 ? 'Person' : 'Persons'})</span>
                </h3>
              </div>
              <div class="text-xs text-slate-500">
                Total Ingredient Cost: <span class="font-extrabold text-slate-900 dark:text-white">${formatMoney(cRec.totalBatchCost)}</span>
              </div>
            </div>

            <!-- Ingredients Table -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              ${cRec.ingredients.map((ing, idx) => `
                <div class="p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  ing.isSwapped 
                    ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800' 
                    : ing.isLowCalorie
                      ? 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800'
                      : ing.isVegan
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                        : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80'
                }">
                  <div class="flex items-start gap-3 min-w-0">
                    <span class="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center shrink-0">
                      ${ing.icon || idx + 1}
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
                    <div class="text-sm font-black text-flame dark:text-amber-400">
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
          <!-- 2. SECTION 2: WHOLE RECIPE STEPS (SHOWN SECOND)-->
          <!-- ============================================== -->
          <div class="space-y-4 pt-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span class="text-xs font-black uppercase tracking-wider text-emerald-500">Step 2 of 2</span>
                <h3 class="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <i class="fa-solid fa-fire-burner text-emerald-500"></i>
                  <span>Chef Culinary Method (Swapped Ingredients Integrated Seamlessly)</span>
                </h3>
              </div>
              <div class="text-xs text-slate-500">
                Ticket Time: <span class="font-extrabold text-slate-900 dark:text-white">${cRec.prepTime} prep + ${cRec.cookTime} cook</span>
              </div>
            </div>

            <div class="space-y-3">
              ${cRec.steps.map((step, idx) => `
                <div class="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-sm flex items-start gap-4">
                  <span class="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-flame text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
                    ${idx + 1}
                  </span>
                  <div class="flex-1 text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                    ${step}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Nutrition & Calorie Breakdown -->
          <div class="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-4">
            <div class="flex items-center justify-between">
              <h4 class="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <i class="fa-solid fa-chart-pie text-rose-500"></i>
                <span>Nutritional Profile & Macro Tracker (Per Person)</span>
              </h4>
              <span class="text-xs font-bold px-2.5 py-1 rounded-md bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                ${cRec.caloriesPerPerson} kcal / serving
              </span>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div class="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span class="block text-[11px] text-slate-400 font-bold uppercase">Protein</span>
                <span class="text-lg font-black text-slate-900 dark:text-white">${cRec.macros.protein}g</span>
              </div>
              <div class="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span class="block text-[11px] text-slate-400 font-bold uppercase">Carbs</span>
                <span class="text-lg font-black text-slate-900 dark:text-white">${cRec.macros.carbs}g</span>
              </div>
              <div class="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span class="block text-[11px] text-slate-400 font-bold uppercase">Healthy Fats</span>
                <span class="text-lg font-black text-slate-900 dark:text-white">${cRec.macros.fat}g</span>
              </div>
              <div class="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span class="block text-[11px] text-slate-400 font-bold uppercase">Fiber</span>
                <span class="text-lg font-black text-slate-900 dark:text-white">${cRec.macros.fiber}g</span>
              </div>
            </div>
          </div>

          <!-- Human Taste Validation & Reviews -->
          <div class="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 class="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <i class="fa-solid fa-award text-emerald-500"></i>
                  <span>Human Taste Validation & Community Feedback (${cRec.allReviews.length})</span>
                </h4>
                <p class="text-xs text-slate-500">Real feedback from verified cooks & restaurant patrons</p>
              </div>

              <button 
                type="button" 
                id="open-write-review-btn"
                class="px-4 py-2 rounded-xl text-xs font-bold bg-flame hover:bg-flame-600 text-white shadow-sm flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto"
              >
                <i class="fa-solid fa-pen-to-square"></i>
                <span>Submit Taste Validation Test</span>
              </button>
            </div>

            <!-- Review Submission Form -->
            <div id="write-review-form-container" class="hidden p-5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 space-y-4">
              <h5 class="font-bold text-sm text-slate-900 dark:text-white">Submit Kitchen Validation Test</h5>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Your Name / Title</label>
                  <input type="text" id="review-author" placeholder="e.g. Chef / Home Cook" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:border-flame">
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Kitchen / Restaurant Name & City</label>
                  <input type="text" id="review-cafename" placeholder="e.g. Saffron Bistro, Delhi" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:border-flame">
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Taste Similarity Rating</label>
                <select id="review-rating" class="px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:border-flame">
                  <option value="5">★★★★★ (5 Stars - Taste & Texture 100% Indistinguishable)</option>
                  <option value="4">★★★★☆ (4 Stars - Great Taste with Minor Variation)</option>
                  <option value="3">★★★☆☆ (3 Stars - Acceptable Alternative)</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Cooking Experience & Taste Feedback</label>
                <textarea id="review-text" rows="3" placeholder="How did the alternative perform in your kitchen? Did guests notice any difference in taste or texture?" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:border-flame"></textarea>
              </div>

              <div class="flex items-center gap-2">
                <button type="button" id="submit-review-btn" class="px-4 py-2 rounded-xl text-xs font-bold bg-flame hover:bg-flame-600 text-white cursor-pointer shadow-sm">
                  Publish Validation Test
                </button>
                <button type="button" id="cancel-review-btn" class="px-3 py-2 rounded-xl text-xs font-medium text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer">
                  Cancel
                </button>
              </div>
            </div>

            <!-- Review Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              ${cRec.allReviews.map(rev => `
                <div class="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-sm flex flex-col justify-between">
                  <div>
                    <div class="flex items-center justify-between mb-2">
                      <div>
                        <div class="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>${rev.author}</span>
                          <span class="text-[10px] font-black px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            HTV Verified
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
                      <img src="${rev.photo}" alt="Dish" class="w-full h-full object-cover">
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
      const author = document.getElementById('review-author').value.trim() || 'Verified Cook';
      const cafeName = document.getElementById('review-cafename').value.trim() || 'Home / Bistro Kitchen';
      const rating = parseInt(document.getElementById('review-rating').value, 10) || 5;
      const text = document.getElementById('review-text').value.trim();

      if (!text) {
        alert('Please share your cooking and taste experience.');
        return;
      }

      if (!state.customReviews[recipeId]) {
        state.customReviews[recipeId] = [];
      }

      state.customReviews[recipeId].unshift({
        id: 'htv-' + Date.now(),
        author,
        cafeName,
        rating,
        date: 'Just now',
        verifiedCafe: true,
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
          <p style="margin: 3px 0 0; font-size: 11px;">Covers: ${cRec.persons} Person(s) | HTV Validated</p>
        </div>

        <div style="margin-bottom: 12px;">
          <h3 style="margin: 0; font-size: 16px;">${cRec.title.toUpperCase()}</h3>
          <p style="margin: 2px 0; font-size: 11px;">Category: ${cRec.category} | Prep: ${cRec.prepTime}</p>
          ${cRec.rState.budgetMode ? '<p style="margin: 2px 0; font-weight: bold;">[!] FLAVORSHIFT AI INGREDIENT ALTERNATIVE ACTIVE</p>' : ''}
          ${cRec.rState.calorieMode ? '<p style="margin: 2px 0; font-weight: bold;">[!] LOW-CALORIE FIT BISTRO FORMULA ACTIVE</p>' : ''}
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
      setAmbientVideo(state.ambientVideoEnabled);
    });

    document.getElementById('toggle-video-ambient-btn')?.addEventListener('click', () => {
      setAmbientVideo(!state.ambientVideoEnabled);
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
    setAmbientVideo(state.ambientVideoEnabled);
    updateFavoritesBadge();
    renderPantrySection();
    renderSwapLabView();
    renderExploreView();
    renderHtvView();
    setupEventListeners();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
