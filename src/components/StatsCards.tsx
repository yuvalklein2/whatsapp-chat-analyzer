'use client';

import { AnalyticsData, ChatData } from '@/types/chat';
import { MessageCircle, Users, Calendar, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

interface StatsCardsProps {
  analyticsData: AnalyticsData;
  chatData: ChatData;
}

export default function StatsCards({ analyticsData, chatData }: StatsCardsProps) {
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
      name: 'Days Active',
      value: analyticsData.messagesByDay.length.toString(),
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      name: 'Avg Message Length',
      value: `${analyticsData.averageMessageLength} chars`,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-600">Date Range</p>
            <p className="text-lg text-gray-900">
              {formatDate(chatData.dateRange.start)} - {formatDate(chatData.dateRange.end)}
            </p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-600">Most Active Day</p>
            <p className="text-lg text-gray-900">
              {analyticsData.mostActiveDay ? format(new Date(analyticsData.mostActiveDay), 'EEEE, MMM d') : 'N/A'}
            </p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-600">Most Active Hour</p>
            <p className="text-lg text-gray-900">
              {analyticsData.mostActiveHour}:00 - {analyticsData.mostActiveHour + 1}:00
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