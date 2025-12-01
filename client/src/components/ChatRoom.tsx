import { useEffect, useRef, useState } from "react";
import {io} from "socket.io-client";
import Videos from "./Videos";

const socket = io("http://localhost:3000"); // 연결할 서버 주소

const ChatRoom = () => {

    const [inRoom, setInRoom] = useState(false);
    const [roomName, setRoomName] = useState("");
    const [memberNum, setMemberNum] = useState(0);
    const [roomsList, setRoomsList] = useState<string[]>([]);
    const [messages, setMessages] = useState<string[]>([]);

    const roomInputRef = useRef<HTMLFormElement | null>(null);
    const messageInputRef = useRef<HTMLInputElement | null>(null);
    const nicknameInputRef = useRef<HTMLInputElement | null>(null);

    const handleRoomSubmit = (event : React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if(!roomInputRef.current) return;
        const value = roomInputRef.current.value;

        socket.emit("enter_room", value, (newCount: number) => {
            setRoomName(value);
            setMemberNum(newCount);
            setInRoom(true); // 화면 전환
        });

        roomInputRef.current.value = "";

    }

    const handleMessageSubmit = (event : React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if(!messageInputRef.current) return;
        const value = messageInputRef.current.value;

        socket.emit("new_message", value, roomName, () => {
            setMessages(prev => [...prev, `You: ${value}`]);
        });

        messageInputRef.current.value = "";
        
    }

    const handleNicknameSubmit = (event : React.FormEvent<HTMLFormElement>) => {        
        event.preventDefault();

        if(!nicknameInputRef.current) return;
        const value = nicknameInputRef.current.value;

        socket.emit("nickname", value);

        nicknameInputRef.current.value = "";
    }

    useEffect(() => {
        socket.on("welcome", (userNickname, newCount) => {
            setMessages(prev => [...prev, `${userNickname} arrived!`]);
            setMemberNum(newCount);
        });

        socket.on("bye", (userNickname, newCount) => {
            setMessages(prev => [...prev, `${userNickname} left ㅠㅠ`]);
            setMemberNum(newCount);
        });

        socket.on("new_message", (message) => {
            setMessages(prev => [...prev, message]);
        });

        socket.on("room_change", (rooms) => {
            setRoomsList(rooms);
        });

    }, []);

    return(
            <>
                <h1>Noom</h1>

                {/* 방 들어가기 전에만 보이는 화면 */}
                {!inRoom && (
                    <div id="welcome">
                        <form onSubmit={handleRoomSubmit}>
                            <input ref={roomInputRef} type="text" placeholder="room name" required />
                            <button>Enter Room</button>
                        </form>
                        <h4>Open Rooms:</h4>
                        <ul>
                            {roomsList.map((room, i) => (
                                <li key={i}>{room}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* 방에 들어간 후에만 보이는 화면 */}
                {inRoom && (
                    <div id="room">
                        <Videos/>
                        <h2>Room: {roomName}({memberNum})</h2>
                        <ul>
                            {messages.map((message, i) => (
                                <li key={i}>{message}</li>
                            ))}
                        </ul>
                        
                        <form id="name" onSubmit={handleNicknameSubmit}>
                            <input ref={nicknameInputRef} type="text" placeholder="nickname" required/>
                            <button>Save</button>
                        </form>

                        <form id="msg" onSubmit={handleMessageSubmit}>
                            <input ref={messageInputRef} type="text" placeholder="message" required/>
                            <button>Send</button>
                        </form>
                    </div>
                )}
            </>
        );
    }

export default ChatRoom;