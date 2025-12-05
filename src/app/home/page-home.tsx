'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { UploadModal } from '@/components/UploadModal';
import { ReportDetailsModal } from '@/components/ReportDetailsModal';
import { getCattleReportsNearbyLazy } from '@/lib/db';
import { useCowStore } from '@/store/cowStore';
import { CattleReport } from '@/types';
import Image from 'next/image';

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
          const reports = await getCattleReportsNearbyLazy(
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
      <div className="bg-white relative text-black p-4 shadow-lg flex items-center justify-between z-10 overflow-hidden">
        <div className="flex items-center gap-2">
            <img src="/cowtion.png" alt='cowtion-log' height={30} width={30} className='w-[40px] h-auto'/>
          <h1 className="text-2xl font-bold">Cowtion!</h1>
        </div>
        {/* <Image src="/cowPrint.png" alt='cow-print' height={20} width={20} className='w-10 h-auto absolute right-45'/> */}
        <Image src="/cowPrint.png" alt='cow-print' height={20} width={20} className='w-10 h-auto absolute right-40 -bottom-6'/>
        <Image src="/cowPrint.png" alt='cow-print' height={20} width={20} className='w-10 h-auto absolute right-35 bottom-10'/>
        <Image src="/cowPrint.png" alt='cow-print' height={20} width={20} className='w-10 h-auto absolute right-20 -bottom-2.5'/>
        <Image src="/cowPrint.png" alt='cow-print' height={20} width={20} className='w-10 h-auto absolute right-10 bottom-8'/>
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
          className="absolute bottom-16 right-8 w-16 h-16 hover:opacity-90 text-white rounded-full shadow-lg flex items-center justify-center text-3xl transition disabled:opacity-50 z-50"
          style={{ backgroundColor: '#ff5055' }}
          title="Report cattle"
        >
          +
        </button>

        {/* Report Count Badge */}
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-40 min-w-[200px]">
          <p className="text-gray-700 text-xl text-center">
            <span className="font-bold" style={{ color: '#ff5055' }}>{cattleReports.length}</span> ALERTS
          </p>
          <p className="text-xs text-gray-500 text-center">within 5KM of your location</p>
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
