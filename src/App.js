import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import MenuDashboard from './components/MenuDashboard';
import DrinksMenu from './components/DrinksMenu';

const DEFAULT_CREDENTIALS = {
  username: 'admin',
  password: '12345'
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');

  const handleLogin = (credentials) => {
    if (
      credentials.username === DEFAULT_CREDENTIALS.username &&
      credentials.password === DEFAULT_CREDENTIALS.password
    ) {
      setIsLoggedIn(true);
    } else {
      alert('Invalid credentials. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView('dashboard');
  };

  const navigateToDrinks = () => {
    setCurrentView('drinks');
  };

  const handleBack = () => {
    setCurrentView('dashboard');
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div>
      {currentView === 'dashboard' ? (
        <MenuDashboard 
          onLogout={handleLogout}
          onDrinksClick={navigateToDrinks}
        />
      ) : currentView === 'drinks' ? (
        <DrinksMenu onBack={handleBack} />
      ) : null}
    </div>
  );
};

export default App;