type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date?: string;
  vote_average?: number;
};

export function MovieCard({ movie, onClick }: { movie: Movie; onClick: () => void }) {
  const year = movie.release_date ? movie.release_date.slice(0, 4) : "—";
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";
  const img = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750/111/444?text=No+Image";

  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-lg bg-zinc-900 text-left transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_30px_-5px_rgba(251,191,36,0.5)]"
    >
      <div className="aspect-[2/3] overflow-hidden">
        <img
          src={img}
          alt={movie.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="p-3">
        <h3 className="line-clamp-1 font-semibold text-zinc-100">{movie.title}</h3>
        <div className="mt-1 flex items-center justify-between text-sm text-zinc-400">
          <span>{year}</span>
          <span className="flex items-center gap-1 text-amber-400">
            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
              <path d="M10 1l2.6 6.3L19 8l-5 4.4L15.5 19 10 15.5 4.5 19 6 12.4 1 8l6.4-.7L10 1z" />
            </svg>
            {rating}
          </span>
        </div>
      </div>
    </button>
  );
}

export type { Movie };
