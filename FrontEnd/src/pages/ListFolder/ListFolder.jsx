import React, { useState, useEffect } from 'react';
import './ListFolder.css';
import Api from '../../services/API';

const api = new Api();

const ListFolders = () => {
  const [folders, setFolders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const fetchedFolders = await api.getFolders();
        setFolders(fetchedFolders);
      } catch (err) {
        setError('An error occurred while loading folders');
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