'use client';

import React, { useState } from 'react';
import './vehicleTypeSelector.css';

export const VehicleTypeSelector = () => {
  const [selectedType, setSelectedType] = useState('');

  const vehicleTypes = [
    { id: 'cars', name: 'Cars' },
    { id: 'vans', name: 'Vans' },
    { id: 'suvs', name: 'SUVs' },
    { id: 'trucks', name: 'Trucks' },
    { id: 'bikes', name: 'Bikes' },
    { id: 'threewheelers', name: 'Threewheelers' },
    { id: 'lorries', name: 'Lorries' },
    { id: 'busses', name: 'Busses' }
  ];

  const handleTypeSelect = (typeId) => {
    setSelectedType(typeId);
  };

  return (
    <div className="vehicle-type-selector">
      <div className="container">
        <h2 className="section-title">Select Your Vehicle Type</h2>

        <div className="vehicle-grid fixed-4-cols">
          {vehicleTypes.map((type, index) => (
            <div
              key={type.id}
              className={`vehicle-card ${selectedType === type.id ? 'selected' : ''}`}
              onClick={() => handleTypeSelect(type.id)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <span className="vehicle-name">{type.name}</span>
              <div className="selection-indicator">
                {selectedType === type.id && <div className="check-mark">✓</div>}
              </div>
            </div>
          ))}
        </div>

        {selectedType && (
          <div className="selected-info">
            <p>
              Explore the Latest <strong>{vehicleTypes.find(t => t.id === selectedType)?.name}</strong>{' '}
              Collection Tailored for You
            </p>

            <button className="continue-btn"><span>Continue</span></button>
          </div>
        )}
      </div>
    </div>
  );
};
