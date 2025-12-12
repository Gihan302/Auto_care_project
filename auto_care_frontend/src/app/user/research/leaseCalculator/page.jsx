'use client';

import React, { useState } from 'react';
import styles from './leaseCal.module.css';
import { Calculator, Car, Truck, Bus, Bike } from 'lucide-react';
import Image from 'next/image';

const LeaseLoanPage = () => {
  // Vehicle Leasing Calculator State
  const [formData, setFormData] = useState({
    totalMSRP: 35000,
    downPayment: 3000,
    tradeInValue: 0,
    residualPercentage: 60,
    interestRate: 4.5,
    salesTax: 8.5,
    leaseTerm: 36
  });

  const [calculatedPayment, setCalculatedPayment] = useState(450);

  // Vehicle Category Filter State
  const [selectedCategory, setSelectedCategory] = useState(null);

  const termOptions = [12, 24, 36, 48, 60, 72];

  const categories = [
    { name: 'Cars', icon: Car },
    { name: 'SUVs', icon: Car },
    { name: 'Trucks', icon: Truck },
    { name: 'Vans', icon: Bus },
    { name: 'Bikes', icon: Bike },
    { name: 'Threewheelers', icon: Bike },
    { name: 'Lorries', icon: Truck },
    { name: 'Busses', icon: Bus }
  ];

  const priceRanges = [
    'Under $20K',
    'Under $30K', 
    'Under $40K',
    'Under $50K',
    'Under $60K',
    'Under $70K'
  ];

  // Calculator Functions
  const handleInputChange = (field, value) => {
    const numValue = parseFloat(value) || 0;
    setFormData(prev => ({ ...prev, [field]: numValue }));
    calculatePayment({ ...formData, [field]: numValue });
  };

  const calculatePayment = (data) => {
    const { totalMSRP, downPayment, tradeInValue, residualPercentage, interestRate, leaseTerm } = data;
    
    const residualValue = totalMSRP * (residualPercentage / 100);
    const depreciationAmount = totalMSRP - residualValue;
    const netCapCost = totalMSRP - downPayment - tradeInValue;
    
    const monthlyDepreciation = depreciationAmount / leaseTerm;
    const monthlyFinanceCharge = (netCapCost + residualValue) * (interestRate / 100) / 12;
    
    const basePayment = monthlyDepreciation + monthlyFinanceCharge;
    setCalculatedPayment(Math.round(basePayment));
  };

  const handleTermSelect = (term) => {
    setFormData(prev => ({ ...prev, leaseTerm: term }));
    calculatePayment({ ...formData, leaseTerm: term });
  };

  // Category Filter Functions
  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
  };

  const handlePriceClick = (priceRange) => {
    console.log(`Navigating to vehicles ${priceRange} in ${selectedCategory}`);
    // In a real app, you would use Next.js router navigation here
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Hero Section - Fixed and Improved */}
      <section className={styles.heroSection}>
        <div className={styles.heroImageContainer}>
          <Image
            src="/lease hero.jpg"
            alt="Vehicle Leasing Hero"
            fill
            priority
            className={styles.heroImage}
          />
          <div className={styles.heroOverlay}></div>
        </div>
        
        <div className={styles.heroContent}>
          <div className={styles.heroTextWrapper}>
            <h1 className={styles.heroTitle}>Vehicle Leasing Calculator</h1>
            <p className={styles.heroSubtitle}>Find the best lease deal for your dream car</p>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <div className={styles.container}>
        {/* Vehicle Leasing Calculator Section */}
        <section className={styles.calculatorSection}>
          <div className={styles.calculatorGrid}>
            {/* Left Column - Calculator Form */}
            <div className={styles.calculatorCard}>
              <div className={styles.calculatorHeader}>
                <h2 className={styles.calculatorTitle}>
                  <Calculator className={styles.calculatorIcon} />
                  Lease Payment Calculator
                </h2>
                <p className={styles.calculatorDescription}>
                  Calculate your Estimated Monthly Lease Payment
                </p>
              </div>
              <div className={styles.calculatorContent}>
                {/* Total MSRP */}
                <div className={styles.inputGroup}>
                  <label htmlFor="msrp" className={styles.inputLabel}>Total MSRP</label>
                  <input
                    id="msrp"
                    type="number"
                    value={formData.totalMSRP}
                    onChange={(e) => handleInputChange('totalMSRP', e.target.value)}
                    className={styles.input}
                  />
                </div>

                {/* Down Payment */}
                <div className={styles.inputGroup}>
                  <label htmlFor="down" className={styles.inputLabel}>Down Payment</label>
                  <input
                    id="down"
                    type="number"
                    value={formData.downPayment}
                    onChange={(e) => handleInputChange('downPayment', e.target.value)}
                    className={styles.input}
                  />
                </div>

                {/* Trade-in Value */}
                <div className={styles.inputGroup}>
                  <label htmlFor="trade" className={styles.inputLabel}>Trade-in Value</label>
                  <input
                    id="trade"
                    type="number"
                    value={formData.tradeInValue}
                    onChange={(e) => handleInputChange('tradeInValue', e.target.value)}
                    className={styles.input}
                  />
                </div>

                {/* Residual Percentage */}
                <div className={styles.inputGroup}>
                  <label htmlFor="residual" className={styles.inputLabel}>Residual Percentage (%)</label>
                  <input
                    id="residual"
                    type="number"
                    min="30"
                    max="80"
                    value={formData.residualPercentage}
                    onChange={(e) => handleInputChange('residualPercentage', e.target.value)}
                    className={styles.input}
                  />
                </div>

                {/* Interest Rate */}
                <div className={styles.inputGroup}>
                  <label htmlFor="rate" className={styles.inputLabel}>Interest Rate (%)</label>
                  <input
                    id="rate"
                    type="number"
                    step="0.1"
                    value={formData.interestRate}
                    onChange={(e) => handleInputChange('interestRate', e.target.value)}
                    className={styles.input}
                  />
                </div>

                {/* Sales Tax */}
                <div className={styles.inputGroup}>
                  <label htmlFor="tax" className={styles.inputLabel}>Sales Tax (%)</label>
                  <input
                    id="tax"
                    type="number"
                    step="0.1"
                    value={formData.salesTax}
                    onChange={(e) => handleInputChange('salesTax', e.target.value)}
                    className={styles.input}
                  />
                </div>

                {/* Term Selection */}
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Term</label>
                  <div className={styles.termGrid}>
                    {termOptions.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleTermSelect(term)}
                        className={`${styles.termButton} ${
                          formData.leaseTerm === term ? styles.termButtonSelected : styles.termButtonUnselected
                        }`}
                      >
                        {term} months
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Summary */}
            <div className={styles.summaryCard}>
              <div className={styles.summaryHeader}>
                <h3 className={styles.summaryTitle}>Estimated Monthly Payment*</h3>
                <div className={styles.summaryAmount}>
                  ${calculatedPayment.toLocaleString()}
                  <span className={styles.summaryTerm}>for 3 years</span>
                </div>
              </div>
              <div className={styles.summaryContent}>
                {/* Lease Summary */}
                <div className={styles.summarySection}>
                  <h4 className={styles.sectionTitle}>Lease Summary</h4>
                  <div className={styles.summaryDetails}>
                    <div className={styles.summaryRow}>
                      <span className={styles.summaryLabel}>Total MSRP:</span>
                      <span className={styles.summaryValue}>${formData.totalMSRP.toLocaleString()}</span>
                    </div>
                    <div className={styles.summaryRow}>
                      <span className={styles.summaryLabel}>Down payment:</span>
                      <span className={styles.summaryValue}>${formData.downPayment.toLocaleString()}</span>
                    </div>
                    <div className={styles.summaryRow}>
                      <span className={styles.summaryLabel}>Trade-in value:</span>
                      <span className={styles.summaryValue}>${formData.tradeInValue.toLocaleString()}</span>
                    </div>
                    <div className={styles.summaryRow}>
                      <span className={styles.summaryLabel}>Residual value:</span>
                      <span className={styles.summaryValue}>{formData.residualPercentage}%</span>
                    </div>
                    <div className={styles.summaryRowTotal}>
                      <span className={styles.summaryLabel}>Total Amount:</span>
                      <span className={styles.summaryValue}>${(calculatedPayment * formData.leaseTerm).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Monthly Payment Breakdown */}
                <div className={styles.summarySection}>
                  <h4 className={styles.sectionTitle}>Monthly Payment</h4>
                  <div className={styles.summaryDetails}>
                    <div className={styles.summaryRow}>
                      <span className={styles.summaryLabel}>Base payment:</span>
                      <span className={styles.summaryValue}>${calculatedPayment}</span>
                    </div>
                    <div className={styles.summaryRow}>
                      <span className={styles.summaryLabel}>Estimated Monthly fees:</span>
                      <span className={styles.summaryValue}>$50</span>
                    </div>
                    <div className={styles.summaryRow}>
                      <span className={styles.summaryLabel}>Estimated Monthly Taxes:</span>
                      <span className={styles.summaryValue}>${Math.round(calculatedPayment * formData.salesTax / 100)}</span>
                    </div>
                    <div className={styles.summaryRowTotal}>
                      <span className={styles.summaryLabel}>Total monthly payment:</span>
                      <span className={styles.summaryValue}>${calculatedPayment + 50 + Math.round(calculatedPayment * formData.salesTax / 100)}</span>
                    </div>
                  </div>
                </div>

                {/* Due at Signing */}
                <div className={styles.dueAtSigning}>
                  <h4 className={styles.sectionTitle}>Due at Signing</h4>
                  <div className={styles.dueAmount}>
                    ${(formData.downPayment + calculatedPayment + 500).toLocaleString()}
                  </div>
                </div>

                <button className={styles.ctaButton}>
                  See Vehicles in Your Budget
                </button>

                <p className={styles.disclaimer}>
                  This information provided is for illustrative purposes only, and is not an offer to lend.
                  You must qualify for credit from a dealer/lender. Other fees and finance charges may apply.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Vehicle Category Filter Section */}
        <section className={styles.categorySection}>
          <div className={styles.categoryHeader}>
            <h2 className={styles.categoryTitle}>
              {selectedCategory ? `${selectedCategory} - Choose Price Range` : 'Best Ranked Vehicles by Price'}
            </h2>
            {selectedCategory && (
              <button 
                onClick={handleBackToCategories}
                className={styles.backButton}
              >
                ← Back to Categories
              </button>
            )}
          </div>

          {!selectedCategory ? (
            // Vehicle Categories Grid
            <div className={styles.categoriesGrid}>
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.name}
                    onClick={() => handleCategoryClick(category.name)}
                    className={styles.categoryButton}
                  >
                    <IconComponent className={styles.categoryIcon} />
                    <span className={styles.categoryName}>{category.name}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            // Price Range Pills
            <div className={styles.priceRanges}>
              {priceRanges.map((range) => (
                <button
                  key={range}
                  onClick={() => handlePriceClick(range)}
                  className={styles.priceButton}
                >
                  {range}
                </button>
              ))}
            </div>
          )}

          {/* Lorem Ipsum Explanation */}
          <div className={styles.explanationCard}>
            <h3 className={styles.explanationTitle}>How Our Vehicle Pricing Works</h3>
            <p className={styles.explanationText}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure 
              dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
            <p className={styles.explanationText}>
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut 
              perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa 
              quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            </p>
            <p className={styles.explanationText}>
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui 
              ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LeaseLoanPage;