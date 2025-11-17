// src/components/common/LoadingSpinner.jsx
export default function LoadingSpinner() {
  return (
    <div className="py-10 flex justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full" />
    </div>
  );
}