import React from 'react';
import AddParkingSpotForm from './AddParkingSpotForm';
import './AddSpotModal.css';

import { ParkingSpot } from '../types/ParkingSpot';

interface AddSpotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (spot: Omit<ParkingSpot, 'id'>) => void;
  userLocation: { lat: number; lng: number } | null;
}

const AddSpotModal: React.FC<AddSpotModalProps> = ({ isOpen, onClose, onSubmit, userLocation }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="add-spot-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add New Parking Spot</h3>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>
        
        <AddParkingSpotForm 
          onSubmit={onSubmit}
          onCancel={onClose}
          userLocation={userLocation}
        />
      </div>
    </div>
  );
};

export default AddSpotModal;
