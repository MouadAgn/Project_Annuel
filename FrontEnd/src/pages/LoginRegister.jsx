import React, { useState } from 'react';
import LoginForm from '@components/LoginForm/LoginForm';
import RegisterForm from '@components/RegisterForm/RegisterForm';

export default function LoginRegister() {
    const [isLogin, setIsLogin] = useState(true);

    const switchToLogin = () => setIsLogin(true);
    const switchToRegister = () => setIsLogin(false);

    return (
        <>
            {isLogin ? (
                <LoginForm switchToRegister={switchToRegister} />
            ) : (
                <RegisterForm switchToLogin={switchToLogin} />
            )}
        </>
    );
}