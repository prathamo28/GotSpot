import React, { useState, useEffect } from 'react';

interface AddParkingSpotFormProps {
  onSubmit: (spot: Omit<any, 'id'>) => void;
  onCancel: () => void;
  userLocation: { lat: number; lng: number } | null;
}

const AddParkingSpotForm: React.FC<AddParkingSpotFormProps> = ({ onSubmit, onCancel, userLocation }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    type: 'street',
    price: '',
    total: 20,
    available: 10,
    rating: 4.0,
    features: [] as string[],
    description: ''
  });

  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [customCoordinates, setCustomCoordinates] = useState({ lat: 0, lng: 0 });

  useEffect(() => {
    if (userLocation && useCurrentLocation) {
      setCustomCoordinates(userLocation);
    }
  }, [userLocation, useCurrentLocation]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.address.trim()) {
      alert('Please fill in the name and address fields');
      return;
    }

    const newSpot = {
      name: formData.name.trim(),
      address: formData.address.trim(),
      available: formData.available,
      total: formData.total,
      price: formData.price || 'Free',
      type: formData.type,
      rating: formData.rating,
      lastUpdated: 'Just added',
      coordinates: useCurrentLocation && userLocation ? userLocation : customCoordinates,
      features: formData.features,
      images: [],
      isRealSpot: true
    };

    onSubmit(newSpot);
  };

  const featureOptions = [
    'Parking Machine', 'Covered', '24/7', 'Security', 'Lighting', 'Cameras',
    'Free WiFi', 'EV Charging', 'Disabled Access', 'Family Friendly', 'Tourist Area'
  ];

  return (
    <form onSubmit={handleSubmit} className="add-spot-form">
      <div className="form-section">
        <h4>📍 Basic Information</h4>
        
        <div className="form-group">
          <label>Parking Spot Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="e.g., Piastowska Street Parking Machine"
            required
          />
        </div>

        <div className="form-group">
          <label>Address *</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="e.g., Piastowska 15, 80-332 Gdańsk"
            required
          />
        </div>

        <div className="form-group">
          <label>Type</label>
          <select
            value={formData.type}
            onChange={(e) => handleInputChange('type', e.target.value)}
          >
            <option value="street">Street Parking</option>
            <option value="mall">Shopping Center</option>
            <option value="office">Office Building</option>
            <option value="university">University</option>
            <option value="hospital">Medical Center</option>
            <option value="attraction">Tourist Attraction</option>
            <option value="transport">Transport Hub</option>
          </select>
        </div>
      </div>

      <div className="form-section">
        <h4>💰 Pricing & Capacity</h4>
        
        <div className="form-group">
          <label>Price</label>
          <input
            type="text"
            value={formData.price}
            onChange={(e) => handleInputChange('price', e.target.value)}
            placeholder="e.g., 3 PLN/h, free after 18:00"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Total Spots</label>
            <input
              type="number"
              value={formData.total}
              onChange={(e) => handleInputChange('total', parseInt(e.target.value))}
              min="1"
              max="1000"
            />
          </div>
          
          <div className="form-group">
            <label>Available Now</label>
            <input
              type="number"
              value={formData.available}
              onChange={(e) => handleInputChange('available', parseInt(e.target.value))}
              min="0"
              max={formData.total}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Rating</label>
          <select
            value={formData.rating}
            onChange={(e) => handleInputChange('rating', parseFloat(e.target.value))}
          >
            <option value={1.0}>1.0 ⭐</option>
            <option value={1.5}>1.5 ⭐</option>
            <option value={2.0}>2.0 ⭐⭐</option>
            <option value={2.5}>2.5 ⭐⭐</option>
            <option value={3.0}>3.0 ⭐⭐⭐</option>
            <option value={3.5}>3.5 ⭐⭐⭐</option>
            <option value={4.0}>4.0 ⭐⭐⭐⭐</option>
            <option value={4.5}>4.5 ⭐⭐⭐⭐</option>
            <option value={5.0}>5.0 ⭐⭐⭐⭐⭐</option>
          </select>
        </div>
      </div>

      <div className="form-section">
        <h4>📍 Location</h4>
        
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={useCurrentLocation}
              onChange={(e) => setUseCurrentLocation(e.target.checked)}
            />
            Use my current location
          </label>
        </div>

        {!useCurrentLocation && (
          <div className="form-row">
            <div className="form-group">
              <label>Latitude</label>
              <input
                type="number"
                step="0.000001"
                value={customCoordinates.lat}
                onChange={(e) => setCustomCoordinates(prev => ({ ...prev, lat: parseFloat(e.target.value) }))}
                placeholder="54.3520"
              />
            </div>
            
            <div className="form-group">
              <label>Longitude</label>
              <input
                type="number"
                step="0.000001"
                value={customCoordinates.lng}
                onChange={(e) => setCustomCoordinates(prev => ({ ...prev, lng: parseFloat(e.target.value) }))}
                placeholder="18.6466"
              />
            </div>
          </div>
        )}

        {userLocation && (
          <div className="location-info">
            <small>📍 Your location: {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}</small>
          </div>
        )}
      </div>

      <div className="form-section">
        <h4>✨ Features & Amenities</h4>
        
        <div className="features-grid">
          {featureOptions.map(feature => (
            <label key={feature} className="feature-checkbox">
              <input
                type="checkbox"
                checked={formData.features.includes(feature)}
                onChange={() => handleFeatureToggle(feature)}
              />
              {feature}
            </label>
          ))}
        </div>
      </div>

      <div className="form-section">
        <h4>📝 Additional Details</h4>
        
        <div className="form-group">
          <label>Description (Optional)</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Any additional information about this parking spot..."
            rows={3}
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="cancel-button">
          Cancel
        </button>
        <button type="submit" className="submit-button">
          ➕ Add Parking Spot
        </button>
      </div>
    </form>
  );
};

export default AddParkingSpotForm;
