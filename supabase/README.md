# Admin setup (Supabase)

Officers manage upcoming events (with flyers and register links), past
events, projects, workshops and the Featured Events carousel at
**`/admin`** on the website. The data lives in a free Supabase project.

Until Supabase is connected, the site shows the built-in content from
`src/lib/data.ts`.

## One-time setup

1. Create a free project at [supabase.com](https://supabase.com) (use a club
   account so it can be handed down).
2. **SQL Editor** → paste all of [`schema.sql`](./schema.sql) → **Run**.
3. **Authentication → Sign In / Providers**: keep **Email** on and turn
   **"Allow new users to sign up"** off, so only invited officers get accounts.
4. **Authentication → Users → Add user**: create a login (email + password)
   for each officer.
5. Back in the **SQL Editor**, make those emails admins:
   ```sql
   insert into public.admins (email) values ('officer@sjsu.edu');
   ```
6. **Project Settings → API**: copy the **Project URL** and the
   **anon / publishable key**, and add them in Vercel → the project →
   **Settings → Environment Variables**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
   (For local development, put the same two lines in `.env.local`.)
7. Redeploy. Go to `/admin`, log in, and click **Import current site
   content** once to copy the existing events into the database.

## Handing off to new officers

- Add them: create a user (step 4) and add their email to `admins` (step 5).
- Remove someone: `delete from public.admins where email = '...';` and delete
  the user under Authentication → Users.
