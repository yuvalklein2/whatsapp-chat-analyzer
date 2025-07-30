'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, FileText } from 'lucide-react';

export default function FormatHelper() {
  const [isExpanded, setIsExpanded] = useState(false);

  const sampleFormats = [
    "12/31/23, 10:30 AM - John: Hello there!",
    "[12/31/23, 10:30:25] John: Hello there!",
    "31.12.23, 10:30 - John: Hello there!",
    "12/31/2023, 10:30 - John: Hello there!",
    "31/12/23, 22:30 - John: Hello there!"
  ];

  return (
    <div className="max-w-2xl mx-auto mt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800"
      >
        <FileText className="h-4 w-4" />
        <span>Having trouble? Check supported formats</span>
        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      
      {isExpanded && (
        <div className="mt-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">Supported WhatsApp Export Formats:</h4>
          <div className="space-y-1 text-sm text-blue-800 font-mono">
            {sampleFormats.map((format, index) => (
              <div key={index} className="bg-white px-2 py-1 rounded border">
                {format}
              </div>
            ))}
          </div>
          <div className="mt-3 text-xs text-blue-700">
            <p><strong>Note:</strong> Your chat export should contain messages in one of these formats.</p>
            <p>Make sure you exported the chat correctly: WhatsApp → Chat → Menu → More → Export chat → Without Media</p>
            <p>If you&apos;re still having issues, open the .txt file in a text editor and check the first few lines.</p>
          </div>
        </div>
      )}
    </div>
  );
}