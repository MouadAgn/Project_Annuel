import React, { useState, useEffect } from 'react';
import SideBar from '../../components/SideBar/SideBar';
import './Dashboard.css';
import Api from '@services/API.jsx';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
    const [errorMessage, setErrorMessage] = useState('');
    const [users, setUsers] = useState([]);
    const [totalStorageUsed, setTotalStorageUsed] = useState(0);
    const [totalStorageCapacity, setTotalStorageCapacity] = useState(0);

    const api = new Api();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const userResponse = await api.getAllUsers(token);
                setUsers(userResponse);

                const totalUsed = userResponse.reduce((sum, user) => sum + user.storageUsed, 0);
                const totalCapacity = userResponse.reduce((sum, user) => sum + user.storageCapacity, 0);

                setTotalStorageUsed(totalUsed);
                setTotalStorageCapacity(totalCapacity);
            } catch (error) {
                setErrorMessage('Error fetching data');
                console.error(error);
            }
        };
        fetchData();
    }, []);

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
                                            <td>{user.createdDate}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>Aucun client trouvé.</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
