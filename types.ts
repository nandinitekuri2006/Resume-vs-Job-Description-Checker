
export interface AnalysisResult {
  matchPercentage: number;
  summary: string;
  matchingSkills: string[];
  missingSkills: string[];
  improvementTips: string[];
  jobTitleDetected: string;
}

export interface InputData {
  text: string;
  image?: string; // base64
  fileName?: string;
}

export enum InputMode {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE'
}
