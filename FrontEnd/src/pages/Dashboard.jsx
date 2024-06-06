import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ListUser from '../components/ListUser.jsx'
import ResearchFilter from '../components/ResearchFilter.jsx'

export default function Dashboard() {
    const navigate = useNavigate()
    const [errorMessage, setErrorMessage] = useState('');

    return (
        <>

            <h1>Dashboard</h1>
            <ResearchFilter />
            <ListUser />
        </>
    )
}