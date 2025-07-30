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
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col gap-6">
        <div className="text-center sm:text-left space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent leading-tight">
            Multi-Graph Comparison
          </h2>
          <p className="text-base sm:text-lg text-gray-600 font-medium">
            Compare insights across different time periods with interactive charts
          </p>
          
          {chartConfigs.length > 0 && (
            <div className="flex justify-center sm:justify-start">
              <div className="flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-full">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-blue-700 font-medium">{chartConfigs.length} active charts</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-center sm:justify-start">
          <button
            onClick={() => setShowAddDialog(true)}
            className="group relative overflow-hidden flex items-center justify-center space-x-3 px-6 sm:px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-2 transition-all duration-300 w-full sm:w-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Plus className="relative h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
            <span className="relative font-semibold">Add Chart</span>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300 -z-10"></div>
          </button>
        </div>
      </div>

      {/* Charts Grid */}
      {chartConfigs.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6 lg:gap-8">
          {chartConfigs.map((config, index) => (
            <div 
              key={config.id}
              className="group relative bg-white/70 backdrop-blur-xl rounded-3xl border border-gray-200/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1"
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/30 to-pink-50/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              {/* Glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-3xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-500 -z-10"></div>
              
              {/* Chart Header */}
              <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 border-b border-gray-200/50 group-hover:border-gray-300/50 transition-colors duration-300 gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg flex-shrink-0"></div>
                    <h3 className="text-base sm:text-lg font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent leading-tight">
                      {config.title}
                    </h3>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <p className="text-sm text-gray-600 font-medium">
                      {config.analyticsData.filteredMessageCount.toLocaleString()} messages
                    </p>
                    <div className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full w-fit">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-700 font-medium">Live</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end space-x-2">
                  <div className="flex-1 sm:flex-none">
                    <DateRangePicker
                      selectedRange={config.dateRange}
                      presets={dateRangePresets}
                      onRangeChange={(range) => updateChartDateRange(config.id, range)}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => duplicateChart(config)}
                      className="group/btn p-2 sm:p-2.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 hover:scale-110"
                      title="Duplicate chart"
                    >
                      <Copy className="h-4 w-4 group-hover/btn:scale-110 transition-transform duration-200" />
                    </button>
                    
                    <button
                      onClick={() => removeChart(config.id)}
                      className="group/btn p-2 sm:p-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 hover:scale-110"
                      title="Remove chart"
                    >
                      <X className="h-4 w-4 group-hover/btn:scale-110 transition-transform duration-200" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Chart Content */}
              <div className="relative p-4 sm:p-6">
                <div className="transform transition-all duration-300 group-hover:scale-[1.01]">
                  {renderChart(config)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {chartConfigs.length === 0 && (
        <div className="relative bg-white/50 backdrop-blur-xl rounded-3xl p-8 sm:p-16 lg:p-20 text-center border border-gray-200/50 shadow-lg overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-purple-50/20 to-pink-50/20"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 left-10 w-4 h-4 bg-blue-200 rounded-full animate-ping opacity-20"></div>
            <div className="absolute top-20 right-20 w-3 h-3 bg-purple-200 rounded-full animate-ping opacity-30" style={{animationDelay: '1s'}}></div>
            <div className="absolute bottom-20 left-20 w-5 h-5 bg-pink-200 rounded-full animate-ping opacity-25" style={{animationDelay: '2s'}}></div>
          </div>
          
          <div className="relative">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-30 scale-125 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-blue-100 to-purple-100 p-6 rounded-3xl">
                <BarChart3 className="h-20 w-20 text-gray-500" />
              </div>
            </div>
            
            <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4 leading-tight">
              No Comparison Charts Yet
            </h3>
            <p className="text-lg sm:text-xl text-gray-600 font-medium mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
              Create multiple interactive charts to compare insights across different time periods. 
              Perfect for analyzing conversation trends and patterns over time.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <div className="flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-full">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-blue-700 font-medium">Side-by-side comparison</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-purple-50 rounded-full">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-purple-700 font-medium">Different time ranges</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-pink-50 rounded-full">
                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                <span className="text-sm text-pink-700 font-medium">Interactive controls</span>
              </div>
            </div>
            
            <button
              onClick={() => setShowAddDialog(true)}
              className="group relative inline-flex items-center space-x-3 px-10 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-2 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Plus className="relative h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
              <span className="relative text-lg font-semibold">Create Your First Comparison</span>
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-pink-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300 -z-10"></div>
            </button>
          </div>
        </div>
      )}

      {/* Add Chart Dialog */}
      {showAddDialog && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-300" 
            onClick={() => setShowAddDialog(false)} 
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in zoom-in-95 duration-300">
            <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl p-8 max-w-3xl w-full border border-gray-200/50 shadow-2xl overflow-hidden">
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/30 to-pink-50/30"></div>
              
              <div className="relative">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-30"></div>
                      <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-2xl shadow-lg">
                        <Settings className="h-7 w-7 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                        Create New Chart
                      </h3>
                      <p className="text-gray-600 font-medium mt-1">Choose chart type and time range for comparison</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAddDialog(false)}
                    className="group p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100/80 rounded-xl transition-all duration-300 hover:scale-110"
                  >
                    <X className="h-6 w-6 group-hover:rotate-90 transition-transform duration-200" />
                  </button>
                </div>

                <div className="space-y-8">
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <label className="text-lg font-bold text-gray-800">
                        Select Chart Type
                      </label>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {chartOptions.map((option, index) => (
                        <button
                          key={option.id}
                          onClick={() => setSelectedChartType(option.id)}
                          className={`group relative p-5 text-left rounded-2xl border-2 transition-all duration-300 hover:scale-[1.02] ${
                            selectedChartType === option.id
                              ? 'border-blue-400/50 bg-gradient-to-br from-blue-50/80 to-purple-50/80 shadow-lg'
                              : 'border-gray-200/50 bg-white/60 hover:border-blue-300/50 hover:bg-gradient-to-br hover:from-blue-50/40 hover:to-purple-50/40 hover:shadow-md'
                          }`}
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          {selectedChartType === option.id && (
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur opacity-20 -z-10"></div>
                          )}
                          <div className="flex items-center space-x-3 mb-2">
                            <div className={`w-3 h-3 rounded-full transition-all duration-200 ${
                              selectedChartType === option.id 
                                ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                                : 'bg-gray-300 group-hover:bg-blue-400'
                            }`}></div>
                            <div className="font-bold text-gray-900">{option.name}</div>
                          </div>
                          <div className="text-sm text-gray-600 leading-relaxed">{option.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <label className="text-lg font-bold text-gray-800">
                        Select Time Range
                      </label>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {dateRangePresets.map((preset, index) => (
                        <button
                          key={preset.label}
                          onClick={() => addChart(selectedChartType, preset)}
                          className="group relative p-5 text-left rounded-2xl border-2 border-gray-200/50 bg-white/60 hover:border-purple-300/50 hover:bg-gradient-to-br hover:from-purple-50/40 hover:to-pink-50/40 hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur opacity-0 group-hover:opacity-10 transition-opacity duration-300 -z-10"></div>
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full group-hover:scale-110 transition-transform duration-200"></div>
                            <div className="font-bold text-gray-900">{preset.label}</div>
                          </div>
                          <div className="text-sm text-gray-600 leading-relaxed">
                            {preset.start.toLocaleDateString()} - {preset.end.toLocaleDateString()}
                          </div>
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Plus className="h-4 w-4 text-purple-500" />
                          </div>
                        </button>
                      ))}
                    </div>
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