// src/components/InvoiceList.js

import React, { useState, useEffect } from 'react';
import './InvoiceList.css';

const InvoiceList = () => {
    const [invoices, setInvoices] = useState([]);

    useEffect(() => {
        // Remplace l'URL par celle de ton API
        fetch('/api/user/invoices')
            .then(response => response.json())
            .then(data => setInvoices(data))
            .catch(error => console.error('Error fetching invoices:', error));
    }, []);

    const handleDownload = (pdfUrl) => {
        window.open(pdfUrl, '_blank');
    };

    return (
        <div className="invoice-list-container">
            <h1>Vos Factures</h1>
            <ul className="invoice-list">
                {invoices.map(invoice => (
                    <li key={invoice.id} className="invoice-item">
                        <div className="invoice-details">
                            <p>Facture #: {invoice.id}</p>
                            <p>Date: {invoice.purchasedDate}</p>
                        </div>
                        <button
                            className="download-button"
                            onClick={() => handleDownload(invoice.pdf)}
                        >
                            Télécharger
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default InvoiceList;
