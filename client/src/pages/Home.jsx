import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  const features = [
    {
      title: "Personalized Assessment",
      description: "Comprehensive aptitude quiz to identify your strengths and interests",
      icon: "brain",
      color: "bg-blue-500"
    },
    {
      title: "AI-Powered Recommendations",
      description: "Smart course suggestions based on your profile and aptitude scores",
      icon: "robot",
      color: "bg-purple-500"
    },
    {
      title: "Government College Database",
      description: "Extensive database of government colleges across India",
      icon: "school",
      color: "bg-green-500"
    },
    {
      title: "Career Path Guidance",
      description: "Detailed career information for each recommended course",
      icon: "compass",
      color: "bg-orange-500"
    }
  ];

  const steps = [
    {
      step: 1,
      title: "Sign Up",
      description: "Create your free account to get started"
    },
    {
      step: 2,
      title: "Create Profile",
      description: "Enter your academic details and interests"
    },
    {
      step: 3,
      title: "Take Aptitude Quiz",
      description: "Complete our comprehensive assessment test"
    },
    {
      step: 4,
      title: "Get Recommendations",
      description: "Receive personalized course recommendations"
    },
    {
      step: 5,
      title: "Explore Colleges",
      description: "Find colleges that offer your recommended courses"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome to <span className="text-primary-600">EKALAVYA</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Your Personalized Career Guidance System for Indian Government Colleges
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="btn-primary text-lg px-8 py-4"
                  >
                    Go to Dashboard
                  </Link>
                  <Link
                    to="/colleges"
                    className="btn-outline text-lg px-8 py-4"
                  >
                    Explore Colleges
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="btn-primary text-lg px-8 py-4"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/login"
                    className="btn-outline text-lg px-8 py-4"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose EKALAVYA?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We combine advanced AI technology with comprehensive data to provide best career guidance
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center card-hover bg-white rounded-xl p-6 shadow-lg">
                <div className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-white text-2xl">
                    {feature.icon === 'brain' && ''}
                    {feature.icon === 'robot' && ''}
                    {feature.icon === 'school' && ''}
                    {feature.icon === 'compass' && ''}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Five simple steps to discover your ideal career path
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-xl p-6 shadow-lg card-hover">
                  <div className="text-primary-600 text-3xl font-bold mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <div className="w-8 h-0.5 bg-primary-300"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-primary-200">Government Colleges</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">20+</div>
              <div className="text-primary-200">Courses Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">10,000+</div>
              <div className="text-primary-200">Students Helped</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Discover Your Career Path?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of students who have found their ideal career through EKALAVYA
          </p>
          {!isAuthenticated && (
            <Link
              to="/signup"
              className="btn-primary text-lg px-8 py-4"
            >
              Start Your Journey
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
