import React from 'react';
import { ParkingSpot } from '../types/ParkingSpot';
import './ParkingList.css';

interface ParkingListProps {
  parkingSpots: ParkingSpot[];
  onSpotSelect: (spotId: number) => void;
}

const ParkingList: React.FC<ParkingListProps> = ({ parkingSpots, onSpotSelect }) => {
  if (!parkingSpots.length) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🚗</div>
        <h3>No parking spots found</h3>
        <p>Try searching for a different destination or location</p>
      </div>
    );
  }

  return (
    <div className="parking-list">
      {parkingSpots.map((spot) => (
        <div
          key={spot.id}
          className="parking-item"
          onClick={() => onSpotSelect(spot.id)}
        >
          {/* Real vs Demo Data Indicator */}
          {spot.isRealSpot && (
            <div className="real-spot-badge">
              🗺️ Live Data
            </div>
          )}
          
          <div className="parking-header">
            <h3 className="parking-name">{spot.name}</h3>
            <span className="parking-type">{spot.type}</span>
          </div>
          
          <p className="parking-address">{spot.address}</p>
          
          <div className="parking-stats">
            <div className="stat-item">
              <span className={`stat-number available`}>
                {spot.available}
              </span>
              <span className="stat-label">Available</span>
            </div>
            <div className="stat-item">
              <span className="stat-number total">
                {spot.total}
              </span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-item">
              <span className="stat-number distance">
                {spot.isRealSpot ? 'Live' : 'Demo'}
              </span>
              <span className="stat-label">Data Source</span>
            </div>
          </div>
          
          <div className="parking-features">
            {spot.features.slice(0, 4).map((feature, index) => (
              <span key={index} className="feature-tag">
                {feature}
              </span>
            ))}
            {spot.features.length > 4 && (
              <span className="feature-tag">
                +{spot.features.length - 4} more
              </span>
            )}
          </div>
          
          <div className="parking-footer">
            <div className="parking-rating">
              <span className="rating-stars">
                {'★'.repeat(Math.floor(spot.rating))}
                {'☆'.repeat(5 - Math.floor(spot.rating))}
              </span>
              <span>{spot.rating.toFixed(1)}</span>
            </div>
            
            <div className={`parking-price ${spot.price === 'Free' ? 'free' : 'paid'}`}>
              {spot.price}
            </div>
          </div>
          
          <p className="last-updated">
            {spot.isRealSpot ? '🔄 Live data from Google Maps' : '📊 Demo data for testing'}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ParkingList;
