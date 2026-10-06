'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { createClient, type Session, type SupabaseClient } from '@supabase/supabase-js';
import { ExternalLink, ImagePlus, LogOut, Pencil, Plus, Star, Trash2, X } from 'lucide-react';
import {
  coverImage, displayDate, fallbackEvents, fromRow, splitContent, supabaseAnonKey, supabaseConfigured, supabaseUrl, toRow,
  type EventKind, type EventRow, type SiteEvent,
} from '@/lib/content';

// /admin — where officers manage what the site shows: upcoming events with
// flyers and register links, past events / projects / workshops, and which
// ones appear in the Featured Events carousel. Setup: supabase/README.md.

let client: SupabaseClient | null = null;
const sb = () => (client ??= createClient(supabaseUrl, supabaseAnonKey));

const CATEGORIES = ['Speaker', 'Workshop', 'Networking', 'Social', 'Recruiting', 'Industry', 'Hackathon', 'Project'];
const KINDS: { value: EventKind; label: string }[] = [
  { value: 'event', label: 'Event' },
  { value: 'project', label: 'Project' },
  { value: 'workshop', label: 'Workshop' },
];
type Tab = 'upcoming' | 'past' | 'featured';

const blank = (): Omit<SiteEvent, 'id'> => ({
  kind: 'event', title: '', description: '', startsAt: null, dateLabel: null, timeLabel: null,
  location: 'ENGR 376', category: 'Workshop', flyerUrl: null, photos: [], registerUrl: null, featured: false,
});

// <input type="datetime-local"> works in the browser's own time zone
const toLocalInput = (iso: string | null) => {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

async function upload(file: File) {
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const path = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${ext}`;
  const { error } = await sb().storage.from('flyers').upload(path, file, { cacheControl: '31536000', contentType: file.type });
  if (error) throw error;
  return sb().storage.from('flyers').getPublicUrl(path).data.publicUrl;
}

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [events, setEvents] = useState<SiteEvent[]>([]);
  const [tab, setTab] = useState<Tab>('upcoming');
  const [editing, setEditing] = useState<SiteEvent | 'new' | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!supabaseConfigured) { setChecking(false); return; }
    sb().auth.getSession().then(({ data }) => { setSession(data.session); setChecking(false); });
    const { data } = sb().auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  const load = useCallback(async () => {
    const { data, error } = await sb().from('events').select('*');
    if (error) { setNotice(error.message); return; }
    setEvents((data as (EventRow & { id: string })[]).map(fromRow));
  }, []);

  useEffect(() => {
    if (!session) { setIsAdmin(null); return; }
    sb().rpc('is_admin').then(({ data }) => setIsAdmin(!!data));
    load();
  }, [session, load]);

  // tell the site to refresh the home + events pages now
  const publish = useCallback(async () => {
    const token = (await sb().auth.getSession()).data.session?.access_token;
    await fetch('/api/revalidate', { method: 'POST', headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
  }, []);

  const groups = useMemo(() => splitContent(events, 'supabase'), [events]);
  const list = tab === 'upcoming' ? groups.upcoming : tab === 'past' ? groups.past : groups.featured;

  const run = async (fn: () => Promise<void>, done: string) => {
    setBusy(true);
    setNotice(null);
    try {
      await fn();
      await load();
      await publish();
      setNotice(done);
    } catch (err) {
      setNotice(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  const toggleFeatured = (e: SiteEvent) => run(async () => {
    const { error } = await sb().from('events').update({ featured: !e.featured }).eq('id', e.id);
    if (error) throw error;
  }, e.featured ? 'Removed from Featured.' : 'Added to Featured.');

  const remove = (e: SiteEvent) => {
    if (!window.confirm(`Delete "${e.title}"? This can't be undone.`)) return;
    run(async () => {
      const { error } = await sb().from('events').delete().eq('id', e.id);
      if (error) throw error;
    }, 'Deleted.');
  };

  const importExisting = () => run(async () => {
    const { error } = await sb().from('events').insert(fallbackEvents().map(toRow));
    if (error) throw error;
  }, 'Imported the current site content.');

  // ── screens ──
  if (!supabaseConfigured) {
    return (
      <Shell>
        <Card>
          <h1 className="text-2xl font-black mb-3">Admin isn&apos;t connected yet</h1>
          <p className="text-slate-600 mb-2">
            The admin area needs a Supabase project. Follow <code className="px-1 bg-slate-100 rounded">supabase/README.md</code> in the repo,
            then add <code className="px-1 bg-slate-100 rounded">NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
            <code className="px-1 bg-slate-100 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to Vercel and redeploy.
          </p>
          <p className="text-slate-600">Until then, the site shows its built-in content.</p>
        </Card>
      </Shell>
    );
  }
  if (checking) return <Shell><p className="text-slate-500">Loading…</p></Shell>;
  if (!session) return <Shell><Login /></Shell>;
  if (isAdmin === false) {
    return (
      <Shell>
        <Card>
          <h1 className="text-2xl font-black mb-2">Not an admin</h1>
          <p className="text-slate-600 mb-6">
            {session.user.email} is signed in but isn&apos;t on the admin list. Ask a current officer to add you.
          </p>
          <button onClick={() => sb().auth.signOut()} className="btn-ghost"><LogOut size={16} /> Sign out</button>
        </Card>
      </Shell>
    );
  }

  return (
    <Shell email={session.user.email}>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Events &amp; flyers</h1>
          <p className="text-slate-500 text-sm mt-1">Changes show on the site right after you save.</p>
        </div>
        <button onClick={() => setEditing('new')} className="btn-primary"><Plus size={16} /> Add event</button>
      </div>

      {notice && <p className="mb-4 rounded-lg bg-blue-50 border border-blue-200 px-4 py-2 text-sm text-blue-900">{notice}</p>}

      {events.length === 0 && (
        <Card className="mb-6">
          <p className="font-bold mb-1">The database is empty</p>
          <p className="text-slate-600 text-sm mb-4">Copy the events, projects and workshops the site shows today into it, then edit from here.</p>
          <button onClick={importExisting} disabled={busy} className="btn-primary">Import current site content</button>
        </Card>
      )}

      <div className="flex gap-2 mb-4" role="tablist">
        {([['upcoming', 'Upcoming', groups.upcoming.length], ['past', 'Past, projects & workshops', groups.past.length], ['featured', 'Featured carousel', groups.featured.length]] as const).map(([t, label, n]) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${tab === t ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}
          >
            {label} <span className="opacity-60">{n}</span>
          </button>
        ))}
      </div>
      {tab === 'featured' && <p className="text-sm text-slate-500 mb-4">Star any event or project that has photos to show it in the Featured Events carousel and on the projector. Flyers aren&apos;t shown there, only real event photos.</p>}

      <ul className="grid gap-3">
        {list.map((e) => {
          const img = coverImage(e);
          return (
            <li key={e.id} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-3">
              <div className="w-16 h-16 shrink-0 rounded-xl bg-slate-100 overflow-hidden grid place-items-center text-[10px] text-slate-400">
                {img ? <img src={img} alt="" className="w-full h-full object-cover" /> : 'No image'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold truncate">{e.title}</p>
                <p className="text-sm text-slate-500 truncate">
                  {[displayDate(e), e.timeLabel, KINDS.find((k) => k.value === e.kind)?.label, e.category].filter(Boolean).join(' · ')}
                </p>
                <p className="text-xs mt-1 flex gap-3">
                  {e.flyerUrl && <span className="text-emerald-700">Flyer</span>}
                  {e.registerUrl && <a href={e.registerUrl} target="_blank" rel="noopener noreferrer" className="text-blue-700 inline-flex items-center gap-1">Register link <ExternalLink size={11} /></a>}
                </p>
              </div>
              <button
                onClick={() => toggleFeatured(e)}
                disabled={busy}
                title={e.featured ? 'Remove from Featured' : 'Add to Featured'}
                aria-label={e.featured ? `Remove ${e.title} from Featured` : `Add ${e.title} to Featured`}
                className={`p-2 rounded-lg hover:bg-amber-50 ${e.featured ? 'text-amber-500' : 'text-slate-300'}`}
              >
                <Star size={20} fill={e.featured ? 'currentColor' : 'none'} />
              </button>
              <button onClick={() => setEditing(e)} className="p-2 rounded-lg text-slate-600 hover:bg-slate-100" aria-label={`Edit ${e.title}`}><Pencil size={18} /></button>
              <button onClick={() => remove(e)} disabled={busy} className="p-2 rounded-lg text-red-600 hover:bg-red-50" aria-label={`Delete ${e.title}`}><Trash2 size={18} /></button>
            </li>
          );
        })}
        {list.length === 0 && events.length > 0 && <li className="text-slate-500 text-sm py-6 text-center">Nothing here yet.</li>}
      </ul>

      {editing && (
        <Editor
          initial={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={async (msg) => { setEditing(null); await load(); await publish(); setNotice(msg); }}
        />
      )}
    </Shell>
  );
}

// ─── pieces ────────────────────────────────────────────────────

function Shell({ children, email }: { children: React.ReactNode; email?: string }) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900" style={{ colorScheme: 'light' }}>
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <Link href="/" className="font-black tracking-tight">IEEE SJSU <span className="text-slate-400 font-semibold">· Admin</span></Link>
          {email && (
            <div className="flex items-center gap-3 text-sm">
              <span className="text-slate-500 hidden sm:inline">{email}</span>
              <Link href="/" target="_blank" className="text-blue-700 font-semibold">View site</Link>
              <button onClick={() => sb().auth.signOut()} className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900"><LogOut size={15} /> Sign out</button>
            </div>
          )}
        </div>
      </header>
      <div className="max-w-5xl mx-auto px-4 py-8">{children}</div>
      <style>{`
        .btn-primary { display:inline-flex; align-items:center; gap:.4rem; padding:.6rem 1.1rem; border-radius:.75rem; background:#1f5fe0; color:#fff; font-weight:700; font-size:.9rem; }
        .btn-primary:hover { background:#174bb5; }
        .btn-primary:disabled, .btn-ghost:disabled { opacity:.5; cursor:default; }
        .btn-ghost { display:inline-flex; align-items:center; gap:.4rem; padding:.6rem 1.1rem; border-radius:.75rem; border:1px solid #cbd5e1; color:#334155; font-weight:600; font-size:.9rem; background:#fff; }
        .btn-ghost:hover { border-color:#64748b; }
        .field { display:grid; gap:.35rem; font-size:.85rem; font-weight:600; color:#334155; }
        .field input, .field select, .field textarea { font-weight:400; font-size:.95rem; color:#0f172a; border:1px solid #cbd5e1; border-radius:.6rem; padding:.55rem .7rem; background:#fff; }
        .field input:focus, .field select:focus, .field textarea:focus { outline:2px solid #1f5fe0; outline-offset:0; border-color:transparent; }
        .hint { font-weight:400; color:#64748b; font-size:.78rem; }
      `}</style>
    </main>
  );
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-slate-200 bg-white p-6 ${className}`}>{children}</div>;
}

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  return (
    <Card className="max-w-sm mx-auto mt-10">
      <h1 className="text-2xl font-black mb-1">Officer login</h1>
      <p className="text-slate-500 text-sm mb-6">Manage events, flyers and the featured carousel.</p>
      <form
        className="grid gap-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError(null);
          const { error } = await sb().auth.signInWithPassword({ email, password });
          if (error) setError(error.message);
          setBusy(false);
        }}
      >
        <label className="field">Email<input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <label className="field">Password<input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={busy} className="btn-primary justify-center">{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </Card>
  );
}

function Editor({ initial, onClose, onSaved }: {
  initial: SiteEvent | null;
  onClose: () => void;
  onSaved: (msg: string) => void;
}) {
  const [form, setForm] = useState<Omit<SiteEvent, 'id'>>(() => (initial ? { ...initial } : blank()));
  const [flyerFile, setFlyerFile] = useState<File | null>(null);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));
  const flyerPreview = useMemo(() => (flyerFile ? URL.createObjectURL(flyerFile) : form.flyerUrl), [flyerFile, form.flyerUrl]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const flyerUrl = flyerFile ? await upload(flyerFile) : form.flyerUrl;
      const added = await Promise.all(photoFiles.map(upload));
      const row = toRow({
        ...form,
        title: form.title.trim(),
        flyerUrl,
        photos: [...form.photos, ...added],
        dateLabel: form.dateLabel?.trim() || null,
        timeLabel: form.timeLabel?.trim() || null,
        location: form.location?.trim() || null,
        registerUrl: form.registerUrl?.trim() || null,
      });
      const res = initial
        ? await sb().from('events').update(row).eq('id', initial.id)
        : await sb().from('events').insert(row);
      if (res.error) throw res.error;
      onSaved(initial ? 'Saved.' : 'Added.');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 grid place-items-center p-4 overflow-y-auto" role="dialog" aria-modal="true" aria-label={initial ? 'Edit event' : 'Add event'}>
      <form onSubmit={save} className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl my-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-black">{initial ? 'Edit' : 'Add'} {KINDS.find((k) => k.value === form.kind)?.label.toLowerCase()}</h2>
          <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100" aria-label="Close"><X size={18} /></button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <label className="field">Type
            <select value={form.kind} onChange={(e) => set('kind', e.target.value as EventKind)}>
              {KINDS.map((k) => <option key={k.value} value={k.value}>{k.label}</option>)}
            </select>
          </label>
          <label className="field">Category
            <select value={form.category ?? ''} onChange={(e) => set('category', e.target.value || null)}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          <label className="field sm:col-span-2">Title
            <input required value={form.title} onChange={(e) => set('title', e.target.value)} />
          </label>
          <label className="field">Date &amp; start time
            <input type="datetime-local" value={toLocalInput(form.startsAt)} onChange={(e) => set('startsAt', e.target.value ? new Date(e.target.value).toISOString() : null)} />
            <span className="hint">Events dated today or later show as Upcoming.</span>
          </label>
          <label className="field">Time to show <span className="hint">(optional)</span>
            <input placeholder="6:00 PM – 8:00 PM" value={form.timeLabel ?? ''} onChange={(e) => set('timeLabel', e.target.value)} />
          </label>
          <label className="field">Date to show instead <span className="hint">(optional)</span>
            <input placeholder="e.g. Spring 2026 or Apr 17–18" value={form.dateLabel ?? ''} onChange={(e) => set('dateLabel', e.target.value)} />
          </label>
          <label className="field">Location
            <input value={form.location ?? ''} onChange={(e) => set('location', e.target.value)} />
          </label>
          <label className="field sm:col-span-2">Description
            <textarea rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} />
          </label>
          <label className="field sm:col-span-2">Register link <span className="hint">(optional — shows a Register button)</span>
            <input type="url" placeholder="https://forms.gle/…" value={form.registerUrl ?? ''} onChange={(e) => set('registerUrl', e.target.value)} />
          </label>

          <div className="field">Flyer
            <div className="flex items-start gap-3">
              <div className="w-24 aspect-[4/5] rounded-lg bg-slate-100 overflow-hidden grid place-items-center text-[10px] text-slate-400">
                {flyerPreview ? <img src={flyerPreview} alt="" className="w-full h-full object-cover" /> : 'None'}
              </div>
              <div className="grid gap-2">
                <label className="btn-ghost cursor-pointer"><ImagePlus size={15} /> {flyerPreview ? 'Replace' : 'Upload'}
                  <input type="file" accept="image/*" className="sr-only" onChange={(e) => setFlyerFile(e.target.files?.[0] ?? null)} />
                </label>
                {flyerPreview && <button type="button" className="text-sm text-red-600 text-left" onClick={() => { setFlyerFile(null); set('flyerUrl', null); }}>Remove flyer</button>}
              </div>
            </div>
          </div>

          <div className="field">Photos <span className="hint">(the first one is the cover)</span>
            <div className="flex flex-wrap gap-2">
              {form.photos.map((p) => (
                <div key={p} className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-100">
                  <img src={p} alt="" className="w-full h-full object-cover" />
                  <button type="button" aria-label="Remove photo" onClick={() => set('photos', form.photos.filter((x) => x !== p))} className="absolute top-0.5 right-0.5 w-5 h-5 grid place-items-center rounded-full bg-black/60 text-white"><X size={12} /></button>
                </div>
              ))}
              {photoFiles.map((f, i) => (
                <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-100 ring-2 ring-blue-400">
                  <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
                  <button type="button" aria-label="Remove photo" onClick={() => setPhotoFiles(photoFiles.filter((_, j) => j !== i))} className="absolute top-0.5 right-0.5 w-5 h-5 grid place-items-center rounded-full bg-black/60 text-white"><X size={12} /></button>
                </div>
              ))}
              <label className="w-16 h-16 rounded-lg border-2 border-dashed border-slate-300 grid place-items-center text-slate-400 cursor-pointer hover:border-slate-500" aria-label="Add photos">
                <Plus size={18} />
                <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => setPhotoFiles([...photoFiles, ...Array.from(e.target.files ?? [])])} />
              </label>
            </div>
          </div>

          <label className="sm:col-span-2 flex items-center gap-3 text-sm font-semibold text-slate-700">
            <input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} className="w-4 h-4" />
            Show in the Featured Events carousel
          </label>
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
          <button type="submit" disabled={busy} className="btn-primary">{busy ? 'Saving…' : initial ? 'Save changes' : 'Add'}</button>
        </div>
      </form>
    </div>
  );
}
