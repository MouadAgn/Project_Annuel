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
    // const [showDeleteAccount, setShowDeleteAccount] = useState(false);

    const api = new Api();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Retrieve token from localStorage
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error('Missing token in localStorage');
            }

            const userData = await api.getUserProfile(token);
            setData(userData);
            
        } catch (error) {
            setErrorMessage('Erreur lors de la récupération des données');
            // console.error(error);
        }
    };

    // Gére l'affichage du formulaire de modification du profil
    const handleEditClick = () => {
        setIsEditing(true);
    };

    // Gére l'affichage du formulaire de mise à jour du compte
    const handleUpdateSuccess = () => {
        setIsEditing(false);
        fetchData();
        setErrorMessage('Profil mis à jour !');
    };

    // Annule la modification du profil
    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    return (
        <>
            <h1>Profile</h1>
            {errorMessage && <p className="error">{errorMessage}</p>}
            {data && data.user && (
                <div className="profile-container">
                    {!isEditing ? (
                        <>
                            <p>Email : {data.user.mail}</p>
                            <p>Nom : {data.user.name}</p>
                            <p>Prénom : {data.user.firstName}</p>
                            <p>Adresse : {data.user.address}</p>
                            <p>Go total : {data.totalStorageCapacity}</p>
                            <p>Go utilisé : {data.totalStorageUsed}</p>
                            
                            <CardStorage 
                                setErrorMessage={setErrorMessage}
                                userName={data.user.name + ' ' + data.user.firstName}
                                // totalStorageCapacity={data.totalStorageCapacity}
                                // totalStorageUsed={data.totalStorageUsed}
                            />
                            <button onClick={handleEditClick}>Modifier</button>
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
        </>
    );
}