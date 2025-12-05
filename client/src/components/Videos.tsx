import { useContext, useEffect, useRef, useState } from "react"
import { WebRTCContext } from "../providers/WebRTCProvider"

const Videos = () => {
    const {localStream, remoteStream, toggleAudio, toggleVideo, switchCamera} = useContext(WebRTCContext);

    const localRef = useRef(null);
    const remoteRef = useRef(null);

    const [audioOn, setAudioOn] = useState(true);
    const [videoOn, setVideoOn] = useState(true);

    // 카메라 목록
    const [cameras, setCameras] = useState([]);
    const [selectedCam, setSelectedCam] = useState("");

    useEffect(() => {
        if(localRef.current && localStream){
            localRef.current.srcObject = localStream;
        }
    }, [localStream]);

    useEffect(() => {
        if(remoteRef.current && remoteStream){
            remoteRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    useEffect(() => {
        const loadCameras = async () => {
            const devices = await navigator.mediaDevices.enumerateDevices();

            const videoDevices = devices.filter((d) => d.kind === "videoinput");
            setCameras(videoDevices);

            if(videoDevices.length > 0){
                setSelectedCam(videoDevices[0].deviceId);
            }  
        };

        loadCameras();
    }, []);

    return (
    <div style={{ display: "flex", gap: 20 }}>
      <div>
        <h3>Host (내 영상)</h3>
        {localStream ? (
          <video ref={localRef} autoPlay muted playsInline style={{ width: 300 }} />
        ) : (
          <div style={{ width: 300, height: 200, display: "flex", alignItems: "center", justifyContent: "center", background: "#222", color: "#fff" }}>
            카메라 준비중...
          </div>
        )}

        <div style={{marginTop: 10}}>
            <label style={{marginRight: 10}}>카메라 선택:</label>
            <select value={selectedCam} onChange={(e) => {
                setSelectedCam(e.target.value); // 해당 카메라로 UI 전환
                switchCamera(e.target.value); // 실제 전환 수행
            }}>
                {cameras.map((cam) => (
                    <option key={cam.deviceId} value={cam.deviceId}>
                        {cam.label || "카메라"}
                    </option>
                ))}
            </select>
        </div>

        <div style={{marginTop: 10, display: "flex", gap: 10}}>
            <button onClick={() => {
                toggleAudio();
                setAudioOn((prev) => !prev);
            }}>
                {audioOn ? "마이크 끄기" : "마이크 켜기"}
            </button>

            <button onClick={() => {
                toggleVideo();
                setVideoOn((prev) => !prev);
            }}>
                {videoOn ? "비디오 끄기" : "비디오 켜기"}
            </button>
        </div>
      </div>

      <div>
        <h3>Guest (상대)</h3>
        {remoteStream ? (
          <video ref={remoteRef} autoPlay playsInline style={{ width: 300 }} />
        ) : (
          <div style={{ width: 300, height: 200, display: "flex", alignItems: "center", justifyContent: "center", background: "#eee" }}>
            상대방을 기다리는 중...
          </div>
        )}
      </div>
    </div>
    );
}

export default Videos;