// src/context/authContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  });

  useEffect(() => {
    if (!user) {
      const fetchProfile = async () => {
        try {
          const response = await axios.get('/profile');
          setUser(response.data);
        } catch (error) {
          console.error('No authenticated user');
        }
      };

      fetchProfile();
    }
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post('/login', { username, password });
      const { data: responseData } = response;

      if (responseData.error) {
        throw new Error(responseData.error);
      }
      setUser(responseData);
      localStorage.setItem('user', JSON.stringify(responseData)); // Save user data in localStorage
      return responseData;
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.post('/logout');
      setUser(null);
      localStorage.removeItem('user'); // Remove user data from localStorage
    } catch (error) {
      console.error('Logout failed', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
