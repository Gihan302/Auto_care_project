'use client';

import { useState } from 'react';
import styles from './page.module.css';

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
    images: []
  });

  const [dragActive, setDragActive] = useState(false);

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
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...fileArray]
    }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission logic here
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Post Your Vehicle</h1>
        <p className={styles.subtitle}>Sell your vehicle quickly and easily</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Vehicle Images */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>📷 Vehicle Images</h3>
            <div 
              className={`${styles.dropZone} ${dragActive ? styles.dragActive : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className={styles.uploadIcon}>☁️</div>
              <p className={styles.uploadText}>Drag and drop images here</p>
              <p className={styles.uploadSubtext}>or click to browse</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileInput}
                className={styles.fileInput}
              />
              <button type="button" className={styles.chooseFilesBtn}>
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
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Vehicle Details */}
          <div className={styles.row}>
            <div className={styles.col}>
              <label className={styles.label}>Vehicle Type</label>
              <select 
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleInputChange}
                className={styles.select}
              >
                <option value="">Select Vehicle Type</option>
                <option value="car">Car</option>
                <option value="suv">SUV</option>
                <option value="truck">Truck</option>
                <option value="motorcycle">Motorcycle</option>
                <option value="van">Van</option>
                <option value="bus">Bus</option>
              </select>
            </div>

            <div className={styles.col}>
              <label className={styles.label}>Make</label>
              <select 
                name="make"
                value={formData.make}
                onChange={handleInputChange}
                className={styles.select}
              >
                <option value="">Select Make</option>
                <option value="toyota">Toyota</option>
                <option value="honda">Honda</option>
                <option value="nissan">Nissan</option>
                <option value="mazda">Mazda</option>
                <option value="suzuki">Suzuki</option>
                <option value="mitsubishi">Mitsubishi</option>
                <option value="bmw">BMW</option>
                <option value="mercedes">Mercedes-Benz</option>
                <option value="hyundai">Hyundai</option>
                <option value="kia">KIA</option>
              </select>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.col}>
              <label className={styles.label}>Model</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                placeholder="Enter model"
                className={styles.input}
              />
            </div>

            <div className={styles.col}>
              <label className={styles.label}>Year of Manufacture</label>
              <select 
                name="yearOfManufacture"
                value={formData.yearOfManufacture}
                onChange={handleInputChange}
                className={styles.select}
              >
                <option value="">Select Year</option>
                {Array.from({ length: 30 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return <option key={year} value={year}>{year}</option>;
                })}
              </select>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.col}>
              <label className={styles.label}>Mileage</label>
              <div className={styles.inputGroup}>
                <input
                  type="number"
                  name="mileage"
                  value={formData.mileage}
                  onChange={handleInputChange}
                  placeholder="Enter mileage"
                  className={styles.input}
                />
                <span className={styles.inputSuffix}>KM</span>
              </div>
            </div>

            <div className={styles.col}>
              <label className={styles.label}>Price</label>
              <div className={styles.inputGroup}>
                <select 
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className={styles.currencySelect}
                >
                  <option value="LKR">LKR</option>
                  <option value="USD">USD</option>
                </select>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Enter price"
                  className={styles.priceInput}
                />
              </div>
            </div>
          </div>

          {/* Condition */}
          <div className={styles.section}>
            <label className={styles.label}>Condition</label>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="condition"
                  value="brand-new"
                  checked={formData.condition === 'brand-new'}
                  onChange={handleInputChange}
                  className={styles.radio}
                />
                Brand New
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="condition"
                  value="used"
                  checked={formData.condition === 'used'}
                  onChange={handleInputChange}
                  className={styles.radio}
                />
                Used
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="condition"
                  value="reconditioned"
                  checked={formData.condition === 'reconditioned'}
                  onChange={handleInputChange}
                  className={styles.radio}
                />
                Reconditioned
              </label>
            </div>
          </div>

          {/* Description */}
          <div className={styles.section}>
            <label className={styles.label}>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your vehicle in detail..."
              rows={6}
              className={styles.textarea}
            />
          </div>

          {/* Location and Contact */}
          <div className={styles.row}>
            <div className={styles.col}>
              <label className={styles.label}>Location (District)</label>
              <select 
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className={styles.select}
              >
                <option value="">Select District</option>
                <option value="colombo">Colombo</option>
                <option value="gampaha">Gampaha</option>
                <option value="kalutara">Kalutara</option>
                <option value="kandy">Kandy</option>
                <option value="matale">Matale</option>
                <option value="nuwara-eliya">Nuwara Eliya</option>
                <option value="galle">Galle</option>
                <option value="matara">Matara</option>
                <option value="hambantota">Hambantota</option>
                <option value="jaffna">Jaffna</option>
                <option value="kilinochchi">Kilinochchi</option>
                <option value="mannar">Mannar</option>
                <option value="vavuniya">Vavuniya</option>
                <option value="mullaitivu">Mullaitivu</option>
                <option value="batticaloa">Batticaloa</option>
                <option value="ampara">Ampara</option>
                <option value="trincomalee">Trincomalee</option>
                <option value="kurunegala">Kurunegala</option>
                <option value="puttalam">Puttalam</option>
                <option value="anuradhapura">Anuradhapura</option>
                <option value="polonnaruwa">Polonnaruwa</option>
                <option value="badulla">Badulla</option>
                <option value="moneragala">Moneragala</option>
                <option value="ratnapura">Ratnapura</option>
                <option value="kegalle">Kegalle</option>
              </select>
            </div>

            <div className={styles.col}>
              <label className={styles.label}>Contact Number</label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                placeholder="+94 77 123 4567"
                className={styles.input}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className={styles.submitBtn}>
            Post Your Ad
          </button>
        </form>
      </div>
    </div>
  );
}