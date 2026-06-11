import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Movie } from "../types";

interface HeroProps {
  movies: Movie[];
}

export const Hero: React.FC<HeroProps> = ({ movies }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Showcase the first 4 movies in our carousel for rich content
  const showcaseMovies = movies.slice(0, 4);

  useEffect(() => {
    if (showcaseMovies.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % showcaseMovies.length);
    }, 4500); // Premium leisurely pace for spotlight slides

    return () => clearInterval(interval);
  }, [showcaseMovies.length]);

  if (showcaseMovies.length === 0) {
    return (
      <header className="hero-section-clean" style={{ backgroundColor: "#000000", minHeight: "80vh", display: "flex", alignItems: "center" }} id="hero-banner-placeholder">
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 4%", width: "100%" }}>
          <h1 className="hero-title" style={{ color: "#ffffff" }}>Stream the Best of Cinema</h1>
        </div>
      </header>
    );
  }

  const activeMovie = showcaseMovies[currentIndex];

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % showcaseMovies.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + showcaseMovies.length) % showcaseMovies.length);
  };

  return (
    <header 
      className="hero-section-clean" 
      style={{ 
        backgroundColor: "#000000", 
        color: "#ffffff",
        padding: "160px 0 80px",
        position: "relative",
        overflow: "hidden"
      }}
      id="hero-banner-section"
    >
      <div 
        style={{ 
          display: "grid", 
          gap: "40px"
        }}
        className="hero-grid-container aligned-container"
      >
        {/* Left Column containing Headings, Description & Stats */}
        <div className="hero-left-column" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <h1 
            className="hero-title-main"
            style={{ 
              fontFamily: "var(--font-display)", 
              fontSize: "clamp(38px, 6vw, 68px)", 
              fontWeight: 700, 
              lineHeight: 1.05, 
              marginBottom: "24px",
              letterSpacing: "-1.5px",
              color: "#ffffff"
            }}
            id="hero-banner-main-title"
          >
            Stream the<br />Best of Cinema
          </h1>

          <p 
            className="hero-desc-main"
            style={{ 
              color: "var(--accent-gold)", 
              fontSize: "clamp(14px, 1.8vw, 17px)", 
              lineHeight: "1.6", 
              marginBottom: "48px",
              maxWidth: "520px",
              fontWeight: 500
            }}
            id="hero-banner-description"
          >
            Access a curated selection of top-rated movies, exclusive premieres, and hidden gems. Elevate your viewing experience with high-definition streaming and personalized recommendations.
          </p>

          {/* Stats requested by user, styled precisely like the target layout */}
          <div 
            className="hero-stats-panel-main"
            style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(3, 1fr)", 
              gap: "24px",
              maxWidth: "520px"
            }}
            id="hero-stats-panel"
          >
            <div className="hero-stat-item" style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 700, color: "#ffffff", fontFamily: "var(--font-display)" }}>250+</span>
              <span style={{ fontSize: "clamp(11px, 1.5vw, 14px)", color: "var(--accent-gold)", fontWeight: 500, marginTop: "4px" }}>Movies available</span>
            </div>
            <div className="hero-stat-item" style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 700, color: "#ffffff", fontFamily: "var(--font-display)" }}>450K+</span>
              <span style={{ fontSize: "clamp(11px, 1.5vw, 14px)", color: "var(--accent-gold)", fontWeight: 500, marginTop: "4px" }}>People subscribed</span>
            </div>
            <div className="hero-stat-item" style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 700, color: "#ffffff", fontFamily: "var(--font-display)" }}>200K+</span>
              <span style={{ fontSize: "clamp(11px, 1.5vw, 14px)", color: "var(--accent-gold)", fontWeight: 500, marginTop: "4px" }}>Top review</span>
            </div>
          </div>
        </div>

        {/* Right Column containing the Interactive Spotlight Poster */}
        <div 
          className="hero-right-column"
          style={{ 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            justifyContent: "center" 
          }}
          id="hero-showcase-poster"
        >
          <Link 
            to={`/movie/${activeMovie.id}`} 
            style={{ 
              textDecoration: "none", 
              width: "100%", 
              maxWidth: "340px",
              display: "block"
            }}
          >
            <div 
              style={{ 
                width: "100%", 
                aspectRatio: "2/3",
                backgroundImage: `url(${activeMovie.poster})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: "8px",
                boxShadow: "0 20px 48px rgba(0, 0, 0, 0.8)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                transition: "transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)"
              }}
              className="hero-poster-hover-card"
            />
          </Link>

          {/* Carousel Interactive Controls located directly under the poster */}
          <div 
            style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              gap: "20px", 
              marginTop: "28px" 
            }}
            id="hero-carousel-controls"
          >
            <button 
              onClick={handlePrev} 
              aria-label="Previous Slide" 
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                backgroundColor: "transparent",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
              className="hero-control-circle-btn"
              id="carousel-prev-arrow"
            >
              <ChevronLeft size={20} strokeWidth={1.5} />
            </button>

            <div style={{ display: "flex", gap: "10px" }}>
              {showcaseMovies.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentIndex(index);
                  }}
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    border: "none",
                    backgroundColor: index === currentIndex ? "var(--accent-gold)" : "rgba(255, 255, 255, 0.3)",
                    cursor: "pointer",
                    padding: 0,
                    transition: "all 0.3s ease"
                  }}
                  aria-label={`Go to slide ${index + 1}`}
                  id={`hero-dot-${index}`}
                />
              ))}
            </div>

            <button 
              onClick={handleNext} 
              aria-label="Next Slide" 
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                backgroundColor: "transparent",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
              className="hero-control-circle-btn"
              id="carousel-next-arrow"
            >
              <ChevronRight size={20} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
