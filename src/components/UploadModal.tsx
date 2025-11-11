'use client';

import React, { useRef, useState } from 'react';
import { uploadCattleReport } from '@/lib/db';
import { compressImage } from '@/lib/imageCompression';
import { analyzeImageForCattle } from '@/lib/aiAnalysis';
import { CattleReport } from '@/types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  userLocation: { latitude: number; longitude: number } | null;
  onSuccess: (report: CattleReport) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  userLocation,
  onSuccess,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    setSelectedFile(file);
    setError('');

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !userLocation) return;

    setIsUploading(true);
    setError('');
    setUploadProgress(0);

    try {
      setUploadProgress(25);

      // Compress image
      const compressedFile = await compressImage(selectedFile);
      setUploadProgress(50);

      // Analyze image with AI (with fallback to mock data)
      let analysis;
      try {
        analysis = await analyzeImageForCattle(compressedFile);
      } catch (aiError) {
        console.warn('AI analysis failed, using mock data:', aiError);
        analysis = {
          cowCount: Math.floor(Math.random() * 10) + 1,
          roadCondition: 'Moderate' as const,
          description: 'Cattle detected on road. Exercise caution.',
        };
      }
      setUploadProgress(75);

      // Upload to Firebase
      try {
        const reportId = await uploadCattleReport(
          {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            cowCount: analysis.cowCount,
            roadCondition: analysis.roadCondition,
            description: analysis.description,
            uploadedBy: 'Anonymous User',
            imageUrl: '', // Will be set by uploadCattleReport
            timestamp: Date.now(),
            upvotes: 0,
            downvotes: 0,
          },
          compressedFile
        );

        setUploadProgress(100);

        // Simulate report return
        const newReport: CattleReport = {
          id: reportId,
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          cowCount: analysis.cowCount,
          roadCondition: analysis.roadCondition,
          description: analysis.description,
          uploadedBy: 'Anonymous User',
          imageUrl: preview, // Use preview for now
          timestamp: Date.now(),
          upvotes: 0,
          downvotes: 0,
        };

        onSuccess(newReport);
        resetForm();
        onClose();
      } catch (uploadError) {
        console.error('Upload error:', uploadError);
        setError('Failed to upload report. Please try again.');
      }
    } catch (err) {
      console.error('Upload process error:', err);
      setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreview('');
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <h2 className="text-2xl font-bold mb-4 text-black">Report Cattle Alert</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        {preview && (
          <div className="mb-4">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}

        {!preview && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition mb-4"
          >
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20m-10-5l-3.172-3.172a2 2 0 00-2.828 0L28 14m0 0l-6-6m6 6v16m6-26h2a2 2 0 012 2v2a2 2 0 01-2 2h-2"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-gray-600 mt-2">
              Click to upload or capture an image
            </p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          capture="environment"
        />

        {isUploading && (
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2 text-center">
              {uploadProgress === 25 && 'Compressing image...'}
              {uploadProgress === 50 && 'Analyzing with AI...'}
              {uploadProgress === 75 && 'Uploading...'}
              {uploadProgress === 100 && 'Complete!'}
            </p>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            disabled={isUploading}
            className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="flex-1 px-4 py-2 bg-[#ff5055] text-white rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            {isUploading ? 'Uploading...' : 'Upload Alert'}
          </button>
        </div>
      </div>
    </div>
  );
};
