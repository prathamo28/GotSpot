import React from 'react';
import './ParkingDetails.css';

import { ParkingSpot } from '../types/ParkingSpot';

interface ParkingDetailsProps {
  spot: ParkingSpot | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateSpot: (spotId: number, updates: Partial<ParkingSpot>) => void;
}

const ParkingDetails: React.FC<ParkingDetailsProps> = ({ spot, isOpen, onClose, onUpdateSpot }) => {
  if (!isOpen || !spot) return null;

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

  const priceInfo = getPriceCategory(spot.price);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{spot.name}</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>
        
        <div className="modal-content">
          {/* Image Gallery */}
          <div className="image-gallery">
            {spot.images && spot.images.length > 0 ? (
              <div className="gallery-container">
                {spot.images.map((image, index) => (
                  <img key={index} src={image} alt={`${spot.name} - Image ${index + 1}`} />
                ))}
              </div>
            ) : (
              <div className="no-images">
                <div className="no-images-icon">📷</div>
                <p>No images available</p>
              </div>
            )}
          </div>
          
          {/* Basic Information */}
          <div className="info-section">
            <h3>📍 Location & Details</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Address</span>
                <span className="info-value">{spot.address}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Type</span>
                <span className="info-value">{spot.type}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Price</span>
                <span className="info-value price-tag" style={{ backgroundColor: priceInfo.color }}>
                  {spot.price}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Rating</span>
                <span className="info-value">
                  <span className="rating-display">
                    {'★'.repeat(Math.floor(spot.rating))}
                    {'☆'.repeat(5 - Math.floor(spot.rating))}
                  </span>
                  <span className="rating-text">{spot.rating}/5</span>
                </span>
              </div>
            </div>
          </div>
          
          {/* Availability */}
          <div className="info-section">
            <h3>🚗 Availability</h3>
            <div className="availability-display">
              <div className="availability-item">
                <span className="availability-number available">{spot.available}</span>
                <span className="availability-label">Available Now</span>
              </div>
              <div className="availability-item">
                <span className="availability-number total">{spot.total}</span>
                <span className="availability-label">Total Spots</span>
              </div>

            </div>
          </div>
          
          {/* Features */}
          <div className="info-section">
            <h3>✨ Features & Amenities</h3>
            <div className="features-grid">
              {spot.features.map((feature, index) => (
                <span key={index} className="feature-pill">{feature}</span>
              ))}
            </div>
          </div>
          
          {/* Last Updated */}
          <div className="info-section">
            <h3>📅 Status</h3>
            <div className="status-info">
              <span className="last-updated">Last updated: {spot.lastUpdated}</span>
              {spot.isRealSpot && (
                <span className="real-spot-badge">Real-time data</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="secondary-button" onClick={onClose}>
            Close
          </button>
          <button 
            className="primary-button"
            onClick={() => onUpdateSpot(spot.id, { available: Math.max(0, spot.available - 1) })}
            disabled={spot.available === 0}
          >
            Mark as Used
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParkingDetails;
