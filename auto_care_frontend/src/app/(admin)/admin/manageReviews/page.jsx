'use client'

import { useState, useEffect } from "react"
import { Search, Plus, Eye, Edit, Trash2, Star, User, Shield, Award, Filter, TrendingUp, X, Bell, Check, XCircle, Clock, AlertTriangle, Calendar, MessageCircle, ThumbsUp } from "lucide-react"
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

const ManageReviews = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [ratingFilter, setRatingFilter] = useState("all")
  const [selectedReview, setSelectedReview] = useState(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [reviews, setReviews] = useState([])
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

const transformReviewData = (review) => {
  console.log('🔄 Transforming review:', review.id);
  
  // Determine status based on flag value
  let status;
  if (review.flag === 1) {
    status = 'Approved';
  } else if (review.flag === 0) {
    status = 'Pending';
  } else if (review.flag === -1) {
    status = 'Rejected';
  } else {
    status = 'Unknown';
  }
  
  return {
    id: review.id,
    title: review.title,
    carMake: review.carMake,
    carModel: review.carModel,
    year: review.year,
    variant: review.variant,
    overallRating: review.overallRating,
    reviewText: review.reviewText,
    pros: review.pros,
    cons: review.cons,
    reviewer: {
      fname: review.reviewer?.fname || 'Unknown',
      lname: review.reviewer?.lname || 'User',
      email: 'N/A'
    },
    verifiedOwner: review.verifiedOwner || false,
    helpfulCount: review.helpfulCount || 0,
    viewCount: review.viewCount || 0,
    status: status,  // ✅ Use calculated status
    flag: review.flag,
    createdAt: review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'N/A',
    mileage: review.mileage,
    ownershipDuration: review.ownershipDuration,
    purchaseDate: review.purchaseDate,
    categoryRatings: {
      performance: review.categoryRatings?.performance || 0,
      comfort: review.categoryRatings?.comfort || 0,
      fuelEconomy: review.categoryRatings?.fuelEconomy || 0,
      safety: review.categoryRatings?.safety || 0,
      value: review.categoryRatings?.value || 0
    },
    images: review.images || [],
    maintenanceExperience: review.maintenanceExperience,
    finalThoughts: review.finalThoughts
  };
};


  // Fetch all reviews - FIXED ENDPOINT
  const fetchAllReviews = async () => {
    setLoading(true);
    try {
      console.log('📡 Fetching all reviews from AdminController...');
      
      // CHANGED: Using /api/admin/reviews/all instead of /admin/reviews/all
      const response = await fetch(`${API_BASE_URL}/api/admin/reviews/all`, {
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const reviewsData = await response.json();
        console.log('✅ Received', reviewsData.length, 'reviews');
        
        const transformedReviews = reviewsData.map(transformReviewData);
        setReviews(transformedReviews);
        
        // Calculate stats
        updateStatsFromReviews(transformedReviews);
      } else if (response.status === 401 || response.status === 403) {
        console.error('❌ Authentication failed');
        alert('Authentication failed. Please login again.');
        // Optional: Redirect to login
        // window.location.href = '/login';
      } else {
        console.error('❌ Failed to fetch reviews:', response.status);
        const errorText = await response.text();
        console.error('Error details:', errorText);
      }
    } catch (error) {
      console.error('💥 Error fetching reviews:', error);
      alert('Error connecting to server. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // Update stats from reviews data
  const updateStatsFromReviews = (reviewsList) => {
    const stats = {
      total: reviewsList.length,
      pending: reviewsList.filter(r => r.status === 'Pending').length,
      approved: reviewsList.filter(r => r.status === 'Approved').length,
      rejected: reviewsList.filter(r => r.status === 'Rejected').length
    };
    setDashboardStats(stats);
    console.log('📊 Stats updated:', stats);
  };

  // Approve review - FIXED ENDPOINT
  const approveReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to approve this review?')) {
      return;
    }

    setLoading(true);
    try {
      console.log('✅ Approving review:', reviewId);
      
      // CHANGED: Using /api/admin/reviews/approve/{id}
      const response = await fetch(`${API_BASE_URL}/api/admin/reviews/approve/${reviewId}`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Review approved successfully');
        
        alert(result.message || 'Review approved successfully!');
        
        // Refresh data
        await fetchAllReviews();
        
        // Close dialogs
        setIsViewDialogOpen(false);
        setIsNotificationOpen(false);
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Failed to approve review' }));
        console.error('❌ Failed to approve:', errorData);
        alert(errorData.message || 'Failed to approve review');
      }
    } catch (error) {
      console.error('💥 Error approving review:', error);
      alert('Error approving review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reject review - FIXED ENDPOINT
  const rejectReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to reject this review?')) {
      return;
    }

    setLoading(true);
    try {
      console.log('🗑️ Rejecting review:', reviewId);
      
      // CHANGED: Using /api/admin/reviews/reject/{id}
      const response = await fetch(`${API_BASE_URL}/api/admin/reviews/reject/${reviewId}`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Review rejected successfully');
        
        alert(result.message || 'Review rejected successfully!');
        
        // Refresh data
        await fetchAllReviews();
        
        // Close dialogs
        setIsViewDialogOpen(false);
        setIsNotificationOpen(false);
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Failed to reject review' }));
        console.error('❌ Failed to reject:', errorData);
        alert(errorData.message || 'Failed to reject review');
      }
    } catch (error) {
      console.error('💥 Error rejecting review:', error);
      alert('Error rejecting review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Delete review permanently - FIXED ENDPOINT
  const deleteReview = async (reviewId) => {
    if (!window.confirm('⚠️ Are you sure you want to permanently delete this review? This action cannot be undone!')) {
      return;
    }

    setLoading(true);
    try {
      console.log('🗑️ Deleting review:', reviewId);
      
      // CHANGED: Using /api/admin/reviews/delete/{id}
      const response = await fetch(`${API_BASE_URL}/api/admin/reviews/delete/${reviewId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Review deleted successfully');
        alert(result.message || 'Review deleted successfully!');
        
        // Refresh data
        await fetchAllReviews();
        
        // Close dialog if open
        setIsViewDialogOpen(false);
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Failed to delete review' }));
        console.error('❌ Failed to delete review:', errorData);
        alert(errorData.message || 'Failed to delete review');
      }
    } catch (error) {
      console.error('💥 Error deleting review:', error);
      alert('Error deleting review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    const initializeData = async () => {
      const token = getAuthToken();
      if (!token) {
        console.error('❌ No authentication token found');
        alert('Please login first');
        // Optional: Redirect to login
        // window.location.href = '/login';
        return;
      }
      
      console.log('🚀 Initializing ManageReviews page...');
      await fetchAllReviews();
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

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? styles.starFilled : styles.starEmpty}
        fill={i < rating ? "currentColor" : "none"}
      />
    ));
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.carMake.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.carModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${review.reviewer.fname} ${review.reviewer.lname}`.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || review.status === statusFilter
    const matchesRating = ratingFilter === "all" || review.overallRating >= parseInt(ratingFilter)
    return matchesSearch && matchesStatus && matchesRating
  })

  const pendingReviews = reviews.filter(r => r.status === 'Pending')

  const handleViewReview = (review) => {
    setSelectedReview(review);
    setIsViewDialogOpen(true);
  }

  return (
    <div>
      <div className={styles.content}>
        {/* Header Section */}
        <div className={styles.headerSection}>
          <div className={styles.header}>
            <div className={styles.titleSection}>
              <h1 className={styles.title}>Review Management</h1>
              <p className={styles.subtitle}>Manage and moderate all car reviews</p>
            </div>
            <div className={styles.headerActions}>
              <NotificationBell 
                pendingCount={dashboardStats.pending}
                onClick={() => setIsNotificationOpen(true)}
              />
            </div>
          </div>

          {/* Stats Dashboard */}
          <div className={styles.statsGrid}>
            <Card className={styles.statCard}>
              <div className={styles.statContent}>
                <div className={styles.statIconWrapper}>
                  <Star className={styles.statIcon} size={24} />
                </div>
                <div className={styles.statInfo}>
                  <div className={styles.statNumber}>{dashboardStats.total}</div>
                  <div className={styles.statLabel}>Total Reviews</div>
                  <div className={styles.statChange}>
                    <TrendingUp size={14} />
                    <span>All submissions</span>
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
                placeholder="Search reviews by title, car, or reviewer..."
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
                value={ratingFilter} 
                onChange={setRatingFilter}
                className={styles.filterSelect}
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="2">2+ Stars</option>
                <option value="1">1+ Stars</option>
              </Select>
            </div>
          </div>
        </Card>

        {/* Results Header */}
        <div className={styles.resultsHeader}>
          <h3 className={styles.resultsTitle}>
            Reviews ({filteredReviews.length})
          </h3>
          {loading && <div className={styles.loadingSpinner}>⏳ Loading...</div>}
        </div>

        {/* Reviews Grid */}
        <div className={styles.reviewsGrid}>
          {filteredReviews.map((review) => (
            <Card key={review.id} className={styles.reviewCard}>
              <div className={styles.reviewHeader}>
                <div className={styles.reviewerInfo}>
                  <div className={styles.avatar}>
                    {review.reviewer.fname?.charAt(0)}{review.reviewer.lname?.charAt(0)}
                  </div>
                  <div className={styles.reviewerDetails}>
                    <div className={styles.reviewerName}>
                      <span>{review.reviewer.fname} {review.reviewer.lname}</span>
                      {review.verifiedOwner && (
                        <span className={styles.verifiedBadge}>
                          <Award size={12} />
                          Verified
                        </span>
                      )}
                    </div>
                    <div className={styles.reviewMeta}>
                      <Calendar size={14} />
                      <span>{review.createdAt}</span>
                    </div>
                  </div>
                </div>
                <div className={styles.reviewStatus}>
                  <span className={getStatusBadgeClass(review.status)}>
                    {review.status}
                  </span>
                </div>
              </div>
              
              <div className={styles.reviewContent}>
                <div className={styles.carInfo}>
                  <h3 className={styles.carTitle}>{review.carMake} {review.carModel}</h3>
                  {review.year && <span className={styles.carYear}>{review.year}</span>}
                </div>
                
                <h4 className={styles.reviewTitle}>{review.title}</h4>
                
                <div className={styles.ratingSection}>
                  <div className={styles.stars}>
                    {renderStars(review.overallRating)}
                  </div>
                  <span className={styles.ratingNumber}>{review.overallRating.toFixed(1)}</span>
                </div>
                
                <p className={styles.reviewText}>
                  {review.reviewText?.substring(0, 150)}
                  {review.reviewText?.length > 150 && '...'}
                </p>
                
                <div className={styles.reviewStats}>
                  <div className={styles.statItem}>
                    <ThumbsUp size={16} />
                    <span>{review.helpfulCount} helpful</span>
                  </div>
                  <div className={styles.statItem}>
                    <Eye size={16} />
                    <span>{review.viewCount} views</span>
                  </div>
                </div>
              </div>
              
              <div className={styles.reviewActions}>
                <Button 
                  className={styles.viewButton}
                  onClick={() => handleViewReview(review)}
                >
                  <Eye size={16} />
                  View Details
                </Button>
                
                {review.status === 'Pending' && (
                  <>
                    <Button 
                      className={styles.approveButton}
                      onClick={() => approveReview(review.id)}
                      disabled={loading}
                    >
                      <Check size={16} />
                      {loading ? 'Processing...' : 'Approve'}
                    </Button>
                    <Button 
                      className={styles.rejectButton}
                      onClick={() => rejectReview(review.id)}
                      disabled={loading}
                    >
                      <XCircle size={16} />
                      Reject
                    </Button>
                  </>
                )}
                
                <Button 
                  className={styles.deleteButton}
                  onClick={() => deleteReview(review.id)}
                  disabled={loading}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {!loading && filteredReviews.length === 0 && (
          <Card className={styles.emptyState}>
            <Star size={48} />
            <h3>No reviews found</h3>
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
              Pending Reviews ({pendingReviews.length})
            </h2>
          </div>
          <div className={styles.notificationsList}>
            {pendingReviews.length === 0 ? (
              <div className={styles.noNotifications}>
                <Check size={48} />
                <p>All caught up! No pending reviews.</p>
              </div>
            ) : (
              pendingReviews.map((review) => (
                <div key={review.id} className={styles.notificationItem}>
                  <div className={styles.notificationAvatar}>
                    {review.reviewer.fname?.charAt(0)}{review.reviewer.lname?.charAt(0)}
                  </div>
                  <div className={styles.notificationContent}>
                    <h4>{review.title}</h4>
                    <p>{review.carMake} {review.carModel}</p>
                    <p>by {review.reviewer.fname} {review.reviewer.lname}</p>
                    <span className={styles.notificationDate}>{review.createdAt}</span>
                  </div>
                  <div className={styles.notificationActions}>
                    <Button 
                      className={styles.approveButton}
                      onClick={() => approveReview(review.id)}
                      disabled={loading}
                    >
                      <Check size={16} />
                      Approve
                    </Button>
                    <Button 
                      className={styles.rejectButton}
                      onClick={() => rejectReview(review.id)}
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

      {/* View Review Dialog */}
      <Dialog isOpen={isViewDialogOpen} onClose={() => setIsViewDialogOpen(false)}>
        {selectedReview && (
          <div className={styles.dialogContent}>
            <div className={styles.dialogHeader}>
              <h2 className={styles.dialogTitle}>Review Details</h2>
              {selectedReview.status === 'Pending' && (
                <div className={styles.dialogHeaderActions}>
                  <Button 
                    className={styles.approveButton}
                    onClick={() => approveReview(selectedReview.id)}
                    disabled={loading}
                  >
                    <Check size={16} />
                    {loading ? 'Processing...' : 'Approve'}
                  </Button>
                  <Button 
                    className={styles.rejectButton}
                    onClick={() => rejectReview(selectedReview.id)}
                    disabled={loading}
                  >
                    <XCircle size={16} />
                    Reject
                  </Button>
                </div>
              )}
            </div>
            <div className={styles.reviewDetailsDialog}>
              {/* Car Information */}
              <div className={styles.detailSection}>
                <h3 className={styles.sectionTitle}>Vehicle Information</h3>
                <div className={styles.detailsGrid}>
                  <div className={styles.detailItem}>
                    <label>Make & Model:</label>
                    <span className={styles.carNameValue}>{selectedReview.carMake} {selectedReview.carModel}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <label>Year:</label>
                    <span>{selectedReview.year}</span>
                  </div>
                  {selectedReview.variant && (
                    <div className={styles.detailItem}>
                      <label>Variant:</label>
                      <span>{selectedReview.variant}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Reviewer Information */}
              <div className={styles.detailSection}>
                <h3 className={styles.sectionTitle}>Reviewer Information</h3>
                <div className={styles.detailsGrid}>
                  <div className={styles.detailItem}>
                    <label>Name:</label>
                    <span>{selectedReview.reviewer.fname} {selectedReview.reviewer.lname}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <label>Email:</label>
                    <span>{selectedReview.reviewer.email}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <label>Verified Owner:</label>
                    <span className={selectedReview.verifiedOwner ? styles.verifiedYes : styles.verifiedNo}>
                      {selectedReview.verifiedOwner ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <label>Ownership Duration:</label>
                    <span>{selectedReview.ownershipDuration || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Review Content */}
              <div className={styles.detailSection}>
                <h3 className={styles.sectionTitle}>Review</h3>
                <div className={styles.reviewTitleSection}>
                  <h4>{selectedReview.title}</h4>
                  <div className={styles.ratingDisplay}>
                    {renderStars(selectedReview.overallRating)}
                    <span>{selectedReview.overallRating.toFixed(1)}/5</span>
                  </div>
                </div>
                <p className={styles.fullReviewText}>{selectedReview.reviewText}</p>
              </div>

              {/* Category Ratings */}
              <div className={styles.detailSection}>
                <h3 className={styles.sectionTitle}>Category Ratings</h3>
                <div className={styles.categoryRatings}>
                  {selectedReview.categoryRatings.performance && (
                    <div className={styles.categoryItem}>
                      <span>Performance:</span>
                      <div className={styles.categoryStars}>
                        {renderStars(selectedReview.categoryRatings.performance)}
                      </div>
                    </div>
                  )}
                  {selectedReview.categoryRatings.comfort && (
                    <div className={styles.categoryItem}>
                      <span>Comfort:</span>
                      <div className={styles.categoryStars}>
                        {renderStars(selectedReview.categoryRatings.comfort)}
                      </div>
                    </div>
                  )}
                  {selectedReview.categoryRatings.fuelEconomy && (
                    <div className={styles.categoryItem}>
                      <span>Fuel Economy:</span>
                      <div className={styles.categoryStars}>
                        {renderStars(selectedReview.categoryRatings.fuelEconomy)}
                      </div>
                    </div>
                  )}
                  {selectedReview.categoryRatings.safety && (
                    <div className={styles.categoryItem}>
                      <span>Safety:</span>
                      <div className={styles.categoryStars}>
                        {renderStars(selectedReview.categoryRatings.safety)}
                      </div>
                    </div>
                  )}
                  {selectedReview.categoryRatings.value && (
                    <div className={styles.categoryItem}>
                      <span>Value for Money:</span>
                      <div className={styles.categoryStars}>
                        {renderStars(selectedReview.categoryRatings.value)}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Pros and Cons */}
              {(selectedReview.pros || selectedReview.cons) && (
                <div className={styles.detailSection}>
                  <h3 className={styles.sectionTitle}>Pros & Cons</h3>
                  <div className={styles.prosConsGrid}>
                    {selectedReview.pros && (
                      <div className={styles.prosSection}>
                        <h4>✓ Pros</h4>
                        <p>{selectedReview.pros}</p>
                      </div>
                    )}
                    {selectedReview.cons && (
                      <div className={styles.consSection}>
                        <h4>✗ Cons</h4>
                        <p>{selectedReview.cons}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Images */}
              {selectedReview.images && selectedReview.images.length > 0 && (
                <div className={styles.detailSection}>
                  <h3 className={styles.sectionTitle}>Images ({selectedReview.images.length})</h3>
                  <div className={styles.imageGallery}>
                    {selectedReview.images.map((image, index) => (
                      <img 
                        key={index} 
                        src={image} 
                        alt={`Review image ${index + 1}`}
                        className={styles.galleryImage}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Review Stats */}
              <div className={styles.detailSection}>
                <h3 className={styles.sectionTitle}>Statistics</h3>
                <div className={styles.detailsGrid}>
                  <div className={styles.detailItem}>
                    <label>Status:</label>
                    <span className={getStatusBadgeClass(selectedReview.status)}>
                      {selectedReview.status}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <label>Helpful Count:</label>
                    <span>{selectedReview.helpfulCount}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <label>View Count:</label>
                    <span>{selectedReview.viewCount}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <label>Posted Date:</label>
                    <span>{selectedReview.createdAt}</span>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              {(selectedReview.maintenanceExperience || selectedReview.finalThoughts) && (
                <div className={styles.detailSection}>
                  <h3 className={styles.sectionTitle}>Additional Comments</h3>
                  {selectedReview.maintenanceExperience && (
                    <div className={styles.additionalInfo}>
                      <label>Maintenance Experience:</label>
                      <p>{selectedReview.maintenanceExperience}</p>
                    </div>
                  )}
                  {selectedReview.finalThoughts && (
                    <div className={styles.additionalInfo}>
                      <label>Final Thoughts:</label>
                      <p>{selectedReview.finalThoughts}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </Dialog>
    </div>
  )
}

export default ManageReviews