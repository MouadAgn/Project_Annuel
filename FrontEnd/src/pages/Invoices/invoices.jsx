import React, { useState, useEffect } from 'react';
import Api from '@services/Api.jsx'; // Assurez-vous que ce chemin est correct
import { pdfjs, Document, Page } from 'react-pdf';
import './invoices.css';

// Configuration de pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

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
        console.log(invoices)
    };

    const handleDownload = (url) => {
        window.open(url, '_blank');
    };

    return (
        <div className="invoices-page">
            <h1 className="invoices-title">Mes Factures</h1>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {invoices.length > 0 ? (
                <div className="invoices-container">
                    {invoices.map((invoice, index) => (
                        <div key={index} className="invoice-card">
                            <p className="invoice-info">Facture {index + 1}</p>
                            <div className="invoice-pdf">
                                {/* Affichage du PDF comme image */}
                                <Document
                                    file={invoice.pdf}
                                    options={{ workerSrc: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js` }}
                                    onLoadError={(error) => setErrorMessage('Erreur lors du chargement du PDF')}
                                >
                                    <Page pageNumber={1} width={300} />
                                </Document>
                            </div>
                            <button 
                                className="download-button" 
                                onClick={() => handleDownload(invoice.pdf)}
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
    );
}
