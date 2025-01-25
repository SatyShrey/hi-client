import { useContext, useState } from "react"
import { Contexts } from "./Contexts"
import axios from "axios"
import { Eye, EyeSlash } from "react-bootstrap-icons"
export default function Signup(){
    const{setPage,url,setPop}=useContext(Contexts)
    const[userName,setUserName]=useState()
    const[userEmail,setUserEmail]=useState()
    const[userPassword,setUserPassword]=useState()
    const[confirmPassword,setConfirmPassword]=useState()
    const[nameErr,setNameErr]=useState()
    const[emailErr,setEmailErr]=useState()
    const[passwordErr,setPasswordErr]=useState()
    const[confirmPasswordErr,setConfirmPasswordErr]=useState()
    const[fontSize,setFontSize]=useState()
    const[inputType,setInputType]=useState('password')
    const[inputType2,setInputType2]=useState('password')
    //validate input fields
    function validation(value,setValue,regExp,setError,error){
        setValue(value);
        if(regExp.test(value)){setError('')}else{setError(error)}
    }
    //if correct proceed
    function correct(value,regExp){
        return regExp.test(value)
    }
    ///bypass enter key
    function enterClick(e){
        if(e.key=='Enter'){
            e.preventDefault()
            if(e.target==document.querySelectorAll('input')[0]){
                document.querySelectorAll('input')[1].focus()
            }
            else if(e.target==document.querySelectorAll('input')[1]){
                document.querySelectorAll('input')[2].focus()
            }
            else if(e.target==document.querySelectorAll('input')[2]){
                document.querySelectorAll('input')[3].focus()
            }
            else if(e.target==document.querySelectorAll('input')[3]){
                signupFormSubmit(e)
            }
        }
    }
    //Signup/submit form
    function signupFormSubmit(e){
        e.preventDefault()
        setFontSize('0px');setTimeout(()=>{setFontSize('12px')},100)
        if(!userName){setNameErr('Name Require')}
        if(!userPassword){setPasswordErr('Password require')}
        if(!userEmail){setEmailErr('Email require')}
        if(userPassword !== confirmPassword){setConfirmPasswordErr('Password missmatch')}
        if(correct(userPassword,/[a-zA-Z0-9._%+-]{4,}/) && correct(userEmail,/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/) 
            && correct(userName,/^[a-zA-Z]/) && correct(confirmPassword,new RegExp('^'+userPassword+'$'))){
                setPop({type:"loading", theme:["rgb(255, 146, 51)","rgb(34,34,43)"], message:"Signing up please wait..."})
                axios.get(url+"user/"+userEmail).then((data)=>{
                    if(data.data){setPop({type:"error", message:"Error: This email already registered!!"})}
                    else{
                        axios.post(url+"user",{name:userName,email:userEmail.toLowerCase(),password:userPassword,id:Date.now()}).then((data)=>{
                        setPop({type:"success" ,message:data.data.info});
                        setTimeout(()=>{document.querySelector('.pop').style.opacity="0"},1500)
                        setTimeout(()=>{setPop('')},2000)
                        setPage('login')
                    }).catch((e)=>{setPop({type:"error", message:e.message})})}
                }).catch((e)=>{setPop({type:"error" ,message:e.message})})
        }
    }
    return(
        <div className="section signup">
            <form onSubmit={signupFormSubmit} onKeyDown={enterClick}>
                <h2>Signup</h2>
                <input onChange={(e)=>{validation(e.target.value,setUserName,/^[a-zA-Z]/,setNameErr,"Start name with alphabet")}} placeholder="Name"/>
                <small style={{fontSize:fontSize}}>{nameErr}</small>
                <input  onChange={(e)=>{validation(e.target.value,setUserEmail,/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,setEmailErr,"Input valid email")}}  placeholder="Email" />
                <small style={{fontSize:fontSize}}>{emailErr}</small>
                <div className="input">
                  <input  onChange={(e)=>{validation(e.target.value,setUserPassword,/[a-zA-Z0-9._%+-]{4,}/,setPasswordErr,"Minimmum length is 4");if(userPassword===confirmPassword){setConfirmPasswordErr('')}}} type={inputType} placeholder="Password"/>
                  <span onClick={()=>{ if(inputType=="password"){setInputType('text')}
                                        else{setInputType('password')}
                                        }}>{inputType=="password"?<Eye size={19}/>:<EyeSlash size={19}/>}
                                    </span>
                </div>
                <small style={{fontSize:fontSize}}>{passwordErr}</small>
                <div className="input">
                  <input  onChange={(e)=>{validation(e.target.value,setConfirmPassword,new RegExp('^'+userPassword+'$'),setConfirmPasswordErr,"Password missmatch")}} type={inputType2} placeholder="Confirm Password"/>
                  <span onClick={()=>{ if(inputType2=="password"){setInputType2('text')}
                                        else{setInputType2('password')}
                                        }}>{inputType2=="password"?<Eye size={19}/>:<EyeSlash size={19}/>}
                                    </span>
                </div>
                <small style={{fontSize:fontSize}}>{confirmPasswordErr}</small>
                <button type="submit">Signup</button>
                <p>Existing user? <u onClick={()=>setPage("login")}>Login</u></p>
            </form>
        </div>
    )
}
