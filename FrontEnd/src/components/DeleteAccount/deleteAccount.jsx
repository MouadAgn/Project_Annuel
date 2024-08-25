import React, { useState } from 'react';

import Api from '@services/Api.jsx';

export default function DeleteAccount() {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const api = new Api();

    const handleDeleteAccount = () => {
        setShowConfirmation(true);
    };

    const handleConfirm = () => {

        const token = localStorage.getItem('token');
        api.deleteUserProfile(token)
            .then(() => {
                setErrorMessage('Votre compte a bien été supprimé');
                navigate('/')
            })
            .catch((error) => {
                setErrorMessage('Erreur lors de la suppression du compte');
            });
    };

    return (
        <div>
            {!showConfirmation && (
                <button onClick={handleDeleteAccount}>Supprimer le Compte</button>
            )}
            {showConfirmation && !errorMessage && (
                <div>
                    <p>Etes vous sur de vouloir supprimer votre compte contenant toutes vos informations personnelles et vos fichiers ?</p>
                    <button onClick={handleConfirm}>Confirmer</button>
                    <button onClick={() => setShowConfirmation(false)}>Annuler</button>
                </div>
            )}
            {errorMessage && <p>{errorMessage}</p>}
        </div>
    );
}
