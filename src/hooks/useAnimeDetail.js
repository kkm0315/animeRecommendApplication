// src/hooks/useAnimeDetail.js
import { useEffect, useState } from "react";
import { fetchAniList } from "../api/anilistClient";

const ANILIST_ANIME_DETAIL = `
  query AnimeDetail($id: Int) {
    Media(id: $id, type: ANIME) {
      id
      title {
        romaji
      }
      coverImage {
        large
        extraLarge
      }
      bannerImage
      description(asHtml: false)
      episodes
      averageScore
      popularity
      format
      status
      season
      seasonYear
      genres
      studios(isMain: true) {
        nodes {
          id
          name
        }
      }
      trailer {
        id
        site
        thumbnail
      }
      relations {
        edges {
          relationType
          node {
            id
            title {
              romaji
            }
            coverImage {
              large
            }
            averageScore
            format
            seasonYear
          }
        }
      }
      recommendations(sort: RATING_DESC, perPage: 10) {
        nodes {
          mediaRecommendation {
            id
            title {
              romaji
            }
            coverImage {
              large
            }
            averageScore
            format
            seasonYear
          }
        }
      }
    }
  }
`;

export function useAnimeDetail(id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    let ignore = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const result = await fetchAniList(ANILIST_ANIME_DETAIL, { id });
        if (ignore) return;
        setData(result.Media);
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
  }, [id]);

  return { data, loading, error };
}
