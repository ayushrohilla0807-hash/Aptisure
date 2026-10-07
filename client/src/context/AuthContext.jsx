import React, { createContext, useState, useEffect } from 'react';
import * as authService from '../api/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const stored = localStorage.getItem('aptisure_user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setUser(parsed);
          // Optional background refresh of profile
          const latestProfile = await authService.getMe();
          if (latestProfile) {
            const updated = { ...parsed, ...latestProfile };
            setUser(updated);
            localStorage.setItem('aptisure_user', JSON.stringify(updated));
          }
        } catch (e) {
          console.error('Session validation error:', e);
          localStorage.removeItem('aptisure_user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    setUser(data);
    localStorage.setItem('aptisure_user', JSON.stringify(data));
    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    setUser(data);
    localStorage.setItem('aptisure_user', JSON.stringify(data));
    return data;
  };

  const logout = () => {
    localStorage.removeItem('aptisure_user');
    setUser(null);
  };

  const updateUserState = (updatedUserData) => {
    const updated = { ...user, ...updatedUserData };
    setUser(updated);
    localStorage.setItem('aptisure_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUserState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
