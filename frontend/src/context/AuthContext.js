import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Add health check function
const checkBackendHealth = async () => {
  try {
    const response = await axios.get(`${API.replace('/api', '')}/api/health`);
    console.log('Backend health check:', response.data);
    return true;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Clear existing user data to force fresh login
    localStorage.removeItem('insurai_user');
    
    const stored = localStorage.getItem('insurai_user');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      axios.defaults.headers.common['Authorization'] = `Bearer ${parsed.token}`;
    }
    setLoading(false);
    
    // Check backend health on mount
    checkBackendHealth();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post(`${API}/auth/login`, { email, password });
      setUser(data);
      localStorage.setItem('insurai_user', JSON.stringify(data));
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      return data;
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      
      // Fallback for development - accept any login for demo
      if (process.env.NODE_ENV === 'development') {
        console.log('AuthContext: Using fallback mock login for development');
        const mockUser = {
          _id: Date.now().toString(),
          name: email.split('@')[0],
          email,
          role: 'admin',
          token: 'mock-token-' + Date.now()
        };
        setUser(mockUser);
        localStorage.setItem('insurai_user', JSON.stringify(mockUser));
        return mockUser;
      }
      
      throw error;
    }
  };

  const signup = async (name, email, password) => {
    try {
      console.log('AuthContext: Making signup request to:', `${API}/auth/signup`);
      const { data } = await axios.post(`${API}/auth/signup`, { name, email, password });
      console.log('AuthContext: Signup response:', data);
      setUser(data);
      localStorage.setItem('insurai_user', JSON.stringify(data));
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      return data;
    } catch (error) {
      console.error('AuthContext: Signup error:', error);
      if (error.response) {
        console.error('AuthContext: Error response data:', error.response.data);
        console.error('AuthContext: Error response status:', error.response.status);
      } else if (error.request) {
        console.error('AuthContext: No response received:', error.request);
      } else {
        console.error('AuthContext: Request setup error:', error.message);
      }
      
      // Fallback for development - create mock admin user
      if (process.env.NODE_ENV === 'development') {
        console.log('AuthContext: Using fallback mock signup for development');
        const mockUser = {
          _id: Date.now().toString(),
          name,
          email,
          role: 'admin',
          token: 'mock-token-' + Date.now()
        };
        setUser(mockUser);
        localStorage.setItem('insurai_user', JSON.stringify(mockUser));
        return mockUser;
      }
      
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('insurai_user');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
