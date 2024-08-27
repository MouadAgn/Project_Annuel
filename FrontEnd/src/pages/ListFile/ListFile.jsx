import React, { useState } from 'react';
import { Download, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import Swal from 'sweetalert2';
import './ListFile.css';

const ListFile = ({ files }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [filesPerPage] = useState(4);

    const handleDelete = (filename) => {
        Swal.fire({
            title: 'Êtes-vous sûr?',
            text: `Voulez-vous vraiment supprimer le fichier ${filename}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, supprimer!',
            cancelButtonText: 'Annuler'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteFile(filename);
            }
        });
    };

    const deleteFile = (filename) => {
        fetch(`https://127.0.0.1:8000/api/delete-file/${filename}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error deleting the file');
            }
            Swal.fire(
                'Supprimé!',
                `Le fichier ${filename} a été supprimé.`,
                'success'
            );
            // You might want to trigger a re-fetch of files in the parent component here
        })
        .catch(error => {
            console.error('Error deleting the file:', error);
            Swal.fire(
                'Erreur!',
                'Une erreur est survenue lors de la suppression du fichier.',
                'error'
            );
        });
    };

    const handleDownload = (filename) => {
        window.open(`http://127.0.0.1:8000/uploads/${filename}`, '_blank');
    };

    const getFileName = (name_file) => {
        return name_file.split('.').slice(0, -1).join('.');
    };

    // Pagination logic
    const indexOfLastFile = currentPage * filesPerPage;
    const indexOfFirstFile = indexOfLastFile - filesPerPage;
    const currentFiles = files.slice(indexOfFirstFile, indexOfLastFile);

    const totalPages = Math.ceil(files.length / filesPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
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
                    {currentFiles.map((file, index) => (
                        <tr 
                            key={index}
                            draggable
                            onDragStart={(e) => {
                                console.log(`File drag started: ${file.id}`);
                                e.dataTransfer.setData('fileId', file.id);
                            }}
                        >
                            <td>{getFileName(file.name_file)}</td>
                            <td>{file.weight ? file.weight.toFixed(2) + ' MB' : 'N/A'}</td>
                            <td>{file.format ? file.format.toUpperCase() : 'N/A'}</td>
                            <td>{file.upload_date}</td>
                            <td>
                                <button className="action-button" onClick={() => handleDownload(file.name_file)}><Download size={16} /></button>
                                <button className="action-button" onClick={() => handleDelete(file.name_file)}><Trash2 size={16} /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                <button 
                    className="pagination-arrow" 
                    onClick={() => paginate(currentPage - 1)} 
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
                    onClick={() => paginate(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default ListFile;