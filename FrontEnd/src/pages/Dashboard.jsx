import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ListUser from '../components/ListUser/ListUser.jsx'
import ResearchFilter from '../components/ResearchFilter/ResearchFilter.jsx'
// import API from '../services/API';


export default function Dashboard() {
    const navigate = useNavigate()
    const [errorMessage, setErrorMessage] = useState('');
    const [data, setData] = useState([]);

    // const api = new API();

    
    return (
        <>
            <h1>Dashboard</h1>
            <ResearchFilter />
            <ListUser />
        </>
    )
}