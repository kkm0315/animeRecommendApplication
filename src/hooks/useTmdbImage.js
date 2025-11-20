import { useEffect, useMemo, useState } from 'react';
import { searchTmdbByTitle, getTmdbImageUrl } from '../api/tmdbClient';

const normalize = (value) =>
  value?.toLowerCase().replace(/[^a-z0-9가-힣]/g, '').trim() ?? '';

const extractYear = (dateString) => {
  if (!dateString) return null;
  const year = Number(dateString.slice(0, 4));
  return Number.isNaN(year) ? null : year;
};

const scoreCandidate = (candidate, normalizedTargets, seasonYear) => {
  const candidateNames = [
    candidate.name,
    candidate.original_name,
    candidate.title,
    candidate.original_title,
  ]
    .map(normalize)
    .filter(Boolean);

  let score = 0;

  candidateNames.forEach((name) => {
    normalizedTargets.forEach((target) => {
      if (!target || !name) return;
      if (name === target) {
        score = Math.max(score, 100);
      } else if (name.includes(target) || target.includes(name)) {
        score = Math.max(score, 70);
      }
    });
  });

  if (seasonYear) {
    const candidateYear = extractYear(candidate.first_air_date);
    if (candidateYear) {
      if (candidateYear === seasonYear) score += 15;
      else if (Math.abs(candidateYear - seasonYear) <= 1) score += 5;
      else score -= 20;
    }
  }

  score += (candidate.vote_average || 0) * 2;
  score += (candidate.popularity || 0) / 150;
  return score;
};

export function useTmdbImage({ title, seasonYear, altTitles = [] } = {}) {
  const [imageUrl, setImageUrl] = useState(null);
  const [backdropUrl, setBackdropUrl] = useState(null);

  const normalizedTargets = useMemo(() => {
    return [title, ...altTitles].map(normalize).filter(Boolean);
  }, [title, altTitles]);

  const primaryQuery = title || altTitles.find(Boolean) || '';

  useEffect(() => {
    if (!primaryQuery || !normalizedTargets.length) {
      setImageUrl(null);
      setBackdropUrl(null);
      return;
    }

    let ignore = false;

    async function load() {
      try {
        const results = await searchTmdbByTitle(primaryQuery);
        if (ignore) return;

        if (!results?.length) {
          setImageUrl(null);
          setBackdropUrl(null);
          return;
        }

        const best = results
          .map((candidate) => ({
            candidate,
            score: scoreCandidate(candidate, normalizedTargets, seasonYear),
          }))
          .sort((a, b) => b.score - a.score)[0];

        if (!best || best.score < 40) {
          setImageUrl(null);
          setBackdropUrl(null);
          return;
        }

        setImageUrl(getTmdbImageUrl(best.candidate.poster_path));
        setBackdropUrl(getTmdbImageUrl(best.candidate.backdrop_path, 'w780'));
      } catch (error) {
        console.error(error);
        if (!ignore) {
          setImageUrl(null);
          setBackdropUrl(null);
        }
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [primaryQuery, normalizedTargets, seasonYear]);

  return { imageUrl, backdropUrl };
}
