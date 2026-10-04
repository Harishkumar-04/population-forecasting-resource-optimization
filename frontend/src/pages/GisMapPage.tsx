import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { api } from '../services/api';
import { 
  MapPin, Layers, Info, X, AlertTriangle, ShieldAlert, 
  Droplets, Zap, Users, Stethoscope, GraduationCap, 
  Maximize2, Compass, Award, ExternalLink 
} from 'lucide-react';
import L from 'leaflet';

export const GisMapPage: React.FC = () => {
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [selectedLayer, setSelectedLayer] = useState<string>('priorityLevel');
  const [selectedZoneProps, setSelectedZoneProps] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [forecastYear, setForecastYear] = useState<number>(2030);

  useEffect(() => {
    setLoading(true);
    api.getGisZones(forecastYear)
      .then(data => {
        setGeoJsonData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load GIS GeoJSON:', err);
        setLoading(false);
      });
  }, [forecastYear]);

  // Color functions for thematic GIS layers
  const getColor = (feature: any) => {
    const props = feature.properties || {};
    
    if (selectedLayer === 'priorityLevel') {
      const level = props.priorityLevel || 'LOW';
      switch (level) {
        case 'CRITICAL': return '#e11d48'; // Rose-600
        case 'HIGH': return '#f59e0b';     // Amber-500
        case 'MEDIUM': return '#0284c7';   // Sky-600
        default: return '#10b981';         // Emerald-500
      }
    }

    if (selectedLayer === 'waterDemand') {
      const val = props.waterDemandLpd || 0;
      if (val > 100000000) return '#0369a1';
      if (val > 70000000) return '#0284c7';
      if (val > 40000000) return '#38bdf8';
      return '#bae6fd';
    }

    if (selectedLayer === 'electricityDemand') {
      const val = props.electricityDemandKwhDay || 0;
      if (val > 2500000) return '#b45309';
      if (val > 1800000) return '#d97706';
      if (val > 1000000) return '#f59e0b';
      return '#fde68a';
    }

    // Default Population scale
    const pop = props.population || 0;
    if (pop > 800000) return '#4c1d95';
    if (pop > 600000) return '#6d28d9';
    if (pop > 400000) return '#8b5cf6';
    return '#c4b5fd';
  };

  const style = (feature: any) => {
    return {
      fillColor: getColor(feature),
      weight: 2,
      opacity: 1,
      color: '#ffffff',
      dashArray: '3',
      fillOpacity: 0.75
    };
  };

  const onEachFeature = (feature: any, layer: L.Layer) => {
    const props = feature.properties || {};

    layer.on({
      mouseover: (e) => {
        const l = e.target;
        l.setStyle({
          weight: 4,
          color: '#0f172a',
          fillOpacity: 0.92
        });
      },
      mouseout: (e) => {
        const l = e.target;
        l.setStyle(style(feature));
      },
      click: () => {
        setSelectedZoneProps(props);
      }
    });

    layer.bindTooltip(`
      <div style="font-family: ui-sans-serif, system-ui, sans-serif; padding: 6px 8px; font-size: 11px;">
        <div style="font-weight: 800; color: #0f172a; margin-bottom: 2px;">Zone ${props.zone_id}: ${props.zone_name}</div>
        <div style="color: #475569;">Population (${forecastYear}): <strong>${props.population ? Math.round(props.population).toLocaleString() : 'N/A'}</strong></div>
        <div style="color: #475569; margin-top: 2px;">Priority Tier: <span style="font-weight: bold; color: ${props.priorityLevel === 'CRITICAL' ? '#e11d48' : props.priorityLevel === 'HIGH' ? '#d97706' : '#0284c7'}">${props.priorityLevel || 'LOW'}</span></div>
      </div>
    `, { sticky: true });
  };

  const getPriorityBadge = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return <span className="bg-rose-100 text-rose-800 font-extrabold px-2.5 py-0.5 rounded-full text-xs">CRITICAL</span>;
      case 'HIGH':
        return <span className="bg-amber-100 text-amber-800 font-extrabold px-2.5 py-0.5 rounded-full text-xs">HIGH</span>;
      case 'MEDIUM':
        return <span className="bg-sky-100 text-sky-800 font-extrabold px-2.5 py-0.5 rounded-full text-xs">MEDIUM</span>;
      default:
        return <span className="bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-0.5 rounded-full text-xs">LOW</span>;
    }
  };

  return (
    <div className="space-y-4 h-[calc(100vh-130px)] flex flex-col pb-4">
      {/* Top Header & Layer Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-sky-50 text-sky-700 border border-sky-200">
              Module 04 • Spatial GIS Decision Support
            </span>
            <span className="text-xs text-slate-500 font-medium">15 GCC Administrative Zones Joined via zone_id</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Spatial GIS Decision Dashboard & Infrastructure Stress Heatmap
          </h1>
        </div>

        {/* Controls: Thematic Layer Switcher & Year Horizon */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Layer Pills */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setSelectedLayer('priorityLevel')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                selectedLayer === 'priorityLevel'
                  ? 'bg-white text-rose-600 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Priority Tier</span>
            </button>
            <button
              onClick={() => setSelectedLayer('population')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                selectedLayer === 'population'
                  ? 'bg-white text-purple-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Population</span>
            </button>
            <button
              onClick={() => setSelectedLayer('waterDemand')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                selectedLayer === 'waterDemand'
                  ? 'bg-white text-sky-600 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Droplets className="w-3.5 h-3.5" />
              <span>Water (LPD)</span>
            </button>
            <button
              onClick={() => setSelectedLayer('electricityDemand')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                selectedLayer === 'electricityDemand'
                  ? 'bg-white text-amber-600 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Electricity</span>
            </button>
          </div>

          {/* Forecast Year Pill Selector */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <span className="text-[10px] font-bold text-slate-400 px-2 uppercase">Horizon:</span>
            {[2027, 2028, 2029, 2030].map(y => (
              <button
                key={y}
                onClick={() => setForecastYear(y)}
                className={`px-2.5 py-1 rounded-lg transition text-xs ${
                  forecastYear === y
                    ? 'bg-slate-900 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Interactive Leaflet Map Area */}
      <div className="relative flex-1 bg-slate-100 rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex">
        {loading ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 gap-3">
            <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
            <p className="text-xs font-semibold text-slate-500">Loading Chennai 15-Zone GeoJSON Boundaries...</p>
          </div>
        ) : (
          <MapContainer
            center={[13.0674, 80.2376]} // Center on Greater Chennai Corporation
            zoom={11}
            scrollWheelZoom={true}
            style={{ width: '100%', height: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {geoJsonData && (
              <GeoJSON
                key={`${selectedLayer}-${forecastYear}`}
                data={geoJsonData}
                style={style}
                onEachFeature={onEachFeature}
              />
            )}
          </MapContainer>
        )}

        {/* Dynamic Glassmorphic Map Legend */}
        <div className="absolute bottom-5 left-5 z-[400] bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200/90 shadow-xl text-xs space-y-2.5 min-w-[190px]">
          <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
            <span className="font-extrabold text-slate-800 uppercase tracking-wider text-[10px]">
              Thematic Scale
            </span>
            <span className="text-[10px] font-bold text-sky-600 capitalize">
              {selectedLayer.replace(/([A-Z])/g, ' $1')}
            </span>
          </div>

          {selectedLayer === 'priorityLevel' && (
            <div className="space-y-1.5 font-bold text-[11px]">
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded-md bg-rose-600 shadow-xs"></span> 
                <span className="text-rose-900">CRITICAL PRIORITY</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded-md bg-amber-500 shadow-xs"></span> 
                <span className="text-amber-900">HIGH PRIORITY</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded-md bg-sky-600 shadow-xs"></span> 
                <span className="text-sky-900">MEDIUM PRIORITY</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded-md bg-emerald-500 shadow-xs"></span> 
                <span className="text-emerald-900">LOW PRIORITY</span>
              </div>
            </div>
          )}

          {selectedLayer === 'waterDemand' && (
            <div className="space-y-1.5 font-semibold text-[11px]">
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded-md bg-[#0369a1]"></span> 
                <span className="text-slate-700">&gt; 100 ML / day</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded-md bg-[#0284c7]"></span> 
                <span className="text-slate-700">70 – 100 ML / day</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded-md bg-[#38bdf8]"></span> 
                <span className="text-slate-700">40 – 70 ML / day</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded-md bg-[#bae6fd]"></span> 
                <span className="text-slate-700">&lt; 40 ML / day</span>
              </div>
            </div>
          )}

          {selectedLayer === 'electricityDemand' && (
            <div className="space-y-1.5 font-semibold text-[11px]">
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded-md bg-[#b45309]"></span> 
                <span className="text-slate-700">&gt; 2.5 GWh / day</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded-md bg-[#d97706]"></span> 
                <span className="text-slate-700">1.8 – 2.5 GWh / day</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded-md bg-[#f59e0b]"></span> 
                <span className="text-slate-700">1.0 – 1.8 GWh / day</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded-md bg-[#fde68a]"></span> 
                <span className="text-slate-700">&lt; 1.0 GWh / day</span>
              </div>
            </div>
          )}

          {selectedLayer === 'population' && (
            <div className="space-y-1.5 font-semibold text-[11px]">
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded-md bg-[#4c1d95]"></span> 
                <span className="text-slate-700">&gt; 800,000 residents</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded-md bg-[#6d28d9]"></span> 
                <span className="text-slate-700">600k – 800k residents</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded-md bg-[#8b5cf6]"></span> 
                <span className="text-slate-700">400k – 600k residents</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded-md bg-[#c4b5fd]"></span> 
                <span className="text-slate-700">&lt; 400,000 residents</span>
              </div>
            </div>
          )}
        </div>

        {/* Interactive Zone Inspector Sliding Drawer */}
        {selectedZoneProps ? (
          <div className="absolute top-5 right-5 z-[400] w-88 bg-white/95 backdrop-blur-xl p-5 rounded-2xl border border-slate-200/90 shadow-2xl space-y-4 max-h-[calc(100%-40px)] overflow-y-auto animate-in fade-in slide-in-from-right-4 duration-200">
            {/* Drawer Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                    Zone {selectedZoneProps.zone_id}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {selectedZoneProps.zone_code || `Z${String(selectedZoneProps.zone_id).padStart(2, '0')}`}
                  </span>
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight leading-tight">
                  {selectedZoneProps.zone_name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedZoneProps(null)}
                className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Projected Population Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 rounded-xl shadow-md">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Forecast Population ({forecastYear})
              </span>
              <div className="text-2xl font-black text-white mt-0.5">
                {selectedZoneProps.population ? Math.round(selectedZoneProps.population).toLocaleString() : 'N/A'}
              </div>
              <div className="text-[10px] text-sky-300 mt-1 flex items-center gap-1">
                <span>Empirical PyTorch + XGBoost Model</span>
              </div>
            </div>

            {/* Demands Breakdown */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Normative Demands Breakdown
              </span>
              
              <div className="flex items-center justify-between p-2.5 bg-sky-50 rounded-xl border border-sky-100 text-xs">
                <div className="flex items-center gap-2 text-sky-900 font-semibold">
                  <Droplets className="w-4 h-4 text-sky-600" />
                  <span>Water Supply:</span>
                </div>
                <span className="font-extrabold text-sky-950">
                  {selectedZoneProps.waterDemandLpd ? (selectedZoneProps.waterDemandLpd / 1e6).toFixed(2) + ' ML/day' : 'N/A'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-amber-50 rounded-xl border border-amber-100 text-xs">
                <div className="flex items-center gap-2 text-amber-900 font-semibold">
                  <Zap className="w-4 h-4 text-amber-600" />
                  <span>Electricity:</span>
                </div>
                <span className="font-extrabold text-amber-950">
                  {selectedZoneProps.electricityDemandKwhDay ? (selectedZoneProps.electricityDemandKwhDay / 1e3).toFixed(1) + ' MWh/day' : 'N/A'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-rose-50 rounded-xl border border-rose-100 text-xs">
                <div className="flex items-center gap-2 text-rose-900 font-semibold">
                  <Stethoscope className="w-4 h-4 text-rose-600" />
                  <span>Hospital Beds:</span>
                </div>
                <span className="font-extrabold text-rose-950">
                  {selectedZoneProps.healthcareBedsRequired ? Math.round(selectedZoneProps.healthcareBedsRequired).toLocaleString() : 'N/A'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-purple-50 rounded-xl border border-purple-100 text-xs">
                <div className="flex items-center gap-2 text-purple-900 font-semibold">
                  <GraduationCap className="w-4 h-4 text-purple-600" />
                  <span>School Seats:</span>
                </div>
                <span className="font-extrabold text-purple-950">
                  {selectedZoneProps.educationSeatsRequired ? Math.round(selectedZoneProps.educationSeatsRequired).toLocaleString() : 'N/A'}
                </span>
              </div>
            </div>

            {/* Priority Assessment Box */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">Priority Tier:</span>
                {getPriorityBadge(selectedZoneProps.priorityLevel || 'LOW')}
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">Composite Score:</span>
                <span className="font-mono font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  {selectedZoneProps.priorityScore || 'N/A'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Hint Banner when no zone is selected */
          <div className="absolute top-5 right-5 z-[400] bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-200/80 shadow-lg text-xs font-semibold text-slate-600 flex items-center gap-2 pointer-events-none">
            <Info className="w-4 h-4 text-sky-600" />
            <span>Click any zone boundary on the map to inspect granular indicators</span>
          </div>
        )}
      </div>
    </div>
  );
};
