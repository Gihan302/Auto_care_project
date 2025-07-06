// pages/buying-power.jsx or app/buying-power/page.jsx
"use client"; // Remove this line if using pages directory

import { useState } from "react";
import './buyingPowerCal.css';

export default function BuyingPowerCal() {
  const [loanAmount, setLoanAmount] = useState(7200000);
  const [loanType, setLoanType] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const calculateLoan = () => {
    if (!monthlyIncome || !loanTerm || !interestRate) {
      alert("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    const income = parseFloat(monthlyIncome);
    const term = parseInt(loanTerm);
    const rate = parseFloat(interestRate);

    // Calculate monthly payment using loan formula
    const monthlyRate = rate / 100 / 12;
    const numPayments = term * 12;
    
    let monthlyPayment = 0;
    if (monthlyRate > 0) {
      monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
                      (Math.pow(1 + monthlyRate, numPayments) - 1);
    } else {
      monthlyPayment = loanAmount / numPayments;
    }
    
    // Calculate maximum loan amount based on 40% of monthly income
    const maxAffordablePayment = income * 0.4;
    let maxLoanAmount = 0;
    
    if (monthlyRate > 0) {
      maxLoanAmount = (maxAffordablePayment * (Math.pow(1 + monthlyRate, numPayments) - 1)) /
                     (monthlyRate * Math.pow(1 + monthlyRate, numPayments));
    } else {
      maxLoanAmount = maxAffordablePayment * numPayments;
    }
    
    const totalPayment = monthlyPayment * numPayments;
    const totalInterest = totalPayment - loanAmount;
    const affordabilityRatio = (monthlyPayment / income) * 100;
    
    const calculation = {
      maxLoanAmount: Math.round(maxLoanAmount),
      monthlyPayment: Math.round(monthlyPayment),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
      affordabilityRatio: Math.round(affordabilityRatio * 100) / 100
    };

    setResults(calculation);
    setIsLoading(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace('LKR', 'RS.');
  };

  return (
    <div className="calculatorContainer">
      <div className="contentWrapper">
        <h1 className="mainTitle">
          KNOW YOUR BUYING POWER?
        </h1>
        
        <div className="calculatorCard">
          <div className="calculatorGrid">
            {/* Car Image */}
            <div className="imageSection">
              <img 
                src="https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Luxury Car"
                className="carImage"
              />
            </div>
            
            {/* Calculator Form */}
            <div className="formSection">
              <div className="loanAmountDisplay">
                <h2 className="loanAmountValue">
                  {results ? formatCurrency(results.maxLoanAmount) : formatCurrency(loanAmount)}
                </h2>
                <p className="loanAmountLabel">
                  {results ? "Maximum Affordable Loan" : "Selected Loan Amount"}
                </p>
              </div>
              
              <div className="calculatorForm">
                <div className="formRow">
                  <div className="formGroup">
                    <label htmlFor="loanType" className="label">
                      LOAN TYPE
                    </label>
                    <select
                      id="loanType"
                      value={loanType}
                      onChange={(e) => setLoanType(e.target.value)}
                      className="select"
                    >
                      <option value="">Select type</option>
                      <option value="personal">Personal Loan</option>
                      <option value="auto">Auto Loan</option>
                      <option value="lease">Lease</option>
                    </select>
                  </div>
                  
                  <div className="formGroup">
                    <label htmlFor="monthlyIncome" className="label">
                      INCOME /MONTH
                    </label>
                    <input
                      type="number"
                      id="monthlyIncome"
                      value={monthlyIncome}
                      onChange={(e) => setMonthlyIncome(e.target.value)}
                      placeholder="Monthly income"
                      className="input"
                    />
                  </div>
                </div>
                
                <div className="formRow">
                  <div className="formGroup">
                    <label htmlFor="loanTerm" className="label">
                      LOAN TERM
                    </label>
                    <select
                      id="loanTerm"
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(e.target.value)}
                      className="select"
                    >
                      <option value="">Years</option>
                      <option value="3">3 Years</option>
                      <option value="5">5 Years</option>
                      <option value="7">7 Years</option>
                    </select>
                  </div>
                  
                  <div className="formGroup">
                    <label htmlFor="interestRate" className="label">
                      INTEREST RATE
                    </label>
                    <input
                      type="number"
                      id="interestRate"
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value)}
                      placeholder="Rate %"
                      step="0.01"
                      className="input"
                    />
                  </div>
                </div>
                
                <div className="sliderGroup">
                  <label htmlFor="loanAmount" className="label">
                    LOAN AMOUNT
                  </label>
                  <input
                    type="range"
                    id="loanAmount"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(parseInt(e.target.value))}
                    min="100000"
                    max="10000000"
                    step="100000"
                    className="slider"
                  />
                  <div className="sliderLabels">
                    <span>Rs. 100,000</span>
                    <span>Rs. 10,000,000</span>
                  </div>
                </div>
                
                <button 
                  onClick={calculateLoan}
                  disabled={isLoading}
                  className="calculateBtn"
                >
                  {isLoading ? "Calculating..." : "Calculate Now"}
                </button>
              </div>
              
              {/* Results Section */}
              {results && (
                <div className="resultsSection">
                  <h3 className="resultsTitle">Calculation Results</h3>
                  <div className="resultGrid">
                    <div className="resultItem">
                      <span className="resultLabel">Monthly Payment:</span>
                      <span className="resultValue">
                        {formatCurrency(results.monthlyPayment)}
                      </span>
                    </div>
                    <div className="resultItem">
                      <span className="resultLabel">Total Interest:</span>
                      <span className="resultValue">
                        {formatCurrency(results.totalInterest)}
                      </span>
                    </div>
                    <div className="resultItem">
                      <span className="resultLabel">Total Payment:</span>
                      <span className="resultValue">
                        {formatCurrency(results.totalPayment)}
                      </span>
                    </div>
                    <div className="resultItem">
                      <span className="resultLabel">Affordability Ratio:</span>
                      <span className="resultValue">
                        {results.affordabilityRatio}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
