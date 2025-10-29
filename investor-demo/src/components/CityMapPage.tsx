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

      // Color mapping based on BUSY LEVEL (not type)
      const busyColors: Record<string, string> = {
        'busy': 'rgba(239, 68, 68, 0.5)',     // RED - Very busy (Oliwa office area)
        'moderate': 'rgba(251, 146, 60, 0.5)', // ORANGE - Moderate
        'free': 'rgba(34, 197, 94, 0.5)'       // GREEN - Mostly free (Metropolia area)
      };

      // Add parking location markers with circular areas
      PARKING_LOCATIONS.forEach((location) => {
        // Add small circle around parking spot (better for mobile)
        // Color based on BUSY LEVEL
        const fillColor = busyColors[location.busyLevel] || 'rgba(100, 100, 100, 0.3)';
        const circle = L.circle([location.lat, location.lng], {
          radius: 300,
          color: fillColor,
          fillColor: fillColor,
          fillOpacity: 0.4,
          weight: 2
        })
          .bindPopup(`
            <strong>${location.name}</strong><br>
            Type: ${location.type}<br>
            Available: ${location.available}/${location.total}<br>
            Price: ${location.price}<br>
            Rating: ${location.rating}⭐
          `)
          .addTo(mapInstance.current);

        // Add colorful marker based on BUSY LEVEL
        const markerColor = location.busyLevel === 'busy' ? 'red' : 
                           location.busyLevel === 'moderate' ? 'orange' : 'green';
        const iconUrl = `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${markerColor}.png`;
        
        const icon = new L.Icon({
          iconUrl: iconUrl,
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
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

  const quickChips = ['Home', 'Work', 'Shopping'];

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', flex: 1 }}>
        <div ref={mapRef} style={{ position: 'absolute', inset: 0 }} />

        <button
          onClick={onBack}
          style={{
            position: 'absolute', top: 16, left: 16, zIndex: 1000,
            background: 'white', border: '1px solid #E5E7EB', borderRadius: 12,
            padding: '10px 12px', fontWeight: 700, cursor: 'pointer'
          }}
        >
          ← Back
        </button>

        <div style={{
          position: 'absolute', left: 16, right: 16, bottom: 90, zIndex: 1000,
          background: 'white', borderRadius: 16, border: '1px solid #E5E7EB',
          padding: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
        }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8 }}>
            <input
              placeholder="Try: Olivia, Forum, Zoo, University..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1, padding: '14px 16px', border: '2px solid #E5E7EB',
                borderRadius: 12, fontSize: 16
              }}
            />
            <button
              type="submit"
              style={{
                padding: '14px 24px', background: '#3B82F6', color: 'white',
                border: 'none', borderRadius: 12, fontWeight: 600, cursor: 'pointer'
              }}
            >
              Search
            </button>
          </form>

          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            {quickChips.map(label => (
              <button key={label} style={{
                padding: '10px 14px', borderRadius: 12, border: '1px solid #E5E7EB',
                background: '#FFF', fontWeight: 700, cursor: 'pointer'
              }}>
                {label}
              </button>
            ))}
          </div>

          <div style={{ marginTop: 12, fontSize: 12, color: '#666' }}>
            <strong>Parking Availability:</strong> 
            <span style={{ margin: '0 8px' }}><span style={{ color: '#EF4444' }}>🔴 Red</span> = Very Busy (Oliwa)</span>
            <span style={{ margin: '0 8px' }}><span style={{ color: '#F99160' }}>🟠 Orange</span> = Moderate</span>
            <span style={{ margin: '0 8px' }}><span style={{ color: '#22C55E' }}>🟢 Green</span> = Free (Metropolia)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityMapPage;

