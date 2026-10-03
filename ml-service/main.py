from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

import joblib
import pandas as pd
import os
import math


# =========================================================
# KhetWise ML API
# =========================================================

app = FastAPI(
    title="KhetWise ML API",
    description="Machine Learning API for KhetWise Agriculture Platform",
    version="1.0.0",
)


# =========================================================
# CORS
# =========================================================
# Allows your React/Vite frontend to communicate with
# FastAPI during local development.

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# PATHS
# =========================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "models")


# =========================================================
# MODEL LOADER
# =========================================================

def load_model(filename: str):
    """
    Load a trained joblib model from the backend/models folder.
    """

    path = os.path.join(MODEL_DIR, filename)

    if not os.path.exists(path):
        raise FileNotFoundError(
            f"Model file not found: {path}"
        )

    try:
        model = joblib.load(path)

        print(f"Loaded model: {filename}")

        return model

    except Exception as e:
        raise RuntimeError(
            f"Could not load model '{filename}': {str(e)}"
        )


# =========================================================
# LOAD ALL MODELS
# =========================================================

crop_model = load_model(
    "crop_recommendation_model.pkl"
)

fertilizer_model = load_model(
    "fertilizer_compact_model.pkl"
)

price_model = load_model(
    "price_compact_model.pkl"
)

disease_model = load_model(
    "disease_compact_model.pkl"
)

growth_model = load_model(
    "crop_growth_model_clean.pkl"
)


# =========================================================
# MODEL FEATURE HELPER
# =========================================================

def get_model_features(model):
    """
    Get the exact feature names used while training the model.
    """

    if not hasattr(model, "feature_names_in_"):
        raise HTTPException(
            status_code=500,
            detail=(
                "This trained model does not contain "
                "'feature_names_in_'. The model must be retrained "
                "using a pandas DataFrame with named columns, or "
                "the backend must be configured with the training "
                "feature names."
            ),
        )

    return list(model.feature_names_in_)


def get_model_input_types(model):
    """Return categorical options and numeric feature names from a pipeline."""
    categorical = {}
    numeric = set()
    preprocessor = getattr(model, "named_steps", {}).get("preprocessor")
    if preprocessor is None:
        return categorical, numeric

    for name, transformer, columns in preprocessor.transformers_:
        if name == "remainder" or transformer == "drop":
            continue
        if hasattr(transformer, "categories_"):
            for column, values in zip(columns, transformer.categories_):
                categorical[column] = {str(value) for value in values}
        elif transformer != "passthrough":
            numeric.update(columns)
        else:
            numeric.update(columns)
    return categorical, numeric


# =========================================================
# INPUT PREPARATION
# =========================================================

def prepare_input(data: dict, model):
    """
    Prepare frontend JSON data for the trained ML model.

    The frontend can send additional fields, but only the exact
    fields used during model training are passed to the model.
    """

    if not isinstance(data, dict):
        raise HTTPException(
            status_code=400,
            detail="Request body must be a JSON object.",
        )

    required_features = get_model_features(model)
    categorical_features, numeric_features = get_model_input_types(model)

    # -----------------------------------------------------
    # Check for missing fields
    # -----------------------------------------------------

    missing_features = []

    for feature in required_features:

        if feature not in data:
            missing_features.append(feature)
            continue

        value = data[feature]

        if value is None:
            missing_features.append(feature)
            continue

        if isinstance(value, str) and value.strip() == "":
            missing_features.append(feature)

    if missing_features:

        raise HTTPException(
            status_code=400,
            detail={
                "message": "Missing required features.",
                "required_features": required_features,
                "missing_features": missing_features,
            },
        )

    # -----------------------------------------------------
    # Keep exact training feature order
    # -----------------------------------------------------

    input_data = {}

    for feature in required_features:

        value = data[feature]

        # Remove accidental whitespace from strings.
        if isinstance(value, str):
            value = value.strip()

        if feature in categorical_features and str(value) not in categorical_features[feature]:
            allowed = sorted(categorical_features[feature])
            raise HTTPException(
                status_code=422,
                detail=f"Unsupported value for {feature}. Choose one of: {', '.join(allowed)}",
            )

        if feature in numeric_features:
            if isinstance(value, bool):
                raise HTTPException(status_code=422, detail=f"{feature} must be a number.")
            try:
                value = float(value)
            except (TypeError, ValueError):
                raise HTTPException(status_code=422, detail=f"{feature} must be a number.")
            if not math.isfinite(value):
                raise HTTPException(status_code=422, detail=f"{feature} must be a finite number.")

        input_data[feature] = value

    # -----------------------------------------------------
    # Create DataFrame
    # -----------------------------------------------------

    try:

        df = pd.DataFrame(
            [input_data],
            columns=required_features,
        )

        # sklearn's numeric transformers require real numeric dtypes. Explicitly
        # coerce here so mixed JSON/string inputs cannot leak object arrays into
        # NumPy's NaN checks during inference.
        for feature in numeric_features:
            df[feature] = pd.to_numeric(df[feature], errors="coerce").astype("float64")
            if df[feature].isna().any():
                raise HTTPException(
                    status_code=422,
                    detail=f"{feature} must be a valid finite number.",
                )

        for feature in categorical_features:
            df[feature] = df[feature].astype(str).astype(object)

    except Exception as e:

        if isinstance(e, HTTPException):
            raise

        raise HTTPException(
            status_code=400,
            detail=f"Could not prepare model input: {str(e)}",
        )

    return df


# =========================================================
# SAFE NUMBER CONVERSION
# =========================================================

def safe_float(value):
    """
    Convert numpy/Python numeric values into JSON-safe float.
    """

    try:

        number = float(value)

        if not math.isfinite(number):
            raise ValueError("Prediction is not a finite number.")

        return number

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Model returned an invalid numeric prediction: {str(e)}",
        )


# =========================================================
# HOME / HEALTH CHECK
# =========================================================

@app.get("/")
def home():

    return {
        "message": "KhetWise ML API is running!",
        "status": "success",
        "version": "1.0.0",
        "models": [
            "crop",
            "fertilizer",
            "yield",
            "price",
            "disease",
            "growth",
        ],
    }


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/health")
def health():

    return {
        "status": "healthy",
        "message": "KhetWise ML API is ready.",
    }


# =========================================================
# MODEL FEATURES
# =========================================================
#
# IMPORTANT:
# This endpoint is used by the React frontend to automatically
# discover the exact features expected by each trained model.
#
# There must be ONLY ONE /model-features endpoint.
# =========================================================

@app.get("/model-features")
def model_features():

    try:

        return {
            "crop": get_model_features(crop_model),
            "fertilizer": get_model_features(fertilizer_model),
            "yield": ["Production", "Area"],
            "price": get_model_features(price_model),
            "disease": get_model_features(disease_model),
            "growth": get_model_features(growth_model),
        }

    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Could not read model features: {str(e)}",
        )


# =========================================================
# 1. CROP RECOMMENDATION
# =========================================================

@app.post("/predict/crop")
def predict_crop(data: dict):

    try:

        df = prepare_input(
            data,
            crop_model,
        )

        prediction = crop_model.predict(df)[0]
        probabilities = crop_model.predict_proba(df)[0]
        classes = crop_model.classes_
        recommendations = sorted(
            [
                {"crop": str(label), "score": safe_float(score)}
                for label, score in zip(classes, probabilities)
            ],
            key=lambda item: item["score"],
            reverse=True,
        )[:3]

        return {
            "success": True,
            "model": "crop",
            "recommended_crop": str(prediction),
            "recommendations": recommendations,
        }

    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Crop prediction error: {str(e)}",
        )


# =========================================================
# 2. FERTILIZER RECOMMENDATION
# =========================================================

@app.post("/predict/fertilizer")
def predict_fertilizer(data: dict):

    try:

        df = prepare_input(
            data,
            fertilizer_model,
        )

        prediction = fertilizer_model.predict(df)[0]
        probabilities = fertilizer_model.predict_proba(df)[0]
        recommendations = sorted(
            [
                {"fertilizer": str(label), "score": safe_float(score)}
                for label, score in zip(fertilizer_model.classes_, probabilities)
            ],
            key=lambda item: item["score"],
            reverse=True,
        )[:3]

        return {
            "success": True,
            "model": "fertilizer",
            "recommended_fertilizer": str(prediction),
            "recommendations": recommendations,
        }

    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Fertilizer prediction error: {str(e)}",
        )


# =========================================================
# 3. CROP YIELD PREDICTION
# =========================================================

@app.post("/predict/yield")
def predict_yield(data: dict):

    try:
        if not isinstance(data, dict):
            raise HTTPException(status_code=400, detail="Request body must be a JSON object.")
        try:
            production = float(data.get("Production"))
            area = float(data.get("Area"))
        except (TypeError, ValueError):
            raise HTTPException(status_code=422, detail="Enter numeric production and cultivated area values.")
        if not math.isfinite(production) or production < 0:
            raise HTTPException(status_code=422, detail="Production must be a finite, non-negative number.")
        if not math.isfinite(area) or area <= 0:
            raise HTTPException(status_code=422, detail="Cultivated area must be greater than zero.")
        prediction = production / area

        return {
            "success": True,
            "model": "yield",
            "estimated_yield": safe_float(prediction),
            "unit": "source-data units per hectare",
            "method": "production divided by cultivated area",
        }

    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Yield prediction error: {str(e)}",
        )


# =========================================================
# 4. MARKET PRICE PREDICTION
# =========================================================

@app.post("/predict/price")
def predict_price(data: dict):

    try:

        df = prepare_input(
            data,
            price_model,
        )

        prediction = price_model.predict(df)[0]

        return {
            "success": True,
            "model": "price",
            "predicted_price": safe_float(prediction),
            "currency": "INR per quintal",
        }

    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Price prediction error: {str(e)}",
        )


# =========================================================
# 5. PLANT DISEASE PREDICTION
# =========================================================

@app.post("/predict/disease")
def predict_disease(data: dict):

    try:

        df = prepare_input(
            data,
            disease_model,
        )

        prediction = disease_model.predict(df)[0]
        probabilities = disease_model.predict_proba(df)[0]
        confidence = safe_float(max(probabilities))

        return {
            "success": True,
            "model": "disease",
            "disease_present": str(prediction),
            "model_score": confidence,
            "notice": "Prototype symptom screen trained on synthetic data; not a diagnosis.",
        }

    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Disease prediction error: {str(e)}",
        )


# =========================================================
# 6. CROP GROWTH PREDICTION
# =========================================================

@app.post("/predict/growth")
def predict_growth(data: dict):

    try:

        df = prepare_input(
            data,
            growth_model,
        )

        prediction = growth_model.predict(df)[0]
        probabilities = growth_model.predict_proba(df)[0]

        return {
            "success": True,
            "model": "growth",
            "growth_result": int(prediction),
            "growth_category": f"Growth category {int(prediction)}",
            "model_score": safe_float(max(probabilities)),
        }

    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Growth prediction error: {str(e)}",
        )


# =========================================================
# STARTUP INFORMATION
# =========================================================

@app.on_event("startup")
def startup_event():

    print("\n")
    print("=" * 60)
    print("🌱 KHETWISE ML API")
    print("=" * 60)
    print(f"📁 Model directory: {MODEL_DIR}")
    print("✅ Crop model loaded")
    print("✅ Fertilizer model loaded")
    print("✅ Yield per area calculation ready")
    print("✅ Price model loaded")
    print("✅ Disease model loaded")
    print("✅ Growth model loaded")
    print("=" * 60)
    print("🚀 API ready")
    print("=" * 60)
    print("\n")
