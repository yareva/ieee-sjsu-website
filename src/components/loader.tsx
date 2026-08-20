export function Loader({ className = '' }: { className?: string }) {
  return <div className={`loader ${className}`} role="status" aria-label="Loading" />;
}
