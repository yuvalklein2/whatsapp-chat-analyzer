'use client';

import { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';
import { InsightsGenerator } from '@/utils/insightsGenerator';

interface ChartExplanationProps {
  chartType: string;
  className?: string;
}

export default function ChartExplanation({ chartType, className = '' }: ChartExplanationProps) {
  const [showExplanation, setShowExplanation] = useState(false);
  const explanation = InsightsGenerator.getChartExplanation(chartType);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setShowExplanation(!showExplanation)}
        className="group p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110"
        title="What does this chart mean?"
      >
        <HelpCircle className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
      </button>

      {showExplanation && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" 
            onClick={() => setShowExplanation(false)}
          />
          
          {/* Explanation Modal */}
          <div className="absolute top-full mt-2 right-0 z-50 w-80 sm:w-96 bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="relative">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200/50 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                    <HelpCircle className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm">
                    {explanation.title}
                  </h3>
                </div>
                <button
                  onClick={() => setShowExplanation(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">What this shows:</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {explanation.description}
                  </p>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-3 border border-yellow-200/50">
                  <h4 className="text-sm font-semibold text-orange-800 mb-1 flex items-center space-x-1">
                    <span>💡</span>
                    <span>How to interpret:</span>
                  </h4>
                  <p className="text-sm text-orange-700 leading-relaxed">
                    {explanation.tip}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}