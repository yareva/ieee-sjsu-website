// Events, projects and workshops shown on the site.
//
// They live in Supabase (table `events`, see supabase/schema.sql) and are
// managed by officers at /admin. Until Supabase is connected (no env vars),
// the site falls back to the hard-coded lists in lib/data.ts, so nothing
// breaks before setup.
//
// One table covers everything:
//   upcoming events  kind = 'event', date today or later
//   past             everything else, newest first (events, projects, workshops)
//   featured         featured = true (the carousel / projector slides)

import { createClient } from '@supabase/supabase-js';
import { pastEvents, upcomingEvents, featuredProjects, workshops } from '@/lib/data';

export type EventKind = 'event' | 'project' | 'workshop';

export interface SiteEvent {
  id: string;
  kind: EventKind;
  title: string;
  description: string;
  startsAt: string | null;      // ISO date-time; null for things like "Spring 2026"
  dateLabel: string | null;     // shown instead of the formatted date when set
  timeLabel: string | null;
  location: string | null;
  category: string | null;
  flyerUrl: string | null;
  photos: string[];
  registerUrl: string | null;
  featured: boolean;
}

/** Row shape in the database (snake_case) */
export interface EventRow {
  id?: string;
  kind: EventKind;
  title: string;
  description: string;
  starts_at: string | null;
  date_label: string | null;
  time_label: string | null;
  location: string | null;
  category: string | null;
  flyer_url: string | null;
  photos: string[];
  register_url: string | null;
  featured: boolean;
}

export const fromRow = (r: EventRow & { id: string }): SiteEvent => ({
  id: r.id,
  kind: r.kind,
  title: r.title,
  description: r.description ?? '',
  startsAt: r.starts_at,
  dateLabel: r.date_label,
  timeLabel: r.time_label,
  location: r.location,
  category: r.category,
  flyerUrl: r.flyer_url,
  photos: r.photos ?? [],
  registerUrl: r.register_url,
  featured: !!r.featured,
});

export const toRow = (e: Omit<SiteEvent, 'id'>): EventRow => ({
  kind: e.kind,
  title: e.title,
  description: e.description,
  starts_at: e.startsAt,
  date_label: e.dateLabel,
  time_label: e.timeLabel,
  location: e.location,
  category: e.category,
  flyer_url: e.flyerUrl,
  photos: e.photos,
  register_url: e.registerUrl,
  featured: e.featured,
});

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
export const supabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

const TZ = 'America/Los_Angeles';

/** "Mar 26, 2026" (or the custom label) */
export function displayDate(e: SiteEvent) {
  if (e.dateLabel) return e.dateLabel;
  if (!e.startsAt) return '';
  return new Date(e.startsAt).toLocaleDateString('en-US', { timeZone: TZ, month: 'short', day: 'numeric', year: 'numeric' });
}

/** The main image: first photo, else the flyer */
export const coverImage = (e: SiteEvent) => e.photos[0] ?? e.flyerUrl ?? null;
/** True when the only image is the flyer (show it as a whole sheet, uncropped) */
export const flyerOnly = (e: SiteEvent) => !e.photos.length && !!e.flyerUrl;

/** Calendar day (YYYY-MM-DD) in Pacific time — an event stays "upcoming"
 *  for the whole day it happens on */
const ptDay = (d: Date) => d.toLocaleDateString('en-CA', { timeZone: TZ });

export interface SiteContent {
  upcoming: SiteEvent[];
  past: SiteEvent[];
  featured: SiteEvent[];
  source: 'supabase' | 'fallback';
}

export function splitContent(all: SiteEvent[], source: SiteContent['source']): SiteContent {
  const today = ptDay(new Date());
  const time = (e: SiteEvent) => (e.startsAt ? new Date(e.startsAt).getTime() : -Infinity);
  const upcoming = all
    .filter((e) => e.kind === 'event' && e.startsAt && ptDay(new Date(e.startsAt)) >= today)
    .sort((a, b) => time(a) - time(b));
  const up = new Set(upcoming.map((e) => e.id));
  const past = all.filter((e) => !up.has(e.id)).sort((a, b) => time(b) - time(a));
  // the carousel / projector show photos from the events themselves, never flyers
  const featured = all.filter((e) => e.featured && e.photos.length).sort((a, b) => time(b) - time(a));
  return { upcoming, past, featured, source };
}

// ─── fallback: today's hard-coded content ──────────────────────

const parseLooseDate = (s: string) => {
  const t = Date.parse(/^\d{4}-\d{2}-\d{2}$/.test(s) ? `${s}T12:00:00-07:00` : s);
  return Number.isNaN(t) ? null : new Date(t).toISOString();
};

/** The content in lib/data.ts, in the same shape as the database. Also what
 *  /admin offers to import into an empty database. */
export function fallbackEvents(): Omit<SiteEvent, 'id'>[] {
  const out: Omit<SiteEvent, 'id'>[] = [];
  const featuredImages = new Set(featuredProjects.map((p) => p.image));
  // the images on the (formerly) upcoming events are their flyers
  const flyerEvents = new Set(upcomingEvents.map((e) => e.id));
  for (const e of [...upcomingEvents, ...pastEvents]) {
    const isFlyer = flyerEvents.has(e.id);
    const photos = isFlyer ? [] : e.images ?? (e.image ? [e.image] : []);
    out.push({
      kind: e.category === 'Workshop' ? 'workshop' : 'event',
      title: e.title,
      description: e.description,
      startsAt: parseLooseDate(e.date),
      dateLabel: parseLooseDate(e.date) ? null : e.date,
      timeLabel: e.startTime && e.endTime ? `${e.startTime} – ${e.endTime}` : e.startTime ?? null,
      location: e.location,
      category: e.category,
      flyerUrl: isFlyer ? e.image : null,
      photos,
      registerUrl: null,
      featured: !isFlyer && !!e.image && !featuredImages.has(e.image),
    });
  }
  for (const p of featuredProjects) {
    out.push({
      kind: 'project', title: p.title, description: p.description, startsAt: null, dateLabel: p.date,
      timeLabel: null, location: null, category: p.category, flyerUrl: null,
      photos: p.images ?? (p.image ? [p.image] : []), registerUrl: null, featured: true,
    });
  }
  for (const w of workshops) {
    if (out.some((o) => o.title === w.title)) continue;   // already listed as an event
    out.push({
      kind: 'workshop', title: w.title, description: w.description, startsAt: parseLooseDate(w.date), dateLabel: null,
      timeLabel: null, location: 'ENGR 376', category: w.tag, flyerUrl: null,
      photos: w.images ?? (w.image ? [w.image] : []), registerUrl: null, featured: false,
    });
  }
  return out;
}

// ─── loading (server) ──────────────────────────────────────────

export async function getSiteContent(): Promise<SiteContent> {
  if (supabaseConfigured) {
    try {
      const sb = createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } });
      const { data, error } = await sb.from('events').select('*');
      if (error) throw error;
      // an empty database still falls back, so the site isn't blank before
      // officers import or add anything
      if (data && data.length) return splitContent((data as (EventRow & { id: string })[]).map(fromRow), 'supabase');
    } catch (err) {
      console.error('Could not load events from Supabase, using built-in content', err);
    }
  }
  return splitContent(fallbackEvents().map((e, i) => ({ ...e, id: `local-${i}` })), 'fallback');
}
