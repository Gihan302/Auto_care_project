'use client'

import { useState } from 'react'
import styles from './buyingPowerCal.module.css'

export default function BuyingPowerCalculator() {
  const [formData, setFormData] = useState({
    monthlyIncome: '',
    downPayment: '',
    loanPeriod: '30',
    maxPercentage: '28',
    existingObligations: ''
  })

  const [result, setResult] = useState(null)
  const [showResult, setShowResult] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const calculateBuyingPower = () => {
    const income = parseFloat(formData.monthlyIncome) || 0
    const downPayment = parseFloat(formData.downPayment) || 0
    const loanYears = parseInt(formData.loanPeriod) || 30
    const maxPercentage = parseFloat(formData.maxPercentage) || 28
    const existingObligations = parseFloat(formData.existingObligations) || 0

    // Calculate maximum monthly payment (28% rule minus existing obligations)
    const maxMonthlyPayment = (income * maxPercentage / 100) - existingObligations

    // Assumed interest rate (you can make this configurable)
    const annualRate = 0.065 // 6.5%
    const monthlyRate = annualRate / 12
    const totalPayments = loanYears * 12

    // Calculate maximum loan amount using mortgage formula
    const loanAmount = maxMonthlyPayment * (1 - Math.pow(1 + monthlyRate, -totalPayments)) / monthlyRate

    // Total buying power = loan amount + down payment
    const totalBuyingPower = loanAmount + downPayment

    setResult({
      maxMonthlyPayment: maxMonthlyPayment.toFixed(2),
      loanAmount: loanAmount.toFixed(2),
      totalBuyingPower: totalBuyingPower.toFixed(2),
      downPayment: downPayment.toFixed(2)
    })

    setShowResult(true)
  }

  return (
    <div className={styles.container}>
      <div className={styles.backgroundOverlay}></div>
      
      <div className={styles.calculatorCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>Buying Power Calculator</h1>
        </div>

        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>What's Your Current Situation?</h2>
          
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              1. What is your average monthly income?
            </label>
            <input
              type="number"
              name="monthlyIncome"
              value={formData.monthlyIncome}
              onChange={handleInputChange}
              placeholder="$5,000"
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>
              2. What is your planned down payment amount?
            </label>
            <input
              type="number"
              name="downPayment"
              value={formData.downPayment}
              onChange={handleInputChange}
              placeholder="$50,000"
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>
              3. What is your expected loan repayment period?
            </label>
            <select
              name="loanPeriod"
              value={formData.loanPeriod}
              onChange={handleInputChange}
              className={styles.select}
            >
              <option value="15">15 years</option>
              <option value="20">20 years</option>
              <option value="25">25 years</option>
              <option value="30">30 years</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>
              4. What is the maximum percentage of your income you're willing to spend on monthly payments?
            </label>
            <select
              name="maxPercentage"
              value={formData.maxPercentage}
              onChange={handleInputChange}
              className={styles.select}
            >
              <option value="25">25%</option>
              <option value="28">28%</option>
              <option value="30">30%</option>
              <option value="35">35%</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>
              5. Do you have any existing monthly loan or lease obligations?
            </label>
            <input
              type="number"
              name="existingObligations"
              value={formData.existingObligations}
              onChange={handleInputChange}
              placeholder="$500"
              className={styles.input}
            />
          </div>

          <button
            onClick={calculateBuyingPower}
            className={styles.calculateButton}
          >
            Calculate your Buying Power
          </button>
        </div>

        {showResult && result && (
          <div className={styles.resultSection}>
            <h3 className={styles.resultTitle}>Your Buying Power Results</h3>
            <div className={styles.resultGrid}>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Maximum Monthly Payment:</span>
                <span className={styles.resultValue}>${result.maxMonthlyPayment}</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Maximum Loan Amount:</span>
                <span className={styles.resultValue}>${result.loanAmount}</span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Down Payment:</span>
                <span className={styles.resultValue}>${result.downPayment}</span>
              </div>
              <div className={`${styles.resultItem} ${styles.totalBuyingPower}`}>
                <span className={styles.resultLabel}>Total Buying Power:</span>
                <span className={styles.resultValue}>${result.totalBuyingPower}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}