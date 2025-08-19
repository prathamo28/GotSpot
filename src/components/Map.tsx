import React, { useState } from 'react';

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
  const [hoveredSpot, setHoveredSpot] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);

  // Custom map coordinates for Gdansk (simplified for demo)
  const mapCenter = { x: 200, y: 150 };
  const mapScale = zoom * 0.8;

  // Convert real coordinates to map coordinates (simplified)
  const getMapPosition = (lat: number, lng: number) => {
    // Simplified conversion for demo purposes
    const x = mapCenter.x + (lng - 18.6466) * 1000 * mapScale;
    const y = mapCenter.y + (54.3520 - lat) * 1000 * mapScale;
    return { x, y };
  };

  const getSpotIcon = (type: string) => {
    switch(type) {
      case 'mall': return '🏬';
      case 'office': return '🏢';
      case 'street': return '🛣️';
      case 'university': return '🎓';
      case 'hospital': return '🏥';
      case 'attraction': return '🎡';
      default: return '🅿️';
    }
  };

  const getSpotColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'mall': '#FF6B6B',
      'office': '#4ECDC4',
      'street': '#45B7D1',
      'university': '#96CEB4',
      'hospital': '#FFEAA7',
      'attraction': '#DDA0DD'
    };
    return colors[type] || '#FF6B6B';
  };

  const getAvailabilityColor = (available: number) => {
    if (available === 0) return '#dc2626';
    if (available < 5) return '#ca8a04';
    if (available < 20) return '#f59e0b';
    return '#16a34a';
  };

  return (
    <div className="map-container">
      <div className="custom-map">
        {/* Map Background */}
        <svg 
          width="100%" 
          height="400" 
          viewBox="0 0 400 300"
          className="map-svg"
        >
          {/* Background */}
          <rect width="400" height="300" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2"/>
          
          {/* Map Title */}
          <text x="200" y="25" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#374151">
            🗺️ Gdansk Parking Map
          </text>
          
          {/* Grid Lines */}
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e2e8f0" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="400" height="300" fill="url(#grid)"/>
          
          {/* Water Areas (simplified) */}
          <ellipse cx="80" cy="80" rx="30" ry="20" fill="#bfdbfe" opacity="0.3"/>
          <ellipse cx="320" cy="220" rx="25" ry="15" fill="#bfdbfe" opacity="0.3"/>
          
          {/* Main Roads */}
          <path d="M 50 150 L 350 150" stroke="#94a3b8" strokeWidth="3" fill="none"/>
          <path d="M 200 50 L 200 250" stroke="#94a3b8" strokeWidth="3" fill="none"/>
          
          {/* Parking Spots */}
          {parkingSpots.map((spot) => {
            const pos = getMapPosition(spot.coordinates.lat, spot.coordinates.lng);
            const isSelected = selectedSpot === spot.id;
            const isHovered = hoveredSpot === spot.id;
            
            return (
              <g key={spot.id}>
                {/* Spot Circle */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isSelected ? 12 : isHovered ? 10 : 8}
                  fill={getSpotColor(spot.type)}
                  stroke={isSelected ? "#1d4ed8" : "#ffffff"}
                  strokeWidth={isSelected ? 3 : 2}
                  opacity={isSelected ? 1 : 0.8}
                  className="parking-spot"
                  onMouseEnter={() => setHoveredSpot(spot.id)}
                  onMouseLeave={() => setHoveredSpot(null)}
                  onClick={() => onSpotSelect && onSpotSelect(spot.id)}
                  style={{ cursor: 'pointer' }}
                />
                
                {/* Spot Icon */}
                <text
                  x={pos.x}
                  y={pos.y + 4}
                  textAnchor="middle"
                  fontSize={isSelected ? 14 : 12}
                  fill="white"
                  fontWeight="bold"
                >
                  {getSpotIcon(spot.type)}
                </text>
                
                {/* Availability Indicator */}
                <circle
                  cx={pos.x + 15}
                  cy={pos.y - 15}
                  r={6}
                  fill={getAvailabilityColor(spot.available)}
                  stroke="white"
                  strokeWidth="1"
                />
                <text
                  x={pos.x + 15}
                  y={pos.y - 12}
                  textAnchor="middle"
                  fontSize="8"
                  fill="white"
                  fontWeight="bold"
                >
                  {spot.available}
                </text>
                
                {/* Hover/Selection Info */}
                {(isHovered || isSelected) && (
                  <g>
                    {/* Info Background */}
                    <rect
                      x={pos.x + 20}
                      y={pos.y - 30}
                      width="120"
                      height="80"
                      fill="white"
                      stroke="#e5e7eb"
                      strokeWidth="1"
                      rx="8"
                      filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))"
                    />
                    
                    {/* Spot Name */}
                    <text
                      x={pos.x + 26}
                      y={pos.y - 15}
                      fontSize="10"
                      fontWeight="bold"
                      fill="#374151"
                    >
                      {spot.name.length > 15 ? spot.name.substring(0, 15) + '...' : spot.name}
                    </text>
                    
                    {/* Address */}
                    <text
                      x={pos.x + 26}
                      y={pos.y - 5}
                      fontSize="8"
                      fill="#6b7280"
                    >
                      {spot.address.split(',')[0]}
                    </text>
                    
                    {/* Price */}
                    <text
                      x={pos.x + 26}
                      y={pos.y + 5}
                      fontSize="8"
                      fill="#059669"
                      fontWeight="bold"
                    >
                      {spot.price}
                    </text>
                    
                    {/* Rating */}
                    <text
                      x={pos.x + 26}
                      y={pos.y + 15}
                      fontSize="8"
                      fill="#f59e0b"
                    >
                      ⭐ {spot.rating}
                    </text>
                    
                    {/* Action Button */}
                    <rect
                      x={pos.x + 26}
                      y={pos.y + 20}
                      width="60"
                      height="20"
                      fill="#2563eb"
                      rx="4"
                      style={{ cursor: 'pointer' }}
                      onClick={() => onSpotSelect && onSpotSelect(spot.id)}
                    />
                    <text
                      x={pos.x + 56}
                      y={pos.y + 32}
                      fontSize="8"
                      fill="white"
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      Select
                    </text>
                  </g>
                )}
              </g>
            );
          })}
          
          {/* User Location */}
          {userLocation && (
            <g>
              <circle
                cx={mapCenter.x}
                cy={mapCenter.y}
                r={8}
                fill="#2563eb"
                stroke="white"
                strokeWidth="2"
              />
              <text
                x={mapCenter.x}
                y={mapCenter.y + 4}
                textAnchor="middle"
                fontSize="12"
                fill="white"
                fontWeight="bold"
              >
                📍
              </text>
              <text
                x={mapCenter.x}
                y={mapCenter.y + 25}
                textAnchor="middle"
                fontSize="10"
                fill="#2563eb"
                fontWeight="bold"
              >
                You
              </text>
            </g>
          )}
          
          {/* Legend */}
          <g>
            <rect x="10" y="10" width="150" height="80" fill="white" stroke="#e5e7eb" rx="8" opacity="0.9"/>
            <text x="20" y="25" fontSize="10" fontWeight="bold" fill="#374151">Legend</text>
            
            {/* Mall */}
            <circle cx="25" cy="40" r="4" fill="#FF6B6B"/>
            <text x="35" y="43" fontSize="8" fill="#374151">🏬 Shopping</text>
            
            {/* Office */}
            <circle cx="25" cy="55" r="4" fill="#4ECDC4"/>
            <text x="35" y="58" fontSize="8" fill="#374151">🏢 Business</text>
            
            {/* University */}
            <circle cx="25" cy="70" r="4" fill="#96CEB4"/>
            <text x="35" y="73" fontSize="8" fill="#374151">🎓 Education</text>
            
            {/* Street */}
            <circle cx="85" cy="40" r="4" fill="#45B7D1"/>
            <text x="95" y="43" fontSize="8" fill="#374151">🛣️ Street</text>
            
            {/* Hospital */}
            <circle cx="85" cy="55" r="4" fill="#FFEAA7"/>
            <text x="95" y="58" fontSize="8" fill="#374151">🏥 Medical</text>
            
            {/* Attraction */}
            <circle cx="85" cy="70" r="4" fill="#DDA0DD"/>
            <text x="95" y="73" fontSize="8" fill="#374151">🎡 Attraction</text>
          </g>
        </svg>
      </div>
      
      {/* Map Controls */}
      <div className="map-controls">
        <button 
          className="map-control-btn"
          onClick={() => setZoom(Math.min(zoom + 0.2, 2))}
          title="Zoom In"
        >
          ➕
        </button>
        <button 
          className="map-control-btn"
          onClick={() => setZoom(Math.max(zoom - 0.2, 0.5))}
          title="Zoom Out"
        >
          ➖
        </button>
        <button 
          className="map-control-btn"
          onClick={() => setZoom(1)}
          title="Reset Zoom"
        >
          🔄
        </button>
        {userLocation && (
          <button 
            className="map-control-btn"
            onClick={() => setZoom(1)}
            title="Center on my location"
          >
            📍
          </button>
        )}
      </div>
      
      {/* Map Instructions */}
      <div className="map-instructions">
        <p>🗺️ <strong>Interactive Map:</strong> Click on parking spots to select them • Hover for details • Use controls to zoom</p>
      </div>
    </div>
  );
};

export default Map;
