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
  const [animationDelay, setAnimationDelay] = useState(0);

  // Mock data - replace with your actual data source
  const mockCars = [
    {
      id: 1,
      title: 'Mercedes Benz C180',
      price: 'Rs. 70,000,000',
      image: '/hero2.jpg',
      type: 'Cars',
      manufacturer: 'Mercedes',
      model: 'C180',
      transmission: 'Automatic',
      district: 'Colombo',
      city: 'Colombo',
      details: {
        from: 'Colombo',
        model: 'C180',
        modelYear: '2020'
      }
    },
    {
      id: 2,
      title: 'BMW X5',
      price: 'Rs. 85,000,000',
      image: '/hero3.jpg',
      type: 'SUVs',
      manufacturer: 'BMW',
      model: 'X5',
      transmission: 'Automatic',
      district: 'Colombo',
      city: 'Colombo',
      details: {
        from: 'Colombo',
        model: 'X5',
        modelYear: '2021'
      }
    },
    {
      id: 3,
      title: 'Toyota Prius',
      price: 'Rs. 45,000,000',
      image: '/hero4.jpg',
      type: 'Cars',
      manufacturer: 'Toyota',
      model: 'Prius',
      transmission: 'Automatic',
      district: 'Gampaha',
      city: 'Gampaha',
      details: {
        from: 'Gampaha',
        model: 'Prius',
        modelYear: '2019'
      }
    },
    {
      id: 4,
      title: 'Honda Civic',
      price: 'Rs. 55,000,000',
      image: '/hero5.jpg',
      type: 'Cars',
      manufacturer: 'Honda',
      model: 'Civic',
      transmission: 'Manual',
      district: 'Kandy',
      city: 'Kandy',
      details: {
        from: 'Kandy',
        model: 'Civic',
        modelYear: '2020'
      }
    },
    {
      id: 5,
      title: 'Ford Ranger',
      price: 'Rs. 65,000,000',
      image: '/main.jpg',
      type: 'Trucks',
      manufacturer: 'Ford',
      model: 'Ranger',
      transmission: 'Manual',
      district: 'Colombo',
      city: 'Colombo',
      details: {
        from: 'Colombo',
        model: 'Ranger',
        modelYear: '2021'
      }
    }
  ];

  const vehicleTypes = ['Cars', 'Vans', 'SUVs', 'Trucks', 'Motor Bikes', 'Threewheelers'];

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const filteredCars = useMemo(() => {
    let filtered = mockCars;

    // Filter by vehicle type
    if (selectedVehicleType !== 'All') {
      filtered = filtered.filter(car => car.type === selectedVehicleType);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(car =>
        car.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.model.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply other filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        if (key === 'priceMin') {
          const minPrice = parseFloat(value);
          filtered = filtered.filter(car => {
            const price = parseFloat(car.price.replace(/[^0-9]/g, ''));
            return price >= minPrice;
          });
        } else if (key === 'priceMax') {
          const maxPrice = parseFloat(value);
          filtered = filtered.filter(car => {
            const price = parseFloat(car.price.replace(/[^0-9]/g, ''));
            return price <= maxPrice;
          });
        } else {
          filtered = filtered.filter(car => 
            car[key]?.toLowerCase().includes(value.toLowerCase())
          );
        }
      }
    });

    return filtered;
  }, [selectedVehicleType, searchTerm, filters]);

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
        src={car.image} 
        alt={car.title}
        className={styles.carImage}
      />
      <div className={styles.carInfo}>
        <h3 className={styles.carTitle}>{car.title}</h3>
        <div className={styles.carPrice}>{car.price}</div>
        <div className={styles.carDetails}>
          <div className={styles.carDetail}>From: {car.details.from}</div>
          <div className={styles.carDetail}>Model: {car.details.model}</div>
          <div className={styles.carDetail}>Model Year: {car.details.modelYear}</div>
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
          {isLoading ? (
            // Show loading skeletons
            Array.from({ length: 3 }).map((_, index) => (
              <LoadingCard key={index} />
            ))
          ) : filteredCars.length > 0 ? (
            // Show filtered cars
            filteredCars.map((car, index) => (
              <CarCard key={car.id} car={car} index={index} />
            ))
          ) : (
            // Show no results message
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