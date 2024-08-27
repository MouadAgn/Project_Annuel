import { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import Modal from './Modal';
import './FolderFileList.css';
import '../ListFile/ListFile.css';
import Swal from 'sweetalert2';

const FolderFileList = () => {
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [files, setFiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filesPerPage] = useState(3);
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
      // Envoyer la requête DELETE à l'API
      await axios.delete(`https://127.0.0.1:8000/api/folders/${selectedFolder}/files`, {
        data: { fileId: fileId }
      });
    
      // Mettre à jour l'état local en supprimant le fichier de la liste
      setFiles(files.filter(file => file.id !== fileId));
  
      // Notifier l'utilisateur du succès
      Swal.fire('Supprimé !', 'Le fichier a été retiré du dossier.', 'success');
    } catch (error) {
      console.error('Erreur lors de la suppression du fichier:', error);
      Swal.fire('Erreur !', 'Une erreur est survenue lors de la suppression du fichier.', 'error');
    }
  };

  const handleDownload = (fileName, fileUrl) => {
    // Création d'un lien temporaire pour le téléchargement
    const link = document.createElement('a');
    link.href = fileUrl;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFolderDelete = async (folderId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This folder and all its files will be deleted!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`https://127.0.0.1:8000/api/folders/${folderId}`);
        setFolders(folders.filter(folder => folder.id !== folderId));
        closeModal();
        Swal.fire('Deleted!', 'Your folder has been deleted.', 'success');
      } catch (err) {
        Swal.fire('Error!', 'An error occurred while deleting the folder.', 'error');
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
            <button 
              className="delete-folder-button"
              onClick={(e) => {
                e.stopPropagation(); // Prevents triggering folder click event
                handleFolderDelete(folder.id);
              }}
            >
              <Trash2 size={20} />
            </button>
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
                  <th>Date D Upload</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentFiles.map((file) => (
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
              disab led={currentPage === totalPages}
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
