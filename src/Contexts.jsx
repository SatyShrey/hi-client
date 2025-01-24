import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import receive from "../receive.mp3"
import send from "../send.mp3"

// eslint-disable-next-line react-refresh/only-export-components
export const Contexts = createContext()
// eslint-disable-next-line react/prop-types
export function Provider({ children }) {
    const [page, setPage] = useState('login')
    const [users, setUsers] = useState()
    const [chats, setChats] = useState()
    const [chat, setChat] = useState()
    const [user, setUser] = useState()
    const [user2, setUser2] = useState()
    const [pop, setPop] = useState('')
    const [onlineUsers, setOnlineUsers] = useState()
    const sendTone = new Audio(send)
    const receiveTone = new Audio(receive)
    let url = "https://chatapp-vspu.onrender.com/"
    //url="http://localhost:6060/"

    function socketIo() {

        const socket = io.connect(url, ({ query: { email: user.email } }));
        socket.on('connect', () => {

            //fetch online users from socket.io-server
            socket.on('onlineUsers', (data) => {
                setOnlineUsers(data)
            })

            //fetch recent online user
            socket.on('online', (data) => {
                setOnlineUsers((onlineUsers) => {
                    return [...onlineUsers, data]
                })
            })

            //offline user remove from the online user array
            socket.on('offline', (data) => {
                setOnlineUsers((onlineUsers) => {
                    return onlineUsers.filter(a => a !== data)
                })
            })

            //fetch all users from database
            setPop({ type: "loading", theme: ["rgb(0, 185, 255)", "rgb(34,34,43)"], message: "Loading page please wait..." })
            axios.get(url + "users").then((data) => {
                setUsers(data.data.filter(data => data.email !== user.email))
                setPop('')
            }).catch(err => { setPop({ type: "error", message: err.message }) })

            //fetch user chats from database
            axios.get(url + "chats/" + user.email).then((data) => {
                setChats(data.data)
            }).catch(err => { setPop({ type: "error", message: err.message }) })

            //send online status
            socket.on('chat', (data) => {
                setChats((chats) => { return [...chats, data] });
                receiveTone.play()
            });
        })
        //disconnect the client from server
        window.addEventListener('offline',()=>{socket.disconnect()})
    }

    //check the logged in user
    useEffect(() => {
        if (sessionStorage.getItem('email') && sessionStorage.getItem('name')) {
            setUser({
                name: sessionStorage.getItem("name"),
                email: sessionStorage.getItem("email")
            })
            setPage('dashboard');
        }
    }, [])

    useEffect(() => {
        if (user) {
            try{socketIo()}catch(er){console.log(er)}
            window.addEventListener('online', () => { socketIo() })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    return (
        <Contexts.Provider value={{
            page, onlineUsers, setPage, users, setUsers, url, user, setUser, chats, user2, setUser2,
            chat, setChats, setChat, pop, setPop, sendTone,
        }}>
            {children}
        </Contexts.Provider>
    )
}