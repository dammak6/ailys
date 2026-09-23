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

export const COLLECTIONS: Collection[] = [
  {
    id: "col-atelier-urbain-2026",
    slug: "atelier-urbain",
    title: "L'Atelier Urbain",
    subtitle: "Édition Sfax 2026 • Denim, Cuir Nappa & Mailles Techniques",
    description:
      "Une collection moderne façonnée dans notre atelier de Sfax. Volumes contemporains, denim indigo brut, cuir nappa souple et vestes en jersey scuba double face pour une élégance fonctionnelle et affirmée.",
    story:
      "Née au cœur de notre atelier de Sfax, la collection L'Atelier Urbain capture l'équilibre singulier entre l'artisanat textile tunisien et la modernité des coupes contemporaines. Du blouson bomber en cuir nappa à la veste en denim brut selvedge, en passant par les vestes techniques en maille scuba thermique, chaque pièce est construite avec une rigueur architecturale et un confort absolu au quotidien.",
    heroDesktopImage: "/images/editorial/03_the_silhouette.webp",
    heroMobileImage: "/images/editorial/02_ailys_portrait.webp",
    productSlugs: [
      "veste-boxy-denim-indigo-brut",
      "blouson-nappa-noir-silhouette",
      "veste-boxy-serge-kaki-ombre",
      "veste-zippee-scuba-noir-onyx",
      "veste-zippee-scuba-grenat",
      "veste-zippee-scuba-gris-chine",
      "t-shirt-oversize-atelier-sfax",
    ],
    isCapsule: true,
    isPublished: true,
    productCount: 7,
  },
];

export const PRODUCTS: Product[] = [
  {
    id: "prod-denim-indigo-01",
    slug: "veste-boxy-denim-indigo-brut",
    name: "Veste Boxy Denim Indigo Brut",
    subtitle: "Coupe courte architecturale en denim selvedge d'atelier",
    category: "femme",
    subCategory: "Vestes & Manteaux",
    price: 280,
    collection: "L'Atelier Urbain",
    collectionSlug: "atelier-urbain",
    primaryImage: "/images/products/07460319401-A7M.webp",
    secondaryImage: "/images/products/07460319401-A6M.webp",
    gallery: [
      "/images/products/07460319401-A7M.webp",
      "/images/products/07460319401-A2M.webp",
      "/images/products/07460319401-A6M.webp",
      "/images/products/07460319401-A20M.webp",
    ],
    colors: [{ name: "Indigo Brut", hex: "#1C2833" }],
    sizes: ["36", "38", "40", "42"],
    description:
      "Veste courte à la coupe boxy affirmée, confectionnée en denim de coton brut indigo profond. Découpes structurées inspirées du vestiaire utilitaire d'atelier, boutons métalliques argentés et poches plaquées amples.",
    materials: "100% Coton denim brut selvedge 12.5 oz de haute tenue",
    care: "Lavage à froid sur l'envers. Séchage à plat.",
    fit: "Coupe boxy contemporaine légèrement cropped.",
    isNew: true,
    isFeatured: true,
  },
  {
    id: "prod-blouson-nappa-02",
    slug: "blouson-nappa-noir-silhouette",
    name: "Blouson Nappa Noir Silhouette",
    subtitle: "Esprit aviateur contemporain en cuir nappa ultra souple",
    category: "femme",
    subCategory: "Vestes & Manteaux",
    price: 395,
    collection: "L'Atelier Urbain",
    collectionSlug: "atelier-urbain",
    primaryImage: "/images/products/07670434700-M.webp",
    secondaryImage: "/images/products/07670434700-A6M.webp",
    gallery: [
      "/images/products/07670434700-M.webp",
      "/images/products/07670434700-A2M.webp",
      "/images/products/07670434700-A6M.webp",
    ],
    colors: [{ name: "Noir Nappa", hex: "#111111" }],
    sizes: ["36", "38", "40", "42"],
    description:
      "Blouson zippé en cuir nappa ultra souple au grain lisse velouté. Col chemise franc, poignets et ourlet bas élastiqués pour un effet blousant très chic. Pièce maîtresse de la saison.",
    materials: "Cuir nappa végan souple premium, doublure 100% viscose respirante",
    care: "Nettoyage délicat avec un chiffon doux légèrement humide. Ne pas repasser.",
    fit: "Coupe blousante décontractée avec taille resserrée par élastique.",
    isCapsule: true,
    isFeatured: true,
  },
  {
    id: "prod-boxy-kaki-03",
    slug: "veste-boxy-serge-kaki-ombre",
    name: "Veste Boxy Sergé Kaki Ombre",
    subtitle: "Sergé de coton teinté en pièce, nuance terre d'ombre",
    category: "femme",
    subCategory: "Vestes & Manteaux",
    price: 265,
    collection: "L'Atelier Urbain",
    collectionSlug: "atelier-urbain",
    primaryImage: "/images/products/07460319700-A7M.webp",
    secondaryImage: "/images/products/07460319700-A6M.webp",
    gallery: [
      "/images/products/07460319700-A7M.webp",
      "/images/products/07460319700-A2M.webp",
      "/images/products/07460319700-A6M.webp",
      "/images/products/07460319700-A20M.webp",
    ],
    colors: [{ name: "Kaki Ombre", hex: "#5C5645" }],
    sizes: ["36", "38", "40", "42"],
    description:
      "Veste courte en toile sergée de coton lourd lavé. Teinte minérale subtile entre kaki patiné et terre d'ombre. Fermeture à boutons métalliques et coupe structurée confortable.",
    materials: "100% Coton sergé lourd délavé aux enzymes",
    care: "Lavage en machine à 30°C. Séchage sur cintre.",
    fit: "Coupe droite déstructurée.",
    isNew: true,
  },
  {
    id: "prod-scuba-noir-04",
    slug: "veste-zippee-scuba-noir-onyx",
    name: "Veste Zippée Scuba Noir Onyx",
    subtitle: "Maille technique interlock haute densité à col montant",
    category: "homme",
    subCategory: "Vestes Sport-Chic",
    price: 245,
    collection: "L'Atelier Urbain",
    collectionSlug: "atelier-urbain",
    primaryImage: "/images/products/07721518800-M.webp",
    secondaryImage: "/images/products/07721522800-A6M.webp",
    gallery: [
      "/images/products/07721518800-M.webp",
      "/images/products/07721518800-A4M.webp",
      "/images/products/07721522800-A6M.webp",
      "/images/products/07721522800-A8M.webp",
      "/images/products/07721522800-A20M.webp",
    ],
    colors: [{ name: "Noir Onyx", hex: "#0E0E10" }],
    sizes: ["S", "M", "L", "XL"],
    description:
      "Veste sport-chic technique en jersey scuba double face. Tombé sculptural sans pli, col montant ajusté, zip en métal argenté et poches italiennes discrètes. La parfaite veste mi-saison urbaine.",
    materials: "75% Coton peigné, 20% Polyester technique, 5% Élasthanne (320 g/m²)",
    care: "Lavage en machine à 30°C sur l'envers. Repassage doux à la vapeur si nécessaire.",
    fit: "Coupe régulière sportive.",
    isNew: true,
    isFeatured: true,
  },
  {
    id: "prod-scuba-grenat-05",
    slug: "veste-zippee-scuba-grenat",
    name: "Veste Zippée Scuba Grenat",
    subtitle: "Teinte bordeaux profond noble sur maille scuba double face",
    category: "homme",
    subCategory: "Vestes Sport-Chic",
    price: 245,
    collection: "L'Atelier Urbain",
    collectionSlug: "atelier-urbain",
    primaryImage: "/images/products/07721918700-M.webp",
    secondaryImage: "/images/products/07721918700-A6M.webp",
    gallery: [
      "/images/products/07721918700-M.webp",
      "/images/products/07721918700-A2M.webp",
      "/images/products/07721918700-A6M.webp",
      "/images/products/07721918700-A8M.webp",
      "/images/products/07721918700-A20M.webp",
    ],
    colors: [{ name: "Grenat Profond", hex: "#38171E" }],
    sizes: ["S", "M", "L", "XL"],
    description:
      "Déclinaison dans un rouge grenat sombre et raffiné de notre veste zippée en scuba technique. Apporte une touche de couleur chaude et feutrée au vestiaire masculin.",
    materials: "75% Coton peigné, 20% Polyester technique, 5% Élasthanne",
    care: "Lavage délicat à 30°C.",
    fit: "Coupe athlétique contemporaine.",
    isNew: true,
  },
  {
    id: "prod-scuba-gris-06",
    slug: "veste-zippee-scuba-gris-chine",
    name: "Veste Zippée Scuba Gris Chiné",
    subtitle: "Maille scuba chinée douce au tombé net et structuré",
    category: "homme",
    subCategory: "Vestes Sport-Chic",
    price: 245,
    collection: "L'Atelier Urbain",
    collectionSlug: "atelier-urbain",
    primaryImage: "/images/products/07721918803-M.webp",
    secondaryImage: "/images/products/07721918803-A6M.webp",
    gallery: [
      "/images/products/07721918803-M.webp",
      "/images/products/07721918803-A5M.webp",
      "/images/products/07721918803-A6M.webp",
      "/images/products/07721918803-A20M.webp",
    ],
    colors: [{ name: "Gris Chiné", hex: "#A8A8AA" }],
    sizes: ["S", "M", "L", "XL"],
    description:
      "Veste zippée polyvalente en scuba chiné gris perle. Idéale superposée sur une chemise ou un t-shirt pour une allure sport-chic décontractée.",
    materials: "70% Coton, 25% Polyester, 5% Élasthanne",
    care: "Lavage en machine à 30°C.",
    fit: "Coupe décontractée urbaine.",
    isNew: true,
  },
  {
    id: "prod-tshirt-sfax-07",
    slug: "t-shirt-oversize-atelier-sfax",
    name: "T-Shirt Oversize Atelier Sfax",
    subtitle: "Jersey de coton lourd 260g, typographie atelier discrète",
    category: "homme",
    subCategory: "Polos & Mailles",
    price: 125,
    collection: "L'Atelier Urbain",
    collectionSlug: "atelier-urbain",
    primaryImage: "/images/products/07231523250-A7M.webp",
    secondaryImage: "/images/products/07231523250-A6M.webp",
    gallery: [
      "/images/products/07231523250-A7M.webp",
      "/images/products/07231523250-A2M.webp",
      "/images/products/07231523250-A6M.webp",
      "/images/products/07231523250-A20M.webp",
    ],
    colors: [{ name: "Blanc Craie", hex: "#F7F6F2" }],
    sizes: ["S", "M", "L", "XL"],
    description:
      "T-shirt à la coupe ample et tombé lourd, confectionné en jersey de coton dense 260g. Col ras-du-cou robuste et micro-typographie inspirée des inscriptions de patronnage d'atelier.",
    materials: "100% Coton peigné cardé lourd (260 g/m²)",
    care: "Lavage en machine à 30°C sur l'envers. Repasser à température moyenne.",
    fit: "Coupe oversize contemporaine aux épaules tombantes.",
    isNew: true,
    isFeatured: true,
  },
];

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

