import { io } from "socket.io-client";
import ChatRoom from "../components/chatRoom";
import WebRTCProvider from "../providers/WebRTCProvider";

const socket = io("http://localhost:3000");

const Chating = () => {
    return (
        <>
            <div>
                <WebRTCProvider socket={socket}>
                    <ChatRoom socket={socket}/>
                </WebRTCProvider>
            </div>
        </>
    );
}

export default Chating;