# Prototype overview

This document describes what the prototype does and how the pieces fit, so the
frontend can later be wired to a real backend without reworking the UI.

## Flows

### Customer

1. Guest scans the table QR code (encoded on `index.html`).
2. QR opens `order.html?table=N` — the menu, tagged to table `N`.
3. Guest browses categories, adds items, adjusts quantities, adds a kitchen note.
4. Guest taps **Place order & pay** → a mock checkout creates the order.
5. Order is written to the shared store with status `Received`.

### Staff / manager

1. New orders appear on `manager.html` immediately (live via `BroadcastChannel`).
2. Manager advances status: `Received → Preparing → Ready → Served → Closed`.
3. Manager can mark any menu item **sold out**; it greys out on the customer menu.

## Data shapes

These mirror the MVP entities (Venue, Table, MenuItem, Order, OrderItem) so the
switch to an API is mechanical.

```js
// Order (as stored)
{
  ref: "VAB3",              // short reference shown to staff
  table: "3",
  items: [ { name, price, qty } ],   // OrderItem[]
  total: 430,               // ZAR
  note: "no chilli",
  status: "Received",       // Received|Preparing|Ready|Served|Closed
  placedAt: 1720200000000   // epoch ms
}

// MenuItem
{ id: "mm-rump", name: "Rump Steak", price: 215, desc: "300g matured grilled rump." }
```

## State layer (`assets/js/store.js`)

The whole prototype talks to one small `Store` module. It currently persists to
`localStorage` and broadcasts changes to other open tabs. To go live, replace the
method bodies with API calls:

| Prototype method | Backend equivalent |
| --- | --- |
| `Store.addOrder(order)` | `POST /orders` → then redirect to hosted checkout |
| `Store.getOrders()` | `GET /orders` (staff dashboard) |
| `Store.setStatus` / `advanceStatus` | `PATCH /orders/{ref}` |
| `Store.toggleUnavailable(id)` | `PATCH /menu-items/{id}` |
| `Store.onChange(cb)` | WebSocket / SSE / polling |

Payment stays with the venue's gateway (PayFast / Yoco / Peach / Ozow) via hosted
checkout — the platform initiates payment and listens for the confirmation webhook,
never holding funds.

## Next steps

1. FastAPI + PostgreSQL backend implementing the entities above.
2. Hosted-checkout redirect on order placement + payment-confirmation webhook.
3. Manager auth (login) and multi-venue support.
4. Real QR codes printed per table pointing at the deployed customer URL.
