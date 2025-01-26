import { useContext, useState } from "react"
import { SearchHeart } from "react-bootstrap-icons"
import { Contexts } from "./Contexts"
import './Dashboard.css'
export default function DashBoard() {
    const { setPage, users, setUser2, onlineUsers,offline,url } = useContext(Contexts)
    const [search, setSearch] = useState('')
    return (
        <div className="section dashboard">
            <div className="searchBar">
                <span><SearchHeart size={20} /></span>
                <input type="text" placeholder="Search..." onChange={(e) => setSearch(e.target.value.toLocaleLowerCase())} />
            </div>
            <div className="usersName">
                {users && users.filter(a => a.name.toLowerCase().includes(search)).map((data, index) =>
                    <div className="userBar" key={index}>
                        <span></span>
                        <img src={url+"uploads/"+data.pic} alt="icon" />
                        <div onClick={() => { setTimeout(()=>{setUser2(data); setPage('message')},100) }}>
                        <span></span>
                          <b >{data.name}</b>
                          <i>{data.email}</i>
                        </div>
                        {onlineUsers.includes(data.email) ? <small style={{color:"greenyellow"}}>online</small> : <small style={{color:"grey"}}>{offline}</small> }
                    </div>
                )}
            </div>
        </div>
    )
}