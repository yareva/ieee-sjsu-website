import { revalidatePath } from 'next/cache';
import { createClient } from '@supabase/supabase-js';
import { supabaseAnonKey, supabaseConfigured, supabaseUrl } from '@/lib/content';

// Called by /admin after a change, so the home and events pages show it
// right away instead of on their next timed refresh. Only signed-in admins
// may trigger it.
export async function POST(request: Request) {
  if (!supabaseConfigured) return Response.json({ ok: false, error: 'Supabase is not configured' }, { status: 503 });

  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) return Response.json({ ok: false }, { status: 401 });

  const sb = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { data: userData } = await sb.auth.getUser(token);
  if (!userData.user) return Response.json({ ok: false }, { status: 401 });
  const { data: isAdmin } = await sb.rpc('is_admin');
  if (!isAdmin) return Response.json({ ok: false }, { status: 403 });

  revalidatePath('/');
  revalidatePath('/events');
  return Response.json({ ok: true });
}
