# Hybrid Machine Learning Methodology

## 1. Overview

The population forecasting pipeline employs a two-stage hybrid machine learning methodology:

```
Historical Urban Data (2015-2026)
               |
               v
     PyTorch LSTM Model
 (Temporal Trend Sequence)
               |
               v
   LSTM Temporal Forecast
               |
               v
  XGBoost Spatial Localizer
(Spatial Urban Features + Zone ID)
               |
               v
 Localized Population Forecast (2027-2030)
```

## 2. Model Roles

- **PyTorch LSTM**:
  Learns sequential temporal patterns from historical population timelines across 3-year sliding windows.
- **XGBoost Localizer**:
  Takes the LSTM temporal prediction alongside spatial urban features (`built_up_surface_m2`, `night_light`, `built_up_change`, `night_light_change`, `pop_growth_rate`, `zone_id`) to model non-linear local interactions and refine population forecasts for each zone.

## 3. Evaluation Strategy

- **Time-Aware Train/Test Split**:
  - Training period: years &le; 2024
  - Validation / Test period: years 2025–2026
  - Target forecast horizon: 2027–2030
- **Metrics Computed**:
  - Mean Absolute Error (MAE)
  - Root Mean Squared Error (RMSE)
  - Mean Absolute Percentage Error (MAPE %)
  - Coefficient of Determination (R²)
