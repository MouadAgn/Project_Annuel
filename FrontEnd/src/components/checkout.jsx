import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Api from '@services/Api';

const CheckoutForm = ({ hidePaiement, isLoading, userName, setErrorMessage }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [paymentStatus, setPaymentStatus] = useState('');

    const api = new Api();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
        return;
        }

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
                // setPaymentStatus('Paiement réussi !');
                const data = await api.addStorage(api.token);
                setErrorMessage('Paiement réussi !');
                hidePaiement();
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement  />
            <button type="submit" disabled={!stripe} > Payer </button>
            <button onClick={() => hidePaiement()} disabled={isLoading} > Annuler </button>
            {paymentStatus && <p>{paymentStatus}</p>}
        </form>
    );
};

export default CheckoutForm;