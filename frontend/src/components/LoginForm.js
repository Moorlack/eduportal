// frontend/src/components/LoginForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

function LoginForm({ onClose, onSwitchToRegister, setIsAuthenticated }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    const getCsrfToken = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/csrf/');
        setCsrfToken(response.data.csrfToken);
      } catch (err) {
        console.error('Помилка отримання CSRF-токена:', err);
      }
    };
    getCsrfToken();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/login/', {
        username,
        password
      }, {
        headers: { 'X-CSRFToken': csrfToken }
      });
      localStorage.setItem('token', response.data.token);
      setIsAuthenticated(true);  // Оновлюємо статус
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Помилка авторизації');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mb-3">
        <label className="form-label">Ім’я користувача</label>
        <input
          type="text"
          className="form-control"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Пароль</label>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary">Увійти</button>
      <button type="button" className="btn btn-link" onClick={onSwitchToRegister}>
        Реєстрація
      </button>
    </form>
  );
}

LoginForm.propTypes = {
  onClose: PropTypes.func.is_required,
  onSwitchToRegister: PropTypes.func.is_required,
  setIsAuthenticated: PropTypes.func.is_required
};

export default LoginForm;