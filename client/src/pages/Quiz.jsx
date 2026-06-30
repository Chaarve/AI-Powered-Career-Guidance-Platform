import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStudent } from '../context/StudentContext';
import axios from 'axios';

const Quiz = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { student, updateQuizResults } = useStudent();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchQuestions();
  }, [isAuthenticated, navigate]);

  const fetchQuestions = async () => {
    try {
      console.log('Fetching quiz questions...');
      console.log('User authenticated:', isAuthenticated);
      console.log('User:', user);
      
      const response = await axios.get('/api/quiz/questions');
      console.log('Quiz questions response:', response.data);
      
      if (response.data.success) {
        setQuestions(response.data.data.questions);
        console.log('Questions loaded successfully:', response.data.data.questions.length);
      } else {
        console.error('Quiz questions API returned error:', response.data);
        setError('Failed to load quiz questions');
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      console.error('Error response:', error.response?.data);
      setError('Failed to load quiz questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = {
      question_id: questions[questionIndex].id,
      selected_option_index: optionIndex
    };
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      console.log('Submitting quiz...');
      console.log('User:', user);
      console.log('Answers:', answers);
      console.log('Answers length:', answers.length);

      const response = await axios.post('/api/quiz/submit', {
        answers: answers
      });

      console.log('Quiz submission response:', response.data);

      if (response.data.success) {
        updateQuizResults(response.data.data);
        navigate('/results');
      } else {
        console.error('Quiz submission failed:', response.data);
        setError(response.data.message || 'Failed to submit quiz');
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      console.error('Error response:', error.response?.data);
      setError(error.response?.data?.message || 'Failed to submit quiz. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getProgress = () => {
    return ((currentQuestion + 1) / questions.length) * 100;
  };

  const isCurrentAnswered = () => {
    return answers[currentQuestion] !== undefined;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass rounded-2xl p-8 text-center fade-in">
          <div className="spinner mx-auto mb-6"></div>
          <p className="text-white font-medium">Loading quiz questions...</p>
        </div>
      </div>
    );
  }

  if (error && questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass rounded-2xl p-8 text-center max-w-md fade-in">
          <div className="text-red-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Quiz Error</h2>
          <p className="text-white/80 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="glass rounded-2xl p-6 mb-8 fade-in">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-semibold text-white">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm font-semibold text-white">
              {Math.round(getProgress())}% Complete
            </span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div
              className="progress-bar h-3 rounded-full"
              style={{ width: `${getProgress()}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="glass rounded-2xl p-8 mb-8 fade-in">
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4 shadow-lg">
                {currentQuestion + 1}
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                {question.question}
              </h2>
            </div>
            <p className="text-gray-600 font-medium">
              Choose the option that best describes your preference
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {question.options.map((option, index) => (
              <div
                key={index}
                onClick={() => handleAnswerSelect(currentQuestion, index)}
                className={`quiz-option ${
                  answers[currentQuestion]?.selected_option_index === index ? 'selected' : ''
                }`}
              >
                <div className="flex items-center">
                  <span className="option-number">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-gray-800 font-medium">{option.text}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                currentQuestion === 0
                  ? 'bg-white/10 text-white/40 cursor-not-allowed'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              Previous
            </button>

            <div className="flex gap-2 flex-wrap justify-center max-w-xs">
              {Array.from({ length: questions.length }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-10 h-10 rounded-full text-sm font-semibold transition-all border-2 ${
                    index === currentQuestion
                      ? 'bg-white text-purple-600 border-white scale-110'
                      : answers[index] !== undefined
                      ? 'bg-green-500 text-white border-green-500'
                      : 'bg-white/20 text-white/60 border-white/30 hover:bg-white/30'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={!isCurrentAnswered() || submitting}
                className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                  !isCurrentAnswered() || submitting
                    ? 'bg-white/10 text-white/40 cursor-not-allowed'
                    : 'btn-secondary pulse-animation'
                }`}
              >
                {submitting ? (
                  <span className="flex items-center">
                    <div className="spinner w-4 h-4 mr-2"></div>
                    Submitting...
                  </span>
                ) : (
                  'Submit Quiz'
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!isCurrentAnswered()}
                className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                  !isCurrentAnswered()
                    ? 'bg-white/10 text-white/40 cursor-not-allowed'
                    : 'btn-primary'
                }`}
              >
                Next
              </button>
            )}
          </div>
        </div>

        {/* Quiz Info */}
        <div className="glass rounded-2xl p-6 fade-in">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Simple Instructions
          </h3>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2 font-bold">1.</span>
                <span>Answer honestly based on your true interests</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2 font-bold">2.</span>
                <span>No right or wrong answers - this is about you</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2 font-bold">3.</span>
                <span>Take your time and think carefully</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2 font-bold">4.</span>
                <span>Quiz takes about 5-10 minutes</span>
              </li>
            </ul>
          </div>
        </div>

        {error && (
          <div className="mt-6 glass rounded-xl p-4 border-l-4 border-red-400 fade-in">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
