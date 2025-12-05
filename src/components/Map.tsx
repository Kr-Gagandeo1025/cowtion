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

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
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
  onLocationUpdate?: (location: { latitude: number; longitude: number }) => void;
}

export const Map: React.FC<MapProps> = ({
  userLocation,
  cattleReports,
  onMarkerClick,
  onLocationUpdate,
}) => {
  const mapInitialized = useRef(false);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    // Fix leaflet icon issue (only once)
    if (!mapInitialized.current && typeof window !== 'undefined') {
      import('leaflet').then((L) => {
        mapInitialized.current = true;
      });
    }
  }, []);

  // Add locate control to map after it's rendered
  useEffect(() => {
    if (mapRef.current && typeof window !== 'undefined') {
      import('leaflet').then((L) => {
        // Create locate control
        const LocateControl = L.Control.extend({
          options: {
            position: 'topleft',
          },
          onAdd: function (map: any) {
            const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
            const button = L.DomUtil.create('button', '', container) as HTMLButtonElement;
            
            button.innerHTML = '📍';
            button.title = 'Go to my location';
            button.style.cssText = `
              width: 36px;
              height: 36px;
              background-color: white;
              border: 2px solid #ccc;
              border-radius: 4px;
              cursor: pointer;
              font-size: 18px;
              display: flex;
              align-items: center;
              justify-content: center;
              transition: all 0.3s ease;
              box-shadow: 0 1px 5px rgba(0,0,0,0.65);
              font-family: Arial, sans-serif;
            `;

            button.onmouseover = () => {
              button.style.backgroundColor = '#f0f0f0';
              button.style.borderColor = '#999';
            };
            button.onmouseout = () => {
              button.style.backgroundColor = 'white';
              button.style.borderColor = '#ccc';
            };

            button.onclick = (e: Event) => {
              e.preventDefault();
              e.stopPropagation();
              handleLocate();
            };

            L.DomEvent.disableClickPropagation(button);
            return container;
          },
        });

        // Add control to map
        mapRef.current.addControl(new (LocateControl as any)());
      });
    }
  }, [mapRef.current]);

  const handleLocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (mapRef.current) {
            // Animate to new location
            mapRef.current.flyTo([latitude, longitude], 13, {
              duration: 1,
            });
          }
          if (onLocationUpdate) {
            onLocationUpdate({ latitude, longitude });
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please check location permissions in your browser settings.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

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
    if (intensity > 10) return '#dc2626';
    if (intensity > 5) return '#f97316';
    return '#fbbf24';
  };

  // Create location arrow icon
  const createLocationIcon = () => {
    if (typeof window === 'undefined') return null;
    const L = require('leaflet');
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3b82f6" width="32" height="32">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11 10.07 7.5 12 7.5s3.5 1.57 3.5 3.5z"/>
      </svg>
    `;
    return L.icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(svg)}`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16],
    });
  };

  // Create cow icon with color coding
  const createCowIcon = (color: string) => {
    if (typeof window === 'undefined') return null;
    const L = require('leaflet');
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="40" height="40">
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
          </filter>
        </defs>
        <!-- Body -->
        <ellipse cx="50" cy="60" rx="35" ry="25" fill="${color}" filter="url(#shadow)"/>
        <!-- Head -->
        <circle cx="50" cy="30" r="18" fill="${color}"/>
        <!-- Ears -->
        <ellipse cx="35" cy="15" rx="6" ry="10" fill="${color}"/>
        <ellipse cx="65" cy="15" rx="6" ry="10" fill="${color}"/>
        <!-- Eyes -->
        <circle cx="45" cy="28" r="2" fill="black"/>
        <circle cx="55" cy="28" r="2" fill="black"/>
        <!-- Snout -->
        <ellipse cx="50" cy="35" rx="4" ry="3" fill="rgba(0,0,0,0.2)"/>
        <!-- Legs -->
        <rect x="35" y="80" width="5" height="15" fill="${color}"/>
        <rect x="50" y="80" width="5" height="15" fill="${color}"/>
        <rect x="60" y="80" width="5" height="15" fill="${color}"/>
      </svg>
    `;
    return L.icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(svg)}`,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -20],
    });
  };

  return (
    <MapContainer
      ref={mapRef}
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
      <Marker
        position={[userLocation.latitude, userLocation.longitude]}
        icon={createLocationIcon()}
      >
        <Popup>Your Current Location</Popup>
      </Marker>

      {/* Cattle Reports */}
      {cattleReports.length>0&&cattleReports.map((report) => {
        const intensity = calculateIntensity(report.latitude, report.longitude);
        const color = getIntensity(report.cowCount);

        return (
          <Marker
            key={report.id}
            position={[report.latitude, report.longitude]}
            icon={createCowIcon(color)}
            eventHandlers={{
              click: () => onMarkerClick(report),
            }}
          >
            <Popup>
              <div className="max-w-xs bg-white rounded-lg p-3 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#ffedf0] flex items-center justify-center text-sm font-bold text-[#ff5055]">🐄</div>
                    <div>
                      <p className="font-semibold text-gray-800">{report.cowCount} cattle</p>
                      <p className="text-xs text-gray-500">{report.roadCondition}</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">{new Date(report.timestamp).toLocaleTimeString()}</div>
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => onMarkerClick(report)}
                    className="flex-1 px-3 py-2 bg-[#ff5055] text-white text-sm rounded-lg hover:opacity-95"
                  >
                    View Details
                  </button>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${report.latitude},${report.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 bg-gray-100 text-gray-800 text-sm rounded-lg hover:bg-gray-200"
                  >
                    Navigate
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};
