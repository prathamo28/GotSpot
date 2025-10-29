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

      // Add parking location markers
      PARKING_LOCATIONS.forEach((location) => {
        const greenIcon = new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });

        const marker = L.marker([location.lat, location.lng], { icon: greenIcon })
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
          <input
            placeholder="Where do you want to park?"
            style={{
              width: '100%', padding: '14px 16px', border: '2px solid #E5E7EB',
              borderRadius: 12, fontSize: 16
            }}
          />

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
        </div>
      </div>
    </div>
  );
};

export default CityMapPage;

