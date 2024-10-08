import React, { useState, useEffect } from 'react';
import SideBar from '../../components/SideBar/SideBar';
import './Dashboard.css';
import Api from '@services/API.jsx';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import SearchFilter from '../../components/SearchFilter/SearchFilter';  // Import du composant SearchFilter

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
    const [errorMessage, setErrorMessage] = useState('');
    const [users, setUsers] = useState([]);
    const [totalStorageUsed, setTotalStorageUsed] = useState(0);
    const [totalStorageCapacity, setTotalStorageCapacity] = useState(0);
    const [files, setFiles] = useState([]);
    const [filteredFiles, setFilteredFiles] = useState([]); // État pour les fichiers filtrés
    const [filesUploadedToday, setFilesUploadedToday] = useState(0);
    const [fileExtensionsData, setFileExtensionsData] = useState({});

    const api = new Api();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const userResponse = await api.getAllUsers(token);
                setUsers(userResponse);

                // Calcul du stockage total utilisé et disponible
                const totalUsed = userResponse.reduce((sum, user) => sum + user.storageUsed, 0);
                const totalCapacity = userResponse.reduce((sum, user) => sum + user.storageCapacity, 0);

                setTotalStorageUsed(totalUsed);
                setTotalStorageCapacity(totalCapacity);

                // Récupération de tous les fichiers
                const allFiles = userResponse.flatMap(user => 
                    user.files.map(file => ({
                        ...file,
                        userName: user.name,
                        userFirstName: user.firstName
                    }))
                );
                setFiles(allFiles);
                setFilteredFiles(allFiles); // Initialisation des fichiers filtrés

                // Calcul du nombre de fichiers uploadés aujourd'hui
                const today = new Date().toISOString().split('T')[0];
                const uploadedToday = allFiles.filter(file => file.uploadDate.startsWith(today)).length;
                setFilesUploadedToday(uploadedToday);

                const extensionsCount = allFiles.reduce((acc, file) => {
                    const extension = file.format;
                    acc[extension] = (acc[extension] || 0) + 1;
                    return acc;
                }, {});

                setFileExtensionsData(extensionsCount);

            } catch (error) {
                setErrorMessage('Error fetching data');
                console.error(error);
            }
        };
        fetchData();
    }, []);

    const handleFilteredFilesChange = (filteredFiles) => {
        setFilteredFiles(filteredFiles);
    };

    const data = {
        labels: ['Stockage Utilisé', 'Stockage Restant'],
        datasets: [
            {
                label: 'Stockage',
                data: [totalStorageUsed, totalStorageCapacity - totalStorageUsed],
                backgroundColor: ['#3498db', '#2ecc71'],
                hoverBackgroundColor: ['#2980b9', '#27ae60'],
            },
        ],
    };

    const extensionsPieData = {
        labels: Object.keys(fileExtensionsData),
        datasets: [
            {
                data: Object.values(fileExtensionsData),
                backgroundColor: ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6'], // Ajouter plus de couleurs si nécessaire
                hoverBackgroundColor: ['#2980b9', '#27ae60', '#c0392b', '#e67e22', '#8e44ad'],
            },
        ],
    };

    const roundToTwoDecimals = (num) => {
        return Math.round(num * 100) / 100;
    };

    return (
        <div className="dashboard-app">
            <SideBar />
            <main className="main-content">
                <div className="content-container">
                    <h1>Dashboard</h1>
                    {errorMessage && <p className="error">{errorMessage}</p>}

                    <div className="storage-pie-chart">
                        <h2>Répartition du Stockage</h2>
                        <div className="pie-container">
                            <Pie data={data} />
                        </div>
                    </div>
                    <div className="users-table-container">
                        <h2>Clients</h2>
                        {users.length > 0 ? (
                            <table className="users-table">
                                <thead>
                                    <tr>
                                        <th>Nom</th>
                                        <th>Prénom</th>
                                        <th>Stockage Utilisé</th>
                                        <th>Stockage Disponible</th>
                                        <th>% Utilisation</th>
                                        <th>Nombre de Fichiers</th>
                                        <th>Date de Création</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.id}>
                                            <td>{user.name}</td>
                                            <td>{user.firstName}</td>
                                            <td>{user.storageUsed} GB</td>
                                            <td>{user.storageCapacity - user.storageUsed} GB</td>
                                            <td>{user.storageUsagePercentage} %</td>
                                            <td>{user.files.length}</td>
                                            <td>{user.createdDate}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>Aucun client trouvé.</p>
                        )}
                    </div>

                    <div className="files-table-container">
                        <h2>Fichiers</h2>
                        <h2>Nombre total de fichiers : {filteredFiles.length}</h2>
                        <h2>Nombre de fichiers uploadés aujourd'hui : {filesUploadedToday}</h2>
                        <div className="extensions-pie-chart">
                            <div className="pie-container">
                                <Pie data={extensionsPieData} />
                            </div>
                        </div>
                        <SearchFilter onFilteredFilesChange={handleFilteredFilesChange} />  
                        {filteredFiles.length > 0 ? (
                            <table className="files-table">
                                <thead>
                                    <tr>
                                        <th>Nom du Fichier</th>
                                        <th>Extension</th>
                                        <th>Poids (GB)</th>
                                        <th>Utilisateur</th>
                                        <th>Date d'Upload</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredFiles.map(file => (
                                        <tr key={file.id}>
                                            <td>{file.name}</td>
                                            <td>{file.format}</td>
                                            <td>{roundToTwoDecimals(file.weight / 1000)} GB</td>
                                            <td>{file.userFirstName} {file.userName}</td>
                                            <td>{file.uploadDate}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>Aucun fichier trouvé.</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
