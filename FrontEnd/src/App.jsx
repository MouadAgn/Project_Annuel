// import './App.css'

import { Routes, Route } from 'react-router-dom'
import AddFile from './pages/AddFile/AddFile'
import ListFile from './pages/ListFile/ListFile'
import FolderCreation from './pages/FolderCreation'
import ListFolders from './pages/ListFolder/ListFolder'
import DeleteFolders from './pages/DeleteFolder'
import AddFileToFolder from './pages/AddFileToFolder/AddFileToFolder'
import FilesInFolder from './pages/FolderFileList/FolderFileList'
import Home from './pages/Home/Home'

function App() {
  return (
    <>
      <Routes>
        
        <Route path="/home" element={<Home />} />
        <Route path="/listFile" element={<ListFile />} />
        <Route path="/addFile" element={<AddFile />} />
        <Route path="/folderCreation" element={<FolderCreation />} />
        <Route path="/listFolder" element={<ListFolders />} />
        <Route path="/DeleteFolder" element={<DeleteFolders />} />
        <Route path="/addFileToFolder" element={<AddFileToFolder />} />
        <Route path="/filesInFolder" element={<FilesInFolder />} />
        
      </Routes>
    </>
  )
}

export default App
