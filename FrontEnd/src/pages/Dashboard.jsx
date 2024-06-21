import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import List from '@components/List/List.jsx'
import ResearchFilter from '@components/ResearchFilter/ResearchFilter.jsx'
import Api from '@services/Api.jsx';
import Security from '@services/Security';


export default function Dashboard() {
    const navigate = useNavigate()
    const [errorMessage, setErrorMessage] = useState('');
    const [users, setUsers] = useState([]);
    // const [files, setFiles] = useState([]);

    const api = new Api();
    const security = new Security();
    const hasAdminRole = security.hasAdminRole;

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Check if user has admin role 
                // if(!hasAdminRole) {
                //     navigate('/');
                // }
                const userResponse = await api.getAllUsers(api.token);
                setUsers(userResponse);
        
                // Assuming you have a separate API call for files
                /* const fileResponse = await api.getFiles(); // Replace with your API call
                setFiles(fileResponse); */
            } catch (error) {
                setErrorMessage('Error fetching data');
                console.error(error);
            }
        };
      
          fetchData();
    }, []);

    console.log(security)
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