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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <header className="relative backdrop-blur-xl bg-white/70 border-b border-gray-200/50 supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-20"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl shadow-lg">
                  <MessageSquare className="h-7 w-7 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent tracking-tight">
                  WhatsApp Chat Analyzer
                </h1>
                <p className="text-sm text-gray-500 font-medium">Tableau for your conversations</p>
              </div>
            </div>
            {chatData && (
              <button
                onClick={handleReset}
                className="group relative px-6 py-3 bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-lg hover:shadow-xl hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-2 transition-all duration-300 hover:scale-105"
              >
                <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">
                  Analyze New Chat
                </span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!chatData ? (
          <div className="space-y-12">
            <div className="text-center relative">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 rounded-3xl blur-2xl opacity-20 scale-110"></div>
                <BarChart3 className="relative mx-auto h-16 w-16 text-gray-400" />
              </div>
              <h2 className="mt-8 text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent leading-tight">
                Analyze Your WhatsApp
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Conversations
                </span>
              </h2>
              <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
                Transform your chat exports into beautiful, interactive insights. 
                Discover patterns, relationships, and hidden stories in your conversations.
              </p>
            </div>
            
            <FileUpload onFileUpload={handleFileUpload} isLoading={isLoading} />
            
            <FormatHelper />
            
            {error && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Error</h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>{error}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Powerful Features</h3>
                <p className="text-gray-600 font-medium">Everything you need to understand your conversations</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="group relative bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <BarChart3 className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-4">Interactive Charts</h4>
                    <p className="text-gray-600 leading-relaxed">
                      Choose from 7 beautiful chart types: timeline analysis, response times, 
                      emoji patterns, conversation starters, and more. Tableau-style interactivity.
                    </p>
                  </div>
                </div>

                <div className="group relative bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-pink-50/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Timer className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-4">Smart Analytics</h4>
                    <p className="text-gray-600 leading-relaxed">
                      Deep insights into response times, conversation patterns, emoji usage, 
                      word frequency, and relationship dynamics. Discover hidden stories.
                    </p>
                  </div>
                </div>

                <div className="group relative bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-emerald-50/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-4">Privacy First</h4>
                    <p className="text-gray-600 leading-relaxed">
                      All processing happens locally in your browser. Your chat data never leaves 
                      your device. Zero servers, zero data collection. Complete privacy guaranteed.
                    </p>
                  </div>
                </div>

                <div className="group relative bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-red-50/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-4">Effortlessly Simple</h4>
                    <p className="text-gray-600 leading-relaxed">
                      Just drag and drop your WhatsApp export file. No complex setup, 
                      no technical knowledge required. Beautiful insights in seconds.
                    </p>
                  </div>
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
