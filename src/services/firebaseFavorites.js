const apiKey = import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyD_2QArBgMN2oVtZMlk0ZB8vqJRDaJkyNo';
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || 'animerecommendation-84c46';

function ensureConfig() {
  if (!apiKey || !projectId) {
    throw new Error('Firebase 환경변수(VITE_FIREBASE_API_KEY, VITE_FIREBASE_PROJECT_ID)가 설정되지 않았습니다.');
  }
}

function toFirestoreFields(anime, userId) {
  return {
    userId: { stringValue: userId },
    animeId: { integerValue: String(anime.id) },
    format: anime.format ? { stringValue: anime.format } : undefined,
    averageScore:
      typeof anime.averageScore === 'number' ? { integerValue: String(anime.averageScore) } : undefined,
    episodes: typeof anime.episodes === 'number' ? { integerValue: String(anime.episodes) } : undefined,
    popularity: typeof anime.popularity === 'number' ? { integerValue: String(anime.popularity) } : undefined,
    titleRomaji: anime.title?.romaji ? { stringValue: anime.title.romaji } : undefined,
    coverImage: anime.coverImage?.large ? { stringValue: anime.coverImage.large } : undefined,
  };
}

function parseIntField(field) {
  if (!field) return undefined;
  const raw = field.integerValue ?? field.stringValue;
  const parsed = Number.parseInt(raw, 10);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function fromFirestoreDoc(doc) {
  const fields = doc.fields || {};
  const idFromDoc = doc.name?.split('/')?.pop();
  const animeId = parseIntField(fields.animeId) ?? (idFromDoc ? Number(idFromDoc.split('_').pop()) : undefined);

  return {
    id: animeId,
    title: {
      romaji: fields.titleRomaji?.stringValue || '',
    },
    coverImage: {
      large: fields.coverImage?.stringValue || '',
    },
    format: fields.format?.stringValue || '',
    averageScore: parseIntField(fields.averageScore),
    episodes: parseIntField(fields.episodes),
    popularity: parseIntField(fields.popularity),
  };
}
export async function fetchFavorites({ userId, idToken }) {
  ensureConfig();
  if (!userId || !idToken) return [];
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery?key=${apiKey}`;
  const body = {
    structuredQuery: {
      from: [{ collectionId: 'favorites' }],
      where: {
        fieldFilter: {
          field: { fieldPath: 'userId' },
          op: 'EQUAL',
          value: { stringValue: userId },
        },
      },
    },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${idToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error?.message || '즐겨찾기 불러오기에 실패했습니다.');
  }
  return json
    .map((row) => row.document)
    .filter(Boolean)
    .map(fromFirestoreDoc)
    .filter((item) => item?.id);
}

export async function saveFavorite({ userId, idToken, anime }) {
  ensureConfig();
  if (!userId || !idToken || !anime?.id) return;
  const docId = `${userId}_${anime.id}`;
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/favorites/${docId}?key=${apiKey}`;
  const fields = toFirestoreFields(anime, userId);
  const body = { fields };
  await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${idToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

export async function removeFavorite({ userId, idToken, animeId }) {
  ensureConfig();
  if (!userId || !idToken || !animeId) return;
  const docId = `${userId}_${animeId}`;
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/favorites/${docId}?key=${apiKey}`;
  await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
}








