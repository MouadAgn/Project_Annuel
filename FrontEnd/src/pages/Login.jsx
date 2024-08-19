import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import jwtDecodeToken from '@services/Security';



export default function Login() {
    //test jwt-decode sur token admin
    // const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3MTg5NDcxOTcsImV4cCI6MTcyMDk0NzE5Nywicm9sZXMiOlsiUk9MRV9BRE1JTiJdLCJ1c2VybmFtZSI6InVzZXIxQGV4YW1wbGUuY29tIn0.K_JjsPGeq2gvPIL572jDuNjLQaOPpExO6u0IOucrp7TqzVON2N43KAQfG8gxr_YUZGue9N6fFbj8m5R2Aa7e5hDFPQsaeTNZIwiJTlKUGV2IFlGiKPIksb_YnFCgirb2VGzENlsZVWPMD4wvRQo-gpY0aU4fMJKKsTt4kEPFgFr6AqQDLZpBMI7iLEtGHrNU90gsPGx4OPu0qK7Ax_u2s72_eBqpS9-R-LhRr_-urw9AWagS274RRKK-vFWvw3TfmjIlBda-2QGd_5cnUlJ_D6zq6vndsMfHkQXXIb416DNz1zc6Hwz3uDVoPtXtY2-LiYQUKvvAVsVPzdmj82ZdZA";
    // const decoded = jwtDecode(token);
    // console.log(decoded);
    
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState('');
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const decodedToken = jwtDecodeToken();
        console.log(decodedToken)
    }, []);
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(mail, password);
        if (success) {
            localStorage.setItem('token', token);
            navigate('/home');
        } else {
            setErrorMessage('Login failed. Please check your credentials.');
        }
    };
  
    return (
        <>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="mail">Mail</label>
                <input type="email" id="mail" name="mail" value={mail} onChange={e => setMail(e.target.value)} required />
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="submit">Connexion</button>
            </form>
            {errorMessage && <p>{errorMessage}</p>}
        </>
    );
}