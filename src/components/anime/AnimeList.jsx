import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import AnimeCard from './AnimeCard';

export default function AnimeList({ pageData, loading, error, onSelectAnime }) {
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;

  if (!pageData || !pageData.media?.length) {
    return (
      <div className="empty-state">
        조건에 맞는 작품이 없어요. 필터를 조정하거나 다른 검색어를 입력해 보세요.
      </div>
    );
  }

  return (
    <div className="titles-grid">
      {pageData.media.map((anime) => (
        <AnimeCard key={anime.id} anime={anime} onClick={onSelectAnime} />
      ))}
    </div>
  );
}
