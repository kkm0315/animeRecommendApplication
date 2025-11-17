// src/components/search/AnimeSearchBar.jsx
import { useEffect, useState } from 'react';

export default function AnimeSearchBar({ initialValue = '', onSubmit }) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(value.trim());
  };

  const handleReset = () => {
    setValue('');
    onSubmit?.('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 sm:flex-row sm:items-center"
    >
      <div className="relative flex-1">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
          🔍
        </span>
        <input
          type="text"
          placeholder="애니 제목이나 키워드를 입력해 보세요"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full rounded-2xl border border-slate-700 bg-slate-900/60 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
        >
          검색
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="rounded-2xl border border-slate-700 px-4 py-3 text-sm text-slate-200 transition hover:border-emerald-400"
        >
          초기화
        </button>
      </div>
    </form>
  );
}