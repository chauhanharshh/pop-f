export interface Movie {
  id: number;
  title: string;
  genre: string;
  rating: number;
  year: number;
  director: string;
  cast: string[];
  overview: string;
  poster: string;
  backdrop: string;
}

export interface User {
  name: string;
  email: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
}
