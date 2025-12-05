import { useContext, useEffect, useState } from "react";
import { WebRTCContext } from "../providers/WebRTCProvider";
import Videos from "./Videos";

const ChatRoom = ({socket}) => {
  const {startConnection, messages, sendMessage} = useContext(WebRTCContext);

   const [welcome, setWelcome] = useState(true);
   const [room, setRoom] = useState("");
   const [msg, setMsg] = useState("");
   const [roomList, setRoomList] = useState<string[]>([]);



    // 서버에서 방 목록 수신
    useEffect(() => {
        socket.emit("getRooms"); // 처음 방 목록 요청
        socket.on("roomList", (rooms: string[]) => {
            setRoomList(rooms);
        });
        return () => {
            socket.off("roomList");
        };
    }, [socket])


        const handleJoinAsGuest = async () => {
        const roomName = room || prompt("Enter room name");
        socket.emit("join", roomName);
        setWelcome(false);
        await startConnection(false); // Guest는 join 후 바로 startConnection
    };

    const handleJoinAsHost = () => {
    const roomName = room || prompt("Enter room name");
    socket.emit("join", roomName);

    // Host 대기 화면 표시
    setWelcome(false);

    // 서버에서 호스트가 기다리라고 보냈을 때
    socket.once("hostWaiting", () => {
        console.log("Waiting for guest...");
    });

    // Guest가 이미 있으면 readyForOffer 이벤트
    socket.once("readyForOffer", async () => {
        await startConnection(true);
        });
    };

    return (
        <div>
            {welcome && (
                <div>
                    <h3>환영합니다 OOO님 채팅방을 골라주세요!</h3>
                    <ul>
                        {roomList.map((r) => (
                            <li key={r}>
                                {r} <button onClick={() => handleJoinAsGuest(r)}>Join</button>
                            </li>
                        ))}
                    </ul>
                    <input value={room} onChange={(e) => setRoom(e.target.value)} placeholder="room name"/>
                    <button onClick={handleJoinAsHost}>Join as Host</button>
                    <button onClick={handleJoinAsGuest}>Join as Guest</button> 
                </div>
            )}

            {!welcome && (
                <div>
                    <div>
                       <Videos/>
                    </div>
                    <input value={msg} onChange={(e)=> setMsg(e.target.value)} />
                    <button onClick={() => {
                        sendMessage(msg); setMsg("");
                        }}>Send</button>

                    <div>
                        {messages.map((m, i) => <div key={i}>{m}</div>)}
                    </div>
                </div>
            )}      

        </div>
    );
}

export default ChatRoom;
