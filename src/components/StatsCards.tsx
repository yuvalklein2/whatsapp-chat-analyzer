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
      name: 'Communication Volume',
      value: analyticsData.filteredMessageCount.toLocaleString(),
      icon: MessageCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      name: 'Team Members',
      value: chatData.participants.length.toString(),
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      name: 'Response Velocity',
      value: formatResponseTime(analyticsData.responseTimeAnalysis.averageResponseTimeMinutes),
      icon: Timer,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      name: 'Engagement Level',
      value: analyticsData.emojiAnalysis.totalEmojis.toLocaleString(),
      icon: Smile,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const formatDate = (date: Date) => {
    return format(date, 'MMM d, yyyy');
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colors = [
            'text-blue-600 bg-blue-50',
            'text-green-600 bg-green-50', 
            'text-purple-600 bg-purple-50',
            'text-yellow-600 bg-yellow-50'
          ];
          
          return (
            <div key={stat.name} className="bg-white rounded-lg p-3 sm:p-6 border border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <div className={`p-2 sm:p-3 rounded-lg ${colors[index]} self-start sm:self-auto`}>
                  <Icon className="h-4 w-4 sm:h-6 sm:w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 leading-tight">{stat.name}</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="bg-slate-900 rounded-xl p-6 sm:p-8 border border-slate-700 shadow-xl">
        <div className="mb-6 sm:mb-8">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
            Executive Summary
          </h3>
          <p className="text-slate-300">Strategic insights and performance indicators</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-slate-800 rounded-lg border border-slate-600">
            <p className="text-sm font-medium text-slate-400 mb-2">Analysis Period</p>
            <p className="text-sm font-bold text-white">
              {formatDate(chatData.dateRange.start)}
            </p>
            <p className="text-xs text-slate-500 my-1">to</p>
            <p className="text-sm font-bold text-white">
              {formatDate(chatData.dateRange.end)}
            </p>
          </div>
          
          <div className="text-center p-4 bg-slate-800 rounded-lg border border-slate-600">
            <p className="text-sm font-medium text-slate-400 mb-2">Top Performer</p>
            <p className="text-lg font-bold text-blue-400 truncate">
              {analyticsData.responseTimeAnalysis.fastestResponder}
            </p>
          </div>
          
          <div className="text-center p-4 bg-slate-800 rounded-lg border border-slate-600">
            <p className="text-sm font-medium text-slate-400 mb-2">Initiative Leader</p>
            <p className="text-lg font-bold text-green-400 truncate">
              {analyticsData.conversationStarters[0]?.name || 'N/A'}
            </p>
          </div>
          
          <div className="text-center p-4 bg-slate-800 rounded-lg border border-slate-600">
            <p className="text-sm font-medium text-slate-400 mb-2">Engagement Indicator</p>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-xl">{analyticsData.emojiAnalysis.topEmojis[0]?.emoji || '❓'}</span>
              <span className="text-lg font-bold text-orange-400">
                {analyticsData.emojiAnalysis.topEmojis[0]?.count || 0}
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-slate-700">
          <p className="text-sm font-semibold text-slate-300 mb-4">Team Roster</p>
          <div className="flex flex-wrap gap-2">
            {chatData.participants.map((participant, index) => {
              const colors = [
                'bg-blue-600 text-blue-100 border-blue-500',
                'bg-purple-600 text-purple-100 border-purple-500',
                'bg-green-600 text-green-100 border-green-500',
                'bg-orange-600 text-orange-100 border-orange-500',
                'bg-pink-600 text-pink-100 border-pink-500',
                'bg-indigo-600 text-indigo-100 border-indigo-500'
              ];
              
              return (
                <span
                  key={participant}
                  className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold border ${colors[index % colors.length]} truncate max-w-32 sm:max-w-none shadow-lg`}
                  title={participant}
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