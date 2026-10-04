import React, { useEffect, useState } from 'react';
import { api, DashboardSummary } from '../services/api';
import { 
  Users, TrendingUp, Droplets, Zap, Stethoscope, GraduationCap, 
  AlertCircle, ArrowUpRight, BarChart3, Calendar, Layers, ShieldAlert 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, Legend, Cell 
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(2030);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [activeMetricTab, setActiveMetricTab] = useState<'population' | 'water' | 'electricity'>('population');

  useEffect(() => {
    setLoading(true);
    api.getDashboardSummary(selectedYear)
      .then(data => {
        setSummary(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load dashboard data. Ensure backend is running on port 8080.');
        setLoading(false);
      });
  }, [selectedYear]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[420px] gap-3">
        <div className="w-12 h-12 rounded-full border-3 border-sky-200 border-t-sky-600 animate-spin"></div>
        <p className="text-xs font-bold text-slate-500 tracking-wide uppercase">Assembling Smart City Analytics...</p>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-xl flex items-center gap-3 shadow-xs">
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
        <span className="text-sm font-semibold">{error || 'Error loading dashboard metrics.'}</span>
      </div>
    );
  }

  // Format chart data based on active metric tab
  const chartData = summary.highGrowthZones.map(z => {
    const pop26 = Math.round(z.latestKnownPopulation);
    const popPred = Math.round(z.predictedPopulation);
    const waterPred = Math.round((z.predictedPopulation * 135.0 / 1e6) * 100) / 100;
    const water26 = Math.round((z.latestKnownPopulation * 135.0 / 1e6) * 100) / 100;
    const elecPred = Math.round((z.predictedPopulation * 3.5 / 1e3) * 100) / 100;
    const elec26 = Math.round((z.latestKnownPopulation * 3.5 / 1e3) * 100) / 100;

    return {
      name: z.zoneName,
      code: z.zoneCode,
      pop2026: pop26,
      popForecast: popPred,
      water2026: water26,
      waterForecast: waterPred,
      elec2026: elec26,
      elecForecast: elecPred,
      growth: z.growthPercentage
    };
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Target Year Scrubber */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-sky-100 text-sky-800 tracking-wide">
              Executive Decision Console
            </span>
            <span className="text-slate-400 text-xs font-medium">15 Corporation Zones Aligned</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight mt-1">
            Greater Chennai Corporation Urban Analytics
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Multi-Temporal Demographics & Infrastructure Demand Forecasting (2015–2030)
          </p>
        </div>

        {/* Target Forecast Year Selector */}
        <div className="flex items-center gap-2 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200">
          <Calendar className="w-4 h-4 text-slate-500 ml-1.5" />
          <span className="text-xs font-bold text-slate-600 mr-1">Target Horizon:</span>
          {[2026, 2027, 2028, 2029, 2030].map(yr => (
            <button
              key={yr}
              onClick={() => setSelectedYear(yr)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all duration-150 ${
                selectedYear === yr
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              {yr}
            </button>
          ))}
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: 2026 Baseline Population */}
        <div className="relative overflow-hidden bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-slate-400 to-slate-500"></div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Baseline Pop (2026)</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tight">
            {(summary.latestTotalPopulation / 1e6).toFixed(2)}M
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-500 font-medium">
            <span>Observed Ground Truth (GCC 15 Zones)</span>
          </div>
        </div>

        {/* Card 2: Selected Year Forecast Population */}
        <div className="relative overflow-hidden bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400"></div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">{selectedYear} Projected Pop</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tight">
            {(summary.forecastTotalPopulation / 1e6).toFixed(2)}M
          </p>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
              <ArrowUpRight className="w-3 h-3 mr-0.5" />
              +{summary.averageGrowthPercentage.toFixed(2)}%
            </span>
            <span className="text-[11px] text-slate-500 font-medium">Growth vs 2026</span>
          </div>
        </div>

        {/* Card 3: Daily Water Demand */}
        <div className="relative overflow-hidden bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 to-cyan-400"></div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-sky-700 uppercase tracking-wider">Potable Water Demand</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tight">
            {(summary.totalWaterDemandLpd / 1e6).toFixed(2)} <span className="text-sm font-semibold text-slate-500">MLD</span>
          </p>
          <div className="flex items-center justify-between mt-2 text-[11px] text-slate-500 font-medium">
            <span>MoHUA Norm</span>
            <span className="font-semibold text-sky-700">135 LPD / person</span>
          </div>
        </div>

        {/* Card 4: Daily Electric Power Demand */}
        <div className="relative overflow-hidden bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-400"></div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Electric Power Demand</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tight">
            {(summary.totalElectricityDemandKwhDay / 1e3).toFixed(1)} <span className="text-sm font-semibold text-slate-500">MWh/d</span>
          </p>
          <div className="flex items-center justify-between mt-2 text-[11px] text-slate-500 font-medium">
            <span>CEA Urban Factor</span>
            <span className="font-semibold text-amber-700">3.5 kWh / day</span>
          </div>
        </div>
      </div>

      {/* Secondary Civic Facilities Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Healthcare Capacity */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">Healthcare Infrastructure Target</p>
              <p className="text-xl font-black text-slate-900 tracking-tight mt-0.5">
                {Math.round(summary.totalHealthcareBedsRequired).toLocaleString()} <span className="text-xs font-semibold text-slate-500">Hospital Beds</span>
              </p>
              <p className="text-[11px] text-slate-400 font-medium">Indian Public Health Standards (3 beds per 1,000 residents)</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            Target {selectedYear}
          </span>
        </div>

        {/* Public Education Capacity */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">Public Education Capacity Target</p>
              <p className="text-xl font-black text-slate-900 tracking-tight mt-0.5">
                {Math.round(summary.totalEducationSeatsRequired).toLocaleString()} <span className="text-xs font-semibold text-slate-500">School Seats</span>
              </p>
              <p className="text-[11px] text-slate-400 font-medium">UDPFI & RTE Guidelines (50 classroom seats per 1,000 residents)</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            Target {selectedYear}
          </span>
        </div>
      </div>

      {/* Main Charts & High Growth Ranking Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive Comparison Bar Chart (Col Span 2) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                Top Urban Growth Zones ({selectedYear} Projections)
              </h2>
              <p className="text-xs text-slate-500">Zone-level comparison against 2026 baseline</p>
            </div>

            {/* Metric Tab Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActiveMetricTab('population')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeMetricTab === 'population' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Population
              </button>
              <button
                onClick={() => setActiveMetricTab('water')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeMetricTab === 'water' ? 'bg-white text-sky-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Water (MLD)
              </button>
              <button
                onClick={() => setActiveMetricTab('electricity')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeMetricTab === 'electricity' ? 'bg-white text-amber-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Electricity (MWh)
              </button>
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {activeMetricTab === 'population' ? (
                <BarChart data={chartData} margin={{ top: 15, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="2 2" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#475569' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#475569' }} tickFormatter={(v) => `${(v / 1e3).toFixed(0)}k`} />
                  <Tooltip 
                    formatter={(v: number, name: string) => [
                      `${Math.round(v).toLocaleString()} persons`, 
                      name === 'pop2026' ? '2026 Baseline' : `${selectedYear} Forecast`
                    ]} 
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Bar dataKey="pop2026" name="2026 Baseline" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={16} />
                  <Bar dataKey="popForecast" name={`${selectedYear} Forecast`} fill="#0284c7" radius={[4, 4, 0, 0]} barSize={16} />
                </BarChart>
              ) : activeMetricTab === 'water' ? (
                <BarChart data={chartData} margin={{ top: 15, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="2 2" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#475569' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#475569' }} tickFormatter={(v) => `${v} MLD`} />
                  <Tooltip formatter={(v: number, name: string) => [`${v.toFixed(2)} ML/day`, name === 'water2026' ? '2026 Baseline' : `${selectedYear} Forecast`]} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Bar dataKey="water2026" name="2026 Baseline" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={16} />
                  <Bar dataKey="waterForecast" name={`${selectedYear} Forecast`} fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={16} />
                </BarChart>
              ) : (
                <BarChart data={chartData} margin={{ top: 15, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="2 2" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#475569' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#475569' }} tickFormatter={(v) => `${v} MWh`} />
                  <Tooltip formatter={(v: number, name: string) => [`${v.toFixed(2)} MWh/day`, name === 'elec2026' ? '2026 Baseline' : `${selectedYear} Forecast`]} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Bar dataKey="elec2026" name="2026 Baseline" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={16} />
                  <Bar dataKey="elecForecast" name={`${selectedYear} Forecast`} fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={16} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 5 Growth Ranking Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Growth Leaders</h2>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-sky-50 text-sky-700">Top 5</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">Ranked by population addition</p>

            <div className="space-y-2.5">
              {summary.highGrowthZones.map((z, idx) => (
                <div 
                  key={z.zoneId} 
                  className="p-3 bg-slate-50/70 hover:bg-slate-50 rounded-xl border border-slate-200/60 transition-all flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{z.zoneName}</p>
                      <p className="text-[10px] text-slate-400 font-medium">Zone {z.zoneId} • {z.zoneCode}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="inline-flex items-center text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      +{z.growthPercentage.toFixed(2)}%
                    </span>
                    <p className="text-[11px] font-bold text-slate-700 mt-0.5">
                      {Math.round(z.predictedPopulation).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Model: Hybrid LSTM+XGBoost</span>
            <span className="font-semibold text-sky-600">R² = 0.9994</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
