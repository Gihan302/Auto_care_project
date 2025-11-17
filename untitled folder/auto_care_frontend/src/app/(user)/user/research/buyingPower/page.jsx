'use client';

import React, { useState } from 'react';
import styles from './buyingPowerCal.module.css';

const BuyingPowerCalculator = () => {
  const [formData, setFormData] = useState({
    monthlyIncome: '',
    downPayment: '',
    loanPeriod: '',
    incomePercentage: '',
    existingObligations: ''
  });

  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateBuyingPower = () => {
    const monthlyIncome = parseFloat(formData.monthlyIncome) || 0;
    const downPayment = parseFloat(formData.downPayment) || 0;
    const loanPeriodYears = parseFloat(formData.loanPeriod) || 0;
    const incomePercentage = parseFloat(formData.incomePercentage) || 0;
    const existingObligations = parseFloat(formData.existingObligations) || 0;

    // Calculate available income for vehicle payments
    const availableIncome = (monthlyIncome * (incomePercentage / 100)) - existingObligations;
    
    // Assume an interest rate of 7% for calculation
    const monthlyInterestRate = 0.07 / 12;
    const loanPeriodMonths = loanPeriodYears * 12;

    // Calculate maximum loan amount using PMT formula
    const maxLoanAmount = availableIncome * ((1 - Math.pow(1 + monthlyInterestRate, -loanPeriodMonths)) / monthlyInterestRate);
    
    // Maximum vehicle price is loan amount plus down payment
    const maxVehiclePrice = maxLoanAmount + downPayment;

    const calculatedResult = {
      maxLoanAmount: Math.round(maxLoanAmount),
      maxVehiclePrice: Math.round(maxVehiclePrice),
      monthlyPayment: Math.round(availableIncome),
      availableIncome: Math.round(availableIncome)
    };

    setResult(calculatedResult);
    setShowResult(true);
  };

  const resetCalculator = () => {
    setFormData({
      monthlyIncome: '',
      downPayment: '',
      loanPeriod: '',
      incomePercentage: '',
      existingObligations: ''
    });
    setResult(null);
    setShowResult(false);
  };

  return (
    <div className={styles.container}>
      {/* Background with overlay */}
      <div className={styles.backgroundSlider}>
        <div className={styles.backgroundImage}></div>
        <div className={styles.backgroundImage}></div>
        <div className={styles.backgroundImage}></div>
        <div className={styles.backgroundImage}></div>
        <div className={styles.overlay}></div>
      </div>


      {/* Content */}
      <div className={styles.content}>
        <div className={styles.gridContainer}>
          
          {/* Left side - Title */}
          <div className={styles.titleSection}>
            <h1 className={styles.mainTitle}>
              Buying Power
            </h1>
            <h2 className={styles.subTitle}>
              Calculator
            </h2>
            <p className={styles.description}>
              Discover your vehicle purchasing power with our comprehensive financial assessment tool.
            </p>
          </div>

          {/* Right side - Calculator Form */}
          <div className={styles.calculatorSection}>
            <div className={styles.card}>
              <div className={styles.cardContent}>
                {!showResult ? (
                  <>
                    <div className={styles.formHeader}>
                      <h3 className={styles.formTitle}>
                        What's Your Current Situation?
                      </h3>
                    </div>

                    <div className={styles.formFields}>
                      {/* Monthly Income */}
                      <div className={`${styles.inputGroup} ${styles.fadeInUp1}`}>
                        <label className={styles.label}>
                          1. What is your average monthly income?
                        </label>
                        <div className={styles.inputWrapper}>
                          <span className={styles.inputIcon}>$</span>
                          <input
                            type="number"
                            placeholder="8,500"
                            value={formData.monthlyIncome}
                            onChange={(e) => handleInputChange('monthlyIncome', e.target.value)}
                            className={styles.input}
                          />
                        </div>
                      </div>

                      {/* Down Payment */}
                      <div className={`${styles.inputGroup} ${styles.fadeInUp2}`}>
                        <label className={styles.label}>
                          2. What is your planned down payment amount?
                        </label>
                        <div className={styles.inputWrapper}>
                          <span className={styles.inputIcon}>$</span>
                          <input
                            type="number"
                            placeholder="15,000"
                            value={formData.downPayment}
                            onChange={(e) => handleInputChange('downPayment', e.target.value)}
                            className={styles.input}
                          />
                        </div>
                      </div>

                      {/* Loan Period */}
                      <div className={`${styles.inputGroup} ${styles.fadeInUp3}`}>
                        <label className={styles.label}>
                          3. What is your expected loan repayment period?
                        </label>
                        <div className={styles.inputWrapper}>
                          <span className={styles.inputIcon}>📅</span>
                          <input
                            type="number"
                            placeholder="5 years"
                            value={formData.loanPeriod}
                            onChange={(e) => handleInputChange('loanPeriod', e.target.value)}
                            className={styles.input}
                          />
                        </div>
                      </div>

                      {/* Income Percentage */}
                      <div className={`${styles.inputGroup} ${styles.fadeInUp4}`}>
                        <label className={styles.label}>
                          4. What is the maximum percentage of your income you're willing to spend on monthly payments?
                        </label>
                        <div className={styles.inputWrapper}>
                          <span className={styles.inputIcon}>%</span>
                          <input
                            type="number"
                            placeholder="30%"
                            value={formData.incomePercentage}
                            onChange={(e) => handleInputChange('incomePercentage', e.target.value)}
                            className={styles.input}
                          />
                        </div>
                      </div>

                      {/* Existing Obligations */}
                      <div className={`${styles.inputGroup} ${styles.fadeInUp5}`}>
                        <label className={styles.label}>
                          5. Do you have any existing monthly loan or lease obligations?
                        </label>
                        <div className={styles.inputWrapper}>
                          <span className={styles.inputIcon}>💳</span>
                          <input
                            type="number"
                            placeholder="1,200"
                            value={formData.existingObligations}
                            onChange={(e) => handleInputChange('existingObligations', e.target.value)}
                            className={styles.input}
                          />
                        </div>
                      </div>

                      {/* Calculate Button */}
                      <div className={`${styles.buttonContainer} ${styles.fadeInUp6}`}>
                        <button
                          onClick={calculateBuyingPower}
                          className={styles.calculateButton}
                        >
                          🧮 Calculate Your Buying Power
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  /* Results Display */
                  <div className={styles.resultsContainer}>
                    <h3 className={styles.resultsTitle}>
                      Your Buying Power Results
                    </h3>
                    
                    {result && (
                      <div className={styles.resultsGrid}>
                        <div className={styles.resultCard}>
                          <p className={styles.resultLabel}>Maximum Vehicle Price</p>
                          <p className={styles.resultValue}>
                            ${result.maxVehiclePrice.toLocaleString()}
                          </p>
                        </div>
                        <div className={styles.resultCard}>
                          <p className={styles.resultLabel}>Maximum Loan Amount</p>
                          <p className={styles.resultValue}>
                            ${result.maxLoanAmount.toLocaleString()}
                          </p>
                        </div>
                        <div className={styles.resultCard}>
                          <p className={styles.resultLabel}>Monthly Payment Capacity</p>
                          <p className={styles.resultValue}>
                            ${result.monthlyPayment.toLocaleString()}
                          </p>
                        </div>
                        <div className={styles.resultCard}>
                          <p className={styles.resultLabel}>Available Income</p>
                          <p className={styles.resultValue}>
                            ${result.availableIncome.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    <button
                      onClick={resetCalculator}
                      className={styles.resetButton}
                    >
                      Calculate Again
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyingPowerCalculator;