import './ResearchFilter.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp, faArrowDown, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

import React, { useState } from 'react';

export default function ResearchFilter() {
    const [data, setData] = useState([]);
    // const [filter, setFilter] = useState('all');
    const [sort, setSort] = useState('asc');

    // Function to handle the sort change
    const handleSortChange = (e) => {
        
        // Change the sort direction
        const newSort = sort === 'asc' ? 'desc' : 'asc';
        setSort(newSort);

        // Sort the data
        const sortedData = data.sort((a, b) => {
            if (newSort === 'asc') {
                return a.name.localeCompare(b.name);
            } else {
                return b.name.localeCompare(a.name);
            }
        });

        // Update the state with the sorted data
        setData(sortedData);
    }

    
    return (
        <div className="researchFilter">
            <div className="researchFilterSearch">
                <div className="inputWithIcon">
                    <div className="iconContainer">
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </div>
                    <input className="researchFilterInput" type="text" placeholder="Rechercher" />
                </div>
            </div>
            <div className="researchFilterContainer">
                <div className='researchFilterSelect'>
                    <select className="filter" id="filter">
                        <option value="all">Tout</option>
                        <option value="name">Nom</option>
                        <option value="date">Date</option>
                        <option value="size">Taille</option>
                    </select>
                </div>
                <div className="researchFilterSort" onClick={handleSortChange}>
                    <FontAwesomeIcon icon={sort === 'asc' ? faArrowUp : faArrowDown} />
                </div>
            </div>
        </div>
    )
}