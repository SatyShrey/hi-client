
import { ChatRightHeartFill,} from "react-bootstrap-icons"
import "./Header.css"
import { useContext } from "react"
import { Contexts } from "./Contexts"
export default function Header(){
    const{setPage,user,url}=useContext(Contexts)
    
    return(
        <header>
            <h1><ChatRightHeartFill/>Hii.</h1>  
            {user && <img src={url+"uploads/"+user.pic} alt="profile-pic" onClick={()=>setPage('profile')}/>}
        </header>
    )
}