import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Api from '@services/Api';

import './Checkout.css';

const CheckoutForm = ({ hidePaiement, isLoading, userName, setErrorMessage }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [paymentStatus, setPaymentStatus] = useState('');

    const api = new Api();

    // Handle payment
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
        return;
        }

        // Call Api to Stripe & confirm payment
        const result = await stripe.confirmPayment({
            elements,
            redirect: 'if_required',
            confirmParams: {
                payment_method_data: {
                    billing_details: {
                        name: userName,
                    },
                },
            },
        });

        if (result.error) {
            setPaymentStatus(`Échec du paiement: ${result.error.message}`);
        } else {
            if (result.paymentIntent.status === 'succeeded') {
                const token = localStorage.getItem('token');
                const data = await api.addStorage(token);
                setErrorMessage('Paiement réussi !');
                hidePaiement();
            }
        }
    };

    return (
        <form className='checkout-Form' onSubmit={handleSubmit}>
            <PaymentElement  />
            <button className='checkout-Confirm' type="submit" disabled={!stripe} > Payer </button>
            <button className='checkout-Cancel' onClick={() => hidePaiement()} disabled={isLoading} > Annuler </button>
            {paymentStatus && <p>{paymentStatus}</p>}
        </form>
    );
};

export default CheckoutForm;