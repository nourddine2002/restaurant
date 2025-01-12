import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import MenuDashboard from './components/MenuDashboard';


const DEFAULT_CREDENTIALS = {
  username: 'admin',
  password: '12345'
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
  };

  return (
    <div>
      {!isLoggedIn ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <MenuDashboard onLogout={handleLogout} />
      )}
    </div>
  );
};

export default App;