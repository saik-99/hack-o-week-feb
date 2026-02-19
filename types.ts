export interface ExtractedEntities {
  dates: string[];
  semesters: string[];
  courses: string[];
  events: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  entities?: ExtractedEntities;
  isError?: boolean;
}

export interface CalendarContext {
  imageBase64: string | null;
  setImageBase64: (data: string | null) => void;
}

export enum LoadingState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  RESPONDING = 'RESPONDING',
}