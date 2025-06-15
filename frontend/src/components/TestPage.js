// frontend/src/components/TestPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import TestForm from './TestForm';

function TestPage() {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/lessons/${lessonId}/`, {
          headers: { 'Authorization': `Token ${localStorage.getItem('token')}` }
        });
        setLesson(response.data);
      } catch (err) {
        setError('Помилка завантаження теми');
      }
    };
    fetchLesson();
  }, [lessonId]);

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!lesson) return <div>Завантаження...</div>;

  return (
    <div className="mt-4">
      <h2>Тест для теми: {lesson.title}</h2>
      <TestForm lessonId={parseInt(lessonId)} />
    </div>
  );
}

export default TestPage;