// NAVBAR: mobile menu
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// CART LOGIC
const cartBtn = document.getElementById("cartBtn");
const cartPanel = document.getElementById("cartPanel");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");
const cartCount = document.getElementById("cartCount");
const cartItemsContainer = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

let cart = [];

function openCart() {
  cartPanel.classList.add("open");
  cartOverlay.classList.add("show");
}

function closeCartPanel() {
  cartPanel.classList.remove("open");
  cartOverlay.classList.remove("show");
}

cartBtn.addEventListener("click", openCart);
closeCart.addEventListener("click", closeCartPanel);
cartOverlay.addEventListener("click", closeCartPanel);

function updateCartUI() {
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
    cartCount.textContent = "0";
    cartTotal.textContent = "₹0";
    return;
  }

  let total = 0;
  let count = 0;

  cart.forEach(item => {
    total += item.price * item.qty;
    count += item.qty;

    const row = document.createElement("div");
    row.classList.add("cart-item");

    row.innerHTML = `
      <div>
        <span class="cart-item-title">${item.name}</span>
        <span>₹${item.price}</span>
      </div>
      <div class="cart-item-controls">
        <button class="qty-btn" data-action="dec">-</button>
        <span>${item.qty}</span>
        <button class="qty-btn" data-action="inc">+</button>
      </div>
    `;

    const [decBtn, qtySpan, incBtn] = row.querySelectorAll(".qty-btn, span:nth-child(2)");

    row.querySelectorAll(".qty-btn")[0].addEventListener("click", () => {
      changeQty(item.name, -1);
    });

    row.querySelectorAll(".qty-btn")[1].addEventListener("click", () => {
      changeQty(item.name, 1);
    });

    cartItemsContainer.appendChild(row);
  });

  cartCount.textContent = count;
  cartTotal.textContent = "₹" + total;
}

function changeQty(name, delta) {
  cart = cart
    .map(item => {
      if (item.name === name) {
        return { ...item, qty: item.qty + delta };
      }
      return item;
    })
    .filter(item => item.qty > 0);

  updateCartUI();
}

// ADD TO CART buttons
document.querySelectorAll(".add-to-cart").forEach(btn => {
  btn.addEventListener("click", (e) => {
    const card = e.target.closest(".product-card");
    const name = card.dataset.name;
    const price = parseInt(card.dataset.price, 10);

    const existing = cart.find(item => item.name === name);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ name, price, qty: 1 });
    }
    updateCartUI();
  });
});

// FILTERING
const filterButtons = document.querySelectorAll(".filter-btn");
const productCards = document.querySelectorAll(".product-card");

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const filter = btn.dataset.filter;

    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    productCards.forEach(card => {
      const category = card.dataset.category;
      if (filter === "all" || category === filter) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    });
  });
});

// SEARCH
const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", (e) => {
  const term = e.target.value.toLowerCase();

  productCards.forEach(card => {
    const name = card.dataset.name.toLowerCase();
    if (name.includes(term)) {
      card.style.display = "flex";
    } else {
      card.style.display = "none";
    }
  });
});
