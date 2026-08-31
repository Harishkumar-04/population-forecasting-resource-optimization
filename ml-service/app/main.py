import os
import datetime
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional

from app.models.hybrid_pipeline import HybridPipelineManager
from app.preprocessing.data_loader import load_preprocessed_data

app = FastAPI(
    title="Urban Population Forecasting ML Service",
    description="Python FastAPI service implementing Hybrid LSTM + XGBoost population forecasting for 15 Chennai zones.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pipeline_manager = HybridPipelineManager()

@app.on_event("startup")
def startup_event():
    print("Initializing ML Service...")
    loaded = pipeline_manager.load_artifacts()
    if not loaded:
        print("No pre-trained model artifacts found. Auto-training initial hybrid pipeline...")
        try:
            pipeline_manager.train_and_evaluate()
        except Exception as e:
            print(f"Warning: Auto-training on startup failed ({e}). Run /api/ml/train manually.")

class PredictRequest(BaseModel):
    zone_id: int = Field(..., ge=1, le=15, description="Chennai Zone ID (1 to 15)")
    forecast_year: int = Field(..., ge=2015, le=2030, description="Forecast Target Year (2015 to 2030)")

@app.get("/")
def read_root():
    return {
        "service": "Smart City Population Forecasting ML API",
        "status": "ONLINE",
        "timestamp": datetime.datetime.now().isoformat()
    }

@app.get("/api/ml/status")
def get_status():
    return {
        "service": "FastAPI ML Pipeline",
        "status": "READY" if pipeline_manager.is_trained else "UNTRAINED",
        "is_trained": pipeline_manager.is_trained,
        "models": ["Simple Baseline Linear Regression", "PyTorch LSTM", "XGBoost Spatial Localizer", "Hybrid LSTM + XGBoost"],
        "artifacts_path": "ml-service/artifacts/hybrid_pipeline.pkl",
        "dataset": "Chennai 15 Corporation Zones (2015-2030)"
    }

@app.post("/api/ml/train")
def train_model():
    try:
        metrics = pipeline_manager.train_and_evaluate()
        return {
            "message": "Hybrid LSTM + XGBoost model trained and evaluated successfully.",
            "status": "SUCCESS",
            "metrics": metrics
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model training failed: {str(e)}")

@app.post("/api/ml/predict")
def predict_population(req: PredictRequest):
    try:
        result = pipeline_manager.predict_zone_forecast(req.zone_id, req.forecast_year)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction error: {str(e)}")

@app.post("/api/ml/predict_all")
def predict_all_zones(year: int = Query(2030, ge=2015, le=2030)):
    try:
        results = []
        for zid in range(1, 16):
            results.append(pipeline_manager.predict_zone_forecast(zid, year))
        return results
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Batch prediction error: {str(e)}")

@app.get("/api/ml/metrics")
def get_metrics():
    if not pipeline_manager.is_trained:
        pipeline_manager.load_artifacts()
    if not pipeline_manager.is_trained:
        raise HTTPException(status_code=400, detail="Model is not trained yet. Call /api/ml/train first.")
    return pipeline_manager.metrics

@app.get("/api/ml/features")
def get_features():
    df = load_preprocessed_data()
    return {
        "dataset_records": len(df),
        "zones_count": 15,
        "training_years": "2015-2026",
        "forecast_years": "2027-2030",
        "primary_features": [
            "population",
            "built_up_surface_m2",
            "night_light",
            "pop_growth_rate",
            "pop_change",
            "built_up_change",
            "night_light_change"
        ],
        "data_provenance": {
            "population": "Observed (2015-2026) / Target timeline (2027-2030)",
            "built_up_surface": "Observed source epochs (2015, 2020, 2025, 2030) with linearly interpolated annual estimates",
            "night_light": "Annual VIIRS satellite aggregate (2015-2026)"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
