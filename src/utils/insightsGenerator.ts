import { AnalyticsData, ChatData, Message } from '@/types/chat';
import { isWeekend } from 'date-fns';

export interface Insight {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'activity' | 'social' | 'behavior' | 'time';
  priority: 'high' | 'medium' | 'low';
  value?: string;
}

export class InsightsGenerator {
  static generateInsights(analyticsData: AnalyticsData, chatData: ChatData): Insight[] {
    const insights: Insight[] = [];
    
    // Only generate insights if we have data to analyze
    if (analyticsData.filteredMessageCount === 0) {
      return [];
    }
    
    // Activity Insights
    insights.push(...this.generateActivityInsights(analyticsData));
    
    // Time Pattern Insights
    insights.push(...this.generateTimeInsights(analyticsData, chatData));
    
    // Social Insights
    insights.push(...this.generateSocialInsights(analyticsData));
    
    // Behavioral Insights
    insights.push(...this.generateBehaviorInsights(analyticsData));
    
    // Sort by priority and return top insights
    return insights
      .sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      })
      .slice(0, 6); // Show top 6 insights
  }

  private static generateActivityInsights(analyticsData: AnalyticsData): Insight[] {
    const insights: Insight[] = [];
    
    // Most active participant with balance analysis
    const topParticipant = analyticsData.messagesByParticipant[0];
    if (topParticipant && analyticsData.filteredMessageCount > 0) {
      const percentage = Math.round((topParticipant.count / analyticsData.filteredMessageCount) * 100);
      let balanceInsight = '';
      
      if (percentage > 70) {
        balanceInsight = `${topParticipant.name} dominates the conversation with ${percentage}% of messages - very one-sided!`;
      } else if (percentage > 60) {
        balanceInsight = `${topParticipant.name} leads the conversation with ${percentage}% of messages`;
      } else if (percentage > 55) {
        balanceInsight = `${topParticipant.name} is slightly more active with ${percentage}% of messages - fairly balanced!`;
      } else {
        balanceInsight = `${topParticipant.name} sent ${percentage}% of messages - very balanced conversation!`;
      }
      
      insights.push({
        id: 'top-contributor',
        title: '🏆 Conversation Balance',
        description: balanceInsight,
        icon: '🏆',
        category: 'activity',
        priority: 'high',
        value: `${percentage}%`
      });
    }

    // Message volume assessment with benchmarking
    const avgMessagesPerDay = analyticsData.messagesByDay.length > 0 
      ? analyticsData.filteredMessageCount / analyticsData.messagesByDay.length 
      : 0;
    let volumeInsight = '';
    let volumeIcon = '';
    let comparison = '';
    
    if (avgMessagesPerDay > 200) {
      volumeInsight = 'Extremely active conversation - you chat more than 95% of WhatsApp users!';
      volumeIcon = '🚀';
      comparison = 'Top 5% activity level';
    } else if (avgMessagesPerDay > 100) {
      volumeInsight = 'Very active conversation - above average WhatsApp usage!';
      volumeIcon = '🔥';
      comparison = 'Above average activity';
    } else if (avgMessagesPerDay > 50) {
      volumeInsight = 'Steady conversation with typical WhatsApp activity levels';
      volumeIcon = '📈';
      comparison = 'Average activity level';
    } else if (avgMessagesPerDay > 20) {
      volumeInsight = 'Moderate conversation - you prefer quality over quantity';
      volumeIcon = '💬';
      comparison = 'Below average activity';
    } else {
      volumeInsight = 'Light conversation - you keep it minimal and meaningful';
      volumeIcon = '🌱';
      comparison = 'Minimal activity level';
    }

    insights.push({
      id: 'conversation-volume',
      title: `${volumeIcon} Activity Level`,
      description: `${volumeInsight} (${Math.round(avgMessagesPerDay)} messages/day vs ~30 typical)`,
      icon: volumeIcon,
      category: 'activity',
      priority: 'medium',
      value: comparison
    });

    return insights;
  }

  private static generateTimeInsights(analyticsData: AnalyticsData, chatData: ChatData): Insight[] {
    const insights: Insight[] = [];
    
    // Peak hour analysis
    const peakHour = analyticsData.mostActiveHour;
    let timeOfDay = '';
    let timeIcon = '';
    
    if (peakHour >= 6 && peakHour < 12) {
      timeOfDay = 'morning person';
      timeIcon = '🌅';
    } else if (peakHour >= 12 && peakHour < 17) {
      timeOfDay = 'afternoon chatter';
      timeIcon = '☀️';
    } else if (peakHour >= 17 && peakHour < 22) {
      timeOfDay = 'evening conversationalist';
      timeIcon = '🌆';
    } else {
      timeOfDay = 'night owl';
      timeIcon = '🌙';
    }

    const hour12 = peakHour > 12 ? peakHour - 12 : peakHour === 0 ? 12 : peakHour;
    const ampm = peakHour >= 12 ? 'PM' : 'AM';
    
    insights.push({
      id: 'peak-time',
      title: `${timeIcon} Peak Activity Time`,
      description: `You're most active around ${hour12}${ampm} - you're a ${timeOfDay}!`,
      icon: timeIcon,
      category: 'time',
      priority: 'high',
      value: `${hour12}${ampm}`
    });

    // Weekend vs weekday analysis - use filtered messages for accurate calculation
    const filteredMessages = chatData.messages.filter(m => !m.isSystemMessage);
    const weekendMessages = this.getWeekendMessageCount(chatData, filteredMessages);
    const weekendPercentage = analyticsData.filteredMessageCount > 0 
      ? Math.round((weekendMessages / analyticsData.filteredMessageCount) * 100)
      : 0;
    
    if (weekendPercentage > 35) {
      insights.push({
        id: 'weekend-warrior',
        title: '🎉 Weekend Warrior',
        description: `You're more active on weekends! ${weekendPercentage}% of your messages are sent during weekends`,
        icon: '🎉',
        category: 'time',
        priority: 'medium',
        value: `${weekendPercentage}%`
      });
    } else if (weekendPercentage < 20) {
      insights.push({
        id: 'weekday-focused',
        title: '💼 Weekday Focused',
        description: `You're a weekday communicator! Only ${weekendPercentage}% of messages are on weekends`,
        icon: '💼',
        category: 'time',
        priority: 'medium',
        value: `${weekendPercentage}%`
      });
    }

    return insights;
  }

  private static generateSocialInsights(analyticsData: AnalyticsData): Insight[] {
    const insights: Insight[] = [];
    
    // Response time insights with benchmarking
    const avgResponseTime = analyticsData.responseTimeAnalysis.averageResponseTimeMinutes;
    let responseInsight = '';
    let responseIcon = '';
    let benchmark = '';
    
    if (avgResponseTime < 5) {
      responseInsight = 'Lightning fast responses! You reply almost instantly - faster than 90% of people';
      responseIcon = '⚡';
      benchmark = 'Top 10% response speed';
    } else if (avgResponseTime < 15) {
      responseInsight = 'Very quick responder! Much faster than average (typical: 2-3 hours)';
      responseIcon = '🚀';
      benchmark = 'Above average speed';
    } else if (avgResponseTime < 60) {
      responseInsight = 'Good response time - you reply within an hour, better than most';
      responseIcon = '⏰';
      benchmark = 'Better than average';
    } else if (avgResponseTime < 180) {
      responseInsight = 'Steady communicator with typical response times';
      responseIcon = '🤔';
      benchmark = 'Average response time';
    } else {
      responseInsight = 'Thoughtful responder who takes time - you prefer quality over speed';
      responseIcon = '📚';
      benchmark = 'Slower than average';
    }


    insights.push({
      id: 'response-time',
      title: `${responseIcon} Response Speed`,
      description: `${responseInsight}`,
      icon: responseIcon,
      category: 'social',
      priority: 'high',
      value: benchmark
    });

    // Conversation starter analysis
    const topStarter = analyticsData.conversationStarters[0];
    if (topStarter && topStarter.percentage > 60) {
      insights.push({
        id: 'conversation-initiator',
        title: '🎯 Conversation Initiator',
        description: `${topStarter.name} starts ${topStarter.percentage}% of conversations - a natural conversation leader!`,
        icon: '🎯',
        category: 'social',
        priority: 'medium',
        value: `${topStarter.percentage}%`
      });
    }

    return insights;
  }

  private static generateBehaviorInsights(analyticsData: AnalyticsData): Insight[] {
    const insights: Insight[] = [];
    
    // Emoji usage insights
    const totalEmojis = analyticsData.emojiAnalysis.totalEmojis;
    const emojiPerMessage = analyticsData.filteredMessageCount > 0 
      ? totalEmojis / analyticsData.filteredMessageCount 
      : 0;
    
    if (emojiPerMessage > 0.5) {
      insights.push({
        id: 'emoji-enthusiast',
        title: '😍 Emoji Enthusiast',
        description: `You love emojis! Using ${totalEmojis.toLocaleString()} emojis across your conversation`,
        icon: '😍',
        category: 'behavior',
        priority: 'medium',
        value: `${totalEmojis.toLocaleString()} emojis`
      });
    } else if (emojiPerMessage < 0.1) {
      insights.push({
        id: 'text-focused',
        title: '📝 Text-Focused',
        description: 'You prefer words over emojis - a classic text communicator',
        icon: '📝',
        category: 'behavior',
        priority: 'low',
        value: `${Math.round(emojiPerMessage * 100)}% emoji rate`
      });
    }

    // Message length insights
    if (analyticsData.averageMessageLength > 100) {
      insights.push({
        id: 'detailed-communicator',
        title: '📖 Detailed Communicator',
        description: `You write detailed messages! Average of ${analyticsData.averageMessageLength} characters per message`,
        icon: '📖',
        category: 'behavior',
        priority: 'low',
        value: `${analyticsData.averageMessageLength} chars`
      });
    } else if (analyticsData.averageMessageLength < 30) {
      insights.push({
        id: 'concise-communicator',
        title: '💬 Concise Communicator',
        description: `You keep it short and sweet! Average of ${analyticsData.averageMessageLength} characters per message`,
        icon: '💬',
        category: 'behavior',
        priority: 'low',
        value: `${analyticsData.averageMessageLength} chars`
      });
    }

    return insights;
  }

  private static getWeekendMessageCount(chatData: ChatData, filteredMessages?: Message[]): number {
    // Use filtered messages if provided, otherwise use all messages
    const messagesToAnalyze = filteredMessages || chatData.messages;
    return messagesToAnalyze.filter(message => 
      !message.isSystemMessage && isWeekend(message.timestamp)
    ).length;
  }

  // Get explanations for chart types
  static getChartExplanation(chartType: string): { title: string; description: string; tip: string } {
    const explanations = {
      messagesByDay: {
        title: "Daily Message Timeline",
        description: "Shows how your conversation activity changes over time. Peaks indicate busy days, while valleys show quieter periods.",
        tip: "Look for patterns - do you chat more on weekends? During specific events?"
      },
      messagesByHour: {
        title: "Hourly Activity Pattern", 
        description: "Reveals when you're most active during the day. This shows your natural communication rhythm.",
        tip: "Peak hours often align with your daily routine - work breaks, commute times, or evening relaxation."
      },
      messagesByParticipant: {
        title: "Conversation Contributors",
        description: "Compares how much each person contributes to the conversation. Shows the balance of participation.",
        tip: "A balanced conversation has similar message counts. Large differences might indicate different communication styles."
      },
      responseTime: {
        title: "Response Speed Analysis",
        description: "Measures how quickly each person typically responds to messages. Lower times indicate faster responses.",
        tip: "Fast responders (under 30 minutes) are very engaged. Slower responses might indicate busy schedules or different time zones."
      },
      conversationStarters: {
        title: "Who Initiates Conversations",
        description: "Shows who tends to start new conversation topics after long gaps. Indicates conversation leadership.",
        tip: "Natural conversation leaders often have higher percentages. This reveals social dynamics in your group."
      },
      emojiAnalysis: {
        title: "Emoji Usage Patterns",
        description: "Displays your most frequently used emojis. This reveals your emotional expression style.",
        tip: "Popular emojis often reflect the tone of your relationship - lots of laughing emojis suggest a fun, light-hearted dynamic."
      },
      wordFrequency: {
        title: "Most Common Words",
        description: "Shows which words appear most often in your conversations (excluding common words like 'the', 'and').",
        tip: "Common words reveal your conversation topics and interests. They're like a word cloud of your relationship!"
      }
    };

    return explanations[chartType as keyof typeof explanations] || {
      title: "Chart Analysis",
      description: "This chart provides insights into your conversation patterns.",
      tip: "Explore the data to discover interesting patterns in your communication!"
    };
  }
}