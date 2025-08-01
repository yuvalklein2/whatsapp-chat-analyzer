'use client';

import { useState } from 'react';
import { AnalyticsData, ChatData, DateRange } from '@/types/chat';
import { ChatAnalytics } from '@/utils/analytics';
import { BarChart3, Clock, Calendar, Users, MessageSquare, Timer, Zap, Smile, Grid3X3, ChevronLeft, BarChart, User } from 'lucide-react';
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
import ExecutiveSummary from './ExecutiveSummary';

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
  const [viewMode, setViewMode] = useState<'executive' | 'analyst'>('executive');
  
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
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                {showMultiGraph 
                  ? 'Performance Comparison Analysis' 
                  : viewMode === 'executive' 
                    ? 'Executive Dashboard' 
                    : 'Analytics Deep Dive'
                }
              </h1>
              <div className="mt-3">
                <p className="text-slate-600">
                  {showMultiGraph 
                    ? 'Comparative insights across multiple time periods'
                    : viewMode === 'executive'
                      ? 'Key insights and team health at a glance'
                      : `Analyzing ${analyticsData.filteredMessageCount.toLocaleString()} messages in selected period`
                  }
                </p>
              </div>
            </div>
            
            {/* View Mode Toggle */}
            {!showMultiGraph && (
              <div className="flex bg-gradient-to-r from-gray-50 to-gray-100/80 rounded-2xl p-1.5 border border-gray-200/50 shadow-sm backdrop-blur-sm">
                <button
                  onClick={() => setViewMode('executive')}
                  className={`group flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    viewMode === 'executive'
                      ? 'bg-gradient-to-r from-white to-gray-50 text-gray-900 shadow-lg border border-gray-200/50'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                  }`}
                >
                  <div className={`p-1 rounded-lg transition-all duration-300 ${
                    viewMode === 'executive' 
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm' 
                      : 'bg-gray-200 group-hover:bg-blue-100'
                  }`}>
                    <User className={`h-3.5 w-3.5 ${
                      viewMode === 'executive' ? 'text-white' : 'text-gray-600 group-hover:text-blue-600'
                    } transition-colors duration-300`} />
                  </div>
                  <span className="tracking-wide">Executive</span>
                </button>
                <button
                  onClick={() => setViewMode('analyst')}
                  className={`group flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    viewMode === 'analyst'
                      ? 'bg-gradient-to-r from-white to-gray-50 text-gray-900 shadow-lg border border-gray-200/50'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                  }`}
                >
                  <div className={`p-1 rounded-lg transition-all duration-300 ${
                    viewMode === 'analyst' 
                      ? 'bg-gradient-to-br from-purple-500 to-purple-600 shadow-sm' 
                      : 'bg-gray-200 group-hover:bg-purple-100'
                  }`}>
                    <BarChart className={`h-3.5 w-3.5 ${
                      viewMode === 'analyst' ? 'text-white' : 'text-gray-600 group-hover:text-purple-600'
                    } transition-colors duration-300`} />
                  </div>
                  <span className="tracking-wide">Analyst</span>
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Action buttons */}
        {!showMultiGraph && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            {viewMode === 'analyst' && (
              <button
                onClick={() => setShowMultiGraph(true)}
                className="group relative flex items-center justify-center space-x-3 px-6 py-3 bg-gradient-to-r from-slate-800 via-slate-900 to-black text-white rounded-2xl hover:from-slate-700 hover:via-slate-800 hover:to-slate-900 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-slate-500/30 transition-all duration-300 touch-manipulation shadow-xl hover:shadow-2xl border border-slate-700/50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center space-x-3">
                  <div className="p-1 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors duration-300">
                    <Grid3X3 className="h-4 w-4" />
                  </div>
                  <span className="font-semibold text-sm tracking-wide">
                    <span className="hidden sm:inline">Comparative Analysis</span>
                    <span className="sm:hidden">Compare</span>
                  </span>
                </div>
              </button>
            )}
            
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
      ) : viewMode === 'executive' ? (
        <ExecutiveSummary analyticsData={analyticsData} chatData={chatData} />
      ) : (
        <>
          <StatsCards analyticsData={analyticsData} chatData={chatData} />
          
          {/* Simplified Chart Selection */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Analytics Views</h2>
            <div className="flex flex-wrap gap-2">
              {chartOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = selectedCharts.includes(option.id);
                
                return (
                  <button
                    key={option.id}
                    onClick={() => toggleChart(option.id)}
                    className={`
                      flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                      ${isSelected 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{option.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Charts Grid */}
          {selectedCharts.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {selectedCharts.map((chartType) => {
                const chartOption = chartOptions.find(opt => opt.id === chartType);
                const Icon = chartOption?.icon;
                
                return (
                  <div key={chartType} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {Icon && (
                          <div className="bg-blue-50 p-2 rounded-lg">
                            <Icon className="h-5 w-5 text-blue-600" />
                          </div>
                        )}
                        <h3 className="text-lg font-semibold text-gray-900">
                          {chartOption?.name}
                        </h3>
                      </div>
                      <ChartExplanation chartType={chartType} />
                    </div>
                    <div className="overflow-hidden">
                      {renderChart(chartType)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {selectedCharts.length === 0 && (
            <div className="bg-white rounded-xl p-12 text-center border border-gray-200 shadow-sm">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Select Analytics to View</h3>
              <p className="text-gray-600">Choose from the analytics views above to explore your data</p>
            </div>
          )}

          <InsightsPanel analyticsData={analyticsData} chatData={chatData} />
        </>
      )}
    </div>
  );
}