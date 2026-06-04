# D.E.B TOUT CORPS — Landing

Site web premium de **D.E.B TOUT CORPS**, entreprise française de bâtiment spécialisée dans la rénovation complète (électricité, plomberie, carrelage, parquet, peinture, ponçage).

**Production:** [https://deb-tout.com](https://deb-tout.com)

## Stack technique

- **Astro 6** (mode `server` / SSR) avec Node adapter en mode `standalone`
- **Tailwind CSS v4** (config CSS, pas de `tailwind.config.js`)
- **TypeScript** strict
- **i18n** personnalisé FR/ES (route préfixée : `/fr/...`, `/es/...`)
- **Resend** pour l'envoi du formulaire de contact
- **Font:** Inter (Google Fonts)

## Prérequis

- Node.js `>=22.12.0`
- pnpm

## Démarrage

```bash
pnpm install
cp .env.example .env.local      # éditer avec les vraies valeurs
pnpm dev                         # http://localhost:4321
```

## Build de production

```bash
pnpm install --frozen-lockfile
pnpm build                       # produit dist/server/entry.mjs + dist/client/
```

Lancer le serveur Node en standalone :

```bash
node --env-file=.env ./dist/server/entry.mjs
```

Le serveur écoute par défaut sur `http://0.0.0.0:4321` (variable `HOST` / `PORT` surchargeables).

## Variables d'environnement

Voir [`.env.example`](.env.example). Toutes les variables sont **server-side** (lues au build time par Astro) :

| Variable              | Description                                              |
|-----------------------|----------------------------------------------------------|
| `RESEND_API_KEY`      | Clé d'API Resend (envoi des emails)                      |
| `CONTACT_TO_EMAIL`    | Adresse destinataire des demandes de contact             |
| `CONTACT_FROM_EMAIL`  | Adresse expéditrice (domaine vérifié dans Resend)        |

> Avec le Node adapter, `import.meta.env` est inliné au build time. Les variables doivent être présentes au moment de `pnpm build`.

## Déploiement manuel sur VPS Ubuntu

1. **DNS** : pointer `deb-tout.com` (et `www`) en `A` vers l'IP du VPS
2. **Resend** : vérifier `deb-tout.com` (SPF + DKIM + DMARC) dans le dashboard
3. **Serveur** : Node 22, pnpm, Nginx, Certbot
4. Cloner le repo sur `main`, `pnpm install --frozen-lockfile`, `pnpm build`
5. Lancer avec PM2 : `pm2 start ./dist/server/entry.mjs --name deb-landing --node-args="--env-file=.env"`
6. Nginx comme reverse proxy + cache statique pour `/_astro/*`
7. Certbot pour le SSL Let's Encrypt

Pour les détails complets de configuration Nginx, voir l'historique git.

## Structure

```
src/
  i18n/              # Traductions (ui.ts) + helpers (utils.ts)
  components/
    ui/              # Composants UI réutilisables
    sections/        # Sections de page
  layouts/
    Layout.astro     # SEO, i18n, fonts, styles globaux
  pages/
    index.astro      # Redirection vers /fr/
    [lang]/          # Pages localisées FR & ES
    api/contact.ts   # Endpoint POST du formulaire (Resend)
  styles/
    global.css       # Tailwind v4 theme + animations
public/images/       # Assets statiques
```

## Conventions

- Tabulations pour l'indentation dans `.astro`
- Quotes simples en JS/TS, doubles en HTML
- `pnpm` exclusivement
- Composants en `PascalCase.astro`
- Clés i18n : **toujours** ajouter aux deux langues (fr + es)
- Pas de secrets en clair — tout passe par `.env.local`
