import React, { useEffect, useState } from "react";
import "./SplashScreen.css";

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isTorn, setIsTorn] = useState(false);
  const [isExit, setIsExit] = useState(false);

  useEffect(() => {
    // 2.5s: Film strip splits / tears in middle
    const tearTimer = setTimeout(() => {
      setIsTorn(true);
    }, 2500);

    // 4.2s: Zoom out / fade to main app
    const exitTimer = setTimeout(() => {
      setIsExit(true);
    }, 4200);

    // 5.0s: Complete transitions
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 5000);

    return () => {
      clearTimeout(tearTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div 
      className={`splash-cinema-container ${isExit ? "exit-stage" : ""}`} 
      id="splash-cinema-root"
    >
      {/* Cinematic Starfield Background Layer */}
      <div className="starfield" id="splash-starfield-layer"></div>
      <div className="ambient-spotlight" id="splash-spotlight-layer"></div>

      <div className="splash-theater-wrapper">
        {/* Film Strip Split Layer */}
        <div className={`film-strip-layer ${isTorn ? "split-active" : ""}`}>
          {/* Left segment of film strip */}
          <div className="film-strip-half left-half">
            <div className="sprocket-holes top">
              <span></span><span></span><span></span><span></span><span></span><span></span>
            </div>
            <div className="film-frames">
              <div className="frame frame-1"></div>
              <div className="frame frame-2"></div>
            </div>
            <div className="sprocket-holes bottom">
              <span></span><span></span><span></span><span></span><span></span><span></span>
            </div>
          </div>

          {/* Right segment of film strip */}
          <div className="film-strip-half right-half">
            <div className="sprocket-holes top">
              <span></span><span></span><span></span><span></span><span></span><span></span>
            </div>
            <div className="film-frames">
              <div className="frame frame-3"></div>
              <div className="frame frame-4"></div>
            </div>
            <div className="sprocket-holes bottom">
              <span></span><span></span><span></span><span></span><span></span><span></span>
            </div>
          </div>
        </div>

        {/* Cinematic Logo reveal module */}
        <div className={`splash-cinema-logo-reveal ${isTorn ? "burst-revealed" : ""}`}>
          <h1 className="splash-cinema-logo">
            <span className="pop-text text-white">Pop</span>
            <span className="flix-text">Flix</span>
            {/* Elegant shimmer reflection line */}
            <span className="logo-shimmer"></span>
          </h1>
          
          {/* Tagline reveals slightly after the burst */}
          <p className="splash-cinema-tagline">
            Your Cinema. Your World.
          </p>
        </div>
      </div>
    </div>
  );
};
