"use client";

import React, { useState, useEffect } from "react"; // Re-added useEffect
import styles from "../../../(insurance)/Insurance/createPlan/createPlan.module.css";
import api from "@/utils/axios";
import { useRouter } from "next/navigation";

const CreateLeasingPlanPage = () => {
  // --- ADDED: State to hold the list of available ads ---
  const [pendingAds, setPendingAds] = useState([]);
  // --- END ADDED ---

  const [planAmount, setPlanAmount] = useState("");
  const [noOfInstallments, setNoOfInstallments] = useState("");
  const [interest, setInterest] = useState("");
  const [instAmount, setInstAmount] = useState("");
  const [description, setDescription] = useState("");
  const [adId, setAdId] = useState(""); // This will be set by the dropdown
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false); // For the form submit
  const router = useRouter();

  // --- ADDED: Fetch pending ads when the page loads ---
  useEffect(() => {
    const fetchPendingAds = async () => {
      setLoading(true); // Show loading for the dropdown
      setMessage("");
      try {
        // This is the same endpoint your dashboard uses
        const response = await api.get("/lcompany/getpendingad");
        if (Array.isArray(response.data)) {
          setPendingAds(response.data);
        }
      } catch (err) {
        console.error("❌ Error fetching pending ads:", err);
        setMessage("⚠️ Could not load available ads. " + (err.response?.data?.message || ""));
      } finally {
        setLoading(false);
      }
    };

    fetchPendingAds();
  }, []); // The empty array [] means this runs once when the page loads
  // --- END ADDED ---

  // ----------------------------
  // Handle Create Leasing Plan
  // ----------------------------
  const handleCreatePlan = async (e) => {
    e.preventDefault();
    setFormLoading(true); // Use separate loading state for form
    setMessage("");

    const payload = {
      planAmount: Number(planAmount),
      noOfInstallments: Number(noOfInstallments),
      interest: Number(interest),
      instAmount: Number(instAmount),
      description,
      // Your backend requires the adId to be sent in the request body.
      adId: Number(adId),
    };

    console.log("📤 Sending Payload →", payload);

    try {
      // Use the LCompanyController endpoint
      const response = await api.post("/lcompany/postlplan", payload);

      if (response.status === 200) {
        setMessage("✅ Leasing Plan created successfully!");
        // Redirect to the dashboard after 2 seconds
        setTimeout(() => router.push("/leasing/manage-plans"), 2000);
      } else {
        setMessage("⚠️ Failed to create plan.");
      }
    } catch (err) {
      console.error("❌ Error creating leasing plan:", err);
      // Display validation errors from your backend
      setMessage(err.response?.data?.message || "⚠️ Server validation failed.");
    } finally {
      setFormLoading(false); // Stop form loading
    }
  };

  return (
    <div className={styles.createPlanContainer}>
      <div className={styles.createPlanCard}>
        <h2 className={styles.createPlanTitle}>Create New Leasing Plan</h2>
        {message && <p className={styles.message}>{message}</p>}

        <form onSubmit={handleCreatePlan}>
          {/* --- UPDATED: Changed from input to select (dropdown) --- */}
          <div className={styles.formGroup}>
            <label>Advertisement</label>
            <select
              value={adId}
              onChange={(e) => setAdId(e.target.value)}
              className={styles.inputField}
              required
              disabled={loading} // Disable dropdown while loading ads
            >
              <option value="" disabled>
                -- Select an Advertisement --
              </option>
              {pendingAds.length > 0 ? (
                pendingAds.map((ad) => (
                  <option key={ad.id} value={ad.id}>
                    {/* Show the ad title and ID in the list */}
                    {ad.title} (ID: {ad.id})
                  </option>
                ))
              ) : (
                <option disabled>
                  {loading ? "Loading ads..." : "No pending ads found"}
                </option>
              )}
            </select>
          </div>
          {/* --- END UPDATED --- */}

          <div className={styles.formGroup}>
            <label>Plan Amount (LKR)</label>
            {/* --- FIX: Removed duplicated fields --- */}
            <input
              type="number"
              value={planAmount}
              onChange={(e) => setPlanAmount(e.target.value)}
              className={styles.inputField}
              placeholder="e.g., 1000000"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>No. of Installments</label>
            {/* --- FIX: Removed duplicated fields --- */}
            <input
              type="number"
              value={noOfInstallments}
              onChange={(e) => setNoOfInstallments(e.target.value)}
              className={styles.inputField}
              placeholder="e.g., 60"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Interest Rate (%)</label>
            {/* --- FIX: Removed duplicated fields --- */}
            <input
              type="number"
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              className={styles.inputField}
              placeholder="e.g., 8.5"
              step="0.1" // Allows decimal numbers
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Installment Amount (LKR)</label>
            {/* --- FIX: Removed duplicated fields --- */}
            <input
              type="number"
              value={instAmount}
              onChange={(e) => setInstAmount(e.target.value)}
              className={styles.inputField}
              placeholder="Monthly payment amount"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Description</label>
            {/* --- FIX: Removed duplicated fields and fixed typo 'e.g.target.value' --- */}
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.inputField}
              rows="3"
              placeholder="A brief description of the plan"
              required
            ></textarea>
          </div>

          {/* --- FIX: All duplicated fields below this point have been removed --- */}

          <button type="submit" className={styles.createButton} disabled={loading || formLoading}>
            {formLoading ? "Creating..." : "Create Leasing Plan"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateLeasingPlanPage;