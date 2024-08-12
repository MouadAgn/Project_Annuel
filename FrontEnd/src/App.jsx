// import './App.css'

import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/dashboard'
import AddFile from './pages/addFile'
import ListFile from './pages/listFile'
import Profile from './pages/profile/profile'
import Logout from './components/logout'

import Login from './pages/login'

function App() {
    return (
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/listFile" element={<ListFile />} />
                <Route path="/addFile" element={<AddFile />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
    )
}

export default App
