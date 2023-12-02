import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Socket } from 'socket.io-client';

interface Props {
  socket: Socket | null;
}

export default function Room({ socket }: Props) {
  const { id } = useParams();

  useEffect(() => {
    if (!socket) return;
    socket.on('user-connected', (userId: string) => {
      console.log('User connected', userId);
    });
  }, [socket]);
  console.log(id);
  return <div>Room</div>;
}
