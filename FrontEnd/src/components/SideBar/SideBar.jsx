import React, { useContext } from 'react';

import { Home as HomeIcon, UserRoundPen, LogOut, ReceiptText, Presentation } from 'lucide-react';
import AuthContext from '@services/Security';

import './SideBar.css';

const SideBar = () => {
  const { user } = useContext(AuthContext);
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li><a href="/home"><HomeIcon size={20} /><span>Home</span></a></li>
          <li><a href="/profile"><UserRoundPen size={20} /><span>Profile</span></a></li>
          <li><a href="/invoices"><ReceiptText  size={20} /><span>Mes Factures</span></a></li>
          {user && user.roles.includes('ROLE_ADMIN') && (
            <li><a href="/dashboard"><Presentation size={20} /><span>Dashboard</span></a></li>
          )}
          <li><a href="/logout"><LogOut size={20} /><span>Déconnexion</span></a></li>
        </ul>
      </nav>
    </aside>
  );
};


export default SideBar;