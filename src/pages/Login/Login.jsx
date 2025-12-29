import React, { useState } from 'react'
import "./Login.css"
import Logo from "../../assets/logo.png"
import { login , signUp } from '../../firebase'
const Login = () => {
  const [SignState,SetSignState] = useState("Sign In")
  const [name,SetName] = useState("")
  const [email,SetEmail] = useState("")
  const [password,SetPassword] = useState("")
  const userAuth = async(event)=>{
    event.preventDefault()
    if(SignState==="Sign In"){
      await login(email,password)
    }else{
      await signUp(name,email,password)
    }
  }
  return (
    <div className='login'>
          <img src={Logo} className='login-logo' alt="" />
          <div className="login-form">
            <h1>{SignState}</h1>
            <form>
              {SignState === "Sign Up" ? <input value={name} onChange={(e)=>{SetName(e.target.value)}} type="text" placeholder='Your Name' />:<></>}
              <input value={email} onChange={(e)=>{SetEmail(e.target.value)}} type="email" placeholder='Email' />
              <input value={password} onChange={(e)=>{SetPassword(e.target.value)}} type="password" placeholder='Password' />
              <button onClick={userAuth} type='submit'>{SignState}</button>
              <div className="form-help">
                <div className="remember">
                  <input type="checkbox" />
                  <label htmlFor=''>Remember Me</label>
                  <p>Need Help?</p>
                </div>
              </div>
            </form>
            <div className="form-switch">
              {SignState === "Sign In" ? 
                 <p>New To Netflix?<span onClick={()=>SetSignState("Sign Up")}>Sign Up Now</span></p>
                 :<p>Already Have Account?<span onClick={()=>SetSignState("Sign In")}>Sign In Now</span></p>
              }
            </div>
          </div>
    </div>
  )
}
export default Login
