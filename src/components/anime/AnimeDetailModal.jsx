import { useEffect } from 'react';
import { useAnimeDetail } from '../../hooks/useAnimeDetail';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const FORMAT_LABELS = {
  TV: 'TV',
  MOVIE: '영화',
  OVA: 'OVA',
  ONA: 'ONA',
  SPECIAL: '스페셜',
};

const STATUS_LABELS = {
  RELEASING: '방영중',
  FINISHED: '완결',
  NOT_YET_RELEASED: '방영 예정',
  CANCELLED: '취소',
  HIATUS: '휴재/휴방',
};

const containsHangul = (text = '') => /[가-힣]/.test(text);

function formatDescription(description) {
  if (!description) return '설명이 준비되지 않았어요.';
  return description
    .replace(/<br\s*\/?>(?=\n)?/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function formatLabel(format) {
  return FORMAT_LABELS[format] || format || '-';
}

function statusLabel(status) {
  return STATUS_LABELS[status] || status || '-';
}

function getDisplayTitle(media) {
  const title = media?.title || {};
  if (containsHangul(title.native)) return title.native;
  return title.english || title.romaji || title.native || '제목을 찾을 수 없어요';
}

function DetailRow({ label, value }) {
  return (
    <div className="detail-row">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function ScrollerSection({ title, children }) {
  return (
    <section className="scroller-section">
      <div className="scroller-section__head">
        <h4>{title}</h4>
      </div>
      <div className="scroller-section__items">{children}</div>
    </section>
  );
}

export default function AnimeDetailModal({ animeId, onClose, onSelectRelated }) {
  const { data: media, loading, error } = useAnimeDetail(animeId);

  const title = getDisplayTitle(media);
  const poster = media?.coverImage?.extraLarge || media?.coverImage?.large;
  const heroImage = media?.bannerImage;

  useEffect(() => {
    if (!animeId) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [animeId]);

  if (!animeId) return null;

  const infoChips = [
    formatLabel(media?.format),
    media?.seasonYear && `${media.seasonYear}년`,
    media?.episodes && `${media.episodes}화`,
    typeof media?.averageScore === 'number' && `평점 ${(media.averageScore / 10).toFixed(1)}`,
  ].filter(Boolean);

  const description = formatDescription(media?.description);

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={handleBackdropClick}>
      <div className="modal-card">
        <button type="button" className="modal-close" onClick={() => onClose?.()} aria-label="닫기">
          ×
        </button>

        {loading && (
          <div className="modal-body">
            <LoadingSpinner />
          </div>
        )}

        {error && !loading && (
          <div className="modal-body">
            <ErrorMessage message={error.message} />
          </div>
        )}

        {!loading && !error && media && (
          <>
            <div className="modal-hero">
              {heroImage ? <img src={heroImage} alt={title} /> : <div className="modal-hero__fallback" />}
              <div className="modal-hero__overlay" />
              <div className="modal-hero__text">
                <p className="eyebrow">AniLife 추천</p>
                <h2>{title}</h2>
                <div className="chip-row">
                  {infoChips.map((chip) => (
                    <span key={chip} className="chip">
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-content">
              <div className="modal-left">
                {poster ? <img src={poster} alt={title} /> : <div className="poster-fallback" />}
                <div className="chip-row wrap">
                  {media.genres?.map((genre) => (
                    <span key={genre} className="chip outline">
                      {genre}
                    </span>
                  ))}
                </div>
                <div className="detail-rows">
                  <DetailRow label="방영 상태" value={statusLabel(media.status)} />
                  <DetailRow label="제작 스튜디오" value={media.studios?.nodes?.[0]?.name || '-'} />
                  <DetailRow label="인기도" value={media.popularity?.toLocaleString('ko-KR') ?? '-'} />
                </div>
                {media.trailer?.id && media.trailer.site === 'youtube' && (
                  <a
                    href={`https://www.youtube.com/watch?v=${media.trailer.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="primary wide"
                  >
                    트레일러 보기
                  </a>
                )}
              </div>

              <div className="modal-right">
                <h3 className="section-title">작품 소개</h3>
                <p className="description">{description}</p>
              </div>
            </div>

            <div className="modal-scrollers">
              {media.recommendations?.nodes?.length > 0 && (
                <ScrollerSection title="비슷한 추천">
                  {media.recommendations.nodes.map((node) => {
                    const rec = node.mediaRecommendation;
                    if (!rec) return null;
                    const recTitle = getDisplayTitle(rec);
                    return (
                      <button key={rec.id} type="button" className="scroller-card" onClick={() => onSelectRelated?.(rec.id)}>
                        {rec.coverImage?.large && <img src={rec.coverImage.large} alt={recTitle} />}
                        <p className="scroller-card__title">{recTitle}</p>
                        <p className="scroller-card__meta">{formatLabel(rec.format)} · {rec.seasonYear || '-'}</p>
                      </button>
                    );
                  })}
                </ScrollerSection>
              )}

              {media.relations?.edges?.length > 0 && (
                <ScrollerSection title="관련 시리즈">
                  {media.relations.edges.map((edge) => {
                    const node = edge.node;
                    if (!node) return null;
                    const relTitle = getDisplayTitle(node);
                    return (
                      <button key={node.id} type="button" className="scroller-card" onClick={() => onSelectRelated?.(node.id)}>
                        {node.coverImage?.large && <img src={node.coverImage.large} alt={relTitle} />}
                        <p className="scroller-card__title">{relTitle}</p>
                        <p className="scroller-card__meta">{edge.relationType} · {node.seasonYear || '-'}</p>
                      </button>
                    );
                  })}
                </ScrollerSection>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
