// src/components/Navbar.jsx
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/dashboard" style={styles.brand}>
          ⚡ AI Quiz Generator
        </Link>
        <div style={styles.links}>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" style={styles.link}>
                Dashboard
              </Link>
              <Link to="/quiz/setup" style={styles.createBtn}>
                + New Quiz
              </Link>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>
                Login
              </Link>
              <Link to="/register" style={styles.registerBtn}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    backgroundColor: '#1f2937',
    color: '#fff',
    padding: '12px 24px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#60a5fa',
    textDecoration: 'none',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  link: {
    color: '#d1d5db',
    textDecoration: 'none',
    fontWeight: '500',
  },
  createBtn: {
    backgroundColor: '#2563eb',
    color: '#fff',
    padding: '6px 14px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  registerBtn: {
    backgroundColor: '#10b981',
    color: '#fff',
    padding: '6px 14px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  logoutBtn: {
    backgroundColor: '#ef4444',
    color: '#fff',
    border: 'none',
    padding: '6px 14px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default Navbar;