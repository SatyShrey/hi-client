import { useContext, useEffect, useRef, useState } from "react";
import { ChevronLeft,  ImageFill, Person, SearchHeart, SendFill } from "react-bootstrap-icons";
import { Contexts } from "./Contexts";
import './Message.css'
export default function Message() {

    const { setPage, chats, user2, user, setChat, chat, onlineUsers, sendTone, users
        , setUser2, sendMessage, setChats, offline, url, sendImg, setSendImg,setPop
    } = useContext(Contexts)
    const [search, setSearch] = useState('')
    const [text, setText] = useState('')
    const myRef = useRef()
    const imgForm = useRef()
    const[img,setImg]=useState()
    //.......................upload pic.............................
    function picSubmit(e) {
        e.preventDefault()
        setSendImg('sent')
        setText("Sendng...")
        const formData = new FormData();
        const fileField = document.getElementById('photo');

        formData.append('photo', fileField.files[0]);

        fetch(url + `upload/${user.email}/${user2.email}`, {
            method: 'POST',
            body: formData
        })
            .then(response => response.text())
            .then(result => {
                console.log(result)
                setText('')
            })
            .catch(error => {
                setText('')
                setPop({type:"error",message:error.message})
            });
            setImg('')
    }

    //..............................................................
    //prevent back button click
    useEffect(() => {
        window.onpopstate = function () {
            { setPage('dashboard') }
            history.pushState(null, null, window.location.href);
        }; history.pushState({ page: 1 }, "title 1", "?page=1");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        myRef.current.scrollIntoView({ behavior: "smooth" });
    }, [sendImg])

    //send message
    function formSubmit(e) {
        e.preventDefault()
        sendTone.play();
        setText('Sending...');
        myRef.current.scrollIntoView({ behavior: "smooth" });
        //send message
        sendMessage(setText, myRef, e, user, user2, setChats, { p1: user.email, p2: user2.email, txt: chat })
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
                                <span></span>
                                <b >{data.name}</b>
                                <i>{data.email}</i>
                            </div>
                            {onlineUsers.includes(data.email) ? <small style={{ color: "greenyellow" }}>online</small> : <small style={{ color: "grey" }}>{offline}</small>}
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
                        {onlineUsers.includes(user2.email) ? <small style={{ color: "green" }}>online</small> : <small style={{ color: "grey" }}>{offline}</small>}
                    </div>
                </div>
                <div className="messageBox">
                    {chats && chats
                        .filter(e => e.p1 == user2.email || e.p2 == user2.email)
                        .map((chat, i) => {
                            if (chat.p1 === user.email) { return <pre key={i} className="p1">{chat.file ? <div className="img"><img src={url + "download/" + chat.file} /> </div> : chat.txt}</pre> }
                            else if (chat.p1 === user2.email) { return <pre key={i} className="p2">{chat.file ? <div className="img"><img src={url + "download/" + chat.file} /> </div> : chat.txt}</pre> }
                        }
                        )}
                    <div className="ref" ref={myRef}>{text}</div>
                </div>
                <div className="formDiv">
                    <form onSubmit={formSubmit} className="messageForm bgLight">
                        <textarea placeholder="Write a message..." onChange={(e) => { setChat(e.target.value);setImg('') }}></textarea>
                        {chat && <button type="submit"><SendFill size={30} /></button>}
                    </form>
                   { !chat &&  <form ref={imgForm} className="imgForm" onSubmit={picSubmit} encType="multipart/form-data">
                         
                            <div className="file"><label htmlFor="photo"> <ImageFill size={50}/> </label> <input onChange={(e) => {setImg(e.target.value) }} type="file" name="photo" id="photo" /> </div>
                           {img && <div className="submit"><button type="submit" > <SendFill size={30}/> </button></div>}
                    </form> }
                </div>
            </div>
        </div>
    )
}