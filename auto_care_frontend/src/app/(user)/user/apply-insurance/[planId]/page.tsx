"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/utils/axios';
import styles from './ApplicationForm.module.css'; 

interface InsurancePlan {
  id: number;
  planName: string;
  coverage: string;
  price: number;
  description: string;
  user: {
    cName: string; 
  };
}

export default function ApplyInsurancePage() {
  const router = useRouter();
  const params = useParams();
  const planId = params.planId;

  const [planDetails, setPlanDetails] = useState<InsurancePlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    // Add other relevant application fields specific to insurance if any
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

    if (!planId) return;

    const fetchPlanDetails = async () => {
      try {
        const response = await api.get(`/insurance-plans/public/${planId}`);
        setPlanDetails(response.data);
      } catch (err) {
        console.error("Error fetching insurance plan details:", err);
        setError("Failed to load insurance plan details.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlanDetails();
  }, [planId]);

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
      await api.post('/insurance-applications/submit', { ...formData, planId });
      setSubmitSuccess(true);
      // Optionally redirect user or clear form
      // router.push('/user/insurance-applications/success'); 
    } catch (err) {
      console.error("Error submitting insurance application:", err);
      setError("Failed to submit insurance application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className={styles.container}>Loading plan details...</div>;
  }

  if (error && !planDetails) {
    return <div className={styles.container}><p className={styles.error}>{error}</p></div>;
  }

  if (!planDetails) {
    return <div className={styles.container}>Insurance plan not found.</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Apply for Insurance Plan</h1>
      
      <div className={styles.planDetails}>
        <h2 className={styles.planName}>Plan: {planDetails.planName}</h2>
        <p><strong>Company:</strong> {planDetails.user?.cName || 'N/A'}</p>
        <p><strong>Coverage:</strong> {planDetails.coverage}</p>
        <p><strong>Price:</strong> ${parseFloat(planDetails.price.toString()).toFixed(2)}</p>
        <p>{planDetails.description}</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="fullName">Full Name:</label>
          <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="phone">Phone:</label>
          <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="address">Address:</label>
          <textarea id="address" name="address" value={formData.address} onChange={handleChange} required />
        </div>
        
        {error && <p className={styles.error}>{error}</p>}
        {submitSuccess && <p className={styles.success}>Application submitted successfully!</p>}

        <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
}
