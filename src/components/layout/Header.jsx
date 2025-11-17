// src/components/layout/Header.jsx
export default function Header() {
  return (
    <header className="border-b border-slate-800 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
        <div className="space-y-3 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.45em] text-emerald-300/80">
            AniList × TMDB
          </p>
          <h1 className="text-3xl font-extrabold leading-tight md:text-4xl">
            Anime Discovery Hub
          </h1>
          <p className="max-w-2xl text-sm text-slate-300">
            AniList의 데이터와 TMDB 이미지를 조합해 원하는 조건으로 작품을 탐색하고, 나만의 추천 컬렉션을 만들어 보세요.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-300">
          <span className="rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1 text-emerald-300">
            실시간 필터링
          </span>
          <span className="rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1 text-slate-200">
            TMDB 이미지 매칭
          </span>
          <span className="rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1 text-slate-200">
            추천 리스트 실험실
          </span>
        </div>
      </div>
    </header>
  );
}