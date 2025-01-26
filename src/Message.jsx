import { useContext, useEffect, useRef, useState } from "react";
import { ChevronLeft, ImageFill, SearchHeart, SendFill } from "react-bootstrap-icons";
import { Contexts } from "./Contexts";
import './Message.css'
export default function Message() {

    const { setPage, chats, user2, user, setChat, chat, onlineUsers, sendTone, users
        , setUser2, sendMessage, setChats, offline, url, sendImg,setPop
    } = useContext(Contexts)
    const [search, setSearch] = useState('')
    const [text, setText] = useState('')
    const myRef = useRef()
    const imgForm = useRef()
    const [img, setImg] = useState()
    const[imageData,setImageData]=useState()
    //.......................upload pic.............................
    function picSubmit(e) {
        e.preventDefault()
        sendTone.play();
        setText('Sending...');
        myRef.current.scrollIntoView({ behavior: "smooth" });
        sendImg(setText, imageData,setImg, user, user2, e)
    }

    function previewImg(e) {
        const file = e.target.files[0];
        setImageData(e.target.files[0]);
        console.log(file)
        if (file) {
         if(file.size<= 500 * 1024){
            const reader = new FileReader();
            reader.onload = function(e) {
              setImg(e.target.result);
            };
            reader.readAsDataURL(file);
         }else{setPop({type:"error",message:"Sorry:Enter file, size must be 500kb or less"})}
        }
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
        if(img){sendImg(setText, imageData,setImg, user, user2, e)}
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
                        <div className="userBar" key={index} onClick={() => { setUser2(data) }}>
                            <img src={url+"uploads/"+data.pic} alt="icon" />
                            <div>
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
                    <img src={url+"uploads/"+user2.pic} alt="icon" />
                    <div>
                        <b>{user2.name}</b>
                        {onlineUsers.includes(user2.email) ? <small style={{ color: "green" }}>online</small> : <small style={{ color: "grey" }}>{offline}</small>}
                    </div>
                </div>
                <div className="messageBox">
                <code style={{color:"red"}}>{JSON.stringify(import.meta.env.VITE_REACT_URL)}</code>
                    {chats && chats
                        .filter(e => e.p1 == user2.email || e.p2 == user2.email)
                        .map((chat, i) => {
                            if (chat.p1 === user.email) {
                                 return <pre key={i} className="p1">{chat.file 
                                 ? <div className="img"><img src={url + "download/" + chat.file} /></div> : chat.txt}</pre> }
                            else if (chat.p1 === user2.email) { 
                                return <pre key={i} className="p2">{chat.file 
                                    ? <div className="img"><img src={url + "download/" + chat.file} /> </div> : chat.txt}</pre> }
                        }
                        )}
                    <div className="ref" ref={myRef}>{text}</div>
                </div>
                <div className="formDiv">
                    {img && <div className="imgPrevDiv">
                        <img src={img} alt="img" />
                            <button onClick={()=>{setImg('');imgForm.current.reset()}}>❌</button>
                    </div>}
                    <form onSubmit={formSubmit} className="messageForm bgLight">
                        <textarea placeholder="Write a message..." onChange={(e) => { setChat(e.target.value);}}></textarea>
                        {chat && <button type="submit"><SendFill size={30} /></button>}
                    </form>
                    {!chat && <form ref={imgForm} className="imgForm" onSubmit={picSubmit} encType="multipart/form-data">

                        <div className="file">
                          <label htmlFor="photo"> <ImageFill size={50} /> </label>
                          <input onChange={previewImg} type="file" name="photo" id="photo" />
                        </div>
                        {img && <div className="submit"><button type="submit" > <SendFill size={30} /> </button></div>}
                    </form>}
                </div>
            </div>
        </div>
    )
}