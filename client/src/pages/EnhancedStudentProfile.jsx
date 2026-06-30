import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const EnhancedStudentProfile = () => {
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
      state: '',
      country: '',
      phone_number: '',
      parent_name: '',
      parent_occupation: '',
      family_income: '',
      blood_group: '',
      nationality: '',
      languages_known: '',
      hobbies: '',
      strengths: '',
      career_goals: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [existingProfile, setExistingProfile] = useState(null);
  const [fetchingProfile, setFetchingProfile] = useState(true);

  useEffect(() => {
    fetchExistingProfile();
  }, []);

  const fetchExistingProfile = async () => {
    try {
      setFetchingProfile(true);
      const response = await axios.get('/api/profile');
      
      if (response.data.success && response.data.data) {
        setExistingProfile(response.data.data);
        setFormData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching existing profile:', error);
      if (error.response?.status === 404) {
        // Profile doesn't exist, that's okay
        setExistingProfile(null);
      } else {
        setError('Failed to fetch profile. Please try again.');
      }
    } finally {
      setFetchingProfile(false);
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
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

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
          state: formData.personal_details.state || undefined,
          country: formData.personal_details.country || undefined,
          phone_number: formData.personal_details.phone_number || undefined,
          parent_name: formData.personal_details.parent_name || undefined,
          parent_occupation: formData.personal_details.parent_occupation || undefined,
          family_income: formData.personal_details.family_income || undefined,
          blood_group: formData.personal_details.blood_group || undefined,
          nationality: formData.personal_details.nationality || undefined,
          languages_known: formData.personal_details.languages_known || undefined,
          hobbies: formData.personal_details.hobbies || undefined,
          strengths: formData.personal_details.strengths || undefined,
          career_goals: formData.personal_details.career_goals || undefined
        }
      };

      const response = await axios.post('/api/profile', submitData);
      
      if (response.data.success) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error during profile creation:', error);
      setError(error.response?.data?.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass rounded-2xl p-8 text-center fade-in">
          <div className="spinner mx-auto mb-6"></div>
          <p className="text-gray-800 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {existingProfile ? 'Update Your Profile' : 'Create Your Profile'}
          </h1>
          <p className="text-gray-600">
            Tell us about yourself to get personalized career recommendations
          </p>
        </div>

        <div className="glass rounded-2xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Academic Information */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332-.477 4.5-1.247M12 6.253v13" />
                </svg>
                Academic Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="marks" className="block text-sm font-semibold text-gray-700 mb-2">
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
                    className="input-field w-full"
                    placeholder="Enter your marks (0-100)"
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Enter your overall academic percentage
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Field of Interest*
                  </label>
                  <select
                    name="declared_interest"
                    value={formData.declared_interest}
                    onChange={handleChange}
                    className="input-field w-full"
                    required
                  >
                    <option value="">Select your interest</option>
                    <option value="Science">Science</option>
                    <option value="Commerce">Commerce</option>
                    <option value="Arts">Arts</option>
                    <option value="Vocational">Vocational</option>
                  </select>
                </div>
              </div>

              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Academic Details</h3>
                
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
                      className="input-field w-full"
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
                      className="input-field w-full"
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
                      className="input-field w-full"
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
                      className="input-field w-full"
                      placeholder="2023"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Personal Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    className="input-field w-full"
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
                    className="input-field w-full"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone_number"
                    name="personal_details.phone_number"
                    value={formData.personal_details.phone_number}
                    onChange={handleChange}
                    className="input-field w-full"
                    placeholder="+91 9876543210"
                  />
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
                    className="input-field w-full"
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
                    className="input-field w-full"
                    placeholder="Your state"
                  />
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="personal_details.country"
                    value={formData.personal_details.country}
                    onChange={handleChange}
                    className="input-field w-full"
                    placeholder="India"
                  />
                </div>

                <div>
                  <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-1">
                    Nationality
                  </label>
                  <input
                    type="text"
                    id="nationality"
                    name="personal_details.nationality"
                    value={formData.personal_details.nationality}
                    onChange={handleChange}
                    className="input-field w-full"
                    placeholder="Indian"
                  />
                </div>

                <div>
                  <label htmlFor="blood_group" className="block text-sm font-medium text-gray-700 mb-1">
                    Blood Group
                  </label>
                  <select
                    id="blood_group"
                    name="personal_details.blood_group"
                    value={formData.personal_details.blood_group}
                    onChange={handleChange}
                    className="input-field w-full"
                  >
                    <option value="">Select blood group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="languages_known" className="block text-sm font-medium text-gray-700 mb-1">
                    Languages Known
                  </label>
                  <input
                    type="text"
                    id="languages_known"
                    name="personal_details.languages_known"
                    value={formData.personal_details.languages_known}
                    onChange={handleChange}
                    className="input-field w-full"
                    placeholder="English, Hindi, Telugu..."
                  />
                </div>

                <div>
                  <label htmlFor="parent_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Parent/Guardian Name
                  </label>
                  <input
                    type="text"
                    id="parent_name"
                    name="personal_details.parent_name"
                    value={formData.personal_details.parent_name}
                    onChange={handleChange}
                    className="input-field w-full"
                    placeholder="Parent's full name"
                  />
                </div>

                <div>
                  <label htmlFor="parent_occupation" className="block text-sm font-medium text-gray-700 mb-1">
                    Parent's Occupation
                  </label>
                  <input
                    type="text"
                    id="parent_occupation"
                    name="personal_details.parent_occupation"
                    value={formData.personal_details.parent_occupation}
                    onChange={handleChange}
                    className="input-field w-full"
                    placeholder="Parent's occupation"
                  />
                </div>

                <div>
                  <label htmlFor="family_income" className="block text-sm font-medium text-gray-700 mb-1">
                    Annual Family Income
                  </label>
                  <select
                    id="family_income"
                    name="personal_details.family_income"
                    value={formData.personal_details.family_income}
                    onChange={handleChange}
                    className="input-field w-full"
                  >
                    <option value="">Select income range</option>
                    <option value="Below 3 Lakh">Below 3 Lakh</option>
                    <option value="3-6 Lakh">3-6 Lakh</option>
                    <option value="6-10 Lakh">6-10 Lakh</option>
                    <option value="10-15 Lakh">10-15 Lakh</option>
                    <option value="Above 15 Lakh">Above 15 Lakh</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="hobbies" className="block text-sm font-medium text-gray-700 mb-1">
                    Hobbies & Interests
                  </label>
                  <textarea
                    id="hobbies"
                    name="personal_details.hobbies"
                    value={formData.personal_details.hobbies}
                    onChange={handleChange}
                    rows="3"
                    className="input-field w-full"
                    placeholder="Reading, sports, music, coding..."
                  />
                </div>

                <div>
                  <label htmlFor="strengths" className="block text-sm font-medium text-gray-700 mb-1">
                    Strengths & Skills
                  </label>
                  <textarea
                    id="strengths"
                    name="personal_details.strengths"
                    value={formData.personal_details.strengths}
                    onChange={handleChange}
                    rows="3"
                    className="input-field w-full"
                    placeholder="Problem solving, communication, leadership..."
                  />
                </div>

                <div>
                  <label htmlFor="career_goals" className="block text-sm font-medium text-gray-700 mb-1">
                    Career Goals
                  </label>
                  <textarea
                    id="career_goals"
                    name="personal_details.career_goals"
                    value={formData.personal_details.career_goals}
                    onChange={handleChange}
                    rows="3"
                    className="input-field w-full"
                    placeholder="What do you want to become in future?"
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
                onClick={() => navigate('/dashboard')}
                className="flex-1 btn-outline py-3"
              >
                Back to Dashboard
              </button>
            </div>
          </form>

          <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200">
            <h3 className="font-bold text-blue-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              What happens next?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">Assessment Process</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>1. Take comprehensive interests quiz</li>
                  <li>2. Complete aptitude & knowledge test</li>
                  <li>3. Get personalized recommendations</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">Benefits</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Personalized course suggestions</li>
                  <li>• College recommendations</li>
                  <li>• Career guidance insights</li>
                  <li>• Scholarship information</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedStudentProfile;
