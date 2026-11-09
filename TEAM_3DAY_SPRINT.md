# ⚡ FlavorShift AI: 72-Hour (3-Day) Sprint Plan
### High-Velocity Execution Guide for 4 Developers
**Target Deadline:** 3 Days from Today  
**Objective:** Deliver a fully integrated, demonstrable, and production-ready AI Culinary Substitution platform with live machine learning, sensory radar visuals, and zero frontend regressions.

---

## 🎯 Master Sprint Schedule & Milestones

```
   ┌───────────────────────┬───────────────────────┬───────────────────────┐
   │        DAY 1          │        DAY 2          │        DAY 3          │
   │  Scaffold & Contracts │  Feature Integration  │ Testing, Deploy & Demo│
   ├───────────────────────┼───────────────────────┼───────────────────────┤
   │ • FastAPI Scaffolding │ • Live Radar Chart    │ • End-to-End Testing  │
   │ • SciPy Ratio Math    │ • Flavor Dot-Product  │ • Cloud / Docker Live │
   │ • FlavorGraph Embeds  │ • Llama-3 SOP Adapter │ • Presentation Script │
   │ • Frontend API Bridge │ • HTV Aspect Review   │ • Final Git Release   │
   └───────────────────────┴───────────────────────┴───────────────────────┘
```

---

## 👥 Teammate Roles & 3-Day Actionable Task Breakdown

---

### 👨‍💻 Developer 1: Backend Gateway, Database & Ratio Math Engine
**Primary Tech:** Python 3.11+, FastAPI, Pydantic, SciPy (MILP), SQLite/PostgreSQL  
**Working Directory:** `backend/app/core/`, `backend/app/services/ratio_solver.py`, `backend/app/routers/`

#### 📅 Day 1: API Foundation & Mass-Conservation Ratio Solver
- [ ] Create `backend/` directory, set up `requirements.txt` (`fastapi`, `uvicorn`, `scipy`, `pydantic`).
- [ ] Implement `backend/app/main.py` with CORS middleware so Developer 4 can connect from `http://localhost` and GitHub Pages.
- [ ] Define shared Pydantic schemas in `backend/app/schemas/` so Developers 2, 3, and 4 are unblocked.
- [ ] Code the **SciPy MILP Ratio Solver** (`backend/app/services/ratio_solver.py`):
  - Solves linear equations: $\text{Fat}_{\text{sub}} \cdot x_1 + \text{Water}_{\text{sub}} \cdot x_2 = \text{Target Mass}$.
  - Expose `POST /api/v1/substitute/optimize-ratio`.
- **Day 1 Checkpoint:** Endpoint returns exact conversion (e.g., $100\text{g Cream} \rightarrow 60\text{g Cashew} + 40\text{g Milk}$) in $<5\text{ms}$.

#### 📅 Day 2: Dynamic Scaling & Batch Cost Calculator
- [ ] Build `POST /api/v1/nutrition/calculate-batch`: accepts headcount (1 to 500 covers) and dynamically multiplies costs, margins, and calories.
- [ ] Implement SQLite/PostgreSQL storage for custom kitchen validations.
- [ ] Add in-memory dictionary caching (simulating Redis) so repeated queries return in $<1\text{ms}$.
- **Day 2 Checkpoint:** All cost, margin, and headcount math verified against Excel/calculator.

#### 📅 Day 3: Containerization & Cloud Deployment
- [ ] Write `Dockerfile` and `docker-compose.yml`.
- [ ] Deploy backend to free hosting (e.g., **Render.com / Railway.app**) or package for 1-command local execution:
  ```bash
  uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
  ```
- [ ] Assist Dev 4 with final end-to-end integration.

---

### 👩‍💻 Developer 2: Flavor Chemistry & Sensory Rheology Engine
**Primary Tech:** Python, NumPy, FlavorGraph Node2Vec vectors, ONNX Runtime, XGBoost  
**Working Directory:** `backend/app/ml/flavorgraph/`, `backend/app/ml/sensory/`, `backend/app/routers/`

#### 📅 Day 1: Ingest FlavorGraph Aroma Vectors
- [ ] Download the pre-computed **FlavorGraph** 300D `.npy` embeddings (Korea University DMIS lab).
- [ ] Store normalized ingredient aroma vectors in `backend/app/ml/flavorgraph/`.
- [ ] Write a vectorized cosine similarity function:
  ```python
  def get_flavor_match(ing1: str, ing2: str) -> float:
      v1, v2 = EMBEDDINGS[ing1], EMBEDDINGS[ing2]
      return float(np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2)))
  ```
- [ ] Expose `POST /api/v1/flavor/compatibility` returning compatibility percentage and shared aroma volatiles.
- **Day 1 Checkpoint:** Endpoint returns `0.982` (98.2%) for Cream vs. Cashew with aroma tags.

#### 📅 Day 2: 6-Axis Sensory Radar Vector Engine
- [ ] Implement the **Multi-Output Sensory Calculator** (`backend/app/ml/sensory/rheology.py`):
  - Predicts 6 normalized metrics: `viscosity`, `creaminess`, `mouthfeel`, `sweetness`, `stability`, `cleanliness`.
  - Includes curdling risk warning based on simmer temperature and pH.
- [ ] Expose `POST /api/v1/sensory/predict-profile`.
- **Day 2 Checkpoint:** Returns JSON radar coordinates ready for Dev 4's Chart.js / SVG canvas.

#### 📅 Day 3: Scientific Validation & Fallback Matrices
- [ ] Pre-generate backup JSON tables for the top 50 common restaurant swaps (in case network latency spikes during demo).
- [ ] Validate aroma compatibility scores across curry, dessert, and pasta ingredients.
- [ ] Prepare 2 presentation slides explaining the **FlavorGraph chemical pairing theory** for the judges.

---

### 👨‍💻 Developer 3: GenAI SOP Adapter & HTV Aspect Sentiment
**Primary Tech:** Python, Groq / Ollama SDK (Llama-3.1-8B), Hugging Face Transformers (`yangheng/deberta-v3-base-absa-v1.1`)  
**Working Directory:** `backend/app/ml/llm/`, `backend/app/ml/absa/`, `backend/app/routers/`

#### 📅 Day 1: Ultra-Fast LLM Cooking Step Rewriter
- [ ] Set up free API access via **Groq Cloud** (`groq` Python SDK) or local **Ollama** running `llama3.1:8b`.
  *Why Groq?* Delivers **500 tokens/second for free**, meaning cooking steps adapt in $<0.4\text{ seconds}$ during live demos!
- [ ] Write system prompt enforcing strict Pydantic JSON output:
  - Takes original steps + substitute name.
  - Rewrites only the affected step with correct culinary technique (e.g., *"Blend cashew paste smooth, fold over low flame"*).
- [ ] Expose `POST /api/v1/recipes/adapt-sop`.
- **Day 1 Checkpoint:** Test with Paneer Butter Masala; verify only step 2-3 is rewritten without corrupting other steps.

#### 📅 Day 2: HTV Aspect-Based Sentiment & Bayesian Trust Scorer
- [ ] Load pre-trained `yangheng/deberta-v3-base-absa-v1.1` via Hugging Face Pipeline.
- [ ] Analyze review text across 3 core aspects: `Texture/Mouthfeel`, `Taste Parity`, and `Emulsion Stability`.
- [ ] Implement the **Bayesian Trust Update Formula**:
  $$\text{Score} = \mu - 2\sigma \quad (\text{penalizes low sample size, rewards verified cooks})$$
- [ ] Expose `POST /api/v1/htv/analyze-feedback`.
- **Day 2 Checkpoint:** Test review *"Sauce was silky and rich, but slightly sweeter"* $\rightarrow$ outputs Texture: Positive, Taste: Neutral, Stability: Positive.

#### 📅 Day 3: Anti-Spam Guard & Demo Pre-population
- [ ] Pre-seed database with 10 realistic verified chef reviews with live plate photos.
- [ ] Add basic profanity/spam filter to the review submission endpoint.
- [ ] Rehearse live review submission flow for the demo presentation.

---

### 👩‍💻 Developer 4: Frontend Modernization, Radar Visuals & API Bridge
**Primary Tech:** HTML5, CSS3, Tailwind CSS, Vanilla JS, Chart.js / SVG Canvas  
**Working Directory:** Root project directory (`index.html`, `app.js`, `api-service.js`, `styles.css`)

#### 📅 Day 1: Asynchronous API Bridge & Resilient Offline Fallback
- [ ] Create `api-service.js` with an automated health check to `http://localhost:8000/api/v1/health`.
- [ ] Implement the **Golden Offline Rule**:
  ```javascript
  async function fetchSwapWithFallback(payload) {
    try {
      const res = await fetch('http://localhost:8000/api/v1/substitute/optimize-ratio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(1500) // 1.5s timeout
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Backend offline. Using local heuristic fallback.");
    }
    return getLocalComputedFallback(payload); // Reads from recipes-data.js
  }
  ```
- [ ] Add the **Engine Status Pill** in the top navigation bar:
  - 🟢 `⚡ AI Neural Engine Active` (when backend is running)
  - 🟡 `🛡️ Offline Heuristic Engine` (when backend is off)
- **Day 1 Checkpoint:** App works seamlessly whether backend server is running or closed!

#### 📅 Day 2: 6-Axis Sensory Radar Chart & Live HTV Pills
- [ ] Include Chart.js via CDN in `index.html`:
  ```html
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  ```
- [ ] Render interactive **Radar Chart** inside the AI Swap Lab:
  - Axis: Viscosity, Creaminess, Mouthfeel, Sweetness Balance, Thermal Stability, Cleanliness.
  - Visual comparison: Blue line (Original Dairy Cream) vs. Amber line (Cashew Velvet Substitute).
- [ ] Add dynamic **Aspect Sentiment Badges** to the HTV community review cards.
- **Day 2 Checkpoint:** Visually stunning radar chart animates smoothly when selecting ingredients.

#### 📅 Day 3: Mobile & Thermal Ticket QA, GitHub Deployment
- [ ] Test the full UI on mobile phone screens (iPhone / Android) via GitHub Pages link.
- [ ] Test the **Print Kitchen Ticket (SOP)** button to ensure thermal receipt formatting prints cleanly.
- [ ] Ensure all assets are pushed to GitHub repository branch `main` and merged to `gh-pages`.
- [ ] Coordinate final rehearsal with the team.

---

## 📅 Hour-by-Hour 3-Day Team Schedule

### Day 1: Architecture, Contracts & Setup
- **10:00 AM – 11:00 AM (Sprint Kickoff):** 4 teammates meet. Dev 1 clones repo, creates `backend/` folder, publishes Pydantic contracts. Dev 4 creates `api-service.js`.
- **11:00 AM – 02:00 PM (Independent Coding):**
  - Dev 1 builds FastAPI skeleton & SciPy MILP solver.
  - Dev 2 downloads FlavorGraph vectors and codes cosine function.
  - Dev 3 configures Groq API key and tests Llama-3.1 SOP prompt.
  - Dev 4 adds AI status badge to navbar and wires `api-service.js`.
- **02:00 PM – 06:00 PM (Core Engine Build):**
  - Dev 1 verifies `/api/v1/substitute/optimize-ratio`.
  - Dev 2 verifies `/api/v1/flavor/compatibility`.
  - Dev 3 tests JSON output schema for cooking steps.
  - Dev 4 builds the Radar Chart container in `index.html`.
- **06:00 PM (Day 1 Standup):** All 4 verify they can run backend and frontend locally.

### Day 2: The Integration Day
- **10:00 AM – 01:00 PM:**
  - Dev 2 connects the 6-axis Sensory Radar numbers to Dev 4's Chart.js component.
  - Dev 1 connects the headcount scaler (+ / - persons) to the batch cost API.
- **02:00 PM – 06:00 PM:**
  - Dev 3 connects the Llama-3.1 SOP rewriter to the Recipe Deep-Dive modal.
  - Dev 3 & Dev 4 wire up the HTV review submission form with aspect sentiment pills.
- **08:00 PM – 10:00 PM (Day 2 Milestone Test):** Full end-to-end user test. Selecting *Paneer Butter Masala* $\rightarrow$ clicking *Cashew Swap* computes real MILP ratio, shows 98.2% flavor match, renders radar chart, rewrites steps with warning, and saves reviews.

### Day 3: Polish, Deploy, Demo Script & Rehearsal
- **10:00 AM – 01:00 PM:** Dev 1 & Dev 4 deploy to GitHub Pages and cloud server. Run cross-browser and mobile checks.
- **02:00 PM – 05:00 PM:** Edge-case stress testing. Verify the offline fallback rule (kill backend $\rightarrow$ app still works 100%).
- **05:00 PM – 08:00 PM:** Presentation rehearsal. Assign demo speaking roles to all 4 teammates.

---

## 🎤 Winning 5-Minute Presentation Script for Judges / College Faculty

When presenting to professors or judges, follow this 5-minute script:

- **Minute 1 (The Problem - Dev 4 / Team Lead):**  
  *"Every home cook and cafe manager faces the missing or expensive ingredient crisis. Substituting blindly ruins dishes. We built FlavorShift AI — an intelligent culinary platform that replaces missing ingredients with mathematical precision and zero taste compromise."*
- **Minute 2 (The AI Swap Lab & Chemistry - Dev 2):**  
  *"Watch this live: When we select Paneer Butter Masala without Fresh Cream, our backend doesn't guess. It queries our FlavorGraph aroma volatile engine, calculating a 98.2% molecular match with Cashew-Milk velvet based on shared aroma volatiles."*
- **Minute 3 (Exact Ratios & Sensory Radar - Dev 1):**  
  *"Unlike generic LLMs that hallucinate quantities, our SciPy linear programming solver calculates the exact mass conservation ratio: 60g cashew paste + 40g warm milk, cutting food cost by 55%. Notice the interactive 6-axis Sensory Radar chart comparing viscosity and mouthfeel."*
- **Minute 4 (Dynamic SOP & HTV Validation - Dev 3):**  
  *"Our Llama-3.1 engine autonomously rewrites cooking step 3, warning the cook to fold the puree gently over low flame to prevent curdling. Furthermore, our Human Taste Validation Hub uses Aspect-Based Sentiment Analysis to validate real kitchen trials."*
- **Minute 5 (Commercial Impact & Scalability - All):**  
  *"The platform runs seamlessly on phones, prints thermal kitchen tickets for cooks, and retains 100% offline capability. FlavorShift AI turns kitchen emergencies into profitable, high-quality meals."*

---

## 🔒 The Golden Team Rule: No Regressions
> **Emergency Golden Rule:** Dev 4 must ensure `app.js` retains the fallback to `recipes-data.js`. Even if the local backend server crashes, wifi drops, or the API times out during the live presentation, **the website will seamlessly fall back to local data and never throw an error in front of judges!**
