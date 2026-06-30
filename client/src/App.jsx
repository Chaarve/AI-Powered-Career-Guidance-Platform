import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import { AuthProvider } from './context/AuthContext.jsx';
import { StudentProvider } from './context/StudentContext.jsx';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import StudentProfile from './pages/StudentProfile.jsx';
import EnhancedStudentProfile from './pages/EnhancedStudentProfile.jsx';
import Quiz from './pages/Quiz.jsx';
import EnhancedQuiz from './pages/EnhancedQuiz.jsx';
import Results from './pages/Results.jsx';
import Colleges from './pages/Colleges.jsx';
import Wishlist from './pages/Wishlist.jsx';
import ProfileHistory from './pages/ProfileHistory.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  return (
    <AuthProvider>
      <StudentProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <EnhancedStudentProfile />
                </ProtectedRoute>
              } />
              <Route path="/profile/history" element={
                <ProtectedRoute>
                  <ProfileHistory />
                </ProtectedRoute>
              } />
              <Route path="/quiz" element={
                <ProtectedRoute>
                  <EnhancedQuiz />
                </ProtectedRoute>
              } />
              <Route path="/results" element={
                <ProtectedRoute>
                  <Results />
                </ProtectedRoute>
              } />
              <Route path="/colleges" element={
                <ProtectedRoute>
                  <Colleges />
                </ProtectedRoute>
              } />
              <Route path="/wishlist" element={
                <ProtectedRoute>
                  <Wishlist />
                </ProtectedRoute>
              } />
              
              {/* Legacy route redirect */}
              <Route path="/student-form" element={<Navigate to="/profile" replace />} />
            </Routes>
          </main>
        </div>
      </StudentProvider>
    </AuthProvider>
  );
}

export default App;
