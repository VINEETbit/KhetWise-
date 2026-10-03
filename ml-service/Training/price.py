import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score

DATA_PATH = "data/crop_price_dataset (1).csv"
MODEL_PATH = "models/crop_price_model.pkl"

# Load dataset
df = pd.read_csv(DATA_PATH)

print("Original dataset:", df.shape)
print("Columns:", df.columns.tolist())

target = "avg_modal_price"

# Convert target to numeric
df[target] = pd.to_numeric(df[target], errors="coerce")

# Convert numeric columns to numeric
numeric_columns = [
    "avg_min_price",
    "avg_max_price",
    "change"
]

for column in numeric_columns:
    df[column] = pd.to_numeric(df[column], errors="coerce")

# Remove rows containing missing values
before = len(df)

df = df.dropna()

after = len(df)

print("Rows before cleaning:", before)
print("Rows after cleaning:", after)
print("Rows removed:", before - after)

# Features and target
X = df.drop(columns=[target])
y = df[target]

# Identify columns
categorical = X.select_dtypes(include=["object"]).columns.tolist()
numeric = X.select_dtypes(exclude=["object"]).columns.tolist()

print("\nCategorical:", categorical)
print("Numeric:", numeric)

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
model = RandomForestRegressor(
    n_estimators=300,
    random_state=42,
    n_jobs=-1
)

# Pipeline
pipeline = Pipeline([
    ("preprocessor", preprocessor),
    ("model", model)
])

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

print("\nTraining Crop Price model...")

# Train
pipeline.fit(X_train, y_train)

# Prediction
predictions = pipeline.predict(X_test)

# Evaluation
print("\nMAE:", mean_absolute_error(y_test, predictions))
print("R2 Score:", r2_score(y_test, predictions))

# Save
joblib.dump(pipeline, MODEL_PATH)

print("\nSaved:", MODEL_PATH)