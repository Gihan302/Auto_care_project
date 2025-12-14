"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import styles from "../../../(insurance)/Insurance/managePlans/managePlans.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/utils/axios";

export default function ManageLeasingPlansPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlans = async () => {
    try {
      console.log("📌 Fetching plans from /leasing-plans");
      const response = await api.get("/leasing-plans");
      setPlans(response.data);
    } catch (err) {
      setError("Failed to fetch plans.");
      console.error("❌ Error fetching plans:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  useEffect(() => {
    if (searchParams.get("refresh") === "true") {
      fetchPlans();
    }
  }, [searchParams]);

  const deletePlan = async (id) => {
    try {
      await api.delete(`/leasing-plans/${id}`);
      setPlans((prev) => prev.filter((plan) => plan.id !== id));
    } catch (err) {
      console.error("❌ Error deleting plan:", err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Manage Leasing Plans</h1>
        <button
          className={styles.addButton}
          onClick={() => router.push("/leasing/create-plan")}
        >
          <Plus className={styles.addIcon} /> Create New Plan
        </button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Plan Name</th>
              <th>Vehicle Type</th>
              <th>Lease Term</th>
              <th>Interest Rate</th>
              <th>Monthly Payment</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className={styles.loading}>Loading...</td></tr>
            ) : error ? (
              <tr><td colSpan="7" className={styles.error}>{error}</td></tr>
            ) : plans.length === 0 ? (
              <tr><td colSpan="7" className={styles.empty}>No plans found.</td></tr>
            ) : (
              plans.map((plan) => (
                <tr key={plan.id}>
                  <td>{plan.planName}</td>
                  <td>{plan.vehicleType}</td>
                  <td>{plan.leaseTerm}</td>
                  <td>{plan.interestRate}%</td>
                  <td>{plan.monthlyPayment}</td>
                  <td>{plan.description}</td>
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
      </div>
    </div>
  );
}
