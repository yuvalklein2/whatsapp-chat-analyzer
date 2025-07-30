'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import Dashboard from '@/components/Dashboard';
import FormatHelper from '@/components/FormatHelper';
import { WhatsAppParser } from '@/utils/whatsappParser';
import { ChatAnalytics } from '@/utils/analytics';
import { ChatData, AnalyticsData } from '@/types/chat';
import { MessageSquare, BarChart3 } from 'lucide-react';

export default function HomePage() {
  const [chatData, setChatData] = useState<ChatData | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (content: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const parsedData = WhatsAppParser.parseChat(content);
      
      if (parsedData.messages.length === 0) {
        throw new Error('No messages found in the uploaded file. Please check that you uploaded a valid WhatsApp chat export.');
      }
      
      const analytics = ChatAnalytics.analyzeChat(parsedData);
      
      setChatData(parsedData);
      setAnalyticsData(analytics);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while processing the file.');
      setChatData(null);
      setAnalyticsData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setChatData(null);
    setAnalyticsData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <MessageSquare className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">WhatsApp Chat Analyzer</h1>
            </div>
            {chatData && (
              <button
                onClick={handleReset}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Analyze New Chat
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!chatData ? (
          <div className="space-y-8">
            <div className="text-center">
              <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                Analyze Your WhatsApp Conversations
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Upload your WhatsApp chat export and get beautiful insights about your conversations. 
                See message patterns, participant activity, popular words, and more with interactive charts.
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
            
            <div className="max-w-4xl mx-auto">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Interactive Charts</h4>
                  <p className="text-gray-600">
                    Choose from multiple chart types to visualize your data: timeline charts, 
                    participant breakdowns, word frequency analysis, and hourly activity patterns.
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Smart Analytics</h4>
                  <p className="text-gray-600">
                    Get detailed insights about your conversations including message frequency, 
                    most active times, conversation participants, and commonly used words.
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Privacy First</h4>
                  <p className="text-gray-600">
                    All processing happens locally in your browser. Your chat data never leaves 
                    your device, ensuring complete privacy and security.
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Easy to Use</h4>
                  <p className="text-gray-600">
                    Simply export your WhatsApp chat as a text file and drag it here. 
                    No technical knowledge required - get insights in seconds.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          analyticsData && (
            <Dashboard analyticsData={analyticsData} chatData={chatData} />
          )
        )}
      </main>
    </div>
  );
}
