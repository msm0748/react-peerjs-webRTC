import { Socket } from 'socket.io-client';

interface Props {
  socket: Socket;
}

export default function Home({ socket }: Props) {
  return <div>Home</div>;
}
