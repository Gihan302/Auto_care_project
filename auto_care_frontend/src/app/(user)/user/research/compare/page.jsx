'use client';

import React, { useState, useEffect } from 'react';
import styles from './compare.module.css';
import api from '@/utils/axios';



const VehicleSelector = ({ id, selectedVehicle, onVehicleChange, onRemove, canRemove, index, availableVehicles, manufacturers }) => {
  const [selectedMake, setSelectedMake] = useState('');
  const [availableModels, setAvailableModels] = useState([]);

  const handleMakeChange = (make) => {
    setSelectedMake(make);
    // Filter vehicles by manufacturer
    const models = availableVehicles.filter(v => v.manufacturer === make);
    setAvailableModels(models);
    onVehicleChange(null); // Reset selection
  };

  return (
    <div className={styles.vehicleSelector}>
      {canRemove && onRemove && (
        <button className={styles.removeButton} onClick={onRemove}>×</button>
      )}
      
      <h3 className={styles.vehicleTitle}>Vehicle {index + 1}</h3>
      
      <div className={styles.selectGroup}>
        <div className={styles.selectContainer}>
          <label className={styles.label}>Manufacturer</label>
          <select 
            value={selectedMake} 
            onChange={(e) => handleMakeChange(e.target.value)}
            className={styles.select}
          >
            <option value="">Select manufacturer</option>
            {manufacturers.map((make) => (
              <option key={make} value={make}>{make}</option>
            ))}
          </select>
        </div>
        
        <div className={styles.selectContainer}>
          <label className={styles.label}>Model</label>
          <select 
            value={selectedVehicle?.id || ''} 
            onChange={(e) => {
              const vehicle = availableModels.find(v => v.id === parseInt(e.target.value));
              onVehicleChange(vehicle);
            }}
            disabled={!selectedMake}
            className={styles.select}
          >
            <option value="">Select model</option>
            {availableModels.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.m_year} {vehicle.model}
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

  // Define which specs to compare
  const specsToCompare = [
    { key: 'price', label: 'Price', format: (val) => `Rs. ${parseFloat(val).toLocaleString()}` },
    { key: 'm_year', label: 'Manufacture Year' },
    { key: 'r_year', label: 'Registration Year' },
    { key: 'mileage', label: 'Mileage', format: (val) => `${parseFloat(val).toLocaleString()} km` },
    { key: 'fuel_type', label: 'Fuel Type' },
    { key: 'transmission', label: 'Transmission' },
    { key: 'e_capacity', label: 'Engine Capacity', format: (val) => `${val}cc` },
    { key: 'v_condition', label: 'Condition' },
    { key: 'colour', label: 'Color' },
    { key: 'v_type', label: 'Vehicle Type' },
    { key: 'location', label: 'Location' }
  ];

  const filteredSpecs = specsToCompare.filter(spec => {
    if (!searchTerm) return true;
    return spec.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
           vehicles.some(v => v[spec.key]?.toString().toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const formatValue = (value, spec) => {
    if (!value) return 'N/A';
    if (spec.format) return spec.format(value);
    return value;
  };

  return (
    <div className={styles.comparisonView}>
      <div className={styles.comparisonHeader}>
        <button onClick={onBack} className={styles.backButton}>
          ← Back to Selection
        </button>
        <h1 className={styles.comparisonTitle}>Vehicle Comparison</h1>
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
                  src={vehicle.image1 || '/placeholder.jpg'}
                  alt={vehicle.title}
                  className={styles.vehicleImage}
                  onError={(e) => e.target.src = '/placeholder.jpg'}
                />
                <div className={styles.vehicleDetails}>
                  <h3>{vehicle.title}</h3>
                  <p className={styles.trim}>{vehicle.manufacturer} {vehicle.model}</p>
                </div>
              </div>
              <div className={styles.actionButtons}>
                <button 
                  className={styles.primaryButton}
                  onClick={() => window.location.href = `tel:${vehicle.t_number}`}
                >
                  Contact Seller
                </button>
                <a href={`/user/carAdd/${vehicle.id}`} className={styles.secondaryButton}>
                  View Details
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.tableBody}>
          {/* Seller Information */}
          <div className={styles.specRow}>
            <div className={styles.specName}>Seller Name</div>
            {vehicles.map((vehicle, index) => (
              <div key={index} className={styles.specValue}>{vehicle.name || 'N/A'}</div>
            ))}
          </div>

          <div className={styles.specRow}>
            <div className={styles.specName}>Contact Number</div>
            {vehicles.map((vehicle, index) => (
              <div key={index} className={styles.specValue}>{vehicle.t_number || 'N/A'}</div>
            ))}
          </div>

          <div className={styles.specRow}>
            <div className={styles.specName}>Email</div>
            {vehicles.map((vehicle, index) => (
              <div key={index} className={styles.specValue}>{vehicle.email || 'N/A'}</div>
            ))}
          </div>

          {/* Specifications */}
          {filteredSpecs.map((spec) => {
            // Check if all vehicles have the same value (for hide similarities)
            const values = vehicles.map(v => v[spec.key]);
            const allSame = hideSimmilarities && values.every(val => val === values[0]);
            
            if (allSame) return null;

            return (
              <div key={spec.key} className={styles.specRow}>
                <div className={styles.specName}>{spec.label}</div>
                {vehicles.map((vehicle, index) => (
                  <div key={index} className={styles.specValue}>
                    {formatValue(vehicle[spec.key], spec)}
                  </div>
                ))}
              </div>
            );
          })}

          {/* Description */}
          <div className={styles.specRow}>
            <div className={styles.specName}>Description</div>
            {vehicles.map((vehicle, index) => (
              <div key={index} className={styles.specValue}>
                <div style={{ maxHeight: '100px', overflow: 'auto', textAlign: 'left' }}>
                  {vehicle.description || 'No description available'}
                </div>
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
    { id: '1', vehicle: null },
    { id: '2', vehicle: null }
  ]);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonData, setComparisonData] = useState([]);
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch available vehicles on mount
  useEffect(() => {
    fetchAvailableVehicles();
  }, []);

  const fetchAvailableVehicles = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('📡 Fetching available vehicles from:', '/advertisement/compare/available');
      
      const response = await api.get('/advertisement/compare/available');
      
      if (response.status !== 200) {
        console.error('❌ Response error:', response.status, response.data);
        throw new Error(`Failed to fetch vehicles: ${response.status}`);
      }

      const data = response.data;
      console.log('✅ Fetched', data.length, 'vehicles for comparison');
      
      setAvailableVehicles(data);
      
      // Extract unique manufacturers
      const uniqueManufacturers = [...new Set(data.map(v => v.manufacturer))].filter(Boolean).sort();
      setManufacturers(uniqueManufacturers);
      
      console.log('✅ Found', uniqueManufacturers.length, 'manufacturers');
      
    } catch (error) {
      console.error('❌ Error fetching vehicles:', error);
      setError(`Failed to load vehicles: ${error.message}. Please ensure backend is running on ${API_BASE_URL}`);
    } finally {
      setLoading(false);
    }
  };

  const addVehicle = () => {
    if (vehicles.length < 4) {
      setVehicles([...vehicles, { id: Date.now().toString(), vehicle: null }]);
    }
  };

  const removeVehicle = (id) => {
    if (vehicles.length > 2) {
      setVehicles(vehicles.filter(v => v.id !== id));
    }
  };

  const updateVehicle = (id, vehicle) => {
    setVehicles(vehicles.map(v => 
      v.id === id ? { ...v, vehicle } : v
    ));
  };

  const handleCompare = async () => {
    const selectedVehicles = vehicles.filter(v => v.vehicle).map(v => v.vehicle);
    
    if (selectedVehicles.length < 2) {
      alert('Please select at least 2 vehicles to compare');
      return;
    }

    setLoading(true);
    try {
      const ids = selectedVehicles.map(v => v.id);
      console.log('🔍 Comparing vehicles with IDs:', ids);
      
      // Build query string
      const queryString = ids.map(id => `ids=${id}`).join('&');
      const url = `/advertisement/compare?${queryString}`;
      
      console.log('📡 Fetching comparison from:', url);
      
      const response = await api.get(url);
      
      if (response.status !== 200) {
        throw new Error(`Failed to compare vehicles: ${response.status}`);
      }

      const data = response.data;
      console.log('✅ Comparison data received:', data.length, 'vehicles');
      
      setComparisonData(data);
      setShowComparison(true);
    } catch (error) {
      console.error('❌ Error comparing vehicles:', error);
      alert(`Failed to compare vehicles: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToSelection = () => {
    setShowComparison(false);
  };

  const canCompare = vehicles.filter(v => v.vehicle).length >= 2;

  if (loading && availableVehicles.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Loading vehicles...</h1>
          <p className={styles.subtitle}>Please wait while we fetch available vehicles</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Error Loading Vehicles</h1>
          <p className={styles.subtitle} style={{ color: '#ff6b6b' }}>{error}</p>
          <button onClick={fetchAvailableVehicles} className={styles.compareButton}>
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (showComparison) {
    return <ComparisonView vehicles={comparisonData} onBack={handleBackToSelection} />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Vehicle Comparison Tool</h1>
        <p className={styles.subtitle}>
          Compare up to 4 vehicles side by side from our {availableVehicles.length} approved listings
        </p>
      </div>

      {availableVehicles.length === 0 && !loading && (
        <div className={styles.header}>
          <p className={styles.subtitle} style={{ color: '#ffa500' }}>
            No vehicles available for comparison yet. Check back later or ensure your backend is running!
          </p>
        </div>
      )}

      {availableVehicles.length > 0 && (
        <>
          <div className={styles.selectionGrid}>
            {vehicles.map((vehicle, index) => (
              <VehicleSelector
                key={vehicle.id}
                id={vehicle.id}
                selectedVehicle={vehicle.vehicle}
                onVehicleChange={(v) => updateVehicle(vehicle.id, v)}
                onRemove={() => removeVehicle(vehicle.id)}
                canRemove={vehicles.length > 2}
                index={index}
                availableVehicles={availableVehicles}
                manufacturers={manufacturers}
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
              disabled={!canCompare || loading}
              className={`${styles.compareButton} ${!canCompare || loading ? styles.disabled : ''}`}
            >
              {loading ? 'Loading...' : `Compare ${vehicles.filter(v => v.vehicle).length} Vehicle${vehicles.filter(v => v.vehicle).length !== 1 ? 's' : ''}`}
            </button>
          </div>
        </>
      )}
    </div>
  );
}