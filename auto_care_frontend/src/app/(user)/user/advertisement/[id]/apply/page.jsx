"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/utils/axios';
import styles from './ApplicationForm.module.css'; 

export default function ApplyForAdPage() {
  const router = useRouter();
  const params = useParams();
  const adId = params.id;

  const [adDetails, setAdDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    income: '',
    employmentStatus: '',
    coverLetter: '',
    applicationType: 'Leasing', // Default to Leasing
    adId: adId
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    // Fetch user data from localStorage to pre-fill the form
    const userDataString = localStorage.getItem('user');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      setFormData(prev => ({
        ...prev,
        fullName: `${userData.fname || ''} ${userData.lname || ''}`.trim(),
        email: userData.email || ''
      }));
    }

    if (!adId) return;

    const fetchAdDetails = async () => {
      try {
        const response = await api.get(`/advertisement/getAdById/${adId}`);
        setAdDetails(response.data);
      } catch (err) {
        console.error("Error fetching ad details:", err);
        setError("Failed to load advertisement details.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdDetails();
  }, [adId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSubmitSuccess(false);

    try {
      console.log("Submitting payload:", formData); // Log the payload
      await api.post('/applications/submit', formData);
      setSubmitSuccess(true);
      // Optionally redirect after a few seconds
      setTimeout(() => router.push(`/advertisement/${adId}`), 3000);
    } catch (err) {
      console.error("Error submitting application:", err);
      setError(err.response?.data?.message || "Failed to submit application. Please check your details and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getVehicleImages = () => {
    if (!adDetails) return ['/placeholder.jpg'];
    
    const images = [
      adDetails.image1,
      adDetails.image2,
      adDetails.image3,
      adDetails.image4,
      adDetails.image5
    ].filter(img => img && img !== '' && img !== null);
    
    return images.length > 0 ? images : ['/placeholder.jpg'];
  };

  if (loading) {
    return <div className={styles.container}><p>Loading advertisement details...</p></div>;
  }

  if (error && !adDetails) {
    return <div className={styles.container}><p className={styles.error}>{error}</p></div>;
  }

  if (!adDetails) {
    return <div className={styles.container}><p>Advertisement not found.</p></div>;
  }

  if (submitSuccess) {
    return (
      <div className={styles.container}>
        <div className={styles.successMessage}>
          <h2>Application Submitted!</h2>
          <p>Your application for the {adDetails.title} has been sent successfully.</p>
          <p>You will be redirected back to the advertisement shortly.</p>
        </div>
      </div>
    );
  }

  const images = getVehicleImages();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Apply for: {adDetails.title}</h1>
      
      <div className={styles.adSummary}>
        <img src={images[0]} alt={adDetails.title} />
        <div>
            <h2>{adDetails.year} {adDetails.make} {adDetails.model}</h2>
            <p className={styles.price}>${parseFloat(adDetails.price).toLocaleString()}</p>
            <p>{adDetails.mileage} miles</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="applicationType">Application Type:</label>
          <select id="applicationType" name="applicationType" value={formData.applicationType} onChange={handleChange} required>
            <option value="Leasing">Leasing</option>
            <option value="Insurance">Insurance</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="fullName">Full Name:</label>
          <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
        </div>
        
        <div className={styles.formGrid}>
            <div className={styles.formGroup}>
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="phone">Phone:</label>
                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
            </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="address">Address:</label>
          <textarea id="address" name="address" value={formData.address} onChange={handleChange} required></textarea>
        </div>

        {formData.applicationType === 'Leasing' && (
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="income">Annual Income:</label>
              <input type="number" id="income" name="income" value={formData.income} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="employmentStatus">Employment Status:</label>
              <select id="employmentStatus" name="employmentStatus" value={formData.employmentStatus} onChange={handleChange} required>
                <option value="">Select...</option>
                <option value="employed">Employed</option>
                <option value="self-employed">Self-Employed</option>
                <option value="unemployed">Unemployed</option>
                <option value="retired">Retired</option>
              </select>
            </div>
          </div>
        )}

        <div className={styles.formGroup}>
          <label htmlFor="coverLetter">Cover Letter (Optional):</label>
          <textarea id="coverLetter" name="coverLetter" value={formData.coverLetter} onChange={handleChange} rows="4"></textarea>
        </div>
        
        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
}
