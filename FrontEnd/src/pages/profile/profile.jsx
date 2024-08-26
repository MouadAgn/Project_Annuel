import React, { useState, useEffect } from 'react';
import ModifyProfile from '@components/ModifyAccount/modifyAccount.jsx';
import DeleteAccount from '@components/DeleteAccount/deleteAccount.jsx';
import CardStorage from '@components/CardBuyStorage/cardStorage.jsx';
import Api from '@services/Api.jsx';

import './profile.css';

export default function Profile() {
    const [errorMessage, setErrorMessage] = useState('');
    const [data, setData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const api = new Api();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error('Missing token in localStorage');
            }
            const userData = await api.getUserProfile(token);
            setData(userData);
            
        } catch (error) {
            setErrorMessage('Erreur lors de la récupération des données');
        }
    };

    // Show the form to update the profile
    const handleEditClick = () => {
        setIsEditing(true);
    };

    // Update the profile
    const handleUpdateSuccess = () => {
        setIsEditing(false);
        fetchData();
        setErrorMessage('Profil mis à jour !');
    };

    // Cancel the update
    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    return (
            <div className="profile-page">
                <h1 className="profile-title">Profile</h1>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {data && data.user && (
                    <div className="profile-container">
                        {!isEditing ? (
                            <>
                                <p className="profile-info"><strong>Email :</strong> {data.user.mail}</p>
                                <p className="profile-info"><strong>Nom :</strong> {data.user.name}</p>
                                <p className="profile-info"><strong>Prénom :</strong> {data.user.firstName}</p>
                                <p className="profile-info"><strong>Adresse :</strong> {data.user.address}</p>
                                <p className="profile-info"><strong>Go total :</strong> {data.totalStorageCapacity}</p>
                                <p className="profile-info"><strong>Go utilisé :</strong> {data.totalStorageUsed}</p>
                                
                                <div className="storage-card">
                                    <CardStorage 
                                    setErrorMessage={setErrorMessage}
                                    userName={data.user.name + ' ' + data.user.firstName}
                                    />
                                </div>
                                <button className="edit-button" onClick={handleEditClick}>Modifier</button>
                                    <DeleteAccount />
                            </>
                    ) : (
                        <ModifyProfile 
                            userData={data}
                            onUpdateSuccess={handleUpdateSuccess}
                            onCancel={handleCancelEdit}
                            setErrorMessage={setErrorMessage}
                        />
                    )}
                </div>
            )}
        </div>
    );
}