// src/pages/QuizSetup.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const QuizSetup = () => {
  const [domain, setDomain] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [count, setCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!domain.trim()) {
      setError('Please enter a domain/topic.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await API.post('/generate-quiz', {
        domain: domain.trim(),
        difficulty,
        count: Number(count),
      });

      // Parse the JSON data from backend response
      let quizData;
      if (typeof response.data.data === 'string') {
        quizData = JSON.parse(response.data.data);
      } else {
        quizData = response.data.data;
      }

      const questions = quizData.quiz || quizData;

      // Navigate to active quiz screen with quiz state
      navigate('/quiz/play', {
        state: {
          questions,
          domain: domain.trim(),
          difficulty,
          count: Number(count),
        },
      });
    } catch (err) {
      setError(
        err.response?.data?.detail || 'Failed to generate quiz. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🎯 Configure Your Quiz</h2>
        <p style={styles.subtitle}>Select parameters to generate an AI quiz</p>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleGenerate} style={styles.form}>
          {/* Domain Input */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Quiz Topic / Domain</label>
            <input
              type="text"
              placeholder="e.g. Python Programming, World History, Machine Learning"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              required
              disabled={loading}
              style={styles.input}
            />
          </div>

          {/* Question Count Selection */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Number of Questions</label>
            <div style={styles.buttonGroup}>
              {[10, 15, 20, 30, 50].map((num) => (
                <button
                  type="button"
                  key={num}
                  onClick={() => setCount(num)}
                  disabled={loading}
                  style={{
                    ...styles.optionBtn,
                    ...(count === num ? styles.activeOptionBtn : {}),
                  }}
                >
                  {num} Questions
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Level Selection */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>
              Difficulty Level ({difficulty === 'easy' ? '60s' : difficulty === 'medium' ? '55s' : '50s'} / question)
            </label>
            <div style={styles.buttonGroup}>
              {[
                { label: 'Easy (60s)', value: 'easy' },
                { label: 'Medium (55s)', value: 'medium' },
                { label: 'Hard (50s)', value: 'hard' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.value}
                  onClick={() => setDifficulty(item.value)}
                  disabled={loading}
                  style={{
                    ...styles.optionBtn,
                    ...(difficulty === item.value ? styles.activeOptionBtn : {}),
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? '🤖 AI is Generating Questions...' : '🚀 Start Quiz'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', padding: '40px 20px' },
  card: {
    backgroundColor: '#ffffff',
    padding: '32px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '550px',
  },
  title: { margin: 0, fontSize: '1.75rem', color: '#111827', textAlign: 'center' },
  subtitle: { color: '#6b7280', fontSize: '0.9rem', textAlign: 'center', marginBottom: '24px' },
  errorBox: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    padding: '10px 14px',
    borderRadius: '6px',
    fontSize: '0.875rem',
    marginBottom: '16px',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '24px' },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '0.9rem', fontWeight: '600', color: '#374151' },
  input: {
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '1rem',
  },
  buttonGroup: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  optionBtn: {
    flex: '1 1 auto',
    padding: '10px 14px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    fontWeight: '600',
    cursor: 'pointer',
    textAlign: 'center',
  },
  activeOptionBtn: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    borderColor: '#2563eb',
  },
  submitBtn: {
    backgroundColor: '#10b981',
    color: '#fff',
    padding: '14px',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '8px',
  },
};

export default QuizSetup;