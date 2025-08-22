import React from 'react';
import './SearchSection.css';

interface SearchSectionProps {
  destination: string;
  onDestinationChange: (value: string) => void;
  onSearch: () => void;
  loading: boolean;
  viewMode: 'list' | 'map';
  onViewModeChange: (mode: 'list' | 'map') => void;
}

const SearchSection: React.FC<SearchSectionProps> = ({
  destination,
  onDestinationChange,
  onSearch,
  loading,
  viewMode,
  onViewModeChange
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="search-section">
      <div className="search-container">
        <div className="search-input-group">
          <input
            type="text"
            value={destination}
            onChange={(e) => onDestinationChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search for parking near..."
            className="search-input"
            disabled={loading}
          />
          <button
            onClick={onSearch}
            className="search-button"
            disabled={loading || !destination.trim()}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>
      
      <div className="view-toggle">
        <button
          className={`toggle-button ${viewMode === 'list' ? 'active' : ''}`}
          onClick={() => onViewModeChange('list')}
        >
          List View
        </button>
        <button
          className={`toggle-button ${viewMode === 'map' ? 'active' : ''}`}
          onClick={() => onViewModeChange('map')}
        >
          Map View
        </button>
      </div>
    </div>
  );
};

export default SearchSection;
