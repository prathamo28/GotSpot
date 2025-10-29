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

      // Color mapping for parking types
      const typeColors: Record<string, string> = {
        'mall': 'rgba(59, 130, 246, 0.4)',      // Blue for malls
        'office': 'rgba(239, 68, 68, 0.4)',     // Red for offices
        'street': 'rgba(236, 72, 153, 0.4)',    // Pink for street parking
        'university': 'rgba(34, 197, 94, 0.4)', // Green for universities (cheap)
        'hospital': 'rgba(251, 146, 60, 0.4)',  // Orange for hospitals
        'attraction': 'rgba(168, 85, 247, 0.4)' // Purple for attractions
      };

      // Add parking location markers with circular areas
      PARKING_LOCATIONS.forEach((location) => {
        // Add small circle around parking spot (better for mobile)
        const circle = L.circle([location.lat, location.lng], {
          radius: 300,
          color: typeColors[location.type] || 'rgba(100, 100, 100, 0.4)',
          fillColor: typeColors[location.type] || 'rgba(100, 100, 100, 0.3)',
          fillOpacity: 0.3,
          weight: 1
        })
          .bindPopup(`
            <strong>${location.name}</strong><br>
            Type: ${location.type}<br>
            Available: ${location.available}/${location.total}<br>
            Price: ${location.price}<br>
            Rating: ${location.rating}⭐
          `)
          .addTo(mapInstance.current);

        // Add colorful marker based on type
        const markerColors: Record<string, string> = {
          'mall': 'blue',
          'office': 'red',
          'street': 'violet',
          'university': 'green',
          'hospital': 'orange',
          'attraction': 'purple'
        };
        
        const color = markerColors[location.type] || 'green';
        const iconUrl = `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`;
        
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
            <strong>Parking Types:</strong> 
            <span style={{ margin: '0 8px' }}><span style={{ color: '#3B82F6' }}>Blue</span> = Mall</span>
            <span style={{ margin: '0 8px' }}><span style={{ color: '#EF4444' }}>Red</span> = Office</span>
            <span style={{ margin: '0 8px' }}><span style={{ color: '#22C55E' }}>Green</span> = University (Cheap)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityMapPage;

