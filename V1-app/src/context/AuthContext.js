// context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

// Your backend API URL - Replace with your actual IP address
const API_URL = 'http://192.168.1.9:5000/api/auth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('authToken');
      const storedUser = await AsyncStorage.getItem('userData');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (signupData) => {
    try {
      console.log('Attempting signup with:', { ...signupData, password: '***' });
      
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });

      const data = await response.json();
      console.log('Signup response:', data);

      if (response.ok && data.success) {
        // Store token and user data
        await AsyncStorage.setItem('authToken', data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(data.user));
        
        setToken(data.token);
        setUser(data.user);

        return {
          success: true,
          user: data.user,
          message: data.message || 'Account created successfully',
        };
      } else {
        return {
          success: false,
          error: data.error || 'Signup failed',
        };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        error: 'Network error. Please check your connection and make sure the server is running.',
      };
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      console.log('Attempting login with:', email);
      
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (response.ok && data.success) {
        // Store token and user data
        await AsyncStorage.setItem('authToken', data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(data.user));
        
        setToken(data.token);
        setUser(data.user);

        return {
          success: true,
          user: data.user,
          message: data.message || 'Login successful',
        };
      } else {
        return {
          success: false,
          error: data.error || 'Login failed',
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Network error. Please check your connection and make sure the server is running.',
      };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userData');
      
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Get user profile
  const getProfile = async () => {
    try {
      const response = await fetch(`${API_URL}/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUser(data.user);
        await AsyncStorage.setItem('userData', JSON.stringify(data.user));
        return {
          success: true,
          user: data.user,
        };
      } else {
        return {
          success: false,
          error: data.error || 'Failed to fetch profile',
        };
      }
    } catch (error) {
      console.error('Get profile error:', error);
      return {
        success: false,
        error: 'Network error. Please check your connection.',
      };
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      const response = await fetch(`${API_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUser(data.user);
        await AsyncStorage.setItem('userData', JSON.stringify(data.user));
        return {
          success: true,
          user: data.user,
          message: data.message,
        };
      } else {
        return {
          success: false,
          error: data.error || 'Failed to update profile',
        };
      }
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        error: 'Network error. Please check your connection.',
      };
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await fetch(`${API_URL}/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return {
          success: true,
          message: data.message,
        };
      } else {
        return {
          success: false,
          error: data.error || 'Failed to change password',
        };
      }
    } catch (error) {
      console.error('Change password error:', error);
      return {
        success: false,
        error: 'Network error. Please check your connection.',
      };
    }
  };

  const value = {
    user,
    token,
    loading,
    signup,
    login,
    logout,
    getProfile,
    updateProfile,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};