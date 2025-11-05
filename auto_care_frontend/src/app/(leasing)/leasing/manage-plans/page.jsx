"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, FileText } from "lucide-react";
import styles from "../../../(insurance)/Insurance/managePlans/managePlans.module.css";
import { useRouter } from "next/navigation";
import apiClient from "@/utils/axiosConfig";

export default function ManageLeasingPlansPage() {
  const router = useRouter();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await apiClient.get("/api/leasing-plans");
        setPlans(response.data);
      } catch (err) {
        setError("Failed to fetch plans.");
        console.error("Error fetching plans:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const deletePlan = async (id) => {
    try {
      await apiClient.delete(`/api/leasing-plans/${id}`);
      setPlans((prev) => prev.filter((plan) => plan.id !== id));
    } catch (err) {
      console.error("Error deleting plan:", err);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1>Manage Leasing Plans</h1>
        <button
          className={styles.addButton}
          onClick={() => router.push("/leasing/create-plan")}
        >
          <Plus className={styles.addIcon} /> Create New Plan
        </button>
      </div>

      {/* Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Plan Name</th>
              <th>Vehicle Type</th>
              <th>Lease Term</th>
              <th>Interest Rate</th>
              <th>Monthly Payment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className={styles.loading}>Loading...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="6" className={styles.error}>{error}</td>
              </tr>
            ) : plans.length === 0 ? (
              <tr>
                <td colSpan="6" className={styles.empty}>No plans found.</td>
              </tr>
            ) : (
              plans.map((plan) => (
                <tr key={plan.id}>
                  <td>{plan.planName}</td>
                  <td>{plan.vehicleType}</td>
                  <td>{plan.leaseTerm}</td>
                  <td>{plan.interestRate}</td>
                  <td>{plan.monthlyPayment}</td>
                  <td className={styles.actions}>
                    <button
                      className={styles.editBtn}
                      onClick={() => router.push(`/leasing/edit-plan/${plan.id}`)}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => deletePlan(plan.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {plans.length === 0 && (
          <p className={styles.empty}>No plans found.</p>
        )}
      </div>
    </div>
  );
}
