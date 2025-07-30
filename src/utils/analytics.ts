import { ChatData, AnalyticsData, Message, DateRange } from '@/types/chat';
import { format, getHours, isWithinInterval, subMonths, subWeeks, startOfDay, endOfDay } from 'date-fns';

export class ChatAnalytics {
  static analyzeChat(chatData: ChatData, dateRange?: DateRange): AnalyticsData {
    const { messages } = chatData;
    
    // Filter messages by date range if provided
    const filteredMessages = dateRange 
      ? messages.filter(message => 
          isWithinInterval(message.timestamp, {
            start: dateRange.start,
            end: dateRange.end
          })
        )
      : messages;
    
    const messagesByDay = this.getMessagesByDay(filteredMessages);
    const messagesByHour = this.getMessagesByHour(filteredMessages);
    const messagesByParticipant = this.getMessagesByParticipant(filteredMessages);
    const wordFrequency = this.getWordFrequency(filteredMessages);
    const averageMessageLength = this.getAverageMessageLength(filteredMessages);
    const mostActiveDay = this.getMostActiveDay(messagesByDay);
    const mostActiveHour = this.getMostActiveHour(messagesByHour);
    const responseTimeAnalysis = this.getResponseTimeAnalysis(filteredMessages);  
    const conversationStarters = this.getConversationStarters(filteredMessages);
    const emojiAnalysis = this.getEmojiAnalysis(filteredMessages);

    return {
      messagesByDay,
      messagesByHour,
      messagesByParticipant,
      wordFrequency,
      averageMessageLength,
      mostActiveDay,
      mostActiveHour,
      responseTimeAnalysis,
      conversationStarters,
      emojiAnalysis,
      filteredMessageCount: filteredMessages.filter(m => !m.isSystemMessage).length,
      totalMessageCount: messages.filter(m => !m.isSystemMessage).length
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

  private static getResponseTimeAnalysis(messages: Message[]) {
    const nonSystemMessages = messages.filter(m => !m.isSystemMessage);
    const responseTimes: { participant: string; responseTimeMinutes: number }[] = [];
    
    for (let i = 1; i < nonSystemMessages.length; i++) {
      const currentMessage = nonSystemMessages[i];
      const previousMessage = nonSystemMessages[i - 1];
      
      // Only count as response if different participants
      if (currentMessage.author !== previousMessage.author) {
        const timeDiff = currentMessage.timestamp.getTime() - previousMessage.timestamp.getTime();
        const minutes = timeDiff / (1000 * 60);
        
        // Only count responses within 24 hours (1440 minutes)
        if (minutes <= 1440) {
          responseTimes.push({
            participant: currentMessage.author,
            responseTimeMinutes: minutes
          });
        }
      }
    }

    // Calculate averages by participant
    const participantResponseTimes = new Map<string, { total: number; count: number }>();
    
    responseTimes.forEach(({ participant, responseTimeMinutes }) => {
      const existing = participantResponseTimes.get(participant) || { total: 0, count: 0 };
      participantResponseTimes.set(participant, {
        total: existing.total + responseTimeMinutes,
        count: existing.count + 1
      });
    });

    const responseTimesByParticipant = Array.from(participantResponseTimes.entries())
      .map(([name, data]) => ({
        name,
        avgResponseMinutes: Math.round(data.total / data.count),
        totalResponses: data.count
      }))
      .sort((a, b) => a.avgResponseMinutes - b.avgResponseMinutes);

    const averageResponseTimeMinutes = responseTimes.length > 0 
      ? Math.round(responseTimes.reduce((sum, r) => sum + r.responseTimeMinutes, 0) / responseTimes.length)
      : 0;

    const fastestResponder = responseTimesByParticipant[0]?.name || 'N/A';
    const slowestResponder = responseTimesByParticipant[responseTimesByParticipant.length - 1]?.name || 'N/A';

    return {
      averageResponseTimeMinutes,
      responseTimesByParticipant,
      fastestResponder,
      slowestResponder
    };
  }

  private static getConversationStarters(messages: Message[]) {
    const nonSystemMessages = messages.filter(m => !m.isSystemMessage);
    const conversationStarts = new Map<string, number>();
    
    // First message is always a conversation starter
    if (nonSystemMessages.length > 0) {
      const firstAuthor = nonSystemMessages[0].author;
      conversationStarts.set(firstAuthor, 1);
    }
    
    // Look for conversation starters (messages after >30 minute gaps)
    for (let i = 1; i < nonSystemMessages.length; i++) {
      const currentMessage = nonSystemMessages[i];
      const previousMessage = nonSystemMessages[i - 1];
      
      const timeDiff = currentMessage.timestamp.getTime() - previousMessage.timestamp.getTime();
      const minutes = timeDiff / (1000 * 60);
      
      // Consider it a new conversation if >30 minutes gap
      if (minutes > 30) {
        const count = conversationStarts.get(currentMessage.author) || 0;
        conversationStarts.set(currentMessage.author, count + 1);
      }
    }

    const totalStarts = Array.from(conversationStarts.values()).reduce((sum, count) => sum + count, 0);
    
    return Array.from(conversationStarts.entries())
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / totalStarts) * 100)
      }))
      .sort((a, b) => b.count - a.count);
  }

  private static getEmojiAnalysis(messages: Message[]) {
    const nonSystemMessages = messages.filter(m => !m.isSystemMessage);
    const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
    
    const allEmojis: string[] = [];
    const emojisByParticipant = new Map<string, number>();
    
    nonSystemMessages.forEach(message => {
      const emojis = message.content.match(emojiRegex) || [];
      allEmojis.push(...emojis);
      
      const participantCount = emojisByParticipant.get(message.author) || 0;
      emojisByParticipant.set(message.author, participantCount + emojis.length);
    });

    // Count emoji frequency
    const emojiCount = new Map<string, number>();
    allEmojis.forEach(emoji => {
      emojiCount.set(emoji, (emojiCount.get(emoji) || 0) + 1);
    });

    const topEmojis = Array.from(emojiCount.entries())
      .map(([emoji, count]) => ({ emoji, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const emojisByParticipantArray = Array.from(emojisByParticipant.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    return {
      totalEmojis: allEmojis.length,
      topEmojis,
      emojisByParticipant: emojisByParticipantArray
    };
  }

  static getDefaultDateRange(chatData: ChatData): DateRange {
    const now = new Date();
    const oneMonthAgo = subMonths(now, 1);
    const oldestMessage = chatData.dateRange.start;
    
    // If chat is newer than 1 month, use all data
    const startDate = oldestMessage > oneMonthAgo ? oldestMessage : oneMonthAgo;
    
    return {
      start: startOfDay(startDate),
      end: endOfDay(now),
      label: 'Last Month'
    };
  }

  static getDateRangePresets(chatData: ChatData): DateRange[] {
    const now = new Date();
    const chatStart = chatData.dateRange.start;
    
    return [
      {
        start: subWeeks(now, 1),
        end: now,
        label: 'Last Week'
      },
      {
        start: subMonths(now, 1),
        end: now,
        label: 'Last Month'
      },
      {
        start: subMonths(now, 3),
        end: now,
        label: 'Last 3 Months'
      },
      {
        start: subMonths(now, 6),
        end: now,
        label: 'Last 6 Months'
      },
      {
        start: chatStart,
        end: now,
        label: 'All Time'
      }
    ].filter(range => range.start >= chatStart); // Only show ranges that have data
  }
}