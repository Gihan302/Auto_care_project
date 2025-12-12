'use client';

import React, { useState } from 'react';
import { Star, Camera, Plus, X, ChevronDown, Check } from 'lucide-react';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import api from '@/utils/axios';

const WriteReviewPage = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Car Information
    carMake: '',
    carModel: '',
    year: '',
    variant: '',
    purchaseType: '',
    
    // Overall Rating
    overallRating: 0,
    
    // Category Ratings
    performance: 0,
    comfort: 0,
    fuelEconomy: 0,
    safety: 0,
    value: 0,
    
    // Review Details
    title: '',
    reviewText: '',
    
    // Pros and Cons
    pros: ['', '', ''],
    cons: ['', '', ''],
    
    // Images
    images: [],
    
    // Ownership Details
    mileage: '',
    ownershipDuration: '',
    purchaseDate: '',
    purchasePrice: '',
    verifiedOwner: false,
    
    // Additional Info
    maintenanceExperience: '',
    finalThoughts: ''
  });

  const [errors, setErrors] = useState({});
  const [hoverRating, setHoverRating] = useState({ overall: 0, performance: 0, comfort: 0, fuelEconomy: 0, safety: 0, value: 0 });

  const carMakes = ['Toyota', 'Honda', 'Mazda', 'Nissan', 'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Suzuki', 'Mitsubishi'];
  const years = Array.from({ length: 25 }, (_, i) => 2024 - i);
  const ownershipOptions = ['Less than 1 month', '1-3 months', '3-6 months', '6-12 months', '1-2 years', '2+ years'];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleProChange = (index, value) => {
    const newPros = [...formData.pros];
    newPros[index] = value;
    setFormData(prev => ({ ...prev, pros: newPros }));
  };

  const handleConChange = (index, value) => {
    const newCons = [...formData.cons];
    newCons[index] = value;
    setFormData(prev => ({ ...prev, cons: newCons }));
  };

  const addPro = () => {
    setFormData(prev => ({ ...prev, pros: [...prev.pros, ''] }));
  };

  const addCon = () => {
    setFormData(prev => ({ ...prev, cons: [...prev.cons, ''] }));
  };

  const removePro = (index) => {
    if (formData.pros.length > 1) {
      const newPros = formData.pros.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, pros: newPros }));
    }
  };

  const removeCon = (index) => {
    if (formData.cons.length > 1) {
      const newCons = formData.cons.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, cons: newCons }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (formData.images.length + files.length > 8) {
      alert('Maximum 8 images allowed');
      return;
    }

    // Convert images to base64
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, {
            file,
            preview: URL.createObjectURL(file),
            base64: reader.result
          }]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const handleStarClick = (category, rating) => {
    handleInputChange(category, rating);
  };

  const handleStarHover = (category, rating) => {
    setHoverRating(prev => ({ ...prev, [category]: rating }));
  };

  const handleStarLeave = (category) => {
    setHoverRating(prev => ({ ...prev, [category]: 0 }));
  };

  const renderStars = (category, currentRating) => {
    const displayRating = hoverRating[category] || currentRating;
    
    return (
      <div className={styles.starContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={category === 'overallRating' ? 48 : 32}
            className={star <= displayRating ? styles.starFilled : styles.starEmpty}
            onClick={() => handleStarClick(category, star)}
            onMouseEnter={() => handleStarHover(category, star)}
            onMouseLeave={() => handleStarLeave(category)}
          />
        ))}
      </div>
    );
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.carMake) newErrors.carMake = 'Car make is required';
    if (!formData.carModel) newErrors.carModel = 'Car model is required';
    if (!formData.year) newErrors.year = 'Year is required';
    if (formData.overallRating === 0) newErrors.overallRating = 'Overall rating is required';
    if (!formData.title) newErrors.title = 'Review title is required';
    if (!formData.reviewText) newErrors.reviewText = 'Review text is required';
    if (formData.reviewText.length < 100) newErrors.reviewText = 'Review must be at least 100 characters';
    if (!formData.pros[0]) newErrors.pros = 'At least one pro is required';
    if (!formData.cons[0]) newErrors.cons = 'At least one con is required';
    if (!formData.mileage) newErrors.mileage = 'Mileage is required';
    if (!formData.ownershipDuration) newErrors.ownershipDuration = 'Ownership duration is required';

    // Category ratings validation
    if (formData.performance === 0) newErrors.performance = 'Performance rating is required';
    if (formData.comfort === 0) newErrors.comfort = 'Comfort rating is required';
    if (formData.fuelEconomy === 0) newErrors.fuelEconomy = 'Fuel economy rating is required';
    if (formData.safety === 0) newErrors.safety = 'Safety rating is required';
    if (formData.value === 0) newErrors.value = 'Value rating is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);

      // Prepare data for backend
      const reviewData = {
        // Car Information
        carMake: formData.carMake,
        carModel: formData.carModel,
        year: parseInt(formData.year),
        variant: formData.variant || null,
        purchaseType: formData.purchaseType || null,
        
        // Overall Rating
        overallRating: parseFloat(formData.overallRating),
        
        // Category Ratings
        performance: formData.performance,
        comfort: formData.comfort,
        fuelEconomy: formData.fuelEconomy,
        safety: formData.safety,
        value: formData.value,
        
        // Review Details
        title: formData.title,
        reviewText: formData.reviewText,
        
        // Pros and Cons (join non-empty values with commas)
        pros: formData.pros.filter(p => p.trim() !== '').join(','),
        cons: formData.cons.filter(c => c.trim() !== '').join(','),
        
        // Images (base64 strings)
        images: formData.images.map(img => img.base64),
        
        // Ownership Details
        mileage: formData.mileage + ' km',
        ownershipDuration: formData.ownershipDuration,
        purchaseDate: formData.purchaseDate || null,
        purchasePrice: formData.purchasePrice || null,
        verifiedOwner: formData.verifiedOwner,
        
        // Additional Info
        maintenanceExperience: formData.maintenanceExperience || null,
        finalThoughts: formData.finalThoughts || null
      };

      console.log('Submitting review data:', reviewData);

      const response = await api.post('/reviews/submit', reviewData);
      
      console.log('Response:', response.data);
      alert('Review submitted successfully! It will be visible after admin approval.');
      router.push('/user/research/review');
      
    } catch (error) {
      console.error('Error submitting review:', error);
      if (error.response) {
        alert('Error: ' + (error.response.data.message || 'Failed to submit review'));
      } else {
        alert('Network error. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const [loading, setLoading] = useState(false);

  const handleSaveDraft = () => {
    console.log('Saving draft:', formData);
    alert('Draft saved!');
  };

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.headerTitle}>Share Your Car Review</h1>
          <p className={styles.headerSubtitle}>
            Help other buyers make informed decisions with your honest experience
          </p>
          <p className={styles.headerNote}>Fields marked with * are required</p>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className={styles.progressContainer}>
        <div className={styles.progressBar}>
          <div className={`${styles.progressStep} ${styles.progressStepCompleted}`}>
            <div className={styles.progressCircle}>
              <Check size={16} />
            </div>
            <span className={styles.progressLabel}>Car Details</span>
          </div>
          <div className={styles.progressLine}></div>
          <div className={`${styles.progressStep} ${styles.progressStepActive}`}>
            <div className={styles.progressCircle}>2</div>
            <span className={styles.progressLabel}>Ratings</span>
          </div>
          <div className={styles.progressLine}></div>
          <div className={styles.progressStep}>
            <div className={styles.progressCircle}>3</div>
            <span className={styles.progressLabel}>Review Details</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.mainContent}>
        {/* Card 1 - Car Information */}
        <div className={styles.formCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Car Information</h2>
            <p className={styles.cardSubtitle}>Tell us about the car you're reviewing</p>
          </div>

          <div className={styles.gridThree}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Car Make <span className={styles.required}>*</span>
              </label>
              <select
                value={formData.carMake}
                onChange={(e) => handleInputChange('carMake', e.target.value)}
                className={`${styles.select} ${errors.carMake ? styles.inputError : ''}`}
              >
                <option value="">Select make...</option>
                {carMakes.map(make => (
                  <option key={make} value={make}>{make}</option>
                ))}
              </select>
              {errors.carMake && <span className={styles.errorText}>{errors.carMake}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Car Model <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Camry, Civic"
                value={formData.carModel}
                onChange={(e) => handleInputChange('carModel', e.target.value)}
                className={`${styles.input} ${errors.carModel ? styles.inputError : ''}`}
                disabled={!formData.carMake}
              />
              {errors.carModel && <span className={styles.errorText}>{errors.carModel}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Year <span className={styles.required}>*</span>
              </label>
              <select
                value={formData.year}
                onChange={(e) => handleInputChange('year', e.target.value)}
                className={`${styles.select} ${errors.year ? styles.inputError : ''}`}
              >
                <option value="">Select year...</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              {errors.year && <span className={styles.errorText}>{errors.year}</span>}
            </div>
          </div>

          <div className={styles.gridTwo}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Variant/Trim (Optional)</label>
              <input
                type="text"
                placeholder="e.g., Hybrid, Sport, Premium"
                value={formData.variant}
                onChange={(e) => handleInputChange('variant', e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Purchase Type</label>
              <select
                value={formData.purchaseType}
                onChange={(e) => handleInputChange('purchaseType', e.target.value)}
                className={styles.select}
              >
                <option value="">Select...</option>
                <option value="new">New</option>
                <option value="used">Used</option>
                <option value="certified">Certified Pre-Owned</option>
                <option value="leased">Leased</option>
              </select>
            </div>
          </div>
        </div>

        {/* Card 2 - Overall Rating */}
        <div className={styles.formCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>
              Overall Rating <span className={styles.required}>*</span>
            </h2>
            <p className={styles.cardSubtitle}>How would you rate your overall experience?</p>
          </div>

          <div className={styles.overallRatingSection}>
            {renderStars('overallRating', formData.overallRating)}
            <div className={styles.ratingDisplay}>
              {formData.overallRating > 0 ? formData.overallRating.toFixed(1) : '0.0'}
            </div>
            <p className={styles.ratingHint}>Click to rate from 1 to 5 stars</p>
          </div>
          {errors.overallRating && <span className={styles.errorText}>{errors.overallRating}</span>}
        </div>

        {/* Card 3 - Category Ratings */}
        <div className={styles.formCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>
              Rate by Category <span className={styles.required}>*</span>
            </h2>
            <p className={styles.cardSubtitle}>Rate different aspects of the vehicle</p>
          </div>

          <div className={styles.categoryRatingsGrid}>
            {/* Performance */}
            <div className={styles.categoryRatingRow}>
              <div className={styles.categoryInfo}>
                <div className={styles.categoryIcon}>🏎️</div>
                <div>
                  <div className={styles.categoryName}>Performance</div>
                  <div className={styles.categoryHelper}>Engine power, acceleration, handling</div>
                </div>
              </div>
              <div className={styles.categoryRating}>
                {renderStars('performance', formData.performance)}
                <span className={styles.ratingValue}>{formData.performance}/5</span>
              </div>
            </div>

            {/* Comfort */}
            <div className={styles.categoryRatingRow}>
              <div className={styles.categoryInfo}>
                <div className={styles.categoryIcon}>🪑</div>
                <div>
                  <div className={styles.categoryName}>Comfort</div>
                  <div className={styles.categoryHelper}>Seat quality, ride smoothness, cabin noise</div>
                </div>
              </div>
              <div className={styles.categoryRating}>
                {renderStars('comfort', formData.comfort)}
                <span className={styles.ratingValue}>{formData.comfort}/5</span>
              </div>
            </div>

            {/* Fuel Economy */}
            <div className={styles.categoryRatingRow}>
              <div className={styles.categoryInfo}>
                <div className={styles.categoryIcon}>⛽</div>
                <div>
                  <div className={styles.categoryName}>Fuel Economy</div>
                  <div className={styles.categoryHelper}>Mileage, efficiency, running costs</div>
                </div>
              </div>
              <div className={styles.categoryRating}>
                {renderStars('fuelEconomy', formData.fuelEconomy)}
                <span className={styles.ratingValue}>{formData.fuelEconomy}/5</span>
              </div>
            </div>

            {/* Safety */}
            <div className={styles.categoryRatingRow}>
              <div className={styles.categoryInfo}>
                <div className={styles.categoryIcon}>🛡️</div>
                <div>
                  <div className={styles.categoryName}>Safety</div>
                  <div className={styles.categoryHelper}>Safety features, crash ratings, visibility</div>
                </div>
              </div>
              <div className={styles.categoryRating}>
                {renderStars('safety', formData.safety)}
                <span className={styles.ratingValue}>{formData.safety}/5</span>
              </div>
            </div>

            {/* Value */}
            <div className={styles.categoryRatingRow}>
              <div className={styles.categoryInfo}>
                <div className={styles.categoryIcon}>💰</div>
                <div>
                  <div className={styles.categoryName}>Value for Money</div>
                  <div className={styles.categoryHelper}>Price vs features, resale value, maintenance</div>
                </div>
              </div>
              <div className={styles.categoryRating}>
                {renderStars('value', formData.value)}
                <span className={styles.ratingValue}>{formData.value}/5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4 - Review Title & Text */}
        <div className={styles.formCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>
              Your Review <span className={styles.required}>*</span>
            </h2>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Review Title <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              placeholder="Summarize your experience in one sentence..."
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              maxLength={100}
              className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
            />
            <div className={styles.charCount}>{formData.title.length}/100</div>
            {errors.title && <span className={styles.errorText}>{errors.title}</span>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Detailed Review <span className={styles.required}>*</span>
            </label>
            <p className={styles.helperText}>
              Share your honest experience. Minimum 100 characters.
            </p>
            <textarea
              placeholder="Describe your experience with this car. Consider: How does it drive? What features stand out? How's the build quality? Would you recommend it?"
              value={formData.reviewText}
              onChange={(e) => handleInputChange('reviewText', e.target.value)}
              maxLength={2000}
              rows={8}
              className={`${styles.textarea} ${errors.reviewText ? styles.inputError : ''}`}
            />
            <div className={styles.charCount}>{formData.reviewText.length}/2000</div>
            {errors.reviewText && <span className={styles.errorText}>{errors.reviewText}</span>}
          </div>
        </div>

        {/* Card 5 - Pros & Cons */}
        <div className={styles.formCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Pros & Cons</h2>
            <p className={styles.cardSubtitle}>Help buyers understand the highlights and drawbacks</p>
          </div>

          <div className={styles.prosConsGrid}>
            {/* Pros */}
            <div className={styles.prosSection}>
              <h3 className={styles.prosTitle}>
                <span className={styles.prosIconLarge}>✓</span>
                What You Loved
              </h3>
              <div className={styles.inputList}>
                {formData.pros.map((pro, index) => (
                  <div key={index} className={styles.inputWithRemove}>
                    <input
                      type="text"
                      placeholder={`Pro ${index + 1}${index === 0 ? ' *' : ''}`}
                      value={pro}
                      onChange={(e) => handleProChange(index, e.target.value)}
                      className={styles.input}
                    />
                    {formData.pros.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePro(index)}
                        className={styles.removeBtn}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addPro}
                className={styles.addBtn}
              >
                <Plus size={16} />
                Add Another Pro
              </button>
              {errors.pros && <span className={styles.errorText}>{errors.pros}</span>}
            </div>

            {/* Cons */}
            <div className={styles.consSection}>
              <h3 className={styles.consTitle}>
                <span className={styles.consIconLarge}>✗</span>
                What Could Be Better
              </h3>
              <div className={styles.inputList}>
                {formData.cons.map((con, index) => (
                  <div key={index} className={styles.inputWithRemove}>
                    <input
                      type="text"
                      placeholder={`Con ${index + 1}${index === 0 ? ' *' : ''}`}
                      value={con}
                      onChange={(e) => handleConChange(index, e.target.value)}
                      className={styles.input}
                    />
                    {formData.cons.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCon(index)}
                        className={styles.removeBtn}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addCon}
                className={styles.addBtn}
              >
                <Plus size={16} />
                Add Another Con
              </button>
              {errors.cons && <span className={styles.errorText}>{errors.cons}</span>}
            </div>
          </div>
        </div>

        {/* Card 6 - Photos */}
        <div className={styles.formCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Add Photos (Optional)</h2>
            <p className={styles.cardSubtitle}>Share images of your car to help others visualize</p>
          </div>

          <div className={styles.uploadZone}>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className={styles.fileInput}
              id="imageUpload"
            />
            <label htmlFor="imageUpload" className={styles.uploadLabel}>
              <Camera size={48} className={styles.uploadIcon} />
              <div className={styles.uploadText}>Drag & Drop photos here</div>
              <div className={styles.uploadSubtext}>or click to browse</div>
              <div className={styles.uploadHint}>Maximum 8 images, 5MB each</div>
              <div className={styles.uploadFormats}>JPG, PNG, HEIC</div>
            </label>
          </div>

          {formData.images.length > 0 && (
            <div className={styles.imageGrid}>
              {formData.images.map((image, index) => (
                <div key={index} className={styles.imagePreview}>
                  <img src={image.preview} alt={`Preview ${index + 1}`} />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className={styles.imageRemoveBtn}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Card 7 - Ownership Details */}
        <div className={styles.formCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Ownership Information</h2>
            <p className={styles.cardSubtitle}>Help others understand your experience level</p>
          </div>

          <div className={styles.gridTwo}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Mileage Driven <span className={styles.required}>*</span>
              </label>
              <div className={styles.inputWithUnit}>
                <input
                  type="number"
                  placeholder="e.g., 5000"
                  value={formData.mileage}
                  onChange={(e) => handleInputChange('mileage', e.target.value)}
                  className={`${styles.input} ${errors.mileage ? styles.inputError : ''}`}
                />
                <span className={styles.unit}>km</span>
              </div>
              {errors.mileage && <span className={styles.errorText}>{errors.mileage}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Ownership Duration <span className={styles.required}>*</span>
              </label>
              <select
                value={formData.ownershipDuration}
                onChange={(e) => handleInputChange('ownershipDuration', e.target.value)}
                className={`${styles.select} ${errors.ownershipDuration ? styles.inputError : ''}`}
              >
                <option value="">Select...</option>
                {ownershipOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {errors.ownershipDuration && <span className={styles.errorText}>{errors.ownershipDuration}</span>}
            </div>
          </div>

          <div className={styles.gridTwo}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Purchase Date (Optional)</label>
              <input
                type="month"
                value={formData.purchaseDate}
                onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Purchase Price (Optional)</label>
              <div className={styles.inputWithUnit}>
                <span className={styles.unitPrefix}>LKR</span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={formData.purchasePrice}
                  onChange={(e) => handleInputChange('purchasePrice', e.target.value)}
                  className={styles.input}
                />
              </div>
              <p className={styles.helperText}>Helps others understand value</p>
            </div>
          </div>

          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.verifiedOwner}
                onChange={(e) => handleInputChange('verifiedOwner', e.target.checked)}
                className={styles.checkbox}
              />
              <span className={styles.checkboxText}>
                I am the verified owner of this vehicle
              </span>
            </label>
            <p className={styles.helperText}>
              Verified reviews are more trusted and appear higher in search results
            </p>
            {formData.verifiedOwner && (
              <div className={styles.verifiedBadgePreview}>
                <Check size={12} />
                Verified Owner
              </div>
            )}
          </div>
        </div>

        {/* Card 8 - Additional Info */}
        <div className={styles.formCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Additional Information (Optional)</h2>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Maintenance Experience</label>
            <textarea
              placeholder="Share your experience with maintenance, repairs, service costs..."
              value={formData.maintenanceExperience}
              onChange={(e) => handleInputChange('maintenanceExperience', e.target.value)}
              rows={4}
              className={styles.textarea}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Final Thoughts</label>
            <textarea
              placeholder="Any other thoughts or advice for potential buyers?"
              value={formData.finalThoughts}
              onChange={(e) => handleInputChange('finalThoughts', e.target.value)}
              rows={4}
              className={styles.textarea}
            />
          </div>
        </div>

        {/* Bottom Actions */}
        <div className={styles.bottomActions}>
          <button
            type="button"
            onClick={handleSaveDraft}
            className={styles.draftBtn}
          >
            Save as Draft
          </button>

          <div className={styles.rightActions}>
            <button
              type="button"
              onClick={() => router.push('/reviews')}
              className={styles.cancelBtn}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
            >
              <Check size={20} />
              Submit Review
            </button>
          </div>
        </div>

        <p className={styles.bottomNote}>
          By submitting, you agree to our Review Guidelines and Terms of Service
        </p>
      </form>
    </div>
  );
};

export default WriteReviewPage;