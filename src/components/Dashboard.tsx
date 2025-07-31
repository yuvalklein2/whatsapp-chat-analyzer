'use client';

import { useState } from 'react';
import { AnalyticsData, ChatData, DateRange } from '@/types/chat';
import { ChatAnalytics } from '@/utils/analytics';
import { BarChart3, Clock, Calendar, Users, MessageSquare, Timer, Zap, Smile, Grid3X3, ChevronLeft } from 'lucide-react';
import MessagesByDayChart from './charts/MessagesByDayChart';
import MessagesByHourChart from './charts/MessagesByHourChart';
import MessagesByParticipantChart from './charts/MessagesByParticipantChart';
import WordFrequencyChart from './charts/WordFrequencyChart';
import ResponseTimeChart from './charts/ResponseTimeChart';
import ConversationStartersChart from './charts/ConversationStartersChart';
import EmojiAnalysisChart from './charts/EmojiAnalysisChart';
import StatsCards from './StatsCards';
import DateRangePicker from './DateRangePicker';
import MultiGraphManager from './MultiGraphManager';
import InsightsPanel from './InsightsPanel';
import ChartExplanation from './ChartExplanation';
import KeyTakeaways from './KeyTakeaways';

interface DashboardProps {
  analyticsData: AnalyticsData;
  chatData: ChatData;
  selectedDateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

type ChartType = 'messagesByDay' | 'messagesByHour' | 'messagesByParticipant' | 'wordFrequency' | 'responseTime' | 'conversationStarters' | 'emojiAnalysis';

interface ChartOption {
  id: ChartType;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const chartOptions: ChartOption[] = [
  {
    id: 'messagesByDay',
    name: 'Activity Timeline',
    icon: Calendar,
    description: 'Daily communication volume and engagement trends'
  },
  {
    id: 'messagesByHour',
    name: 'Peak Hours Analysis',
    icon: Clock,
    description: 'Optimal communication windows and team availability'
  },
  {
    id: 'messagesByParticipant',
    name: 'Team Contribution',
    icon: Users,
    description: 'Individual participation levels and engagement metrics'
  },
  {
    id: 'responseTime',
    name: 'Response Efficiency',
    icon: Timer,
    description: 'Team responsiveness and communication velocity KPIs'
  },
  {
    id: 'conversationStarters',
    name: 'Initiative Leaders',
    icon: Zap,
    description: 'Team members driving conversations and collaboration'
  },
  {
    id: 'emojiAnalysis',
    name: 'Sentiment Indicators',
    icon: Smile,
    description: 'Team morale and emotional engagement patterns'
  },
  {
    id: 'wordFrequency',
    name: 'Key Topics',
    icon: MessageSquare,
    description: 'Most discussed subjects and communication themes'
  }
];

export default function Dashboard({ analyticsData, chatData, selectedDateRange, onDateRangeChange }: DashboardProps) {
  const [selectedCharts, setSelectedCharts] = useState<ChartType[]>(['messagesByDay', 'responseTime', 'conversationStarters']);
  const [showMultiGraph, setShowMultiGraph] = useState(false);
  
  const dateRangePresets = ChatAnalytics.getDateRangePresets(chatData);

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
      case 'responseTime':
        return <ResponseTimeChart data={analyticsData.responseTimeAnalysis.responseTimesByParticipant} />;
      case 'conversationStarters':
        return <ConversationStartersChart data={analyticsData.conversationStarters} />;
      case 'emojiAnalysis':
        return <EmojiAnalysisChart data={analyticsData.emojiAnalysis.topEmojis} />;
      case 'wordFrequency':
        return <WordFrequencyChart data={analyticsData.wordFrequency} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Date Range Picker */}
      <div className="flex flex-col gap-4">
        {/* Back button for mobile */}
        {showMultiGraph && (
          <div className="flex items-center">
            <button
              onClick={() => setShowMultiGraph(false)}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <ChevronLeft className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Back to Overview</span>
            </button>
          </div>
        )}
        
        {/* Title section */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {showMultiGraph ? 'Performance Comparison Analysis' : 'Executive Communication Dashboard'}
          </h1>
          <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <p className="text-slate-600">
              {showMultiGraph 
                ? 'Comparative insights across multiple time periods'
                : `Analyzing ${analyticsData.filteredMessageCount.toLocaleString()} of ${analyticsData.totalMessageCount.toLocaleString()} total communications`
              }
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Live Data</span>
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        {!showMultiGraph && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <button
              onClick={() => setShowMultiGraph(true)}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-lg hover:from-slate-700 hover:to-slate-800 active:from-slate-900 active:to-black focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-200 touch-manipulation shadow-lg"
            >
              <Grid3X3 className="h-5 w-5" />
              <span className="font-semibold">
                <span className="hidden sm:inline">Comparative Analysis</span>
                <span className="sm:hidden">Compare</span>
              </span>
            </button>
            
            <DateRangePicker
              selectedRange={selectedDateRange}
              presets={dateRangePresets}
              onRangeChange={onDateRangeChange}
            />
          </div>
        )}
      </div>

      {showMultiGraph ? (
        <MultiGraphManager 
          chatData={chatData} 
        />
      ) : (
        <>
          <StatsCards analyticsData={analyticsData} chatData={chatData} />
          
          <KeyTakeaways analyticsData={analyticsData} chatData={chatData} />
          
          <InsightsPanel analyticsData={analyticsData} chatData={chatData} />
          
          <div className="bg-slate-900 rounded-xl p-6 sm:p-8 border border-slate-700 shadow-xl">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
            Analytics Configuration
          </h2>
          <p className="text-slate-300">Configure your executive dashboard with relevant performance metrics</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          {chartOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedCharts.includes(option.id);
            
            return (
              <button
                key={option.id}
                onClick={() => toggleChart(option.id)}
                className={`
                  p-4 sm:p-5 rounded-lg border-2 transition-all duration-200 text-left min-h-[90px] sm:min-h-[110px] flex flex-col justify-between touch-manipulation hover:scale-105
                  ${isSelected 
                    ? 'border-blue-500 bg-slate-800 shadow-lg' 
                    : 'border-slate-600 bg-slate-700 hover:border-blue-400 hover:bg-slate-600 active:bg-slate-800'
                  }
                `}
              >
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                    <div className={`p-2 rounded-lg ${
                      isSelected ? 'bg-blue-600 shadow-lg' : 'bg-slate-600'
                    }`}>
                      <Icon className={`h-4 w-4 ${
                        isSelected ? 'text-white' : 'text-slate-300'
                      }`} />
                    </div>
                    <span className={`text-sm font-semibold leading-tight ${
                      isSelected ? 'text-white' : 'text-slate-200'
                    }`}>
                      {option.name}
                    </span>
                  </div>
                  <p className={`text-xs leading-relaxed ${
                    isSelected ? 'text-slate-300' : 'text-slate-400'
                  }`}>{option.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {selectedCharts.map((chartType) => {
          const chartOption = chartOptions.find(opt => opt.id === chartType);
          const Icon = chartOption?.icon;
          
          return (
            <div key={chartType} className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                  {Icon && (
                    <div className="bg-blue-600 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                  )}
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                    {chartOption?.name}
                  </h3>
                </div>
                <div className="flex-shrink-0">
                  <ChartExplanation chartType={chartType} />
                </div>
              </div>
              <div className="overflow-hidden">
                {renderChart(chartType)}
              </div>
            </div>
          );
        })}
      </div>

          {selectedCharts.length === 0 && (
            <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Charts Selected</h3>
              <p className="text-gray-600">Choose chart types above to explore your conversation insights.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}