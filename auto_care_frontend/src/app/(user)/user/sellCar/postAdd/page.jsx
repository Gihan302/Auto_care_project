'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import api from '@/utils/axios';

export default function PostCarAd() {
  const [formData, setFormData] = useState({
    vehicleType: '',
    make: '',
    model: '',
    yearOfManufacture: '',
    mileage: '',
    price: '',
    currency: 'LKR',
    condition: '',
    description: '',
    location: '',
    contactNumber: '',
    email: '',
    name: '',
    transmission: '',
    fuel_type: '',
    colour: '',
    images: []
  });

  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    const fileArray = Array.from(files);
    const remainingSlots = 5 - formData.images.length;
    const filesToAdd = fileArray.slice(0, remainingSlots);
    
    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const validFiles = filesToAdd.filter(file => validTypes.includes(file.type));
    
    if (validFiles.length !== filesToAdd.length) {
      setError('Please select only image files (JPEG, PNG, WebP)');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...validFiles]
    }));
    setError(''); // Clear any previous errors
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Convert file to base64 with proper error handling
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('No file provided'));
        return;
      }
      
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result;
        if (result && typeof result === 'string') {
          resolve(result);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Convert images to base64 with error handling
      let base64Images = [];
      if (formData.images && formData.images.length > 0) {
        console.log(`🖼️ Converting ${formData.images.length} images to base64...`);
        base64Images = await Promise.all(
          formData.images.map(async (file, index) => {
            try {
              const base64 = await fileToBase64(file);
              console.log(`✅ Image ${index + 1} converted successfully`);
              return base64;
            } catch (err) {
              console.error(`❌ Failed to convert image ${index + 1}:`, err);
              throw new Error(`Failed to process image ${index + 1}`);
            }
          })
        );
      }

      // Validate required fields
      const requiredFields = ['name', 'contactNumber', 'email', 'location', 'vehicleType', 'make', 'model', 'yearOfManufacture', 'price', 'condition'];
      const missingFields = requiredFields.filter(field => {
        const value = formData[field];
        return !value || value.toString().trim() === '';
      });

      if (missingFields.length > 0) {
        setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
        return;
      }

      // Map frontend fields to backend field names with proper data types
      const backendPayload = {
        name: formData.name.trim(),
        t_number: formData.contactNumber.trim(),
        email: formData.email.trim(),
        location: formData.location.trim(),
        title: `${formData.yearOfManufacture} ${formData.make} ${formData.model}`.trim(),
        price: formData.price.toString(),
        v_type: formData.vehicleType,
        manufacturer: formData.make,
        model: formData.model,
        v_condition: formData.condition,
        m_year: formData.yearOfManufacture.toString(),
        r_year: new Date().getFullYear().toString(),
        mileage: formData.mileage ? formData.mileage.toString() : "0",
        e_capacity: "2.0L", // Default value
        transmission: formData.transmission || "Manual",
        fuel_type: formData.fuel_type || "Petrol",
        colour: formData.colour || "Not specified",
        description: formData.description || "",
        images: base64Images, // Base64 images for Cloudinary
        flag: 1,
        lStatus: 1,
        iStatus: 0
      };

      console.log('📤 Submitting payload:', {
        ...backendPayload,
        images: `[${backendPayload.images.length} base64 images]` // Don't log full base64
      });
      
      const response = await api.post('/advertisement/postadd', backendPayload);

      console.log('📡 Response status:', response.status);

      if (response.status === 200) {
        setSuccess(true);
        console.log('✅ Advertisement posted successfully:', response.data);
        
        // Show uploaded image URLs if available
        if (response.data && typeof response.data === 'object') {
          const imageUrls = [response.data.image1, response.data.image2, response.data.image3, response.data.image4, response.data.image5]
            .filter(url => url !== null && url !== undefined);
          
          if (imageUrls.length > 0) {
            console.log('🖼️ Cloudinary image URLs:', imageUrls);
          }
        }
        
        // Reset form on success
        setFormData({
          vehicleType: '',
          make: '',
          model: '',
          yearOfManufacture: '',
          mileage: '',
          price: '',
          currency: 'LKR',
          condition: '',
          description: '',
          location: '',
          contactNumber: '',
          email: '',
          name: '',
          transmission: '',
          fuel_type: '',
          colour: '',
          images: []
        });
      } else {
        const errorMessage = response.data?.message || `Server error (${response.status})`;
        setError(errorMessage);
        console.error('❌ Server error:', errorMessage);
      }
    } catch (err) {
      console.error('💥 Network error:', err);
      if (err.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
      } else if (err.response?.status === 403) {
        setError('Access denied. Please check your permissions.');
      } else if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Network error: Cannot connect to server. Please check if the server is running.');
      } else {
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Post Your Vehicle</h1>
        <p className={styles.subtitle}>Sell your vehicle quickly and easily</p>

        {error && (
          <div className={styles.errorMessage}>
            ❌ {error}
          </div>
        )}

        {success && (
          <div className={styles.successMessage}>
            🎉 Advertisement posted successfully! Images uploaded to Cloudinary.
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Personal Information */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>👤 Personal Information</h3>
            <div className={styles.row}>
              <div className={styles.col}>
                <label className={styles.label}>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.col}>
                <label className={styles.label}>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className={styles.input}
                  required
                />
              </div>
            </div>
            
            <div className={styles.row}>
              <div className={styles.col}>
                <label className={styles.label}>Contact Number *</label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  placeholder="Enter your contact number"
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.col}>
                <label className={styles.label}>Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter location"
                  className={styles.input}
                  required
                />
              </div>
            </div>
          </div>

          {/* Vehicle Details */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>🚗 Vehicle Information</h3>
            <div className={styles.row}>
              <div className={styles.col}>
                <label className={styles.label}>Vehicle Type *</label>
                <select 
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleInputChange}
                  className={styles.select}
                  required
                >
                  <option value="">Select Vehicle Type</option>
                  <option value="Car">Car</option>
                  <option value="SUV">SUV</option>
                  <option value="Truck">Truck</option>
                  <option value="Motorcycle">Motorcycle</option>
                  <option value="Van">Van</option>
                  <option value="Bus">Bus</option>
                </select>
              </div>
              <div className={styles.col}>
                <label className={styles.label}>Make *</label>
                <select 
                  name="make"
                  value={formData.make}
                  onChange={handleInputChange}
                  className={styles.select}
                  required
                >
                  <option value="">Select Make</option>
                  <option value="Toyota">Toyota</option>
                  <option value="Honda">Honda</option>
                  <option value="Nissan">Nissan</option>
                  <option value="Mazda">Mazda</option>
                  <option value="Suzuki">Suzuki</option>
                  <option value="Mitsubishi">Mitsubishi</option>
                  <option value="BMW">BMW</option>
                  <option value="Mercedes-Benz">Mercedes-Benz</option>
                  <option value="Hyundai">Hyundai</option>
                  <option value="KIA">KIA</option>
                </select>
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.col}>
                <label className={styles.label}>Model *</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  placeholder="Enter model"
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.col}>
                <label className={styles.label}>Year of Manufacture *</label>
                <input
                  type="number"
                  name="yearOfManufacture"
                  value={formData.yearOfManufacture}
                  onChange={handleInputChange}
                  placeholder="Enter year"
                  className={styles.input}
                  min="1900"
                  max={new Date().getFullYear()}
                  required
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.col}>
                <label className={styles.label}>Condition *</label>
                <select 
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  className={styles.select}
                  required
                >
                  <option value="">Select Condition</option>
                  <option value="Brand New">Brand New</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>
              <div className={styles.col}>
                <label className={styles.label}>Mileage (km)</label>
                <input
                  type="number"
                  name="mileage"
                  value={formData.mileage}
                  onChange={handleInputChange}
                  placeholder="Enter mileage"
                  className={styles.input}
                  min="0"
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.col}>
                <label className={styles.label}>Transmission</label>
                <select 
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleInputChange}
                  className={styles.select}
                >
                  <option value="">Select Transmission</option>
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                  <option value="CVT">CVT</option>
                </select>
              </div>
              <div className={styles.col}>
                <label className={styles.label}>Fuel Type</label>
                <select 
                  name="fuel_type"
                  value={formData.fuel_type}
                  onChange={handleInputChange}
                  className={styles.select}
                >
                  <option value="">Select Fuel Type</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.col}>
                <label className={styles.label}>Colour</label>
                <input
                  type="text"
                  name="colour"
                  value={formData.colour}
                  onChange={handleInputChange}
                  placeholder="Enter colour"
                  className={styles.input}
                />
              </div>
              <div className={styles.col}>
                <label className={styles.label}>Price *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Enter price"
                  className={styles.input}
                  min="0"
                  required
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.colFull}>
                <label className={styles.label}>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter vehicle description"
                  className={styles.textarea}
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Vehicle Images */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>📷 Vehicle Images (Max 5)</h3>
            <div 
              className={`${styles.dropZone} ${dragActive ? styles.dragActive : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className={styles.uploadIcon}>☁️</div>
              <p className={styles.uploadText}>Drag and drop images here</p>
              <p className={styles.uploadSubtext}>or click to browse ({formData.images.length}/5)</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileInput}
                className={styles.fileInput}
                disabled={formData.images.length >= 5}
              />
              <button 
                type="button" 
                className={styles.chooseFilesBtn}
                disabled={formData.images.length >= 5}
                onClick={() => document.querySelector('input[type="file"]').click()}
              >
                Choose Files
              </button>
            </div>
            
            {formData.images.length > 0 && (
              <div className={styles.imagePreview}>
                {formData.images.map((file, index) => (
                  <div key={index} className={styles.imageItem}>
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt={`Preview ${index + 1}`}
                      className={styles.previewImage}
                    />
                    <button 
                      type="button"
                      onClick={() => removeImage(index)}
                      className={styles.removeBtn}
                      title="Remove image"
                    >
                      ×
                    </button>
                    <div className={styles.imageIndex}>{index + 1}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? '🚀 Posting Ad & Uploading to Cloudinary...' : 'Post Your Ad'}
          </button>
        </form>
      </div>
    </div>
  );
}
