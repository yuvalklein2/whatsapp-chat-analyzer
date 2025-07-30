'use client';

import { AnalyticsData, ChatData } from '@/types/chat';
import { MessageCircle, Users, Calendar, TrendingUp, Timer, Zap, Smile } from 'lucide-react';
import { format } from 'date-fns';

interface StatsCardsProps {
  analyticsData: AnalyticsData;
  chatData: ChatData;
}

export default function StatsCards({ analyticsData, chatData }: StatsCardsProps) {
  const formatResponseTime = (minutes: number) => {
    if (minutes < 60) {
      return `${Math.round(minutes)}m`;
    } else if (minutes < 1440) {
      const hours = Math.floor(minutes / 60);
      const mins = Math.round(minutes % 60);
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    } else {
      const days = Math.floor(minutes / 1440);
      const hours = Math.floor((minutes % 1440) / 60);
      return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
    }
  };

  const stats = [
    {
      name: 'Total Messages',
      value: chatData.totalMessages.toLocaleString(),
      icon: MessageCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      name: 'Participants',
      value: chatData.participants.length.toString(),
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      name: 'Avg Response Time',
      value: formatResponseTime(analyticsData.responseTimeAnalysis.averageResponseTimeMinutes),
      icon: Timer,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      name: 'Total Emojis',
      value: analyticsData.emojiAnalysis.totalEmojis.toLocaleString(),
      icon: Smile,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    }
  ];

  const formatDate = (date: Date) => {
    return format(date, 'MMM d, yyyy');
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className={`${stat.bgColor} rounded-lg p-3`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Chat Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-600">Date Range</p>
            <p className="text-lg text-gray-900">
              {formatDate(chatData.dateRange.start)} - {formatDate(chatData.dateRange.end)}
            </p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-600">Fastest Responder</p>
            <p className="text-lg text-gray-900">
              {analyticsData.responseTimeAnalysis.fastestResponder}
            </p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-600">Top Conversation Starter</p>
            <p className="text-lg text-gray-900">
              {analyticsData.conversationStarters[0]?.name || 'N/A'}
            </p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-600">Most Used Emoji</p>
            <p className="text-lg text-gray-900">
              {analyticsData.emojiAnalysis.topEmojis[0]?.emoji || 'N/A'} ({analyticsData.emojiAnalysis.topEmojis[0]?.count || 0})
            </p>
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-600">Participants</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {chatData.participants.map((participant) => (
              <span
                key={participant}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
              >
                {participant}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}