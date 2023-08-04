import React, { useState } from 'react'
import { v4 as uuidV4} from "uuid"
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {

  const [roomId , setRoomId] =  useState("")
  const [username , setUsername] = useState("")

  const navigate = useNavigate()


  const createNewRoom = (e) =>{
    e.preventDefault()
    const id = uuidV4()
    setRoomId(id)
    toast.success('Created new room')
  }


   const joinRoom = () =>{
     if(!roomId || !username){
       toast.error('RoomId & Username is Required')
       return
     }

    //  Redirect to Editor Page
    navigate(`/editor/${roomId}`, {
      state: {
         username
      }
    })

   }

   const handleInputEnter = (e) =>{
      if(e.code === "Enter"){
        joinRoom()
      }
   }

  return (
    <div className='homePageWrapper'>
       <div className='formWrapper'>
         <img className='homePageLogo' src="/code-sync.png" alt="code-sync-logo" />
         <h4 className='mainLabel'>Paste invitation ROOM ID</h4>
         <div className="inputGroup">
           <input type="text" className='inputBox' placeholder='Room ID'
            value={roomId}
            onChange={(e)=> setRoomId(e.target.value)}
            onKeyUp={handleInputEnter}
           />
           <input type="text" className='inputBox' placeholder='USERNAME'
            value={username}
            onChange={(e)=> setUsername(e.target.value)}
            onKeyUp={handleInputEnter}
           />
           <button className='btn joinBtn' onClick={joinRoom}>Join</button>
           <span className='createInfo'>
            if you don't have an invite then create &nbsp;
            <a onClick={createNewRoom} href="" className='createNewBtn'>New Room</a>
           </span>
           </div>
       </div>

         <footer>
           <h4>Build by  &nbsp;<a target='__blank' href="https://nabil-pathan.netlify.app">Nabil Khan</a></h4>
         </footer>
    </div>
  )
}

export default HomePage
