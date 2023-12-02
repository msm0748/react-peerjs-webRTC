import { Socket } from 'socket.io-client';

interface Props {
  socket: Socket;
}

export default function Room({ socket }: Props) {
  return <div>Room</div>;
}
