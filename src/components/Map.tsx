'use client';

import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { CattleReport } from '@/types';

// Dynamically import react-leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const CircleMarker = dynamic(
  () => import('react-leaflet').then((mod) => mod.CircleMarker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

interface MapProps {
  userLocation: { latitude: number; longitude: number } | null;
  cattleReports: CattleReport[];
  onMarkerClick: (report: CattleReport) => void;
}

export const Map: React.FC<MapProps> = ({
  userLocation,
  cattleReports,
  onMarkerClick,
}) => {
  const mapInitialized = useRef(false);

  useEffect(() => {
    // Fix leaflet icon issue (only once)
    if (!mapInitialized.current && typeof window !== 'undefined') {
      import('leaflet').then((L) => {
        const iconUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png';
        const shadowUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png';
        const iconRetinaUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png';
        
        const DefaultIcon = L.icon({
          iconUrl,
          iconRetinaUrl,
          shadowUrl,
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        });
        L.Marker.prototype.setIcon(DefaultIcon);
        mapInitialized.current = true;
      });
    }
  }, []);

  if (!userLocation) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Loading location...</p>
      </div>
    );
  }

  const calculateIntensity = (reportLat: number, reportLon: number) => {
    const radiusInDegrees = 0.1;
    const nearbyCount = cattleReports.filter((r) => {
      const distance = Math.sqrt(
        Math.pow(r.latitude - reportLat, 2) +
          Math.pow(r.longitude - reportLon, 2)
      );
      return distance < radiusInDegrees;
    }).length;
    return Math.min(nearbyCount / 10, 1);
  };

  const getIntensity = (intensity: number) => {
    if (intensity > 0.66) return '#dc2626';
    if (intensity > 0.33) return '#f97316';
    return '#fbbf24';
  };

  return (
    <MapContainer
      center={[userLocation.latitude, userLocation.longitude]}
      zoom={13}
      style={{ width: '100%', height: '100%' }}
      className="rounded-lg z-10"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* User Location Marker */}
      <CircleMarker
        center={[userLocation.latitude, userLocation.longitude]}
        radius={8}
        fill
        color="#3b82f6"
        fillOpacity={0.8}
        weight={2}
      >
        <Popup>Your Current Location</Popup>
      </CircleMarker>

      {/* Cattle Reports */}
      {cattleReports.map((report) => {
        const intensity = calculateIntensity(report.latitude, report.longitude);
        const color = getIntensity(intensity);
        const radius = 10 + intensity * 15;

        return (
          <CircleMarker
            key={report.id}
            center={[report.latitude, report.longitude]}
            radius={radius}
            fill
            color={color}
            fillOpacity={0.7}
            weight={2}
            eventHandlers={{
              click: () => onMarkerClick(report),
            }}
          >
            <Popup>
              <div className="max-w-xs">
                <img
                  src={report.imageUrl}
                  alt="Cattle"
                  className="w-24 h-24 object-cover rounded mb-2"
                />
                <p className="font-semibold">{report.cowCount} cattle</p>
                <p className="text-sm">{report.roadCondition}</p>
                <button
                  onClick={() => onMarkerClick(report)}
                  className="mt-2 px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                >
                  View Details
                </button>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
};
