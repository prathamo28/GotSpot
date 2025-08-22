import React from 'react';
import './ParkingList.css';

import { ParkingSpot } from '../types/ParkingSpot';

interface ParkingListProps {
  spots: ParkingSpot[];
  onSpotClick: (spotId: number) => void;
  userContributions: ParkingSpot[];
}

const ParkingList: React.FC<ParkingListProps> = ({ spots, onSpotClick, userContributions }) => {
  const getPriceCategory = (price: string) => {
    if (price.toLowerCase().includes('free') || price === '0') {
      return { color: '#38a169', label: 'Free' };
    } else if (price.includes('1') || price.includes('2')) {
      return { color: '#d69e2e', label: 'Cheap' };
    } else if (price.includes('3') || price.includes('4') || price.includes('5')) {
      return { color: '#ed8936', label: 'Moderate' };
    } else {
      return { color: '#e53e3e', label: 'Expensive' };
    }
  };

  const getSpotTypeIcon = (type: string) => {
    switch (type) {
      case 'mall': return '🏬';
      case 'office': return '🏢';
      case 'street': return '🛣️';
      case 'university': return '🎓';
      case 'hospital': return '🏥';
      case 'attraction': return '🎯';
      case 'transport': return '🚉';
      default: return '🅿️';
    }
  };

  if (spots.length === 0) {
    return (
      <div className="no-results">
        <div className="no-results-icon">🔍</div>
        <h3>No parking spots found</h3>
        <p>Try searching for a different location or check your search terms.</p>
      </div>
    );
  }

  return (
    <div className="parking-list">
      {spots.map(spot => {
        const priceInfo = getPriceCategory(spot.price);
        const isUserContributed = userContributions.some(uc => uc.id === spot.id);
        
        return (
          <div key={spot.id} className="spot-card" onClick={() => onSpotClick(spot.id)}>
            <div className="spot-header">
              <div className="spot-type-icon">
                {getSpotTypeIcon(spot.type)}
              </div>
              <div className="spot-info">
                <h3 className="spot-name">{spot.name}</h3>
                <p className="spot-address">{spot.address}</p>
              </div>
              <div className="spot-actions">
                {isUserContributed && (
                  <span className="user-contributed-badge">User Added</span>
                )}
                <div className="spot-rating">
                  <span className="rating-stars">
                    {'★'.repeat(Math.floor(spot.rating))}
                    {'☆'.repeat(5 - Math.floor(spot.rating))}
                  </span>
                  <span className="rating-number">{spot.rating}</span>
                </div>
              </div>
            </div>
            
            <div className="spot-details">
              <div className="spot-availability">
                <span className="available-spots">{spot.available} spots available</span>
                <span className="total-spots">out of {spot.total}</span>
              </div>
              
              <div className="spot-meta">
                <span className="price-category" style={{ backgroundColor: priceInfo.color }}>
                  {priceInfo.label}
                </span>
                <span className="spot-type">{spot.type}</span>
                {spot.distance && (
                  <span className="distance">{spot.distance.toFixed(1)} km away</span>
                )}
              </div>
            </div>
            
            <div className="spot-footer">
              <span className="last-updated">Updated: {spot.lastUpdated}</span>
              <div className="spot-features">
                {spot.features.slice(0, 3).map((feature, index) => (
                  <span key={index} className="feature-tag">{feature}</span>
                ))}
                {spot.features.length > 3 && (
                  <span className="feature-more">+{spot.features.length - 3} more</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ParkingList;
