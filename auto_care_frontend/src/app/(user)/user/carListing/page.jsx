// 'use client';

// import { useState, useEffect, useMemo } from 'react';
// import Link from 'next/link';
// import styles from './carListing.module.css';
// import api from '@/utils/axios';

// const CarListing = () => {
//   const [selectedVehicleType, setSelectedVehicleType] = useState('All');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isMobile, setIsMobile] = useState(false);
//   const [showFilters, setShowFilters] = useState(false);
//   const [filters, setFilters] = useState({
//     location: '',
//     transmission: '',
//     priceMin: '',
//     priceMax: ''
//   });
//   const [isLoading, setIsLoading] = useState(true);
//   const [vehicles, setVehicles] = useState([]);
//   const [bannerAds, setBannerAds] = useState([]);
//   const [error, setError] = useState(null);

//   const vehicleTypes = ['All', 'Car', 'Van', 'SUV', 'Truck', 'Motor Bike', 'Threewheel'];

//   // All districts in Sri Lanka
//   const sriLankanDistricts = [
//     'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo',
//     'Galle', 'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara',
//     'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar',
//     'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya',
//     'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya'
//   ];

//   // Fetch vehicles and banner ads
//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth <= 768);
//     };
    
//     checkMobile();
//     window.addEventListener('resize', checkMobile);

//     const fetchVehicles = async () => {
//       setIsLoading(true);
//       setError(null);
      
//       try {
//         console.log('📡 Fetching approved advertisements from:', `/advertisement/getconfrimad`);
        
//         const response = await api.get(`/advertisement/getconfrimad`);

//         console.log('✅ Response status:', response.status);

//         if (response.status === 200) {
//           const data = response.data;
//           console.log('✅ Fetched', data.length, 'approved advertisements');
          
//           if (Array.isArray(data)) {
//             setVehicles(data);
//           } else {
//             console.warn('API returned non-array data:', data);
//             setVehicles([]);
//           }
//         } else {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//       } catch (error) {
//         console.error('❌ Error fetching vehicles:', error);
//         setError(error.message);
//         setVehicles([]);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     const fetchBannerAds = async () => {
//       try {
//         console.log('📢 Fetching active banner ads from:', `/api/banner-ads/active`);
//         const response = await api.get(`/api/banner-ads/active`);

//         console.log('📥 Banner ads response status:', response.status);

//         if (response.status === 200) {
//           const data = response.data;
          
//           if (Array.isArray(data) && data.length > 0) {
//             setBannerAds(data);
//           } else {
//             console.warn('⚠️ No banner ads returned or invalid format');
//             setBannerAds([]);
//           }
//         } else {
//           console.error('❌ Failed to fetch banner ads, status:', response.status);
//         }
//       } catch (error) {
//         if (error.response?.status === 401) {
//           console.warn('⚠️ Banner ads not loaded (authentication required)');
//         } else {
//           console.error('❌ Error fetching banner ads:', error);
//         }
//       }
//     };

//     fetchVehicles();
//     fetchBannerAds();

//     const interval = setInterval(() => {
//       fetchVehicles();
//       fetchBannerAds();
//     }, 30000);
    
//     return () => {
//       clearInterval(interval);
//       window.removeEventListener('resize', checkMobile);
//     };
//   }, []);

//   // Track banner ad impression
//   const trackImpression = async (adId) => {
//     try {
//       console.log('👁️ Tracking impression for ad:', adId);
//       await api.post(`/api/banner-ads/${adId}/impression`);
//       console.log('✅ Impression tracked for ad:', adId);
//     } catch (error) {
//       console.error('❌ Error tracking impression:', error);
//     }
//   };

//   // Track banner ad click
//   const handleBannerClick = async (ad) => {
//     try {
//       console.log('👆 Tracking click for ad:', ad.id);
//       await api.post(`/api/banner-ads/${ad.id}/click`);
//       console.log('✅ Click tracked for ad:', ad.id);
//       window.open(ad.targetUrl, '_blank', 'noopener,noreferrer');
//     } catch (error) {
//       console.error('❌ Error tracking click:', error);
//       window.open(ad.targetUrl, '_blank', 'noopener,noreferrer');
//     }
//   };

//   // Track impressions when banner ads load
//   useEffect(() => {
//     if (bannerAds.length > 0) {
//       console.log('👁️ Tracking impressions for', bannerAds.length, 'banner ads');
//       bannerAds.forEach(ad => {
//         trackImpression(ad.id);
//       });
//     }
//   }, [bannerAds]);

//   const filteredVehicles = useMemo(() => {
//     let filtered = vehicles;

//     if (selectedVehicleType !== 'All') {
//       filtered = filtered.filter(v => v.v_type === selectedVehicleType);
//     }

//     if (searchTerm) {
//       const lowerTerm = searchTerm.toLowerCase();
//       filtered = filtered.filter(v =>
//         (v.title && v.title.toLowerCase().includes(lowerTerm)) ||
//         (v.manufacturer && v.manufacturer.toLowerCase().includes(lowerTerm)) ||
//         (v.model && v.model.toLowerCase().includes(lowerTerm))
//       );
//     }

//     Object.entries(filters).forEach(([key, value]) => {
//       if (value) {
//         if (key === 'priceMin') {
//           const minPrice = parseFloat(value);
//           filtered = filtered.filter(v => {
//             const price = parseFloat(String(v.price).replace(/[^0-9.]/g, ''));
//             return price >= minPrice;
//           });
//         } else if (key === 'priceMax') {
//           const maxPrice = parseFloat(value);
//           filtered = filtered.filter(v => {
//             const price = parseFloat(String(v.price).replace(/[^0-9.]/g, ''));
//             return price <= maxPrice;
//           });
//         } else {
//           filtered = filtered.filter(v =>
//             v[key] && v[key].toString().toLowerCase().includes(value.toLowerCase())
//           );
//         }
//       }
//     });

//     return filtered;
//   }, [vehicles, selectedVehicleType, searchTerm, filters]);

//   const handleFilterChange = (filterType, value) => {
//     setFilters(prev => ({
//       ...prev,
//       [filterType]: value
//     }));
//   };

//   const handleVehicleTypeChange = (type) => {
//     setSelectedVehicleType(type);
//     if (isMobile) {
//       setShowFilters(false);
//     }
//   };

//   const toggleFilters = () => {
//     setShowFilters(!showFilters);
//   };

//   const LoadingCard = () => (
//     <div className={styles.loadingCard}>
//       <div className={`${styles.loadingSkeleton} ${styles.loadingImage}`}></div>
//       <div>
//         <div className={`${styles.loadingSkeleton} ${styles.loadingText}`}></div>
//         <div className={`${styles.loadingSkeleton} ${styles.loadingText}`}></div>
//         <div className={`${styles.loadingSkeleton} ${styles.loadingTextShort}`}></div>
//       </div>
//       <div>
//         <div className={`${styles.loadingSkeleton} ${styles.loadingText}`}></div>
//         <div className={`${styles.loadingSkeleton} ${styles.loadingTextShort}`}></div>
//       </div>
//     </div>
//   );

//   const CarCard = ({ car, index }) => (
//     <div
//       className={styles.carCard}
//       style={{ animationDelay: `${index * 0.1}s` }}
//     >
//       <img
//         src={car.image1 || car.image || '/placeholder.jpg'}
//         alt={car.title || `${car.manufacturer} ${car.model}`}
//         className={styles.carImage}
//         onError={(e) => {
//           e.target.src = '/placeholder.jpg';
//         }}
//       />
//       <div className={styles.carInfo}>
//         <h3 className={styles.carTitle}>
//           {car.title || `${car.m_year} ${car.manufacturer} ${car.model}`}
//         </h3>
//         <div className={styles.carPrice}>
//           {car.price ? `Rs. ${parseFloat(car.price).toLocaleString()}` : 'Price not available'}
//         </div>
//         <div className={styles.carDetails}>
//           <div className={styles.carDetail}>
//             From: {car.location || car.district || car.city || 'Unknown'}
//           </div>
//           <div className={styles.carDetail}>
//             Model: {car.model}
//           </div>
//           <div className={styles.carDetail}>
//             Model Year: {car.m_year || car.modelYear || '---'}
//           </div>
//           <div className={styles.carDetail}>
//             Condition: {car.v_condition || 'N/A'}
//           </div>
//         </div>
//       </div>
//       <div className={styles.carActions}>
//         <button className={styles.leaseBtn}>
//           Apply for lease
//         </button>
//         <Link href={`/user/carAdd/${car.id}`} className={styles.exploreBtn}>
//           Explore details
//         </Link>
//       </div>
//     </div>
//   );

//   const ErrorDisplay = () => (
//     <div className={styles.errorDisplay}>
//       <div className={styles.errorIcon}>⚠️</div>
//       <div className={styles.errorMessage}>
//         <h3>Failed to load vehicles</h3>
//         <p>Error: {error}</p>
//         <p>Please check if the backend server is running</p>
//         <button 
//           onClick={() => window.location.reload()} 
//           className={styles.retryBtn}
//         >
//           Retry
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <div className={styles.carListingContainer}>
//       <div className={styles.header}>
//         <h1 className={styles.title}>Choose Your Vehicle Type</h1>
//         <p className={styles.subtitle}>Find the perfect vehicle for your needs</p>
//         <p className={styles.subtitle}>
//           {vehicles.length > 0 && `Showing ${filteredVehicles.length} of ${vehicles.length} approved vehicles`}
//         </p>
//       </div>

//       {/* Featured Banner Ads Section - Above Main Content */}
//       {bannerAds.length > 0 && (
//         <div className={styles.topBannerSection}>
//           <div className={styles.topBannerContainer}>
//             {bannerAds.map((ad) => (
//               <div 
//                 key={ad.id} 
//                 className={styles.topBannerCard}
//                 onClick={() => handleBannerClick(ad)}
//                 style={{ cursor: 'pointer' }}
//               >
//                 <img 
//                   src={ad.imageUrl} 
//                   alt={ad.title || 'Advertisement'} 
//                   className={styles.topBannerImage}
//                 />
//                 {ad.title && (
//                   <div className={styles.topBannerOverlay}>
//                     <h3 className={styles.topBannerTitle}>{ad.title}</h3>
//                     {ad.description && (
//                       <p className={styles.topBannerDescription}>{ad.description}</p>
//                     )}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       <div className={styles.mainContent}>
//         {isMobile && (
//           <div className={styles.mobileFilterToggle}>
//             <button
//               className={styles.filterToggleBtn}
//               onClick={toggleFilters}
//             >
//               {showFilters ? '✕ Close Filters' : '☰ Show Filters'}
//             </button>
//           </div>
//         )}

//         <div className={`${styles.filterSidebar} ${isMobile && !showFilters ? styles.hidden : ''}`}>
//           <h2 className={styles.filterTitle}>Vehicle Types</h2>

//           <div className={styles.vehicleTypeFilters}>
//             {vehicleTypes.map(type => (
//               <button
//                 key={type}
//                 className={`${styles.vehicleTypeBtn} ${
//                   selectedVehicleType === type ? styles.active : ''
//                 }`}
//                 onClick={() => handleVehicleTypeChange(type)}
//               >
//                 {type}
//               </button>
//             ))}
//           </div>

//           <input
//             type="text"
//             placeholder="Search vehicles..."
//             className={styles.searchInput}
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />

//           <div className={styles.filterGroup}>
//             <label className={styles.filterLabel}>District</label>
//             <select
//               className={styles.filterSelect}
//               value={filters.location}
//               onChange={(e) => handleFilterChange('location', e.target.value)}
//             >
//               <option value="">All Districts</option>
//               {sriLankanDistricts.map(district => (
//                 <option key={district} value={district}>
//                   {district}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className={styles.filterGroup}>
//             <label className={styles.filterLabel}>Transmission</label>
//             <select
//               className={styles.filterSelect}
//               value={filters.transmission}
//               onChange={(e) => handleFilterChange('transmission', e.target.value)}
//             >
//               <option value="">Any Transmission</option>
//               <option value="Automatic">Automatic</option>
//               <option value="Manual">Manual</option>
//             </select>
//           </div>

//           <div className={styles.filterGroup}>
//             <label className={styles.filterLabel}>Price Range</label>
//             <div className={styles.priceRange}>
//               <input
//                 type="number"
//                 placeholder="Min Price"
//                 className={styles.priceInput}
//                 value={filters.priceMin}
//                 onChange={(e) => handleFilterChange('priceMin', e.target.value)}
//               />
//               <br />
//               <input
//                 type="number"
//                 placeholder="Max Price"
//                 className={styles.priceInput}
//                 value={filters.priceMax}
//                 onChange={(e) => handleFilterChange('priceMax', e.target.value)}
//               />
//             </div>
//           </div>

//           {/* Sidebar Banner Ads Section */}
//           {bannerAds.length > 0 && (
//             <div className={styles.bannerAdsSection}>
//               <h3 className={styles.bannerAdsTitle}>
//                 Featured Ads ({bannerAds.length})
//               </h3>
//               <div className={styles.bannerAdsContainer}>
//                 {bannerAds.map((ad) => (
//                   <div 
//                     key={ad.id} 
//                     className={styles.bannerAdCard}
//                     onClick={() => handleBannerClick(ad)}
//                     style={{ cursor: 'pointer' }}
//                   >
//                     <img 
//                       src={ad.imageUrl} 
//                       alt={ad.title || 'Advertisement'} 
//                       className={styles.bannerAdImage}
//                     />
//                     {ad.title && (
//                       <div className={styles.bannerAdOverlay}>
//                         <span className={styles.bannerAdTitle}>{ad.title}</span>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         <div className={styles.carListings}>
//           {error ? (
//             <ErrorDisplay />
//           ) : isLoading ? (
//             Array.from({ length: 6 }).map((_, index) => (
//               <LoadingCard key={index} />
//             ))
//           ) : filteredVehicles.length > 0 ? (
//             filteredVehicles.map((car, index) => (
//               <CarCard key={car.id} car={car} index={index} />
//             ))
//           ) : (
//             <div className={styles.noResults}>
//               <div className={styles.noResultsIcon}>🚗</div>
//               <h3>No vehicles found</h3>
//               <p>
//                 {vehicles.length === 0 
//                   ? 'No approved vehicles available at the moment. Check back later!'
//                   : 'No vehicles match your search criteria. Try adjusting your filters.'}
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CarListing;





'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import styles from './carListing.module.css';
import api from '@/utils/axios';

const CarListing = () => {
  const [selectedVehicleType, setSelectedVehicleType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    transmission: '',
    priceMin: '',
    priceMax: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [vehicles, setVehicles] = useState([]);
  const [bannerAds, setBannerAds] = useState([]);
  const [error, setError] = useState(null);

  const vehicleTypes = ['All', 'Car', 'Van', 'SUV', 'Truck', 'Motor Bike', 'Threewheel'];

  // All districts in Sri Lanka
  const sriLankanDistricts = [
    'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo',
    'Galle', 'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara',
    'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar',
    'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya',
    'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya'
  ];

  // Fetch vehicles and banner ads
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const fetchVehicles = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await api.get(`/advertisement/getconfrimad`);

        if (response.status === 200) {
          const data = response.data;
          
          if (Array.isArray(data)) {
            // Normalize data once on fetch for better filter performance
            const normalizedVehicles = data.map(v => ({
              ...v,
              numericPrice: v.price ? parseFloat(String(v.price).replace(/[^0-9.]/g, '')) : 0
            }));
            setVehicles(normalizedVehicles);
          } else {
            setVehicles([]);
          }
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        setError(error.message);
        setVehicles([]);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchBannerAds = async () => {
      try {
        const response = await api.get(`/api/banner-ads/active`);

        if (response.status === 200) {
          const data = response.data;
          if (Array.isArray(data) && data.length > 0) {
            setBannerAds(data);
          } else {
            setBannerAds([]);
          }
        }
      } catch (error) {
        // Silently fail on banner ads (e.g., 401)
      }
    };

    fetchVehicles();
    fetchBannerAds();
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Track banner ad impression
  const trackImpression = async (adId) => {
    try {
      await api.post(`/api/banner-ads/${adId}/impression`);
    } catch (error) {
      // Don't block UI for failed impression tracking
    }
  };

  // Track banner ad click
  const handleBannerClick = async (ad) => {
    try {
      await api.post(`/api/banner-ads/${ad.id}/click`);
      window.open(ad.targetUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      // Still open link even if click tracking fails
      window.open(ad.targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Handle keyboard interaction for accessible banner clicks
  const handleBannerKeyDown = (e, ad) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleBannerClick(ad);
    }
  };

  // Track impressions when banner ads load
  useEffect(() => {
    if (bannerAds.length > 0) {
      bannerAds.forEach(ad => {
        trackImpression(ad.id);
      });
    }
  }, [bannerAds]);

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
          // Use the pre-calculated numericPrice for faster filtering
          filtered = filtered.filter(v => v.numericPrice >= minPrice);
        } else if (key === 'priceMax') {
          const maxPrice = parseFloat(value);
          // Use the pre-calculated numericPrice for faster filtering
          filtered = filtered.filter(v => v.numericPrice <= maxPrice);
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
        src={car.image1 || car.image || '/placeholder.jpg'}
        alt={car.title || `${car.manufacturer} ${car.model}`}
        className={styles.carImage}
        onError={(e) => {
          e.target.src = '/placeholder.jpg';
        }}
      />
      <div className={styles.carInfo}>
        <h3 className={styles.carTitle}>
          {car.title || `${car.m_year} ${car.manufacturer} ${car.model}`}
        </h3>
        <div className={styles.carPrice}>
          {car.price ? `Rs. ${parseFloat(car.price).toLocaleString()}` : 'Price not available'}
        </div>
        <div className={styles.carDetails}>
          <div className={styles.carDetail}>
            From: {car.location || car.district || car.city || 'Unknown'}
          </div>
          <div className={styles.carDetail}>
            Model: {car.model}
          </div>
          <div className={styles.carDetail}>
            Model Year: {car.m_year || car.modelYear || '---'}
          </div>
          <div className={styles.carDetail}>
            Condition: {car.v_condition || 'N/A'}
          </div>
        </div>
      </div>
      <div className={styles.carActions}>
        <button className={styles.leaseBtn}>
          Apply for lease
        </button>
        <Link href={`/user/carAdd/${car.id}`} className={styles.exploreBtn}>
          Explore details
        </Link>
      </div>
    </div>
  );

  const ErrorDisplay = () => (
    <div className={styles.errorDisplay}>
      <div className={styles.errorIcon}>⚠️</div>
      <div className={styles.errorMessage}>
        <h3>Failed to load vehicles</h3>
        <p>Error: {error}</p>
        <p>Please check if the backend server is running</p>
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
        <p className={styles.subtitle}>
          {vehicles.length > 0 && `Showing ${filteredVehicles.length} of ${vehicles.length} approved vehicles`}
        </p>
      </div>

      {/* Featured Banner Ads Section - Above Main Content */}
      {bannerAds.length > 0 && (
        <div className={styles.topBannerSection}>
          <div className={styles.topBannerContainer}>
            {bannerAds.map((ad) => (
              <div 
                key={ad.id} 
                className={styles.topBannerCard}
                onClick={() => handleBannerClick(ad)}
                onKeyDown={(e) => handleBannerKeyDown(e, ad)}
                role="button"
                tabIndex={0}
                style={{ cursor: 'pointer' }}
              >
                <img 
                  src={ad.imageUrl} 
                  alt={ad.title || 'Advertisement'} 
                  className={styles.topBannerImage}
                />
                {ad.title && (
                  <div className={styles.topBannerOverlay}>
                    <h3 className={styles.topBannerTitle}>{ad.title}</h3>
                    {ad.description && (
                      <p className={styles.topBannerDescription}>{ad.description}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

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

          <label htmlFor="search-input" className="sr-only">Search Vehicles</label>
          <input
            id="search-input"
            type="text"
            placeholder="Search vehicles..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel} htmlFor="district-select">District</label>
            <select
              id="district-select"
              className={styles.filterSelect}
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            >
              <option value="">All Districts</option>
              {sriLankanDistricts.map(district => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel} htmlFor="transmission-select">Transmission</label>
            <select
              id="transmission-select"
              className={styles.filterSelect}
              value={filters.transmission}
              onChange={(e) => handleFilterChange('transmission', e.target.value)}
            >
              <option value="">Any Transmission</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel} id="price-range-label">Price Range</label>
            <div className={styles.priceRange} role="group" aria-labelledby="price-range-label">
              <label htmlFor="price-min" className="sr-only">Minimum Price</label>
              <input
                id="price-min"
                type="number"
                placeholder="Min Price"
                className={styles.priceInput}
                value={filters.priceMin}
                onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                aria-label="Minimum Price"
              />
              <br />
              <label htmlFor="price-max" className="sr-only">Maximum Price</label>
              <input
                id="price-max"
                type="number"
                placeholder="Max Price"
                className={styles.priceInput}
                value={filters.priceMax}
                onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                aria-label="Maximum Price"
              />
            </div>
          </div>

          {/* Sidebar Banner Ads Section */}
          {bannerAds.length > 0 && (
            <div className={styles.bannerAdsSection}>
              <h3 className={styles.bannerAdsTitle}>
                Featured Ads ({bannerAds.length})
              </h3>
              <div className={styles.bannerAdsContainer}>
                {bannerAds.map((ad) => (
                  <div 
                    key={ad.id} 
                    className={styles.bannerAdCard}
                    onClick={() => handleBannerClick(ad)}
                    onKeyDown={(e) => handleBannerKeyDown(e, ad)}
                    role="button"
                    tabIndex={0}
                    style={{ cursor: 'pointer' }}
                  >
                    <img 
                      src={ad.imageUrl} 
                      alt={ad.title || 'Advertisement'} 
                      className={styles.bannerAdImage}
                    />
                    {ad.title && (
                      <div className={styles.bannerAdOverlay}>
                        <span className={styles.bannerAdTitle}>{ad.title}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={styles.carListings}>
          {error ? (
            <ErrorDisplay />
          ) : isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <LoadingCard key={index} />
            ))
          ) : filteredVehicles.length > 0 ? (
            filteredVehicles.map((car, index) => (
              <CarCard key={car.id} car={car} index={index} />
            ))
          ) : (
            <div className={styles.noResults}>
              <div className={styles.noResultsIcon}>🚗</div>
              <h3>No vehicles found</h3>
              <p>
                {vehicles.length === 0 
                  ? 'No approved vehicles available at the moment. Check back later!'
                  : 'No vehicles match your search criteria. Try adjusting your filters.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarListing;