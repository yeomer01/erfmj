import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoginScreen } from './components/modals/LoginScreen';
import DefectManagerApp from './components/DefectManagerApp';

export default function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleLogin = (user) => {
    setLoggedInUser(user);
    sessionStorage.setItem('er_logged_in_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    sessionStorage.removeItem('er_logged_in_user');
  };

  useEffect(() => {
    const savedUser = sessionStorage.getItem('er_logged_in_user');
    if (savedUser) {
      try {
        setLoggedInUser(JSON.parse(savedUser));
      } catch (e) {
        sessionStorage.removeItem('er_logged_in_user');
      }
    }
  }, []);

  return (
    <ErrorBoundary>
      {!loggedInUser ? (
        <LoginScreen onLogin={handleLogin} />
      ) : (
        <DefectManagerApp loggedInUser={loggedInUser} onLogout={handleLogout} />
      )}
    </ErrorBoundary>
  );
}
