import { useEffect, useMemo, useState } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged, setPersistence, browserLocalPersistence } from 'firebase/auth';
import AnimeSearchBar from '../components/search/AnimeSearchBar';
import AnimeList from '../components/anime/AnimeList';
import AnimeDetailModal from '../components/anime/AnimeDetailModal';
import { useAniListSearch } from '../hooks/useAniListSearch';
import { auth, googleProvider } from '../firebase/firebaseConfig';
import { fetchFavorites, saveFavorite, removeFavorite } from '../services/firebaseFavorites';

const PAGE_SIZE = 28;

const SORT_OPTIONS = [
  { value: 'POPULARITY', label: '인기 순' },
  { value: 'SCORE', label: '평점 순' },
  { value: 'HYBRID', label: '추천 (평점+인기)' },
];

function toFavoriteShape(anime) {
  if (!anime) return null;
  return {
    id: anime.id,
    title: anime.title,
    coverImage: anime.coverImage,
    format: anime.format,
    episodes: anime.episodes,
    averageScore: anime.averageScore,
  };
}

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortMode, setSortMode] = useState('POPULARITY');
  const [page, setPage] = useState(1);
  const [selectedAnimeId, setSelectedAnimeId] = useState(null);
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [favoritesError, setFavoritesError] = useState(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const { data, loading, error } = useAniListSearch({
    searchTerm,
    sortMode,
    page,
    perPage: PAGE_SIZE,
  });

  const pageInfo = data?.pageInfo;
  const currentCount = data?.media?.length ?? 0;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setFavoritesError(null);
      if (currentUser) {
        setFavoritesLoading(true);
        try {
          const favs = await fetchFavorites({ userId: currentUser.uid });
          setFavorites(favs);
        } catch (fetchErr) {
          console.error(fetchErr);
          setFavoritesError(fetchErr);
        } finally {
          setFavoritesLoading(false);
        }
      } else {
        setFavorites([]);
        setFavoritesLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const favoriteIds = useMemo(() => new Set(favorites.map((item) => item.id)), [favorites]);

  const handleSearchSubmit = (value = '') => {
    setSearchTerm(value);
    setPage(1);
    setShowFavoritesOnly(false);
  };

  const handleSortModeChange = (value) => {
    setSortMode(value);
    setPage(1);
  };

  const handleSelectAnime = (anime) => {
    setSelectedAnimeId(anime.id);
  };

  const handleLogin = async () => {
    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error(error);
      alert('로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setShowFavoritesOnly(false);
  };

  const handleToggleFavorite = async (anime) => {
    if (!user) {
      alert('즐겨찾기를 사용하려면 로그인해 주세요.');
      return;
    }
    if (!anime?.id) return;

    const exists = favoriteIds.has(anime.id);
    setFavoritesError(null);
    setFavorites((prev) => {
      if (exists) return prev.filter((item) => item.id !== anime.id);
      return [...prev, toFavoriteShape(anime)].filter(Boolean);
    });

    try {
      if (exists) {
        await removeFavorite({ userId: user.uid, animeId: anime.id });
      } else {
        await saveFavorite({ userId: user.uid, anime: toFavoriteShape(anime) });
      }
    } catch (e) {
      setFavoritesError(e);
      // rollback
      setFavorites((prev) => {
        if (exists) return [...prev, toFavoriteShape(anime)].filter(Boolean);
        return prev.filter((item) => item.id !== anime.id);
      });
    }
  };

  const handleFavoritesViewToggle = () => {
    if (!user) {
      alert('로그인 후 즐겨찾기를 사용할 수 있습니다.');
      return;
    }
    setShowFavoritesOnly((prev) => !prev);
    setPage(1);
  };

  const displayedData = showFavoritesOnly ? { media: favorites } : data;
  const effectiveLoading = showFavoritesOnly ? favoritesLoading : loading;
  const effectiveError = showFavoritesOnly ? favoritesError : error;

  const favoriteCount = favorites.length;
  const favoritesDisabled = favoritesLoading;
  const userLabel = user?.displayName || user?.email || '로그인됨';

  return (
    <div className="app-shell">
      <main className="app-main">
        <section className="page-section">
          <header className="hero-card hero-compact">
            <AnimeSearchBar initialValue={searchTerm} onSubmit={handleSearchSubmit} />
          </header>

          <div className="layout-grid">
            <section className="results-card">
              <div className="results-head">
                <div>
                  <p className="eyebrow">검색 결과</p>
                  <h3 className="results-title">{showFavoritesOnly ? `${favoriteCount}개 즐겨찾기` : `${currentCount}개 작품`}</h3>
                  <p className="hero-sub">
                    {showFavoritesOnly ? '즐겨찾기한 작품만 보고 있어요.' : '검색어나 정렬을 조정해 원하는 작품을 찾아보세요.'}
                  </p>
                </div>
                <div className="sort-control" style={{ gap: '8px', flexWrap: 'wrap' }}>
                  <span>정렬</span>
                  <select value={sortMode} onChange={(event) => handleSortModeChange(event.target.value)}>
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className={`ghost ${showFavoritesOnly ? 'is-active' : ''}`}
                    disabled={favoritesDisabled}
                    onClick={handleFavoritesViewToggle}
                  >
                    즐겨찾기만 보기
                  </button>
                  {user ? (
                    <>
                      <span className="user-label">{userLabel}</span>
                      <button type="button" className="ghost" onClick={handleLogout}>
                        로그아웃
                      </button>
                    </>
                  ) : (
                    <button type="button" className="primary" onClick={handleLogin}>
                      Google 로그인
                    </button>
                  )}
                </div>
              </div>

              <AnimeList
                pageData={displayedData}
                loading={effectiveLoading}
                error={effectiveError}
                onSelectAnime={handleSelectAnime}
                favoriteIds={favoriteIds}
                onToggleFavorite={handleToggleFavorite}
                isLoggedIn={!!user}
              />

              {!showFavoritesOnly && pageInfo && (
                <div className="pager">
                  <button
                    type="button"
                    disabled={pageInfo.currentPage <= 1}
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                  >
                    이전 페이지
                  </button>
                  <span>
                    {pageInfo.currentPage} / {pageInfo.lastPage ?? '?'}
                  </span>
                  <button type="button" disabled={!pageInfo.hasNextPage} onClick={() => setPage((current) => current + 1)}>
                    다음 페이지
                  </button>
                </div>
              )}
            </section>
          </div>
        </section>

        {selectedAnimeId && (
          <AnimeDetailModal
            animeId={selectedAnimeId}
            onClose={() => setSelectedAnimeId(null)}
            onSelectRelated={(id) => setSelectedAnimeId(id)}
          />
        )}
      </main>
    </div>
  );
}
