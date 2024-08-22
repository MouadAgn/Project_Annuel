import React from 'react';
import { Home as HomeIcon, Search, UserRoundPen } from 'lucide-react';
import './SideBar.css';

const SideBar = () => {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li><a href="/home"><HomeIcon size={20} /><span>Home</span></a></li>
          <li><a href="#browse"><Search size={20} /><span>Browse</span></a></li>
          <li><a href="#profile"><UserRoundPen size={20} /><span>Profile</span></a></li>
        </ul>
      </nav>
    </aside>
  );
};

export default SideBar;