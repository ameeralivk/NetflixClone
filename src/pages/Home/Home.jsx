import React from 'react'
import "./Home.css"
import { Navbar } from '../../components/Navbar/Navbar'
import hero_banner from "../../assets/hero_banner.jpg"
import hero_title from "../../assets/hero_title.png"
import Play_icon from "../../assets/play_icon.png"
import info_icon from "../../assets/info_icon.png"
import { TitleCards } from '../../components/TitleCards/TitleCards'
import Footer from '../../components/Footer/Footer'
import { useNavigate } from 'react-router-dom'
export const Home = ({userId}) => {
  const navigate = useNavigate()
  return (
    <div className='Home'>
    <Navbar />
    <div className="hero">
       <img src={hero_banner} alt='' className='banner-img' />
       <div className="hero-caption">
        <img src={hero_title} alt="" className='caption-img' />
        <p>Discovering his ties to a secret ancient order,a young man living in modern Istanbul embarks on a quest to save the city from an immortal enemy.</p>
        <div className="hero-btns">
          <button onClick={()=>navigate("/player/80dqOwAOhbo")} className='btn'><img src={Play_icon} alt=""/>Play</button>
          <button className='btn dark-btn'><img src={info_icon} alt="" />More Info</button>
        </div>
          <TitleCards />
       </div>
    </div>
    <div className="more-cards">
      <TitleCards title={"Blockbustor Movies"} category={"top_rated"} />
      <TitleCards title={"Only on Netflix"} category={"popular"} />
      <TitleCards title={"Up Coming"} category={"upcoming"} />
      <TitleCards title={"Top Picks For You"} category={"now_playing"} />
      <Footer />
    </div>
    </div>
  )
}
