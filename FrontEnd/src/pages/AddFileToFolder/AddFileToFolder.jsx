import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faFile } from '@fortawesome/free-solid-svg-icons';
import './FileManager.css';

const AddFileToFolder = () => {
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchFoldersAndFiles();
  }, []);

  const fetchFoldersAndFiles = async () => {
    try {
      const foldersResponse = await axios.get('https://127.0.0.1:8000/api/folders');
      const filesResponse = await axios.get('https://127.0.0.1:8000/api/list-files');
      setFolders(foldersResponse.data);
      setFiles(filesResponse.data);
    } catch (err) {
      setError('Erreur lors de la récupération des données. Veuillez réessayer.');
      console.error('Détails de l\'erreur:', err);
    }
  };

  const moveFile = async (fileId, folderId) => {
    try {
      const url = `https://127.0.0.1:8000/api/folders/${folderId}/files`;
      const response = await axios.post(url, 
        JSON.stringify({ fileId: fileId }), 
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      fetchFoldersAndFiles(); // Rafraîchir les listes
      setError('');
      setSuccessMessage('Fichier déplacé avec succès !');
      setTimeout(() => setSuccessMessage(''), 3000); // Effacer le message de succès après 3 secondes
    } catch (err) {
      console.error('Erreur lors du déplacement du fichier:', err);
      if (err.response) {
        setError(`Erreur lors du déplacement du fichier: ${err.response.data.error || 'Erreur inconnue'}. Veuillez réessayer.`);
      } else if (err.request) {
        setError('Aucune réponse du serveur. Veuillez réessayer.');
      } else {
        setError(`Erreur: ${err.message}. Veuillez réessayer.`);
      }
    }
  };

  const handleDragStart = (e, fileId) => {
    e.dataTransfer.setData('fileId', fileId);
  };

  const handleDrop = (e, folderId) => {
    const fileId = e.dataTransfer.getData('fileId');
    moveFile(fileId, folderId);
  };

  const allowDrop = (e) => {
    e.preventDefault();
  };

  return (
    <div className="file-manager">
      <h2>Gestionnaire de Fichiers</h2>
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      <div className="folder-section">
        <h3>Dossiers</h3>
        <div className="folder-list">
          {folders.map(folder => (
            <div 
              key={folder.id} 
              className="folder-item" 
              onDrop={(e) => handleDrop(e, folder.id)} 
              onDragOver={allowDrop}
            >
              <FontAwesomeIcon icon={faFolder} className="folder-icon" />
              {folder.name}
            </div>
          ))}
        </div>
      </div>

      <div className="file-section">
        <h3>Fichiers</h3>
        <ul className="file-list">
          {files.map(file => (
            <li 
              key={file.id} 
              className="file-item" 
              draggable 
              onDragStart={(e) => handleDragStart(e, file.file_id)}
            >
              <FontAwesomeIcon icon={faFile} className="file-icon" />
              {file.name_file || file.name || 'Fichier sans nom'}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AddFileToFolder;
