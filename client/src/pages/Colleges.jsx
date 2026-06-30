import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const Colleges = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [colleges, setColleges] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [wishlistedIds, setWishlistedIds] = useState(new Set());
  const [filters, setFilters] = useState({
    state: searchParams.get('state') || '',
    district: searchParams.get('district') || '',
    college_type: searchParams.get('college_type') || '',
    courseId: searchParams.get('courseId') || ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [feeMin, setFeeMin] = useState('');
  const [feeMax, setFeeMax] = useState('');
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_colleges: 0,
    per_page: 10
  });

  useEffect(() => {
    fetchStates();
    fetchWishlistIds();
    fetchColleges();
  }, [filters, searchParams]);

  useEffect(() => {
    if (filters.state) {
      fetchCities(filters.state);
    } else {
      setCities([]);
    }
  }, [filters.state]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchStates = async () => {
    try {
      const response = await axios.get('/api/colleges/states');
      if (response.data.success) {
        setStates(response.data.data.states || []);
      }
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  };

  const fetchCities = async (state) => {
    try {
      const response = await axios.get(`/api/colleges/states/${state}/districts`);
      if (response.data.success) {
        setCities(response.data.data.districts || []);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const fetchWishlistIds = async () => {
    try {
      const response = await axios.get('/api/wishlist/ids');
      if (response.data.success) {
        setWishlistedIds(new Set(response.data.data.collegeIds));
      }
    } catch (error) {
      console.error('Error fetching wishlist IDs:', error);
    }
  };

  const toggleWishlist = async (collegeId) => {
    try {
      if (wishlistedIds.has(collegeId)) {
        await axios.delete(`/api/wishlist/${collegeId}`);
        setWishlistedIds(prev => {
          const next = new Set(prev);
          next.delete(collegeId);
          return next;
        });
      } else {
        await axios.post(`/api/wishlist/${collegeId}`);
        setWishlistedIds(prev => new Set([...prev, collegeId]));
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  const fetchColleges = async (pageOverride = null) => {
    setLoading(true);
    setError('');

    try {
      const currentPage = pageOverride || pagination.current_page;
      const params = new URLSearchParams({
        page: currentPage,
        limit: pagination.per_page,
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''))
      });

      let url = '/api/colleges';
      if (filters.courseId) {
        url = '/api/colleges/by-course';
      }

      const response = await axios.get(`${url}?${params}`);
      
      if (response.data.success) {
        setColleges(response.data.data.colleges);
        
        if (response.data.data.pagination) {
          setPagination(response.data.data.pagination);
        } else {
          setPagination({
            current_page: currentPage,
            total_pages: 1,
            total_colleges: response.data.data.total_colleges,
            per_page: response.data.data.colleges.length
          });
        }
      } else {
        setError(response.data.message || 'Failed to fetch colleges');
      }
    } catch (error) {
      console.error('Error fetching colleges:', error);
      setError('Failed to fetch colleges. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, current_page: 1 }));
    
    // Update URL params
    const newParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val) newParams.set(key, val);
    });
    setSearchParams(newParams);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim() && !feeMin && !feeMax) {
      fetchColleges();
      return;
    }

    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams({
        page: 1,
        limit: pagination.per_page,
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''))
      });
      if (searchQuery.trim()) params.set('q', searchQuery);
      if (feeMin) params.set('fee_min', feeMin);
      if (feeMax) params.set('fee_max', feeMax);

      const response = await axios.get(`/api/colleges/search?${params}`);
      
      if (response.data.success) {
        setColleges(response.data.data.colleges);
        setPagination(response.data.data.pagination);
      } else {
        setError(response.data.message || 'No colleges found');
      }
    } catch (error) {
      console.error('Error searching colleges:', error);
      setError('Failed to search colleges. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, current_page: page }));
    fetchColleges(page);
  };

  const getCollegeTypeColor = (type) => {
    const lType = (type || '').toLowerCase();
    if (lType.includes('government') || lType.includes('public')) return 'bg-blue-100 text-blue-800';
    if (lType.includes('private')) return 'bg-green-100 text-green-800';
    if (lType.includes('aided')) return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (loading && colleges.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading colleges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {filters.courseId ? 'Colleges Offering This Course' : 'Explore Colleges in India'}
          </h1>
          <p className="text-lg text-gray-600">
            {filters.courseId 
              ? `Showing colleges that offer "${filters.courseId}"` 
              : 'Find the perfect college with detailed insights, fees, and authentic reviews.'
            }
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Search & Filter</h2>
          
          {/* Search Bar */}
          <div className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search by college name, course name, city, or state..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <button
                onClick={handleSearch}
                className="btn-primary"
              >
                Search
              </button>
            </div>
          </div>

          {/* Filter Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <select
                value={filters.state}
                onChange={(e) => handleFilterChange('state', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All States</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <select
                value={filters.district}
                onChange={(e) => handleFilterChange('district', e.target.value)}
                disabled={!filters.state}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
              >
                <option value="">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">College Type</label>
              <select
                value={filters.college_type}
                onChange={(e) => handleFilterChange('college_type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Types</option>
                <option value="Government">Government</option>
                <option value="Public">Public</option>
                <option value="Private">Private</option>
                <option value="Private Unaided">Private Unaided</option>
              </select>
            </div>

            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
               <input
                 type="text"
                 value={filters.courseId}
                 onChange={(e) => handleFilterChange('courseId', e.target.value)}
                 placeholder="e.g. B.Tech, MBA..."
                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
               />
            </div>

            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Min Fee (₹)</label>
               <input
                 type="number"
                 value={feeMin}
                 onChange={(e) => setFeeMin(e.target.value)}
                 placeholder="0"
                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
               />
            </div>

            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Max Fee (₹)</label>
               <input
                 type="number"
                 value={feeMax}
                 onChange={(e) => setFeeMax(e.target.value)}
                 placeholder="No limit"
                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
               />
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <span className="text-sm text-gray-600">
              {pagination.total_colleges} colleges found
            </span>
            <button
              onClick={() => {
                setFilters({ state: '', district: '', college_type: '', courseId: '' });
                setSearchParams({});
                setSearchQuery('');
                setFeeMin('');
                setFeeMax('');
              }}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Colleges List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading colleges...</p>
          </div>
        ) : colleges.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No colleges found</h3>
            <p className="text-gray-600">Try adjusting your filters or search criteria</p>
          </div>
        ) : (
          <div className="space-y-6">
            {colleges.map((college) => (
              <div key={college._id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-2xl font-bold text-gray-900">{college.name}</h3>
                      <div className="flex items-center gap-2 ml-4">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${getCollegeTypeColor(college.type)}`}>
                          {college.type || 'Unknown Type'}
                        </span>
                        {/* Wishlist Heart Button */}
                        <button
                          onClick={() => toggleWishlist(college._id)}
                          className="p-2 rounded-full hover:bg-red-50 transition-colors"
                          title={wishlistedIds.has(college._id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                        >
                          <svg 
                            className={`w-6 h-6 transition-colors ${wishlistedIds.has(college._id) ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-red-400'}`}
                            fill={wishlistedIds.has(college._id) ? 'currentColor' : 'none'}
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                  {college.location && (
                     <span className="flex items-center">
                       📍 {college.location.city}, {college.location.state}
                     </span>
                  )}
                  {college.rating && (
                     <span className="flex items-center font-bold text-yellow-600">
                       ⭐ {college.rating} / 10 ({college.reviews} reviews)
                     </span>
                  )}
                  {college.avgPackage && (
                     <span className="flex items-center font-semibold text-green-700">
                       💼 Avg. Package: {college.avgPackage}
                     </span>
                  )}
                </div>

                {college.accreditations && college.accreditations.length > 0 && (
                   <div className="flex flex-wrap gap-2 mb-4">
                     {college.accreditations.map((acc, i) => (
                       <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded border border-blue-200">
                         {acc}
                       </span>
                     ))}
                   </div>
                )}

                {college.feeRange && (
                  <p className="text-sm text-gray-800 mb-4">
                    <strong>Overall Fee Range: </strong> {college.feeRange.raw}
                  </p>
                )}

                {/* Courses section preview */}
                {college.courses && college.courses.length > 0 && (
                   <div>
                     <h4 className="font-medium text-gray-900 mb-2 border-b pb-1">Top Courses</h4>
                     <div className="space-y-1">
                       {college.courses.slice(0, 3).map((course, idx) => (
                          <div key={idx} className="flex justify-between text-sm py-1 border-b border-gray-50 last:border-0">
                             <span className="font-medium text-gray-700">{course.name}</span>
                             <span className="text-gray-500 whitespace-nowrap ml-4">{course.feesRaw} {course.duration ? `(${course.duration})` : ''}</span>
                          </div>
                       ))}
                       {college.courses.length > 3 && (
                          <p className="text-xs text-primary-600 font-medium pt-2">+ {college.courses.length - 3} more courses offered</p>
                       )}
                     </div>
                   </div>
                )}
                
                <div className="mt-6 flex justify-end">
                  {college.sourceUrl ? (
                    <a href={college.sourceUrl} target="_blank" rel="noopener noreferrer" className="btn-outline text-sm">
                       Visit College Page
                    </a>
                  ) : (
                    <button className="btn-primary text-sm">
                      View Complete Details
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Pagination */}
            {pagination.total_pages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                <button
                  onClick={() => handlePageChange(pagination.current_page - 1)}
                  disabled={pagination.current_page === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded-md ${
                        page === pagination.current_page
                          ? 'bg-primary-600 text-white'
                          : 'border border-gray-300'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(pagination.current_page + 1)}
                  disabled={pagination.current_page === pagination.total_pages}
                  className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Colleges;
