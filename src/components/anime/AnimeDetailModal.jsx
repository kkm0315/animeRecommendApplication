// src/components/anime/AnimeDetailModal.jsx
import { useAnimeDetail } from '../../hooks/useAnimeDetail';
import { useTmdbImage } from '../../hooks/useTmdbImage';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

export default function AnimeDetailModal({
  animeId,
  onClose,
  onSelectRelated,
}) {
  const { data: media, loading, error } = useAnimeDetail(animeId);

  const title =
    media?.title?.english ||
    media?.title?.romaji ||
    media?.title?.native;

  const { backdropUrl } = useTmdbImage(title);

  if (!animeId) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white max-w-5xl w-full max-h-[90vh] overflow-y-auto rounded-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-2xl text-gray-200 hover:text-white z-10"
          aria-label="닫기"
        >
          ×
        </button>

        {/* 상단 배경 (TMDB backdrop 또는 AniList bannerImage) */}
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          {backdropUrl || media?.bannerImage ? (
            <img
              src={backdropUrl || media.bannerImage}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent" />
          <div className="absolute bottom-3 left-4 text-white">
            <h2 className="text-xl font-semibold mb-1">{title}</h2>
            <div className="text-xs opacity-90 flex flex-wrap gap-2">
              <span>{media?.format}</span>
              <span>{media?.seasonYear}</span>
              <span>{media?.status}</span>
            </div>
          </div>
        </div>

        {/* 로딩/에러 */}
        {loading && <LoadingSpinner />}
        {error && <ErrorMessage message={error.message} />}

        {media && !loading && !error && (
          <>
            {/* 본문 정보 */}
            <div className="p-4 grid gap-4 md:grid-cols-[180px,1fr]">
              <div className="flex flex-col gap-3">
                {media.coverImage?.large && (
                  <img
                    src={media.coverImage.large}
                    alt={title}
                    className="w-full rounded-md border"
                  />
                )}
                <div className="text-sm text-gray-700 space-y-1">
                  <p>
                    <span className="font-semibold">에피소드:</span>{' '}
                    {media.episodes || '-'}
                  </p>
                  <p>
                    <span className="font-semibold">평점:</span>{' '}
                    {media.averageScore ?? '-'} / 100
                  </p>
                  <p>
                    <span className="font-semibold">인기도:</span>{' '}
                    {media.popularity ?? '-'}
                  </p>
                  <p>
                    <span className="font-semibold">장르:</span>{' '}
                    {media.genres?.join(', ') || '-'}
                  </p>
                  <p>
                    <span className="font-semibold">메인 스튜디오:</span>{' '}
                    {media.studios?.nodes?.[0]?.name || '-'}
                  </p>
                  {media.trailer?.id && media.trailer.site === 'youtube' && (
                    <a
                      href={`https://www.youtube.com/watch?v=${media.trailer.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block mt-2 text-blue-600 text-sm"
                    >
                      ▶ 트레일러 보기 (YouTube)
                    </a>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="font-semibold text-base">소개</h3>
                <p className="text-sm text-gray-800 whitespace-pre-wrap">
                  {(media.description || '설명이 없습니다.').replace(
                    /<br\s*\/?>/gi,
                    '\n'
                  )}
                </p>
              </div>
            </div>

            {/* 추천 / 관련 작품 섹션 */}
            <div className="border-t px-4 pt-3 pb-4 space-y-4">
              {/* 추천 애니 (AniList recommendations) */}
              {media.recommendations?.nodes?.length > 0 && (
                <section>
                  <h4 className="font-semibold text-sm mb-2">
                    비슷한 애니 추천 (AniList 추천)
                  </h4>
                  <div className="flex gap-3 overflow-x-auto pb-1">
                    {media.recommendations.nodes.map((node) => {
                      const rec = node.mediaRecommendation;
                      if (!rec) return null;
                      const recTitle =
                        rec.title?.english ||
                        rec.title?.romaji ||
                        rec.title?.native;
                      return (
                        <button
                          key={rec.id}
                          type="button"
                          onClick={() => onSelectRelated?.(rec.id)}
                          className="min-w-[120px] max-w-[140px] text-left"
                        >
                          {rec.coverImage?.large && (
                            <img
                              src={rec.coverImage.large}
                              alt={recTitle}
                              className="w-full rounded-md border mb-1"
                            />
                          )}
                          <div className="text-xs font-semibold line-clamp-2">
                            {recTitle}
                          </div>
                          <div className="text-[11px] text-gray-500">
                            {rec.format} · {rec.seasonYear || '-'}
                          </div>
                          <div className="text-[11px] text-gray-600">
                            ⭐ {rec.averageScore ?? '-'}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* 관계 작품 (시즌2, 스핀오프 등) */}
              {media.relations?.edges?.length > 0 && (
                <section>
                  <h4 className="font-semibold text-sm mb-2">
                    관련 시리즈·스핀오프
                  </h4>
                  <div className="flex gap-3 overflow-x-auto pb-1">
                    {media.relations.edges.map((edge) => {
                      const node = edge.node;
                      if (!node) return null;
                      const relTitle =
                        node.title?.english ||
                        node.title?.romaji ||
                        node.title?.native;
                      return (
                        <button
                          key={node.id}
                          type="button"
                          onClick={() => onSelectRelated?.(node.id)}
                          className="min-w-[120px] max-w-[140px] text-left"
                        >
                          {node.coverImage?.large && (
                            <img
                              src={node.coverImage.large}
                              alt={relTitle}
                              className="w-full rounded-md border mb-1"
                            />
                          )}
                          <div className="text-xs font-semibold line-clamp-2">
                            {relTitle}
                          </div>
                          <div className="text-[11px] text-gray-500">
                            {edge.relationType} · {node.seasonYear || '-'}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
