import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, LayoutGrid, ListCollapse, ArrowDown, ArrowUp } from "lucide-react";
import { Movie } from "../types";
import { MovieCard } from "./MovieCard";

interface MovieGridProps {
  movies: Movie[];
}

export const MovieGrid: React.FC<MovieGridProps> = ({ movies }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCrawling, setIsCrawling] = useState(false);
  const animationRef = useRef<number | null>(null);
  const scrollDirectionRef = useRef<"right" | "left">("right");
  const isHoveredRef = useRef<boolean>(false);

  // Filter out the movies to showcase
  // In a real application, we might fetch a paginated list, but here we can toggle layouts
  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" 
        ? scrollLeft - clientWidth * 0.75 
        : scrollLeft + clientWidth * 0.75;
      
      scrollRef.current.scrollTo({
        left: scrollTo,
        behavior: "smooth"
      });
    }
  };

  const startScrollAnimation = () => {
    if (isExpanded) return;
    isHoveredRef.current = true;
    setIsCrawling(true);

    const animate = () => {
      if (!isHoveredRef.current || isExpanded) return;

      if (scrollRef.current) {
        const el = scrollRef.current;
        const maxScroll = el.scrollWidth - el.clientWidth;

        if (maxScroll > 0) {
          let currentScroll = el.scrollLeft;

          if (scrollDirectionRef.current === "right") {
            currentScroll += 0.6; // Buttery smooth incremental step
            if (currentScroll >= maxScroll) {
              currentScroll = maxScroll;
              scrollDirectionRef.current = "left";
            }
          } else {
            currentScroll -= 0.6;
            if (currentScroll <= 0) {
              currentScroll = 0;
              scrollDirectionRef.current = "right";
            }
          }

          el.scrollLeft = currentScroll;
        }
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    if (!animationRef.current) {
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  const stopScrollAnimation = () => {
    isHoveredRef.current = false;
    setIsCrawling(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  useEffect(() => {
    if (isExpanded) {
      stopScrollAnimation();
    }
  }, [isExpanded]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
    // Smooth scroll down to grid when expanding
    if (!isExpanded) {
      setTimeout(() => {
        document.getElementById("new-releases")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  return (
    <section 
      className="section" 
      id="new-releases" 
      style={{ transition: "all 0.5s ease" }}
      onMouseEnter={startScrollAnimation}
      onMouseLeave={stopScrollAnimation}
    >
      <div className="section-header">
        <h2 className="section-title">New Releases</h2>
        
        {!isExpanded && (
          <div className="scroll-buttons" id="scroll-navigation-arrows">
            <button 
              className="scroll-btn" 
              onClick={() => scroll("left")} 
              aria-label="Scroll Left"
              id="scroll-left-btn"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              className="scroll-btn" 
              onClick={() => scroll("right")} 
              aria-label="Scroll Right"
              id="scroll-right-btn"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      <div style={{ position: "relative" }}>
        {isExpanded ? (
          /* Grid View requested by the "view more movies" layout */
          <div className="movie-grid" id="expanded-movie-grid">
            {movies.map((movie) => (
              <div key={movie.id} className="grid-movie-card">
                <MovieCard movie={movie} />
              </div>
            ))}
            {/* Duplicating some cards on expansion to make the grid look premium, busy, and cinematic */}
            {movies.map((movie) => (
              <div key={`${movie.id}-dup`} className="grid-movie-card">
                <MovieCard movie={{...movie, id: movie.id + 100}} />
              </div>
            ))}
          </div>
        ) : (
          /* Horizontal Row Scrollable (with arrow indicators) */
          <div 
            className="movie-carousel-scroll" 
            ref={scrollRef} 
            id="horizontal-scroll-row"
            style={{ scrollBehavior: isCrawling ? "auto" : "smooth" }}
          >
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>

      {/* Expand/Contract Toggle Button */}
      <div className="load-more-container" id="expand-grid-toggle">
        <button 
          className="load-more-btn" 
          onClick={handleToggleExpand}
          id="load-more-movies-btn"
        >
          {isExpanded ? (
            <>
              <span>Show Less</span>
              <ArrowUp size={16} />
            </>
          ) : (
            <>
              <span className="desktop-only-text">LOAD MORE MOVIES</span>
              <span className="mobile-only-text">SHOW MORE MOVIES</span>
              <ArrowDown size={16} />
            </>
          )}
        </button>
      </div>
    </section>
  );
};
