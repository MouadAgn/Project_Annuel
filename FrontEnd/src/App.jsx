// import './App.css'

import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/dashboard'
import AddFile from './pages/addFile'
import ListFile from './pages/listFile'
import Login from './pages/login'

function App() {
  return (
    <>
      <Routes>
        {/* <Route path="/" element={<Login />} /> */}
        <Route path="/listFile" element={<ListFile />} />
        <Route path="/addFile" element={<AddFile />} />
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  )
}

export default App
