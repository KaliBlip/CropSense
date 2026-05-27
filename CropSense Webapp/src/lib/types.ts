export interface ClassPrediction {
  class_name: string;
  confidence: number;
  rank: number;
}

export interface PredictionResult {
  predictions: ClassPrediction[];
  top: {
    class_name: string;
    confidence: number;
    advice_title: string;
    advice_steps: string;
  };
}

export interface DiseaseAdvice {
  title: string;
  steps: string;
}
