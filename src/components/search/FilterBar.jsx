// src/components/search/FilterBar.jsx
const SORT_OPTIONS = [
  { value: 'POPULARITY', label: '인기 순' },
  { value: 'SCORE', label: '평점 순' },
  { value: 'TRENDING', label: '트렌드 순' },
  { value: 'LATEST', label: '최신 방영 순' },
  { value: 'HYBRID', label: '추천 (평점+인기)' },
];

const GENRES = [
  'Action',
  'Adventure',
  'Comedy',
  'Drama',
  'Fantasy',
  'Romance',
  'Sci-Fi',
  'Slice of Life',
  'Horror',
  'Mystery',
  'Sports',
];

const STATUS_OPTIONS = [
  { value: 'ANY', label: '전체' },
  { value: 'RELEASING', label: '방영 중' },
  { value: 'FINISHED', label: '완결' },
];

const FORMAT_OPTIONS = [
  { value: 'ANY', label: '전체' },
  { value: 'TV', label: 'TV' },
  { value: 'MOVIE', label: '영화' },
  { value: 'OVA', label: 'OVA' },
  { value: 'ONA', label: 'ONA' },
  { value: 'SPECIAL', label: '스페셜' },
];

const EPISODE_RANGE_OPTIONS = [
  { value: 'ANY', label: '전체' },
  { value: '1_12', label: '1 ~ 12화' },
  { value: '13_26', label: '13 ~ 26화' },
  { value: '27_99', label: '27 ~ 99화' },
  { value: '100_PLUS', label: '100화 이상' },
];

const SCORE_RANGE_OPTIONS = [
  { value: 'ANY', label: '전체' },
  { value: '60_100', label: '60점 이상' },
  { value: '70_100', label: '70점 이상' },
  { value: '80_100', label: '80점 이상' },
  { value: '90_100', label: '90점 이상' },
];

const SELECT_CLASS =
  'w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 focus:border-emerald-400 focus:outline-none';

export default function FilterBar({
  sortMode,
  onSortModeChange,
  genres,
  onGenresChange,
  status,
  onStatusChange,
  format,
  onFormatChange,
  episodeRange,
  onEpisodeRangeChange,
  scoreRange,
  onScoreRangeChange,
  recentYearsOnly,
  onRecentYearsOnlyChange,
  onResetFilters,
  onResetGenres,
}) {
  const toggleGenre = (genre) => {
    if (genres.includes(genre)) {
      onGenresChange(genres.filter((g) => g !== genre));
    } else {
      onGenresChange([...genres, genre]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <label className="text-sm text-slate-300">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">
            정렬 기준
          </span>
          <select
            value={sortMode}
            onChange={(e) => onSortModeChange(e.target.value)}
            className={SELECT_CLASS}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm text-slate-300">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">
            방영 상태
          </span>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className={SELECT_CLASS}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm text-slate-300">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">
            포맷
          </span>
          <select
            value={format}
            onChange={(e) => onFormatChange(e.target.value)}
            className={SELECT_CLASS}
          >
            {FORMAT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="text-sm text-slate-300">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">
            에피소드 수
          </span>
          <select
            value={episodeRange}
            onChange={(e) => onEpisodeRangeChange(e.target.value)}
            className={SELECT_CLASS}
          >
            {EPISODE_RANGE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm text-slate-300">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">
            평균 점수
          </span>
          <select
            value={scoreRange}
            onChange={(e) => onScoreRangeChange(e.target.value)}
            className={SELECT_CLASS}
          >
            {SCORE_RANGE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900/40 px-4 text-sm text-slate-200">
          <input
            type="checkbox"
            checked={recentYearsOnly}
            onChange={(e) => onRecentYearsOnlyChange(e.target.checked)}
            className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-emerald-400 focus:ring-emerald-500"
          />
          최근 3년 작품만 보기
        </label>
      </div>

      <div className="flex flex-wrap gap-2 text-xs text-slate-300">
        <button
          type="button"
          onClick={onResetFilters}
          className="rounded-full border border-slate-600 px-4 py-2 font-semibold text-slate-100 transition hover:border-emerald-400 hover:text-white"
        >
          필터 전체 초기화
        </button>
        <button
          type="button"
          onClick={onResetGenres}
          className="rounded-full border border-slate-600 px-4 py-2 font-semibold text-slate-100 transition hover:border-emerald-400 hover:text-white"
        >
          장르 전체 보기
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {GENRES.map((genre) => {
          const active = genres.includes(genre);
          return (
            <button
              key={genre}
              type="button"
              onClick={() => toggleGenre(genre)}
              className={`rounded-full border px-4 py-1 text-xs font-semibold transition ${
                active
                  ? 'border-emerald-300 bg-emerald-400/90 text-slate-900 shadow-lg shadow-emerald-500/30'
                  : 'border-slate-700 bg-slate-900/60 text-slate-200 hover:border-emerald-400'
              }`}
            >
              {genre}
            </button>
          );
        })}
      </div>
    </div>
  );
}