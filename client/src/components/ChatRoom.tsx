import { useRef, useState } from "react";
import {io} from "socket.io-client";

const socket = io("http://localhost:3000"); // 연결할 서버 주소

const ChatRoom = () => {

    const [inRoom, setInRoom] = useState(false);
    const [roomName, setRoomName] = useState("");

    const formRef = useRef<HTMLFormElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleRoomSubmit = (event : React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if(!inputRef.current) return;

        const value = inputRef.current.value;

        socket.emit("enter_room", value, () => {
            console.log("Joined room:", value);

            setRoomName(value);
            setInRoom(true); // 화면 전환
        });

        inputRef.current.value = "";

    }

    return(
            <>
                <h1>Noom</h1>

                {/* 방 들어가기 전에만 보이는 화면 */}
                {!inRoom && (
                    <div id="welcome">
                        <form ref={formRef} onSubmit={handleRoomSubmit}>
                            <input ref={inputRef} type="text" placeholder="room name" required />
                            <button>Enter Room</button>
                        </form>
                    </div>
                )}

                {/* 방에 들어간 후에만 보이는 화면 */}
                {inRoom && (
                    <div id="room">
                        <h2>Room: {roomName}</h2>
                        <ul></ul>
                        <form>
                            <input type="text" placeholder="message" required/>
                            <button>Send</button>
                        </form>
                    </div>
                )}
            </>
        );
    }

export default ChatRoom;