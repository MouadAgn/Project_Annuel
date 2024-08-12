import React, { useState, useEffect } from 'react';
import ModifyProfile from '@components/ModifyAccount/modifyAccount.jsx';
import DeleteAccount from '@components/DeleteAccount/deleteAccount.jsx';
import Api from '@services/Api.jsx';

import './profile.css';

export default function Profile() {
    const [errorMessage, setErrorMessage] = useState('');
    const [data, setData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteAccount, setShowDeleteAccount] = useState(false);

    const api = new Api();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const userData = await api.getUserProfile(api.token);
            setData(userData);
        } catch (error) {
            setErrorMessage('Erreur lors de la récupération des données');
            console.error(error);
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleUpdateSuccess = () => {
        setIsEditing(false);
        fetchData();
        setErrorMessage('Profil mis à jour !');
    };

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