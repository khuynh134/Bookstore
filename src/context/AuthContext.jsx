import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('token');
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (token) {
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
      }
    } catch (e) {
      // ignore storage errors
    }
  }, [token]);

  const login = (newToken) => {
    if (newToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    }
    setToken(newToken);
  };

  const logout = async () => {
    try {
      // Attempt server-side logout (best-effort). Use axios with credentials to clear httpOnly cookie.
      await axios.post('http://localhost:8081/auth/logout', {}, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {
      // ignore network/server errors
    }

    // Clear client-side token and axios default header
    setToken(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const isAuthenticated = () => {
    if (!token) return false;
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return false;
      const payload = JSON.parse(atob(parts[1]));
      if (!payload.exp) return true;
      return payload.exp * 1000 > Date.now();
    } catch (e) {
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated: isAuthenticated() }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
