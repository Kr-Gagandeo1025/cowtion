'use client';

import React, { useState, useEffect } from 'react';
import { CattleReport } from '@/types';
import { upvoteCattleReport, downvoteCattleReport, getCattleReport } from '@/lib/db';

interface ReportDetailsModalProps {
  report: CattleReport | null;
  isOpen: boolean;
  onClose: () => void;
  userVote?: 'up' | 'down' | null;
  onVote?: (vote: 'up' | 'down') => void;
}

export const ReportDetailsModal: React.FC<ReportDetailsModalProps> = ({
  report,
  isOpen,
  onClose,
  userVote,
  onVote,
}) => {
  const [isVoting, setIsVoting] = useState(false);
  const [downvoteCount, setDownvoteCount] = useState(report?.downvotes || 0);
  const [upvoteCount, setUpvoteCount] = useState(report?.upvotes || 0);
  const [fullReport, setFullReport] = useState<CattleReport | null>(null);
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  // Fetch full report with image when modal opens
  useEffect(() => {
    if (isOpen && report && !report.imageLoaded) {
      setIsLoadingImage(true);
      getCattleReport(report.id).then((fullData) => {
        if (fullData) {
          setFullReport(fullData);
        }
        setIsLoadingImage(false);
      }).catch((error) => {
        console.error('Error loading full report:', error);
        setIsLoadingImage(false);
      });
    } else if (isOpen && report) {
      setFullReport(report);
    }
  }, [isOpen, report]);

  if (!isOpen || !report) return null;

  const displayReport = fullReport || report;

  const handleVote = async (voteType: 'up' | 'down') => {
    setIsVoting(true);
    try {
      if (voteType === 'up') {
        await upvoteCattleReport(report.id);
        // Update local upvote count
        const newCount = report?.upvotes + 1;
        setUpvoteCount(newCount);

      } else {
        await downvoteCattleReport(report.id);
        // Update local downvote count
        const newCount = report?.downvotes + 1;
        setDownvoteCount(newCount);
        
        // If downvotes reached 100+, show alert and close modal
        if (newCount >= 100) {
          setTimeout(() => {
            alert('⚠️ This alert has been removed due to too many downvotes.');
            onClose();
          }, 500);
          return;
        }
      }
      onVote?.(voteType);
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setIsVoting(false);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Good':
        return 'bg-green-100 text-green-800';
      case 'Moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Poor':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full mx-4 my-8 p-0 overflow-hidden transform transition-all duration-200">
        {/* Header */}
  <div className="flex items-center justify-between px-6 py-4 bg-linear-to-r from-pink-500 to-orange-400 text-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">🐄</div>
            <div>
              <h3 className="text-lg font-semibold">Cattle Alert</h3>
              <p className="text-sm opacity-90">{displayReport.cowCount} cattle · {displayReport.roadCondition}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm bg-white/20 px-3 py-1 rounded-full">{formatDate(displayReport.timestamp)}</div>
            <button onClick={onClose} aria-label="Close" className="text-white hover:opacity-90 text-2xl">×</button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Image area */}
          <div className="relative w-full rounded-xl overflow-hidden shadow-md">
            {isLoadingImage ? (
              <div className="w-full h-80 bg-gray-100 flex items-center justify-center">
                <div className="text-gray-500 text-center">
                  <p className="text-2xl mb-2">📸</p>
                  <p>Loading image...</p>
                </div>
              </div>
            ) : displayReport.imageUrl ? (
              <img src={displayReport.imageUrl} alt="Cattle alert" className="w-full h-80 object-cover" />
            ) : (
              <div className="w-full h-80 bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-gray-500 text-center">
                  <p className="text-3xl mb-2">🐄</p>
                  <p className="text-sm">No image available</p>
                </div>
              </div>
            )}

            {/* Badges on image */}
            <div className="absolute top-4 left-4">
              <span className="bg-white/90 text-sm text-black px-3 py-1 rounded-full font-semibold">{displayReport.cowCount} cows</span>
            </div>
            <div className="absolute top-4 right-4">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getConditionColor(displayReport.roadCondition)}`}>{displayReport.roadCondition}</span>
            </div>
          </div>

          {/* Meta grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <p className="text-xs text-gray-500">Location</p>
              <p className="text-sm font-medium text-gray-800">{displayReport.latitude.toFixed(5)}, {displayReport.longitude.toFixed(5)}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <p className="text-xs text-gray-500">Reported By</p>
              <p className="text-sm font-medium text-gray-800">{displayReport.uploadedBy || 'Anonymous'}</p>
              <p className="text-xs text-gray-500 mt-2">ID: {displayReport.id}</p>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <p className="text-xs text-gray-500">Description</p>
            <p className="mt-2 text-gray-800">{displayReport.description}</p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex gap-3">
              <button
                onClick={() => handleVote('up')}
                disabled={isVoting}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition shadow-sm text-sm font-medium ${
                  userVote === 'up' ? 'bg-green-500 text-white' : 'bg-white text-gray-800 hover:bg-gray-50'
                } disabled:opacity-50`}>
                👍 Helpful
                <span className="ml-2 text-sm text-gray-600">({upvoteCount===0? displayReport.upvotes : upvoteCount})</span>
              </button>
              <button
                onClick={() => handleVote('down')}
                disabled={isVoting}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition shadow-sm text-sm font-medium ${
                  userVote === 'down' ? 'bg-red-500 text-white' : 'bg-white text-gray-800 hover:bg-gray-50'
                } disabled:opacity-50`}>
                👎 Not Helpful
                <span className="ml-2 text-sm text-gray-600">({downvoteCount===0? displayReport.downvotes : downvoteCount})</span>
              </button>
            </div>

            <div className="w-full sm:w-auto flex gap-2">
              <button onClick={() => { navigator.clipboard?.writeText(window.location.href); }} className="px-4 py-3 bg-blue-600 text-white rounded-lg shadow-sm text-sm">Share</button>
              <button onClick={onClose} className="px-4 py-3 bg-gray-100 text-gray-800 rounded-lg shadow-sm text-sm">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
