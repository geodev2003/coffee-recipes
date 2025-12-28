import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import CoffeePage from './pages/CoffeePage';
import TeaPage from './pages/TeaPage';
import MocktailPage from './pages/MocktailPage';
import AboutPage from './pages/AboutPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import UserLoginPage from './pages/UserLoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import WishlistPage from './pages/WishlistPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import { trackVisitor } from './services/api';

function AppContent() {
  const location = useLocation();
  
  useEffect(() => {
    // Track visitor on route change
    trackVisitor(location.pathname);
  }, [location]);

  return (
    <Routes>
      {/* Login page (no header) */}
      {/* Auth Pages */}
      <Route path="/admin/login" element={<LoginPage />} />
      <Route path="/login" element={<UserLoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Protected admin route */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <div className="min-h-screen">
              <Header />
              <AdminPage />
            </div>
          </ProtectedRoute>
        } 
      />
      
      {/* Protected user routes */}
      <Route path="/profile" element={
        <div className="min-h-screen flex flex-col">
          <Header />
          <ProfilePage />
          <Footer />
          <ScrollToTop />
        </div>
      } />
      <Route path="/wishlist" element={
        <div className="min-h-screen flex flex-col">
          <Header />
          <WishlistPage />
          <Footer />
          <ScrollToTop />
        </div>
      } />
      
      {/* Public routes with header and footer */}
      <Route path="/" element={
        <div className="min-h-screen flex flex-col">
          <Header />
          <HomePage />
          <Footer />
          <ScrollToTop />
        </div>
      } />
      <Route path="/coffee" element={
        <div className="min-h-screen flex flex-col">
          <Header />
          <CoffeePage />
          <Footer />
          <ScrollToTop />
        </div>
      } />
      <Route path="/tea" element={
        <div className="min-h-screen flex flex-col">
          <Header />
          <TeaPage />
          <Footer />
          <ScrollToTop />
        </div>
      } />
      <Route path="/mocktail" element={
        <div className="min-h-screen flex flex-col">
          <Header />
          <MocktailPage />
          <Footer />
          <ScrollToTop />
        </div>
      } />
      <Route path="/about" element={
        <div className="min-h-screen flex flex-col">
          <Header />
          <AboutPage />
          <Footer />
          <ScrollToTop />
        </div>
      } />
      <Route path="/recipe/:id" element={
        <div className="min-h-screen flex flex-col">
          <Header />
          <RecipeDetailPage />
          <Footer />
          <ScrollToTop />
        </div>
      } />
    </Routes>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <AppContent />
          </Router>
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
