import axios from "axios";
import { createContext, useEffect, useState} from "react";
import { io } from "socket.io-client";
import receive from "../receive.mp3"
import send from "../send.mp3"

// eslint-disable-next-line react-refresh/only-export-components
export const Contexts = createContext()
// eslint-disable-next-line react/prop-types
export function Provider({ children }) {
    //let url='http://localhost:6060/'
    let url ="https://chatapp-vspu.onrender.com/"
    const [page, setPage] = useState('login')
    const [users, setUsers] = useState()
    const [chats, setChats] = useState()
    const [chat, setChat] = useState()
    const [user, setUser] = useState()
    const [user2, setUser2] = useState()
    const [pop, setPop] = useState('')
    const [onlineUsers, setOnlineUsers] = useState([])
    const sendTone = new Audio(send)
    const receiveTone = new Audio(receive)
    const [sendMessage, setSendMessage] = useState()
    const [sendImg, setSendImg] = useState()
    const [offline, setOffline] = useState('offline')
    useEffect(() => {
        //back button override
        window.onpopstate = function () {
            history.pushState(null, null, window.location.href);
        }; history.pushState({ page: 1 }, "title 1", "?page=1");

        //check the logged in user
        if (localStorage.getItem('email') && localStorage.getItem('name')) {
            setUser({
                name: localStorage.getItem("name"),
                email: localStorage.getItem("email")
            })
            setPage('dashboard');
        }
    }, [])



    function socketIo(user1) {
        const socket = io(url, { query: { userId: user1.email } });
        socket.on('connect', () => {
            //........................online user list.....................
            socket.on('roomList', (userlist) => {
                setOnlineUsers(userlist)
            });
            //...................send message function.....................
            setSendMessage(() => {
                return function (setText, myRef, e, user, user2, setChats, chat) {
                    axios.post(url + "chat", chat)
                        .then((data) => {
                            setChats((chats) => {
                                return [...chats, data.data]
                            })
                            setText(''); e.target.reset(); setChat('');
                            myRef.current.scrollIntoView({ behavior: "smooth" })
                        }).catch((er) => { setText(er.message) })
                }
            })
            //........................setSendImg............................
            setSendImg(() => {
                return function (setText,img,setImg,user,user2,e) {
                    const formData = new FormData();

                    formData.append('photo', img);

                    fetch(url + `upload/${user.email}/${user2.email}`, {
                        method: 'POST',
                        body: formData
                    })
                        .then(response => response.text())
                        .then(result => {
                            console.log(result)
                        })
                        .catch(error => {
                            setPop({ type: "error", message: error.message })
                        })
                        .finally(()=>{
                            setText('')
                            setImg('')
                            e.target.reset()})
                }
            })
            //fetch messages from database
            axios.get(url + 'chats/' + user.email).then(data => {
                setChats(data.data)
            }).catch(e => { setPop({ type: "error", message: e.message }) })

            //receive message
            socket.on('message', (message) => {
                setChats((chats) => {
                    return [...chats, message]
                }); receiveTone.play();
            });
            //receive message
            socket.on('returnme', (message) => {
                setChats((chats) => {
                    return [...chats, message]
                });
            });

            //disconnect from server
            socket.on('disconnect', () => {
                socket.disconnect()
            });

        });
        //fetch all users from database
        setPop({
            theme: ["rgb(0, 185, 255)", "rgb(14, 0, 25)"],
            message: "Loading page, please wait...",
            type: "success"
        })
        axios.get(url + 'users/' + user.email).then((data) => {
            setPop('')
            setUsers(data.data)
        }).catch(e => setPop({ type: "error", message: e.message }))

    }

    useEffect(() => {
        if (user) {
            socketIo(user)
        }
        //get network connection
        window.addEventListener('online', () => {
            console.log('online')
            setOffline('offline')
            if (user) {
                socketIo(user)
                console.log('server re-started')
            }
        })

        //disconnected from network
        window.addEventListener('offline', () => {
            console.log('offline')
            setOffline('')
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    return (
        <Contexts.Provider value={{
            page, onlineUsers, setPage, users, setUsers, url, user, setUser, chats, user2, setUser2,
            chat, setChats, setChat, pop, setPop, sendTone, sendMessage, offline, sendImg,
        }}>
            {children}
        </Contexts.Provider>
    )
}