// src/hooks/useTmdbImage.js
import { useEffect, useState } from 'react';
import { searchTmdbByTitle, getTmdbImageUrl } from '../api/tmdbClient';

export function useTmdbImage(animeTitle) {
  const [imageUrl, setImageUrl] = useState(null);
  const [backdropUrl, setBackdropUrl] = useState(null);

  useEffect(() => {
    if (!animeTitle) return;

    let ignore = false;

    async function load() {
      try {
        const result = await searchTmdbByTitle(animeTitle);
        if (!result || ignore) return;
        setImageUrl(getTmdbImageUrl(result.poster_path));
        setBackdropUrl(getTmdbImageUrl(result.backdrop_path, 'w780'));
      } catch (e) {
        console.error(e);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [animeTitle]);

  return { imageUrl, backdropUrl };
}
