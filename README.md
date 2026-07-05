# Vasco da Gama Taverna — QR Table Ordering (Prototype)

A frontend-only prototype of a QR-based table ordering system, themed after
[Vasco da Gama Taverna](https://vascos.co.za) ("The Portuguese Embassy since 1972").

Scan a table's QR code → the menu opens on your phone tagged to that table →
place an order → it appears **live** on the Manager Dashboard. No backend, no
real payments — everything runs in the browser so you can demo the whole flow.

## Try it

Because the QR codes point to real URLs, serve the `frontend/` folder over HTTP
(don't just open the files directly, or the QR links won't resolve):

```bash
cd frontend
python3 -m http.server 8000
```

Then open <http://localhost:8000>:

1. **`index.html`** — landing page with a scannable QR code per table.
   Tap "Open menu" (or scan the QR from a phone on the same network).
2. **`order.html?table=3`** — the customer menu. Add items, review your order,
   and place it. (Reached automatically from the QR / "Open menu" button.)
3. **`manager.html`** — the manager dashboard. Watch orders arrive live, advance
   their status (Received → Preparing → Ready → Served → Closed), and toggle menu
   items as **sold out** — which instantly greys them out on the customer menu.

> Open the customer page and the manager dashboard in two tabs side by side to
> see orders sync in real time.

### Scanning from a real phone

The QR codes encode whatever base URL is serving the page. To scan from a phone,
host the `frontend/` folder somewhere reachable — e.g. GitHub Pages, or your
machine's LAN IP (`python3 -m http.server` then browse to
`http://<your-ip>:8000`). Orders placed on the phone are stored on that phone's
browser; cross-device order sync would need the backend (see below).

## What's in scope

Matches the MVP customer + staff/manager flows:

| Customer | Manager |
| --- | --- |
| Open menu for a specific table | See live incoming orders with table number |
| Browse categories | Advance order status |
| Add items / adjust quantities | Mark items sold out / available |
| Add notes for the kitchen | Demo-seed & clear orders |
| Place order (mock checkout) | |

## What's intentionally *not* here

Per "proper architecture + small scope": no real payment gateway, no auth, and no
server. State is kept in `localStorage` + a `BroadcastChannel` for live tab-to-tab
updates. Swapping the `Store` module (`assets/js/store.js`) for real API calls
(FastAPI + PostgreSQL, hosted checkout via PayFast/Yoco) is the natural next step —
the UI and data shapes are already built around it.

## Project layout

```
frontend/
├── index.html            Landing + per-table QR codes
├── order.html            Customer ordering page  (?table=N)
├── manager.html          Manager dashboard
└── assets/
    ├── css/styles.css    Vasco navy + gold theme
    └── js/
        ├── menu-data.js  Menu (Vasco Menu 2024, ZAR)
        ├── store.js      Shared state (localStorage + BroadcastChannel)
        ├── order.js      Customer page logic
        ├── manager.js    Dashboard logic
        └── qrcode.min.js QR generator (davidshimjs/qrcodejs, MIT)
docs/
└── overview.md           Flows, data model, next steps
```

_Prototype for demonstration only — not affiliated with Vasco da Gama Taverna.
Menu and branding used to make the demo realistic._
