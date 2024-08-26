import React, { useState, useEffect } from 'react';
import Api from '@services/Api.jsx';
import './invoices.css'; // Assurez-vous d'ajouter un fichier CSS pour le style

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

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

    const handleDownload = (pdfUrl) => {
        // Utiliser un lien pour déclencher le téléchargement du PDF
        window.open(pdfUrl, '_blank');
    };

    return (
        <div className="invoices-page">
            <h1 className="invoices-title">Mes Factures</h1>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {invoices.length > 0 ? (
                <ul className="invoices-list">
                    {invoices.map(invoice => (
                        <li key={invoice.id} className="invoice-item">
                            <p><strong>Date :</strong> {invoice.purchasedDate}</p>
                            <button onClick={() => handleDownload(invoice.pdf)} className="download-button">
                                Télécharger
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Aucune facture disponible.</p>
            )}
        </div>
    );
}
