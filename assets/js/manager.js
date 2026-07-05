/* Manager dashboard logic. */
(function () {
  const fmt = (n) => n.toLocaleString("en-ZA");
  const OPEN_STATUSES = ["Received", "Preparing", "Ready", "Served"];

  // Re-render everything. Used after our own actions (storage/BroadcastChannel
  // events don't fire in the tab that made the change) and on cross-tab updates.
  function refresh() {
    renderOrders();
    renderMenuManage();
  }

  function timeAgo(ts) {
    const s = Math.floor((Date.now() - ts) / 1000);
    if (s < 60) return s + "s ago";
    const m = Math.floor(s / 60);
    if (m < 60) return m + "m ago";
    const h = Math.floor(m / 60);
    return h + "h ago";
  }

  // ---- Tabs ----
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.onclick = () => {
      document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const name = tab.dataset.tab;
      document.getElementById("tab-orders").hidden = name !== "orders";
      document.getElementById("tab-menu").hidden = name !== "menu";
    };
  });

  // ---- Orders ----
  const grid = document.getElementById("ordersGrid");
  const empty = document.getElementById("ordersEmpty");

  function renderOrders() {
    const orders = Store.getOrders();
    const openCount = orders.filter((o) => OPEN_STATUSES.includes(o.status)).length;
    document.getElementById("openCountBadge").textContent = openCount || "";

    empty.hidden = orders.length > 0;
    grid.innerHTML = "";

    orders.forEach((o) => {
      const card = document.createElement("div");
      card.className = "order-card s-" + o.status;
      const itemsHtml = o.items
        .map((it) => `<li><span>${it.qty}× ${it.name}</span><span>R${fmt(it.qty * it.price)}</span></li>`)
        .join("");

      const idx = Store.STATUS_FLOW.indexOf(o.status);
      const nextLabel = idx < Store.STATUS_FLOW.length - 1 ? "Mark " + Store.STATUS_FLOW[idx + 1] : "Done";
      const isClosed = o.status === "Closed";

      card.innerHTML = `
        <div class="order-top">
          <div>
            <div class="order-table">Table ${o.table}</div>
            <div class="order-ref">${o.ref}</div>
          </div>
          <span class="status-chip s-${o.status}">${o.status}</span>
        </div>
        <ul class="order-items">${itemsHtml}</ul>
        ${o.note ? `<div class="order-note">“${o.note}”</div>` : ""}
        <div class="order-time">${timeAgo(o.placedAt)}</div>
        <div class="order-foot">
          <span class="order-total">R${fmt(o.total)}</span>
        </div>`;

      const foot = card.querySelector(".order-foot");
      if (!isClosed) {
        const advance = document.createElement("button");
        advance.className = "btn btn-gold btn-sm";
        advance.textContent = nextLabel;
        advance.onclick = () => { Store.advanceStatus(o.ref); refresh(); };
        foot.insertBefore(advance, foot.firstChild);
      }
      grid.appendChild(card);
    });
  }

  // ---- Menu availability ----
  function renderMenuManage() {
    const mount = document.getElementById("menuManage");
    mount.innerHTML = "";
    VASCO_MENU.forEach((cat) => {
      const block = document.createElement("div");
      block.className = "mm-cat";
      block.innerHTML = `<h2 class="cat-title">${cat.category}</h2>`;
      cat.items.forEach((item) => {
        const available = !Store.isUnavailable(item.id);
        const row = document.createElement("div");
        row.className = "mm-row";
        row.innerHTML = `
          <div>
            <div class="mm-name">${item.name}</div>
            <div class="mm-price">R${fmt(item.price)}</div>
          </div>
          <label class="switch" title="Toggle availability">
            <input type="checkbox" ${available ? "checked" : ""}>
            <span class="slider"></span>
          </label>`;
        row.querySelector("input").onchange = () => { Store.toggleUnavailable(item.id); refresh(); };
        block.appendChild(row);
      });
      mount.appendChild(block);
    });
  }

  // ---- Controls ----
  document.getElementById("clearBtn").onclick = () => {
    if (confirm("Clear all orders?")) { Store.clearOrders(); refresh(); }
  };

  document.getElementById("seedBtn").onclick = () => {
    const tables = [1, 2, 3, 4, 5, 6];
    const pool = VASCO_MENU.flatMap((c) => c.items);
    const pick = () => pool[Math.floor(Math.random() * pool.length)];
    const items = [];
    let total = 0;
    const n = 1 + Math.floor(Math.random() * 3);
    for (let i = 0; i < n; i++) {
      const it = pick();
      const qty = 1 + Math.floor(Math.random() * 2);
      items.push({ name: it.name, price: it.price, qty });
      total += it.price * qty;
    }
    Store.addOrder({ table: tables[Math.floor(Math.random() * tables.length)], items, total, note: "" });
    refresh();
  };

  // Show whether cross-device cloud sync is on or we're single-device only.
  const sync = document.getElementById("syncStatus");
  if (sync) {
    sync.textContent = Store.isCloud ? "● Live sync on" : "○ Single device";
    sync.style.color = Store.isCloud ? "#6fe39a" : "rgba(247,241,227,0.65)";
  }

  // Refresh on cross-tab changes and tick the "x ago" timers.
  Store.onChange(refresh);
  setInterval(renderOrders, 15000);

  refresh();
})();
