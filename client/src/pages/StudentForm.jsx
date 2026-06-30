import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudent } from '../context/StudentContext';
import axios from 'axios';

const StudentForm = () => {
  const navigate = useNavigate();
  const { updateStudent } = useStudent();
  const [formData, setFormData] = useState({
    name: '',
    marks: '',
    declared_interest: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Please enter your name');
      return false;
    }
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
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/students', {
        name: formData.name.trim(),
        marks: parseInt(formData.marks),
        declared_interest: formData.declared_interest
      });

      if (response.data.success) {
        updateStudent(response.data.data);
        navigate('/quiz');
      } else {
        setError(response.data.message || 'Failed to create student profile');
      }
    } catch (error) {
      console.error('Error creating student:', error);
      setError(error.response?.data?.message || 'Failed to create student profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create Your Profile
            </h1>
            <p className="text-gray-600">
              Tell us about yourself to get personalized career recommendations
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label htmlFor="marks" className="block text-sm font-medium text-gray-700 mb-2">
                Academic Marks (%) *
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
                Field of Interest *
              </label>
              <div className="space-y-3">
                {['Science', 'Commerce', 'Arts'].map((interest) => (
                  <label key={interest} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="declared_interest"
                      value={interest}
                      checked={formData.declared_interest === interest}
                      onChange={handleChange}
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                    />
                    <div className="ml-3">
                      <div className="font-medium text-gray-900">{interest}</div>
                      <div className="text-sm text-gray-500">
                        {interest === 'Science' && 'Engineering, Medicine, Research, Technology'}
                        {interest === 'Commerce' && 'Business, Finance, Accounting, Management'}
                        {interest === 'Arts' && 'Literature, Psychology, Social Sciences, Design'}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary py-3"
              >
                {loading ? 'Creating Profile...' : 'Continue to Quiz'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex-1 btn-outline py-3"
              >
                Back to Home
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

export default StudentForm;
