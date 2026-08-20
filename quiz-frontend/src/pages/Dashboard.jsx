// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

const Dashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchQuizHistory();
  }, []);

  const fetchQuizHistory = async () => {
    try {
      const response = await API.get('/quizzes/dashboard');
      setQuizzes(response.data.quizzes || response.data || []);
    } catch (err) {
      setError('Failed to load quiz history.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate aggregated stats
  const totalQuizzes = quizzes.length;
  const avgScore = totalQuizzes
    ? Math.round(
        quizzes.reduce(
          (acc, q) => acc + (q.score / q.total_questions) * 100,
          0
        ) / totalQuizzes
      )
    : 0;

  return (
    <div style={styles.container}>
      {/* Top Banner */}
      <div style={styles.banner}>
        <div>
          <h1 style={styles.welcomeTitle}>Welcome Back!</h1>
          <p style={styles.welcomeSubtitle}>
            Track your progress and test your knowledge.
          </p>
        </div>
        <Link to="/quiz/setup" style={styles.newQuizBtn}>
          + Create New Quiz
        </Link>
      </div>

      {/* Stats Overview Grid */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Total Quizzes Taken</span>
          <span style={styles.statValue}>{totalQuizzes}</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Average Score</span>
          <span style={styles.statValue}>{avgScore}%</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Completed Topics</span>
          <span style={styles.statValue}>
            {new Set(quizzes.map((q) => q.domain)).size}
          </span>
        </div>
      </div>

      {/* Quiz History List */}
      <div style={styles.historyCard}>
        <h3 style={styles.sectionTitle}>📜 Quiz History</h3>

        {loading ? (
          <p style={styles.mutedText}>Loading your history...</p>
        ) : error ? (
          <div style={styles.errorBox}>{error}</div>
        ) : quizzes.length === 0 ? (
          <div style={styles.emptyState}>
            <p>No quizzes taken yet!</p>
            <Link to="/quiz/setup" style={styles.inlineLink}>
              Generate your first quiz now
            </Link>
          </div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Topic / Domain</th>
                  <th style={styles.th}>Difficulty</th>
                  <th style={styles.th}>Score</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {quizzes.map((quiz) => {
                  const percentage = Math.round(
                    (quiz.score / quiz.total_questions) * 100
                  );
                  return (
                    <tr key={quiz.id} style={styles.tr}>
                      <td style={styles.tdBold}>{quiz.domain}</td>
                      <td style={styles.td}>
                        <span style={styles.badge}>{quiz.difficulty}</span>
                      </td>
                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.scoreBadge,
                            backgroundColor:
                              percentage >= 70
                                ? '#dcfce7'
                                : percentage >= 50
                                ? '#fef9c3'
                                : '#fee2e2',
                            color:
                              percentage >= 70
                                ? '#15803d'
                                : percentage >= 50
                                ? '#a16207'
                                : '#b91c1c',
                          }}
                        >
                          {quiz.score} / {quiz.total_questions} ({percentage}%)
                        </span>
                      </td>
                      <td style={styles.td}>
                        {new Date(quiz.created_at).toLocaleDateString()}
                      </td>
                      <td style={styles.td}>
                        <Link
                          to={`/quiz/review/${quiz.id}`}
                          style={styles.reviewBtn}
                        >
                          View Review
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '1000px', margin: '40px auto', padding: '0 20px' },
  banner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  welcomeTitle: { margin: 0, fontSize: '2rem', color: '#111827' },
  welcomeSubtitle: { margin: '4px 0 0 0', color: '#6b7280' },
  newQuizBtn: {
    backgroundColor: '#2563eb',
    color: '#fff',
    padding: '12px 20px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
    marginBottom: '32px',
  },
  statCard: {
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  statLabel: { fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' },
  statValue: { fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' },
  historyCard: {
    backgroundColor: '#ffffff',
    padding: '28px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
  },
  sectionTitle: { margin: '0 0 20px 0', fontSize: '1.3rem', color: '#111827' },
  mutedText: { color: '#6b7280' },
  errorBox: { color: '#dc2626', padding: '12px', backgroundColor: '#fee2e2', borderRadius: '6px' },
  emptyState: { textAlign: 'center', padding: '40px 0', color: '#6b7280' },
  inlineLink: { color: '#2563eb', fontWeight: 'bold', textDecoration: 'none' },
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  th: { padding: '12px 16px', borderBottom: '2px solid #f3f4f6', color: '#4b5563', fontSize: '0.85rem' },
  tr: { borderBottom: '1px solid #f3f4f6' },
  td: { padding: '14px 16px', fontSize: '0.95rem', color: '#374151' },
  tdBold: { padding: '14px 16px', fontSize: '0.95rem', fontWeight: '600', color: '#111827' },
  badge: {
    textTransform: 'capitalize',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    backgroundColor: '#f3f4f6',
    padding: '4px 8px',
    borderRadius: '4px',
  },
  scoreBadge: {
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '0.85rem',
    fontWeight: 'bold',
  },
  reviewBtn: {
    color: '#2563eb',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '0.9rem',
  },
};

export default Dashboard;