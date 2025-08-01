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
    if (nonSystemMessages.length === 0) return 0;
    const totalLength = nonSystemMessages.reduce((sum, m) => sum + m.content.length, 0);
    return Math.round(totalLength / nonSystemMessages.length);
  }

  private static getMostActiveDay(messagesByDay: { date: string; count: number }[]) {
    if (messagesByDay.length === 0) return '';
    return messagesByDay.reduce((max, current) => 
      current.count > max.count ? current : max, 
      messagesByDay[0]
    ).date;
  }

  private static getMostActiveHour(messagesByHour: { hour: number; count: number }[]) {
    if (messagesByHour.length === 0) return 0;
    return messagesByHour.reduce((max, current) => 
      current.count > max.count ? current : max, 
      messagesByHour[0]
    ).hour;
  }

  private static getResponseTimeAnalysis(messages: Message[]) {
    const nonSystemMessages = messages.filter(m => !m.isSystemMessage);
    const responseTimes: { participant: string; responseTimeMinutes: number }[] = [];
    
    // Group consecutive messages by the same author
    const messageGroups: Array<{ author: string; startTime: Date; endTime: Date; count: number }> = [];
    let currentGroup: { author: string; startTime: Date; endTime: Date; count: number } | null = null;
    
    nonSystemMessages.forEach(message => {
      if (!currentGroup || currentGroup.author !== message.author) {
        if (currentGroup) {
          messageGroups.push(currentGroup);
        }
        currentGroup = {
          author: message.author,
          startTime: message.timestamp,
          endTime: message.timestamp,
          count: 1
        };
      } else {
        currentGroup.endTime = message.timestamp;
        currentGroup.count++;
      }
    });
    
    if (currentGroup) {
      messageGroups.push(currentGroup);
    }
    
    // Calculate response times between message groups
    for (let i = 1; i < messageGroups.length; i++) {
      const currentGroup = messageGroups[i];
      const previousGroup = messageGroups[i - 1];
      
      // Only count as response if different participants
      if (currentGroup.author !== previousGroup.author) {
        const timeDiff = currentGroup.startTime.getTime() - previousGroup.endTime.getTime();
        const minutes = timeDiff / (1000 * 60);
        
        // Only count responses within 7 days (10080 minutes) to filter out long gaps
        if (minutes > 0 && minutes <= 10080) {
          responseTimes.push({
            participant: currentGroup.author,
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
        avgResponseMinutes: data.count > 0 ? Math.round(data.total / data.count) : 0,
        totalResponses: data.count
      }))
      .sort((a, b) => a.avgResponseMinutes - b.avgResponseMinutes);

    const averageResponseTimeMinutes = responseTimes.length > 0 
      ? Math.round(responseTimes.reduce((sum, r) => sum + r.responseTimeMinutes, 0) / responseTimes.length)
      : 0;

    const fastestResponder = responseTimesByParticipant.find(p => p.totalResponses > 0)?.name || 'N/A';
    const slowestResponder = responseTimesByParticipant.length > 0 
      ? responseTimesByParticipant[responseTimesByParticipant.length - 1]?.name || 'N/A' 
      : 'N/A';

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
    
    if (nonSystemMessages.length === 0) {
      return [];
    }
    
    // Group consecutive messages by same author to find conversation boundaries
    const messageGroups: Array<{ author: string; startTime: Date; endTime: Date; count: number }> = [];
    let currentGroup: { author: string; startTime: Date; endTime: Date; count: number } | null = null;
    
    nonSystemMessages.forEach(message => {
      if (!currentGroup || currentGroup.author !== message.author) {
        if (currentGroup) {
          messageGroups.push(currentGroup);
        }
        currentGroup = {
          author: message.author,
          startTime: message.timestamp,
          endTime: message.timestamp,
          count: 1
        };
      } else {
        currentGroup.endTime = message.timestamp;
        currentGroup.count++;
      }
    });
    
    if (currentGroup) {
      messageGroups.push(currentGroup);
    }
    
    // First group is always a conversation starter
    if (messageGroups.length > 0) {
      const firstAuthor = messageGroups[0].author;
      conversationStarts.set(firstAuthor, 1);
    }
    
    // Look for conversation starters based on intelligent gap detection
    for (let i = 1; i < messageGroups.length; i++) {
      const currentGroup = messageGroups[i];
      const previousGroup = messageGroups[i - 1];
      
      const timeDiff = currentGroup.startTime.getTime() - previousGroup.endTime.getTime();
      const hours = timeDiff / (1000 * 60 * 60);
      
      // Dynamic gap threshold based on conversation context
      let gapThreshold = 2; // Default 2 hours
      
      // Use longer threshold during night hours (10 PM - 8 AM)
      const currentHour = currentGroup.startTime.getHours();
      const isNightTime = currentHour >= 22 || currentHour <= 8;
      
      if (isNightTime) {
        gapThreshold = 8; // 8 hours during night
      }
      
      // Consider it a new conversation if gap exceeds threshold
      if (hours >= gapThreshold) {
        const count = conversationStarts.get(currentGroup.author) || 0;
        conversationStarts.set(currentGroup.author, count + 1);
      }
    }

    const totalStarts = Array.from(conversationStarts.values()).reduce((sum, count) => sum + count, 0);
    
    if (totalStarts === 0) {
      return [];
    }
    
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
    // Comprehensive emoji regex covering all Unicode emoji ranges
    const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA70}-\u{1FAFF}]|[\u{1F004}\u{1F0CF}\u{1F170}\u{1F171}\u{1F17E}\u{1F17F}\u{1F18E}\u{1F191}-\u{1F19A}\u{1F1E6}-\u{1F1FF}\u{1F201}\u{1F202}\u{1F21A}\u{1F22F}\u{1F232}-\u{1F23A}\u{1F250}\u{1F251}\u{1F300}-\u{1F321}\u{1F324}-\u{1F393}\u{1F396}\u{1F397}\u{1F399}-\u{1F39B}\u{1F39E}-\u{1F3F0}\u{1F3F3}-\u{1F3F5}\u{1F3F7}-\u{1F4FD}\u{1F4FF}-\u{1F53D}\u{1F549}-\u{1F54E}\u{1F550}-\u{1F567}\u{1F56F}\u{1F570}\u{1F573}-\u{1F57A}\u{1F587}\u{1F58A}-\u{1F58D}\u{1F590}\u{1F595}\u{1F596}\u{1F5A4}\u{1F5A5}\u{1F5A8}\u{1F5B1}\u{1F5B2}\u{1F5BC}\u{1F5C2}-\u{1F5C4}\u{1F5D1}-\u{1F5D3}\u{1F5DC}-\u{1F5DE}\u{1F5E1}\u{1F5E3}\u{1F5E8}\u{1F5EF}\u{1F5F3}\u{1F5FA}-\u{1F64F}\u{1F680}-\u{1F6C5}\u{1F6CB}-\u{1F6D2}\u{1F6D5}-\u{1F6D7}\u{1F6E0}-\u{1F6E5}\u{1F6E9}\u{1F6EB}\u{1F6EC}\u{1F6F0}\u{1F6F3}-\u{1F6FC}\u{1F7E0}-\u{1F7EB}]|[\u{1F90C}-\u{1F93A}\u{1F93C}-\u{1F945}\u{1F947}-\u{1F978}\u{1F97A}-\u{1F9CB}\u{1F9CD}-\u{1F9FF}\u{1FA70}-\u{1FA74}\u{1FA78}-\u{1FA7A}\u{1FA80}-\u{1FA86}\u{1FA90}-\u{1FAA8}\u{1FAB0}-\u{1FAB6}\u{1FAC0}-\u{1FAC2}\u{1FAD0}-\u{1FAD6}]/gu;
    
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