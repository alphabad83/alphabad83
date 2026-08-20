# Site Alphabad 83

Site du club **Alphabad 83 — Association de badminton du Canton de Fayence**.

Ce site est construit pour être **modifié sans écrire une ligne de code**, via une page d'administration (`/admin`) qui ressemble à un formulaire. Une fois en ligne, vous n'aurez plus jamais besoin d'ouvrir un fichier de code pour changer un texte, un horaire ou publier une actualité.

---

## 1. Ce que vous avez entre les mains

- Un site déjà écrit et prêt (pages : Accueil, Le club, Créneaux & tarifs, Actualités, Tournois, Contact)
- Une page `/admin` avec des formulaires pour tout modifier
- Un formulaire de contact déjà fonctionnel (via Netlify, sans service tiers à payer)

Il vous reste **une seule chose technique à faire une fois** : mettre ces fichiers en ligne. Ensuite, tout se passe dans le navigateur, à la souris.

---

## 2. Mise en ligne (à faire une seule fois, ~20 minutes)

Vous aurez besoin de deux comptes **gratuits** :
- [github.com](https://github.com) — héberge les fichiers du site
- [netlify.com](https://www.netlify.com) — construit et publie le site automatiquement

### Étape 1 — Créer le dépôt GitHub

1. Créez un compte sur github.com si vous n'en avez pas.
2. Cliquez sur **New repository**, nommez-le `alphabad83`, laissez-le en **Public** ou **Private**, ne cochez rien d'autre, cliquez **Create repository**.
3. Sur votre ordinateur, dans le dossier de ce projet, ouvrez un terminal et tapez :
   ```
   git init
   git add .
   git commit -m "Premier envoi du site Alphabad 83"
   git branch -M main
   git remote add origin https://github.com/VOTRE-NOM-UTILISATEUR/alphabad83.git
   git push -u origin main
   ```
   (Remplacez `VOTRE-NOM-UTILISATEUR` par votre identifiant GitHub. Si vous n'êtes pas à l'aise avec le terminal, GitHub propose aussi un glisser-déposer des fichiers directement depuis le site web — cherchez "uploading an existing project to GitHub".)

### Étape 2 — Connecter Netlify

1. Créez un compte sur netlify.com (vous pouvez vous connecter directement avec votre compte GitHub).
2. Cliquez **Add new site → Import an existing project**.
3. Choisissez **GitHub**, autorisez l'accès, puis sélectionnez le dépôt `alphabad83`.
4. Netlify détecte automatiquement les réglages (grâce au fichier `netlify.toml` déjà inclus) :
   - Build command : `npm run build`
   - Publish directory : `_site`
5. Cliquez **Deploy site**. Au bout d'une ou deux minutes, votre site est en ligne sur une adresse du type `nom-au-hasard.netlify.app`.
6. Vous pouvez renommer cette adresse dans **Site configuration → Domain management → Options → Edit site name**, par exemple en `alphabad83.netlify.app`. Un nom de domaine personnalisé (ex. `alphabad83.fr`) peut être branché plus tard depuis le même endroit.

### Étape 3 — Activer la page d'administration `/admin`

La page `/admin` a besoin de deux réglages Netlify pour fonctionner (une seule fois) :

1. Dans votre site Netlify, allez dans **Site configuration → Identity**, cliquez **Enable Identity**.
2. Toujours dans Identity, section **Registration** : choisissez **Invite only** (recommandé, pour que seules les personnes que vous invitez puissent se connecter à l'admin).
3. Descendez à **Services → Git Gateway**, cliquez **Enable Git Gateway**.
4. Remontez en haut de la page Identity, cliquez **Invite users**, entrez votre e-mail (et celui des autres personnes du bureau qui géreront le site). Chacun reçoit un e-mail pour créer son mot de passe.
5. Rendez-vous sur `https://VOTRE-SITE.netlify.app/admin/`, connectez-vous : vous voici dans l'interface d'administration.

C'est tout. Ce réglage ne se refait plus jamais.

---

## 3. Utiliser l'administration au quotidien

Rendez-vous sur `https://VOTRE-SITE.netlify.app/admin/` et connectez-vous. Vous trouverez, dans le menu de gauche :

- **Réglages du club → Informations générales** : nom, description, e-mail, téléphone, adresse, communes du canton, réseaux sociaux
- **Réglages du club → Bureau / comité** : ajouter/modifier/supprimer les membres du bureau, avec photo
- **Réglages du club → Créneaux d'entraînement** : jours, horaires, lieux, public visé
- **Réglages du club → Tarifs d'adhésion** : catégories et prix
- **Actualités** : publier une nouvelle actualité (bouton "New Actualités")
- **Tournois & interclubs** : publier un nouveau tournoi

Chaque modification se fait dans un formulaire classique (champs de texte, listes, images à glisser-déposer). En cliquant **Publish**, le site se reconstruit automatiquement et la modification est en ligne en 1 à 2 minutes — sans jamais toucher au code.

---

## 4. Personnaliser l'identité visuelle

- **Logo / favicon** : remplacez `src/images/favicon.svg` par votre propre logo (idéalement un carré).
- **Photos du bureau** : à ajouter directement depuis `/admin` (elles sont automatiquement enregistrées dans `src/images/uploads`).
- **Couleurs et typographies** : tout est centralisé en haut du fichier `src/styles/main.css`, dans le bloc `:root`. Si vous voulez faire évoluer l'identité plus tard, un développeur (ou moi) peut ajuster ces variables sans toucher au reste du site.

---

## 5. Activer la boutique et la billetterie (paiement Stripe)

Le site inclut une boutique (`/boutique/`) et la possibilité de vendre des inscriptions à un tournoi directement depuis sa page. Les paiements passent par **Stripe**, qui héberge lui-même la page de paiement : aucune donnée bancaire ne transite jamais par votre site.

### Étape 1 — Créer le compte Stripe

1. Créez un compte sur [stripe.com](https://stripe.com), avec les informations de l'association (SIRET, RIB pour les virements).
2. Stripe vous demandera une vérification d'identité classique avant de pouvoir encaisser en argent réel — comptez quelques jours. En attendant, vous pouvez tout tester en **mode test** (aucun compte réel débité).

### Étape 2 — Créer vos produits dans Stripe

1. Dans le tableau de bord Stripe, allez dans **Produits → Ajouter un produit**.
2. Renseignez le nom (ex. "Maillot du club"), une image, et le prix.
3. Une fois enregistré, ouvrez la fiche du produit et copiez l'**identifiant de prix**, qui ressemble à `price_1AbCdEfGhIjKlMnOpQrStUv`.
4. Répétez pour chaque produit de la boutique, et pour chaque tournoi avec inscription payante en ligne.

### Étape 3 — Relier vos produits au site, depuis `/admin`

1. Rendez-vous sur `/admin` → **Boutique → Produits en vente**.
2. Pour chaque produit : renseignez le nom, la description, le prix affiché, collez l'**identifiant de prix Stripe** copié à l'étape précédente, ajoutez une photo, puis cochez **En vente actuellement**.
3. Pour un tournoi payant : ouvrez l'annonce du tournoi dans **Tournois & interclubs**, renseignez **Prix d'inscription affiché** et **Identifiant de prix Stripe**. Un bouton "S'inscrire et payer" apparaît alors automatiquement sur la page du tournoi.

### Étape 4 — Connecter la clé secrète Stripe à Netlify (une seule fois)

C'est la seule étape technique, à faire une fois, par vous ou une personne à l'aise avec ce type de réglage :

1. Dans Stripe, allez dans **Développeurs → Clés API**, copiez la **clé secrète** (commence par `sk_live_...`, ou `sk_test_...` pour tester).
2. Dans Netlify, allez dans **Site configuration → Environment variables → Add a variable**.
3. Nom de la variable : `STRIPE_SECRET_KEY`. Valeur : la clé copiée à l'étape 1.
4. Redéployez le site (**Deploys → Trigger deploy**) pour que la variable soit prise en compte.

Tant que cette clé n'est pas configurée, les boutons de paiement affichent un message d'erreur clair plutôt que de planter silencieusement.

### Bon à savoir

- Stripe prélève environ 1,5 % + 0,25 € par paiement par carte européenne (pas d'abonnement, pas de frais fixes).
- Les pages **Mentions légales** (`/mentions-legales/`) et **CGV** (`/cgv/`) sont déjà en place et reliées en pied de page. Complétez leurs informations (numéro RNA, éventuel SIRET, nom du représentant légal) depuis `/admin` → **Informations légales**, et faites-les relire avant l'ouverture de la boutique — je ne suis pas juriste, ce sont des modèles standards à valider. Le point à vérifier en priorité : la désignation d'un médiateur de la consommation (obligatoire pour tout vendeur en ligne), signalée en bas de la page CGV tant qu'elle n'est pas renseignée.
- Le panier de la boutique est stocké dans le navigateur du visiteur (pas sur un serveur) : il est vidé automatiquement après un paiement réussi.

---

## 6. Travailler en local (optionnel, pour les curieux)

Si vous voulez prévisualiser le site sur votre ordinateur avant de le mettre en ligne :

```
npm install
npm start
```

Le site est alors visible sur `http://localhost:8080`. Pour tester l'administration en local, installez en plus `netlify-cli` (`npm install -g netlify-cli`, puis `netlify dev`) — non indispensable pour l'usage quotidien.

---

## 7. Structure du projet (pour référence)

```
src/
  _data/            → toutes les données modifiables (club, bureau, créneaux, tarifs, boutique)
  _includes/        → gabarits communs (en-tête, pied de page, mise en page)
  actualites/       → articles d'actualité (générés aussi depuis /admin)
  tournois/         → annonces de tournois, avec billetterie Stripe optionnelle
  boutique/         → pages boutique, panier, confirmation/annulation de paiement
  admin/            → la page d'administration et sa configuration (config.yml)
  styles/           → feuille de style, menu mobile, panier
  images/           → logo, favicon, photos
netlify/functions/  → la fonction serveur qui crée le paiement Stripe (le seul vrai "code")
```

---

## Une différence importante avec MyBadAss (le site du BTM83)

Le site du BTM83 est construit sur **MyBadAss**, une plateforme payante dédiée aux clubs de badminton (calendrier de compétitions FFBaD synchronisé, gestion d'adhésions intégrée, etc.). Ce site-ci reprend la même logique de structure (accueil, présentation du club, créneaux, actualités, tournois, contact) et vous offre une édition tout aussi simple, mais en gratuit et open-source. Si votre club grandit et a besoin de fonctionnalités plus poussées (paiement en ligne des licences, synchronisation FFBaD automatique), ce sera le moment d'évaluer une plateforme comme MyBadAss.
