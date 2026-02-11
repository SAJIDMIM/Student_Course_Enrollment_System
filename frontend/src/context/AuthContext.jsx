// src/context/AuthContext.jsx
import React, { createContext, useContext, useState } from "react";

// Create AuthContext
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Login function
  const login = async (email, password) => {
    // Hardcoded admin login
    const ADMIN_CREDENTIALS = {
      email: "admin@campus.com",
      password: "Admin123",
    };

    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      setUser({ role: "admin", name: "Admin", email });
      return true;
    }

    // Call backend login if needed
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) return false;
      const data = await res.json();
      setUser({ role: "student", name: data.name, email });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);
