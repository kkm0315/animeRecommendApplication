// src/components/anime/AnimeList.jsx
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import AnimeCard from './AnimeCard';

export default function AnimeList({ pageData, loading, error, onSelectAnime }) {
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;

  if (!pageData || !pageData.media?.length) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center text-sm text-slate-400">
        검색 조건에 맞는 작품이 없습니다. 필터를 조정하거나 초기화 버튼으로 전체 목록을 다시 확인해 보세요.
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(160px,1fr))]">
      {pageData.media.map((anime) => (
        <AnimeCard key={anime.id} anime={anime} onClick={onSelectAnime} />
      ))}
    </div>
  );
}