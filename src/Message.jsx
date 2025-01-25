import { useContext, useEffect, useRef, useState } from "react";
import { ChevronLeft, Person, SearchHeart, SendFill } from "react-bootstrap-icons";
import { Contexts } from "./Contexts";
import axios from "axios";
import './Message.css'
export default function Message() {

    const { setPage, chats, user2, user, setChat, url, chat, setChats, onlineUsers, sendTone, users
        , setUser2
    } = useContext(Contexts)
    const [search, setSearch] = useState('')
    const [text, setText] = useState('')
    const myRef = useRef()
    //prevent back button click
    useEffect(() => {
        window.onpopstate = function () {
            { setPage('dashboard') }
            history.pushState(null, null, window.location.href);
        }; history.pushState({ page: 1 }, "title 1", "?page=1");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    //send message
    function formSubmit(e) {
        e.preventDefault()
        sendTone.play();
        setText('Sending...');
        myRef.current.scrollIntoView({ behavior: "smooth" });
        axios.post(url + "chat", { p1: user.email, p2: user2.email, txt: chat })
            .then(() => {
                setChats((chats) => { return [...chats, { p1: user.email, p2: user2.email, txt: chat }] });
                setText(''); e.target.reset(); setChat(''); myRef.current.scrollIntoView({ behavior: "smooth" })
            }).catch((er) => { setText(er.message) })
    }
    useEffect(() => {
        myRef.current.scrollIntoView()
    }, [])

    return (
        <div className="section message">
            <div className="section1">
                <div className="searchBar">
                    <span><SearchHeart size={20} /></span>
                    <input type="text" placeholder="Search..." onChange={(e) => setSearch(e.target.value.toLocaleLowerCase())} />
                </div>
                <div className="usersName">
                    {users && users.filter(a => a.name.toLowerCase().includes(search)).map((data, index) =>
                        <div className="userBar" key={index}>
                            <img src="" alt="icon" style={{ display: "none" }} />
                            <Person size={25} />
                            <div onClick={() => { setUser2(data) }}>
                                <b >{data.name}</b>
                                <i>{data.email}</i>
                            </div>
                            {onlineUsers.includes(data.email) ? <small style={{ color: "greenyellow" }}>online</small> : ''}
                        </div>
                    )}
                </div>
            </div>
            <div className="section2">
                <div className="receiverName">
                    <button onClick={() => setPage("dashboard")}><ChevronLeft size={30} /></button>
                    <img style={{ display: "none" }} alt="icon" />
                    <Person size={25} />
                    <div>
                        <b>{user2.name}</b>
                        {onlineUsers.includes(user2.email) ? <small style={{ color: "green" }}>online</small> : ''}
                    </div>
                </div>
                <div className="messageBox">
                    {chats && chats
                        .filter(e => e.p1 == user2.email || e.p2 == user2.email)
                        .map((chat, i) => {
                            if (chat.p1 === user.email) { return <pre key={i} className="p1">{chat.txt}</pre> }
                            else if (chat.p1 === user2.email) { return <pre key={i} className="p2">{chat.txt}</pre> }
                        }
                        )}
                    <div className="ref" ref={myRef}>{text}</div>
                </div>
                <form onSubmit={formSubmit} className="messageForm bgLight">
                    <textarea placeholder="Write a message..." onChange={(e) => { setChat(e.target.value) }}></textarea>
                    {chat && <button type="submit"><SendFill size={30} /></button>}
                </form>
            </div>
        </div>
    )
}