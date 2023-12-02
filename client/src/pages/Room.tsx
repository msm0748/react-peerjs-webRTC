import Peer from 'peerjs';
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import { v4 as uuidV4 } from 'uuid';
import Video from '../components/Video';

interface Props {
  socket: Socket | null;
}

export default function Room({ socket }: Props) {
  const { id: roomId } = useParams();
  const [myPeer, setMyPeer] = useState<Peer | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  // const location = useLocation();

  useEffect(() => {
    // const meId = location.state.userId;
    const meId = uuidV4();
    console.log(meId, 'meId');
    const peer = new Peer(meId);
    setMyPeer(peer);
  }, []);

  useEffect(() => {
    if (!socket) return;
    if (!myPeer) return;
    myPeer.on('open', (id: string) => {
      socket.emit('join-room', roomId, id);
      console.log(id, 'peerId');
    });
  }, [myPeer, socket, roomId]);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        setStream(stream);
      });
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on('user-connected', (userId: string) => {
      console.log('User connected', userId);
    });
  }, [socket]);
  return (
    <div>
      <h1>Room</h1>
      <Video stream={stream} />
    </div>
  );
}
