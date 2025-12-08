import AnimeCard from './AnimeCard';

export default function AnimeList({ pageData, loading, error, onSelectAnime, favoriteIds, onToggleFavorite, isLoggedIn }) {
  if (loading) return <div className="empty-state">불러오는 중...</div>;

  if (error) {
    return (
      <div className="empty-state">
        데이터를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
      </div>
    );
  }

  if (!pageData || !pageData.media?.length) {
    return (
      <div className="empty-state">
        조건에 맞는 작품이 없어요. 검색어를 바꿔보세요.
      </div>
    );
  }

  const isFavorite = (id) => favoriteIds?.has(id);

  return (
    <div className="titles-grid">
      {pageData.media.map((anime) => (
        <AnimeCard
          key={anime.id}
          anime={anime}
          onClick={onSelectAnime}
          isFavorite={isFavorite(anime.id)}
          onToggleFavorite={onToggleFavorite}
          isLoggedIn={isLoggedIn}
        />
      ))}
    </div>
  );
}
