// src/hooks/useAniListSearch.js
import { useEffect, useState } from 'react';
import { fetchAniList } from '../api/anilistClient';

/**
 * AniList 검색 쿼리
 * - 기본 검색 + 고급 필터 + 정렬 지원
 */
const ANILIST_SEARCH_QUERY = `
  query SearchAnime(
    $page: Int
    $perPage: Int
    $search: String
    $sort: [MediaSort]
    $genre_in: [String]
    $season: MediaSeason
    $seasonYear: Int
    $status_in: [MediaStatus]
    $format_in: [MediaFormat]
    $episodes_greater: Int
    $episodes_lesser: Int
    $averageScore_greater: Int
    $averageScore_lesser: Int
  ) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        currentPage
        lastPage
        hasNextPage
      }
      media(
        type: ANIME
        search: $search
        sort: $sort
        genre_in: $genre_in
        season: $season
        seasonYear: $seasonYear
        status_in: $status_in
        format_in: $format_in
        episodes_greater: $episodes_greater
        episodes_lesser: $episodes_lesser
        averageScore_greater: $averageScore_greater
        averageScore_lesser: $averageScore_lesser
      ) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          large
        }
        bannerImage
        episodes
        averageScore
        popularity
        genres
        format
        status
        season
        seasonYear
        description(asHtml: false)
      }
    }
  }
`;

/**
 * sortMode:
 *  - POPULARITY
 *  - SCORE
 *  - TRENDING
 *  - LATEST
 *  - HYBRID (score*0.7 + popularity*0.3 커스텀 정렬)
 */
export function useAniListSearch({
  searchTerm,
  sortMode = 'POPULARITY',
  genres = [],
  season = null,
  seasonYear = null,
  page = 1,
  perPage = 20,
  status = 'ANY',        // 'ANY' | 'RELEASING' | 'FINISHED'
  format = 'ANY',        // 'ANY' | 'TV' | 'MOVIE' | 'OVA' | 'ONA' | 'SPECIAL'
  episodeRange = 'ANY',  // 'ANY' | '1_12' | '13_26' | '27_99' | '100_PLUS'
  scoreRange = 'ANY',    // 'ANY' | '60_100' | '70_100' | '80_100' | '90_100'
  recentYearsOnly = false, // 최근 3년만 보기
}) {
  const [data, setData] = useState(null);     // Page 전체
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        // 1) sortMode -> AniList sort 값 매핑
        let sort = ['POPULARITY_DESC'];
        let useHybridSort = false;

        switch (sortMode) {
          case 'SCORE':
            sort = ['SCORE_DESC'];
            break;
          case 'TRENDING':
            sort = ['TRENDING_DESC'];
            break;
          case 'LATEST':
            sort = ['START_DATE_DESC'];
            break;
          case 'HYBRID':
            sort = ['SCORE_DESC', 'POPULARITY_DESC'];
            useHybridSort = true;
            break;
          case 'POPULARITY':
          default:
            sort = ['POPULARITY_DESC'];
        }

        // 2) 상태/포맷 필터
        const status_in =
          status === 'ANY' ? null : [status]; // AniList: FINISHED, RELEASING 등
        const format_in =
          format === 'ANY' ? null : [format]; // AniList: TV, MOVIE, OVA, ONA, SPECIAL

        // 3) 에피소드 범위 -> episodes_greater / lesser
        let episodes_greater = null;
        let episodes_lesser = null;

        switch (episodeRange) {
          case '1_12':
            episodes_greater = 0;
            episodes_lesser = 12;
            break;
          case '13_26':
            episodes_greater = 12;
            episodes_lesser = 26;
            break;
          case '27_99':
            episodes_greater = 26;
            episodes_lesser = 99;
            break;
          case '100_PLUS':
            episodes_greater = 99;
            episodes_lesser = null;
            break;
          case 'ANY':
          default:
            break;
        }

        // 4) 점수 범위 -> averageScore_greater
        let averageScore_greater = null;
        let averageScore_lesser = null;

        switch (scoreRange) {
          case '60_100':
            averageScore_greater = 60;
            break;
          case '70_100':
            averageScore_greater = 70;
            break;
          case '80_100':
            averageScore_greater = 80;
            break;
          case '90_100':
            averageScore_greater = 90;
            break;
          case 'ANY':
          default:
            break;
        }

        const trimmedSearch = searchTerm?.trim();
        const variables = {
          page,
          perPage,
          sort,
          ...(trimmedSearch ? { search: trimmedSearch } : {}),
          ...(genres.length ? { genre_in: genres } : {}),
          ...(season ? { season } : {}),
          ...(seasonYear ? { seasonYear } : {}),
          ...(status_in ? { status_in } : {}),
          ...(format_in ? { format_in } : {}),
        };

        if (episodes_greater !== null) {
          variables.episodes_greater = episodes_greater;
        }
        if (episodes_lesser !== null) {
          variables.episodes_lesser = episodes_lesser;
        }
        if (averageScore_greater !== null) {
          variables.averageScore_greater = averageScore_greater;
        }
        if (averageScore_lesser !== null) {
          variables.averageScore_lesser = averageScore_lesser;
        }

        const result = await fetchAniList(ANILIST_SEARCH_QUERY, variables);

        if (ignore) return;

        let pageData = result.Page;

        // 5) 최근 3년 필터 (클라이언트에서 필터링)
        if (recentYearsOnly && pageData?.media) {
          const currentYear = new Date().getFullYear();
          pageData = {
            ...pageData,
            media: pageData.media.filter((m) => {
              if (!m.seasonYear) return false;
              return m.seasonYear >= currentYear - 2;
            }),
          };
        }

        // 6) HYBRID 정렬 (커스텀 가중치)
        if (pageData?.media && useHybridSort) {
          const sortedMedia = [...pageData.media].sort((a, b) => {
            const scoreA = a.averageScore || 0;
            const scoreB = b.averageScore || 0;
            const popA = a.popularity || 0;
            const popB = b.popularity || 0;

            const hybridA = scoreA * 0.7 + popA * 0.3;
            const hybridB = scoreB * 0.7 + popB * 0.3;

            return hybridB - hybridA;
          });
          pageData = { ...pageData, media: sortedMedia };
        }

        setData(pageData);
      } catch (e) {
        if (!ignore) setError(e);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [
    searchTerm,
    sortMode,
    genres,
    season,
    seasonYear,
    page,
    perPage,
    status,
    format,
    episodeRange,
    scoreRange,
    recentYearsOnly,
  ]);

  return { data, loading, error };
}
