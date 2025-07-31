'use client';

import { AnalyticsData, ChatData } from '@/types/chat';
import { MessageCircle, Users, Timer, Smile } from 'lucide-react';
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colors = [
            'text-blue-600 bg-blue-50',
            'text-green-600 bg-green-50', 
            'text-purple-600 bg-purple-50',
            'text-yellow-600 bg-yellow-50'
          ];
          
          return (
            <div key={stat.name} className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${colors[index]}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Key Insights
          </h3>
          <p className="text-gray-600">Highlights from your conversation</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-600 mb-2">Date Range</p>
            <p className="text-sm font-semibold text-gray-900">
              {formatDate(chatData.dateRange.start)}
            </p>
            <p className="text-xs text-gray-500">to</p>
            <p className="text-sm font-semibold text-gray-900">
              {formatDate(chatData.dateRange.end)}
            </p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-600 mb-2">Fastest Responder</p>
            <p className="text-lg font-semibold text-blue-600">
              {analyticsData.responseTimeAnalysis.fastestResponder}
            </p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-600 mb-2">Top Conversation Starter</p>
            <p className="text-lg font-semibold text-green-600">
              {analyticsData.conversationStarters[0]?.name || 'N/A'}
            </p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-600 mb-2">Most Used Emoji</p>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-xl">{analyticsData.emojiAnalysis.topEmojis[0]?.emoji || '❓'}</span>
              <span className="text-lg font-semibold text-yellow-600">
                {analyticsData.emojiAnalysis.topEmojis[0]?.count || 0}
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm font-medium text-gray-600 mb-4">Participants</p>
          <div className="flex flex-wrap gap-2">
            {chatData.participants.map((participant, index) => {
              const colors = [
                'bg-blue-100 text-blue-700',
                'bg-purple-100 text-purple-700',
                'bg-green-100 text-green-700',
                'bg-orange-100 text-orange-700',
                'bg-pink-100 text-pink-700',
                'bg-indigo-100 text-indigo-700'
              ];
              
              return (
                <span
                  key={participant}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colors[index % colors.length]}`}
                >
                  {participant}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}