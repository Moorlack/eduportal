// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import Home from './components/Home';
import CourseDetail from './components/CourseDetail';
import FeedbackForm from './components/FeedbackForm';
import Analytics from './components/Analytics';
import Modal from './components/Modal';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import TestAdminForm from './components/TestAdminForm';
import TestPage from './components/TestPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  const openLogin = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };

  const openRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    window.location.href = '/';  // Перенаправлення на головну
  };

  useEffect(() => {
    // Перевірка токена при завантаженні
    setIsAuthenticated(!!localStorage.getItem('token'));
  }, []);

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#FFF8E8' }}>
        <div className="container">
          <Link className="navbar-brand" to="/">EduPortal</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">Головна</Link>
              </li>
              {isAuthenticated ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/analytics">Аналітика</Link>
                  </li>
                  <li className="nav-item">
                    <button className="nav-link btn btn-link" onClick={handleLogout}>Вийти</button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <a className="nav-link" href="#" onClick={openLogin}>Авторизація</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#" onClick={openRegister}>Реєстрація</a>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/admin-test" element={<TestAdminForm />} />
          <Route path="/test/:lessonId" element={<TestPage />} />
        </Routes>
      </div>

      <Modal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} title="Авторизація">
        <LoginForm onClose={() => setIsLoginOpen(false)} onSwitchToRegister={openRegister} setIsAuthenticated={setIsAuthenticated} />
      </Modal>
      <Modal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} title="Реєстрація">
        <RegisterForm onClose={() => setIsRegisterOpen(false)} onSwitchToLogin={openLogin} />
      </Modal>

      <footer style={{ backgroundColor: '#FFF8E8', marginTop: '20px', padding: '10px 0' }}>
        <div className="container">
          <p>© 2025 EduPortal. Всі права захищено.</p>
        </div>
      </footer>
    </Router>
  );
}

export default App;