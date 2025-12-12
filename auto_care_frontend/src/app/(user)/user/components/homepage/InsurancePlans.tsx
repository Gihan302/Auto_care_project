"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import useRouter
import api from "@/utils/axios";
import styles from "./LeasingPlans.module.css"; // Reusing styles for now

interface InsurancePlan {
  id: number;
  planName: string;
  coverage: string;
  price: number;
  description: string;
  user: {
    cName: string; // Assuming cName is present for insurance companies
  };
}

export default function InsurancePlans({ showAll = false }) {
  const [plans, setPlans] = useState<InsurancePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Initialize router

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get("/insurance-plans/public/all");
        const plansData = Array.isArray(response.data) ? response.data : [];
        setPlans(plansData);
      } catch (err) {
        setError("Failed to fetch insurance plans.");
        console.error("Error fetching insurance plans:", err);
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
        companyType: 'insurance' // Set companyType to 'insurance'
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
    <div id="insurance-plans" className={styles.container}>
      <h2 className={styles.title}>Insurance Plans</h2>
      {loading && <p>Loading...</p>}
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.plansGrid}>
        {plansToShow.map((plan) => (
          <div key={plan.id} className={styles.planCard}>
            <h3>{plan.planName}</h3>
            <p>Company: {plan.user?.cName || 'N/A'}</p>
            <p>{plan.description}</p>
            <p>Coverage: {plan.coverage}</p>
            <p className={styles.monthlyPayment}>Price: ${parseFloat(plan.price.toString()).toFixed(2)}</p>
            <div className={styles.planActions}>
              <button
                className={styles.messageButton}
                onClick={() => handleMessageCompany(plan.user?.cName)}
              >
                Message Company
              </button>
              <Link href={`/user/apply-insurance/${plan.id}`} className={styles.applyButton}>
                Apply Now
              </Link>
            </div>
          </div>
        ))}
      </div>
      {!showAll && (
        <div className={styles.viewAllContainer}>
          <Link href="/user/insurance-plans" className={styles.viewAllButton}>
            View All Insurance Plans
          </Link>
        </div>
      )}
    </div>
  );
}
