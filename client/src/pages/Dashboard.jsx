import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/profile');
      if (response.data && response.data.success) {
        setProfile(response.data.data);
      } else {
        setProfile(null);
      }
      setError('');
    } catch (error) {
      console.error('Error fetching profile:', error);
      // If it's a 404 or missing profile message, just treat it as no profile
      if (error.response?.status === 404 || error.response?.data?.message?.includes('not found')) {
        setProfile(null);
        setError('');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleCreateProfile = () => {
    navigate('/profile');
  };

  const handleTakeQuiz = () => {
    navigate('/quiz');
  };

  const handleViewResults = () => {
    navigate('/results');
  };

  const handleViewColleges = () => {
    navigate('/colleges');
  };

  const handleRetakeQuiz = async () => {
    try {
      await axios.post('/api/enhanced-quiz/reset');
      navigate('/quiz');
    } catch (err) {
      console.error('Error resetting quiz:', err);
      setError('Failed to reset quiz. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">EKALAVYA Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="btn-outline text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Profile Status</h2>
          
          {error ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          ) : !profile ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Profile Yet</h3>
              <p className="text-gray-600 mb-4">
                Create your student profile to get personalized career recommendations
              </p>
              <button
                onClick={handleCreateProfile}
                className="btn-primary"
              >
                Create Profile
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary-600 mb-1">
                    {profile.marks}%
                  </div>
                  <div className="text-sm text-gray-600">Academic Marks</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary-600 mb-1">
                    {profile.declared_interest}
                  </div>
                  <div className="text-sm text-gray-600">Declared Interest</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className={`text-2xl font-bold mb-1 ${
                    profile.quiz_completed ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {profile.quiz_completed ? 'Completed' : 'Pending'}
                  </div>
                  <div className="text-sm text-gray-600">Quiz Status</div>
                </div>
              </div>

              {profile.dominant_domain && (
                <div className="text-center">
                  <div className="inline-flex items-center px-4 py-2 bg-primary-100 rounded-full">
                    <span className="text-primary-800 font-medium">
                      Dominant Domain: {profile.dominant_domain}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={handleCreateProfile}
              disabled={!!profile}
              className="p-6 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="text-center">
                <div className="text-3xl mb-2">1</div>
                <div className="font-medium text-gray-900">Create Profile</div>
                <div className="text-sm text-gray-600 mt-1">
                  {profile ? 'Completed' : 'Add your academic details'}
                </div>
              </div>
            </button>

            <button
              onClick={profile?.quiz_completed ? handleRetakeQuiz : handleTakeQuiz}
              disabled={!profile}
              className="p-6 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="text-center">
                <div className="text-3xl mb-2">2</div>
                <div className="font-medium text-gray-900">
                  {profile?.quiz_completed ? 'Retake Quiz' : 'Take Quiz'}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {profile?.quiz_completed ? 'Take quiz again (history saved)' : 'Complete aptitude test'}
                </div>
              </div>
            </button>

            <button
              onClick={handleViewResults}
              disabled={!profile?.quiz_completed}
              className="p-6 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="text-center">
                <div className="text-3xl mb-2">3</div>
                <div className="font-medium text-gray-900">View Results</div>
                <div className="text-sm text-gray-600 mt-1">
                  {profile?.quiz_completed ? 'View recommendations' : 'Complete quiz first'}
                </div>
              </div>
            </button>

            <button
              onClick={handleViewColleges}
              className="p-6 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
            >
              <div className="text-center">
                <div className="text-3xl mb-2">4</div>
                <div className="font-medium text-gray-900">Explore Colleges</div>
                <div className="text-sm text-gray-600 mt-1">
                  Browse government colleges
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Progress Overview */}
        {profile && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Progress</h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Profile Creation</span>
                  <span className="text-sm text-green-600">Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Aptitude Quiz</span>
                  <span className={`text-sm ${profile.quiz_completed ? 'text-green-600' : 'text-orange-600'}`}>
                    {profile.quiz_completed ? 'Complete' : 'Pending'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${profile.quiz_completed ? 'bg-green-600' : 'bg-orange-600'}`}
                    style={{ width: profile.quiz_completed ? '100%' : '50%' }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Recommendations</span>
                  <span className={`text-sm ${profile.quiz_completed ? 'text-green-600' : 'text-gray-400'}`}>
                    {profile.quiz_completed ? 'Available' : 'Locked'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${profile.quiz_completed ? 'bg-green-600' : 'bg-gray-400'}`}
                    style={{ width: profile.quiz_completed ? '100%' : '0%' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
