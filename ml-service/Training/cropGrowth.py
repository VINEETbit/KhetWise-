import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

DATA_PATH = "data/cropGrowth.csv"
MODEL_PATH = "models/crop_growth_model.pkl"

df = pd.read_csv(DATA_PATH)

print("Original dataset:", df.shape)
print("Columns:", df.columns.tolist())

# Fix possible non-numeric values
df["temp"] = pd.to_numeric(df["temp"], errors="coerce")
df["humidity"] = pd.to_numeric(df["humidity"], errors="coerce")
df["MOI"] = pd.to_numeric(df["MOI"], errors="coerce")

# Remove invalid rows
df = df.dropna()

print("Clean dataset:", df.shape)

target = "result"

X = df.drop(columns=[target])
y = df[target]

categorical = X.select_dtypes(include=["object"]).columns.tolist()
numeric = X.select_dtypes(exclude=["object"]).columns.tolist()

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

model = RandomForestClassifier(
    n_estimators=300,
    random_state=42,
    n_jobs=-1
)

pipeline = Pipeline([
    ("preprocessor", preprocessor),
    ("model", model)
])

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

print("\nTraining Crop Growth model...")

pipeline.fit(X_train, y_train)

predictions = pipeline.predict(X_test)

print("\nAccuracy:", accuracy_score(y_test, predictions))
print("\nClassification Report:")
print(classification_report(y_test, predictions))

joblib.dump(pipeline, MODEL_PATH)

print("\nSaved:", MODEL_PATH)