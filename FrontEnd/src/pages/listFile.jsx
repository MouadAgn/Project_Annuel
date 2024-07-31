import React, { useEffect, useState } from 'react';

const ListFile = () => {
    const [files, setFiles] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        console.log('Appel à l\'API pour récupérer la liste des fichiers');
        fetch(`https://127.0.0.1:8000/api/list-files`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur réseau lors de la récupération des fichiers');
                }
                return response.json();
            })
            .then(data => {
                console.log('Données reçues de l\'API:', data);
                setFiles(data);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des fichiers:', error);
                setError(error);
            });
    }, []);

    const handleDelete = (filename) => {
        fetch(`https://127.0.0.1:8000/api/delete-file/${filename}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la suppression du fichier');
            }
            // Mettre à jour la liste des fichiers après la suppression
            setFiles(prevFiles => prevFiles.filter(file => file.name_file !== filename));
        })
        .catch(error => {
            console.error('Erreur lors de la suppression du fichier:', error);
        });
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    // Filtrer les fichiers en fonction du terme de recherche
    const filteredFiles = files.filter(file => {
        const searchLower = searchTerm.toLowerCase();
        return file.name_file.toLowerCase().includes(searchLower) || 
               file.upload_date.toLowerCase().includes(searchLower);
    });

    return (
        <div>
            <h1>Liste des fichiers</h1>
            <input 
                type="text" 
                placeholder="Rechercher par nom, extension, ou date..." 
                value={searchTerm} 
                onChange={handleSearch} 
                style={{ 
                    padding: '10px', 
                    fontSize: '16px', 
                    borderRadius: '5px', 
                    border: '1px solid #ccc',
                    width: '80%' // Ajustez la largeur comme vous le souhaitez
                }} 
            />
            {error ? (
                <div style={{ color: 'red' }}>Erreur : {error.message}</div>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Nom du fichier</th>
                            <th>Date de création</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredFiles.map((file, index) => (
                            <tr key={index}>
                                <td><a href={`http://127.0.0.1:8000/uploads/${file.name_file}`} target="_blank" rel="noopener noreferrer">{file.name_file}</a></td>
                                <td>{file.upload_date}</td>
                                <td><button onClick={() => handleDelete(file.name_file)} style={{ backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer' }}>Supprimer</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ListFile;