import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const StudentProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    marks: '',
    declared_interest: '',
    academic_details: {
      class_10_marks: '',
      class_12_marks: '',
      board: '',
      year_of_passing: ''
    },
    personal_details: {
      date_of_birth: '',
      gender: '',
      city: '',
      state: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [existingProfile, setExistingProfile] = useState(null);

  useEffect(() => {
    fetchExistingProfile();
  }, []);

  const fetchExistingProfile = async () => {
    try {
      const response = await axios.get('/api/profile');
      if (response.data.data) {
        setExistingProfile(response.data.data);
        setFormData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching existing profile:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.marks || formData.marks < 0 || formData.marks > 100) {
      setError('Please enter valid marks between 0 and 100');
      return false;
    }
    if (!formData.declared_interest) {
      setError('Please select your field of interest');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    console.log('Form submission started');
    e.preventDefault();
    setError('');

    console.log('Current form data:', formData);

    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    console.log('Form validation passed');
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        marks: parseInt(formData.marks),
        academic_details: {
          class_10_marks: formData.academic_details.class_10_marks ? parseInt(formData.academic_details.class_10_marks) : undefined,
          class_12_marks: formData.academic_details.class_12_marks ? parseInt(formData.academic_details.class_12_marks) : undefined,
          board: formData.academic_details.board || undefined,
          year_of_passing: formData.academic_details.year_of_passing ? parseInt(formData.academic_details.year_of_passing) : undefined
        },
        personal_details: {
          date_of_birth: formData.personal_details.date_of_birth || undefined,
          gender: formData.personal_details.gender || undefined,
          city: formData.personal_details.city || undefined,
          state: formData.personal_details.state || undefined
        }
      };

      console.log('Form data being submitted:', formData);
      console.log('Submit data being sent:', submitData);
      console.log('About to make API call to /api/profile');

      const response = await axios.post('/api/profile', submitData);
      console.log('Response received:', response.data);
      
      if (response.data.success) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error during profile creation:', error);
      console.error('Error response:', error.response?.data);
      setError(error.response?.data?.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const testSubmit = async () => {
    console.log('Test submit started');
    setLoading(true);
    
    try {
      const testData = {
        marks: 85,
        declared_interest: 'Science',
        academic_details: {
          class_10_marks: 90,
          class_12_marks: 85,
          board: 'CBSE',
          year_of_passing: 2023
        },
        personal_details: {
          date_of_birth: '2005-01-01',
          gender: 'Male',
          city: 'Delhi',
          state: 'Delhi'
        }
      };

      console.log('Test data being sent:', testData);
      
      const response = await axios.post('/api/profile', testData);
      console.log('Test response received:', response.data);
      
      if (response.data.success) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error during test profile creation:', error);
      console.error('Test error response:', error.response?.data);
      setError(error.response?.data?.message || 'Failed to save profile (test)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {existingProfile ? 'Update Your Profile' : 'Create Your Profile'}
          </h1>
          <p className="text-gray-600">
            Tell us about yourself to get personalized career recommendations
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Academic Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Academic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="marks" className="block text-sm font-medium text-gray-700 mb-2">
                    Overall Academic Marks (%)*
                  </label>
                  <input
                    type="number"
                    id="marks"
                    name="marks"
                    value={formData.marks}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter your marks (0-100)"
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Enter your overall academic percentage
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Field of Interest*
                  </label>
                  <select
                    name="declared_interest"
                    value={formData.declared_interest}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  >
                    <option value="">Select your interest</option>
                    <option value="Science">Science</option>
                    <option value="Commerce">Commerce</option>
                    <option value="Arts">Arts</option>
                  </select>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Academic Details (Optional)</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label htmlFor="class_10_marks" className="block text-sm font-medium text-gray-700 mb-1">
                      Class 10 Marks (%)
                    </label>
                    <input
                      type="number"
                      id="class_10_marks"
                      name="academic_details.class_10_marks"
                      value={formData.academic_details.class_10_marks}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Class 10 %"
                    />
                  </div>

                  <div>
                    <label htmlFor="class_12_marks" className="block text-sm font-medium text-gray-700 mb-1">
                      Class 12 Marks (%)
                    </label>
                    <input
                      type="number"
                      id="class_12_marks"
                      name="academic_details.class_12_marks"
                      value={formData.academic_details.class_12_marks}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Class 12 %"
                    />
                  </div>

                  <div>
                    <label htmlFor="board" className="block text-sm font-medium text-gray-700 mb-1">
                      Education Board
                    </label>
                    <input
                      type="text"
                      id="board"
                      name="academic_details.board"
                      value={formData.academic_details.board}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="CBSE, State Board, etc."
                    />
                  </div>

                  <div>
                    <label htmlFor="year_of_passing" className="block text-sm font-medium text-gray-700 mb-1">
                      Year of Passing
                    </label>
                    <input
                      type="number"
                      id="year_of_passing"
                      name="academic_details.year_of_passing"
                      value={formData.academic_details.year_of_passing}
                      onChange={handleChange}
                      min="2000"
                      max={new Date().getFullYear()}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="2023"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information (Optional)</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="date_of_birth"
                    name="personal_details.date_of_birth"
                    value={formData.personal_details.date_of_birth}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="personal_details.gender"
                    value={formData.personal_details.gender}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="personal_details.city"
                    value={formData.personal_details.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Your city"
                  />
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="personal_details.state"
                    value={formData.personal_details.state}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Your state"
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-6 border-t">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary py-3"
              >
                {loading ? 'Saving...' : (existingProfile ? 'Update Profile' : 'Create Profile')}
              </button>
              <button
                type="button"
                onClick={testSubmit}
                disabled={loading}
                className="flex-1 btn-secondary py-3"
              >
                {loading ? 'Testing...' : 'Test Create'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 btn-outline py-3"
              >
                Back to Dashboard
              </button>
            </div>
          </form>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">What happens next?</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>1. You'll take a comprehensive aptitude quiz</li>
              <li>2. We'll analyze your strengths and interests</li>
              <li>3. You'll receive personalized course recommendations</li>
              <li>4. Explore colleges that match your profile</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
