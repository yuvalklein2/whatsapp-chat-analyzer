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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {showMultiGraph ? 'Multi-Graph Comparison' : 'Analytics Dashboard'}
          </h1>
          <p className="text-gray-600 mt-1">
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
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <Grid3X3 className="h-4 w-4" />
              <span className="font-medium">Compare Time Periods</span>
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
          
          <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Choose Your Charts
          </h2>
          <p className="text-gray-600">Select the insights you want to explore</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
          {chartOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedCharts.includes(option.id);
            
            return (
              <button
                key={option.id}
                onClick={() => toggleChart(option.id)}
                className={`
                  p-4 rounded-lg border-2 transition-colors text-left min-h-[100px] flex flex-col justify-between
                  ${isSelected 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                  }
                `}
              >
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`p-2 rounded-lg ${
                      isSelected ? 'bg-blue-600' : 'bg-gray-100'
                    }`}>
                      <Icon className={`h-4 w-4 ${
                        isSelected ? 'text-white' : 'text-gray-500'
                      }`} />
                    </div>
                    <span className={`text-sm font-medium ${
                      isSelected ? 'text-gray-900' : 'text-gray-700'
                    }`}>
                      {option.name}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">{option.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {selectedCharts.map((chartType) => {
          const chartOption = chartOptions.find(opt => opt.id === chartType);
          const Icon = chartOption?.icon;
          
          return (
            <div key={chartType} className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {Icon && (
                    <div className="bg-blue-600 p-2 rounded-lg">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-gray-900">
                    {chartOption?.name}
                  </h3>
                </div>
                <ChartExplanation chartType={chartType} />
              </div>
              {renderChart(chartType)}
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