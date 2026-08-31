import sys
import os
import unittest
import numpy as np

# Ensure app package is in Python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.preprocessing.data_loader import load_preprocessed_data, prepare_lstm_sequences
from app.evaluation.metrics import calculate_metrics
from app.models.hybrid_pipeline import HybridPipelineManager

class TestMLService(unittest.TestCase):

    def test_data_loader(self):
        df = load_preprocessed_data()
        self.assertFalse(df.empty, "Preprocessed dataframe should not be empty.")
        self.assertIn('population', df.columns)
        self.assertIn('built_up_surface_m2', df.columns)
        
        X_seq, y_target, zone_ids, target_years = prepare_lstm_sequences(df[df['year'] <= 2026], seq_len=3)
        self.assertGreater(len(X_seq), 0, "Should generate valid sequence data.")
        self.assertEqual(X_seq.shape[1], 3, "Sequence length should be 3.")

    def test_metrics_calculation(self):
        y_true = [100.0, 200.0, 300.0]
        y_pred = [110.0, 190.0, 305.0]
        res = calculate_metrics(y_true, y_pred)
        self.assertIn('mae', res)
        self.assertIn('rmse', res)
        self.assertIn('mape', res)
        self.assertIn('r2', res)
        self.assertGreater(res['r2'], 0.9)

    def test_hybrid_pipeline(self):
        manager = HybridPipelineManager()
        metrics = manager.train_and_evaluate()
        self.assertIn('hybrid', metrics)
        self.assertIn('lstm', metrics)
        self.assertIn('baseline', metrics)
        
        pred = manager.predict_zone_forecast(zone_id=13, forecast_year=2030)
        self.assertEqual(pred['zone_id'], 13)
        self.assertEqual(pred['forecast_year'], 2030)
        self.assertGreater(pred['predicted_population'], 0)

if __name__ == '__main__':
    unittest.main()
