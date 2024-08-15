import React, { useState } from 'react';
import Api from '@services/Api.jsx';

import './ModifyAccount.css';

export default function ModifyProfile({ userData, onUpdateSuccess, onCancel, setErrorMessage }) {
    const [formData, setFormData] = useState({
        mail: userData.user.mail,
        name: userData.user.name,
        firstName: userData.user.firstName,
        address: userData.user.address,
        totalStorageCapacity: userData.totalStorageCapacity,
        totalStorageUsed: userData.totalStorageUsed,
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
        try {
            await api.updateUserProfile(api.token, modifiedFields);
            onUpdateSuccess();
        } catch (error) {
            setErrorMessage('Une erreur est survenue lors de la mise à jour du profil');
            console.error(error);
        }
    };

    return (
        <form className="formModify" onSubmit={handleFormSubmit}>
            <div className="profile-container">
                <label htmlFor="email">Email :</label>
                <input
                    type="email"
                    name="mail"
                    id="email"
                    value={formData.mail}
                    onChange={handleInputChange}
                />
                <label htmlFor="name">Nom : </label>
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
                <label htmlFor='address'>Adresse : </label>
                <input
                    type="text"
                    name="address"
                    id="address"
                    value={formData.address}
                    onChange={handleInputChange}
                />
                <label htmlFor='totalStorageCapacity'>Go Total :</label>
                <input
                    type="number"
                    name="totalStorageCapacity"
                    id="totalStorageCapacity"
                    value={formData.totalStorageCapacity}
                    onChange={handleInputChange}
                    disabled
                />
                <label htmlFor='totalStorageUsed'>Go utilisé :</label>
                <input
                    type="number"
                    name="totalStorageUsed"
                    id="totalStorageUsed"
                    value={formData.totalStorageUsed}
                    onChange={handleInputChange}
                    disabled
                />
            </div>
            <div>
                <button type="submit">Enregistrer</button>
                <button type="button" onClick={onCancel}>Annuler</button>
            </div>
        </form>
    );
}