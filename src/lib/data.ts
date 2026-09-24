export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  category: "femme" | "homme" | "enfant";
  subCategory: string;
  price: number;
  salePrice?: number;
  collection: string;
  collectionSlug: string;
  primaryImage: string;
  secondaryImage: string;
  gallery: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  description: string;
  materials: string;
  care: string;
  fit: string;
  isNew?: boolean;
  isCapsule?: boolean;
  isSoldOut?: boolean;
  isFeatured?: boolean;
  sizeGuide?: ProductSizeGuide | null;
  primaryImageTransform?: ImageTransformMetadata;
  secondaryImageTransform?: ImageTransformMetadata;
  imageTransforms?: Record<string, ImageTransformMetadata>;
}

export interface SizeGuideRow {
  size: string;
  chest?: string;
  waist?: string;
  hips?: string;
  length?: string;
  [key: string]: string | undefined;
}

export interface ProductSizeGuide {
  title?: string;
  description?: string;
  headers?: string[];
  rows?: SizeGuideRow[];
  unit?: string;
}

export interface Collection {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  story: string;
  heroDesktopImage: string;
  heroMobileImage: string;
  productSlugs: string[];
  isCapsule?: boolean;
  isPublished?: boolean;
  productCount?: number;
}

export interface CategoryInfo {
  slug: "femme" | "homme" | "enfant";
  name: string;
  tagline: string;
  description: string;
  heroImage: string;
  subcategories: string[];
}

export const CATEGORIES: Record<string, CategoryInfo> = {
  femme: {
    slug: "femme",
    name: "Femme",
    tagline: "L'allure sport-chic au féminin",
    description:
      "Des tailleurs déstructurés en lin lavé aux robes fluides coupées pour la liberté de mouvement. Une élégance sobre pensée pour le jour et le crépuscule.",
    heroImage: "/images/editorial/03_the_silhouette.webp",
    subcategories: ["Tailleurs & Ensembles", "Robes & Combinaisons", "Vestes & Manteaux", "Pantalons & Jupes", "Tops & Chemises"],
  },
  homme: {
    slug: "homme",
    name: "Homme",
    tagline: "Coupes épurées & matières nobles",
    description:
      "L'équilibre précis entre confection tailleur et aisance sportive. Des polos en piqué de coton doux, vestes structurées légères et pantalons décontractés.",
    heroImage: "/images/editorial/man-collection.webp",
    subcategories: ["Vestes Sport-Chic", "Polos & Mailles", "Pantalons & Chinos", "Chemises Légères"],
  },
  enfant: {
    slug: "enfant",
    name: "Enfant",
    tagline: "L'élégance familiale partagée",
    description:
      "Conçus avec les mêmes étoffes nobles et finitions artisanales que les pièces adultes, pour un vestiaire familial harmonieux et durable.",
    heroImage: "/images/editorial/children-collection.webp",
    subcategories: ["Ensembles Fille", "Ensembles Garçon", "Robes d'Été", "Capsules Famille"],
  },
};

// Supabase is the Single Source of Truth for all collections and products.
// Static arrays in Git are emptied to prevent stale or conflicting data.
export const COLLECTIONS: Collection[] = [];

export const PRODUCTS: Product[] = [];

// Sample past orders for Returns & Exchanges verification (empty by default)
export const SAMPLE_ORDERS: Record<string, {
  orderCode: string;
  orderId?: string;
  customerName: string;
  phone: string;
  orderDate: string;
  status: string;
  items: {
    id: string;
    productName: string;
    size: string;
    color: string;
    price: number;
    quantity: number;
    image: string;
  }[];
}> = {};

export interface ImageTransformMetadata {
  zoom: number;
  rotate: number;
  focalPoint: { x: number; y: number };
  objectPosition: string;
  aspectRatio: string;
  crop?: { x: number; y: number; width: number; height: number };
  desktop?: {
    zoom?: number;
    rotate?: number;
    focalPoint?: { x: number; y: number };
    objectPosition?: string;
    aspectRatio?: string;
    crop?: { x: number; y: number; width: number; height: number };
  };
  mobile?: {
    zoom?: number;
    rotate?: number;
    focalPoint?: { x: number; y: number };
    objectPosition?: string;
    aspectRatio?: string;
    crop?: { x: number; y: number; width: number; height: number };
  };
}

export const DEFAULT_IMAGE_TRANSFORM: ImageTransformMetadata = {
  zoom: 1,
  rotate: 0,
  focalPoint: { x: 50, y: 50 },
  objectPosition: "50% 50%",
  aspectRatio: "original",
};

export interface HomepageSection {
  id: string;
  key: string;
  badge?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  desktopImage?: string;
  mobileImage?: string;
  desktopImageTransform?: ImageTransformMetadata;
  mobileImageTransform?: ImageTransformMetadata;
  selectedProductSlugs?: string[];
  order: number;
  isEnabled: boolean;
}

