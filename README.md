# AÏLYS — Maison de Confection Contemporaine Tunisienne

> *"Quiet confidence, shaped by Tunisian light."*

A modern, production-ready ecommerce platform and private administration suite built for **AÏLYS**, a contemporary Tunisian fashion house blending tailored elegance, Mediterranean lifestyle, and sport-chic silhouettes.

---

## Brand & Visual Identity

- **Heritage**: Mediterranean minimalism, maternal transmission (*Aïda* & *Lys*), uncompromised tailoring.
- **Palette**: Noir Profond (`#0B0B0B`), Blanc Os (`#F5F3EC`), Or AÏLYS (`#B79A5B`), Muted Grey (`#767471`).
- **Typography**: *Playfair Display* (Editorial headings), *Montserrat* (Body & UI controls).
- **Payment Method**: Strictly **Cash on Delivery (COD / Paiement à la Livraison)** in Tunisian Dinars (`TND / DT`).
- **Customer Model**: Guest checkout express without mandatory account creation.

---

## Features

### Customer Storefront
- **Editorial Campaign Homepage**: Dynamic hero with dual desktop/mobile framing, collection highlights, brand philosophy, craftsmanship cards.
- **Boutique & Categories**: Full catalog (`/shop`, `/shop/femme`, `/shop/homme`, `/shop/enfant`) with size filters, sorting, and secondary lifestyle image hover swaps.
- **Lookbooks & Collections**: Multi-collection narrative pages (`/collections`, `/collections/[slug]`).
- **Interactive Search**: Full-screen modal with instant real-time filtering and suggestion chips.
- **Guest COD Checkout**: Express ordering across all 24 Tunisian governorates, secondary phone support, free shipping calculation, and unique order codes (`AILYS-YYMM-XXXX`).
- **Self-Service Returns & Exchanges**: Order verification portal (`/retours-echanges`) with size replacement selector, predefined return reasons, condition checks, and tracking codes (`RET-XXXXXX`).

### Private Administration Suite (`/admin`)
- **Protected Authentication**: Cookie-based session with secure guards on all admin routes.
- **Dashboard**: High-level store metrics, revenue, and order pipeline.
- **Catalog Management**: Full CRUD for Products and Collections.
- **Promotions Engine**: Creation and toggling of promotional voucher codes.
- **Media Library & Image Editor**: Non-destructive transformations (zoom, rotation, focal point positioning, desktop vs mobile crops).
- **Visual Homepage CMS**: Reordering sections, drafting changes, live preview mode isolation (`?preview=true`), and one-click publishing.
- **Order & Return Processing**: Live status transitions (`nouveau` $\rightarrow$ `confirme` $\rightarrow$ `en_preparation` $\rightarrow$ `en_livraison` $\rightarrow$ `livre`).

---

## Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend / Database**: [Supabase](https://supabase.com/) & In-Memory Repository
- **State**: React Context with LocalStorage persistence

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the storefront.

### 3. Admin Access
- **URL**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Email**: `admin@ailys.tn`
- **Password**: `AilysAdmin2026!`

### 4. Production Build
```bash
npm run build
npm run start
```

---

## License

© 2026 AÏLYS. Tous droits réservés.
