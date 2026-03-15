import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = ({ t }) => {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-column">
          <h3>{t.quickLinks}</h3>
          <ul>
            <li><button onClick={() => navigate('/app-complaint')}>{t.appComplaints}</button></li>
            <li><button onClick={() => navigate('/app-feedback')}>{t.appFeedback}</button></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>{t.reachUs}</h3>
          <ul>
            <li><button onClick={() => navigate('/contact')}>{t.contactUs}</button></li>
            <li><button onClick={() => navigate('/emergency')}>{t.emergency}</button></li>
            <li><button onClick={() => navigate('/help')}>{t.help}</button></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>{t.navigateSite}</h3>
          <ul>
            <li><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>{t.home}</button></li>
            <li><button onClick={() => navigate('/search')}>{t.search}</button></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>{t.aboutWebsite}</h3>
          <ul>
            <li><button onClick={() => navigate('/privacy')}>{t.privacy}</button></li>
            <li><button onClick={() => navigate('/disclaimer')}>{t.disclaimer}</button></li>
            <li><button onClick={() => navigate('/terms')}>{t.terms}</button></li>
          </ul>
        </div>
      </div>
      <div className="copyright">
        <p>{t.copyright}</p>
      </div>
    </footer>
  );
};

export default Footer;