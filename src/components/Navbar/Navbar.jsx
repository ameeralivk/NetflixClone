import React, { useEffect, useRef } from 'react'
import "./Navbar.css"
import Logo from "../../assets/Logo.png"
import search_icon from "../../assets/search_icon.svg"
import bell_icon from "../../assets/bell_icon.svg"
import prfile_img from "../../assets/profile_img.png"
import caret_icon from "../../assets/caret_icon.svg"
import { Logout } from '../../firebase'
import { useNavigate } from 'react-router-dom'
export const Navbar = () => {
  const navigate = useNavigate()
  const navRef = useRef()
  useEffect(()=>{
    window.addEventListener("scroll",()=>{
      if(window.scrollY >= 80){
        navRef.current.classList.add('nav-dark')
      }else{
        navRef.current.classList.remove('nav-dark')
      }
    })
  },[])
  function navbarchange(){
    navigate('/wishlist')
  }
  function homenavigate(){
    navigate("/")
  }
  function handleLogout(){
    Logout()
    navigate('/login')
  }
  return (
    <div ref={navRef} className='navbar'>
     <div className="navbar-left">
        <img src={Logo} alt="" className='navbarimage' />
        <ul>
          <li onClick={homenavigate}>Home</li>
          <li>TV Shows</li>
          <li>Movies</li>
          <li>New & Popular</li>
          <li onClick={navbarchange}>My List</li>
          <li>Browse by Language</li>
        </ul>
     </div>
     <div className="navbar-right">
      <img src={search_icon} className='icons' />
      <p>Children</p>
      <img src={bell_icon} className='icons'  />
      <div className="navbar-profile">
        <img src={prfile_img} className='profile'  />
        <img src={caret_icon}/>
        <div className="dropdown">
           <p onClick={handleLogout}>Sign Out of Netflix</p>
        </div>
      </div>
     </div>
    </div>
  )
}
