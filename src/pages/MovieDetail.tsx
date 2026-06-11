import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Clock, User, Film, HelpCircle, Play, Plus, Check, ChevronLeft, ChevronRight } from "lucide-react";
import API from "../services/api";
import { Movie } from "../types";
import { useAuth } from "../context/AuthContext";

export const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toggleWatchlist, isInWatchlist } = useAuth();
  
  const [movie, setMovie] = useState<Movie | null>(null);
  const [otherMovies, setOtherMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const carouselRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  const handleScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll > 0) {
        setScrollProgress((scrollLeft / maxScroll) * 100);
      }
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const { clientWidth } = carouselRef.current;
      const scrollAmount = clientWidth * 0.75;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    // Smooth scroll to top when movie page loads
    window.scrollTo({ top: 0, behavior: "smooth" });

    const fetchMovieDetailAndRecommendations = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // 1. Fetch current movie details
        const detailResponse = await API.get<Movie>(`/movies/${id}`);
        setMovie(detailResponse.data);

        // 2. Fetch all movies to build recommendations
        const allResponse = await API.get<Movie[]>("/movies");
        // Exclude current movie
        const recommended = allResponse.data.filter(m => m.id !== Number(id));
        setOtherMovies(recommended);
      } catch (err: any) {
        setError("Movie not found in current streaming library.");
        console.error("Fetch movie details error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchMovieDetailAndRecommendations();
    }
  }, [id]);

  if (isLoading) {
    return (
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--bg-primary)" }} id="detail-spinner">
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "50px",
            height: "50px",
            border: "5px solid rgba(255, 255, 255, 0.1)",
            borderTop: "5px solid var(--accent-gold)",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 20px"
          }}></div>
          <p style={{ color: "var(--text-secondary)", fontWeight: 500, fontFamily: "var(--font-display)" }}>Loading theater projection...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </main>
    );
  }

  if (error || !movie) {
    return (
      <main style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "20px", backgroundColor: "var(--bg-primary)", padding: "40px" }} id="detail-not-found">
        <HelpCircle size={48} color="var(--accent-gold)" />
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "24px", color: "#ffffff" }}>Movie Not Found</h2>
        <p style={{ color: "var(--text-secondary)", textAlign: "center", maxWidth: "400px" }}>{error || "The movie does not exist on this streaming node."}</p>
        <Link to="/" className="cta-btn" style={{ textDecoration: "none" }} id="notfound-return-home">Return to Home</Link>
      </main>
    );
  }

  const isSaved = isInWatchlist(movie.id);

  // Generate unique review counts derived from the rating to feel realistic
  const dynamicReviewsCount = Math.floor(movie.rating * 35 + movie.year % 50 + 20);

  return (
    <article style={{ backgroundColor: "#080808", minHeight: "100vh" }} id={`movie-detail-view-${movie.id}`}>
      
      {/* Background Ambience Backdrop Layer */}
      <div 
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "90vh",
          backgroundImage: `url(${movie.backdrop})`,
          backgroundSize: "cover",
          backgroundPosition: "center 20%",
          opacity: 0.15,
          filter: "blur(40px)",
          pointerEvents: "none",
          zIndex: 0
        }}
        id="ambient-backglow"
      />

      {/* Main Details Section: Adapts dynamically to Desktop and Mobile viewpoints */}
      <section 
        style={{
          position: "relative",
          zIndex: 2,
          padding: "120px 4% 60px",
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",
          boxSizing: "border-box"
        }}
        id="detail-main-wrapper"
      >
        {/* Floating Back Navigation Button */}
        <div style={{ marginBottom: "40px", display: "flex", justifyContent: "flex-start" }}>
          <button 
            onClick={() => navigate(-1)} 
            className="back-home-link" 
            id="back-home-btn"
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "8px", 
              cursor: "pointer", 
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              padding: "10px 20px"
            }}
          >
            <ArrowLeft size={16} strokeWidth={2.5} />
            <span>Back</span>
          </button>
        </div>

        {/* Poster & Profile Split Section */}
        <div 
          className="details-split-container"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: "50px",
            alignItems: "start",
            marginBottom: "60px"
          }}
          id="split-container"
        >
          {/* Left Block: Tall High-Quality Movie Poster */}
          <div 
            className="details-poster-block"
            style={{
              position: "relative",
              borderRadius: "16px",
              overflow: "hidden",
              border: "2px solid rgba(255, 255, 255, 0.06)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.95)",
              aspectRatio: "2/3"
            }}
            id="poster-wrapper-block"
          >
            <img 
              src={movie.poster} 
              alt={`${movie.title} Poster`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover"
              }}
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://via.placeholder.com/400x600/111111/ffffff?text=${encodeURIComponent(movie.title)}`;
              }}
            />
          </div>

          {/* Right Block: Complete Meta Information Panel */}
          <div 
            className="details-info-block"
            style={{
              display: "flex",
              flexDirection: "column",
              color: "#ffffff",
              textAlign: "left"
            }}
            id="information-panel"
          >
            {/* Meta tags at the top */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "rgba(255, 255, 255, 0.45)", fontSize: "14px", fontWeight: 600, marginBottom: "16px" }}>
              <span>{movie.year}</span>
              <span>|</span>
              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <Clock size={14} />
                <span>2h 18m</span>
              </span>
            </div>

            {/* Custom outlined Genre Category Badge */}
            <div style={{ marginBottom: "20px" }}>
              <span 
                style={{ 
                  color: "var(--accent-gold)", 
                  border: "1.5px solid var(--accent-gold)", 
                  borderRadius: "4px", 
                  padding: "5px 12px", 
                  fontSize: "12px", 
                  fontWeight: 700, 
                  letterSpacing: "1px",
                  display: "inline-block",
                  textTransform: "uppercase"
                }}
              >
                {movie.genre}
              </span>
            </div>

            {/* Giant Title name */}
            <h1 
              style={{ 
                fontFamily: "var(--font-display)", 
                fontSize: "clamp(34px, 5vw, 54px)", 
                fontWeight: 800, 
                lineHeight: "1.1", 
                marginBottom: "20px", 
                color: "#ffffff",
                letterSpacing: "-1px"
              }}
            >
              {movie.title}
            </h1>

            {/* Micro Rating Row with gorgeous gold stars */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "32px", flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: "2px" }}>
                {[1, 2, 3, 4, 5].map((starIndex) => {
                  const ratingInFiveScale = movie.rating / 2;
                  const isFilled = starIndex <= Math.round(ratingInFiveScale);
                  return (
                    <Star 
                      key={starIndex} 
                      size={16} 
                      fill={isFilled ? "var(--accent-gold)" : "none"} 
                      stroke={isFilled ? "var(--accent-gold)" : "rgba(255,255,255,0.2)"} 
                    />
                  );
                })}
              </div>
              <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--accent-gold)", marginLeft: "4px" }}>
                {(movie.rating / 2).toFixed(1)} / 5.0
              </span>
              <span style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.45)" }}>
                | {dynamicReviewsCount} reviews by the Community
              </span>
            </div>

            {/* Overview / Story synopsis block */}
            <div style={{ marginBottom: "30px" }}>
              <h3 style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.4)", textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 700, marginBottom: "12px" }}>
                Overview
              </h3>
              <p style={{ fontSize: "16px", color: "rgba(255, 255, 255, 0.75)", lineHeight: "1.75", margin: 0, fontWeight: 400 }}>
                {movie.overview}
              </p>
            </div>

            {/* Cast & Director listing credits */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "40px" }}>
              <div style={{ fontSize: "14px" }}>
                <span style={{ color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>Cast: </span>
                <span style={{ color: "#ffffff", fontWeight: 500 }}>{movie.cast.join(", ")}</span>
              </div>
              <div style={{ fontSize: "14px" }}>
                <span style={{ color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>Director: </span>
                <span style={{ color: "#ffffff", fontWeight: 500 }}>{movie.director}</span>
              </div>
            </div>

            {/* Responsive Action Buttons (Play & Add to Watchlist) */}
            <div 
              style={{ 
                display: "flex", 
                flexWrap: "wrap", 
                gap: "16px", 
                width: "100%" 
              }}
              id="action-buttons-group"
            >
              {/* Play Button - Yellow filled */}
              <button
                onClick={() => alert(`Projecting "${movie.title}" in Ultra-HD. Grab your popcorn! 🍿`)}
                style={{
                  flex: "1 1 auto",
                  backgroundColor: "var(--accent-gold)",
                  color: "#0d0d0d",
                  fontWeight: 700,
                  fontSize: "16px",
                  padding: "16px 36px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  transition: "all 0.25s",
                  minWidth: "160px"
                }}
                className="cta-btn-hover"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 10px 20px rgba(229, 9, 20, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
                id="details-play-trigger"
              >
                <Play size={20} fill="currentColor" stroke="none" />
                <span>Play</span>
              </button>

              {/* Add to my list (Watchlist Toggle) - Outlined white */}
              <button
                onClick={() => toggleWatchlist(movie.id)}
                style={{
                  flex: "1 1 auto",
                  backgroundColor: "transparent",
                  color: "#ffffff",
                  fontWeight: 600,
                  fontSize: "16px",
                  padding: "15px 36px",
                  borderRadius: "8px",
                  border: "2px solid #ffffff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  transition: "all 0.25s",
                  minWidth: "160px"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
                id="details-watchlist-trigger"
              >
                {isSaved ? (
                  <>
                    <Check size={20} strokeWidth={2.5} style={{ color: "var(--accent-gold)" }} />
                    <span style={{ color: "var(--accent-gold)" }}>In my list</span>
                  </>
                ) : (
                  <>
                    <Plus size={20} strokeWidth={2.5} />
                    <span>Add to my list</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>

        {/* Section: Other Movies (Recommendations Carousel) */}
        <div style={{ marginTop: "100px", borderTop: "1.5px solid rgba(255, 255, 255, 0.05)", paddingTop: "50px" }}>
          <h2 
            style={{ 
              fontFamily: "var(--font-display)", 
              fontSize: "28px", 
              fontWeight: 800, 
              color: "#ffffff", 
              marginBottom: "36px", 
              textAlign: "left" 
            }}
          >
            Other Movies
          </h2>

          {/* Carousel Root Container with Hover arrows & hidden native scrollbar */}
          <div 
            style={{ 
              position: "relative",
              width: "100%"
            }} 
            className="carousel-root-wrapper"
            id="carousel-root-container"
          >
            {/* Elegant Translucent Left Arrow Indicator */}
            <button
              onClick={() => scroll("left")}
              style={{
                position: "absolute",
                left: "-16px",
                top: "calc(50% - 12px)",
                transform: "translateY(-50%)",
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                backgroundColor: "rgba(13, 13, 13, 0.85)",
                border: "1.5px solid rgba(255, 255, 255, 0.12)",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 10,
                boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                opacity: scrollProgress > 1 ? 1 : 0,
                pointerEvents: scrollProgress > 1 ? "auto" : "none"
              }}
              className="carousel-control-btn left-arrow-control"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--accent-gold)";
                e.currentTarget.style.color = "#0d0d0d";
                e.currentTarget.style.transform = "translateY(-50%) scale(1.08)";
                e.currentTarget.style.borderColor = "var(--accent-gold)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(13, 13, 13, 0.85)";
                e.currentTarget.style.color = "#ffffff";
                e.currentTarget.style.transform = "translateY(-50%) scale(1)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
              }}
              id="carousel-scroll-left"
              aria-label="Scroll Left"
            >
              <ChevronLeft size={22} strokeWidth={2.5} />
            </button>

            {/* Elegant Translucent Right Arrow Indicator */}
            <button
              onClick={() => scroll("right")}
              style={{
                position: "absolute",
                right: "-16px",
                top: "calc(50% - 12px)",
                transform: "translateY(-50%)",
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                backgroundColor: "rgba(13, 13, 13, 0.85)",
                border: "1.5px solid rgba(255, 255, 255, 0.12)",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 10,
                boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                opacity: scrollProgress < 99 ? 1 : 0,
                pointerEvents: scrollProgress < 99 ? "auto" : "none"
              }}
              className="carousel-control-btn right-arrow-control"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--accent-gold)";
                e.currentTarget.style.color = "#0d0d0d";
                e.currentTarget.style.transform = "translateY(-50%) scale(1.08)";
                e.currentTarget.style.borderColor = "var(--accent-gold)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(13, 13, 13, 0.85)";
                e.currentTarget.style.color = "#ffffff";
                e.currentTarget.style.transform = "translateY(-50%) scale(1)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
              }}
              id="carousel-scroll-right"
              aria-label="Scroll Right"
            >
              <ChevronRight size={22} strokeWidth={2.5} />
            </button>

            {/* Carousel Feed wrapper */}
            <div 
              ref={carouselRef}
              onScroll={handleScroll}
              className="other-movies-scroll"
              style={{
                display: "flex",
                gap: "24px",
                overflowX: "auto",
                paddingBottom: "16px",
                scrollbarWidth: "none", /* Firefox */
                msOverflowStyle: "none", /* IE 10+ */
                scrollSnapType: "x mandatory",
                WebkitOverflowScrolling: "touch"
              }}
              id="other-movies-carousel-scroller"
            >
              <style>{`
                .other-movies-scroll::-webkit-scrollbar {
                  display: none; /* Safari and Chrome */
                }
              `}</style>

              {otherMovies.map((otherMovie) => (
                <Link 
                  key={otherMovie.id}
                  to={`/movie/${otherMovie.id}`}
                  style={{ 
                    flex: "0 0 240px", 
                    textDecoration: "none",
                    scrollSnapAlign: "start",
                    transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    outline: "none"
                  }}
                  className="other-movie-card-item"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                  }}
                  id={`recommendation-${otherMovie.id}`}
                >
                  <div 
                    style={{
                      position: "relative",
                      borderRadius: "12px",
                      overflow: "hidden",
                      border: "1.5px solid rgba(255, 255, 255, 0.04)",
                      backgroundColor: "#111111",
                      aspectRatio: "2/3",
                      marginBottom: "12px",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.5)"
                    }}
                  >
                    <img 
                      src={otherMovie.poster} 
                      alt={`${otherMovie.title} recommendation poster`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                      }}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://via.placeholder.com/300x450/111111/ffffff?text=${encodeURIComponent(otherMovie.title)}`;
                      }}
                    />
                    {/* Subtle black overlay fade */}
                    <div 
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "40%",
                        background: "linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.4) 60%, transparent 100%)",
                        pointerEvents: "none"
                      }}
                    />

                    {/* Absolute positioning description details overlay exactly like reference image */}
                    <div 
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: "16px 14px",
                        zIndex: 3,
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px"
                      }}
                    >
                      <span 
                        style={{ 
                          color: "#ffffff", 
                          fontSize: "14px", 
                          fontWeight: 700, 
                          letterSpacing: "-0.2px",
                          lineHeight: 1.25,
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: "vertical",
                          textAlign: "left"
                        }}
                      >
                        {otherMovie.title}
                      </span>
                      <span 
                        style={{ 
                          color: "var(--accent-gold)", 
                          fontSize: "12px", 
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          gap: "4px"
                        }}
                      >
                        <span>★ {(otherMovie.rating / 2).toFixed(1)}</span>
                        <span style={{ color: "rgba(255,255,255,0.4)" }}>|</span>
                        <span style={{ color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>{otherMovie.genre}</span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Custom Modern Premium Progress indicator track */}
            <div 
              style={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                marginTop: "12px",
                width: "100%"
              }}
              id="scroll-indicators-track"
            >
              <div 
                style={{
                  position: "relative",
                  width: "140px",
                  height: "3px",
                  borderRadius: "100px",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  overflow: "hidden"
                }}
              >
                <div 
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    height: "100%",
                    width: "40px",
                    borderRadius: "100px",
                    backgroundColor: "var(--accent-gold)",
                    transform: `translateX(${(scrollProgress / 100) * 100}px)`, // Max travel space: 140px - 40px = 100px
                    transition: "transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)"
                  }}
                  id="scroll-indicator-thumb"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Closing Brand Editorial Footer Segment identical to mobile screenshot */}
        <div 
          style={{ 
            marginTop: "80px", 
            padding: "48px 24px", 
            borderTop: "1px solid rgba(255, 255, 255, 0.05)",
            textAlign: "left",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "24px"
          }}
          id="editorial-footer"
        >
          <div style={{ maxWidth: "480px" }}>
            <p style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "14px", lineHeight: "1.7", margin: 0 }}>
              From blockbuster hits to hidden gems, we've got a movie for every taste. Continue browsing to find your perfect match.
            </p>
          </div>
          <div>
            <span style={{ fontSize: "28px", pointerEvents: "none" }}>🍿✨</span>
          </div>
        </div>

      </section>

      {/* Styled inline components to adapt the split screen gracefully for custom viewport scales */}
      <style>{`
        @media (max-width: 767px) {
          .details-split-container {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .details-poster-block {
            max-width: 280px;
            margin: 0 auto;
            width: 100%;
          }
          #detail-main-wrapper {
            padding-top: 100px !important;
          }
          .other-movie-card-item {
            flex: 0 0 160px !important;
          }
          .carousel-control-btn {
            display: none !important;
          }
        }
      `}</style>
    </article>
  );
};
