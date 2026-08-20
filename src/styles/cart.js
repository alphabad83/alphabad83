/* Panier Alphabad 83 — stocké dans le navigateur du visiteur (localStorage).
   Ne contient jamais de données bancaires : uniquement des identifiants de
   prix Stripe, des noms de produits et des quantités. Le paiement réel se
   passe entièrement sur les pages sécurisées de Stripe. */

const CART_KEY = "alphabad83_panier";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(item) {
  const cart = getCart();
  const existing = cart.find((i) => i.priceId === item.priceId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }
  saveCart(cart);
}

function removeFromCart(priceId) {
  saveCart(getCart().filter((i) => i.priceId !== priceId));
}

function setQuantity(priceId, quantity) {
  const cart = getCart();
  const item = cart.find((i) => i.priceId === priceId);
  if (item) {
    item.quantity = Math.max(1, Math.min(20, parseInt(quantity, 10) || 1));
  }
  saveCart(cart);
}

function cartCount() {
  return getCart().reduce((total, i) => total + i.quantity, 0);
}

function updateCartBadge() {
  document.querySelectorAll("[data-cart-count]").forEach((el) => {
    const count = cartCount();
    el.textContent = count;
    el.style.display = count > 0 ? "inline-flex" : "none";
  });
}

async function startCheckout(items, options) {
  options = options || {};
  const button = options.button;
  if (button) {
    button.disabled = true;
    button.dataset.originalText = button.textContent;
    button.textContent = "Redirection vers le paiement…";
  }
  try {
    const res = await fetch("/.netlify/functions/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((i) => ({ priceId: i.priceId, quantity: i.quantity })),
        successPath: options.successPath,
        cancelPath: options.cancelPath,
      }),
    });
    const data = await res.json();
    if (!res.ok || !data.url) {
      throw new Error(data.error || "Le paiement n'a pas pu démarrer.");
    }
    window.location.href = data.url;
  } catch (err) {
    alert(err.message || "Une erreur est survenue, merci de réessayer.");
    if (button) {
      button.disabled = false;
      button.textContent = button.dataset.originalText;
    }
  }
}

function renderCartPage() {
  const root = document.querySelector("[data-cart-root]");
  if (!root) return;
  const cart = getCart();

  if (cart.length === 0) {
    root.innerHTML =
      '<p>Votre panier est vide. <a href="/boutique/">Retourner à la boutique →</a></p>';
    return;
  }

  const rows = cart
    .map(
      (item) => `
      <tr>
        <td>${item.nom}</td>
        <td>${item.prixAffiche || ""}</td>
        <td>
          <input type="number" min="1" max="20" value="${item.quantity}"
            data-qty="${item.priceId}"
            style="width:4.5rem;padding:0.4em;border:1px solid var(--line);font-family:var(--font-mono)">
        </td>
        <td><button type="button" class="btn btn--dark" data-remove="${item.priceId}" style="padding:0.4em 0.8em;font-size:0.8rem">Retirer</button></td>
      </tr>`
    )
    .join("");

  root.innerHTML = `
    <table class="creneaux-table">
      <thead><tr><th>Article</th><th>Prix unitaire</th><th>Quantité</th><th></th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="hero__actions" style="margin-top:2rem">
      <button type="button" class="btn btn--primary" id="checkout-btn">Payer avec Stripe</button>
      <a href="/boutique/" class="btn btn--dark">Continuer mes achats</a>
    </div>
  `;

  root.querySelectorAll("[data-qty]").forEach((input) => {
    input.addEventListener("change", (e) => {
      setQuantity(e.target.dataset.qty, e.target.value);
      renderCartPage();
    });
  });
  root.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      removeFromCart(e.target.dataset.remove);
      renderCartPage();
    });
  });
  document.getElementById("checkout-btn").addEventListener("click", (e) => {
    startCheckout(getCart(), { button: e.target });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();

  document.querySelectorAll("[data-add-to-cart]").forEach((btn) => {
    btn.addEventListener("click", () => {
      addToCart({
        priceId: btn.dataset.priceId,
        nom: btn.dataset.nom,
        prixAffiche: btn.dataset.prix,
      });
      btn.textContent = "Ajouté ✓";
      setTimeout(() => (btn.textContent = "Ajouter au panier"), 1200);
    });
  });

  document.querySelectorAll("[data-buy-now]").forEach((btn) => {
    btn.addEventListener("click", () => {
      startCheckout(
        [{ priceId: btn.dataset.priceId, quantity: 1 }],
        { button: btn, successPath: btn.dataset.successPath, cancelPath: btn.dataset.cancelPath }
      );
    });
  });

  renderCartPage();
});
