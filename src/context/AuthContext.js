'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '@/services/api';

// 1. Create the context
const AuthContext = createContext(null);

// 2. Create the provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // This effect runs when the component mounts to check for a token in localStorage
  useEffect(() => {
    try { // Wrap in a try...finally block for robustness
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
          const decodedUser = jwtDecode(storedToken);
          setUser({ email: decodedUser.sub, role: decodedUser.role });
          setToken(storedToken);
          api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      }
    } catch (error) {
      console.error("Invalid or expired token:", error);
      // Ensure any bad token is cleared
      localStorage.removeItem('authToken');
      setUser(null);
      setToken(null);
      delete api.defaults.headers.common['Authorization'];
    } finally {
      // FIX #1: Set loading to false after the check is complete.
      // This is the most important fix.
      setLoading(false);
    }
  }, []); // The empty dependency array is correct, so this only runs once on mount

  const login = (newToken) => {
    localStorage.setItem('authToken', newToken);
    const decodedUser = jwtDecode(newToken);
    setUser({ email: decodedUser.sub, role: decodedUser.role });
    setToken(newToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    // No need to set loading here, as this is a specific user action
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setToken(null);
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    // FIX #2: Add the `loading` state to the value passed to consumers.
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Create a custom hook for easy access to the context
export function useAuth() {
  return useContext(AuthContext);
}