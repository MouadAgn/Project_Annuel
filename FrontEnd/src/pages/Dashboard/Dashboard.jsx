import React, { useState, useEffect } from 'react';
import SideBar from '../../components/SideBar/SideBar'; // Réutilisation de la sidebar
import './Dashboard.css';
import Api from '@services/API.jsx'; // Assurez-vous que le chemin est correct

export default function Dashboard() {
    const [errorMessage, setErrorMessage] = useState('');
    const [users, setUsers] = useState([]);
    const api = new Api();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const userResponse = await api.getAllUsers(token);
                setUsers(userResponse);
            } catch (error) {
                setErrorMessage('Error fetching data');
                console.error(error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="dashboard-app">
            <SideBar />
            <main className="main-content">
                <div className="content-container">
                    <h1>Dashboard</h1>
                    {errorMessage && <p className="error">{errorMessage}</p>}
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
