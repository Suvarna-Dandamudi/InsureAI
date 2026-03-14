import React, { useState, useEffect } from 'react';

import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';

import { motion } from 'framer-motion';

import { ThemeProvider } from './contexts/ThemeContext';

import { AuthProvider } from './contexts/AuthContext';

import ProtectedRoute from './components/ProtectedRoute';

import Landing from './pages/Landing';

import Login from './pages/Login';

import Signup from './pages/Signup';

import Dashboard from './pages/Dashboard';

import Customers from './pages/Customers';

import Policies from './pages/Policies';

import Claims from './pages/Claims';

import AddPolicy from './pages/AddPolicy';

import AddClaim from './pages/AddClaim';

import Analytics from './pages/Analytics';

import Chatbot from './pages/Chatbot';

import Profile from './pages/Profile';

import './index.css';



function App() {

  const [isLoading, setIsLoading] = useState(true);



  useEffect(() => {

    const timer = setTimeout(() => {

      setIsLoading(false);

    }, 1000);



    return () => clearTimeout(timer);

  }, []);



  if (isLoading) {

    return (

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">

        <motion.div

          animate={{ rotate: 360 }}

          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}

          className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"

        />

        <h2 className="ml-4 text-xl font-semibold text-gray-700 dark:text-gray-300">Loading INSUREAI...</h2>

      </div>

    );

  }



  return (

    <BrowserRouter>

      <ThemeProvider>

        <AuthProvider>

          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

            <Routes>

            {/* Public Routes */}

            <Route path="/" element={<Landing />} />

            <Route path="/login" element={<Login />} />

            <Route path="/signup" element={<Signup />} />

            

            {/* Protected Routes */}

            <Route path="/dashboard" element={

              <ProtectedRoute>

                <Dashboard />

              </ProtectedRoute>

            } />

            <Route path="/customers" element={

              <ProtectedRoute>

                <Customers />

              </ProtectedRoute>

            } />

            <Route path="/policies" element={

              <ProtectedRoute>

                <Policies />

              </ProtectedRoute>

            } />

            <Route path="/claims" element={

              <ProtectedRoute>

                <Claims />

              </ProtectedRoute>

            } />

            <Route path="/add-policy" element={

              <ProtectedRoute>

                <AddPolicy />

              </ProtectedRoute>

            } />

            <Route path="/add-claim" element={

              <ProtectedRoute>

                <AddClaim />

              </ProtectedRoute>

            } />

            <Route path="/analytics" element={

              <ProtectedRoute>

                <Analytics />

              </ProtectedRoute>

            } />

            <Route path="/chatbot" element={

              <ProtectedRoute>

                <Chatbot />

              </ProtectedRoute>

            } />

            <Route path="/profile" element={

              <ProtectedRoute>

                <Profile />

              </ProtectedRoute>

            } />

            

            {/* Redirect */}

            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>

          </div>

        </AuthProvider>

      </ThemeProvider>

    </BrowserRouter>

  );

}



export default App;

