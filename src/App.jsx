import { useContext, } from "react";
import Header from "./Header";
import { Contexts } from "./Contexts";
import Login from "./Login";
import Message from "./Message";
import DashBoard from "./DashBoard";
import Signup from "./Signup";
import Pop from "./Pop";
export default function App(){
  const{page,pop}=useContext(Contexts)
  
  return(
   <div className="app">
    <Header/>
    {page=="login" && <Login/>}
    {page=="signup" && <Signup/>}
    {page=="dashboard" && <DashBoard/>}
    {page=="message" && <Message/>}
    {pop && <Pop message={pop.message} type={pop.type} task={pop.task} theme={pop.theme}/>}
   </div>
  )
}