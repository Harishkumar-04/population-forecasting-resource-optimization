import React, { useEffect, useState } from 'react';
import { api, DashboardSummary } from '../services/api';
import { Users, TrendingUp, Droplets, Zap, Stethoscope, GraduationCap, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

export const DashboardPage: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {

    api.getDashboardSummary(2030)
      .then(data => {
        setSummary(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load dashboard data. Ensure backend is running.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-2">
        <AlertCircle className="w-5 h-5" />
        <span>{error || 'Error loading dashboard.'}</span>
      </div>
    );
  }

  const chartData = summary.highGrowthZones.map(z => ({
    name: z.zoneName,
    "2026 Population": Math.round(z.latestKnownPopulation),
    "2030 Predicted": Math.round(z.predictedPopulation)
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Smart City Decision Dashboard</h1>
        <p className="text-slate-500">Integrated Chennai Corporation 15-Zone Population & Resource Analytics (2015–2030)</p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-sky-100 text-sky-700 rounded-lg"><Users className="w-6 h-6" /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase">Latest Total Pop (2026)</p>
            <p className="text-xl font-bold text-slate-800">{(summary.latestTotalPopulation / 1e6).toFixed(2)}M</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-700 rounded-lg"><TrendingUp className="w-6 h-6" /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase">Forecast Total Pop (2030)</p>
            <p className="text-xl font-bold text-slate-800">{(summary.forecastTotalPopulation / 1e6).toFixed(2)}M</p>
            <span className="text-xs text-emerald-600 font-semibold">+{summary.averageGrowthPercentage.toFixed(1)}% Avg Growth</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-700 rounded-lg"><Droplets className="w-6 h-6" /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase">Total Water Demand</p>
            <p className="text-xl font-bold text-slate-800">{(summary.totalWaterDemandLpd / 1e6).toFixed(1)} ML/day</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-700 rounded-lg"><Zap className="w-6 h-6" /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase">Total Electricity Demand</p>
            <p className="text-xl font-bold text-slate-800">{(summary.totalElectricityDemandKwhDay / 1e6).toFixed(2)} GWh/day</p>
          </div>
        </div>
      </div>

      {/* Second Stat Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-100 text-rose-700 rounded-lg"><Stethoscope className="w-6 h-6" /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase">Healthcare Requirements (2030)</p>
            <p className="text-xl font-bold text-slate-800">{Math.round(summary.totalHealthcareBedsRequired).toLocaleString()} Hospital Beds</p>
            <p className="text-xs text-slate-400">Based on 3 beds / 1,000 residents planning factor</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-100 text-purple-700 rounded-lg"><GraduationCap className="w-6 h-6" /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase">Education Requirements (2030)</p>
            <p className="text-xl font-bold text-slate-800">{Math.round(summary.totalEducationSeatsRequired).toLocaleString()} School Seats</p>
            <p className="text-xs text-slate-400">Based on 50 seats / 1,000 residents planning factor</p>
          </div>
        </div>
      </div>

      {/* Notice Banner */}
      <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl text-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span><strong>Resource Capacity Notice:</strong> {summary.capacityNotice} Demand is calculated from model-forecast population.</span>
        </div>
      </div>

      {/* Charts & High Growth Zones */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Top High-Growth Zones (2026 vs 2030 Forecast)</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip formatter={(value: number) => value.toLocaleString()} />
                <Legend />
                <Bar dataKey="2026 Population" fill="#94a3b8" />
                <Bar dataKey="2030 Predicted" fill="#0284c7" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4">High-Growth Ranking</h2>
          <div className="space-y-3">
            {summary.highGrowthZones.map((z, idx) => (
              <div key={z.zoneId} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 flex items-center justify-center bg-sky-600 text-white font-bold rounded-full text-xs">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{z.zoneName}</p>
                    <p className="text-xs text-slate-500">Zone {z.zoneId} ({z.zoneCode})</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                    +{z.growthPercentage.toFixed(1)}%
                  </span>
                  <p className="text-xs text-slate-500 mt-1">{Math.round(z.predictedPopulation).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
