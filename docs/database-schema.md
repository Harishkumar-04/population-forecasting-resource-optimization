# Database Schema & Structure

## Database: PostgreSQL `smartcity_db`

### Tables

1. **`urban_zone`**:
   - `zone_id` (INT, Primary Key): 1 to 15
   - `zone_code` (VARCHAR): "I" to "XV"
   - `zone_name` (VARCHAR): Official Chennai Corporation zone name (Thiruvottiyur to Sholinganallur)

2. **`population_data`**:
   - `id` (BIGSERIAL, Primary Key)
   - `year` (INT): 2015 to 2030
   - `zone_id` (INT, Foreign Key -> `urban_zone`)
   - `population` (DOUBLE PRECISION)
   - `built_up_surface_m2` (DOUBLE PRECISION)
   - `night_light` (DOUBLE PRECISION)
   - `built_up_source` (VARCHAR): 'Observed GHSL epoch' vs 'Linearly interpolated estimate'
   - `night_light_source` (VARCHAR): 'VIIRS annual aggregate'
   - `is_training_period` (BOOLEAN): TRUE for &le; 2026, FALSE for > 2026

3. **`urban_features`**:
   - `id` (BIGSERIAL, Primary Key)
   - `year`, `zone_id`
   - `pop_growth_rate`, `pop_change`, `built_up_change`, `night_light_change`

4. **`population_forecast`**:
   - `id` (BIGSERIAL, Primary Key)
   - `zone_id`, `forecast_year`
   - `latest_known_population`, `predicted_population`, `population_change`, `growth_percentage`
   - `model_used` ('Hybrid LSTM + XGBoost')

5. **`resource_parameters`**:
   - `resource_type` ('water', 'electricity', 'healthcare', 'education')
   - `planning_factor`, `unit`, `description`, `source_note`

6. **`resource_demand`**:
   - `zone_id`, `forecast_year`, `population`
   - `water_demand_lpd`, `electricity_demand_kwh_day`, `healthcare_beds_required`, `education_seats_required`

7. **`priority_analysis`**:
   - `zone_id`, `forecast_year`
   - `priority_score`, `priority_level` ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')

8. **`resource_capacity` (Extensible Layer)**:
   - Reserved for Phase 2 integration when official supply capacity data becomes available.
