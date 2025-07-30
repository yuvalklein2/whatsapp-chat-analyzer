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

export interface DateRange {
  start: Date;
  end: Date;
  label: string;
}

export interface AnalyticsData {
  messagesByDay: { date: string; count: number }[];
  messagesByHour: { hour: number; count: number }[];
  messagesByParticipant: { name: string; count: number }[];
  wordFrequency: { word: string; count: number }[];
  averageMessageLength: number;
  mostActiveDay: string;
  mostActiveHour: number;
  responseTimeAnalysis: {
    averageResponseTimeMinutes: number;
    responseTimesByParticipant: { name: string; avgResponseMinutes: number; totalResponses: number }[];
    fastestResponder: string;
    slowestResponder: string;
  };
  conversationStarters: { name: string; count: number; percentage: number }[];
  emojiAnalysis: {
    totalEmojis: number;
    topEmojis: { emoji: string; count: number }[];
    emojisByParticipant: { name: string; count: number }[];
  };
  filteredMessageCount: number;
  totalMessageCount: number;
}