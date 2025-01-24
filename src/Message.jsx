import { useContext, useEffect, useRef, useState } from "react";
import { ChevronLeft, Person, SendFill } from "react-bootstrap-icons";
import { Contexts } from "./Contexts";
import axios from "axios";
import './Message.css'
export default function Message(){
    
    const{setPage,chats,user2,user,setChat,url,chat,setChats,onlineUsers,sendTone}=useContext(Contexts)
    const[text,setText]=useState('')
    const myRef=useRef()
    function formSubmit(e){
        e.preventDefault()
        setText('Sending...');
        myRef.current.scrollIntoView({behavior:"smooth"});
        axios.post(url+"chat",{p1:user.email,p2:user2.email,txt:chat})
        .then(()=>{
            setChats((chats)=>{return [...chats,{p1:user.email,p2:user2.email,txt:chat}]});
            setText('');sendTone.play();e.target.reset();setChat('');myRef.current.scrollIntoView({behavior:"smooth"})
        }).catch((er)=>{setText(er.message)})
    }
    useEffect(()=>{
        myRef.current.scrollIntoView()
    },[])

    return(
        <div className="section message">
            <div className="receiverName">
                <button onClick={()=>setPage("dashboard")}><ChevronLeft size={30}/></button>
                <img style={{display:"none"}} alt="icon" />
                <Person size={25}/>
                <div>
                    <b>{user2.name}</b>
                    {onlineUsers.includes(user2.email) ? <small style={{color:"green"}}>online</small>:'' }
                </div>
            </div>
            <div className="messageBox">
                {chats && chats.filter(a=>a.p1==user2.email || a.p2==user2.email).map((chat,index)=>{
                    if(chat.p1===user.email){return <pre key={index} className="p1">{chat.txt}</pre>}
                    else if(chat.p1===user2.email){return <pre key={index} className="p2">{chat.txt}</pre>}
                }
                )}
                <div className="ref" ref={myRef}>{text}</div>
            </div>
            <form onSubmit={formSubmit} className="messageForm bgLight">
                <textarea placeholder="Write a message..." onChange={(e)=>{setChat(e.target.value)}}></textarea>
                {chat && <button type="submit"><SendFill size={30}/></button>}
            </form>
        </div>
    )
}