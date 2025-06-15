import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Analytics() {
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState('');
  const [courseId, setCourseId] = useState(null);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/courses/', {
          headers: { 'Authorization': `Token ${localStorage.getItem('token')}` }
        });
        setCourses(response.data);
        if (response.data.length > 0 && !courseId) {
          setCourseId(response.data[0].id);
        }
      } catch (err) {
        setError('Помилка завантаження курсів');
        console.error('Fetch courses error:', err);
      }
    };

    const fetchProgress = async () => {
      if (!courseId) return;
      try {
        console.log('Fetching progress for courseId:', courseId);
        const response = await axios.get(`http://localhost:8000/api/progress/${courseId}/`, {
          headers: { 'Authorization': `Token ${localStorage.getItem('token')}` }
        });
        setProgress(response.data);
        setError('');
        console.log('Progress response:', response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Помилка завантаження аналітики');
        console.error('Fetch progress error:', {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message
        });
      }
    };

    fetchCourses();
    fetchProgress();
  }, [courseId]);

  const handleCourseChange = (e) => {
    const newCourseId = parseInt(e.target.value);
    setCourseId(newCourseId);
    setProgress(null);
  };

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!courses.length || !courseId) {
    console.log('No courses or courseId:', { courses, courseId });
    return <div>Завантаження курсів...</div>;
  }
  if (!progress) {
    console.log('No progress for courseId:', courseId);
    return <div>Завантаження прогресу...</div>;
  }

  return (
    <div className="mt-4">
      <h2>Аналітика прогресу</h2>
      <div className="mb-3">
        <label className="form-label">Виберіть курс:</label>
        <select className="form-control" value={courseId} onChange={handleCourseChange}>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>{course.title}</option>
          ))}
        </select>
      </div>
      {progress.total_lessons === 0 ? (
        <p>У цьому курсі немає тем із тестами.</p>
      ) : (
        <>
          <p>Пройдено тем: {progress.completed_lessons}/{progress.total_lessons}</p>
          <p>Середній бал: {progress.average_score}</p>
          {progress.completed_lessons === 0 && <p>Ви ще не пройшли жодного тесту для цього курсу.</p>}
        </>
      )}
    </div>
  );
}

export default Analytics;