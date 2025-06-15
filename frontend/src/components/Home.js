import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


function Home() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/courses/')
      .then(response => setCourses(response.data))
      .catch(error => console.error('Помилка завантаження курсів:', error));
  }, []);

  return (
    <div className="mb-4">
      <h1>Сертифікаційна програма Data Science</h1>
      <p>Ласкаво просимо до нашого освітнього порталу! Програма включає 5 дисциплін, спрямованих на розвиток навичок у машинному навчанні, аналізі даних і статистиці.</p>
      <h2>Курси</h2>
      <ul className="list-group">
        {courses.map(course => (
          <li key={course.id} className="list-group-item">
            <Link to={`/course/${course.id}`} className="h3">{course.title}</Link>
            <p>{course.description}</p>
            {course.additional_resources && (
              <div>
                <h4>Додаткові ресурси:</h4>
                <p>{course.additional_resources}</p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}


export default Home;