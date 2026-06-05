import { useEffect, useState } from "react";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

type Details = {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string | null;
  poster_path: string | null;
  release_date?: string;
  runtime?: number;
  vote_average?: number;
  genres?: { id: number; name: string }[];
};

export function MovieModal({ movieId, onClose }: { movieId: number; onClose: () => void }) {
  const [data, setData] = useState<Details | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [movieId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const trailerUrl = data
    ? `https://www.youtube.com/results?search_query=${encodeURIComponent(data.title + " trailer")}`
    : "#";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-amber-400 hover:text-black"
          aria-label="Close"
        >
          ✕
        </button>

        {loading || !data ? (
          <div className="flex h-96 items-center justify-center text-zinc-400">Loading…</div>
        ) : (
          <>
            <div className="relative h-64 w-full sm:h-80">
              {data.backdrop_path && (
                <img
                  src={`https://image.tmdb.org/t/p/original${data.backdrop_path}`}
                  alt=""
                  className="h-full w-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
            </div>

            <div className="-mt-20 px-6 pb-8 sm:px-10">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">{data.title}</h2>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-zinc-400">
                {data.release_date && <span>{data.release_date.slice(0, 4)}</span>}
                {data.runtime ? <span>• {data.runtime} min</span> : null}
                {data.vote_average ? (
                  <span className="flex items-center gap-1 text-amber-400">
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                      <path d="M10 1l2.6 6.3L19 8l-5 4.4L15.5 19 10 15.5 4.5 19 6 12.4 1 8l6.4-.7L10 1z" />
                    </svg>
                    {data.vote_average.toFixed(1)} / 10
                  </span>
                ) : null}
              </div>

              {data.genres && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {data.genres.map((g) => (
                    <span
                      key={g.id}
                      className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-300"
                    >
                      {g.name}
                    </span>
                  ))}
                </div>
              )}

              <p className="mt-5 leading-relaxed text-zinc-300">{data.overview || "No synopsis available."}</p>

              <a
                href={trailerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 font-semibold text-black transition hover:bg-amber-300 hover:shadow-[0_0_25px_-5px_rgba(251,191,36,0.7)]"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch Trailer
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
