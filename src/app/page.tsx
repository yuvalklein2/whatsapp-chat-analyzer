'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import Dashboard from '@/components/Dashboard';
import FormatHelper from '@/components/FormatHelper';
import { WhatsAppParser } from '@/utils/whatsappParser';
import { ChatAnalytics } from '@/utils/analytics';
import { ChatData, AnalyticsData, DateRange } from '@/types/chat';
import { MessageSquare, BarChart3, Timer, Users, Zap } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 sm:py-6">
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <div className="bg-blue-600 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-2xl font-semibold text-gray-900 truncate">
                  WhatsApp Analyzer
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden xs:block">Insights from your conversations</p>
              </div>
            </div>
            {chatData && (
              <button
                onClick={handleReset}
                className="px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors whitespace-nowrap ml-3"
              >
                <span className="hidden sm:inline">New Analysis</span>
                <span className="sm:hidden">New</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {!chatData ? (
          <div className="space-y-6 sm:space-y-8">
            <div className="text-center px-4">
              <BarChart3 className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-3 sm:mb-4" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 leading-tight">
                Analyze Your WhatsApp Conversations
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Upload your chat export to discover insights, patterns, and statistics from your conversations.
              </p>
            </div>
            
            <FileUpload onFileUpload={handleFileUpload} isLoading={isLoading} />
            
            <FormatHelper />
            
            {error && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-red-800 mb-2">Upload Error</h3>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}
            
            <div className="text-center px-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">What you&apos;ll discover</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
                <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200">
                  <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mx-auto mb-2 sm:mb-3" />
                  <h4 className="font-medium text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Interactive Charts</h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Timeline analysis, response times, and conversation patterns</p>
                </div>
                <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200">
                  <Timer className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 mx-auto mb-2 sm:mb-3" />
                  <h4 className="font-medium text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Response Analytics</h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Understand how quickly people respond to messages</p>
                </div>
                <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200">
                  <Users className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 mx-auto mb-2 sm:mb-3" />
                  <h4 className="font-medium text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Privacy Focused</h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">All processing happens locally in your browser</p>
                </div>
                <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200">
                  <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600 mx-auto mb-2 sm:mb-3" />
                  <h4 className="font-medium text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Easy to Use</h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Just drag and drop your WhatsApp export file</p>
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
