import React, { useState } from 'react';
import { Plus, File, Folder } from 'lucide-react';
import Swal from 'sweetalert2';
import axios from 'axios';
import './AddFile_Folder.css';

const AddFile_Folder = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isFileModalOpen, setIsFileModalOpen] = useState(false);
    const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [folderName, setFolderName] = useState('');
    const [progress, setProgress] = useState(0);

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
    const openFileModal = () => { setIsFileModalOpen(true); setIsDropdownOpen(false); };
    const openFolderModal = () => { setIsFolderModalOpen(true); setIsDropdownOpen(false); };
    const closeFileModal = () => {
        setIsFileModalOpen(false);
        setSelectedFile(null);
        setProgress(0);
    };
    const closeFolderModal = () => {
        setIsFolderModalOpen(false);
        setFolderName('');
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setProgress(0);
    };

    const handleFileSubmit = (event) => {
        event.preventDefault();
    
        if (!selectedFile) {
            Swal.fire('Erreur', 'Veuillez sélectionner un fichier', 'error');
            return;
        }
    
        const maxFileSize = 20 * 1024 * 1024 * 1024; // 20 Go en octets
    
        if (selectedFile.size > maxFileSize) {
            Swal.fire('Erreur', 'Le fichier ne doit pas dépasser 20 Go', 'error');
            return;
        }
    
        const formData = new FormData();
        formData.append('file', selectedFile);
    
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://127.0.0.1:8000/api/add-file', true);
    
        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percentComplete = (event.loaded / event.total) * 100;
                setProgress(percentComplete);
            }
        };
    
        xhr.onload = () => {
            if (xhr.status === 200) {
                Swal.fire('Succès', 'Fichier uploadé avec succès', 'success');
                closeFileModal();
                
            } else {
                Swal.fire('Erreur', 'Erreur lors de l\'upload du fichier', 'error');
            }
        };
    
        xhr.onerror = () => {
            Swal.fire('Erreur', 'Erreur de réseau', 'error');
        };
    
        xhr.send(formData);
    };
    

    const handleFolderSubmit = async (event) => {
        event.preventDefault();
        if (!folderName.trim()) {
            Swal.fire('Erreur', 'Veuillez entrer un nom de dossier', 'error');
            return;
        }

        try {
            const response = await axios.post('https://127.0.0.1:8000/api/folders', {
                name: folderName
            });

            Swal.fire('Succès', 'Dossier créé avec succès', 'success');
            setFolderName('');
            closeFolderModal();
            // Ici, vous pouvez ajouter une logique pour mettre à jour la liste des dossiers si nécessaire
        } catch (error) {
            console.error('Erreur lors de la création du dossier:', error);
            Swal.fire('Erreur', 'Une erreur est survenue lors de la création du dossier', 'error');
        }
    };

    return (
        <div className="file-management-container">
            <div className="new-button-container">
                <button className="new-button" onClick={toggleDropdown}>
                    <Plus size={16} />
                    NEW
                </button>
                {isDropdownOpen && (
                    <div className="dropdown-menu">
                        <button onClick={openFileModal}>
                            <File size={16} /> Add File
                        </button>
                        <button onClick={openFolderModal}>
                            <Folder size={16} /> Add Folder
                        </button>
                    </div>
                )}
            </div>

            {isFileModalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-content">
                            <h2>Uploader un fichier</h2>
                            <form onSubmit={handleFileSubmit} className="file-upload-form">
                                <div className="file-input-container">
                                    <input 
                                        type="file" 
                                        onChange={handleFileChange} 
                                        className="file-input"
                                        id="file-input"
                                    />
                                    <label htmlFor="file-input" className="file-input-label">
                                        {selectedFile ? selectedFile.name : "Choisir un fichier"}
                                    </label>
                                </div>
                                <button type="submit" className="upload-button">Uploader le fichier</button>
                            </form>
                            {progress > 0 && progress < 100 && (
                                <div className="progress-bar">
                                    <div className="progress" style={{width: `${progress}%`}}></div>
                                </div>
                            )}
                            <button className="close-modal" onClick={closeFileModal}>Fermer</button>
                        </div>
                    </div>
                </div>
            )}

            {isFolderModalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-content">
                            <h2>Créer un nouveau dossier</h2>
                            <form onSubmit={handleFolderSubmit} className="folder-creation-form">
                                <div className="input-container">
                                    <Folder size={20} />
                                    <input
                                        type="text"
                                        value={folderName}
                                        onChange={(e) => setFolderName(e.target.value)}
                                        placeholder="Nom du dossier"
                                        className="folder-input"
                                    />
                                </div>
                                <button type="submit" className="create-folder-button">Créer le dossier</button>
                            </form>
                            <button className="close-modal" onClick={closeFolderModal}>Fermer</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddFile_Folder;