import React, { useEffect } from 'react';
import Api from '../services/API';

const TestAPI = () => {
    useEffect(() => {
        const api = new Api();
        const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3MTg2NDc5NjEsImV4cCI6MTcxODY1MTU2MSwicm9sZXMiOlsiUk9MRV9BRE1JTiJdLCJ1c2VybmFtZSI6InVzZXJAZXhhbXBsZS5jb20ifQ.a5Rpiyax4VGtt3YagmSAYUMJf0qRZzG8fqmjd4TRpQNLsZ2wLDVejFD57EtfwgZdPn9-N3ExI0FcWGBberB-EVuDhjWEMbV4BWMNbxcMrUmFAMRR3EzXzvs70iFDxJ1DKrGUgGyiWlB42FD6RAFXcjC8Qdfn0AwbEdcImRjIUYTimydgLOlXk95PwedxOlOmmesayJNfuPzBncPCcndpDAEtwn99zx_GrNpBEU7sIHP6q_GMXRXITZ9WL25hQE--H0BkC_JDrVdFZWziPh65XuenGHM5VqfGKZWtYSnoHE23yzHPhOXb07lNfQRw7Wpq28pzYZUBdlUx-RDzsDP1Mg'

        const fetchData = async () => {
            try {
                const data = await api.getAllUsers(token);
                console.log(data);
            } catch (error) {
                console.error("Erreur lors de la récupération des données :", error);
            }
        };

        fetchData();
    }, []);

    return <div>Test API</div>;
};

export default TestAPI;