import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Room from './pages/Room';
import { useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';

function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  useEffect(() => {
    const newSocket = io('http://localhost:8080');
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);
  return (
    <Routes>
      <Route path="/" element={<Home socket={socket} />} />
      <Route path="/room/:id" element={<Room socket={socket} />} />
    </Routes>
  );
}

export default App;
