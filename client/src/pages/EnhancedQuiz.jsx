import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStudent } from '../context/StudentContext';
import axios from 'axios';

const EnhancedQuiz = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { student, updateQuizResults } = useStudent();
  
  const [quizStatus, setQuizStatus] = useState(null);
  const [currentQuizType, setCurrentQuizType] = useState('interests');
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

    fetchQuizStatus();
  }, [isAuthenticated, navigate]);

  const fetchQuizStatus = async () => {
    try {
      const response = await axios.get('/api/enhanced-quiz/status');
      if (response.data.success) {
        setQuizStatus(response.data.data);
        
        // Determine which quiz to show
        if (!response.data.data.interests_completed) {
          setCurrentQuizType('interests');
          await fetchInterestsQuestions();
        } else if (!response.data.data.aptitude_completed) {
          setCurrentQuizType('aptitude');
          await fetchAptitudeQuestions();
        } else {
          // Both completed, redirect to results
          navigate('/results');
        }
      }
    } catch (error) {
      console.error('Error fetching quiz status:', error);
      setError('Failed to fetch quiz status');
      setLoading(false);
    }
  };

  const fetchInterestsQuestions = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/enhanced-quiz/interests/questions');
      if (response.data.success) {
        setQuestions(response.data.data.questions);
      }
    } catch (error) {
      console.error('Error fetching interests questions:', error);
      setError('Failed to load interests quiz questions');
    } finally {
      setLoading(false);
    }
  };

  const fetchAptitudeQuestions = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/enhanced-quiz/aptitude/questions');
      if (response.data.success) {
        setQuestions(response.data.data.questions);
      }
    } catch (error) {
      console.error('Error fetching aptitude questions:', error);
      setError('Failed to load aptitude quiz questions');
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
      const endpoint = currentQuizType === 'interests' 
        ? '/api/enhanced-quiz/interests/submit'
        : '/api/enhanced-quiz/aptitude/submit';

      const response = await axios.post(endpoint, {
        quiz_type: currentQuizType,
        answers: answers
      });

      if (response.data.success) {
        if (currentQuizType === 'interests') {
          // Move to aptitude quiz
          setCurrentQuizType('aptitude');
          setAnswers([]);
          setCurrentQuestion(0);
          await fetchAptitudeQuestions();
        } else {
          // Both completed, update results and navigate
          updateQuizResults(response.data.data);
          navigate('/results');
        }
      } else {
        setError(response.data.message || 'Failed to submit quiz');
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
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
          <p className="text-gray-800 font-medium">Loading quiz questions...</p>
        </div>
      </div>
    );
  }

  if (error && questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass rounded-2xl p-8 text-center max-w-md fade-in">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Quiz Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
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
  const quizTitle = currentQuizType === 'interests' ? 'Interests Assessment' : 'Aptitude & Knowledge Assessment';
  const quizDescription = currentQuizType === 'interests' 
    ? 'Discover your natural interests and preferences'
    : 'Test your knowledge and skills across different domains';

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Quiz Header */}
        <div className="glass rounded-2xl p-6 mb-8 fade-in">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{quizTitle}</h1>
            <p className="text-gray-600">{quizDescription}</p>
            {currentQuizType === 'aptitude' && (
              <div className="mt-4 inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Interests Quiz Completed
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="glass rounded-2xl p-6 mb-8 fade-in">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-semibold text-gray-800">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm font-semibold text-gray-800">
              {Math.round(getProgress())}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
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
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {question.question}
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {question.category}
                </p>
              </div>
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
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
                      ? 'bg-white text-blue-600 border-white scale-110'
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
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : currentQuizType === 'interests' 
                    ? 'btn-primary'
                    : 'btn-secondary pulse-animation'
                }`}
              >
                {submitting ? (
                  <span className="flex items-center">
                    <div className="spinner w-4 h-4 mr-2"></div>
                    Submitting...
                  </span>
                ) : (
                  currentQuizType === 'interests' ? 'Continue to Aptitude Quiz' : 'Get Results'
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!isCurrentAnswered()}
                className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                  !isCurrentAnswered()
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
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
            {currentQuizType === 'interests' ? 'Interests Quiz Instructions' : 'Aptitude Quiz Instructions'}
          </h3>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <ul className="text-sm text-gray-700 space-y-2">
              {currentQuizType === 'interests' ? (
                <>
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
                    <span>Think about what you naturally enjoy</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 font-bold">4.</span>
                    <span>Quiz takes about 5-8 minutes</span>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 font-bold">1.</span>
                    <span>Answer based on your knowledge and skills</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 font-bold">2.</span>
                    <span>These questions test your aptitude across domains</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 font-bold">3.</span>
                    <span>Take your time and think carefully</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 font-bold">4.</span>
                    <span>Quiz takes about 10-15 minutes</span>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        {error && (
          <div className="mt-6 glass rounded-xl p-4 border-l-4 border-red-400 fade-in">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedQuiz;
