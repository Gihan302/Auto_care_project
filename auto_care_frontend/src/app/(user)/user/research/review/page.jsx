'use client';

import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, MessageCircle, Search, ChevronDown, Award, Calendar, TrendingUp } from 'lucide-react';
import styles from './page.module.css';
import apiClient from '@/utils/axiosConfig';

const CarReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    verifiedOwners: 0,
    thisMonth: 0
  });

  // Fetch reviews from API
  useEffect(() => {
    fetchReviews();
    fetchStats();
  }, [searchQuery, filterRating, sortBy]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (searchQuery) params.append('search', searchQuery);
      if (filterRating !== 'all') params.append('rating', filterRating);
      params.append('sort', sortBy);

      const response = await apiClient.get(`/api/reviews?${params.toString()}`);
      
      // Transform the response to match frontend expectations
      const transformedReviews = response.data.map(review => ({
        ...review,
        categoryRatings: Object.entries(review.categoryRatings || {}).map(([category, rating]) => ({
          category,
          rating
        })),
        expanded: false
      }));
      
      setReviews(transformedReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleWriteReview = () => {
    window.location.href = '/user/research/review/writeReview';
  };

  const fetchStats = async () => {
    try {
      const response = await apiClient.get('/api/reviews/stats');
      setStats({
        totalReviews: response.data.totalReviews || 0,
        averageRating: response.data.averageRating || 0,
        verifiedOwners: response.data.verifiedOwners || 0,
        thisMonth: response.data.thisMonth || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({
        totalReviews: 0,
        averageRating: 0,
        verifiedOwners: 0,
        thisMonth: 0
      });
    }
  };

  const handleHelpful = async (reviewId) => {
    try {
      await apiClient.post(`/api/reviews/${reviewId}/helpful`);
      // Refresh reviews to update count
      fetchReviews();
    } catch (error) {
      console.error('Error marking review as helpful:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchReviews();
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        className={i < Math.floor(rating) ? styles.starFilled : styles.starEmpty}
      />
    ));
  };

  const expandReview = (reviewId) => {
    // Toggle expanded state for "Read More"
    setReviews(reviews.map(review => 
      review.id === reviewId 
        ? { ...review, expanded: !review.expanded }
        : review
    ));
  };

  return (
    <div className={styles.pageContainer}>
      {/* Header Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Car Reviews</h1>
          <p className={styles.heroSubtitle}>Real reviews from real owners</p>
          
          {/* Statistics */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{stats.totalReviews}</div>
              <div className={styles.statLabel}>Total Reviews</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>
                {stats.averageRating.toFixed(1)}
                <Star size={20} className={styles.statStar} />
              </div>
              <div className={styles.statLabel}>Average Rating</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{stats.verifiedOwners}%</div>
              <div className={styles.statLabel}>Verified Owners</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{stats.thisMonth}</div>
              <div className={styles.statLabel}>This Month</div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.mainContent}>
        {/* Filters Section */}
        <div className={styles.filtersCard}>
          <form onSubmit={handleSearch} className={styles.filtersGrid}>
            {/* Search */}
            <div className={styles.searchContainer}>
              <Search className={styles.searchIcon} size={20} />
              <input
                type="text"
                placeholder="Search by car model..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            {/* Filter by Rating */}
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="recent">Most Recent</option>
              <option value="helpful">Most Helpful</option>
              <option value="rating-high">Highest Rating</option>
              <option value="rating-low">Lowest Rating</option>
            </select>
          </form>

          {/* Quick Filters */}
          <div className={styles.quickFilters}>
            <button className={`${styles.quickFilterBtn} ${styles.quickFilterActive}`}>
              <Award size={14} />
              Verified Owners
            </button>
            <button className={styles.quickFilterBtn}>SUVs</button>
            <button className={styles.quickFilterBtn}>Sedans</button>
            <button className={styles.quickFilterBtn}>Electric</button>
          </div>
        </div>

        {/* Reviews List */}
        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loader}></div>
            <p>Loading reviews...</p>
          </div>
        ) : (
          <div className={styles.reviewsList}>
            {reviews.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No reviews found. Be the first to write one!</p>
              </div>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className={styles.reviewCard}>
                  {/* Review Header */}
                  <div className={styles.reviewHeader}>
                    <div className={styles.reviewerInfo}>
                      <div className={styles.avatar}>
                        {review.reviewer?.fname?.charAt(0)}{review.reviewer?.lname?.charAt(0)}
                      </div>
                      <div className={styles.reviewerDetails}>
                        <div className={styles.reviewerName}>
                          <span>{review.reviewer?.fname} {review.reviewer?.lname}</span>
                          {review.verifiedOwner && (
                            <span className={styles.verifiedBadge}>
                              <Award size={12} />
                              Verified Owner
                            </span>
                          )}
                        </div>
                        <div className={styles.reviewMeta}>
                          <Calendar size={14} />
                          <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{review.ownershipDuration}</span>
                          <span>•</span>
                          <span>{review.mileage}</span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.overallRating}>
                      <div className={styles.ratingNumber}>{review.overallRating.toFixed(1)}</div>
                      <div className={styles.ratingStars}>
                        {renderStars(review.overallRating)}
                      </div>
                    </div>
                  </div>

                  {/* Car Model */}
                  <div className={styles.carInfo}>
                    <h2 className={styles.carModel}>{review.carMake} {review.carModel}</h2>
                    <h3 className={styles.reviewTitle}>{review.title}</h3>
                  </div>

                  {/* Category Ratings */}
                  <div className={styles.categoryRatings}>
                    {review.categoryRatings?.map((category) => (
                      <div key={category.category} className={styles.categoryItem}>
                        <div className={styles.categoryLabel}>
                          {category.category.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                        <div className={styles.categoryStars}>
                          {renderStars(category.rating)}
                        </div>
                        <div className={styles.categoryScore}>{category.rating}/5</div>
                      </div>
                    ))}
                  </div>

                  {/* Review Text */}
                  <div className={styles.reviewContent}>
                    <p className={review.expanded ? styles.reviewTextExpanded : styles.reviewText}>
                      {review.reviewText}
                    </p>
                    {review.reviewText?.length > 300 && (
                      <button 
                        onClick={() => expandReview(review.id)}
                        className={styles.readMoreBtn}
                      >
                        {review.expanded ? 'Read Less' : 'Read More...'}
                      </button>
                    )}
                  </div>

                  {/* Pros and Cons */}
                  <div className={styles.prosConsGrid}>
                    <div className={styles.prosSection}>
                      <h4 className={styles.prosTitle}>
                        <span className={styles.prosIcon}>✓</span>
                        Pros
                      </h4>
                      <ul className={styles.prosList}>
                        {review.pros?.split(',').map((pro, idx) => (
                          <li key={idx}>{pro.trim()}</li>
                        ))}
                      </ul>
                    </div>

                    <div className={styles.consSection}>
                      <h4 className={styles.consTitle}>
                        <span className={styles.consIcon}>✗</span>
                        Cons
                      </h4>
                      <ul className={styles.consList}>
                        {review.cons?.split(',').map((con, idx) => (
                          <li key={idx}>{con.trim()}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Images */}
                  {review.images && review.images.length > 0 && (
                    <div className={styles.reviewImages}>
                      {review.images.slice(0, 4).map((imageUrl, idx) => (
                        <div key={idx} className={styles.imageThumb}>
                          <img src={imageUrl} alt={`Review ${idx + 1}`} />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Review Footer */}
                  <div className={styles.reviewFooter}>
                    <button 
                      onClick={() => handleHelpful(review.id)}
                      className={styles.helpfulBtn}
                    >
                      <ThumbsUp size={18} />
                      <span>Helpful ({review.helpfulCount})</span>
                    </button>
                    <button className={styles.commentBtn}>
                      <MessageCircle size={18} />
                      <span>{review.comments?.length || 0} Comments</span>
                    </button>
                    <button className={styles.readFullBtn}>
                      Read Full Review →
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Load More */}
        {!loading && reviews.length > 0 && (
          <div className={styles.loadMoreContainer}>
            <button className={styles.loadMoreBtn}>
              Load More Reviews
            </button>
          </div>
        )}
      </div>

      {/* Floating Write Review Button */}
      {/* Floating Write Review Button */}
      <button 
        className={styles.floatingBtn} 
        onClick={handleWriteReview}
      >
        <Star size={20} className={styles.floatingBtnIcon} />
        Write a Review
      </button>
    </div>
  );
};

export default CarReviewsPage;