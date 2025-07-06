'use client';

import React, { useState, useEffect } from 'react';
import './whyAutoCare.css';

export const WhyAutoCare = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.querySelector('.why-auto-care');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  const features = [
    {
      id: 1,
      icon: '🔧',
      title: 'Boost Your Car\'s Resale Value!',
      description: 'Regular maintenance and care significantly increase your vehicle\'s market value, ensuring you get the best return on your investment when it\'s time to sell.',
      color: '#ff6b6b'
    },
    {
      id: 2,
      icon: '💰',
      title: 'Love or Leave with Confidence!',
      description: 'Whether you choose to keep your car longer or sell it, our comprehensive care ensures you make the decision with complete confidence in your vehicle\'s condition.',
      color: '#4ecdc4'
    },
    {
      id: 3,
      icon: '⭐',
      title: 'Drive Now, Worry Later!',
      description: 'Enjoy peace of mind knowing your vehicle is in optimal condition. Our expert care means fewer unexpected breakdowns and more reliable daily drives.',
      color: '#45b7d1'
    }
  ];

  return (
    <div className={`why-auto-care ${isVisible ? 'visible' : ''}`}>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">WHY Auto Care ?</h2>
          <div className="title-underline"></div>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className="feature-card"
              style={{
                animationDelay: `${index * 0.2}s`
              }}
            >
              <div className="card-inner">
                <div className="feature-icon" style={{ color: feature.color }}>
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                <div className="feature-overlay" style={{ background: feature.color }}></div>
              </div>
            </div>
          ))}
        </div>

        <div className="cta-section">
          <button className="learn-more-btn">
            <span>Learn More About Our Services</span>
            <div className="btn-arrow">→</div>
          </button>
        </div>
      </div>
    </div>
  );
};
