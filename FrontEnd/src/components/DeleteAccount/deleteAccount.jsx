import React, { useState, useContext } from 'react';

import Api from '@services/Api.jsx';
import { useNavigate } from 'react-router-dom';

import AuthContext from '@services/Security';

import './deleteAccount.css';

export default function DeleteAccount() {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const { updateUser } = useContext(AuthContext);

    const api = new Api();

    // Show confirmation message to delete Account
    const handleDeleteAccount = () => {
        setShowConfirmation(true);
    };

    // Call API to delete user profile
    const handleConfirm = async () => {
        try {
            const token = localStorage.getItem('token');
            await api.deleteUserProfile(token)
                localStorage.removeItem('token');
                updateUser(null);
                setErrorMessage('Votre compte a bien été supprimé');
                navigate('/')
        } catch (error) {
            setErrorMessage('Erreur lors de la suppression du compte', error);
        }
        
    };

    return (
        <div className="delete-account-container">
            {!showConfirmation && (
                <button className="delete-button" onClick={handleDeleteAccount}>
                    Supprimer le Compte
                </button>
            )}
            {showConfirmation && !errorMessage && (
                <div className="confirmation-container">
                    <p className="confirmation-message">
                        Êtes-vous sûr de vouloir supprimer votre compte contenant toutes vos informations personnelles et vos fichiers ?
                    </p>
                    <div className="confirmation-buttons">
                        <button className="delete-button" onClick={handleConfirm}>
                            Confirmer
                        </button>
                        <button className="cancel-button" onClick={() => setShowConfirmation(false)}>
                            Annuler
                        </button>
                    </div>
                </div>
            )}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
}
