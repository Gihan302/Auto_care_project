// pages/index.js
'use client';
import Link from 'next/link';

export default function Home() {
  const stats = [
    { title: "Fueled Leading Companies", value: "200+" },
    { title: "Complete Leading Plans", value: "150+" },
    { title: "Total Finals", value: "98%" },
    { title: "Customer Reviews", value: "4.9/5" },
  ];

  const plans = [
    { 
      id: 1, 
      title: "Premium Executive", 
      description: "Luxury vehicles with premium features",
      features: [
        "Premium maintenance package",
        "24/7 roadside assistance",
        "Unlimited mileage option"
      ]
    },
    { 
      id: 2, 
      title: "Business Professional", 
      description: "Corporate solutions for business needs",
      features: [
        "Tax-deductible leasing",
        "Fleet management tools",
        "Priority customer support"
      ]
    },
    { 
      id: 3, 
      title: "Family Comfort", 
      description: "Spacious options for family transportation",
      features: [
        "Child seat compatibility",
        "Amplified cargo space",
        "Advanced safety features"
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#69ddbe] to-[#ECDFCC] p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center py-8 sm:py-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            Find Your Perfect Vehicle Lease
          </h1>
          <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto">
            Compare plans from the top providers and secure the best deal
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-10 sm:mb-16">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg sm:rounded-xl shadow p-4 sm:p-6 transform transition-all hover:scale-105"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-xs sm:text-sm text-gray-700 mt-1 sm:mt-2">{stat.title}</p>
            </div>
          ))}
        </div>

        {/* Plans Section */}
        <div className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8 sm:mb-12">
            Our Leasing Plans
          </h2>
          
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            {plans.map((plan) => (
              <div 
                key={plan.id} 
                className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden w-full max-w-sm transform transition-all hover:scale-[1.02]"
              >
                <div className="h-40 bg-gradient-to-r from-[#1E201E] to-[#3a3d3a] flex items-center justify-center">
                  <div className="text-center p-4 sm:p-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-white">{plan.title}</h3>
                    <p className="text-gray-200 text-sm sm:text-base mt-1 sm:mt-2">{plan.description}</p>
                  </div>
                </div>
                
                <div className="p-4 sm:p-6">
                  <ul className="space-y-2 mb-4 sm:mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <div className="bg-gray-200 rounded-full p-1 mt-1 mr-2">
                          <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                        </div>
                        <span className="text-gray-700 text-sm sm:text-base">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-center">
                    <Link href={`/about-plan?id=${plan.id}`}>
                      <button className="bg-gray-900 text-gray-100 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm sm:text-base">
                        View Details
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Chat Button */}
        <div className="fixed bottom-6 right-6">
          <Link href="/chat">
            <button className="bg-gray-900 text-gray-100 p-3 sm:p-4 rounded-full shadow-lg hover:bg-gray-800 transition-colors">
              <span className="sr-only">Chat with Agent</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </button>
          </Link>
        </div>
      </div>
      
      {/* Add Tailwind CSS directly in JSX */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        .bg-gradient-to-br {
          background-image: linear-gradient(to bottom right, #69ddbe, #ECDFCC);
        }
        
        .transform {
          transition-property: transform;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 300ms;
        }
        
        .hover\:scale-105:hover {
          transform: scale(1.05);
        }
        
        .hover\:scale-\[1\.02\]:hover {
          transform: scale(1.02);
        }
        
        .shadow-lg {
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        
        .shadow {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        
        .bg-gradient-to-r {
          background-image: linear-gradient(to right, #1E201E, #3a3d3a);
        }
        
        .hover\:bg-gray-800:hover {
          background-color: #1f2937;
        }
        
        @media (min-width: 640px) {
          .sm\:text-4xl {
            font-size: 2.25rem;
            line-height: 2.5rem;
          }
          .sm\:text-lg {
            font-size: 1.125rem;
            line-height: 1.75rem;
          }
          .sm\:p-6 {
            padding: 1.5rem;
          }
          .sm\:rounded-2xl {
            border-radius: 1rem;
          }
          .sm\:text-2xl {
            font-size: 1.5rem;
            line-height: 2rem;
          }
        }
        
        @media (min-width: 768px) {
          .md\:flex-row {
            flex-direction: row;
          }
        }
      `}</style>
    </div>
  );
}