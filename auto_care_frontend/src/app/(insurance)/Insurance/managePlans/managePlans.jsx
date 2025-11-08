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
    // --- FIX 1: Added the async function wrapper ---
    const fetchPlans = async () => {
      try {
        // --- FIX 2: Call the correct endpoint from your ICompanyController.java ---
        const response = await api.get("/icompany/myplans");
        
        const plansData = Array.isArray(response.data) ? response.data : [];
        setPlans(plansData);
      } catch (err) {
        setError("Failed to fetch plans. Are you logged in?");
        console.error("Error fetching plans:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // --- FIX 4: Commented out the delete function. ---
  // This requires a new @DeleteMapping endpoint on your ICompanyController
  // const deletePlan = async (id) => {
  //   try {
  //     // This endpoint does not exist yet
  //     await api.delete(`/icompany/myplans/${id}`);
  //     setPlans((prev) => prev.filter((plan) => plan.id !== id));
  //   } catch (err) {
  //     console.error("Error deleting plan:", err);
  //     setError("Failed to delete plan.");
  //   }
  // };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1>Manage Plans</h1>
        <button
          className={styles.addButton}
          // This path must match your file structure for the CreateInsurancePlanPage.jsx
          onClick={() => router.push("/insurance/create-plan")}
        >
          <Plus className={styles.addIcon} /> Create New Plan
        </button>
      </div>

      {/* Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            {/* --- FIX 3: Updated headers to match your IPlan model --- */}
            <tr>
              <th>Ad Title</th>
              <th>Plan Amount (LKR)</th>
              <th>Installments</th>
              <th>Interest Rate (%)</th>
              <th>Monthly Payment (LKR)</th>
              <th>Description</th>
              <th className={styles.actionsHeader}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className={styles.loading}>Loading...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="7" className={styles.error}>{error}</td>
              </tr>
            ) : plans.length === 0 ? (
              <tr>
                <td colSpan="7" className={styles.empty}>No plans found.</td>
              </tr>
            ) : (
              // --- FIX 3: Render correct data from your IPlan model ---
              plans.map((plan) => (
                <tr key={plan.id}>
                  <td>{plan.advertisement?.title || 'N/A'}</td>
                  <td>{plan.planAmt.toLocaleString()}</td>
                  <td>{plan.noOfInstallments}</td>
                  <td>{plan.interest}%</td>
                  <td>{plan.instAmt.toLocaleString()}</td>
                  <td>{plan.description}</td>
                  <td className={styles.actions}>
                    <button
                      className={styles.viewBtn}
                      // This path needs to be created
                      onClick={() => router.push(`/insurance/plans/${plan.id}`)}
                    >
                      <FileText size={16} />
                    </button>
                    <button
                      className={styles.editBtn}
                      // This path needs to be created
                      onClick={() => router.push(`/insurance/plans/edit/${plan.id}`)}
                    >
                      <Edit size={16} />
                    </button>
                    {/* --- FIX 4: Commented out delete button ---
                    <button
                      className={styles.deleteBtn}
                      onClick={() => deletePlan(plan.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                    */}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {plans.length === 0 && !loading && (
          <p className={styles.empty}>No plans found.</p>
        )}
      </div>
    </div>
  );
}