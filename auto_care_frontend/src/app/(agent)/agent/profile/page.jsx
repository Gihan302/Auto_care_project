'use client'
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import api from '@/utils/axios'; // Assuming axios is configured in utils
import styles from './page.module.css'; // Import the CSS module

const AgentProfilePage = () => {
  const [agentData, setAgentData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    profilePicture: '/placeholder.jpg',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(agentData);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchAgentData = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/user/currentuser');
        const user = response.data;
        const fetchedData = {
          name: `${user.fname} ${user.lname}`,
          email: user.username,
          phone: user.tnumber,
          company: user.cName || '', // Map cName to company
          address: user.address || '',
          profilePicture: user.imgId ? `http://localhost:8080/images/${user.imgId}` : '/placeholder.jpg',
        };
        setAgentData(fetchedData);
        setFormData(fetchedData);
      } catch (error) {
        console.error('Failed to fetch agent data:', error);
        // Handle error (e.g., show a toast notification)
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgentData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    // Split name into first and last name for the backend
    const nameParts = formData.name.split(' ');
    const fname = nameParts[0] || '';
    const lname = nameParts.slice(1).join(' ') || '';

    const profileUpdatePayload = {
      fname,
      lname,
      username: formData.email,
      tnumber: formData.phone,
      address: formData.address,
      cName: formData.company, // Map company back to cName
      // Include other fields as required by your backend
    };

    try {
      const response = await api.put('/user/editprofile', profileUpdatePayload);
      if (response.status === 200) {
        setAgentData(formData);
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    setFormData(agentData);
    setIsEditing(false);
  };
  
  const handlePhotoUpload = async (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64Image = reader.result;
      try {
        const response = await api.put('/user/changephoto', base64Image, {
          headers: { 'Content-Type': 'text/plain' },
        });
        if (response.status === 200) {
          // Optimistically update the UI, or refetch the user data
          setAgentData(prev => ({ ...prev, profilePicture: URL.createObjectURL(file) }));
          alert('Profile picture updated successfully!');
        }
      } catch (error) {
        console.error('Error uploading profile picture:', error);
        alert('Failed to upload profile picture.');
      }
    };
  };

  // The logic from onFileSelect is moved directly into the input's onChange handler.
  // const onFileSelect = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     handlePhotoUpload(file);
  //   }
  // };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className={`max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md ${styles.profileContainer}`}>
        <h1 className={`text-3xl font-bold text-gray-800 mb-6 ${styles.profileHeader}`}>Agent Profile</h1>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="flex-shrink-0">
            {/* <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => { // New inline onChange handler
                const file = e.target.files[0];
                if (file) {
                  handlePhotoUpload(file);
                }
              }}
              className="hidden"
              accept="image/*"
            /> */}
            <div className={`w-32 h-32 relative rounded-full overflow-hidden border-4 border-indigo-200 ${styles.profilePictureWrapper}`} style={{ position: 'relative' }}>
              <Image
                src={agentData.profilePicture}
                alt="Profile Picture"
                fill
                className="object-cover"
                priority
              />
            </div>
            <button
              onClick={() => fileInputRef.current.click()}
              className="mt-4 px-4 py-2 inline-flex items-center justify-center border border-gray-300 bg-gray-100 text-indigo-600 rounded-md hover:bg-gray-200 transition-colors text-sm"
            >
              Upload New Photo
            </button>
          </div>
          <div className="flex-grow w-full">
            {!isEditing ? (
              <div className="space-y-4">
                <div><label className={`block text-sm font-medium text-gray-700 ${styles.profileDetailLabel}`}>Name:</label><p className={`text-gray-900 text-lg ${styles.profileDetailValue}`}>{agentData.name}</p></div>
                <div><label className={`block text-sm font-medium text-gray-700 ${styles.profileDetailLabel}`}>Email:</label><p className={`text-gray-900 text-lg ${styles.profileDetailValue}`}>{agentData.email}</p></div>
                <div><label className={`block text-sm font-medium text-gray-700 ${styles.profileDetailLabel}`}>Phone:</label><p className={`text-gray-900 text-lg ${styles.profileDetailValue}`}>{agentData.phone}</p></div>
                <div><label className={`block text-sm font-medium text-gray-700 ${styles.profileDetailLabel}`}>Company:</label><p className={`text-gray-900 text-lg ${styles.profileDetailValue}`}>{agentData.company}</p></div>
                <div><label className={`block text-sm font-medium text-gray-700 ${styles.profileDetailLabel}`}>Address:</label><p className={`text-gray-900 text-lg ${styles.profileDetailValue}`}>{agentData.address}</p></div>
                <button onClick={() => setIsEditing(true)} className={`px-6 py-2 rounded-md transition-colors ${styles.editButton}`}>Edit Profile</button>
              </div>
            ) : (
              <form onSubmit={handleSave} className="space-y-4">
                <div><label htmlFor="name" className={`block text-sm font-medium text-gray-700 ${styles.profileDetailLabel}`}>Name</label><input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required /></div>
                <div><label htmlFor="email" className={`block text-sm font-medium text-gray-700 ${styles.profileDetailLabel}`}>Email</label><input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required /></div>
                <div><label htmlFor="phone" className={`block text-sm font-medium text-gray-700 ${styles.profileDetailLabel}`}>Phone</label><input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" /></div>
                <div><label htmlFor="company" className={`block text-sm font-medium text-gray-700 ${styles.profileDetailLabel}`}>Company</label><input type="text" id="company" name="company" value={formData.company} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" /></div>
                <div><label htmlFor="address" className={`block text-sm font-medium text-gray-700 ${styles.profileDetailLabel}`}>Address</label><textarea id="address" name="address" value={formData.address} onChange={handleInputChange} rows="3" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea></div>
                <div className="flex gap-4"><button type="submit" className={`px-6 py-2 rounded-md transition-colors ${styles.saveButton}`}>Save Changes</button><button type="button" onClick={handleCancel} className={`px-6 py-2 rounded-md transition-colors ${styles.cancelButton}`}>Cancel</button></div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentProfilePage;