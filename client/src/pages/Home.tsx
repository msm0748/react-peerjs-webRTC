import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Socket } from 'socket.io-client';

interface Props {
  socket: Socket | null;
}

export default function Home({ socket }: Props) {
  const [roomId, setRoomId] = useState('');
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();

  const handleChangeRoomId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomId(e.target.value);
  };

  const handleChangeUserId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(e.target.value);
  };

  const handleEnter = () => {
    if (!socket) return;
    navigate(`/room/${roomId}`, {
      state: {
        userId,
      },
    });
  };

  return (
    <div className="m-5">
      <div className="mb-5">
        room id : <input type="text" value={roomId} className="border" onChange={handleChangeRoomId} />
      </div>
      <div className="mb-5">
        user id : <input type="text" value={userId} className="border" onChange={handleChangeUserId} />
      </div>
      <div>
        <button type="button" className="border p-3 bg-sky-400" onClick={handleEnter}>
          Enter
        </button>
      </div>
    </div>
  );
}
