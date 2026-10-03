import os
import joblib
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report


# =========================
# 1. Load Dataset
# =========================

DATA_PATH = "data/fertilizer_recommendation.csv"

df = pd.read_csv(DATA_PATH)

print("Dataset shape:", df.shape)
print("\nColumns:")
print(df.columns.tolist())


# =========================
# 2. Remove Missing Values
# =========================

df = df.dropna().copy()

print("\nShape after removing missing values:", df.shape)


# =========================
# 3. Separate Features/Target
# =========================

TARGET = "Recommended_Fertilizer"

X = df.drop(columns=[TARGET])
y = df[TARGET]

print("\nFertilizer classes:")
print(y.value_counts())


# =========================
# 4. Identify Column Types
# =========================

categorical_features = X.select_dtypes(
    include=["object", "category"]
).columns.tolist()

numerical_features = X.select_dtypes(
    include=["int64", "float64"]
).columns.tolist()

print("\nCategorical features:")
print(categorical_features)

print("\nNumerical features:")
print(numerical_features)


# =========================
# 5. Preprocessing
# =========================

preprocessor = ColumnTransformer(
    transformers=[
        (
            "cat",
            OneHotEncoder(
                handle_unknown="ignore"
            ),
            categorical_features,
        ),
        (
            "num",
            "passthrough",
            numerical_features,
        ),
    ]
)


# =========================
# 6. Random Forest Model
# =========================

model = RandomForestClassifier(
    n_estimators=300,
    random_state=42,
    n_jobs=-1,
    class_weight="balanced"
)


# =========================
# 7. Complete Pipeline
# =========================

pipeline = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        ("model", model),
    ]
)


# =========================
# 8. Train/Test Split
# =========================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print("\nTraining samples:", len(X_train))
print("Testing samples:", len(X_test))


# =========================
# 9. Train
# =========================

print("\nTraining fertilizer model...")

pipeline.fit(X_train, y_train)


# =========================
# 10. Evaluate
# =========================

y_pred = pipeline.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)

print("\n==============================")
print("FERTILIZER MODEL RESULTS")
print("==============================")

print(f"\nAccuracy: {accuracy:.4f}")

print("\nClassification Report:")
print(
    classification_report(
        y_test,
        y_pred
    )
)


# =========================
# 11. Save Model
# =========================

MODEL_DIR = "models"

os.makedirs(MODEL_DIR, exist_ok=True)

MODEL_PATH = os.path.join(
    MODEL_DIR,
    "fertilizer_model.pkl"
)

joblib.dump(
    pipeline,
    MODEL_PATH,
    compress=3
)

print("\nModel saved successfully:")
print(MODEL_PATH)