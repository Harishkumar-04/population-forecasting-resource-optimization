import React, { useEffect, useState } from 'react';
import { api, ResourceDemand } from '../services/api';
import { Droplets, Zap, Stethoscope, GraduationCap, AlertCircle, ShieldAlert, Sliders } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

export const ResourceAnalysisPage: React.FC = () => {
  const [demands, setDemands] = useState<ResourceDemand[]>([]);
  const [forecastYear, setForecastYear] = useState<number>(2030);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  const totalWater = demands.reduce((acc, d) => acc + d.waterDemandLpd, 0);
  const totalElec = demands.reduce((acc, d) => acc + d.electricityDemandKwhDay, 0);
  const totalBeds = demands.reduce((acc, d) => acc + d.healthcareBedsRequired, 0);
  const totalSeats = demands.reduce((acc, d) => acc + d.educationSeatsRequired, 0);

  const chartData = demands.map(d => ({
    name: d.zoneName,
    "Water (ML/day)": Math.round((d.waterDemandLpd / 1e6) * 100) / 100,
    "Electricity (MWh/day)": Math.round((d.electricityDemandKwhDay / 1e3) * 100) / 100,
    "Priority Score": d.priorityScore
  }));

  const getPriorityBadge = (level: string) => {
    switch (level) {
      case 'CRITICAL': return <span className="bg-rose-100 text-rose-800 font-bold px-2 py-1 rounded text-xs">CRITICAL</span>;
      case 'HIGH': return <span className="bg-amber-100 text-amber-800 font-bold px-2 py-1 rounded text-xs">HIGH</span>;
      case 'MEDIUM': return <span className="bg-sky-100 text-sky-800 font-bold px-2 py-1 rounded text-xs">MEDIUM</span>;
      default: return <span className="bg-slate-100 text-slate-700 font-bold px-2 py-1 rounded text-xs">LOW</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Module 3: Urban Resource Demand Estimation & Priority Analysis</h1>
        <p className="text-slate-500">Forecast-Based Demand Estimation & Multi-Criteria Priority Ranking</p>
      </div>

      {/* Control & Year Selector */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sliders className="w-5 h-5 text-sky-600" />
          <span className="text-sm font-bold text-slate-700">Target Forecast Year:</span>
          <select
            value={forecastYear}
            onChange={(e) => setForecastYear(Number(e.target.value))}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            {[2027, 2028, 2029, 2030].map(y => (
              <option key={y} value={y}>{y} Forecast</option>
            ))}
          </select>
        </div>
      </div>

      {/* Aggregate Totals */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-700 rounded-lg"><Droplets className="w-6 h-6" /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase">Water Demand ({forecastYear})</p>
            <p className="text-xl font-bold text-slate-800">{(totalWater / 1e6).toFixed(1)} ML/day</p>
            <p className="text-[10px] text-slate-400 mt-0.5">135 L/person/day</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-700 rounded-lg"><Zap className="w-6 h-6" /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase">Electricity Demand</p>
            <p className="text-xl font-bold text-slate-800">{(totalElec / 1e6).toFixed(2)} GWh/day</p>
            <p className="text-[10px] text-slate-400 mt-0.5">3.5 kWh/person/day</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-100 text-rose-700 rounded-lg"><Stethoscope className="w-6 h-6" /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase">Healthcare Requirement</p>
            <p className="text-xl font-bold text-slate-800">{Math.round(totalBeds).toLocaleString()} Beds</p>
            <p className="text-[10px] text-slate-400 mt-0.5">3 beds / 1,000 residents</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-100 text-purple-700 rounded-lg"><GraduationCap className="w-6 h-6" /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase">Education Requirement</p>
            <p className="text-xl font-bold text-slate-800">{Math.round(totalSeats).toLocaleString()} Seats</p>
            <p className="text-[10px] text-slate-400 mt-0.5">50 seats / 1,000 residents</p>
          </div>
        </div>
      </div>

      {/* Explicit Capacity Notice Banner */}
      <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-xl text-sm flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Official Resource Capacity Data Notice</p>
          <p className="text-xs text-amber-800 leading-relaxed mt-1">
            "Current resource capacity data is not currently available."
            Module 3 performs <strong>Resource Demand Estimation</strong> and <strong>Forecast-Based Priority Analysis</strong>.
            The system architecture is pre-configured with the extensible database table <code>resource_capacity</code> to compute supply-demand gaps once capacity data is obtained in Phase 2.
          </p>
        </div>
      </div>

      {/* Planning Assumptions */}
      <div className="bg-slate-900 text-slate-100 p-5 rounded-xl space-y-2 text-xs">
        <span className="bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded text-[10px] uppercase">
          PROJECT PLANNING ASSUMPTIONS
        </span>
        <p className="text-slate-300">
          Planning factors (135 LPD water, 3.5 kWh daily electricity, 3 beds/1k pop, 50 seats/1k pop) represent project planning benchmarks and should not be misconstrued as official government statutory standards. Priority scores are computed using transparent weighted factors: Population Growth + Projected Demand + Population Density.
        </p>
      </div>

      {/* Zone Demand Chart */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Zone-Wise Water Demand (ML/day) & Priority Score</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis />
              <Tooltip formatter={(value: number) => value.toLocaleString()} />
              <Legend />
              <Bar dataKey="Water (ML/day)" fill="#0284c7" />
              <Bar dataKey="Priority Score" fill="#f43f5e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Priority Ranking Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h2 className="font-bold text-slate-800 text-sm uppercase tracking-wider">
            Forecast-Driven Zone Priority Ranking ({forecastYear})
          </h2>
          <span className="text-xs font-semibold text-slate-500">Sorted by Priority Score Descending</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-600 uppercase text-xs">
              <tr>
                <th className="p-3">Rank</th>
                <th className="p-3">Zone</th>
                <th className="p-3">Forecast Pop ({forecastYear})</th>
                <th className="p-3">Water Demand (LPD)</th>
                <th className="p-3">Elec Demand (kWh/d)</th>
                <th className="p-3">Beds Req.</th>
                <th className="p-3">Seats Req.</th>
                <th className="p-3">Priority Score</th>
                <th className="p-3">Priority Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {demands.map((d, idx) => (
                <tr key={d.zoneId} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-500">#{idx + 1}</td>
                  <td className="p-3 font-bold text-slate-800">{d.zoneName} ({d.zoneCode})</td>
                  <td className="p-3 text-slate-900 font-semibold">{Math.round(d.population).toLocaleString()}</td>
                  <td className="p-3 text-slate-700">{(d.waterDemandLpd / 1e6).toFixed(2)} ML</td>
                  <td className="p-3 text-slate-700">{(d.electricityDemandKwhDay / 1e3).toFixed(1)} MWh</td>
                  <td className="p-3 text-slate-700">{Math.round(d.healthcareBedsRequired).toLocaleString()}</td>
                  <td className="p-3 text-slate-700">{Math.round(d.educationSeatsRequired).toLocaleString()}</td>
                  <td className="p-3 font-bold text-rose-600">{d.priorityScore}</td>
                  <td className="p-3">{getPriorityBadge(d.priorityLevel)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
