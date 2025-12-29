import React, { createContext,useContext, useEffect, useState } from 'react'
import { Home } from './pages/Home/Home'
import {Route ,Routes, useNavigate} from "react-router-dom"
import Login from "./pages/Login/Login.jsx"
import Player from './pages/Player/Player.jsx'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase.js'
import Wishlist from './pages/Wishlist/wishlist.jsx'
export const App = () => {
  const navigate = useNavigate()
  useEffect(()=>{
    onAuthStateChanged(auth,async(user)=>{
      const path = location.pathname;
      if(path === "/wishlist"){
        if(!user){
          navigate("/login")
        }else{ 
            return
        }
      }
      if(user){
        console.log(user.uid,"loged In")
        navigate("/");
      }else{
        console.log("Logged Out")
        navigate("/login");
      }
  })
  },[])
  return (
    <div>
      <Routes>
        <Route path='/' element={ <Home/>}></Route>
        <Route path="/Login" element={< Login />}></Route>
        <Route path='/player/:id' element={<Player/>}> </Route>
        <Route path='/wishlist' element={<Wishlist/>}></Route>
      </Routes>
    </div>
  )
}
