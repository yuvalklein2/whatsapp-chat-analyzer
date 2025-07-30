import { ChatData, AnalyticsData, Message } from '@/types/chat';
import { format, getHours } from 'date-fns';

export class ChatAnalytics {
  static analyzeChat(chatData: ChatData): AnalyticsData {
    const { messages } = chatData;
    
    const messagesByDay = this.getMessagesByDay(messages);
    const messagesByHour = this.getMessagesByHour(messages);
    const messagesByParticipant = this.getMessagesByParticipant(messages);
    const wordFrequency = this.getWordFrequency(messages);
    const averageMessageLength = this.getAverageMessageLength(messages);
    const mostActiveDay = this.getMostActiveDay(messagesByDay);
    const mostActiveHour = this.getMostActiveHour(messagesByHour);

    return {
      messagesByDay,
      messagesByHour,
      messagesByParticipant,
      wordFrequency,
      averageMessageLength,
      mostActiveDay,
      mostActiveHour
    };
  }

  private static getMessagesByDay(messages: Message[]) {
    const dayCount = new Map<string, number>();
    
    messages.forEach(message => {
      if (!message.isSystemMessage) {
        const day = format(message.timestamp, 'yyyy-MM-dd');
        dayCount.set(day, (dayCount.get(day) || 0) + 1);
      }
    });

    return Array.from(dayCount.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  private static getMessagesByHour(messages: Message[]) {
    const hourCount = new Array(24).fill(0);
    
    messages.forEach(message => {
      if (!message.isSystemMessage) {
        const hour = getHours(message.timestamp);
        hourCount[hour]++;
      }
    });

    return hourCount.map((count, hour) => ({ hour, count }));
  }

  private static getMessagesByParticipant(messages: Message[]) {
    const participantCount = new Map<string, number>();
    
    messages.forEach(message => {
      if (!message.isSystemMessage) {
        participantCount.set(message.author, (participantCount.get(message.author) || 0) + 1);
      }
    });

    return Array.from(participantCount.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }

  private static getWordFrequency(messages: Message[]) {
    const wordCount = new Map<string, number>();
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them']);
    
    messages.forEach(message => {
      if (!message.isSystemMessage) {
        const words = message.content.toLowerCase()
          .replace(/[^\w\s]/g, '')
          .split(/\s+/)
          .filter(word => word.length > 2 && !stopWords.has(word));
        
        words.forEach(word => {
          wordCount.set(word, (wordCount.get(word) || 0) + 1);
        });
      }
    });

    return Array.from(wordCount.entries())
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 50);
  }

  private static getAverageMessageLength(messages: Message[]) {
    const nonSystemMessages = messages.filter(m => !m.isSystemMessage);
    const totalLength = nonSystemMessages.reduce((sum, m) => sum + m.content.length, 0);
    return Math.round(totalLength / nonSystemMessages.length);
  }

  private static getMostActiveDay(messagesByDay: { date: string; count: number }[]) {
    return messagesByDay.reduce((max, current) => 
      current.count > max.count ? current : max, 
      { date: '', count: 0 }
    ).date;
  }

  private static getMostActiveHour(messagesByHour: { hour: number; count: number }[]) {
    return messagesByHour.reduce((max, current) => 
      current.count > max.count ? current : max, 
      { hour: 0, count: 0 }
    ).hour;
  }
}