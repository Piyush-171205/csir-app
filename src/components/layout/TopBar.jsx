import React from 'react';
import { Link } from 'react-router-dom';

const TopBar = ({ isLoggedIn, t }) => {
  return (
    <div className="top-bar">
      <div className="language-switcher">
        <button className="active">English</button>
        <button>हिन्दी</button>
        <button>मराठी</button>
      </div>
      {!isLoggedIn && (
        <Link to="/register" className="register-top-btn">
          {t.register}
        </Link>
      )}
    </div>
  );
};

export default TopBar;