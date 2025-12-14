'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './whyAutoCare.css';

export const WhyAutoCare = () => {
  const router = useRouter();

  useEffect(() => {
    const section = document.querySelector('.why-auto-care');
    if (section) {
      section.classList.add('visible');
    }
  }, []);

  // Click handlers for each button
  const handleSellConfidently = () => {
    router.push('/user/carListing');
  };

  const handleCheckLoanRates = () => {
    router.push('/user/carListing');
  };

  const handleListYourCar = () => {
    router.push('/user/carListing');
  };

  return (
    <section className="why-auto-care">
      <div className="container">
        <div className="section-header">
          <h2 className="sectionTitle">WHY Auto Care ?</h2>
        </div>
        
        <div className="features-grid">
          {/* Boost Your Car's Resale Value */}
          <div className="feature-card"> {/* Fixed class name */}
            <div className="card-inner"> {/* Added required wrapper */}
              <div className="feature-icon"> {/* Fixed class name */}
                <img src="/icons/deal.png" alt="Car with keys" />
                <img src="/icons/steering-wheel.svg" alt="Car with keys" />
              </div>
              <h3 className="feature-title">Boost Your Car's Resale Value!</h3>
              <p className="feature-description">
                A well-maintained car sells faster and at a better price. 
                Use Auto Care to showcase service history and attract serious buyers.
              </p>
              <button 
                className="feature-button"
                onClick={handleSellConfidently}
              >
                <span>Sell Confidently</span>
              </button>
            </div>
          </div>

          {/* Loan or Lease with Confidence */}
          <div className="feature-card">
            <div className="card-inner">
              <div className="feature-icon">
                <img src="/icons/rent-a-car.png" alt="Handshake" />
              </div>
              <h3 className="feature-title">Loan or Lease with Confidence!</h3>
              <p className="feature-description">
                Leasing companies prefer vehicles with verified maintenance records. 
                Auto Care connects you to lenders who trust a cared-for car.
              </p>
              <button 
                className="feature-button"
                onClick={handleCheckLoanRates}
              >
                <span>Check Loan Rates</span>
              </button>
            </div>
          </div>

          {/* Drive Now, Worry Less */}
          <div className="feature-card">
            <div className="card-inner">
              <div className="feature-icon">
                <img src="/icons/test-drive.png" alt="Steering wheel" />
              </div>
              <h3 className="feature-title">Drive Now, Worry Less!</h3>
              <p className="feature-description">
                Advertise your car as "Auto Care Certified" to stand out in listings. 
                Buyers trust vehicles with documented care—yours could be next.
              </p>
              <button 
                className="feature-button"
                onClick={handleListYourCar}
              >
                <span>List Your Car</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};