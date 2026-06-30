import React, { createContext, useContext } from 'react';

const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  const [student, setStudent] = React.useState(null);
  const [quizResults, setQuizResults] = React.useState(null);
  const [recommendations, setRecommendations] = React.useState(null);

  const updateStudent = (studentData) => {
    setStudent(studentData);
  };

  const updateQuizResults = (results) => {
    setQuizResults(results);
  };

  const updateRecommendations = (recommendationsData) => {
    setRecommendations(recommendationsData);
  };

  const resetStudent = () => {
    setStudent(null);
    setQuizResults(null);
    setRecommendations(null);
  };

  return (
    <StudentContext.Provider
      value={{
        student,
        quizResults,
        recommendations,
        updateStudent,
        updateQuizResults,
        updateRecommendations,
        resetStudent
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
};

export default StudentContext;
