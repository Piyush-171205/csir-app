import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

const Header = ({ isLoggedIn, currentUser, t }) => {
  return (
    <header className="header">
      <div className="header-left">
        <img 
          src="https://www.jobsgyan.in/wp-content/uploads/2021/03/NMMC-Logo-2021.jpg"
          className="nmmc-logo-img"
          alt="NMMC Logo"
        />
        <div className="nmmc-text">
          <h2>{t.nmmc}</h2>
        </div>
      </div>
      <div className="header-right">
        <a href="https://www.facebook.com/share/1AyhbE6q7K/" target="_blank" rel="noopener noreferrer">
          <img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" className="social-icon-img" alt="Facebook" />
        </a>
        <a href="https://www.instagram.com/nmmconline?igsh=MWI5czRpdHUwcmpjZA==" target="_blank" rel="noopener noreferrer">
          <img src="https://cdn-icons-png.flaticon.com/512/174/174855.png" className="social-icon-img" alt="Instagram" />
        </a>
        <a href="https://twitter.com/nmmconline" target="_blank" rel="noopener noreferrer">
          <img src="https://cdn-icons-png.flaticon.com/512/124/124021.png" className="social-icon-img" alt="X (Twitter)" />
        </a>
        <img src="https://tse3.mm.bing.net/th/id/OIP.AvrAle5yRzcbL_Jo-oSYDQHaEe?pid=Api&P=0&h=180" className="swachh-logo-img" alt="Swachh Bharat" />
        <img src="https://www.nicepng.com/png/detail/933-9333810_ashok-stambh-logo-hd.png" className="ashok-stambh-img" alt="Ashok Stambh" />
        
        {isLoggedIn && (
          <Link to="/profile" className="user-profile-icon">
            <FaUserCircle size={40} color="#000080" />
            <span className="profile-tooltip">{t.userProfile}</span>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;