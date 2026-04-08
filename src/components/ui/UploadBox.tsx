'use client';

import React, { useState, useRef, DragEvent } from 'react';
import { UploadCloud, X, File as FileIcon, Image as ImageIcon } from 'lucide-react';
import { cn } from './Button';

interface UploadBoxProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  className?: string;
  label?: string;
}

export function UploadBox({
  files,
  onFilesChange,
  accept = 'image/jpeg, image/png, .stl, .3mf',
  multiple = true,
  maxFiles = 10,
  className,
  label = 'Drag & drop files or click to upload',
}: UploadBoxProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const addedFiles = Array.from(newFiles);

    let validFiles = addedFiles;
    if (!multiple) {
      validFiles = [addedFiles[0]];
    }

    const totalFiles = [...files, ...validFiles].slice(0, maxFiles);
    onFilesChange(totalFiles);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (indexToRemove: number) => {
    onFilesChange(files.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className={cn('w-full', className)}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'border-[4px] border-dashed rounded-[2rem] p-8 text-center cursor-pointer transition-all duration-200 shadow-[8px_8px_0px_rgba(26,64,115,0.2)] hover:shadow-[8px_8px_0px_#1a4073] hover:-translate-y-1',
          isDragging
            ? 'border-orange-500 bg-orange-100'
            : 'border-[#1a4073] bg-white hover:bg-blue-50'
        )}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleChange}
          accept={accept}
          multiple={multiple}
          className="hidden"
        />
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="p-4 bg-blue-100 rounded-full text-blue-500">
            <UploadCloud size={32} />
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-700">{label}</p>
            <p className="text-sm text-gray-500 mt-1">
              Supported formats: JPG, PNG, STL, 3MF
            </p>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.map((file, idx) => {
            const isImage = file.type.startsWith('image/');
            const objectUrl = isImage ? URL.createObjectURL(file) : null;

            return (
              <div
                key={`${file.name}-${idx}`}
                className="relative group bg-white border-4 border-[#1a4073] rounded-2xl shadow-[4px_4px_0px_#1a4073] overflow-hidden flex flex-col items-center justify-center p-2"
              >
                <div className="w-full h-24 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden mb-2">
                  {isImage && objectUrl ? (

                    <img src={objectUrl} alt={file.name} className="object-cover w-full h-full" />
                  ) : (
                    <FileIcon size={32} className="text-gray-400" />
                  )}
                </div>
                <p className="text-xs text-gray-600 truncate w-full px-1 text-center font-medium">
                  {file.name}
                </p>
                <p className="text-[10px] text-gray-400">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(idx);
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white border-2 border-[#1a4073] rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 transform hover:scale-110 shadow-[2px_2px_0px_#1a4073]"
                >
                  <X size={14} className="stroke-[3px]" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
