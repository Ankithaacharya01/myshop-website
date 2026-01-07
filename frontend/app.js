/* ================= REGISTER ================= */
function register() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  fetch("http://localhost:5000/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message || "Registered successfully");
      window.location.href = "login.html";
    });
}

/* ================= LOGIN ================= */
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  fetch("http://localhost:5000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
    .then(res => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .then(user => {
      localStorage.setItem("user", JSON.stringify(user));
      window.location.href = "index.html";
    })
    .catch(() => alert("Invalid login"));
}

/* ================= LOGOUT ================= */
function logout() {
  localStorage.removeItem("user");
  alert("Logged out successfully");
  window.location.href = "index.html";
}

/* ================= HEADER LOGIN CHECK ================= */
function checkLogin() {
  const user = JSON.parse(localStorage.getItem("user"));

  const loginLink = document.getElementById("loginLink");
  const registerLink = document.getElementById("registerLink");
  const logoutLink = document.getElementById("logoutLink");
  const userName = document.getElementById("userName");
  const ordersLink = document.getElementById("ordersLink");

  if (!loginLink) return; // page without header

  if (user) {
    loginLink.style.display = "none";
    registerLink.style.display = "none";

    logoutLink.style.display = "inline";
    if (ordersLink) ordersLink.style.display = "inline";

    userName.style.display = "inline";
    userName.innerText = `Hello, ${user.name}`;
  } else {
    loginLink.style.display = "inline";
    registerLink.style.display = "inline";

    logoutLink.style.display = "none";
    if (ordersLink) ordersLink.style.display = "none";

    userName.style.display = "none";
  }
}

/* ================= PRODUCTS ================= */
const productDiv = document.getElementById("products");

if (productDiv) {
  fetch("http://localhost:5000/products")
    .then(res => res.json())
    .then(products => {
      productDiv.innerHTML = "";

      products.forEach(p => {
        productDiv.innerHTML += `
          <div class="product-card">
            <img src="${p.image}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p>₹${p.price}</p>
            <button onclick="addToCart('${p._id}')">Add to Cart</button>
          </div>
        `;
      });
    });
}

/* ================= ADD TO CART ================= */
function addToCart(productId) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    alert("Please login to add items to cart");
    window.location.href = "login.html";
    return;
  }

  fetch("http://localhost:5000/products")
    .then(res => res.json())
    .then(products => {
      const product = products.find(p => p._id === productId);
      if (!product) return;

      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      const existing = cart.find(item => item._id === productId);

      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ ...product, qty: 1 });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      alert("Product added to cart 🛒");
    });
}

/* ================= LOAD CART ================= */
function loadCart() {
  const cartDiv = document.getElementById("cart");
  if (!cartDiv) return;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cartDiv.innerHTML = "";

  if (cart.length === 0) {
    cartDiv.innerHTML = "<p>Your cart is empty 🛒</p>";
    return;
  }

  let total = 0;

  cart.forEach(item => {
    total += item.price * item.qty;

    cartDiv.innerHTML += `
      <div class="cart-item">
        <h4>${item.name} × ${item.qty}</h4>
        <span>₹${item.price * item.qty}</span>
      </div>
    `;
  });

  cartDiv.innerHTML += `<h3>Total: ₹${total}</h3>`;
}

/* ================= PLACE ORDER ================= */
function placeOrder() {
  const user = JSON.parse(localStorage.getItem("user"));
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (!user) {
    alert("Please login to place order");
    window.location.href = "login.html";
    return;
  }

  if (cart.length === 0) {
    alert("Your cart is empty");
    return;
  }

  localStorage.removeItem("cart");
  alert("Order placed successfully ✅");
  window.location.href = "orders.html";
}
