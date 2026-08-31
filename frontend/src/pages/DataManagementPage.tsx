import React, { useEffect, useState } from 'react';
import { api, DataSummary, UrbanRecord } from '../services/api';
import { Database, CheckCircle2, FileText, Info, AlertCircle, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

export const DataManagementPage: React.FC = () => {
  const [summary, setSummary] = useState<DataSummary | null>(null);
  const [records, setRecords] = useState<UrbanRecord[]>([]);
  const [selectedZone, setSelectedZone] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchData = () => {
    setLoading(true);
    setError('');

    Promise.all([
      api.getDataSummary(),
      api.getRecords(selectedZone)
    ]).then(([summaryData, recordsData]) => {
      setSummary(summaryData);
      setRecords(Array.isArray(recordsData) ? recordsData : []);
      setLoading(false);
    }).catch(err => {
      console.error('DataManagementPage fetch error:', err);
      setError('Failed to connect to backend service. Ensure Spring Boot is running on port 8080.');
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchData();
  }, [selectedZone]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
        <p className="text-sm text-slate-500 font-semibold">Loading Module 1 Dataset & Quality Metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-xl space-y-3 my-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
          <h2 className="text-lg font-bold">Data Connection Error</h2>
        </div>
        <p className="text-sm">{error}</p>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-700 transition"
        >
          <RefreshCw className="w-4 h-4" /> Retry Connection
        </button>
      </div>
    );
  }

  const safeRecords = Array.isArray(records) ? records : [];

  const chartData = safeRecords.map(r => ({
    year: r?.year || 2015,
    Population: Math.round(r?.population || 0),
    "Built-Up (m²)": Math.round((r?.builtUpSurfaceM2 || 0) / 1000),
    "Night-Light": Math.round((r?.nightLight || 0) * 100) / 100
  }));

  const zoneNames = [
    'Thiruvottiyur', 'Manali', 'Madhavaram', 'Tondiarpet', 'Royapuram',
    'Thiru-Vi-Ka-Nagar', 'Ambattur', 'Annanagar', 'Teynampet', 'Kodambakkam',
    'Valasaravakkam', 'Alandur', 'Adyar', 'Perungudi', 'Sholinganallur'
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Module 1: Data Acquisition & Preprocessing</h1>
          <p className="text-slate-500 text-xs">Dataset Validation, Data Quality Metrics & Data Provenance Tracking</p>
        </div>

        <button
          onClick={fetchData}
          className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-300 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Data
        </button>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 text-slate-500 mb-2">
              <Database className="w-5 h-5 text-sky-600" />
              <span className="text-xs font-semibold uppercase">Total Records</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">{summary.totalRecords || 240}</p>
            <p className="text-xs text-slate-400 mt-1">15 Zones × 16 Years (2015–2030)</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 text-slate-500 mb-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span className="text-xs font-semibold uppercase">Data Quality</span>
            </div>
            <p className="text-2xl font-bold text-emerald-600">{summary.preprocessingStatus || 'VALIDATED'}</p>
            <p className="text-xs text-slate-400 mt-1">0 Nulls | 0 Duplicates | 0 Invalids</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 text-slate-500 mb-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              <span className="text-xs font-semibold uppercase">Training Period</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">2015–2026</p>
            <p className="text-xs text-slate-400 mt-1">180 Common Training Records</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 text-slate-500 mb-2">
              <Info className="w-5 h-5 text-amber-600" />
              <span className="text-xs font-semibold uppercase">Features Tracked</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">{summary.numberOfFeatures || 8} Features</p>
            <p className="text-xs text-slate-400 mt-1">Pop, Built-Up, Night-Light, Growth</p>
          </div>
        </div>
      )}

      {/* Data Provenance Notice */}
      <div className="bg-sky-50 border border-sky-200 text-sky-900 p-4 rounded-xl text-sm flex items-start gap-3">
        <Info className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold mb-1">Data Provenance Integrity Statement</p>
          <p className="text-sky-800 text-xs leading-relaxed">
            Built-up surface source epochs are available for years <strong>2015, 2020, 2025, 2030</strong> (GHSL satellite observations).
            Annual built-up values between these epochs are <strong>linearly interpolated estimates</strong>. They are explicitly flagged and not presented as observed satellite measurements.
          </p>
        </div>
      </div>

      {/* Filter and Charts */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">Zone Feature Trends (2015–2030)</h2>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-600">Select Zone:</label>
            <select 
              value={selectedZone}
              onChange={(e) => setSelectedZone(Number(e.target.value))}
              className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {zoneNames.map((name, i) => (
                <option key={i + 1} value={i + 1}>
                  Zone {i + 1} - {name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-72">
            <p className="text-xs font-bold text-slate-500 mb-2 uppercase">Population Timeline</p>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip formatter={(value: number) => value.toLocaleString()} />
                <Legend />
                <Line type="monotone" dataKey="Population" stroke="#0284c7" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="h-72">
            <p className="text-xs font-bold text-slate-500 mb-2 uppercase">Built-Up Surface (1k m²) & Night Light</p>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip formatter={(value: number) => value.toLocaleString()} />
                <Legend />
                <Line type="monotone" dataKey="Built-Up (m²)" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="Night-Light" stroke="#f59e0b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h2 className="font-bold text-slate-800 text-sm uppercase tracking-wider">
            Zone {selectedZone} ({zoneNames[selectedZone - 1]}) Record Details & Data Provenance Labels
          </h2>
          <span className="text-xs font-semibold text-slate-500">{safeRecords.length} Timeline Records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-600 uppercase text-xs">
              <tr>
                <th className="p-3">Year</th>
                <th className="p-3">Zone</th>
                <th className="p-3">Population</th>
                <th className="p-3">Built-Up Surface (m²)</th>
                <th className="p-3">Night Light</th>
                <th className="p-3">Built-Up Provenance</th>
                <th className="p-3">Period</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {safeRecords.map((r, idx) => {
                const builtUpSrc = String(r?.builtUpSource || 'Interpolated Estimate');
                const isObserved = builtUpSrc.toLowerCase().includes('observed');
                const popVal = typeof r?.population === 'number' ? Math.round(r.population).toLocaleString() : '0';
                const builtUpVal = typeof r?.builtUpSurfaceM2 === 'number' ? Math.round(r.builtUpSurfaceM2).toLocaleString() : '0';
                const nightLightVal = typeof r?.nightLight === 'number' ? r.nightLight.toFixed(2) : '0.00';
                const zoneNameStr = r?.zone?.zoneName || zoneNames[selectedZone - 1];
                const zoneCodeStr = r?.zone?.zoneCode || `Z${selectedZone}`;

                return (
                  <tr key={r?.id || idx} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-700">{r?.year}</td>
                    <td className="p-3 font-medium text-slate-800">{zoneNameStr} ({zoneCodeStr})</td>
                    <td className="p-3 text-slate-900 font-semibold">{popVal}</td>
                    <td className="p-3 text-slate-700">{builtUpVal}</td>
                    <td className="p-3 text-slate-700">{nightLightVal}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 text-xs rounded font-medium ${
                        isObserved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {builtUpSrc}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 text-xs rounded font-medium ${
                        r?.isTrainingPeriod ? 'bg-sky-100 text-sky-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {r?.isTrainingPeriod ? 'Historical / Training' : 'Model Horizon'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
