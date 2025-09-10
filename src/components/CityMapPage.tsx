import React, { useEffect, useRef } from 'react';
import { POLISH_CITIES } from '../data/cities';

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

      L.marker([cityInfo.lat, cityInfo.lng]).addTo(mapInstance.current);
    })();
    return () => {
      isMounted = false;
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [city]);

  const quickChips = ['Home', 'Work', 'New'];

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
            placeholder="Where to?"
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
