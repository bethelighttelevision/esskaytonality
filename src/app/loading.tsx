import { Disc3 } from "lucide-react";

export default function RootLoading() {
  return (
    <div className="w-full min-h-screen bg-brand-bg flex items-center justify-center">
      <div className="text-center space-y-6">
        <Disc3 className="w-16 h-16 text-brand-primary animate-spin mx-auto" />
        <p className="text-brand-muted text-sm font-bold uppercase tracking-widest animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
}
