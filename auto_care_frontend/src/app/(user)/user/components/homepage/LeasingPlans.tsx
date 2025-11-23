"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/utils/axios";
import styles from "./LeasingPlans.module.css";

// Define an interface to match the Java backend
// This provides type safety and auto-complete
interface User {
  id: number;
  username: string;
  email: string;
  cName?: string; // Add cName as optional, in case it's there
}

interface LeasingPlan {
  id: number;
  planName: string;
  vehicleType: string;
  leaseTerm: string;
  interestRate: string;
  monthlyPayment: string;
  description: string;
  user: User;
}

export default function LeasingPlans({ showAll = false }) {
  const [plans, setPlans] = useState<LeasingPlan[]>([]); // Use the interface
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const getUserData = () => {
    if (typeof window === 'undefined') return null;
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get("/leasing-plans/public/all");
        setPlans(response.data);
      } catch (err) {
        // This public endpoint shouldn't give a 401,
        // but keeping the error handling is fine.
        if (err.response && err.response.status === 401) {
          setError("Please log in to view leasing plans.");
        } else {
          setError("Failed to fetch leasing plans.");
        }
        console.error("Error fetching leasing plans:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleMessageCompany = async (companyName) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.push('/signup');
      return;
    }

    try {
      const response = await api.post('/messages/conversations', {
        companyName: companyName,
        companyType: 'leasing'
      });
      const conversationId = response.data.conversationId;
      router.push(`/user/message?conversationId=${conversationId}`);
    } catch (error) {
      console.error('Error creating conversation:', error);
      setError('Failed to start conversation.');
    }
  };

  const plansToShow = showAll ? plans : plans.slice(0, 4);

  return (
    <div id="leasing-plans" className={styles.container}>
      <h2 className={styles.title}>Leasing Plans</h2>
      {loading && <p>Loading...</p>}
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.plansGrid}>
        {plansToShow.map((plan) => (
          <div key={plan.id} className={styles.planCard}>
            {/* CORRECTED FIELDS BELOW
            */}
            
            {/* Use planName as the title, it's more descriptive */}
            <h3>{plan.planName}</h3> 
            
            {/* Check for cName first, but fall back to username */}
            <p>Company: {plan.user.cName || plan.user.username}</p>
            
            {/* Use description as the description */}
            <p>{plan.description}</p>
            
            {/* Use the correct field names from the Java model */}
            <p>Vehicle Type: {plan.vehicleType}</p>
            <p>Term: {plan.leaseTerm} months</p>
            <p>Interest: {plan.interestRate}%</p>
            
            {/* NOTE: Your model doesn't have 'planAmount'. 
              I have removed it. If you need it, you must add it
              to your Java 'LeasingPlan' model and controller.
            */}
            
            <p className={styles.monthlyPayment}>
              Monthly: ${parseFloat(plan.monthlyPayment).toFixed(2)}
            </p>
            <div className={styles.planActions}>
              <button
                className={styles.messageButton}
                onClick={() => handleMessageCompany(plan.user.cName || plan.user.username)}
              >
                Message Company
              </button>
              <Link href={`/user/apply-leasing/${plan.id}`} className={styles.applyButton}>
                Apply Now
              </Link>
            </div>
          </div>
        ))}
      </div>
      {!showAll && (
        <div className={styles.viewAllContainer}>
          <Link href="/user/LeasingPlans" className={styles.viewAllButton}>
            View All Plans
          </Link>
        </div>
      )}
    </div>
  );
}