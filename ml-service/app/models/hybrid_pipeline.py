import os
import pickle
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression

from app.preprocessing.data_loader import load_preprocessed_data, prepare_lstm_sequences
from app.models.lstm_model import LSTMModelWrapper
from app.models.xgboost_model import XGBoostLocalizer
from app.evaluation.metrics import calculate_metrics

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ARTIFACTS_DIR = os.path.join(BASE_DIR, 'artifacts')

class HybridPipelineManager:
    def __init__(self):
        self.lstm_model = None
        self.xgb_model = None
        self.baseline_model = None
        self.metrics = {}
        self.is_trained = False
        self.df_data = None
        os.makedirs(ARTIFACTS_DIR, exist_ok=True)

    def train_and_evaluate(self):
        print("Starting hybrid pipeline training...")
        self.df_data = load_preprocessed_data()
        
        # Filter training period data (2015-2026)
        train_df = self.df_data[self.df_data['year'] <= 2026].sort_values(['zone_id', 'year']).reset_index(drop=True)
        
        # Prepare sequences (seq_len = 3)
        X_seq, y_target, zone_ids, target_years = prepare_lstm_sequences(train_df, seq_len=3)
        
        # Time-aware Train / Test split:
        # Train years <= 2024, Test years 2025-2026
        train_mask = target_years <= 2024
        test_mask = target_years > 2024
        
        X_train_seq, y_train = X_seq[train_mask], y_target[train_mask]
        X_test_seq, y_test = X_seq[test_mask], y_target[test_mask]
        
        # 1. Baseline Model (Simple Linear Regression on last 3 years mean pop)
        X_base_train = X_train_seq[:, :, 0].mean(axis=1).reshape(-1, 1)
        X_base_test = X_test_seq[:, :, 0].mean(axis=1).reshape(-1, 1)
        self.baseline_model = LinearRegression()
        self.baseline_model.fit(X_base_train, y_train)
        y_pred_baseline = self.baseline_model.predict(X_base_test)
        
        # 2. LSTM Model
        self.lstm_model = LSTMModelWrapper(input_dim=4, hidden_dim=32, epochs=150, lr=0.01)
        self.lstm_model.fit(X_train_seq, y_train)
        
        # Get LSTM temporal predictions for train and test
        lstm_train_preds = self.lstm_model.predict(X_train_seq)
        lstm_test_preds = self.lstm_model.predict(X_test_seq)
        
        # 3. Prepare XGBoost Features
        # Feature columns: [lstm_pred, built_up_surface_m2, night_light, built_up_change, night_light_change, pop_growth_rate, zone_id]
        # We extract urban features corresponding to the target_years for each sequence
        def build_xgb_features(seq_array, lstm_preds, z_ids, t_yrs):
            xgb_feats = []
            for i in range(len(z_ids)):
                zid = z_ids[i]
                tyr = t_yrs[i]
                row = train_df[(train_df['zone_id'] == zid) & (train_df['year'] == tyr)].iloc[0]
                feat_vec = [
                    lstm_preds[i],
                    row['built_up_surface_m2'],
                    row['night_light'],
                    row['built_up_change'],
                    row['night_light_change'],
                    row['pop_growth_rate'],
                    float(zid)
                ]
                xgb_feats.append(feat_vec)
            return np.array(xgb_feats)

        X_xgb_train = build_xgb_features(X_train_seq, lstm_train_preds, zone_ids[train_mask], target_years[train_mask])
        X_xgb_test = build_xgb_features(X_test_seq, lstm_test_preds, zone_ids[test_mask], target_years[test_mask])
        
        # Train XGBoost localizer
        self.xgb_model = XGBoostLocalizer(n_estimators=120, max_depth=4, learning_rate=0.05)
        self.xgb_model.fit(X_xgb_train, y_train)
        
        # Hybrid predictions on test set
        y_pred_hybrid = self.xgb_model.predict(X_xgb_test)
        
        # Compute metrics
        metrics_baseline = calculate_metrics(y_test, y_pred_baseline)
        metrics_lstm = calculate_metrics(y_test, lstm_test_preds)
        metrics_hybrid = calculate_metrics(y_test, y_pred_hybrid)
        
        self.metrics = {
            "baseline": metrics_baseline,
            "lstm": metrics_lstm,
            "hybrid": metrics_hybrid,
            "test_years": [2025, 2026],
            "test_sample_count": len(y_test)
        }
        
        self.is_trained = True
        self.save_artifacts()
        print("Training complete! Evaluation metrics:", self.metrics)
        return self.metrics

    def save_artifacts(self):
        artifact_path = os.path.join(ARTIFACTS_DIR, 'hybrid_pipeline.pkl')
        with open(artifact_path, 'wb') as f:
            pickle.dump({
                'lstm_model': self.lstm_model,
                'xgb_model': self.xgb_model,
                'baseline_model': self.baseline_model,
                'metrics': self.metrics
            }, f)
        print(f"Model artifacts saved to: {artifact_path}")

    def load_artifacts(self):
        artifact_path = os.path.join(ARTIFACTS_DIR, 'hybrid_pipeline.pkl')
        if os.path.exists(artifact_path):
            with open(artifact_path, 'rb') as f:
                data = pickle.load(f)
                self.lstm_model = data['lstm_model']
                self.xgb_model = data['xgb_model']
                self.baseline_model = data['baseline_model']
                self.metrics = data['metrics']
                self.is_trained = True
            print("Loaded trained model artifacts successfully.")
            return True
        return False

    def predict_zone_forecast(self, zone_id: int, forecast_year: int):
        if not self.is_trained:
            success = self.load_artifacts()
            if not success:
                self.train_and_evaluate()

        if self.df_data is None:
            self.df_data = load_preprocessed_data()

        z_df = self.df_data[self.df_data['zone_id'] == zone_id].sort_values('year').reset_index(drop=True)
        if z_df.empty:
            raise ValueError(f"Zone ID {zone_id} not found in dataset.")

        latest_known_row = z_df[z_df['year'] == 2026].iloc[0]
        latest_known_pop = float(latest_known_row['population'])

        if forecast_year <= 2026:
            row = z_df[z_df['year'] == forecast_year].iloc[0]
            pred_pop = float(row['population'])
        else:
            # Recursive / Sequential prediction for forecast_year (2027..2030)
            curr_df = z_df.copy()
            pred_pop = latest_known_pop
            feature_cols = ['population', 'built_up_surface_m2', 'night_light', 'pop_growth_rate']

            for y in range(2027, forecast_year + 1):
                # Take last 3 years sequence up to y-1
                last_3 = curr_df[curr_df['year'] < y].iloc[-3:][feature_cols].values
                seq_input = last_3.reshape(1, 3, 4)

                lstm_pred = float(self.lstm_model.predict(seq_input)[0])

                # Target year row features in model_input
                y_row = curr_df[curr_df['year'] == y]
                if not y_row.empty:
                    bu = float(y_row.iloc[0]['built_up_surface_m2'])
                    nl = float(y_row.iloc[0]['night_light'])
                    buc = float(y_row.iloc[0]['built_up_change'])
                    nlc = float(y_row.iloc[0]['night_light_change'])
                    pgr = float(y_row.iloc[0]['pop_growth_rate'])
                else:
                    bu = float(curr_df.iloc[-1]['built_up_surface_m2'])
                    nl = float(curr_df.iloc[-1]['night_light'])
                    buc = 0.0
                    nlc = 0.0
                    pgr = 0.015

                xgb_feat = np.array([[lstm_pred, bu, nl, buc, nlc, pgr, float(zone_id)]])
                pred_pop = float(self.xgb_model.predict(xgb_feat)[0])

        pop_change = pred_pop - latest_known_pop
        growth_pct = (pop_change / latest_known_pop) * 100.0 if latest_known_pop > 0 else 0.0

        return {
            "zone_id": zone_id,
            "zone_name": str(z_df.iloc[0]['zone_name']),
            "forecast_year": forecast_year,
            "latest_known_population": round(latest_known_pop, 2),
            "predicted_population": round(pred_pop, 2),
            "population_change": round(pop_change, 2),
            "growth_percentage": round(growth_pct, 2),
            "model_used": "Hybrid LSTM + XGBoost"
        }
