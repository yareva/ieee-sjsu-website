import { Loader } from '@/components/loader';

// Next.js shows this automatically whenever a route segment is loading —
// e.g. while navigating between pages.
export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-white">
      <Loader />
    </div>
  );
}
