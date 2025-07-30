'use client';

import { useState } from 'react';
import { AnalyticsData, ChatData, DateRange } from '@/types/chat';
import { ChatAnalytics } from '@/utils/analytics';
import { Plus, X, Copy, BarChart3, Settings } from 'lucide-react';
import DateRangePicker from './DateRangePicker';
import MessagesByDayChart from './charts/MessagesByDayChart';
import MessagesByHourChart from './charts/MessagesByHourChart';
import MessagesByParticipantChart from './charts/MessagesByParticipantChart';
import WordFrequencyChart from './charts/WordFrequencyChart';
import ResponseTimeChart from './charts/ResponseTimeChart';
import ConversationStartersChart from './charts/ConversationStartersChart';
import EmojiAnalysisChart from './charts/EmojiAnalysisChart';

type ChartType = 'messagesByDay' | 'messagesByHour' | 'messagesByParticipant' | 'wordFrequency' | 'responseTime' | 'conversationStarters' | 'emojiAnalysis';

interface ChartConfig {
  id: string;
  type: ChartType;
  dateRange: DateRange;
  analyticsData: AnalyticsData;
  title: string;
}

interface ChartOption {
  id: ChartType;
  name: string;
  description: string;
}

const chartOptions: ChartOption[] = [
  { id: 'messagesByDay', name: 'Messages by Day', description: 'Daily message activity' },
  { id: 'messagesByHour', name: 'Messages by Hour', description: 'Hourly patterns' },
  { id: 'messagesByParticipant', name: 'Messages by Participant', description: 'Participant breakdown' },
  { id: 'responseTime', name: 'Response Time Analysis', description: 'Response speed analysis' },
  { id: 'conversationStarters', name: 'Conversation Starters', description: 'Who starts conversations' },
  { id: 'emojiAnalysis', name: 'Emoji Analysis', description: 'Emoji usage patterns' },
  { id: 'wordFrequency', name: 'Word Frequency', description: 'Most common words' }
];

interface MultiGraphManagerProps {
  chatData: ChatData;
}

export default function MultiGraphManager({ chatData }: MultiGraphManagerProps) {
  const [chartConfigs, setChartConfigs] = useState<ChartConfig[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedChartType, setSelectedChartType] = useState<ChartType>('messagesByParticipant');
  
  const dateRangePresets = ChatAnalytics.getDateRangePresets(chatData);

  const addChart = (type: ChartType, dateRange: DateRange) => {
    const analyticsData = ChatAnalytics.analyzeChat(chatData, dateRange);
    const chartOption = chartOptions.find(opt => opt.id === type);
    
    const newConfig: ChartConfig = {
      id: Date.now().toString(),
      type,
      dateRange,
      analyticsData,
      title: `${chartOption?.name} - ${dateRange.label}`
    };
    
    setChartConfigs(prev => [...prev, newConfig]);
    setShowAddDialog(false);
  };

  const removeChart = (id: string) => {
    setChartConfigs(prev => prev.filter(config => config.id !== id));
  };

  const duplicateChart = (config: ChartConfig) => {
    const newConfig: ChartConfig = {
      ...config,
      id: Date.now().toString(),
      title: `${config.title} (Copy)`
    };
    setChartConfigs(prev => [...prev, newConfig]);
  };

  const updateChartDateRange = (id: string, newDateRange: DateRange) => {
    setChartConfigs(prev => prev.map(config => {
      if (config.id === id) {
        const analyticsData = ChatAnalytics.analyzeChat(chatData, newDateRange);
        const chartOption = chartOptions.find(opt => opt.id === config.type);
        return {
          ...config,
          dateRange: newDateRange,
          analyticsData,
          title: `${chartOption?.name} - ${newDateRange.label}`
        };
      }
      return config;
    }));
  };

  const renderChart = (config: ChartConfig) => {
    const { type, analyticsData } = config;
    
    switch (type) {
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Multi-Graph Comparison
          </h2>
          <p className="text-gray-600 font-medium mt-1">
            Compare insights across different time periods
          </p>
        </div>
        
        <button
          onClick={() => setShowAddDialog(true)}
          className="group flex items-center space-x-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-2 transition-all duration-300"
        >
          <Plus className="h-5 w-5" />
          <span className="font-semibold">Add Chart</span>
        </button>
      </div>

      {/* Charts Grid */}
      {chartConfigs.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {chartConfigs.map((config) => (
            <div key={config.id} className="group bg-white/60 backdrop-blur-xl rounded-3xl border border-gray-200/50 shadow-lg hover:shadow-2xl transition-all duration-500">
              {/* Chart Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
                <div className="flex-1">
                  <h3 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    {config.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {config.analyticsData.filteredMessageCount.toLocaleString()} messages
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <DateRangePicker
                    selectedRange={config.dateRange}
                    presets={dateRangePresets}
                    onRangeChange={(range) => updateChartDateRange(config.id, range)}
                  />
                  
                  <button
                    onClick={() => duplicateChart(config)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                    title="Duplicate chart"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => removeChart(config.id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                    title="Remove chart"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {/* Chart Content */}
              <div className="p-6">
                {renderChart(config)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {chartConfigs.length === 0 && (
        <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-16 text-center border border-gray-200/50 shadow-lg">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 rounded-3xl blur-xl opacity-20 scale-110"></div>
            <BarChart3 className="relative h-16 w-16 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No Comparison Charts</h3>
          <p className="text-lg text-gray-600 font-medium mb-6">
            Create multiple charts to compare insights across different time periods.
          </p>
          <button
            onClick={() => setShowAddDialog(true)}
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-2 transition-all duration-300"
          >
            <Plus className="h-5 w-5" />
            <span className="font-semibold">Add Your First Chart</span>
          </button>
        </div>
      )}

      {/* Add Chart Dialog */}
      {showAddDialog && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => setShowAddDialog(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 max-w-2xl w-full border border-gray-200/50 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-2xl">
                    <Settings className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Add New Chart
                  </h3>
                </div>
                <button
                  onClick={() => setShowAddDialog(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Select Chart Type
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {chartOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setSelectedChartType(option.id)}
                        className={`p-4 text-left rounded-2xl border-2 transition-all duration-200 ${
                          selectedChartType === option.id
                            ? 'border-blue-400/50 bg-gradient-to-br from-blue-50/80 to-purple-50/80'
                            : 'border-gray-200/50 bg-white/40 hover:border-blue-300/50'
                        }`}
                      >
                        <div className="font-semibold text-gray-900">{option.name}</div>
                        <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Select Time Range
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {dateRangePresets.map((preset) => (
                      <button
                        key={preset.label}
                        onClick={() => addChart(selectedChartType, preset)}
                        className="p-4 text-left rounded-2xl border-2 border-gray-200/50 bg-white/40 hover:border-blue-300/50 hover:bg-gradient-to-br hover:from-blue-50/40 hover:to-purple-50/40 transition-all duration-200"
                      >
                        <div className="font-semibold text-gray-900">{preset.label}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          {preset.start.toLocaleDateString()} - {preset.end.toLocaleDateString()}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}