import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';
import { DataManagementPage } from './pages/DataManagementPage';
import { ForecastPage } from './pages/ForecastPage';
import { ResourceAnalysisPage } from './pages/ResourceAnalysisPage';
import { GisMapPage } from './pages/GisMapPage';
import { ResearchPaperPage } from './pages/ResearchPaperPage';
import { 
  LayoutDashboard, Database, TrendingUp, Cpu, MapPin, Building2, BookOpen, 
  Activity, ShieldCheck 
} from 'lucide-react';

export const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-sky-500 selection:text-white">
        {/* Navigation Bar */}
        <header className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 text-white shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
            
            {/* Brand Logo & Telemetry */}
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-cyan-400 p-0.5 shadow-md shadow-sky-500/20 flex items-center justify-center">
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-sky-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-extrabold text-sm sm:text-base tracking-tight text-white flex items-center gap-1.5">
                    SmartCity <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300 font-bold">Analytics</span>
                  </h1>
                  <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Live Engine
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Chennai Corporation 15-Zone Urban Decision Support</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="flex items-center space-x-1 sm:space-x-1.5">
              <NavLink 
                to="/" 
                end
                className={({ isActive }) => 
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    isActive 
                      ? 'bg-sky-600 text-white shadow-sm shadow-sky-500/30' 
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`
                }
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </NavLink>

              <NavLink 
                to="/data" 
                className={({ isActive }) => 
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    isActive 
                      ? 'bg-sky-600 text-white shadow-sm shadow-sky-500/30' 
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`
                }
              >
                <Database className="w-3.5 h-3.5" />
                <span>Data</span>
              </NavLink>

              <NavLink 
                to="/forecast" 
                className={({ isActive }) => 
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    isActive 
                      ? 'bg-sky-600 text-white shadow-sm shadow-sky-500/30' 
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`
                }
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Forecast</span>
              </NavLink>

              <NavLink 
                to="/resource" 
                className={({ isActive }) => 
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    isActive 
                      ? 'bg-sky-600 text-white shadow-sm shadow-sky-500/30' 
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`
                }
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Resources</span>
              </NavLink>

              <NavLink 
                to="/gis" 
                className={({ isActive }) => 
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    isActive 
                      ? 'bg-sky-600 text-white shadow-sm shadow-sky-500/30' 
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`
                }
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>GIS Map</span>
              </NavLink>

              <NavLink 
                to="/paper-results" 
                className={({ isActive }) => 
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30 ring-1 ring-blue-400/40' 
                      : 'text-blue-300 hover:bg-slate-800/80 hover:text-white border border-blue-500/30'
                  }`
                }
              >
                <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                <span>Paper & Figures</span>
              </NavLink>
            </nav>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/data" element={<DataManagementPage />} />
            <Route path="/forecast" element={<ForecastPage />} />
            <Route path="/resource" element={<ResourceAnalysisPage />} />
            <Route path="/gis" element={<GisMapPage />} />
            <Route path="/paper-results" element={<ResearchPaperPage />} />
          </Routes>
        </main>

        {/* Modernized Footer */}
        <footer className="bg-slate-900 border-t border-slate-800/80 text-slate-400 py-5 text-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400"></span>
              <p className="font-medium text-slate-300">
                Hybrid Machine Learning Approach for Urban Population Forecasting & Resource Allocation
              </p>
            </div>
            <div className="flex items-center gap-4 text-slate-500">
              <span>Greater Chennai Corporation (15 Zones • 2015–2030)</span>
              <span className="hidden sm:inline">•</span>
              <span className="text-slate-400 font-semibold">IEEE Access Format Visual Generator</span>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
