import React from "react";
import { Link } from "react-router-dom";
import { Star, Bookmark } from "lucide-react";
import { Movie } from "../types";
import { useAuth } from "../context/AuthContext";

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const { toggleWatchlist, isInWatchlist } = useAuth();
  const isSaved = isInWatchlist(movie.id);

  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWatchlist(movie.id);
  };

  return (
    <Link 
      to={`/movie/${movie.id}`} 
      className="movie-card-wrapper" 
      id={`movie-card-link-${movie.id}`}
    >
      <article className="movie-card" id={`movie-card-article-${movie.id}`}>
        <div className="poster-wrapper">
          <img 
            src={movie.poster} 
            alt={`${movie.title} Movie Poster`}
            className="movie-poster-img"
            loading="lazy"
            referrerPolicy="no-referrer"
            id={`movie-card-image-${movie.id}`}
            onError={(e) => {
              // Fail-safe placeholder if image cannot load
              (e.target as HTMLImageElement).src = `https://via.placeholder.com/300x450/111111/ffffff?text=${encodeURIComponent(movie.title)}`;
            }}
          />

          <button 
            className={`watchlist-btn ${isSaved ? "active" : ""}`}
            onClick={handleWatchlistClick}
            aria-label={isSaved ? "Remove from Watchlist" : "Add to Watchlist"}
            title={isSaved ? "Remove from Watchlist" : "Add to Watchlist"}
            id={`watchlist-toggle-${movie.id}`}
          >
            <Bookmark size={14} fill={isSaved ? "currentColor" : "none"} />
          </button>

          {/* Overlay info with title, star rating, and genre on top of the poster bottom */}
          <div className="movie-card-overlay-info" id={`movie-info-overlay-${movie.id}`}>
            <h4 className="movie-card-title" id={`movie-title-${movie.id}`}>{movie.title}</h4>
            <div className="movie-card-rating-line" id={`movie-rating-line-${movie.id}`}>
              <Star size={13} fill="#ffa000" stroke="#ffa000" className="rating-star-icon" />
              <span className="rating-val">{movie.rating.toFixed(1)}</span>
              <span className="rating-sep">|</span>
              <span className="rating-genre">{movie.genre}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};
