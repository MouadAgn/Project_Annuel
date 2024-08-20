import React, { useState } from 'react';
import axios from 'axios';

const CreateFolder = () => {
  const [folderName, setFolderName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://127.0.0.1:8000/api/folders', { name: folderName });
      setMessage(`Dossier créé avec succès. ID: ${response.data.id}`);
      setFolderName('');
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Une erreur est survenue');
      setMessage('');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Créer un nouveau dossier</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="text"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          placeholder="Nom du dossier"
          required
          style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <button 
          type="submit"
          style={{ 
            padding: '0.5rem 1rem', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer' 
          }}
        >
          Créer le dossier
        </button>
      </form>
      {message && (
        <div style={{ marginTop: '1rem', padding: '0.5rem', backgroundColor: '#d4edda', color: '#155724', borderRadius: '4px' }}>
          {message}
        </div>
      )}
      {error && (
        <div style={{ marginTop: '1rem', padding: '0.5rem', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px' }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default CreateFolder;