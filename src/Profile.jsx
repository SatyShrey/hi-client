import { useContext, useEffect, useState, } from "react"
import { Contexts } from "./Contexts"
import "./profile.css"
import { CameraFill, ChevronLeft, Power } from "react-bootstrap-icons"
import axios from "axios"

export default function Profile() {
    const { user, setPage, url, setPop,setUser } = useContext(Contexts)
    const [editName, setEditname] = useState(false)
    const [editPassword, setEditPassword] = useState(false)
    const [editPic, setEditPic] = useState(false)
    const [newName, setNewName] = useState(false)
    const [newPassword, setNewPassword] = useState(false)
    const [imageData, setImageData] = useState()
    //prevent back button click
    useEffect(() => {
        window.onpopstate = function () {
            { setPage('dashboard') }
            history.pushState(null, null, window.location.href);
        }; history.pushState({ page: 1 }, "title 1", "?page=1");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    //..........................preview image..............................
    function previewImg(e) {
        const file = e.target.files[0];
        setImageData(e.target.files[0]);
        if (file) {
            if (file.size <= 500 * 1024) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    document.getElementById('setpic').src = e.target.result
                    setEditPic(true)
                };
                reader.readAsDataURL(file);
            } else { setPop({ type: "error", message: "File size must be 500kb or less" }) }
        }
    }
    //update profilepic
    function updatePic(){
        setPop({type:"loading",message:"Changing in progress...",theme:["rgb(0, 185, 255)","rgb(34,34,43)"]})
        const formData = new FormData();
        formData.append('photo',imageData );
        axios.post(url + "setprofilepic", formData)
        .then(data=>{
            axios.put(url+"updatepic"+"/"+user.email + "/" + data.data.file)
            .then((result)=>{
                setPop({type:"success",message:result.data})
                localStorage.setItem('pic',data.data.file)
                setTimeout(() => { 
                    setPop('');
                    document.getElementById('pic').value=''
                    setUser({name:user.name,email:user.email,pic:data.data.file})
                }, 1000)
            })
            .catch(e => { setPop({ type: "error", message: e.message }) })
        })
        .catch(e => { setPop({ type: "error", message: e.message }) })
    }
    //..............logout..........................
    const logout = () => {
        setPop({
            type: "confirm",
            task: () => {
                localStorage.clear();
                location.reload()
            }, message: "Are you sure to logout?"
        })
    }
    //.................update name......................
    const updateName = () => {
        setPop({type:"loading",message:"Changing in progress...",theme:["rgb(0, 185, 255)","rgb(34,34,43)"]})
        axios.put(url + "updatename/" + user.email + "/" + newName)
            .then(data => {
                setPop({ type: "success", message: data.data });
                localStorage.setItem('name',newName)
                setEditname(false)
                setTimeout(() => { 
                    setPop('');
                    setUser({name:newName,email:user.email,pic:user.pic})
                }, 1000)
            })
            .catch(e => { setPop({ type: "error", message: e.message }) })
    }
    //.................change password......................
    const chnagePassword = () => {
        axios.put(url + "updatepassword/" + user.email + "/" + newPassword)
            .then(data => {
                setEditPassword(false)
                setTimeout(() => { 
                    setPop('') ;
                    setPop({ type: "success", message: data.data });
                }, 1000)
            })
            .catch(e => { setPop({ type: "error", message: e.message }) })
    }
    //.................delete user......................
    const deleteUser = () => {
        setPop({
            type: "confirm",
            message: "Are you sure to delete?",
            task: () => {
                setPop({type:"loading",message:"Deleting user "+user.email,theme:["rgb(0, 185, 255)","rgb(34,34,43)"]})
                axios.delete(url + "deleteuser/" + user.email)
                    .then((data) => {
                        setPop({ message: data.data, type: "success" });
                        setPage('login')
                        setTimeout(() => { setPop('') }, 1000)
                    })
                    .catch((er) => { setPop({ type: "error", message: er.message }) })
            }
        })
    }

    return (
        <div className="section profile">
            <button className="back" onClick={()=>{setPage('dashboard')}}> <ChevronLeft size={24}/> </button>
            <div className="pic">
                <img id="setpic" src={url + "uploads/" + user.pic} />
                <label htmlFor="pic"><CameraFill size={34} /></label>
                <input type="file" id="pic" onChange={previewImg} accept="image/*" />
                {editPic && <button onClick={updatePic}>Set Pic</button>}
            </div>

            <div className="email">
                <p >{user.email}</p>
                <button onClick={logout}><Power size={20} /></button>
            </div>

            <div className="name">
                {editName ? <> <input type="text" placeholder="Set new name" onChange={(e) => { setNewName(e.target.value) }} />
                    <button onClick={updateName} className="update">Update</button><button onClick={() => { setEditname(false) }} className="cancel">Cancel</button></>
                    : <> <p>{user.name}</p>
                        <button onClick={() => { setEditname(true) }}>Update name</button></>}
            </div>

            <div className="password">
                {editPassword ? <><input type="password" placeholder="Set new password" onChange={(e) => { setNewPassword(e.target.value) }} />
                    <button onClick={chnagePassword} className="update">Update</button><button className="cancel" onClick={() => { setEditPassword(false) }}>Cancel</button></>
                    : <><p>*******</p>
                        <button onClick={() => { setEditPassword(true) }}>Change password</button></>}
            </div>
            <div className="delete">
                <button onClick={deleteUser}>Delete account</button>
            </div>
        </div>
    )
}