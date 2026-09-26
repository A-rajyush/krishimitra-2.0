export type LanguageCode = 'en' | 'hi' | 'mr' | 'pa' | 'gu' | 'bn' | 'te' | 'ta' | 'kn';

export interface ChemicalTreatment {
  chemicalName: string;
  commonBrandName: string;
  dosage: string;
  applicationMethod: string;
  waitingPeriodDays: number;
}

export interface CropDiagnosis {
  isPlant: boolean;
  cropName: string;
  scientificName?: string;
  healthStatus: 'Healthy' | 'Diseased' | 'Pest Infested' | 'Nutrient Deficient' | 'Abiotic Stress';
  diseaseName: string;
  confidenceScore: number;
  severity: 'None' | 'Mild' | 'Moderate' | 'Severe' | 'Critical';
  keySymptoms: string[];
  pathogenType: string;
  primaryCause: string;
  immediateAction: string;
  organicTreatments: string[];
  chemicalTreatments: ChemicalTreatment[];
  preventiveMeasures: string[];
  yieldImpactRisk: string;
  audioSummaryText: string;
}

export interface MandiItem {
  id: string;
  commodity: string;
  variety: string;
  state: string;
  district: string;
  market: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  msp: number | null;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: string;
  arrivalsTons: number;
  updatedAt: string;
}

export interface WeatherData {
  location: string;
  current: {
    temperature: number;
    feelsLike: number;
    condition: string;
    humidity: number;
    windSpeedKm: number;
    precipitationProb: number;
    dewPoint: number;
    soilMoistureEstimate: string;
    sprayWindowStatus: string;
    sprayRecommendation: string;
  };
  hourlyAdvisories: Array<{
    time: string;
    temp: number;
    rainChance: number;
    sprayFit: boolean;
    reason?: string;
  }>;
  sevenDayForecast: Array<{
    day: string;
    maxTemp: number;
    minTemp: number;
    condition: string;
    rainMm: number;
    alert: string;
  }>;
  farmingAlerts: Array<{
    type: 'warning' | 'info' | 'critical';
    title: string;
    message: string;
  }>;
}

export interface SoilAdvisory {
  totalNpkRecommendedKg: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  };
  commercialFertilizersTotal: {
    ureaBags: string;
    dapBags: string;
    mopBags: string;
    zincSulphateKg: string;
    fymCompostTons: string;
  };
  stages: Array<{
    stageName: string;
    timing: string;
    fertilizers: string[];
    instructions: string;
  }>;
  organicSoilEnrichment: string[];
  micronutrientTips: string[];
  soilPhAdjustment: string;
  expectedCostEstimateInr: string;
  summaryTip: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface GovtScheme {
  id: string;
  title: string;
  hindiTitle: string;
  category: 'Financial Assistance' | 'Insurance' | 'Equipment & Solar' | 'Soil & Water';
  benefit: string;
  eligibility: string;
  documents: string[];
  portalUrl: string;
}
