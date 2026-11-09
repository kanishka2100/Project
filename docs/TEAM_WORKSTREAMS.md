# FlavorShift AI: 2-Teammate / 4-Workstream Engineering Blueprint
**Document ID:** `TEAM_WORKSTREAMS.md`  
**Classification:** Operational Workstream Allocation & Integration Protocol  
**Target:** 2-Developer Engineering Team (FlavorShift AI Core Team)  
**Goal:** Balanced distribution of AI/ML, backend, and full-stack responsibilities with zero blocking dependencies.

---

## 1. Workstream Allocation & Equity Matrix

To prevent the common anti-pattern where one developer does all the difficult AI/ML while the other is relegated to boilerplate CRUD or documentation, the 4 modular workstreams are paired across the two teammates to achieve an **exact 50/50 balance of AI and core engineering**:

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                            2-TEAMMATE WORKSTREAM ALLOCATION                                 │
├────────────────────────────┬─────────────────────────────┬──────────────────────────────────┤
│ TEAMMATE                   │ ASSIGNED WORKSTREAMS        │ CORE AI & ENGINEERING FOCUS      │
├────────────────────────────┼─────────────────────────────┼──────────────────────────────────┤
│ **Teammate 1**             │ • **Workstream 1:** Backend,│ • FastAPI Gateway, SQLAlchemy DB │
│ (Lead Backend & Chemical-  │   APIs & Database           │ • Redis Sub-2ms Cache, Docker    │
│  Sensory ML Engineer)      │ • **Workstream 3:** Flavour │ • FlavorGraph 300D Volatile Math │
│                            │   Compatibility & Rheology  │ • Multi-Output XGBoost ONNX      │
├────────────────────────────┼─────────────────────────────┼──────────────────────────────────┤
│ **Teammate 2**             │ • **Workstream 2:** Ingre-  │ • BGE Dense Semantic Retrieval   │
│ (Lead GenAI, Mathematical  │   dient Substitution AI     │ • Llama-3.1-8B Contextual SOP    │
│  Optimization & UI Bridge) │ • **Workstream 4:** Nutri-  │ • SciPy MILP Mass Solver         │
│                            │   tion, HTV ABSA & UI Bridge│ • PyABSA DeBERTa-v3 Sentiment    │
│                            │                             │ • Radar Canvas & Offline Bridge  │
└────────────────────────────┴─────────────────────────────┴──────────────────────────────────┘
```

---

## 2. Teammate 1: Detailed Workstream Specification

### 🎯 Scope: Workstream 1 (Backend & Database) + Workstream 3 (Flavour & Rheology AI)

#### 1. Exact Responsibilities
- Architect the core asynchronous **FastAPI** gateway, CORS middleware, security headers, and health checks.
- Design and maintain the relational database schema using **SQLAlchemy 2.0** (SQLite for local dev, PostgreSQL for production).
- Deploy the **FlavorGraph** volatile aroma matching engine using pre-computed 300D Node2Vec embeddings.
- Train, export, and serve the **Multi-Output XGBoost Sensory Regressor** using **ONNX Runtime** on CPU.
- Package the entire backend into a production-grade multi-stage **Dockerfile**.

#### 2. Features to Implement
- **Core API Gateway (`backend/app/main.py`):** Asynchronous lifespan, error handling, Redis caching, and OpenAPI Swagger documentation.
- **Relational Models (`backend/app/models/`):** Tables for `recipes`, `ingredients`, `steps`, and `htv_reviews`.
- **Aroma Compatibility Engine (`/api/v1/flavor/compatibility`):** Vectorized cosine similarity dot-product calculating volatile aroma compound overlap (e.g., $98.2\%$ match between Cream and Cashew).
- **Sensory Rheology Predictor (`/api/v1/sensory/predict-profile`):** Predicts 6-axis radar vector (`viscosity`, `creaminess`, `mouthfeel`, `sweetness`, `stability`, `cleanliness`) and curdling risk under high simmer.

#### 3. Technologies to Use
- **Python 3.11+**, **FastAPI**, **SQLAlchemy 2.0**, **Pydantic v2**, **NumPy**, **ONNX Runtime (`onnxruntime`)**, **XGBoost**, **Redis-py**, **Docker**.

#### 4. Files & Folders Owned by Teammate 1
```
backend/
├── app/
│   ├── core/
│   │   ├── config.py             # Settings & DB URLs
│   │   ├── database.py           # Async sessionmaker
│   │   └── security.py           # CORS & rate limiting
│   ├── models/
│   │   ├── recipe.py             # Recipe, ingredient, step ORM models
│   │   └── review.py             # HTV validation ORM models
│   ├── ml/
│   │   ├── flavorgraph/
│   │   │   ├── embeddings.npy    # Pre-computed 300D FlavorGraph vectors
│   │   │   └── matcher.py        # Vector cosine similarity dot-product
│   │   └── sensory/
│   │       ├── sensory_model.onnx# Exported Multi-Output XGBoost model
│   │       └── rheology.py       # 6-axis radar coordinator
│   ├── routers/
│   │   ├── flavor_router.py      # /api/v1/flavor/compatibility
│   │   └── sensory_router.py     # /api/v1/sensory/predict-profile
│   └── main.py                   # FastAPI application factory
├── Dockerfile
└── requirements.txt
```

#### 5. Required Datasets
- **FlavorGraph Node2Vec Embeddings (`lamypark/FlavorGraph`):** 300D vectors for 1,561 ingredients and 18,000+ aroma compounds (MIT License).
- **USDA FoodData Central Proximate Tables:** Compositional metrics for foundation culinary items.

#### 6. Expected Deliverables
- Working FastAPI server running locally on port 8080 or 8000.
- Sub-2ms FlavorGraph aroma similarity endpoint with shared volatile compound extraction.
- Sub-2ms ONNX sensory radar endpoint outputting standardized 6-axis coordinates.

#### 7. Testing Responsibilities
- Pytest suite: `tests/test_backend_health.py`, `tests/test_flavor_math.py`, and `tests/test_sensory_onnx.py`.
- Verify database migrations and assert $<5\text{ms}$ latency under concurrency.

#### 8. Dependencies on Teammate 2
- Provides the base API router structure to Teammate 2 on Day 1 so Teammate 2 can plug in the substitution and HTV routers without conflicts.

---

## 3. Teammate 2: Detailed Workstream Specification

### 🎯 Scope: Workstream 2 (Substitution GenAI) + Workstream 4 (Optimization, HTV & UI)

#### 1. Exact Responsibilities
- Implement exact mass conservation equations for substitution ratios and calorie minimization using **SciPy MILP**.
- Build the contextual culinary SOP rewriter using **Meta Llama-3.1-8B-Instruct** with strict Pydantic JSON schema constraints (via Groq Cloud SDK or local Ollama).
- Deploy the **PyABSA DeBERTa-v3** Aspect-Based Sentiment pipeline to evaluate kitchen trial feedback across Taste, Texture, and Heat Stability.
- Implement the **Bayesian TrueSkill** trust score aggregator to calculate dynamic community ratings.
- Modernize the client-side SPA (`app.js`, `index.html`) by building `api-service.js` with **graceful offline fallback** and rendering the **6-Axis Sensory Radar Chart**.

#### 2. Features to Implement
- **Exact Ratio Optimization (`/api/v1/substitute/optimize-ratio`):** Solves linear equations:
  $$\text{Fat}_{\text{sub}} \cdot x_1 + \text{Water}_{\text{sub}} \cdot x_2 = \text{Target Mass}$$
  Guarantees zero arithmetic hallucination and exact $-55\%$ cost savings calculations.
- **Contextual SOP Rewriter (`/api/v1/recipes/adapt-sop`):** Rewrites affected recipe instructions to insert culinary safety methods (e.g., tempering, pre-soaking, low flame).
- **HTV Aspect Sentiment (`/api/v1/htv/analyze-feedback`):** Evaluates user review strings and updates live trust ratings.
- **Frontend Bridge (`api-service.js` & `index.html`):**
  - Connects to backend with a 1.5s timeout; falls back to local `recipes-data.js` if backend is offline.
  - Renders the interactive 6-axis Sensory Radar Chart using Chart.js / SVG Canvas.
  - Adds the `⚡ AI Neural Engine Active` status badge.

#### 3. Technologies to Use
- **Python 3.11+**, **SciPy (`scipy.optimize.milp`)**, **Groq SDK / vLLM**, **Hugging Face Transformers (`yangheng/deberta-v3-base-absa-v1.1`)**, **HTML5/Tailwind**, **Vanilla JS (ES6+)**, **Chart.js**.

#### 4. Files & Folders Owned by Teammate 2
```
backend/app/
├── ml/
│   ├── llm/
│   │   ├── prompts.py             # Few-shot culinary safety system prompts
│   │   └── sop_client.py          # Groq / Ollama Llama 3.1 JSON client
│   └── absa/
│       ├── sentiment.py           # DeBERTa-v3 ABSA classifier
│       └── bayesian.py            # TrueSkill / Wilson score algorithm
├── services/
│   ├── ratio_solver.py            # SciPy MILP mass conservation solver
│   └── nutrition_scaler.py        # Headcount scaling & batch economics
└── routers/
    ├── ratio_router.py            # /api/v1/substitute/optimize-ratio
    ├── sop_router.py              # /api/v1/recipes/adapt-sop
    └── htv_router.py              # /api/v1/htv/analyze-feedback

frontend/ (Root Project Directory)
├── api-service.js                 # NEW: Async API bridge with offline fallback
├── index.html                     # MODIFIED: Radar canvas container & AI status badge
├── app.js                         # MODIFIED: Hook up API calls with fallback
└── styles.css                     # MODIFIED: Radar chart styling
```

#### 5. Required Datasets
- **SemEval / Amazon Food Review Benchmark Subset:** For validating ABSA aspect extraction.
- **Golden Culinary SOP Transformation Corpus (50 pairs):** In-context few-shot prompt tuning.

#### 6. Expected Deliverables
- SciPy linear programming ratio solver with exact mass conservation.
- Groq-powered Llama 3.1 cooking step generator returning $<400\text{ms}$ structured JSON.
- DeBERTa ABSA pipeline classifying review text into Taste, Texture, and Stability.
- Fully functional, resilient frontend with interactive 6-axis Radar Chart and zero offline regressions.

#### 7. Testing Responsibilities
- Pytest suite: `tests/test_ratio_math.py`, `tests/test_llm_schema.py`, and `tests/test_htv_absa.py`.
- Frontend offline resilience test: Verifying that killing the backend causes the UI to fall back to `recipes-data.js` without any errors.

#### 8. Dependencies on Teammate 1
- Consumes the database session and FastAPI router mount provided by Teammate 1. Can develop independently using mock data on Day 1.

---

## 4. Common API Contracts (Frozen Pydantic Schemas)

These schemas are the **non-negotiable contract** between Teammate 1 and Teammate 2:

### Contract 1: `POST /api/v1/substitute/optimize-ratio` (Owned by Teammate 2)
```python
class RatioOptimizationRequest(BaseModel):
    recipe_id: str = Field(..., example="paneer-butter-masala")
    missing_ingredient: str = Field(..., example="Fresh Cream")
    original_quantity: float = Field(..., example=100.0)
    original_unit: str = Field(..., example="g")
    persons: int = Field(1, ge=1, le=500)
    target_mode: str = Field("budget", regex="^(budget|calorie|vegan)$")

class RatioOptimizationResponse(BaseModel):
    recipe_id: str
    target_mode: str
    scaled_substitutes: list[dict] = Field(..., example=[
        {"name": "Soaked Cashew Paste", "grams": 60.0, "scaled_qty": "60g", "unit_cost": 0.30},
        {"name": "Warm Milk", "grams": 40.0, "scaled_qty": "40ml", "unit_cost": 0.05}
    ])
    cost_per_person: float = Field(..., example=1.15)
    savings_per_person: float = Field(..., example=0.95)
    savings_percentage: str = Field(..., example="45%")
    total_batch_cost: float = Field(..., example=4.60)
    calorie_delta_percentage: str = Field(..., example="-12%")
```

---

### Contract 2: `POST /api/v1/flavor/compatibility` (Owned by Teammate 1)
```python
class FlavorCompatibilityRequest(BaseModel):
    original_ingredient: str = Field(..., example="Fresh Cream")
    candidate_substitute: str = Field(..., example="Cashew Nut")

class FlavorCompatibilityResponse(BaseModel):
    original_ingredient: str
    candidate_substitute: str
    compatibility_score: float = Field(..., example=0.982)
    match_percentage: str = Field(..., example="98.2%")
    match_verdict: str = Field(..., example="Exceptional Aroma Parity")
    shared_volatile_compounds: list[str] = Field(..., example=[
        "delta-lactones (creamy)", "acetoin (buttery)", "benzaldehyde (nutty)"
    ])
    flavor_delta: dict = Field(..., example={
        "sweetness": "+2%", "fatty_mouthfeel": "-1%", "bitterness": "0%"
    })
```

---

### Contract 3: `POST /api/v1/sensory/predict-profile` (Owned by Teammate 1)
```python
class SensoryProfileRequest(BaseModel):
    substitute_name: str = Field(..., example="Cashew-Milk Puree")
    fat_percentage: float = Field(..., example=22.5)
    moisture_percentage: float = Field(..., example=64.0)
    simmer_temperature_c: float = Field(..., example=95.0)

class SensoryProfileResponse(BaseModel):
    substitute_name: str
    radar_metrics: dict = Field(..., example={
        "viscosity": 9.2,
        "creaminess": 9.5,
        "mouthfeel": 9.1,
        "sweetness_balance": 9.4,
        "thermal_stability": 9.8,
        "aftertaste_cleanliness": 9.6
    })  # 6-axis Radar Vector (0.0 to 10.0)
    curdling_risk: str = Field(..., example="Low")
    culinary_prep_tip: str = Field(..., example="Stable under prolonged simmer. No tempering required.")
```

---

### Contract 4: `POST /api/v1/recipes/adapt-sop` (Owned by Teammate 2)
```python
class RecipeAdaptationRequest(BaseModel):
    recipe_id: str = Field(..., example="paneer-butter-masala")
    original_steps: list[str] = Field(...)
    missing_ingredient: str = Field(..., example="Fresh Cream")
    replacement_name: str = Field(..., example="Cashew-Milk Velvet Puree")
    replacement_ratio_text: str = Field(..., example="60g Cashew Paste + 40g Warm Milk")

class RecipeAdaptationResponse(BaseModel):
    recipe_id: str
    adapted_steps: list[str] = Field(...)
    modified_step_indices: list[int] = Field(..., example=[2])
    culinary_safety_warning: Optional[str] = Field(..., example="Maintain gentle heat; fold puree slowly to lock emulsion.")
```

---

### Contract 5: `POST /api/v1/htv/analyze-feedback` (Owned by Teammate 2)
```python
class HtvFeedbackRequest(BaseModel):
    recipe_id: str = Field(..., example="paneer-butter-masala")
    author_name: str = Field(..., example="Chef Vikram")
    kitchen_name: str = Field(..., example="Saffron Cloud Kitchen")
    review_text: str = Field(..., example="Gravy had perfect gloss and thickness! Cashew made it slightly sweet, but guests loved it.")
    raw_rating: int = Field(5, ge=1, le=5)

class HtvFeedbackResponse(BaseModel):
    review_id: str
    is_authentic: bool = Field(..., example=True)
    aspect_sentiments: list[dict] = Field(..., example=[
        {"aspect": "Texture & Gloss", "sentiment": "Positive", "confidence": 0.98},
        {"aspect": "Taste & Sweetness", "sentiment": "Neutral / Advisory", "confidence": 0.84},
        {"aspect": "Thermal Stability", "sentiment": "Positive", "confidence": 0.96}
    ])
    new_bayesian_trust_score: float = Field(..., example=9.84)
    validation_badge: str = Field(..., example="HTV Verified Gold")
```

---

## 5. GitHub Branch Strategy & Workflow for 2 Teammates

To ensure zero merge conflicts during rapid development:

```
  main (Production Deployed on GitHub Pages & Cloud)
   │
   └── develop (Shared Integration & Staging Branch)
        │
        ├── feat/t1-backend-flavor-sensory   (Teammate 1 Branch)
        │    ├── feat/ws1-fastapi-db
        │    └── feat/ws3-flavorgraph-onnx
        │
        └── feat/t2-genai-ratio-htv-ui       (Teammate 2 Branch)
             ├── feat/ws2-llama-sop-groq
             └── feat/ws4-scipy-absa-frontend
```

### Git Protocols for the 2 Developers:
1. **Branch Isolation:** Teammate 1 works strictly in `backend/app/core/`, `backend/app/models/`, and `backend/app/ml/flavorgraph|sensory/`. Teammate 2 works strictly in `backend/app/ml/llm|absa/`, `backend/app/services/ratio_solver.py`, and `frontend/`. They will **never edit the same file simultaneously**.
2. **Commit Convention:**
   - `feat(t1-flavor): implement vector dot-product for aroma matching`
   - `feat(t2-ratio): implement SciPy MILP mass conservation solver`
   - `feat(t2-ui): add Chart.js 6-axis Sensory Radar chart to Swap Lab`
3. **Integration Gate:** Before merging into `develop`, both teammates run:
   ```bash
   pytest tests/
   ```
   Both test suites must pass 100%.

---

## 6. Daily Integration Timeline (Day 1 to Day 3)

```
       DAY 1: CONTRACTS & ENGINES             DAY 2: INTEGRATION & UI              DAY 3: QA & DEPLOYMENT
┌──────────────────────────────────────┐┌──────────────────────────────────┐┌───────────────────────────────────┐
│ T1: FastAPI + DB + FlavorGraph Vector││ T1: ONNX Sensory Regressor Engine││ T1: Dockerize & Cloud Deploy API │
│ T2: SciPy MILP Solver + Groq LLM SOP ││ T2: DeBERTa ABSA + Radar Canvas UI││ T2: Mobile QA + Thermal Print SOP │
└──────────────────────────────────────┘└──────────────────────────────────┘└───────────────────────────────────┘
```

- **Day 1 Goal:** Teammate 1 has FastAPI and FlavorGraph live. Teammate 2 has the SciPy ratio solver and Groq LLM SOP running.
- **Day 2 Goal:** Teammate 1 connects the ONNX sensory radar model. Teammate 2 renders the radar chart in the UI and connects ABSA sentiment.
- **Day 3 Goal:** Both teammates test end-to-end integration, verify offline resilience, and rehearse the 5-minute presentation script.

*End of 2-Teammate / 4-Workstream Blueprint.*
