export interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

export interface VisionMission {
  vision: string;
  mission: string;
}

export interface Feature {
  id: string;
  name: string;
  description: string;
}

export type AppStep = 'landing' | 'brainstorming' | 'vision-mission' | 'feature-selection' | 'flowchart';
