import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, LogOut, User as UserIcon, ChevronDown, ChevronUp, X, Eye, EyeOff, Home as HomeIcon, TrendingUp, Grid, Bookmark } from "lucide-react";
import { useAuth } from "../context/AuthContext";

// Popcorn Bucket Custom SVG Icon styled in gold
const PopcornIcon: React.FC<{ size?: number }> = ({ size = 22 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    style={{ color: "var(--accent-gold)" }}
  >
    <path d="M6 10 L8 22 H16 L18 10" />
    <path d="M10 10 L10 22" />
    <path d="M14 10 L14 22" strokeDasharray="1 1" />
    {/* Popcorn fluffy clouds filling */}
    <path d="M5 10c-1-1 .5-3 2-2.5 .3-1.5 2-2 3-1 1-1.5 3-1 3.5.5.5-1.2 2-1 2.5.5.5-1 2-.5 1 2.5" fill="var(--accent-gold)" stroke="var(--accent-gold)" />
  </svg>
);

export const Navbar: React.FC = () => {
  // Extract authentication variables and functional methods
  const { 
    user, 
    isAuthOpen, 
    setAuthOpen, 
    setAuthMode, 
    logout, 
    searchQuery, 
    setSearchQuery, 
    watchlist,
    login,
    signup
  } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileProfileExpanded, setIsMobileProfileExpanded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Mobile Auth Form custom states
  const [mobileAuthTab, setMobileAuthTab] = useState<"login" | "signup">("login");
  const [mobileUsername, setMobileUsername] = useState("");
  const [mobilePassword, setMobilePassword] = useState("");
  const [mobileError, setMobileError] = useState<string | null>(null);
  const [mobileIsLoading, setMobileIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Scroll transparency tracker
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Lock scroll on body when mobile hamburger is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add("body-no-scroll");
    } else {
      document.body.classList.remove("body-no-scroll");
    }
    return () => {
      document.body.classList.remove("body-no-scroll");
    };
  }, [isMobileMenuOpen]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Redirect non-homepage search entries immediately
    if (location.pathname !== "/" && value.trim() !== "") {
      navigate("/");
    }
  };

  const handleLogoClick = () => {
    setSearchQuery(""); // clear searches
    setIsMobileMenuOpen(false);
  };

  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  // Perform mobile form login/registration
  const handleMobileFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMobileError(null);
    setMobileIsLoading(true);

    try {
      if (mobileAuthTab === "login") {
        const success = await login(mobileUsername, mobilePassword);
        if (success) {
          setMobileUsername("");
          setMobilePassword("");
          // Keep menu open to let them view profile or close it gracefully
        } else {
          setMobileError("Invalid username or password");
        }
      } else {
        // Sign up with standard mock registration
        const success = await signup(mobileUsername, mobileUsername, mobilePassword);
        if (success) {
          setMobileUsername("");
          setMobilePassword("");
        } else {
          setMobileError("Failed to register. Choose another username");
        }
      }
    } catch (err: any) {
      setMobileError(err?.message || "An authentication error occurred");
    } finally {
      setMobileIsLoading(false);
    }
  };

  return (
    <>
      <nav className={`navbar ${isScrolled ? "scrolled" : ""}`} id="app-navbar" style={{ zIndex: 1000 }}>
        <div className="nav-left">
          <Link to="/" className="logo" onClick={handleLogoClick} id="brand-logo" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span>PopFlix</span>
            <PopcornIcon />
          </Link>
          
          <ul className="nav-links">
            <li>
              <Link to="/" className={location.pathname === "/" ? "active" : ""} onClick={() => setSearchQuery("")}>
                Home
              </Link>
            </li>
            <li>
              <a href="#top-movies">Top 3</a>
            </li>
            <li>
              <a href="#category-explorer">Categories</a>
            </li>
            <li>
              <Link to="/watchlist" className={location.pathname === "/watchlist" ? "active" : ""}>
                My Watchlist
                {watchlist.length > 0 && (
                  <span className="watchlist-count" id="header-watchlist-badge-count">{watchlist.length}</span>
                )}
              </Link>
            </li>
          </ul>
        </div>

        <div className="nav-center">
          <div className="search-container">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              className="search-input"
              placeholder="Search movies, genres, cast..."
              value={searchQuery}
              onChange={handleSearchChange}
              id="nav-search-input"
            />
          </div>
        </div>

        <div className="nav-right" style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          {/* Desktop User profile section */}
          {user ? (
            <div style={{ position: "relative" }} id="user-profile-menu">
              <button
                className="profile-icon-btn"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                style={{
                  background: "none",
                  border: "2px solid var(--accent-gold)",
                  borderRadius: "50%",
                  width: "44px",
                  height: "44px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--accent-gold)",
                  cursor: "pointer",
                  padding: 0,
                  outline: "none",
                  transition: "all 0.2s ease"
                }}
                id="navbar-profile-trigger-btn"
                title="View Profile"
              >
                <UserIcon size={24} strokeWidth={2.5} />
              </button>
              
              {/* Expandable Sidebar/Drawer Panel */}
              {isProfileOpen && (
                <>
                  <div 
                    onClick={() => setIsProfileOpen(false)}
                    style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      width: "100vw",
                      height: "100vh",
                      backgroundColor: "transparent",
                      zIndex: 9998,
                      cursor: "default"
                    }}
                    id="profile-drawer-underlay"
                  />
                  
                  <div 
                    className="profile-expand-sidebar"
                    style={{
                      position: "fixed",
                      top: "80px",
                      right: 0,
                      width: "300px",
                      height: "calc(100vh - 80px)",
                      backgroundColor: "#0d0d0d",
                      borderLeft: "2px solid rgba(255, 255, 255, 0.05)",
                      boxShadow: "-12px 10px 40px rgba(0, 0, 0, 0.95)",
                      zIndex: 9999,
                      padding: "48px 32px",
                      boxSizing: "border-box",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      alignItems: "flex-start"
                    }}
                    id="profile-drawer-container"
                  >
                    <h2 
                      style={{ 
                        fontSize: "24px", 
                        fontWeight: "700", 
                        color: "var(--accent-gold)", 
                        fontFamily: "var(--font-display)",
                        marginBottom: "40px",
                        letterSpacing: "-0.5px"
                      }}
                    >
                      My Profile
                    </h2>

                    <div style={{ width: "100%", marginBottom: "20px", textAlign: "left" }}>
                      <label 
                        style={{ 
                          fontSize: "13px", 
                          fontWeight: "600",
                          color: "var(--accent-gold)", 
                          display: "block",
                          marginBottom: "6px"
                        }}
                      >
                        Full Name
                      </label>
                      <span 
                        style={{ 
                          fontSize: "16px", 
                          fontWeight: "500", 
                          color: "#ffffff",
                          display: "block" 
                        }}
                      >
                        {user.name}
                      </span>
                    </div>

                    <div style={{ width: "100%", marginBottom: "20px", textAlign: "left" }}>
                      <label 
                        style={{ 
                          fontSize: "13px", 
                          fontWeight: "600",
                          color: "var(--accent-gold)", 
                          display: "block",
                          marginBottom: "6px"
                        }}
                      >
                        Username / Email
                      </label>
                      <span 
                        style={{ 
                          fontSize: "16px", 
                          fontWeight: "500", 
                          color: "#ffffff",
                          display: "block" 
                        }}
                      >
                        {user.email}
                      </span>
                    </div>

                    <div style={{ width: "100%", marginBottom: "40px", textAlign: "left" }}>
                      <label 
                        style={{ 
                          fontSize: "13px", 
                          fontWeight: "600",
                          color: "var(--accent-gold)", 
                          display: "block",
                          marginBottom: "6px"
                        }}
                      >
                        Password
                      </label>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                        <span 
                          style={{ 
                            fontSize: "16px", 
                            fontWeight: "500", 
                            color: "#ffffff",
                            fontFamily: showPassword ? "inherit" : "monospace",
                            letterSpacing: showPassword ? "normal" : "4px"
                          }}
                        >
                          {showPassword ? (localStorage.getItem("saved_password") || "password123") : "••••••••"}
                        </span>
                        <button 
                          onClick={() => setShowPassword(!showPassword)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "var(--accent-gold)",
                            cursor: "pointer",
                            padding: "4px"
                          }}
                          title={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        setIsProfileOpen(false);
                        logout();
                      }}
                      style={{
                        width: "100%",
                        backgroundColor: "var(--accent-gold)",
                        color: "#0d0d0d",
                        fontWeight: "700",
                        fontSize: "14px",
                        padding: "12px 0",
                        borderRadius: "8px",
                        border: "none",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        marginTop: "auto"
                      }}
                      className="profile-signout-btn"
                      id="profile-panel-signout"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button 
              className="login-btn navbar-auth-toggle-btn" 
              onClick={() => {
                if (isAuthOpen) {
                  setAuthOpen(false);
                } else {
                  setAuthMode("login");
                  setAuthOpen(true);
                }
              }}
              id="nav-login-signup-toggle-btn"
              style={{ 
                backgroundColor: "var(--accent-gold)",
                color: "#0d0d0d",
                fontWeight: "700",
                fontSize: "14px",
                padding: "10px 22px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              <span>Login/Sign Up</span>
              {isAuthOpen ? <ChevronUp size={16} strokeWidth={2.5} /> : <ChevronDown size={16} strokeWidth={2.5} />}
            </button>
          )}

          {/* Animated Hamburger Trigger Button for Mobile Viewport */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`hamburger-btn ${isMobileMenuOpen ? "open" : ""}`}
            style={{
              display: "none", // Visible through CSS media queries only
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 0,
              outline: "none",
              zIndex: 10002,
              position: "relative"
            }}
            id="mobile-hamburger-trigger"
            aria-label="Menu"
          >
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "20px", height: "12px" }}>
              <span
                style={{
                  width: "100%",
                  height: "2px",
                  backgroundColor: "var(--accent-gold)",
                  borderRadius: "4px",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: isMobileMenuOpen ? "translateY(5px) rotate(45deg)" : "none"
                }}
              />
              <span
                style={{
                  width: "100%",
                  height: "2px",
                  backgroundColor: "var(--accent-gold)",
                  borderRadius: "4px",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  opacity: isMobileMenuOpen ? 0 : 1
                }}
                className="hamburger-middle-line"
              />
              <span
                style={{
                  width: "100%",
                  height: "2px",
                  backgroundColor: "var(--accent-gold)",
                  borderRadius: "4px",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: isMobileMenuOpen ? "translateY(-5px) rotate(-45deg)" : "none"
                }}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Pop-out Sliding Hamburger Drawer Menu */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-side-drawer animate-fade-in"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "#000000",
            zIndex: 10001,
            padding: "40px 32px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto"
          }}
          id="mobile-side-drawer-container"
        >
          {/* Header Row inside Mobile Drawer */}
          <div 
            style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              marginBottom: "48px"
            }}
          >
            <Link 
              to="/" 
              className="logo" 
              onClick={handleLogoClick}
              style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "8px", 
                textDecoration: "none",
                fontWeight: "800",
                fontSize: "28px"
              }}
            >
              <span>PopFlix</span>
              <PopcornIcon size={24} />
            </Link>

            {/* Circular Close Button */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: "transparent",
                border: "none",
                color: "var(--accent-gold)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "background-color 0.2s"
              }}
              title="Close Menu"
              id="mobile-drawer-close-btn"
            >
              <X size={20} strokeWidth={2.5} />
            </button>
          </div>

           {/* Navigation Links List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "48px" }}>
            <Link 
              to="/" 
              onClick={handleMobileLinkClick}
              className={`mobile-menu-link ${location.pathname === "/" ? "active" : ""}`}
            >
              <HomeIcon size={24} />
              <span>Home</span>
            </Link>

            <button 
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigate("/");
                setTimeout(() => {
                  document.getElementById("top-movies")?.scrollIntoView({ behavior: "smooth" });
                }, 150);
              }}
              className="mobile-menu-link"
            >
              <TrendingUp size={24} />
              <span>Top 3</span>
            </button>

            <button 
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigate("/");
                setTimeout(() => {
                  document.getElementById("category-explorer")?.scrollIntoView({ behavior: "smooth" });
                }, 150);
              }}
              className="mobile-menu-link"
            >
              <Grid size={24} />
              <span>Categories</span>
            </button>

            <Link 
              to="/watchlist" 
              onClick={handleMobileLinkClick}
              className={`mobile-menu-link ${location.pathname === "/watchlist" ? "active" : ""}`}
            >
              <Bookmark size={24} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                <span>My Watchlist</span>
                {watchlist.length > 0 && <span className="watchlist-count-badge">{watchlist.length}</span>}
              </div>
            </Link>
          </div>

          {/* Bottom Interactive Auth & Profile Block */}
          <div 
            style={{ 
              marginTop: "auto", 
              borderTop: "1px solid rgba(255,255,255,0.08)", 
              paddingTop: "32px",
              paddingBottom: "16px"
            }}
          >
            {user ? (
              // Connected User Profile Block
              <div style={{ width: "100%", textAlign: "left" }} id="mobile-drawer-profile-pane">
                <button 
                  onClick={() => setIsMobileProfileExpanded(!isMobileProfileExpanded)}
                  style={{ 
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "none",
                    border: "none",
                    padding: "16px",
                    borderRadius: "12px",
                    cursor: "pointer",
                    fontSize: "20px", 
                    fontWeight: "700", 
                    color: "var(--accent-gold)", 
                    fontFamily: "var(--font-display)",
                    backgroundColor: "rgba(232, 200, 64, 0.05)",
                    transition: "all 0.2s ease",
                    marginBottom: isMobileProfileExpanded ? "24px" : "0"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <UserIcon size={24} />
                    <span>My Profile</span>
                  </div>
                  {isMobileProfileExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </button>

                {isMobileProfileExpanded && (
                  <div className="mobile-profile-details animate-fade-in" style={{ padding: "0 8px" }}>
                    <div style={{ marginBottom: "16px" }}>
                      <label style={{ fontSize: "12px", color: "var(--accent-gold)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Full Name
                      </label>
                      <p style={{ fontSize: "16px", color: "#ffffff", fontWeight: "500", marginTop: "4px" }}>
                        {user.name}
                      </p>
                    </div>

                    <div style={{ marginBottom: "16px" }}>
                      <label style={{ fontSize: "12px", color: "var(--accent-gold)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Username / Email
                      </label>
                      <p style={{ fontSize: "16px", color: "#ffffff", fontWeight: "500", marginTop: "4px" }}>
                        {user.email}
                      </p>
                    </div>

                    <div style={{ marginBottom: "32px" }}>
                      <label style={{ fontSize: "12px", color: "var(--accent-gold)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Password
                      </label>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", marginTop: "4px" }}>
                        <p 
                          style={{ 
                            fontSize: "16px", 
                            color: "#ffffff", 
                            fontWeight: "500",
                            fontFamily: showPassword ? "inherit" : "monospace",
                            letterSpacing: showPassword ? "normal" : "4px",
                            margin: 0
                          }}
                        >
                          {showPassword ? (localStorage.getItem("saved_password") || "password123") : "••••••••"}
                        </p>
                        <button 
                          onClick={() => setShowPassword(!showPassword)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "var(--accent-gold)",
                            cursor: "pointer",
                            padding: "4px"
                          }}
                          title={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        logout();
                      }}
                      style={{
                        width: "100%",
                        backgroundColor: "rgba(220, 38, 38, 0.1)",
                        color: "#ef4444",
                        border: "1px solid rgba(220, 38, 38, 0.3)",
                        fontWeight: "700",
                        fontSize: "14px",
                        padding: "14px 0",
                        borderRadius: "8px",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px"
                      }}
                      id="mobile-drawer-btn-signout"
                    >
                      <LogOut size={18} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Disconnected Login / Signup form block
              <div id="mobile-drawer-auth-pane">
                {/* Switcher capsule */}
                <div 
                  className="auth-switcher-capsule" 
                  style={{ 
                    display: "flex", 
                    width: "100%", 
                    border: "2px solid var(--accent-gold)", 
                    borderRadius: "50px", 
                    padding: "4px",
                    backgroundColor: "#161616",
                    marginBottom: "24px"
                  }} 
                >
                  <button 
                    type="button"
                    onClick={() => { setMobileAuthTab("login"); setMobileError(null); }}
                    style={{ 
                      flex: 1, 
                      background: mobileAuthTab === "login" ? "var(--accent-gold)" : "none", 
                      border: "none", 
                      color: mobileAuthTab === "login" ? "#0d0d0d" : "#aaaaaa", 
                      fontSize: "14px",
                      fontWeight: "700",
                      padding: "8px 12px",
                      borderRadius: "50px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      textAlign: "center"
                    }}
                    id="mobile-switcher-login"
                  >
                    Login
                  </button>
                  <button 
                    type="button"
                    onClick={() => { setMobileAuthTab("signup"); setMobileError(null); }}
                    style={{ 
                      flex: 1, 
                      background: mobileAuthTab === "signup" ? "var(--accent-gold)" : "none", 
                      border: "none", 
                      color: mobileAuthTab === "signup" ? "#0d0d0d" : "#aaaaaa", 
                      fontSize: "14px",
                      fontWeight: "700",
                      padding: "8px 12px",
                      borderRadius: "50px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      textAlign: "center"
                    }}
                    id="mobile-switcher-signup"
                  >
                    Sign Up
                  </button>
                </div>

                {mobileError && (
                  <div 
                    style={{ 
                      backgroundColor: "rgba(220, 38, 38, 0.15)", 
                      color: "#ef4444", 
                      padding: "10px 14px", 
                      borderRadius: "6px", 
                      fontSize: "13px", 
                      marginBottom: "16px",
                      border: "1px solid rgba(220, 38, 38, 0.3)" 
                    }}
                  >
                    {mobileError}
                  </div>
                )}

                <form onSubmit={handleMobileFormSubmit}>
                  <div className="form-group" style={{ marginBottom: "16px" }}>
                    <label 
                      style={{ 
                        color: "var(--accent-gold)", 
                        fontWeight: "600", 
                        fontSize: "13px", 
                        display: "block",
                        marginBottom: "6px"
                      }}
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. John Doe"
                      value={mobileUsername}
                      onChange={(e) => setMobileUsername(e.target.value)}
                      style={{ 
                        width: "100%", 
                        backgroundColor: "#ffffff", 
                        color: "#0d0d0d",
                        border: "none",
                        borderRadius: "6px",
                        padding: "12px",
                        fontSize: "14px",
                        boxSizing: "border-box"
                      }}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: "24px" }}>
                    <label 
                      style={{ 
                        color: "var(--accent-gold)", 
                        fontWeight: "600", 
                        fontSize: "13px", 
                        display: "block",
                        marginBottom: "6px"
                      }}
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={mobilePassword}
                      onChange={(e) => setMobilePassword(e.target.value)}
                      style={{ 
                        width: "100%", 
                        backgroundColor: "#ffffff", 
                        color: "#0d0d0d",
                        border: "none",
                        borderRadius: "6px",
                        padding: "12px",
                        fontSize: "14px",
                        boxSizing: "border-box"
                      }}
                      required
                    />
                  </div>

                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <button 
                      type="submit" 
                      disabled={mobileIsLoading}
                      style={{ 
                        backgroundColor: "var(--accent-gold)", 
                        color: "#0d0d0d", 
                        border: "none",
                        padding: "12px",
                        fontSize: "14px",
                        fontWeight: "700",
                        borderRadius: "8px",
                        cursor: "pointer",
                        width: "100%",
                        transition: "all 0.2s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                      id="mobile-drawer-auth-submit"
                    >
                      {mobileIsLoading ? (
                        <span>Authenticating...</span>
                      ) : mobileAuthTab === "login" ? (
                        <span>Login</span>
                      ) : (
                        <span>Sign Up</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
