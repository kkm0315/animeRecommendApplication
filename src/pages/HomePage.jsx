import { useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import AnimeSearchBar from '../components/search/AnimeSearchBar';
import FilterBar, { SORT_OPTIONS } from '../components/search/FilterBar';
import AnimeList from '../components/anime/AnimeList';
import AnimeDetailModal from '../components/anime/AnimeDetailModal';
import { useAniListSearch } from '../hooks/useAniListSearch';

const PAGE_SIZE = 24;

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortMode, setSortMode] = useState('POPULARITY');
  const [genres, setGenres] = useState([]);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('ANY');
  const [format, setFormat] = useState('ANY');
  const [episodeRange, setEpisodeRange] = useState('ANY');
  const [scoreRange, setScoreRange] = useState('ANY');
  const [recentYearsOnly, setRecentYearsOnly] = useState(false);
  const [selectedAnimeId, setSelectedAnimeId] = useState(null);

  const { data, loading, error } = useAniListSearch({
    searchTerm,
    sortMode,
    genres,
    page,
    perPage: PAGE_SIZE,
    status,
    format,
    episodeRange,
    scoreRange,
    recentYearsOnly,
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

  const handleGenresChange = (newGenres) => {
    setGenres(newGenres);
    setPage(1);
  };

  const handleStatusChange = (value) => {
    setStatus(value);
    setPage(1);
  };

  const handleFormatChange = (value) => {
    setFormat(value);
    setPage(1);
  };

  const handleEpisodeRangeChange = (value) => {
    setEpisodeRange(value);
    setPage(1);
  };

  const handleScoreRangeChange = (value) => {
    setScoreRange(value);
    setPage(1);
  };

  const handleRecentYearsOnlyChange = (checked) => {
    setRecentYearsOnly(checked);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSortMode('POPULARITY');
    setStatus('ANY');
    setFormat('ANY');
    setEpisodeRange('ANY');
    setScoreRange('ANY');
    setRecentYearsOnly(false);
    setGenres([]);
    setSearchTerm('');
    setPage(1);
  };

  const handleResetGenres = () => {
    setGenres([]);
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
          <aside className="filter-rail">
            <div className="filter-scroll">
              <FilterBar
                genres={genres}
                onGenresChange={handleGenresChange}
                status={status}
                onStatusChange={handleStatusChange}
                format={format}
                onFormatChange={handleFormatChange}
                episodeRange={episodeRange}
                onEpisodeRangeChange={handleEpisodeRangeChange}
                scoreRange={scoreRange}
                onScoreRangeChange={handleScoreRangeChange}
                recentYearsOnly={recentYearsOnly}
                onRecentYearsOnlyChange={handleRecentYearsOnlyChange}
                onResetFilters={handleResetFilters}
                onResetGenres={handleResetGenres}
              />
            </div>
          </aside>

          <section className="results-card">
            <div className="results-head">
              <div>
                <p className="eyebrow">검색 결과</p>
                <h3 className="results-title">{currentCount}개 작품</h3>
                <p className="hero-sub">필터 적용 상태를 좌측에서 확인하세요.</p>
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
                <button type="button" disabled={pageInfo.currentPage <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>
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
