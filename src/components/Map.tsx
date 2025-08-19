import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface MapProps {
  parkingSpots: Array<{
    id: number;
    name: string;
    address: string;
    coordinates: { lat: number; lng: number };
    available: number;
    total: number;
    price: string;
    type: string;
    rating: number;
  }>;
  selectedSpot?: number | null;
  onSpotSelect?: (spotId: number) => void;
  userLocation?: { lat: number; lng: number } | null;
}

const Map: React.FC<MapProps> = ({ 
  parkingSpots, 
  selectedSpot, 
  onSpotSelect,
  userLocation 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: 'AIzaSyB41DRuKWfJdoxMqgBcQlnvTtYdFnoBU5Y', // Demo key for testing - replace with your own
        version: 'weekly',
        libraries: ['places']
      });

      try {
        const google = await loader.load();
        
        if (mapRef.current) {
          // Center map on Gdansk
          const gdanskCenter = { lat: 54.3520, lng: 18.6466 };
          
          const mapInstance = new google.maps.Map(mapRef.current, {
            center: gdanskCenter,
            zoom: 12,
            styles: [
              {
                featureType: 'poi.parking',
                elementType: 'labels',
                stylers: [{ visibility: 'on' }]
              }
            ]
          });

          setMap(mapInstance);
          setDirectionsService(new google.maps.DirectionsService());
          setDirectionsRenderer(new google.maps.DirectionsRenderer());
          
          // Add parking spot markers
          const newMarkers: google.maps.Marker[] = [];
          
          parkingSpots.forEach(spot => {
            const marker = new google.maps.Marker({
              position: spot.coordinates,
              map: mapInstance,
              title: spot.name,
              icon: {
                url: getMarkerIcon(spot.type),
                scaledSize: new google.maps.Size(32, 32)
              }
            });

            // Add info window
            const infoWindow = new google.maps.InfoWindow({
              content: `
                <div style="padding: 10px; min-width: 200px;">
                  <h3 style="margin: 0 0 8px 0; color: #2563eb;">${spot.name}</h3>
                  <p style="margin: 0 0 5px 0; font-size: 14px;">${spot.address}</p>
                  <p style="margin: 0 0 5px 0; font-size: 14px;">
                    <strong>Available:</strong> ${spot.available}/${spot.total} spots
                  </p>
                  <p style="margin: 0 0 5px 0; font-size: 14px;">
                    <strong>Price:</strong> ${spot.price}
                  </p>
                  <p style="margin: 0 0 5px 0; font-size: 14px;">
                    <strong>Rating:</strong> ⭐ ${spot.rating}
                  </p>
                  <button 
                    onclick="window.selectSpot(${spot.id})"
                    style="
                      background: #2563eb; 
                      color: white; 
                      border: none; 
                      padding: 8px 16px; 
                      border-radius: 4px; 
                      cursor: pointer;
                      margin-top: 8px;
                    "
                  >
                    Select & Navigate
                  </button>
                </div>
              `
            });

            marker.addListener('click', () => {
              infoWindow.open(mapInstance, marker);
            });

            newMarkers.push(marker);
          });

          setMarkers(newMarkers);

          // Add user location marker if available
          if (userLocation) {
            new google.maps.Marker({
              position: userLocation,
              map: mapInstance,
              title: 'Your Location',
              icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="8" fill="#2563eb" stroke="white" stroke-width="2"/>
                    <circle cx="12" cy="12" r="3" fill="white"/>
                  </svg>
                `),
                scaledSize: new google.maps.Size(24, 24)
              }
            });
          }
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    initMap();
  }, []);

  // Update markers when parking spots change
  useEffect(() => {
    if (map && markers.length > 0) {
      markers.forEach((marker, index) => {
        const spot = parkingSpots[index];
        if (spot) {
          marker.setPosition(spot.coordinates);
          marker.setTitle(spot.name);
        }
      });
    }
  }, [parkingSpots, map]);

  // Highlight selected spot
  useEffect(() => {
    if (map && markers.length > 0 && selectedSpot !== null) {
      markers.forEach((marker, index) => {
        const spot = parkingSpots[index];
        if (spot && spot.id === selectedSpot) {
          marker.setAnimation(google.maps.Animation.BOUNCE);
          map.panTo(spot.coordinates);
          map.setZoom(16);
        } else {
          marker.setAnimation(null);
        }
      });
    }
  }, [selectedSpot, map, markers, parkingSpots]);

  const getMarkerIcon = (type: string): string => {
    // Return different colored markers based on parking type
    const colors: { [key: string]: string } = {
      'mall': '#FF6B6B',      // Red for shopping
      'office': '#4ECDC4',    // Teal for business
      'street': '#45B7D1',    // Blue for street
      'university': '#96CEB4', // Green for education
      'hospital': '#FFEAA7',  // Yellow for medical
      'attraction': '#DDA0DD' // Purple for attractions
    };
    
    const color = colors[type] || '#FF6B6B';
    
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 2C10.48 2 6 6.48 6 12c0 8 10 18 10 18s10-10 10-18c0-5.52-4.48-10-10-10z" fill="${color}"/>
        <circle cx="16" cy="12" r="4" fill="white"/>
        <path d="M16 2C10.48 2 6 6.48 6 12c0 8 10 18 10 18s10-10 10-18c0-5.52-4.48-10-10-10z" stroke="white" stroke-width="2"/>
      </svg>
    `)}`;
  };

  const getDirections = (destination: { lat: number; lng: number }) => {
    if (!directionsService || !directionsRenderer || !map || !userLocation) return;

    directionsService.route(
      {
        origin: userLocation,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === 'OK' && result) {
          directionsRenderer.setDirections(result);
          directionsRenderer.setMap(map);
        }
      }
    );
  };

  // Expose selectSpot function globally for info window buttons
  useEffect(() => {
    (window as any).selectSpot = (spotId: number) => {
      if (onSpotSelect) {
        onSpotSelect(spotId);
      }
    };
  }, [onSpotSelect]);

  return (
    <div className="map-container">
      <div ref={mapRef} className="map" style={{ width: '100%', height: '400px' }} />
      
      {/* Map Controls */}
      <div className="map-controls">
        <button 
          className="map-control-btn"
          onClick={() => map?.setZoom((map.getZoom() || 12) + 1)}
        >
          ➕
        </button>
        <button 
          className="map-control-btn"
          onClick={() => map?.setZoom((map.getZoom() || 12) - 1)}
        >
          ➖
        </button>
        {userLocation && (
          <button 
            className="map-control-btn"
            onClick={() => map?.panTo(userLocation)}
            title="Center on my location"
          >
            📍
          </button>
        )}
      </div>
    </div>
  );
};

export default Map;
