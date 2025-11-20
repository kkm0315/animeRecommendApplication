const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

async function requestSearch(title, language) {
  const url = new URL(`${TMDB_BASE_URL}/search/tv`);
  url.searchParams.set('api_key', TMDB_API_KEY);
  url.searchParams.set('language', language);
  url.searchParams.set('query', title);
  url.searchParams.set('include_adult', 'false');

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`TMDB error: ${response.status}`);
  }

  const json = await response.json();
  return Array.isArray(json.results) ? json.results : [];
}

export async function searchTmdbByTitle(title) {
  if (!TMDB_API_KEY || !title) {
    return [];
  }

  let results = await requestSearch(title, 'ko-KR');
  if (!results.length) {
    results = await requestSearch(title, 'en-US');
  }

  return results;
}

export function getTmdbImageUrl(path, size = 'w500') {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
