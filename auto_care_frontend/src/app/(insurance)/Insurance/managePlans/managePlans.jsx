"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, FileText } from "lucide-react";
import styles from "./managePlans.module.css";
import { useRouter } from "next/navigation";
import api from "@/utils/axios";

export default function ManagePlansPage() {
  const router = useRouter();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const response = await api.get("/api/insurance-plans");
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
      await api.delete(`/api/insurance-plans/${id}`);
      setPlans((prev) => prev.filter((plan) => plan.id !== id));
    } catch (err) {
      console.error("Error deleting plan:", err);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1>Manage Plans</h1>
        <button
          className={styles.addButton}
          onClick={() => router.push("/Insurance/createPlan")}
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
              <th>Description</th>
              <th>Coverage</th>
              <th>Price</th>
              <th>Status</th>
              <th className={styles.actionsHeader}>Actions</th>
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
                  <td>{plan.description}</td>
                  <td>{plan.coverage}</td>
                  <td>{plan.price}</td>
                  <td>
                    <span
                      className={`${styles.status} ${
                        plan.status === "Active"
                          ? styles.active
                          : styles.inactive
                      }`}
                    >
                      {plan.status}
                    </span>
                  </td>
                  <td className={styles.actions}>
                    <button
                      className={styles.viewBtn}
                      onClick={() => router.push(`/Insurance/plans/${plan.id}`)}
                    >
                      <FileText size={16} />
                    </button>
                    <button
                      className={styles.editBtn}
                      onClick={() => router.push(`/Insurance/plans/edit/${plan.id}`)}
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
