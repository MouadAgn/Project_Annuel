import React from 'react';
import { Home as HomeIcon, Search, UserRoundPen, LogOut, BookText } from 'lucide-react';
import './SideBar.css';

const SideBar = () => {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li><a href="/home"><HomeIcon size={20} /><span>Home</span></a></li>
          <li><a href="/profile"><UserRoundPen size={20} /><span>Profile</span></a></li>
          <li><a href="/invoices"><BookText size={20} /><span>Mes Factures</span></a></li>
          <li><a href="/logout"><LogOut size={20} /><span>Déconnexion</span></a></li>

        </ul>
      </nav>
    </aside>
  );
};

export default SideBar;