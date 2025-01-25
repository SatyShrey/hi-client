import { useContext, useRef } from "react"
import "./pop.css"
import { Contexts } from "./Contexts"
export default function Pop(Props){
    const{setPop}=useContext(Contexts)
    const ref=useRef()

    return(
        <div ref={ref} className="pop">
           <div className="container">
           {Props.type=='error' && <><p style={{color:"red"}}>{Props.message}</p>
           <button onClick={()=>{document.querySelector(".pop").style.opacity="0";
                setTimeout(()=>{setPop('')},500)}}>Ok</button></>}

            {Props.type=='success' && <p style={{color:"green"}}>{Props.message}</p> }

            {Props.type=="confirm" && 
            <><p>{Props.message}</p>
             <div className="btnDiv">
                <button onClick={Props.task} className="yes">Yes</button>
                <button onClick={()=>{ref.current.style.opacity="0";setTimeout(()=>{setPop('')},500)}} className="no">No</button>
             </div>
            </> }

            {Props.type=='loading' && 
                <><div className="loader" style={{
                    border:"20px solid "+Props.theme[0],
                    borderTop:"20px solid "+Props.theme[1],
                    borderRadius:"50%"
                }}></div>
                <p>{Props.message}</p></>}
           </div>
        </div>
    )
}