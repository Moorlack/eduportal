// frontend/src/components/FeedbackForm.js
import React, { useState } from 'react';
import axios from 'axios';

function FeedbackForm({ courseId }) {
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  console.log('FeedbackForm received courseId:', courseId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!courseId) {
      setError('Курс не вибрано');
      return;
    }
    try {
      console.log('Submitting feedback:', { course: courseId, text, rating });
      const response = await axios.post('http://localhost:8000/api/feedback/', {
        course: courseId,
        text,
        rating
      }, {
        headers: { 'Authorization': `Token ${localStorage.getItem('token')}` }
      });
      setSuccess('Відгук успішно надіслано!');
      setText('');
      setRating(5);
      console.log('Feedback response:', response.data);
    } catch (err) {
      let errorMessage = 'Помилка надсилання відгуку';
      if (err.response?.data?.error) {
        if (typeof err.response.data.error === 'string') {
          errorMessage = err.response.data.error;
        } else {
          errorMessage = Object.values(err.response.data.error)
            .flat()
            .join(', ');
        }
      }
      setError(errorMessage);
      console.error('Feedback error:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
    }
  };

  if (!courseId) {
    return <div className="alert alert-warning">Курс не вибрано. Будь ласка, виберіть курс.</div>;
  }

  return (
    <div className="mt-4">
      <h3>Залишити відгук</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Текст відгуку:</label>
          <textarea
            className="form-control"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Оцінка (1-5):</label>
          <input
            type="number"
            className="form-control"
            value={rating}
            onChange={(e) => setRating(parseInt(e.target.value))}
            min="1"
            max="5"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#E0D7C8', borderColor: '#E0D7C8', color: '#333' }}>
          Надіслати
        </button>
      </form>
    </div>
  );
}

export default FeedbackForm;