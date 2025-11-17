// src/components/layout/AppLayout.jsx
import Header from './Header';

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header />
      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}