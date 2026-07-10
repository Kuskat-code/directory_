import { getCurrentUserSession } from '@/src/features/profile/actions/session.actions';
import Header from './Header';

/**
 * Async Server Component wrapper for Header.
 *
 * Resolves the Supabase session server-side (using React `cache()` for
 * deduplication within the same request) and passes the result as
 * `initialUser` to the interactive client Header.
 *
 * Because this runs on the server before the HTML is sent to the browser,
 * the correct auth state (avatar OR login button) is embedded in the very
 * first rendered frame — no skeleton flash, no loading state on full reloads.
 *
 * Rendered once in layout.tsx so it applies to every route automatically.
 */
export default async function HeaderServer() {
  const response = await getCurrentUserSession();
  const initialUser = response.success ? response.data : null;
  return <Header initialUser={initialUser ?? null} />;
}
