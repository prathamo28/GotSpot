import React from 'react';
import './Statistics.css';

interface StatisticsProps {
  totalSpots: number;
  availableSpots: number;
  realSpots: number;
  demoSpots: number;
  userContributions: number;
}

const Statistics: React.FC<StatisticsProps> = ({
  totalSpots,
  availableSpots,
  realSpots,
  demoSpots,
  userContributions
}) => {
  const occupancyRate = totalSpots > 0 ? ((totalSpots - availableSpots) / totalSpots * 100).toFixed(1) : '0';
  const realDataPercentage = totalSpots > 0 ? ((realSpots / totalSpots) * 100) : 0;

  return (
    <div className="statistics-dashboard">
      <div className="stats-header">
        <h3>📊 Parking Statistics</h3>
        <p>Real-time overview of GotSpot data</p>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">🚗</div>
          <div className="stat-content">
            <span className="stat-number">{totalSpots}</span>
            <span className="stat-label">Total Spots</span>
          </div>
        </div>
        
        <div className="stat-card success">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <span className="stat-number">{availableSpots}</span>
            <span className="stat-label">Available Now</span>
          </div>
        </div>
        
        <div className="stat-card info">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <span className="stat-number">{occupancyRate}%</span>
            <span className="stat-label">Occupancy Rate</span>
          </div>
        </div>
        
                 <div className="stat-card warning">
           <div className="stat-icon">🌍</div>
           <div className="stat-content">
             <span className="stat-number">{realDataPercentage.toFixed(1)}%</span>
             <span className="stat-label">Real Data</span>
           </div>
         </div>
      </div>
      
      <div className="stats-details">
        <div className="detail-row">
          <div className="detail-item">
            <span className="detail-label">Real-time spots</span>
            <span className="detail-value">{realSpots}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Demo spots</span>
            <span className="detail-value">{demoSpots}</span>
          </div>
        </div>
        
        <div className="detail-row">
          <div className="detail-item">
            <span className="detail-label">User contributions</span>
            <span className="detail-value">{userContributions}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Coverage area</span>
            <span className="detail-value">Gdansk</span>
          </div>
        </div>
      </div>
      
      <div className="stats-footer">
        <div className="data-quality">
          <span className="quality-indicator">
            {realDataPercentage >= 50 ? '🟢' : realDataPercentage >= 25 ? '🟡' : '🔴'}
          </span>
          <span className="quality-text">
            {realDataPercentage >= 50 ? 'High quality data' : 
             realDataPercentage >= 25 ? 'Moderate quality data' : 'Limited real data'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
