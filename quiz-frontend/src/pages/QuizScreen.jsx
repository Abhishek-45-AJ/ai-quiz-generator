// src/pages/QuizScreen.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../api/axios';

const QuizScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { questions, domain, difficulty, count } = location.state || {};

  // Redirect if accessed directly without state
  useEffect(() => {
    if (!questions || questions.length === 0) {
      navigate('/quiz/setup');
    }
  }, [questions, navigate]);

  // Calculate timer seconds per question based on difficulty rules
  const getInitialTime = () => {
    const secondsPerQuestion =
      difficulty === 'easy' ? 60 : difficulty === 'hard' ? 50 : 55;
    return (count || 10) * secondsPerQuestion;
  };

  const initialTotalSeconds = useRef(getInitialTime());
  const [timeLeft, setTimeLeft] = useState(initialTotalSeconds.current);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Live Countdown Timer ---
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmitQuiz();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (option) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentIndex]: option,
    }));
  };

  const handleSubmitQuiz = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Prepare detailed score & answer summary payload
    let score = 0;
    const answerDetails = questions.map((q, idx) => {
      const selected = userAnswers[idx] || 'Not Answered';
      const isCorrect = selected === q.correct_answer;
      if (isCorrect) score += 1;

      return {
        question_text: q.question,
        options: q.options,
        correct_answer: q.correct_answer,
        user_answer: selected,
        explanation: q.explanation,
        is_correct: isCorrect,
      };
    });

    const timeTakenSeconds = initialTotalSeconds.current - timeLeft;

    try {
      const response = await API.post('/quizzes/submit', {
        domain,
        difficulty,
        total_questions: count,
        score,
        time_taken_seconds: Math.max(0, timeTakenSeconds),
        answers: answerDetails,
      });

      // Redirect to detailed review of this quiz
      navigate(`/quiz/review/${response.data.quiz_id}`);
    } catch (err) {
      alert('Failed to save quiz results. Redirecting to dashboard.');
      navigate('/dashboard');
    }
  };

  if (!questions || questions.length === 0) return null;

  const currentQ = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  return (
    <div style={styles.container}>
      {/* Top Header Bar with Domain & Timer */}
      <div style={styles.header}>
        <div>
          <h3 style={styles.domainTitle}>{domain}</h3>
          <span style={styles.difficultyBadge}>{difficulty.toUpperCase()}</span>
        </div>
        <div
          style={{
            ...styles.timerBox,
            backgroundColor: timeLeft < 60 ? '#fee2e2' : '#e0f2fe',
            color: timeLeft < 60 ? '#dc2626' : '#0369a1',
          }}
        >
          ⏱️ Time Left: <strong>{formatTime(timeLeft)}</strong>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={styles.progressContainer}>
        <div
          style={{
            ...styles.progressBar,
            width: `${((currentIndex + 1) / questions.length) * 100}%`,
          }}
        />
      </div>

      {/* Question Card */}
      <div style={styles.card}>
        <span style={styles.qIndex}>
          Question {currentIndex + 1} of {questions.length}
        </span>
        <h3 style={styles.questionText}>{currentQ.question}</h3>

        <div style={styles.optionsList}>
          {currentQ.options.map((opt, i) => {
            const isSelected = userAnswers[currentIndex] === opt;
            return (
              <button
                key={i}
                onClick={() => handleSelectOption(opt)}
                style={{
                  ...styles.optionCard,
                  ...(isSelected ? styles.selectedOptionCard : {}),
                }}
              >
                <span style={styles.optionLetter}>
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        {/* Navigation Controls */}
        <div style={styles.navButtons}>
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0 || isSubmitting}
            style={styles.secondaryBtn}
          >
            Previous
          </button>

          {isLastQuestion ? (
            <button
              onClick={handleSubmitQuiz}
              disabled={isSubmitting}
              style={styles.submitBtn}
            >
              {isSubmitting ? 'Submitting...' : 'Finish & Submit Quiz'}
            </button>
          ) : (
            <button
              onClick={() => setCurrentIndex((prev) => prev + 1)}
              disabled={isSubmitting}
              style={styles.primaryBtn}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '750px', margin: '30px auto', padding: '0 20px' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  domainTitle: { margin: 0, fontSize: '1.4rem', color: '#111827' },
  difficultyBadge: {
    fontSize: '0.75rem',
    fontWeight: 'bold',
    backgroundColor: '#e5e7eb',
    padding: '2px 8px',
    borderRadius: '4px',
    color: '#374151',
  },
  timerBox: {
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '1rem',
    fontWeight: '500',
  },
  progressContainer: {
    height: '6px',
    backgroundColor: '#e5e7eb',
    borderRadius: '3px',
    overflow: 'hidden',
    marginBottom: '24px',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2563eb',
    transition: 'width 0.3s ease',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '32px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  },
  qIndex: { fontSize: '0.85rem', color: '#6b7280', fontWeight: 'bold' },
  questionText: { fontSize: '1.25rem', color: '#1f2937', marginTop: '8px', marginBottom: '24px' },
  optionsList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  optionCard: {
    display: 'flex',
    alignItems: 'center',
    padding: '14px 18px',
    borderRadius: '8px',
    border: '2px solid #e5e7eb',
    backgroundColor: '#ffffff',
    fontSize: '1rem',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s',
  },
  selectedOptionCard: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
    fontWeight: '600',
  },
  optionLetter: {
    fontWeight: 'bold',
    marginRight: '12px',
    padding: '4px 8px',
    borderRadius: '4px',
    backgroundColor: '#f3f4f6',
    fontSize: '0.85rem',
  },
  navButtons: { display: 'flex', justifyContent: 'space-between', marginTop: '32px' },
  secondaryBtn: {
    padding: '10px 20px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    fontWeight: '600',
  },
  primaryBtn: {
    padding: '10px 24px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#2563eb',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: '600',
  },
  submitBtn: {
    padding: '10px 24px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#10b981',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: '600',
  },
};

export default QuizScreen;