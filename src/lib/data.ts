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
    heroImage: "/images/campaign/hero-editorial-woman.jpg",
    subcategories: ["Tailleurs & Ensembles", "Robes & Combinaisons", "Vestes & Manteaux", "Pantalons & Jupes", "Tops & Chemises"],
  },
  homme: {
    slug: "homme",
    name: "Homme",
    tagline: "Coupes épurées & matières nobles",
    description:
      "L'équilibre précis entre confection tailleur et aisance sportive. Des polos en piqué de coton doux, vestes structurées légères et pantalons décontractés.",
    heroImage: "/images/campaign/man-sport-chic.jpg",
    subcategories: ["Vestes Sport-Chic", "Polos & Mailles", "Pantalons & Chinos", "Chemises Légères"],
  },
  enfant: {
    slug: "enfant",
    name: "Enfant",
    tagline: "L'élégance familiale partagée",
    description:
      "Conçus avec les mêmes étoffes nobles et finitions artisanales que les pièces adultes, pour un vestiaire familial harmonieux et durable.",
    heroImage: "/images/campaign/girl-sport-chic.jpg",
    subcategories: ["Ensembles Fille", "Ensembles Garçon", "Robes d'Été", "Capsules Famille"],
  },
};

export const COLLECTIONS: Collection[] = [
  {
    id: "col-1",
    slug: "lumiere-d-ete",
    title: "Lumière d'Été",
    subtitle: "Collection Printemps / Été 2026",
    description:
      "Inspirée par les reflets dorés du golfe de Tunis et la douceur minérale de Sidi Bou Saïd.",
    story:
      "La collection Lumière d'Été capture cette heure suspendue où le soleil méditerranéen adoucit les contours de la pierre blanche. Confectionnées dans des lins purs et des cotons respirants tissés localement, ces pièces incarnent une décontraction aristocratique et naturelle.",
    heroDesktopImage: "/images/campaign/hero-editorial-woman.jpg",
    heroMobileImage: "/images/campaign/hero-portrait-woman.jpg",
    productSlugs: [
      "ensemble-tailleur-lin-ivoire",
      "robe-ceinturee-noire",
      "polo-piquet-ivoire",
      "robe-volants-enfant-fleurie",
      "ensemble-decontracte-kaki",
    ],
  },
  {
    id: "col-2",
    slug: "capsule-sport-chic-nocturne",
    title: "Capsule Sport-Chic Nocturne",
    subtitle: "Édition Limitée Atelier",
    description:
      "La rigueur du noir profond relevée par l'éclat satiné de l'or AÏLYS et des zips joaillerie.",
    story:
      "Pensée pour les soirées douces et les voyages, cette capsule explore le contraste entre coupes athlétiques et broderies d'or artisanales. Chaque pièce arbore discrètement l'emblème botanique AÏLYS brodé au fil d'or mat.",
    heroDesktopImage: "/images/campaign/man-back-embroidery.jpg",
    heroMobileImage: "/images/campaign/man-sport-chic.jpg",
    productSlugs: [
      "veste-zippee-sport-chic-noire",
      "sweatshirt-brode-or",
      "blazer-structure-noir",
    ],
  },
];

export const PRODUCTS: Product[] = [
  {
    id: "prod-1",
    slug: "ensemble-tailleur-lin-ivoire",
    name: "Ensemble Tailleur Veste & Pantalon",
    subtitle: "Lin lavé naturel avec boutons corne gravés",
    category: "femme",
    subCategory: "Tailleurs & Ensembles",
    price: 289,
    collection: "Lumière d'Été",
    collectionSlug: "lumiere-d-ete",
    primaryImage: "/images/products/ensemble-tailleur.jpg",
    secondaryImage: "/images/campaign/hero-portrait-woman.jpg",
    gallery: [
      "/images/products/ensemble-tailleur.jpg",
      "/images/campaign/hero-portrait-woman.jpg",
      "/images/campaign/hero-editorial-woman.jpg",
      "/images/craftsmanship/woven-label.jpg",
    ],
    colors: [
      { name: "Blanc Os", hex: "#F5F3EC" },
      { name: "Noir Ébène", hex: "#0B0B0B" },
      { name: "Sable Doré", hex: "#B79A5B" },
    ],
    sizes: ["36", "38", "40", "42", "44"],
    description:
      "Une silhouette maîtresse de la maison AÏLYS. Ce tailleur deux pièces en lin lavé méditerranéen offre un tombé souple et impeccable. Veste à double boutonnage épuré et pantalon droit à taille élastiquée au dos pour un confort absolu du matin au soir.",
    materials: "100% Lin lavé de première qualité, doublure intérieure 100% coton respirant.",
    care: "Nettoyage à sec doux ou lavage délicat à la main à 30°C. Repassage sur l'envers à fer doux.",
    fit: "Coupe droite décontractée. Prenez votre taille habituelle pour une allure fluide ou une taille en-dessous pour un ajustement plus cintré.",
    isNew: true,
    isFeatured: true,
  },
  {
    id: "prod-2",
    slug: "robe-ceinturee-noire",
    name: "Robe Midi Ceinturée Soie & Coton",
    subtitle: "Encolure en V délicate et manches trois-quarts",
    category: "femme",
    subCategory: "Robes & Combinaisons",
    price: 189,
    collection: "Lumière d'Été",
    collectionSlug: "lumiere-d-ete",
    primaryImage: "/images/products/robe-ceinturee.jpg",
    secondaryImage: "/images/campaign/editorial-portrait-tunisian-light.jpg",
    gallery: [
      "/images/products/robe-ceinturee.jpg",
      "/images/campaign/editorial-portrait-tunisian-light.jpg",
      "/images/campaign/woman-black-blazer.jpg",
      "/images/craftsmanship/care-label.jpg",
    ],
    colors: [
      { name: "Noir Profond", hex: "#0B0B0B" },
      { name: "Blanc Os", hex: "#F5F3EC" },
    ],
    sizes: ["36", "38", "40", "42"],
    description:
      "La petite robe noire réinventée dans l'esprit AÏLYS. Une coupe midi fluide ceinturée d'un lien en tissu ton sur ton avec embouts métalliques or pâle. Parfaite en sandales plates le jour ou en escarpins le soir.",
    materials: "70% Coton peigné, 30% Soie naturelle douce.",
    care: "Lavage en machine cycle délicat à 30°C. Ne pas utiliser d'eau de javel. Séchage à plat.",
    fit: "Ajustée au buste et évasée à partir de la taille. Longueur sous le genou.",
    isNew: true,
    isFeatured: true,
  },
  {
    id: "prod-3",
    slug: "polo-piquet-ivoire",
    name: "Polo Piqué Signature Homme",
    subtitle: "Col côtelé et emblème brodé sur la manche",
    category: "homme",
    subCategory: "Polos & Mailles",
    price: 95,
    collection: "Lumière d'Été",
    collectionSlug: "lumiere-d-ete",
    primaryImage: "/images/products/polo-homme.jpg",
    secondaryImage: "/images/campaign/man-sport-chic.jpg",
    gallery: [
      "/images/products/polo-homme.jpg",
      "/images/campaign/man-sport-chic.jpg",
      "/images/campaign/man-back-embroidery.jpg",
      "/images/craftsmanship/hang-tag.jpg",
    ],
    colors: [
      { name: "Blanc Os", hex: "#F5F3EC" },
      { name: "Noir Mât", hex: "#0B0B0B" },
      { name: "Bleu Nuit", hex: "#1A2536" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "L'essentiel du vestiaire masculin sport-chic. Tricoté en piqué de coton peigné longue fibre pour une tenue irréprochable au fil des lavages. Patte de boutonnage à trois boutons de nacre naturelle.",
    materials: "100% Coton piqué peigné biologique.",
    care: "Lavage en machine à 30°C avec couleurs similaires. Séchage sur cintre recommandé.",
    fit: "Coupe classique moderne, ni trop ajustée ni ample. Tombe parfaitement aux hanches.",
    isNew: false,
    isFeatured: true,
  },
  {
    id: "prod-4",
    slug: "veste-zippee-sport-chic-noire",
    name: "Veste Zippée Atelier Broderie Or",
    subtitle: "Zip or mat et tirette emblème botanique",
    category: "homme",
    subCategory: "Vestes Sport-Chic",
    price: 210,
    collection: "Capsule Sport-Chic Nocturne",
    collectionSlug: "capsule-sport-chic-nocturne",
    primaryImage: "/images/campaign/man-sport-chic.jpg",
    secondaryImage: "/images/craftsmanship/gold-zipper-detail.jpg",
    gallery: [
      "/images/campaign/man-sport-chic.jpg",
      "/images/craftsmanship/gold-zipper-detail.jpg",
      "/images/campaign/man-back-embroidery.jpg",
      "/images/craftsmanship/woven-label.jpg",
    ],
    colors: [
      { name: "Noir Profond", hex: "#0B0B0B" },
      { name: "Blanc Craie", hex: "#ECE8DF" },
    ],
    sizes: ["S", "M", "L", "XL"],
    description:
      "Pièce emblématique de notre capsule. Alliant la structure d'une veste de ville à la décontraction d'un blouson d'échauffement sport-chic. Fermeture éclair en laiton doré brossé ornée du pendentif botanique AÏLYS.",
    materials: "85% Coton double retors, 15% Élasthanne technique haute résilience.",
    care: "Lavage délicat à l'envers à 30°C. Fermer le zip avant lavage.",
    fit: "Coupe athlétique droite. Poignets et bas côtelés souples.",
    isCapsule: true,
    isFeatured: true,
  },
  {
    id: "prod-5",
    slug: "robe-volants-enfant-fleurie",
    name: "Robe Volants Enfant en Voile de Coton",
    subtitle: "Détails plissés artisanaux et doublure douce",
    category: "enfant",
    subCategory: "Ensembles Fille",
    price: 79,
    collection: "Lumière d'Été",
    collectionSlug: "lumiere-d-ete",
    primaryImage: "/images/products/robe-fille.jpg",
    secondaryImage: "/images/campaign/girl-sport-chic.jpg",
    gallery: [
      "/images/products/robe-fille.jpg",
      "/images/campaign/girl-sport-chic.jpg",
      "/images/craftsmanship/care-label.jpg",
    ],
    colors: [
      { name: "Blanc Fleuri", hex: "#FAF8F5" },
      { name: "Pêche Pâle", hex: "#F7E7DC" },
    ],
    sizes: ["4 ans", "6 ans", "8 ans", "10 ans", "12 ans"],
    description:
      "Une robe aérienne pensée pour les fêtes de famille et les journées ensoleillées. Voile de coton doux hypoallergénique, découpes à volants sur les emmanchures et boutonnage dos facile.",
    materials: "100% Coton biologique certifié OEKO-TEX.",
    care: "Lavage machine à 30°C. Repassage doux.",
    fit: "Coupe trapèze confortable permettant une liberté de mouvement totale.",
    isNew: true,
    isFeatured: false,
  },
  {
    id: "prod-6",
    slug: "ensemble-decontracte-kaki",
    name: "Ensemble Chemise & Pantalon Lin Kaki",
    subtitle: "Teinture végétale douce et finitions couture",
    category: "homme",
    subCategory: "Pantalons & Chinos",
    price: 220,
    collection: "Lumière d'Été",
    collectionSlug: "lumiere-d-ete",
    primaryImage: "/images/products/ensemble-homme.jpg",
    secondaryImage: "/images/campaign/man-sport-chic.jpg",
    gallery: [
      "/images/products/ensemble-homme.jpg",
      "/images/campaign/man-sport-chic.jpg",
      "/images/craftsmanship/hang-tag.jpg",
    ],
    colors: [
      { name: "Vert Kaki Olive", hex: "#555A48" },
      { name: "Sable", hex: "#C7B99F" },
    ],
    sizes: ["M", "L", "XL"],
    description:
      "Ensemble deux pièces coordonné en pur lin d'été. Chemise à col cubain ouvert et pantalon fuselé avec cordon de serrage intérieur sous ceinture.",
    materials: "100% Lin normand filé et tissé dans le respect des traditions.",
    care: "Lavage doux à 30°C. Repasser encore légèrement humide.",
    fit: "Coupe fluide respirante.",
    isSoldOut: false,
    isFeatured: false,
  },
  {
    id: "prod-7",
    slug: "ensemble-confort-enfant-ivoire",
    name: "Ensemble Veste & Jogger Enfant Sport-Chic",
    subtitle: "Broderie dorée et passepoil contrasté",
    category: "enfant",
    subCategory: "Capsules Famille",
    price: 135,
    collection: "Lumière d'Été",
    collectionSlug: "lumiere-d-ete",
    primaryImage: "/images/campaign/girl-sport-chic.jpg",
    secondaryImage: "/images/campaign/boy-sport-chic.jpg",
    gallery: [
      "/images/campaign/girl-sport-chic.jpg",
      "/images/campaign/boy-sport-chic.jpg",
      "/images/craftsmanship/gold-zipper-detail.jpg",
    ],
    colors: [
      { name: "Blanc Os", hex: "#F5F3EC" },
      { name: "Noir", hex: "#0B0B0B" },
    ],
    sizes: ["6 ans", "8 ans", "10 ans", "12 ans"],
    description:
      "L'élégance sport-chic pour les plus jeunes, directement coordonnée aux pièces adultes de la collection. Matière molleton bouclé ultra douce.",
    materials: "100% Coton éponge velours.",
    care: "Lavage en machine à 30°C. Séchage tambour doux autorisé.",
    fit: "Coupe confort sportive.",
    isSoldOut: true,
    isFeatured: false,
  },
  {
    id: "prod-8",
    slug: "sweatshirt-brode-or",
    name: "Sweatshirt Molleton Écusson Or",
    subtitle: "Broderie AÏLYS poitrine en fil métallique mat",
    category: "femme",
    subCategory: "Tops & Chemises",
    price: 145,
    collection: "Capsule Sport-Chic Nocturne",
    collectionSlug: "capsule-sport-chic-nocturne",
    primaryImage: "/images/campaign/woman-black-sweatshirt.jpg",
    secondaryImage: "/images/campaign/woman-black-blazer.jpg",
    gallery: [
      "/images/campaign/woman-black-sweatshirt.jpg",
      "/images/campaign/woman-black-blazer.jpg",
      "/images/craftsmanship/woven-label.jpg",
    ],
    colors: [
      { name: "Noir Profond", hex: "#0B0B0B" },
      { name: "Blanc Craie", hex: "#ECE8DF" },
    ],
    sizes: ["XS", "S", "M", "L"],
    description:
      "Le confort du molleton premium rehaussé par la noblesse de la broderie AÏLYS. Une pièce décontractée à porter sur un pantalon de tailleur ou sous une veste d'atelier.",
    materials: "100% Coton peigné intérieur molleton doux.",
    care: "Lavage à 30°C sur l'envers pour protéger les broderies.",
    fit: "Coupe droite légèrement décolletée aux épaules.",
    isCapsule: true,
    isFeatured: false,
  },
];

// Sample past orders for Returns & Exchanges verification
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
}> = {
  "AILYS-2609-4182": {
    orderCode: "AILYS-2609-4182",
    customerName: "Yasmine Ben Salem",
    phone: "98123456",
    orderDate: "14 Septembre 2026",
    status: "Livré",
    items: [
      {
        id: "item-1",
        productName: "Ensemble Tailleur Veste & Pantalon",
        size: "38",
        color: "Blanc Os",
        price: 289,
        quantity: 1,
        image: "/images/products/ensemble-tailleur.jpg",
      },
      {
        id: "item-2",
        productName: "Robe Midi Ceinturée Soie & Coton",
        size: "38",
        color: "Noir Profond",
        price: 189,
        quantity: 1,
        image: "/images/products/robe-ceinturee.jpg",
      },
    ],
  },
  "AILYS-2609-9051": {
    orderCode: "AILYS-2609-9051",
    customerName: "Mehdi Trabelsi",
    phone: "22987654",
    orderDate: "16 Septembre 2026",
    status: "En cours de livraison",
    items: [
      {
        id: "item-3",
        productName: "Veste Zippée Atelier Broderie Or",
        size: "L",
        color: "Noir Profond",
        price: 210,
        quantity: 1,
        image: "/images/campaign/man-sport-chic.jpg",
      },
      {
        id: "item-4",
        productName: "Polo Piqué Signature Homme",
        size: "L",
        color: "Blanc Os",
        price: 95,
        quantity: 1,
        image: "/images/products/polo-homme.jpg",
      },
    ],
  },
};

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
