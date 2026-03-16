import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext.jsx';
import './test.js';

// Layout Components
import TopBar from './components/layout/TopBar';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Page Components
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
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

// Authority Page Components
import AuthorityDashboardPage from './pages/authority/AuthorityDashboardPage';
import AuthorityComplaintsPage from './pages/authority/AuthorityComplaintsPage';
import AuthorityComplaintDetailPage from './pages/authority/AuthorityComplaintDetailPage';
import AuthorityNotificationsPage from './pages/authority/AuthorityNotificationsPage';
import AuthorityProfilePage from './pages/authority/AuthorityProfilePage';
import AuthorityChangePasswordPage from './pages/authority/AuthorityChangePasswordPage';
import DepartmentFeedbackPage from './pages/authority/DepartmentFeedbackPage';

// Admin Page Components
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminCitizensPage from './pages/admin/AdminCitizensPage';
import AdminOfficersPage from './pages/admin/AdminOfficersPage';
import AdminComplaintsPage from './pages/admin/AdminComplaintsPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import AdminNotificationsPage from './pages/admin/AdminNotificationsPage';
import AdminProfilePage from './pages/admin/AdminProfilePage';
import AdminChangePasswordPage from './pages/admin/AdminChangePasswordPage';

// Still-needed mock data (complaints, feedback — not yet connected to backend)
import { complaintsDB, appComplaintsDB, appFeedbackDB } from './data/mockData';
import { securityQuestions, appComplaintTypes, severityLevels, ratingLabels } from './data/constants';
import { content } from './data/translations';

// Auth service
import { getProfile, logoutUser } from './services/authService.js';

const App = () => {
  const [language, setLanguage] = useState('english');
  const [showSplash, setShowSplash] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authorityNotifications, setAuthorityNotifications] = useState([]);
  const [authorityUnreadCount, setAuthorityUnreadCount] = useState(0);

  // ── Splash screen ──────────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  // ── Session restore on page refresh ───────────────────────────────────────
  // If a JWT token exists in localStorage, fetch the profile from the backend
  // to validate it and restore the user session without requiring re-login.
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('csir_token');
      if (!token) return;

      try {
        const user = await getProfile();
        setCurrentUser(user);
        setIsLoggedIn(true);
      } catch {
        // Token is invalid or expired — clear storage silently
        localStorage.removeItem('csir_token');
        localStorage.removeItem('csir_user');
      }
    };

    restoreSession();
  }, []);

  // ── Logout ─────────────────────────────────────────────────────────────────
  const handleLogout = () => {
    logoutUser(); // clears localStorage
    setIsLoggedIn(false);
    setCurrentUser(null);
    setAuthorityNotifications([]);
    setAuthorityUnreadCount(0);
  };

  const t = content[language];

  // ── Redirect helper (avoids repeating the ternary everywhere) ──────────────
  const dashboardPath = (user) => {
    if (!user) return '/';
    if (user.userType === 'citizen') return '/dashboard';
    if (user.userType === 'authority') return '/authority/dashboard';
    return '/admin/dashboard';
  };

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
            {/* ── Public Routes ── */}
            <Route path="/" element={
              !isLoggedIn
                ? <HomePage t={t} />
                : <Navigate to={dashboardPath(currentUser)} />
            } />

            <Route path="/login" element={
              !isLoggedIn
                ? <LoginPage t={t} setIsLoggedIn={setIsLoggedIn} setCurrentUser={setCurrentUser} />
                : <Navigate to={dashboardPath(currentUser)} />
            } />

            <Route path="/register" element={
              !isLoggedIn
                ? <RegisterPage t={t} securityQuestions={securityQuestions} />
                : <Navigate to={dashboardPath(currentUser)} />
            } />

            <Route path="/forgot-password" element={
              !isLoggedIn
                ? <ForgotPasswordPage t={t} />
                : <Navigate to={dashboardPath(currentUser)} />
            } />

            {/* ── Public Info Pages ── */}
            <Route path="/app-feedback" element={
              <AppFeedbackPage t={t} appFeedbackDB={appFeedbackDB} ratingLabels={ratingLabels} />
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
            <Route path="/contact"    element={<ContactPage t={t} />} />
            <Route path="/emergency"  element={<EmergencyPage t={t} />} />
            <Route path="/help"       element={<HelpPage t={t} />} />
            <Route path="/privacy"    element={<PrivacyPage t={t} />} />
            <Route path="/disclaimer" element={<DisclaimerPage t={t} />} />
            <Route path="/terms"      element={<TermsPage t={t} />} />

            {/* ── Protected Citizen Routes ── */}
            <Route path="/dashboard" element={
              isLoggedIn && currentUser?.userType === 'citizen'
                ? <DashboardPage currentUser={currentUser} t={t} handleLogout={handleLogout} />
                : <Navigate to="/" />
            } />
            <Route path="/report-issue" element={
              isLoggedIn && currentUser?.userType === 'citizen'
                ? <ReportIssuePage currentUser={currentUser} t={t}  />
                : <Navigate to="/" />
            } />
            <Route path="/my-issues" element={
              isLoggedIn && currentUser?.userType === 'citizen'
                ? <MyIssuesPage currentUser={currentUser} t={t} complaintsDB={complaintsDB} />
                : <Navigate to="/" />
            } />
            <Route path="/track-issue/:id" element={
              isLoggedIn && currentUser?.userType === 'citizen'
                ? <TrackIssuePage t={t} complaintsDB={complaintsDB} />
                : <Navigate to="/" />
            } />
            <Route path="/profile" element={
              isLoggedIn && currentUser?.userType === 'citizen'
                ? <ProfilePage currentUser={currentUser} t={t} handleLogout={handleLogout} />
                : <Navigate to="/" />
            } />

            {/* ── Authority Routes ── */}
            <Route path="/authority/dashboard" element={
              isLoggedIn && currentUser?.userType === 'authority'
                ? <AuthorityDashboardPage
                    currentUser={currentUser} t={t} handleLogout={handleLogout}
                    complaintsDB={complaintsDB}
                    authorityNotifications={authorityNotifications}
                    setAuthorityNotifications={setAuthorityNotifications}
                    setAuthorityUnreadCount={setAuthorityUnreadCount}
                  />
                : <Navigate to="/" />
            } />
            <Route path="/authority/complaints" element={
              isLoggedIn && currentUser?.userType === 'authority'
                ? <AuthorityComplaintsPage currentUser={currentUser} t={t} />
                : <Navigate to="/" />
            } />
            <Route path="/authority/complaint/:id" element={
              isLoggedIn && currentUser?.userType === 'authority'
                ? <AuthorityComplaintDetailPage
                    currentUser={currentUser} t={t}
                    complaintsDB={complaintsDB}
                    setAuthorityNotifications={setAuthorityNotifications}
                  />
                : <Navigate to="/" />
            } />
            <Route path="/authority/notifications" element={
              isLoggedIn && currentUser?.userType === 'authority'
                ? <AuthorityNotificationsPage
                    currentUser={currentUser} t={t}
                    authorityNotifications={authorityNotifications}
                    setAuthorityNotifications={setAuthorityNotifications}
                    setAuthorityUnreadCount={setAuthorityUnreadCount}
                  />
                : <Navigate to="/" />
            } />
            <Route path="/authority/profile" element={
              isLoggedIn && currentUser?.userType === 'authority'
                ? <AuthorityProfilePage currentUser={currentUser} t={t} handleLogout={handleLogout} />
                : <Navigate to="/" />
            } />
            <Route path="/authority/change-password" element={
              isLoggedIn && currentUser?.userType === 'authority'
                ? <AuthorityChangePasswordPage currentUser={currentUser} t={t} />
                : <Navigate to="/" />
            } />
            <Route path="/department-feedback/:department" element={
              <DepartmentFeedbackPage t={t} />
            } />

            {/* ── Admin Routes ── */}
            <Route path="/admin/dashboard" element={
              isLoggedIn && currentUser?.userType === 'admin'
                ? <AdminDashboardPage currentUser={currentUser} t={t} handleLogout={handleLogout} />
                : <Navigate to="/" />
            } />
            <Route path="/admin/citizens" element={
              isLoggedIn && currentUser?.userType === 'admin'
                ? <AdminCitizensPage t={t} />
                : <Navigate to="/" />
            } />
            <Route path="/admin/officers" element={
              isLoggedIn && currentUser?.userType === 'admin'
                ? <AdminOfficersPage t={t} />
                : <Navigate to="/" />
            } />
            <Route path="/admin/complaints" element={
              isLoggedIn && currentUser?.userType === 'admin'
                ? <AdminComplaintsPage t={t} />
                : <Navigate to="/" />
            } />
            <Route path="/admin/categories" element={
              isLoggedIn && currentUser?.userType === 'admin'
                ? <AdminCategoriesPage t={t} />
                : <Navigate to="/" />
            } />
            <Route path="/admin/reports" element={
              isLoggedIn && currentUser?.userType === 'admin'
                ? <AdminReportsPage t={t} />
                : <Navigate to="/" />
            } />
            <Route path="/admin/notifications" element={
              isLoggedIn && currentUser?.userType === 'admin'
                ? <AdminNotificationsPage t={t} />
                : <Navigate to="/" />
            } />
            <Route path="/admin/profile" element={
              isLoggedIn && currentUser?.userType === 'admin'
                ? <AdminProfilePage currentUser={currentUser} t={t} handleLogout={handleLogout} />
                : <Navigate to="/" />
            } />
            <Route path="/admin/change-password" element={
              isLoggedIn && currentUser?.userType === 'admin'
                ? <AdminChangePasswordPage currentUser={currentUser} t={t} />
                : <Navigate to="/" />
            } />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>

          {!isLoggedIn && window.location.pathname === '/' && <Footer t={t} />}
        </div>
      </Router>
    </LanguageProvider>
  );
};

export default App;