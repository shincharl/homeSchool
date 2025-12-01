import { useEffect, useRef, useState } from "react";

const Videos = () => {

    const [muted, setMuted] = useState(false);
    const [cameraOn, setCameraOn] = useState(true);
    const [cameraList, setCameraList] = useState<MediaDeviceInfo[]>([]);

    const videoRef = useRef<HTMLVideoElement | null>(null);
    

    const handleMuteClick = () => {
        if(videoRef.current && videoRef.current.srcObject instanceof MediaStream){
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getAudioTracks().forEach(track => track.enabled = muted);
            setMuted(!muted);
        }
    }

    const handleCameraClick = () => {
        if(videoRef.current && videoRef.current.srcObject instanceof MediaStream){
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getVideoTracks().forEach(track => track.enabled = !cameraOn);
            setCameraOn(!cameraOn);
        }
    }

    const handleCameraChange = async(event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectDeviceId = event.target.value;
        try {
            const newStream = await navigator.mediaDevices.getUserMedia({
                video: {deviceId: {exact: selectDeviceId} },
                audio: true,
            });

            if(videoRef.current){
                // 이전 스트림 해제
                const oldStream = videoRef.current.srcObject as MediaStream | null;
                if(oldStream){
                    oldStream.getTracks().forEach(track => track.stop());
                }
                
                // 새 스트림 적용
                videoRef.current.srcObject = newStream;
            }
            
        } catch (error) {
            console.log(error);
        }
    }

    const getCameras = async() => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const cameras = devices.filter((device) => device.kind === "videoinput");
            setCameraList(cameras);
        } catch (error) {
            console.log(error);
        }
    }

    const getMedia = async() => {
        try {
            const myStream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: true,
            });
           
            if(videoRef.current) {
                videoRef.current.srcObject = myStream;
                await getCameras();
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getMedia();
    }, []);

    return(
        <>
            <div id="myStream">
                <video id="myFace" ref={videoRef} autoPlay playsInline width={"400"} height={400}></video>
                <button id="mute" onClick={handleMuteClick}>
                    {muted ? "Unmute" : "Mute"}
                </button>
                <button id="camera" onClick={handleCameraClick}>
                    {cameraOn ? "Turn Camera Off" : "Turn Camera On"}
                </button>
                <select id="cameras" onChange={handleCameraChange}>
                    {cameraList.map((camera) => (
                        <option key={camera.deviceId} value={camera.deviceId}>{camera.label}</option>
                    ))}
                </select>
            </div>
        </>
    );
}

export default Videos;