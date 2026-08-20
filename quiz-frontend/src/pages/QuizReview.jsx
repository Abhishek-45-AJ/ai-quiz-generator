    // src/pages/QuizReview.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';

const QuizReview = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchQuizDetail();
  }, [id]);

  const fetchQuizDetail = async () => {
    try {
      const response = await API.get(`/quizzes/history/${id}`);
      setQuiz(response.data);
    } catch (err) {
      setError('Failed to load quiz detailed review.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px' }}>
        <p>Loading Quiz Breakdown...</p>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px' }}>
        <div style={styles.errorBox}>{error || 'Quiz not found.'}</div>
        <Link to="/dashboard" style={styles.backBtn}>
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  const scorePercentage = Math.round(
    (quiz.score / quiz.total_questions) * 100
  );

  return (
    <div style={styles.container}>
      {/* Top Header Card */}
      <div style={styles.summaryCard}>
        <div style={styles.summaryHeader}>
          <div>
            <h2 style={styles.domainTitle}>{quiz.domain} Review</h2>
            <span style={styles.badge}>{quiz.difficulty}</span>
          </div>
          <div style={styles.scoreCircle}>
            <span style={styles.scoreText}>
              {quiz.score} / {quiz.total_questions}
            </span>
            <span style={styles.scoreSubtext}>{scorePercentage}% Correct</span>
          </div>
        </div>

        <div style={styles.actionRow}>
          <Link to="/dashboard" style={styles.secondaryBtn}>
            ← Back to Dashboard
          </Link>
          <Link to="/quiz/setup" style={styles.primaryBtn}>
            Retake / New Quiz
          </Link>
        </div>
      </div>

      {/* Question Breakdown List */}
      <h3 style={styles.sectionHeading}>Question Breakdown</h3>

      <div style={styles.questionsList}>
        {quiz.answers.map((q, idx) => {
          const isCorrect = q.is_correct;

          return (
            <div
              key={idx}
              style={{
                ...styles.questionCard,
                borderLeft: isCorrect ? '6px solid #10b981' : '6px solid #ef4444',
              }}
            >
              <div style={styles.questionHeader}>
                <span style={styles.qNumber}>Question {idx + 1}</span>
                <span
                  style={{
                    ...styles.statusBadge,
                    backgroundColor: isCorrect ? '#dcfce7' : '#fee2e2',
                    color: isCorrect ? '#15803d' : '#b91c1c',
                  }}
                >
                  {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                </span>
              </div>

              <h4 style={styles.questionTitle}>{q.question_text}</h4>

              {/* Options Breakdown */}
              <div style={styles.optionsWrapper}>
                {q.options.map((opt, oIdx) => {
                  const isUserSelection = q.user_answer === opt;
                  const isCorrectOption = q.correct_answer === opt;

                  let optBg = '#ffffff';
                  let optBorder = '#e5e7eb';
                  let textColor = '#374151';

                  if (isCorrectOption) {
                    optBg = '#f0fdf4';
                    optBorder = '#86efac';
                    textColor = '#166534';
                  } else if (isUserSelection && !isCorrect) {
                    optBg = '#fef2f2';
                    optBorder = '#fca5a5';
                    textColor = '#991b1b';
                  }

                  return (
                    <div
                      key={oIdx}
                      style={{
                        ...styles.optionRow,
                        backgroundColor: optBg,
                        borderColor: optBorder,
                        color: textColor,
                      }}
                    >
                      <span>
                        <strong>{String.fromCharCode(65 + oIdx)}.</strong> {opt}
                      </span>

                      <div style={styles.badgeContainer}>
                        {isUserSelection && (
                          <span style={styles.userBadge}>Your Choice</span>
                        )}
                        {isCorrectOption && (
                          <span style={styles.correctBadge}>Correct Answer</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* AI Explanation Box */}
              <div style={styles.explanationBox}>
                <strong>💡 Explanation:</strong>
                <p style={styles.explanationText}>{q.explanation}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '800px', margin: '40px auto', padding: '0 20px' },
  summaryCard: {
    backgroundColor: '#ffffff',
    padding: '32px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
    marginBottom: '32px',
  },
  summaryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  domainTitle: { margin: 0, fontSize: '1.75rem', color: '#111827' },
  badge: {
    textTransform: 'uppercase',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    backgroundColor: '#e5e7eb',
    padding: '4px 8px',
    borderRadius: '4px',
    color: '#374151',
  },
  scoreCircle: {
    textAlign: 'center',
    backgroundColor: '#f3f4f6',
    padding: '12px 24px',
    borderRadius: '10px',
  },
  scoreText: { display: 'block', fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' },
  scoreSubtext: { fontSize: '0.85rem', color: '#6b7280' },
  actionRow: { display: 'flex', gap: '12px' },
  secondaryBtn: {
    padding: '10px 16px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    textDecoration: 'none',
    color: '#374151',
    fontWeight: '600',
  },
  primaryBtn: {
    padding: '10px 16px',
    borderRadius: '6px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    textDecoration: 'none',
    fontWeight: '600',
  },
  sectionHeading: { fontSize: '1.25rem', color: '#111827', marginBottom: '16px' },
  questionsList: { display: 'flex', flexDirection: 'column', gap: '20px' },
  questionCard: {
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  questionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  qNumber: { fontSize: '0.85rem', color: '#6b7280', fontWeight: 'bold' },
  statusBadge: { fontSize: '0.8rem', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px' },
  questionTitle: { fontSize: '1.1rem', color: '#1f2937', marginTop: 0, marginBottom: '16px' },
  optionsWrapper: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' },
  optionRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 14px',
    borderRadius: '6px',
    border: '1px solid',
    fontSize: '0.95rem',
  },
  badgeContainer: { display: 'flex', gap: '6px' },
  userBadge: {
    backgroundColor: '#93c5fd',
    color: '#1e3a8a',
    fontSize: '0.7rem',
    fontWeight: 'bold',
    padding: '2px 6px',
    borderRadius: '4px',
  },
  correctBadge: {
    backgroundColor: '#86efac',
    color: '#14532d',
    fontSize: '0.7rem',
    fontWeight: 'bold',
    padding: '2px 6px',
    borderRadius: '4px',
  },
  explanationBox: {
    backgroundColor: '#f8fafc',
    padding: '12px 16px',
    borderRadius: '6px',
    borderLeft: '4px solid #64748b',
    fontSize: '0.9rem',
    color: '#334155',
  },
  explanationText: { margin: '4px 0 0 0', color: '#475569' },
  errorBox: { color: '#dc2626', padding: '12px', backgroundColor: '#fee2e2', borderRadius: '6px' },
  backBtn: { display: 'inline-block', marginTop: '16px', color: '#2563eb', fontWeight: 'bold' },
};

export default QuizReview;