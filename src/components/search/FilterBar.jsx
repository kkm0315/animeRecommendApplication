export const SORT_OPTIONS = [
  { value: 'POPULARITY', label: '인기 순' },
  { value: 'SCORE', label: '평점 순' },
  { value: 'TRENDING', label: '트렌드' },
  { value: 'LATEST', label: '최신 방영' },
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
  { value: 'RELEASING', label: '방영중' },
  { value: 'FINISHED', label: '완결' },
];

const FORMAT_OPTIONS = [
  { value: 'ANY', label: '전체' },
  { value: 'TV', label: 'TV' },
  { value: 'MOVIE', label: '극장판' },
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

function OptionCheckbox({ label, checked, onChange }) {
  return (
    <label className={`filter-option ${checked ? 'is-active' : ''}`}>
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
    </label>
  );
}

function Section({ title, actionLabel, onAction, children }) {
  return (
    <section className="filter-section">
      <div className="filter-section__head">
        <p>{title}</p>
        {actionLabel && (
          <button type="button" className="link" onClick={onAction}>
            {actionLabel}
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

function SingleSelectList({ options, value, onChange }) {
  return (
    <div className="filter-list">
      {options.map((option) => (
        <OptionCheckbox
          key={option.value}
          label={option.label}
          checked={value === option.value}
          onChange={() => onChange(value === option.value ? 'ANY' : option.value)}
        />
      ))}
    </div>
  );
}

export default function FilterBar({
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
    <div className="filter-panel">
      <div className="filter-panel__head">
        <h2>필터</h2>
        <button type="button" className="link" onClick={onResetFilters}>
          필터 초기화
        </button>
      </div>

      <Section title="장르" actionLabel="전체 해제" onAction={onResetGenres}>
        <div className="filter-list">
          {GENRES.map((genre) => (
            <OptionCheckbox key={genre} label={genre} checked={genres.includes(genre)} onChange={() => toggleGenre(genre)} />
          ))}
        </div>
      </Section>

      <Section title="방영 상태">
        <SingleSelectList options={STATUS_OPTIONS} value={status} onChange={onStatusChange} />
      </Section>

      <Section title="포맷">
        <SingleSelectList options={FORMAT_OPTIONS} value={format} onChange={onFormatChange} />
      </Section>

      <Section title="에피소드 수">
        <SingleSelectList options={EPISODE_RANGE_OPTIONS} value={episodeRange} onChange={onEpisodeRangeChange} />
      </Section>

      <Section title="평균 점수">
        <SingleSelectList options={SCORE_RANGE_OPTIONS} value={scoreRange} onChange={onScoreRangeChange} />
      </Section>

      <label className="filter-option toggle">
        <div>
          <p className="toggle__title">최근 3년 작품만 보기</p>
          <p className="toggle__subtitle">가장 최근작만 빠르게 보고 싶을 때</p>
        </div>
        <input type="checkbox" checked={recentYearsOnly} onChange={(event) => onRecentYearsOnlyChange(event.target.checked)} />
      </label>
    </div>
  );
}
