import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from '@pages/Dashboard'
import Profile from '@pages/profile/profile'
import Logout from '@components/logout'
import Login from '@pages/LoginRegister'
import AddFile from '@pages/AddFile/AddFile'
import ListFile from '@pages/ListFile/ListFile'
import FolderCreation from '@pages/FolderCreation'
import ListFolders from '@pages/ListFolder/ListFolder'
import DeleteFolders from '@pages/DeleteFolder'
import AddFileToFolder from '@pages/AddFileToFolder/AddFileToFolder'
import FilesInFolder from '@pages/FolderFileList/FolderFileList'
import Home from '@pages/Home/Home'
import SideBar from '@components/SideBar/SideBar'
import InvoicesPage from '@pages/Invoices/invoices'; 


import AuthContext, { AuthProvider } from '@services/Security';
import React, { useContext } from 'react';

import './App.css'

// Route to redirect
const ProtectedRoute = ({ children, role }) => {
    const { user } = useContext(AuthContext);
    // console.log(user);

    // If role is an array, check if user's role is included
    if (Array.isArray(role) && !role.includes(user)) {
        return <Navigate to="/profile" />;
    }

    // If role is a string, check if it matches user's role
    if (typeof role === 'string' && user !== role) {
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
                <Route path="/home" element={
                    <ProtectedRoute role="ROLE_USER">
                        <Home />
                    </ProtectedRoute>
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
                    <ProtectedRoute role={["ROLE_USER", "ROLE_ADMIN"]} >
                        <div className="principal-container">
                            <SideBar />
                            <Profile />
                        </div>
                    </ProtectedRoute>
                } />
                <Route path="/folderCreation" element={
                    <ProtectedRoute role="ROLE_USER">
                        <FolderCreation />
                    </ProtectedRoute>
                } />
                <Route path="/listFolder" element={
                    <ProtectedRoute role="ROLE_USER">
                        <ListFolders />
                    </ProtectedRoute>
                } />
                <Route path="/DeleteFolder" element={
                    <ProtectedRoute role="ROLE_USER">
                        <DeleteFolders />
                    </ProtectedRoute>
                } />
                <Route path="/addFileToFolder" element={
                    <ProtectedRoute role="ROLE_USER">
                        <AddFileToFolder />
                    </ProtectedRoute>
                } />
                <Route path="/filesInFolder" element={
                    <ProtectedRoute role="ROLE_USER">
                        <FilesInFolder />
                    </ProtectedRoute>
                } />
                <Route path="/invoices" element={
                    <ProtectedRoute role={["ROLE_USER", "ROLE_ADMIN"]}>
                        <div className="principal-container">
                            <SideBar />
                            <InvoicesPage />
                        </div>
                    </ProtectedRoute>
                } />
            </Routes>
            
        </AuthProvider>
    )

}

export default App
