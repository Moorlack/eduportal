// frontend/src/components/RegisterForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RegisterForm = ({ onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/register/', formData, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
      });
      setSuccess(response.data.message);
      setError('');
      setTimeout(onClose, 2000);
    } catch (err) {
      const errors = err.response?.data || {};
      setError(
        errors.username?.[0] ||
        errors.email?.[0] ||
        errors.non_field_errors?.[0] ||
        'Помилка реєстрації'
      );
      setSuccess('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <div className="mb-3 form-group-unique">
        <label className="form-label">Email</label>
        <input
          type="email"
          name="email"
          className="form-control"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="example@domain.com"
        />
      </div>
      <div className="mb-3 form-group-unique">
        <label className="form-label">Ім’я користувача</label>
        <input
          type="text"
          name="username"
          className="form-control"
          value={formData.username}
          onChange={handleChange}
          required
          placeholder="Ваш логін"
        />
      </div>
      <div className="mb-3 form-group-unique">
        <label className="form-label">Пароль</label>
        <input
          type="password"
          name="password"
          className="form-control"
          value={formData.password}
          onChange={handleChange}
          required
          minLength="8"
          placeholder="Мінімум 8 символів"
        />
      </div>
      <button type="submit" className="btn btn-primary w-100">Зареєструватися</button>
      <p className="mt-2 text-center">
        Вже маєте акаунт?{' '}
        <a href="#" onClick={onSwitchToLogin}>
          Увійти
        </a>
      </p>
    </form>
  );
};

export default RegisterForm;