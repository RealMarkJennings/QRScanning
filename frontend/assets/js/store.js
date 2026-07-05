/*
 * Vasco ordering prototype — shared store.
 *
 * Two modes, same public API:
 *
 *   • Single-device (default): orders + availability live in localStorage,
 *     synced between tabs of the SAME browser via BroadcastChannel.
 *
 *   • Cloud sync: if assets/js/config.js provides a Supabase URL + anon key,
 *     orders + availability live in Supabase instead, so ANY device can place
 *     an order and the manager dashboard (on another device) sees it. A short
 *     poll keeps every open page up to date.
 *
 * The UI reads from an in-memory cache (kept synchronous on purpose); writes
 * update the cache immediately (optimistic) and persist in the background.
 */
const Store = (function () {
  const ORDERS_KEY = "vasco_orders_v1";
  const AVAIL_KEY = "vasco_unavailable_v1";
  const STATUS_FLOW = ["Received", "Preparing", "Ready", "Served", "Closed"];
  const POLL_MS = 3000;

  const cfg = window.VASCO_CONFIG || {};
  const CLOUD = Boolean(cfg.supabaseUrl && cfg.supabaseKey);
  const REST = CLOUD ? cfg.supabaseUrl.replace(/\/+$/, "") + "/rest/v1" : null;

  const channel = "BroadcastChannel" in window ? new BroadcastChannel("vasco") : null;
  const listeners = [];

  // In-memory cache — the UI always reads from here.
  let orders = [];
  let unavailable = [];
  let firstCloudLoad = true;

  function notifyLocal() {
    listeners.forEach((cb) => {
      try { cb(); } catch (e) { /* ignore listener errors */ }
    });
  }
  function notifyOthers() {
    if (channel) channel.postMessage({ type: "update", t: Date.now() });
  }

  function newRef() {
    return "V" + Math.random().toString(36).slice(2, 6).toUpperCase();
  }

  // ---------- localStorage backend ----------
  function readLS(key) {
    try { return JSON.parse(localStorage.getItem(key)) || null; }
    catch (e) { return null; }
  }
  function loadFromLS() {
    orders = readLS(ORDERS_KEY) || [];
    unavailable = readLS(AVAIL_KEY) || [];
  }
  function saveOrdersLS() { localStorage.setItem(ORDERS_KEY, JSON.stringify(orders)); }
  function saveAvailLS() { localStorage.setItem(AVAIL_KEY, JSON.stringify(unavailable)); }

  // ---------- Supabase backend ----------
  function sbHeaders(extra) {
    return Object.assign(
      {
        apikey: cfg.supabaseKey,
        Authorization: "Bearer " + cfg.supabaseKey,
        "Content-Type": "application/json"
      },
      extra || {}
    );
  }
  function sbFetch(path, opts) {
    return fetch(REST + path, opts).catch((e) => {
      console.error("Vasco sync error:", e);
      return null;
    });
  }

  // The orders table has no columns for guest name / device / covered refs,
  // so we pack them into the existing "note" column as a small JSON envelope
  // and unpack on read. Plain-text notes (older rows) still work.
  function encodeMeta(record) {
    if (record.refs) {
      return JSON.stringify({ kind: "bill", refs: record.refs, g: record.guest || "", d: record.device || "" });
    }
    return JSON.stringify({ n: record.note || "", g: record.guest || "", d: record.device || "" });
  }
  function decodeMeta(raw) {
    if (!raw) return { note: "", guest: "", device: "", refs: undefined };
    try {
      const m = JSON.parse(raw);
      if (m && typeof m === "object") {
        if (m.kind === "bill") return { note: "", guest: m.g || "", device: m.device || m.d || "", refs: m.refs };
        if ("n" in m || "g" in m || "d" in m) return { note: m.n || "", guest: m.g || "", device: m.d || "", refs: undefined };
      }
    } catch (e) { /* legacy plain-text note */ }
    return { note: raw, guest: "", device: "", refs: undefined };
  }

  async function cloudRefresh() {
    const [oRes, uRes] = await Promise.all([
      sbFetch("/orders?select=*&order=placed_at.desc", { headers: sbHeaders() }),
      sbFetch("/unavailable_items?select=item_id", { headers: sbHeaders() })
    ]);
    if (!oRes || !uRes || !oRes.ok || !uRes.ok) return;
    const oRows = await oRes.json();
    const uRows = await uRes.json();

    const nextOrders = oRows.map((r) => {
      const meta = decodeMeta(r.note);
      return {
        ref: r.ref,
        table: r.table_number,
        items: r.items,
        total: Number(r.total),
        note: meta.note,
        guest: meta.guest,
        device: meta.device,
        refs: meta.refs,
        status: r.status,
        placedAt: Number(r.placed_at)
      };
    });
    const nextUnavail = uRows.map((r) => r.item_id);

    const changed =
      JSON.stringify(nextOrders) !== JSON.stringify(orders) ||
      JSON.stringify(nextUnavail) !== JSON.stringify(unavailable);

    orders = nextOrders;
    unavailable = nextUnavail;

    if (changed || firstCloudLoad) notifyLocal();
    firstCloudLoad = false;
  }

  // Insert a new row (a normal order or a bill request) into the cache and
  // persist it. Optimistic: the cache updates immediately.
  function insert(record) {
    orders.unshift(record);
    notifyLocal();
    notifyOthers();
    if (CLOUD) {
      sbFetch("/orders", {
        method: "POST",
        headers: sbHeaders({ Prefer: "return=minimal" }),
        body: JSON.stringify({
          ref: record.ref,
          table_number: record.table,
          items: record.items,
          total: record.total,
          note: encodeMeta(record),
          status: record.status,
          placed_at: record.placedAt
        })
      }).then(() => cloudRefresh());
    } else {
      saveOrdersLS();
    }
  }

  // ---------- public API ----------
  const api = {
    STATUS_FLOW,
    isCloud: CLOUD,

    getOrders() {
      return orders.slice();
    },

    addOrder(order) {
      const record = {
        ref: newRef(),
        table: order.table,
        items: order.items,
        total: order.total,
        note: order.note || "",
        guest: order.guest || "",
        device: order.device || "",
        status: "Received",
        placedAt: Date.now()
      };
      insert(record);
      return record;
    },

    // A bill request is stored as a special row: ref prefixed "BILL-",
    // status "Bill requested", carrying the covered order refs and the
    // guest/device it belongs to (a bill is per phone/user, not per table).
    addBill(bill) {
      const record = {
        ref: "BILL-" + Math.random().toString(36).slice(2, 6).toUpperCase(),
        table: bill.table,
        items: bill.items,
        total: bill.total,
        note: "",
        guest: bill.guest || "",
        device: bill.device || "",
        refs: bill.refs,
        status: "Bill requested",
        placedAt: Date.now()
      };
      insert(record);
      return record;
    },

    setStatus(ref, status) {
      const o = orders.find((x) => x.ref === ref);
      if (!o) return;
      o.status = status;
      notifyLocal();
      notifyOthers();
      if (CLOUD) {
        sbFetch("/orders?ref=eq." + encodeURIComponent(ref), {
          method: "PATCH",
          headers: sbHeaders({ Prefer: "return=minimal" }),
          body: JSON.stringify({ status })
        }).then(() => cloudRefresh());
      } else {
        saveOrdersLS();
      }
    },

    advanceStatus(ref) {
      const o = orders.find((x) => x.ref === ref);
      if (!o) return;
      const i = STATUS_FLOW.indexOf(o.status);
      if (i < STATUS_FLOW.length - 1) o.status = STATUS_FLOW[i + 1];
      this.setStatus(ref, o.status);
    },

    clearOrders() {
      orders = [];
      notifyLocal();
      notifyOthers();
      if (CLOUD) {
        sbFetch("/orders?placed_at=gt.0", {
          method: "DELETE",
          headers: sbHeaders({ Prefer: "return=minimal" })
        }).then(() => cloudRefresh());
      } else {
        saveOrdersLS();
      }
    },

    getUnavailable() {
      return unavailable.slice();
    },

    isUnavailable(id) {
      return unavailable.includes(id);
    },

    toggleUnavailable(id) {
      const has = unavailable.includes(id);
      unavailable = has ? unavailable.filter((x) => x !== id) : unavailable.concat(id);
      notifyLocal();
      notifyOthers();
      if (CLOUD) {
        if (has) {
          sbFetch("/unavailable_items?item_id=eq." + encodeURIComponent(id), {
            method: "DELETE",
            headers: sbHeaders({ Prefer: "return=minimal" })
          }).then(() => cloudRefresh());
        } else {
          sbFetch("/unavailable_items", {
            method: "POST",
            headers: sbHeaders({ Prefer: "return=minimal" }),
            body: JSON.stringify({ item_id: id })
          }).then(() => cloudRefresh());
        }
      } else {
        saveAvailLS();
      }
    },

    onChange(cb) {
      listeners.push(cb);
    }
  };

  // ---------- init ----------
  if (CLOUD) {
    cloudRefresh();
    setInterval(cloudRefresh, POLL_MS);
  } else {
    loadFromLS();
  }

  // Same-browser cross-tab updates (used in single-device mode).
  window.addEventListener("storage", (e) => {
    if (!CLOUD && (e.key === ORDERS_KEY || e.key === AVAIL_KEY)) {
      loadFromLS();
      notifyLocal();
    }
  });
  if (channel) {
    channel.onmessage = () => {
      if (!CLOUD) loadFromLS();
      notifyLocal();
    };
  }

  return api;
})();
