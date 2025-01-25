
import { ChatRightHeartFill, Power} from "react-bootstrap-icons"
import "./Header.css"
import { useContext } from "react"
import { Contexts } from "./Contexts"
export default function Header(){
    const{user,setPop}=useContext(Contexts)
    
    return(
        <header>
            <h1><ChatRightHeartFill/>Hii.</h1>
            {user && <button onClick={()=>{setPop({ type:"confirm", task:()=>{
                localStorage.clear();location.reload()
                },message:"Are you sure to logout?"})}}><Power size="27px"/></button>}
        </header>
    )
}