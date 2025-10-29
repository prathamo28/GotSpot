import React, { useEffect, useRef } from 'react';
import { POLISH_CITIES } from '../data/cities.ts';
import { PARKING_LOCATIONS } from '../data/parkingLocations.ts';

interface CityMapPageProps {
  city: string;
  onBack: () => void;
}

// Lazy-load Leaflet only in browser to avoid SSR issues
const ensureLeaflet = async () => {
  const L = await import('leaflet');
  await import('leaflet/dist/leaflet.css');
  return L;
};

const CityMapPage: React.FC<CityMapPageProps> = ({ city, onBack }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<any>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showList, setShowList] = React.useState(true); // Mobile-first: show list by default

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const cityInfo = POLISH_CITIES[city];
      if (!cityInfo || !mapRef.current) return;
      const L = await ensureLeaflet();

      if (!isMounted) return;

      mapInstance.current = L.map(mapRef.current).setView([cityInfo.lat, cityInfo.lng], 12);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstance.current);

      // Add city center marker
      L.marker([cityInfo.lat, cityInfo.lng]).addTo(mapInstance.current);

      // Just setup markers - no circles

      // Add parking location markers WITHOUT circles
      PARKING_LOCATIONS.forEach((location) => {
        // Add colorful marker based on BUSY LEVEL
        const markerColor = location.busyLevel === 'busy' ? 'red' : 
                           location.busyLevel === 'moderate' ? 'orange' : 'green';
        const iconUrl = `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${markerColor}.png`;
        
        const icon = new L.Icon({
          iconUrl: iconUrl,
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [30, 46],
          iconAnchor: [15, 46],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });

        const marker = L.marker([location.lat, location.lng], { icon })
          .bindPopup(`
            <strong>${location.name}</strong><br>
            Type: ${location.type}<br>
            Available: ${location.available}/${location.total}<br>
            Price: ${location.price}<br>
            Rating: ${location.rating}⭐
          `)
          .addTo(mapInstance.current);
      });
    })();
    return () => {
      isMounted = false;
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [city]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !mapInstance.current) return;
    
    const location = PARKING_LOCATIONS.find(loc => 
      loc.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    if (location) {
      mapInstance.current.flyTo([location.lat, location.lng], 16, {
        duration: 1,
        easeLinearity: 0.25
      });
    }
  };

  const filteredLocations = PARKING_LOCATIONS.filter(loc => 
    loc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (level: string) => {
    return level === 'busy' ? '#EF4444' : level === 'moderate' ? '#F99160' : '#22C55E';
  };

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F9FAFB' }}>
      {/* Mobile Header */}
      <div style={{ 
        background: 'white', 
        padding: '12px 16px',
        borderBottom: '1px solid #E5E7EB',
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            fontSize: 24,
            cursor: 'pointer',
            padding: '4px 8px'
          }}
        >
          ←
        </button>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Parking in {city}</h2>
      </div>

      {/* Toggle Buttons */}
      <div style={{ 
        background: 'white', 
        padding: '8px 16px',
        display: 'flex',
        gap: 8,
        borderBottom: '1px solid #E5E7EB'
      }}>
        <button
          onClick={() => setShowList(true)}
          style={{
            flex: 1,
            padding: '8px',
            border: 'none',
            borderRadius: 8,
            background: showList ? '#3B82F6' : '#F3F4F6',
            color: showList ? 'white' : '#6B7280',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          📋 List
        </button>
        <button
          onClick={() => setShowList(false)}
          style={{
            flex: 1,
            padding: '8px',
            border: 'none',
            borderRadius: 8,
            background: !showList ? '#3B82F6' : '#F3F4F6',
            color: !showList ? 'white' : '#6B7280',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          🗺️ Map
        </button>
      </div>

      {showList ? (
        // MOBILE-FIRST LIST VIEW
        <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
          {filteredLocations.map((location) => (
            <div
              key={location.id}
              style={{
                background: 'white',
                borderRadius: 12,
                padding: 16,
                marginBottom: 12,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                borderLeft: `4px solid ${getStatusColor(location.busyLevel)}`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#111827' }}>
                    {location.name}
                  </h3>
                  <p style={{ margin: '4px 0', fontSize: 14, color: '#6B7280' }}>
                    {location.type} • {location.price}
                  </p>
                </div>
                <div style={{
                  background: getStatusColor(location.busyLevel),
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 700
                }}>
                  {location.available}/{location.total}
                </div>
              </div>
              <div style={{ marginTop: 8, display: 'flex', gap: 4 }}>
                {location.features.slice(0, 3).map((feature, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: '#F3F4F6',
                      padding: '2px 8px',
                      borderRadius: 12,
                      fontSize: 11,
                      color: '#6B7280'
                    }}
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // MAP VIEW
        <div style={{ position: 'relative', flex: 1 }}>
          <div ref={mapRef} style={{ position: 'absolute', inset: 0 }} />

          {/* Map Search */}
          <div style={{
            position: 'absolute', 
            left: 16, right: 16, 
            top: 16, 
            zIndex: 1000,
            background: 'white', 
            borderRadius: 12, 
            padding: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8 }}>
              <input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1, 
                  padding: '10px 12px', 
                  border: '1px solid #E5E7EB',
                  borderRadius: 8, 
                  fontSize: 14,
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '10px 20px', 
                  background: '#3B82F6', 
                  color: 'white',
                  border: 'none', 
                  borderRadius: 8, 
                  fontWeight: 600, 
                  cursor: 'pointer'
                }}
              >
                🔍
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CityMapPage;

