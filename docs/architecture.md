# System Architecture

## Overview

The Smart City Urban Population Forecasting & Resource Optimization system is built as a modular monorepo containing four demonstrable core modules.

```
                         React Frontend (Vite + Leaflet)
                                      |
                                      | REST API (HTTP 8080)
                                      v
                          Java Spring Boot Backend
                               /           \
                              /             \
                             v               v
                PostgreSQL Database       Python FastAPI ML Service
                  (smartcity_db)           (HTTP 8000)
                                                 |
                                            LSTM + XGBoost
                                            Hybrid Forecast
```

## System Components

1. **Frontend (React 18 + Vite + TypeScript)**:
   - Dashboard (Aggregated stats & high-growth zones ranking)
   - Data Management Page (Dataset overview, quality report, zone/year filters, provenance tracking)
   - Population Forecast Page (Zone selector, forecast year selector, historical vs forecast timeline, model comparison)
   - Resource Analysis Page (Water, electricity, healthcare, education demand estimation & forecast-based priority scores)
   - GIS Map Page (Interactive Leaflet map displaying real Greater Chennai Corporation 15-zone boundary polygons with dynamic thematic layers)

2. **Backend (Java 21 Spring Boot 3.2)**:
   - REST Controllers exposing APIs for Data, Forecast, Resource, GIS, and Dashboard
   - JPA Repositories interacting with PostgreSQL
   - RestTemplate bridge communicating with Python FastAPI ML Service

3. **ML Service (Python 3.11 + FastAPI)**:
   - Data loader and temporal sequence generator
   - PyTorch LSTM model for temporal population trends
   - XGBoost model for spatial feature localization and non-linear interactions
   - Hybrid pipeline manager with empirical metric evaluation (MAE, RMSE, MAPE, R²)
   - Model artifact persistence (`ml-service/artifacts/hybrid_pipeline.pkl`)

4. **Database (PostgreSQL 18)**:
   - Database name: `smartcity_db`
   - Primary key mapping across spatial and analytical datasets: `zone_id` (1 to 15)
