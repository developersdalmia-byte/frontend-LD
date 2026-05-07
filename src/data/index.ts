import type {
  NavItem,

} from "@/types";

// ─── Navigation ──────────────────────────────────────────────────────────────

export const NAV_ITEMS: NavItem[] = [
  {
    label: "WOMEN",
    href: "/products?mainCategory=womens-wear",
    children: [
      {
        label: "New Arrivals",
        href: "/products?mainCategory=womens-wear&sort=newest",
        children: [
          { label: "New Arrivals", href: "/products?mainCategory=womens-wear&sort=newest" },
        ],
      },
      {
        label: "Clothing",
        href: "/products?mainCategory=womens-wear",
        children: [
          { label: "Sarees & Blouses", href: "/products?mainCategory=womens-wear&category=saree" },
          { label: "Lehenga Sets", href: "/products?mainCategory=womens-wear&category=lehenga" },
          { label: "Indowestern Jackets", href: "/products?mainCategory=womens-wear&category=jacket" },
          { label: "Gowns", href: "/products?mainCategory=womens-wear&category=gown" },
        ],
      },
      {
        label: "Shop By Occasion",
        href: "/products?mainCategory=womens-wear",
        children: [
          { label: "Wedding", href: "/products?mainCategory=womens-wear&occasion=wedding" },
          { label: "Engagement", href: "/products?mainCategory=womens-wear&occasion=engagement" },
          { label: "Sangeet", href: "/products?mainCategory=womens-wear&occasion=sangeet" },
          { label: "Reception", href: "/products?mainCategory=womens-wear&occasion=reception" },
        ],
      },
    ],
  },
  {
    label: "MEN",
    href: "/products?mainCategory=mens-wear",
    children: [
      {
        label: "New Arrival",
        href: "/products?mainCategory=mens-wear&sort=newest",
        children: [
          { label: "New Arrivals", href: "/products?mainCategory=mens-wear&sort=newest" },
        ],
      },
      {
        label: "Clothing",
        href: "/products?mainCategory=mens-wear",
        children: [
          { label: "Sherwanis Sets", href: "/products?mainCategory=mens-wear&category=sherwani" },
          { label: "Kurtas Sets", href: "/products?mainCategory=mens-wear&category=kurta" },
          { label: "Bandgala Sets", href: "/products?mainCategory=mens-wear&category=bandgala" },
        ],
      },
      {
        label: "Shop By Occasion",
        href: "/products?mainCategory=mens-wear",
        children: [
          { label: "Wedding", href: "/products?mainCategory=mens-wear&occasion=wedding" },
          { label: "Engagement", href: "/products?mainCategory=mens-wear&occasion=engagement" },
          { label: "Sangeet", href: "/products?mainCategory=mens-wear&occasion=sangeet" },
          { label: "Reception", href: "/products?mainCategory=mens-wear&occasion=reception" },
        ],
      },
    ],
  },
  {
    label: "WEDDING",
    href: "/products?mainCategory=weddings",
    children: [
      {
        label: "New Arrivals",
        href: "/products?mainCategory=weddings&sort=newest",
        children: [
          { label: "New Arrivals", href: "/products?mainCategory=weddings&sort=newest" },
        ],
      },
      {
        label: "Couture",
        href: "/products?mainCategory=weddings",
        children: [
          { label: "Nikah & Valima", href: "/products?mainCategory=weddings&category=nikah" },
          { label: "Anant Karaj", href: "/products?mainCategory=weddings&category=anant-karaj" },
          { label: "Sahi Vivah", href: "/products?mainCategory=weddings&category=sahi-vivah" },
        ],
      },
    ],
  },
  {
    label: "WORLD OF LALIT DALMIA",
    href: "/world-of-lalit-dalmia",
    children: [
      {
        label: "Our Story",
        href: "/world-of-lalit-dalmia/history",
        children: [{ label: "History", href: "/world-of-lalit-dalmia/history" }],
      },
      {
        label: "Commitment",
        href: "/world-of-lalit-dalmia/social-initiative",
        children: [{ label: "Social Initiative", href: "/world-of-lalit-dalmia/social-initiative" }],
      },
      {
        label: "Artisanship",
        href: "/world-of-lalit-dalmia/craft-preservation",
        children: [{ label: "Craft Preservation", href: "/world-of-lalit-dalmia/craft-preservation" }],
      },
      {
        label: "Retail",
        href: "/world-of-lalit-dalmia/art-of-retail",
        children: [{ label: "Art of Retail", href: "/world-of-lalit-dalmia/art-of-retail" }],
      },
    ],
  },
];

