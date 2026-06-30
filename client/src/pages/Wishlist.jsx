import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Wishlist = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchWishlist();
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/wishlist');
      if (response.data.success) {
        setWishlist(response.data.data.wishlist);
      }
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      setError('Failed to load wishlist.');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (collegeId) => {
    try {
      await axios.delete(`/api/wishlist/${collegeId}`);
      setWishlist(prev => prev.filter(item => item.collegeId.toString() !== collegeId.toString()));
    } catch (err) {
      console.error('Error removing from wishlist:', err);
    }
  };

  const getCollegeTypeColor = (type) => {
    const lType = (type || '').toLowerCase();
    if (lType.includes('government') || lType.includes('public')) return 'bg-blue-100 text-blue-800';
    if (lType.includes('private')) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <span className="text-red-500">❤️</span> My Wishlist
          </h1>
          <p className="text-lg text-gray-600">
            {wishlist.length > 0 
              ? `You have ${wishlist.length} college${wishlist.length > 1 ? 's' : ''} saved`
              : 'Save colleges you like for easy access later'
            }
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {wishlist.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg">
            <svg className="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No colleges saved yet</h3>
            <p className="text-gray-600 mb-6">Browse colleges and tap the ❤️ to save them here</p>
            <button
              onClick={() => navigate('/colleges')}
              className="btn-primary"
            >
              Explore Colleges
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {wishlist.map((item) => {
              const college = item.college;
              if (!college) return null;
              
              return (
                <div key={item._id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-2xl font-bold text-gray-900">{college.name}</h3>
                        <div className="flex items-center gap-2 ml-4">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${getCollegeTypeColor(college.type)}`}>
                            {college.type || 'Unknown'}
                          </span>
                          <button
                            onClick={() => removeFromWishlist(item.collegeId)}
                            className="p-2 rounded-full hover:bg-red-50 transition-colors"
                            title="Remove from Wishlist"
                          >
                            <svg className="w-6 h-6 text-red-500 fill-red-500" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                        {college.location && (
                          <span>📍 {college.location.city}, {college.location.state}</span>
                        )}
                        {college.rating && (
                          <span className="font-bold text-yellow-600">⭐ {college.rating}/10</span>
                        )}
                        {college.avgPackage && (
                          <span className="font-semibold text-green-700">💼 {college.avgPackage}</span>
                        )}
                      </div>

                      {college.feeRange && (
                        <p className="text-sm text-gray-800 mb-3">
                          <strong>Fee Range:</strong> {college.feeRange.raw}
                        </p>
                      )}

                      {college.courses && college.courses.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {college.courses.slice(0, 4).map((course, idx) => (
                            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              {course.name}
                            </span>
                          ))}
                          {college.courses.length > 4 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                              +{college.courses.length - 4} more
                            </span>
                          )}
                        </div>
                      )}

                      <p className="text-xs text-gray-400 mt-2">
                        Added {new Date(item.added_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end gap-3">
                    {college.sourceUrl && (
                      <a href={college.sourceUrl} target="_blank" rel="noopener noreferrer" className="btn-outline text-sm">
                        Visit College
                      </a>
                    )}
                    <button
                      onClick={() => navigate(`/colleges?courseId=${encodeURIComponent(college.courses?.[0]?.name || '')}`)}
                      className="btn-primary text-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
