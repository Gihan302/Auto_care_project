'use client';

import React, { useState, useEffect } from 'react';
import styles from './compare.module.css';

// Mock data for vehicle makes and models
const carMakes = [
  'Toyota', 'Honda', 'Ford', 'Chevrolet', 'BMW', 'Mercedes-Benz', 'Audi', 'Nissan', 'Hyundai', 'Mazda'
];

const carModels = {
  'Toyota': ['Camry', 'Corolla', 'RAV4', 'Prius', 'Highlander', 'Sienna'],
  'Honda': ['Civic', 'Accord', 'CR-V', 'Pilot', 'Odyssey', 'HR-V'],
  'Ford': ['F-150', 'Explorer', 'Escape', 'Mustang', 'Edge', 'Fusion'],
  'Chevrolet': ['Silverado', 'Equinox', 'Malibu', 'Tahoe', 'Cruze', 'Impala'],
  'BMW': ['3 Series', '5 Series', 'X3', 'X5', 'i3', 'i8'],
  'Mercedes-Benz': ['C-Class', 'E-Class', 'GLC', 'GLE', 'S-Class', 'A-Class'],
  'Audi': ['A3', 'A4', 'Q3', 'Q5', 'A6', 'Q7'],
  'Nissan': ['Altima', 'Sentra', 'Rogue', 'Pathfinder', 'Murano', 'Maxima'],
  'Hyundai': ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Accent', 'Genesis'],
  'Mazda': ['Mazda3', 'Mazda6', 'CX-5', 'CX-9', 'MX-5', 'CX-3']
};

// Mock vehicle data
const vehicleData = {
  'Toyota Camry': {
    year: 2024,
    make: 'Toyota',
    model: 'Camry',
    trim: 'LE',
    msrp: 25295,
    marketAverage: 26500,
    rating: 4.2,
    totalReviews: 1247,
    image: '/car 1.jpg',
    specs: {
      'Engine': '2.5L 4-Cylinder',
      'MPG City/Highway': '28/39',
      'Transmission': '8-Speed Automatic',
      'Drivetrain': 'FWD',
      'Seating': '5 passengers',
      'Safety Rating': '5 stars'
    }
  },
  'Honda Civic': {
    year: 2024,
    make: 'Honda',
    model: 'Civic',
    trim: 'LX',
    msrp: 23750,
    marketAverage: 24800,
    rating: 4.5,
    totalReviews: 892,
    image: '/car 3.jpg',
    specs: {
      'Engine': '2.0L 4-Cylinder',
      'MPG City/Highway': '31/40',
      'Transmission': 'CVT',
      'Drivetrain': 'FWD',
      'Seating': '5 passengers',
      'Safety Rating': '5 stars'
    }
  },
  'Ford F-150': {
    year: 2024,
    make: 'Ford',
    model: 'F-150',
    trim: 'Regular Cab',
    msrp: 33695,
    marketAverage: 35200,
    rating: 4.3,
    totalReviews: 2156,
    image: '/car 1.jpg',
    specs: {
      'Engine': '3.3L V6',
      'MPG City/Highway': '19/25',
      'Transmission': '10-Speed Automatic',
      'Drivetrain': 'RWD',
      'Seating': '3 passengers',
      'Safety Rating': '4 stars'
    }
  },
  'BMW 3 Series': {
    year: 2024,
    make: 'BMW',
    model: '3 Series',
    trim: '330i',
    msrp: 36350,
    marketAverage: 38500,
    rating: 4.4,
    totalReviews: 734,
    image: '/car 1.jpg',
    specs: {
      'Engine': '2.0L Turbo 4-Cylinder',
      'MPG City/Highway': '26/36',
      'Transmission': '8-Speed Automatic',
      'Drivetrain': 'RWD',
      'Seating': '5 passengers',
      'Safety Rating': '5 stars'
    }
  }
};

const VehicleSelector = ({ id, selectedMake, selectedModel, onMakeChange, onModelChange, onRemove, canRemove, index }) => {
  const availableModels = selectedMake ? carModels[selectedMake] || [] : [];

  const handleMakeChange = (e) => {
    const value = e.target.value;
    onMakeChange(value);
    // Reset model when make changes
    if (selectedModel) {
      onModelChange('');
    }
  };

  const handleModelChange = (e) => {
    const value = e.target.value;
    onModelChange(value);
  };

  return (
    <div className={styles.vehicleSelector}>
      {canRemove && onRemove && (
        <button
          className={styles.removeButton}
          onClick={onRemove}
        >
          ×
        </button>
      )}
      
      <h3 className={styles.vehicleTitle}>
        Vehicle {index + 1}
      </h3>
      
      <div className={styles.selectGroup}>
        <div className={styles.selectContainer}>
          <label className={styles.label}>Make</label>
          <select 
            value={selectedMake} 
            onChange={handleMakeChange}
            className={styles.select}
          >
            <option value="">Select make</option>
            {carMakes.map((make) => (
              <option key={make} value={make}>
                {make}
              </option>
            ))}
          </select>
        </div>
        
        <div className={styles.selectContainer}>
          <label className={styles.label}>Model</label>
          <select 
            value={selectedModel} 
            onChange={handleModelChange}
            disabled={!selectedMake}
            className={styles.select}
          >
            <option value="">Select model</option>
            {availableModels.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

const ComparisonView = ({ vehicles, onBack }) => {
  const [hideSimmilarities, setHideSimilarities] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSpecs = (vehicle) => {
    if (!vehicle.specs) return {};
    
    let specs = { ...vehicle.specs };
    
    if (searchTerm) {
      specs = Object.fromEntries(
        Object.entries(specs).filter(([key, value]) =>
          key.toLowerCase().includes(searchTerm.toLowerCase()) ||
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    return specs;
  };

  return (
    <div className={styles.comparisonView}>
      <div className={styles.comparisonHeader}>
        <button onClick={onBack} className={styles.backButton}>
          ← Back to Selection
        </button>
        <h1 className={styles.comparisonTitle}>
          Vehicle Comparison
        </h1>
      </div>

      <div className={styles.filterControls}>
        <div className={styles.filterOptions}>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={hideSimmilarities}
              onChange={(e) => setHideSimilarities(e.target.checked)}
            />
            Hide Similarities
          </label>
        </div>
        
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search specifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.comparisonTable}>
        <div className={styles.tableHeader}>
          <div className={styles.specColumn}>Specification</div>
          {vehicles.map((vehicle, index) => (
            <div key={index} className={styles.vehicleColumn}>
              <div className={styles.vehicleInfo}>
                <img
                  src={vehicle.image}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className={styles.vehicleImage}
                />
                <div className={styles.vehicleDetails}>
                  <h3>{vehicle.year} {vehicle.make} {vehicle.model}</h3>
                  <p className={styles.trim}>{vehicle.trim}</p>
                </div>
              </div>
              <div className={styles.actionButtons}>
                <button className={styles.primaryButton}>
                  Build & Price
                </button>
                <button className={styles.secondaryButton}>
                  See Overview
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.tableBody}>
          {/* Basic Info */}
          <div className={styles.specRow}>
            <div className={styles.specName}>Starting MSRP</div>
            {vehicles.map((vehicle, index) => (
              <div key={index} className={styles.specValue}>
                ${vehicle.msrp.toLocaleString()}*
              </div>
            ))}
          </div>

          <div className={styles.specRow}>
            <div className={styles.specName}>Market Average</div>
            {vehicles.map((vehicle, index) => (
              <div key={index} className={styles.specValue}>
                ${vehicle.marketAverage.toLocaleString()}
              </div>
            ))}
          </div>

          <div className={styles.specRow}>
            <div className={styles.specName}>Rating</div>
            {vehicles.map((vehicle, index) => (
              <div key={index} className={styles.specValue}>
                <div className={styles.rating}>
                  <span className={styles.ratingValue}>{vehicle.rating}</span>
                  <div className={styles.stars}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`${styles.star} ${star <= Math.floor(vehicle.rating) ? styles.filled : ''}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className={styles.reviewCount}>({vehicle.totalReviews.toLocaleString()})</span>
                </div>
              </div>
            ))}
          </div>

          {/* Specifications */}
          {vehicles.length > 0 && filteredSpecs(vehicles[0]) && 
            Object.keys(filteredSpecs(vehicles[0])).map((specKey) => (
              <div key={specKey} className={styles.specRow}>
                <div className={styles.specName}>{specKey}</div>
                {vehicles.map((vehicle, index) => (
                  <div key={index} className={styles.specValue}>
                    {filteredSpecs(vehicle)[specKey] || 'N/A'}
                  </div>
                ))}
              </div>
            ))
          }

          {/* Additional Options */}
          <div className={styles.specRow}>
            <div className={styles.specName}>TruePrice</div>
            {vehicles.map((vehicle, index) => (
              <div key={index} className={styles.specValue}>
                <button className={styles.linkButton}>
                  {vehicle.make} {vehicle.model} Pricing
                </button>
              </div>
            ))}
          </div>

          <div className={styles.specRow}>
            <div className={styles.specName}>Lease Deals</div>
            {vehicles.map((vehicle, index) => (
              <div key={index} className={styles.specValue}>
                <button className={styles.linkButton}>
                  {vehicle.make} {vehicle.model} Lease Deals
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function VehicleComparisonPage() {
  const [vehicles, setVehicles] = useState([
    { id: '1', make: '', model: '' },
    { id: '2', make: '', model: '' }
  ]);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonData, setComparisonData] = useState([]);

  const addVehicle = () => {
    if (vehicles.length < 4) {
      setVehicles([...vehicles, { id: Date.now().toString(), make: '', model: '' }]);
    }
  };

  const removeVehicle = (id) => {
    if (vehicles.length > 2) {
      setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
    }
  };

  const updateVehicle = (id, field, value) => {
    setVehicles(vehicles.map(vehicle => 
      vehicle.id === id ? { ...vehicle, [field]: value } : vehicle
    ));
  };

  const handleCompare = () => {
    const validVehicles = vehicles.filter(v => v.make && v.model);
    if (validVehicles.length >= 2) {
      const comparison = validVehicles.map(v => {
        const key = `${v.make} ${v.model}`;
        return vehicleData[key] || {
          year: 2024,
          make: v.make,
          model: v.model,
          trim: 'Base',
          msrp: 25000,
          marketAverage: 26000,
          rating: 4.0,
          totalReviews: 100,
          image: '/api/placeholder/300/200',
          specs: {
            'Engine': 'N/A',
            'MPG City/Highway': 'N/A',
            'Transmission': 'N/A',
            'Drivetrain': 'N/A',
            'Seating': 'N/A',
            'Safety Rating': 'N/A'
          }
        };
      });
      setComparisonData(comparison);
      setShowComparison(true);
    }
  };

  const handleBackToSelection = () => {
    setShowComparison(false);
  };

  const canCompare = vehicles.filter(v => v.make && v.model).length >= 2;

  if (showComparison) {
    return <ComparisonView vehicles={comparisonData} onBack={handleBackToSelection} />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Vehicle Comparison Tool</h1>
        <p className={styles.subtitle}>
          Compare up to 4 vehicles side by side to find the perfect match for your needs
        </p>
      </div>

      <div className={styles.selectionGrid}>
        {vehicles.map((vehicle, index) => (
          <VehicleSelector
            key={vehicle.id}
            id={vehicle.id}
            selectedMake={vehicle.make}
            selectedModel={vehicle.model}
            onMakeChange={(make) => updateVehicle(vehicle.id, 'make', make)}
            onModelChange={(model) => updateVehicle(vehicle.id, 'model', model)}
            onRemove={() => removeVehicle(vehicle.id)}
            canRemove={vehicles.length > 2}
            index={index}
          />
        ))}
      </div>

      <div className={styles.actions}>
        {vehicles.length < 4 && (
          <button onClick={addVehicle} className={styles.addButton}>
            + Add another vehicle to compare
          </button>
        )}
        
        <button 
          onClick={handleCompare} 
          disabled={!canCompare}
          className={`${styles.compareButton} ${!canCompare ? styles.disabled : ''}`}
        >
          Compare {vehicles.filter(v => v.make && v.model).length} Vehicle{vehicles.filter(v => v.make && v.model).length !== 1 ? 's' : ''}
        </button>
      </div>
    </div>
  );
}