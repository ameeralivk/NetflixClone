import React, { useEffect, useState } from 'react'
import "./Player.css"
import axios from 'axios';
import back_arrow_icon from "../../assets/back_arrow_icon.png"
import { useNavigate, useParams , useLocation } from 'react-router-dom'
const Player = () => {
  const location = useLocation();
  const fromWishlist = location.state?.from === "wishlist";
  const navigate = useNavigate()
  const {id} = useParams()
  const [ApiData,SetApiData] = useState({
    name:"",
    key:"",
    published_at:"",
    type:"",
  })
  const options = {
  method: 'GET',
  url: `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`,
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjMGNjMmEwYmNkMDk4M2ZjZGE5MDlmYmUyOTUxYzFiYyIsIm5iZiI6MTc1NDA1ODQ1Ny43MTIsInN1YiI6IjY4OGNjZWQ5Zjc0MTA0NTU2YTI2MTFlZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Imkx0-OODEz52njxhE0aILDJZPZMS7XxI23iv9JvFoY'
  }
};
    useEffect(()=>{
   axios.request(options)
      .then(res => {
        console.log(res.data); // You can inspect the data here
        if (res.data.results && res.data.results.length > 0) {
          SetApiData(res.data.results[0]);
        }
      })
  .catch(err => console.error(err));
    },[id])
  return (
    <div className='player'>
     <img src={back_arrow_icon} alt="" onClick={()=>{
         if (fromWishlist) {
        navigate("/wishlist");
        } else {
          navigate("/");
        }
     }} />
     <iframe width="90%" height="90%"
     src={`https://www.youtube.com/embed/${ApiData.key}`} title='trailer' frameBorder="0" allowFullScreen/>
     <div className="player-info">
      <p>{ApiData.published_at.slice(0,10)}</p>
      <p>{ApiData.name}</p>
      <p>{ApiData.type}</p>
     </div>
    </div>
  )
}
export default Player