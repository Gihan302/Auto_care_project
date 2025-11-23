"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/utils/axios';
// Assuming a CSS module for styling, create this if it doesn't exist
// import styles from './ApplicationForm.module.css'; 

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
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading plan details...</div>;
  }

  if (error && !planDetails) {
    return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>{error}</div>;
  }

  if (!planDetails) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Insurance plan not found.</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '30px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '8px', backgroundColor: '#fff' }}>
      <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>Apply for Insurance Plan</h1>
      
      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', borderLeft: '5px solid #007bff' }}>
        <h2 style={{ color: '#007bff', marginBottom: '10px' }}>Plan: {planDetails.planName}</h2>
        <p><strong>Company:</strong> {planDetails.user?.cName || 'N/A'}</p>
        <p><strong>Coverage:</strong> {planDetails.coverage}</p>
        <p><strong>Price:</strong> ${parseFloat(planDetails.price.toString()).toFixed(2)}</p>
        <p>{planDetails.description}</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label htmlFor="fullName" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Full Name:</label>
          <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required 
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email:</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label htmlFor="phone" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Phone:</label>
          <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label htmlFor="address" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Address:</label>
          <textarea id="address" name="address" value={formData.address} onChange={handleChange} required
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box', minHeight: '80px' }}></textarea>
        </div>
        
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        {submitSuccess && <p style={{ color: 'green', textAlign: 'center', fontWeight: 'bold' }}>Application submitted successfully!</p>}

        <button type="submit" disabled={isSubmitting}
          style={{ 
            padding: '12px 20px', 
            backgroundColor: isSubmitting ? '#cccccc' : '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: isSubmitting ? 'not-allowed' : 'pointer', 
            fontSize: '16px',
            alignSelf: 'center',
            width: '200px'
          }}>
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
}
