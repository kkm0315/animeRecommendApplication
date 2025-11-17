// src/api/tmdbClient.js
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;  // .env에 설정
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function searchTmdbByTitle(title) {
  if (!TMDB_API_KEY) {
    console.warn('No TMDB API key provided');
    return null;
  }

  const url = new URL(`${TMDB_BASE_URL}/search/tv`);
  url.searchParams.set('api_key', TMDB_API_KEY);
  url.searchParams.set('language', 'ko-KR');
  url.searchParams.set('query', title);

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`TMDB error: ${res.status}`);
  }

  const json = await res.json();
  return json.results?.[0] ?? null; // 제일 관련도 높은 결과 하나만
}

export function getTmdbImageUrl(path, size = 'w500') {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
