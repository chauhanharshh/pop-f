import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import { MovieDetail } from "./pages/MovieDetail";
import { Watchlist } from "./pages/Watchlist";
import { AuthModal } from "./components/AuthModal";
import { Footer } from "./components/Footer";
import { SplashScreen } from "./components/SplashScreen";

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <AuthProvider>
      {loading ? (
        <SplashScreen onComplete={() => setLoading(false)} />
      ) : (
        <BrowserRouter>
          <div 
            style={{ 
              display: "flex", 
              flexDirection: "column", 
              minHeight: "100vh", 
              backgroundColor: "var(--bg-primary)" 
            }}
            id="app-root-layout"
            className="app-fade-entrance"
          >
            {/* Header navigation bar */}
            <Navbar />

            {/* Active router panel container */}
            <div style={{ flex: 1 }} id="app-router-panel">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/movie/:id" element={<MovieDetail />} />
                <Route path="/watchlist" element={<Watchlist />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>

            {/* Overlaid login popup modal */}
            <AuthModal />

            {/* Bottom structural footer */}
            <Footer />
          </div>
        </BrowserRouter>
      )}
    </AuthProvider>
  );
}
