'use client';

import { AnalyticsData, ChatData } from '@/types/chat';
import { InsightsGenerator, Insight } from '@/utils/insightsGenerator';
import { Lightbulb, TrendingUp, Clock, Users, Zap } from 'lucide-react';
import { useState } from 'react';

interface InsightsPanelProps {
  analyticsData: AnalyticsData;
  chatData: ChatData;
}

const categoryIcons = {
  activity: TrendingUp,
  social: Users,
  behavior: Zap,
  time: Clock
};

const categoryColors = {
  activity: 'from-blue-500 to-blue-600',
  social: 'from-green-500 to-green-600', 
  behavior: 'from-purple-500 to-purple-600',
  time: 'from-orange-500 to-orange-600'
};

const categoryBgColors = {
  activity: 'from-blue-50 to-blue-100',
  social: 'from-green-50 to-green-100',
  behavior: 'from-purple-50 to-purple-100', 
  time: 'from-orange-50 to-orange-100'
};

export default function InsightsPanel({ analyticsData, chatData }: InsightsPanelProps) {
  const [insights] = useState<Insight[]>(() => 
    InsightsGenerator.generateInsights(analyticsData, chatData)
  );

  const highPriorityInsights = insights.filter(i => i.priority === 'high');
  const otherInsights = insights.filter(i => i.priority !== 'high');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start space-x-3 mb-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl blur opacity-30"></div>
            <div className="relative bg-gradient-to-r from-yellow-400 to-orange-500 p-3 rounded-2xl shadow-lg">
              <Lightbulb className="h-6 w-6 text-white" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 via-orange-800 to-yellow-800 bg-clip-text text-transparent">
            Smart Insights
          </h2>
        </div>
        <p className="text-gray-600 font-medium">
          Discover interesting patterns and trends in your conversation
        </p>
      </div>

      {/* High Priority Insights */}
      {highPriorityInsights.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center space-x-2">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            <span>Key Highlights</span>
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {highPriorityInsights.map((insight, index) => (
              <div
                key={insight.id}
                className="group relative bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${categoryBgColors[insight.category]}/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                {/* Insight content */}
                <div className="relative">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className={`bg-gradient-to-r ${categoryColors[insight.category]} p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <span className="text-2xl" role="img">{insight.icon}</span>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
                        {insight.title}
                      </h4>
                      <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                        {insight.description}
                      </p>
                      
                      {insight.value && (
                        <div className="mt-3 inline-flex items-center px-3 py-1 bg-white/80 rounded-full text-sm font-semibold text-gray-700">
                          {insight.value}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Category indicator */}
                <div className="absolute top-3 right-3">
                  <div className={`bg-gradient-to-r ${categoryColors[insight.category]} p-1.5 rounded-lg opacity-60 group-hover:opacity-100 transition-opacity duration-300`}>
                    {(() => {
                      const Icon = categoryIcons[insight.category];
                      return <Icon className="h-3 w-3 text-white" />;
                    })()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Other Insights */}
      {otherInsights.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center space-x-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span>Additional Insights</span>
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherInsights.map((insight, index) => (
              <div
                key={insight.id}
                className="group relative bg-white/60 backdrop-blur-xl rounded-xl p-4 border border-gray-200/50 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                style={{ animationDelay: `${(highPriorityInsights.length + index) * 100}ms` }}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className={`bg-gradient-to-r ${categoryColors[insight.category]} p-2 rounded-lg shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-lg" role="img">{insight.icon}</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-gray-900 mb-1 leading-tight">
                      {insight.title}
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {insight.description}
                    </p>
                    
                    {insight.value && (
                      <div className="mt-2 inline-flex items-center px-2 py-0.5 bg-white/60 rounded-full text-xs font-medium text-gray-600">
                        {insight.value}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fun fact footer */}
      <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-6 border border-gray-200/50">
        <div className="text-center">
          <p className="text-sm text-gray-600 leading-relaxed">
            <span className="font-semibold">💡 Pro Tip:</span> These insights are generated by analyzing your conversation patterns. 
            Try different time ranges to see how your communication style changes over time!
          </p>
        </div>
      </div>
    </div>
  );
}