<<<<<<< Updated upstream:auto_care_frontend/src/app/user/components/homepage/featuredTools.jsx
"use client";

import React from 'react';
import './featuredTools.css';

const FeaturedTools = () => {
  return (
    <div className="featured-tools-container">
      <h2 className="featured-tools-title">Featured tools</h2>
      
      <div className="tools-grid">
        <div className="tool-card">
          <h3 className="tool-title">Find Your Fit</h3>
          <p className="tool-description">Not Sure What You Want? We will help you</p>
          <button className="tool-button">Start Quiz</button>
          <div className="tool-image">
            <img src="/car 1.jpg" alt="Luxury cars" />
          </div>
        </div>

        <div className="tool-card">
          <h3 className="tool-title">Shop Your Budget</h3>
          <p className="tool-description">Find Your Perfect Ride Within Your Budget</p>
          <button className="tool-button">See Your Budget Power</button>
          <div className="tool-image">
            <img src="/car 3.jpg" alt="Budget cars collection" />
          </div>
        </div>

        <div className="tool-card">
          <h3 className="tool-title">Arrange A Finance</h3>
          <p className="tool-description">Not Sure What You Want? We will help you</p>
          <button className="tool-button">View Leasing Plans</button>
          <div className="tool-image">
            <img src="/finance.jpg" alt="Finance consultation" />
          </div>
        </div>

        <div className="tool-card">
          <h3 className="tool-title">Sell Your Car</h3>
          <p className="tool-description">Unlock competitive offers</p>
          <button className="tool-button">Sell Your Car</button>
          <div className="tool-image">
            <img src="/sell car.jpg" alt="Car selling consultation" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedTools;
=======
"use client";

import React from 'react';
import './featuredTools.css';
import Link from 'next/link';

const FeaturedTools = () => {
  return (
    <div className="featured-tools-container">
      <h2 className="featured-tools-title">Featured tools</h2>
      
      <div className="tools-grid">
        <div className="tool-card">
          <h3 className="tool-title">Find Your Fit</h3>
          <p className="tool-description">Not Sure What You Want? We will help you</p>
          <button className="tool-button">Start Quiz</button>
          <div className="tool-image">
            <img src="/car 1.jpg" alt="Luxury cars" />
          </div>
        </div>

        <div className="tool-card">
          <h3 className="tool-title">Shop Your Budget</h3>
          <p className="tool-description">Find Your Perfect Ride Within Your Budget</p>
          <button className="tool-button">See Your Budget Power</button>
          <div className="tool-image">
            <img src="/car 3.jpg" alt="Budget cars collection" />
          </div>
        </div>

        <div className="tool-card">
          <h3 className="tool-title">Arrange A Finance</h3>
          <p className="tool-description">Not Sure What You Want? We will help you</p>
         <Link href="/user/LeasingPlans" className="tool-button">View Leasing Plans</Link>
          <div className="tool-image">
            <img src="/finance.jpg" alt="Finance consultation" />
          </div>
        </div>

        <div className="tool-card">
          <h3 className="tool-title">Sell Your Car</h3>
          <p className="tool-description">Unlock competitive offers</p>
          <button className="tool-button">Sell Your Car</button>
          <div className="tool-image">
            <img src="/sell car.jpg" alt="Car selling consultation" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedTools;


>>>>>>> Stashed changes:auto_care_frontend/src/app/(user)/user/components/homepage/featuredTools.jsx
