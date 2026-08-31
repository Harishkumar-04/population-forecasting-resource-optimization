import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';
import { DataManagementPage } from './pages/DataManagementPage';
import { ForecastPage } from './pages/ForecastPage';
import { ResourceAnalysisPage } from './pages/ResourceAnalysisPage';
import { GisMapPage } from './pages/GisMapPage';
import { LayoutDashboard, Database, TrendingUp, Cpu, MapPin, Building2 } from 'lucide-react';

export const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
        {/* Navigation Bar */}
        <header className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Building2 className="w-7 h-7 text-sky-400" />
              <div>
                <h1 className="font-bold text-base leading-tight">Smart City Decision Support</h1>
                <p className="text-[11px] text-slate-400">Chennai Corporation 15-Zone Optimization System</p>
              </div>
            </div>

            <nav className="flex items-center space-x-1 sm:space-x-2">
              <NavLink 
                to="/" 
                end
                className={({ isActive }) => 
                  `flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    isActive ? 'bg-sky-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </NavLink>

              <NavLink 
                to="/data" 
                className={({ isActive }) => 
                  `flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    isActive ? 'bg-sky-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <Database className="w-4 h-4" />
                <span>Data Management</span>
              </NavLink>

              <NavLink 
                to="/forecast" 
                className={({ isActive }) => 
                  `flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    isActive ? 'bg-sky-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <TrendingUp className="w-4 h-4" />
                <span>Population Forecast</span>
              </NavLink>

              <NavLink 
                to="/resource" 
                className={({ isActive }) => 
                  `flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    isActive ? 'bg-sky-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <Cpu className="w-4 h-4" />
                <span>Resource Analysis</span>
              </NavLink>

              <NavLink 
                to="/gis" 
                className={({ isActive }) => 
                  `flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    isActive ? 'bg-sky-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <MapPin className="w-4 h-4" />
                <span>GIS Map</span>
              </NavLink>
            </nav>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/data" element={<DataManagementPage />} />
            <Route path="/forecast" element={<ForecastPage />} />
            <Route path="/resource" element={<ResourceAnalysisPage />} />
            <Route path="/gis" element={<GisMapPage />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-4 text-xs">
          <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
            <p>A Hybrid Machine Learning Approach for Urban Population Forecasting and Resource Optimization in Smart Cities</p>
            <p className="text-slate-500">College Final Year Project | 4-Module Scope</p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
