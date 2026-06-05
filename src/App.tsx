import { useEffect, useState, useCallback, useRef } from "react";
import { MovieCard } from "./components/MovieCard";
import type { Movie } from "./components/MovieCard";
import { MovieModal } from "./components/MovieModal";
import { SearchBar } from "./components/SearchBar";
import { GenreFilter } from "./components/GenreFilter";
import type { Genre } from "./components/GenreFilter";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE = "https://api.themoviedb.org/3";

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function SkeletonCard() {
  return (
    <div className="rounded-xl bg-card border border-border overflow-hidden">
      <div className="aspect-[2/3] bg-surface animate-shimmer" />
      <div className="p-3 space-y-2">
        <div className="h-3.5 bg-surface rounded animate-shimmer w-3/4" />
        <div className="h-3 bg-surface rounded animate-shimmer w-1/2" />
      </div>
    </div>
  );
}

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [query, setQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const debouncedQuery = useDebounce(query, 500);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`${BASE}/genre/movie/list?api_key=${API_KEY}`)
      .then((r) => r.json())
      .then((d) => setGenres(d.genres || []));
  }, []);

  const fetchMovies = useCallback(async (q: string, genre: number | null, p: number) => {
    setLoading(true);
    let url = "";
    if (q.trim()) {
      url = `${BASE}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(q)}&page=${p}`;
    } else if (genre) {
      url = `${BASE}/discover/movie?api_key=${API_KEY}&with_genres=${genre}&sort_by=popularity.desc&page=${p}`;
    } else {
      url = `${BASE}/trending/movie/week?api_key=${API_KEY}&page=${p}`;
    }
    const res = await fetch(url);
    const data = await res.json();
    setMovies(data.results || []);
    setTotalPages(Math.min(data.total_pages || 1, 20));
    setLoading(false);
  }, []);

  useEffect(() => { setPage(1); }, [debouncedQuery, selectedGenre]);

  useEffect(() => {
    fetchMovies(debouncedQuery, selectedGenre, page);
  }, [debouncedQuery, selectedGenre, page, fetchMovies]);

  const changePage = (newPage: number) => {
    setPage(newPage);
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const heading = debouncedQuery
    ? `Results for "${debouncedQuery}"`
    : selectedGenre
    ? genres.find((g) => g.id === selectedGenre)?.name ?? "Movies"
    : "Trending This Week";

  return (
    <div className="min-h-screen bg-void text-white" ref={topRef}>
      <header className="sticky top-0 z-40 border-b border-border bg-void/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-6">
          <a href="/">
            <h1 className="font-display text-3xl tracking-widest text-gold leading-none">
              CINE<span className="text-white">VAULT</span>
            </h1>
          </a>
          <div className="flex-1 flex justify-center">
            <SearchBar value={query} onChange={setQuery} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <GenreFilter genres={genres} selected={selectedGenre} onSelect={setSelectedGenre} />

        <div className="flex items-baseline gap-3">
          <h2 className="font-display text-2xl tracking-wider text-white">{heading}</h2>
          {!loading && <span className="text-sm text-zinc-500">{movies.length} titles</span>}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 20 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : movies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-zinc-500">
            <svg className="w-16 h-16 mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
            </svg>
            <p className="text-lg">No movies found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {movies.map((m, i) => (
              <div key={m.id} style={{ animationDelay: `${i * 30}ms` }} className="animate-fade-up opacity-0 [animation-fill-mode:forwards]">
                <MovieCard movie={m} onClick={() => setSelectedId(m.id)} />
              </div>
            ))}
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <button onClick={() => changePage(page - 1)} disabled={page === 1}
              className="px-4 py-2 rounded-full border border-border text-sm text-zinc-400 hover:border-gold hover:text-gold disabled:opacity-30 disabled:cursor-not-allowed transition">
              ← Prev
            </button>
            <span className="px-4 py-2 text-sm text-zinc-400">
              Page <span className="text-white font-medium">{page}</span> of {totalPages}
            </span>
            <button onClick={() => changePage(page + 1)} disabled={page === totalPages}
              className="px-4 py-2 rounded-full border border-border text-sm text-zinc-400 hover:border-gold hover:text-gold disabled:opacity-30 disabled:cursor-not-allowed transition">
              Next →
            </button>
          </div>
        )}
      </main>

      <footer className="border-t border-border mt-12 py-6 text-center text-xs text-zinc-600">
        Built by <span className="text-gold">Better Call Wassim</span> · Powered by TMDB
      </footer>

      {selectedId && <MovieModal movieId={selectedId} onClose={() => setSelectedId(null)} />}
    </div>
  );
}
