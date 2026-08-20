const CALENDAR_SRC =
  'https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FLos_Angeles&showPrint=0&title=IEEE%20Club%20Events&src=Y182MGQ0NzFjMTE0NTYyN2U3Njc5OGMzN2M4ZDQzOTkyZGRhZGE1MGM5MGRkNzFkYjRkNTgwZWY1MDM2NmY2YTBhQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20&color=%232563EB';

export const CALENDAR_URL =
  'https://calendar.google.com/calendar/u/0?cid=Y182MGQ0NzFjMTE0NTYyN2U3Njc5OGMzN2M4ZDQzOTkyZGRhZGE1MGM5MGRkNzFkYjRkNTgwZWY1MDM2NmY2YTBhQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20';

export function GoogleCalendar({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>
      <div className="relative w-full h-[460px] sm:h-[560px] lg:h-[640px]">
        <iframe
          src={CALENDAR_SRC}
          title="IEEE SJSU Events Calendar"
          className="absolute inset-0 h-full w-full border-0"
          frameBorder="0"
          scrolling="no"
          loading="lazy"
        />
      </div>
    </div>
  );
}
