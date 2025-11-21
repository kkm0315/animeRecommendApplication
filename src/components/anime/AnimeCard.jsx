import { useMemo } from 'react';

const FORMAT_LABELS = {
  TV: 'TV',
  MOVIE: '영화',
  OVA: 'OVA',
  ONA: 'ONA',
  SPECIAL: '스페셜',
};

const containsHangul = (text = '') => /[가-힣]/.test(text);

function getFormatLabel(format) {
  return FORMAT_LABELS[format] || format || '';
}

function getDisplayTitle(anime) {
  const title = anime?.title || {};
  if (containsHangul(title.native)) return title.native;
  return title.english || title.romaji || title.native || '제목을 찾을 수 없어요';
}

export default function AnimeCard({ anime, onClick }) {
  const title = getDisplayTitle(anime);
  const cover = anime.coverImage?.extraLarge || anime.coverImage?.large;

  const scoreText = useMemo(
    () => (typeof anime.averageScore === 'number' ? `★ ${(anime.averageScore / 10).toFixed(1)}` : ''),
    [anime.averageScore],
  );
  const episodesText = useMemo(() => (anime.episodes ? `${anime.episodes}화` : ''), [anime.episodes]);
  const formatText = useMemo(() => getFormatLabel(anime.format), [anime.format]);

  const hasMeta = episodesText || scoreText;

  const handleClick = () => {
    if (!anime?.id) return;
    onClick?.(anime);
  };

  return (
    <article className="anime-card" role="button" tabIndex={0} onClick={handleClick} onKeyDown={(e) => e.key === 'Enter' && handleClick()}>
      <div className="anime-cover">
        {cover ? <img src={cover} alt={title} /> : <div className="anime-cover__fallback">이미지를 불러올 수 없어요</div>}
        <div className="anime-cover__overlay" />

        {formatText && <div className="anime-badge format">{formatText}</div>}

        {hasMeta && (
          <div className="anime-meta">
            <span className="anime-meta__left">{episodesText}</span>
            <span className="anime-meta__right">{scoreText}</span>
          </div>
        )}
      </div>

      <div className="anime-title" title={title}>
        {title}
      </div>
    </article>
  );
}
