import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAuthToken, setAuthToken, removeAuthToken, getCurrentUser, setCurrentUser, removeCurrentUser } from '../utils/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = getAuthToken();
    const savedUser = getCurrentUser();
    
    if (token && savedUser) {
      setUser(savedUser);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    setAuthToken(token);
    setCurrentUser(userData);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    removeAuthToken();
    removeCurrentUser();
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (userData) => {
    setCurrentUser(userData);
    setUser(userData);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    updateUser,
    isAdmin: user?.role === 'admin',
    isUser: user?.role === 'user'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

