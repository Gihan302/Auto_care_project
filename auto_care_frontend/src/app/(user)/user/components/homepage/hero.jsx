'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import './hero.css';

export const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [textAnimationComplete, setTextAnimationComplete] = useState(false);

  const backgroundImages = ['/main.jpg', '/hero2.jpg','/hero3.jpg','/hero4.jpg' ,'/hero5.jpg']; // Replace with local image paths if needed

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    const textTimer = setTimeout(() => setTextAnimationComplete(true), 2000);
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearTimeout(textTimer);
      clearInterval(slideInterval);
    };
  }, [backgroundImages.length]);

  return (
    <div className="hero-container">
      {/* Background Images */}
      <div className="hero-background">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`hero-background-image ${index === currentSlide ? 'active' : 'inactive'}`}
            style={{ backgroundImage: `url('${image}')` }}
          />
        ))}
      </div>

      {/* Overlays */}
      <div className="hero-gradient-overlay" />
      <div className="hero-moving-gradient" />

      {/* Hero Content */}
      <div className="hero-content">
        <div className="hero-content-wrapper">
          <h1 className="hero-title">
            <span className={`hero-title-line ${isLoaded ? 'loaded' : 'loading'}`}>Your Dream Vehicle</span>
            <br />
            <span className={`hero-title-line hero-title-highlight ${isLoaded ? 'loaded' : 'loading'}`}>
              Awaits!
            </span>
          </h1>

          <p className={`hero-subtitle ${isLoaded ? 'loaded' : 'loading'}`}>
            Discover the perfect car for your lifestyle
          </p>

          <div className={`hero-cta ${isLoaded ? 'loaded' : 'loading'}`}>
            <button className="hero-btn hero-btn-primary hero-btn-lg hero-cta-btn">
              Browse Listings Today
            </button>
          </div>

          {/* Floating Decorations */}
          <div className={`hero-float-element hero-float-1 ${textAnimationComplete ? 'visible' : 'hidden'}`} />
          <div className={`hero-float-element hero-float-2 ${textAnimationComplete ? 'visible' : 'hidden'}`} />
          <div className={`hero-float-element hero-float-3 ${textAnimationComplete ? 'visible' : 'hidden'}`} />
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className={`hero-scroll-indicator ${textAnimationComplete ? 'visible' : 'hidden'}`}>
        <div className="hero-scroll-content">
          <span className="hero-scroll-text">Scroll Down</span>
          <ChevronDown size={24} />
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="hero-slide-indicators">
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            className={`hero-slide-indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
