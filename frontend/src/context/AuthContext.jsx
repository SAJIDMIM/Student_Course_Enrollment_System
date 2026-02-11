// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Create AuthContext
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configure axios defaults
  const api = axios.create({
    baseURL: "http://localhost:5000/api",
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Check localStorage for existing session
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        
        if (storedUser && token) {
          // Set authorization header for all future requests
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error("Error initializing auth:", err);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function - Calls backend API only
  const login = async (email, password) => {
    setError(null);
    
    try {
      const response = await api.post("/auth/login", {
        email: email.trim(),
        password
      });

      if (response.data.success) {
        const userData = {
          id: response.data.user?.id || response.data.id,
          email: response.data.email || email,
          role: response.data.role || "admin",
          name: response.data.name || "Administrator",
          token: response.data.token
        };
        
        // Store token in localStorage
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          // Set authorization header for all future requests
          api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        }
        
        // Store user data
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        
        return { success: true, data: userData };
      }
      
      return { success: false, error: "Login failed" };
      
    } catch (err) {
      console.error("Login error:", err);
      
      let errorMessage = "Unable to connect to server. Please try again.";
      
      if (err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK') {
        errorMessage = "Cannot connect to server. Please ensure backend is running.";
      } else if (err.response) {
        // Server responded with error
        errorMessage = err.response.data?.message || err.response.data?.error || "Invalid email or password";
      } else if (err.request) {
        // Request made but no response
        errorMessage = "No response from server. Please check your connection.";
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    // Remove authorization header
    delete api.defaults.headers.common['Authorization'];
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user;
  };

  // Get auth token
  const getToken = () => {
    return localStorage.getItem("token");
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      loading, 
      error,
      clearError,
      isAuthenticated,
      getToken,
      api 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};