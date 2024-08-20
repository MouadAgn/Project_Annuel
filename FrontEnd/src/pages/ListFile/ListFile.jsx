import React, { useEffect, useState } from 'react';
import { Download, Trash2 } from 'lucide-react';
import './ListFile.css';  // Assuming you save the CSS in a file named ListFile.css

const ListFile = () => {
    const [files, setFiles] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetch(`https://127.0.0.1:8000/api/list-files`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network error when fetching files');
                }
                return response.json();
            })
            .then(data => setFiles(data))
            .catch(error => setError(error));
    }, []);

    const handleDelete = (filename) => {
        fetch(`https://127.0.0.1:8000/api/delete-file/${filename}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error deleting the file');
            }
            setFiles(prevFiles => prevFiles.filter(file => file.name_file !== filename));
        })
        .catch(error => console.error('Error deleting the file:', error));
    };

    const getFileName = (name_file) => {
        return name_file.split('.').slice(0, -1).join('.');
    };

    const filteredFiles = files.filter(file => {
        const searchLower = searchTerm.toLowerCase();
        return file.name_file.toLowerCase().includes(searchLower) || 
               file.upload_date.toLowerCase().includes(searchLower);
    });

    return (
        <div className="files-table-container">
           
            {error ? (
                <div style={{ color: 'red' }}>Erreur : {error.message}</div>
            ) : (
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
                        {filteredFiles.map((file, index) => (
                            <tr key={index}>
                                <td>
                                    <a 
                                        href={`http://127.0.0.1:8000/uploads/${file.name_file}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                    >
                                        {getFileName(file.name_file)}
                                    </a>
                                </td>
                                <td>{file.weight ? file.weight.toFixed(2) + ' MB' : 'N/A'}</td>
                                <td>{file.format ? file.format.toUpperCase() : 'N/A'}</td>
                                <td>{file.upload_date}</td>
                                <td>
                                    <button className="action-button"><Download size={16} /></button>
                                    <button className="action-button" onClick={() => handleDelete(file.name_file)}><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ListFile;
