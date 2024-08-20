import React, { useState } from 'react';

const AddFile = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [message, setMessage] = useState("");
    const [progress, setProgress] = useState(0);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setMessage(""); // Réinitialiser le message lors de la sélection d'un nouveau fichier
        setProgress(0); // Réinitialiser la progression
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!selectedFile) {
            setMessage("Veuillez sélectionner un fichier");
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://127.0.0.1:8000/api/add-file', true);

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percentComplete = (event.loaded / event.total) * 100;
                setProgress(percentComplete);
                setMessage(`Upload en cours : ${percentComplete.toFixed(2)}%`);
            }
        };

        xhr.onload = () => {
            if (xhr.status === 200) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    setMessage(response.message || "Fichier uploadé avec succès");
                } catch (error) {
                    setMessage("Fichier uploadé avec succès, mais la réponse du serveur est invalide");
                }
            } else {
                try {
                    const response = JSON.parse(xhr.responseText);
                    setMessage(response.error || "Erreur lors de l'upload du fichier");
                } catch (error) {
                    setMessage(`Erreur lors de l'upload du fichier. Statut : ${xhr.status}`);
                }
            }
        };

        xhr.onerror = () => {
            setMessage("Erreur de réseau");
        };

        xhr.send(formData);
    };

    return (
        <div className="add-file-container">
            <h2>Uploader un fichier</h2>
            <form onSubmit={handleSubmit} className="file-upload-form">
                <div className="file-input-container">
                    <input 
                        type="file" 
                        onChange={handleFileChange} 
                        className="file-input"
                        id="file-input"
                    />
                    <label htmlFor="file-input" className="file-input-label">
                        {selectedFile ? selectedFile.name : "Choisir un fichier"}
                    </label>
                </div>
                <button type="submit" className="upload-button">Uploader le fichier</button>
            </form>
            {progress > 0 && progress < 100 && (
                <div className="progress-bar">
                    <div className="progress" style={{width: `${progress}%`}}></div>
                </div>
            )}
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default AddFile;