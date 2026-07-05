/* Customer ordering page logic. */
(function () {
  const params = new URLSearchParams(location.search);
  const table = params.get("table") || "?";
  const cart = new Map(); // id -> { item, qty }

  document.getElementById("tablePill").textContent = "Table " + table;
  document.getElementById("drawerTable").textContent = "Table " + table;

  const fmt = (n) => n.toLocaleString("en-ZA");

  // ---- Build category nav + menu ----
  const nav = document.getElementById("catNav");
  const menu = document.getElementById("menu");

  function slug(s) { return s.toLowerCase().replace(/[^a-z]+/g, "-"); }

  function renderMenu() {
    nav.innerHTML = "";
    menu.innerHTML = "";
    VASCO_MENU.forEach((cat) => {
      const id = slug(cat.category);
      const a = document.createElement("a");
      a.href = "#" + id;
      a.textContent = cat.category;
      nav.appendChild(a);

      const section = document.createElement("section");
      section.id = id;
      section.innerHTML =
        `<h2 class="cat-title">${cat.category}</h2>` +
        (cat.note ? `<p class="cat-note">${cat.note}</p>` : "");

      cat.items.forEach((item) => {
        const out = Store.isUnavailable(item.id);
        const row = document.createElement("div");
        row.className = "menu-item" + (out ? " unavail" : "");
        row.innerHTML = `
          <div class="info">
            <div class="name">${item.name}${out ? '<span class="tag-out">Sold out</span>' : ""}</div>
            ${item.desc ? `<div class="desc">${item.desc}</div>` : ""}
            <div class="price">R${fmt(item.price)}</div>
          </div>
          <div class="item-right"></div>`;
        section.appendChild(row);
        renderControl(row.querySelector(".item-right"), item, out);
      });
      menu.appendChild(section);
    });
  }

  function renderControl(mount, item, out) {
    mount.innerHTML = "";
    if (out) return;
    const entry = cart.get(item.id);
    if (!entry) {
      const btn = document.createElement("button");
      btn.className = "btn btn-ghost btn-sm";
      btn.textContent = "+ Add";
      btn.onclick = () => { changeQty(item, 1); };
      mount.appendChild(btn);
    } else {
      const stepper = document.createElement("div");
      stepper.className = "stepper";
      stepper.innerHTML = `<button aria-label="less">−</button><span class="qty">${entry.qty}</span><button aria-label="more">+</button>`;
      const [minus, , plus] = stepper.children;
      minus.onclick = () => changeQty(item, -1);
      plus.onclick = () => changeQty(item, 1);
      mount.appendChild(stepper);
    }
  }

  function changeQty(item, delta) {
    const entry = cart.get(item.id) || { item, qty: 0 };
    entry.qty += delta;
    if (entry.qty <= 0) cart.delete(item.id);
    else cart.set(item.id, entry);
    renderMenu();      // re-render so steppers reflect state
    renderCart();
  }

  // ---- Cart ----
  const cartbar = document.getElementById("cartbar");
  const drawer = document.getElementById("drawer");
  const backdrop = document.getElementById("backdrop");

  function cartTotals() {
    let count = 0, total = 0;
    cart.forEach((e) => { count += e.qty; total += e.qty * e.item.price; });
    return { count, total };
  }

  function renderCart() {
    const { count, total } = cartTotals();
    document.getElementById("cartCount").textContent = count;
    document.getElementById("cartbarTotal").textContent = fmt(total);
    document.getElementById("grandTotal").textContent = fmt(total);
    cartbar.classList.toggle("show", count > 0);

    const box = document.getElementById("cartItems");
    if (count === 0) {
      box.innerHTML = '<div class="cart-empty">Your order is empty.<br>Add something tasty from the menu.</div>';
      document.getElementById("placeOrder").disabled = true;
      return;
    }
    document.getElementById("placeOrder").disabled = false;
    box.innerHTML = "";
    cart.forEach((e) => {
      const row = document.createElement("div");
      row.className = "cart-row";
      row.innerHTML = `
        <div class="cinfo">
          <div class="cname">${e.item.name}</div>
          <div class="cprice">R${fmt(e.item.price)} each</div>
        </div>
        <div class="stepper">
          <button aria-label="less">−</button><span class="qty">${e.qty}</span><button aria-label="more">+</button>
        </div>
        <div class="cprice" style="min-width:56px;text-align:right;font-weight:700;color:var(--navy)">R${fmt(e.qty * e.item.price)}</div>`;
      const [minus, , plus] = row.querySelector(".stepper").children;
      minus.onclick = () => changeQty(e.item, -1);
      plus.onclick = () => changeQty(e.item, 1);
      box.appendChild(row);
    });
  }

  function openDrawer() { drawer.classList.add("show"); backdrop.classList.add("show"); }
  function closeDrawer() { drawer.classList.remove("show"); backdrop.classList.remove("show"); }
  document.getElementById("openCart").onclick = openDrawer;
  document.getElementById("closeCart").onclick = closeDrawer;
  backdrop.onclick = closeDrawer;

  // ---- Place order ----
  function toast(msg) {
    const t = document.getElementById("toast");
    t.textContent = msg;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 2600);
  }

  document.getElementById("placeOrder").onclick = () => {
    const { count, total } = cartTotals();
    if (count === 0) return;
    const items = [];
    cart.forEach((e) => items.push({ name: e.item.name, price: e.item.price, qty: e.qty }));
    const rec = Store.addOrder({
      table,
      items,
      total,
      note: document.getElementById("orderNote").value.trim()
    });
    cart.clear();
    document.getElementById("orderNote").value = "";
    renderMenu();
    renderCart();
    closeDrawer();
    toast(`Order ${rec.ref} sent to the kitchen! 🍤`);
  };

  // Re-render menu if manager toggles availability in another tab.
  Store.onChange(renderMenu);

  renderMenu();
  renderCart();
})();
