'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { UploadModal } from '@/components/UploadModal';
import { ReportDetailsModal } from '@/components/ReportDetailsModal';
import { getCattleReportsNearby } from '@/lib/db';
import { useCowStore } from '@/store/cowStore';
import { CattleReport } from '@/types';

const Map = dynamic(() => import('@/components/Map').then(m => ({ default: m.Map })), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-200 flex items-center justify-center">Loading map...</div>,
});

export default function HomePage() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const {
    userLocation,
    setUserLocation,
    cattleReports,
    setCattleReports,
    addCattleReport,
    selectedReport,
    setSelectedReport,
    isLoading,
    setIsLoading,
    userVotes,
    setUserVote,
  } = useCowStore();

  // Get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback to a default location (e.g., San Francisco)
          setUserLocation({
            latitude: 37.7749,
            longitude: -122.4194,
            accuracy: 0,
          });
        },
        {
          enableHighAccuracy: true,
          maximumAge: 10000,
          timeout: 5000,
        }
      );
    }
  }, [setUserLocation]);

  // Load cattle reports
  useEffect(() => {
    const loadReports = async () => {
      if (userLocation) {
        setIsLoading(true);
        try {
          const reports = await getCattleReportsNearby(
            userLocation.latitude,
            userLocation.longitude,
            10 // 10km radius
          );
          setCattleReports(reports);
        } catch (error) {
          console.error('Error loading reports:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadReports();
    const interval = setInterval(loadReports, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [userLocation, setCattleReports, setIsLoading]);

  const handleMarkerClick = (report: CattleReport) => {
    setSelectedReport(report);
    setIsDetailsOpen(true);
  };

  const handleReportUpload = (report: CattleReport) => {
    addCattleReport(report);
  };

  const handleVote = (vote: 'up' | 'down') => {
    if (selectedReport) {
      setUserVote(selectedReport.id, vote);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="bg-red-600 text-white p-4 shadow-lg flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
          </svg>
          <h1 className="text-2xl font-bold">Cowtion</h1>
        </div>
        <p className="text-sm">People and Cattle Safety System</p>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <Map
          userLocation={userLocation}
          cattleReports={cattleReports}
          onMarkerClick={handleMarkerClick}
        />

        {/* Upload Button */}
        <button
          onClick={() => setIsUploadOpen(true)}
          disabled={!userLocation}
          className="absolute bottom-16 right-8 w-16 h-16 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg flex items-center justify-center text-3xl transition disabled:opacity-50 z-50"
          title="Report cattle"
        >
          +
        </button>

        {/* Report Count Badge */}
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-40 min-w-[200px]">
          <p className="text-gray-700 text-xl text-center">
            <span className="font-bold text-red-600">{cattleReports.length}</span> alerts
          </p>
          <p className="text-xs text-gray-500 text-center">in your area</p>
        </div>
      </div>

      {/* Modals */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        userLocation={userLocation}
        onSuccess={handleReportUpload}
      />

      <ReportDetailsModal
        report={selectedReport}
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedReport(null);
        }}
        userVote={selectedReport ? userVotes[selectedReport.id] : undefined}
        onVote={handleVote}
      />
    </div>
  );
}
