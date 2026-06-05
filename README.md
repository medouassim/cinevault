# 🎬 CineVault

A cinematic movie explorer built with React, TypeScript, and Tailwind CSS — powered by the TMDB API.

## Features

- 🔥 **Trending movies** — browse what's hot this week
- 🔍 **Live search** — debounced search as you type
- 🎭 **Genre filter** — filter by Action, Horror, Comedy, and more
- 🎞️ **Movie detail modal** — backdrop image, synopsis, runtime, rating, genres
- ▶️ **Watch Trailer** — links directly to YouTube
- 📄 **Pagination** — browse through pages of results
- 💀 **Skeleton loading** — smooth loading states

## Tech Stack

- React 18 + TypeScript
- Tailwind CSS v3
- Vite
- TMDB API

## Getting Started

1. **Clone the repo**
   ```bash
   git clone https://github.com/YOUR_USERNAME/cinevault.git
   cd cinevault
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Add your TMDB API key**

   Create a `.env` file in the root:
   ```
   VITE_TMDB_API_KEY=your_key_here
   ```
   Get a free key at [themoviedb.org](https://www.themoviedb.org/settings/api)

4. **Run locally**
   ```bash
   npm run dev
   ```

## Deploy to GitHub Pages

1. Push the repo to GitHub
2. Run `npm run build`
3. Deploy the `dist/` folder via GitHub Pages (set source to `gh-pages` branch)

Or use the `gh-pages` package:
```bash
npm install -D gh-pages
```

Add to `package.json` scripts:
```json
"deploy": "npm run build && gh-pages -d dist"
```

Then run `npm run deploy`.

---

Built by [Better Call Wassim](https://bettercallwsim.com) · Data from [TMDB](https://www.themoviedb.org)
