import { useContext, useEffect, useState } from "react";
import { WebRTCContext } from "../providers/WebRTCProvider";
import Videos from "./Videos";

const ChatRoom = ({socket}) => {
  const {startConnection, messages, sendMessage} = useContext(WebRTCContext);

   const [welcome, setWelcome] = useState(true);
   const [room, setRoom] = useState("");
   const [msg, setMsg] = useState("");

   type RoomInfo = {
    roomId: string;
    count: number;
    max: number;
   }; 

   const [roomList, setRoomList] = useState<RoomInfo[]>([]);

   const [roomCount, setRoomCount] = useState(0);

    // 서버에서 방 목록 수신
    useEffect(() => {
        socket.emit("getRooms"); // 처음 방 목록 요청
        socket.on("roomList", (rooms: RoomInfo[]) => {
            setRoomList(rooms);
        });
        socket.on("roomCount", (count) => { // 방 인원 수 갱신 코드
            setRoomCount(count);
        });
        socket.on("roomFull", (room) => {
            alert(`방 ${room}이(가) 이미 가득 찼습니다!`);
        });
        socket.on("joinSuccess", async ({room, isHost}) => {
            setWelcome(false);
            // 호스트는 true, 게스트는 false
            await startConnection(isHost);
        });

        return () => {
            socket.off("roomList");
            socket.off("roomCount");
            socket.off("roomFull");
            socket.off("joinSuccess");
        };
    }, [socket])


        const handleJoinAsGuest = () => {
        const finalRoom = room || prompt("Enter room name");
        if(!finalRoom) return;

        socket.emit("join", finalRoom);
      
    };

    const handleJoinAsHost = () => {
    const finalRoom = room || prompt("Enter room name");
    if(!finalRoom) return;

    socket.emit("join", finalRoom);

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
                            <li key={r.roomId}>
                                방이름: {r.roomId} | 인원: {r.count}/{r.max}
                                <button onClick={() => handleJoinAsGuest(r.roomId)}>Join</button> 
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
                        <h2>현재 참여 인원: {roomCount}명</h2>
                    </div>

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
