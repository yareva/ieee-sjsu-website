import { CalendarDays, Clock, ExternalLink, MapPin } from 'lucide-react';
import { GoogleCalendar } from '@/components/google-calendar';
import { coverImage, type SiteEvent } from '@/lib/content';

// Upcoming events on the left — each with its flyer as a whole 8.5×11
// sheet and a Register button — and the Google Calendar on the right.
// Events are managed by officers at /admin.
const TZ = 'America/Los_Angeles';

export function UpcomingAndCalendar({ events }: { events: SiteEvent[] }) {
  return (
    <div className="up-split">
      <div className="up-list">
        {events.length === 0 ? (
          <div className="m-card up-empty">
            <p className="up-empty-title">Nothing scheduled right now</p>
            <p>New events land here and on our Discord first. The calendar has everything that&apos;s on the books.</p>
          </div>
        ) : (
          events.map((e) => <UpcomingCard key={e.id} e={e} />)
        )}
      </div>
      <div className="cal-card up-cal">
        <GoogleCalendar />
      </div>
    </div>
  );
}

function UpcomingCard({ e }: { e: SiteEvent }) {
  const d = e.startsAt ? new Date(e.startsAt) : null;
  const flyer = e.flyerUrl ?? coverImage(e);
  return (
    <article className="up-card">
      <div className="up-flyer">
        {flyer ? (
          <a href={flyer} target="_blank" rel="noopener noreferrer" aria-label={`Open the flyer for ${e.title}`}>
            <img src={flyer} alt={`${e.title} flyer`} loading="lazy" />
          </a>
        ) : (
          <span className="up-noflyer">Flyer coming soon</span>
        )}
      </div>
      <div className="up-body">
        {e.category && <p className="up-cat">{e.category}</p>}
        <h3>{e.title}</h3>
        <ul className="up-info">
          <li><CalendarDays size={15} /> {e.dateLabel ?? (d ? d.toLocaleDateString('en-US', { timeZone: TZ, weekday: 'long', month: 'long', day: 'numeric' }) : '')}</li>
          {(e.timeLabel || d) && (
            <li><Clock size={15} /> {e.timeLabel ?? d!.toLocaleTimeString('en-US', { timeZone: TZ, hour: 'numeric', minute: '2-digit' })}</li>
          )}
          {e.location && <li><MapPin size={15} /> {e.location}</li>}
        </ul>
        {e.description && <p className="up-desc">{e.description}</p>}
        {e.registerUrl && (
          <a href={e.registerUrl} target="_blank" rel="noopener noreferrer" className="home-btn home-btn-primary up-register">
            Register <ExternalLink size={14} />
          </a>
        )}
      </div>
    </article>
  );
}
