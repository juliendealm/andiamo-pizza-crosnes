# Andiamo Pizza — Crosne

Projet de refonte du site de la pizzeria : catalogue, photographies de présentation, offres, panier local et interface responsive.

## Lancer en local

Depuis le dossier du projet, avec Python 3 :

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Ouvrir http://localhost:4173/. Aucun build ni dépendance JavaScript à installer.

## Organisation

- `index.html` : structure de la page.
- `styles.css`, `refinements.css` : présentation et adaptations mobile.
- `app.js`, `improvements.js` : catalogue, recherche, options et panier.
- `motion.js` : animations avec respect de la préférence de mouvement réduit.
- `data/` : catalogue local issu du site existant.
- `assets/` : images du site, dont les visuels produits générés.
- `VALIDATION-CLIENT.md` : points à confirmer avant la mise en production.

## État du projet

Prototype de présentation : le panier est conservé dans le navigateur. La commande est préparée pour confirmation téléphonique, sans transmission automatique au restaurant ni paiement en ligne. Le WooCommerce du site existant n'est pas connecté à ce projet.

Les recettes, prix, conditions des promotions, informations pratiques et images générées doivent être validés par le restaurant. Les images générées ne sont pas des photographies des produits réellement servis.

## Vérification JavaScript

```sh
node --check app.js
node --check improvements.js
node --check motion.js
```
