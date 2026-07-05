/*
 * Cross-device sync configuration.
 *
 * LEAVE BLANK  -> single-device mode. Orders stay in one browser (fine for a
 *                 quick demo on a single laptop/phone).
 *
 * FILL IN      -> cloud sync. Any device that opens the site shares the same
 *                 live orders. Paste your Supabase project's values below.
 *
 * The "anon public" key is DESIGNED to be shown in the browser — it is safe to
 * commit here. Never paste your "service_role" (secret) key.
 */
window.VASCO_CONFIG = {
  supabaseUrl: "", // e.g. "https://abcdefgh.supabase.co"
  supabaseKey: ""  // your Supabase "anon public" key
};
