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
        className="group relative flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-white to-gray-50/80 border border-gray-200/80 rounded-2xl hover:from-blue-50/80 hover:to-indigo-50/80 hover:border-blue-200/80 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 w-full sm:w-auto touch-manipulation shadow-sm hover:shadow-lg backdrop-blur-sm"
      >
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-xl flex-shrink-0 shadow-sm group-hover:shadow-md group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-300">
          <Calendar className="h-4 w-4 text-white" />
        </div>
        
        <div className="flex-1 text-left min-w-0">
          <p className="text-xs font-semibold text-gray-500 group-hover:text-blue-600 transition-colors duration-300 tracking-wide">Time Range</p>
          <p className="text-sm font-bold text-gray-900 group-hover:text-gray-800 truncate mt-0.5">
            {selectedRange.label}
          </p>
        </div>
        
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100/80 group-hover:bg-blue-100/80 transition-colors duration-300">
          <ChevronDown className={`h-4 w-4 text-gray-500 group-hover:text-blue-600 transition-all duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full mt-3 left-0 right-0 sm:right-0 sm:left-auto z-50 sm:min-w-80 bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2 duration-300">
            <div className="p-4 sm:p-5">
              <div className="flex items-center space-x-3 mb-4 sm:mb-5 pb-3 sm:pb-4 border-b border-gray-200/50">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-xl shadow-sm">
                  <Clock className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-sm font-bold text-gray-800 tracking-wide">Select Time Range</h3>
              </div>
              
              <div className="space-y-1 sm:space-y-2">
                {presets.map((preset) => {
                  const isSelected = preset.label === selectedRange.label;
                  
                  return (
                    <button
                      key={preset.label}
                      onClick={() => handlePresetSelect(preset)}
                      className={`group w-full flex items-center justify-between p-3 sm:p-4 rounded-xl transition-all duration-200 text-left touch-manipulation ${
                        isSelected
                          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 shadow-sm'
                          : 'bg-white hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 border border-transparent hover:border-blue-200/50 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full flex-shrink-0 transition-all duration-200 ${
                            isSelected 
                              ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm' 
                              : 'bg-gray-300 group-hover:bg-blue-400'
                          }`} />
                          <span className={`font-semibold text-sm transition-colors duration-200 ${
                            isSelected ? 'text-gray-900' : 'text-gray-700 group-hover:text-gray-800'
                          }`}>
                            {preset.label}
                          </span>
                        </div>
                        <div className="ml-6 mt-1.5 text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-200">
                          {format(preset.start, 'MMM d, yyyy')} - {format(preset.end, 'MMM d, yyyy')}
                        </div>
                      </div>
                      
                      {isSelected && (
                        <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              
              <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-gray-200/50">
                <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Showing {selectedRange.label.toLowerCase()} data</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}