import Peer from 'peerjs';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
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
  // const location = useLocation();

  console.log(peers, 'peerspeers');

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
    if (!socket) return;
    if (!myPeer) return;
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        setStream(stream);

        myPeer.on('call', (call) => {
          call.answer(stream);

          call.on('stream', (userVideoStream) => {
            console.log(userVideoStream, 'userVideoStream');
          });
        });

        socket.on('user-connected', (peerId: string) => {
          setPeers((prev) => [...prev, { peerId, stream }]);
        });
      });
  }, [socket, myPeer]);

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
