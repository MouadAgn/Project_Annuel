import React, { useState } from 'react';
import axios from 'axios';

const AddInvoice = () => {
  const [userId, setUserId] = useState('');
  const [invoiceId, setInvoiceId] = useState(null);
  const [pdfUrl, setPdfUrl] = useState('');

  const handleCreateInvoice = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/invoice/create', {
        user_id: userId
      });

      if (response.status === 201) {
        setInvoiceId(response.data.invoice_id);
        const invoiceResponse = await axios.get(`http://127.0.0.1:8000/invoice/${response.data.invoice_id}`);
        setPdfUrl(invoiceResponse.data.pdf);
      }
    } catch (error) {
      console.error('There was an error creating the invoice!', error);
    }
  };

  const handleDownloadPDF = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };

  return (
    <div>
      <h2>Create Invoice</h2>
      <div>
        <label>
          User ID:
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </label>
      </div>
      <button onClick={handleCreateInvoice}>Create Invoice</button>
      {invoiceId && (
        <div>
          <p>Invoice created successfully with ID: {invoiceId}</p>
          <button onClick={handleDownloadPDF}>Download PDF</button>
        </div>
      )}
    </div>
  );
};

export default AddInvoice;
