import React, { useEffect, useState } from 'react';
import { api, ForecastResult, ModelMetrics, UrbanRecord } from '../services/api';
import { Cpu, TrendingUp, CheckCircle, HelpCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

export const ForecastPage: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState<number>(13); // Default Adyar
  const [forecastYear, setForecastYear] = useState<number>(2030);
  const [forecast, setForecast] = useState<ForecastResult | null>(null);
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
  const [records, setRecords] = useState<UrbanRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    Promise.all([
      api.getForecastForZone(selectedZone, forecastYear),
      api.getModelMetrics(),
      api.getRecords(selectedZone)
    ]).then(([forecastData, metricsData, recordsData]) => {
      setForecast(forecastData);
      setMetrics(metricsData);
      setRecords(recordsData);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [selectedZone, forecastYear]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  // Combine historical records with forecast point for chart
  const historicalPoints = records.map(r => ({
    year: r.year,
    Population: Math.round(r.population),
    type: r.year <= 2026 ? 'Historical' : 'Model'
  }));

  const chartData = historicalPoints.map(p => {
    if (p.year === forecastYear && forecast) {
      return { ...p, "Hybrid Forecast": Math.round(forecast.predictedPopulation) };
    }
    return p;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Module 2: Hybrid Localized Population Forecasting</h1>
        <p className="text-slate-500">Temporal Sequence Modeling (LSTM) + Spatial Feature Localization (XGBoost)</p>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Select Zone</label>
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(Number(e.target.value))}
              className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {Array.from({ length: 15 }, (_, i) => i + 1).map(z => (
                <option key={z} value={z}>Zone {z} - {
                  ['Thiruvottiyur', 'Manali', 'Madhavaram', 'Tondiarpet', 'Royapuram', 'Thiru-Vi-Ka-Nagar', 'Ambattur', 'Annanagar', 'Teynampet', 'Kodambakkam', 'Valasaravakkam', 'Alandur', 'Adyar', 'Perungudi', 'Sholinganallur'][z - 1]
                }</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Target Forecast Year</label>
            <select
              value={forecastYear}
              onChange={(e) => setForecastYear(Number(e.target.value))}
              className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {[2027, 2028, 2029, 2030].map(y => (
                <option key={y} value={y}>{y} Target</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-200 text-xs font-bold">
          <CheckCircle className="w-4 h-4" />
          <span>Hybrid LSTM + XGBoost Model Active</span>
        </div>
      </div>

      {/* Forecast Result Cards */}
      {forecast && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-500 font-medium uppercase">Latest Known Pop (2026)</p>
            <p className="text-2xl font-bold text-slate-800">{Math.round(forecast.latestKnownPopulation).toLocaleString()}</p>
            <p className="text-xs text-slate-400 mt-1">Observed baseline</p>
          </div>

          <div className="bg-sky-600 text-white p-5 rounded-xl shadow-md">
            <p className="text-xs text-sky-100 font-medium uppercase">{forecast.forecastYear} Predicted Population</p>
            <p className="text-2xl font-bold">{Math.round(forecast.predictedPopulation).toLocaleString()}</p>
            <p className="text-xs text-sky-200 mt-1">{forecast.modelUsed}</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-500 font-medium uppercase">Projected Pop Change</p>
            <p className="text-2xl font-bold text-emerald-600">+{Math.round(forecast.populationChange).toLocaleString()}</p>
            <p className="text-xs text-slate-400 mt-1">Additional residents</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-500 font-medium uppercase">Growth Percentage</p>
            <p className="text-2xl font-bold text-indigo-600">+{forecast.growthPercentage.toFixed(2)}%</p>
            <p className="text-xs text-slate-400 mt-1">Over 2026–{forecast.forecastYear} timeline</p>
          </div>
        </div>
      )}

      {/* Chart & Methodology Explanation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4">
            Zone {selectedZone} Historical Population vs Hybrid Forecast
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip formatter={(value: number) => value.toLocaleString()} />
                <Legend />
                <Line type="monotone" dataKey="Population" stroke="#64748b" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Hybrid Forecast" stroke="#0284c7" strokeWidth={4} dot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 text-slate-100 p-5 rounded-xl space-y-4">
          <div className="flex items-center gap-2 text-sky-400 font-bold">
            <Cpu className="w-5 h-5" />
            <span>Implemented Hybrid Methodology</span>
          </div>
          
          <div className="space-y-3 text-xs leading-relaxed text-slate-300">
            <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
              <strong className="text-sky-300 block mb-1">1. PyTorch LSTM Layer</strong>
              Learns temporal, sequential population dynamics across time-series windows (2015–2026). Outputs temporal baseline prediction.
            </div>

            <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
              <strong className="text-emerald-300 block mb-1">2. XGBoost Spatial Localizer</strong>
              Takes LSTM temporal prediction alongside urban features (built-up surface, night-light intensity, growth rate) to model nonlinear spatial interactions and refine zone-level forecasts.
            </div>

            <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
              <strong className="text-amber-300 block mb-1">3. Time-Aware Validation</strong>
              Trained strictly on past years (&le; 2024) and validated on 2025–2026 without random data leakage.
            </div>
          </div>
        </div>
      </div>

      {/* Empirical Model Comparison Table */}
      {metrics && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-800 text-sm uppercase tracking-wider">
                Empirical Model Performance Evaluation
              </h2>
              <p className="text-xs text-slate-500">Evaluated on test period (2025–2026) actual vs predicted values</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-600 uppercase text-xs">
                <tr>
                  <th className="p-3">Model Architecture</th>
                  <th className="p-3">MAE (Lower is better)</th>
                  <th className="p-3">RMSE (Lower is better)</th>
                  <th className="p-3">MAPE % (Lower is better)</th>
                  <th className="p-3">R² Score (Higher is better)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr className="hover:bg-slate-50">
                  <td className="p-3 text-slate-600 font-semibold">1. Simple Baseline (Linear Trend)</td>
                  <td className="p-3 text-slate-700">{metrics.baseline.mae.toLocaleString()}</td>
                  <td className="p-3 text-slate-700">{metrics.baseline.rmse.toLocaleString()}</td>
                  <td className="p-3 text-slate-700">{metrics.baseline.mape}%</td>
                  <td className="p-3 text-slate-700">{metrics.baseline.r2}</td>
                </tr>

                <tr className="hover:bg-slate-50">
                  <td className="p-3 text-slate-800 font-semibold">2. PyTorch LSTM</td>
                  <td className="p-3 text-slate-800">{metrics.lstm.mae.toLocaleString()}</td>
                  <td className="p-3 text-slate-800">{metrics.lstm.rmse.toLocaleString()}</td>
                  <td className="p-3 text-slate-800">{metrics.lstm.mape}%</td>
                  <td className="p-3 text-slate-800">{metrics.lstm.r2}</td>
                </tr>

                <tr className="bg-sky-50 font-bold text-sky-900">
                  <td className="p-3 flex items-center gap-2">
                    <span>3. Hybrid LSTM + XGBoost</span>
                    <span className="bg-sky-600 text-white text-[10px] uppercase px-1.5 py-0.5 rounded">Best</span>
                  </td>
                  <td className="p-3">{metrics.hybrid.mae.toLocaleString()}</td>
                  <td className="p-3">{metrics.hybrid.rmse.toLocaleString()}</td>
                  <td className="p-3">{metrics.hybrid.mape}%</td>
                  <td className="p-3">{metrics.hybrid.r2}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
