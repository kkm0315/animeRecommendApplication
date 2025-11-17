// src/pages/HomePage.jsx
import { useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import AnimeSearchBar from '../components/search/AnimeSearchBar';
import FilterBar from '../components/search/FilterBar';
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
      <section className="space-y-8 py-10">
        <div className="rounded-[32px] border border-slate-800 bg-slate-900/40 p-6 shadow-2xl shadow-black/50 backdrop-blur">
          <div className="space-y-2 text-slate-200">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300/80">
              Search & Filter
            </p>
            <h2 className="text-2xl font-bold text-white">애니 검색 & 맞춤 필터</h2>
            <p className="text-sm text-slate-400">
              AniList 데이터로 애니를 검색하고 TMDB 이미지까지 확인하면서, 나만의 추천 리스트를 구성해 보세요.
            </p>
          </div>

          <div className="mt-6">
            <AnimeSearchBar initialValue={searchTerm} onSubmit={handleSearchSubmit} />
          </div>

          <div className="mt-8">
            <FilterBar
              sortMode={sortMode}
              onSortModeChange={handleSortModeChange}
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
        </div>

        <section className="rounded-[32px] border border-slate-800 bg-slate-900/40 p-6 shadow-inner shadow-black/50">
          <div className="flex flex-col gap-4 text-slate-200 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">검색 결과</h3>
              <p className="text-sm text-slate-400">AniList × TMDB 데이터 매칭 결과를 실시간으로 확인하세요.</p>
            </div>
            {pageInfo && (
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <button
                  disabled={pageInfo.currentPage <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-full border border-slate-600 px-3 py-1 transition disabled:opacity-40 hover:border-emerald-400"
                >
                  이전
                </button>
                <span>
                  {pageInfo.currentPage} / {pageInfo.lastPage}
                </span>
                <button
                  disabled={!pageInfo.hasNextPage}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-full border border-slate-600 px-3 py-1 transition disabled:opacity-40 hover:border-emerald-400"
                >
                  다음
                </button>
              </div>
            )}
          </div>

          <div className="mt-6">
            <AnimeList pageData={data} loading={loading} error={error} onSelectAnime={handleSelectAnime} />
          </div>

          {pageInfo && (
            <div className="mt-8 flex justify-center gap-4 text-sm text-slate-300">
              <button
                disabled={pageInfo.currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-full border border-slate-600 px-4 py-2 transition disabled:opacity-40 hover:border-emerald-400"
              >
                이전 페이지
              </button>
              <button
                disabled={!pageInfo.hasNextPage}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-full border border-slate-600 px-4 py-2 transition disabled:opacity-40 hover:border-emerald-400"
              >
                다음 페이지
              </button>
            </div>
          )}
        </section>
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