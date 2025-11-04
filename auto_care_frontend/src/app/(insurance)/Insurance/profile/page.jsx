'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './profile.module.css'; // Assuming you'll create this CSS module
import { Building, Mail, Phone, MapPin, Edit, Save, XCircle } from 'lucide-react';
import apiClient from '@/utils/axiosConfig';

const InsuranceCompanyProfilePage = () => {
  const [companyData, setCompanyData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [editedPhone, setEditedPhone] = useState('');
  const [editedLocation, setEditedLocation] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Fetch user data from localStorage
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        console.log('User data from localStorage:', parsedUser);
        // Assuming the user object for an insurance company contains company details
        setCompanyData({
          id: parsedUser.id,
          companyId: parsedUser.companyId, // Assuming the user object has a companyId field
          name: parsedUser.companyName || parsedUser.fname + ' ' + parsedUser.lname || '',
          email: parsedUser.username || '',
          phone: parsedUser.tnumber || '',
          address: parsedUser.address || '',
          // Add other relevant company fields here
        });
        setEditedName(parsedUser.companyName || parsedUser.fname + ' ' + parsedUser.lname || '');
        setEditedEmail(parsedUser.username || '');
        setEditedPhone(parsedUser.tnumber || '');
        setEditedLocation(parsedUser.address || '');
      } catch (e) {
        console.error("Failed to parse user data from localStorage", e);
        setError("Failed to load company data.");
      }
    } else {
      // If no user data, redirect to sign-in
      router.push('/signin');
    }
  }, [router]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    // Reset edited fields if cancelling edit
    if (isEditing && companyData) {
      setEditedName(companyData.name || '');
      setEditedEmail(companyData.email || '');
      setEditedPhone(companyData.phone || '');
      setEditedLocation(companyData.address || '');
    }
    setError(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic validation
    if (!editedName || !editedEmail || !editedPhone) {
      setError("Company name, email, and phone are required.");
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.put(`/user/editprofile`, {
        fname: editedName.split(' ')[0],
        lname: editedName.split(' ').slice(1).join(' '),
        tnumber: editedPhone,
        address: editedLocation,
      });

      if (response.status === 200) {
        const updatedUser = response.data;
        // Update localStorage with new user data
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setCompanyData(updatedUser);
        setIsEditing(false);
        console.log("Profile updated successfully!");
      } else {
        setError(response.data.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.response?.data?.message || "An error occurred while updating your company profile. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  if (!companyData && !error) {
    return <div className={styles.loading}>Loading company profile...</div>;
  }

  if (error && !companyData) {
    return <div className={styles.errorContainer}>Error: {error}</div>;
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileCard}>
        <h2 className={styles.profileTitle}>Company Profile</h2>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <form onSubmit={handleSave}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Company Name</label>
            <input
              type="text"
              id="name"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              disabled={!isEditing}
              className={styles.inputField}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={editedEmail}
              onChange={(e) => setEditedEmail(e.target.value)}
              disabled={!isEditing}
              className={styles.inputField}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="phone">Phone</label>
            <input
              type="text"
              id="phone"
              value={editedPhone}
              onChange={(e) => setEditedPhone(e.target.value)}
              disabled={!isEditing}
              className={styles.inputField}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              value={editedLocation}
              onChange={(e) => setEditedLocation(e.target.value)}
              disabled={!isEditing}
              className={styles.inputField}
            />
          </div>

          <div className={styles.profileActions}>
            {!isEditing ? (
              <button type="button" onClick={handleEditToggle} className={`${styles.button} ${styles.editButton}`}>
                <Edit size={18} /> Edit Profile
              </button>
            ) : (
              <>
                <button type="submit" className={`${styles.button} ${styles.saveButton}`} disabled={loading}>
                  {loading ? 'Saving...' : <><Save size={18} /> Save Changes</>}
                </button>
                <button type="button" onClick={handleEditToggle} className={`${styles.button} ${styles.cancelButton}`} disabled={loading}>
                  <XCircle size={18} /> Cancel
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default InsuranceCompanyProfilePage;