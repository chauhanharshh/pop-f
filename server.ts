import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory Database for Movies
const movies = [
  {
    id: 1,
    title: "Inception",
    genre: "Sci-Fi",
    rating: 8.8,
    year: 2010,
    director: "Christopher Nolan",
    cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"],
    overview: "A thief who steals corporate secrets through dream-sharing technology.",
    poster: "https://image.tmdb.org/t/p/w500/9gk769EPPEgHj68LL6g778S6gA5.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/s3TTE7m1Ja609vPrdfSIdTeOI6T.jpg"
  },
  {
    id: 2,
    title: "Interstellar",
    genre: "Sci-Fi",
    rating: 8.6,
    year: 2014,
    director: "Christopher Nolan",
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
    overview: "A team of explorers travel through a wormhole in space to ensure humanity's survival.",
    poster: "https://image.tmdb.org/t/p/w500/gEU2Qv6GXZ7uYBS6p9v2laS6as5.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/xJH0YSyZMAvIIYnyg89v07L6gSg.jpg"
  },
  {
    id: 3,
    title: "The Dark Knight",
    genre: "Action",
    rating: 9.0,
    year: 2008,
    director: "Christopher Nolan",
    cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
    overview: "Batman faces the Joker, a criminal mastermind who wants to plunge Gotham City into anarchy.",
    poster: "https://image.tmdb.org/t/p/w500/qJ2tW69gGs31CiaSHgXZg6ty66v.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/oXxE6vJUatIK9wcn7i9U669Anj0.jpg"
  },
  {
    id: 4,
    title: "Joker",
    genre: "Drama",
    rating: 8.4,
    year: 2019,
    director: "Todd Phillips",
    cast: ["Joaquin Phoenix", "Robert De Niro"],
    overview: "Origin story of the iconic Batman villain, showing how a mentally troubled comedian descends into madness.",
    poster: "https://image.tmdb.org/t/p/w500/udDclJoH0Gkrj86tb6asIRS6Bo1.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/f5F4cRhwY3v0mVk7ST9hUun9Hwo.jpg"
  },
  {
    id: 5,
    title: "Parasite",
    genre: "Thriller",
    rating: 8.5,
    year: 2019,
    director: "Bong Joon-ho",
    cast: ["Song Kang-ho", "Lee Sun-kyun"],
    overview: "A poor family schemes to become employed by a wealthy family by infiltrating their household.",
    poster: "https://image.tmdb.org/t/p/w500/7ii67ZeR7g7vI7jj04gQ6g6gcn8.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/7ryCH06Zwwby7gA6clY6CcgStp8.jpg"
  },
  {
    id: 6,
    title: "Avengers: Endgame",
    genre: "Action",
    rating: 8.4,
    year: 2019,
    director: "Russo Brothers",
    cast: ["Robert Downey Jr.", "Chris Evans", "Scarlett Johansson"],
    overview: "The Avengers assemble to reverse Thanos's actions and restore balance to the universe.",
    poster: "https://image.tmdb.org/t/p/w500/or06216LwUyg773kLLAtb6aSAS5.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/7Ry6u66a6BsyWvYvawU7Sj8v9H3.jpg"
  },
  {
    id: 7,
    title: "Dune",
    genre: "Sci-Fi",
    rating: 8.0,
    year: 2021,
    director: "Denis Villeneuve",
    cast: ["Timothée Chalamet", "Zendaya", "Oscar Isaac"],
    overview: "A noble family becomes embroiled in a war for a dangerous desert planet holding the universe's most valuable substance.",
    poster: "https://image.tmdb.org/t/p/w500/d5icoxGaN08gW7V7568606gAnf6.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/lz679K7OFbI6BCO6I_Mv8A68e5.jpg"
  },
  {
    id: 8,
    title: "Oppenheimer",
    genre: "Drama",
    rating: 8.9,
    year: 2023,
    director: "Christopher Nolan",
    cast: ["Cillian Murphy", "Emily Blunt", "Robert Downey Jr."],
    overview: "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II.",
    poster: "https://image.tmdb.org/t/p/w500/8GWpY6S6bU89eyp6GXZ7uYBS6pa.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/fm6mFv7SYu62jGg86ZZ3679X37Y.jpg"
  },
  {
    id: 9,
    title: "The Grand Budapest Hotel",
    genre: "Comedy",
    rating: 8.1,
    year: 2014,
    director: "Wes Anderson",
    cast: ["Ralph Fiennes", "Tony Revolori", "Saoirse Ronan"],
    overview: "A writer relates his adventures at a renowned European resort hotel between the first and second World Wars.",
    poster: "https://image.tmdb.org/t/p/w500/7p08bY88W6v7Xg96Ch9vPrdfSId.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/m9m5v6p7W6r9vWvXWvaC6gStp8e.jpg"
  },
  {
    id: 10,
    title: "Barbie",
    genre: "Comedy",
    rating: 7.2,
    year: 2023,
    director: "Greta Gerwig",
    cast: ["Margot Robbie", "Ryan Gosling", "America Ferrera"],
    overview: "Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land.",
    poster: "https://image.tmdb.org/t/p/w500/iu9uY6Spq9vXWv6v8pWvA9S8e5.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/ctM6mFv7SZ62jGg86ZZ3679X37Y.jpg"
  }
];

// In-Memory Database for Users
const users = [
  {
    id: 1,
    name: "Demo User",
    email: "demo@popflix.com",
    password: "password123"
  }
];

// Custom Middleware to simulate slow network if needed (optional)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// API Routes
app.get("/api/movies", (req, res) => {
  res.json(movies);
});

app.get("/api/movies/:id", (req, res) => {
  const testId = parseInt(req.params.id);
  const found = movies.find(m => m.id === testId);
  if (found) {
    res.json(found);
  } else {
    res.status(404).json({ error: "Movie not found" });
  }
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  const token = `jwt-token-${user.id}-${Date.now()}`;
  res.json({
    token,
    user: {
      name: user.name,
      email: user.email
    }
  });
});

app.post("/api/auth/register", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email and password are required" });
  }
  const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return res.status(400).json({ error: "Email is already registered" });
  }
  const newUser = {
    id: users.length + 1,
    name,
    email,
    password
  };
  users.push(newUser);
  const token = `jwt-token-${newUser.id}-${Date.now()}`;
  res.json({
    token,
    user: {
      name: newUser.name,
      email: newUser.email
    }
  });
});

async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

start();
