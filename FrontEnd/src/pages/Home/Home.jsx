import React, { useState } from 'react';
import ListFile from '../ListFile/ListFile';
import FolderFileList from '../FolderFileList/FolderFileList';
import SideBar from '../../components/SideBar/SideBar';
import SearchFilter from '../../components/SearchFilter/SearchFilter';
import AddFile_Folder from '../AddFile_Folder/AddFile_Folder'; 

import './Home.css';

const Home = () => {
    const [filteredFiles, setFilteredFiles] = useState([]);
    const [hiddenFiles, setHiddenFiles] = useState([]);

    const handleFilteredFilesChange = (files) => {
        setFilteredFiles(files);
    };

    const handleFileMove = (fileId) => {
        setHiddenFiles(prevHiddenFiles => [...prevHiddenFiles, fileId]);
    };

    return (
        <div className="task-app">
            <SideBar />
            <main className="main-content">
                <div className="content-container">
                    <div className="top-bar">
                        <SearchFilter 
                            onFilteredFilesChange={handleFilteredFilesChange}
                        />
                       <AddFile_Folder />
                       
                    </div>

                    {/* La liste des dossiers jaunes est affichée ici */}
                    <FolderFileList files={filteredFiles} />

                    {/* Liste des fichiers avec possibilité de masquer */}
                    <div className="files-table-container">
                        <ListFile 
                            files={filteredFiles.filter(file => !hiddenFiles.includes(file.id))}
                            onFileMove={handleFileMove}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;