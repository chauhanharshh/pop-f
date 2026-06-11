import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react";
import { Movie } from "../types";

interface Top3MoviesProps {
  movies: Movie[];
}

export const Top3Movies: React.FC<Top3MoviesProps> = ({ movies }) => {
  const [isScrollMode, setIsScrollMode] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sort by rating descending and slice top 3
  const top3 = [...movies]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  const handleScroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const { scrollLeft } = containerRef.current;
      const scrollAmount = 400; // custom scroll step
      containerRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <section className="section" id="top-movies">
      <div className="section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 className="section-title" style={{ margin: 0 }}>Top 3 Movies</h2>
        
        {/* Toggle options for Grid vs Horizontal Scroll on Desktop */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {isScrollMode && (
            <div className="scroll-buttons desktop-only-flex" style={{ display: "flex", gap: "8px" }} id="top3-scroll-nav-arrows">
              <button 
                className="scroll-btn" 
                onClick={() => handleScroll("left")} 
                aria-label="Scroll Left"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  color: "var(--text-primary)",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                className="scroll-btn" 
                onClick={() => handleScroll("right")} 
                aria-label="Scroll Right"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  color: "var(--text-primary)",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
          
          <button 
            onClick={() => setIsScrollMode(!isScrollMode)} 
            className="view-mode-toggle-btn desktop-only-flex"
            style={{
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "var(--text-primary)",
              padding: "8px 14px",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.2s"
            }}
            id="top3-layout-toggle-btn"
          >
            {isScrollMode ? (
              <>
                <LayoutGrid size={14} />
                <span>GRID VIEW</span>
              </>
            ) : (
              <>
                <ChevronRight size={14} />
                <span>SCROLL VIEW</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div 
        ref={containerRef}
        className={`top3-container ${isScrollMode ? "scroll-mode" : ""}`} 
        id="top3-movie-billboard"
      >
        {top3.map((movie, index) => (
          <Link 
            key={movie.id} 
            to={`/movie/${movie.id}`} 
            className="top3-card"
            id={`top3-rank-${index + 1}`}
          >
            {/* Massive digit outline behind */}
            <span className="top3-number">{index + 1}</span>
            
            {/* Poster card that sits atop/overlaps the number */}
            <div className="top3-poster-wrapper">
              <img 
                src={movie.poster} 
                alt={`${movie.title} Rank ${index + 1}`} 
                className="top3-img"
                referrerPolicy="no-referrer"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://via.placeholder.com/300x450/111111/ffffff?text=${encodeURIComponent(movie.title)}`;
                }}
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
