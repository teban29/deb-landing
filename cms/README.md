# CMS D.E.B TOUT CORPS (Strapi 5)

Administration du contenu du site. Le site Astro lit ce CMS côté serveur.

## Démarrage

Depuis la racine du dépôt :

```bash
docker compose up -d --build cms
```

- Panneau : http://localhost:1337/admin
- API : http://localhost:1337/api

## Types de contenu

| API | Type | Description |
|-----|------|-------------|
| `api::service.service` | Collection | Services (électricité, plomberie...) |
| `api::project.project` | Collection | Réalisations de la galerie |
| `api::before-after.before-after` | Collection | Comparaisons avant/après |
| `api::testimonial.testimonial` | Collection | Avis clients |
| `api::site-setting.site-setting` | Single | Coordonnées, réseaux, SEO global |
| `api::home-page.home-page` | Single | Textes et images de l'accueil |

Chaque type est traduit en `fr` et `es`. Les champs `slug`, `category`,
`order`, `featured` et les médias ne sont pas traduits.

## Rôles

Deux niveaux d'accès sont prévus :

- **Super Admin** : le premier compte créé. Accès complet (développeur).
- **Editor de contenido** : créé automatiquement au démarrage. Accès limité au
  contenu (création, lecture, modification, publication, suppression des
  entrées de collection), à la médiathèque (y compris suppression de fichiers)
  et au changement de langue. Pas de Content-Type Builder, Settings, plugins,
  tokens, webhooks ni utilisateurs. Les single types (accueil, données de
  l'entreprise) sont modifiables mais pas supprimables.

Créer les utilisateurs éditeurs dans **Settings → Administration panel →
Users**, puis leur attribuer le rôle **Editor de contenido**.

## Libellés du panneau

Les champs, composants et types de contenu ont des libellés et des aides en
espagnol, définis dans `src/seed/admin-ui.ts`. Ils sont réappliqués à chaque
démarrage.

## Sécurité

- CORS limité à l'URL publique du site (`CORS_ORIGINS`).
- Upload limité à 50 Mo et types de fichiers contrôlés.
- Télémétrie désactivée.
- JWT administrateur valable 7 jours.
- Lecture publique uniquement pour les contenus publiés.
- En production, le CMS doit rester derrière Nginx (rate limiting, headers) et
  idéalement derrière Cloudflare Access ou une liste d'IP autorisées.

## Import initial

`src/seed/data.ts` contient le contenu de départ FR/ES. Au démarrage, si
`SEED_ON_BOOT` n'est pas `false`, `src/seed/index.ts` :

1. crée les entrées manquantes (sans dupliquer) ;
2. publie les versions FR et ES ;
3. importe les images depuis `SEED_ASSETS_DIR` (monté sur `public/` dans
   Docker) ;
4. autorise la lecture publique des contenus publiés.

## Stockage des médias

- Sans variables `AWS_*` : fichiers locaux dans `public/uploads`.
- Avec `AWS_BUCKET` + `AWS_ENDPOINT` : envoi vers Cloudflare R2 / S3
  (voir `config/plugins.ts`).

## Commandes

```bash
pnpm develop        # développement (dans le conteneur)
pnpm build          # build de l'admin
pnpm start          # production
pnpm strapi console # console Strapi
```

## Webhook de publication

Configurer dans **Settings → Webhooks** :

- URL : `https://deb-tout.com/api/cms-webhook`
- Header : `x-webhook-secret: <CMS_WEBHOOK_SECRET>`
- Événements : `entry.publish`, `entry.unpublish`, `entry.delete`, `media.*`
