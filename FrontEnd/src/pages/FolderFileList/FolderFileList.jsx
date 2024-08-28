import React, { useState, useEffect } from 'react';
import { Download, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import Modal from './Modal';
import './FolderFileList.css';
import '../ListFile/ListFile';
import Swal from 'sweetalert2';
import Api from '../../services/API'; // Assume this is the file containing the API methods

const api = new Api();

const FolderFileList = () => {
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [files, setFiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filesPerPage] = useState(3);
  const [error, setError] = useState('');
  const [draggingFile, setDraggingFile] = useState(null);

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      const response = await api.getFolders();
      setFolders(response);
    } catch (err) {
      setError('An error occurred while loading folders');
    }
  };

  const handleFolderClick = async (folderId) => {
    try {
      const response = await api.getFolderFiles(folderId);
      setFiles(response);
      setSelectedFolder(folderId);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const closeModal = () => {
    setSelectedFolder(null);
    setFiles([]);
    setCurrentPage(1);
  };

  const handleDelete = async (fileId) => {
    try {
      await api.deleteFileFromFolder(selectedFolder, fileId);
      setFiles(files.filter(file => file.file_id !== fileId));
      Swal.fire('Deleted!', 'The file has been removed from the folder.', 'success');
      handleFolderClick(selectedFolder);
      fetchFolders();
    } catch (error) {
      console.error('Error deleting file:', error);
      Swal.fire('Error!', 'An error occurred while deleting the file.', 'error');
    }
  };

  const handleDownload = (fileName, fileUrl) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFolderDelete = async (folderId) => {
    const result = await Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Ce dossier et tous ses fichiers seront supprimés définitivement !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimez-le !',
      cancelButtonText: 'Non, gardez-le',
    });

    if (result.isConfirmed) {
      try {
        await api.deleteFolder(folderId);
        setFolders(folders.filter(folder => folder.id !== folderId));
        closeModal();
        Swal.fire('Supprimé', 'Votre dossier et tous ses fichiers ont été supprimés.', 'success');
        fetchFolders();
      } catch (err) {
        Swal.fire('Erreur!', 'Une erreur est survenue lors de la suppression du dossier.', 'error');
      }
    }
  };

  const getFileName = (name_file) => {
    return name_file.split('.').slice(0, -1).join('.');
  };

  const indexOfLastFile = currentPage * filesPerPage;
  const indexOfFirstFile = indexOfLastFile - filesPerPage;
  const currentFiles = files.slice(indexOfFirstFile, indexOfLastFile);

  const totalPages = Math.ceil(files.length / filesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleDragStart = (e, file) => {
    e.dataTransfer.setData('fileId', file.file_id.toString());
    setDraggingFile(file);
  };

  const handleDrop = async (e, folderId) => {
    e.preventDefault();
    const fileId = e.dataTransfer.getData('fileId');
    if (!fileId) {
      Swal.fire('Erreur!', 'Aucun fichier détecté lors du dépôt.', 'error');
      return;
    }
    try {
      await api.addFileToFolder(folderId, fileId);
      setDraggingFile(null);

      fetchFolders();
      if (folderId === selectedFolder) {
        handleFolderClick(folderId);
      }

      Swal.fire('Success!', 'Fichier ajouté avec succès.', 'success');
    } catch (error) {
      console.error('Error adding file to folder:', error);
      Swal.fire('Error!', 'An error occurred while adding the file to the folder.', 'error');
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="folders-list">
      <ul>
        {folders.map(folder => (
          <li 
            key={folder.id} 
            onClick={() => handleFolderClick(folder.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, folder.id)}
          >
            <span className="folder-icon">📁</span>
            <span className="folder-name">{folder.name}</span>
            <span className="folder-file-count">{folder.fileCount} files</span>
            <button 
              className="delete-folder-button"
              onClick={(e) => {
                e.stopPropagation();
                handleFolderDelete(folder.id);
              }}
            >
              <Trash2 size={20} />
            </button>
          </li>
        ))}
      </ul>

      {selectedFolder && (
        <Modal className="modal" isOpen={!!selectedFolder} onClose={closeModal}>
          <h3>Files in {folders.find(folder => folder.id === selectedFolder)?.name}</h3>
          <div className="files-table-container">
            <table className="files-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Size</th>
                  <th>Extension</th>
                  <th>Upload Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentFiles.map((file) => (
                  <tr 
                    key={file.file_id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, file)}
                  >
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
          <div className="pagination">
            <button 
              className="pagination-arrow" 
              onClick={goToPreviousPage} 
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1} 
                onClick={() => paginate(i + 1)} 
                className={`pagination-button ${currentPage === i + 1 ? 'active' : ''}`}
              >
                {i + 1}
              </button>
            ))}
            <button 
              className="pagination-arrow" 
              onClick={goToNextPage} 
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default FolderFileList;