import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

DATA_PATH = "data/Crop_recommendation (1).csv"
MODEL_PATH = "models/crop_recommendation_model.pkl"

# Load dataset
df = pd.read_csv(DATA_PATH)

print("Original dataset:", df.shape)
print("Columns:", df.columns.tolist())

# Target
target = "label"

X = df.drop(columns=[target])
y = df[target]

# Identify columns
categorical = X.select_dtypes(include=["object"]).columns.tolist()
numeric = X.select_dtypes(exclude=["object"]).columns.tolist()

print("Categorical columns:", categorical)
print("Numeric columns:", numeric)

# Preprocessing
preprocessor = ColumnTransformer([
    (
        "categorical",
        OneHotEncoder(handle_unknown="ignore"),
        categorical
    ),
    (
        "numeric",
        "passthrough",
        numeric
    )
])

# Model
model = RandomForestClassifier(
    n_estimators=300,
    random_state=42,
    n_jobs=-1
)

# Pipeline
pipeline = Pipeline([
    ("preprocessor", preprocessor),
    ("model", model)
])

# Split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

print("\nTraining Crop Recommendation model...")

# Train
pipeline.fit(X_train, y_train)

# Predict
predictions = pipeline.predict(X_test)

# Evaluate
print("\nAccuracy:", accuracy_score(y_test, predictions))

print("\nClassification Report:")
print(classification_report(y_test, predictions))

# Save
joblib.dump(pipeline, MODEL_PATH)

print("\nSaved:", MODEL_PATH)