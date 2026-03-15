import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

const StatsCard = ({ value, total, label, color = '#000080' }) => {
  const percentage = total > 0 ? (value / total) * 100 : 0;

  return (
    <div className="stat-card glass-card">
      <div className="stat-circle">
        <CircularProgressbar 
          value={percentage} 
          text={`${value}`}
          styles={buildStyles({
            textSize: '24px',
            pathColor: color,
            textColor: color,
          })}
        />
      </div>
      <h3>{label}</h3>
    </div>
  );
};

export default StatsCard;