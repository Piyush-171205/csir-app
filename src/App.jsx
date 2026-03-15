import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';

// Layout Components
import TopBar from './components/layout/TopBar';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Page Components
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import ReportIssuePage from './pages/ReportIssuePage';
import MyIssuesPage from './pages/MyIssuesPage';
import TrackIssuePage from './pages/TrackIssuePage';
import ProfilePage from './pages/ProfilePage';
import AppFeedbackPage from './pages/AppFeedbackPage';
import AppComplaintPage from './pages/AppComplaintPage';
import ContactPage from './pages/ContactPage';
import EmergencyPage from './pages/EmergencyPage';
import HelpPage from './pages/HelpPage';
import PrivacyPage from './pages/PrivacyPage';
import DisclaimerPage from './pages/DisclaimerPage';
import TermsPage from './pages/TermsPage';

// Mock Data
import { usersDB, complaintsDB, appComplaintsDB, appFeedbackDB } from './data/mockData';
import { securityQuestions, appComplaintTypes, severityLevels, ratingLabels } from './data/constants';
import { content } from './data/translations';

const App = () => {
  const [language, setLanguage] = useState('english');
  const [showSplash, setShowSplash] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  const t = content[language];

  if (showSplash) {
    return (
      <div className="splash-screen">
        <div className="splash-content">
          <h1 className="splash-title">C.S.I.R.</h1>
          <p className="splash-subtitle">{t.fullName}</p>
        </div>
      </div>
    );
  }

  return (
    <LanguageProvider value={{ language, setLanguage, t }}>
      <Router>
        <div className="app">
          <TopBar isLoggedIn={isLoggedIn} t={t} />
          <Header isLoggedIn={isLoggedIn} currentUser={currentUser} t={t} />

          <Routes>
            <Route path="/" element={
              !isLoggedIn ? (
                <HomePage t={t} />
              ) : (
                <Navigate to="/dashboard" />
              )
            } />

            <Route path="/login" element={
              !isLoggedIn ? (
                <LoginPage 
                  t={t} 
                  usersDB={usersDB} 
                  setIsLoggedIn={setIsLoggedIn} 
                  setCurrentUser={setCurrentUser} 
                />
              ) : (
                <Navigate to="/dashboard" />
              )
            } />

            <Route path="/register" element={
              !isLoggedIn ? (
                <RegisterPage 
                  t={t} 
                  usersDB={usersDB} 
                  securityQuestions={securityQuestions}
                />
              ) : (
                <Navigate to="/dashboard" />
              )
            } />

            <Route path="/forgot-password" element={
              !isLoggedIn ? (
                <ForgotPasswordPage t={t} />
              ) : (
                <Navigate to="/dashboard" />
              )
            } />

            <Route path="/app-feedback" element={
              <AppFeedbackPage 
                t={t} 
                appFeedbackDB={appFeedbackDB}
                ratingLabels={ratingLabels}
              />
            } />

            <Route path="/app-complaint" element={
              <AppComplaintPage 
                t={t} 
                appComplaintsDB={appComplaintsDB}
                appComplaintTypes={appComplaintTypes}
                severityLevels={severityLevels}
                currentUser={currentUser}
              />
            } />

            <Route path="/contact" element={<ContactPage t={t} />} />
            <Route path="/emergency" element={<EmergencyPage t={t} />} />
            <Route path="/help" element={<HelpPage t={t} />} />
            <Route path="/privacy" element={<PrivacyPage t={t} />} />
            <Route path="/disclaimer" element={<DisclaimerPage t={t} />} />
            <Route path="/terms" element={<TermsPage t={t} />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={
              isLoggedIn && currentUser?.userType === 'citizen' ? (
                <DashboardPage 
                  currentUser={currentUser} 
                  t={t} 
                  handleLogout={handleLogout}
                />
              ) : (
                <Navigate to="/" />
              )
            } />

            <Route path="/report-issue" element={
              isLoggedIn && currentUser?.userType === 'citizen' ? (
                <ReportIssuePage 
                  currentUser={currentUser} 
                  t={t} 
                  complaintsDB={complaintsDB}
                />
              ) : (
                <Navigate to="/" />
              )
            } />

            <Route path="/my-issues" element={
              isLoggedIn && currentUser?.userType === 'citizen' ? (
                <MyIssuesPage 
                  currentUser={currentUser} 
                  t={t} 
                  complaintsDB={complaintsDB}
                />
              ) : (
                <Navigate to="/" />
              )
            } />

            <Route path="/track-issue/:id" element={
              isLoggedIn && currentUser?.userType === 'citizen' ? (
                <TrackIssuePage 
                  t={t} 
                  complaintsDB={complaintsDB}
                />
              ) : (
                <Navigate to="/" />
              )
            } />

            <Route path="/profile" element={
              isLoggedIn && currentUser?.userType === 'citizen' ? (
                <ProfilePage 
                  currentUser={currentUser} 
                  t={t} 
                  usersDB={usersDB}
                  handleLogout={handleLogout}
                />
              ) : (
                <Navigate to="/" />
              )
            } />
          </Routes>

          {!isLoggedIn && window.location.pathname === '/' && (
            <Footer t={t} />
          )}
        </div>
      </Router>
    </LanguageProvider>
  );
};

export default App;