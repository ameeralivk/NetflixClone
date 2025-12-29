import React, { useEffect, useId, useRef, useState } from 'react'
import "./TitleCards.css"
import cards_data from '../../assets/cards/Cards_data'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../AuthContext/AuthContext'
import { AddToWishlist,removeFromWishlist,getWishlist} from '../../firebase'
export const TitleCards = ({title,category}) => {
  const {userId} = useAuth()
  const [ApiData,SetApiData] = useState([])
  const cardsRef = useRef(null)
  const [wishlist, setWishlist] = useState([]);
  useEffect(() => {
  const fetchWishlist = async () => {
    const data = await getWishlist(userId);
    setWishlist(data || []);
  };
  console.log(wishlist,'wishlist')
  fetchWishlist();
}, [userId]);
  const options = {
  method: 'GET',
  url:`https://api.themoviedb.org/3/movie/${category?category:"now_playing"}?language=en-US&page=1`,
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjMGNjMmEwYmNkMDk4M2ZjZGE5MDlmYmUyOTUxYzFiYyIsIm5iZiI6MTc1NDA1ODQ1Ny43MTIsInN1YiI6IjY4OGNjZWQ5Zjc0MTA0NTU2YTI2MTFlZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Imkx0-OODEz52njxhE0aILDJZPZMS7XxI23iv9JvFoY'
  }
};
  const handleWheel = (event)=>{
     event.preventDefault();
     cardsRef.current.scrollLeft += event.deltaY;
  }
 const toggleWishlist = async (id) => {
  if (wishlist.includes(id)) {
    await removeFromWishlist(userId, id);
  } else {
    await AddToWishlist(userId, id);
  }
  // re-fetch from Firestore to stay in sync
  const data = await getWishlist(userId);
  setWishlist(data || []);
};

  useEffect(()=>{
    axios.request(options)
    .then(res=>{
      if(res.data.results){
        SetApiData(res.data.results)
      }
    })
    .catch((err)=>console.log(err))
     cardsRef.current.addEventListener("wheel",handleWheel)
  })
  // useEffect(()=>{
  //   fetch(`https://api.themoviedb.org/3/movie/${category?category:"now_playing"}?language=en-US&page=1`, options)
  // .then(res => res.json())
  // .then(res => SetApiData(res.results))
  // .catch(err => console.error(err));
  //     cardsRef.current.addEventListener("wheel",handleWheel)
  // },[])
  return (
    <div className='title-cards'>
      <h2>{title?title:"Popular on Netflix"}</h2>
      <div className="card-list" ref={cardsRef}>
        {ApiData.map((card, index) => {
          return (
            <div className="card" key={index}>
              <Link to={`/player/${card.id}`}>
                <img src={`https://image.tmdb.org/t/p/w500${card.backdrop_path}`} alt="" />
                <p>{card.original_title}</p>
              </Link>
                <div
                className={`wishlist-icon ${wishlist.includes(card.id) ? 'active' : ''}`}
                onClick={() => toggleWishlist(card.id)}
                title={wishlist.includes(card.id) ? "Remove from Wishlist" : "Add to Wishlist"}
              >
                {wishlist.includes(card.id) ? '❤️' : '♡'}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  )
}
