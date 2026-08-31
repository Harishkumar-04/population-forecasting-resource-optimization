-- Smart City Urban Population Forecasting & Resource Optimization
-- PostgreSQL Schema Definition

DROP TABLE IF EXISTS resource_capacity CASCADE;
DROP TABLE IF EXISTS priority_analysis CASCADE;
DROP TABLE IF EXISTS resource_demand CASCADE;
DROP TABLE IF EXISTS resource_parameters CASCADE;
DROP TABLE IF EXISTS population_forecast CASCADE;
DROP TABLE IF EXISTS urban_features CASCADE;
DROP TABLE IF EXISTS population_data CASCADE;
DROP TABLE IF EXISTS urban_zone CASCADE;

-- 1. Urban Zones (15 Chennai Corporation Zones)
CREATE TABLE urban_zone (
    zone_id INT PRIMARY KEY,
    zone_code VARCHAR(10) NOT NULL UNIQUE,
    zone_name VARCHAR(100) NOT NULL
);

-- 2. Population & Urban Datasets (2015 - 2030)
CREATE TABLE population_data (
    id BIGSERIAL PRIMARY KEY,
    year INT NOT NULL,
    zone_id INT NOT NULL REFERENCES urban_zone(zone_id) ON DELETE CASCADE,
    population DOUBLE PRECISION NOT NULL,
    built_up_surface_m2 DOUBLE PRECISION NOT NULL,
    night_light DOUBLE PRECISION NOT NULL,
    built_up_source VARCHAR(100) NOT NULL, -- 'Observed GHSL epoch' vs 'Linearly interpolated estimate'
    night_light_source VARCHAR(100) NOT NULL,
    is_training_period BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT idx_pop_year_zone UNIQUE (year, zone_id)
);

-- 3. Derived Features (Preprocessing & Feature Engineering)
CREATE TABLE urban_features (
    id BIGSERIAL PRIMARY KEY,
    year INT NOT NULL,
    zone_id INT NOT NULL REFERENCES urban_zone(zone_id) ON DELETE CASCADE,
    pop_growth_rate DOUBLE PRECISION,
    pop_change DOUBLE PRECISION,
    built_up_change DOUBLE PRECISION,
    night_light_change DOUBLE PRECISION,
    CONSTRAINT idx_feat_year_zone UNIQUE (year, zone_id)
);

-- 4. Population Forecast Outputs
CREATE TABLE population_forecast (
    id BIGSERIAL PRIMARY KEY,
    zone_id INT NOT NULL REFERENCES urban_zone(zone_id) ON DELETE CASCADE,
    forecast_year INT NOT NULL,
    latest_known_population DOUBLE PRECISION NOT NULL,
    predicted_population DOUBLE PRECISION NOT NULL,
    population_change DOUBLE PRECISION NOT NULL,
    growth_percentage DOUBLE PRECISION NOT NULL,
    model_used VARCHAR(50) NOT NULL DEFAULT 'Hybrid LSTM + XGBoost',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT idx_forecast_zone_year UNIQUE (zone_id, forecast_year)
);

-- 5. Resource Planning Parameters (Configurable Planning Factors)
CREATE TABLE resource_parameters (
    id BIGSERIAL PRIMARY KEY,
    resource_type VARCHAR(50) NOT NULL UNIQUE, -- 'water', 'electricity', 'healthcare', 'education'
    planning_factor DOUBLE PRECISION NOT NULL,
    unit VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    source_note VARCHAR(255) NOT NULL DEFAULT 'PROJECT PLANNING ASSUMPTIONS'
);

-- 6. Estimated Resource Demand
CREATE TABLE resource_demand (
    id BIGSERIAL PRIMARY KEY,
    zone_id INT NOT NULL REFERENCES urban_zone(zone_id) ON DELETE CASCADE,
    forecast_year INT NOT NULL,
    population DOUBLE PRECISION NOT NULL,
    water_demand_lpd DOUBLE PRECISION NOT NULL,
    electricity_demand_kwh_day DOUBLE PRECISION NOT NULL,
    healthcare_beds_required DOUBLE PRECISION NOT NULL,
    education_seats_required DOUBLE PRECISION NOT NULL,
    CONSTRAINT idx_demand_zone_year UNIQUE (zone_id, forecast_year)
);

-- 7. Priority Scoring & Decision Analysis
CREATE TABLE priority_analysis (
    id BIGSERIAL PRIMARY KEY,
    zone_id INT NOT NULL REFERENCES urban_zone(zone_id) ON DELETE CASCADE,
    forecast_year INT NOT NULL,
    priority_score DOUBLE PRECISION NOT NULL,
    priority_level VARCHAR(20) NOT NULL, -- 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
    growth_factor DOUBLE PRECISION NOT NULL,
    demand_factor DOUBLE PRECISION NOT NULL,
    density_factor DOUBLE PRECISION NOT NULL,
    contributing_factors TEXT,
    CONSTRAINT idx_priority_zone_year UNIQUE (zone_id, forecast_year)
);

-- 8. Future Capacity Support (Extensible Layer)
CREATE TABLE resource_capacity (
    id BIGSERIAL PRIMARY KEY,
    zone_id INT NOT NULL REFERENCES urban_zone(zone_id) ON DELETE CASCADE,
    year INT NOT NULL,
    water_capacity_lpd DOUBLE PRECISION,
    electricity_capacity_kwh_day DOUBLE PRECISION,
    healthcare_beds_capacity DOUBLE PRECISION,
    education_seats_capacity DOUBLE PRECISION,
    data_source VARCHAR(255) DEFAULT 'UNAVAILABLE / PLACEHOLDER',
    notes TEXT,
    CONSTRAINT idx_capacity_zone_year UNIQUE (zone_id, year)
);

-- Initial Resource Parameter Values
INSERT INTO resource_parameters (resource_type, planning_factor, unit, description, source_note) VALUES
('water', 135.0, 'Liters/person/day', 'Standard per capita domestic water supply assumption', 'PROJECT PLANNING ASSUMPTIONS'),
('electricity', 3.5, 'kWh/person/day', 'Estimated urban residential & commercial daily power consumption', 'PROJECT PLANNING ASSUMPTIONS'),
('healthcare', 0.003, 'Beds/person', 'Requirement of 3 hospital beds per 1,000 residents', 'PROJECT PLANNING ASSUMPTIONS'),
('education', 0.05, 'Seats/person', 'Requirement of 50 primary/secondary school seats per 1,000 residents', 'PROJECT PLANNING ASSUMPTIONS');
