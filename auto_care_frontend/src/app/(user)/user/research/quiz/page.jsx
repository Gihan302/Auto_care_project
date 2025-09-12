'use client';

import React, { useState } from 'react';
import './quiz.module.css';

export default function QuizPage() {
  const [currentStep, setCurrentStep] = useState('vehicleSelection');
  const [vehicleType, setVehicleType] = useState('');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [questions, setQuestions] = useState([]);

  const vehicleTypes = [
    { id: 'cars', name: 'Cars', icon: '🚗' },
    { id: 'vans', name: 'Vans', icon: '🚐' },
    { id: 'suvs', name: 'SUVs', icon: '🚙' },
    { id: 'trucks', name: 'Trucks', icon: '🚛' },
    { id: 'bikes', name: 'Bikes', icon: '🏍️' },
    { id: 'threewheelers', name: 'Threewheelers', icon: '🛺' },
    { id: 'lorries', name: 'Lorries', icon: '🚚' },
    { id: 'buses', name: 'Buses', icon: '🚌' }
  ];

  const questionSets = {
    cars: [
      {
        question: "What's your top priority?",
        options: [
          { id: 'fuel_efficiency', text: 'Fuel efficiency' },
          { id: 'stylish_design', text: 'Stylish design' },
          { id: 'performance_speed', text: 'Performance & speed' },
          { id: 'affordability', text: 'Affordability' }
        ]
      },
      {
        question: "How many passengers do you usually travel with?",
        options: [
          { id: '1_2', text: '1–2 passengers' },
          { id: '3_4', text: '3–4 passengers' },
          { id: '5_plus', text: '5+ passengers' }
        ]
      },
      {
        question: "What's your driving environment?",
        options: [
          { id: 'city', text: 'Mostly city' },
          { id: 'highway', text: 'Highway/long distance' },
          { id: 'mixed', text: 'Mixed' }
        ]
      },
      {
        question: "What's your budget range?",
        options: [
          { id: 'low', text: 'Low (< $15,000)' },
          { id: 'medium', text: 'Medium ($15,000–$30,000)' },
          { id: 'premium', text: 'Premium ($30,000+)' }
        ]
      },
      {
        question: "Do you prefer manual or automatic?",
        options: [
          { id: 'manual', text: 'Manual' },
          { id: 'automatic', text: 'Automatic' }
        ]
      }
    ],
    vans: [
      {
        question: "What's the main purpose?",
        options: [
          { id: 'family_trips', text: 'Family trips' },
          { id: 'cargo_transport', text: 'Cargo transport' },
          { id: 'business_shuttle', text: 'Business shuttle' }
        ]
      },
      {
        question: "How many seats do you need?",
        options: [
          { id: '5_7', text: '5–7 seats' },
          { id: '8_12', text: '8–12 seats' },
          { id: '12_plus', text: '12+ seats' }
        ]
      },
      {
        question: "Do you need luxury interior features?",
        options: [
          { id: 'yes', text: 'Yes' },
          { id: 'no', text: 'No' }
        ]
      },
      {
        question: "What's your driving environment?",
        options: [
          { id: 'city', text: 'City' },
          { id: 'highway', text: 'Highway' },
          { id: 'mixed', text: 'Mixed' }
        ]
      },
      {
        question: "What's your budget range?",
        options: [
          { id: 'low', text: 'Low (< $15,000)' },
          { id: 'medium', text: 'Medium ($15,000–$30,000)' },
          { id: 'premium', text: 'Premium ($30,000+)' }
        ]
      }
    ],
    suvs: [
      {
        question: "What's most important?",
        options: [
          { id: 'offroad', text: 'Off-road capability' },
          { id: 'family_space', text: 'Family space' },
          { id: 'comfort_luxury', text: 'Comfort & luxury' },
          { id: 'fuel_economy', text: 'Fuel economy' }
        ]
      },
      {
        question: "How many seats do you need?",
        options: [
          { id: '5', text: '5 seats' },
          { id: '7', text: '7 seats' },
          { id: 'more', text: 'More than 7' }
        ]
      },
      {
        question: "What size do you prefer?",
        options: [
          { id: 'compact', text: 'Compact' },
          { id: 'midsize', text: 'Mid-size' },
          { id: 'fullsize', text: 'Full-size' }
        ]
      },
      {
        question: "What's your budget range?",
        options: [
          { id: 'low', text: 'Low (< $15,000)' },
          { id: 'medium', text: 'Medium ($15,000–$30,000)' },
          { id: 'premium', text: 'Premium ($30,000+)' }
        ]
      },
      {
        question: "Do you need advanced features (navigation, cameras, smart tech)?",
        options: [
          { id: 'yes', text: 'Yes' },
          { id: 'no', text: 'No' }
        ]
      }
    ],
    trucks: [
      {
        question: "What's the main usage?",
        options: [
          { id: 'work_transport', text: 'Work transport' },
          { id: 'heavy_duty', text: 'Heavy duty' },
          { id: 'personal_use', text: 'Personal use' }
        ]
      },
      {
        question: "What payload capacity do you need?",
        options: [
          { id: 'light', text: 'Light' },
          { id: 'medium', text: 'Medium' },
          { id: 'heavy', text: 'Heavy' }
        ]
      },
      {
        question: "Drive preference?",
        options: [
          { id: '2wd', text: '2WD' },
          { id: '4wd', text: '4WD' }
        ]
      },
      {
        question: "What's your budget range?",
        options: [
          { id: 'low', text: 'Low (< $15,000)' },
          { id: 'medium', text: 'Medium ($15,000–$30,000)' },
          { id: 'premium', text: 'Premium ($30,000+)' }
        ]
      },
      {
        question: "Transmission preference?",
        options: [
          { id: 'manual', text: 'Manual' },
          { id: 'automatic', text: 'Automatic' }
        ]
      }
    ],
    bikes: [
      {
        question: "What's the main purpose?",
        options: [
          { id: 'daily_commute', text: 'Daily commute' },
          { id: 'long_rides', text: 'Long rides' },
          { id: 'sports', text: 'Sports' },
          { id: 'adventure', text: 'Adventure' }
        ]
      },
      {
        question: "Engine size preference?",
        options: [
          { id: '100_150cc', text: '100–150cc' },
          { id: '150_300cc', text: '150–300cc' },
          { id: '300cc_plus', text: '300+cc' }
        ]
      },
      {
        question: "What's your budget range?",
        options: [
          { id: 'low', text: 'Low (< $3,000)' },
          { id: 'medium', text: 'Medium ($3,000–$8,000)' },
          { id: 'premium', text: 'Premium ($8,000+)' }
        ]
      },
      {
        question: "Priority preference?",
        options: [
          { id: 'comfort', text: 'Comfort' },
          { id: 'performance', text: 'Performance' }
        ]
      },
      {
        question: "Any brand preference?",
        options: [
          { id: 'honda', text: 'Honda' },
          { id: 'yamaha', text: 'Yamaha' },
          { id: 'kawasaki', text: 'Kawasaki' },
          { id: 'no_preference', text: 'No preference' }
        ]
      }
    ],
    threewheelers: [
      {
        question: "What's the use case?",
        options: [
          { id: 'passenger_transport', text: 'Passenger transport' },
          { id: 'goods_transport', text: 'Goods transport' }
        ]
      },
      {
        question: "Daily distance covered?",
        options: [
          { id: 'short', text: 'Short (< 50km)' },
          { id: 'medium', text: 'Medium (50-150km)' },
          { id: 'long', text: 'Long (150km+)' }
        ]
      },
      {
        question: "Fuel preference?",
        options: [
          { id: 'petrol', text: 'Petrol' },
          { id: 'electric', text: 'Electric' },
          { id: 'cng', text: 'CNG' }
        ]
      },
      {
        question: "What's your budget range?",
        options: [
          { id: 'low', text: 'Low (< $5,000)' },
          { id: 'medium', text: 'Medium ($5,000–$12,000)' },
          { id: 'premium', text: 'Premium ($12,000+)' }
        ]
      },
      {
        question: "Seating/cargo preference?",
        options: [
          { id: 'more_seating', text: 'More seating' },
          { id: 'more_cargo', text: 'More cargo space' }
        ]
      }
    ],
    lorries: [
      {
        question: "What's the main usage?",
        options: [
          { id: 'construction', text: 'Construction' },
          { id: 'cargo', text: 'Cargo' },
          { id: 'delivery', text: 'Delivery' }
        ]
      },
      {
        question: "What capacity do you need?",
        options: [
          { id: 'light', text: 'Light' },
          { id: 'medium', text: 'Medium' },
          { id: 'heavy', text: 'Heavy' }
        ]
      },
      {
        question: "Distance preference?",
        options: [
          { id: 'short_city', text: 'Short city routes' },
          { id: 'long_haul', text: 'Long haul' }
        ]
      },
      {
        question: "Fuel type preference?",
        options: [
          { id: 'diesel', text: 'Diesel' },
          { id: 'electric', text: 'Electric' },
          { id: 'hybrid', text: 'Hybrid' }
        ]
      },
      {
        question: "What's your budget range?",
        options: [
          { id: 'low', text: 'Low (< $25,000)' },
          { id: 'medium', text: 'Medium ($25,000–$60,000)' },
          { id: 'premium', text: 'Premium ($60,000+)' }
        ]
      }
    ],
    buses: [
      {
        question: "What's the main purpose?",
        options: [
          { id: 'passenger_transport', text: 'Passenger transport' },
          { id: 'school', text: 'School transport' },
          { id: 'tourist', text: 'Tourist transport' }
        ]
      },
      {
        question: "What seating capacity do you need?",
        options: [
          { id: '20', text: '20 seats' },
          { id: '30', text: '30 seats' },
          { id: '50_plus', text: '50+ seats' }
        ]
      },
      {
        question: "Do you need comfort features (AC, recliner seats, Wi-Fi)?",
        options: [
          { id: 'yes', text: 'Yes' },
          { id: 'no', text: 'No' }
        ]
      },
      {
        question: "What's your budget range?",
        options: [
          { id: 'low', text: 'Low (< $40,000)' },
          { id: 'medium', text: 'Medium ($40,000–$100,000)' },
          { id: 'premium', text: 'Premium ($100,000+)' }
        ]
      },
      {
        question: "Primary focus?",
        options: [
          { id: 'city', text: 'City routes' },
          { id: 'long_distance', text: 'Long-distance travel' }
        ]
      }
    ]
  };

  const recommendations = {
    cars: {
      fuel_efficiency: { models: ['Toyota Prius', 'Honda Insight'], reasoning: 'excellent fuel economy and eco-friendly features' },
      stylish_design: { models: ['BMW 3 Series', 'Audi A4'], reasoning: 'sleek design and premium aesthetics' },
      performance_speed: { models: ['Ford Mustang', 'Chevrolet Camaro'], reasoning: 'powerful engines and sporty performance' },
      affordability: { models: ['Honda Civic', 'Toyota Corolla'], reasoning: 'great value, reliability, and low maintenance costs' }
    },
    suvs: {
      offroad: { models: ['Jeep Wrangler', 'Toyota 4Runner'], reasoning: 'exceptional off-road capabilities and rugged build' },
      family_space: { models: ['Honda Pilot', 'Toyota Highlander'], reasoning: 'spacious interior and family-friendly features' },
      comfort_luxury: { models: ['BMW X5', 'Mercedes GLE'], reasoning: 'premium comfort and luxury amenities' },
      fuel_economy: { models: ['Toyota RAV4 Hybrid', 'Honda CR-V'], reasoning: 'efficient fuel consumption with SUV versatility' }
    },
    trucks: {
      work_transport: { models: ['Ford F-150', 'Chevrolet Silverado'], reasoning: 'reliable work capabilities and payload capacity' },
      heavy_duty: { models: ['Ford F-350', 'Ram 3500'], reasoning: 'maximum towing capacity and heavy-duty performance' },
      personal_use: { models: ['Honda Ridgeline', 'Toyota Tacoma'], reasoning: 'comfortable daily driving with truck utility' }
    },
    vans: {
      family_trips: { models: ['Honda Odyssey', 'Toyota Sienna'], reasoning: 'family comfort and entertainment features' },
      cargo_transport: { models: ['Ford Transit', 'Mercedes Sprinter'], reasoning: 'maximum cargo space and commercial reliability' },
      business_shuttle: { models: ['Chevrolet Express', 'Nissan NV200'], reasoning: 'passenger comfort and business-grade durability' }
    },
    bikes: {
      daily_commute: { models: ['Honda CB125F', 'Yamaha YBR125'], reasoning: 'fuel efficient and perfect for city commuting' },
      long_rides: { models: ['Honda NC750X', 'BMW F750GS'], reasoning: 'comfort for long distances and touring capabilities' },
      sports: { models: ['Yamaha R3', 'Kawasaki Ninja 300'], reasoning: 'sporty performance and track-ready features' },
      adventure: { models: ['BMW GS310', 'KTM 390 Adventure'], reasoning: 'versatile for both on-road and off-road adventures' }
    }
  };

  const selectVehicleType = (type) => {
    setVehicleType(type);
    setQuestions(questionSets[type] || []);
    setCurrentStep('questions');
    setQuestionIndex(0);
  };

  const handleAnswer = (answerId) => {
    const newAnswers = { ...answers, [`q${questionIndex}`]: answerId };
    setAnswers(newAnswers);
    
    if (questionIndex + 1 < questions.length) {
      setQuestionIndex(questionIndex + 1);
    } else {
      setCurrentStep('recommendation');
    }
  };

  const goBack = () => {
    if (questionIndex > 0) {
      setQuestionIndex(questionIndex - 1);
    } else {
      setCurrentStep('vehicleSelection');
    }
  };

  const restart = () => {
    setCurrentStep('vehicleSelection');
    setVehicleType('');
    setQuestionIndex(0);
    setAnswers({});
    setQuestions([]);
  };

  const getRecommendation = () => {
    const primaryPref = answers.q0;
    const vehicleRecs = recommendations[vehicleType];
    
    if (vehicleRecs && vehicleRecs[primaryPref]) {
      return vehicleRecs[primaryPref];
    }

    return {
      models: ['Various suitable options available'],
      reasoning: 'based on your preferences and requirements'
    };
  };

  if (currentStep === 'vehicleSelection') {
    return (
      <div className="quiz-container">
        <div className="quiz-header">
          <h2>🎯 Find Your Perfect Vehicle</h2>
          <p>Let's start by selecting your preferred vehicle type</p>
        </div>
        <div className="vehicle-grid">
          {vehicleTypes.map(type => (
            <div
              key={type.id}
              className="vehicle-card"
              onClick={() => selectVehicleType(type.id)}
            >
              <div className="vehicle-icon">{type.icon}</div>
              <div className="vehicle-name">{type.name}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (currentStep === 'questions') {
    const currentQuestion = questions[questionIndex];
    const progress = ((questionIndex + 1) / questions.length) * 100;

    return (
      <div className="quiz-container">
        <div className="quiz-header">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <h3>Question {questionIndex + 1} of {questions.length}</h3>
          <h2>{currentQuestion.question}</h2>
        </div>
        <div className="options-grid">
          {currentQuestion.options.map(option => (
            <button
              key={option.id}
              className="option-btn"
              onClick={() => handleAnswer(option.id)}
            >
              {option.text}
            </button>
          ))}
        </div>
        {questionIndex > 0 && (
          <button className="back-btn" onClick={goBack}>
            ← Back
          </button>
        )}
      </div>
    );
  }

  if (currentStep === 'recommendation') {
    const recommendation = getRecommendation();
    const vehicleTypeDisplay = vehicleType.charAt(0).toUpperCase() + vehicleType.slice(1);

    return (
      <div className="quiz-container">
        <div className="recommendation-header">
          <h2>🎉 Your Perfect Vehicle Match!</h2>
          <div className="recommendation-card">
            <h3>{vehicleTypeDisplay}</h3>
            <div className="recommended-models">
              {recommendation.models.map((model, index) => (
                <span key={index} className="model-tag">{model}</span>
              ))}
            </div>
            <p className="reasoning">
              We recommend this because it offers {recommendation.reasoning}.
            </p>
          </div>
        </div>
        <div className="action-buttons">
          <button className="restart-btn" onClick={restart}>
            Take Quiz Again
          </button>
          <button 
            className="contact-btn" 
            onClick={() => alert("Feature coming soon! We'll connect you with local dealers.")}
          >
            Contact Dealer
          </button>
        </div>
      </div>
    );
  }

  return null;
}