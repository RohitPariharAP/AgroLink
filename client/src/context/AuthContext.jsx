// client/src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import API from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if a user is already logged in when the app loads
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (phone, password) => {
    const response = await API.post('/auth/login', { phone, password });
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data));
    setUser(response.data);
  };

  const register = async (userData) => {
    const response = await API.post('/auth/register', userData);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data));
    setUser(response.data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user,setUser, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};