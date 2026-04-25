import React from 'react';
import '../styles/SummaryCard.css';

const SummaryCard = ({ icon, title, value, description, color = 'primary' }) => {
  return (
    <div className={`summary-card summary-card-${color}`}>
      <div className="card-icon">
        {icon}
      </div>
      <div className="card-content">
        <p className="card-title">{title}</p>
        <h3 className="card-value">{value}</h3>
        {description && <p className="card-description">{description}</p>}
      </div>
    </div>
  );
};

export default SummaryCard;
