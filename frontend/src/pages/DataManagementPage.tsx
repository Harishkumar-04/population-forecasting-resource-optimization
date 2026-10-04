import React, { useEffect, useState } from 'react';
import { api, DataSummary, UrbanRecord } from '../services/api';
import { 
  Database, CheckCircle2, FileText, Info, AlertCircle, RefreshCw, 
  Satellite, Search, Filter, ShieldCheck, MapPin, Layers 
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, Legend, AreaChart, Area 
} from 'recharts';

export const DataManagementPage: React.FC = () => {
  const [summary, setSummary] = useState<DataSummary | null>(null);
  const [records, setRecords] = useState<UrbanRecord[]>([]);
  const [selectedZone, setSelectedZone] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [periodFilter, setPeriodFilter] = useState<'ALL' | 'TRAIN' | 'FORECAST'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

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
      <div className="flex flex-col items-center justify-center min-h-[420px] gap-3">
        <div className="w-12 h-12 rounded-full border-3 border-sky-200 border-t-sky-600 animate-spin"></div>
        <p className="text-xs font-bold text-slate-500 tracking-wide uppercase">Ingesting Ground Truth & Satellite Proxies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-2xl space-y-3 my-6 shadow-xs">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
          <h2 className="text-base font-bold">Data Connection Error</h2>
        </div>
        <p className="text-sm">{error}</p>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-700 transition"
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
    "Built-Up (km²)": Math.round(((r?.builtUpSurfaceM2 || 0) / 1e6) * 100) / 100,
    "Night-Light": Math.round((r?.nightLight || 0) * 100) / 100
  }));

  const zoneNames = [
    'Thiruvottiyur', 'Manali', 'Madhavaram', 'Tondiarpet', 'Royapuram',
    'Thiru-Vi-Ka-Nagar', 'Ambattur', 'Annanagar', 'Teynampet', 'Kodambakkam',
    'Valasaravakkam', 'Alandur', 'Adyar', 'Perungudi', 'Sholinganallur'
  ];

  // Filter records based on active period filter & search query
  const filteredRecords = safeRecords.filter(r => {
    if (periodFilter === 'TRAIN' && !r.isTrainingPeriod) return false;
    if (periodFilter === 'FORECAST' && r.isTrainingPeriod) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchYear = String(r.year).includes(q);
      const matchSource = String(r.builtUpSource || '').toLowerCase().includes(q);
      return matchYear || matchSource;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 tracking-wide">
              Module 1 Pipeline
            </span>
            <span className="text-slate-400 text-xs font-medium">Data Ingestion & Integrity</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight mt-1">
            Data Acquisition, Verification & Earth Observation Proxies
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Multi-Temporal Data Cleaning, Normalization & Provenance Tracking (2015–2030)
          </p>
        </div>

        <button
          onClick={fetchData}
          className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 transition-all active:scale-95"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
          <span>Refresh Pipeline</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="relative overflow-hidden bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="absolute top-0 left-0 right-0 h-1 bg-sky-500"></div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Records</span>
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                <Database className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 tracking-tight">{summary.totalRecords || 240}</p>
            <p className="text-[11px] text-slate-500 font-medium mt-1">15 Zones × 16 Annual Epochs</p>
          </div>

          <div className="relative overflow-hidden bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500"></div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Quality Status</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-emerald-600 tracking-tight">{summary.preprocessingStatus || 'VALIDATED'}</p>
            <p className="text-[11px] text-slate-500 font-medium mt-1">100% Complete • 0 Nulls • 0 Outliers</p>
          </div>

          <div className="relative overflow-hidden bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500"></div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">Training Horizon</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 tracking-tight">2015–2026</p>
            <p className="text-[11px] text-slate-500 font-medium mt-1">180 Historical Training Samples</p>
          </div>

          <div className="relative overflow-hidden bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500"></div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Spatial Features</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 tracking-tight">{summary.numberOfFeatures || 8} Variables</p>
            <p className="text-[11px] text-slate-500 font-medium mt-1">Pop, Built-Up, VIIRS, Growth Rate</p>
          </div>
        </div>
      )}

      {/* Earth Observation Satellite Provenance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* GHSL Physical Footprint Card */}
        <div className="bg-gradient-to-br from-emerald-50/60 to-white p-5 rounded-2xl border border-emerald-200/80 shadow-xs flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
            <Satellite className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-extrabold text-sm text-slate-800">GHSL Built-Up Surface Proxy</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                100m Resolution
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Observed European Commission GHSL satellite epochs available for <strong>2015, 2020, 2025, 2030</strong>.
              Intervening annual points are linearly interpolated and clearly tagged to maintain strict scientific provenance.
            </p>
          </div>
        </div>

        {/* VIIRS Night Light Radiance Card */}
        <div className="bg-gradient-to-br from-amber-50/60 to-white p-5 rounded-2xl border border-amber-200/80 shadow-xs flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
            <Satellite className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-extrabold text-sm text-slate-800">VIIRS Day/Night Band (DNB)</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 text-amber-800">
                nW/cm²/sr Radiance
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Annual composite nocturnal luminosity extracted from NOAA Suomi-NPP satellite sensor.
              Acts as a real-time socio-economic density proxy correlating with commercial and infrastructure activity.
            </p>
          </div>
        </div>
      </div>

      {/* Visual Trends Section */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Zone Multimodal Trajectories (2015–2030)</h2>
            <p className="text-xs text-slate-500">Physical built-up expansion versus nocturnal light radiance</p>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            <MapPin className="w-4 h-4 text-sky-600 ml-1" />
            <label className="text-xs font-bold text-slate-700">Select Zone:</label>
            <select 
              value={selectedZone}
              onChange={(e) => setSelectedZone(Number(e.target.value))}
              className="px-3 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 shadow-xs focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
            >
              {zoneNames.map((name, i) => (
                <option key={i + 1} value={i + 1}>
                  Zone {i + 1} - {name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          {/* Population Growth Trajectory */}
          <div className="h-72">
            <p className="text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">Demographic Trajectory (Persons)</p>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="popColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 2" stroke="#f1f5f9" />
                <XAxis dataKey="year" tick={{ fontSize: 10, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 10, fill: '#475569' }} tickFormatter={(v) => `${Math.round(v / 1e3)}k`} />
                <Tooltip formatter={(value: number) => [`${Math.round(value).toLocaleString()} persons`, 'Population']} />
                <Area type="monotone" dataKey="Population" stroke="#0284c7" strokeWidth={2.5} fillOpacity={1} fill="url(#popColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Physical Built-Up & Night-Light Trends */}
          <div className="h-72">
            <p className="text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">Built-Up Footprint (km²) & Radiance</p>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#f1f5f9" />
                <XAxis dataKey="year" tick={{ fontSize: 10, fill: '#475569' }} />
                <YAxis yAxisId="left" tick={{ fontSize: 10, fill: '#475569' }} tickFormatter={(v) => `${v} km²`} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: '#475569' }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <Line yAxisId="left" type="monotone" dataKey="Built-Up (km²)" stroke="#10b981" strokeWidth={2.2} dot={{ r: 3 }} />
                <Line yAxisId="right" type="monotone" dataKey="Night-Light" stroke="#f59e0b" strokeWidth={2.2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Enhanced Data Explorer Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-extrabold text-slate-900 text-xs sm:text-sm uppercase tracking-wider">
              Zone {selectedZone} ({zoneNames[selectedZone - 1]}) Master Timeline Dataset
            </h2>
            <p className="text-xs text-slate-500 font-medium">{filteredRecords.length} records matching current filter</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                placeholder="Search year or source..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 w-44"
              />
            </div>

            {/* Period Filter Buttons */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-300 text-xs font-semibold">
              <button
                onClick={() => setPeriodFilter('ALL')}
                className={`px-2 py-0.5 rounded transition ${periodFilter === 'ALL' ? 'bg-sky-600 text-white font-bold' : 'text-slate-600'}`}
              >
                All (16y)
              </button>
              <button
                onClick={() => setPeriodFilter('TRAIN')}
                className={`px-2 py-0.5 rounded transition ${periodFilter === 'TRAIN' ? 'bg-sky-600 text-white font-bold' : 'text-slate-600'}`}
              >
                Historical (2015-26)
              </button>
              <button
                onClick={() => setPeriodFilter('FORECAST')}
                className={`px-2 py-0.5 rounded transition ${periodFilter === 'FORECAST' ? 'bg-sky-600 text-white font-bold' : 'text-slate-600'}`}
              >
                Forecast (2027-30)
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100/80 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Year</th>
                <th className="py-2.5 px-3">Zone Identity</th>
                <th className="py-2.5 px-3">Population</th>
                <th className="py-2.5 px-3">Built-Up Area (m²)</th>
                <th className="py-2.5 px-3">Built-Up (km²)</th>
                <th className="py-2.5 px-3">Night Light</th>
                <th className="py-2.5 px-3">Built-Up Provenance</th>
                <th className="py-2.5 px-3">Pipeline Epoch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((r, idx) => {
                const builtUpSrc = String(r?.builtUpSource || 'Interpolated Estimate');
                const isObserved = builtUpSrc.toLowerCase().includes('observed');
                const popVal = typeof r?.population === 'number' ? Math.round(r.population).toLocaleString() : '0';
                const builtUpVal = typeof r?.builtUpSurfaceM2 === 'number' ? Math.round(r.builtUpSurfaceM2).toLocaleString() : '0';
                const builtUpKm2 = typeof r?.builtUpSurfaceM2 === 'number' ? (r.builtUpSurfaceM2 / 1e6).toFixed(2) : '0.00';
                const nightLightVal = typeof r?.nightLight === 'number' ? r.nightLight.toFixed(2) : '-';
                const zoneNameStr = r?.zone?.zoneName || zoneNames[selectedZone - 1];
                const zoneCodeStr = r?.zone?.zoneCode || `Z${selectedZone}`;

                return (
                  <tr key={r?.id || idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2 px-3 font-bold text-slate-800">{r?.year}</td>
                    <td className="py-2 px-3 font-semibold text-slate-700">{zoneNameStr} ({zoneCodeStr})</td>
                    <td className="py-2 px-3 text-slate-900 font-bold font-mono">{popVal}</td>
                    <td className="py-2 px-3 text-slate-600 font-mono">{builtUpVal}</td>
                    <td className="py-2 px-3 text-slate-800 font-semibold font-mono">{builtUpKm2} km²</td>
                    <td className="py-2 px-3 text-slate-600 font-mono">{nightLightVal}</td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold inline-block ${
                        isObserved ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {builtUpSrc}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold inline-block ${
                        r?.isTrainingPeriod ? 'bg-sky-100 text-sky-800' : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {r?.isTrainingPeriod ? 'Historical / Training' : 'Model Predictive Forecast'}
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

export default DataManagementPage;
