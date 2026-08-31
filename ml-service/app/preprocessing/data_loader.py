import os
import pandas as pd
import numpy as np
import psycopg2

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CSV_PATH = os.path.join(BASE_DIR, 'data', 'processed', 'chennai_preprocessed_2015_2030.csv')

def load_preprocessed_data():
    """Load preprocessed population and urban data from DB or CSV fallback."""
    try:
        conn = psycopg2.connect(dbname='smartcity_db', user='postgres', password='password', host='localhost', port=5432)
        query = """
            SELECT p.year, p.zone_id, z.zone_name, p.population, p.built_up_surface_m2, p.night_light,
                   p.built_up_source, p.night_light_source, f.pop_growth_rate, f.pop_change,
                   f.built_up_change, f.night_light_change, p.is_training_period
            FROM population_data p
            JOIN urban_zone z ON p.zone_id = z.zone_id
            JOIN urban_features f ON p.year = f.year AND p.zone_id = f.zone_id
            ORDER BY p.zone_id, p.year;
        """
        df = pd.read_sql(query, conn)
        conn.close()
        print(f"Loaded {len(df)} records from PostgreSQL smartcity_db.")
        return df
    except Exception as e:
        print(f"PostgreSQL connection failed ({e}). Loading fallback CSV: {CSV_PATH}")
        df = pd.read_csv(CSV_PATH)
        return df

def prepare_lstm_sequences(df, seq_len=3):
    """
    Construct time-aware sequences for LSTM training and evaluation.
    seq_len = 3 years (e.g., [2015, 2016, 2017] -> predict 2018).
    """
    feature_cols = ['population', 'built_up_surface_m2', 'night_light', 'pop_growth_rate']
    
    sequences = []
    targets = []
    zone_ids = []
    target_years = []
    
    zones = df['zone_id'].unique()
    for z in zones:
        z_df = df[df['zone_id'] == z].sort_values('year').reset_index(drop=True)
        values = z_df[feature_cols].values
        years = z_df['year'].values
        pops = z_df['population'].values
        
        for i in range(len(z_df) - seq_len):
            seq = values[i : i + seq_len]
            target_pop = pops[i + seq_len]
            yr = years[i + seq_len]
            
            sequences.append(seq)
            targets.append(target_pop)
            zone_ids.append(z)
            target_years.append(yr)
            
    return np.array(sequences), np.array(targets), np.array(zone_ids), np.array(target_years)
