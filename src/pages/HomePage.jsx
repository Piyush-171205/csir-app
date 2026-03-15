import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = ({ t }) => {
  const navigate = useNavigate();

  return (
    <>
      <section className="hero">
        <div className="hero-overlay"></div>
        <h1 className="hero-title animate-title">C.S.I.R.</h1>
        <p className="hero-slogan">{t.slogan}</p>
        <div className="hero-buttons">
          <button className="get-started-btn" onClick={() => navigate('/login')}>
            {t.login}
          </button>
          <button className="get-started-btn register-hero" onClick={() => navigate('/register')}>
            {t.register}
          </button>
        </div>
      </section>
      
      <section className="about glass-card">
        <div className="about-content">
          <h2>{t.about}</h2>
          <p>{t.aboutDesc}</p>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="services-section">
        <h2 className="section-title">{t.ourServices}</h2>
        <p className="section-description">{t.servicesDesc}</p>
        
        <div className="services-grid">
          <div className="service-card glass-card">
            <div className="service-icon">🛣️</div>
            <h3 className="service-title">{t.roadTransport}</h3>
            <p className="service-description">{t.roadDesc}</p>
          </div>
          
          <div className="service-card glass-card">
            <div className="service-icon">💧</div>
            <h3 className="service-title">{t.waterSupply}</h3>
            <p className="service-description">{t.waterDesc}</p>
          </div>
          
          <div className="service-card glass-card">
            <div className="service-icon">⚡</div>
            <h3 className="service-title">{t.electricity}</h3>
            <p className="service-description">{t.electricityDesc}</p>
          </div>
          
          <div className="service-card glass-card">
            <div className="service-icon">🗑️</div>
            <h3 className="service-title">{t.garbage}</h3>
            <p className="service-description">{t.garbageDesc}</p>
          </div>
          
          <div className="service-card glass-card">
            <div className="service-icon">🏗️</div>
            <h3 className="service-title">{t.infrastructure}</h3>
            <p className="service-description">{t.infrastructureDesc}</p>
          </div>
          
          <div className="service-card glass-card">
            <div className="service-icon">📚</div>
            <h3 className="service-title">{t.education}</h3>
            <p className="service-description">{t.educationDesc}</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <h2 className="section-title">{t.howItWorks}</h2>
        
        <div className="steps-container">
          <div className="step-card glass-card">
            <div className="step-icon">📸</div>
            <div className="step-number">1</div>
            <h3 className="step-title">{t.step1}</h3>
            <p className="step-description">{t.step1Desc}</p>
          </div>
          
          <div className="step-card glass-card">
            <div className="step-icon">🚧</div>
            <div className="step-number">2</div>
            <h3 className="step-title">{t.step2}</h3>
            <p className="step-description">{t.step2Desc}</p>
          </div>
          
          <div className="step-card glass-card">
            <div className="step-icon">⚙️</div>
            <div className="step-number">3</div>
            <h3 className="step-title">{t.step3}</h3>
            <p className="step-description">{t.step3Desc}</p>
          </div>
          
          <div className="step-card glass-card">
            <div className="step-icon">✅</div>
            <div className="step-number">4</div>
            <h3 className="step-title">{t.step4}</h3>
            <p className="step-description">{t.step4Desc}</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;