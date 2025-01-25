import { useContext, useState } from "react"
import { Contexts } from "./Contexts"
import { io } from "socket.io-client"

export default function Demo() {
    const { user, chat, user2, setUser, setUser2, setChat, url } = useContext(Contexts)
    const [email, setEmail] = useState()
    return (
        <div style={{ backgroundColor: "white", padding: "30px" }}>user
            <input type="text" onChange={(e) => setEmail(e.target.value)} /> <br />
            <button style={{ margin: "30px" }} onClick={() => setUser({ email: email })}>set User</button><br />
            user2
            <input type="text" onChange={(e) => setUser2(e.target.value)} /> <br />
            message
            <input type="text" onChange={(e) => setChat(e.target.value)} /> <br />
            <button style={{ padding: "30px" }} onClick={() => {
                // Send a message to the room
                const socket = io(url, { query: { userId: user.email } });
                socket.emit('sendMessage', {p1:user.email,p2:user2,txt:chat});
            }}>Send</button>
        </div>
    )
}