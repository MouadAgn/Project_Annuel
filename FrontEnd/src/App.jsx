import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from '@pages/dashboard'
import AddFile from '@pages/addFile'
import ListFile from '@pages/listFile'
import Profile from '@pages/profile/profile'
import Logout from '@components/logout'
import Login from '@pages/LoginRegister'

import AuthContext, { AuthProvider } from '@services/Security';
import React, { useContext } from 'react';

// Route to redirect
const ProtectedRoute = ({ children, role }) => {
    const { user } = useContext(AuthContext);
    console.log(user);

    // If user is not logged in, redirect to login page
    if (!user) {
        return <Navigate to="/" />;
    }

    // If user is not authorized, redirect to profile page
    if (role && user !== role) {
        return <Navigate to="/profile" />;
    }

    return children;
}

// Route to redirect to profile if user is already logged in
const LoginRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user) {
        return <Navigate to="/profile" />;
    }

    return children;
}

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={
                    <LoginRoute>
                        <Login />
                    </LoginRoute>
                } />
                <Route path="/logout" element={
                        <Logout />
                } />
                <Route path="/listFile" element={
                    <ProtectedRoute role="ROLE_USER">
                        <ListFile />
                    </ProtectedRoute>
                } />
                <Route path="/addFile" element={
                    <ProtectedRoute role="ROLE_USER">
                        <AddFile />
                    </ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                    <ProtectedRoute role="ROLE_ADMIN">
                        <Dashboard />
                    </ProtectedRoute>
                } />
                <Route path="/profile" element={
                    <ProtectedRoute role="ROLE_USER">
                        <Profile />
                    </ProtectedRoute>
                } />
                <Route path="*" element={<Navigate to="/profile" />} />
            </Routes>
        </AuthProvider>
    )
}

export default App
