// src/components/anime/AnimeCard.jsx
import { useTmdbImage } from '../../hooks/useTmdbImage';

export default function AnimeCard({ anime, onClick }) {
  const title = anime.title?.english || anime.title?.romaji || anime.title?.native;
  const { imageUrl } = useTmdbImage(title);
  const cover = imageUrl || anime.coverImage?.large;

  return (
    <button
      type="button"
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 text-left shadow transition hover:-translate-y-1 hover:border-emerald-400"
      onClick={() => onClick?.(anime)}
    >
      {cover && (
        <img
          src={cover}
          alt={title}
          className="h-56 w-full object-cover transition group-hover:scale-105"
        />
      )}
      <div className="flex flex-1 flex-col gap-2 p-3 text-sm text-slate-200">
        <h3 className="line-clamp-2 font-semibold text-white">{title}</h3>
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>{anime.format}</span>
          <span>{anime.seasonYear ?? '-'}</span>
        </div>
        <div className="text-xs text-emerald-300">평균 {anime.averageScore ?? '-'}점</div>
      </div>
    </button>
  );
}