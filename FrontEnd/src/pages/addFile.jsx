import React, { useState } from 'react';

const AddFile = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [message, setMessage] = useState("");

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await fetch('https://127.0.0.1:8000/api/add-file', {
                method: 'POST', // Assurez-vous que la méthode est POST
                body: formData
            });

            if (response.ok) {
                setMessage("Fichier uploadé avec succès");
            } else {
                setMessage("Erreur lors de l'upload du fichier");
            }
        } catch (error) {
            setMessage("Erreur de réseau");
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} />
                <button type="submit">Uploader le fichier</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default AddFile;
