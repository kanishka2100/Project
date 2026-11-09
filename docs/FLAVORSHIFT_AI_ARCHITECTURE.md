# FlavorShift AI: Complete AI/ML Architecture Specification
**Document ID:** `FLAVORSHIFT_AI_ARCHITECTURE.md`  
**Classification:** Enterprise AI/ML Systems Architecture & Computational Gastronomy Specification  
**Platform:** FlavorShift AI — Intelligent Culinary Ingredient Substitution & Human Taste Validation  
**Author:** Senior AI/ML Systems Architect  
**Version:** 2.0 (Production Roadmap)  

---

## 1. Executive Summary & Compound AI System Topology

FlavorShift AI is a culinary intelligence platform designed to replace missing or expensive ingredients in home kitchens, cloud kitchens, and cafes without compromising authentic flavor, texture, or dish profitability.

A critical engineering failure in early-stage AI projects is the **"Monolithic LLM Anti-Pattern"**—relying purely on a generative Large Language Model to perform arithmetic, physics, and molecular chemistry calculations. Free-form LLMs:
1. **Hallucinate conversion ratios** (e.g., claiming 100g fresh cream equals 100g water or almond milk).
2. **Introduce unacceptable latency** (3–8 seconds per query).
3. **Incur continuous, unpredictable API billing costs**.
4. **Offer zero chemical or physical guarantees** (causing emulsion collapse, sauce curdling, or textural failure under high heat).

To eliminate these failure modes, FlavorShift AI is architected as a **Compound Heterogeneous AI System**:
- **Chemical & Volatile Aroma Matching:** Modeled via graph embeddings of volatile aroma molecules (**FlavorGraph / FlavorDB v2**).
- **Exact Ratios & Conservation of Mass:** Solved via linear programming (**SciPy Mixed-Integer Linear Programming - MILP**).
- **Mouthfeel & Curdling Rheology:** Predicted via tabular gradient boosting running on CPU (**XGBoost ONNX Runtime**).
- **Procedural Culinary Instructions:** Handled by a fine-tuned, instruction-constrained Small Language Model (**Meta Llama-3.1-8B-Instruct**).
- **Human Taste Validation (HTV):** Processed via Aspect-Based Sentiment Analysis (**DeBERTa-v3 ABSA**) and a Bayesian TrueSkill confidence updater.

```
                         COMPOUND AI PIPELINE TOPOLOGY
                         
   User Request: "Cooking Paneer Butter Masala, missing Fresh Cream, want budget savings"
                                          │
                                          ▼
   ┌─────────────────────────────────────────────────────────────────────────────┐
   │ 1. INGREDIENT RETRIEVAL & NORMALIZATION                                      │
   │    Model: BGE-Small-EN-v1.5 + spaCy Transformer Entity Parser               │
   │    Result: Normalizes "Fresh Cream" -> FDC ID #170859 (30% Dairy Fat)       │
   └──────────────────────────────────────┬──────────────────────────────────────┘
                                          │
                                          ▼
   ┌─────────────────────────────────────────────────────────────────────────────┐
   │ 2. MOLECULAR FLAVOR COMPATIBILITY FILTER                                    │
   │    Model: FlavorGraph 300D Volatile Aroma Vectors (FlavorDB v2)             │
   │    Result: Filters candidates by volatile chemical overlap (98.2% match)    │
   └──────────────────────────────────────┬──────────────────────────────────────┘
                                          │
                                          ▼
   ┌─────────────────────────────────────────────────────────────────────────────┐
   │ 3. SENSORY & THERMAL STABILITY MODEL                                        │
   │    Model: Multi-Output XGBoost Regressor (ONNX Runtime CPU)                 │
   │    Result: Predicts 6-axis radar metrics and curdling risk under simmer     │
   └──────────────────────────────────────┬──────────────────────────────────────┘
                                          │
                                          ▼
   ┌─────────────────────────────────────────────────────────────────────────────┐
   │ 4. EXACT RATIO & COST OPTIMIZER                                             │
   │    Algorithm: Mixed-Integer Linear Programming (SciPy MILP / OR-Tools)      │
   │    Result: Solves exact 60g Cashew + 40g Milk ratio with -55% food cost     │
   └──────────────────────────────────────┬──────────────────────────────────────┘
                                          │
                                          ▼
   ┌─────────────────────────────────────────────────────────────────────────────┐
   │ 5. CONTEXTUAL SOP RE-WRITER                                                 │
   │    Model: Fine-Tuned Meta Llama-3.1-8B-Instruct (4-bit QLoRA via vLLM)      │
   │    Result: Rewrites steps 2 & 3 with blending and low-heat folding methods  │
   └──────────────────────────────────────┬──────────────────────────────────────┘
                                          │
                                          ▼
   ┌─────────────────────────────────────────────────────────────────────────────┐
   │ 6. HUMAN TASTE VALIDATION (HTV) ANALYTICS                                   │
   │    Model: DeBERTa-v3-base-ABSA + Bayesian TrueSkill Confidence Engine       │
   │    Result: Updates public community validation score from user review       │
   └─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Model Classification Matrix: Strategy Decomposition

To balance development velocity, accuracy, and operational cost, every model is categorized into one of three execution strategies:

```
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                               MODEL STRATEGY DECOMPOSITION                                     │
├───────────────────────────────┬────────────────────────────────┬───────────────────────────────┤
│ 1. INTEGRATED (Pre-trained)   │ 2. FINE-TUNED (Adapted)        │ 3. TRAINED FROM SCRATCH       │
├───────────────────────────────┼────────────────────────────────┼───────────────────────────────┤
│ • BGE-Small-EN-v1.5           │ • Meta Llama-3.1-8B-Instruct   │ • Multi-Output XGBoost        │
│   (Ingredient Dense Search)   │   (Kitchen SOP Step Rewriting) │   Sensory Regressor (ONNX)    │
│ • FlavorGraph 300D Embeddings │ • DeBERTa-v3-base-ABSA         │ • Bayesian TrueSkill Engine   │
│   (Volatile Aroma Pairing)    │   (Aspect-Based Taste Scorer)  │   (Dynamic HTV Trust Scoring) │
│ • SciPy MILP Solver           │                                │ • SciPy Mass Matrix Formulator│
│   (Exact Conservation Math)   │                                │   (Linear Constraint Solver)  │
│ • Chronos-T5-Tiny (Amazon)    │                                │                               │
│   (Wholesale Cost Forecasting)│                                │                               │
└───────────────────────────────┴────────────────────────────────┴───────────────────────────────┘
```

---

## 3. Comprehensive Model Comparison Table

Below is the comparative evaluation of all candidate AI/ML models across the functional domains of FlavorShift AI:

| Model Name | Primary Purpose | GitHub Repository | Hugging Face Link | License | Dataset Requirements | Training / Tuning Req. | Hardware Req. | Deployment Options | Implementation Difficulty | Advantages & Limitations |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Meta Llama-3.1-8B-Instruct** | Contextual Substitution & Cooking SOP Rewriting | [`meta-llama/llama3`](https://github.com/meta-llama/llama3) | [`meta-llama/Llama-3.1-8B-Instruct`](https://huggingface.co/meta-llama/Llama-3.1-8B-Instruct) | Meta Llama 3.1 Community License | None for Zero-Shot; 3k pairs for LoRA | **Zero-Shot with Structured JSON Schema** (Fine-tuning optional) | 1x GPU with $\ge 8\text{GB}$ VRAM (4-bit), or 16GB CPU RAM (GGUF) | Local via vLLM, Ollama, or Serverless API (Groq, Together.ai) | **Medium** | **Adv:** State-of-the-art culinary reasoning, 128k context, zero-shot instruction following.<br>**Lim:** High compute footprint compared to classical models. |
| **Mistral-7B-Instruct-v0.3** | Alternative SOP Rewriter | [`mistralai/mistral-src`](https://github.com/mistralai/mistral-src) | [`mistralai/Mistral-7B-Instruct-v0.3`](https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.3) | Apache 2.0 | None for Zero-Shot | **Zero-Shot** Prompting | 1x GPU ($\ge 6\text{GB}$ VRAM 4-bit) or 16GB RAM | Local via Ollama, vLLM, Hugging Face TGI | **Medium** | **Adv:** True Apache 2.0 license, fast sliding-window inference.<br>**Lim:** Slightly less structured JSON compliance than Llama 3.1. |
| **BGE-Large-EN-v1.5 / Small** | Dense Vector Retrieval for Ingredients | [`FlagOpen/FlagEmbedding`](https://github.com/FlagOpen/FlagEmbedding) | [`BAAI/bge-large-en-v1.5`](https://huggingface.co/BAAI/bge-large-en-v1.5) | MIT License | Pre-indexed USDA / FoodDB strings | **Zero (Pre-trained)** | CPU (Runs in $<5\text{ms}$) | Local in-memory or embedded Qdrant / Chroma | **Very Low** | **Adv:** Top MTEB benchmark, zero training required, instant semantic matching.<br>**Lim:** Captures semantic text similarity, not chemical volatile interaction. |
| **FlavorGraph (Pre-computed Embeddings)** | Molecular Food Aroma & Compound Pairing | [`ku-dmis/FlavorGraph`](https://github.com/ku-dmis/FlavorGraph) | Pre-computed embeddings available on GitHub | MIT License | FlavorDB v2 + FooDB graph nodes | **Zero (Use published Node2Vec embeddings)** | Standard CPU ($<200\text{MB}$ RAM) | In-memory NumPy cosine similarity matrix | **Low** | **Adv:** Real volatile aroma chemistry, zero GNN training needed, $<1\text{ms}$ latency.<br>**Lim:** Static ingredient vocabulary (1,561 ingredients); out-of-vocabulary needs fallback. |
| **Custom GNN (GATv2 / PyG)** | Graph Link Prediction on Food Chemistry | [`pyg-team/pytorch_geometric`](https://github.com/pyg-team/pytorch_geometric) | N/A (Custom architecture) | MIT License | FlavorDB v2 graph raw tables | **Full training required from scratch** | 1x GPU with $\ge 8\text{GB}$ VRAM | Custom PyTorch server | **High** | **Adv:** Dynamically adds new molecules.<br>**Lim:** High maintenance, redundant when pre-computed embeddings exist. |
| **Multi-Output XGBoost / LightGBM** | Sensory Profiling (Viscosity, Mouthfeel, Curdling) | [`dmlc/xgboost`](https://github.com/dmlc/xgboost) | N/A (Standard tabular format) | Apache 2.0 | USDA FDC chemical proximate tables | Supervised fit on tabular dataset (~30 seconds) | Standard CPU ($<15\text{MB}$ memory) | ONNX Runtime on CPU ($<2\text{ms}$) | **Low to Medium** | **Adv:** Deterministic, zero hallucination, explainable feature importance.<br>**Lim:** Requires curated tabular chemical compositions. |
| **SciPy MILP (Linear Programming)** | Exact Quantity Ratios & Calorie Optimization | [`scipy/scipy`](https://github.com/scipy/scipy) | N/A (Algorithmic solver) | BSD-3-Clause | Standard nutritional macro matrix | **Zero (Pure mathematical solver)** | Minimal CPU ($<5\text{MB}$) | Native Python in FastAPI worker | **Very Low** | **Adv:** 100% mathematical accuracy, guaranteed optimal solution, zero training.<br>**Lim:** Solves linear constraints only (cannot generate natural language). |
| **PyABSA (`deberta-v3-base-absa`)** | Aspect-Based Kitchen Feedback Sentiment | [`yangheng95/PyABSA`](https://github.com/yangheng95/PyABSA) | [`yangheng/deberta-v3-base-absa-v1.1`](https://huggingface.co/yangheng/deberta-v3-base-absa-v1.1) | MIT License | None (Pre-trained on restaurant/aspect corpora) | **Zero (Pre-trained off-the-shelf)** | CPU via ONNX Runtime or 2GB VRAM GPU | Local via Hugging Face Pipeline / ONNX | **Low** | **Adv:** Extracts positive/negative per aspect (taste vs texture), zero fine-tuning.<br>**Lim:** In rare cases, struggles with regional Indian culinary jargon. |
| **Amazon Chronos-T5-Tiny** | Wholesale Commodity Price Forecasting | [`amazon-science/chronos-forecasting`](https://github.com/amazon-science/chronos-forecasting) | [`amazon/chronos-t5-tiny`](https://huggingface.co/amazon/chronos-t5-tiny) | Apache 2.0 | AGMARKNET / BLS price series | **Zero (Zero-shot time-series predictor)** | Standard CPU ($<20\text{MB}$ weights) | Local Hugging Face pipeline on CPU | **Medium** | **Adv:** Pretrained on billions of time-series points, zero-shot forecasting.<br>**Lim:** Overkill if weekly static pricing tables suffice. |

---

## 4. Deep-Dive: Why Our Selected Choices Beat Alternatives

### Decision 1: FlavorGraph Pre-computed Embeddings vs. Training a Custom GNN from Scratch
- **Alternative:** Building a custom PyTorch Geometric Graph Attention Network (GATv2), parsing raw chemical databases, and training link prediction for weeks.
- **Why Pre-computed FlavorGraph is Better:**
  1. The researchers at Korea University (Nature Scientific Reports) have already computed, validated, and published normalized 300-dimensional Node2Vec embeddings across 1,561 food ingredients and 18,000+ chemical flavor compounds.
  2. Loading these embeddings as a single $1.8\text{MB}$ `.npy` file directly into memory on server startup eliminates GPU requirements.
  3. Calculating the volatile aroma match between *Fresh Cream* and *Cashew Puree* becomes a single vectorized dot product executing in **$0.3\text{ ms}$**.

### Decision 2: SciPy MILP vs. Neural Networks for Substitution Ratios
- **Alternative:** Training a neural network regressor to predict how many grams of cashews and water to add when replacing cream.
- **Why SciPy Linear Programming is Better:**
  1. Culinary substitution ratios are governed by linear conservation of mass:
     $$\text{Fat}_{\text{cashew}} \cdot x_1 + \text{Fat}_{\text{milk}} \cdot x_2 = \text{Fat}_{\text{cream}} \cdot M$$
     $$\text{Water}_{\text{cashew}} \cdot x_1 + \text{Water}_{\text{milk}} \cdot x_2 = \text{Water}_{\text{cream}} \cdot M$$
  2. Neural networks approximate these numbers with random errors (e.g., returning 63.2g or 58.1g inconsistently).
  3. SciPy's `milp` solves the system of linear equations in **$< 1\text{ ms}$ with $100\%$ mathematical precision**, guaranteeing that the sauce emulsion balance matches the original recipe exactly.

### Decision 3: Pydantic-Constrained Llama-3.1-8B vs. Training an SLM from Scratch
- **Alternative:** Fine-tuning an open-source model from scratch or using an unconstrained LLM.
- **Why Constrained Pre-trained Llama-3.1-8B is Better:**
  1. Llama-3.1-8B possesses extensive physical commonsense knowledge from its web-scale pre-training corpus.
  2. By pairing it with **Pydantic Structured Output / JSON Schema Enforcement**, we eliminate formatting errors and hallucinations:
     ```python
     class AdaptedRecipeSOP(BaseModel):
         step_number: int
         adapted_instruction: str
         technique: str
         curdling_prevention_warning: Optional[str]
     ```
  3. Deployable on a local consumer GPU via Ollama or accessed via fast serverless inference endpoints (e.g., Groq at $\approx \$0.05$ per million tokens, costing $<\$1$ for hundreds of thousands of requests).

### Decision 4: Pre-trained `yangheng/deberta-v3-base-absa-v1.1` vs. Custom Sentiment Models
- **Alternative:** Manually annotating thousands of kitchen reviews and training a custom classifier.
- **Why Pre-trained PyABSA is Better:**
  1. The `yangheng/deberta-v3-base-absa-v1.1` checkpoint is already pre-trained and fine-tuned on SemEval restaurant/food review benchmarks.
  2. It accepts any aspect string (`["taste", "texture", "stability", "ease"]`) out-of-the-box and returns positive, neutral, or negative classifications with calibrated probabilities.
  3. Implementation requires under 10 lines of Python code using Hugging Face's pipeline, saving weeks of labeling and verification.

---

## 5. Backend System Architecture & Technology Stack

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        BACKEND APPLICATION CONTAINER (FastAPI)                         │
│                                                                                        │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │                               HTTP API ROUTERS                                   │  │
│  │   /substitute/optimize-ratio  •  /flavor/compatibility  •  /sensory/predict      │  │
│  │   /recipes/adapt-sop          •  /htv/analyze-feedback  •  /health               │  │
│  └──────────┬───────────────────────────┬──────────────────────────┬────────────────┘  │
│             │                           │                          │                   │
│             ▼                           ▼                          ▼                   │
│  ┌──────────────────────┐    ┌──────────────────────┐   ┌───────────────────────────┐  │
│  │   MEMORY STORAGE     │    │   INFERENCE RUNTIME  │   │     DATABASE & CACHE      │  │
│  │  • FlavorGraph .npy  │    │  • ONNX Runtime(CPU) │   │  • Redis Cache (LRU Hot)  │  │
│  │  • FDC Nutrient Map  │    │  • SciPy MILP Solver │   │  • PostgreSQL / SQLite    │  │
│  │  • Recipe SOP Graphs │    │  • vLLM / Groq Client│   │  • SQLAlchemy 2.0 ORM     │  │
│  └──────────────────────┘    └──────────────────────┘   └───────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Backend Directory Layout
```
backend/
├── app/
│   ├── core/
│   │   ├── config.py             # Pydantic BaseSettings (DB URLs, API keys)
│   │   ├── database.py           # SQLAlchemy async engine & sessionmaker
│   │   └── security.py           # Rate limiting & CORS middleware
│   ├── models/                   # Relational ORM Entities
│   │   ├── recipe.py             # Recipe metadata, base costs, base macros
│   │   └── validation.py         # HTV kitchen trial feedback & aspect scores
│   ├── schemas/                  # Frozen Pydantic Data Contracts
│   │   ├── ratio.py              # Substitution ratio input/output
│   │   ├── flavor.py             # Volatile aroma match & chemical delta
│   │   ├── sensory.py            # 6-axis radar coordinates & curdling risk
│   │   ├── sop.py                # Adapted cooking steps & safety warnings
│   │   └── htv.py                # Aspect sentiment & Bayesian score
│   ├── services/                 # Core Algorithmic Logic
│   │   ├── ratio_solver.py       # SciPy MILP linear mass conservation
│   │   └── cache_service.py      # Redis sub-5ms serialization
│   ├── ml/                       # Machine Learning Inference Engines
│   │   ├── flavorgraph/          # Vectorized aroma dot-product engine
│   │   ├── sensory/              # ONNX multi-output rheology predictor
│   │   ├── llm/                  # Llama-3.1 structured JSON client
│   │   └── absa/                 # DeBERTa-v3 aspect extraction pipeline
│   ├── routers/                  # Decoupled Endpoint Handlers
│   │   ├── ratio_router.py
│   │   ├── flavor_router.py
│   │   ├── sensory_router.py
│   │   ├── sop_router.py
│   │   └── htv_router.py
│   └── main.py                   # FastAPI application factory
├── tests/                        # Comprehensive Pytest Suite
├── Dockerfile                    # Multi-stage production container
└── requirements.txt
```

---

## 6. Formal API Contracts (Pydantic Schemas)

### Contract 1: `POST /api/v1/substitute/optimize-ratio`
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
    total_batch_cost: float = Field(..., example=57.50)
    calorie_delta_percentage: str = Field(..., example="-12%")
```

### Contract 2: `POST /api/v1/flavor/compatibility`
```python
class FlavorCompatibilityRequest(BaseModel):
    original_ingredient: str = Field(..., example="Fresh Cream")
    candidate_substitute: str = Field(..., example="Cashew Nut")

class FlavorCompatibilityResponse(BaseModel):
    original_ingredient: str
    candidate_substitute: str
    compatibility_score: float = Field(..., example=0.982)  # 98.2%
    match_category: str = Field(..., example="Exceptional Flavor Parity")
    shared_aroma_compounds: list[str] = Field(..., example=[
        "delta-lactones (creamy)", "acetoin (buttery)", "benzaldehyde (nutty)"
    ])
    flavor_delta: dict = Field(..., example={
        "sweetness": "+2%", "fatty_mouthfeel": "-1%", "bitterness": "0%"
    })
```

### Contract 3: `POST /api/v1/sensory/predict-profile`
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
    })  # 6-axis Radar Chart Vector (0.0 to 10.0)
    curdling_risk_level: str = Field(..., example="Low")
    culinary_action_tip: str = Field(..., example="Stable under prolonged simmer. No tempering required.")
```

### Contract 4: `POST /api/v1/recipes/adapt-sop`
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

### Contract 5: `POST /api/v1/htv/analyze-feedback`
```python
class HtvFeedbackRequest(BaseModel):
    recipe_id: str = Field(..., example="paneer-butter-masala")
    author_name: str = Field(..., example="Chef Vikram")
    kitchen_name: str = Field(..., example="Saffron Cloud Kitchen")
    review_text: str = Field(..., example="Gravy had perfect gloss and thickness! Cashew made it slightly sweet, but guests loved it.")
    raw_rating: int = Field(5, ge=1, le=5)

class HtvFeedbackResponse(BaseModel):
    review_id: str
    is_spam: bool = Field(..., example=False)
    aspect_sentiments: list[dict] = Field(..., example=[
        {"aspect": "Texture & Gloss", "sentiment": "Positive", "confidence": 0.98},
        {"aspect": "Taste & Sweetness", "sentiment": "Neutral / Advisory", "confidence": 0.82},
        {"aspect": "Thermal Stability", "sentiment": "Positive", "confidence": 0.95}
    ])
    new_bayesian_trust_score: float = Field(..., example=9.82)
    published_badge: str = Field(..., example="HTV Verified Gold")
```

---

## 7. Connecting AI to the Existing Frontend (Offline-First Bridge)

The live deployed application on GitHub Pages ([`https://kanishka2100.github.io/Project/`](https://kanishka2100.github.io/Project/)) must **never break**.

We implement a **Progressive Enhancement & Offline-Resilient Bridge**:

```
                       FRONTEND ASYNC BRIDGE ARCHITECTURE
                       
                           User Selects Ingredient
                                     │
                                     ▼
                      Check Backend Health Status
                  GET /api/v1/health (1.5s AbortController)
                                     │
                     ┌───────────────┴───────────────┐
                     ▼                               ▼
               [API ONLINE]                    [API OFFLINE]
     • Call FastAPI endpoints           • Read local recipes-data.js
     • Render live 6-axis Radar Chart   • Display cached static swaps
     • Stream Llama 3 SOP steps         • Badge: "🛡️ Heuristic Mode"
     • Badge: "⚡ Neural Engine Live"   • ZERO user crash or freeze!
```

---

## 8. Hardware & Infrastructure Requirements

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              INFRASTRUCTURE MATRIX                                     │
├───────────────────────┬───────────────────────────────┬────────────────────────────────┤
│ ENVIRONMENT           │ HARDWARE SPECIFICATION        │ ESTIMATED MONTHLY COST         │
├───────────────────────┼───────────────────────────────┼────────────────────────────────┤
│ **Development**       │ 4-Core CPU, 16GB RAM          │ **$0.00**                      │
│ (Local Machine)       │ (No dedicated GPU required)   │ (Runs locally on workstation)  │
├───────────────────────┼───────────────────────────────┼────────────────────────────────┤
│ **Production Tier A** │ Frontend: GitHub Pages CDN    │ **$5.00 – $7.00 / month**      │
│ (Recommended)         │ Backend: 1-Core CPU (Render)  │ (Covers up to 50,000 requests/mo│
│                       │ LLM: Groq Serverless API      │  with sub-400ms latency)       │
├───────────────────────┼───────────────────────────────┼────────────────────────────────┤
│ **Production Tier B** │ Dedicated AWS EC2 G5.xlarge   │ **$75.00 – $120.00 / month**   │
│ (Self-Hosted GPU)     │ (NVIDIA A10G 24GB VRAM)       │ (Enterprise isolated compute)  │
└───────────────────────┴───────────────────────────────┴────────────────────────────────┘
```

---

## 9. Phased Implementation Roadmap

```
  PHASE 1: FOUNDATION (Days 1–3)         PHASE 2: INTELLIGENCE (Days 4–7)
┌─────────────────────────────────┐   ┌─────────────────────────────────┐
│ • FastAPI Backend Scaffolding   │   │ • FlavorGraph Vector Dot-Product│
│ • SciPy MILP Exact Ratio Solver │   │ • XGBoost Sensory ONNX Model    │
│ • Pydantic Schema Contracts     │   │ • Chart.js 6-Axis Radar Canvas  │
│ • Frontend api-service.js Bridge│   │ • Redis Hot Query Cache         │
└─────────────────────────────────┘   └─────────────────────────────────┘
                 │                                     │
                 ▼                                     ▼
  PHASE 3: GEN-AI & SOPs (Days 8–10)    PHASE 4: HTV & PRODUCTION (Days 11–14)
┌─────────────────────────────────┐   ┌─────────────────────────────────┐
│ • Llama-3.1-8B Structured Output│   │ • DeBERTa-v3 ABSA Sentiment     │
│ • Groq Cloud / vLLM Connector   │   │ • Bayesian TrueSkill Trust Score│
│ • Culinary Safety Warnings      │   │ • Multi-Stage Dockerfile        │
│ • Streaming Step Rewriter UI    │   │ • Cloud Deploy & GitHub Pages QA│
└─────────────────────────────────┘   └─────────────────────────────────┘
```

---

## 10. Verification & Quality Gates

| Pipeline Stage | Evaluation Metric | Ground Truth Benchmark | Acceptance Threshold |
| :--- | :--- | :--- | :--- |
| **Substitution Retrieval** | Mean Reciprocal Rank (MRR@5) & Precision@3 | Culinary SubDB & Professional Chef Consensus | $\text{MRR@5} \ge 0.88$ |
| **Flavor Compatibility** | Pearson Correlation ($r$) with Gas Chromatography | FlavorDB GC-MS Volatile Aroma Profiles | $r \ge 0.82$ |
| **Sensory Prediction** | Root Mean Squared Error (RMSE) on Viscosity & Sweetness | Calibrated Quantitative Descriptive Analysis (QDA) Panel Data | $\text{RMSE} \le 0.45$ (on 10-point scale) |
| **SOP Re-Writing** | Culinary Correctness Score & BLEU / ROUGE-L | Double-Blind Chef Review on Curdling/Burning Risk | $0\%$ Curdling Violations, ROUGE-L $\ge 0.65$ |
| **HTV Aspect Sentiment** | Macro F1-Score & Accuracy | Human Annotated Kitchen Review Corpus | $\text{Macro F1} \ge 0.91$ |

*End of Architecture Specification.*
