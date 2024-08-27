import React, { useState } from 'react';
import axios from 'axios';

const DeleteFolder = () => {
  const [folderId, setFolderId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      await axios.delete(`https://127.0.0.1:8000/api/folders/${folderId}`);
      setMessage('Dossier supprimé avec succès');
      setFolderId('');
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Une erreur est survenue lors de la suppression du dossier');
      setMessage('');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.5rem',
    marginBottom: '1rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
  };

  const buttonStyle = {
    padding: '0.5rem 1rem',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  const alertStyle = {
    padding: '0.75rem',
    marginTop: '1rem',
    borderRadius: '4px',
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Supprimer un dossier</h2>
      <form onSubmit={handleDelete}>
        <input
          type="number"
          value={folderId}
          onChange={(e) => setFolderId(e.target.value)}
          placeholder="ID du dossier"
          required
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>Supprimer le dossier</button>
      </form>
      {message && <div style={{...alertStyle, backgroundColor: '#d4edda', color: '#155724'}}>{message}</div>}
      {error && <div style={{...alertStyle, backgroundColor: '#f8d7da', color: '#721c24'}}>{error}</div>}
    </div>
  );
};

export default DeleteFolder;