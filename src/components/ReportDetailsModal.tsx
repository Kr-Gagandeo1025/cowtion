'use client';

import React, { useState } from 'react';
import { CattleReport } from '@/types';
import { upvoteCattleReport, downvoteCattleReport } from '@/lib/db';

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

  if (!isOpen || !report) return null;

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 my-8 p-6 h-[90%] overflow-y-scroll">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-black">Cattle Alert Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Image */}
        <div className="mb-4">
          <img
            src={report.imageUrl}
            alt="Cattle alert"
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-gray-600 font-bold text-sm">Cattle Count</p>
            <p className="text-2xl font-bold" style={{ color: '#ff5055' }}>{report.cowCount}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm font-bold">Road Condition</p>
            <div className="mt-1">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConditionColor(report.roadCondition)}`}>
                {report.roadCondition}
              </span>
            </div>
          </div>
          <div>
            <p className="text-gray-600 font-bold text-sm">Reported</p>
            <p className="text-sm text-black">{formatDate(report.timestamp)}</p>
          </div>
          <div>
            <p className="text-gray-600 font-bold text-sm">Location</p>
            <p className="text-sm text-black">
              {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <p className="text-gray-600 text-sm">Description</p>
          <p className="text-gray-800 mt-2">{report.description}</p>
        </div>

        {/* Upvote/Downvote */}
        <div className="mb-6">
          <p className="text-gray-600 text-sm mb-3">Is this report helpful?</p>
          <div className="flex gap-4 items-center">
            <button
              onClick={() => handleVote('up')}
              disabled={isVoting}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                userVote === 'up'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } disabled:opacity-50`}
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2 10.5a1.5 1.5 0 113 0v-6a1.5 1.5 0 01-3 0v6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.519-7.594A2 2 0 0015.378 8H4.721a2 2 0 00-1.994 2.263l.007.086a2 2 0 001.994 1.984h9.303a1 1 0 00.992-1.16l-.213-1.28a4 4 0 00-3.939-3.464H9.172a2 2 0 00-1.441.563L6.05 9.5H6z" />
              </svg>
              Helpful ({upvoteCount===0? report?.upvotes : upvoteCount})
            </button>
            <button
              onClick={() => handleVote('down')}
              disabled={isVoting}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                userVote === 'down'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } disabled:opacity-50`}
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M18 9.5a1.5 1.5 0 11-3 0v6a1.5 1.5 0 013 0v-6zM14 9.667v-5.43a2 2 0 00-1.106-1.79l-.05-.025A4 4 0 0011.057 2H5.641a2 2 0 00-1.962 1.608l-1.519 7.594A2 2 0 004.622 12h10.657a2 2 0 001.992-2.263l-.006-.086a2 2 0 00-1.994-1.984H5.339a1 1 0 00-.992 1.16l.213 1.28a4 4 0 003.939 3.464h.3a2 2 0 001.441-.563l1.555-1.587h1.158z" />
              </svg>
              Not Helpful ({downvoteCount===0? report?.downvotes : downvoteCount})
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};
