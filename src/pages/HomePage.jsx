import { useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import AnimeSearchBar from '../components/search/AnimeSearchBar';
import AnimeList from '../components/anime/AnimeList';
import AnimeDetailModal from '../components/anime/AnimeDetailModal';
import { useAniListSearch } from '../hooks/useAniListSearch';

const PAGE_SIZE = 28;

const SORT_OPTIONS = [
  { value: 'POPULARITY', label: '인기 순' },
  { value: 'SCORE', label: '평점 순' },
  { value: 'HYBRID', label: '추천 (평점+인기)' },
];

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortMode, setSortMode] = useState('POPULARITY');
  const [page, setPage] = useState(1);
  const [selectedAnimeId, setSelectedAnimeId] = useState(null);

  const { data, loading, error } = useAniListSearch({
    searchTerm,
    sortMode,
    page,
    perPage: PAGE_SIZE,
  });

  const pageInfo = data?.pageInfo;
  const currentCount = data?.media?.length ?? 0;

  const handleSearchSubmit = (value = '') => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleSortModeChange = (value) => {
    setSortMode(value);
    setPage(1);
  };

  const handleSelectAnime = (anime) => {
    setSelectedAnimeId(anime.id);
  };

  return (
    <AppLayout>
      <section className="page-section">
        <header className="hero-card hero-compact">
          <AnimeSearchBar initialValue={searchTerm} onSubmit={handleSearchSubmit} />
        </header>

        <div className="layout-grid">
          <section className="results-card">
            <div className="results-head">
              <div>
                <p className="eyebrow">검색 결과</p>
                <h3 className="results-title">{currentCount}개 작품</h3>
                <p className="hero-sub">검색어나 정렬을 조정해 원하는 작품을 찾아보세요.</p>
              </div>
              <div className="sort-control">
                <span>정렬</span>
                <select value={sortMode} onChange={(event) => handleSortModeChange(event.target.value)}>
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <AnimeList pageData={data} loading={loading} error={error} onSelectAnime={handleSelectAnime} />

            {pageInfo && (
              <div className="pager">
                <button
                  type="button"
                  disabled={pageInfo.currentPage <= 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                  이전 페이지
                </button>
                <span>
                  {pageInfo.currentPage} / {pageInfo.lastPage ?? '?'}
                </span>
                <button type="button" disabled={!pageInfo.hasNextPage} onClick={() => setPage((current) => current + 1)}>
                  다음 페이지
                </button>
              </div>
            )}
          </section>
        </div>
      </section>

      {selectedAnimeId && (
        <AnimeDetailModal
          animeId={selectedAnimeId}
          onClose={() => setSelectedAnimeId(null)}
          onSelectRelated={(id) => setSelectedAnimeId(id)}
        />
      )}
    </AppLayout>
  );
}
