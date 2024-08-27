import React, { useState, useEffect } from 'react';
import Api from '@services/Api.jsx';
import SideBar from '../../components/SideBar/SideBar';

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

    const handleDownload = (pdfPath) => {
        const filename = pdfPath.split('/').pop(); // Extraire le nom du fichier
        window.open(`http://127.0.0.1:8000/invoices/${filename}`, '_blank');
    };    

    return (
        <div className="page-container">
            <SideBar className="sidebar" />
            <div className="main-content">
                <h1 className="invoices-title">Mes Factures</h1>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {invoices.length > 0 ? (
                    <div className="invoices-container">
                        {invoices.map((invoice, index) => (
                            <div key={index} className="invoice-card">
                            <span className="invoice-link">
                                Facture {index + 1}
                            </span>
                            <button 
                                onClick={() => handleDownload(invoice)} 
                                className="download-button"
                            >
                                Télécharger
                            </button>
                        </div>
                        ))}
                    </div>
                ) : (
                    <p>Aucune facture disponible</p>
                )}
            </div>
        </div>
    );
}
