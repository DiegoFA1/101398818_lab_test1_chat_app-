import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import Groups from './components/chats/Groups';
import GroupSelector from './components/chats/GroupSelector';


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
        <Route path="/groups" element={<GroupSelector />} />
        <Route path="/group/:groupName" element={<Groups />} />
      </Routes>
    </div>
  );
}

export default App;