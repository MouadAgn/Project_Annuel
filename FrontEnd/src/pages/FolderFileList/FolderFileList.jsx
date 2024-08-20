import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, Trash2 } from 'lucide-react';
import Modal from './Modal';
import './FolderFileList.css';
import '../ListFile/ListFile.css';

const FolderFileList = () => {
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await axios.get('https://127.0.0.1:8000/api/folders');
        setFolders(response.data);
      } catch (err) {
        setError('An error occurred while loading folders');
      }
    };

    fetchFolders();
  }, []);

  const handleFolderClick = async (folderId) => {
    try {
      const response = await axios.get(`https://127.0.0.1:8000/api/folders/${folderId}/files`);
      setFiles(response.data);
      setSelectedFolder(folderId);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const closeModal = () => {
    setSelectedFolder(null);
    setFiles([]);
  };

  const handleDelete = async (fileId) => {
    try {
      await axios.delete(`https://127.0.0.1:8000/api/files/${fileId}`);
      setFiles(files.filter(file => file.id !== fileId));
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const handleDownload = async (fileName, fileUrl) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const getFileName = (name_file) => {
    return name_file.split('.').slice(0, -1).join('.');
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="folders-list">
      <ul>
        {folders.map(folder => (
          <li key={folder.id} onClick={() => handleFolderClick(folder.id)}>
            <span className="folder-icon">📁</span>
            <span className="folder-name">{folder.name}</span>
            <span className="folder-file-count">{folder.fileCount} files</span>
          </li>
        ))}
      </ul>

      {selectedFolder && (
        <Modal isOpen={!!selectedFolder} onClose={closeModal}>
          <h3>Files in {folders.find(folder => folder.id === selectedFolder)?.name}</h3>
          <div className="files-table-container">
            <table className="files-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Taille</th>
                  <th>Extension</th>
                  <th>Date D'Upload</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file) => (
                  <tr key={file.id}>
                    <td>
                      <a 
                        href={`http://127.0.0.1:8000/uploads/${file.name}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        {getFileName(file.name)}
                      </a>
                    </td>
                    <td>{file.weight ? file.weight.toFixed(2) + ' MB' : 'N/A'}</td>
                    <td>{file.format ? file.format.toUpperCase() : 'N/A'}</td>
                    <td>{new Date(file.uploadDate).toLocaleDateString()}</td>
                    <td>
                    <button 
                    className="action-button"
                    onClick={() => handleDownload(file.name, `http://127.0.0.1:8000/uploads/${file.name}`)}
                  >
                    <Download size={16} />
                  </button>
                      <button 
                        className="action-button"
                        onClick={() => handleDelete(file.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default FolderFileList;