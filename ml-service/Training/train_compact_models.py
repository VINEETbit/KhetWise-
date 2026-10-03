"""Train the compact KhetWise models used by main.py.

Each metric is measured on a fixed 20% holdout before the final model is fit
to all available rows. The disease dataset is synthetic and is not suitable
for real-world diagnostic accuracy claims.
"""

from pathlib import Path

import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.metrics import accuracy_score, f1_score, mean_absolute_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "Data"
MODELS = ROOT / "models"
MODELS.mkdir(exist_ok=True)


def build_pipeline(features, classifier):
    categorical = features.select_dtypes(include=["object", "str", "category"]).columns.tolist()
    numeric = [column for column in features.columns if column not in categorical]
    preprocessor = ColumnTransformer(
        [
            ("categorical", OneHotEncoder(handle_unknown="ignore"), categorical),
            ("numeric", "passthrough", numeric),
        ]
    )
    estimator = (
        RandomForestClassifier(
            n_estimators=300,
            random_state=42,
            n_jobs=-1,
            class_weight="balanced",
        )
        if classifier
        else RandomForestRegressor(n_estimators=300, random_state=42, n_jobs=-1)
    )
    return Pipeline([("preprocessor", preprocessor), ("model", estimator)])


def train_compact(csv_name, target, selected_features, output_name, classifier):
    frame = pd.read_csv(DATA / csv_name).dropna(subset=[target, *selected_features])
    features = frame[selected_features]
    labels = frame[target]
    train_x, test_x, train_y, test_y = train_test_split(
        features,
        labels,
        test_size=0.2,
        random_state=42,
        stratify=labels if classifier else None,
    )
    validation_model = build_pipeline(train_x, classifier).fit(train_x, train_y)
    predictions = validation_model.predict(test_x)
    if classifier:
        print(
            f"{output_name}: accuracy={accuracy_score(test_y, predictions):.4f}, "
            f"macro_f1={f1_score(test_y, predictions, average='macro'):.4f}"
        )
    else:
        print(
            f"{output_name}: MAE={mean_absolute_error(test_y, predictions):.2f}, "
            f"R2={r2_score(test_y, predictions):.4f}"
        )

    final_model = build_pipeline(features, classifier).fit(features, labels)
    joblib.dump(final_model, MODELS / output_name, compress=3)


train_compact(
    "fertilizer_recommendation.csv",
    "Recommended_Fertilizer",
    ["Nitrogen_Level", "Phosphorus_Level", "Potassium_Level", "Soil_pH", "Crop_Growth_Stage"],
    "fertilizer_compact_model.pkl",
    classifier=True,
)
train_compact(
    "synthetic_disease_presence_30_questions.csv",
    "Disease_Present",
    [
        "Is there any other crop in the field showing similar spots?",
        "Are pruning and sanitation practices followed?",
        "Was the field irrigated from overhead sprinklers?",
        "Was there poor air circulation in the field?",
        "Was any fungicide recently applied?",
        "Is the farmer using resistant tomato varieties?",
    ],
    "disease_compact_model.pkl",
    classifier=True,
)
train_compact(
    "crop_price_dataset (1).csv",
    "avg_modal_price",
    ["commodity_name", "avg_min_price", "avg_max_price"],
    "price_compact_model.pkl",
    classifier=False,
)

growth = pd.read_csv(DATA / "cropGrowth.csv")
growth["humidity"] = pd.to_numeric(growth["humidity"].replace("D47", None), errors="coerce")
growth["humidity"] = growth["humidity"].fillna(growth["humidity"].median())
growth_features = growth.drop(columns=["result"])
growth_labels = growth["result"]
train_x, test_x, train_y, test_y = train_test_split(
    growth_features,
    growth_labels,
    test_size=0.2,
    random_state=42,
    stratify=growth_labels,
)
validation_model = build_pipeline(train_x, classifier=True).fit(train_x, train_y)
predictions = validation_model.predict(test_x)
print(
    "crop_growth_model_clean.pkl: "
    f"accuracy={accuracy_score(test_y, predictions):.4f}, "
    f"macro_f1={f1_score(test_y, predictions, average='macro'):.4f}"
)
joblib.dump(
    build_pipeline(growth_features, classifier=True).fit(growth_features, growth_labels),
    MODELS / "crop_growth_model_clean.pkl",
    compress=3,
)
