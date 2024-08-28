import React, { useState } from 'react';
import Api from '@services/Api.jsx';
import { validatePassword, cleanInput, cleanMail } from '@services/AuthentificationChecking';

import './ModifyAccount.css';

export default function ModifyProfile({ userData, onUpdateSuccess, onCancel, setErrorMessage }) {
    const [formData, setFormData] = useState({
        mail: userData.user.mail || '',
        name: userData.user.name || '',
        firstName: userData.user.firstName || '',
        address: userData.user.address || '',
        totalStorageCapacity: userData.totalStorageCapacity || '',
        totalStorageUsed: userData.totalStorageUsed || '',
        currentPassword: userData.user.currentPassword || '',
        newPassword: userData.user.newPassword || '',
        confirmPassword: ''
    });

    const [modifiedFields, setModifiedFields] = useState({});

    const api = new Api();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
        setModifiedFields(prevFields => ({
            ...prevFields,
            [name]: value,
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (Object.keys(modifiedFields).length === 0) {
            setErrorMessage('Aucune modification n\'a été effectuée.');
            return;
        }

        if (modifiedFields.newPassword) {
            if (!validatePassword(formData.newPassword)) {
                setErrorMessage('Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial');
                return;
            } else if (formData.newPassword !== formData.confirmPassword) {
                setErrorMessage('Les mots de passe ne correspondent pas');
                return;
            }
        }

        if (modifiedFields.mail && !validateEmail(formData.mail)) {
            setErrorMessage('L\'adresse mail n\'est pas valide');
            return;
        }
        
        console.log('modifiedFields', modifiedFields);
        try {
            const token = localStorage.getItem('token');
            await api.updateUserProfile(token, modifiedFields);
            onUpdateSuccess();
        } catch (error) {
            const errorMessage = error.message || 'Une erreur est survenue lors de la mise à jour du profil';
            setErrorMessage(errorMessage);
            // console.error(error.errors);
        }
    };

    return (
        <form className="form-modify-account" onSubmit={handleFormSubmit}>
            <h1>Modifier le Compte</h1>
            <div className="form-container">
                <label htmlFor="email">Email :</label>
                <input
                    type="email"
                    name="mail"
                    id="email"
                    value={formData.mail}
                    onChange={handleInputChange}
                />
                <label htmlFor="name">Nom :</label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                />
                <label htmlFor="firstName">Prénom :</label>
                <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                />
                <label htmlFor="address">Adresse :</label>
                <input
                    type="text"
                    name="address"
                    id="address"
                    value={formData.address}
                    onChange={handleInputChange}
                />
                <label htmlFor="totalStorageCapacity">Go Total :</label>
                <input
                    type="number"
                    name="totalStorageCapacity"
                    id="totalStorageCapacity"
                    value={formData.totalStorageCapacity}
                    onChange={handleInputChange}
                    disabled
                />
                <label htmlFor="totalStorageUsed">Go utilisé :</label>
                <input
                    type="number"
                    name="totalStorageUsed"
                    id="totalStorageUsed"
                    value={formData.totalStorageUsed}
                    onChange={handleInputChange}
                    disabled
                />
                <label htmlFor="currentPassword">Mot de passe actuel :</label>
                <input
                    type="password"
                    name="currentPassword"
                    id="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                />
                <label htmlFor="newPassword">Nouveau mot de passe :</label>
                <input
                    type="password"
                    name="newPassword"
                    id="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                />
                <label htmlFor="confirmPassword">Confirmer le nouveau mot de passe :</label>
                <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                />
            </div>
            <div className="form-actions">
                <button type="submit" className="save-button">Enregistrer</button>
                <button type="button" className="cancel-button" onClick={onCancel}>Annuler</button>
            </div>
        </form>

    );
}