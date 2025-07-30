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
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-4">
          {isLoading ? (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          ) : (
            <>
              {isDragActive ? (
                <Upload className="h-12 w-12 text-blue-600" />
              ) : (
                <FileText className="h-12 w-12 text-gray-400" />
              )}
            </>
          )}
          
          <div>
            <p className="text-lg font-medium text-gray-900">
              {isLoading ? 'Processing...' : isDragActive ? 'Drop your file here' : 'Upload WhatsApp Chat Export'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {isLoading ? 'Analyzing your chat data...' : 'Drag and drop your .txt file here, or click to select'}
            </p>
          </div>
          
          {!isLoading && (
            <div className="text-xs text-gray-400 mt-4">
              <p>To export your WhatsApp chat:</p>
              <p>1. Open WhatsApp → Chat → Menu → More → Export chat</p>
              <p>2. Choose &quot;Without Media&quot; for faster processing</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}