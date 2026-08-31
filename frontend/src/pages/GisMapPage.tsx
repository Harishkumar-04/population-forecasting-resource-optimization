import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { api } from '../services/api';
import { MapPin, Layers, Info, Layers3, X, AlertTriangle } from 'lucide-react';
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
        case 'CRITICAL': return '#e11d48'; // Red-600
        case 'HIGH': return '#f97316';     // Orange-500
        case 'MEDIUM': return '#3b82f6';   // Blue-500
        default: return '#10b981';         // Emerald-500
      }
    }

    if (selectedLayer === 'waterDemand') {
      const val = props.waterDemandLpd || 0;
      if (val > 100000000) return '#0284c7';
      if (val > 70000000) return '#38bdf8';
      if (val > 40000000) return '#7dd3fc';
      return '#bae6fd';
    }

    if (selectedLayer === 'electricityDemand') {
      const val = props.electricityDemandKwhDay || 0;
      if (val > 2500000) return '#d97706';
      if (val > 1800000) return '#f59e0b';
      if (val > 1000000) return '#fbbf24';
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
      fillOpacity: 0.7
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
          fillOpacity: 0.9
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
      <div style="font-family: sans-serif; padding: 4px;">
        <strong>Zone ${props.zone_id}: ${props.zone_name}</strong><br/>
        Pop: ${props.population ? Math.round(props.population).toLocaleString() : 'N/A'}<br/>
        Priority: <strong>${props.priorityLevel || 'LOW'}</strong>
      </div>
    `, { sticky: true });
  };

  return (
    <div className="space-y-4 h-[calc(100vh-140px)] flex flex-col">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Module 4: GIS Smart City Decision Dashboard</h1>
          <p className="text-slate-500 text-xs">Real Greater Chennai Corporation 15-Zone Geographic Map Joined via zone_id</p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm text-xs font-semibold">
            <Layers className="w-4 h-4 text-sky-600" />
            <span>Map Layer:</span>
            <select
              value={selectedLayer}
              onChange={(e) => setSelectedLayer(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-800 focus:outline-none"
            >
              <option value="priorityLevel">Priority Level (Low/Med/High/Critical)</option>
              <option value="population">Forecast Population (2030)</option>
              <option value="waterDemand">Water Demand (LPD)</option>
              <option value="electricityDemand">Electricity Demand (kWh/day)</option>
            </select>
          </div>

          <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm text-xs font-semibold flex items-center gap-2">
            <span>Year:</span>
            <select
              value={forecastYear}
              onChange={(e) => setForecastYear(Number(e.target.value))}
              className="bg-slate-50 border border-slate-300 rounded px-2 py-1"
            >
              {[2027, 2028, 2029, 2030].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main GIS Map Area */}
      <div className="relative flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center bg-slate-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
          </div>
        ) : (
          <MapContainer
            center={[13.0674, 80.2376]} // Center on Chennai
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

        {/* Dynamic Map Legend */}
        <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-md p-3 rounded-lg border border-slate-200 shadow-lg text-xs space-y-2">
          <p className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
            Legend: {selectedLayer}
          </p>
          {selectedLayer === 'priorityLevel' ? (
            <div className="space-y-1 font-semibold text-[11px]">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-rose-600"></span> CRITICAL</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-orange-500"></span> HIGH</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-blue-500"></span> MEDIUM</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-emerald-500"></span> LOW</div>
            </div>
          ) : (
            <div className="space-y-1 font-medium text-[11px]">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-purple-900"></span> High Intensity</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-purple-600"></span> Medium Intensity</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-purple-300"></span> Base Level</div>
            </div>
          )}
        </div>

        {/* Zone Details Click Side Panel */}
        {selectedZoneProps && (
          <div className="absolute top-4 right-4 z-[400] w-80 bg-white/95 backdrop-blur-md p-5 rounded-xl border border-slate-200 shadow-2xl space-y-4 max-h-[90%] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-xs font-bold text-sky-600 uppercase">Zone {selectedZoneProps.zone_id}</span>
                <h2 className="text-lg font-bold text-slate-800">{selectedZoneProps.zone_name}</h2>
              </div>
              <button
                onClick={() => setSelectedZoneProps(null)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <p className="text-slate-500 font-medium">Predicted Population ({selectedZoneProps.forecastYear || 2030})</p>
                <p className="text-xl font-bold text-slate-800">
                  {selectedZoneProps.population ? Math.round(selectedZoneProps.population).toLocaleString() : 'N/A'}
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Projected Resource Demands</p>
                <div className="flex justify-between p-2 bg-blue-50 rounded text-blue-900 font-medium">
                  <span>Water Demand:</span>
                  <span className="font-bold">
                    {selectedZoneProps.waterDemandLpd ? (selectedZoneProps.waterDemandLpd / 1e6).toFixed(2) + ' ML/day' : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between p-2 bg-amber-50 rounded text-amber-900 font-medium">
                  <span>Electricity Demand:</span>
                  <span className="font-bold">
                    {selectedZoneProps.electricityDemandKwhDay ? (selectedZoneProps.electricityDemandKwhDay / 1e3).toFixed(1) + ' MWh/day' : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between p-2 bg-rose-50 rounded text-rose-900 font-medium">
                  <span>Hospital Beds Required:</span>
                  <span className="font-bold">
                    {selectedZoneProps.healthcareBedsRequired ? Math.round(selectedZoneProps.healthcareBedsRequired).toLocaleString() : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between p-2 bg-purple-50 rounded text-purple-900 font-medium">
                  <span>School Seats Required:</span>
                  <span className="font-bold">
                    {selectedZoneProps.educationSeatsRequired ? Math.round(selectedZoneProps.educationSeatsRequired).toLocaleString() : 'N/A'}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-900 text-slate-100 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Priority Level</p>
                  <p className="text-sm font-bold text-sky-400">{selectedZoneProps.priorityLevel || 'LOW'}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Priority Score</p>
                  <p className="text-sm font-bold text-rose-400">{selectedZoneProps.priorityScore || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
