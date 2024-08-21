import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

import List from '@components/List/List.jsx'
import ResearchFilter from '@components/ResearchFilter/ResearchFilter.jsx'
import Api from '@services/Api.jsx';


export default function Dashboard() {

    const [errorMessage, setErrorMessage] = useState('');
    const [users, setUsers] = useState([]);
    // const [files, setFiles] = useState([]);

    const api = new Api();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            try {
                const userResponse = await api.getAllUsers(token);
                setUsers(userResponse);
        
                /* const fileResponse = await api.getFiles();
                setFiles(fileResponse); */
            } catch (error) {
                setErrorMessage('Error fetching data');
                console.error(error);
            }
        };
          fetchData();
    }, []);

    return (
        <>
            <h1>Dashboard</h1>
            <ResearchFilter />
            {errorMessage && <p className="error">{errorMessage}</p>}
            {users.length > 0 && <List users={users} dataType="users" />}
            {/* {files.length > 0 && <List files={files} dataType="files" />} */}
        </>
    )
}
