// frontend/src/components/CourseDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import FeedbackForm from './FeedbackForm';

function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [error, setError] = useState('');
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/courses/${id}/`, {
          headers: { 'Authorization': `Token ${localStorage.getItem('token')}` }
        });
        setCourse(response.data);
      } catch (err) {
        setError('Помилка завантаження курсу');
        console.error('Fetch course error:', err);
      }
    };

    const fetchLessons = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/lessons/?course=${id}`, {
          headers: { 'Authorization': `Token ${localStorage.getItem('token')}` }
        });
        setLessons(response.data);
      } catch (err) {
        setError('Помилка завантаження тем');
        console.error('Fetch lessons error:', err);
      }
    };

    fetchCourse();
    fetchLessons();
  }, [id]);

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!course) return <div>Завантаження...</div>;

  return (
    <div className="container mt-4">
      <h2>{course.title}</h2>
      <p>{course.description}</p>
      <button
        className="btn btn-primary mb-3"
        style={{ backgroundColor: '#E0D7C8', borderColor: '#E0D7C8', color: '#333' }}
        onClick={() => setShowFeedbackForm(!showFeedbackForm)}
      >
        {showFeedbackForm ? 'Приховати форму відгуку' : 'Залишити відгук'}
      </button>
      {showFeedbackForm && <FeedbackForm courseId={parseInt(id)} />}
      <h3>Теми</h3>
      {lessons.length === 0 ? (
        <p>У цьому курсі поки немає тем.</p>
      ) : (
        lessons.map((lesson) => (
          <div key={lesson.id} className="card mb-3" style={{ backgroundColor: '#F9F1E3', borderColor: '#E0D7C8' }}>
            <div className="card-body">
              <h5 className="card-title">{lesson.title}</h5>
              <p className="card-text">{lesson.content}</p>
              {lesson.video_url && (
                <div className="mb-3">
                  <h6>Відео до теми:</h6>
                  <a href={lesson.video_url} target="_blank" rel="noopener noreferrer" className="btn btn-link">
                    Переглянути відео
                  </a>
                </div>
              )}
              <Link to={`/test/${lesson.id}`} className="btn btn-primary" style={{ backgroundColor: '#E0D7C8', borderColor: '#E0D7C8', color: '#333' }}>
                Пройти тест
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default CourseDetail;