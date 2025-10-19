'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from './carAdd.module.css';
import { Phone, Mail, MapPin, Fuel, Settings, Calendar, Gauge, ChevronLeft, ChevronRight, ArrowLeft, FileText, Shield, X } from 'lucide-react';

const VehicleDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [vehicleData, setVehicleData] = useState(null);
  const [similarVehicles, setSimilarVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLeasingModal, setShowLeasingModal] = useState(false);
  const [showInsuranceModal, setShowInsuranceModal] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  // Mock data for leasing and insurance plans (will be replaced with backend data)
  const leasingPlans = [
    {
      id: 1,
      company: 'Seylan Bank',
      interestRate: '8.5%',
      duration: '60 months',
      monthlyPayment: 'Rs. 35,000',
      downPayment: '20%',
      features: ['Flexible payment options', 'Early settlement facility', 'No hidden charges']
    },
    {
      id: 2,
      company: 'Commercial Bank',
      interestRate: '9.0%',
      duration: '48 months',
      monthlyPayment: 'Rs. 38,500',
      downPayment: '25%',
      features: ['Quick approval', 'Competitive rates', 'Free insurance for 1st year']
    },
    {
      id: 3,
      company: 'Peoples Bank',
      interestRate: '8.75%',
      duration: '72 months',
      monthlyPayment: 'Rs. 32,000',
      downPayment: '15%',
      features: ['Low interest rates', 'Extended payment period', 'Online management']
    }
  ];

  const insurancePlans = [
    {
      id: 1,
      company: 'Ceylinco Insurance',
      premium: 'Rs. 45,000/year',
      coverage: 'Rs. 5,000,000',
      type: 'Comprehensive',
      features: ['Accident coverage', 'Theft protection', 'Third-party liability', '24/7 roadside assistance']
    },
    {
      id: 2,
      company: 'HNB Insurance',
      premium: 'Rs. 42,000/year',
      coverage: 'Rs. 4,500,000',
      type: 'Comprehensive',
      features: ['Full coverage', 'Natural disaster protection', 'Free towing service', 'Windscreen cover']
    },
    {
      id: 3,
      company: 'LOLC Insurance',
      premium: 'Rs. 38,000/year',
      coverage: 'Rs. 4,000,000',
      type: 'Third Party',
      features: ['Third-party coverage', 'Personal accident cover', 'Legal liability', 'Medical expenses']
    }
  ];

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      if (!params.id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('📡 Fetching vehicle details for ID:', params.id);
        
        const response = await fetch(`${API_BASE_URL}/advertisement/getAdById/${params.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Fetched vehicle details:', data);
        setVehicleData(data);

        const similarResponse = await fetch(`${API_BASE_URL}/advertisement/getconfrimad`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });

        if (similarResponse.ok) {
          const allVehicles = await similarResponse.json();
          const similar = allVehicles
            .filter(v => v.v_type === data.v_type && v.id !== data.id)
            .slice(0, 4);
          setSimilarVehicles(similar);
          console.log('✅ Fetched', similar.length, 'similar vehicles');
        }
      } catch (error) {
        console.error('❌ Error fetching vehicle details:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicleDetails();
  }, [params.id, API_BASE_URL]);

  const nextImage = () => {
    if (!vehicleData) return;
    const images = getVehicleImages();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    if (!vehicleData) return;
    const images = getVehicleImages();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const getVehicleImages = () => {
    if (!vehicleData) return ['/placeholder.jpg'];
    
    const images = [
      vehicleData.image1,
      vehicleData.image2,
      vehicleData.image3,
      vehicleData.image4,
      vehicleData.image5
    ].filter(img => img && img !== '' && img !== null);
    
    return images.length > 0 ? images : ['/placeholder.jpg'];
  };

  const handleCallSeller = () => {
    if (vehicleData?.t_number) {
      window.location.href = `tel:${vehicleData.t_number}`;
    } else {
      alert('Phone number not available');
    }
  };

  const handleEmailSeller = () => {
    if (vehicleData?.email) {
      const subject = encodeURIComponent(`Inquiry about ${vehicleData.title || vehicleData.model}`);
      const body = encodeURIComponent(`Hi, I'm interested in your ${vehicleData.title || vehicleData.model} listed for Rs. ${vehicleData.price}`);
      window.location.href = `mailto:${vehicleData.email}?subject=${subject}&body=${body}`;
    } else {
      alert('Email not available');
    }
  };

  const handleViewSimilar = (id) => {
    router.push(`/user/carAdd/${id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToListings = () => {
    router.push('/user/carListing');
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p className={styles.loadingText}>Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  if (error || !vehicleData) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>⚠️</div>
          <h2>Vehicle Not Found</h2>
          <p>{error || 'The vehicle you are looking for does not exist or has been removed.'}</p>
          <button onClick={handleBackToListings} className={styles.backBtn}>
            ← Back to Listings
          </button>
        </div>
      </div>
    );
  }

  const images = getVehicleImages();
  const displayTitle = vehicleData.title || `${vehicleData.m_year} ${vehicleData.manufacturer} ${vehicleData.model}`;
  const displayPrice = vehicleData.price ? `Rs. ${parseFloat(vehicleData.price).toLocaleString()}` : 'Price not available';

  return (
    <div className={styles.container}>

      {/* Back Button */}
      <div className={styles.backButtonContainer}>
        <button onClick={handleBackToListings} className={styles.backButton}>
          <ArrowLeft size={20} />
          Back to Listings
        </button>
      </div>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.vehicleTitle}>{displayTitle}</h1>
          <p className={styles.vehiclePrice}>{displayPrice}</p>
          <div className={styles.heroActions}>
            <button className={styles.btnPrimary} onClick={handleCallSeller}>
              <Phone size={18} />
              Call Seller
            </button>
            <button className={styles.btnSecondary} onClick={handleEmailSeller}>
              <Mail size={18} />
              Email Seller
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Image Gallery */}
        <section className={styles.gallery}>
          <div className={styles.mainImageContainer}>
            {images.length > 1 && (
              <button className={styles.galleryBtn} onClick={prevImage}>
                <ChevronLeft size={24} />
              </button>
            )}
            <img 
              src={images[currentImageIndex]} 
              alt={`${displayTitle} - Image ${currentImageIndex + 1}`}
              className={styles.mainImage}
              onError={(e) => {
                e.target.src = '/placeholder.jpg';
              }}
            />
            {images.length > 1 && (
              <button className={styles.galleryBtn} onClick={nextImage}>
                <ChevronRight size={24} />
              </button>
            )}
          </div>
          {images.length > 1 && (
            <div className={styles.thumbnailContainer}>
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className={`${styles.thumbnail} ${index === currentImageIndex ? styles.activeThumbnail : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                  onError={(e) => {
                    e.target.src = '/placeholder.jpg';
                  }}
                />
              ))}
            </div>
          )}
        </section>

        {/* Leasing & Insurance Section */}
        <section className={styles.financingSection}>
          <h2 className={styles.sectionTitle}>Financing Options</h2>
          <div className={styles.financingButtons}>
            <button className={styles.btnFinancing} onClick={() => setShowLeasingModal(true)}>
              <FileText size={20} />
              View Leasing Plans
            </button>
            <button className={styles.btnFinancing} onClick={() => setShowInsuranceModal(true)}>
              <Shield size={20} />
              View Insurance Plans
            </button>
          </div>
        </section>

        {/* Vehicle Information */}
        <section className={styles.infoSection}>
          <h2 className={styles.sectionTitle}>Vehicle Information</h2>
          <div className={styles.infoGrid}>
            {/* Basic Information */}
            <div className={styles.infoCard}>
              <h3 className={styles.cardTitle}>Basic Information</h3>
              <div className={styles.infoRow}>
                <span className={styles.label}>Manufacturer</span>
                <span className={styles.value}>{vehicleData.manufacturer || 'N/A'}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Model</span>
                <span className={styles.value}>{vehicleData.model || 'N/A'}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Type</span>
                <span className={styles.value}>{vehicleData.v_type || 'N/A'}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Condition</span>
                <span className={styles.value}>{vehicleData.v_condition || 'N/A'}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Color</span>
                <span className={styles.value}>{vehicleData.colour || 'N/A'}</span>
              </div>
            </div>

            {/* Technical Specifications */}
            <div className={styles.infoCard}>
              <h3 className={styles.cardTitle}>Technical Specifications</h3>
              <div className={styles.infoRow}>
                <span className={styles.label}>
                  <Gauge size={16} /> Mileage
                </span>
                <span className={styles.value}>
                  {vehicleData.mileage ? `${parseFloat(vehicleData.mileage).toLocaleString()} km` : 'N/A'}
                </span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Engine Capacity</span>
                <span className={styles.value}>
                  {vehicleData.e_capacity ? `${vehicleData.e_capacity}cc` : 'N/A'}
                </span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>
                  <Settings size={16} /> Transmission
                </span>
                <span className={styles.value}>{vehicleData.transmission || 'N/A'}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>
                  <Fuel size={16} /> Fuel Type
                </span>
                <span className={styles.value}>{vehicleData.fuel_type || 'N/A'}</span>
              </div>
            </div>

            {/* Registration Details */}
            <div className={styles.infoCard}>
              <h3 className={styles.cardTitle}>Registration Details</h3>
              <div className={styles.infoRow}>
                <span className={styles.label}>
                  <Calendar size={16} /> Manufacturing Year
                </span>
                <span className={styles.value}>{vehicleData.m_year || 'N/A'}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Registration Year</span>
                <span className={styles.value}>{vehicleData.r_year || 'N/A'}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>
                  <MapPin size={16} /> Location
                </span>
                <span className={styles.value}>{vehicleData.location || 'N/A'}</span>
              </div>
            </div>

            {/* Contact Information */}
            <div className={styles.infoCard}>
              <h3 className={styles.cardTitle}>Contact Information</h3>
              <div className={styles.infoRow}>
                <span className={styles.label}>Seller Name</span>
                <span className={styles.value}>{vehicleData.name || 'N/A'}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>
                  <Mail size={16} /> Email
                </span>
                <span className={styles.value}>{vehicleData.email || 'N/A'}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>
                  <Phone size={16} /> Phone
                </span>
                <span className={styles.value}>{vehicleData.t_number || 'N/A'}</span>
              </div>
              <div className={styles.contactActions}>
                <button className={styles.btnIcon} onClick={handleCallSeller}>
                  <Phone size={18} /> Call
                </button>
                <button className={styles.btnIcon} onClick={handleEmailSeller}>
                  <Mail size={18} /> Email
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Description */}
        {vehicleData.description && vehicleData.description.trim() !== '' && (
          <section className={styles.descriptionSection}>
            <h2 className={styles.sectionTitle}>Vehicle Description</h2>
            <div className={styles.descriptionCard}>
              <p className={styles.description}>{vehicleData.description}</p>
            </div>
          </section>
        )}

        {/* Similar Listings */}
        {similarVehicles.length > 0 && (
          <section className={styles.similarSection}>
            <h2 className={styles.sectionTitle}>Similar Vehicles You May Like</h2>
            <div className={styles.similarGrid}>
              {similarVehicles.map((vehicle) => {
                const vehicleTitle = vehicle.title || `${vehicle.m_year} ${vehicle.manufacturer} ${vehicle.model}`;
                const vehiclePrice = vehicle.price ? `Rs. ${parseFloat(vehicle.price).toLocaleString()}` : 'Price not available';
                
                return (
                  <div key={vehicle.id} className={styles.similarCard}>
                    <img 
                      src={vehicle.image1 || '/placeholder.jpg'} 
                      alt={vehicleTitle} 
                      className={styles.similarImage}
                      onError={(e) => {
                        e.target.src = '/placeholder.jpg';
                      }}
                    />
                    <div className={styles.similarContent}>
                      <h3 className={styles.similarTitle}>{vehicleTitle}</h3>
                      <p className={styles.similarPrice}>{vehiclePrice}</p>
                      <p className={styles.similarLocation}>
                        <MapPin size={14} /> {vehicle.location || 'Location not specified'}
                      </p>
                      <button 
                        className={styles.btnView}
                        onClick={() => handleViewSimilar(vehicle.id)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* Leasing Plans Modal */}
      {showLeasingModal && (
        <div className={styles.modalOverlay} onClick={() => setShowLeasingModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                <FileText size={24} />
                Available Leasing Plans
              </h2>
              <button className={styles.closeBtn} onClick={() => setShowLeasingModal(false)}>
                <X size={24} />
              </button>
            </div>
            <div className={styles.plansGrid}>
              {leasingPlans.map((plan) => (
                <div key={plan.id} className={styles.planCard}>
                  <h3 className={styles.planCompany}>{plan.company}</h3>
                  <div className={styles.planDetails}>
                    <div className={styles.planRow}>
                      <span>Interest Rate:</span>
                      <strong>{plan.interestRate}</strong>
                    </div>
                    <div className={styles.planRow}>
                      <span>Duration:</span>
                      <strong>{plan.duration}</strong>
                    </div>
                    <div className={styles.planRow}>
                      <span>Monthly Payment:</span>
                      <strong>{plan.monthlyPayment}</strong>
                    </div>
                    <div className={styles.planRow}>
                      <span>Down Payment:</span>
                      <strong>{plan.downPayment}</strong>
                    </div>
                  </div>
                  <div className={styles.planFeatures}>
                    <h4>Features:</h4>
                    <ul>
                      {plan.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                  <button className={styles.btnApply}>Apply Now</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Insurance Plans Modal */}
      {showInsuranceModal && (
        <div className={styles.modalOverlay} onClick={() => setShowInsuranceModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                <Shield size={24} />
                Available Insurance Plans
              </h2>
              <button className={styles.closeBtn} onClick={() => setShowInsuranceModal(false)}>
                <X size={24} />
              </button>
            </div>
            <div className={styles.plansGrid}>
              {insurancePlans.map((plan) => (
                <div key={plan.id} className={styles.planCard}>
                  <h3 className={styles.planCompany}>{plan.company}</h3>
                  <div className={styles.planDetails}>
                    <div className={styles.planRow}>
                      <span>Annual Premium:</span>
                      <strong>{plan.premium}</strong>
                    </div>
                    <div className={styles.planRow}>
                      <span>Coverage:</span>
                      <strong>{plan.coverage}</strong>
                    </div>
                    <div className={styles.planRow}>
                      <span>Type:</span>
                      <strong>{plan.type}</strong>
                    </div>
                  </div>
                  <div className={styles.planFeatures}>
                    <h4>Coverage Includes:</h4>
                    <ul>
                      {plan.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                  <button className={styles.btnApply}>Get Quote</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleDetailPage;