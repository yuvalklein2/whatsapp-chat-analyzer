'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import Dashboard from '@/components/Dashboard';
import FormatHelper from '@/components/FormatHelper';
import { WhatsAppParser } from '@/utils/whatsappParser';
import { ChatAnalytics } from '@/utils/analytics';
import { ChatData, AnalyticsData, DateRange } from '@/types/chat';
import { BarChart3, Timer, Users, Zap } from 'lucide-react';

export default function HomePage() {
  const [chatData, setChatData] = useState<ChatData | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (content: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const parsedData = WhatsAppParser.parseChat(content);
      
      if (parsedData.messages.length === 0) {
        throw new Error('No messages found in the uploaded file. Please check that you uploaded a valid WhatsApp chat export (.txt or .zip file).');
      }
      
      // Set default date range to last month
      const defaultRange = ChatAnalytics.getDefaultDateRange(parsedData);
      const analytics = ChatAnalytics.analyzeChat(parsedData, defaultRange);
      
      setChatData(parsedData);
      setSelectedDateRange(defaultRange);
      setAnalyticsData(analytics);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while processing the file.');
      setChatData(null);
      setAnalyticsData(null);
      setSelectedDateRange(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateRangeChange = (newRange: DateRange) => {
    if (chatData) {
      const analytics = ChatAnalytics.analyzeChat(chatData, newRange);
      setSelectedDateRange(newRange);
      setAnalyticsData(analytics);
    }
  };

  const handleReset = () => {
    setChatData(null);
    setAnalyticsData(null);
    setSelectedDateRange(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 border-b border-slate-700 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 sm:py-6">
            <div className="flex items-center space-x-4 min-w-0 flex-1">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-2 sm:p-2.5 rounded-xl flex-shrink-0 shadow-lg">
                <BarChart3 className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl font-bold text-white truncate">
                  Communication Analytics Platform
                </h1>
                <p className="text-sm text-slate-300 hidden sm:block">Executive Dashboard & Team Performance Insights</p>
              </div>
            </div>
            {chatData && (
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm font-medium text-white bg-slate-700 border border-slate-600 rounded-lg hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 whitespace-nowrap ml-4"
              >
                <span className="hidden sm:inline">New Analysis</span>
                <span className="sm:hidden">Reset</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {!chatData ? (
          <div className="space-y-8 sm:space-y-12">
            <div className="text-center px-4 bg-white rounded-2xl shadow-xl p-8 sm:p-12 border border-slate-200">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 rounded-2xl w-fit mx-auto mb-6 shadow-lg">
                <BarChart3 className="h-12 w-12 sm:h-16 sm:w-16 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 leading-tight">
                Team Communication Analytics
              </h2>
              <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
                Transform your team communications into actionable business insights. Analyze engagement patterns, response efficiency, and collaboration dynamics.
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Enterprise-Grade Security</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Real-time Analytics</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Executive Reporting</span>
                </div>
              </div>
            </div>
            
            <FileUpload onFileUpload={handleFileUpload} isLoading={isLoading} />
            
            <FormatHelper />
            
            {error && (
              <div className="max-w-4xl mx-auto">
                <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 shadow-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">!</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-red-800 mb-1">Analysis Error</h3>
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-slate-900 rounded-2xl p-8 sm:p-12 shadow-2xl">
              <div className="text-center mb-8">
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">Executive Analytics Suite</h3>
                <p className="text-slate-300 text-lg">Comprehensive insights for strategic decision-making</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-blue-500 transition-colors">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-3 rounded-lg w-fit mb-4">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-white mb-2">Performance Metrics</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">Advanced analytics with interactive visualizations and trend analysis</p>
                </div>
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-purple-500 transition-colors">
                  <div className="bg-gradient-to-r from-purple-600 to-violet-700 p-3 rounded-lg w-fit mb-4">
                    <Timer className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-white mb-2">Efficiency Analysis</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">Response time metrics and team productivity insights</p>
                </div>
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-green-500 transition-colors">
                  <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-3 rounded-lg w-fit mb-4">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-white mb-2">Team Dynamics</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">Collaboration patterns and engagement analysis</p>
                </div>
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-orange-500 transition-colors">
                  <div className="bg-gradient-to-r from-orange-600 to-red-700 p-3 rounded-lg w-fit mb-4">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-white mb-2">Strategic Insights</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">Executive summaries and actionable business intelligence</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          analyticsData && selectedDateRange && chatData && (
            <Dashboard 
              analyticsData={analyticsData} 
              chatData={chatData}
              selectedDateRange={selectedDateRange}
              onDateRangeChange={handleDateRangeChange}
            />
          )
        )}
      </main>
    </div>
  );
}
