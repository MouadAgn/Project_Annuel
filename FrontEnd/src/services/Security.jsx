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
    console.log(user);

    useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            setUser({
                roles: Array.isArray(decodedToken.roles) ? decodedToken.roles[0] : decodedToken.roles,
                activated: decodedToken.activated,
            });
        } catch (error) {
            localStorage.removeItem('token');
            setUser(null);
            navigate('/');
        }
    } else {
        setUser(null);
    }
    setLoading(false);
    }, [navigate]);

    // Used to update user data in the context
    const updateUser = (userData) => {
        setUser(userData);
    };

    if (loading) {
        return <div>Chargement...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, setUser, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;