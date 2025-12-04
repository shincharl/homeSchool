import './App.css'
import { io } from "socket.io-client"
import ChatRoom from './components/chatRoom'
import WebRTCProvider from './providers/WebRTCProvider'

const socket = io("http://localhost:3000");

function App() {
  return (
    <>
     <WebRTCProvider socket={socket}>
      <ChatRoom socket={socket}/>
     </WebRTCProvider>
    </>
  )
}

export default App;
