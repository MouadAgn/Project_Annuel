import  { useState } from 'react';
import { Search, Home as HomeIcon, UserRoundPen, Filter, X, FileText, Calendar, FileType } from 'lucide-react';
import ListFile from '../ListFile/ListFile';
import FolderFileList from '../FolderFileList/FolderFileList';
import AddFileToFolder from '../AddFileToFolder/AddFileToFolder'; // Importez le nouveau composant
import './Home.css';

const Home = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterType, setFilterType] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchPlaceholder, setSearchPlaceholder] = useState('Search Files...');

  const handleFilterClick = () => {
    setFilterOpen(!filterOpen);
  };

  const handleFilterTypeChange = (type) => {
    setFilterType(type);
    setSearchPlaceholder(`Search by ${type}...`);
    setFilterOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="task-app">
      <aside className="sidebar">
        <nav>
          <ul>
            <li><a href="/home"><HomeIcon size={20} /><span>Home</span></a></li>
            <li><a href="#browse"><Search size={20} /><span>Browse</span></a></li>
            <li><a href="#profile"><UserRoundPen size={20} /><span>Profile</span></a></li>
          </ul>
        </nav>
      </aside>
      <main className="main-content">
        <div className="content-container">
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

          {/* Intégrez le nouveau composant AddFileToFolder ici */}
          <AddFileToFolder />

          <FolderFileList searchTerm={searchTerm} filterType={filterType} />

          <div className="files-table-container">
            <ListFile searchTerm={searchTerm} filterType={filterType} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;