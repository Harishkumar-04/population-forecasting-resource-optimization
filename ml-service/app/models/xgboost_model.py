import numpy as np
import xgboost as xgb
from sklearn.preprocessing import StandardScaler

class XGBoostLocalizer:
    def __init__(self, n_estimators=100, max_depth=4, learning_rate=0.05):
        self.n_estimators = n_estimators
        self.max_depth = max_depth
        self.learning_rate = learning_rate
        self.model = xgb.XGBRegressor(
            n_estimators=self.n_estimators,
            max_depth=self.max_depth,
            learning_rate=self.learning_rate,
            random_state=42
        )
        self.scaler_x = StandardScaler()
        self.is_fitted = False

    def fit(self, X_features, y_target):
        """
        X_features include:
        [lstm_temporal_pred, built_up_surface_m2, night_light, built_up_change, night_light_change, pop_growth_rate, zone_id]
        """
        X_scaled = self.scaler_x.fit_transform(X_features)
        self.model.fit(X_scaled, y_target)
        self.is_fitted = True
        return self

    def predict(self, X_features):
        if not self.is_fitted:
            raise ValueError("XGBoost model is not fitted yet.")
        X_scaled = self.scaler_x.transform(X_features)
        preds = self.model.predict(X_scaled)
        return preds
