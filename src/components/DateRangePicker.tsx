'use client';

import { useState } from 'react';
import { DateRange } from '@/types/chat';
import { Calendar, ChevronDown, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface DateRangePickerProps {
  selectedRange: DateRange;
  presets: DateRange[];
  onRangeChange: (range: DateRange) => void;
}

export default function DateRangePicker({ selectedRange, presets, onRangeChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handlePresetSelect = (preset: DateRange) => {
    onRangeChange(preset);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors w-full sm:w-auto touch-manipulation"
      >
        <div className="bg-blue-600 p-1 rounded-lg flex-shrink-0">
          <Calendar className="h-3 w-3 text-white" />
        </div>
        
        <div className="flex-1 text-left min-w-0">
          <p className="text-xs font-medium text-gray-600">Time Range</p>
          <p className="text-sm font-semibold text-gray-900 truncate">
            {selectedRange.label}
          </p>
        </div>
        
        <ChevronDown className={`h-3 w-3 text-gray-500 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full mt-2 left-0 right-0 sm:right-0 sm:left-auto z-50 sm:min-w-80 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
            <div className="p-3 sm:p-4">
              <div className="flex items-center space-x-2 mb-3 sm:mb-4 pb-2 sm:pb-3 border-b border-gray-200">
                <Clock className="h-4 w-4 text-gray-500" />
                <h3 className="text-sm font-semibold text-gray-700">Select Time Range</h3>
              </div>
              
              <div className="space-y-1 sm:space-y-2">
                {presets.map((preset) => {
                  const isSelected = preset.label === selectedRange.label;
                  
                  return (
                    <button
                      key={preset.label}
                      onClick={() => handlePresetSelect(preset)}
                      className={`w-full flex items-center justify-between p-2 sm:p-3 rounded-lg transition-colors text-left touch-manipulation ${
                        isSelected
                          ? 'bg-blue-50 border border-blue-200'
                          : 'bg-white hover:bg-blue-50 border border-transparent hover:border-blue-200'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0 ${
                            isSelected ? 'bg-blue-600' : 'bg-gray-300'
                          }`} />
                          <span className={`font-medium text-xs sm:text-sm ${
                            isSelected ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {preset.label}
                          </span>
                        </div>
                        <div className="ml-4 sm:ml-6 mt-1 text-xs text-gray-500">
                          {format(preset.start, 'MMM d, yyyy')} - {format(preset.end, 'MMM d, yyyy')}
                        </div>
                      </div>
                      
                      {isSelected && (
                        <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white rounded-full" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              
              <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200">
                <div className="text-xs text-gray-500 text-center">
                  Showing {selectedRange.label.toLowerCase()} data
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}