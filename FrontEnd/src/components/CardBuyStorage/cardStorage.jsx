import React, { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from '@components/checkout';

import Api from '@services/Api';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const PurchaseStorage = ({userName, errorMessage, setErrorMessage}) => {
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showCheckout, setShowCheckout] = useState(false);
    const [clientSecret, setClientSecret] = useState('');

    // console.log(userName);
    const api = new Api();

    const appearance = {
        theme: 'night',
        variables: {
          fontFamily: 'Sohne, system-ui, sans-serif',
          fontWeightNormal: '500',
          borderRadius: '8px',
          colorBackground: '#0A2540',
          colorPrimary: '#EFC078',
          accessibleColorOnColorPrimary: '#1A1B25',
          colorText: 'white',
          colorTextSecondary: 'white',
          colorTextPlaceholder: '#ABB2BF',
          tabIconColor: 'white',
          logoColor: 'dark'
        },
        rules: {
          '.Input': {
            backgroundColor: '#212D63',
            border: '1px solid var(--colorPrimary)'
          }
        }
      };

    const handlePurchaseClick = () => {
        setShowModal(true);
    };

    const handleConfirmPurchase = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const data = await api.createPaymentIntent(token);
           

            setClientSecret(data.clientSecret);
            setShowCheckout(true);
        } catch (error) {
            setErrorMessage('Erreur lors de la création de l\'intention de paiement');
        } finally {
            setIsLoading(false);
        }
    };

    const HidePaiement = () => {
        setShowModal(false);
        setShowCheckout(false);
    };

    return (
        <div>
        <button onClick={handlePurchaseClick}>
            Ajouter plus d'espace à votre Stockage
        </button>

        {showModal && (
            <div className="modal">
            <h2>Ajouter 20 Go pour 20 euros !</h2>
            <p>Paiement unique</p>
            <p>Disponible de suite</p>
            <p>Voulez-vous vraiment acheter 20 Go pour 20€ ?</p>
            <button onClick={handleConfirmPurchase} disabled={isLoading}>
                {isLoading ? 'Chargement...' : 'Confirmer'}
            </button>
            <button onClick={() => { setShowCheckout(false); setShowModal(false); }} disabled={isLoading}>
                Annuler
            </button>
            </div>
        )}

        {showCheckout && clientSecret && (
            <Elements stripe={stripePromise} options={{ clientSecret, appearance}}>
                <CheckoutForm 
                    // clientSecret={clientSecret}
                    hidePaiement={HidePaiement}
                    setShowModal={setShowModal}
                    setShowCheckout={setShowCheckout}
                    userName={userName}
                    isLoading={isLoading}
                    setErrorMessage={setErrorMessage}
                />
            </Elements>
        )}
        {errorMessage && <p>{errorMessage}</p>}
        </div>
    );
};

export default PurchaseStorage;