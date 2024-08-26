import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '@services/Api.jsx';
import AuthContext from '@services/Security.jsx';
import { jwtDecode } from 'jwt-decode';
import {
    validateEmail,
    cleanMail,
    cleanInput,
  } from '@services/AuthentificationChecking';

import './LoginForm.css';

const LoginForm = ({ switchToRegister, successMessage }) => {
    const api = new Api();
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);

    const [errorMessage, setErrorMessage] = useState('');
    const [emailError, setEmailError] = useState('');
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    
    // Handle login form submission
    const handleSubmit = async (e) => {
        e.preventDefault();    

        // Check if email is valid
        if (!validateEmail(mail)) {
            setEmailError('Veuillez entrer une adresse email valide');
            return;
        }
        const cleanedMail = cleanMail(mail);
        const cleanedPassword = cleanInput(password);

        // Call API to get credentials
        const response = await api.getCredentials(cleanedMail, cleanedPassword);
        if (response.token) {
            localStorage.setItem('token', response.token);
            const decodedToken = jwtDecode(response.token);
            setUser(decodedToken.roles[0]);
            if (decodedToken.roles[0] === 'ROLE_USER'){
                navigate('/profile');
            } else {
                navigate('/dashboard');
            }

        } else if (response === false) {
            setErrorMessage(`Mail ou mot de passe incorrect`);
        } else {
            setErrorMessage('Une erreur est survenue');
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h1>Login</h1>
                        {successMessage && <p className="success-message">{successMessage}</p>}
                        {emailError && <p className="error-message">{emailError}</p>}
                <form onSubmit={handleSubmit}>
                    <label htmlFor="mail">Mail</label>
                    <input
                        type="email"
                        id="mail"
                        name="mail"
                        value={mail}
                        onChange={e => setMail(e.target.value)}
                        required
                    />
                    <label htmlFor="password">Mot de passe : </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="login-button">Connexion</button>
                </form>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <button onClick={switchToRegister} className="register-button">Créer un compte</button>
            </div>
        </div>
    );
};

export default LoginForm;