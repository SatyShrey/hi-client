import { useContext, useState } from "react"
import { Contexts } from "./Contexts"
import axios from "axios"
import { Eye, EyeSlash } from "react-bootstrap-icons"
import "./login.css"
export default function Login(){
    const{setPage,url,setUser,setPop}=useContext(Contexts)
    const[email,setEmail]=useState()
    const[emailErr,setEmailErr]=useState()
    const[password,setPassword]=useState()
    const[passwordErr,setPasswordErr]=useState()
    const[fontSize,setFontSize]=useState()
    const[inputType,setInputType]=useState('password')
    //validate input fields
    function validation(value,setValue,regExp,setError,error){
        setValue(value);
        if(regExp.test(value)){setError('')}else{setError(error)}
    }
    //Login
    function loginFormSubmit(e){
        e.preventDefault()
        setFontSize('0px');setTimeout(()=>{setFontSize('12px')},100)
       if(!email){setEmailErr('Email required')}
       if(!password){setPasswordErr('Password required')}
       if(password && (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email))){
        setPop({ type:"loading", theme:["rgb(0, 185, 255)","rgb(34,34,43)"], message:"Logging in please wait..."})
        axios.get(url+`login/${email.toLowerCase()}/${password}`).then((data)=>{
            if(typeof(data.data)=="object"){
                localStorage.setItem('email',data.data.email)
                localStorage.setItem('name',data.data.name)
                setPop({ type:"success", message:"Login success..."});
                setUser(data.data);
                setPage("dashboard");
            }
            else if(data.data=="1"){setPop({ type:"error", message:"Error: Invalid credentials."})}
            else if(data.data=="0"){setPop({ type:"error", message:"Error: User not found"})}
            else{setPop({ type:"error" , message:"Unknown error"})}
         }).catch((err)=>{setPop({ type:"error", message:err.message})})
       }
    }
    ///bypass enter key
    function enterClick(e){
        if(e.key=='Enter'){
            e.preventDefault()
            if(e.target==document.querySelectorAll('input')[0]){
                document.querySelectorAll('input')[1].focus()
            }
            else if(e.target==document.querySelectorAll('input')[1]){
                loginFormSubmit(e)
            }
        }
    }
    return(
        <div className="section login">
            <form onSubmit={loginFormSubmit} encType="multipart/form-data"  onKeyDown={enterClick} className="loginForm">
                <h2>Login</h2>
                <input placeholder="Email" onChange={(e)=>{validation(e.target.value,setEmail,/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,setEmailErr,"Input valid email")}} />
                <small style={{fontSize:fontSize}}>{emailErr}</small>
                <div className="input">
                    <input type={inputType}  placeholder="Password" onChange={(e)=>{validation(e.target.value,setPassword,/^[a-zA-Z0-9._%+-]{1,}/,setPasswordErr,"Input password")}}/>
                    <span onClick={()=>{
                        if(inputType=="password"){setInputType('text')}
                        else{setInputType('password')}
                        }}>{inputType=="password"?<Eye size={19}/>:<EyeSlash size={19}/>}
                    </span>
                </div>
                <small style={{fontSize:fontSize}}>{passwordErr}</small>
                <button type="submit">Login</button>
                <p >New user? <u onClick={()=>setPage("signup")}>Signup</u></p>
                </form>
        </div>
    )
}
