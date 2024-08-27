import React, { useState, useEffect } from 'react';
import Api from '@services/Api.jsx'; // Assurez-vous que ce chemin est correct

import './invoices.css';

export default function Invoices() {
    const [errorMessage, setErrorMessage] = useState('');
    const [invoices, setInvoices] = useState([]);

    const api = new Api();

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                throw new Error('Missing token in localStorage');
            }
            const invoiceData = await api.getInvoices(token);
            setInvoices(invoiceData);
            
        } catch (error) {
            setErrorMessage('Erreur lors de la récupération des factures');
        }
    };

    return (
        <div className="invoices-page">
            <h1 className="invoices-title">Mes Factures</h1>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {invoices.length > 0 ? (
                <div className="invoices-container">
                    {invoices.map((invoice, index) => (
                        <div key={index} className="invoice-card">
                            <a 
                                href={invoice} 
                                className="invoice-link"
                            >
                                Facture {index + 1}
                            </a>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Aucune facture disponible</p>
            )}
        </div>
    );
}
