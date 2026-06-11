import React from "react";
import { Link } from "react-router-dom";

export const Footer: React.FC = () => {
  return (
    <footer className="footer-container" id="app-footer">
      <div className="footer-top">
        <Link to="/" className="footer-logo" id="footer-logo-link">
          PopFlix
        </Link>
        <ul className="footer-links">
          <li><Link to="/">Home</Link></li>
          <li><a href="#category-explorer">Categories</a></li>
          <li><a href="#top-movies">Top Charts</a></li>
          <li><a href="#privacy">Privacy Policy</a></li>
          <li><a href="#terms">Terms of Service</a></li>
        </ul>
      </div>
      <div style={{
        textAlign: "center",
        fontSize: "13px",
        color: "#aaaaaa",
        padding: "16px 0",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        width: "100%",
        marginTop: "32px"
      }}>
        Designed by Harsh Kumar Singh
      </div>
    </footer>
  );
};
