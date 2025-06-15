// frontend/src/components/TestAdminForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TestAdminForm = () => {
  const [testData, setTestData] = useState({ lesson: '', title: '' });
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({ text: '', answers: [{ text: '', is_correct: false, points: 1 }] });
  const [csrfToken, setCsrfToken] = useState('');
  const [success, setSuccess] = useState('');
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
  }, []);

  const handleTestChange = (e) => {
    setTestData({ ...testData, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (e) => {
    setCurrentQuestion({ ...currentQuestion, [e.target.name]: e.target.value });
  };

  const handleAnswerChange = (index, field, value) => {
    const newAnswers = [...currentQuestion.answers];
    newAnswers[index] = { ...newAnswers[index], [field]: value };
    setCurrentQuestion({ ...currentQuestion, answers: newAnswers });
  };

  const addAnswer = () => {
    setCurrentQuestion({
      ...currentQuestion,
      answers: [...currentQuestion.answers, { text: '', is_correct: false, points: 1 }]
    });
  };

  const addQuestion = () => {
    setQuestions([...questions, currentQuestion]);
    setCurrentQuestion({ text: '', answers: [{ text: '', is_correct: false, points: 1 }] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const testResponse = await axios.post('http://localhost:8000/api/tests/', testData, {
        headers: {
          'X-CSRFToken': csrfToken,
          'Authorization': `Token ${localStorage.getItem('token')}`
        }
      });
      for (const question of questions) {
        const questionResponse = await axios.post('http://localhost:8000/api/questions/', {
          test: testResponse.data.id,
          text: question.text,
          order: questions.indexOf(question) + 1
        }, {
          headers: {
            'X-CSRFToken': csrfToken,
            'Authorization': `Token ${localStorage.getItem('token')}`
          }
        });
        for (const answer of question.answers) {
          await axios.post('http://localhost:8000/api/answers/', {
            question: questionResponse.data.id,
            text: answer.text,
            is_correct: answer.is_correct,
            points: answer.points
          }, {
            headers: {
              'X-CSRFToken': csrfToken,
              'Authorization': `Token ${localStorage.getItem('token')}`
            }
          });
        }
      }
      setSuccess('Тест успішно створено!');
      setError('');
      setTestData({ lesson: '', title: '' });
      setQuestions([]);
    } catch (err) {
      setError('Помилка створення тесту');
      setSuccess('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <h2>Створити тест</h2>
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mb-3">
        <label className="form-label">ID теми</label>
        <input
          type="number"
          name="lesson"
          className="form-control"
          value={testData.lesson}
          onChange={handleTestChange}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Назва тесту</label>
        <input
          type="text"
          name="title"
          className="form-control"
          value={testData.title}
          onChange={handleTestChange}
          required
        />
      </div>
      <h4>Додати питання</h4>
      <div className="mb-3">
        <label className="form-label">Текст питання</label>
        <input
          type="text"
          name="text"
          className="form-control"
          value={currentQuestion.text}
          onChange={handleQuestionChange}
          required
        />
      </div>
      {currentQuestion.answers.map((answer, index) => (
        <div key={index} className="mb-3">
          <label className="form-label">Відповідь {index + 1}</label>
          <input
            type="text"
            className="form-control"
            value={answer.text}
            onChange={(e) => handleAnswerChange(index, 'text', e.target.value)}
            required
          />
          <div className="form-check mt-2">
            <input
              type="checkbox"
              className="form-check-input"
              checked={answer.is_correct}
              onChange={(e) => handleAnswerChange(index, 'is_correct', e.target.checked)}
            />
            <label className="form-check-label">Правильна</label>
          </div>
          <input
            type="number"
            className="form-control mt-2"
            value={answer.points}
            onChange={(e) => handleAnswerChange(index, 'points', parseInt(e.target.value))}
            min="1"
            required
          />
        </div>
      ))}
      <button type="button" className="btn btn-secondary mb-3" onClick={addAnswer}>Додати відповідь</button>
      <button type="button" className="btn btn-secondary mb-3 ms-2" onClick={addQuestion}>Додати питання</button>
      <button type="submit" className="btn btn-primary">Створити тест</button>
    </form>
  );
};

export default TestAdminForm;