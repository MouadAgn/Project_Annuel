import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ListFolder.css'; // Add a CSS file for styling

const ListFolders = () => {
  const [folders, setFolders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await axios.get('https://127.0.0.1:8000/api/folders');
        setFolders(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'An error occurred while loading folders');
      }
    };

    fetchFolders();
  }, []);

  if (error) {
    return (
      <div className="error-message">
        {error}
      </div>
    );
  }

  return (
    <div className="folders-list">
      
      <ul>
        {folders.map((folder) => (
          <li key={folder.id}>
            <span className="folder-icon">📁</span>
            <span className="folder-name">{folder.name}</span>
            <span className="folder-file-count">{folder.fileCount} files</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListFolders;
