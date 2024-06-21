import {useNavigate} from 'react-router-dom';
import API from '@services/Api.jsx';
import {useState, useEffect} from 'react';

export default function Login() {
    const navigate = useNavigate();

    const api = new API();
    const [errorMessage, setErrorMessage] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Vérification si format mail & password valid à faire dans security.jsx
        console.log(mail)
        console.log(password)
        try {
            const token = await api.getToken(mail, password);
            localStorage.setItem('token', token);
            setLoggedIn(true);
        } catch (error) {
            setErrorMessage(error.message);
        }
    }

    return (
        <>
            <h1>Login</h1>
            <form action="">
                <label htmlFor="mail">Mail</label>
                <input type="text" id="mail" name="mail" value={mail} onChange={e=>setMail(e.target.value)} />
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" value={password} onChange={e=>setPassword(e.target.value)}/>
                <button onClick={handleSubmit}>Connexion</button>
            </form>
        </>
    )
}