import React, { useState } from 'react';
import { Plus, File, Folder } from 'lucide-react';
import Swal from 'sweetalert2';
import Api from '../../services/API';
import './AddFile_Folder.css';

const api = new Api();

const AddFile_Folder = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isFileModalOpen, setIsFileModalOpen] = useState(false);
    const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [folderName, setFolderName] = useState('');

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
    const openFileModal = () => { setIsFileModalOpen(true); setIsDropdownOpen(false); };
    const openFolderModal = () => { setIsFolderModalOpen(true); setIsDropdownOpen(false); };
    const closeFileModal = () => {
        setIsFileModalOpen(false);
        setSelectedFile(null);
    };
    const closeFolderModal = () => {
        setIsFolderModalOpen(false);
        setFolderName('');
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleFileSubmit = async (event) => {
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
    
        try {
            const token = localStorage.getItem('token'); // Récupérer le token du localStorage
            if (!token) {
                throw new Error('No authentication token found');
            }
            
            await api.addFile(token, formData);
            Swal.fire('Succès', 'Fichier uploadé avec succès', 'success');
            closeFileModal();
            refreshFileList();
        } catch (error) {
            console.error('Erreur lors de l\'upload du fichier:', error);
            Swal.fire('Erreur', error.message || 'Erreur lors de l\'upload du fichier', 'error');
        }
    };

    const handleFolderSubmit = async (event) => {
        event.preventDefault();
        if (!folderName.trim()) {
            Swal.fire('Erreur', 'Veuillez entrer un nom de dossier', 'error');
            return;
        }

        try {
            await api.createFolder(folderName);
            Swal.fire('Succès', 'Dossier créé avec succès', 'success');
            setFolderName('');
            closeFolderModal();
            refreshFolderList();
        } catch (error) {
            console.error('Erreur lors de la création du dossier:', error);
            Swal.fire('Erreur', 'Une erreur est survenue lors de la création du dossier', 'error');
        }
    };

    const refreshFileList = async () => {
        try {
            const files = await api.listFiles();
            window.dispatchEvent(new CustomEvent('refreshFiles', { detail: files }));
        } catch (error) {
            console.error('Erreur lors du rafraîchissement de la liste des fichiers:', error);
        }
    };

    const refreshFolderList = async () => {
        try {
            const folders = await api.listFolders();
            window.dispatchEvent(new CustomEvent('refreshFolders', { detail: folders }));
        } catch (error) {
            console.error('Erreur lors du rafraîchissement de la liste des dossiers:', error);
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