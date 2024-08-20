import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

// Context to manage user authentication, accessible from any component
export const AuthContext = createContext();

// Provider to manage user authentication
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          setUser(decodedToken.roles[0]);
        } catch (error) {
          localStorage.removeItem('token');
          setUser(null);
          navigate('/');
        }
      }
      setLoading(false);
    }, []);

    if (loading) {
      return <div>Chargement...</div>;
    }

    return (
      <AuthContext.Provider value={{ user, setUser }}>
        {children}
      </AuthContext.Provider>
    );
};

export default AuthContext;