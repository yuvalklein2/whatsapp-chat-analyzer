'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (content: string) => void;
  isLoading?: boolean;
}

export default function FileUpload({ onFileUpload, isLoading }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onFileUpload(content);
      };
      reader.readAsText(file);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt']
    },
    multiple: false,
    disabled: isLoading
  });

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div
        {...getRootProps()}
        className={`
          group relative backdrop-blur-xl rounded-3xl p-16 text-center cursor-pointer transition-all duration-500
          ${isDragActive 
            ? 'bg-gradient-to-br from-blue-50/80 to-purple-50/80 border-2 border-blue-400/50 shadow-2xl scale-[1.02]' 
            : 'bg-white/60 border-2 border-dashed border-gray-300/50 hover:border-blue-400/50 hover:bg-gradient-to-br hover:from-blue-50/40 hover:to-purple-50/40 shadow-lg hover:shadow-2xl hover:scale-[1.01]'
          }
          ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="relative flex flex-col items-center space-y-6">
          {isLoading ? (
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute inset-0"></div>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 rounded-3xl blur-xl opacity-20 scale-110"></div>
              {isDragActive ? (
                <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-3xl shadow-lg">
                  <Upload className="h-12 w-12 text-white" />
                </div>
              ) : (
                <div className="relative bg-gradient-to-r from-gray-100 to-gray-200 p-6 rounded-3xl shadow-lg group-hover:from-blue-500 group-hover:to-purple-600 transition-all duration-300">
                  <FileText className="h-12 w-12 text-gray-500 group-hover:text-white transition-colors duration-300" />
                </div>
              )}
            </div>
          )}
          
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-gray-900">
              {isLoading ? 'Processing Your Chat...' : isDragActive ? 'Drop Your File Here' : 'Upload WhatsApp Export'}
            </h3>
            <p className="text-lg text-gray-600 font-medium">
              {isLoading ? 'Analyzing conversation patterns...' : 'Drag and drop your .txt file, or click to browse'}
            </p>
          </div>
          
          {!isLoading && (
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 max-w-md">
              <p className="text-sm font-semibold text-gray-700 mb-3">Quick Export Guide:</p>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <p>Open WhatsApp → Select Chat → Menu (⋮)</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                  <p>More → Export chat → &quot;Without Media&quot;</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}