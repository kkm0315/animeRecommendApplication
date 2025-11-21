import { useEffect, useState } from 'react';

export default function AnimeSearchBar({ initialValue = '', onSubmit }) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.(value.trim());
  };

  const handleReset = () => {
    setValue('');
    onSubmit?.('');
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="애니 제목이나 키워드를 입력해 주세요"
      />
      {value && (
        <button type="button" className="ghost" onClick={handleReset}>
          초기화
        </button>
      )}
      <button type="submit" className="primary">
        검색
      </button>
    </form>
  );
}
