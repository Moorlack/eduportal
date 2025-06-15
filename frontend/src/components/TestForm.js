// frontend/src/components/TestForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TestForm = ({ lessonId }) => {
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [csrfToken, setCsrfToken] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

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

    const fetchTest = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/tests/?lesson=${lessonId}`, {
          headers: { 'Authorization': `Token ${localStorage.getItem('token')}` }
        });
        setTest(response.data[0] || null);  // Беремо перший тест або null
      } catch (err) {
        setError('Помилка завантаження тесту');
      }
    };
    fetchTest();
  }, [lessonId]);

  const handleAnswerChange = (questionId, answerId) => {
    setAnswers({ ...answers, [questionId]: { id: answerId, question_id: questionId } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!test) return;
    try {
      const response = await axios.post('http://localhost:8000/api/attempts/', {
        test_id: test.id,
        answers: Object.values(answers)
      }, {
        headers: {
          'X-CSRFToken': csrfToken,
          'Authorization': `Token ${localStorage.getItem('token')}`
        }
      });
      setResult(response.data);
      setError('');
    } catch (err) {
      setError('Помилка надсилання відповідей');
    }
  };

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!test) return <div>Тест не знайдено або завантажується...</div>;

  return (
    <div className="mt-4">
      <h2>{test.title}</h2>
      {result && (
        <div className={`alert ${result.passed ? 'alert-success' : 'alert-danger'}`}>
          Результат: {result.score}/{result.max_score} балів. 
          {result.passed ? ' Тема пройдена!' : ' Тема не пройдена.'}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        {test.questions.map((question) => (
          <div key={question.id} className="mb-3">
            <h5>{question.text}</h5>
            {question.answers.map((answer) => (
              <div key={answer.id} className="form-check">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={answer.id}
                  onChange={() => handleAnswerChange(question.id, answer.id)}
                  className="form-check-input"
                />
                <label className="form-check-label">{answer.text}</label>
              </div>
            ))}
          </div>
        ))}
        <button type="submit" className="btn btn-primary">Надіслати</button>
      </form>
    </div>
  );
};

export default TestForm;