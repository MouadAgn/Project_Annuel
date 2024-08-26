// src/components/Dashboard.js

import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';

const Dashboard = () => {
    const [fileData, setFileData] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Appel à l'API pour récupérer les statistiques des fichiers
        axios.get('/api/admin/filetypes')
            .then(response => {
                if (response.data.status === 'OK') {
                    setFileData(response.data.data);
                }
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des statistiques des fichiers!', error);
            });

        // Appel à l'API pour récupérer les utilisateurs
        axios.get('/api/admin/users')
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des utilisateurs!', error);
            });
    }, []);

    // Préparer les données pour le graphique
    const pieData = {
        labels: fileData.map(file => file.format),
        datasets: [
            {
                data: fileData.map(file => file.count),
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40'
                ],
            },
        ],
    };

    return (
        <div>
            <h2>Dashboard</h2>

            <h3>File Types Distribution</h3>
            <Pie data={pieData} />

            <h3>List of Users</h3>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Storage Capacity (GB)</th>
                        <th>Storage Used (GB)</th>
                        <th>Storage Usage (%)</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.firstName}</td>
                            <td>{user.storageCapacity}</td>
                            <td>{user.storageUsed}</td>
                            <td>{user.storageUsagePercentage}%</td>
                            <td>{user.createdDate}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Dashboard;
