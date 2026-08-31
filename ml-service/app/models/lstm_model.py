import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from sklearn.preprocessing import StandardScaler

class LSTMForecaster(nn.Module):
    def __init__(self, input_dim=4, hidden_dim=32, num_layers=1):
        super(LSTMForecaster, self).__init__()
        self.hidden_dim = hidden_dim
        self.num_layers = num_layers
        self.lstm = nn.LSTM(input_dim, hidden_dim, num_layers, batch_first=True)
        self.fc = nn.Linear(hidden_dim, 1)

    def forward(self, x):
        h0 = torch.zeros(self.num_layers, x.size(0), self.hidden_dim).to(x.device)
        c0 = torch.zeros(self.num_layers, x.size(0), self.hidden_dim).to(x.device)
        out, _ = self.lstm(x, (h0, c0))
        out = self.fc(out[:, -1, :])
        return out

class LSTMModelWrapper:
    def __init__(self, input_dim=4, hidden_dim=32, num_layers=1, epochs=150, lr=0.01):
        self.input_dim = input_dim
        self.hidden_dim = hidden_dim
        self.num_layers = num_layers
        self.epochs = epochs
        self.lr = lr
        self.model = LSTMForecaster(input_dim, hidden_dim, num_layers)
        self.scaler_x = StandardScaler()
        self.scaler_y = StandardScaler()
        self.is_fitted = False

    def fit(self, X_train, y_train):
        # X_train shape: (samples, seq_len, features)
        n_samples, seq_len, n_features = X_train.shape
        X_flat = X_train.reshape(-1, n_features)
        X_flat_scaled = self.scaler_x.fit_transform(X_flat)
        X_scaled = X_flat_scaled.reshape(n_samples, seq_len, n_features)

        y_scaled = self.scaler_y.fit_transform(y_train.reshape(-1, 1)).flatten()

        X_t = torch.tensor(X_scaled, dtype=torch.float32)
        y_t = torch.tensor(y_scaled, dtype=torch.float32).unsqueeze(1)

        criterion = nn.MSELoss()
        optimizer = optim.Adam(self.model.parameters(), lr=self.lr)

        self.model.train()
        for epoch in range(self.epochs):
            optimizer.zero_grad()
            outputs = self.model(X_t)
            loss = criterion(outputs, y_t)
            loss.backward()
            optimizer.step()

        self.is_fitted = True
        return self

    def predict(self, X):
        if not self.is_fitted:
            raise ValueError("LSTM model is not fitted yet.")
        self.model.eval()
        n_samples, seq_len, n_features = X.shape
        X_flat = X.reshape(-1, n_features)
        X_flat_scaled = self.scaler_x.transform(X_flat)
        X_scaled = X_flat_scaled.reshape(n_samples, seq_len, n_features)

        X_t = torch.tensor(X_scaled, dtype=torch.float32)
        with torch.no_grad():
            preds_scaled = self.model(X_t).numpy()

        preds = self.scaler_y.inverse_transform(preds_scaled).flatten()
        return preds
