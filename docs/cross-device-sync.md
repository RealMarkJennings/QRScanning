# Turning on cross-device sync (Supabase)

By default the prototype is **single-device**: an order placed on one phone only
shows up in that same browser. To make orders from any phone appear live on the
manager dashboard (on a laptop, tablet, another phone…), connect a free Supabase
database. Supabase is also the database recommended in the project plan, so this
is the real path forward, not a throwaway.

## One-time setup

### 1. Create a project
1. Go to <https://supabase.com> and sign up (free).
2. Click **New project**. Give it a name (e.g. `vasco-ordering`), set a database
   password (save it somewhere), pick a region near you, and create it.
3. Wait ~1 minute for it to finish setting up.

### 2. Create the tables
1. In the left sidebar open **SQL Editor** → **New query**.
2. Paste the block below and click **Run**.

```sql
-- Orders placed by customers
create table if not exists orders (
  ref          text primary key,
  table_number text not null,
  items        jsonb not null,
  total        numeric not null,
  note         text default '',
  status       text not null default 'Received',
  placed_at    bigint not null
);

-- Items the manager has marked sold out
create table if not exists unavailable_items (
  item_id text primary key
);

-- Demo access: allow the public (anon) key to read/write.
-- Fine for a prototype; tighten before handling real customer data.
alter table orders enable row level security;
alter table unavailable_items enable row level security;
create policy "demo_orders_all"  on orders            for all using (true) with check (true);
create policy "demo_unavail_all" on unavailable_items for all using (true) with check (true);
```

### 3. Grab your two values
1. In the sidebar open **Project Settings** (gear icon) → **API**.
2. Copy the **Project URL** (looks like `https://abcdefgh.supabase.co`).
3. Copy the **anon public** key (a long string under "Project API keys").
   - ⚠️ Use the **anon public** key only. Never use the **service_role** key in
     the website — it can bypass all security.

### 4. Plug them into the site
Open `frontend/assets/js/config.js` and fill in the two values:

```js
window.VASCO_CONFIG = {
  supabaseUrl: "https://abcdefgh.supabase.co",
  supabaseKey: "your-anon-public-key"
};
```

Commit + redeploy (or, if hosting on GitHub Pages from the `gh-pages` branch,
update that branch). Reload the manager dashboard — the badge in the top-right
should now read **● Live sync on**.

## How it works

- Placing an order sends it to the `orders` table in Supabase.
- Every open page re-checks Supabase every few seconds, so a new order appears on
  the manager dashboard within ~3 seconds, on any device.
- Marking an item sold out writes to `unavailable_items`, which greys it out on
  every customer's menu.

## Security note

The included policies let anyone with the public key read and write orders. That
is deliberate for a demo so setup stays simple. Before going live with real
venues you'd add proper auth (manager login) and lock these policies down — which
is where the planned FastAPI backend comes in.
