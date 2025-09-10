import React, { useMemo, useState } from 'react';

interface CitySelectProps {
  onSelect: (city: string) => void;
}

const POLISH_MAJOR_CITIES: string[] = [
  'Warsaw',
  'Kraków',
  'Łódź',
  'Wrocław',
  'Poznań',
  'Gdańsk',
  'Szczecin',
  'Bydgoszcz',
  'Lublin',
  'Katowice',
  'Białystok',
  'Gdynia',
  'Częstochowa',
  'Radom',
  'Toruń',
  'Rzeszów',
  'Olsztyn',
  'Kielce',
  'Opole',
  'Zielona Góra'
];

const CitySelect: React.FC<CitySelectProps> = ({ onSelect }) => {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return POLISH_MAJOR_CITIES;
    return POLISH_MAJOR_CITIES.filter(c => c.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="welcome-container" style={{ maxWidth: 520 }}>
      <h1>Select your city</h1>
      <p style={{ marginBottom: 20, color: '#64748B' }}>Choose a major city in Poland to continue.</p>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search city..."
        style={{
          width: '100%',
          padding: '12px 14px',
          border: '2px solid #E5E7EB',
          borderRadius: 10,
          fontSize: 16,
          marginBottom: 14
        }}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {filtered.map(city => (
          <button
            key={city}
            onClick={() => onSelect(city)}
            style={{
              textAlign: 'left',
              padding: '12px 14px',
              borderRadius: 10,
              border: '1px solid #E5E7EB',
              background: 'white',
              cursor: 'pointer',
              fontSize: 15,
              fontWeight: 600,
              color: '#0F172A'
            }}
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CitySelect;
