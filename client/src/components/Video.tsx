import { useRef } from 'react';

export default function Video() {
  const videoRef = useRef<HTMLVideoElement>(null);
  return <video ref={videoRef}>Video</video>;
}
