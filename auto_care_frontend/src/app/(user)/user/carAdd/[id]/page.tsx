'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from './carAdd.module.css';
import { Phone, Mail, MapPin, Fuel, Settings, Calendar, Gauge, ChevronLeft, ChevronRight, ArrowLeft, FileText, Shield, X } from 'lucide-react';
import api from '@/utils/axios';
import LeasingPlans from '../../components/homepage/LeasingPlans';

interface InsurancePlan {
  id: number;
  planName: string;
  coverage: string;
  price: number;
  description: string;
  user: {
    cName: string;
  }
}

const VehicleDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [vehicleData, setVehicleData] = useState(null);
  const [similarVehicles, setSimilarVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLeasingPlans, setShowLeasingPlans] = useState(false);
  const [showInsuranceModal, setShowInsuranceModal] = useState(false);
  const [fetchedInsurancePlans, setFetchedInsurancePlans] = useState<InsurancePlan[]>([]);
  const [insurancePlansLoading, setInsurancePlansLoading] = useState(true);
  const [insurancePlansError, setInsurancePlansError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      if (!params.id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('📡 Fetching vehicle details for ID:', params.id);
        
        const response = await api.get(`/advertisement/getAdById/${params.id}`);

        console.log('✅ Fetched vehicle details:', response.data);
        setVehicleData(response.data);

        const similarResponse = await api.get(`/advertisement/getconfrimad`);

        if (similarResponse.status === 200) {
          const allVehicles = similarResponse.data;
          const similar = allVehicles
            .filter(v => v.v_type === response.data.v_type && v.id !== response.data.id)
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

    const fetchInsurancePlans = async () => {
      setInsurancePlansLoading(true);
      setInsurancePlansError(null);
      try {
        const response = await api.get("/insurance-plans/public/all");
        setFetchedInsurancePlans(response.data);
      } catch (err) {
        console.error("Error fetching insurance plans:", err);
        setInsurancePlansError("Failed to fetch insurance plans.");
      } finally {
        setInsurancePlansLoading(false);
      }
    };

    fetchVehicleDetails();
    fetchInsurancePlans();
  }, [params.id]);

  // Function to create draft message and navigate to messaging
  const handleApplyNow = async (companyName, companyType, plan) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('Please log in to apply for this plan.');
      router.push('/signin');
      return;
    }

    try {
      console.log('🚀 Creating conversation with', companyName);
      
      // Create or get existing conversation
      const response = await api.post('/user/conversations', {
        companyName,
        companyType,
        vehicleId: params.id,
        inquiryType: companyType === 'leasing' ? 'leasing_inquiry' : 'insurance_inquiry'
      });

      const conversationId = response.data.conversationId;
      console.log('✅ Conversation created/found:', conversationId);

      // Generate draft message based on vehicle and plan details
      const draftMessage = generateDraftMessage(companyType, plan, vehicleData);

      // Store draft message in sessionStorage to be used in messaging page
      sessionStorage.setItem('draftMessage', JSON.stringify({
        conversationId,
        companyName,
        message: draftMessage,
        vehicleId: params.id
      }));

      // Navigate to messaging page
      router.push('/user/message');
    } catch (error) {
      console.error('❌ Error creating conversation:', error);
      if (error.response?.status === 401) {
        alert('Session expired. Please log in again.');
        router.push('/signin');
      } else {
        alert('Failed to start conversation. Please try again.');
      }
    }
  };

  // Generate draft message based on plan type
  const generateDraftMessage = (type, plan, vehicle) => {
    const vehicleTitle = vehicle.title || `${vehicle.m_year} ${vehicle.manufacturer} ${vehicle.model}`;
    const vehiclePrice = vehicle.price ? `Rs. ${parseFloat(vehicle.price).toLocaleString()}` : '';

    if (type === 'leasing') {
      return `Hello ${plan.company},

I am interested in applying for your leasing plan for the following vehicle:

Vehicle Details:
- ${vehicleTitle}
- Price: ${vehiclePrice}
- Year: ${vehicle.m_year}
- Mileage: ${vehicle.mileage ? parseFloat(vehicle.mileage).toLocaleString() + ' km' : 'N/A'}
- Location: ${vehicle.location || 'N/A'}

Leasing Plan:
- Interest Rate: ${plan.interestRate}
- Duration: ${plan.duration}
- Monthly Payment: ${plan.monthlyPayment}
- Down Payment: ${plan.downPayment}

Could you please provide more information about the application process and required documents?

Thank you.`;
    } else if (type === 'insurance') {
      return `Hello ${plan.user.cName},

I would like to get a quote for insurance coverage for the following vehicle:

Vehicle Details:
- ${vehicleTitle}
- Price: ${vehiclePrice}
- Year: ${vehicle.m_year}
- Type: ${vehicle.v_type || 'N/A'}
- Location: ${vehicle.location || 'N/A'}

Insurance Plan of Interest:
- Type: ${plan.planName}
- Coverage: ${plan.coverage}
- Premium: Rs. ${parseFloat(plan.price).toLocaleString()}/year

Please provide me with a detailed quote and the necessary documentation required.

Thank you.`;
    }

    return '';
  };

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
            <button className={styles.btnFinancing} onClick={() => setShowLeasingPlans(prev => !prev)}>
              <FileText size={20} />
              {showLeasingPlans ? 'Hide Leasing Plans' : 'View Leasing Plans'}
            </button>
            <button className={styles.btnFinancing} onClick={() => setShowInsuranceModal(true)}>
              <Shield size={20} />
              View Insurance Plans
            </button>
          </div>
        </section>

        {/* Available Leasing Plans */}
        {showLeasingPlans && (
          <section className={styles.leasingPlansSection}>
            <h2 className={styles.sectionTitle}>Available Leasing Plans</h2>
            <LeasingPlans showAll={true} />
          </section>
        )}

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
            {insurancePlansLoading ? (
              <p>Loading insurance plans...</p>
            ) : insurancePlansError ? (
              <p className={styles.error}>{insurancePlansError}</p>
            ) : fetchedInsurancePlans.length === 0 ? (
              <p>No insurance plans available at the moment.</p>
            ) : (
              <div className={styles.plansGrid}>
                {fetchedInsurancePlans.map((plan) => (
                  <div key={plan.id} className={styles.planCard}>
                    <h3 className={styles.planCompany}>{plan.user?.cName || 'Unknown Company'}</h3>
                    <div className={styles.planDetails}>
                      <div className={styles.planRow}>
                        <span>Plan Name:</span>
                        <strong>{plan.planName}</strong>
                      </div>
                      <div className={styles.planRow}>
                        <span>Annual Premium:</span>
                        <strong>Rs. {parseFloat(plan.price).toLocaleString()}/year</strong>
                      </div>
                      <div className={styles.planRow}>
                        <span>Coverage:</span>
                        <strong>{plan.coverage}</strong>
                      </div>
                      <div className={styles.planRow}>
                        <span>Description:</span>
                        <strong>{plan.description}</strong>
                      </div>
                    </div>
                    <button 
                      className={styles.btnApply}
                      onClick={() => handleApplyNow(plan.user?.cName || 'Unknown Company', 'insurance', plan)}
                    >
                      Get Quote
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleDetailPage;