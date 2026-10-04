import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

export interface DataSummary {
  totalRecords: number;
  numberOfZones: number;
  trainingPeriod: string;
  modelPeriod: string;
  numberOfFeatures: number;
  missingValueCount: number;
  duplicateCount: number;
  invalidValueCount: number;
  preprocessingStatus: string;
  dataProvenanceNote: string;
}

export interface UrbanRecord {
  id: number;
  year: number;
  zone: {
    zoneId: number;
    zoneCode: string;
    zoneName: string;
  };
  population: number;
  builtUpSurfaceM2: number;
  nightLight: number;
  builtUpSource: string;
  nightLightSource: string;
  isTrainingPeriod: boolean;
}

export interface ForecastResult {
  zoneId: number;
  zoneCode: string;
  zoneName: string;
  forecastYear: number;
  latestKnownPopulation: number;
  predictedPopulation: number;
  populationChange: number;
  growthPercentage: number;
  modelUsed: string;
}

export interface ModelMetrics {
  baseline: { mae: number; rmse: number; mape: number; r2: number };
  lstm: { mae: number; rmse: number; mape: number; r2: number };
  hybrid: { mae: number; rmse: number; mape: number; r2: number };
  test_years: number[];
}

export interface ResourceDemand {
  zoneId: number;
  zoneCode: string;
  zoneName: string;
  forecastYear: number;
  population: number;
  waterDemandLpd: number;
  electricityDemandKwhDay: number;
  healthcareBedsRequired: number;
  educationSeatsRequired: number;
  priorityScore: number;
  priorityLevel: string;
  capacityNotice: string;
}

export interface DashboardSummary {
  totalZones: number;
  latestTotalPopulation: number;
  forecastTotalPopulation: number;
  averageGrowthPercentage: number;
  totalWaterDemandLpd: number;
  totalElectricityDemandKwhDay: number;
  totalHealthcareBedsRequired: number;
  totalEducationSeatsRequired: number;
  highGrowthZones: ForecastResult[];
  capacityNotice: string;
}

export interface ResearchZoneOption {
  zoneId: number;
  zoneCode: string;
  zoneName: string;
}

export interface ZoneTimelinePoint {
  year: number;
  population: number;
  builtUpSurfaceM2: number;
  builtUpKm2: number;
  nightLight: number;
  builtUpSource: string;
  isTrainingPeriod: boolean;
  waterDemandMLD: number;
  energyDemandMWh: number;
  hospitalBeds: number;
  schoolSeats: number;
}

export interface PriorityInfo {
  priorityScore: number;
  priorityLevel: string;
  growthFactor: number;
  densityFactor: number;
  demandFactor: number;
  growthContribution?: number;
  densityContribution?: number;
  demandContribution?: number;
}

export interface FeatureImportancePoint {
  feature: string;
  importance: number;
  category?: string;
}

export interface ModelComparisonPoint {
  metric: string;
  baseline: number;
  lstm: number;
  hybrid: number;
  description?: string;
}

export interface ResearchPaperData {
  zoneInfo: ResearchZoneOption;
  availableZones: ResearchZoneOption[];
  timeline: ZoneTimelinePoint[];
  priorityInfo: PriorityInfo;
  featureImportance: FeatureImportancePoint[];
  modelComparison: ModelComparisonPoint[];
  paperHeader: string;
  journalLogo: string;
  dataSource: string;
}

export const api = {
  // Data APIs
  getDataSummary: () => axios.get<DataSummary>(`${API_BASE}/data/summary`).then(res => res.data),
  getQualityReport: () => axios.get(`${API_BASE}/data/quality`).then(res => res.data),
  getRecords: (zoneId?: number) => axios.get<UrbanRecord[]>(`${API_BASE}/data/records`, { params: { zoneId } }).then(res => res.data),
  getZones: () => axios.get(`${API_BASE}/data/zones`).then(res => res.data),
  
  // Forecast APIs
  getForecastForZone: (zoneId: number, year: number = 2030) => 
    axios.get<ForecastResult>(`${API_BASE}/forecast/zone/${zoneId}`, { params: { forecastYear: year } }).then(res => res.data),
  getAllForecasts: (year: number = 2030) => 
    axios.get<ForecastResult[]>(`${API_BASE}/forecast/all`, { params: { forecastYear: year } }).then(res => res.data),
  getModelMetrics: () => axios.get<ModelMetrics>(`${API_BASE}/forecast/metrics`).then(res => res.data),
  
  // Resource APIs
  getAllResourceDemands: (year: number = 2030) => 
    axios.get<ResourceDemand[]>(`${API_BASE}/resource/demand`, { params: { forecastYear: year } }).then(res => res.data),
  getResourceParameters: () => axios.get(`${API_BASE}/resource/parameters`).then(res => res.data),
  
  // GIS APIs
  getGisZones: (year: number = 2030) => 
    axios.get(`${API_BASE}/gis/zones`, { params: { forecastYear: year } }).then(res => res.data),
  
  // Dashboard API
  getDashboardSummary: (year: number = 2030) => 
    axios.get<DashboardSummary>(`${API_BASE}/dashboard/summary`, { params: { forecastYear: year } }).then(res => res.data),

  // Research Paper API
  getResearchPaperResults: (zoneId: number = 0) => 
    axios.get<ResearchPaperData>(`${API_BASE}/research/paper-results`, { params: { zoneId } }).then(res => res.data)
};
