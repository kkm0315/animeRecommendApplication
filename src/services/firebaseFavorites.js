import { collection, deleteDoc, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

function toFirestoreFields(anime, userId) {
  return {
    userId,
    animeId: anime.id,
    format: anime.format ?? null,
    averageScore: typeof anime.averageScore === 'number' ? anime.averageScore : null,
    episodes: typeof anime.episodes === 'number' ? anime.episodes : null,
    titleRomaji: anime.title?.romaji ?? '',
    titleEnglish: anime.title?.english ?? '',
    titleNative: anime.title?.native ?? '',
    coverImage: anime.coverImage?.large ?? '',
  };
}

function fromFirestoreDoc(docSnap) {
  const data = docSnap.data();
  return {
    id: data.animeId,
    title: {
      romaji: data.titleRomaji || '',
      english: data.titleEnglish || '',
      native: data.titleNative || '',
    },
    coverImage: { large: data.coverImage || '' },
    format: data.format || '',
    averageScore: data.averageScore,
    episodes: data.episodes,
  };
}

export async function fetchFavorites({ userId }) {
  if (!userId) return [];
  const favoritesRef = collection(db, 'favorites');
  const q = query(favoritesRef, where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(fromFirestoreDoc).filter((item) => item?.id);
}

export async function saveFavorite({ userId, anime }) {
  if (!userId || !anime?.id) return;
  const docId = `${userId}_${anime.id}`;
  const ref = doc(db, 'favorites', docId);
  await setDoc(ref, toFirestoreFields(anime, userId));
}

export async function removeFavorite({ userId, animeId }) {
  if (!userId || !animeId) return;
  const docId = `${userId}_${animeId}`;
  const ref = doc(db, 'favorites', docId);
  await deleteDoc(ref);
}
