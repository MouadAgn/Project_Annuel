import './ListUser.css';
import TestAPI from '../Test.jsx';

export default function ListUser() {
    return (
        <div className="listUser">
            <TestAPI />
            {/* <table className='listUserTable'>
                <thead>
                    <tr>
                        <th>Utilisateur</th>
                        <th>Stockage total</th>
                        <th>Stockage restant</th>
                        <th>Date de création</th>
                        <th>Voir plus</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>John Doe</td>
                        <td>10go</td>
                        <td>5go</td>
                        <td>01/01/2021</td>
                        <td><button>voir plus</button></td>
                    </tr>
                    <tr>
                        <td>John Doe</td>
                        <td>10go</td>
                        <td>5go</td>
                        <td>01/01/2021</td>
                        <td><button>voir plus</button></td>
                    </tr>
                </tbody> 
            </table> */}
        </div>
    )
}