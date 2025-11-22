"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/utils/axios';
// Assuming a CSS module for styling, create this if it doesn't exist
// import styles from './ApplicationForm.module.css'; 

export default function ApplyLeasingPage() {
  const router = useRouter();
  const params = useParams();
  const planId = params.planId;

  const [planDetails, setPlanDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    income: '',
    employmentStatus: '',
    creditScore: '',
    // Add other relevant application fields
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (!planId) return;

    const fetchPlanDetails = async () => {
      try {
        const response = await api.get(`/leasing-plans/public/${planId}`);
        setPlanDetails(response.data);
      } catch (err) {
        console.error("Error fetching plan details:", err);
        setError("Failed to load leasing plan details.");
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
      // In a real application, you would send this to a backend API
      // await api.post(`/leasing-applications/submit`, { ...formData, planId });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      
      console.log('Application submitted:', { ...formData, planId });
      setSubmitSuccess(true);
      // Optionally redirect user or clear form
      // router.push('/user/leasing-applications/success'); 
    } catch (err) {
      console.error("Error submitting application:", err);
      setError("Failed to submit application. Please try again.");
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
    return <div style={{ textAlign: 'center', padding: '50px' }}>Leasing plan not found.</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '30px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '8px', backgroundColor: '#fff' }}>
      <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>Apply for Leasing Plan</h1>
      
      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', borderLeft: '5px solid #007bff' }}>
        <h2 style={{ color: '#007bff', marginBottom: '10px' }}>Plan: {planDetails.planName}</h2>
        <p><strong>Company:</strong> {planDetails.user?.cName || planDetails.user?.username}</p>
        <p><strong>Vehicle Type:</strong> {planDetails.vehicleType}</p>
        <p><strong>Monthly Payment:</strong> ${parseFloat(planDetails.monthlyPayment).toFixed(2)}</p>
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
        <div>
          <label htmlFor="income" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Annual Income:</label>
          <input type="number" id="income" name="income" value={formData.income} onChange={handleChange} required
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label htmlFor="employmentStatus" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Employment Status:</label>
          <select id="employmentStatus" name="employmentStatus" value={formData.employmentStatus} onChange={handleChange} required
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}>
            <option value="">Select...</option>
            <option value="employed">Employed</option>
            <option value="self-employed">Self-Employed</option>
            <option value="unemployed">Unemployed</option>
            <option value="retired">Retired</option>
          </select>
        </div>
        <div>
          <label htmlFor="creditScore" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Estimated Credit Score:</label>
          <input type="number" id="creditScore" name="creditScore" value={formData.creditScore} onChange={handleChange} 
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} />
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
