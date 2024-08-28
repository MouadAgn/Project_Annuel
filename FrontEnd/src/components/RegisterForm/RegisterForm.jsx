import React, { useState } from 'react';
import Api from '@services/Api.jsx';

import {
    validateEmail,
    cleanMail,
    validatePassword,
    cleanInput } from '@services/AuthentificationChecking';
    
import './RegisterForm.css';

const RegisterForm = ({ switchToLogin }) => {
    const api = new Api();

    const [errorMessage, setErrorMessage] = useState('');
    const [name, setName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [zipCodeStr, setZipCode] = useState('');
    const [country, setCountry] = useState('');
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const cleanAllINputs = () => {
        setName(cleanInput(name));
        setFirstName(cleanInput(firstName));
        setAddress(cleanInput(address));
        setCity(cleanInput(city));
        setCountry(cleanInput(country));
        setMail(cleanMail(mail));
        setPassword(cleanInput(password));
    }


    const UserRegister = async (e) => {
        e.preventDefault();

        if (!validateEmail(mail)) {
            setEmailError('Veuillez entrer une adresse email valide');
            return;
        }

        if (!validatePassword(password)) {
            setErrorMessage('Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial');
            return;
        } else if (password !== confirmPassword) {
            setErrorMessage('Les mots de passe ne correspondent pas');
            return;
        }

        // Clean all inputs by the user
        cleanAllINputs();

        try {
            const zipCode = parseInt(zipCodeStr);
            // Save user info in bdd
            const response = await api.Register(name, firstName, address, city, zipCode, country, mail, password);
            if (response) {
                switchToLogin('Inscription réussie');
            } else {
                setErrorMessage('Erreur lors de l\'inscription');
            }
        } catch (error) {
            const errorData = JSON.parse(error.message);
            if (errorData && typeof errorData === 'object') {
                let errorMessages = '';
                for (const [field, message] of Object.entries(errorData)) {
                    errorMessages += `${field}: ${message}\n`;
                }
                setErrorMessage(errorMessages);
            } else {
                console.error(error);
                setErrorMessage('Une erreur inattendue est survenue.');
            }
        }
    };

    return (
        <div className="register-page">
            <div className="register-container">
                <h1>Register</h1>
                    <form onSubmit={UserRegister}>
                        <label htmlFor="name">Nom :</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                        />
                        <label htmlFor="firstName">Prénom :</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                            required
                        />
                        <label htmlFor="address">Adresse :</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            required
                        />
                        <label htmlFor="city">Ville :</label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={city}
                            onChange={e => setCity(e.target.value)}
                            required
                        />
                        <label htmlFor="zipCode">Code postal :</label>
                        <input
                            type="number"
                            id="zipCode"
                            name="zipCode"
                            value={zipCodeStr}
                            onChange={e => setZipCode(e.target.value)}
                            required
                        />
                        <label htmlFor="country">Pays :</label>
                        <input
                            type="text"
                            id="country"
                            name="country"
                            value={country}
                            onChange={e => setCountry(e.target.value)}
                            required
                        />
                        <label htmlFor="mail">Mail :</label>
                        <input
                            type="email"
                            id="mail"
                            name="mail"
                            value={mail}
                            onChange={e => setMail(e.target.value)}
                            required
                        />
                        <label htmlFor="password">Mot de passe :</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                        <label htmlFor="confirmPassword">Confirmer mot de passe :</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            required
                        />
                        <button type="submit" className="register-button">Inscription</button>
                    </form>
                    {errorMessage && <p className="error-message">{errorMessage.split('\n').map((msg, index) => <span key={index}>{msg}<br/></span>)}</p>}
                <button onClick={() => switchToLogin()} className="login-button">
                    Déjà un compte ? Connexion
                </button>
            </div>
        </div>
    );
};

export default RegisterForm;