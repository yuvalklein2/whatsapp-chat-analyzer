'use client';

import { AnalyticsData, ChatData } from '@/types/chat';
import { InsightsGenerator } from '@/utils/insightsGenerator';
import { Star, TrendingUp, Award, Clock } from 'lucide-react';
import { useState } from 'react';

interface KeyTakeawaysProps {
  analyticsData: AnalyticsData;
  chatData: ChatData;
}

export default function KeyTakeaways({ analyticsData, chatData }: KeyTakeawaysProps) {
  const [insights] = useState(() => 
    InsightsGenerator.generateInsights(analyticsData, chatData)
  );

  // Get the top 3 most interesting insights
  const keyTakeaways = insights.slice(0, 3);

  const generateSummary = () => {
    const totalMessages = analyticsData.filteredMessageCount;
    const participants = analyticsData.messagesByParticipant.length;
    const avgPerDay = Math.round(totalMessages / analyticsData.messagesByDay.length);
    const topParticipant = analyticsData.messagesByParticipant[0];
    
    let summary = `This conversation contains ${totalMessages.toLocaleString()} messages `;
    
    if (participants === 2) {
      summary += 'between 2 people';
    } else {
      summary += `among ${participants} participants`;
    }
    
    summary += ` with an average of ${avgPerDay} messages per day. `;
    
    if (topParticipant) {
      const percentage = Math.round((topParticipant.count / totalMessages) * 100);
      summary += `${topParticipant.name} is the most active contributor at ${percentage}% of messages.`;
    }

    return summary;
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-3xl p-6 sm:p-8 border border-amber-200/50 shadow-lg">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center space-x-3 mb-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl blur opacity-30"></div>
            <div className="relative bg-gradient-to-r from-amber-400 to-orange-500 p-3 rounded-2xl shadow-lg">
              <Star className="h-6 w-6 text-white" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-800 via-orange-800 to-yellow-800 bg-clip-text text-transparent">
            Key Takeaways
          </h2>
        </div>
        <p className="text-amber-800 font-medium text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          {generateSummary()}
        </p>
      </div>

      {/* Top Insights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {keyTakeaways.map((insight, index) => {
          const icons = [Award, TrendingUp, Clock];
          const IconComponent = icons[index] || Star;
          
          return (
            <div
              key={insight.id}
              className="group relative bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-amber-200/50 hover:bg-white/80 transition-all duration-300 hover:scale-[1.02]"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="text-center space-y-3">
                <div className="flex justify-center">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl" role="img">{insight.icon}</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-bold text-amber-900 text-sm sm:text-base leading-tight mb-2">
                    {insight.title}
                  </h3>
                  <p className="text-amber-700 text-xs sm:text-sm leading-relaxed">
                    {insight.description.split('.')[0]}. {/* Show first sentence */}
                  </p>
                  
                  {insight.value && (
                    <div className="mt-2 inline-flex items-center px-3 py-1 bg-amber-100 rounded-full text-xs font-semibold text-amber-800">
                      {insight.value}
                    </div>
                  )}
                </div>
              </div>

              {/* Priority indicator */}
              <div className="absolute top-2 right-2">
                <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-1 rounded-lg opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                  <IconComponent className="h-3 w-3 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Call to action */}
      <div className="text-center bg-white/40 rounded-2xl p-4 border border-amber-200/30">
        <p className="text-amber-800 text-sm leading-relaxed">
          <span className="font-semibold">🎯 Want to dive deeper?</span> Explore the detailed charts below to uncover more patterns and insights about your conversation dynamics.
        </p>
      </div>
    </div>
  );
}