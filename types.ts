export enum AppStep {
  Dashboard = 'DASHBOARD',
  Ideas = 'IDEAS',
  Strategy = 'STRATEGY',
  Script = 'SCRIPT',
  Scenario = 'SCENARIO',
}

export interface BusinessInfo {
  name: string;
  audience: string;
  stage: string;
  products: string;
}

export interface ContentPlanInfo {
  storeName: string;
  niche: string;
  coreValue: string;
  toneOfVoice: string;
  targetAudience: string;
  focusProducts: string;
  monthlyGoal: 'awareness' | 'sales';
  promotions: string;
  visualStyle: string;
  hashtags: string;
  inspiration: string;
}

export interface IdeaGenerationInfo {
  productDetails: string;
  event: string;
  marketingType: string;
  hasBudget: 'yes' | 'no';
  budgetAmount?: string;
  additionalInfo?: string;
}

export interface ScriptGenerationInfo {
  productDefined: string;
  emotionalStory: string;
  touchDetails: string;
  sightDetails: string;
  idealCustomerLifestyle: string;
  problemToSolve: string;
  videoGoal: string;
  ctaText: string;
}

export interface MarketingIdea {
  title: string;
  concept: string;
  hook: string;
  visuals: string;
  cta: string;
}

export interface MonthlyPlan {
  week1: string[];
  week2: string[];
  week3: string[];
  week4: string[];
}

export interface Scene {
  sentence: string;
  sceneDescription: string;
  imagePrompt: string;
  imageUrl?: string;
  imageLoading?: boolean;
  imageError?: string;
}

export interface ContentStrategy {
  vision: string;
  objectives: string[];
  targetAudience: string;
  coreMessages: string[];
  channels: string[];
  style: {
    tone: string;
    visual: string;
  };
  contentPlanOverview: string;
  metrics: string[];
}