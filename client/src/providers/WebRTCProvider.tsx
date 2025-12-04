import { createContext, useState, useEffect, useRef } from "react";

const WebRTCContext = createContext(null);

const WebRTCProvider = ({ children, socket }) => {
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);

  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const [messages, setMessages] = useState<string[]>([]);
  const [channelReady, setChannelReady] = useState(false);

  // 1. 미디어 스트림 가져오기

  const initMedia = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });

        localStreamRef.current = stream;
        setLocalStream(stream);

    } catch(error){
        console.log("미디어 가져오기 실패:", error);
    }
  };

  // DataChannel 이벤트 설정
  const setupDataChannel = (dc: RTCDataChannel) => {
    dc.onopen = () => setChannelReady(true);
    dc.onclose = () => setChannelReady(false);
    dc.onmessage = (e) => setMessages((prev) => [...prev, `상대: ${e.data}`]);
    return dc;
  };

  // peerConnection 생성 함수

  const createConnection = (isHost: boolean) => {
    if (peerConnectionRef.current) return peerConnectionRef.current;

    const pc = new RTCPeerConnection();

    // ICE 후보 생성되면 서버로 전달
    pc.onicecandidate = (event) => {
      if (event.candidate) socket.emit("ice", event.candidate);
    };

     // 방문자 데이터 채널 받는 코드
    pc.ondatachannel = (event) => {
        console.log("DataChannel reveived" , event.channel);
      dataChannelRef.current = setupDataChannel(event.channel);
    };

    // remoteStream 수신
    pc.ontrack = (event) => {
        remoteStreamRef.current = event.streams[0];
        setRemoteStream(event.streams[0]);
    }

    // 로컬 스트림의 모든 트랙을 PeerConnection에 추가
    if(localStreamRef.current){
        localStreamRef.current.getTracks().forEach((track) => {
            pc.addTrack(track, localStreamRef.current as MediaStream);
        });
    }

    // 호스트만 직접 DataChannel 생성
    if (isHost) {
      console.log("Host: Creating DataChannel");
      dataChannelRef.current = setupDataChannel(pc.createDataChannel("chat"));
    }

    peerConnectionRef.current = pc;
    return pc;
  };

  // 받은 시그널 처리
  useEffect(() => {
    if(!socket) return;

    // OFFER 받음
    socket.on("offer", async (offer) => {

        console.log("Guest reveived offer:", offer);

        const pc = createConnection(false);
        await pc.setRemoteDescription(offer);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.emit("answer", answer);
    });

    // ANSWER 받음
    socket.on("answer", async (answer) => {
        const pc = peerConnectionRef.current;
        if (!pc) return;
        await pc.setRemoteDescription(answer);
    });

    // ICE 받음
    socket.on("ice", async (candidate) => {
        const pc = peerConnectionRef.current;
        if (!pc) return;
        await pc.addIceCandidate(candidate);
    });
  }, [socket]);

    // 내보낼 함수들
  const startConnection = async (isHost) => {
    await initMedia();
    const pc = createConnection(isHost);

    if(isHost) {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit("offer", offer);
    }
  };

  const sendMessage = (message) => {
    if(channelReady && dataChannelRef.current){
        dataChannelRef.current.send(message);
        setMessages((prev) => [...prev, `나: ${message}`]);
    }
  };

  return (
    <WebRTCContext.Provider
      value={{
        startConnection,
        sendMessage,
        messages,
        localStream,
        remoteStream,
      }}
    >
      {children}
    </WebRTCContext.Provider>
  );
};

export default WebRTCProvider;
export { WebRTCContext };
