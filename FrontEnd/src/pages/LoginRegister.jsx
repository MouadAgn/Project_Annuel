import React, { useState } from 'react';
import LoginForm from '@components/LoginForm/LoginForm';
import RegisterForm from '@components/RegisterForm/RegisterForm';

export default function LoginRegister() {
    const [isLogin, setIsLogin] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');

    // Switch to login form
    const switchToLogin = (message) => {
        setIsLogin(true);
        setSuccessMessage(message || '');
    };
    
    // Switch to register form
    const switchToRegister = () => {
        setIsLogin(false);
        setSuccessMessage('');
    };

    return (
        <>
            {isLogin ? (
                <LoginForm switchToRegister={switchToRegister} successMessage={successMessage} />
            ) : (
                <RegisterForm switchToLogin={switchToLogin} />
            )}
        </>
    );
}