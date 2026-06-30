import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const ProfileHistory = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [historyData, setHistoryData] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchAll();
  }, [isAuthenticated]);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [historyRes, profileRes, recsRes] = await Promise.all([
        axios.get('/api/enhanced-quiz/history').catch(() => ({ data: { success: false } })),
        axios.get('/api/profile').catch(() => ({ data: { success: false } })),
        axios.get('/api/recommendations').catch(() => ({ data: { success: false } }))
      ]);

      if (historyRes.data.success) setHistoryData(historyRes.data.data);
      if (profileRes.data.success) setProfile(profileRes.data.data);
      if (recsRes.data.success) setRecommendations(recsRes.data.data.recommendations || []);
    } catch (err) {
      console.error('Error fetching history:', err);
      setError('Failed to load history data.');
    } finally {
      setLoading(false);
    }
  };

  const getDomainIcon = (domain) => {
    switch (domain) {
      case 'Science': return '🔬';
      case 'Commerce': return '💼';
      case 'Arts': return '🎨';
      case 'Vocational': return '🛠️';
      default: return '📊';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your history...</p>
        </div>
      </div>
    );
  }

  const allAttempts = [];
  if (historyData?.past_attempts) {
    historyData.past_attempts.forEach(a => allAttempts.push({ ...a, is_current: false }));
  }
  if (historyData?.current_attempt) {
    allAttempts.push(historyData.current_attempt);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Score & History</h1>
          <p className="text-lg text-gray-600">
            View your quiz attempts, scores, and recommended colleges
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Profile Summary Card */}
        {profile && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Profile Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-primary-600">{profile.marks}%</div>
                <div className="text-sm text-gray-600">Academic Marks</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-primary-600">{profile.declared_interest}</div>
                <div className="text-sm text-gray-600">Declared Interest</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-primary-600">{historyData?.total_attempts || 0}</div>
                <div className="text-sm text-gray-600">Total Quiz Attempts</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className={`text-2xl font-bold ${profile.quiz_completed ? 'text-green-600' : 'text-orange-600'}`}>
                  {profile.quiz_completed ? '✅' : '⏳'}
                </div>
                <div className="text-sm text-gray-600">{profile.quiz_completed ? 'Quiz Complete' : 'Quiz Pending'}</div>
              </div>
            </div>
          </div>
        )}

        {/* Quiz Attempts */}
        {allAttempts.length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Quiz Attempts</h2>
            {allAttempts.map((attempt, idx) => (
              <div key={idx} className={`bg-white rounded-xl shadow-lg p-6 ${attempt.is_current ? 'border-2 border-primary-500' : ''}`}>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-gray-900">
                      Attempt #{attempt.attempt_number}
                    </h3>
                    {attempt.is_current && (
                      <span className="px-3 py-1 bg-primary-100 text-primary-800 text-xs font-semibold rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">
                    {attempt.date ? new Date(attempt.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                  </span>
                </div>

                {/* Scores Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {['science', 'commerce', 'arts', 'vocational'].map(domain => (
                    <div key={domain} className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-xl font-bold text-gray-900">
                        {attempt.combined_scores?.[domain] || attempt.aptitude_scores?.[domain] || 0}
                      </div>
                      <div className="text-xs text-gray-600 capitalize">{domain}</div>
                    </div>
                  ))}
                </div>

                {/* Domain & Score */}
                <div className="flex flex-wrap items-center gap-4">
                  {attempt.dominant_domain && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-primary-50 rounded-full">
                      <span>{getDomainIcon(attempt.dominant_domain)}</span>
                      <span className="font-semibold text-primary-800">{attempt.dominant_domain}</span>
                    </div>
                  )}
                  {(attempt.correct_answers !== undefined && attempt.total_questions) && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-full">
                      <span className="font-semibold text-blue-800">
                        Score: {attempt.correct_answers}/{attempt.total_questions} correct
                      </span>
                    </div>
                  )}
                </div>

                {/* Recommended Courses */}
                {attempt.recommendations?.recommendedCourses?.length > 0 && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Recommended Courses</h4>
                    <div className="flex flex-wrap gap-2">
                      {attempt.recommendations.recommendedCourses.map((course, cIdx) => (
                        <span key={cIdx} className="px-3 py-1 bg-white border border-gray-200 text-gray-700 text-sm rounded-full">
                          {course}
                        </span>
                      ))}
                    </div>
                    {attempt.recommendations.explanation && (
                      <p className="mt-2 text-sm text-gray-600">{attempt.recommendations.explanation}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No quiz attempts yet</h3>
            <p className="text-gray-600 mb-6">Take the quiz to see your scores and recommended courses here</p>
            <button onClick={() => navigate('/quiz')} className="btn-primary">
              Take Quiz
            </button>
          </div>
        )}

        {/* Recommended Colleges from Latest Attempt */}
        {recommendations.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Latest Recommended Colleges</h2>
            {recommendations.map((rec, rIdx) => (
              <div key={rIdx} className="bg-white rounded-xl shadow-lg p-6 mb-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-bold text-gray-900">
                    {rec.recommended_courses?.length || 0} courses recommended
                  </h3>
                  <span className="text-xs text-gray-500">
                    {rec.recommendation_type === 'hybrid' ? '🤖 ML + Rule-based' : '📋 Rule-based'}
                  </span>
                </div>
                <div className="space-y-2">
                  {rec.recommended_courses?.map((course, cIdx) => (
                    <div key={cIdx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-primary-600">#{course.rank}</span>
                        <span className="font-medium text-gray-900">{course.course_name}</span>
                      </div>
                      <span className="text-sm font-semibold text-green-600">{course.score}% match</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex justify-center gap-4">
          <button onClick={() => navigate('/profile')} className="btn-primary">
            Edit Profile
          </button>
          <button onClick={() => navigate('/dashboard')} className="btn-outline">
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHistory;
