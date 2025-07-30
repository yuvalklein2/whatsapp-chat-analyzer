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
    id: 'responseTime',
    name: 'Response Time Analysis',
    icon: Timer,
    description: 'How quickly people respond to messages'
  },
  {
    id: 'conversationStarters',
    name: 'Conversation Starters',
    icon: Zap,
    description: 'Who initiates conversations most often'
  },
  {
    id: 'emojiAnalysis',
    name: 'Emoji Analysis',
    icon: Smile,
    description: 'Most frequently used emojis'
  },
  {
    id: 'wordFrequency',
    name: 'Word Frequency',
    icon: MessageSquare,
    description: 'Most commonly used words in conversations'
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
    <div className="space-y-8">
      {/* Header with Date Range Picker */}
      <div className="flex flex-col gap-6">
        {/* Back button for mobile */}
        {showMultiGraph && (
          <div className="flex items-center">
            <button
              onClick={() => setShowMultiGraph(false)}
              className="group flex items-center space-x-2 px-4 py-2.5 bg-white/70 backdrop-blur-xl border border-gray-200/50 rounded-xl shadow-lg hover:shadow-xl hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-2 transition-all duration-300 hover:scale-105"
            >
              <ChevronLeft className="h-4 w-4 text-gray-600 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">Back to Overview</span>
            </button>
          </div>
        )}
        
        {/* Title section */}
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent leading-tight">
            {showMultiGraph ? 'Multi-Graph Comparison' : 'Conversation Analytics'}
          </h1>
          <p className="text-gray-600 font-medium mt-2 text-sm sm:text-base">
            {showMultiGraph 
              ? 'Compare insights across different time periods'
              : `Showing ${analyticsData.filteredMessageCount.toLocaleString()} of ${analyticsData.totalMessageCount.toLocaleString()} messages`
            }
          </p>
        </div>
        
        {/* Action buttons */}
        {!showMultiGraph && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <button
              onClick={() => setShowMultiGraph(true)}
              className="group relative overflow-hidden flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:ring-offset-2 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Grid3X3 className="relative h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
              <span className="relative font-semibold">Multi-Graph Comparison</span>
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-rose-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300 -z-10"></div>
            </button>
            
            <div className="flex justify-center sm:justify-start">
              <DateRangePicker
                selectedRange={selectedDateRange}
                presets={dateRangePresets}
                onRangeChange={onDateRangeChange}
              />
            </div>
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
          
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 shadow-lg">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
            Choose Your Visualizations
          </h2>
          <p className="text-gray-600 font-medium">Select the insights you want to explore</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {chartOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedCharts.includes(option.id);
            
            return (
              <button
                key={option.id}
                onClick={() => toggleChart(option.id)}
                className={`
                  group relative p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 text-left hover:scale-105 hover:-translate-y-1 min-h-[120px] flex flex-col justify-between
                  ${isSelected 
                    ? 'border-blue-400/50 bg-gradient-to-br from-blue-50/80 to-purple-50/80 shadow-xl' 
                    : 'border-gray-200/50 bg-white/50 hover:border-blue-300/50 hover:bg-gradient-to-br hover:from-blue-50/40 hover:to-purple-50/40 hover:shadow-lg'
                  }
                `}
              >
                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  isSelected ? 'bg-gradient-to-br from-blue-100/20 to-purple-100/20' : 'bg-gradient-to-br from-blue-50/20 to-purple-50/20'
                }`}></div>
                
                {isSelected && (
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur opacity-20 -z-10"></div>
                )}
                
                <div className="relative flex-1 flex flex-col">
                  <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                    <div className={`p-1.5 sm:p-2 rounded-xl transition-all duration-300 ${
                      isSelected 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg' 
                        : 'bg-gray-100 group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-600'
                    }`}>
                      <Icon className={`h-4 w-4 sm:h-5 sm:w-5 transition-colors duration-300 ${
                        isSelected ? 'text-white' : 'text-gray-500 group-hover:text-white'
                      }`} />
                    </div>
                    <span className={`text-sm sm:text-base font-bold transition-colors duration-300 leading-tight ${
                      isSelected ? 'text-gray-900' : 'text-gray-700 group-hover:text-gray-900'
                    }`}>
                      {option.name}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed flex-1">{option.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {selectedCharts.map((chartType) => {
          const chartOption = chartOptions.find(opt => opt.id === chartType);
          const Icon = chartOption?.icon;
          
          return (
            <div key={chartType} className="group bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-purple-50/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative">
                <div className="flex items-center space-x-4 mb-6">
                  {Icon && (
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-2xl shadow-lg">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  )}
                  <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    {chartOption?.name}
                  </h3>
                </div>
                {renderChart(chartType)}
              </div>
            </div>
          );
        })}
      </div>

          {selectedCharts.length === 0 && (
            <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-16 text-center border border-gray-200/50 shadow-lg">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 rounded-3xl blur-xl opacity-20 scale-110"></div>
                <BarChart3 className="relative h-16 w-16 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Visualizations Selected</h3>
              <p className="text-lg text-gray-600 font-medium">Choose chart types above to explore your conversation insights.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}