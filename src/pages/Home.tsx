import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Film, Info, HelpCircle, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";
import API from "../services/api";
import { Movie } from "../types";
import { useAuth } from "../context/AuthContext";
import { Hero } from "../components/Hero";
import { Top3Movies } from "../components/Top3Movies";
import { MovieCard } from "../components/MovieCard";

export const Home: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [isCategoryExpanded, setIsCategoryExpanded] = useState<boolean>(false);
  const { searchQuery, setSearchQuery } = useAuth();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        const response = await API.get<Movie[]>("/movies");
        setMovies(response.data);
      } catch (err: any) {
        setError("Unable to stream movies. Ensure server port is open.");
        console.error("Fetch movies error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Filter movies based on the search query input
  const filteredMovies = movies.filter((movie) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;

    return (
      movie.title.toLowerCase().includes(query) ||
      movie.genre.toLowerCase().includes(query) ||
      movie.director.toLowerCase().includes(query) ||
      movie.cast.some((actor) => actor.toLowerCase().includes(query))
    );
  });

  const handleScrollToGrid = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById("category-explorer")?.scrollIntoView({ behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--bg-primary)" }} id="home-spinner-container">
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
          <p style={{ color: "var(--text-secondary)", fontWeight: 500, fontFamily: "var(--font-display)" }}>Preparing cinematic flow...</p>
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

  if (error) {
    return (
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "20px", backgroundColor: "var(--bg-primary)", padding: "20px" }} id="home-error-container">
        <Film size={48} color="var(--accent-gold)" />
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "24px" }}>Oops! Projection Error</h2>
        <p style={{ color: "var(--text-secondary)", textAlign: "center", maxWidth: "400px" }}>{error}</p>
        <button className="cta-btn" onClick={() => window.location.reload()} id="reload-page-btn">Reload Theater</button>
      </main>
    );
  }

  // Filter movies based on the selected genre
  const genreFilteredMovies = selectedGenre === "All"
    ? movies
    : movies.filter((movie) => movie.genre.toLowerCase() === selectedGenre.toLowerCase());

  const displayedMovies = genreFilteredMovies;

  return (
    <main style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh" }} id="homepage-main-container">
      {searchQuery.trim() !== "" ? (
        /* Search Query Mode: Only show the filtered results in a beautiful vertical grid */
        <section className="section" style={{ paddingTop: "110px", minHeight: "75vh" }} id="search-results-section">
          <div className="section-header">
            <h2 className="section-title">
              Search Results for: <span style={{ color: "var(--accent-gold)" }}>"{searchQuery}"</span>
            </h2>
            <button
              className="secondary-btn"
              onClick={() => setSearchQuery("")}
              style={{ fontSize: "12px", padding: "6px 12px" }}
              id="clear-search-btn"
            >
              Clear Search
            </button>
          </div>
          {filteredMovies.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 20px" }} id="empty-results-view">
              <HelpCircle size={40} color="var(--text-secondary)" style={{ marginBottom: "15px" }} />
              <p style={{ color: "var(--text-secondary)", fontSize: "16px" }}>
                No movies found matching your lookup. Try searching by title, genre, director or actor.
              </p>
            </div>
          ) : (
            <div className="movie-grid" id="search-results-grid">
              {filteredMovies.map((movie) => (
                <div key={movie.id} className="grid-movie-card">
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>
          )}
        </section>
      ) : (
        /* Regular Home Layout */
        <>
          {/* Main Hero Spotlight Banner */}
          <Hero movies={movies} />

          {/* Category Filter Navigation Bar & Display */}
          <section
            className="aligned-container"
            id="category-explorer"
            style={{
              paddingTop: "60px",
              paddingBottom: "40px",
              transition: "all 0.5s ease",
            }}
          >
            <div className="section-header" style={{ flexDirection: "column", alignItems: "flex-start", gap: "10px", marginBottom: "28px" }}>
              <span style={{ color: "var(--accent-gold)", fontSize: "12px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase" }}>
                Browse Catalog
              </span>
              <h2 className="section-title" style={{ margin: 0, fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 700, fontFamily: "var(--font-display)" }}>
                Explore by Genre
              </h2>
            </div>

            {/* Premium Category Filter Navigation Bar */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                overflowX: "auto",
                padding: "4px 0 16px 0",
                marginBottom: "32px",
                width: "100%",
                scrollbarWidth: "none"
              }}
              className="category-nav-bar"
              id="category-nav-bar-container"
            >
              <style>{`
                .category-nav-bar::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              {["All", "Action", "Drama", "Comedy", "Sci-Fi"].map((genre) => {
                const isActive = selectedGenre.toLowerCase() === genre.toLowerCase();
                return (
                  <button
                    key={genre}
                    onClick={() => {
                      setSelectedGenre(genre);
                      setIsCategoryExpanded(false);
                    }}
                    style={{
                      padding: "10px 24px",
                      borderRadius: "50px",
                      fontSize: "14px",
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                      backgroundColor: isActive ? "var(--accent-gold)" : "rgba(255, 255, 255, 0.05)",
                      color: isActive ? "#0d0d0d" : "rgba(255, 255, 255, 0.75)",
                      border: isActive ? "2px solid var(--accent-gold)" : "2px solid rgba(255, 255, 255, 0.08)",
                      outline: "none",
                      whiteSpace: "nowrap",
                      fontFamily: "var(--font-display)",
                      letterSpacing: "0.5px"
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.25)";
                        e.currentTarget.style.color = "#ffffff";
                        e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.08)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                        e.currentTarget.style.color = "rgba(255, 255, 255, 0.75)";
                        e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                      }
                    }}
                    id={`genre-btn-${genre}`}
                  >
                    {genre}
                  </button>
                );
              })}
            </div>

            {/* Filtered Movie Results Display */}
            <div style={{ position: "relative" }}>
              {!isCategoryExpanded && genreFilteredMovies.length > 0 && (
                <>
                  <button 
                    className="genre-scroll-arrow left" 
                    onClick={(e) => { e.preventDefault(); scrollLeft(); }}
                    aria-label="Scroll left"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    className="genre-scroll-arrow right" 
                    onClick={(e) => { e.preventDefault(); scrollRight(); }}
                    aria-label="Scroll right"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
              <div 
                className={isCategoryExpanded ? "cards-expanded" : "cards-collapsed"} 
                id="genre-filtered-movies-grid" 
                style={{ minHeight: "350px" }}
                ref={scrollContainerRef}
              >
              {displayedMovies.map((movie) => (
                <div key={movie.id} className="grid-movie-card" style={{ animation: "drawerFadeIn 0.35s ease-out forwards" }}>
                  <MovieCard movie={movie} />
                </div>
              ))}
              </div>
            </div>

            {/* Expand / Collapse Category Toggle Button */}
            {genreFilteredMovies.length > 3 && (
              <div className="load-more-container" id="category-expand-toggle" style={{ marginTop: "32px", marginBottom: "0px" }}>
                <button
                  className="load-more-btn"
                  onClick={() => setIsCategoryExpanded(!isCategoryExpanded)}
                  id="toggle-category-movies-btn"
                >
                  {isCategoryExpanded ? (
                    <>
                      <span>Show Less</span>
                      <ChevronUp size={16} />
                    </>
                  ) : (
                    <>
                      <span>Show All</span>
                      <ChevronDown size={16} />
                    </>
                  )}
                </button>
              </div>
            )}

            {genreFilteredMovies.length === 0 && (
              <div style={{ textAlign: "center", padding: "60px 20px" }} id="no-movies-view">
                <p style={{ color: "var(--text-secondary)" }}>No movies found under this category.</p>
              </div>
            )}
          </section>

          {/* Ranked billboard Section showing numbers 1, 2, 3 */}
          <Top3Movies movies={movies} />

          {/* Bottom CTA section from Figma */}
          <section className="bottom-cta" id="bottom-cta-banner">
            <div className="bottom-cta-bg"></div>
            <div className="bottom-cta-content">
              <span className="cta-tagline">Unlimited Entertainment</span>
              <h2 className="cta-heading">From blockbuster hits to hidden gems</h2>
              <p className="cta-desc">
                We've got a movie for every taste. Continue browsing our full catalog to find your next favorite movie. Log in to personalize your recommendations.
              </p>
              <button
                onClick={handleScrollToGrid}
                className="cta-btn"
                id="shop-list-btn"
              >
                Shop List
              </button>
            </div>

            {/* Ambient Popcorn vector illustration overlay styled perfectly in index.css */}
            <div
              className="popcorn-overlay"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&q=80&w=600')` }}
              id="popcorn-overlay"
            ></div>
          </section>
        </>
      )}
    </main>
  );
};
