import { getSiteContent } from '@/lib/content';
import { EventsView } from './events-view';
import '../home.css';

// Refetch events at most once a minute; /admin also refreshes this page
// right after any change (see app/api/revalidate).
export const revalidate = 60;

export default async function EventsPage() {
  const content = await getSiteContent();
  return <EventsView content={content} />;
}
