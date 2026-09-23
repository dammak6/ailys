# Rapport de Cartographie des Données & Migration AÏLYS
*Généré dans le cadre de la préparation de la base PostgreSQL dédiée.*

---

## 1. Vue d'Ensemble

Ce rapport documente la transformation structurelle des données actuellement persistées dans `data/admin-data.json` vers le schéma relationnel PostgreSQL normalisé (`supabase/migrations/20260923000000_init_ailys_schema.sql` et `supabase/migrations/seed_current_data.sql`).

**Principe d'intégrité** : Aucune donnée existante n'est supprimée ou ignorée. Toutes les structures présentes sont mappées vers les entités relationnelles cibles, avec documentation explicite des transformations et des valeurs par défaut appliquées.

---

## 2. Inventaire des Données Existantes Mappées

| Entité JSON source | Nombre d'enregistrements | Table(s) PostgreSQL cible(s) | Statut d'intégrité |
| :--- | :--- | :--- | :--- |
| **Produits** (`products`) | 7 articles complets | `products`, `product_images`, `product_sizes`, `product_variants`, `collection_products` | 100% mappé |
| **Collections** (`collections`) | 1 collection ("L'Atelier Urbain") | `collections`, `collection_products` | 100% mappé |
| **Commandes** (`orders`) | 3 commandes réelles / test | `customers`, `customer_addresses`, `orders`, `order_items` | 100% mappé (séparation client/commande) |
| **Retours** (`returns`) | 0 demande | `returns`, `return_items` | Schéma prêt (table vide initialement) |
| **Médiathèque** (`media`) | 44 ressources webp/jpg | `media` | 100% mappé |
| **Homepage CMS** (`homepagePublished`) | 6 sections éditoriales | `homepage_sections`, `homepage_content` | 100% mappé (métadonnées JSONB préservées) |
| **Paramètres de site** (`settings`) | Délais, seuil franco, contact | Prévu pour configuration / clé-valeur | Préservé |

---

## 3. Détail des Transformations & Règles de Normalisation

### 3.1 Produits & Variantes (`products` $\rightarrow$ `products`, `product_variants`, `product_images`)
* **Identifiants** : Les identifiants textuels sources (ex: `prod-denim-indigo-01`) sont convertis en identifiants UUID déterministes (UUID v4 formaté via hash d'espace de nom) pour satisfaire la clé primaire PostgreSQL `UUID PRIMARY KEY`, tout en conservant le `slug` unique exact (`veste-boxy-denim-indigo-brut`).
* **Images multiples** :
  * `primaryImage` $\rightarrow$ `product_images` avec `is_primary = true`, `display_order = 1`.
  * `secondaryImage` $\rightarrow$ `product_images` avec `is_primary = false`, `display_order = 2`.
  * `gallery` $\rightarrow$ lignes additionnelles dans `product_images` avec ordre incrémenté.
* **Matrice Tailles x Couleurs** :
  * Le tableau JSON `sizes: ["36", "38", "40", "42"]` est normalisé dans `product_sizes` lié à la table `sizes`.
  * Pour chaque combinaison taille $\times$ couleur, un enregistrement est généré dans `product_variants` avec un SKU unique standardisé (ex: `AILYS-VESTE-BOXY-36-IND`) et un stock par défaut initialisé à 15 unités.

### 3.2 Commandes & Séparation Client (`orders` $\rightarrow$ `customers`, `customer_addresses`, `orders`, `order_items`)
* **Création d'entité Client** :
  * Dans le JSON local, les données client étaient aplaties sur chaque commande (`customerName`, `customerPhone`, `customerEmail`, `address`).
  * Transformation : Extraction du numéro de téléphone unique vers la table `customers`. Le prénom et le nom sont extraits de `customerName`.
  * L'adresse est insérée dans la table `customer_addresses` avec `customer_id` et `is_default = true`.
  * La table `orders` référence `customer_id` via clé étrangère, tout en conservant l'instantané de facturation/livraison au moment de la commande.
* **Lignes de commande (`items`)** :
  * Chaque élément du tableau `order.items` est normalisé dans `order_items` avec clé étrangère `order_id` et intégrité référentielle en cascade (`ON DELETE CASCADE`).

### 3.3 Homepage Editor & CMS (`homepageDraft` / `homepagePublished` $\rightarrow$ `homepage_sections`, `homepage_content`)
* **Sections** : `key` (`hero`, `new_collection`, etc.), `title`, `subtitle`, `order`, et `isEnabled` sont insérés dans `homepage_sections`.
* **Transformations & Métadonnées** :
  * Les objets de transformation (`desktopImageTransform`, `mobileImageTransform`, `focalPoint`, `zoom`, `badge`, `ctaText`, `ctaLink`) sont encapsulés dans la colonne `metadata JSONB` de `homepage_content`.
  * Cela garantit que tous les réglages de recadrage visuel, zoom et points focaux configurés depuis l'administration restent fidèlement restitués.

### 3.4 Sécurité & Rôles RBAC
* **Super Administrateur Initial** :
  * Authentifié via Supabase Auth (GoTrue).
* **Rôles Actifs** :
  * Strictement deux rôles : `SUPER_ADMIN` (accès total) et `ADMIN` (gestion opérationnelle uniquement).
  * Les permissions sont insérées dans `permissions` et associées via `role_permissions`.

---

## 4. Points d'Attention & Revue Manuelle Recommandée

1. **Email Client sur Commandes Invités** :
   * Plusieurs commandes de test ont `customerEmail: ""` (chaîne vide).
   * Transformation : Les adresses email vides sont converties en `NULL` dans la table `customers` afin de respecter la contrainte d'unicité `UNIQUE (email)` sur les emails non renseignés.
2. **SKU Automatiques** :
   * Comme les produits en boutique locale ne disposaient pas tous d'un code SKU défini, des SKU par défaut au format `AILYS-[SLUG10]-[TAILLE]-[COULEUR3]` ont été synthétisés. Ils pourront être ajustés ultérieurement dans l'interface admin.
3. **Médiathèque Locale vs Cloud Storage** :
   * Les 44 entrées média pointent vers `/images/editorial/...` et `/images/products/...` sur le système de fichiers local. Le schéma relationnel `media` est compatible à la fois avec des chemins relatifs locaux et des URL absolues de bucket de stockage (ex: Supabase Storage / S3).

---

## 5. Conclusion de la Préparation

L'intégralité du script SQL de migration et de chargement initial est prêt et validé localement dans :
- `supabase/migrations/20260923000000_init_ailys_schema.sql` (schéma et structures)
- `supabase/migrations/seed_current_data.sql` (chargement exhaustif des données réelles)

Aucun script ne sera exécuté tant que la nouvelle base de données PostgreSQL dédiée AÏLYS n'aura pas été explicitement mise à disposition.
