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

  // 방 입장 시 바로 로컬 카메라 켜기
  useEffect(() => {
    initMedia(); 
  }, [])
  
  // 1. 미디어 스트림 가져오기

  const initMedia = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });

        localStreamRef.current = stream;
        setLocalStream(stream);

        // 이미 PeerConnection 생성되어 있으면 트랙 추가
        if(peerConnectionRef.current){
          stream.getTracks().forEach((track) => {
            peerConnectionRef.current!.addTrack(track, stream);
          });
        };

    } catch(error){
        console.log("미디어 가져오기 실패:", error);
    }
  };

  // 마이크 / 비디오 제어 함수 추가
  const toggleAudio = () => {
    if(localStreamRef.current){
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if(audioTrack){
        audioTrack.enabled = !audioTrack.enabled;
      }
    }
  };

  const toggleVideo = () => {
    if(localStreamRef.current){
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if(videoTrack){
        videoTrack.enabled = !videoTrack.enabled;
      }
    }
  };

  const switchCamera = async () =>{
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {deviceId: {exact: deviceId} },
        audio: true, // 기존 오디오도 유지
      });

      // 기존 스트림 정리
      if(localStreamRef.current){
        localStreamRef.current.getTracks().forEach((t) => t.stop());
      }

      // 새 스트림으로 교체
      localStreamRef.current = newStream;
      setLocalStream(newStream);

      // peerConnection 트랙 교체
      if (peerConnectionRef.current){
        const videoTrack = newStream.getVideoTracks()[0];
        const senders = peerConnectionRef.current.getSenders();

        const videoSender = senders.find((s) => s.track?.kind === "video");
        if(videoSender){
          await videoSender.replaceTrack(videoTrack);
        }
      }
    } catch (e) {
      console.log("카메라 전환 실패:", e);
    }
  }

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

    // 게스트가 방에 들어올 때만 offer 생성 시작
    socket.on("readyForOffer", async () => {
      const pc = peerConnectionRef.current;
      if(!pc) return;

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit("offer", offer);
    });
  } ,[socket]);

    // 내보낼 함수들
  const startConnection = async (isHost) => {
    await initMedia();
    const pc = createConnection(isHost);

    if(isHost) {
        socket.emit("host-ready");
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
        toggleAudio,
        toggleVideo,
        switchCamera,
      }}
    >
      {children}
    </WebRTCContext.Provider>
  );
};

export default WebRTCProvider;
export { WebRTCContext };
