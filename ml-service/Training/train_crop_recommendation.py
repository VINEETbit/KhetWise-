import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report


DATA_PATH = "data/Crop_recommendation.csv"
MODEL_PATH = "models/crop_recommendation_model.pkl"

df = pd.read_csv(DATA_PATH)

print("Dataset:", df.shape)
print("Columns:", df.columns.tolist())

# Target
target = "label"

X = df.drop(columns=[target])
y = df[target]

categorical = X.select_dtypes(include=["object"]).columns.tolist()
numeric = X.select_dtypes(exclude=["object"]).columns.tolist()

preprocessor = ColumnTransformer([
    ("cat", OneHotEncoder(handle_unknown="ignore"), categorical),
    ("num", "passthrough", numeric)
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

print("\nTraining Crop Recommendation model...")

pipeline.fit(X_train, y_train)

predictions = pipeline.predict(X_test)

print("\nAccuracy:", accuracy_score(y_test, predictions))
print(classification_report(y_test, predictions))

joblib.dump(pipeline, MODEL_PATH)

print("\nSaved:", MODEL_PATH)