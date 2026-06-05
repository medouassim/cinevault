type Genre = { id: number; name: string };

export function GenreFilter({
  genres,
  selected,
  onSelect,
}: {
  genres: Genre[];
  selected: number | null;
  onSelect: (id: number | null) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
          selected === null
            ? "bg-amber-400 text-black"
            : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
        }`}
      >
        All
      </button>
      {genres.map((g) => (
        <button
          key={g.id}
          onClick={() => onSelect(g.id)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
            selected === g.id
              ? "bg-amber-400 text-black"
              : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
          }`}
        >
          {g.name}
        </button>
      ))}
    </div>
  );
}

export type { Genre };
