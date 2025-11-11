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
    if (intensity > 0.66) return '#dc2626';
    if (intensity > 0.33) return '#f97316';
    return '#fbbf24';
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
      {cattleReports.length>0&&cattleReports.map((report) => {
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
