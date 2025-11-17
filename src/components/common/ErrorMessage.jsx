// src/components/common/ErrorMessage.jsx
export default function ErrorMessage({ message }) {
  return (
    <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-6 text-center text-sm text-red-200">
      에러가 발생했습니다: {message}
    </div>
  );
}