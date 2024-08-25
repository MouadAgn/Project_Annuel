import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from '@pages/Dashboard'
// import AddFile from '@pages/addFile'
// import ListFile from '@pages/listFile'
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
                    <ProtectedRoute role="ROLE_USER">
                        <Profile />
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
            </Routes>
        </AuthProvider>
    )

}

export default App
