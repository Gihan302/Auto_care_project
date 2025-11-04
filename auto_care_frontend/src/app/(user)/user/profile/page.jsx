'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './profile.module.css'; // Assuming you'll create this CSS module
import { User, Mail, Phone, Edit, Save, XCircle } from 'lucide-react';

const UserProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedFname, setEditedFname] = useState('');
  const [editedLname, setEditedLname] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [editedTelephone, setEditedTelephone] = useState('');
  const [editedNic, setEditedNic] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Fetch user data from localStorage
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setUserData(parsedUser);
        setEditedFname(parsedUser.fname || '');
        setEditedLname(parsedUser.lname || '');
        setEditedEmail(parsedUser.username || ''); // Assuming username is email
        setEditedTelephone(parsedUser.tnumber || '');
        setEditedNic(parsedUser.nic || '');
      } catch (e) {
        console.error("Failed to parse user data from localStorage", e);
        setError("Failed to load user data.");
      }
    } else {
      // If no user data, redirect to sign-in
      router.push('/signin');
    }
  }, [router]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    // Reset edited fields if cancelling edit
    if (isEditing && userData) {
      setEditedFname(userData.fname || '');
      setEditedLname(userData.lname || '');
      setEditedEmail(userData.username || '');
      setEditedTelephone(userData.tnumber || '');
      setEditedNic(userData.nic || '');
    }
    setError(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic validation
    if (!editedFname || !editedLname || !editedEmail) {
      setError("First name, last name, and email are required.");
      setLoading(false);
      return;
    }

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const token = localStorage.getItem('token');

    if (!token) {
      setError("Authentication token not found. Please sign in again.");
      setLoading(false);
      router.push('/signin');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${userData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          fname: editedFname,
          lname: editedLname,
          username: editedEmail,
          tnumber: editedTelephone,
          nic: editedNic,
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        // Update localStorage with new user data
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUserData(updatedUser);
        setIsEditing(false);
        console.log("Profile updated successfully!");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("An error occurred while updating your profile.");
    } finally {
      setLoading(false);
    }
  };

  if (!userData && !error) {
    return <div className={styles.loading}>Loading profile...</div>;
  }

  if (error && !userData) {
    return <div className={styles.errorContainer}>Error: {error}</div>;
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileCard}>
        <h2 className={styles.profileTitle}>My Profile</h2>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <form onSubmit={handleSave}>
          <div className={styles.formGroup}>
            <label htmlFor="fname">First Name</label>
            <input
              type="text"
              id="fname"
              value={editedFname}
              onChange={(e) => setEditedFname(e.target.value)}
              disabled={!isEditing}
              className={styles.inputField}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="lname">Last Name</label>
            <input
              type="text"
              id="lname"
              value={editedLname}
              onChange={(e) => setEditedLname(e.target.value)}
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
          {userData?.roles?.includes('ROLE_AGENT') || userData?.roles?.includes('ROLE_ICOMPANY') || userData?.roles?.includes('ROLE_LCOMPANY') ? (
            <>
              <div className={styles.formGroup}>
                <label htmlFor="telephone">Telephone</label>
                <input
                  type="text"
                  id="telephone"
                  value={editedTelephone}
                  onChange={(e) => setEditedTelephone(e.target.value)}
                  disabled={!isEditing}
                  className={styles.inputField}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="nic">NIC Number</label>
                <input
                  type="text"
                  id="nic"
                  value={editedNic}
                  onChange={(e) => setEditedNic(e.target.value)}
                  disabled={!isEditing}
                  className={styles.inputField}
                />
              </div>
            </>
          ) : null}

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

export default UserProfilePage;
