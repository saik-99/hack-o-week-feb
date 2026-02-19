import React, { useState, useCallback } from 'react';

interface ImageUploaderProps {
  onImageSelected: (base64: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Strip prefix data:image/...;base64, to just get the data
        const base64Data = result.split(',')[1];
        onImageSelected(base64Data);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid image file.");
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    processFile(file);
  }, [onImageSelected]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-8">
      <div
        className={`relative border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center text-center transition-all cursor-pointer bg-white shadow-sm
          ${isDragging 
            ? 'border-brand-500 bg-brand-50 scale-[1.02]' 
            : 'border-slate-300 hover:border-brand-400 hover:bg-slate-50'
          }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('fileInput')?.click()}
      >
        <input
          type="file"
          id="fileInput"
          className="hidden"
          accept="image/*"
          onChange={handleFileInput}
        />
        
        <div className="bg-brand-100 p-4 rounded-full mb-4 text-brand-600">
           <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
           </svg>
        </div>
        
        <h3 className="text-xl font-semibold text-slate-800 mb-2">
          Upload Academic Calendar
        </h3>
        <p className="text-slate-500 max-w-sm mb-6">
          Drag & drop your calendar image here, or click to browse. Supports generic academic calendar formats.
        </p>
        
        <button className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg shadow-sm transition-colors">
          Select Image
        </button>
      </div>
    </div>
  );
};