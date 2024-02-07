import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import io from 'socket.io-client';

// Nav bar
import NavBar from './components/navbar/NavBar';

// Components
import Signup from './components/user/Signup';
import Login from './components/user/Login';

function App() {
  const location = useLocation(); // Get current location using useLocation hook

  useEffect(() => {
    console.log('Location changed:', location.pathname);
  }, [location]);

  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
}

export default App;