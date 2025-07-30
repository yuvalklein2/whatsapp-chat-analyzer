export interface Message {
  timestamp: Date;
  author: string;
  content: string;
  isSystemMessage: boolean;
}

export interface ChatData {
  messages: Message[];
  participants: string[];
  dateRange: {
    start: Date;
    end: Date;
  };
  totalMessages: number;
}

export interface AnalyticsData {
  messagesByDay: { date: string; count: number }[];
  messagesByHour: { hour: number; count: number }[];
  messagesByParticipant: { name: string; count: number }[];
  wordFrequency: { word: string; count: number }[];
  averageMessageLength: number;
  mostActiveDay: string;
  mostActiveHour: number;
}