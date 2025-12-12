'use client'

import { useState, useEffect } from "react"
import { Search, Plus, Eye, Edit, Trash2, Car, User, Shield, Building2, Filter, MapPin, TrendingUp, X, Bell, Check, XCircle, Clock, AlertTriangle } from "lucide-react"
import styles from './page.module.css'

// Component imports
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import Input from "../components/ui/Input"
import Badge from "../components/ui/Badge"
import Select from "../components/ui/Select"

// Simple Dialog Component
const Dialog = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className={styles.dialogOverlay} onClick={onClose}>
      <div className={styles.dialogContainer} onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className={styles.dialogCloseButton}
        >
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  );
};

// Notification Component
const NotificationBell = ({ pendingCount, onClick }) => (
  <div className={styles.notificationContainer} onClick={onClick}>
    <Bell size={24} className={styles.notificationIcon} />
    {pendingCount > 0 && (
      <span className={styles.notificationBadge}>{pendingCount}</span>
    )}
  </div>
);

const ManageVehicles = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [brandFilter, setBrandFilter] = useState("all")
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [vehicles, setVehicles] = useState([])
  const [dashboardStats, setDashboardStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  })

  // API Base URL
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  // Helper function to get auth token
  const getAuthToken = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    console.log('🔑 Token found:', token ? 'Yes' : 'No');
    return token;
  };

  // Helper function to create request headers
  const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  };

  // Transform API advertisement data to frontend format
  const transformAdToVehicle = (ad) => ({
    id: ad.id,
    title: `${ad.m_year} ${ad.manufacturer} ${ad.model}`,
    brand: ad.manufacturer,
    model: ad.model,
    year: ad.m_year,
    price: `$${ad.price?.toLocaleString() || ad.price}`,
    seller: ad.name,
    sellerEmail: ad.email,
    sellerPhone: ad.t_number,
    // FIXED: Use ad.flag instead of ad.falg
    status: ad.flag === 1 ? 'Approved' : ad.flag === 0 ? 'Pending' : 'Rejected',
    flag: ad.flag,
    // FIXED: Use ad.time instead of ad.datetime
    posted: ad.time ? new Date(ad.time).toLocaleDateString() : 'N/A',
    views: Math.floor(Math.random() * 300),
    hasInsurance: ad.i_status === 1,
    hasLeasing: ad.l_status === 1,
    image: ad.image1 || `https://via.placeholder.com/400x240/f1f5f9/64748b?text=${ad.manufacturer}+${ad.model}`,
    images: [ad.image1, ad.image2, ad.image3, ad.image4, ad.image5].filter(Boolean),
    mileage: ad.mileage ? `${ad.mileage} miles` : 'N/A',
    location: ad.location,
    description: ad.description || 'No description available',
    features: [
      ad.fuel_type,
      ad.transmission,
      ad.v_condition,
      ad.colour,
      ad.v_type
    ].filter(Boolean),
    engineCapacity: ad.e_capacity,
    registrationYear: ad.r_year,
    vehicleType: ad.v_type,
    condition: ad.v_condition,
    transmission: ad.transmission,
    fuelType: ad.fuel_type,
    colour: ad.colour
  });

  // API Functions
  const fetchAllAds = async () => {
    setLoading(true);
    try {
      console.log('📡 Fetching all advertisements from AdminController...');
      
      // FIXED: Using correct endpoint with /api/ prefix (same pattern as reviews)
      const response = await fetch(`${API_BASE_URL}/api/admin/advertisements/all`, {
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const ads = await response.json();
        console.log('✅ Received', ads.length, 'advertisements');
        
        const transformedAds = ads.map(transformAdToVehicle);
        setVehicles(transformedAds);
        
        // Calculate stats from the data
        updateStatsFromVehicles(transformedAds);
      } else if (response.status === 401 || response.status === 403) {
        console.error('❌ Authentication failed');
        alert('Authentication failed. Please login again.');
      } else {
        console.error('❌ Failed to fetch advertisements:', response.status);
        const errorText = await response.text();
        console.error('Error details:', errorText);
      }
    } catch (error) {
      console.error('💥 Error fetching advertisements:', error);
      alert('Error connecting to server. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // Update stats from vehicles data
  const updateStatsFromVehicles = (vehiclesList) => {
    const stats = {
      total: vehiclesList.length,
      pending: vehiclesList.filter(v => v.status === 'Pending').length,
      approved: vehiclesList.filter(v => v.status === 'Approved').length,
      rejected: vehiclesList.filter(v => v.status === 'Rejected').length
    };
    setDashboardStats(stats);
    console.log('📊 Stats updated:', stats);
  };

  // FIXED: Approve ad using correct endpoint
  const approveAd = async (adId) => {
    if (!window.confirm('Are you sure you want to approve this advertisement?')) {
      return;
    }

    setLoading(true);
    try {
      console.log('✅ Approving ad:', adId);
      
      // FIXED: Using correct endpoint with /api/ prefix (same pattern as reviews)
      const response = await fetch(`${API_BASE_URL}/api/admin/advertisements/${adId}/approve`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Advertisement approved successfully');
        
        alert(result.message || 'Advertisement approved successfully!');
        
        // Refresh data
        await fetchAllAds();
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Failed to approve advertisement' }));
        console.error('❌ Failed to approve:', errorData);
        alert(errorData.message || 'Failed to approve advertisement');
      }
    } catch (error) {
      console.error('💥 Error approving ad:', error);
      alert('Error approving advertisement. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // FIXED: Reject ad using correct endpoint
  const rejectAd = async (adId) => {
    if (!window.confirm('Are you sure you want to reject and delete this advertisement? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      console.log('🗑️ Rejecting ad:', adId);
      
      // FIXED: Using correct endpoint with /api/ prefix (same pattern as reviews)
      const response = await fetch(`${API_BASE_URL}/api/admin/advertisements/${adId}/reject`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Advertisement rejected and deleted');
        
        alert(result.message || 'Advertisement rejected successfully!');
        
        // Refresh data
        await fetchAllAds();
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Failed to reject advertisement' }));
        console.error('❌ Failed to reject:', errorData);
        alert(errorData.message || 'Failed to reject advertisement');
      }
    } catch (error) {
      console.error('💥 Error rejecting ad:', error);
      alert('Error rejecting advertisement. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch ad details by ID
  const fetchAdById = async (id) => {
    try {
      console.log('📡 Fetching ad details for ID:', id);
      
      const response = await fetch(`${API_BASE_URL}/advertisement/getAdById/${id}`, {
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const ad = await response.json();
        console.log('✅ Ad details retrieved');
        return transformAdToVehicle(ad);
      }
    } catch (error) {
      console.error('💥 Error fetching ad by ID:', error);
    }
    return null;
  };

  // Load data on component mount
  useEffect(() => {
    const initializeData = async () => {
      const token = getAuthToken();
      if (!token) {
        console.error('❌ No authentication token found');
        alert('Please login first');
        return;
      }
      
      console.log('🚀 Initializing ManageVehicles page...');
      await fetchAllAds();
    };
    
    initializeData();
  }, []);

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case "Approved":
        return styles.badgeApproved
      case "Pending":
        return styles.badgePending
      case "Rejected":
        return styles.badgeRejected
      default:
        return styles.badgeGray
    }
  }

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.seller.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter
    const matchesBrand = brandFilter === "all" || vehicle.brand === brandFilter
    return matchesSearch && matchesStatus && matchesBrand
  })

  const pendingVehicles = vehicles.filter(v => v.status === 'Pending')
  const approvedVehicles = vehicles.filter(v => v.status === 'Approved')
  const rejectedVehicles = vehicles.filter(v => v.status === 'Rejected')

  const handleViewVehicle = async (vehicle) => {
    const detailedVehicle = await fetchAdById(vehicle.id);
    setSelectedVehicle(detailedVehicle || vehicle);
    setIsViewDialogOpen(true);
  }

  const handleEditVehicle = (vehicle) => {
    setSelectedVehicle(vehicle)
    setIsEditDialogOpen(true)
  }

  const handleDeleteVehicle = async (vehicleId) => {
    if (window.confirm('Are you sure you want to delete this vehicle listing?')) {
      await rejectAd(vehicleId);
    }
  }

  const uniqueBrands = [...new Set(vehicles.map(v => v.brand).filter(Boolean))]

  return (
    <div>
      <div className={styles.content}>
        {/* Header Section */}
        <div className={styles.headerSection}>
          <div className={styles.header}>
            <div className={styles.titleSection}>
              <h1 className={styles.title}>Vehicle Management</h1>
              <p className={styles.subtitle}>Manage and monitor all vehicle listings</p>
            </div>
            <div className={styles.headerActions}>
              <NotificationBell 
                pendingCount={dashboardStats.pending}
                onClick={() => setIsNotificationOpen(true)}
              />
              <Button className={styles.addButton}>
                <Plus size={20} />
                Add New Vehicle
              </Button>
            </div>
          </div>

          {/* Stats Dashboard */}
          <div className={styles.statsGrid}>
            <Card className={styles.statCard}>
              <div className={styles.statContent}>
                <div className={styles.statIconWrapper}>
                  <Car className={styles.statIcon} size={24} />
                </div>
                <div className={styles.statInfo}>
                  <div className={styles.statNumber}>{dashboardStats.total}</div>
                  <div className={styles.statLabel}>Total Vehicles</div>
                  <div className={styles.statChange}>
                    <TrendingUp size={14} />
                    <span>Total listings</span>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className={styles.statCard}>
              <div className={styles.statContent}>
                <div className={`${styles.statIconWrapper} ${styles.pendingIcon}`}>
                  <Clock className={styles.statIcon} size={24} />
                </div>
                <div className={styles.statInfo}>
                  <div className={styles.statNumber}>{dashboardStats.pending}</div>
                  <div className={styles.statLabel}>Pending Approval</div>
                  <div className={styles.statChange}>
                    <AlertTriangle size={14} />
                    <span>Needs attention</span>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className={styles.statCard}>
              <div className={styles.statContent}>
                <div className={`${styles.statIconWrapper} ${styles.approvedIcon}`}>
                  <Check className={styles.statIcon} size={24} />
                </div>
                <div className={styles.statInfo}>
                  <div className={styles.statNumber}>{dashboardStats.approved}</div>
                  <div className={styles.statLabel}>Approved</div>
                  <div className={styles.statChange}>
                    <TrendingUp size={14} />
                    <span>Live on site</span>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className={styles.statCard}>
              <div className={styles.statContent}>
                <div className={`${styles.statIconWrapper} ${styles.rejectedIcon}`}>
                  <XCircle className={styles.statIcon} size={24} />
                </div>
                <div className={styles.statInfo}>
                  <div className={styles.statNumber}>{dashboardStats.rejected}</div>
                  <div className={styles.statLabel}>Rejected</div>
                  <div className={styles.statChange}>
                    <span>Quality control</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Filters Section */}
        <Card className={styles.filtersCard}>
          <div className={styles.filtersHeader}>
            <h3 className={styles.filtersTitle}>
              <Filter size={20} />
              Search & Filter
            </h3>
          </div>
          <div className={styles.filtersContent}>
            <div className={styles.searchContainer}>
              <Search className={styles.searchIcon} size={20} />
              <Input
                placeholder="Search vehicles by title, seller, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            
            <div className={styles.filters}>
              <Select 
                value={statusFilter} 
                onChange={setStatusFilter}
                className={styles.filterSelect}
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </Select>
              
              <Select 
                value={brandFilter} 
                onChange={setBrandFilter}
                className={styles.filterSelect}
              >
                <option value="all">All Brands</option>
                {uniqueBrands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </Select>
            </div>
          </div>
        </Card>

        {/* Results Header */}
        <div className={styles.resultsHeader}>
          <h3 className={styles.resultsTitle}>
            Vehicle Listings ({filteredVehicles.length})
          </h3>
          {loading && <div className={styles.loadingSpinner}>⏳ Loading...</div>}
        </div>

        {/* Vehicles Grid */}
        <div className={styles.vehiclesGrid}>
          {filteredVehicles.map((vehicle) => (
            <Card key={vehicle.id} className={styles.vehicleCard}>
              <div className={styles.vehicleImage}>
                <img src={vehicle.image} alt={vehicle.title} />
                <div className={styles.vehicleStatus}>
                  <span className={getStatusBadgeClass(vehicle.status)}>
                    {vehicle.status}
                  </span>
                </div>
              </div>
              
              <div className={styles.vehicleContent}>
                <div className={styles.vehicleHeader}>
                  <h3 className={styles.vehicleTitle}>{vehicle.title}</h3>
                  <div className={styles.vehiclePrice}>{vehicle.price}</div>
                </div>
                
                <div className={styles.vehicleDetails}>
                  <div className={styles.vehicleDetail}>
                    <User size={16} />
                    <span>{vehicle.seller}</span>
                  </div>
                  <div className={styles.vehicleDetail}>
                    <MapPin size={16} />
                    <span>{vehicle.location}</span>
                  </div>
                  <div className={styles.vehicleDetail}>
                    <Eye size={16} />
                    <span>{vehicle.views} views • Posted {vehicle.posted}</span>
                  </div>
                </div>
                
                <div className={styles.vehicleServices}>
                  {vehicle.hasInsurance && (
                    <span className={styles.badgeInsurance}>
                      <Shield size={12} />
                      Insurance Available
                    </span>
                  )}
                  {vehicle.hasLeasing && (
                    <span className={styles.badgeLeasing}>
                      <Building2 size={12} />
                      Leasing Options
                    </span>
                  )}
                </div>
                
                <div className={styles.vehicleActions}>
                  <Button 
                    className={styles.viewButton}
                    onClick={() => handleViewVehicle(vehicle)}
                  >
                    <Eye size={16} />
                    View Details
                  </Button>
                  
                  {vehicle.status === 'Pending' && (
                    <>
                      <Button 
                        className={styles.approveButton}
                        onClick={() => approveAd(vehicle.id)}
                        disabled={loading}
                      >
                        <Check size={16} />
                        {loading ? 'Processing...' : 'Approve'}
                      </Button>
                      <Button 
                        className={styles.rejectButton}
                        onClick={() => rejectAd(vehicle.id)}
                        disabled={loading}
                      >
                        <XCircle size={16} />
                        Reject
                      </Button>
                    </>
                  )}
                  
                  <Button 
                    className={styles.deleteButton}
                    onClick={() => handleDeleteVehicle(vehicle.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {!loading && filteredVehicles.length === 0 && (
          <Card className={styles.emptyState}>
            <Car size={48} />
            <h3>No vehicles found</h3>
            <p>Try adjusting your search criteria or filters.</p>
          </Card>
        )}
      </div>

      {/* Notification Panel */}
      <Dialog isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)}>
        <div className={styles.notificationPanel}>
          <div className={styles.dialogHeader}>
            <h2 className={styles.dialogTitle}>
              <Bell size={24} />
              Pending Approvals ({pendingVehicles.length})
            </h2>
          </div>
          <div className={styles.notificationsList}>
            {pendingVehicles.length === 0 ? (
              <div className={styles.noNotifications}>
                <Check size={48} />
                <p>All caught up! No pending approvals.</p>
              </div>
            ) : (
              pendingVehicles.map((vehicle) => (
                <div key={vehicle.id} className={styles.notificationItem}>
                  <img src={vehicle.image} alt={vehicle.title} className={styles.notificationImage} />
                  <div className={styles.notificationContent}>
                    <h4>{vehicle.title}</h4>
                    <p>Seller: {vehicle.seller}</p>
                    <p>Posted: {vehicle.posted}</p>
                  </div>
                  <div className={styles.notificationActions}>
                    <Button 
                      className={styles.approveButton}
                      onClick={() => {
                        approveAd(vehicle.id);
                        setIsNotificationOpen(false);
                      }}
                      disabled={loading}
                    >
                      <Check size={16} />
                      Approve
                    </Button>
                    <Button 
                      className={styles.rejectButton}
                      onClick={() => {
                        rejectAd(vehicle.id);
                        setIsNotificationOpen(false);
                      }}
                      disabled={loading}
                    >
                      <XCircle size={16} />
                      Reject
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Dialog>

      {/* View Vehicle Dialog */}
      <Dialog isOpen={isViewDialogOpen} onClose={() => setIsViewDialogOpen(false)}>
        {selectedVehicle && (
          <div className={styles.dialogContent}>
            <div className={styles.dialogHeader}>
              <h2 className={styles.dialogTitle}>Vehicle Details</h2>
              {selectedVehicle.status === 'Pending' && (
                <div className={styles.dialogHeaderActions}>
                  <Button 
                    className={styles.approveButton}
                    onClick={() => {
                      approveAd(selectedVehicle.id);
                      setIsViewDialogOpen(false);
                    }}
                    disabled={loading}
                  >
                    <Check size={16} />
                    Approve
                  </Button>
                  <Button 
                    className={styles.rejectButton}
                    onClick={() => {
                      rejectAd(selectedVehicle.id);
                      setIsViewDialogOpen(false);
                    }}
                    disabled={loading}
                  >
                    <XCircle size={16} />
                    Reject
                  </Button>
                </div>
              )}
            </div>
            <div className={styles.vehicleDetailsDialog}>
              <img 
                src={selectedVehicle.image} 
                alt={selectedVehicle.title}
                className={styles.dialogImage}
              />
              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <label>Title:</label>
                  <span>{selectedVehicle.title}</span>
                </div>
                <div className={styles.detailItem}>
                  <label>Price:</label>
                  <span className={styles.priceValue}>{selectedVehicle.price}</span>
                </div>
                <div className={styles.detailItem}>
                  <label>Brand:</label>
                  <span>{selectedVehicle.brand}</span>
                </div>
                <div className={styles.detailItem}>
                  <label>Model:</label>
                  <span>{selectedVehicle.model}</span>
                </div>
                <div className={styles.detailItem}>
                  <label>Year:</label>
                  <span>{selectedVehicle.year}</span>
                </div>
                <div className={styles.detailItem}>
                  <label>Mileage:</label>
                  <span>{selectedVehicle.mileage}</span>
                </div>
                <div className={styles.detailItem}>
                  <label>Location:</label>
                  <span>{selectedVehicle.location}</span>
                </div>
                <div className={styles.detailItem}>
                  <label>Seller:</label>
                  <span>{selectedVehicle.seller}</span>
                </div>
                <div className={styles.detailItem}>
                  <label>Email:</label>
                  <span>{selectedVehicle.sellerEmail}</span>
                </div>
                <div className={styles.detailItem}>
                  <label>Phone:</label>
                  <span>{selectedVehicle.sellerPhone}</span>
                </div>
                <div className={styles.detailItem}>
                  <label>Status:</label>
                  <span className={getStatusBadgeClass(selectedVehicle.status)}>
                    {selectedVehicle.status}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <label>Posted:</label>
                  <span>{selectedVehicle.posted}</span>
                </div>
                <div className={styles.detailItem}>
                  <label>Views:</label>
                  <span>{selectedVehicle.views}</span>
                </div>
                <div className={styles.detailItem}>
                  <label>Vehicle Type:</label>
                  <span>{selectedVehicle.vehicleType}</span>
                </div>
                <div className={styles.detailItem}>
                  <label>Condition:</label>
                  <span>{selectedVehicle.condition}</span>
                </div>
                <div className={styles.detailItem}>
                  <label>Transmission:</label>
                  <span>{selectedVehicle.transmission}</span>
                </div>
                <div className={styles.detailItem}>
                  <label>Fuel Type:</label>
                  <span>{selectedVehicle.fuelType}</span>
                </div>
                <div className={styles.detailItem}>
                  <label>Color:</label>
                  <span>{selectedVehicle.colour}</span>
                </div>
                {selectedVehicle.engineCapacity && (
                  <div className={styles.detailItem}>
                    <label>Engine Capacity:</label>
                    <span>{selectedVehicle.engineCapacity}</span>
                  </div>
                )}
                {selectedVehicle.registrationYear && (
                  <div className={styles.detailItem}>
                    <label>Registration Year:</label>
                    <span>{selectedVehicle.registrationYear}</span>
                  </div>
                )}
              </div>
              <div className={styles.detailSection}>
                <label>Description:</label>
                <p className={styles.descriptionText}>{selectedVehicle.description}</p>
              </div>
              {selectedVehicle.features && selectedVehicle.features.length > 0 && (
                <div className={styles.detailSection}>
                  <label>Features:</label>
                  <div className={styles.featuresList}>
                    {selectedVehicle.features.map((feature, index) => (
                      <span key={index} className={styles.featureBadge}>
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {selectedVehicle.images && selectedVehicle.images.length > 1 && (
                <div className={styles.detailSection}>
                  <label>Additional Images:</label>
                  <div className={styles.imageGallery}>
                    {selectedVehicle.images.map((image, index) => (
                      <img 
                        key={index} 
                        src={image} 
                        alt={`${selectedVehicle.title} - Image ${index + 1}`}
                        className={styles.galleryImage}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Dialog>
    </div>
  )
}

export default ManageVehicles