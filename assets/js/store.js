/*
 * Vasco ordering prototype — shared client-side store.
 *
 * There is NO backend. Orders and menu availability live in localStorage,
 * so the customer page and the manager dashboard share state as long as
 * they run in the same browser. A BroadcastChannel pushes live updates
 * between open tabs/windows (e.g. manager dashboard + customer order).
 */
const Store = (function () {
  const ORDERS_KEY = "vasco_orders_v1";
  const AVAIL_KEY = "vasco_unavailable_v1";
  const channel = "BroadcastChannel" in window ? new BroadcastChannel("vasco") : null;

  // Received -> Preparing -> Ready -> Served -> Closed
  const STATUS_FLOW = ["Received", "Preparing", "Ready", "Served", "Closed"];

  function read(key) {
    try {
      return JSON.parse(localStorage.getItem(key)) || null;
    } catch (e) {
      return null;
    }
  }

  function notify() {
    if (channel) channel.postMessage({ type: "update", t: Date.now() });
  }

  return {
    STATUS_FLOW,

    getOrders() {
      return read(ORDERS_KEY) || [];
    },

    addOrder(order) {
      const orders = this.getOrders();
      const ref =
        "V" +
        Math.random().toString(36).slice(2, 5).toUpperCase() +
        (orders.length + 1);
      const record = {
        ref,
        table: order.table,
        items: order.items,
        total: order.total,
        note: order.note || "",
        status: "Received",
        placedAt: Date.now()
      };
      orders.unshift(record);
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
      notify();
      return record;
    },

    setStatus(ref, status) {
      const orders = this.getOrders();
      const o = orders.find((x) => x.ref === ref);
      if (o) o.status = status;
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
      notify();
    },

    advanceStatus(ref) {
      const orders = this.getOrders();
      const o = orders.find((x) => x.ref === ref);
      if (o) {
        const i = STATUS_FLOW.indexOf(o.status);
        if (i < STATUS_FLOW.length - 1) o.status = STATUS_FLOW[i + 1];
      }
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
      notify();
    },

    clearOrders() {
      localStorage.removeItem(ORDERS_KEY);
      notify();
    },

    getUnavailable() {
      return read(AVAIL_KEY) || [];
    },

    isUnavailable(id) {
      return this.getUnavailable().includes(id);
    },

    toggleUnavailable(id) {
      const set = new Set(this.getUnavailable());
      if (set.has(id)) set.delete(id);
      else set.add(id);
      localStorage.setItem(AVAIL_KEY, JSON.stringify([...set]));
      notify();
    },

    // Fires cb() whenever another tab changes orders/availability.
    onChange(cb) {
      window.addEventListener("storage", (e) => {
        if (e.key === ORDERS_KEY || e.key === AVAIL_KEY) cb();
      });
      if (channel) channel.onmessage = () => cb();
    }
  };
})();
