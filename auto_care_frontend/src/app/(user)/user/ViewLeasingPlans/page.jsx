'use client';
import React from 'react';
import styles from './VehicleLeasingPlans.module.scss';
import { useRouter } from 'next/navigation';

const VehicleLeasingPlans = () => {
  const router = useRouter();

  const handleLiveAgentClick = () => {
    router.push('/(user)/user/chatwithagent');
  };

  const plans = [
    {
      name: "Executive Plus",
      description: "Premium leasing experience with flexible maintenance and benefits",
      price: "Rs. 499",
      period: "/mo",
      termLength: "36 month terms",
      features: [
        "Full insurance coverage",
        "Maintenance included",
        "8,000 miles/year"
      ],
      isHighlighted: true
    },
    {
      name: "Standard Lease",
      description: "Balanced leasing option with essential coverage and competitive rates",
      price: "Rs. 349",
      period: "/mo",
      termLength: "36 month terms",
      features: [
        "Basic insurance coverage",
        "Oil changes included",
        "12,000 miles/year"
      ],
      isHighlighted: false
    },
    {
      name: "Economy Flex",
      description: "Budget-friendly leasing with flexible terms and affordable rates",
      price: "Rs. 249",
      period: "/mo",
      termLength: "24 month terms",
      features: [
        "Liability coverage",
        "Roadside assistance",
        "10,000 miles/year"
      ],
      isHighlighted: false
    }
  ];

  const businessPlan = {
    name: "Business Fleet",
    description: "Commercial leasing solution for businesses and fleet management",
    price: "Rs. 599",
    period: "/mo",
    termLength: "48 month terms",
    features: [
      "Commercial insurance",
      "Fleet management tools",
      "Unlimited miles"
    ]
  };

  return (
    <div className={styles.vehicleLeasingContainer}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.mainTitle}>Vehicle Leasing Plans</h1>
          <p className={styles.subtitle}>
            Choose from our premium leasing options offered by certified partners
          </p>
        </div>

        {/* Plans Grid */}
        <div className={styles.plansGrid}>
          {plans.map((plan, index) => (
            <div key={index} className={`${styles.planCard} ${plan.isHighlighted ? styles.highlighted : ''}`}>
              <div className={styles.planContent}>
                <h3 className={styles.planName}>{plan.name}</h3>
                <p className={styles.planDescription}>{plan.description}</p>

                <div className={styles.priceSection}>
                  <span className={styles.price}>{plan.price}</span>
                  <span className={styles.period}>{plan.period}</span>
                </div>

                <p className={styles.termLength}>{plan.termLength}</p>

                <ul className={styles.featuresList}>
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className={styles.featureItem}>
                      <span className={styles.checkmark}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.buttonSection}>
                <button className={styles.selectBtn}>
                  Select Plan
                </button>
                <button className={styles.downloadBtn}>
                  <span className={styles.downloadIcon}>↓</span>
                  Download Documents
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Business Fleet Plan */}
        <div className={styles.businessPlanSection}>
          <div className={styles.businessPlanCard}>
            <div className={styles.planContent}>
              <h3 className={styles.planName}>{businessPlan.name}</h3>
              <p className={styles.planDescription}>{businessPlan.description}</p>

              <div className={styles.priceSection}>
                <span className={styles.price}>{businessPlan.price}</span>
                <span className={styles.period}>{businessPlan.period}</span>
              </div>

              <p className={styles.termLength}>{businessPlan.termLength}</p>

              <ul className={styles.featuresList}>
                {businessPlan.features.map((feature, idx) => (
                  <li key={idx} className={styles.featureItem}>
                    <span className={styles.checkmark}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.buttonSection}>
              <button className={styles.selectBtn}>
                Select Plan
              </button>
              <button className={styles.downloadBtn}>
                <span className={styles.downloadIcon}>↓</span>
                Download Documents
              </button>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className={styles.helpSection}>
          <h2 className={styles.helpTitle}>Need Help Choosing?</h2>
          <p className={styles.helpDescription}>
            Our leasing specialists are here to help you find the perfect plan for your needs
          </p>
        </div>

        {/* Contact Options */}
        <div className={styles.contactGrid}>

          <div className={styles.contactCard}>
            <div className={styles.contactIcon}>✉️</div>
            <h3 className={styles.contactTitle}>Email Support</h3>
            <p className={styles.contactInfo}>leasing@yoursite.com</p>
          </div>

          <div className={styles.contactCard}>
            <div className={styles.contactIcon}>🕐</div>
            <h3 className={styles.contactTitle}>Business Hours</h3>
            <p className={styles.contactHours}>Mon-Fri 9AM-6PM</p>
          </div>

          <div className={styles.contactCard} onClick={handleLiveAgentClick}>
            <div className={styles.contactIcon}>💬</div>
            <h3 className={styles.contactTitle}>Live Agent</h3>
            <p className={styles.contactInfo}>Chat with our Agents</p>
          </div>


        </div>
      </div>
    </div>
  );
};

export default VehicleLeasingPlans;