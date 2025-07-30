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
        className="group flex items-center space-x-3 px-6 py-4 bg-white/60 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-lg hover:shadow-xl hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-2 transition-all duration-300 hover:scale-105"
      >
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
          <Calendar className="h-5 w-5 text-white" />
        </div>
        
        <div className="flex-1 text-left">
          <p className="text-sm font-semibold text-gray-600">Time Range</p>
          <p className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            {selectedRange.label}
          </p>
        </div>
        
        <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full mt-2 right-0 z-50 min-w-80 bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-4">
              <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-gray-200/50">
                <Clock className="h-4 w-4 text-gray-500" />
                <h3 className="text-sm font-semibold text-gray-700">Select Time Range</h3>
              </div>
              
              <div className="space-y-2">
                {presets.map((preset) => {
                  const isSelected = preset.label === selectedRange.label;
                  
                  return (
                    <button
                      key={preset.label}
                      onClick={() => handlePresetSelect(preset)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 text-left ${
                        isSelected
                          ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-400/50 shadow-md'
                          : 'bg-white/40 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 border-2 border-transparent hover:border-blue-300/30'
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full transition-all duration-200 ${
                            isSelected 
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg' 
                              : 'bg-gray-300'
                          }`} />
                          <span className={`font-semibold transition-colors duration-200 ${
                            isSelected ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {preset.label}
                          </span>
                        </div>
                        <div className="ml-6 mt-1 text-xs text-gray-500">
                          {format(preset.start, 'MMM d, yyyy')} - {format(preset.end, 'MMM d, yyyy')}
                        </div>
                      </div>
                      
                      {isSelected && (
                        <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              
              <div className="mt-4 pt-3 border-t border-gray-200/50">
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