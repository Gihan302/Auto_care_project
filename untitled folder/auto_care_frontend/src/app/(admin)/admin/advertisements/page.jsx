'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';

const AdvertisementManagement = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const API_BASE_URL = 'http://localhost:8080/api/banner-ads';

  // FIXED: Match the token retrieval pattern from ManageReviews
  const getAuthToken = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    console.log('🔑 Token found:', token ? 'Yes' : 'No');
    if (token) {
      console.log('🔑 Token (first 20 chars):', token.substring(0, 20) + '...');
    }
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

  // Fetch all banner ads
  const fetchAds = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      
      if (!token) {
        setError('Authentication required. Please login again.');
        setLoading(false);
        return;
      }

      console.log('📡 Fetching ads...');

      const response = await fetch(`${API_BASE_URL}/all`, {
        headers: getAuthHeaders()
      });

      console.log('📥 Response status:', response.status);

      if (response.status === 401 || response.status === 403) {
        setError('Session expired or insufficient permissions. Please login again.');
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setAds(data);
        console.log('✅ Loaded', data.length, 'advertisements');
      } else {
        const errorText = await response.text();
        console.error('❌ Failed to fetch ads:', errorText);
        setError('Failed to fetch advertisements');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error('💥 Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      const token = getAuthToken();
      if (!token) {
        console.error('❌ No authentication token found');
        setError('Please login first');
        setLoading(false);
        return;
      }
      
      console.log('🚀 Initializing Advertisement Management...');
      await fetchAds();
    };
    
    initializeData();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        // Extract base64 without data URL prefix
        const base64String = reader.result.split(',')[1];
        setImageBase64(base64String);
        console.log('📷 Image converted to base64, length:', base64String.length);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!imageBase64 || !targetUrl) {
      setError('Please provide both image and target URL');
      return;
    }

    // Validate URL
    try {
      new URL(targetUrl);
    } catch (e) {
      setError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    // Get and validate token
    const token = getAuthToken();
    if (!token) {
      setError('Authentication required. Please login again.');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const requestBody = {
        image: imageBase64,
        targetUrl: targetUrl,
        title: title || null,
        description: description || null
      };

      console.log('📤 Submitting banner ad...');
      console.log('   - Target URL:', targetUrl);
      console.log('   - Has Image:', !!imageBase64);
      console.log('   - Image Size:', imageBase64?.length);

      const response = await fetch(`${API_BASE_URL}/create`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestBody)
      });

      console.log('✅ Response status:', response.status);

      // Handle authentication errors
      if (response.status === 401 || response.status === 403) {
        setError('Session expired or insufficient permissions. Please login again.');
        return;
      }

      // Check if response has content before parsing JSON
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        const text = await response.text();
        console.log('📥 Response text:', text);
        
        if (text) {
          try {
            data = JSON.parse(text);
          } catch (parseError) {
            console.error('💥 JSON parse error:', parseError);
            throw new Error('Invalid JSON response from server');
          }
        } else {
          data = { message: 'Empty response from server' };
        }
      } else {
        const text = await response.text();
        console.log('📥 Non-JSON response:', text);
        data = { message: text || 'Unexpected response format' };
      }

      if (response.ok) {
        setSuccess('Advertisement posted successfully!');
        // Reset form
        setImageFile(null);
        setImagePreview('');
        setImageBase64('');
        setTargetUrl('');
        setTitle('');
        setDescription('');
        const fileInput = document.getElementById('adImage');
        if (fileInput) fileInput.value = '';
        
        // Refresh ads list
        fetchAds();
      } else {
        setError(data.message || `Failed to create advertisement (Status: ${response.status})`);
      }
    } catch (err) {
      console.error('💥 Submit error:', err);
      setError(`Error: ${err.message || 'Failed to connect to server'}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this advertisement?')) {
      return;
    }

    const token = getAuthToken();
    if (!token) {
      setError('Authentication required. Please login again.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.status === 401 || response.status === 403) {
        setError('Session expired or insufficient permissions. Please login again.');
        return;
      }

      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        const text = await response.text();
        if (text) {
          data = JSON.parse(text);
        }
      }

      if (response.ok) {
        setSuccess('Advertisement deleted successfully!');
        fetchAds();
      } else {
        setError(data?.message || `Failed to delete advertisement (Status: ${response.status})`);
      }
    } catch (err) {
      console.error('💥 Delete error:', err);
      setError(`Error: ${err.message || 'Failed to connect to server'}`);
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    const token = getAuthToken();
    if (!token) {
      setError('Authentication required. Please login again.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${id}/toggle-active`, {
        method: 'PATCH',
        headers: getAuthHeaders()
      });

      if (response.status === 401 || response.status === 403) {
        setError('Session expired or insufficient permissions. Please login again.');
        return;
      }

      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        const text = await response.text();
        if (text) {
          data = JSON.parse(text);
        }
      }

      if (response.ok) {
        const status = currentStatus ? 'deactivated' : 'activated';
        setSuccess(`Advertisement ${status} successfully!`);
        fetchAds();
      } else {
        setError(data?.message || `Failed to toggle status (Status: ${response.status})`);
      }
    } catch (err) {
      console.error('💥 Toggle error:', err);
      setError(`Error: ${err.message || 'Failed to connect to server'}`);
    }
  };

  const truncateUrl = (url, maxLength = 40) => {
    return url.length > maxLength ? url.substring(0, maxLength) + '...' : url;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1 className={styles.title}>Advertisement Management</h1>
        <p className={styles.subtitle}>Manage active advertisements and create new ones.</p>
      </div>

      {error && (
        <div className={styles.alert} style={{ backgroundColor: '#fef2f2', borderColor: '#ef4444', color: '#991b1b' }}>
          {error}
          <button onClick={() => setError('')} className={styles.alertClose}>×</button>
        </div>
      )}

      {success && (
        <div className={styles.alert} style={{ backgroundColor: '#f0fdf4', borderColor: '#22c55e', color: '#166534' }}>
          {success}
          <button onClick={() => setSuccess('')} className={styles.alertClose}>×</button>
        </div>
      )}

      <div className={styles.formSection}>
        <h2 className={styles.sectionTitle}>Add New Advertisement</h2>
        <div className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="adImage" className={styles.label}>
                Advertisement Image *
              </label>
              <input
                type="file"
                id="adImage"
                accept="image/*"
                onChange={handleImageChange}
                className={styles.fileInput}
                disabled={submitting}
              />
              <p className={styles.inputHint}>Upload banner image (Max 5MB, recommended: 1200x400px)</p>
              {imagePreview && (
                <div className={styles.imagePreview}>
                  <img src={imagePreview} alt="Preview" />
                </div>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="targetUrl" className={styles.label}>
                Target URL *
              </label>
              <input
                type="url"
                id="targetUrl"
                placeholder="https://example.com"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                className={styles.input}
                disabled={submitting}
              />
              <p className={styles.inputHint}>Enter the full URL where users will be redirected</p>
            </div>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="title" className={styles.label}>
                Title (Optional)
              </label>
              <input
                type="text"
                id="title"
                placeholder="Advertisement title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={styles.input}
                disabled={submitting}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description" className={styles.label}>
                Description (Optional)
              </label>
              <input
                type="text"
                id="description"
                placeholder="Brief description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={styles.input}
                disabled={submitting}
              />
            </div>
          </div>

          <button 
            onClick={handleSubmit} 
            className={styles.buttonBlue}
            disabled={submitting || !imageBase64 || !targetUrl}
          >
            {submitting ? 'Posting...' : 'Post Advertisement'}
          </button>
        </div>
      </div>

      <div className={styles.adsSection}>
        <h2 className={styles.sectionTitle}>
          Active Advertisements ({ads.length})
        </h2>
        
        {loading ? (
          <div className={styles.loadingState}>
            <p>Loading advertisements...</p>
          </div>
        ) : ads.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No advertisements posted yet. Create your first ad above!</p>
          </div>
        ) : (
          <div className={styles.adsGrid}>
            {ads.map((ad, index) => (
              <div 
                key={ad.id} 
                className={styles.adCard}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={styles.adImageWrapper}>
                  <img src={ad.imageUrl} alt={ad.title || 'Advertisement'} className={styles.adImage} />
                  {!ad.isActive && (
                    <div className={styles.inactiveOverlay}>
                      <span>Inactive</span>
                    </div>
                  )}
                </div>
                
                <div className={styles.adContent}>
                  {ad.title && (
                    <h3 className={styles.adTitle}>{ad.title}</h3>
                  )}
                  
                  <div className={styles.urlSection}>
                    <span className={styles.urlLabel}>Target URL:</span>
                    <a 
                      href={ad.targetUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.urlLink}
                      title={ad.targetUrl}
                    >
                      {truncateUrl(ad.targetUrl)}
                    </a>
                  </div>

                  <div className={styles.adMeta}>
                    <span className={styles.metaItem}>
                      👁️ {ad.impressionsCount || 0} views
                    </span>
                    <span className={styles.metaItem}>
                      👆 {ad.clicksCount || 0} clicks
                    </span>
                  </div>

                  <div className={styles.adDate}>
                    Created: {formatDate(ad.createdAt)}
                  </div>

                  <div className={styles.adActions}>
                    <a
                      href={ad.targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.buttonView}
                    >
                      View
                    </a>
                    <button
                      onClick={() => handleToggleActive(ad.id, ad.isActive)}
                      className={ad.isActive ? styles.buttonWarning : styles.buttonSuccess}
                    >
                      {ad.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDelete(ad.id)}
                      className={styles.buttonDelete}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvertisementManagement;