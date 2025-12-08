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
        title { romaji }
        coverImage { large }
        episodes
        averageScore
        popularity
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
        switch (sortMode) {
          case 'SCORE':
            sort = ['SCORE_DESC'];
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

        setData(result.Page);
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
