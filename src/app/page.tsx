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
                  WhatsApp Analytics
                </h1>
                <p className="text-sm text-slate-300 hidden sm:block">Transform chats into business insights</p>
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
                Transform WhatsApp Chats into Business Intelligence
              </h2>
              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-12">
                Get actionable insights from your team communications in minutes. No setup required.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-8">
                <div className="flex flex-col items-center">
                  <div className="bg-blue-100 p-4 rounded-full mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">1. Upload Your Chat</h3>
                  <p className="text-sm text-slate-600 text-center">Export your WhatsApp chat and upload the .txt or .zip file</p>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="bg-green-100 p-4 rounded-full mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">2. Instant Analysis</h3>
                  <p className="text-sm text-slate-600 text-center">Our AI processes your data and generates comprehensive insights</p>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="bg-purple-100 p-4 rounded-full mb-4">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">3. Get Insights</h3>
                  <p className="text-sm text-slate-600 text-center">View executive dashboards and actionable recommendations</p>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>100% Private & Secure</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>No Registration Required</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Instant Results</span>
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
            
            <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-xl border border-slate-200">
              <div className="text-center mb-12">
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Trusted by Teams Worldwide</h3>
                <p className="text-slate-600 text-lg max-w-2xl mx-auto">Join thousands of managers and analysts who use our platform to optimize team performance</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
                  <div className="text-slate-600">Chats Analyzed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
                  <div className="text-slate-600">Teams Optimized</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">95%</div>
                  <div className="text-slate-600">Satisfaction Rate</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 p-2 rounded-lg mr-3">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">HR Directors</h4>
                      <p className="text-sm text-slate-600">Team Performance Analysis</p>
                    </div>
                  </div>
                  <p className="text-slate-700 text-sm italic">&ldquo;Reduced response time by 40% after identifying communication bottlenecks in our support team.&rdquo;</p>
                </div>
                
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                  <div className="flex items-center mb-4">
                    <div className="bg-green-100 p-2 rounded-lg mr-3">
                      <BarChart3 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Project Managers</h4>
                      <p className="text-sm text-slate-600">Sprint Retrospectives</p>
                    </div>
                  </div>
                  <p className="text-slate-700 text-sm italic">&ldquo;Perfect for quarterly reviews. Shows exactly where team collaboration needs improvement.&rdquo;</p>
                </div>
                
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                  <div className="flex items-center mb-4">
                    <div className="bg-purple-100 p-2 rounded-lg mr-3">
                      <Timer className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Operations Teams</h4>
                      <p className="text-sm text-slate-600">Efficiency Optimization</p>
                    </div>
                  </div>
                  <p className="text-slate-700 text-sm italic">&ldquo;Data-driven insights helped us identify peak communication hours and adjust schedules accordingly.&rdquo;</p>
                </div>
                
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                  <div className="flex items-center mb-4">
                    <div className="bg-orange-100 p-2 rounded-lg mr-3">
                      <Zap className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Consultants</h4>
                      <p className="text-sm text-slate-600">Client Reporting</p>
                    </div>
                  </div>
                  <p className="text-slate-700 text-sm italic">&ldquo;Professional reports that clients love. Saves hours of manual analysis work.&rdquo;</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 sm:p-12 shadow-2xl text-white">
              <div className="text-center mb-8">
                <h3 className="text-2xl sm:text-3xl font-bold mb-4">What You&rsquo;ll Discover</h3>
                <p className="text-blue-100 text-lg max-w-2xl mx-auto">Comprehensive analytics suite designed for business professionals</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="bg-white/10 backdrop-blur p-4 rounded-xl mb-4 w-fit mx-auto">
                    <BarChart3 className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-semibold mb-2">Response Patterns</h4>
                  <p className="text-blue-100 text-sm">Peak activity hours and team availability insights</p>
                </div>
                <div className="text-center">
                  <div className="bg-white/10 backdrop-blur p-4 rounded-xl mb-4 w-fit mx-auto">
                    <Timer className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-semibold mb-2">Efficiency Metrics</h4>
                  <p className="text-blue-100 text-sm">Average response times and productivity trends</p>
                </div>
                <div className="text-center">
                  <div className="bg-white/10 backdrop-blur p-4 rounded-xl mb-4 w-fit mx-auto">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-semibold mb-2">Team Dynamics</h4>
                  <p className="text-blue-100 text-sm">Collaboration patterns and engagement levels</p>
                </div>
                <div className="text-center">
                  <div className="bg-white/10 backdrop-blur p-4 rounded-xl mb-4 w-fit mx-auto">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-semibold mb-2">Executive Reports</h4>
                  <p className="text-blue-100 text-sm">Ready-to-present insights and recommendations</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-xl border border-slate-200">
              <div className="text-center mb-12">
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h3>
                <p className="text-slate-600 text-lg max-w-2xl mx-auto">Everything you need to know about WhatsApp chat analysis</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Is my data secure and private?</h4>
                  <p className="text-slate-600 text-sm mb-6">Yes, absolutely. All processing happens locally in your browser. Your chat data never leaves your device and isn&rsquo;t stored on our servers.</p>
                  
                  <h4 className="font-semibold text-slate-900 mb-3">What file formats are supported?</h4>
                  <p className="text-slate-600 text-sm mb-6">We support standard WhatsApp export files (.txt) and ZIP archives containing multiple chat exports. Both individual and group chats are supported.</p>
                  
                  <h4 className="font-semibold text-slate-900 mb-3">How large can my chat file be?</h4>
                  <p className="text-slate-600 text-sm mb-6">Our platform can handle chats with hundreds of thousands of messages. Processing time depends on file size, typically completing within seconds.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Do I need to create an account?</h4>
                  <p className="text-slate-600 text-sm mb-6">No registration required. Simply upload your chat file and get instant insights. No credit card, email, or personal information needed.</p>
                  
                  <h4 className="font-semibold text-slate-900 mb-3">Can I analyze multiple chats together?</h4>
                  <p className="text-slate-600 text-sm mb-6">Yes! Upload a ZIP file containing multiple chat exports for comparative analysis across different teams or time periods.</p>
                  
                  <h4 className="font-semibold text-slate-900 mb-3">What insights will I get?</h4>
                  <p className="text-slate-600 text-sm mb-6">Response patterns, peak activity times, engagement metrics, sentiment analysis, and executive-ready reports with actionable recommendations.</p>
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
