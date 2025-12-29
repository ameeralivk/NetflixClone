import React, { useEffect, useState } from 'react';
import "../Wishlist/wishlist.css";
import { Navbar } from '../../components/Navbar/Navbar';
import { useAuth } from '../../components/AuthContext/AuthContext.jsx';
import { getWishlist , removeFromWishlist } from "../../firebase";
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
const Wishlist = () => {
  const [Movieids, SetMovieids] = useState([]);
  const [Allmovies, SetMovies] = useState([]);
  const { userId } = useAuth();

  useEffect(() => {
    const fetchWishlist = async () => {
      const data = await getWishlist(userId); 
      SetMovieids(data);
    };
    if (userId) fetchWishlist();
  }, [userId]);
    
  const handleRemove = async (movieId) => {
     const result = await Swal.fire({
    title: 'Are you sure?',
    text: "Do you want to remove this movie from your wishlist?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, remove it!',
  });
    if(result.isConfirmed){
              try {
            
          await removeFromWishlist(userId, movieId);
          const updatedIds = Movieids.filter((id) => id !== movieId);
          SetMovieids(updatedIds);
          const updatedMovies = Allmovies.filter((movie) => movie.id !== movieId);
          SetMovies(updatedMovies);

        } catch (err) {
          console.error("Error removing movie:", err);
        }
    }else{
      return
    }
};


  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const allMovies = await Promise.all(
          Movieids.map(async (movieId) => {
            const response = await axios.request({
              method: "GET",
              url: `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
              headers: {
                accept: "application/json",
                Authorization:
                  'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjMGNjMmEwYmNkMDk4M2ZjZGE5MDlmYmUyOTUxYzFiYyIsIm5iZiI6MTc1NDA1ODQ1Ny43MTIsInN1YiI6IjY4OGNjZWQ5Zjc0MTA0NTU2YTI2MTFlZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Imkx0-OODEz52njxhE0aILDJZPZMS7XxI23iv9JvFoY',
              },
            });
            return response.data;
          })
        );
        SetMovies(allMovies);
      } catch (error) {
        console.log(error);
      }
    };

    if (Movieids && Movieids.length > 0) {
      fetchMovies();
    }
  }, [Movieids]);

  return (
    <>
      <Navbar />
      <div className='container'>
        <h1>Wishlist</h1>
        <div className='wishlist-container'>
          {Allmovies && Allmovies.map((movie) => (
            <div className="movie-card" key={movie.id}>
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="movie-thumbnail"
              />
               <div className="movie-details">
                <h3 className="movie-title">{movie.title}</h3>
                <p className="movie-description">{movie.overview}</p>
                  <Link
                    to={`/player/${movie.id}`}
                    state={{ from: "wishlist" }}
                    className="watch-button"
                  >
                    Watch Now
                  </Link>
                <button onClick={()=>handleRemove(movie.id)} className="remove-button">Remove</button> 
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Wishlist;
