export interface PredictionRequest {
  age: number;
  gender: 1 | 2;
  iron_intake: number;
  vit_d_intake: number;
}

export interface PredictionResponse {
  deficiency_risk: string;
  confidence: number;
  raw_prediction: number;
  recommendations: string[];
}