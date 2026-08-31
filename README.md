# A Hybrid Machine Learning Approach for Urban Population Forecasting and Resource Optimization in Smart Cities

## 1. Project Overview
This project implements a smart city decision-support platform designed for localized urban population forecasting and resource demand planning across the **15 Greater Chennai Corporation zones**. It integrates historical urban dataset indicators (population, built-up surface area, and night-time lights) to forecast population growth through 2030 and estimate critical urban resource demands (Water, Electricity, Healthcare, and Education).

## 2. Four-Module Scope
In accordance with coordinator instructions, the current implementation scope focuses exclusively on **Four Core Modules**:
- **Module 1**: Urban Data Acquisition, Integration & Preprocessing
- **Module 2**: Hybrid Localized Population Forecasting (LSTM + XGBoost)
- **Module 3**: Urban Resource Demand Estimation & Priority Analysis
- **Module 4**: GIS-Based Smart City Decision Dashboard

*Note: Transportation prediction and unverified resource capacity data are out of scope for this phase.*

---

## 3. System Architecture

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

---

## 4. Technology Stack
- **Frontend**: React 18, Vite, TypeScript, React Router v6, Axios, Recharts, Leaflet, React Leaflet, Tailwind CSS.
- **Backend**: Java 21, Spring Boot 3.2, Spring Web, Spring Data JPA, PostgreSQL Driver.
- **Database**: PostgreSQL 18 (`smartcity_db`).
- **Machine Learning**: Python 3.11, FastAPI, PyTorch, XGBoost, scikit-learn, Pandas, NumPy.
- **GIS**: Leaflet, OpenStreetMap basemap, GeoJSON (`data/gis/chennai_zones.geojson` from DataMeet open municipal spatial dataset).

---

## 5. Dataset Details & Structure
- **Dataset File**: `data/raw/Chennai_Model_Input_Aligned_Final.xlsx` (Unmodified original workbook).
- **Scope**: 15 Greater Chennai Corporation Zones.
- **Training Period**: 2015–2026 (180 records = 15 zones × 12 years).
- **Model Target Horizon**: 2015–2030 (240 records = 15 zones × 16 years).
- **Workbook Sheets**:
  - `Population`: Zone-wise annual population estimates (2015–2030).
  - `BuiltUp_Raw`: Source GHSL satellite epochs (2015, 2020, 2025, 2030).
  - `NightLight_Raw`: VIIRS satellite annual aggregates (2015–2026).
  - `Model_Input_2015_2030`: Full model timeline.
  - `Training_Input_2015_2026`: Complete training feature rows.

---

## 6. Chennai 15 Zones Mapping
| Zone ID | Zone Code | Zone Name |
| :--- | :--- | :--- |
| 1 | I | Thiruvottiyur |
| 2 | II | Manali |
| 3 | III | Madhavaram |
| 4 | IV | Tondiarpet |
| 5 | V | Royapuram |
| 6 | VI | Thiru-Vi-Ka-Nagar |
| 7 | VII | Ambattur |
| 8 | VIII | Annanagar |
| 9 | IX | Teynampet |
| 10 | X | Kodambakkam |
| 11 | XI | Valasaravakkam |
| 12 | XII | Alandur |
| 13 | XIII | Adyar |
| 14 | XIV | Perungudi |
| 15 | XV | Sholinganallur |

---

## 7. Data Preprocessing & Data Provenance
- Data validation checks for required sheets, column types, null values, duplicates, and range anomalies.
- Derived feature creation: Year-over-Year (YoY) growth rate, population change, built-up change, and night-light change.
- **Data Provenance Integrity**: Annual built-up surface area values between source epochs (2015, 2020, 2025, 2030) are **linearly interpolated estimates**. The UI explicitly labels these as *Interpolated Estimates* to distinguish them from observed satellite measurements.

---

## 8. ML Methodology: LSTM, XGBoost & Hybrid Integration
- **LSTM (Long Short-Term Memory)**: Processes 3-year sequential temporal windows to capture underlying temporal population trends across 2015–2026.
- **XGBoost Localizer**: Accepts the temporal prediction from LSTM together with zone spatial features (`built_up_surface_m2`, `night_light`, `pop_growth_rate`, `zone_id`) to model non-linear spatial interactions.
- **Hybrid Integration**: Predicts baseline temporal trajectory via PyTorch LSTM, then refines and localizes zone forecasts using XGBoost.

---

## 9. Evaluation Metrics
Models are evaluated on a time-aware test split (2025–2026) using empirical regression metrics:
- **MAE**: Mean Absolute Error
- **RMSE**: Root Mean Squared Error
- **MAPE**: Mean Absolute Percentage Error (%)
- **R² Score**: Coefficient of Determination

---

## 10. Resource Demand Methodology
Resource demands are computed dynamically from forecasted population using configurable planning factors stored in database table `resource_parameters`:
- **Water**: 135 Liters / person / day (LPD)
- **Electricity**: 3.5 kWh / person / day
- **Healthcare**: 0.003 hospital beds / person (3 beds per 1,000 residents)
- **Education**: 0.05 school seats / person (50 seats per 1,000 residents)

*Label: PROJECT PLANNING ASSUMPTIONS.*

---

## 11. Priority Scoring Methodology
Zones are ranked using a transparent weighted priority score:
$$\text{Priority Score} = (\text{Growth Factor} \times 0.4) + (\text{Population Density Factor} \times 0.35) + (\text{Demand Factor} \times 0.25)$$
- Categorized into: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`.

---

## 12. GIS Methodology
- **Boundaries**: Real 15-zone municipal boundaries from DataMeet Open Spatial Dataset for Greater Chennai Corporation (`data/gis/chennai_zones.geojson`).
- **Data Join**: Joins GeoJSON feature properties with backend PostgreSQL database analytical outputs using `zone_id`.
- **Interactive Features**: Zoom, pan, thematic layer switching (Priority, Population, Water, Electricity), hover tooltips, click side-panel diagnostic, dynamic legends.

---

## 13. Database Schema
- `urban_zone` (Primary zone catalog)
- `population_data` (Historical and aligned input data)
- `urban_features` (Derived preprocessing features)
- `population_forecast` (Model predictions)
- `resource_parameters` (Configurable planning factors)
- `resource_demand` (Calculated zone resource requirements)
- `priority_analysis` (Priority scores and levels)
- `resource_capacity` (Extensible schema for future capacity data)

---

## 14. REST API Structure
- `GET /api/data/summary`, `GET /api/data/records`, `GET /api/data/quality`
- `GET /api/forecast/zone/{zoneId}`, `GET /api/forecast/all`, `GET /api/forecast/metrics`
- `GET /api/resource/demand`, `GET /api/resource/parameters`
- `GET /api/gis/zones`
- `GET /api/dashboard/summary`

---

## 15. Installation & Running Instructions

### Prerequisites
- Node.js 18+ & npm
- Python 3.10+
- Java 17+ / Java 21 & Maven
- PostgreSQL 18

### Step 1: Database Setup & Seeding
```bash
python database/seed_data.py
```

### Step 2: Python FastAPI ML Service
```bash
cd ml-service
pip install -r requirements.txt
python app/main.py
```
*(Runs on http://localhost:8000)*

### Step 3: Java Spring Boot Backend
```bash
cd backend
mvn spring-boot:run
```
*(Runs on http://localhost:8080)*

### Step 4: React Frontend
```bash
cd frontend
npm install
npm run dev
```
*(Runs on http://localhost:3000)*

---

## 16. Current Limitations & Future Extension Points
1. **Resource Capacity Data**: Current dataset does not contain official zone-wise supply capacities. Module 3 performs demand estimation and priority ranking. The `resource_capacity` table is ready for capacity data when available.
2. **Transportation Prediction**: Outside current 4-module scope; reserved for Phase 2 extension.
3. **Data Interpolation**: Annual built-up surface values between source epochs (2015, 2020, 2025, 2030) are interpolated estimates.
"# population-forecasting-resource-optimization" 
