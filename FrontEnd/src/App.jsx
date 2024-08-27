import { Routes, Route, Navigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

import Dashboard from '@pages/Dashboard/Dashboard'
import Profile from '@pages/profile/profile'
import Logout from '@components/logout'
import Login from '@pages/LoginRegister'
import AddFile from '@pages/AddFile_Folder/AddFile_Folder'
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
const ProtectedRoute = ({ element: Element, roles, requireActivation = true }) => {
    const { user } = useContext(AuthContext);
    const location = useLocation();
  
    // User not logged in
    if (!user) {
      return <Navigate to="/" state={{ from: location }} replace />;
    }
  
    // User not activated
    if (requireActivation && !user.activated) {
      return <Navigate to="/profile" replace />;
    }
  
    // Role not authorized
    if (roles && !roles.includes(user.roles)) {
      return <Navigate to={user.roles === "ROLE_ADMIN" ? "/dashboard" : "/home"} replace />;
    }
  
    // Everything is fine, we can shot it
    return <Element />;
  };

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
                    </LoginRoute>} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/listFile" element={<ProtectedRoute element={ListFile} roles={["ROLE_USER"]} />} />
                <Route path="/addFile" element={<ProtectedRoute element={AddFile} roles={["ROLE_USER"]} />} />
                <Route path="/dashboard" element={<ProtectedRoute element={Dashboard} roles={["ROLE_ADMIN"]} />} />
                <Route path="/home" element={<ProtectedRoute element={Home} roles={["ROLE_USER", "ROLE_ADMIN"]} />} />
                <Route path="/invoices" element={<ProtectedRoute element={InvoicesPage} roles={["ROLE_USER"]} />} />
                <Route path="/profile" element={
                <ProtectedRoute 
                    element={() => (
                    <div className="principal-container">
                        <SideBar />
                        <Profile />
                    </div>
                    )} 
                    roles={["ROLE_USER", "ROLE_ADMIN"]}
                    requireActivation={false}
                />
                } />
                <Route path="/invoices" element={
                    <ProtectedRoute 
                        element={() => (
                            <div className="principal-container">                                
                                    <SideBar />
                                    <Invoices />
                            </div>
                        )}
                        roles={["ROLE_USER"]}
                        requireActivation={true}
                    />
                } />
                <Route path="/folderCreation" element={<ProtectedRoute element={FolderCreation} roles={["ROLE_USER"]} />} />
                <Route path="/listFolder" element={<ProtectedRoute element={ListFolders} roles={["ROLE_USER"]} />} />
                <Route path="/DeleteFolder" element={<ProtectedRoute element={DeleteFolders} roles={["ROLE_USER"]} />} />
                <Route path="/addFileToFolder" element={<ProtectedRoute element={AddFileToFolder} roles={["ROLE_USER"]} />} />
                <Route path="/filesInFolder" element={<ProtectedRoute element={FilesInFolder} roles={["ROLE_USER"]} />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </AuthProvider>
    )

}

export default App
