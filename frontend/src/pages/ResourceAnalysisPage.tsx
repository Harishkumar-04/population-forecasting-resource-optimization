import React, { useEffect, useState, useMemo } from 'react';
import { api, ResourceDemand } from '../services/api';
import { 
  Droplets, Zap, Stethoscope, GraduationCap, AlertCircle, 
  Sliders, Search, ArrowUpDown, Filter, Building2, 
  BarChart3, Sparkles, Award, TrendingUp, CheckCircle2
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, Legend, Cell 
} from 'recharts';

export const ResourceAnalysisPage: React.FC = () => {
  const [demands, setDemands] = useState<ResourceDemand[]>([]);
  const [forecastYear, setForecastYear] = useState<number>(2030);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('ALL');
  const [chartMetric, setChartMetric] = useState<'water' | 'electricity' | 'healthcare' | 'education' | 'priority'>('water');

  useEffect(() => {
    setLoading(true);
    api.getAllResourceDemands(forecastYear)
      .then(data => {
        setDemands(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [forecastYear]);

  // Aggregate computations
  const totalWater = useMemo(() => demands.reduce((acc, d) => acc + d.waterDemandLpd, 0), [demands]);
  const totalElec = useMemo(() => demands.reduce((acc, d) => acc + d.electricityDemandKwhDay, 0), [demands]);
  const totalBeds = useMemo(() => demands.reduce((acc, d) => acc + d.healthcareBedsRequired, 0), [demands]);
  const totalSeats = useMemo(() => demands.reduce((acc, d) => acc + d.educationSeatsRequired, 0), [demands]);
  const totalPop = useMemo(() => demands.reduce((acc, d) => acc + d.population, 0), [demands]);

  // Chart data mapping
  const chartData = useMemo(() => {
    return demands.map(d => ({
      name: d.zoneName.replace(/ Zone| Region/i, ''),
      fullName: d.zoneName,
      code: d.zoneCode,
      water: Math.round((d.waterDemandLpd / 1e6) * 100) / 100,
      electricity: Math.round((d.electricityDemandKwhDay / 1e3) * 100) / 100,
      healthcare: Math.round(d.healthcareBedsRequired),
      education: Math.round(d.educationSeatsRequired),
      priority: d.priorityScore,
      priorityLevel: d.priorityLevel
    }));
  }, [demands]);

  // Filtered demands for the priority ranking table
  const filteredDemands = useMemo(() => {
    return demands.filter(d => {
      const matchSearch = d.zoneName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          d.zoneCode.toLowerCase().includes(searchTerm.toLowerCase());
      const matchTier = selectedTier === 'ALL' || d.priorityLevel === selectedTier;
      return matchSearch && matchTier;
    });
  }, [demands, searchTerm, selectedTier]);

  const getPriorityBadge = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
            CRITICAL
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            HIGH
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
            MEDIUM
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            LOW
          </span>
        );
    }
  };

  const getActionRecommendation = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'Immediate Capital Outlay & Pipeline Expansion';
      case 'HIGH':
        return 'Substation & Feeder Line Reinforcement';
      case 'MEDIUM':
        return 'Preventive Upgrades & Metering Audits';
      default:
        return 'Standard Municipal Operation & Maintenance';
    }
  };

  if (loading && demands.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] gap-3">
        <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-500">Computing Normative Demands & Dynamic Priority Scores...</p>
      </div>
    );
  }

  return (
    <div className="space-y-7 pb-10">
      {/* Enterprise Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-radial-gradient from-sky-500/10 to-transparent pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-sky-500/20 text-sky-300 border border-sky-400/30">
              Module 03 • Normative Resource Modeling
            </span>
            <span className="text-xs text-slate-400">15 GCC Municipal Zones</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Urban Resource Demand Estimation & Multi-Criteria Priority Ranking
          </h1>
          <p className="text-slate-300 text-xs mt-1 max-w-2xl leading-relaxed">
            Dynamic normative calculations for municipal water, electric grid capacity, tertiary healthcare beds, and school seat requirements paired with an analytical multi-criteria priority allocation engine.
          </p>
        </div>

        {/* Forecast Year Scrubber Pills */}
        <div className="relative z-10 bg-slate-800/80 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/60 flex items-center gap-1.5 self-start md:self-center">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">Horizon:</span>
          {[2027, 2028, 2029, 2030].map(y => (
            <button
              key={y}
              onClick={() => setForecastYear(y)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                forecastYear === y
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      {/* Aggregate KPI Sector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Water Supply */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 to-blue-600"></div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Water Supply</span>
            <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600 group-hover:scale-105 transition">
              <Droplets className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {(totalWater / 1e6).toFixed(1)} <span className="text-sm font-semibold text-slate-500">ML/day</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Per Capita Norm:</span>
            <span className="font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">135 Liters/Day</span>
          </div>
        </div>

        {/* Electricity Grid */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-600"></div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Power Grid</span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 group-hover:scale-105 transition">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {(totalElec / 1e6).toFixed(2)} <span className="text-sm font-semibold text-slate-500">GWh/day</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Per Capita Norm:</span>
            <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">3.5 kWh/Day</span>
          </div>
        </div>

        {/* Healthcare Infrastructure */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-pink-600"></div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Healthcare Beds</span>
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 group-hover:scale-105 transition">
              <Stethoscope className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {Math.round(totalBeds).toLocaleString()} <span className="text-sm font-semibold text-slate-500">Beds</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Municipal Standard:</span>
            <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">3 Beds / 1k Pop</span>
          </div>
        </div>

        {/* Education Seats */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-600"></div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Education Seats</span>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 group-hover:scale-105 transition">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {Math.round(totalSeats).toLocaleString()} <span className="text-sm font-semibold text-slate-500">Seats</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Municipal Standard:</span>
            <span className="font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">50 Seats / 1k Pop</span>
          </div>
        </div>
      </div>

      {/* Priority Formulation & Capacity Architecture Notice */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Formulation Decomposition */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-sky-50 text-sky-600">
                <Sliders className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Multi-Criteria Resource Priority Formulation
              </h2>
            </div>
            <span className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
              Score Range: 0.00 – 1.00
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            The decision-support framework assigns municipal intervention priority using an objective, normalized composite index calculated across three key urban growth dimensions:
          </p>

          <div className="space-y-3 pt-1">
            {/* Weight 1 */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-slate-700">1. Projected Growth Rate Weight (w₁ = 40%)</span>
                <span className="font-extrabold text-amber-600">0.40</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '40%' }}></div>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Captures acceleration in residential migration and peripheral expansion.</p>
            </div>

            {/* Weight 2 */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-slate-700">2. Population Density Pressure Weight (w₂ = 35%)</span>
                <span className="font-extrabold text-sky-600">0.35</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-sky-500 h-full rounded-full" style={{ width: '35%' }}></div>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Accounts for spatial congestion, built-up saturation, and infrastructure stress per km².</p>
            </div>

            {/* Weight 3 */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-slate-700">3. Aggregate Resource Volume Weight (w₃ = 25%)</span>
                <span className="font-extrabold text-emerald-600">0.25</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '25%' }}></div>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Reflects baseline gross consumption magnitude across water, energy, and civic amenities.</p>
            </div>
          </div>
        </div>

        {/* Enterprise Notice & Database Extensibility */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-md flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-400/20 text-amber-300 border border-amber-400/30">
                Architectural Notice
              </span>
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              Official Resource Capacity & Extensible Schema
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              "Current resource capacity data is not currently available."
              Module 3 performs rigorous <strong>Resource Demand Estimation</strong> and <strong>Forecast-Based Priority Ranking</strong>.
            </p>
            <p className="text-xs text-slate-300 leading-relaxed mt-2">
              The project backend is pre-configured with the extensible database table <code className="text-sky-300 bg-slate-800 px-1 py-0.5 rounded">resource_capacity</code> to immediately compute supply-demand gaps once municipal operational records become available.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
            <span>Status: Phase 1 Normative</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Phase 2
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Zone Demand & Metric Visualizer */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Comparative Zone Resource Allocation & Priority Distribution ({forecastYear})
            </h2>
            <p className="text-xs text-slate-500">
              Interactive municipal comparison across all 15 Greater Chennai Corporation administrative zones.
            </p>
          </div>

          {/* Metric Switcher Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setChartMetric('water')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                chartMetric === 'water' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Water (ML/d)
            </button>
            <button
              onClick={() => setChartMetric('electricity')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                chartMetric === 'electricity' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Electricity (MWh/d)
            </button>
            <button
              onClick={() => setChartMetric('healthcare')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                chartMetric === 'healthcare' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Beds
            </button>
            <button
              onClick={() => setChartMetric('education')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                chartMetric === 'education' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Seats
            </button>
            <button
              onClick={() => setChartMetric('priority')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                chartMetric === 'priority' ? 'bg-white text-rose-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Priority Score
            </button>
          </div>
        </div>

        {/* Dynamic Chart Container */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 10, fill: '#64748b' }} 
                interval={0} 
                angle={-30} 
                textAnchor="end"
              />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-xl shadow-xl text-xs space-y-1.5 border border-slate-700">
                        <p className="font-bold text-sky-400">{d.fullName} ({d.code})</p>
                        <div className="pt-1 border-t border-slate-800 space-y-1">
                          <p><span className="text-slate-400">Water Demand:</span> <span className="font-semibold text-white">{d.water} ML/day</span></p>
                          <p><span className="text-slate-400">Power Demand:</span> <span className="font-semibold text-white">{d.electricity} MWh/day</span></p>
                          <p><span className="text-slate-400">Hospital Beds:</span> <span className="font-semibold text-white">{d.healthcare.toLocaleString()}</span></p>
                          <p><span className="text-slate-400">School Seats:</span> <span className="font-semibold text-white">{d.education.toLocaleString()}</span></p>
                          <p><span className="text-slate-400">Priority Score:</span> <span className="font-bold text-rose-400">{d.priority} ({d.priorityLevel})</span></p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey={chartMetric} 
                radius={[6, 6, 0, 0]}
              >
                {chartData.map((entry, index) => {
                  let barColor = '#0284c7';
                  if (chartMetric === 'electricity') barColor = '#f59e0b';
                  if (chartMetric === 'healthcare') barColor = '#e11d48';
                  if (chartMetric === 'education') barColor = '#9333ea';
                  if (chartMetric === 'priority') {
                    if (entry.priorityLevel === 'CRITICAL') barColor = '#e11d48';
                    else if (entry.priorityLevel === 'HIGH') barColor = '#f59e0b';
                    else if (entry.priorityLevel === 'MEDIUM') barColor = '#0284c7';
                    else barColor = '#10b981';
                  }
                  return <Cell key={`cell-${index}`} fill={barColor} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Forecast-Driven Zone Priority Ranking Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Table Controls Bar */}
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
          <div>
            <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              Forecast-Driven Zone Priority Ranking ({forecastYear})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Ranked from highest composite intervention need to lowest based on multi-criteria index.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search zone name or code..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 w-56"
              />
            </div>

            {/* Tier Filter */}
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 text-xs">
              <span className="text-[10px] font-bold text-slate-400 px-2 uppercase">Tier:</span>
              {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(tier => (
                <button
                  key={tier}
                  onClick={() => setSelectedTier(tier)}
                  className={`px-2 py-0.5 rounded-lg font-bold transition text-[11px] ${
                    selectedTier === tier
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200/80">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Zone & Code</th>
                <th className="py-3 px-4 text-right">Projected Pop ({forecastYear})</th>
                <th className="py-3 px-4 text-right">Water (ML/d)</th>
                <th className="py-3 px-4 text-right">Power (MWh/d)</th>
                <th className="py-3 px-4 text-right">Beds Req.</th>
                <th className="py-3 px-4 text-right">Seats Req.</th>
                <th className="py-3 px-4 text-center">Priority Score</th>
                <th className="py-3 px-4 text-center">Priority Tier</th>
                <th className="py-3 px-4">Recommended Policy Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDemands.map((d, idx) => (
                <tr key={d.zoneId} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-black">
                    {idx === 0 ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-800 text-xs font-black">
                        🥇 1
                      </span>
                    ) : idx === 1 ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-black">
                        🥈 2
                      </span>
                    ) : idx === 2 ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-700/10 text-amber-800 text-xs font-black">
                        🥉 3
                      </span>
                    ) : (
                      <span className="text-slate-400 font-bold pl-2">#{idx + 1}</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-800">{d.zoneName}</div>
                    <div className="text-[10px] text-slate-400 font-semibold">{d.zoneCode} • Zone ID: {d.zoneId}</div>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900">
                    {Math.round(d.population).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-sky-700">
                    {(d.waterDemandLpd / 1e6).toFixed(2)} ML
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-amber-700">
                    {(d.electricityDemandKwhDay / 1e3).toFixed(1)} MWh
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-slate-700">
                    {Math.round(d.healthcareBedsRequired).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-slate-700">
                    {Math.round(d.educationSeatsRequired).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200/60">
                      {d.priorityScore}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {getPriorityBadge(d.priorityLevel)}
                  </td>
                  <td className="py-3 px-4 text-[11px] text-slate-600 font-medium">
                    {getActionRecommendation(d.priorityLevel)}
                  </td>
                </tr>
              ))}
              {filteredDemands.length === 0 && (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-slate-400 font-medium">
                    No zones matching the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
