import { useMemo } from 'react';
import { useTmdbImage } from '../../hooks/useTmdbImage';

function getDisplayTitle(anime) {
  return anime.title?.native || anime.title?.english || anime.title?.romaji || '제목 정보 없음';
}

export default function AnimeCard({ anime, onClick }) {
  const title = getDisplayTitle(anime);
  const { imageUrl } = useTmdbImage({
    title,
    seasonYear: anime.seasonYear,
    altTitles: [anime.title?.romaji, anime.title?.native].filter(Boolean),
  });
  const cover = imageUrl || anime.coverImage?.large;

  const chips = useMemo(() => {
    const values = [];
    if (anime.episodes) values.push(`${anime.episodes}화`);
    if (typeof anime.averageScore === 'number') values.push(`⭐ ${(anime.averageScore / 10).toFixed(1)}`);
    if (anime.seasonYear) values.push(`${anime.seasonYear}`);
    return values;
  }, [anime.episodes, anime.averageScore, anime.seasonYear]);

  const badges = useMemo(() => {
    const values = [];
    if (anime.format) values.push(anime.format);
    if (anime.status) values.push(anime.status === 'RELEASING' ? '방영중' : '완결');
    return values;
  }, [anime.format, anime.status]);

  const handleClick = () => {
    if (!anime?.id) return;
    onClick?.(anime);
  };

  return (
    <article className="anime-card" role="button" tabIndex={0} onClick={handleClick} onKeyDown={(e) => e.key === 'Enter' && handleClick()}>
      <div className="anime-cover">
        {cover ? <img src={cover} alt={title} /> : <div className="anime-cover__fallback">이미지를 불러올 수 없어요</div>}
        <div className="anime-cover__overlay" />

        {badges.length > 0 && (
          <div className="anime-badges">
            {badges.map((badge) => (
              <span key={badge}>{badge}</span>
            ))}
          </div>
        )}

        {chips.length > 0 && (
          <div className="anime-chips">
            {chips.map((chip) => (
              <span key={chip}>{chip}</span>
            ))}
          </div>
        )}
      </div>

      <div className="anime-title" title={title}>
        {title}
      </div>
    </article>
  );
}
