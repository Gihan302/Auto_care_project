'use client';

import { useState } from 'react';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import api from '@/utils/axios';

export default function SellCarPage() {
  const [formData, setFormData] = useState({
    vehicleType: '',
    vehicleRegistration: '',
    location: ''
  });
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [agents, setAgents] = useState([]);
  const [showAgentModal, setShowAgentModal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    router.push('/user/sellCar/postAdd');
  };

  const router = useRouter();

  const handleFindAgent = async () => {
    try {
      const response = await api.get('/user/approved-agents');
      setAgents(response.data);
      setShowAgentModal(true);
    } catch (error) {
      console.error('Error fetching agents:', error);
      alert('Could not fetch agents. Please try again later.');
    }
  };

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const faqData = [
    {
      question: "What documents do I need to sell my car?",
      answer: "You'll need your vehicle registration certificate, valid insurance, and identity proof. We'll guide you through the complete documentation process."
    },
    {
      question: "Can I sell if I still have a loan?",
      answer: "Yes, we can help you sell even with an outstanding loan. We'll coordinate with your bank to handle the loan settlement process."
    },
    {
      question: "How is the vehicle price calculated?",
      answer: "Our pricing is based on current market trends, vehicle condition, mileage, and demand. We use advanced algorithms for accurate valuations."
    },
    {
      question: "Is my information secure?",
      answer: "Absolutely. We use bank-level encryption and follow strict privacy policies to protect your personal and vehicle information."
    },
    {
      question: "How long does the selling process take?",
      answer: "Most sales complete within 3-7 days. The timeline depends on your vehicle type, condition, and buyer availability in your area."
    }
  ];

  return (
    <div className={styles.pageContainer}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Sell Your Car Easily with Auto Care</h1>
            <p className={styles.heroSubtitle}>Get the best offer in just a few steps — quick, safe, and hassle-free.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className={styles.howItWorks}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>How It Works</h2>
          <p className={styles.sectionSubtitle}>Simple steps to sell your car</p>
          
          <div className={styles.stepsGrid}>
            <div className={styles.step}>
              <div className={styles.stepIcon}>📋</div>
              <h3 className={styles.stepTitle}>Get Your Estimate</h3>
              <p className={styles.stepDescription}>Enter your vehicle details to receive a market-based value instantly</p>
            </div>
            
            <div className={styles.step}>
              <div className={styles.stepIcon}>🤝</div>
              <h3 className={styles.stepTitle}>Connect with Buyers</h3>
              <p className={styles.stepDescription}>Reach verified buyers and dealers instantly through our platform</p>
            </div>
            
            <div className={styles.step}>
              <div className={styles.stepIcon}>💰</div>
              <h3 className={styles.stepTitle}>Get Paid Securely</h3>
              <p className={styles.stepDescription}>Complete the sale and receive payment through secure channels</p>
            </div>
          </div>
        </div>
      </section>

      {/* Find Your Agent Section */}
      <section className={styles.findAgentSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Find Your Agent</h2>
          <p className={styles.sectionSubtitle}>Our dedicated agents are here to help you every step of the way.</p>
          <div className={styles.agentContent}>
            <p className={styles.agentDescription}>Connect with a professional agent who can assist you with paperwork, pricing, and finding the best buyer for your car. Get personalized support and make your selling experience even smoother.</p>
            <button className={styles.findAgentButton} onClick={handleFindAgent}>Connect with an Agent</button>
          </div>
        </div>
      </section>

      {/* Agent List Modal */}
      {showAgentModal && <AgentListModal agents={agents} onClose={() => setShowAgentModal(false)} />}

      {/* Car Value Form Section */}
      <section className={styles.valueSection}>
        <div className={styles.container}>
          <h2 className={styles.formTitle}>Get Your Car's Value</h2>
          <p className={styles.formSubtitle}>Enter your details for an instant estimate</p>
          
          <form onSubmit={handleSubmit} className={styles.valueForm}>
            
            <button type="submit" className={styles.submitBtn}>
              Sell My Vehicle
            </button>
          </form>
        </div>
      </section>

      {/* Why Choose Auto Care Section */}
      <section className={styles.whyChoose}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Why Choose Auto Care</h2>
          <p className={styles.sectionSubtitle}>Experience the difference with our service</p>
          
          <div className={styles.featuresGrid}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>⚡</div>
              <h3 className={styles.featureTitle}>Fast Process</h3>
              <p className={styles.featureDescription}>Quick evaluation and instant offers</p>
            </div>
            
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🔒</div>
              <h3 className={styles.featureTitle}>Secure Payments</h3>
              <p className={styles.featureDescription}>Safe and guaranteed transactions</p>
            </div>
            
            <div className={styles.feature}>
              <div className={styles.featureIcon}>✅</div>
              <h3 className={styles.featureTitle}>Verified Buyers</h3>
              <p className={styles.featureDescription}>Connect with trusted dealers only</p>
            </div>
            
            <div className={styles.feature}>
              <div className={styles.featureIcon}>📊</div>
              <h3 className={styles.featureTitle}>Transparent Pricing</h3>
              <p className={styles.featureDescription}>Fair market value assessments</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faqSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          <p className={styles.sectionSubtitle}>Get answers to common questions</p>
          
          <div className={styles.faqContainer}>
            {faqData.map((faq, index) => (
              <div key={index} className={styles.faqItem}>
                <button 
                  className={styles.faqQuestion}
                  onClick={() => toggleFAQ(index)}
                >
                  <span className={styles.faqIcon}>
                    {index === 0 ? '📋' : index === 1 ? '🏦' : index === 2 ? '💰' : index === 3 ? '🔐' : '⏰'}
                  </span>
                  <span>{faq.question}</span>
                  <span className={`${styles.faqToggle} ${expandedFAQ === index ? styles.expanded : ''}`}>
                    ▼
                  </span>
                </button>
                <div className={`${styles.faqAnswer} ${expandedFAQ === index ? styles.show : ''}`}>
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function AgentListModal({ agents, onClose }) {
  const router = useRouter();

  const handleAgentClick = async (agent) => {
    try {
      const response = await api.post('/user/conversations', {
        agentId: agent.id,
        // The backend should handle creating or finding the conversation
      });
      const conversationId = response.data.conversationId;
      router.push(`/user/message?conversationId=${conversationId}`);
    } catch (error) {
      console.error('Error creating conversation:', error);
      alert('Could not start a conversation with this agent. Please try again.');
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Our Approved Agents</h2>
          <button onClick={onClose}>&times;</button>
        </div>
        <div className={styles.modalBody}>
          {agents.length > 0 ? (
            <ul className={styles.agentList}>
              {agents.map(agent => (
                <li key={agent.id} className={styles.agentListItem} onClick={() => handleAgentClick(agent)}>
                  <div className={styles.agentAvatar}>{agent.fname.charAt(0)}</div>
                  <div className={styles.agentInfo}>
                    <p className={styles.agentName}>{agent.fname} {agent.lname}</p>
                    <p className={styles.agentContact}>{agent.username}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No agents available at the moment.</p>
          )}
        </div>
      </div>
    </div>
  );
}