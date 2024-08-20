import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '@services/Api.jsx';
import AuthContext from '@services/Security.jsx';
import { jwtDecode } from 'jwt-decode';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@components/checkout.jsx';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const RegisterForm = ({ switchToLogin }) => {
    const api = new Api();

    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);

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
    const [clientSecret, setClientSecret] = useState('');
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const validateUserInfo = () => {
        if (password !== confirmPassword) {
            setErrorMessage('Les mots de passe ne correspondent pas');
            return false;
        }
        return true;
    };

    const handleNextStep = async (e) => {
        e.preventDefault();
        if (validateUserInfo()) {
            try {

                const zipCode = parseInt(zipCodeStr);
                
                // Save user info in bdd
                const response = await api.Register(name, firstName, address, city, zipCode, country, mail, password);
                console.log(response);
                if (response) {
                    localStorage.setItem('token', response);
                    const decodedToken = jwtDecode(response);
                    setUser(decodedToken.roles[0]);

                    // Create payment intent
                    const paymentResponse = await api.createPaymentIntent(response);
                    setClientSecret(paymentResponse.clientSecret);
                    setStep(2);
                } else {
                    setErrorMessage('Erreur lors de l\'inscription');
                }
            } catch (error) {
                // console.log(error);
                setErrorMessage('Une erreur est survenue lors de l\'inscription');
            }
        }
    };

    const handleConfirmPurchase = async () => {
        try {
            const response = await api.register(mail, password);
            if (response) {
                localStorage.setItem('token', response);
                const decodedToken = jwtDecode(response);
                setUser(decodedToken.roles[0]);
                navigate('/profile');
            } else {
                setErrorMessage('Erreur lors de l\'inscription');
            }
        } catch (error) {
            console.error(error);
            setErrorMessage('Une erreur est survenue lors de l\'inscription');
        }
    };

    return (
        <div>
            <h1>Register</h1>
            {step === 1 && (
                <form onSubmit={handleNextStep}>
                    <label htmlFor="name">Nom : </label>
                    <input type="text" id="name" name="name" value={name} onChange={e => setName(e.target.value)} required />
                    <label htmlFor="firstName">Prénom : </label>
                    <input type="text" id="firstName" name="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} required />
                    <label htmlFor="address">Adresse : </label>
                    <input type="text" id="address" name="address" value={address} onChange={e => setAddress(e.target.value)} required />
                    <label htmlFor="city">Ville : </label>
                    <input type="text" id="city" name="city" value={city} onChange={e => setCity(e.target.value)} required />
                    <label htmlFor="zipCode">Code postal : </label>
                    <input type="number" id="zipCode" name="zipCode" value={zipCodeStr} onChange={e => setZipCode(e.target.value)} required />
                    <label htmlFor="country">Pays : </label>
                    <input type="text" id="country" name="country" value={country} onChange={e => setCountry(e.target.value)} required />
                    <label htmlFor="mail">Mail : </label>
                    <input type="email" id="mail" name="mail" value={mail} onChange={e => setMail(e.target.value)} required />
                    <label htmlFor="password">Mot de passe : </label>
                    <input type="password" id="password" name="password" value={password} onChange={e => setPassword(e.target.value)} required />
                    <label htmlFor="confirmPassword">Confirmer mot de passe : </label>
                    <input type="password" id="confirmPassword" name="confirmPassword" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                    <button type="submit">Suivant</button>
                </form>
            )}
            {step === 2 && clientSecret && (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckoutForm 
                        hidePaiement={() => setStep(1)}
                        setShowModal={() => {}}
                        setShowCheckout={() => {}}
                        userName={`${firstName} ${name}`}
                        isLoading={isLoading}
                        setErrorMessage={setErrorMessage}
                        onSuccess={handleConfirmPurchase}
                    />
                </Elements>
            )}
            {errorMessage && <p>{errorMessage}</p>}
            <button onClick={switchToLogin}>Déjà un compte ? Connexion</button>
        </div>
    );
};

export default RegisterForm;