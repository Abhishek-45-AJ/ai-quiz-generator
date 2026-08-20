// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import QuizSetup from './pages/QuizSetup';
import QuizScreen from './pages/QuizScreen';
import QuizReview from './pages/QuizReview';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', fontFamily: 'sans-serif' }}>
          <Navbar />
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quiz/setup"
              element={
                <ProtectedRoute>
                  <QuizSetup />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quiz/play"
              element={
                <ProtectedRoute>
                  <QuizScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quiz/review/:id"
              element={
                <ProtectedRoute>
                  <QuizReview />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;