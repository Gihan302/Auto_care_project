'use client';

import React, { useState } from 'react';
import styles from './quiz.module.css';

const WEBHOOK_URL = process.env.NEXT_PUBLIC_WEBHOOK_URL;

export default function VehicleQuiz() {
  const [currentStep, setCurrentStep] = useState('vehicleSelection');
  const [vehicleType, setVehicleType] = useState('');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [error, setError] = useState(null);

  const vehicleTypes = [
    { id: 'Cars', name: 'Cars' },
    { id: 'Vans', name: 'Vans' },
    { id: 'SUVs', name: 'SUVs' },
    { id: 'Trucks', name: 'Trucks' },
    { id: 'Bikes', name: 'Bikes' },
    { id: 'Threewheelers', name: 'Three Wheelers' },
    { id: 'Lorries', name: 'Lorries' },
    { id: 'Buses', name: 'Buses' }
  ];

  const questionSets = {
    Cars: [
      {
        key: 'priority',
        question: "What's your top priority?",
        options: [
          { id: 'Fuel efficiency', text: 'Fuel efficiency' },
          { id: 'Stylish design', text: 'Stylish design' },
          { id: 'Performance & speed', text: 'Performance & speed' },
          { id: 'Affordability', text: 'Affordability' }
        ]
      },
      {
        key: 'passengers',
        question: "How many passengers do you usually travel with?",
        options: [
          { id: '1-2 passengers', text: '1–2 passengers' },
          { id: '3-4 passengers', text: '3–4 passengers' },
          { id: '5+ passengers', text: '5+ passengers' }
        ]
      },
      {
        key: 'drivingEnvironment',
        question: "What's your driving environment?",
        options: [
          { id: 'Mostly city', text: 'Mostly city' },
          { id: 'Highway/long distance', text: 'Highway/long distance' },
          { id: 'Mixed', text: 'Mixed' }
        ]
      },
      {
        key: 'budgetRange',
        question: "What's your budget range?",
        options: [
          { id: 'Low (< $15,000)', text: 'Low (< $15,000)' },
          { id: 'Medium ($15,000–$30,000)', text: 'Medium ($15,000–$30,000)' },
          { id: 'Premium ($30,000+)', text: 'Premium ($30,000+)' }
        ]
      },
      {
        key: 'transmission',
        question: "Do you prefer manual or automatic?",
        options: [
          { id: 'Manual', text: 'Manual' },
          { id: 'Automatic', text: 'Automatic' }
        ]
      }
    ],
    Vans: [
      {
        key: 'purpose',
        question: "What's the main purpose?",
        options: [
          { id: 'Family trips', text: 'Family trips' },
          { id: 'Cargo transport', text: 'Cargo transport' },
          { id: 'Business shuttle', text: 'Business shuttle' }
        ]
      },
      {
        key: 'seats',
        question: "How many seats do you need?",
        options: [
          { id: '5-7 seats', text: '5–7 seats' },
          { id: '8-12 seats', text: '8–12 seats' },
          { id: '12+ seats', text: '12+ seats' }
        ]
      },
      {
        key: 'luxuryFeatures',
        question: "Do you need luxury interior features?",
        options: [
          { id: 'Yes', text: 'Yes' },
          { id: 'No', text: 'No' }
        ]
      },
      {
        key: 'drivingEnvironment',
        question: "What's your driving environment?",
        options: [
          { id: 'City', text: 'City' },
          { id: 'Highway', text: 'Highway' },
          { id: 'Mixed', text: 'Mixed' }
        ]
      },
      {
        key: 'budgetRange',
        question: "What's your budget range?",
        options: [
          { id: 'Low (< $15,000)', text: 'Low (< $15,000)' },
          { id: 'Medium ($15,000–$30,000)', text: 'Medium ($15,000–$30,000)' },
          { id: 'Premium ($30,000+)', text: 'Premium ($30,000+)' }
        ]
      }
    ],
    SUVs: [
      {
        key: 'priority',
        question: "What's most important?",
        options: [
          { id: 'Off-road capability', text: 'Off-road capability' },
          { id: 'Family space', text: 'Family space' },
          { id: 'Comfort & luxury', text: 'Comfort & luxury' },
          { id: 'Fuel economy', text: 'Fuel economy' }
        ]
      },
      {
        key: 'seats',
        question: "How many seats do you need?",
        options: [
          { id: '5 seats', text: '5 seats' },
          { id: '7 seats', text: '7 seats' },
          { id: 'More than 7', text: 'More than 7' }
        ]
      },
      {
        key: 'size',
        question: "What size do you prefer?",
        options: [
          { id: 'Compact', text: 'Compact' },
          { id: 'Mid-size', text: 'Mid-size' },
          { id: 'Full-size', text: 'Full-size' }
        ]
      },
      {
        key: 'budgetRange',
        question: "What's your budget range?",
        options: [
          { id: 'Low (< $15,000)', text: 'Low (< $15,000)' },
          { id: 'Medium ($15,000–$30,000)', text: 'Medium ($15,000–$30,000)' },
          { id: 'Premium ($30,000+)', text: 'Premium ($30,000+)' }
        ]
      },
      {
        key: 'advancedFeatures',
        question: "Do you need advanced features (navigation, cameras, smart tech)?",
        options: [
          { id: 'Yes', text: 'Yes' },
          { id: 'No', text: 'No' }
        ]
      }
    ],
    Trucks: [
      {
        key: 'usage',
        question: "What's the main usage?",
        options: [
          { id: 'Work transport', text: 'Work transport' },
          { id: 'Heavy duty', text: 'Heavy duty' },
          { id: 'Personal use', text: 'Personal use' }
        ]
      },
      {
        key: 'payloadCapacity',
        question: "What payload capacity do you need?",
        options: [
          { id: 'Light', text: 'Light' },
          { id: 'Medium', text: 'Medium' },
          { id: 'Heavy', text: 'Heavy' }
        ]
      },
      {
        key: 'drivePreference',
        question: "Drive preference?",
        options: [
          { id: '2WD', text: '2WD' },
          { id: '4WD', text: '4WD' }
        ]
      },
      {
        key: 'budgetRange',
        question: "What's your budget range?",
        options: [
          { id: 'Low (< $15,000)', text: 'Low (< $15,000)' },
          { id: 'Medium ($15,000–$30,000)', text: 'Medium ($15,000–$30,000)' },
          { id: 'Premium ($30,000+)', text: 'Premium ($30,000+)' }
        ]
      },
      {
        key: 'transmission',
        question: "Transmission preference?",
        options: [
          { id: 'Manual', text: 'Manual' },
          { id: 'Automatic', text: 'Automatic' }
        ]
      }
    ],
    Bikes: [
      {
        key: 'purpose',
        question: "What's the main purpose?",
        options: [
          { id: 'Daily commute', text: 'Daily commute' },
          { id: 'Long rides', text: 'Long rides' },
          { id: 'Sports', text: 'Sports' },
          { id: 'Adventure', text: 'Adventure' }
        ]
      },
      {
        key: 'engineSize',
        question: "Engine size preference?",
        options: [
          { id: '100-150cc', text: '100–150cc' },
          { id: '150-300cc', text: '150–300cc' },
          { id: '300+cc', text: '300+cc' }
        ]
      },
      {
        key: 'budgetRange',
        question: "What's your budget range?",
        options: [
          { id: 'Low (< $3,000)', text: 'Low (< $3,000)' },
          { id: 'Medium ($3,000–$8,000)', text: 'Medium ($3,000–$8,000)' },
          { id: 'Premium ($8,000+)', text: 'Premium ($8,000+)' }
        ]
      },
      {
        key: 'priorityPreference',
        question: "Priority preference?",
        options: [
          { id: 'Comfort', text: 'Comfort' },
          { id: 'Performance', text: 'Performance' }
        ]
      },
      {
        key: 'brandPreference',
        question: "Any brand preference?",
        options: [
          { id: 'Honda', text: 'Honda' },
          { id: 'Yamaha', text: 'Yamaha' },
          { id: 'Kawasaki', text: 'Kawasaki' },
          { id: 'No preference', text: 'No preference' }
        ]
      }
    ],
    Threewheelers: [
      {
        key: 'useCase',
        question: "What's the use case?",
        options: [
          { id: 'Passenger transport', text: 'Passenger transport' },
          { id: 'Goods transport', text: 'Goods transport' }
        ]
      },
      {
        key: 'dailyDistance',
        question: "Daily distance covered?",
        options: [
          { id: 'Short (< 50km)', text: 'Short (< 50km)' },
          { id: 'Medium (50-150km)', text: 'Medium (50-150km)' },
          { id: 'Long (150km+)', text: 'Long (150km+)' }
        ]
      },
      {
        key: 'fuelPreference',
        question: "Fuel preference?",
        options: [
          { id: 'Petrol', text: 'Petrol' },
          { id: 'Electric', text: 'Electric' },
          { id: 'CNG', text: 'CNG' }
        ]
      },
      {
        key: 'budgetRange',
        question: "What's your budget range?",
        options: [
          { id: 'Low (< $5,000)', text: 'Low (< $5,000)' },
          { id: 'Medium ($5,000–$12,000)', text: 'Medium ($5,000–$12,000)' },
          { id: 'Premium ($12,000+)', text: 'Premium ($12,000+)' }
        ]
      },
      {
        key: 'preference',
        question: "Seating/cargo preference?",
        options: [
          { id: 'More seating', text: 'More seating' },
          { id: 'More cargo space', text: 'More cargo space' }
        ]
      }
    ],
    Lorries: [
      {
        key: 'usage',
        question: "What's the main usage?",
        options: [
          { id: 'Construction', text: 'Construction' },
          { id: 'Cargo', text: 'Cargo' },
          { id: 'Delivery', text: 'Delivery' }
        ]
      },
      {
        key: 'capacity',
        question: "What capacity do you need?",
        options: [
          { id: 'Light', text: 'Light' },
          { id: 'Medium', text: 'Medium' },
          { id: 'Heavy', text: 'Heavy' }
        ]
      },
      {
        key: 'distancePreference',
        question: "Distance preference?",
        options: [
          { id: 'Short city routes', text: 'Short city routes' },
          { id: 'Long haul', text: 'Long haul' }
        ]
      },
      {
        key: 'fuelType',
        question: "Fuel type preference?",
        options: [
          { id: 'Diesel', text: 'Diesel' },
          { id: 'Electric', text: 'Electric' },
          { id: 'Hybrid', text: 'Hybrid' }
        ]
      },
      {
        key: 'budgetRange',
        question: "What's your budget range?",
        options: [
          { id: 'Low (< $25,000)', text: 'Low (< $25,000)' },
          { id: 'Medium ($25,000–$60,000)', text: 'Medium ($25,000–$60,000)' },
          { id: 'Premium ($60,000+)', text: 'Premium ($60,000+)' }
        ]
      }
    ],
    Buses: [
      {
        key: 'purpose',
        question: "What's the main purpose?",
        options: [
          { id: 'Passenger transport', text: 'Passenger transport' },
          { id: 'School transport', text: 'School transport' },
          { id: 'Tourist transport', text: 'Tourist transport' }
        ]
      },
      {
        key: 'seatingCapacity',
        question: "What seating capacity do you need?",
        options: [
          { id: '20 seats', text: '20 seats' },
          { id: '30 seats', text: '30 seats' },
          { id: '50+ seats', text: '50+ seats' }
        ]
      },
      {
        key: 'comfortFeatures',
        question: "Do you need comfort features (AC, recliner seats, Wi-Fi)?",
        options: [
          { id: 'Yes', text: 'Yes' },
          { id: 'No', text: 'No' }
        ]
      },
      {
        key: 'budgetRange',
        question: "What's your budget range?",
        options: [
          { id: 'Low (< $40,000)', text: 'Low (< $40,000)' },
          { id: 'Medium ($40,000–$100,000)', text: 'Medium ($40,000–$100,000)' },
          { id: 'Premium ($100,000+)', text: 'Premium ($100,000+)' }
        ]
      },
      {
        key: 'primaryFocus',
        question: "Primary focus?",
        options: [
          { id: 'City routes', text: 'City routes' },
          { id: 'Long-distance travel', text: 'Long-distance travel' }
        ]
      }
    ]
  };

  const selectVehicleType = (type) => {
    setVehicleType(type);
    setQuestions(questionSets[type] || []);
    setCurrentStep('questions');
    setQuestionIndex(0);
    setAnswers({ vehicleType: type });
    setError(null);
  };

  const handleAnswer = (answerId) => {
    const currentQuestion = questions[questionIndex];
    const newAnswers = { ...answers, [currentQuestion.key]: answerId };
    setAnswers(newAnswers);
    
    if (questionIndex + 1 < questions.length) {
      setQuestionIndex(questionIndex + 1);
    } else {
      submitQuiz(newAnswers);
    }
  };

  const submitQuiz = async (finalAnswers) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('📤 Sending quiz data to n8n:', finalAnswers);
      
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalAnswers)
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        throw new Error(`Server error (${response.status}): Unable to get recommendations`);
      }

      const responseText = await response.text();
      console.log('📥 Raw response length:', responseText.length);

      if (!responseText || responseText.trim() === '') {
        throw new Error('Server returned empty response');
      }

      let data;
      try {
        data = JSON.parse(responseText);
        console.log('✅ Parsed response data:', data);
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError);
        throw new Error('Server returned invalid JSON');
      }

      let recommendationsData;

      if (Array.isArray(data) && data.length > 0) {
        const firstItem = data[0];
        
        if (firstItem.success && firstItem.data) {
          recommendationsData = firstItem.data;
        } else if (firstItem.recommendations && firstItem.summary) {
          recommendationsData = firstItem;
        } else {
          throw new Error('Invalid response structure in array');
        }
      } else if (data.success && data.data) {
        recommendationsData = data.data;
      } else if (data.recommendations && data.summary) {
        recommendationsData = data;
      } else {
        console.error('Unexpected response format:', data);
        throw new Error('Invalid response format from server');
      }

      if (!recommendationsData.recommendations || !Array.isArray(recommendationsData.recommendations)) {
        throw new Error('No recommendations found in response');
      }

      if (!recommendationsData.summary) {
        throw new Error('No summary found in response');
      }

      console.log('✅ Successfully extracted recommendations:', recommendationsData.recommendations.length, 'vehicles');
      
      setRecommendations(recommendationsData);
      setCurrentStep('recommendation');

    } catch (err) {
      console.error('❌ Error submitting quiz:', err);
      
      let errorMessage = 'Failed to get recommendations. ';
      
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        errorMessage += `Cannot connect to server. Please ensure the service is running.`;
      } else if (err.message.includes('empty response')) {
        errorMessage += 'Server returned empty response.';
      } else if (err.message.includes('JSON')) {
        errorMessage += 'Server returned invalid data format.';
      } else {
        errorMessage += err.message;
      }
      
      setError(errorMessage);
      setCurrentStep('error');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (questionIndex > 0) {
      setQuestionIndex(questionIndex - 1);
    } else {
      setCurrentStep('vehicleSelection');
      setAnswers({});
    }
  };

  const restart = () => {
    setCurrentStep('vehicleSelection');
    setVehicleType('');
    setQuestionIndex(0);
    setAnswers({});
    setQuestions([]);
    setRecommendations(null);
    setError(null);
  };

  const exploreVehicles = (vehicleName) => {
    // Navigate to vehicles page with search/filter
    const searchQuery = encodeURIComponent(vehicleName);
    window.location.href = `/carAdd?search=${searchQuery}`;
  };

  // Loading state
  if (loading) {
    return (
      <div className={styles.quizApp}>
        <div className={styles.quizContainer}>
          <div className={styles.loadingState}>
            <div className={styles.logoSpinner}>
              <svg viewBox="0 0 100 100" className={styles.logo}>
                <circle cx="50" cy="50" r="40" stroke="#ECDFCC" strokeWidth="8" fill="none" />
                <path d="M50 10 L50 30 M90 50 L70 50 M50 90 L50 70 M10 50 L30 50" stroke="#ECDFCC" strokeWidth="6" strokeLinecap="round" />
              </svg>
            </div>
            <h2>Thinking...</h2>
            <p>Our AI is analyzing your preferences</p>
            <div className={styles.loadingDetails}>
              <p>Analyzing {vehicleType} preferences</p>
              <p>Comparing vehicle models</p>
              <p>Calculating match scores</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (currentStep === 'error') {
    return (
      <div className={styles.quizApp}>
        <div className={styles.quizContainer}>
          <div className={styles.errorState}>
            <h2>⚠️ Oops! Something went wrong</h2>
            <p className={styles.errorMessage}>{error}</p>
            <div className={styles.errorActions}>
              <button className={styles.restartBtn} onClick={restart}>
                Start Over
              </button>
              <button className={styles.retryBtn} onClick={() => submitQuiz(answers)}>
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vehicle selection
  if (currentStep === 'vehicleSelection') {
    return (
      <div className={styles.quizApp}>
        <div className={styles.quizContainer}>
          <div className={styles.quizHeader}>
            <h2>Find Your Perfect Vehicle</h2>
            <p>Let's start by selecting your preferred vehicle type</p>
          </div>
          <div className={styles.vehicleGrid}>
            {vehicleTypes.map(type => (
              <div
                key={type.id}
                className={styles.vehicleCard}
                onClick={() => selectVehicleType(type.id)}
              >
                <div className={styles.vehicleName}>{type.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Questions
  if (currentStep === 'questions') {
    const currentQuestion = questions[questionIndex];
    const progress = ((questionIndex + 1) / questions.length) * 100;

    return (
      <div className={styles.quizApp}>
        <div className={styles.quizContainer}>
          <div className={styles.quizHeader}>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
            </div>
            <h3>Question {questionIndex + 1} of {questions.length}</h3>
            <h2>{currentQuestion.question}</h2>
          </div>
          <div className={styles.optionsGrid}>
            {currentQuestion.options.map(option => (
              <button
                key={option.id}
                className={styles.optionBtn}
                onClick={() => handleAnswer(option.id)}
              >
                {option.text}
              </button>
            ))}
          </div>
          <button className={styles.backBtn} onClick={goBack}>
            ← Back
          </button>
        </div>
      </div>
    );
  }

  // Recommendations
  if (currentStep === 'recommendation' && recommendations) {
    const { recommendations: vehicleList, summary } = recommendations;

    return (
      <div className={styles.quizApp}>
        <div className={styles.quizContainer}>
          <div className={styles.recommendationHeader}>
            <h2>Your Perfect Vehicle Matches</h2>
            <div className={styles.summaryStats}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Top Match</span>
                <span className={styles.statValue}>{summary.topMatch}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Average Price</span>
                <span className={styles.statValue}>{summary.averagePrice}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Total Options</span>
                <span className={styles.statValue}>{summary.totalRecommendations}</span>
              </div>
            </div>
          </div>

          <div className={styles.recommendationsList}>
            {vehicleList.map((vehicle) => (
              <div key={vehicle.id} className={styles.recommendationCard}>
                <div className={styles.cardHeader}>
                  <span className={styles.rankBadge}>#{vehicle.rank}</span>
                  <h3>{vehicle.vehicleModel}</h3>
                  <span className={styles.matchScore}>{vehicle.matchScore}% Match</span>
                </div>
                
                <div className={styles.priceTag}>{vehicle.estimatedPrice}</div>
                
                <div className={styles.featuresSection}>
                  <h4>Key Features</h4>
                  <ul>
                    {vehicle.keyFeatures.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                </div>

                <div className={styles.reasoningSection}>
                  <h4>Why This Vehicle</h4>
                  <p>{vehicle.matchReasoning}</p>
                </div>

                {vehicle.fuelEfficiency !== 'N/A' && (
                  <div className={styles.specsRow}>
                    <div className={styles.specItem}>
                      <span className={styles.specLabel}>Fuel Efficiency</span>
                      <span className={styles.specValue}>{vehicle.fuelEfficiency}</span>
                    </div>
                  </div>
                )}

                <button 
                  className={styles.exploreBtn}
                  onClick={() => exploreVehicles(vehicle.vehicleModel)}
                >
                  Explore Similar Vehicles
                </button>
              </div>
            ))}
          </div>

          <div className={styles.summarySection}>
            <h3>Overall Recommendation</h3>
            <p>{summary.overallReasoning}</p>
            
            <div className={styles.tipsSection}>
              <h4>Additional Tips</h4>
              <p>{summary.additionalTips}</p>
            </div>
          </div>

          <div className={styles.actionButtons}>
            <button className={styles.restartBtn} onClick={restart}>
              Take Quiz Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}