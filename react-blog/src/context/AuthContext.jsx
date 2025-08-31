import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState(localStorage.getItem('username'));
  const [userId, setUserId] = useState(localStorage.getItem('userId'));

  // This effect synchronizes the component's state with localStorage when the app first loads
  useEffect(() => {
    // 👇 Fixed: Declare the variables by getting them from localStorage before using them
    const storedToken = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    const storedUserId = localStorage.getItem('userId');
    
    if (storedToken) {
      setToken(storedToken);
      setUsername(storedUsername);
      setUserId(storedUserId);
    }
  }, []); // The empty array ensures this runs only once

  const login = (newToken, newUsername, newUserId) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('username', newUsername);
    localStorage.setItem('userId', newUserId);
    setToken(newToken);
    setUsername(newUsername);
    setUserId(newUserId);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    setToken(null);
    setUsername(null);
    setUserId(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, username, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);