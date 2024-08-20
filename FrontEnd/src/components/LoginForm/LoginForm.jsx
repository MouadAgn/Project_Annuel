import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '@services/Api.jsx';
import AuthContext from '@services/Security.jsx';
import { jwtDecode } from 'jwt-decode';

const LoginForm = ({ switchToRegister }) => {
    const api = new Api();
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);

    const [errorMessage, setErrorMessage] = useState('');
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.getCredentials(mail, password);
            if (response) {
                localStorage.setItem('token', response);
                const decodedToken = jwtDecode(response);
                setUser(decodedToken.roles[0]);
                navigate('/profile');
            } else {
                setErrorMessage('Mail ou mot de passe incorrect');
            }
        } catch (error) {
            console.error(error);
            setErrorMessage('Une erreur est survenue lors de la connexion');
        }
    };

    return (
        <>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="mail">Mail</label>
                <input type="email" id="mail" name="mail" value={mail} onChange={e => setMail(e.target.value)} required />
                <label htmlFor="password">Mot de passe : </label>
                <input type="password" id="password" name="password" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="submit">Connexion</button>
            </form>
            {errorMessage && <p>{errorMessage}</p>}
            <button onClick={switchToRegister}>Créer un compte</button>
        </>
    );
};

export default LoginForm;