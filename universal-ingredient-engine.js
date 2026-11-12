// FlavorShift AI — Universal Ingredient Intelligence Engine
// Comprehensive culinary ontology, functional analysis, and context-aware substitution.

const UniversalIngredientEngine = (function () {
  'use strict';

  // 1. NON-FOOD STOPWORDS & GUARD
  const NON_FOOD_TOKENS = new Set([
    'laptop', 'computer', 'pc', 'macbook', 'phone', 'iphone', 'android', 'smartphone',
    'car', 'vehicle', 'truck', 'bike', 'bicycle', 'motorcycle', 'engine', 'wheel', 'tire',
    'plastic', 'metal', 'iron', 'steel', 'glass', 'stone', 'rock', 'cement', 'concrete',
    'paper', 'cardboard', 'wood', 'table', 'chair', 'furniture', 'couch', 'bed', 'desk',
    'shoes', 'shirt', 'clothes', 'pant', 'shoe', 'hat', 'fabric', 'cotton', 'leather',
    'hammer', 'nail', 'screw', 'wrench', 'tool', 'drill', 'saw', 'knife-blade',
    'petrol', 'diesel', 'fuel', 'gasoline', 'oil-crude', 'kerosene', 'battery',
    'keyboard', 'mouse', 'monitor', 'screen', 'cable', 'wire', 'charger',
    'dog', 'cat', 'elephant', 'tiger', 'pet', 'animal-toy',
    'qwerty', 'qwertyuiop', 'asdfgh', 'asdfghjkl', 'zxcvbnm', 'test', 'blah', 'foobar',
    'random', 'nothing', 'garbage', 'trash', 'poison', 'bleach', 'detergent', 'soap'
  ]);

  function isNonFood(raw) {
    if (!raw || typeof raw !== 'string') return true;
    const clean = raw.trim().toLowerCase().replace(/[^a-z0-9\s]/g, '');
    if (!clean || clean.length < 2) return true;
    if (/^\d+$/.test(clean)) return true; // pure numbers
    if (NON_FOOD_TOKENS.has(clean)) return true;

    // Gibberish check: repeated consonants or no vowels
    if (clean.length >= 4 && !/[aeiouy]/.test(clean)) return true;
    if (/(.)\1{3,}/.test(clean)) return true; // e.g. 'aaaa', 'zzzz'

    const words = clean.split(/\s+/);
    for (const w of words) {
      if (NON_FOOD_TOKENS.has(w)) return true;
    }
    return false;
  }

  // 2. INGREDIENT NORMALIZATION & SYNONYMS MAP
  const SYNONYMS = {
    'dahi': 'yogurt',
    'curd': 'yogurt',
    'hung curd': 'greek yogurt',
    'malai': 'cream',
    'heavy cream': 'fresh cream',
    'whipping cream': 'fresh cream',
    'double cream': 'fresh cream',
    'cottage cheese': 'paneer',
    'tofu': 'tofu',
    'aloo': 'potato',
    'potatoes': 'potato',
    'tamatar': 'tomato',
    'tomatoes': 'tomato',
    'pyaz': 'onion',
    'onions': 'onion',
    'shallots': 'shallot',
    'scallion': 'green onion',
    'scallions': 'green onion',
    'spring onion': 'green onion',
    'mushrooms': 'mushroom',
    'button mushroom': 'mushroom',
    'cremini': 'mushroom',
    'shiitake': 'mushroom',
    'atta': 'wheat flour',
    'maida': 'all-purpose flour',
    'flour': 'all-purpose flour',
    'white flour': 'all-purpose flour',
    'plain flour': 'all-purpose flour',
    'egg': 'eggs',
    'egg white': 'eggs',
    'egg yolk': 'eggs',
    'soya sauce': 'soy sauce',
    'tamari sauce': 'tamari',
    'miso paste': 'miso',
    'tahina': 'tahini',
    'parmigiano': 'parmesan',
    'parmigiano reggiano': 'parmesan',
    'parmesan cheese': 'parmesan',
    'cheddar cheese': 'cheddar',
    'kaju': 'cashew',
    'cashews': 'cashew',
    'badam': 'almond',
    'almonds': 'almond',
    'kesar': 'saffron',
    'haldi': 'turmeric',
    'dalchini': 'cinnamon',
    'elaichi': 'cardamom',
    'jeera': 'cumin',
    'cumin seeds': 'cumin',
    'mirchi': 'chili pepper',
    'chicken breast': 'chicken',
    'chicken thigh': 'chicken',
    'paneer cubes': 'paneer',
    'makkhan': 'butter',
    'table butter': 'butter',
    'unsalted butter': 'butter',
    'salted butter': 'butter',
    'clarified butter': 'ghee',
    'cow milk': 'milk',
    'whole milk': 'milk',
    'full cream milk': 'milk',
    'skimmed milk': 'milk',
    'lemon juice': 'lemon',
    'lime juice': 'lime',
    'baking powder': 'baking powder',
    'baking soda': 'baking soda',
    'dry yeast': 'yeast',
    'instant yeast': 'yeast',
    'cocoa': 'cocoa powder',
    'cacao': 'cocoa powder',
    'sugar': 'white sugar',
    'brown sugar': 'brown sugar',
    'cane sugar': 'white sugar',
    'gur': 'jaggery',
    'gud': 'jaggery',
    'honey': 'honey',
    'maple': 'maple syrup',
    'garlic cloves': 'garlic',
    'lahsun': 'garlic',
    'adrak': 'ginger',
    'ginger root': 'ginger'
  };

  function normalizeName(input) {
    if (!input) return '';
    let name = input.trim().toLowerCase();
    name = name.replace(/^(fresh|raw|organic|pure|whole|sliced|chopped|ground|powdered|dry|dried|crushed|warm|cold)\s+/g, '');
    if (SYNONYMS[name]) return SYNONYMS[name];
    if (name.endsWith('s') && !name.endsWith('ss') && !name.endsWith('us') && !['hummus', 'couscous', 'asparagus'].includes(name)) {
      const singular = name.slice(0, -1);
      if (SYNONYMS[singular]) return SYNONYMS[singular];
    }
    return name;
  }

  // 3. MASTER INGREDIENT ONTOLOGY & FUNCTION PROFILES
  const ONTOLOGY = {
    // --- DAIRY ---
    'milk': {
      name: 'Milk',
      category: 'Dairy & Milks',
      icon: 'fa-solid fa-glass-water',
      functions: ['Moisture', 'Fat', 'Protein', 'Sweetness'],
      flavorProfile: 'Mild, sweet, creamy, neutral',
      textureProfile: 'Light emulsion liquid, low viscosity',
      substitutes: [
        {
          name: 'Soy Milk (Unsweetened)',
          type: 'Best All-Round & Protein Match',
          ratio: '1 cup Milk = 1 cup Soy Milk (1:1)',
          calcMethod: 'Equivalent protein & water content; thermally stable',
          tasteDesc: 'Clean, neutral creamy profile with subtle nutty backdrop.',
          textureDesc: 'Nearly identical body; blends seamlessly in hot drinks and sauces.',
          bestDishes: ['Tea & Chai', 'Baking & Cakes', 'Pasta Sauces', 'Curries'],
          dietary: ['Vegan', 'Dairy-Free', 'Nut-Free'],
          allergens: ['Soy'],
          contextNotes: {
            'Tea & Beverages': 'Froths beautifully and does not split when heated with tea leaves.',
            'Baking & Cakes': 'Provides equal browning and crumb moisture due to matched protein.',
            'Pastas & Sauces': 'Emulsifies with roux without separating or curdling.',
            'Curries & Gravies': 'Creates a light velvety body; add on medium heat.'
          }
        },
        {
          name: 'Oat Milk (Barista Blend)',
          type: 'Best for Beverages & Coffee',
          ratio: '1 cup Milk = 1 cup Oat Milk (1:1)',
          calcMethod: 'Matched oat beta-glucan viscosity for silky mouthfeel',
          tasteDesc: 'Naturally sweet, malty, and velvety.',
          textureDesc: 'Micro-foaming capability with superior heat stability.',
          bestDishes: ['Chai & Specialty Coffee', 'Pancakes & Crepes', 'Smoothies'],
          dietary: ['Vegan', 'Dairy-Free', 'Nut-Free'],
          allergens: ['Gluten (if non-certified)'],
          contextNotes: {
            'Tea & Beverages': 'Top choice for chai and coffee: silky micro-foam with zero curdling.',
            'Baking & Cakes': 'Yields tender, soft crumb with subtle natural sweetness.',
            'Pastas & Sauces': 'Subtle sweetness—season with extra black pepper or garlic to balance.',
            'Curries & Gravies': 'Use unsweetened version to keep curry profiles savory.'
          }
        },
        {
          name: 'Almond Milk (Unsweetened)',
          type: 'Light & Low-Calorie Choice',
          ratio: '1 cup Milk = 1 cup Almond Milk (1:1)',
          calcMethod: 'Matched liquid volume; thinner emulsion',
          tasteDesc: 'Delicate, pleasant nuttiness, low sugar.',
          textureDesc: 'Slightly lighter viscosity than whole dairy milk.',
          bestDishes: ['Smoothies', 'Overnight Oats', 'Baking', 'Light Curries'],
          dietary: ['Vegan', 'Dairy-Free', 'Low-Calorie', 'Keto-Friendly'],
          allergens: ['Tree Nuts'],
          contextNotes: {
            'Tea & Beverages': 'May feather if added to very acidic or boiling tea; temper first.',
            'Baking & Cakes': 'Produces a slightly crisper exterior on muffins and quick breads.',
            'Pastas & Sauces': 'Thinner body—whisk in 1/2 tsp cornstarch for sauce thickness.',
            'Curries & Gravies': 'Nutty notes pair exceptionally well with Mughlai and korma gravies.'
          }
        },
        {
          name: 'Coconut Milk (Culinary Grade)',
          type: 'Rich Body & Creamy Mouthfeel',
          ratio: '1 cup Milk = 3/4 cup Coconut Milk + 1/4 cup Water',
          calcMethod: 'Diluted to match dairy milk fat concentration (whole-milk richness)',
          tasteDesc: 'Luxurious tropical creaminess with gentle coconut aroma.',
          textureDesc: 'Viscous, rich, silky coating power.',
          bestDishes: ['South Indian Curries', 'Thai Soups', 'Tropical Puddings'],
          dietary: ['Vegan', 'Dairy-Free', 'Nut-Free', 'Gluten-Free'],
          allergens: ['None (FDA classifies coconut as tree nut)'],
          contextNotes: {
            'Tea & Beverages': 'Distinct tropical note; delicious in iced chai or matcha latte.',
            'Baking & Cakes': 'Increases crumb tenderness significantly; slightly reduce other added fat.',
            'Pastas & Sauces': 'Pairs well with curry-leaf or spicy tomato-garlic profiles.',
            'Curries & Gravies': 'Authentic match for South Indian, Sri Lankan, and Thai curries.'
          }
        }
      ],
      volatiles: ['delta-lactones (creamy)', 'diacetyl (buttery)', 'maltol (sweet)']
    },

    'butter': {
      name: 'Butter',
      category: 'Fats & Oils',
      icon: 'fa-solid fa-cubes-stacked',
      functions: ['Fat', 'Flavor or aroma', 'Moisture', 'Texture'],
      flavorProfile: 'Rich, sweet-creamy, slightly nutty when browned',
      textureProfile: 'Solid at room temp, melts at body temp (34°C)',
      substitutes: [
        {
          name: 'Ghee (Clarified Butter)',
          type: 'Best High-Heat & Flavor Match',
          ratio: '100g Butter = 80g Ghee + 15ml Water',
          calcMethod: 'Butter is rich dairy fat-water balance; ghee is clarified milkfat',
          tasteDesc: 'Intense nutty, caramelized aroma with rich dairy depth.',
          textureDesc: 'Zero milk solids, 250°C smoke point, perfectly crisp finish.',
          bestDishes: ['Naan & Rotis', 'Dal Tadka', 'Sautéing', 'Baking Cookies'],
          dietary: ['Lactose-Free', 'Keto', 'Vegetarian'],
          allergens: ['Dairy (milk protein trace)'],
          contextNotes: {
            'Breakfast & Breads': 'Golden brush for naan, paratha, or toast with unbeatable fragrance.',
            'Curries & Gravies': 'Superior blooming of whole spices with zero scorching.',
            'Baking & Cakes': 'Produces delightfully flaky pie crusts and nutty shortbread cookies.'
          }
        },
        {
          name: 'Refined Coconut Oil (Neutral)',
          type: 'Best Plant-Based Baking Alternative',
          ratio: '100g Butter = 80g Coconut Oil + 20ml Water / Plant Milk',
          calcMethod: 'Matches solid fat crystal structure at room temperature',
          tasteDesc: 'Neutral profile (refined) with clean finish.',
          textureDesc: 'Firm solid at <24°C, yields crisp flaky bakery doughs.',
          bestDishes: ['Vegan Baking', 'Pie Crusts', 'Sautéing', 'Frostings'],
          dietary: ['Vegan', 'Dairy-Free', 'Gluten-Free'],
          allergens: ['None'],
          contextNotes: {
            'Baking & Cakes': 'Solidifies just like butter for laminated doughs and crusts.',
            'Pastas & Sauces': 'Best combined with olive oil to replicate dairy roundness.'
          }
        },
        {
          name: 'Extra Virgin Olive Oil',
          type: 'Heart-Healthy Mediterranean Match',
          ratio: '100g Butter = 75ml Olive Oil',
          calcMethod: 'Pure oil medium; 3:4 volumetric ratio maintains moisture',
          tasteDesc: 'Fruity, peppery, savory richness with olive undertones.',
          textureDesc: 'Liquid gold, glossy sheen, light coat.',
          bestDishes: ['Pasta Sauces', 'Roasting Vegetables', 'Drizzling & Toppings'],
          dietary: ['Heart-Healthy', 'Vegan', 'Dairy-Free', 'Mediterranean Diet'],
          allergens: ['None'],
          contextNotes: {
            'Pastas & Sauces': 'Superior mouthfeel and classic aroma for Italian pasta coatings.',
            'Curries & Gravies': 'Use mild olive oil to let spice aromas dominate.'
          }
        },
        {
          name: 'Margarine (Plant-Based Table Spread)',
          type: 'Direct Budget Kitchen Substitute',
          ratio: '100g Butter = 100g Margarine (1:1)',
          calcMethod: 'Formulated emulsion with matching rich dairy fat-water balance ratio',
          tasteDesc: 'Slightly saltier, buttery note from botanical flavorings.',
          textureDesc: 'Smooth spreadable fat with rapid melt.',
          bestDishes: ['Everyday Cooking', 'Baking', 'Toasted Breads'],
          dietary: ['Vegetarian', 'Often Dairy-Free (check label)'],
          allergens: ['May contain trace soy'],
          contextNotes: {
            'Baking & Cakes': 'Reliable direct 1:1 drop-in for soft batch cookies and sheet cakes.'
          }
        }
      ],
      volatiles: ['diacetyl (butter)', 'acetoin (creamy)', 'butyric acid (dairy aroma)']
    },

    'fresh cream': {
      name: 'Fresh Cream',
      category: 'Dairy & Milks',
      icon: 'fa-solid fa-jug-detergent',
      functions: ['Fat', 'Moisture', 'Thickening', 'Flavor or aroma'],
      flavorProfile: 'Luscious, rich, velvety, dairy-sweet',
      textureProfile: 'Heavy emulsion, coats the back of a spoon ',
      substitutes: [
        {
          name: 'Soaked Cashew & Warm Milk Puree',
          type: 'Best Taste & Texture Match',
          ratio: '100g Cream = 60g Cashew Paste + 40g Warm Milk',
          calcMethod: 'Cashew oleic fats + milk proteins match heavy cream emulsification',
          tasteDesc: 'Luxurious, buttery sweetness identical to makhani gravies.',
          textureDesc: 'Micro-smooth, high thermal stability (zero curdling risk up to 98°C).',
          bestDishes: ['Dal Makhani', 'Paneer Butter Masala', 'Alfredo Pasta', 'Tomato Soup'],
          dietary: ['Vegetarian', 'Naturally Gluten-Free'],
          allergens: ['Tree Nuts (Cashew)', 'Dairy'],
          contextNotes: {
            'Curries & Gravies': 'Blend soaked cashews ultra-fine; simmer without fear of splitting.',
            'Pastas & Sauces': 'Coat pasta strands evenly without greasy mouth separation.'
          }
        },
        {
          name: 'Whisked Malai & Hung Curd (50/50)',
          type: 'Budget & Household Essential',
          ratio: '100g Cream = 50g Malai + 50g Whisked Curd',
          calcMethod: 'Combines home milkfat with lactic acid curd for glossy sheen',
          tasteDesc: 'Rich dairy sweetness with a subtle refreshing lactic lift.',
          textureDesc: 'Glossy, thick creaminess; best folded in off-flame.',
          bestDishes: ['Indian Curries', 'Tandoori Marinades', 'Korma Gravies'],
          dietary: ['Vegetarian', 'Gluten-Free'],
          allergens: ['Dairy'],
          contextNotes: {
            'Curries & Gravies': 'Turn flame to low before stirring in to retain the gloss.'
          }
        },
        {
          name: 'Coconut Cream (Solidified Top Layer)',
          type: 'Best Plant-Based / Vegan Cream',
          ratio: '100g Cream = 100g Coconut Cream (1:1)',
          calcMethod: 'Matching rich medium-chain emulsion',
          tasteDesc: 'Silky, full-bodied with delicate sweet coconut undertones.',
          textureDesc: 'Dense, whip-stable, thick velvet coat.',
          bestDishes: ['South Indian Gravies', 'Thai Curries', 'Vegan Desserts'],
          dietary: ['Vegan', 'Dairy-Free', 'Gluten-Free'],
          allergens: ['None'],
          contextNotes: {
            'Curries & Gravies': 'Stir in during final 3 minutes for fragrant, velvety sauce.'
          }
        },
        {
          name: 'Silken Tofu & Greek Yogurt Puree',
          type: 'High-Protein & Low-Fat Fit Choice',
          ratio: '100g Cream = 70g Greek Yogurt + 30g Blanched Tofu',
          calcMethod: 'Soy isoflavone emulsion + casein proteins mimic mouthfeel',
          tasteDesc: 'Clean, light savory creaminess without cloying fat.',
          textureDesc: 'Dense velvety paste with zero grease.',
          bestDishes: ['Creamy Salad Dressings', 'Pasta Sauces', 'Fit Gravies'],
          dietary: ['High-Protein', 'Low-Calorie', 'Vegetarian'],
          allergens: ['Soy', 'Dairy'],
          contextNotes: {
            'Pastas & Sauces': 'Warm gently; do not boil aggressively to protect whey protein.'
          }
        }
      ],
      volatiles: ['delta-octalactone', 'acetoin', 'hexanal']
    },

    'paneer': {
      name: 'Paneer',
      category: 'Dairy & Proteins',
      icon: 'fa-solid fa-cheese',
      functions: ['Protein', 'Texture', 'Moisture', 'Fat'],
      flavorProfile: 'Mild, milky, delicate, absorbs surrounding spices',
      textureProfile: 'Firm, spongy, non-melting curd with pleasant chew',
      substitutes: [
        {
          name: 'Firm / Extra-Firm Pressed Tofu',
          type: 'Best Texture & Shape Retention Match',
          ratio: '100g Paneer = 100g Firm Tofu (1:1)',
          calcMethod: 'Matched block density & non-melting curd matrix',
          tasteDesc: 'Clean, neutral soy flavor that deeply absorbs curry sauces and marinades.',
          textureDesc: 'Tender-chewy bite, browns with a crispy exterior in tawa fry.',
          bestDishes: ['Palak Tofu', 'Kadai "Paneer"', 'Tofu Tikka', 'Biryani'],
          dietary: ['Vegan', 'Dairy-Free', 'High-Protein', 'Cholesterol-Free'],
          allergens: ['Soy'],
          contextNotes: {
            'Curries & Gravies': 'Pan-sear first with turmeric and salt for authentic paneer golden crust.',
            'Breakfast & Breads': 'Grate into bhurji or wrap fillings for juicy scramble texture.'
          }
        },
        {
          name: 'Halloumi Cheese',
          type: 'Best Grilling & Searing Alternative',
          ratio: '100g Paneer = 100g Halloumi (1:1)',
          calcMethod: 'High melting point whey curd identical to paneer heat resistance',
          tasteDesc: 'Slightly saltier, rich dairy profile with savory umami finish.',
          textureDesc: 'Squeaky, elastic, deeply golden caramelised crust.',
          bestDishes: ['Tikka Skewers', 'Grilled Wraps', 'Warm Grain Bowls'],
          dietary: ['Vegetarian', 'Gluten-Free', 'High-Calcium'],
          allergens: ['Dairy'],
          contextNotes: {
            'Curries & Gravies': 'Reduce salt in curry gravy since halloumi is naturally brined.'
          }
        },
        {
          name: 'Pressed Whole-Milk Ricotta Salata',
          type: 'Delicate Italian Cheese Match',
          ratio: '100g Paneer = 100g Ricotta Salata or Well-Drained Ricotta',
          calcMethod: 'Equivalent whey-based curd structure with low moisture',
          tasteDesc: 'Milky, nutty, lightly salted finish.',
          textureDesc: 'Firm crumb that holds its shape when cubed or crumbled.',
          bestDishes: ['Salads', 'Filled Pastas', 'Crumbled Curries'],
          dietary: ['Vegetarian', 'Gluten-Free'],
          allergens: ['Dairy'],
          contextNotes: {
            'Baking & Cakes': 'Fantastic in savory pastries and paneer kulcha fillings.'
          }
        }
      ],
      volatiles: ['lactic acid', 'diacetyl', 'butyric esters']
    },

    'parmesan': {
      name: 'Parmesan Cheese (Parmigiano-Reggiano)',
      category: 'Dairy & Cheeses',
      icon: 'fa-solid fa-cheese',
      functions: ['Flavor or aroma', 'Fat', 'Protein', 'Thickening'],
      flavorProfile: 'Intense umami, salty, nutty, crystalline savory punch',
      textureProfile: 'Hard, aged, granular, melts smoothly into sauces',
      substitutes: [
        {
          name: 'Grana Padano',
          type: 'Closest Direct Culinary Sibling',
          ratio: '100g Parmesan = 100g Grana Padano (1:1)',
          calcMethod: 'Identical hard Italian cow-milk cheese manufacturing standard',
          tasteDesc: 'Nearly identical nutty, salty umami profile; slightly milder.',
          textureDesc: 'Fine crystalline grain with identical melt in risotto and pasta.',
          bestDishes: ['Penne Arrabbiata', 'Fettuccine', 'Caesar Salad', 'Risotto'],
          dietary: ['Vegetarian-Friendly (often microbial rennet)', 'Naturally Lactose-Free'],
          allergens: ['Dairy'],
          contextNotes: {
            'Pastas & Sauces': 'Grate finely; melts seamlessly into pasta water emulsions.'
          }
        },
        {
          name: 'Nutritional Yeast & Toasted Cashew Crumble',
          type: 'Best Vegan & Plant-Based Match',
          ratio: '50g Parmesan = 35g Cashews + 15g Nutritional Yeast + pinch Sea Salt',
          calcMethod: 'Glutamic acid in yeast + cashew oleic fats emulate savory umami',
          tasteDesc: 'Deep savory, cheesy, nutty profile with zero dairy.',
          textureDesc: 'Fine golden dust with delicate crunch.',
          bestDishes: ['Vegan Pastas', 'Popcorn', 'Roasted Veggies', 'Salads'],
          dietary: ['Vegan', 'Dairy-Free', 'Gluten-Free', 'High B-Vitamins'],
          allergens: ['Tree Nuts (Cashew)'],
          contextNotes: {
            'Pastas & Sauces': 'Dust over finished plate rather than boiling into sauce.'
          }
        },
        {
          name: 'Pecorino Romano',
          type: 'Bold & Sharp Sheep Milk Alternative',
          ratio: '100g Parmesan = 80g Pecorino Romano',
          calcMethod: 'Higher salt & fatty acid potency allows using slightly less quantity',
          tasteDesc: 'Sharper, tangier, deeply savory sheep milk punch.',
          textureDesc: 'Hard, crumbly, silky melting point.',
          bestDishes: ['Cacio e Pepe', 'Carbonara', 'Tomato Sauces'],
          dietary: ['Lactose-Free (aged)'],
          allergens: ['Dairy (Sheep milk)'],
          contextNotes: {
            'Pastas & Sauces': 'Dial back added recipe salt slightly to account for Pecorino brine.'
          }
        }
      ],
      volatiles: ['glutamate', 'short-chain fatty acids', 'methional']
    },

    // --- PROTEINS ---
    'chicken': {
      name: 'Chicken',
      category: 'Proteins',
      icon: 'fa-solid fa-drumstick-bite',
      functions: ['Protein', 'Texture', 'Flavor or aroma', 'Moisture'],
      flavorProfile: 'Savory, mild, poultry umami, porous spice absorber',
      textureProfile: 'Fibrous muscle fibers, tender-chewy bite',
      substitutes: [
        {
          name: 'Firm Pressed Tofu or Tempeh',
          type: 'Best High-Protein Plant Equivalent',
          ratio: '100g Chicken = 100g Tofu / Tempeh (1:1)',
          calcMethod: 'Matching protein density (18-20g per 100g) and chew',
          tasteDesc: 'Absorbs curry bases, garlic-ginger pastes, and marinades deeply.',
          textureDesc: 'Crisps on the outside, tender core when pan-seared or baked.',
          bestDishes: ['Curries', 'Stir-fries', 'Wraps', 'Skewers'],
          dietary: ['Vegan', 'Plant-Based', 'Zero-Cholesterol'],
          allergens: ['Soy'],
          contextNotes: {
            'Curries & Gravies': 'Press water out before marinating for 15 minutes.'
          }
        },
        {
          name: 'King Oyster or Cremini Mushrooms',
          type: 'Best Umami & Meat-Texture Match',
          ratio: '100g Chicken = 120g Thick-Cut Mushrooms',
          calcMethod: 'Chitin cellular walls mimic chicken muscle fiber resistance',
          tasteDesc: 'Deep earthy umami with savory natural glutamates.',
          textureDesc: 'Meaty, juicy, fibrous resistance to chew.',
          bestDishes: ['Truffle Pasta', 'Stir-Fries', 'Pot Pies', 'Fajitas'],
          dietary: ['Vegan', 'Low-Calorie', 'Fiber-Rich'],
          allergens: ['None'],
          contextNotes: {
            'Pastas & Sauces': 'Sauté hard in brown oil or butter until deeply caramelized.'
          }
        },
        {
          name: 'Cooked Chickpeas (Kabuli Chana)',
          type: 'Whole-Food Pantry Staple',
          ratio: '100g Chicken = 100g Cooked Chickpeas',
          calcMethod: 'Balanced protein-carbohydrate density with sturdy texture',
          tasteDesc: 'Nutty, earthy, comforting savory note.',
          textureDesc: 'Hearty, tender-firm legume bite that does not turn mushy.',
          bestDishes: ['Salad Bowls', 'Curries', 'Wraps', 'Stews'],
          dietary: ['Vegan', 'Gluten-Free', 'High-Fiber'],
          allergens: ['None'],
          contextNotes: {
            'Curries & Gravies': 'Simmer in tomato gravy to let spices penetrate the beans.'
          }
        }
      ],
      volatiles: ['inosine monophosphate', 'pyrazines', 'lipid oxidation aldehydes']
    },

    'eggs': {
      name: 'Eggs',
      category: 'Proteins & Baking',
      icon: 'fa-solid fa-egg',
      functions: ['Binding', 'Moisture', 'Thickening', 'Protein', 'Fat'],
      flavorProfile: 'Rich, savory, sulfurous-buttery, emulsifying',
      textureProfile: 'Coagulates with heat into custard, sponge, or binding gel',
      substitutes: [
        {
          name: 'Flaxseed Egg (Ground Flax + Warm Water)',
          type: 'Best Binding Match for Baking',
          ratio: '1 Large Egg = 1 tbsp Ground Flaxseed + 3 tbsp Warm Water (rest 5 min)',
          calcMethod: 'Flax mucilage gum binds starch molecules with identical tensile strength',
          tasteDesc: 'Pleasant, subtle toasted nutty note in finished baked goods.',
          textureDesc: 'Gel-like viscous binder; creates moist tender crumb.',
          bestDishes: ['Pancakes', 'Muffins', 'Cookies', 'Quick Breads'],
          dietary: ['Vegan', 'Omega-3 Rich', 'Gluten-Free'],
          allergens: ['None'],
          contextNotes: {
            'Baking & Cakes': 'Rest mixture 5 minutes until viscous before folding into batter.'
          }
        },
        {
          name: 'Aquafaba (Chickpea Cooking Liquid)',
          type: 'Best Egg White & Meringue Substitute',
          ratio: '1 Egg White = 2 tbsp Aquafaba; 1 Whole Egg = 3 tbsp Aquafaba',
          calcMethod: 'Albumen-like vegetable proteins whip into stiff foam peaks',
          tasteDesc: 'Completely neutral once baked or whipped with sugar.',
          textureDesc: 'Whips into airy, glossy, stiff meringues and mousses.',
          bestDishes: ['Meringues', 'Macarons', 'Cocktail Foams', 'Soufflés'],
          dietary: ['Vegan', 'Dairy-Free', 'Low-Calorie'],
          allergens: ['None'],
          contextNotes: {
            'Baking & Cakes': 'Whip with 1/8 tsp cream of tartar for razor-sharp peak stability.'
          }
        },
        {
          name: 'Mashed Ripe Banana or Unsweetened Applesauce',
          type: 'Best Moisture & Cake Binder',
          ratio: '1 Egg = 1/4 cup (60g) Mashed Banana or Applesauce',
          calcMethod: 'Pectin and natural fruit sugars hold crumb moisture intact',
          tasteDesc: 'Mild fruit sweetness; banana adds aroma, applesauce is neutral.',
          textureDesc: 'Exceptionally tender, moist, soft bakery texture.',
          bestDishes: ['Brownies', 'Banana Bread', 'Pancakes', 'Waffles'],
          dietary: ['Vegan', 'Fat-Free Fruit Base'],
          allergens: ['None'],
          contextNotes: {
            'Baking & Cakes': 'Reduce refined sugar in recipe by 1 tablespoon if using ripe banana.'
          }
        },
        {
          name: 'Silken Tofu Scramble with Kala Namak',
          type: 'Best Breakfast Egg Scramble Match',
          ratio: '1 Egg = 60g Crumbled Silken Tofu + pinch Kala Namak',
          calcMethod: 'Soy curds match soft curds; Indian black salt supplies natural sulfur note',
          tasteDesc: 'Authentic eggy umami aroma thanks to mineral sulfur in kala namak.',
          textureDesc: 'Soft, creamy curds with tender moisture.',
          bestDishes: ['Breakfast Scrambles', 'Egg-Free Bhurji', 'Breakfast Burritos'],
          dietary: ['Vegan', 'Cholesterol-Free', 'High-Protein'],
          allergens: ['Soy'],
          contextNotes: {
            'Breakfast & Breads': 'Sauté with pinch of turmeric for golden yellow egg colour.'
          }
        }
      ],
      volatiles: ['hydrogen sulfide trace', 'dimethyl sulfide', 'ovalbumin aroma']
    },

    'fish': {
      name: 'Fish',
      category: 'Proteins & Seafood',
      icon: 'fa-solid fa-fish',
      functions: ['Protein', 'Texture', 'Flavor or aroma', 'Moisture'],
      flavorProfile: 'Clean, oceanic, savory, tender umami',
      textureProfile: 'Flaky, delicate protein layers that separate with a fork',
      substitutes: [
        {
          name: 'Hearts of Palm or Banana Blossom',
          type: 'Best Flaky Plant Match',
          ratio: '100g Fish = 100g Shredded Banana Blossom or Hearts of Palm',
          calcMethod: 'Layered cellular grain flakes apart identically to white fish',
          tasteDesc: 'Mild, neutral flavor that absorbs seaweed and lemon seasonings.',
          textureDesc: 'Delicately flaky, tender layered strands.',
          bestDishes: ['Fish & Chips', 'Fish Tacos', 'Kerala Fish-Style Curry'],
          dietary: ['Vegan', 'Low-Calorie', 'Gluten-Free'],
          allergens: ['None'],
          contextNotes: {
            'Curries & Gravies': 'Season with nori flakes and fenugreek for ocean aroma.'
          }
        },
        {
          name: 'Extra-Firm Tofu (Marinated in Kelp & Soy)',
          type: 'Best High-Protein White Fish Match',
          ratio: '100g Fish = 100g Marinated Tofu (1:1)',
          calcMethod: 'Kelp infusion infuses natural oceanic iodine and glutamate',
          tasteDesc: 'Savory with subtle sea saltiness and clean finish.',
          textureDesc: 'Tender block that browns into crispy skin.',
          bestDishes: ['Pan-Seared Cutlets', 'Curries', 'Bakes'],
          dietary: ['Vegan', 'High-Protein'],
          allergens: ['Soy'],
          contextNotes: {
            'Curries & Gravies': 'Press tofu firmly and dust with cornstarch before searing.'
          }
        }
      ],
      volatiles: ['trimethylamine oxide trace', '1-octen-3-ol', 'nonadienal']
    },

    // --- VEGETABLES & AROMATICS ---
    'potato': {
      name: 'Potato',
      category: 'Vegetables & Tubers',
      icon: 'fa-solid fa-bowl-rice',
      functions: ['Thickening', 'Texture', 'Moisture', 'Sweetness'],
      flavorProfile: 'Mild, earthy, comforting, starchy savory baseline',
      textureProfile: 'Dense starch granules that become fluffy or velvety when cooked',
      substitutes: [
        {
          name: 'Sweet Potato (Shakarkandi)',
          type: 'Nutrient-Dense Complex Carb Match',
          ratio: '100g Potato = 100g Sweet Potato (1:1)',
          calcMethod: 'Equivalent tuber starch and moisture density',
          tasteDesc: 'Sweeter, caramelized earthy depth with natural beta-carotene.',
          textureDesc: 'Velvety mash or tender roasted cubes.',
          bestDishes: ['Roasted Hash', 'Curries', 'Mashed Puree', 'Fries'],
          dietary: ['Low-GI', 'Vitamin-A Rich', 'Paleo'],
          allergens: ['None'],
          contextNotes: {
            'Curries & Gravies': 'Add extra pinch of chili powder or amchur to balance sweetness.'
          }
        },
        {
          name: 'Cauliflower Florets',
          type: 'Best Low-Carb / Keto Alternative',
          ratio: '100g Potato = 120g Steamed Cauliflower',
          calcMethod: 'Steamed cellular moisture blends into silky low-starch puree',
          tasteDesc: 'Mild, buttery, slightly nutty vegetable flavor.',
          textureDesc: 'Smooth mash or tender bite without starch heaviness.',
          bestDishes: ['Keto Mash', 'Aloo Gobi Variations', 'Low-Carb Soups'],
          dietary: ['Keto-Friendly', 'Low-Calorie', 'Grain-Free'],
          allergens: ['None'],
          contextNotes: {
            'Curries & Gravies': 'Sauté florets until edges turn golden before braising.'
          }
        },
        {
          name: 'Raw Green Plantain / Raw Banana',
          type: 'Traditional Indian Savory Starch Match',
          ratio: '100g Potato = 100g Green Plantain (1:1)',
          calcMethod: 'Resistant starch profile mimics potato chew without sugar spike',
          tasteDesc: 'Completely savory, mild, earthy, absorbs spicy masalas.',
          textureDesc: 'Firm, dense, holds shape perfectly during long boiling.',
          bestDishes: ['South Indian Curries', 'Dry Sabzis', 'Cutlets'],
          dietary: ['Fasting / Vrat-Friendly', 'Resistant Starch', 'Low-GI'],
          allergens: ['None'],
          contextNotes: {
            'Curries & Gravies': 'Boil with salt and turmeric before tossing in tadka.'
          }
        }
      ],
      volatiles: ['methional', '2-isobutyl-3-methoxypyrazine', 'alkylpyrazines']
    },

    'tomato': {
      name: 'Tomato',
      category: 'Vegetables & Acids',
      icon: 'fa-solid fa-apple-whole',
      functions: ['Acidity', 'Moisture', 'Sweetness', 'Thickening', 'Flavor or aroma'],
      flavorProfile: 'Bright, sweet-tart, umami-rich (natural glutamates)',
      textureProfile: 'Juicy pulp, gelled seed pockets, purees into thick gravy base',
      substitutes: [
        {
          name: 'Tomato Paste + Water (Diluted 1:4)',
          type: 'Best Deep Umami & Gravy Base',
          ratio: '1 Fresh Tomato (100g) = 1 tbsp Tomato Paste + 3 tbsp Water',
          calcMethod: 'Reconstitutes concentrated tomato solids and natural acidity',
          tasteDesc: 'Richer caramelized umami with balanced fruit tartness.',
          textureDesc: 'Velvety, smooth sauce coat without tomato skins.',
          bestDishes: ['Penne Arrabbiata', 'Curry Bases', 'Soups', 'Stews'],
          dietary: ['Vegan', 'Gluten-Free'],
          allergens: ['None'],
          contextNotes: {
            'Curries & Gravies': 'Fry paste in oil with ginger-garlic for 2 minutes to cook off raw tin taste.'
          }
        },
        {
          name: 'Tamarind Paste + Pinch Jaggery',
          type: 'Authentic Sour & Umami Balancer',
          ratio: '100g Tomato = 1 tsp Tamarind Paste + 1/2 tsp Jaggery + 4 tbsp Water',
          calcMethod: 'Tartaric acid matches citric/malic tomato acidity profile',
          tasteDesc: 'Tangy, complex, fruity sweet-sour depth.',
          textureDesc: 'Liquid tart base; add 1 tsp roasted besan or yogurt for body.',
          bestDishes: ['Sambar', 'Rasam', 'Lentil Curries', 'Fish Curries'],
          dietary: ['Vegan', 'Natural Whole Fruit Acid'],
          allergens: ['None'],
          contextNotes: {
            'Curries & Gravies': 'Classic replacement in South Indian cooking when tomatoes are scarce.'
          }
        },
        {
          name: 'Whisked Yogurt / Curd + Kashmiri Chili',
          type: 'Royal Mughlai Creamy Acid Base',
          ratio: '100g Tomato = 3 tbsp Whisked Curd + 1/2 tsp Kashmiri Chili',
          calcMethod: 'Lactic acid provides the required sour lift while chili mimics color',
          tasteDesc: 'Tangy, smooth dairy richness with vibrant red tint.',
          textureDesc: 'Thick, creamy restaurant-grade gravy body.',
          bestDishes: ['Paneer Gravies', 'Kormas', 'Dal Tadka'],
          dietary: ['Vegetarian', 'Lacto-Acid'],
          allergens: ['Dairy'],
          contextNotes: {
            'Curries & Gravies': 'Whisk with 1 tsp gram flour (besan) before heating to prevent split.'
          }
        }
      ],
      volatiles: ['(Z)-3-hexenal (fresh green)', 'beta-ionone', 'citric acid']
    },

    'onion': {
      name: 'Onion',
      category: 'Vegetables & Aromatics',
      icon: 'fa-solid fa-seedling',
      functions: ['Flavor or aroma', 'Sweetness', 'Thickening', 'Moisture'],
      flavorProfile: 'Sharp, pungent when raw; sweet, deeply savory when caramelized',
      textureProfile: 'Crisp layered flesh, softens into melting sweetness or thick gravy paste',
      substitutes: [
        {
          name: 'Shallots or Leeks',
          type: 'Closest Allium Sibling',
          ratio: '1 Onion = 3 Shallots or 1 Leek white stem (1:1)',
          calcMethod: 'Identical allicin precursors and sweet fructan sugars',
          tasteDesc: 'Sweeter, delicate, refined onion aroma with subtle garlic hint.',
          textureDesc: 'Melts rapidly in butter or oil without stringy residue.',
          bestDishes: ['Risotto', 'French Sauces', 'Curry Tadkas', 'Stir-Fries'],
          dietary: ['Vegan', 'Natural Allium'],
          allergens: ['None'],
          contextNotes: {
            'Pastas & Sauces': 'Finely mince; caramelizes twice as fast as large onions.'
          }
        },
        {
          name: 'Hing (Asafoetida) in Oil',
          type: 'Authentic Jain & Allium-Free Match',
          ratio: '1 Onion = 1/4 tsp Hing bloomed in warm oil/ghee',
          calcMethod: 'Sulfur terpenes release identical savory aroma compounds to cooked allium',
          tasteDesc: 'Deep savory, pungent aroma that rounds out curries and dals.',
          textureDesc: 'Aromatics only; combine with tomato puree or curd for gravy volume.',
          bestDishes: ['Dal Tadka', 'Sambar', 'Jain Curries', 'Kadhi'],
          dietary: ['Jain-Friendly', 'Sattvic', 'Vegan'],
          allergens: ['May contain trace wheat if compounded with flour'],
          contextNotes: {
            'Curries & Gravies': 'Bloom directly in hot ghee/oil at the start of cooking.'
          }
        },
        {
          name: 'Onion Powder (Pure Dehydrated)',
          type: 'Pantry Essential & Quick Binder',
          ratio: '1 Medium Onion = 1 tbsp Onion Powder',
          calcMethod: 'Concentrated dehydrated allium fructans and essential oils',
          tasteDesc: 'Consistent, sweet, roasted onion depth.',
          textureDesc: 'Dissolves cleanly into sauces without vegetable chunks.',
          bestDishes: ['Dry Rubs', 'Smooth Sauces', 'Marinades', 'Batters'],
          dietary: ['Vegan', 'Gluten-Free'],
          allergens: ['None'],
          contextNotes: {
            'Baking & Cakes': 'Excellent in savory scones, biscuits, and focaccia doughs.'
          }
        }
      ],
      volatiles: ['dipropyl disulfide', 'allyl propyl disulfide', 'sulfur pyrazines']
    },

    'mushroom': {
      name: 'Mushroom',
      category: 'Vegetables & Fungi',
      icon: 'fa-solid fa-tree',
      functions: ['Flavor or aroma', 'Texture', 'Moisture', 'Protein'],
      flavorProfile: 'Earthy, woody, rich savory umami (natural glutamates & guanylate)',
      textureProfile: 'Spongy cellular chitin, becomes meaty and juicy when seared',
      substitutes: [
        {
          name: 'Eggplant / Aubergine Cubes',
          type: 'Best Vegetable Texture Match',
          ratio: '100g Mushroom = 100g Eggplant Cubes (1:1)',
          calcMethod: 'Spongy cellular matrix absorbs fats and juices identically',
          tasteDesc: 'Tender, savory, melts into sauces while retaining a fleshy bite.',
          textureDesc: 'Meaty, silky, rich mouthfeel.',
          bestDishes: ['Pasta Sauces', 'Curries', 'Stir-Fries', 'Bakes'],
          dietary: ['Vegan', 'Low-Calorie', 'Nightshade'],
          allergens: ['None'],
          contextNotes: {
            'Pastas & Sauces': 'Salt cubes for 10 minutes, pat dry, then brown deeply in olive oil.'
          }
        },
        {
          name: 'Zucchini / Courgette Chunks',
          type: 'Light & Tender Green Match',
          ratio: '100g Mushroom = 100g Zucchini Chunks (1:1)',
          calcMethod: 'Comparable water content and tender-crisp cooking time',
          tasteDesc: 'Mild, sweet, vegetable freshness.',
          textureDesc: 'Soft succulent bite without collapsing.',
          bestDishes: ['Stir-Fries', 'Pasta Primavera', 'Skillet Hash'],
          dietary: ['Vegan', 'Keto-Friendly'],
          allergens: ['None'],
          contextNotes: {
            'Pastas & Sauces': 'Add 1/2 tsp soy sauce to restore the missing savory mushroom umami.'
          }
        },
        {
          name: 'Dried Porcini Broth or Soy/Tamari Glaze',
          type: 'Concentrated Umami Enhancer',
          ratio: '100g Fresh Mushrooms = 1 tbsp Porcini Broth + 1 tsp Soy Sauce',
          calcMethod: 'Provides identical glutamate + guanylate umami synergy',
          tasteDesc: 'Intense forest umami, savory depth, rich lingering savor.',
          textureDesc: 'Liquid seasoning layer.',
          bestDishes: ['Risotto', 'Gravies', 'Soups', 'Marinades'],
          dietary: ['Vegan', 'Dairy-Free'],
          allergens: ['Soy (if using soy sauce)'],
          contextNotes: {
            'Curries & Gravies': 'Stir into gravy during deglazing step for authentic depth.'
          }
        }
      ],
      volatiles: ['1-octen-3-ol (mushroom alcohol)', 'glutamate', 'guanosine monophosphate']
    },

    // --- FRUITS ---
    'mango': {
      name: 'Mango',
      category: 'Fruits',
      icon: 'fa-solid fa-lemon',
      functions: ['Sweetness', 'Acidity', 'Moisture', 'Flavor or aroma', 'Texture'],
      flavorProfile: 'Tropical, lush, fragrant, sweet-tangy with piney/floral nuances',
      textureProfile: 'Juicy, fibrous or silky smooth flesh when pureed',
      substitutes: [
        {
          name: 'Ripe Peaches or Nectarines',
          type: 'Best Stone Fruit Floral Match',
          ratio: '100g Mango = 100g Sliced Peach (1:1)',
          calcMethod: 'Matching stone fruit lactones and balance of fructose to malic acid',
          tasteDesc: 'Sweet, floral, juicy with gentle tartness.',
          textureDesc: 'Silky, succulent flesh, purees into glossy coulis.',
          bestDishes: ['Smoothies', 'Fruit Salads', 'Lassi', 'Tarts'],
          dietary: ['Vegan', 'Whole Fruit'],
          allergens: ['None'],
          contextNotes: {
            'Baking & Cakes': 'Toss with 1 tsp lemon juice to mimic tropical mango sharpness.'
          }
        },
        {
          name: 'Sweet Pineapple + Splash of Orange Juice',
          type: 'Best Tropical Tang Match',
          ratio: '100g Mango = 80g Crushed Pineapple + 20ml Orange Juice',
          calcMethod: 'Replicates tropical ester profile and juicy acidity',
          tasteDesc: 'Vibrant, tropical, sunny and bright.',
          textureDesc: 'Fibrous, juicy, luscious bite.',
          bestDishes: ['Salsas', 'Smoothies', 'Chutneys', 'Tropical Desserts'],
          dietary: ['Vegan', 'Gluten-Free'],
          allergens: ['None'],
          contextNotes: {
            'Salads & Dressings': 'Outstanding substitution in mango salsa for tacos and wraps.'
          }
        },
        {
          name: 'Amchur (Dry Mango Powder)',
          type: 'Savory & Cooking Acid Match',
          ratio: '1 Raw Green Mango = 1 tbsp Amchur Powder',
          calcMethod: 'Concentrated sun-dried green mango citric acid',
          tasteDesc: 'Tangy, tart, sour-fruity with zero added liquid.',
          textureDesc: 'Fine powder that dissolves instantly.',
          bestDishes: ['Chole Masala', 'Chaat', 'Aloo Paratha Fillings'],
          dietary: ['Vegan', 'Pure Spice'],
          allergens: ['None'],
          contextNotes: {
            'Curries & Gravies': 'Add at the end of cooking to preserve bright tart punch.'
          }
        }
      ],
      volatiles: ['terpinolene', 'myrcene (piney)', 'gamma-octalactone (fruity peach)']
    },

    'avocado': {
      name: 'Avocado (Hass)',
      category: 'Fruits & Healthy Fats',
      icon: 'fa-solid fa-lemon',
      functions: ['Fat', 'Moisture', 'Texture', 'Thickening'],
      flavorProfile: 'Mild, nutty, buttery, savory fruit creaminess',
      textureProfile: 'Dense, fatty, spreadable emulsion with zero stringiness',
      substitutes: [
        {
          name: '50/50 Sweet Green Pea & Edamame Mash',
          type: 'Best Taste & Texture Match',
          ratio: '1 Avocado = 1/2 cup Steamed Sweet Peas + 1/2 cup Edamame + 1 tsp Olive Oil + Lemon',
          calcMethod: 'Pea sweetness + edamame protein body + monounsaturated oil emulation',
          tasteDesc: 'Fresh, buttery, savory garden bite with bright green finish.',
          textureDesc: 'Dense rustic mash that stays bright green for 24 hours without browning.',
          bestDishes: ['Avocado Toast', 'Guacamole', 'Green Salad Bowls', 'Wraps'],
          dietary: ['Vegan', 'High-Protein', 'Low-Calorie'],
          allergens: ['Soy (edamame)'],
          contextNotes: {
            'Breakfast & Breads': 'Add lime juice and extra virgin olive oil for identical mouthfeel.'
          }
        },
        {
          name: 'Silken Tofu & Lime Puree',
          type: 'High-Protein Velvet Crema',
          ratio: '1 Avocado = 100g Silken Tofu + 1 tbsp Lime Juice + 1 tbsp Olive Oil',
          calcMethod: 'Smooth plant emulsion mimicking creamy mashed avocado consistency',
          tasteDesc: 'Clean, neutral savory cream with zesty lime lift.',
          textureDesc: 'Ultra-smooth, spreadable crema.',
          bestDishes: ['Sandwich Spreads', 'Dip Platters', 'Wraps'],
          dietary: ['Vegan', 'Low-Fat', 'High-Protein'],
          allergens: ['Soy'],
          contextNotes: {
            'Breakfast & Breads': 'Season with flaked sea salt and crushed chili flakes.'
          }
        }
      ],
      volatiles: ['(E)-2-hexenal', 'sesquiterpenes', 'oleic acid esters']
    },

    'banana': {
      name: 'Banana',
      category: 'Fruits',
      icon: 'fa-solid fa-lemon',
      functions: ['Sweetness', 'Moisture', 'Binding', 'Thickening', 'Flavor or aroma'],
      flavorProfile: 'Sweet, creamy, tropical, distinct isoamyl acetate fruitiness',
      textureProfile: 'Soft, dense starch-sugar paste; thickens blends effortlessly',
      substitutes: [
        {
          name: 'Unsweetened Applesauce',
          type: 'Best Neutral Baking & Moisture Binder',
          ratio: '1 Medium Banana = 1/2 cup (120g) Applesauce',
          calcMethod: 'Pectin polysaccharides provide identical crumb moisture without banana aroma',
          tasteDesc: 'Mild, clean sweetness that lets other flavours shine.',
          textureDesc: 'Soft, tender, moist cake crumb.',
          bestDishes: ['Muffins', 'Pancakes', 'Quick Breads', 'Oatmeal'],
          dietary: ['Vegan', 'Fat-Free', 'Gluten-Free'],
          allergens: ['None'],
          contextNotes: {
            'Baking & Cakes': 'Best choice when you want banana moisture without the strong banana flavor.'
          }
        },
        {
          name: 'Frozen Mango or Papaya Chunks',
          type: 'Best Smoothie Thickener',
          ratio: '1 Banana = 1 cup Frozen Mango / Papaya Chunks',
          calcMethod: 'Dense pectin and insoluble fiber recreate thick frosty mouthfeel',
          tasteDesc: 'Vibrant, tropical, sunny sweetness.',
          textureDesc: 'Thick, creamy, spoonable smoothie bowl consistency.',
          bestDishes: ['Smoothie Bowls', 'Fruit Shakes', 'Popsicles'],
          dietary: ['Vegan', 'Vitamin-C Rich'],
          allergens: ['None'],
          contextNotes: {
            'Tea & Beverages': 'Creates frosty milkshake thickness without dairy or banana.'
          }
        }
      ],
      volatiles: ['isoamyl acetate (banana ester)', 'eugenol', 'isobutyl acetate']
    },

    'lemon': {
      name: 'Lemon',
      category: 'Fruits & Acids',
      icon: 'fa-solid fa-lemon',
      functions: ['Acidity', 'Flavor or aroma', 'Sweetness'],
      flavorProfile: 'Bright, sharply acidic (citric acid), fragrant citrus peel oils',
      textureProfile: 'Free-flowing juice, low viscosity, high penetrating power',
      substitutes: [
        {
          name: 'Fresh Lime Juice',
          type: 'Closest Direct Citrus Match',
          ratio: '1 tbsp Lemon Juice = 1 tbsp Lime Juice (1:1)',
          calcMethod: 'Identical tart citric acidity',
          tasteDesc: 'Bright, zesty, slightly more aromatic and herbaceous.',
          textureDesc: 'Identical clean liquid acidity.',
          bestDishes: ['Chaat', 'Dressings', 'Poha', 'Marinades', 'Beverages'],
          dietary: ['Vegan', 'Keto', 'Raw'],
          allergens: ['None'],
          contextNotes: {
            'Breakfast & Breads': 'Squeeze over fresh Poha or wraps just before serving.'
          }
        },
        {
          name: 'Apple Cider Vinegar (Raw)',
          type: 'Best Vinegar Match for Cooking & Baking',
          ratio: '1 tbsp Lemon Juice = 3/4 tbsp Apple Cider Vinegar',
          calcMethod: 'Acetic acid + fruity malic notes emulate citrus acidity in recipes',
          tasteDesc: 'Tangy, crisp, fruity sourness.',
          textureDesc: 'Liquid acid.',
          bestDishes: ['Salad Dressings', 'Marinades', 'Vegan Buttermilk', 'Baking Activation'],
          dietary: ['Vegan', 'Probiotic (raw)'],
          allergens: ['None'],
          contextNotes: {
            'Baking & Cakes': 'Activates baking soda identically to lemon juice for fluffy rise.'
          }
        },
        {
          name: 'Amchur (Dry Mango Powder) + Water',
          type: 'Authentic Indian Dry Acid Match',
          ratio: '1 tbsp Lemon Juice = 1/2 tsp Amchur dissolved in 1 tbsp Warm Water',
          calcMethod: 'Natural citric and tartaric acids provide instant tart lift',
          tasteDesc: 'Pleasant, earthy, fruity sour tang.',
          textureDesc: 'Liquid acid wash.',
          bestDishes: ['Dry Sabzis', 'Samosa Fillings', 'Lentil Tadkas'],
          dietary: ['Vegan', 'Pure Spice'],
          allergens: ['None'],
          contextNotes: {
            'Curries & Gravies': 'Does not dilute dry bhurji or vegetable fillings.'
          }
        }
      ],
      volatiles: ['limonene (citrus oil)', 'citral', 'gamma-terpinene', 'citric acid']
    },

    // --- SPICES ---
    'saffron': {
      name: 'Saffron (Kesar)',
      category: 'Spices & Aromatics',
      icon: 'fa-solid fa-spa',
      functions: ['Flavor or aroma', 'Sweetness'],
      flavorProfile: 'Floral, honey-like, bittersweet, metallic-earthy, royal aroma',
      textureProfile: 'Delicate dried stigmas that release deep golden-crimson crocin pigment',
      substitutes: [
        {
          name: 'Turmeric + Pinch Sweet Paprika + Dash Cardamom',
          type: 'Best Color & Warmth Emulation',
          ratio: 'Pinch Saffron = 1/4 tsp Turmeric + pinch Sweet Paprika + 1 crushed Cardamom',
          calcMethod: 'Turmeric curcumin provides gold color; cardamom provides floral top note',
          tasteDesc: 'Warm, golden, delicate sweet aroma with vibrant yellow hue.',
          textureDesc: 'Dissolves cleanly into milk or biryani rice.',
          bestDishes: ['Biryani', 'Kheer / Rice Pudding', 'Pulao', 'Kesar Chai'],
          dietary: ['Vegan', 'Ayurvedic Anti-Inflammatory'],
          allergens: ['None'],
          contextNotes: {
            'Curries & Gravies': 'Add sparingly to avoid overwhelming turmeric taste.'
          }
        },
        {
          name: 'Safflower (Carthamus tinctorius / False Saffron)',
          type: 'Traditional Culinary Colorant',
          ratio: '1 pinch Saffron = 1 pinch Safflower petals',
          calcMethod: 'Natural carthamin flavonoids produce identical rich sunset yellow',
          tasteDesc: 'Earthy, very subtle floral aroma.',
          textureDesc: 'Infuses into warm milk or stocks identically.',
          bestDishes: ['Rice Dishes', 'Broths', 'Traditional Sweets'],
          dietary: ['Vegan', 'Botanical Petal'],
          allergens: ['None'],
          contextNotes: {
            'Beverages & Tea': 'Steep petals in warm milk for 10 minutes for golden infusion.'
          }
        }
      ],
      volatiles: ['safranal (saffron aroma)', 'crocin (yellow pigment)', 'picrocrocin']
    },

    'turmeric': {
      name: 'Turmeric (Haldi)',
      category: 'Spices & Aromatics',
      icon: 'fa-solid fa-wand-magic-sparkles',
      functions: ['Flavor or aroma', 'Acidity'],
      flavorProfile: 'Earthy, woody, warm, slightly bitter, peppery baseline',
      textureProfile: 'Fine golden-yellow root powder; staining lipid-soluble pigment',
      substitutes: [
        {
          name: 'Dry Ground Ginger + Pinch Yellow Mustard Powder',
          type: 'Best Warmth & Earthy Bite Match',
          ratio: '1 tsp Turmeric = 1/2 tsp Ground Ginger + 1/4 tsp Mustard Powder',
          calcMethod: 'Zingiberaceae family roots share gingerol and pungent warmth',
          tasteDesc: 'Warm, peppery, aromatic earthy undertone.',
          textureDesc: 'Fine powder spice blend.',
          bestDishes: ['Curries', 'Dal Tadka', 'Marinades', 'Vegetable Saute'],
          dietary: ['Vegan', 'Gluten-Free'],
          allergens: ['Mustard'],
          contextNotes: {
            'Curries & Gravies': 'Add pinch of paprika if visual golden hue is desired.'
          }
        },
        {
          name: 'Fresh Grated Turmeric Root',
          type: 'Farm-Fresh Culinary Upgrade',
          ratio: '1 tsp Ground Turmeric = 1 tbsp Freshly Grated Turmeric Root',
          calcMethod: 'Retains essential volatile oils (turmerone) lost in drying',
          tasteDesc: 'Bright, peppery, citrusy and fresh earthy fragrance.',
          textureDesc: 'Juicy, fine grated root shreds.',
          bestDishes: ['Golden Milk', 'Curry Pastes', 'Tadka', 'Pickles'],
          dietary: ['Raw', 'Vegan', 'Superfood'],
          allergens: ['None'],
          contextNotes: {
            'Curries & Gravies': 'Sauté with minced ginger and garlic right in the hot oil.'
          }
        }
      ],
      volatiles: ['curcumin', 'turmerone', 'ar-turmerone', 'zingiberene']
    },

    'cinnamon': {
      name: 'Cinnamon (Dalchini)',
      category: 'Spices & Aromatics',
      icon: 'fa-solid fa-tree',
      functions: ['Flavor or aroma', 'Sweetness'],
      flavorProfile: 'Sweet, woody, pungent, warm, tingling spicy-sweetness',
      textureProfile: 'Quilled tree bark; fine aromatic brown powder',
      substitutes: [
        {
          name: 'Ground Nutmeg & Ground Allspice (50/50)',
          type: 'Best Sweet-Savory Warmth Match',
          ratio: '1 tsp Cinnamon = 1/2 tsp Nutmeg + 1/2 tsp Allspice',
          calcMethod: 'Shares cinnamaldehyde and eugenol warming essential oil markers',
          tasteDesc: 'Intensely fragrant, sweet, spiced woody aroma.',
          textureDesc: 'Fine ground spice powder.',
          bestDishes: ['Baking & Cakes', 'Chai & Coffee', 'Curries & Biryanis'],
          dietary: ['Vegan', 'Gluten-Free'],
          allergens: ['None'],
          contextNotes: {
            'Baking & Cakes': 'Use slightly less since nutmeg is highly potent.'
          }
        },
        {
          name: 'Cardamom & Cloves (Ground)',
          type: 'Authentic Indian Garam Masala Profile',
          ratio: '1 tsp Cinnamon = 1/2 tsp Green Cardamom + 1/4 tsp Ground Cloves',
          calcMethod: 'Eugenol in cloves matches cinnamon warmth; cardamom adds sweet lift',
          tasteDesc: 'Rich, royal aromatic warmth.',
          textureDesc: 'Ground spice mix.',
          bestDishes: ['Karak Chai', 'Biryani', 'Makhani Gravies'],
          dietary: ['Vegan', 'Gluten-Free'],
          allergens: ['None'],
          contextNotes: {
            'Tea & Beverages': 'Simmer with tea leaves for comforting fragrance.'
          }
        }
      ],
      volatiles: ['cinnamaldehyde', 'eugenol', 'linalool']
    },

    'cardamom': {
      name: 'Cardamom (Elaichi)',
      category: 'Spices & Aromatics',
      icon: 'fa-solid fa-seedling',
      functions: ['Flavor or aroma', 'Sweetness'],
      flavorProfile: 'Intensely fragrant, citrusy, herbal, sweet minty-resinous aroma',
      textureProfile: 'Fragile green pods enclosing oily black aromatic seeds',
      substitutes: [
        {
          name: 'Cinnamon + Ground Nutmeg + Dash Ginger',
          type: 'Best Sweet Spiced Aroma Match',
          ratio: '1 tsp Ground Cardamom = 1/2 tsp Cinnamon + 1/4 tsp Nutmeg + 1/4 tsp Ginger',
          calcMethod: 'Combines eugenol, sabinene, and zingiberene for sweet herbal warmth',
          tasteDesc: 'Sweet, complex spicy perfume that lifts doughs and beverages.',
          textureDesc: 'Fine brown spice blend.',
          bestDishes: ['Karak Chai', 'Tiramisu', 'Kheer / Puddings', 'Bakery'],
          dietary: ['Vegan', 'Gluten-Free'],
          allergens: ['None'],
          contextNotes: {
            'Tea & Beverages': 'Crush together and simmer in milk base for 4 minutes.'
          }
        },
        {
          name: 'Crushed Coriander Seeds + Orange Zest',
          type: 'Citrusy Herbal Top Note Match',
          ratio: '1 tsp Cardamom = 1/2 tsp Ground Coriander + 1/4 tsp Fresh Orange Zest',
          calcMethod: 'Linalool in coriander seeds matches cardamom citrus-floral essence',
          tasteDesc: 'Bright, citrus-floral, herbal and fragrant.',
          textureDesc: 'Fine ground seed and zest.',
          bestDishes: ['Marinades', 'Savory Curries', 'Pastries'],
          dietary: ['Vegan', 'Gluten-Free'],
          allergens: ['None'],
          contextNotes: {
            'Curries & Gravies': 'Adds sophisticated citrus aroma without sour liquid.'
          }
        }
      ],
      volatiles: ['1,8-cineole (eucalyptol)', 'alpha-terpinyl acetate', 'linalool']
    },

    // --- SAUCES & CONDIMENTS ---
    'soy sauce': {
      name: 'Soy Sauce',
      category: 'Sauces & Ferments',
      icon: 'fa-solid fa-bottle-droplet',
      functions: ['Flavor or aroma', 'Acidity', 'Moisture'],
      flavorProfile: 'Intense salty umami, fermented depth, savory roasted bean aroma',
      textureProfile: 'Dark thin liquid, easily coats wok ingredients and noodles',
      substitutes: [
        {
          name: 'Tamari (Gluten-Free Soy Sauce)',
          type: 'Closest Direct Match & Gluten-Free',
          ratio: '1 tbsp Soy Sauce = 1 tbsp Tamari (1:1)',
          calcMethod: 'Brewed with whole soybeans (no wheat); richer natural glutamates',
          tasteDesc: 'Deep, rich, smooth umami with slightly less salt bite.',
          textureDesc: 'Slightly thicker body that glazes noodles beautifully.',
          bestDishes: ['Wok Noodles', 'Stir-Fries', 'Marinades', 'Sushi'],
          dietary: ['Gluten-Free', 'Vegan'],
          allergens: ['Soy'],
          contextNotes: {
            'Stir-fry & Wok': 'Pour around hot wok rim for instant smoky caramelization.'
          }
        },
        {
          name: 'Coconut Aminos',
          type: 'Best Soy-Free & Low-Sodium Alternative',
          ratio: '1 tbsp Soy Sauce = 1 tbsp Coconut Aminos + pinch Salt',
          calcMethod: 'Aged fermented coconut sap naturally provides savory amino acids',
          tasteDesc: 'Slightly sweeter, gentle savory umami with zero soy.',
          textureDesc: 'Liquid condiment.',
          bestDishes: ['Paleo Bowls', 'Stir-Fries', 'Dressings', 'Marinades'],
          dietary: ['Soy-Free', 'Gluten-Free', 'Vegan', 'Paleo', 'Lower Sodium'],
          allergens: ['None'],
          contextNotes: {
            'Salads & Dressings': 'Outstanding base for sesame dressings without sodium burn.'
          }
        },
        {
          name: 'Miso Paste Whisked in Warm Water',
          type: 'Fermented Umami Powerhouse',
          ratio: '1 tbsp Soy Sauce = 1 tsp White/Red Miso + 2 tsp Warm Water',
          calcMethod: 'Koji fermented bean culture matches savory glutamate depth',
          tasteDesc: 'Savory, complex, nutty, salty with roasted aroma.',
          textureDesc: 'Slightly thicker emulsion.',
          bestDishes: ['Broths', 'Glazes', 'Stir-Fry Sauces'],
          dietary: ['Vegan', 'Probiotic'],
          allergens: ['Soy'],
          contextNotes: {
            'Soups & Broths': 'Dissolve off-flame to protect delicate probiotic cultures.'
          }
        }
      ],
      volatiles: ['4-hydroxy-2,5-dimethyl-3(2H)-furanone', 'guaiacol', 'isovaleric acid']
    },

    'miso': {
      name: 'Miso Paste',
      category: 'Sauces & Ferments',
      icon: 'fa-solid fa-bowl-food',
      functions: ['Flavor or aroma', 'Thickening', 'Protein'],
      flavorProfile: 'Deep umami, salty, earthy, fermented sweet-savory savor',
      textureProfile: 'Thick smooth paste made from koji-fermented soybeans and rice',
      substitutes: [
        {
          name: 'Soy Sauce or Tamari + Pinch Tahini',
          type: 'Best Quick Pantry Match',
          ratio: '1 tbsp Miso = 2 tsp Soy Sauce + 1 tsp Tahini or Sesame Paste',
          calcMethod: 'Soy sauce delivers fermented glutamates; tahini provides creamy paste body',
          tasteDesc: 'Salty, savory, nutty and rich.',
          textureDesc: 'Thick paste that dissolves smoothly into hot water or marinades.',
          bestDishes: ['Miso Ramen Broths', 'Glazes', 'Dressings', 'Soups'],
          dietary: ['Vegan', 'Dairy-Free'],
          allergens: ['Soy', 'Sesame'],
          contextNotes: {
            'Soups & Broths': 'Whisk thoroughly in a small bowl with 2 tbsp warm broth first.'
          }
        },
        {
          name: 'Nutritional Yeast + Salt + Warm Water Paste',
          type: 'Soy-Free Umami Alternative',
          ratio: '1 tbsp Miso = 1 tbsp Nutritional Yeast + 1/4 tsp Salt + 1 tbsp Warm Water',
          calcMethod: 'Free glutamic acid mimics savory fermented koji profile',
          tasteDesc: 'Deep savory, slightly nutty and cheesy.',
          textureDesc: 'Smooth yellow paste.',
          bestDishes: ['Dressings', 'Soups', 'Bakes'],
          dietary: ['Soy-Free', 'Vegan', 'Gluten-Free'],
          allergens: ['None'],
          contextNotes: {
            'Salads & Dressings': 'Blends effortlessly with vinegar and olive oil.'
          }
        }
      ],
      volatiles: ['methionol', '4-hydroxy-5-methyl-3-furanone', 'ethyl butyrate']
    },

    'tahini': {
      name: 'Tahini (Sesame Paste)',
      category: 'Sauces & Seeds',
      icon: 'fa-solid fa-mortar-pestle',
      functions: ['Fat', 'Flavor or aroma', 'Thickening', 'Protein'],
      flavorProfile: 'Rich, nutty, earthy, slightly bitter, roasted sesame savor',
      textureProfile: 'Oily, thick, pourable paste; forms stiff emulsion when whisked with water/lemon',
      substitutes: [
        {
          name: 'Creamy Cashew or Almond Butter (Unsweetened)',
          type: 'Best Smooth & Nutty Texture Match',
          ratio: '1 tbsp Tahini = 1 tbsp Smooth Cashew/Almond Butter (1:1)',
          calcMethod: 'Matching monounsaturated fat emulsion and protein solids',
          tasteDesc: 'Rich, nutty, creamy with slightly less roasted bitterness.',
          textureDesc: 'Silky, spreadable emulsion that whisks into thick dressing.',
          bestDishes: ['Hummus', 'Mezze Bowls', 'Salad Dressings', 'Dips'],
          dietary: ['Vegan', 'Gluten-Free', 'Paleo'],
          allergens: ['Tree Nuts'],
          contextNotes: {
            'Salads & Dressings': 'Add extra pinch of salt to balance natural cashew sweetness.'
          }
        },
        {
          name: 'Sunflower Seed Butter (SunButter)',
          type: 'Best Nut-Free & Sesame-Free Safe Alternative',
          ratio: '1 tbsp Tahini = 1 tbsp Sunflower Seed Butter (1:1)',
          calcMethod: 'Matches seed-oil fatty acid profile and gentle earthy bitterness',
          tasteDesc: 'Earthy, toasty, rich seed flavor.',
          textureDesc: 'Pourable, thick paste that emulsifies with lemon and garlic.',
          bestDishes: ['School-Safe Hummus', 'Dressings', 'Sauces'],
          dietary: ['Allergen-Safe', 'Nut-Free', 'Sesame-Free', 'Vegan'],
          allergens: ['None'],
          contextNotes: {
            'Salads & Dressings': 'Perfect for commercial food service catering with allergen restrictions.'
          }
        },
        {
          name: 'Toasted Sesame Oil + Greek Yogurt (50/50)',
          type: 'Quick Low-Fat Dip Emulsion',
          ratio: '1 tbsp Tahini = 1.5 tsp Toasted Sesame Oil + 1.5 tsp Thick Yogurt',
          calcMethod: 'Sesame oil delivers authentic aroma; yogurt provides creamy base',
          tasteDesc: 'Savory, roasted sesame aroma with creamy dairy tang.',
          textureDesc: 'Creamy, glossy dip consistency.',
          bestDishes: ['Quick Dressings', 'Shawarma Sauces', 'Drizzle Bowls'],
          dietary: ['Vegetarian', 'Lower-Calorie'],
          allergens: ['Sesame', 'Dairy'],
          contextNotes: {
            'Direct Table / Topping': 'Whisk vigorously with fork until glossy.'
          }
        }
      ],
      volatiles: ['2,5-dimethylpyrazine', 'guaiacol', 'sesamol']
    },

    'gochujang': {
      name: 'Gochujang (Korean Chili Paste)',
      category: 'Sauces & Ferments',
      icon: 'fa-solid fa-pepper-hot',
      functions: ['Flavor or aroma', 'Sweetness', 'Thickening', 'Acidity'],
      flavorProfile: 'Spicy, deeply savory umami, sweet fermented glutamates, smoky',
      textureProfile: 'Dense, glossy, dark crimson sticky fermented paste',
      substitutes: [
        {
          name: 'Sriracha + Red Miso + Brown Sugar',
          type: 'Best Fermented Sweet-Heat Match',
          ratio: '1 tbsp Gochujang = 1.5 tsp Sriracha + 1 tsp Red Miso + 1/2 tsp Brown Sugar',
          calcMethod: 'Sriracha provides chili garlic heat; miso provides fermented soybean base',
          tasteDesc: 'Complex, savory-sweet spicy depth with umami backing.',
          textureDesc: 'Glossy thick red glaze that clings to wings and noodles.',
          bestDishes: ['Korean BBQ', 'Fried Chicken', 'Bibimbap', 'Noodle Bowls'],
          dietary: ['Vegan', 'Dairy-Free'],
          allergens: ['Soy'],
          contextNotes: {
            'Stir-fry & Wok': 'Toss in during last minute to prevent sugar from scorching.'
          }
        },
        {
          name: 'Kashmiri Chili Powder + Tomato Paste + Honey + Soy Sauce',
          type: 'Kitchen Pantry Improvisation',
          ratio: '1 tbsp Gochujang = 1 tsp Kashmiri Chili + 1.5 tsp Tomato Paste + 1/2 tsp Honey + 1/2 tsp Soy Sauce',
          calcMethod: 'Tomato & soy deliver glutamates; Kashmiri chili matches deep red color and heat',
          tasteDesc: 'Smoky, tangy-sweet, mild-medium heat.',
          textureDesc: 'Thick shiny paste.',
          bestDishes: ['Glazes', 'Tofu Marinades', 'Stir-Fries'],
          dietary: ['Vegetarian', 'Dairy-Free'],
          allergens: ['Soy'],
          contextNotes: {
            'Curries & Gravies': 'Adds gorgeous natural red color with gentle warmth.'
          }
        }
      ],
      volatiles: ['capsaicinoids', 'ethyl 2-methylbutyrate', 'fermented glutamates']
    },

    'mayonnaise': {
      name: 'Mayonnaise',
      category: 'Sauces & Emulsions',
      icon: 'fa-solid fa-spoon',
      functions: ['Fat', 'Moisture', 'Acidity', 'Texture'],
      flavorProfile: 'Rich, creamy, tangy, savory egg-oil emulsion',
      textureProfile: 'Thick, spreadable, spoonable cold emulsion',
      substitutes: [
        {
          name: 'Thick Greek Yogurt + Touch of Dijon Mustard & Olive Oil',
          type: 'Best Healthy & High-Protein Match',
          ratio: '1 tbsp Mayo = 1 tbsp Greek Yogurt + 1/4 tsp Dijon + 1/4 tsp Olive Oil',
          calcMethod: 'Casein protein emulsion matches mouthfeel with significantly lower calorie density',
          tasteDesc: 'Creamy, tangy, refreshing bite without oily residue.',
          textureDesc: 'Velvety, thick spread.',
          bestDishes: ['Coleslaw', 'Wraps', 'Sandwich Spreads', 'Potato Salad'],
          dietary: ['Vegetarian', 'High-Protein', 'Low-Calorie'],
          allergens: ['Dairy'],
          contextNotes: {
            'Breakfast & Breads': 'Spread generously in grilled sandwiches or paneer wraps.'
          }
        },
        {
          name: 'Vegan Mayo (Aquafaba & Oil Emulsion)',
          type: 'Plant-Based Direct 1:1 Match',
          ratio: '1 tbsp Mayo = 1 tbsp Vegan Mayo (1:1)',
          calcMethod: 'Chickpea albumen proteins bind vegetable oil into identical colloid',
          tasteDesc: 'Virtually indistinguishable from classic egg-based mayonnaise.',
          textureDesc: 'Thick, glossy, spoonable spread.',
          bestDishes: ['Burgers', 'Dips', 'Wraps', 'Salads'],
          dietary: ['Vegan', 'Egg-Free', 'Cholesterol-Free'],
          allergens: ['Check oil source (usually canola or sunflower)'],
          contextNotes: {
            'Salads & Dressings': 'Stable across room-temperature catering buffets without food-safety risk.'
          }
        }
      ],
      volatiles: ['acetic acid', 'diacetyl', 'mustard isothiocyanate trace']
    },

    // --- BAKING & GRAINS ---
    'all-purpose flour': {
      name: 'All-Purpose Flour (Maida)',
      category: 'Baking & Flours',
      icon: 'fa-solid fa-wheat-awn',
      functions: ['Binding', 'Thickening', 'Texture'],
      flavorProfile: 'Neutral, clean, starchy, bakes into sweet-golden aroma',
      textureProfile: 'Fine powdered wheat endosperm with moderate gluten protein',
      substitutes: [
        {
          name: 'Whole Wheat Flour (Atta)',
          type: 'Healthy & High-Fiber Indian Kitchen Staple',
          ratio: '1 cup Maida = 7/8 cup Atta + 1-2 tbsp Extra Liquid',
          calcMethod: 'Atta bran absorbs more liquid and develops slightly denser crumb',
          tasteDesc: 'Nutty, earthy, wholesome wheat depth.',
          textureDesc: 'Hearty, soft-chewy flatbreads; slightly denser cakes.',
          bestDishes: ['Naan & Rotis', 'Pancakes', 'Muffins', 'Cookies'],
          dietary: ['Whole-Grain', 'High-Fiber', 'Vegetarian'],
          allergens: ['Gluten (Wheat)'],
          contextNotes: {
            'Breakfast & Breads': 'Rest dough 20 minutes to allow whole bran to hydrate.'
          }
        },
        {
          name: '1-to-1 Gluten-Free Baking Blend (Rice Flour + Potato Starch + Xanthan)',
          type: 'Best Certified Gluten-Free Replacement',
          ratio: '1 cup Maida = 1 cup 1:1 GF Flour Blend (1:1)',
          calcMethod: 'Formulated starch ratios match wheat tensile elasticity and moisture absorption',
          tasteDesc: 'Clean, neutral bakery flavor.',
          textureDesc: 'Tender cake crumb, crisp cookies.',
          bestDishes: ['Cakes', 'Cookies', 'Quick Breads', 'Roux'],
          dietary: ['Celiac-Safe', 'Gluten-Free', 'Wheat-Free'],
          allergens: ['None'],
          contextNotes: {
            'Baking & Cakes': 'Ensure blend contains xanthan gum for crumb structural hold.'
          }
        },
        {
          name: 'Almond Flour (Superfine Blanched)',
          type: 'Best Low-Carb / Keto Baking Match',
          ratio: '1 cup Maida = 1 cup Almond Flour (reduce added fat slightly)',
          calcMethod: 'High natural lipid content provides rich moisture with zero gluten',
          tasteDesc: 'Rich, sweet, delicate toasted nutty aroma.',
          textureDesc: 'Moist, tender, dense melt-in-mouth crumb.',
          bestDishes: ['Financiers', 'Macarons', 'Keto Cakes', 'Tarts'],
          dietary: ['Keto-Friendly', 'Grain-Free', 'Low-Carb'],
          allergens: ['Tree Nuts (Almond)'],
          contextNotes: {
            'Baking & Cakes': 'Bake at 10°C lower temperature as nut flours brown more quickly.'
          }
        }
      ],
      volatiles: ['hexanal', 'furfural (baked crust)', 'maltol']
    },

    'baking powder': {
      name: 'Baking Powder',
      category: 'Baking & Leaveners',
      icon: 'fa-solid fa-flask-vial',
      functions: ['Binding', 'Texture'],
      flavorProfile: 'Neutral chemical leavener; releases CO2 bubbles',
      textureProfile: 'Fine white powder; expands batter volume by double in heat',
      substitutes: [
        {
          name: 'Baking Soda + Cream of Tartar (1:2)',
          type: 'Exact Chemical Equivalent',
          ratio: '1 tsp Baking Powder = 1/4 tsp Baking Soda + 1/2 tsp Cream of Tartar',
          calcMethod: 'Sodium bicarbonate + tartaric acid produces identical carbon dioxide reaction',
          tasteDesc: 'Clean, zero metallic aftertaste.',
          textureDesc: 'Immediate airy leavening lift in oven.',
          bestDishes: ['Cakes', 'Pancakes', 'Biscuits', 'Scones'],
          dietary: ['Vegan', 'Gluten-Free', 'Cornstarch-Free'],
          allergens: ['None'],
          contextNotes: {
            'Baking & Cakes': 'Mix dry and bake immediately after adding liquid.'
          }
        },
        {
          name: 'Baking Soda + Buttermilk / Lemon Juice',
          type: 'Household Acid-Base Leavener',
          ratio: '1 tsp Baking Powder = 1/4 tsp Baking Soda + 1/2 cup Buttermilk (reduce recipe liquid by 1/2 cup)',
          calcMethod: 'Lactic or citric acid neutralizes bicarbonate to yield airy air pockets',
          tasteDesc: 'Extremely tender, pleasant soft crumb with faint buttermilk tang.',
          textureDesc: 'Fluffy, high-rising bakery sponge.',
          bestDishes: ['Pancakes', 'Muffins', 'Quick Breads'],
          dietary: ['Vegetarian'],
          allergens: ['Dairy (if using buttermilk)'],
          contextNotes: {
            'Baking & Cakes': 'Get batter into the oven within 5 minutes of mixing.'
          }
        }
      ],
      volatiles: ['carbon dioxide release', 'neutral salts']
    },

    'yeast': {
      name: 'Yeast (Active Dry / Instant)',
      category: 'Baking & Leaveners',
      icon: 'fa-solid fa-dna',
      functions: ['Texture', 'Flavor or aroma'],
      flavorProfile: 'Fermented, bready, slightly sour, warm ethanol beer aroma',
      textureProfile: 'Microscopic dry granules; ferments sugar into gas and gluten matrix',
      substitutes: [
        {
          name: 'Baking Soda + Fresh Lemon Juice (Equal Parts)',
          type: 'Best Instant Emergency Bread Leavener',
          ratio: '1 packet Yeast (2.25 tsp) = 1 tsp Baking Soda + 1 tsp Lemon Juice',
          calcMethod: 'Direct acid-base chemical expansion without 1-hour rising wait',
          tasteDesc: 'Clean, lightly tangy, soft bread flavor.',
          textureDesc: 'Immediate rise; slightly tighter crumb than multi-hour fermented yeast.',
          bestDishes: ['Emergency Naan', 'Quick Pizza Dough', 'Soda Bread'],
          dietary: ['Vegan', 'Gluten-Free Base'],
          allergens: ['None'],
          contextNotes: {
            'Breakfast & Breads': 'Roll dough immediately and cook on smoking hot tawa for ballooning pockets.'
          }
        },
        {
          name: 'Sourdough Starter Discard',
          type: 'Artisanal Wild Yeast & Flavor Upgrade',
          ratio: '1 tsp Dry Yeast = 1/2 cup Active Sourdough Starter (reduce flour by 60g and water by 60g)',
          calcMethod: 'Wild lactobacillus and saccharomyces cerevisiae culture',
          tasteDesc: 'Rich, complex, sour-fermented crusty bakery aroma.',
          textureDesc: 'Open wild crumb with chewy blistered crust.',
          bestDishes: ['Artisan Loaves', 'Naan', 'Focaccia', 'Pizza'],
          dietary: ['Naturally Fermented', 'Easier Digestibility'],
          allergens: ['Gluten'],
          contextNotes: {
            'Breakfast & Breads': 'Allow 3-4 hours of fermentation for wild yeast activity.'
          }
        }
      ],
      volatiles: ['2-phenylethanol (rose-bread)', 'diacetyl', 'acetaldehyde']
    },

    'cocoa powder': {
      name: 'Cocoa Powder',
      category: 'Baking & Chocolates',
      icon: 'fa-solid fa-mug-hot',
      functions: ['Flavor or aroma', 'Acidity', 'Thickening'],
      flavorProfile: 'Deep chocolate bitterness, roasted, earthy, fruity cacao notes',
      textureProfile: 'Ultra-fine defatted cacao powder that dissolves in hot liquids or batters',
      substitutes: [
        {
          name: 'Dark Chocolate / Baking Bar (Melted)',
          type: 'Best Richness & Gloss Match',
          ratio: '3 tbsp Cocoa Powder = 30g Dark Chocolate (reduce added recipe butter/oil by 1 tbsp)',
          calcMethod: 'Chocolate contains cocoa butter fat; reducing recipe fat balances moisture',
          tasteDesc: 'Luxurious, rich, deep cocoa decadence with glossy finish.',
          textureDesc: 'Fudgy, dense, moist bakery texture.',
          bestDishes: ['Brownies', 'Cakes', 'Hot Chocolate', 'Tiramisu Layering'],
          dietary: ['Vegetarian', 'Gluten-Free'],
          allergens: ['May contain trace dairy'],
          contextNotes: {
            'Baking & Cakes': 'Melt gently over water bath or low microwave pulse before adding.'
          }
        },
        {
          name: 'Carob Powder',
          type: 'Caffeine-Free & Theobromine-Free Natural Alternative',
          ratio: '1 tbsp Cocoa Powder = 1 tbsp Carob Powder (reduce added sugar slightly)',
          calcMethod: 'Roasted carob pod flour mimics chocolate color and earthy sweetness',
          tasteDesc: 'Naturally sweet, earthy, roasted nutty notes without cocoa bitterness.',
          textureDesc: 'Fine brown powder; blends smoothly.',
          bestDishes: ['Bedtime Shakes', 'Cookies', 'Kids Treats', 'Energy Balls'],
          dietary: ['Caffeine-Free', 'Vegan', 'Pet-Safe (No theobromine)'],
          allergens: ['None'],
          contextNotes: {
            'Baking & Cakes': 'Naturally sweet—reduce added sugar slightly.'
          }
        }
      ],
      volatiles: ['pyrazines (roasted cacao)', 'theobromine', 'isovaleraldehyde']
    },

    // --- NUTS & SEEDS ---
    'almonds': {
      name: 'Almonds (Badam)',
      category: 'Nuts & Seeds',
      icon: 'fa-solid fa-bowl-food',
      functions: ['Fat', 'Texture', 'Flavor or aroma', 'Protein', 'Thickening'],
      flavorProfile: 'Sweet, buttery, woody, delicate floral-nutty flavor',
      textureProfile: 'Crisp crunchy nut; grinds into silky paste or superfine flour',
      substitutes: [
        {
          name: 'Cashew Nuts (Kaju)',
          type: 'Best Creamy & Richness Match',
          ratio: '100g Almonds = 100g Cashews (1:1)',
          calcMethod: 'Matching high lipid content and smooth emulsification capability',
          tasteDesc: 'Sweeter, creamier, luxurious buttery finish.',
          textureDesc: 'Micro-fine paste; softer crunch when toasted.',
          bestDishes: ['Shahi Gravies', 'Halwa', 'Badam Milk / Thandai', 'Desserts'],
          dietary: ['Vegan', 'High-Protein', 'Gluten-Free'],
          allergens: ['Tree Nuts (Cashew)'],
          contextNotes: {
            'Curries & Gravies': 'Blends smoother than unblanched almonds with zero grit.'
          }
        },
        {
          name: 'Toasted Pumpkin Seeds (Pepitas) or Sunflower Seeds',
          type: 'Best Tree-Nut-Free Match',
          ratio: '100g Almonds = 100g Pumpkin/Sunflower Seeds (1:1)',
          calcMethod: 'Matching healthy fat profile and crunchy texture with zero nut allergens',
          tasteDesc: 'Savory, toasty, earthy crunch.',
          textureDesc: 'Crisp whole bite; blends into thick creamy seed butter.',
          bestDishes: ['Nut-Free Pesto', 'Granola', 'Salad Toppings', 'Baking'],
          dietary: ['Nut-Free Safe', 'Vegan', 'Keto-Friendly'],
          allergens: ['None'],
          contextNotes: {
            'Breakfast & Breads': 'Toast lightly in a dry skillet for 3 minutes to activate aroma.'
          }
        }
      ],
      volatiles: ['benzaldehyde (almond essence)', 'furfural', 'pyrazines']
    },

    'cashew': {
      name: 'Cashew Nut (Kaju)',
      category: 'Nuts & Seeds',
      icon: 'fa-solid fa-bowl-food',
      functions: ['Fat', 'Thickening', 'Sweetness', 'Protein', 'Texture'],
      flavorProfile: 'Mild, sweet, buttery, rich dairy-like nuttiness',
      textureProfile: 'Soft-crunch nut that emulsifies into velvety dairy cream substitute',
      substitutes: [
        {
          name: 'Blanched Almonds (Skinned Badam)',
          type: 'Closest Direct Texture & Luxury Match',
          ratio: '100g Cashews = 100g Blanched Almonds (1:1)',
          calcMethod: 'Equal fat and protein emulsion density',
          tasteDesc: 'Delicate nutty sweetness with velvety body.',
          textureDesc: 'Smooth pureed gravy base when soaked in warm water.',
          bestDishes: ['Korma', 'Makhani Sauces', 'Barfi / Sweets', 'Vegan Creams'],
          dietary: ['Vegetarian', 'Vegan', 'Gluten-Free'],
          allergens: ['Tree Nuts (Almond)'],
          contextNotes: {
            'Curries & Gravies': 'Soak blanched almonds in boiling water for 15 minutes before pureeing.'
          }
        },
        {
          name: 'Raw Sunflower Seeds + 1 tbsp Coconut Milk',
          type: 'Best Budget & Nut-Free Curry Thickener',
          ratio: '100g Cashews = 80g Soaked Sunflower Seeds + 20ml Coconut Milk',
          calcMethod: 'Seeds match oleic fat content; coconut milk rounds out dairy-like sweetness',
          tasteDesc: 'Rich, savory, neutral creaminess with subtle seed warmth.',
          textureDesc: 'Smooth thick emulsion that enriches restaurant gravies.',
          bestDishes: ['Paneer Butter Masala', 'Mushroom Curry', 'Cream Soups'],
          dietary: ['Tree-Nut-Free Safe', 'Vegan', 'High-Protein'],
          allergens: ['None'],
          contextNotes: {
            'Curries & Gravies': 'Soak seeds in hot water for 20 minutes before high-speed blending.'
          }
        }
      ],
      volatiles: ['hexanal', 'benzaldehyde', 'limonene trace']
    },

    'pine nuts': {
      name: 'Pine Nuts (Chilgoza)',
      category: 'Nuts & Seeds',
      icon: 'fa-solid fa-seedling',
      functions: ['Fat', 'Texture', 'Flavor or aroma'],
      flavorProfile: 'Sweet, buttery, pine-like aroma, delicate soft-crunch',
      textureProfile: 'Oily soft seed with high pinolenic acid; blends into luxurious pesto',
      substitutes: [
        {
          name: 'Toasted Sunflower Seeds & Toasted Walnuts (60/40)',
          type: 'Best Taste & Texture Match for Pesto',
          ratio: '50g Pine Nuts = 30g Sunflower Seeds + 20g Shelled Walnuts',
          calcMethod: 'Sunflower seeds match soft seed texture; walnuts add authentic oily richness',
          tasteDesc: 'Toasted nutty warmth, buttery finish with zero astringency.',
          textureDesc: 'Blends into vibrant green pesto with identical creamy body.',
          bestDishes: ['Basil Pesto Pasta', 'Mezze Bowls', 'Salad Toppings'],
          dietary: ['Vegetarian', 'Vegan Base'],
          allergens: ['Tree Nuts (Walnuts)'],
          contextNotes: {
            'Pastas & Sauces': 'Toast seeds in a dry pan for 90 seconds until fragrant before pulsing.'
          }
        },
        {
          name: 'Blanched Slivered Almonds',
          type: 'Clean & Sweet Mediterranean Alternative',
          ratio: '50g Pine Nuts = 50g Blanched Almonds (1:1)',
          calcMethod: 'Matches gentle sweetness and soft emulsifying power with basil',
          tasteDesc: 'Sweet, mild, creamy backdrop that lets fresh basil shine.',
          textureDesc: 'Silky smooth green emulsion.',
          bestDishes: ['Pesto', 'Toasted Salad Garnishes', 'Pasta Fillings'],
          dietary: ['Vegan', 'Gluten-Free'],
          allergens: ['Tree Nuts (Almonds)'],
          contextNotes: {
            'Pastas & Sauces': 'Pulse with garlic and olive oil for classic genovese consistency.'
          }
        }
      ],
      volatiles: ['alpha-pinene (pine note)', 'beta-pinene', 'limonene', 'pinolenic acid']
    }
  };

  // 4. GENERAL CATEGORY FALLBACK GENERATOR
  const CATEGORY_HEURISTICS = [
    {
      keywords: ['oil', 'fat', 'lard', 'tallow', 'shortening', 'margarine'],
      category: 'Fats & Oils',
      icon: 'fa-solid fa-bottle-droplet',
      functions: ['Fat', 'Flavor or aroma', 'Moisture'],
      makeSubstitutes: (name) => [
        {
          name: 'Extra Virgin Olive Oil or Sunflower Oil',
          type: 'General Fat Substitute',
          ratio: `100g ${name} = 80-100ml Cooking Oil`,
          calcMethod: 'Concentrated lipid substitution',
          tasteDesc: 'Clean, neutral savory mouthfeel with heat stability.',
          textureDesc: 'Liquid cooking oil, coats pan evenly.',
          bestDishes: ['Sautéing', 'Baking', 'Roasting', 'Dressings'],
          dietary: ['Vegan', 'Heart-Healthy'],
          allergens: ['None']
        },
        {
          name: 'Clarified Butter (Ghee)',
          type: 'High-Heat Rich Alternative',
          ratio: `100g ${name} = 80g Ghee`,
          calcMethod: 'clarified milkfat concentration with high smoke point (250°C)',
          tasteDesc: 'Rich, caramelized nutty fragrance.',
          textureDesc: 'Silky cooking medium with zero water splattering.',
          bestDishes: ['Indian Cooking', 'Searing', 'Naan Brush'],
          dietary: ['Lactose-Free', 'Vegetarian'],
          allergens: ['Dairy']
        }
      ],
      volatiles: ['lipid oxidation aldehydes', 'oleic acid esters']
    },
    {
      keywords: ['cheese', 'cheddar', 'mozzarella', 'gouda', 'brie', 'feta', 'ricotta', 'gruyere'],
      category: 'Dairy & Cheeses',
      icon: 'fa-solid fa-cheese',
      functions: ['Fat', 'Protein', 'Flavor or aroma', 'Texture'],
      makeSubstitutes: (name) => [
        {
          name: 'Paneer or Firm Pressed Tofu Cubes',
          type: 'High-Protein Structural Match',
          ratio: `100g ${name} = 100g Paneer or Tofu`,
          calcMethod: 'Solid curd density match; holds shape during cooking',
          tasteDesc: 'Mild savory base that absorbs surrounding sauce flavours.',
          textureDesc: 'Tender chewy curd.',
          bestDishes: ['Bakes', 'Curries', 'Salads', 'Skewers'],
          dietary: ['Vegetarian / Vegan (tofu)'],
          allergens: ['Dairy (paneer) or Soy (tofu)']
        },
        {
          name: 'Nutritional Yeast & Cashew Melt',
          type: 'Plant-Based Umami Cheesy Match',
          ratio: `100g ${name} = 60g Soaked Cashew Paste + 2 tbsp Nutritional Yeast`,
          calcMethod: 'Glutamic acids in yeast emulate aged dairy umami',
          tasteDesc: 'Savory, rich, nutty cheesy profile.',
          textureDesc: 'Smooth melty sauce consistency.',
          bestDishes: ['Pastas', 'Pizzas', 'Dips', 'Bakes'],
          dietary: ['Vegan', 'Dairy-Free'],
          allergens: ['Tree Nuts (Cashew)']
        }
      ],
      volatiles: ['short-chain fatty acids', 'diacetyl', 'methional']
    },
    {
      keywords: ['yogurt', 'curd', 'dahi', 'sour cream', 'buttermilk'],
      category: 'Dairy & Cultured',
      icon: 'fa-solid fa-bowl-food',
      functions: ['Moisture', 'Acidity', 'Fat', 'Protein', 'Thickening'],
      makeSubstitutes: (name) => [
        {
          name: 'Whisked Greek Yogurt or Hung Curd',
          type: 'Direct Cultured Match',
          ratio: `100g ${name} = 100g Whisked Greek Yogurt (1:1)`,
          calcMethod: 'Matching lactic acid and milk protein suspension',
          tasteDesc: 'Pleasant, tangy, creamy lactic richness.',
          textureDesc: 'Velvety, smooth, spoonable texture.',
          bestDishes: ['Curries', 'Marinades', 'Dips', 'Baking'],
          dietary: ['Vegetarian', 'High-Protein'],
          allergens: ['Dairy']
        },
        {
          name: 'Coconut Yogurt (Unsweetened) + Splash Lemon',
          type: 'Plant-Based Cultured Match',
          ratio: `100g ${name} = 100g Coconut Yogurt + 1 tsp Lemon Juice`,
          calcMethod: 'Plant fermentation matches tart dairy acidity',
          tasteDesc: 'Tangy, smooth with subtle coconut freshness.',
          textureDesc: 'Silky cultured cream.',
          bestDishes: ['Vegan Marinades', 'Breakfast Bowls', 'Dressings'],
          dietary: ['Vegan', 'Dairy-Free'],
          allergens: ['None']
        }
      ],
      volatiles: ['lactic acid', 'diacetyl', 'acetoin']
    },
    {
      keywords: ['meat', 'beef', 'mutton', 'lamb', 'pork', 'turkey', 'duck', 'mince'],
      category: 'Proteins & Meats',
      icon: 'fa-solid fa-drumstick-bite',
      functions: ['Protein', 'Texture', 'Flavor or aroma', 'Fat'],
      makeSubstitutes: (name) => [
        {
          name: 'Thick Cremini / Portobello Mushrooms or Soy Chunks',
          type: 'Meaty Texture & Umami Match',
          ratio: `100g ${name} = 100g Rehydrated Soy Chunks or Seared Mushrooms`,
          calcMethod: 'Cellular chew resistance matches muscle fibers',
          tasteDesc: 'Deep savory umami, absorbs rich spicy gravy.',
          textureDesc: 'Fibrous, chewy, satisfying bite.',
          bestDishes: ['Curries', 'Stews', 'Bakes', 'Biryani'],
          dietary: ['Vegan', 'High-Protein (soy)'],
          allergens: ['Soy (if using soy chunks)']
        },
        {
          name: 'Brown Lentils or Cooked Rajma (Kidney Beans)',
          type: 'Hearty Whole-Food Protein Match',
          ratio: `100g ${name} = 100g Cooked Lentils/Beans`,
          calcMethod: 'Complex starch and plant protein density',
          tasteDesc: 'Nutty, earthy, comforting savory depth.',
          textureDesc: 'Hearty, tender legume bite.',
          bestDishes: ['Bolognese', 'Stews', 'Curries', 'Burrito Bowls'],
          dietary: ['Vegan', 'High-Fiber', 'Gluten-Free'],
          allergens: ['None']
        }
      ],
      volatiles: ['pyrazines', 'methionol', 'glutamates']
    },
    {
      keywords: ['vinegar', 'cider vinegar', 'balsamic', 'wine vinegar'],
      category: 'Acids & Condiments',
      icon: 'fa-solid fa-bottle-droplet',
      functions: ['Acidity', 'Flavor or aroma'],
      makeSubstitutes: (name) => [
        {
          name: 'Fresh Lemon or Lime Juice',
          type: 'Natural Citrus Acid Alternative',
          ratio: `1 tbsp ${name} = 1 tbsp Fresh Lemon Juice (1:1)`,
          calcMethod: 'Citric acid replicates sharp acetic sour punch',
          tasteDesc: 'Bright, zesty, clean fruit sourness.',
          textureDesc: 'Light liquid acid.',
          bestDishes: ['Dressings', 'Marinades', 'Deglazing', 'Baking Activation'],
          dietary: ['Vegan', 'Natural Fruit'],
          allergens: ['None']
        },
        {
          name: 'White Wine or Apple Cider Dilution',
          type: 'Culinary Deglazing Match',
          ratio: `1 tbsp ${name} = 1 tbsp Dry White Wine + 1 tsp Water`,
          calcMethod: 'Tartaric and malic fruit acids provide balanced acidity',
          tasteDesc: 'Fruity, crisp, complex savory deglaze.',
          textureDesc: 'Liquid acid wash.',
          bestDishes: ['Pan Sauces', 'Risottos', 'Stews'],
          dietary: ['Vegan'],
          allergens: ['Sulfites (wine)']
        }
      ],
      volatiles: ['acetic acid', 'ethyl acetate', 'tartaric acid']
    },
    {
      keywords: ['sugar', 'sweetener', 'jaggery', 'honey', 'maple syrup', 'caramel'],
      category: 'Sweeteners & Syrups',
      icon: 'fa-solid fa-candy-cane',
      functions: ['Sweetness', 'Moisture', 'Texture'],
      makeSubstitutes: (name) => [
        {
          name: 'Jaggery (Gud) or Pure Maple Syrup',
          type: 'Unrefined Natural Sweetener Match',
          ratio: `100g ${name} = 85g Crushed Jaggery or 80ml Maple Syrup`,
          calcMethod: 'Natural sucrose and mineral salts provide rich caramel sweetness',
          tasteDesc: 'Deep, rich, warm caramel-molasses notes.',
          textureDesc: 'Dissolves into warm liquids or batters.',
          bestDishes: ['Baking', 'Chai & Coffee', 'Desserts', 'Curry Balancing'],
          dietary: ['Vegetarian', 'Mineral-Rich'],
          allergens: ['None']
        },
        {
          name: 'Stevia / Allulose / Monk Fruit',
          type: 'Zero-Calorie Diabetic-Safe Alternative',
          ratio: `1 tsp ${name} = 1/4 tsp Stevia (check manufacturer conversion) or 1.25 tsp Allulose`,
          calcMethod: 'High-intensity non-nutritive glycosides with zero glycemic impact',
          tasteDesc: 'Clean, intense sweetness with zero blood sugar spike.',
          textureDesc: 'Dissolves cleanly in liquids.',
          bestDishes: ['Keto Baking', 'Diet Chai', 'Smoothies', 'Desserts'],
          dietary: ['Diabetic-Friendly', 'Keto', 'Zero-Calorie'],
          allergens: ['None']
        }
      ],
      volatiles: ['maltol', 'furans', 'sucrose degradation aroma']
    },
    {
      keywords: ['chili', 'pepper', 'jalapeno', 'cayenne', 'paprika', 'harissa'],
      category: 'Spices & Chilies',
      icon: 'fa-solid fa-pepper-hot',
      functions: ['Flavor or aroma', 'Acidity'],
      makeSubstitutes: (name) => [
        {
          name: 'Kashmiri Red Chili Powder or Crushed Red Pepper Flakes',
          type: 'Versatile Heat & Color Match',
          ratio: `1 piece ${name} = 1/2 tsp Kashmiri Chili or 1/4 tsp Chili Flakes`,
          calcMethod: 'Capsaicinoid concentration calibration',
          tasteDesc: 'Vibrant, smoky warmth with appetizing red color.',
          textureDesc: 'Ground spice or flakes.',
          bestDishes: ['Curries', 'Arrabbiata', 'Tadkas', 'Marinades'],
          dietary: ['Vegan', 'Gluten-Free'],
          allergens: ['None']
        },
        {
          name: 'Hot Chili Oil or Sriracha',
          type: 'Infused Finishing Heat Alternative',
          ratio: `1 tsp ${name} = 1/2 tsp Chili Oil or 1 tsp Sriracha`,
          calcMethod: 'Lipid-extracted capsaicin spreads heat evenly on palate',
          tasteDesc: 'Clean, lingering, spicy-savory heat.',
          textureDesc: 'Glossy finishing oil or sauce.',
          bestDishes: ['Noodles', 'Pizzas', 'Wraps', 'Rice Bowls'],
          dietary: ['Vegan'],
          allergens: ['None']
        }
      ],
      volatiles: ['capsaicin', 'dihydrocapsaicin', 'pyrazines']
    }
  ];

  // 5. CONTEXT-AWARE RANKING MODIFIER
  function adjustByContext(substitutes, dishContext) {
    if (!dishContext || dishContext === 'General / All Dishes') {
      return substitutes;
    }

    const cloned = JSON.parse(JSON.stringify(substitutes));
    cloned.forEach((sub, idx) => {
      let boost = 0;
      const ctxLower = dishContext.toLowerCase();
      
      // Dish-specific exact note boost
      if (sub.contextNotes && sub.contextNotes[dishContext]) {
        boost += 4;
      }
      
      // Specialized keyword boost per dish context
      if (ctxLower.includes('tea') || ctxLower.includes('beverage')) {
        if (sub.name.includes('Oat Milk') || sub.name.includes('Barista')) boost += 6;
      } else if (ctxLower.includes('baking') || ctxLower.includes('cake')) {
        if (sub.name.includes('Soy Milk') || sub.name.includes('Flaxseed') || sub.name.includes('Aquafaba') || sub.name.includes('Applesauce')) boost += 6;
      } else if (ctxLower.includes('curry') || ctxLower.includes('gravy')) {
        if (sub.name.includes('Cashew') || sub.name.includes('Coconut') || sub.name.includes('Malai') || sub.name.includes('Ghee')) boost += 6;
      } else if (ctxLower.includes('pasta') || ctxLower.includes('sauce')) {
        if (sub.name.includes('Cashew') || sub.name.includes('Grana') || sub.name.includes('Olive Oil')) boost += 6;
      }

      if (sub.bestDishes && sub.bestDishes.some(d => d.toLowerCase().includes(ctxLower.split(' ')[0]))) {
        boost += 3;
      }
      sub._contextScore = (100 - idx) + boost;
    });

    cloned.sort((a, b) => (b._contextScore || 0) - (a._contextScore || 0));
    return cloned;
  }

  function applyFlavorIdentityScoring(missingName, candidateList, dishName, userPrefs) {
    if (typeof FlavorIdentityEngine !== 'undefined') {
      let matchedRecipe = null;
      if (typeof RECIPES_DATA !== 'undefined' && Array.isArray(RECIPES_DATA) && dishName) {
        const lower = dishName.toLowerCase().trim();
        matchedRecipe = RECIPES_DATA.find(r => 
          r.id.toLowerCase() === lower ||
          r.title.toLowerCase().includes(lower) ||
          lower.includes(r.title.toLowerCase())
        );
      }
      const engineResult = FlavorIdentityEngine.rankSubstitutes(
        missingName,
        candidateList,
        matchedRecipe,
        null,
        userPrefs
      );
      return {
        alternatives: engineResult.eligible.length > 0 ? engineResult.eligible : candidateList,
        excluded: engineResult.excluded || [],
        weightsUsed: engineResult.weightsUsed
      };
    }
    return { alternatives: candidateList, excluded: [] };
  }

  // 6. MAIN UNIVERSAL LOOKUP ENGINE
  function analyzeIngredient(rawInput, dishContext = 'General / All Dishes', userPrefs) {
    const trimmed = (rawInput || '').trim();

    if (!trimmed) {
      return {
        status: 'empty',
        message: 'Please enter a food ingredient to search.'
      };
    }

    if (isNonFood(trimmed)) {
      return {
        status: 'invalid',
        originalInput: trimmed,
        message: "We couldn't identify this as a food ingredient. Please try another ingredient.",
        suggestion: "Try searching for dairy (milk, butter, paneer), vegetables (potato, tomato, mushroom), spices (saffron, cardamom), proteins (chicken, tofu, eggs), or international staples (miso, tahini, gochujang)."
      };
    }

    const norm = normalizeName(trimmed);

    // Case A: Match in curated ONTOLOGY
    let directEntry = ONTOLOGY[norm];
    if (!directEntry) {
      for (const key of Object.keys(ONTOLOGY)) {
        if (norm.includes(key) || key.includes(norm)) {
          directEntry = ONTOLOGY[key];
          break;
        }
      }
    }

    if (directEntry) {
      const rawCandidates = adjustByContext(directEntry.substitutes, dishContext);
      const scored = applyFlavorIdentityScoring(directEntry.name, rawCandidates, dishContext, userPrefs);
      return {
        status: 'recognized',
        source: 'Flavor Identity Engine & Curated Substitution Guide',
        isFallback: false,
        ingredientName: directEntry.name,
        category: directEntry.category,
        icon: directEntry.icon,
        functions: directEntry.functions,
        flavorProfile: directEntry.flavorProfile,
        textureProfile: directEntry.textureProfile,
        dishContext: dishContext,
        alternatives: scored.alternatives,
        excludedAlternatives: scored.excluded,
        weightsUsed: scored.weightsUsed,
        volatiles: directEntry.volatiles
      };
    }

    // Case B: Category heuristics
    for (const h of CATEGORY_HEURISTICS) {
      const match = h.keywords.some(kw => norm.includes(kw) || kw.includes(norm));
      if (match) {
        const rawCandidates = adjustByContext(h.makeSubstitutes(trimmed), dishContext);
        const scored = applyFlavorIdentityScoring(trimmed, rawCandidates, dishContext, userPrefs);
        return {
          status: 'recognized',
          source: 'Flavor Identity Engine & Culinary Category Heuristic Guide',
          isFallback: true,
          fallbackReason: 'Ingredient identified via culinary category and functional heuristics. Clearly labeled as an AI algorithmic recommendation.',
          ingredientName: trimmed.charAt(0).toUpperCase() + trimmed.slice(1),
          category: h.category,
          icon: h.icon,
          functions: h.functions,
          flavorProfile: 'Balanced culinary baseline for ' + h.category,
          textureProfile: 'Standard viscosity & thermal properties of ' + h.category,
          dishContext: dishContext,
          alternatives: scored.alternatives,
          excludedAlternatives: scored.excluded,
          weightsUsed: scored.weightsUsed,
          volatiles: h.volatiles
        };
      }
    }

    // Case C: General edible food fallback
    const capitalName = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    const genericAlts = [
      {
        name: `Neutral Vegetable Broth & Plant-Based Emulsion`,
        type: 'General Flavor & Moisture Match',
        ratio: `100g ${capitalName} = 100g Seasoned Vegetable Puree or Broth (1:1)`,
        calcMethod: 'Functional moisture and vegetable solids parity',
        tasteDesc: `Replicates the moisture, gentle savoriness, and body of ${capitalName}.`,
        textureDesc: 'Smooth, balanced liquid-to-solid culinary medium.',
        bestDishes: ['Curries & Gravies', 'Soups & Broths', 'Stir-fries'],
        dietary: ['Vegan', 'Gluten-Free'],
        allergens: ['None']
      },
      {
        name: `Extra-Virgin Olive Oil or Neutral Cooking Fat`,
        type: 'Lipid & Searing Alternative',
        ratio: `1 tbsp ${capitalName} = 1 tbsp Olive Oil or Ghee`,
        calcMethod: 'High smoke point fat medium for cooking and browning',
        tasteDesc: 'Clean, golden, rich cooking medium.',
        textureDesc: 'Fluid oil coating.',
        bestDishes: ['Sautéing', 'Baking', 'Roasting'],
        dietary: ['Vegetarian'],
        allergens: ['None']
      },
      {
        name: `Whisked Plain Yogurt or Silken Tofu Puree`,
        type: 'Body, Protein & Texture Binder',
        ratio: `100g ${capitalName} = 100g Whisked Curd or Blended Tofu`,
        calcMethod: 'Protein-curd emulsion matching viscosity and richness',
        tasteDesc: 'Mild, creamy, delicate tang that absorbs surrounding masalas.',
        textureDesc: 'Dense, velvety, non-greasy body.',
        bestDishes: ['Sauces', 'Curries', 'Dressings'],
        dietary: ['Vegetarian'],
        allergens: ['Dairy (yogurt) or Soy (tofu)']
      }
    ];

    const scored = applyFlavorIdentityScoring(capitalName, genericAlts, dishContext, userPrefs);

    return {
      status: 'recognized',
      source: 'Flavor Identity Engine & Culinary Category Heuristic Guide',
      isFallback: true,
      fallbackReason: 'Ingredient validated as edible food term; recommendations synthesized via culinary functional heuristics.',
      ingredientName: capitalName,
      category: 'Edible Food Ingredient',
      icon: 'fa-solid fa-utensils',
      functions: ['Moisture', 'Flavor or aroma', 'Texture'],
      flavorProfile: 'General savory/mild whole food profile',
      textureProfile: 'Standard kitchen ingredient consistency',
      dishContext: dishContext,
      alternatives: scored.alternatives,
      excludedAlternatives: scored.excluded,
      weightsUsed: scored.weightsUsed,
      volatiles: ['general organic volatiles', 'esters', 'organic acids']
    };
  }

  // 7. PRESET INGREDIENT LIST FOR 1-CLICK DISCOVERY
  const PRESET_SHOWCASE = [
    { name: 'Fresh Cream', icon: 'fa-solid fa-jug-detergent', category: 'Dairy' },
    { name: 'Milk', icon: 'fa-solid fa-glass-water', category: 'Dairy' },
    { name: 'Butter', icon: 'fa-solid fa-cubes-stacked', category: 'Dairy' },
    { name: 'Paneer', icon: 'fa-solid fa-cheese', category: 'Dairy' },
    { name: 'Parmesan', icon: 'fa-solid fa-cheese', category: 'Dairy' },
    { name: 'Chicken', icon: 'fa-solid fa-drumstick-bite', category: 'Proteins' },
    { name: 'Eggs', icon: 'fa-solid fa-egg', category: 'Proteins' },
    { name: 'Potato', icon: 'fa-solid fa-bowl-rice', category: 'Vegetables' },
    { name: 'Tomato', icon: 'fa-solid fa-apple-whole', category: 'Vegetables' },
    { name: 'Onion', icon: 'fa-solid fa-seedling', category: 'Vegetables' },
    { name: 'Mushroom', icon: 'fa-solid fa-tree', category: 'Vegetables' },
    { name: 'Avocado', icon: 'fa-solid fa-lemon', category: 'Fruits' },
    { name: 'Mango', icon: 'fa-solid fa-lemon', category: 'Fruits' },
    { name: 'Saffron', icon: 'fa-solid fa-spa', category: 'Spices' },
    { name: 'Cardamom', icon: 'fa-solid fa-seedling', category: 'Spices' },
    { name: 'Soy Sauce', icon: 'fa-solid fa-bottle-droplet', category: 'Sauces' },
    { name: 'Miso', icon: 'fa-solid fa-bowl-food', category: 'International' },
    { name: 'Tahini', icon: 'fa-solid fa-mortar-pestle', category: 'International' },
    { name: 'Gochujang', icon: 'fa-solid fa-pepper-hot', category: 'International' },
    { name: 'Pine Nuts', icon: 'fa-solid fa-seedling', category: 'Nuts' },
    { name: 'All-Purpose Flour', icon: 'fa-solid fa-wheat-awn', category: 'Baking' },
    { name: 'Baking Powder', icon: 'fa-solid fa-flask-vial', category: 'Baking' },
    { name: 'Cocoa Powder', icon: 'fa-solid fa-mug-hot', category: 'Baking' }
  ];

  return {
    analyzeIngredient,
    isNonFood,
    normalizeName,
    PRESET_SHOWCASE,
    ONTOLOGY,
    FlavorIdentityEngine: typeof FlavorIdentityEngine !== 'undefined' ? FlavorIdentityEngine : null
  };
})();

// Export for module systems or browser window
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UniversalIngredientEngine;
}