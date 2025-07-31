'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, Archive } from 'lucide-react';
import JSZip from 'jszip';

interface FileUploadProps {
  onFileUpload: (content: string) => void;
  isLoading?: boolean;
}

export default function FileUpload({ onFileUpload, isLoading }: FileUploadProps) {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      try {
        if (file.name.toLowerCase().endsWith('.zip')) {
          // Handle ZIP files
          const arrayBuffer = await file.arrayBuffer();
          const zip = new JSZip();
          const zipContent = await zip.loadAsync(arrayBuffer);
          
          // Look for .txt files in the ZIP
          const txtFiles = Object.keys(zipContent.files).filter(
            name => name.toLowerCase().endsWith('.txt') && !zipContent.files[name].dir
          );
          
          if (txtFiles.length === 0) {
            throw new Error('No .txt files found in the ZIP archive. Please make sure your WhatsApp export contains a text file.');
          }
          
          // Use the first .txt file found
          const txtFile = zipContent.files[txtFiles[0]];
          const content = await txtFile.async('string');
          onFileUpload(content);
        } else {
          // Handle regular .txt files
          const reader = new FileReader();
          reader.onload = (e) => {
            const content = e.target?.result as string;
            onFileUpload(content);
          };
          reader.readAsText(file);
        }
      } catch (error) {
        console.error('Error processing file:', error);
        onFileUpload(''); // This will trigger an error in the parent component
      }
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/zip': ['.zip']
    },
    multiple: false,
    disabled: isLoading
  });

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div
        {...getRootProps()}
        className={`
          relative rounded-lg p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 border-2 border-dashed touch-manipulation
          ${isDragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50 active:bg-blue-100'
          }
          ${isLoading ? 'opacity-70 cursor-not-allowed pointer-events-none' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-3 sm:space-y-4">
          {isLoading ? (
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-2 border-blue-600 border-t-transparent"></div>
          ) : (
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
              <span className="text-gray-400 text-sm sm:text-base">or</span>
              <Archive className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
            </div>
          )}
          
          <div className="space-y-1 sm:space-y-2">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 leading-tight">
              {isLoading ? 'Processing your chat...' : isDragActive ? 'Drop your file here' : 'Upload WhatsApp export'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed px-2">
              {isLoading ? 'This may take a moment...' : 'Drag and drop your .txt or .zip file, or tap to browse'}
            </p>
          </div>
        </div>
      </div>
      
      {!isLoading && (
        <div className="mt-4 sm:mt-6 bg-blue-50 rounded-lg p-3 sm:p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2 sm:mb-3">How to export from WhatsApp:</h4>
          <ol className="space-y-2 text-xs sm:text-sm text-gray-700">
            <li className="flex items-start space-x-2">
              <span className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-medium">1</span>
              <span className="leading-relaxed">Open WhatsApp and select the chat you want to analyze</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-medium">2</span>
              <span className="leading-relaxed">Tap the menu (⋮) → More → Export chat</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-medium">3</span>
              <span className="leading-relaxed">Choose &quot;Without Media&quot; and upload the .zip file here</span>
            </li>
          </ol>
        </div>
      )}
    </div>
  );
}