import React, { useState, useEffect } from 'react';
import { Search, Filter, X, FileText, Calendar, FileType } from 'lucide-react';
import './SearchFilter.css';

const SearchFilter = ({ onFilteredFilesChange }) => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterType, setFilterType] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchPlaceholder, setSearchPlaceholder] = useState('Search Files...');
  const [files, setFiles] = useState([]);

  useEffect(() => {
    // Fetch files from API
    fetch('https://127.0.0.1:8000/api/list-files')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network error when fetching files');
        }
        return response.json();
      })
      .then(data => {
        setFiles(data);
        filterFiles(data, searchTerm, filterType);
      })
      .catch(error => console.error('Error fetching files:', error));
  }, []);

  const filterFiles = (allFiles, term, type) => {
    const searchLower = term.toLowerCase();
    const filtered = allFiles.filter(file => {
      switch (type) {
        case 'name':
          return file.name_file.toLowerCase().includes(searchLower);
        case 'date':
          return file.upload_date.toLowerCase().includes(searchLower);
        case 'extension':
          const fileExtension = file.name_file.split('.').pop().toLowerCase();
          return file.format.toLowerCase().includes(searchLower) || fileExtension.includes(searchLower);
        default:
          return true;
      }
    });
    onFilteredFilesChange(filtered);
  };

  const handleFilterClick = () => {
    setFilterOpen(!filterOpen);
  };

  const handleFilterTypeChange = (type) => {
    setFilterType(type);
    setSearchPlaceholder(`Search by ${type}...`);
    setFilterOpen(false);
    setSearchTerm(''); // Clear the search term when changing filter type
    filterFiles(files, '', type); // Re-filter with empty search term
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterFiles(files, term, filterType);
  };

  return (
    <div className="search-filter-container">
      <div className="search-container">
        <input 
          type="text" 
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
        <button className="search-button"><Search size={20} /></button>
      </div>
      <div className="filter-container">
        <button className="filter-button" onClick={handleFilterClick}>
          {filterOpen ? <X size={20} /> : <Filter size={20} />}
          <span>Filter</span>
        </button>
        {filterOpen && (
          <div className="filter-options">
            <button onClick={() => handleFilterTypeChange('name')}>
              <FileText size={16} />
              <span>Name</span>
            </button>
            <button onClick={() => handleFilterTypeChange('date')}>
              <Calendar size={16} />
              <span>Date</span>
            </button>
            <button onClick={() => handleFilterTypeChange('extension')}>
              <FileType size={16} />
              <span>Extension</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilter;