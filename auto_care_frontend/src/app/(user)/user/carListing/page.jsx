'use client';

import { useState, useEffect, useMemo } from 'react';
import styles from './carListing.module.css';

const CarListing = () => {
  const [selectedVehicleType, setSelectedVehicleType] = useState('Cars');
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    district: '',
    city: '',
    vehicleType: '',
    manufacturer: '',
    model: '',
    transmission: '',
    priceMin: '',
    priceMax: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [vehicles, setVehicles] = useState([]);
  const [animationDelay, setAnimationDelay] = useState(0);
  const [error, setError] = useState(null);

  const vehicleTypes = ['Cars', 'Vans', 'SUVs', 'Trucks', 'Motor Bikes', 'Threewheelers'];

  // Configuration for API endpoint
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Fetch vehicle data from backend API
    const fetchVehicles = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('Attempting to fetch from:', `${API_BASE_URL}/advertisement/getconfrimad`);
        
        // Get JWT token from localStorage or wherever you store it
        const token = localStorage.getItem('jwtToken'); // Adjust based on your auth implementation
        
        const headers = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        };

        // Add Authorization header if token exists
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}/advertisement/getconfrimad`, {
          method: 'GET',
          headers: headers,
          // Add timeout
          signal: AbortSignal.timeout(10000) // 10 second timeout
        });

        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched data:', data);
        
        if (Array.isArray(data)) {
          setVehicles(data);
        } else {
          console.warn('API returned non-array data:', data);
          setVehicles([]);
        }
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        setError(error.message);
        setVehicles([]);
        
        // You could also set some dummy data for testing
        // setVehicles(getDummyData());
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicles();

    return () => window.removeEventListener('resize', checkMobile);
  }, [API_BASE_URL]);

  // Add this to your CarListing component
useEffect(() => {
  const fetchVehicles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('jwtToken');
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/advertisement/getconfrimad`, {
        method: 'GET',
        headers: headers,
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (Array.isArray(data)) {
        setVehicles(data);
      } else {
        console.warn('API returned non-array data:', data);
        setVehicles([]);
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setError(error.message);
      setVehicles([]);
    } finally {
      setIsLoading(false);
    }
  };

  fetchVehicles();

  // Optional: Set up polling every 30 seconds to check for new approved ads
  const interval = setInterval(fetchVehicles, 30000);
  
  return () => {
    clearInterval(interval);
    window.removeEventListener('resize', checkMobile);
  };
}, [API_BASE_URL]);


  // Optional: Add dummy data for testing
  const getDummyData = () => [
    {
      id: 1,
      title: "Toyota Prius",
      price: 2500000,
      v_type: "Cars",
      manufacturer: "Toyota",
      model: "Prius",
      district: "Colombo",
      city: "Colombo",
      m_year: 2019,
      image1: "/placeholder.jpg"
    },
    {
      id: 2,
      title: "Honda Civic",
      price: 3000000,
      v_type: "Cars", 
      manufacturer: "Honda",
      model: "Civic",
      district: "Gampaha",
      city: "Gampaha",
      m_year: 2020,
      image1: "/placeholder.jpg"
    }
  ];

  // Filtering logic updated to use vehicles from backend
  const filteredVehicles = useMemo(() => {
    let filtered = vehicles;

    if (selectedVehicleType !== 'All') {
      filtered = filtered.filter(v => v.v_type === selectedVehicleType);
    }

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(v =>
        (v.title && v.title.toLowerCase().includes(lowerTerm)) ||
        (v.manufacturer && v.manufacturer.toLowerCase().includes(lowerTerm)) ||
        (v.model && v.model.toLowerCase().includes(lowerTerm))
      );
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        if (key === 'priceMin') {
          const minPrice = parseFloat(value);
          filtered = filtered.filter(v => {
            const price = parseFloat(String(v.price).replace(/[^0-9]/g, ''));
            return price >= minPrice;
          });
        } else if (key === 'priceMax') {
          const maxPrice = parseFloat(value);
          filtered = filtered.filter(v => {
            const price = parseFloat(String(v.price).replace(/[^0-9]/g, ''));
            return price <= maxPrice;
          });
        } else if (key === 'vehicleType') {
          // Already filtered by selectedVehicleType, so skip here
        } else {
          filtered = filtered.filter(v =>
            v[key] && v[key].toString().toLowerCase().includes(value.toLowerCase())
          );
        }
      }
    });

    return filtered;
  }, [vehicles, selectedVehicleType, searchTerm, filters]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleVehicleTypeChange = (type) => {
    setSelectedVehicleType(type);
    setAnimationDelay(0);
    if (isMobile) {
      setShowFilters(false);
    }
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const LoadingCard = () => (
    <div className={styles.loadingCard}>
      <div className={`${styles.loadingSkeleton} ${styles.loadingImage}`}></div>
      <div>
        <div className={`${styles.loadingSkeleton} ${styles.loadingText}`}></div>
        <div className={`${styles.loadingSkeleton} ${styles.loadingText}`}></div>
        <div className={`${styles.loadingSkeleton} ${styles.loadingTextShort}`}></div>
      </div>
      <div>
        <div className={`${styles.loadingSkeleton} ${styles.loadingText}`}></div>
        <div className={`${styles.loadingSkeleton} ${styles.loadingTextShort}`}></div>
      </div>
    </div>
  );

  const CarCard = ({ car, index }) => (
    <div
      className={styles.carCard}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <img
        src={car.image || car.image1 || car.image_url || '/placeholder.jpg'}
        alt={car.title || `${car.manufacturer} ${car.model}`}
        className={styles.carImage}
        onError={(e) => {
          e.target.src = '/placeholder.jpg';
        }}
      />
      <div className={styles.carInfo}>
        <h3 className={styles.carTitle}>{car.title || `${car.manufacturer} ${car.model}`}</h3>
        <div className={styles.carPrice}>{car.price ? `Rs. ${car.price.toLocaleString()}` : 'Price not available'}</div>
        <div className={styles.carDetails}>
          <div className={styles.carDetail}>From: {car.district || car.city || 'Unknown'}</div>
          <div className={styles.carDetail}>Model: {car.model}</div>
          <div className={styles.carDetail}>Model Year: {car.m_year || car.modelYear || '---'}</div>
        </div>
      </div>
      <div className={styles.carActions}>
        <button className={styles.leaseBtn}>
          Apply for lease
        </button>
        <a href="#" className={styles.exploreBtn}>
          Explore details
        </a>
      </div>
    </div>
  );

  const ErrorDisplay = () => (
    <div className={styles.errorDisplay}>
      <div className={styles.errorIcon}>⚠️</div>
      <div className={styles.errorMessage}>
        <h3>Failed to load vehicles</h3>
        <p>Error: {error}</p>
        <p>Please check if the backend server is running on {API_BASE_URL}</p>
        <button 
          onClick={() => window.location.reload()} 
          className={styles.retryBtn}
        >
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className={styles.carListingContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Choose Your Vehicle Type</h1>
        <p className={styles.subtitle}>Find the perfect vehicle for your needs</p>
      </div>

      <div className={styles.mainContent}>
        {isMobile && (
          <div className={styles.mobileFilterToggle}>
            <button
              className={styles.filterToggleBtn}
              onClick={toggleFilters}
            >
              {showFilters ? '✕ Close Filters' : '☰ Show Filters'}
            </button>
          </div>
        )}

        <div className={`${styles.filterSidebar} ${isMobile && !showFilters ? styles.hidden : ''}`}>
          <h2 className={styles.filterTitle}>Vehicle Types</h2>

          <div className={styles.vehicleTypeFilters}>
            {vehicleTypes.map(type => (
              <button
                key={type}
                className={`${styles.vehicleTypeBtn} ${
                  selectedVehicleType === type ? styles.active : ''
                }`}
                onClick={() => handleVehicleTypeChange(type)}
              >
                {type}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Search by installment"
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>District</label>
            <select
              className={styles.filterSelect}
              value={filters.district}
              onChange={(e) => handleFilterChange('district', e.target.value)}
            >
              <option value="">All District</option>
              <option value="Colombo">Colombo</option>
              <option value="Gampaha">Gampaha</option>
              <option value="Kandy">Kandy</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>City</label>
            <select
              className={styles.filterSelect}
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
            >
              <option value="">All City</option>
              <option value="Colombo">Colombo</option>
              <option value="Gampaha">Gampaha</option>
              <option value="Kandy">Kandy</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Vehicle Type</label>
            <select
              className={styles.filterSelect}
              value={filters.vehicleType}
              onChange={(e) => handleFilterChange('vehicleType', e.target.value)}
            >
              <option value="">Any Type</option>
              {vehicleTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Manufacturer</label>
            <select
              className={styles.filterSelect}
              value={filters.manufacturer}
              onChange={(e) => handleFilterChange('manufacturer', e.target.value)}
            >
              <option value="">Any Manufacturer</option>
              <option value="Mercedes">Mercedes</option>
              <option value="BMW">BMW</option>
              <option value="Toyota">Toyota</option>
              <option value="Honda">Honda</option>
              <option value="Ford">Ford</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Model</label>
            <select
              className={styles.filterSelect}
              value={filters.model}
              onChange={(e) => handleFilterChange('model', e.target.value)}
            >
              <option value="">Any Model</option>
              <option value="C180">C180</option>
              <option value="X5">X5</option>
              <option value="Prius">Prius</option>
              <option value="Civic">Civic</option>
              <option value="Ranger">Ranger</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Transmission</label>
            <select
              className={styles.filterSelect}
              value={filters.transmission}
              onChange={(e) => handleFilterChange('transmission', e.target.value)}
            >
              <option value="">Select Transmission</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Price Range</label>
            <div className={styles.priceRange}>
              <input
                type="number"
                placeholder="Min"
                className={styles.priceInput}
                value={filters.priceMin}
                onChange={(e) => handleFilterChange('priceMin', e.target.value)}
              />
              <br />
              <input
                type="number"
                placeholder="Max"
                className={styles.priceInput}
                value={filters.priceMax}
                onChange={(e) => handleFilterChange('priceMax', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className={styles.carListings}>
          {error ? (
            <ErrorDisplay />
          ) : isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <LoadingCard key={index} />
            ))
          ) : filteredVehicles.length > 0 ? (
            filteredVehicles.map((car, index) => (
              <CarCard key={car.id} car={car} index={index} />
            ))
          ) : (
            <div className={styles.noResults}>
              <div className={styles.noResultsIcon}>🚗</div>
              <div>No vehicles found matching your criteria</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarListing;