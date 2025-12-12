"use client";

import React, { useState, useEffect } from 'react';
import apiClient from '@/utils/axios';
import styles from './profile.module.css';

import useLocalStorage from '@/utils/useLocalStorage';

const LeasingProfilePage = () => {
  const [user, setUser] = useLocalStorage('user', null);
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    cName: '',
    regNum: '',
    address: '',
    imgId: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        fname: user.fname || '',
        lname: user.lname || '',
        cName: user.cName || '',
        regNum: user.regNum || '',
        address: user.address || '',
        imgId: user.imgId || '',
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imgId: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const profileData = { ...formData };
      delete profileData.imgId; // Remove imgId from the main request

      // Update profile details
      await apiClient.put('/user/editprofile', profileData);

      // Update profile picture if it has changed
      if (formData.imgId && formData.imgId.startsWith('data:image')) {
        await apiClient.put('/user/changephoto', formData.imgId);
      }

      setSuccess('Profile updated successfully!');

      // Update user in local storage
      setUser({ ...user, ...formData });

    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while updating the profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileCard}>
        <h1 className={styles.profileTitle}>Leasing Company Profile</h1>
        <p>Manage your leasing company profile here.</p>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="fname">First Name</label>
            <input
              type="text"
              id="fname"
              name="fname"
              value={formData.fname}
              onChange={handleInputChange}
              className={styles.inputField}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="lname">Last Name</label>
            <input
              type="text"
              id="lname"
              name="lname"
              value={formData.lname}
              onChange={handleInputChange}
              className={styles.inputField}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="cName">Company Name</label>
            <input
              type="text"
              id="cName"
              name="cName"
              value={formData.cName}
              onChange={handleInputChange}
              className={styles.inputField}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="regNum">Registration Number</label>
            <input
              type="text"
              id="regNum"
              name="regNum"
              value={formData.regNum}
              onChange={handleInputChange}
              className={styles.inputField}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className={styles.inputField}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="logo">Company Logo</label>
            <input
              type="file"
              id="logo"
              name="logo"
              accept="image/*"
              onChange={handleFileChange}
              className={styles.inputField}
            />
            {formData.imgId && (
              <img
                src={formData.imgId.startsWith('data:image') ? formData.imgId : `http://localhost:8080/images/${formData.imgId}`}
                alt="Company Logo"
                style={{ width: '100px', height: '100px', marginTop: '10px' }}
              />
            )}
          </div>

          {error && <p className={`${styles.message} ${styles.error}`}>{error}</p>}
          {success && <p className={`${styles.message} ${styles.success}`}>{success}</p>}

          <button type="submit" className={`${styles.button} ${styles.saveButton}`} disabled={loading}>
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LeasingProfilePage;
