"use client";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="w-full min-h-screen bg-brand-bg flex items-center justify-center px-6">
      <div className="text-center space-y-6 max-w-lg">
        <div className="w-20 h-20 rounded-full bg-brand-primary/20 flex items-center justify-center mx-auto">
          <span className="text-4xl">!</span>
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tighter">
          Something went <span className="text-gradient">wrong</span>
        </h1>
        <p className="text-brand-muted text-sm">
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="px-8 py-3 rounded-full bg-brand-primary text-black font-bold uppercase tracking-wider text-sm hover:bg-brand-accent transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
