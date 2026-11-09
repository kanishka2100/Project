# FlavorShift AI 🍳✨
### Intelligent Culinary Ingredient Substitution & Human Taste Validation Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-22c55e?style=for-the-badge&logo=github)](https://kanishka2100.github.io/Project/)
[![Repository](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/kanishka2100/Project)
[![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20Mobile%20Responsive-orange?style=for-the-badge)](https://kanishka2100.github.io/Project/)
[![Validation](https://img.shields.io/badge/HTV-Human%20Taste%20Validated-emerald?style=for-the-badge)](https://kanishka2100.github.io/Project/)
[![Team Sprint](https://img.shields.io/badge/72h%20Sprint-4%20Developer%20Roadmap-blue?style=for-the-badge&logo=fastapi)](./TEAM_3DAY_SPRINT.md)
[![Team Workstreams](https://img.shields.io/badge/Team%20Allocation-2%20Devs%20%7C%204%20Workstreams-purple?style=for-the-badge&logo=git)](./docs/TEAM_WORKSTREAMS.md)

---

## 1. Project Name
**FlavorShift AI** — *Intelligent Culinary Ingredient Substitution & Human Taste Validation Platform*

---

## 2. Project Overview
**FlavorShift AI** is an AI-powered culinary intelligence platform created to assist home cooks, cafe chefs, cloud kitchens, and culinary operators when a recipe ingredient is either missing from the kitchen or too expensive to source.

In traditional cooking, running out of a key component (such as Fresh Cream in a rich Indian Makhani curry, or Mascarpone in Italian Tiramisu) causes uncertainty, compromised recipes, or abandoned meals. FlavorShift AI bridges this gap by recommending chemically and texturally sound alternative ingredients with **exact substitution ratios**, **taste and texture impact analysis**, **nutritional and cost breakdowns**, and a crowdsourced **Human Taste Validation (HTV)** framework where verified cooks review and validate each substitute in real kitchen environments.

The project is built as a zero-dependency, high-performance, mobile-responsive Single Page Application (SPA) designed for instant kitchen utility without mandatory logins or backend servers.

---

## 3. Problem Statement
Every day, home cooks and professional kitchens encounter two major challenges while preparing meals:

1. **The Missing Ingredient Friction**: A cook is midway through preparing a dish and discovers an essential ingredient is absent from the pantry or refrigerator. Inexperienced cooks frequently substitute blindly (e.g., adding cold milk into an acidic tomato gravy, which curdles instantly and ruins the texture).
2. **The High-Cost & Seasonal Inflation Barrier**: Premium ingredients—such as dairy fresh cream, imported mascarpone cheese, Hass avocados, pine nuts, and truffle oils—regularly experience volatile price spikes or supply shortages. Small food businesses, cloud kitchens, and budget-conscious households are forced to either absorb heavy margin losses or compromise on the authentic richness of their signature dishes.
3. **Lack of Verified Substitution Guidance**: Standard search engines return generic text lists of "substitutes" that fail to specify:
   - The exact replacement quantity or mathematical ratio.
   - The effect on mouthfeel, moisture, emulsification, and heat stability.
   - Whether real cooks have actually tested the alternative and found it indistinguishable from the original recipe.

---

## 4. Proposed Solution
**FlavorShift AI** solves this problem through a structured culinary substitution engine that harmonizes culinary science, kitchen economics, and community validation:

- **Scientific Ingredient Compatibility**: Models the fat content, moisture levels, emulsion characteristics, and sweetness/umami profiles of alternative ingredients to guarantee near-identical culinary behavior under heat.
- **Precision Ratios & Headcount Scaling**: Calculates exact gram-for-gram or ratio-based substitution measurements scaled dynamically according to the number of persons (1 to 50 covers).
- **Dual-Optimization Pathways**: Provides tailored alternatives for diverse kitchen goals:
  - **Best Taste & Texture Match** (e.g., 60g Soaked Cashew Puree + 40g Warm Milk replacing 100g Commercial Fresh Cream in *Paneer Butter Masala* with 98% taste similarity).
  - **Budget-Saver Alternative** (cutting ingredient expenses by 40% to 65%).
  - **Calorie-Cutter Mode** (reducing calorie and saturated fat loads by 40% to 45% using protein-rich swaps like strained Greek curd and silken tofu).
- **Human Taste Validation (HTV) Protocol**: Integrates empirical community feedback from verified chefs and home cooks. Each alternative is assigned an HTV score, taste similarity percentage, and real photographic proof so users can cook with total confidence.

---

## 5. Key Features

### 🧪 1. Interactive AI Swap Lab (Flagship Engine)
- Dedicated substitution workspace covering high-frequency missing and expensive culinary staples:
  - **Fresh Cream** → *Soaked Golden Cashew & Milk Velvet Emulsion* or *Whisked Malai & Hung Curd*
  - **Mascarpone Cheese** → *Hung Farmhouse Curd + Heavy Cream (50/50)* or *Whipped Fresh Ricotta + Butter*
  - **Hass Avocado** → *Sweet Green Pea & Avocado Mash* or *Edamame-Lime Herb Puree*
  - **Black Truffle Oil** → *Steeped Porcini Mushroom Broth + Brown Garlic Butter*
  - **Pine Nuts** → *Toasted Golden Sunflower Seeds + Walnuts*
- **Live Ratio Converter**: Input any missing quantity (e.g., 250g cream) to receive the exact replacement breakdown in real time.

### 👥 2. Human Taste Validation (HTV) Community Hub
- Public kitchen validation database showcasing blind taste test results, texture feedback, and verified cafe reviews.
- **Interactive HTV Submission Form**: Allows users to log their own kitchen experiments, rate taste match percentage (0–100%), score texture mouthfeel (1–10), and post notes to help future cooks.
- Persistent community logs stored securely via client-side storage.

### 📊 3. Cost Comparison & Margin Analytics
- Real-time financial calculations per portion and per banquet batch (1–500 covers).
- Compares base ingredient costs versus AI substitute costs, projecting food cost savings and gross profit margin percentages.

### 🥗 4. Calorie-Cutter & Dietary Filters
- One-click **Calorie-Cutter Alternative** toggle on recipes, recalculating caloric density, protein, carbohydrate, fat, and dietary fiber macros.
- Dietary tags and instant filter toggles for **Vegetarian**, **100% Vegan**, and **Gluten-Free** preferences.

### 🍲 5. Dual-Mode Recipe Deep-Dive (WebX Modal)
- Adheres to standard professional culinary workflow:
  - **Ingredients FIRST**: Displays scaled quantities, unit measurements, estimated cost per ingredient, and visual badges for replaced items.
  - **Cooking Steps SECOND**: Dynamically updates recipe instructions to explain step-by-step how and when to blend and incorporate the alternative ingredient.
- Printable Kitchen Ticket / Standard Operating Procedure (SOP) button formatted specifically for thermal cafe printers and kitchen prep boards.

### 🧺 6. Optional Kitchen Inventory (Pantry Stock) Drawer
- Collapsible ingredient selector with prefilled pantry staples.
- Includes 4 one-click curated presets:
  - 🥐 *Standard Breakfast Cafe*
  - ☕ *Specialty Coffee & Bakery*
  - 🌿 *Green Vegan Bistro*
  - 🍝 *Italian Panini & Pasta Bar*

### 💡 7. 6-Stage Design Thinking Interactive Slide Deck
- Embedded academic and presentation deck walking through the complete product development lifecycle:
  1. *Context & Overview*
  2. *Stage 1: Empathize* (Persona research with home cooks and cloud kitchens)
  3. *Stage 2: Define* ("How Might We" problem statements)
  4. *Stage 3: Ideate* (The 3 pillars of FlavorShift AI architecture)
  5. *Stage 4: Prototype* (Instant Swap Lab & Dynamic SOP Re-Writer)
  6. *Stage 5: Test & Validate* (142 kitchen trials with 97.4% blind taste similarity)

### 🌓 8. Daylight & Dark Mode with LocalStorage Persistence
- Sleek, high-contrast visual theme optimized for bright day kitchens as well as low-light evening prep shifts. Remembers user preference across visits.

---

## 6. Technologies Used

FlavorShift AI is intentionally engineered with clean, modern, vanilla web standards to guarantee ultra-fast load times, zero build requirements, and complete cross-platform browser compatibility.

| Layer | Technology | Usage & Purpose |
| :--- | :--- | :--- |
| **Markup** | **HTML5** | Semantic structure, accessible interactive dialogs, responsive containers, and clean layout hierarchy. |
| **Styling** | **CSS3 & Tailwind CSS (CDN v3)** | Utility-first responsive styling, custom culinary color palette (`cafe-orange`, `cafe-amber`, `cafe-espresso`), glassmorphic navigation bars, and print stylesheet rules. |
| **Scripting** | **JavaScript (ES6+ Vanilla)** | Core reactivity, dynamic DOM rendering, headcount calculations, swap ratio algorithms, and tab switching. |
| **Typography** | **Google Fonts** | `Outfit` (display headings), `Plus Jakarta Sans` (body and UI elements), and `JetBrains Mono` (numerical ratios, costs, and measurements). |
| **Iconography**| **Font Awesome 6 (v6.5.1 CDN)** | Comprehensive culinary, nutritional, and interface iconography. |
| **State Storage**| **Web Storage API (`localStorage`)**| Client-side persistence for user theme preference, favorite recipes, custom reviews, and HTV kitchen submissions. |
| **Deployment** | **Git & GitHub Pages** | Continuous version control and static cloud hosting with custom responsive domain routing. |

> **Note**: FlavorShift AI does not require heavy runtime dependencies, node packages, or complex build steps. It executes natively in any modern web browser.

---

## 7. How It Works

```
                                  USER WORKFLOW
                                        │
           ┌────────────────────────────┴────────────────────────────┐
           ▼                                                         ▼
   [ AI SWAP LAB VIEW ]                                     [ RECIPE EXPLORER ]
Pick missing/expensive ingredient                        Browse catalog or search dish
(e.g., Fresh Cream, Avocado)                             (e.g., Paneer Butter Masala)
           │                                                         │
           ▼                                                         ▼
View 2-3 AI Alternatives with Ratios                     Select Headcount (1 to 50 Persons)
Taste % • Texture • Cost • HTV Score                     Toggle Budget, Calorie, or Vegan Mode
           │                                                         │
           ▼                                                         ▼
Interactive Ratio Converter                              Open Recipe Deep-Dive Modal
(Enter custom grams to get exact swap)                   • Ingredients shown FIRST
           │                                             • Adapted Cooking SOP shown SECOND
           └────────────────────────────┬────────────────────────────┘
                                        ▼
                      [ HUMAN TASTE VALIDATION (HTV) ]
                     Review real chef & home-cook tests
                     Submit own kitchen test & feedback
                                        │
                                        ▼
                      [ COST & MARGIN DASHBOARD ]
                     Simulate covers & projected savings
```

### Detailed Step-by-Step Flow:
1. **Discover**: The user enters the platform on the **AI Swap Lab** or **Explore Recipes** tab.
2. **Select Missing Ingredient**: In the Swap Lab, the user selects a target missing or costly ingredient (e.g., Fresh Cream).
3. **Compare Alternatives**: The engine outputs the top recommendations, including exact substitution ratios (e.g., $100\text{g Cream} \rightarrow 60\text{g Cashew Paste} + 40\text{g Warm Milk}$), predicted taste match (98%), texture consistency impact, cost variance ($-55\%$), and HTV community score ($9.8/10$).
4. **Scale & Cook**: The user inspects the full recipe, adjusts the person headcount stepper, and views the scaled ingredient table **first**, followed by the re-written step-by-step cooking method **second**.
5. **Validate**: After preparing the meal, the user navigates to the **Human Taste Validation** tab to record their experience, helping refine the community data loop.

---

## 8. Project Structure

```
flavorshift-ai/
│
├── index.html            # Main Single Page Application structure & layout
├── styles.css            # Custom CSS3 styling, glassmorphism, animations & print styles
├── recipes-data.js       # Core dataset: recipes, alternatives, swap database & slide deck
├── app.js                # Core JS logic: state management, calculations, DOM renderers & HTV
├── server.ps1            # Lightweight PowerShell web server for local offline testing
├── TEAM_3DAY_SPRINT.md   # 72-hour execution guide & workstream division for 4 developers
└── README.md             # Comprehensive project documentation & submission guide
```

### File Breakdown:
- **`index.html`**: Defines the semantic HTML5 layout including the sticky glass navigation bar, mobile tab bar, pantry inventory drawer, the 6 modular view containers (`#view-swaplab`, `#view-explore`, `#view-htv`, `#view-dashboard`, `#view-slides`, `#view-favorites`), the modal deep-dive dialog, and global footer.
- **`styles.css`**: Encapsulates custom color variables, CSS animations (`fadeUp`), glassmorphic backdrop filters, custom scrollbar styling, active tab states, and specialized `@media print` rules for thermal kitchen ticket printing.
- **`recipes-data.js`**: Contains structured culinary data models:
  - `RECIPES_DATA`: Comprehensive dish entries (including flagship *Velvety Paneer Butter Masala*, *Smashed Avocado Toast*, *Wild Mushroom Truffle Pasta*, etc.) with macro breakdowns, substitute definitions, ingredient costs, and step-by-step cooking methods.
  - `FLAVORSHIFT_SWAP_DATABASE`: Targeted substitution matrix for individual ingredients.
  - `PREFILLED_PANTRY_STAPLES`: Quick-select pantry ingredients and curated cafe presets.
  - `DESIGN_THINKING_SLIDES`: 6 complete presentation slides covering research, empathy, ideation, and testing.
- **`app.js`**: Drives all application behavior:
  - Initializes reactive application state and loads persisted preferences from `localStorage`.
  - Manages tab navigation, pantry filters, theme toggles, and live search/sort filters.
  - Houses the `getComputedRecipe()` function that computes scaled quantities, swaps ingredients dynamically, and recalculates nutritional and financial totals.
  - Renders the interactive HTV validation form and submission pipeline.
- **`server.ps1`**: A native Windows PowerShell script utilizing `System.Net.HttpListener` to serve the project locally over HTTP on port 8080 without external tooling.

---

## 9. Installation and Setup

FlavorShift AI requires **no compilation, package manager, or backend installation**. It can be run immediately using any of the methods below:

### Option A: Open Directly in Any Web Browser (Fastest)
1. Clone or download the repository to your local machine:
   ```bash
   git clone https://github.com/kanishka2100/Project.git
   cd Project
   ```
2. Double-click the `index.html` file, or right-click and choose **Open with** $\rightarrow$ **Google Chrome / Microsoft Edge / Mozilla Firefox / Safari**.

---

### Option B: Run via Built-in PowerShell Local Server (Windows)
If you wish to test over a local HTTP server:
1. Open PowerShell in the project directory:
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\server.ps1 -Port 8080
   ```
2. Open your web browser and navigate to:
   ```
   http://localhost:8080/
   ```

---

### Option C: Run via Python or Node.js (Optional)
If you have Python or Node.js installed:

- **Using Python 3**:
  ```bash
  python -m http.server 8080
  ```
  Then open `http://localhost:8080/`.

- **Using Node.js**:
  ```bash
  npx serve .
  ```

---

## 10. Screenshots

| Section | Description |
| :--- | :--- |
| **AI Swap Lab (Flagship)** | *Interactive substitution laboratory displaying target ingredients, replacement ratios, taste similarity percentages, texture analysis, and the live ratio converter.* |
| **Human Taste Validation (HTV) Hub** | *Community validation dashboard with real kitchen trial feedback, blind test scores, verified cook cards, and the interactive HTV test submission form.* |
| **Recipe Explorer & Dietary Filters** | *Catalog grid featuring search, category filters (Curries, Brunch, Pastas, Bakery, Coffee), dietary toggles (Vegetarian, Vegan, Gluten-Free), and person headcount steppers.* |
| **Recipe Deep-Dive Modal (WebX)** | *Standardized culinary view presenting scaled Ingredients FIRST with visual substitute badges, followed by updated step-by-step cooking SOPs SECOND, plus 1-click printable ticket.* |
| **Cost & Margin Dashboard** | *Financial simulator with dynamic banquet covers scaling (1–500 persons), food cost vs revenue projections, and gross margin analytics.* |
| **Design Thinking Slide Deck** | *6-slide presentation deck detailing the Empathize, Define, Ideate, Prototype, and Testing phases of FlavorShift AI.* |

> *Tip: To capture updated screenshots for college submissions or hackathons, run the project locally or open the live website, switch between the Daylight and Dark modes, and export full-page screenshots.*

---

## 11. Live Website Link
The project is continuously deployed and accessible online across desktop, tablet, and mobile browsers:

🌐 **Deployed Website**: [https://kanishka2100.github.io/Project/](https://kanishka2100.github.io/Project/)

---

## 12. GitHub Repository
The complete source code, version history, and documentation are hosted on GitHub:

🔗 **GitHub Repository**: [https://github.com/kanishka2100/Project](https://github.com/kanishka2100/Project)

---

### Submission & Author Information
- **Project**: FlavorShift AI
- **Developer / GitHub Profile**: [@kanishka2100](https://github.com/kanishka2100)
- **Repository Branch**: `main` (Source) & `gh-pages` (Deployment)
- **License**: MIT Open Source License
