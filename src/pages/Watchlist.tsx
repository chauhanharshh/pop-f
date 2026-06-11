import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bookmark, Film, HelpCircle } from "lucide-react";
import API from "../services/api";
import { Movie } from "../types";
import { useAuth } from "../context/AuthContext";
import { MovieCard } from "../components/MovieCard";

export const Watchlist: React.FC = () => {
  const { user, watchlist, setAuthOpen } = useAuth();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Only fetch movies if user is logged in
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        const response = await API.get<Movie[]>("/movies");
        setMovies(response.data);
      } catch (err: any) {
        setError("Unable to load watchlist items. Please check if the theater node is running.");
        console.error("Fetch movies for watchlist error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [user]);

  // If user is not logged in, show a premium sign-in callout
  if (!user) {
    return (
      <main 
        style={{ 
          minHeight: "75vh", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          flexDirection: "column", 
          gap: "20px", 
          backgroundColor: "var(--bg-primary)", 
          padding: "40px 20px",
          paddingTop: "140px"
        }} 
        id="watchlist-unauthorized-view"
      >
        <div style={{ textAlign: "center", maxWidth: "460px" }}>
          <Bookmark size={48} color="var(--accent-gold)" style={{ margin: "0 auto 20px", strokeWidth: 1.5 }} />
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 700, marginBottom: "12px", color: "var(--text-primary)" }}>
            Unlock Your Watchlist
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "15px", lineHeight: "1.6", marginBottom: "30px" }}>
            Create a free account or sign in to save your favorite cinema, track pending list releases, and curate your personalized streaming queue.
          </p>
          <button 
            className="cta-btn" 
            onClick={() => setAuthOpen(true)} 
            id="watchlist-unauth-login"
            style={{ width: "100%", padding: "14px", fontWeight: "700" }}
          >
            Sign In with PopFlix
          </button>
        </div>
      </main>
    );
  }

  // Filter movies that are inside user's watchlist
  const watchlistMovies = movies.filter((movie) => watchlist.includes(movie.id));

  if (isLoading) {
    return (
      <main style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--bg-primary)" }} id="watchlist-spinner">
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
          <p style={{ color: "var(--text-secondary)", fontWeight: 500, fontFamily: "var(--font-display)" }}>Syncing your personal queue...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "20px", backgroundColor: "var(--bg-primary)", padding: "20px" }} id="watchlist-error">
        <Film size={48} color="var(--accent-gold)" />
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "24px" }}>Syncing Failed</h2>
        <p style={{ color: "var(--text-secondary)", textAlign: "center", maxWidth: "400px" }}>{error}</p>
        <Link to="/" className="cta-btn" style={{ textDecoration: "none" }} id="watchlist-err-back">Back to Catalog</Link>
      </main>
    );
  }

  return (
    <main style={{ backgroundColor: "var(--bg-primary)", minHeight: "87vh", paddingTop: "120px", paddingBottom: "60px" }} id="watchlist-main">
      <section className="section" id="watchlist-section">
        <div className="section-header" style={{ marginBottom: "40px", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "20px" }}>
          <div>
            <h1 className="section-title" style={{ fontSize: "32px", marginBottom: "8px" }}>My Watchlist</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
              {watchlistMovies.length === 0 
                ? "Manage your handpicked movies queue." 
                : `You have ${watchlistMovies.length} movie${watchlistMovies.length === 1 ? "" : "s"} saved to watch`}
            </p>
          </div>
          <Link to="/" className="secondary-btn" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }} id="browse-more-btn">
            Browse More Cinema
          </Link>
        </div>

        {watchlistMovies.length === 0 ? (
          <div style={{ textAlign: "center", padding: "100px 20px" }} id="empty-watchlist-view">
            <Bookmark size={48} color="var(--text-secondary)" style={{ opacity: 0.4, marginBottom: "20px", strokeWidth: 1.5 }} />
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "8px" }}>
              Your watchlist is empty
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", maxWidth: "420px", margin: "0 auto 30px", lineHeight: "1.6" }}>
              Bookmark movies you want to follow. Once added, those cinematic listings will be projected here for single-click access.
            </p>
            <Link to="/" className="cta-btn" style={{ textDecoration: "none", display: "inline-block" }} id="empty-watchlist-explore">
              Explore Theater
            </Link>
          </div>
        ) : (
          <div className="movie-grid" id="watchlist-grid">
            {watchlistMovies.map((movie) => (
              <div key={movie.id} className="grid-movie-card">
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};
