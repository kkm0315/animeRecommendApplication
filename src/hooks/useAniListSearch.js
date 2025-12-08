// src/hooks/useAniListSearch.js
import { useEffect, useState } from 'react';
import { fetchAniList } from '../api/anilistClient';

const ANILIST_SEARCH_QUERY = `
  query SearchAnime(
    $page: Int
    $perPage: Int
    $search: String
    $sort: [MediaSort]
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
      ) {
        id
        title {
          romaji
        }
        coverImage {
          large
        }
        episodes
        averageScore
        popularity
        format
        status
      }
    }
  }
`;

export function useAniListSearch({ searchTerm, sortMode = 'POPULARITY', page = 1, perPage = 20 }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        let sort = ['POPULARITY_DESC'];
        let useHybridSort = false;

        switch (sortMode) {
          case 'SCORE':
            sort = ['SCORE_DESC'];
            break;
          case 'HYBRID':
            sort = ['SCORE_DESC', 'POPULARITY_DESC'];
            useHybridSort = true;
            break;
          case 'POPULARITY':
          default:
            sort = ['POPULARITY_DESC'];
        }

        const trimmedSearch = searchTerm?.trim();
        const variables = {
          page,
          perPage,
          sort,
          ...(trimmedSearch ? { search: trimmedSearch } : {}),
        };

        const result = await fetchAniList(ANILIST_SEARCH_QUERY, variables);

        if (ignore) return;

        let pageData = result.Page;

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
  }, [searchTerm, sortMode, page, perPage]);

  return { data, loading, error };
}



