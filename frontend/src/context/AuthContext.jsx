import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const [userRes, shopRes] = await Promise.all([
            api.get('/auth/me'),
            api.get('/shop/profile')
          ]);
          setUser(userRes.data);
          setShop(shopRes.data);
        } catch (error) {
          console.error("Token expired or invalid", error);
          localStorage.removeItem('access_token');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = (token, userData, shopData) => {
    localStorage.setItem('access_token', token);
    setUser(userData);
    setShop(shopData);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
    setShop(null);
  };

  return (
    <AuthContext.Provider value={{ user, shop, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
