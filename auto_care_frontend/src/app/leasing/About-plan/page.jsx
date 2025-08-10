import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from './AboutPlan.module.css';

export default function AboutPlan() {
  const router = useRouter();
  const { id } = router.query;

  const plan = {
    id: id || 1,
    title: "Premium Executive Plan",
    description: "Luxury living with exclusive amenities",
    features: [
      "Personal benefits with easy access to business clients",
      "Family health coverage including dental and vision",
      "Access to state-of-the-art health centers",
      "24/7 concierge service for all your needs"
    ],
    agent: {
      name: "Sarah Johnson",
      title: "Senior Leasing Specialist",
      bio: "Received a degree in Business Administration and has over 10 years of experience in luxury property leasing across various metropolitan areas. Sarah is dedicated to providing a premium service experience and offers a strong leasing portfolio.",
      contact: "sarah.johnson@leasing.com",
      phone: "+1 (555) 123-4567"
    },
    resources: [
      "Leasing Agreement",
      "Termination Policy",
      "Reactivation Process",
      "Unemployment Clause",
      "Non-disclosure Agreement",
      "Personal Resource Planning",
      "e-Signature Option",
      "Retail Features",
      "Deviated Payment Options"
    ]
  };

  return (
    <div className={`min-h-screen ${styles.background}`}>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-8">
          <button 
            onClick={() => router.back()} 
            className="text-gray-900 hover:text-gray-700 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Plans
          </button>
        </div>

        <div className={`${styles.contentCard} rounded-2xl p-8 mb-8`}>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{plan.title}</h1>
          <p className="text-xl text-gray-700 mb-8">{plan.description}</p>

          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Plan Features & Benefits</h2>
            <ul className="space-y-4">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <div className={`${styles.featureIcon} rounded-full p-1 mt-1 mr-3 flex-shrink-0`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-2/3 mb-8 md:mb-0 md:pr-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Leasing Agent</h2>
                <div className="flex items-start">
                  <div className={`${styles.agentAvatar} rounded-xl w-16 h-16 mr-4`} />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{plan.agent.name}</h3>
                    <p className="text-gray-700 mb-3">{plan.agent.title}</p>
                    <p className="text-gray-600 mb-4">{plan.agent.bio}</p>
                    <p className="text-gray-600">Contact: {plan.agent.contact}</p>
                    <p className="text-gray-600">Phone: {plan.agent.phone}</p>
                  </div>
                </div>
              </div>
              <div className="md:w-1/3">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Ready to Move Forward?</h2>
                <p className="text-gray-700 mb-4">Contact Sarah today to discuss your leasing options or schedule a personal consultation.</p>
                <Link href="/chat">
                  <button className={`${styles.actionButton} w-full py-3 px-4 rounded-lg mb-3`}>
                    Chat with Agent
                  </button>
                </Link>
                <button className={`${styles.secondaryButton} w-full py-3 px-4 rounded-lg`}>
                  Schedule Call
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className={`${styles.resourcesCard} rounded-2xl p-8`}>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {plan.resources.map((resource, index) => (
              <div key={index} className={`${styles.resourceItem} p-4 rounded-lg cursor-pointer`}>
                <h3 className="text-gray-900 font-medium">{resource}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}