# D.E.B TOUT CORPS — Site + CMS

Site web premium de **D.E.B TOUT CORPS**, entreprise française de bâtiment spécialisée dans la rénovation complète (électricité, plomberie, carrelage, parquet, peinture, ponçage).

**Production:** [https://deb-tout.com](https://deb-tout.com)

## Stack

- **Astro 6** (mode `server` / SSR) avec Node adapter en mode `standalone`
- **Strapi 5** (CMS headless) pour l'administration du contenu
- **PostgreSQL 16** pour les données du CMS
- **Cloudflare R2 / S3** pour les images et vidéos (compatible S3)
- **Docker Compose** pour lancer l'ensemble du stack
- **Nginx** comme reverse proxy en production
- **Tailwind CSS v4**, TypeScript strict, i18n FR/ES, Resend

## Architecture

```
Internet
   │
   ├── deb-tout.com        ──► Nginx ──► web (Astro, :4321)
   │                                        │ lecture API
   └── cms.deb-tout.com    ──► Nginx ──► cms (Strapi, :1337)
                                            │
                                            ├── PostgreSQL
                                            └── Cloudflare R2 (images)
```

Le site lit Strapi côté serveur. Si le CMS est indisponible, chaque page utilise
automatiquement le contenu statique de secours déjà présent dans le code : le
site public ne tombe jamais.

## Démarrage local (Docker)

```bash
cp .env.example .env          # une seule fois, puis éditer les secrets
docker compose up -d --build
```

| Service | URL |
|---------|-----|
| Site | http://localhost:4400 |
| Administration Strapi | http://localhost:1337/admin |
| PostgreSQL | `localhost:5432` |

> Le port du site est configurable avec `WEB_PORT` dans `.env` (4400 par
> défaut pour éviter un conflit avec d'autres projets Astro).

Au premier démarrage :

1. Créer le premier compte administrateur sur http://localhost:1337/admin.
2. Strapi crée le schéma et importe le contenu existant (services, projets,
   avant/après, témoignages, données du site, page d'accueil) ainsi que les
   images présentes dans `public/`.
3. Le site affiche immédiatement le contenu du CMS.

L'import initial est contrôlé par `SEED_ON_BOOT`. Il est idempotent : il ne
recrée pas les entrées déjà présentes.

### Commandes utiles

```bash
docker compose logs -f cms        # logs Strapi
docker compose logs -f web        # logs Astro
docker compose restart cms        # redémarrer le CMS
docker compose down               # arrêter
docker compose down -v            # arrêter et supprimer la base (destructif)
```

### Développement sans Docker pour Astro

```bash
docker compose up -d postgres cms   # CMS + base dans Docker
pnpm dev                            # Astro en local sur :4321
```

## Variables d'environnement

Voir [`.env.example`](.env.example). Les variables du site sont lues à
l'exécution par le serveur Node (elles ne sont plus inlinées au build) :

| Variable | Description |
|----------|-------------|
| `CMS_URL` | URL interne de Strapi (`http://cms:1337` dans Docker) |
| `CMS_PUBLIC_URL` | URL publique des médias (`http://localhost:1337` en local, `https://cms.deb-tout.com` en production) |
| `CMS_API_TOKEN` | Token Strapi en lecture seule (optionnel) |
| `CMS_WEBHOOK_SECRET` | Secret partagé avec le webhook Strapi |
| `CMS_CACHE_TTL_MS` | Durée du cache CMS en millisecondes (5 min par défaut) |
| `PUBLIC_CMS_URL` | URL publique du CMS (`https://cms.deb-tout.com` en production) |
| `UPLOAD_SIZE_LIMIT` | Taille maximale d'un fichier uploadé (50 Mo par défaut) |
| `RATE_LIMIT_CONTACT` | Nombre de soumissions du formulaire par fenêtre |
| `RATE_LIMIT_CONTACT_WINDOW_MS` | Fenêtre du rate limit du formulaire |
| `RATE_LIMIT_WEBHOOK` | Nombre d'appels au webhook par fenêtre |
| `RATE_LIMIT_WEBHOOK_WINDOW_MS` | Fenêtre du rate limit du webhook |
| `RESEND_API_KEY` | Clé d'API Resend |
| `CONTACT_TO_EMAIL` | Adresse destinataire du formulaire |
| `CONTACT_FROM_EMAIL` | Adresse expéditrice vérifiée dans Resend |
| `WEB_PORT` | Port local du site (4400 par défaut) |

## Modèle de contenu

Tous les types sont traduits en **français** et **espagnol** (plugin i18n de
Strapi), avec brouillon/publication.

| Type | Champs principaux |
|------|-------------------|
| **Datos del negocio** (single) | Nom, slogan, description, téléphone, email, WhatsApp, adresse, horaires, note Google, logo, image de partage, réseaux sociaux, SEO |
| **Página de inicio** (single) | Hero (textes + image), statistiques, cartes « pourquoi nous choisir », titres de sections, points forts, étapes du processus, textes CTA, SEO |
| **Servicio** | Nom, slug, description courte/longue, icône, image, étapes, avantages, ordre, mise en avant |
| **Proyecto / Realización** | Titre, slug, description, catégorie, image de couverture, galerie, ordre, mise en avant |
| **Antes / Después** | Titre, catégorie, image avant/après, vidéo avant/après, ratio, ordre |
| **Testimonio** | Texte, auteur, note, date relative, source, ordre |

Les catégories et les icônes sont des listes fermées pour protéger le design.
Les champs structurels (slug, catégorie, ordre) ne sont pas traduits.

## Stockage des images (Cloudflare R2)

Sans configuration, Strapi stocke les fichiers dans `cms/public/uploads`
(pratique en local). Pour la production, utiliser R2 :

1. Créer un bucket R2 et un token API avec droits lecture/écriture.
2. Exposer le bucket via un domaine public (`pub-xxxx.r2.dev` ou domaine custom).
3. Renseigner dans `.env` :

```env
AWS_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
AWS_REGION=auto
AWS_BUCKET=deb-media
AWS_ACCESS_KEY_ID=...
AWS_ACCESS_SECRET=...
AWS_PUBLIC_URL=https://media.deb-tout.com
AWS_FORCE_PATH_STYLE=true
AWS_ROOT_PATH=
```

Strapi envoie alors tous les nouveaux médias vers R2 et le site utilise
directement les URLs publiques. Prévoir des images compressées (WebP) et des
vidéos légères pour maîtriser le trafic.

## Rôles et accès au panneau

Strapi crée automatiquement deux niveaux d'accès :

| Rôle | Pour qui | Peut faire |
|------|----------|------------|
| **Super Admin** | Développeur / responsable technique | Tout : contenu, types de contenu, configuration, plugins, utilisateurs, tokens, webhooks. |
| **Editor de contenido** | Personnel de l'entreprise | Créer, lire, modifier, publier et supprimer les entrées des collections (services, projets, avant/après, témoignages), gérer la médiathèque (y compris supprimer des fichiers) et changer de langue. Les URLs (`slug`) ne sont pas modifiables après création. |

Le rôle **Editor de contenido** est créé au premier démarrage. Il n'a **pas**
accès à :

- Content-Type Builder (création/modification des types de contenu).
- Settings, plugins, marketplace, tokens API, webhooks, utilisateurs ou rôles.

L'éditeur peut supprimer les entrées des collections (services, projets,
avant/après, témoignages) et les médias. La suppression est définitive (pas de
corbeille) : pour retirer temporairement un contenu du site, il vaut mieux le
**dépublier**. Les URLs (`slug`) ne sont pas modifiables après création.

Les deux **single types** (page d'accueil et données de l'entreprise) sont
modifiables mais pas supprimables : les supprimer laisserait le site sans
configuration globale. Le Super Admin peut les recréer si nécessaire.

Pour donner accès à une personne :

1. Se connecter en Super Admin.
2. **Settings → Administration panel → Users → Create new user**.
3. Choisir le rôle **Editor de contenido**.
4. Transmettre les identifiants par un canal sûr et demander un mot de passe
   personnel.

Un compte par personne, mots de passe longs et uniques, pas de compte partagé.

## Libellés en espagnol du panneau

Les champs du panneau affichent des libellés et des aides en espagnol (par
exemple `shortDescription` devient **Descripción corta** et `heroTitleLine1`
devient **Título principal: línea 1**). Les composants (étapes, cartes,
statistiques, réseaux sociaux) et les types de contenu sont également libellés.

Les libellés sont stockés dans la configuration du Content Manager et
réappliqués à chaque démarrage : ils ne sont pas perdus au redémarrage du
conteneur.

## Sécurité et performance

### Cache

- **Astro** : cache mémoire de 5 minutes (`CMS_CACHE_TTL_MS`) avec
  *single-flight* pour que plusieurs visites simultanées ne déclenchent pas
  plusieurs requêtes vers Strapi/PostgreSQL. Le webhook l'invalide à la
  publication.
- **Nginx** : cache HTML de 60 secondes pour `GET`/`HEAD`, avec
  `stale-while-revalidate`. Les routes `/api/` ne sont jamais mises en cache et
  les requêtes avec session Astro contournent le cache.
- Les changements publiés apparaissent immédiatement dans Astro et au plus tard
  après 60 secondes si Nginx a encore la page en cache.

### Rate limiting

| Couche | Route | Limite |
|--------|-------|--------|
| Astro | `POST /api/contact` | 5 requêtes / 10 min par IP |
| Astro | `POST /api/cms-webhook` | 60 requêtes / min par IP |
| Nginx | `/api/` du site | 20 requêtes / min par IP |
| Nginx | `/admin/login` du CMS | 5 tentatives / min par IP |
| Nginx | CMS en général | 20 requêtes / s par IP |

Les limites Astro se règlent avec `RATE_LIMIT_CONTACT`,
`RATE_LIMIT_CONTACT_WINDOW_MS`, `RATE_LIMIT_WEBHOOK` et
`RATE_LIMIT_WEBHOOK_WINDOW_MS`.

### Durcissement appliqué

- Formulaire de contact : validation de longueur, échappement HTML, honeypot
  antispam et `replyTo` de l'expéditeur.
- Webhook : secret comparé en temps constant, obligatoire, et uniquement en
  `application/json`.
- Strapi : CORS restreint, upload limité à 50 Mo, types de fichiers autorisés,
  télémétrie désactivée, JWT administrateur de 7 jours, lecture publique
  limitée aux contenus publiés.
- Nginx : CSP, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`,
  `Permissions-Policy`, `server_tokens off`, limites de connexion et HSTS dans
  le bloc SSL.
- Conteneurs : `no-new-privileges`, rotation des logs et healthchecks.

### Recommandations supplémentaires

- Mettre **Cloudflare** (proxy + WAF + rate limiting + bot fight) devant
  `deb-tout.com`.
- Restreindre `cms.deb-tout.com` à l'IP du bureau/VPN ou à **Cloudflare
  Access**. Un bloc `allow`/`deny` est prêt et commenté dans
  `docker/nginx.conf`.
- Activer 2FA/SSO si le plan Strapi le permet ; sinon, mots de passe uniques et
  gestionnaire de mots de passe.
- Ne pas exposer PostgreSQL sur Internet (le port n'est pas publié en
  production).
- Planifier les sauvegardes de PostgreSQL et de `.env` hors du VPS.
- Maintenir Strapi, Astro et les images Docker à jour.

## Publication et cache

- Le site met en cache les réponses du CMS pendant `CMS_CACHE_TTL_MS`
  (5 min par défaut), avec une seule requête en vol par clé.
- `CMS_PUBLIC_URL` doit pointer vers l'URL publique du CMS
  (`http://localhost:1337` en local, `https://cms.deb-tout.com` en production)
  pour que les images servies par Strapi soient accessibles depuis le
  navigateur. Avec R2, les URLs sont absolues et cette variable n'est pas
  utilisée pour les médias.
- Pour une mise à jour immédiate, créer un webhook dans Strapi :
  **Settings → Webhooks → Create new webhook**
  - URL : `https://deb-tout.com/api/cms-webhook`
  - Méthode : `POST`
  - Header : `x-webhook-secret: <CMS_WEBHOOK_SECRET>`
  - Événements : `entry.publish`, `entry.unpublish`, `entry.delete`, `media.*`
- Le endpoint vide le cache Astro. Nginx peut encore servir une page pendant
  60 secondes maximum.

Un token API Strapi en lecture seule peut être configuré dans `CMS_API_TOKEN`.
Ce n'est pas obligatoire : l'accès public en lecture aux contenus publiés est
activé automatiquement au démarrage.

## Déploiement sur VPS

1. Pointer `deb-tout.com`, `www` et `cms.deb-tout.com` vers l'IP du VPS.
2. Installer Docker et Docker Compose.
3. Copier `.env.production.example` vers `.env.production` et renseigner les
   vraies valeurs :
   - `PUBLIC_SITE_URL`, `PUBLIC_CMS_URL`, `CMS_PUBLIC_URL`.
   - Secrets Strapi (`openssl rand -base64 32`) ; `APP_KEYS` doit contenir
     4 clés séparées par des virgules.
   - `POSTGRES_PASSWORD`, `CMS_WEBHOOK_SECRET`.
   - Identifiants Cloudflare R2 et Resend.

   > Le fichier `.env` reste réservé au développement local. Le compose de
   > production doit toujours être lancé avec `--env-file .env.production`,
   > sinon les URLs de médias et le CORS pointeraient vers `localhost`.

4. Lancer :
   ```bash
   ./scripts/deploy-prod.sh
   ```
   ou manuellement :
   ```bash
   docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build
   ```
5. Nginx : `docker/nginx.conf` sert le site et le CMS. Activer TLS avec
   Certbot (les blocs SSL sont prêts et commentés dans le fichier).
   `CMS_PUBLIC_URL` étant en `https`, TLS doit être actif pour que les images
   se chargent.
6. Créer l'administrateur Strapi sur `https://cms.deb-tout.com/admin`.
7. Après le premier import réussi, passer `SEED_ON_BOOT=false` dans
   `.env.production` puis appliquer sans rebuild :
   ```bash
   docker compose --env-file .env.production -f docker-compose.prod.yml up -d
   ```
8. Vérifier :
   ```bash
   curl -I https://deb-tout.com
   curl -I https://cms.deb-tout.com/admin
   ```

### Sauvegardes

La base doit être sauvegardée hors du VPS :

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml exec -T postgres \
  pg_dump -U deb deb_cms | gzip > backup-$(date +%F).sql.gz
```

Les médias sont dans R2 : activer la versioning ou une règle de cycle de vie.
Sauvegarder aussi `.env.production` (secrets Strapi) dans un gestionnaire de
secrets.

### Sécurité

- Ne pas exposer PostgreSQL publiquement en production.
- Restreindre l'accès à `cms.deb-tout.com` (VPN, IP allowlist ou Basic Auth Nginx).
- Utiliser des secrets différents entre local et production.
- Mettre à jour Strapi et Astro régulièrement.

## Structure

```
cms/                     # Application Strapi 5
  config/                # database, server, plugins (R2), middlewares
  src/api/               # Types de contenu (service, project, ...)
  src/components/shared/ # Composants réutilisables (étapes, cartes, stats)
  src/seed/              # Contenu initial FR/ES + import des images
  src/seed/admin-ui.ts   # Rôle éditeur + libellés espagnols du panneau
  Dockerfile
src/
  lib/cms.ts             # Client Strapi (cache, i18n, fallback)
  i18n/                  # Traductions + helpers
  components/            # UI et sections
  layouts/Layout.astro   # SEO, données structurées, styles globaux
  pages/
    [lang]/              # Pages FR/ES
    api/contact.ts       # Formulaire (Resend)
    api/cms-webhook.ts   # Invalidation du cache
    api/health.ts        # Healthcheck Docker
  data/                  # Contenu statique de secours
public/images/           # Images historiques (fallback + import initial)
docker/nginx.conf        # Reverse proxy production
docker-compose.yml       # Développement (hot reload)
docker-compose.prod.yml  # Production (builds + Nginx)
```

## Conventions

- Tabulations pour l'indentation dans `.astro`
- Quotes simples en JS/TS, doubles en HTML
- `pnpm` exclusivement
- Composants en `PascalCase.astro`
- Clés i18n : **toujours** ajouter aux deux langues (fr + es)
- Pas de secrets en clair — tout passe par `.env`
