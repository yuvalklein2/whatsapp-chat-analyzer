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
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const gradients = [
            'from-blue-500 to-blue-600',
            'from-green-500 to-green-600', 
            'from-purple-500 to-purple-600',
            'from-yellow-500 to-yellow-600'
          ];
          
          return (
            <div key={stat.name} className="group relative bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-gray-200/50 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-purple-50/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative">
                <div className="flex items-center space-x-4">
                  <div className={`bg-gradient-to-r ${gradients[index]} p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-600 mb-1">{stat.name}</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 shadow-lg">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
            Chat Insights
          </h3>
          <p className="text-gray-600 font-medium">Key highlights from your conversation</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-white/40 rounded-2xl border border-gray-200/30">
            <p className="text-sm font-semibold text-gray-600 mb-2">Date Range</p>
            <p className="text-base font-bold text-gray-900">
              {formatDate(chatData.dateRange.start)}
            </p>
            <p className="text-sm text-gray-500">to</p>
            <p className="text-base font-bold text-gray-900">
              {formatDate(chatData.dateRange.end)}
            </p>
          </div>
          
          <div className="text-center p-4 bg-white/40 rounded-2xl border border-gray-200/30">
            <p className="text-sm font-semibold text-gray-600 mb-2">⚡ Fastest Responder</p>
            <p className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {analyticsData.responseTimeAnalysis.fastestResponder}
            </p>
          </div>
          
          <div className="text-center p-4 bg-white/40 rounded-2xl border border-gray-200/30">
            <p className="text-sm font-semibold text-gray-600 mb-2">🎯 Top Conversation Starter</p>
            <p className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {analyticsData.conversationStarters[0]?.name || 'N/A'}
            </p>
          </div>
          
          <div className="text-center p-4 bg-white/40 rounded-2xl border border-gray-200/30">
            <p className="text-sm font-semibold text-gray-600 mb-2">😊 Most Used Emoji</p>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl">{analyticsData.emojiAnalysis.topEmojis[0]?.emoji || '❓'}</span>
              <span className="text-lg font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                {analyticsData.emojiAnalysis.topEmojis[0]?.count || 0}
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200/50">
          <p className="text-center text-sm font-semibold text-gray-600 mb-4">Conversation Participants</p>
          <div className="flex flex-wrap justify-center gap-3">
            {chatData.participants.map((participant, index) => {
              const colors = [
                'from-blue-500 to-blue-600',
                'from-purple-500 to-purple-600',
                'from-green-500 to-green-600',
                'from-orange-500 to-orange-600',
                'from-pink-500 to-pink-600',
                'from-indigo-500 to-indigo-600'
              ];
              
              return (
                <span
                  key={participant}
                  className={`inline-flex items-center px-4 py-2 rounded-2xl text-sm font-semibold bg-gradient-to-r ${colors[index % colors.length]} text-white shadow-lg hover:scale-105 transition-transform duration-200`}
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