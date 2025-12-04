import { useContext, useEffect, useRef } from "react"
import { WebRTCContext } from "../providers/WebRTCProvider"

const Videos = () => {
    const {localStream, remoteStream} = useContext(WebRTCContext);

    const localRef = useRef(null);
    const remoteRef = useRef(null);

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

    return (
        <div>
            <h3>Host</h3>
            <video ref={localRef} autoPlay muted playsInline style={{width: 300}}/>
            <h3>Guest</h3>
            <video ref={remoteRef} autoPlay playsInline style={{width: 300}}/>
        </div>
    );
}

export default Videos;