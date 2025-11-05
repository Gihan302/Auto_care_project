"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./profile.module.css";
import { Edit, Save, XCircle, Lock } from "lucide-react";
import apiClient from "@/utils/axiosConfig";

const UserProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedFname, setEditedFname] = useState("");
  const [editedLname, setEditedLname] = useState("");
  const [editedPhone, setEditedPhone] = useState("");
  const [editedAddress, setEditedAddress] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 🔹 Load user data
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await apiClient.get("/user/currentuser");
        const data = response.data;
        setUserData(data);
        setEditedFname(data.fname || "");
        setEditedLname(data.lname || "");
        setEditedPhone(data.tnumber || "");
        setEditedAddress(data.address || "");
      } catch (err) {
        console.error("Error fetching user data:", err);
        setMessage("⚠️ Failed to load user profile.");
        if (err.response?.status === 401) {
          router.push("/signin");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const isInsuranceCompany =
  userData?.role === "ROLE_ICOMPANY" || userData?.role === "ROLE_LCOMPANY";


  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing && userData) {
      setEditedFname(userData.fname || "");
      setEditedLname(userData.lname || "");
      setEditedPhone(userData.tnumber || "");
      setEditedAddress(userData.address || "");
    }
    setMessage("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await apiClient.put("/user/editprofile", {
        fname: editedFname,
        lname: editedLname,
        tnumber: editedPhone,
        address: editedAddress,
      });

      if (response.status === 200) {
        const updatedUser = response.data;
        setUserData({
          ...userData,
          fname: editedFname,
          lname: editedLname,
          tnumber: editedPhone,
          address: editedAddress,
        });
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...userData,
            fname: editedFname,
            lname: editedLname,
            tnumber: editedPhone,
            address: editedAddress,
          })
        );
        setIsEditing(false);
        setMessage("✅ Profile updated successfully!");
      } else {
        setMessage("⚠️ Failed to update profile.");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setMessage(
        err.response?.data?.message ||
          "⚠️ An error occurred while updating your profile."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className={styles.loading}>Loading user profile...</div>;

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileCard}>
        <h2 className={styles.profileTitle}>My Profile</h2>
        {message && <p className={styles.message}>{message}</p>}

        {isInsuranceCompany && (
          <div className={styles.lockNotice}>
            <Lock size={18} /> Insurance company profiles cannot be edited here.
          </div>
        )}

        <form onSubmit={handleSave}>
          <div className={styles.formGroup}>
            <label htmlFor="fname">First Name</label>
            <input
              id="fname"
              type="text"
              value={editedFname}
              onChange={(e) => setEditedFname(e.target.value)}
              disabled={!isEditing || isInsuranceCompany}
              className={styles.inputField}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="lname">Last Name</label>
            <input
              id="lname"
              type="text"
              value={editedLname}
              onChange={(e) => setEditedLname(e.target.value)}
              disabled={!isEditing || isInsuranceCompany}
              className={styles.inputField}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="tnumber">Phone Number</label>
            <input
              id="tnumber"
              type="text"
              value={editedPhone}
              onChange={(e) => setEditedPhone(e.target.value)}
              disabled={!isEditing || isInsuranceCompany}
              className={styles.inputField}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              value={editedAddress}
              onChange={(e) => setEditedAddress(e.target.value)}
              disabled={!isEditing || isInsuranceCompany}
              className={styles.inputField}
            ></textarea>
          </div>

          <div className={styles.profileActions}>
            {!isEditing && !isInsuranceCompany ? (
              <button
                type="button"
                onClick={handleEditToggle}
                className={`${styles.button} ${styles.editButton}`}
              >
                <Edit size={18} /> Edit Profile
              </button>
            ) : (
              !isInsuranceCompany && (
                <>
                  <button
                    type="submit"
                    className={`${styles.button} ${styles.saveButton}`}
                    disabled={loading}
                  >
                    {loading ? "Saving..." : <><Save size={18} /> Save</>}
                  </button>
                  <button
                    type="button"
                    onClick={handleEditToggle}
                    className={`${styles.button} ${styles.cancelButton}`}
                    disabled={loading}
                  >
                    <XCircle size={18} /> Cancel
                  </button>
                </>
              )
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfilePage;
