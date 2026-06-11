import React, { useState } from "react";
import { X, Mail, Lock, User as UserIcon, LogIn, UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const AuthModal: React.FC = () => {
  const { 
    isAuthOpen, 
    authMode, 
    setAuthOpen, 
    setAuthMode, 
    login, 
    signup, 
    error, 
    setError,
    isLoading 
  } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  if (!isAuthOpen) return null;

  const handleClose = () => {
    setAuthOpen(false);
    setError(null);
    setEmail("");
    setPassword("");
    setName("");
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (authMode === "login") {
      if (!email || !password) {
        setError("Please enter your email and password.");
        return;
      }
      const success = await login(email, password);
      if (success) {
        handleClose();
      }
    } else {
      if (!name || !email || !password) {
        setError("Please fill in all details.");
        return;
      }
      const success = await signup(name, email, password);
      if (success) {
        handleClose();
      }
    }
  };

  const toggleMode = () => {
    setAuthMode(authMode === "login" ? "signup" : "login");
    setError(null);
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={handleOverlayClick} 
      id="login-modal-overlay"
    >
      <div className="modal-content" id="login-modal-container">
        <button 
          className="close-modal-btn" 
          onClick={handleClose} 
          aria-label="Close modal"
          id="modal-close-icon"
        >
          <X size={24} />
        </button>

        <div 
          className="auth-switcher-capsule" 
          style={{ 
            display: "flex", 
            width: "100%", 
            border: "3px solid var(--accent-gold)", 
            borderRadius: "50px", 
            padding: "4px",
            backgroundColor: "#161616",
            marginBottom: "28px"
          }} 
          id="auth-tabs-group"
        >
          <button 
            type="button"
            className={`auth-tab-btn ${authMode === "login" ? "active" : ""}`} 
            onClick={() => { setAuthMode("login"); setError(null); }}
            style={{ 
              flex: 1, 
              background: authMode === "login" ? "var(--accent-gold)" : "none", 
              border: "none", 
              color: authMode === "login" ? "#0d0d0d" : "#aaaaaa", 
              fontSize: "15px",
              fontWeight: "700",
              padding: "10px 14px",
              borderRadius: "50px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              textAlign: "center"
            }}
            id="tab-selector-login"
          >
            Login
          </button>
          <button 
            type="button"
            className={`auth-tab-btn ${authMode === "signup" ? "active" : ""}`} 
            onClick={() => { setAuthMode("signup"); setError(null); }}
            style={{ 
              flex: 1, 
              background: authMode === "signup" ? "var(--accent-gold)" : "none", 
              border: "none", 
              color: authMode === "signup" ? "#0d0d0d" : "#aaaaaa", 
              fontSize: "15px",
              fontWeight: "700",
              padding: "10px 14px",
              borderRadius: "50px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              textAlign: "center"
            }}
            id="tab-selector-signup"
          >
            Sign Up
          </button>
        </div>

        {error && <div className="form-error" id="form-error-banner">{error}</div>}

        <form onSubmit={handleSubmit} id="auth-submit-form">
          {authMode === "signup" && (
            <div className="form-group" style={{ marginBottom: "20px" }}>
              <label 
                className="form-label" 
                htmlFor="user-fullname"
                style={{ 
                  color: "var(--accent-gold)", 
                  fontWeight: "600", 
                  fontSize: "13px", 
                  marginBottom: "6px"
                }}
              >
                Full Name
              </label>
              <input
                type="text"
                id="user-fullname"
                className="form-input"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
          )}

          <div className="form-group" style={{ marginBottom: "20px" }}>
            <label 
              className="form-label" 
              htmlFor="user-email-address"
              style={{ 
                color: "var(--accent-gold)", 
                fontWeight: "600", 
                fontSize: "13px", 
                marginBottom: "6px"
              }}
            >
              Username
            </label>
            <input
              type="email"
              id="user-email-address"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              className="form-label" 
              htmlFor="user-password-credential"
              style={{ 
                color: "var(--accent-gold)", 
                fontWeight: "600", 
                fontSize: "13px", 
                marginBottom: "6px"
              }}
            >
              Password
            </label>
            <input
              type="password"
              id="user-password-credential"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          <div style={{ display: "flex", justifyContent: "center", marginTop: "16px" }}>
            <button 
              type="submit" 
              className="submit-btn" 
              disabled={isLoading}
              id="auth-submit-btn"
              style={{ 
                backgroundColor: "var(--accent-gold)", 
                color: "#0d0d0d", 
                border: "none",
                padding: "12px 64px",
                fontSize: "14px",
                fontWeight: "700",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "auto"
              }}
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : authMode === "login" ? (
                <span>Login</span>
              ) : (
                <span>Sign Up</span>
              )}
            </button>
          </div>
        </form>

        <div className="modal-toggle-text">
          {authMode === "login" ? (
            <>
              New to PopFlix?
              <button className="toggle-mode-btn" onClick={toggleMode} id="switch-to-signup-btn">
                Sign up now
              </button>
            </>
          ) : (
            <>
              Already have an account?
              <button className="toggle-mode-btn" onClick={toggleMode} id="switch-to-login-btn">
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
