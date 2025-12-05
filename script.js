// script.js - minimal cart functionality for demo (no backend)

document.addEventListener("DOMContentLoaded", () => {
  const addBtns = document.querySelectorAll(".add-to-cart");
  const cartToggle = document.getElementById("cartToggle");
  const cartPanel = document.getElementById("cartPanel");
  const closeCart = document.getElementById("closeCart");
  const cartCountEl = document.getElementById("cartCount");
  const cartItemsEl = document.getElementById("cartItems");
  const cartSubtotalEl = document.getElementById("cartSubtotal");
  const clearCartBtn = document.getElementById("clearCart");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const checkoutModal = document.getElementById("checkoutModal");
  const closeCheckout = document.getElementById("closeCheckout");
  const checkoutAmount = document.getElementById("checkoutAmount");
  const checkoutForm = document.getElementById("checkoutForm");
  const yearEl = document.getElementById("year");

  yearEl.textContent = new Date().getFullYear();

  let cart = {}; // {id: {id,name,price,qty,img}}

  // Helpers
  function format(n) {
    return "$" + Number(n).toFixed(2);
  }
  function updateCartCount() {
    const totalQty = Object.values(cart).reduce((s, i) => s + i.qty, 0);
    cartCountEl.textContent = totalQty;
  }
  function updateSubtotal() {
    const subtotal = Object.values(cart).reduce(
      (s, i) => s + i.price * i.qty,
      0
    );
    cartSubtotalEl.textContent = format(subtotal);
    checkoutAmount.textContent = format(subtotal);
  }
  function renderCart() {
    cartItemsEl.innerHTML = "";
    const items = Object.values(cart);
    if (items.length === 0) {
      cartItemsEl.innerHTML =
        '<p class="empty-message">Your cart is empty.</p>';
      updateCartCount();
      updateSubtotal();
      return;
    }
    items.forEach((it) => {
      const div = document.createElement("div");
      div.className = "cart-item";
      div.innerHTML = `
        <img src="${it.img}" alt="${escapeHtml(it.name)}" />
        <div class="meta">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <strong>${escapeHtml(it.name)}</strong>
            <span style="font-weight:800">${format(it.price)}</span>
          </div>
          <div class="qty-control">
            <button data-id="${it.id}" class="qty-decr">−</button>
            <span style="min-width:26px;text-align:center">${it.qty}</span>
            <button data-id="${it.id}" class="qty-incr">+</button>
            <button data-id="${
              it.id
            }" class="remove" style="margin-left:auto">Remove</button>
          </div>
        </div>
      `;
      cartItemsEl.appendChild(div);
    });
    // attach listeners
    cartItemsEl.querySelectorAll(".qty-incr").forEach((b) => {
      b.addEventListener("click", (e) => {
        const id = e.currentTarget.dataset.id;
        cart[id].qty++;
        renderCart();
        updateCartCount();
        updateSubtotal();
      });
    });
    cartItemsEl.querySelectorAll(".qty-decr").forEach((b) => {
      b.addEventListener("click", (e) => {
        const id = e.currentTarget.dataset.id;
        cart[id].qty = Math.max(1, cart[id].qty - 1);
        renderCart();
        updateCartCount();
        updateSubtotal();
      });
    });
    cartItemsEl.querySelectorAll(".remove").forEach((b) => {
      b.addEventListener("click", (e) => {
        const id = e.currentTarget.dataset.id;
        delete cart[id];
        renderCart();
        updateCartCount();
        updateSubtotal();
      });
    });

    updateCartCount();
    updateSubtotal();
  }

  // Escape helper
  function escapeHtml(str) {
    return String(str).replace(
      /[&<>"']/g,
      (m) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        }[m])
    );
  }

  // Add-to-cart click handlers
  addBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const card = e.currentTarget.closest(".product-card");
      const id = card.dataset.id;
      const name = card.dataset.name;
      const price = parseFloat(card.dataset.price);
      const img =
        card.querySelector("img")?.src || "https://via.placeholder.com/120";
      if (cart[id]) cart[id].qty++;
      else cart[id] = { id, name, price, qty: 1, img };
      renderCart();
      // open cart
      openCart();
    });
  });

  // Cart open/close
  function openCart() {
    cartPanel.classList.add("open");
    cartPanel.setAttribute("aria-hidden", "false");
    cartToggle.setAttribute("aria-expanded", "true");
  }
  function closeCartPanel() {
    cartPanel.classList.remove("open");
    cartPanel.setAttribute("aria-hidden", "true");
    cartToggle.setAttribute("aria-expanded", "false");
  }

  cartToggle.addEventListener("click", () => {
    if (cartPanel.classList.contains("open")) closeCartPanel();
    else openCart();
  });
  closeCart.addEventListener("click", closeCartPanel);

  // Clear cart
  clearCartBtn.addEventListener("click", () => {
    cart = {};
    renderCart();
  });

  // Checkout
  checkoutBtn.addEventListener("click", () => {
    if (Object.keys(cart).length === 0) {
      alert("Your cart is empty.");
      return;
    }
    checkoutModal.setAttribute("aria-hidden", "false");
    checkoutModal.style.visibility = "visible";
    checkoutModal.style.opacity = 1;
  });
  closeCheckout.addEventListener("click", () => {
    checkoutModal.setAttribute("aria-hidden", "true");
    checkoutModal.style.visibility = "hidden";
    checkoutModal.style.opacity = 0;
  });

  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();
    // Demo: show summary and reset cart
    const subtotal = Object.values(cart).reduce(
      (s, i) => s + i.price * i.qty,
      0
    );
    alert("Order placed (demo). Amount: " + format(subtotal) + "\nThank you!");
    cart = {};
    renderCart();
    closeCheckout.click();
    closeCartPanel();
  });

  // init
  renderCart();
});
