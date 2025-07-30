'use client';

import { useState } from 'react';
import { AnalyticsData, ChatData } from '@/types/chat';
import { BarChart3, Clock, Calendar, Users, MessageSquare } from 'lucide-react';
import MessagesByDayChart from './charts/MessagesByDayChart';
import MessagesByHourChart from './charts/MessagesByHourChart';
import MessagesByParticipantChart from './charts/MessagesByParticipantChart';
import WordFrequencyChart from './charts/WordFrequencyChart';
import StatsCards from './StatsCards';

interface DashboardProps {
  analyticsData: AnalyticsData;
  chatData: ChatData;
}

type ChartType = 'messagesByDay' | 'messagesByHour' | 'messagesByParticipant' | 'wordFrequency';

interface ChartOption {
  id: ChartType;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const chartOptions: ChartOption[] = [
  {
    id: 'messagesByDay',
    name: 'Messages by Day',
    icon: Calendar,
    description: 'Daily message activity over time'
  },
  {
    id: 'messagesByHour',
    name: 'Messages by Hour',
    icon: Clock,
    description: 'Hourly message patterns throughout the day'
  },
  {
    id: 'messagesByParticipant',
    name: 'Messages by Participant',
    icon: Users,
    description: 'Message count breakdown by participant'
  },
  {
    id: 'wordFrequency',
    name: 'Word Frequency',
    icon: MessageSquare,
    description: 'Most commonly used words in conversations'
  }
];

export default function Dashboard({ analyticsData, chatData }: DashboardProps) {
  const [selectedCharts, setSelectedCharts] = useState<ChartType[]>(['messagesByDay', 'messagesByParticipant']);

  const toggleChart = (chartId: ChartType) => {
    setSelectedCharts(prev => 
      prev.includes(chartId)
        ? prev.filter(id => id !== chartId)
        : [...prev, chartId]
    );
  };

  const renderChart = (chartType: ChartType) => {
    switch (chartType) {
      case 'messagesByDay':
        return <MessagesByDayChart data={analyticsData.messagesByDay} />;
      case 'messagesByHour':
        return <MessagesByHourChart data={analyticsData.messagesByHour} />;
      case 'messagesByParticipant':
        return <MessagesByParticipantChart data={analyticsData.messagesByParticipant} />;
      case 'wordFrequency':
        return <WordFrequencyChart data={analyticsData.wordFrequency} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <StatsCards analyticsData={analyticsData} chatData={chatData} />
      
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Choose Your Charts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {chartOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedCharts.includes(option.id);
            
            return (
              <button
                key={option.id}
                onClick={() => toggleChart(option.id)}
                className={`
                  p-4 rounded-lg border-2 transition-all text-left
                  ${isSelected 
                    ? 'border-blue-500 bg-blue-50 text-blue-900' 
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }
                `}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <Icon className={`h-5 w-5 ${isSelected ? 'text-blue-600' : 'text-gray-500'}`} />
                  <span className="font-medium">{option.name}</span>
                </div>
                <p className="text-sm text-gray-600">{option.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {selectedCharts.map((chartType) => (
          <div key={chartType} className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {chartOptions.find(opt => opt.id === chartType)?.name}
            </h3>
            {renderChart(chartType)}
          </div>
        ))}
      </div>

      {selectedCharts.length === 0 && (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Charts Selected</h3>
          <p className="text-gray-600">Choose one or more chart types above to visualize your chat data.</p>
        </div>
      )}
    </div>
  );
}