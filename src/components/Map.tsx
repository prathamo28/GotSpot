import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ParkingSpot } from '../types/ParkingSpot';

interface MapProps {
  parkingSpots: ParkingSpot[];
  selectedSpot?: number | null;
  onSpotSelect?: (spotId: number) => void;
  userLocation?: { lat: number; lng: number } | null;
}

const Map: React.FC<MapProps> = ({ parkingSpots, selectedSpot, onSpotSelect, userLocation }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [infoWindows, setInfoWindows] = useState<google.maps.InfoWindow[]>([]);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || !window.google?.maps) return;

    const defaultCenter = { lat: 54.3520, lng: 18.6466 }; // Gdansk center
    const center = userLocation || defaultCenter;

    const map = new window.google.maps.Map(mapRef.current, {
      center,
      zoom: 14,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'transit',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ],
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true
    });

    setMapInstance(map);
  }, [userLocation]);

  // Update markers when parking spots change
  useEffect(() => {
    if (!mapInstance || !parkingSpots.length) return;

    // Clear existing markers and info windows
    markers.forEach((marker: google.maps.Marker) => marker.setMap(null));
    infoWindows.forEach((infoWindow: google.maps.InfoWindow) => infoWindow.close());
    
    const newMarkers: google.maps.Marker[] = [];
    const newInfoWindows: google.maps.InfoWindow[] = [];

    parkingSpots.forEach((spot: ParkingSpot, index: number) => {
      // Create marker icon
      const markerIcon = {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="14" fill="${spot.available > 0 ? '#10b981' : '#ef4444'}" stroke="white" stroke-width="2"/>
            <text x="16" y="20" text-anchor="middle" font-size="14" fill="white" font-weight="bold">P</text>
          </svg>
        `)}`,
        scaledSize: new window.google.maps.Size(32, 32),
        anchor: new window.google.maps.Point(16, 16)
      };

      // Create marker
      const marker = new window.google.maps.Marker({
        map: mapInstance,
        position: { lat: spot.coordinates.lat, lng: spot.coordinates.lng },
        icon: markerIcon,
        title: spot.name,
        optimized: true
      });

      // Create info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="
            padding: 16px;
            max-width: 280px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          ">
            <h3 style="
              margin: 0 0 8px 0;
              font-size: 16px;
              font-weight: 600;
              color: #1e293b;
            ">${spot.name}</h3>
            <p style="
              margin: 0 0 12px 0;
              font-size: 14px;
              color: #64748b;
              line-height: 1.4;
            ">${spot.address}</p>
            <div style="
              display: flex;
              gap: 12px;
              margin-bottom: 16px;
            ">
              <div style="
                background: ${spot.available > 0 ? '#dcfce7' : '#fee2e2'};
                color: ${spot.available > 0 ? '#166534' : '#991b1b'};
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                text-align: center;
              ">
                ${spot.available} available
              </div>
              <div style="
                background: #dbeafe;
                color: #1e40af;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                text-align: center;
              ">
                ${spot.price}
              </div>
            </div>
            <div style="
              background: #f8fafc;
              padding: 12px;
              border-radius: 8px;
              border: 1px solid #e2e8f0;
            ">
              <div style="
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 8px;
              ">
                <span style="color: #f59e0b;">★</span>
                <span style="font-weight: 600; color: #1e293b;">${spot.rating}</span>
                <span style="color: #64748b; font-size: 12px;">(${spot.type})</span>
              </div>
              <div style="
                font-size: 12px;
                color: #64748b;
                font-style: italic;
              ">Updated: ${spot.lastUpdated}</div>
            </div>
          </div>
        `,
        maxWidth: 300
      });

      // Add click listener
      marker.addListener('click', () => {
        // Close all other info windows first
        newInfoWindows.forEach(iw => iw.close());
        infoWindow.open(mapInstance, marker);
        
        // Call onSpotSelect if provided
        if (onSpotSelect) {
          onSpotSelect(spot.id);
        }
      });

      newMarkers.push(marker);
      newInfoWindows.push(infoWindow);
    });

    setMarkers(newMarkers);
    setInfoWindows(newInfoWindows);

    // Fit bounds to show all markers
    if (newMarkers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      newMarkers.forEach(marker => {
        if (marker.getPosition()) {
          bounds.extend(marker.getPosition()!);
        }
      });
      mapInstance.fitBounds(bounds);
      
      // Add some padding to bounds
      const listener = window.google.maps.event.addListenerOnce(mapInstance, 'bounds_changed', () => {
        mapInstance.setZoom(Math.min(mapInstance.getZoom() || 14, 16));
      });
    }
  }, [mapInstance, parkingSpots, onSpotSelect]);

  // Update map center when user location changes
  useEffect(() => {
    if (mapInstance && userLocation) {
      mapInstance.panTo(userLocation);
    }
  }, [mapInstance, userLocation]);

  // Highlight selected spot
  useEffect(() => {
    if (!mapInstance || selectedSpot === null) return;

    const selectedMarker = markers.find((_, index) => 
      parkingSpots[index]?.id === selectedSpot
    );

    if (selectedMarker) {
      // Pan to selected marker
      const position = selectedMarker.getPosition();
      if (position) {
        mapInstance.panTo(position);
        mapInstance.setZoom(16);

        // Show info window for selected marker
        const selectedIndex = parkingSpots.findIndex(spot => spot.id === selectedSpot);
        if (selectedIndex >= 0 && infoWindows[selectedIndex]) {
          infoWindows.forEach(iw => iw.close());
          infoWindows[selectedIndex].open(mapInstance, selectedMarker);
        }
      }
    }
  }, [selectedSpot, mapInstance, markers, infoWindows, parkingSpots]);

  if (!window.google?.maps) {
    return (
      <div style={{
        height: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8fafc',
        color: '#64748b',
        fontSize: '16px',
        fontWeight: '500'
      }}>
        Loading Google Maps...
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', height: '500px' }}>
      <div 
        ref={mapRef} 
        style={{ 
          width: '100%', 
          height: '100%',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
        }} 
      />
      
      {/* Map Controls Overlay */}
      <div style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <button
          onClick={() => {
            if (mapInstance && userLocation) {
              mapInstance.panTo(userLocation);
              mapInstance.setZoom(16);
            }
          }}
          style={{
            width: '40px',
            height: '40px',
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            fontSize: '18px'
          }}
          title="Go to my location"
        >
          📍
        </button>
        
        <button
          onClick={() => {
            if (mapInstance && parkingSpots.length > 0) {
              const bounds = new window.google.maps.LatLngBounds();
              markers.forEach(marker => {
                const position = marker.getPosition();
                if (position) {
                  bounds.extend(position);
                }
              });
              mapInstance.fitBounds(bounds);
            }
          }}
          style={{
            width: '40px',
            height: '40px',
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            fontSize: '18px'
          }}
          title="Show all parking spots"
        >
          🎯
        </button>
      </div>

      {/* Legend */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        background: 'white',
        padding: '12px 16px',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e2e8f0',
        fontSize: '12px',
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
      }}>
        <div style={{ fontWeight: '600', marginBottom: '8px', color: '#1e293b' }}>Legend</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <div style={{
            width: '16px',
            height: '16px',
            background: '#10b981',
            borderRadius: '50%',
            border: '2px solid white'
          }}></div>
          <span style={{ color: '#64748b' }}>Available</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '16px',
            height: '16px',
            background: '#ef4444',
            borderRadius: '50%',
            border: '2px solid white'
          }}></div>
          <span style={{ color: '#64748b' }}>Full</span>
        </div>
      </div>
    </div>
  );
};

export default Map;
