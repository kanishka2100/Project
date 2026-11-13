"""Train and serialize FlavorShift AI Machine Learning models.

Models:
1. Sensory Rheology Multi-Output Regressor -> backend/data/sensory_model/sensory_regressor.joblib
2. Culinary Substitution Quality Predictor (XGBoost Regressor) -> backend/data/substitution_model/xgb_quality_model.json
3. FlavorGraph 300D Aroma Embeddings -> backend/data/flavorgraph_vectors/embeddings.npy & index.json
"""
import json
import os
import joblib
import numpy as np
from sklearn.ensemble import GradientBoostingRegressor, RandomForestRegressor
from sklearn.multioutput import MultiOutputRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_squared_error
import xgboost as xgb

# -------------------------------------------------------------
# 1. SENSORY RHEOLOGY MULTI-OUTPUT REGRESSOR
# Features: [fat%, moisture%, temp_c, protein%, carbs%]
# Targets: [viscosity, creaminess, mouthfeel, sweetness_balance, thermal_stability, aftertaste_cleanliness]
# -------------------------------------------------------------
print("Training Model 1: Sensory Rheology Multi-Output Regressor...")

np.random.seed(42)
n_samples = 1200

# Synthetic dataset grounded in food physics and rheology
fat = np.random.uniform(0.0, 85.0, n_samples)
moisture = np.random.uniform(5.0, 95.0, n_samples)
temp_c = np.random.uniform(20.0, 120.0, n_samples)
protein = np.random.uniform(0.0, 30.0, n_samples)
carbs = np.random.uniform(0.0, 80.0, n_samples)

X_sensory = np.column_stack([fat, moisture, temp_c, protein, carbs])

# Ground truth formulas with realistic non-linear food physics & noise
viscosity = np.clip(3.0 + 0.08 * fat + 0.05 * protein + 0.03 * carbs - 0.02 * (temp_c - 20) + np.random.normal(0, 0.15, n_samples), 1.0, 10.0)
creaminess = np.clip(2.5 + 0.09 * fat + 0.03 * protein - 0.01 * moisture + np.random.normal(0, 0.15, n_samples), 1.0, 10.0)
mouthfeel = np.clip(3.0 + 0.05 * fat + 0.04 * moisture + 0.03 * protein + np.random.normal(0, 0.15, n_samples), 1.0, 10.0)
sweetness_balance = np.clip(4.0 + 0.04 * carbs + 0.02 * fat - 0.01 * (temp_c - 20) + np.random.normal(0, 0.15, n_samples), 1.0, 10.0)
thermal_stability = np.clip(9.5 - 0.04 * np.maximum(0, temp_c - 75) + 0.03 * fat - 0.05 * np.maximum(0, protein - 15) + np.random.normal(0, 0.2, n_samples), 1.0, 10.0)
aftertaste_cleanliness = np.clip(8.5 - 0.02 * fat + 0.01 * moisture - 0.01 * protein + np.random.normal(0, 0.15, n_samples), 1.0, 10.0)

Y_sensory = np.column_stack([viscosity, creaminess, mouthfeel, sweetness_balance, thermal_stability, aftertaste_cleanliness])

sensory_model = MultiOutputRegressor(
    GradientBoostingRegressor(n_estimators=60, max_depth=4, random_state=42)
)
sensory_model.fit(X_sensory, Y_sensory)

sensory_preds = sensory_model.predict(X_sensory)
sensory_r2 = r2_score(Y_sensory, sensory_preds)
print(f"Sensory Model Trained! Overall R2 Score: {sensory_r2:.4f}")

out_sensory_dir = os.path.join(os.path.dirname(__file__), "backend", "data", "sensory_model")
os.makedirs(out_sensory_dir, exist_ok=True)
sensory_model_path = os.path.join(out_sensory_dir, "sensory_regressor.joblib")
joblib.dump(sensory_model, sensory_model_path)
print(f"Saved Sensory Model to {sensory_model_path}")


# -------------------------------------------------------------
# 2. CULINARY SUBSTITUTION QUALITY PREDICTOR (XGBoost)
# Features:
# [F_score, R_score, C_score, fat_delta, moisture_delta, protein_delta,
#  temp_sensitivity, acidity_buffer, emulsion_index, role_match]
# Target: Acceptance Quality Score (0 - 100)
# -------------------------------------------------------------
print("\nTraining Model 2: Culinary Substitution Quality Predictor (XGBoost)...")

n_pairs = 2500
f_score = np.random.uniform(0.4, 1.0, n_pairs)
r_score = np.random.uniform(0.4, 1.0, n_pairs)
c_score = np.random.uniform(0.1, 1.0, n_pairs)
fat_delta = np.random.exponential(10.0, n_pairs)
moisture_delta = np.random.exponential(15.0, n_pairs)
protein_delta = np.random.exponential(8.0, n_pairs)
temp_sens = np.random.uniform(0.0, 1.0, n_pairs)
acid_buf = np.random.uniform(0.0, 1.0, n_pairs)
emulsion_idx = np.random.uniform(0.3, 1.0, n_pairs)
role_match = np.random.choice([0.0, 0.5, 1.0], n_pairs, p=[0.05, 0.20, 0.75])

X_quality = np.column_stack([
    f_score, r_score, c_score, fat_delta, moisture_delta, protein_delta,
    temp_sens, acid_buf, emulsion_idx, role_match
])

# Realistic consumer taste panel quality score with penalties for lipid/moisture divergence
base_quality = (
    38.0 * f_score +
    38.0 * r_score +
    18.0 * c_score +
    6.0 * role_match +
    4.0 * emulsion_idx -
    0.15 * np.minimum(fat_delta, 40.0) -
    0.10 * np.minimum(moisture_delta, 50.0) -
    3.0 * temp_sens
)
y_quality = np.clip(base_quality + np.random.normal(0, 1.2, n_pairs), 10.0, 99.0)

X_train, X_test, y_train, y_test = train_test_split(X_quality, y_quality, test_size=0.2, random_state=42)

xgb_model = xgb.XGBRegressor(
    n_estimators=100,
    max_depth=5,
    learning_rate=0.08,
    subsample=0.85,
    colsample_bytree=0.85,
    random_state=42
)
xgb_model.fit(X_train, y_train)

test_preds = xgb_model.predict(X_test)
quality_r2 = r2_score(y_test, test_preds)
quality_rmse = np.sqrt(mean_squared_error(y_test, test_preds))
print(f"XGBoost Quality Model Trained! Test R2: {quality_r2:.4f}, RMSE: {quality_rmse:.2f} points")

out_sub_dir = os.path.join(os.path.dirname(__file__), "backend", "data", "substitution_model")
os.makedirs(out_sub_dir, exist_ok=True)
xgb_path = os.path.join(out_sub_dir, "xgb_quality_model.json")
xgb_model.save_model(xgb_path)
print(f"Saved XGBoost Quality Model to {xgb_path}")


# -------------------------------------------------------------
# 3. FLAVORGRAPH 300D EMBEDDING ARRAYS & INVENTORY INDEX
# -------------------------------------------------------------
print("\nGenerating Model 3: FlavorGraph 300D Aroma Embeddings...")

ingredients_list = [
    "heavy cream", "fresh cream", "whisked malai & hung curd (50/50)",
    "coconut cream (solidified top layer)", "soaked cashew & warm milk puree",
    "cashew cream (water-blended, vegan)", "silken tofu puree (light & low fat)",
    "butter", "ghee (clarified butter)", "refined coconut oil (neutral flavor)",
    "extra virgin olive oil", "paneer", "pressed firm organic tofu",
    "halloumi cheese", "whole milk ricotta salata", "eggs",
    "aquafaba (whipped chickpea brine)", "ground flaxseed egg (1:3 with warm water)",
    "pureed silken tofu", "all-purpose flour", "1-to-1 gluten-free flour blend",
    "superfine blanched almond flour", "cornstarch / arrowroot",
    "soy sauce", "tamari (gluten-free brewed soy)", "coconut aminos",
    "red / white miso dissolved in water", "lemon juice",
    "apple cider vinegar (raw & unfiltered)", "amchur (dry green mango powder)",
    "white wine vinegar", "garlic", "onion", "ginger", "tomato", "potato"
]

dim = 300
embeddings_matrix = np.zeros((len(ingredients_list), dim), dtype=np.float32)
ingredient_index = {}

# Seed base cluster vectors
cluster_centers = {
    "dairy": np.random.normal(0.5, 0.3, dim),
    "fat": np.random.normal(0.4, 0.4, dim),
    "plant_nut": np.random.normal(-0.2, 0.35, dim),
    "flour": np.random.normal(-0.4, 0.2, dim),
    "umami": np.random.normal(0.1, 0.5, dim),
    "acid": np.random.normal(-0.5, 0.4, dim),
}

for idx, ing in enumerate(ingredients_list):
    ingredient_index[ing.lower()] = idx
    # Pick primary and secondary clusters
    if any(w in ing for w in ["cream", "malai", "curd", "milk", "butter", "ghee", "paneer", "cheese"]):
        base = cluster_centers["dairy"] * 0.7 + cluster_centers["fat"] * 0.3
    elif any(w in ing for w in ["cashew", "coconut", "almond", "tofu", "flaxseed"]):
        base = cluster_centers["plant_nut"] * 0.7 + cluster_centers["fat"] * 0.3
    elif any(w in ing for w in ["flour", "cornstarch", "arrowroot"]):
        base = cluster_centers["flour"]
    elif any(w in ing for w in ["soy", "tamari", "aminos", "miso", "garlic", "onion"]):
        base = cluster_centers["umami"]
    elif any(w in ing for w in ["lemon", "vinegar", "amchur"]):
        base = cluster_centers["acid"]
    else:
        base = np.random.normal(0, 0.2, dim)

    vec = base + np.random.normal(0, 0.12, dim)
    vec = vec / np.linalg.norm(vec)  # L2 normalize
    embeddings_matrix[idx] = vec

out_fg_dir = os.path.join(os.path.dirname(__file__), "backend", "data", "flavorgraph_vectors")
os.makedirs(out_fg_dir, exist_ok=True)

npy_path = os.path.join(out_fg_dir, "embeddings.npy")
np.save(npy_path, embeddings_matrix)

index_path = os.path.join(out_fg_dir, "ingredient_index.json")
with open(index_path, "w", encoding="utf-8") as f:
    json.dump(ingredient_index, f, indent=2)

print(f"Saved {len(ingredients_list)} FlavorGraph 300D embeddings to {npy_path} and {index_path}!")
print("\nAll 3 Machine Learning Models successfully trained and serialized!")
