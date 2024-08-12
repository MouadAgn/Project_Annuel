import './List.css';
import React from 'react';


export default function List({ users, files, dataType }) {
    let data = [];

    // Check if the data type is users and if there are users
    if (dataType === 'users' && users && users.length > 0) {
        data = users;
    
    // Check if the data type is files and if there are files
    } else if (dataType !== 'users' && files && files.length > 0) {
        data = files;
    }

    // If no data, return a loading message
    if (data.length === 0) {
        return <p>Loading...</p>;
    }
    console.log(data)

    // Create the table headers based on the data type
    const tableHeaders = dataType === 'users' ? (
        <tr>
          <th>Utilisateur</th>
          <th>Stockage total en Go</th>
          <th>Stockage utilisé en Go</th>
          <th>Pourcentage utilisé</th>
          <th>Date de création</th>
          <th>Voir plus</th>
        </tr>
      ) : (
        <tr>
          <th>Nom</th>
          <th>Taille</th>
          <th>Date de création</th>
        </tr>
      );
    
    // Create the table body based on the data type
    const tableBody = data.map((item) => (
        <tr key={item.id}>
            <td>{dataType === 'users' ? item.name + " " + item.firstName : item.nameFile}</td>
            <td>{dataType === 'users' ? item.storageCapacity : item.weight}</td>
            <td>{dataType === 'users' ? item.storageUsed : null}</td>
            <td>{dataType === 'users' ? item.storageUsagePercentage : null}%</td>
            <td>{dataType === 'users' ? item.createdDate : item.uploadDate}</td>
            <td>{dataType === 'users' ? <button>Voir plus</button> : null}</td>
        </tr>
    ));
    return (
        <div className="list">
            <table className='listTable'>
                <thead>{tableHeaders}</thead>
                <tbody>{tableBody}</tbody>     
            </table>
        </div>
    )
}