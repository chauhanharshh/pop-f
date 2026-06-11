import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../types";
import API from "../services/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthOpen: boolean;
  authMode: "login" | "signup";
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setAuthOpen: (open: boolean) => void;
  setAuthMode: (mode: "login" | "signup") => void;
  setError: (error: string | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  watchlist: number[];
  addToWatchlist: (movieId: number) => void;
  removeFromWatchlist: (movieId: number) => void;
  toggleWatchlist: (movieId: number) => void;
  isInWatchlist: (movieId: number) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Authentication Popup Overlay State
  const [isAuthOpen, setAuthOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  // Global Search Bar Query State
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Load auth state from localStorage on init
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await API.post("/auth/login", { email, password });
      const { token: receivedToken, user: receivedUser } = response.data;
      
      localStorage.setItem("token", receivedToken);
      localStorage.setItem("user", JSON.stringify(receivedUser));
      localStorage.setItem("saved_password", password);
      
      setToken(receivedToken);
      setUser(receivedUser);
      setAuthOpen(false); // Close auth popup on success
      return true;
    } catch (err: any) {
      const msg = err.response?.data?.error || "Invalid credentials. Please try again.";
      setError(msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await API.post("/auth/register", { name, email, password });
      const { token: receivedToken, user: receivedUser } = response.data;

      localStorage.setItem("token", receivedToken);
      localStorage.setItem("user", JSON.stringify(receivedUser));
      localStorage.setItem("saved_password", password);

      setToken(receivedToken);
      setUser(receivedUser);
      setAuthOpen(false); // Close auth popup on success
      return true;
    } catch (err: any) {
      const msg = err.response?.data?.error || "Registration failed. Try a different email.";
      setError(msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("saved_password");
    setToken(null);
    setUser(null);
  };

  const [watchlist, setWatchlist] = useState<number[]>([]);

  // Load watchlist from localStorage whenever the active user changes
  useEffect(() => {
    const key = user ? `watchlist_${user.email}` : "watchlist_guest";
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        setWatchlist(JSON.parse(saved));
      } catch (e) {
        setWatchlist([]);
      }
    } else {
      setWatchlist([]);
    }
  }, [user]);

  const saveWatchlist = (updated: number[]) => {
    setWatchlist(updated);
    const key = user ? `watchlist_${user.email}` : "watchlist_guest";
    localStorage.setItem(key, JSON.stringify(updated));
  };

  const addToWatchlist = (movieId: number) => {
    if (!user) {
      setAuthMode("login");
      setAuthOpen(true);
      return;
    }
    const cleanId = movieId > 100 ? movieId - 100 : movieId;
    if (!watchlist.includes(cleanId)) {
      const updated = [...watchlist, cleanId];
      saveWatchlist(updated);
    }
  };

  const removeFromWatchlist = (movieId: number) => {
    const cleanId = movieId > 100 ? movieId - 100 : movieId;
    const updated = watchlist.filter((id) => id !== cleanId);
    saveWatchlist(updated);
  };

  const toggleWatchlist = (movieId: number) => {
    if (!user) {
      setAuthMode("login");
      setAuthOpen(true);
      return;
    }
    const cleanId = movieId > 100 ? movieId - 100 : movieId;
    if (watchlist.includes(cleanId)) {
      removeFromWatchlist(cleanId);
    } else {
      addToWatchlist(cleanId);
    }
  };

  const isInWatchlist = (movieId: number): boolean => {
    const cleanId = movieId > 100 ? movieId - 100 : movieId;
    return watchlist.includes(cleanId);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        error,
        isAuthOpen,
        authMode,
        searchQuery,
        setSearchQuery,
        setAuthOpen,
        setAuthMode,
        setError,
        login,
        signup,
        logout,
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        toggleWatchlist,
        isInWatchlist,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
