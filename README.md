# PopFlix Movie Database App 🍿

Welcome to **PopFlix**, a fully responsive, interactive, and premium movie catalog application. This project was developed to showcase an aesthetically pleasing frontend connected to a robust backend API.

## 🚀 Features

- **Responsive Design**: Flawlessly adapts to all screen sizes—from large desktop monitors to tablets and mobile devices.
- **Premium Aesthetics**: Features a sleek dark mode theme, curated "gold" accents, and modern typography.
- **Interactive UI**: Includes a fully interactive horizontal scrolling genre explorer, dynamic movie grids, and a beautifully animated collapsible side drawer (hamburger menu) for mobile users.
- **User Authentication**: Secure user login and registration flows built-in.
- **Movie Details & Filtering**: Search for movies, filter by genre, and view a curated "Top 3" billboard section.
- **My Watchlist**: Logged-in users can add movies to their personal watchlist.

## 🛠️ Tech Stack

**Frontend**
- React 18
- Vite
- TypeScript
- CSS3 (Vanilla CSS for customized premium styling)
- Lucide React (for sleek iconography)

**Backend**
- Python 3
- Flask (REST API)

## ⚙️ Setup and Installation

### 1. Backend Setup
The backend serves the movie data and handles authentication endpoints.

```bash
cd popflix-backend
# Install dependencies (if you have a requirements.txt, or just standard libraries if used)
pip install flask flask-cors
# Run the Flask server (runs on port 5000 by default)
python server.py
```

### 2. Frontend Setup
Ensure you have Node.js installed.

```bash
cd popflix-frontend
# Install NPM dependencies
npm install
# Start the Vite development server
npm run dev
```

The frontend will start on your local host (usually `http://localhost:5173`).

## 💡 Key Design Highlights
- **Collapsible Architecture**: The `Explore by Genre` section intelligently switches between a horizontal scroll view (collapsed) and a full auto-fill grid (expanded).
- **Mobile Drawer**: A custom animated hamburger menu that includes an accordion-style collapsible Profile pane.
- **Scroll Effects**: Transparent navbar that gains a solid backdrop upon scrolling for enhanced readability.

---
*Developed by Harsh Kumar Singh (idealoft studios)*
