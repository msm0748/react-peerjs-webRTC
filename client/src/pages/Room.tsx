import Peer from 'peerjs';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import { v4 as uuidV4 } from 'uuid';
import Video from '../components/Video';

interface Props {
  socket: Socket | null;
}

type PeerType = {
  peerId: string;
  stream: MediaStream;
};

export default function Room({ socket }: Props) {
  const { id: roomId } = useParams();
  const [myPeer, setMyPeer] = useState<Peer | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [peers, setPeers] = useState<PeerType[]>([]);

  useEffect(() => {
    const meId = uuidV4();
    const peer = new Peer(meId);
    setMyPeer(peer);
  }, []);

  useEffect(() => {
    if (!socket) return;
    if (!myPeer) return;
    myPeer.on('open', (id: string) => {
      socket.emit('join-room', roomId, id);
    });
  }, [myPeer, socket, roomId]);

  useEffect(() => {
    if (!socket) return;
    if (!myPeer) return;
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        setStream(stream);

        socket.on('user-connected', (peerId: string) => {
          setPeers((prev) => [...prev, { peerId, stream }]);
          myPeer.call(peerId, stream);
        });
      });
  }, [socket, myPeer]);

  useEffect(() => {
    if (!myPeer) return;
    if (!stream) return;

    myPeer.on('call', (call) => {
      call.answer(stream);
      let isLoading = true;
      call.on('stream', (userVideoStream) => {
        if (isLoading) {
          setPeers((prev) => [...prev, { peerId: call.peer, stream: userVideoStream }]);
        }
        isLoading = false;
      });
    });
  }, [myPeer, stream]);

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
      {peers && Object.values(peers).map((peer) => <Video key={peer.peerId} stream={peer.stream} />)}
    </div>
  );
}
