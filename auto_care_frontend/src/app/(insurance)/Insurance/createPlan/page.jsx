"use client";

import React, { useState, useEffect } from "react";
import styles from "../../../(insurance)/Insurance/createPlan/createPlan.module.css";
import api from "@/utils/axios";
import { useRouter } from "next/navigation";

const CreateInsurancePlanPage = () => {
  // State to hold the list of available ads
  const [pendingAds, setPendingAds] = useState([]);

  // State for the form fields
  // Note: We use planAmt and instAmt to match the IPlanRequest on the backend
  const [planAmt, setPlanAmt] = useState("");
  const [noOfInstallments, setNoOfInstallments] = useState("");
  const [interest, setInterest] = useState("");
  const [instAmt, setInstAmt] = useState("");
  const [description, setDescription] = useState("");
  const [adId, setAdId] = useState(""); // This will be set by the dropdown
  
  // State for UI messages and loading
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // For loading the dropdown
  const [formLoading, setFormLoading] = useState(false); // For submitting the form
  const router = useRouter();

  // Fetch pending ads when the page loads
  useEffect(() => {
    const fetchPendingAds = async () => {
      setLoading(true);
      setMessage("");
      try {
        // Call the insurance company's endpoint
        const response = await api.get("/icompany/getpendingad");
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

  // ----------------------------
  // Handle Create Insurance Plan
  // ----------------------------
  const handleCreatePlan = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setMessage("");

    const payload = {
      // Use the correct field names for IPlanRequest
      planAmt: Number(planAmt),
      noOfInstallments: Number(noOfInstallments),
      interest: Number(interest),
      instAmt: Number(instAmt),
      description,
      adId: Number(adId),
    };

    console.log("📤 Sending Payload →", payload);

    try {
      // Call the insurance company's endpoint
      const response = await api.post("/icompany/postiplan", payload);

      if (response.status === 200) {
        setMessage("✅ Insurance Plan created successfully!");
        // Redirect to the insurance dashboard
        setTimeout(() => router.push("/insurance/manage-plans"), 2000);
      } else {
        setMessage("⚠️ Failed to create plan.");
      }
    } catch (err) {
      console.error("❌ Error creating insurance plan:", err);
      setMessage(err.response?.data?.message || "⚠️ Server validation failed.");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className={styles.createPlanContainer}>
      <div className={styles.createPlanCard}>
        <h2 className={styles.createPlanTitle}>Create New Insurance Plan</h2>
        {message && <p className={styles.message}>{message}</p>}

        <form onSubmit={handleCreatePlan}>
          {/* Advertisement Dropdown */}
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

          {/* Plan Amount */}
          <div className={styles.formGroup}>
            <label>Plan Amount (LKR)</label>
            <input
              type="number"
              value={planAmt}
              onChange={(e) => setPlanAmt(e.target.value)}
              className={styles.inputField}
              placeholder="e.g., 50000"
              required
            />
          </div>

          {/* Number of Installments */}
          <div className={styles.formGroup}>
            <label>No. of Installments</label>
            <input
              type="number"
              value={noOfInstallments}
              onChange={(e) => setNoOfInstallments(e.target.value)}
              className={styles.inputField}
              placeholder="e.g., 12"
              required
            />
          </div>

          {/* Interest Rate */}
          <div className={styles.formGroup}>
            <label>Interest Rate (%)</label>
            <input
              type="number"
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              className={styles.inputField}
              placeholder="e.g., 5.0"
              step="0.1"
              required
            />
          </div>

          {/* Installment Amount */}
          <div className={styles.formGroup}>
            <label>Installment Amount (LKR)</label>
            <input
              type="number"
              value={instAmt}
              onChange={(e) => setInstAmt(e.target.value)}
              className={styles.inputField}
              placeholder="Monthly payment amount"
              required
            />
          </div>

          {/* Description */}
          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.inputField}
              rows="3"
              placeholder="A brief description of the insurance plan"
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <button type="submit" className={styles.createButton} disabled={loading || formLoading}>
            {formLoading ? "Creating..." : "Create Insurance Plan"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateInsurancePlanPage;