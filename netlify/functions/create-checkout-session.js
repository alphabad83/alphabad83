// Cette fonction s'exécute côté serveur (jamais dans le navigateur du client).
// Elle crée une session de paiement Stripe à partir du panier envoyé par le site,
// puis renvoie l'URL de la page de paiement sécurisée hébergée par Stripe.
//
// Nécessite la variable d'environnement STRIPE_SECRET_KEY, définie dans
// Netlify (Site configuration → Environment variables) — jamais dans le code.

const Stripe = require("stripe");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Le paiement n'est pas encore configuré (clé Stripe manquante côté serveur).",
      }),
    };
  }

  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const { items, successPath, cancelPath } = JSON.parse(event.body || "{}");

    if (!Array.isArray(items) || items.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Le panier est vide." }),
      };
    }

    // On ne fait confiance qu'aux identifiants de prix Stripe et aux quantités,
    // jamais à un montant envoyé par le navigateur.
    const line_items = items.map((item) => ({
      price: String(item.priceId),
      quantity: Math.min(20, Math.max(1, parseInt(item.quantity, 10) || 1)),
    }));

    const origin = event.headers.origin || `https://${event.headers.host}`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      locale: "fr",
      success_url: `${origin}${successPath || "/boutique/merci/"}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}${cancelPath || "/boutique/annule/"}`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Impossible de démarrer le paiement. " + err.message }),
    };
  }
};
