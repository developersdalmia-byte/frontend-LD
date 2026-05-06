import type {
  NavItem,

} from "@/types";

// ─── Navigation ──────────────────────────────────────────────────────────────

export const NAV_ITEMS: NavItem[] = [
  {
    label: "WOMEN",
    href: "/products?category=womenswear",
    children: [
      {
        label: "New Arrivals",
        href: "/products?category=womenswear&sort=newest",
        children: [
          { label: "New Arrivals", href: "/products?category=womenswear&sort=newest" },
        ],
      },
      {
        label: "Clothing",
        href: "/products?category=womenswear",
        children: [
          { label: "Sarees & Blouses", href: "/products?category=womenswear&subcategory=saree" },
          { label: "Lehenga Sets", href: "/products?category=womenswear&subcategory=lehenga" },
          { label: "Indowestern Jackets", href: "/products?category=womenswear&subcategory=jacket" },
          { label: "Gowns", href: "/products?category=womenswear&subcategory=gown" },
        ],
      },
      {
        label: "Shop By Occasion",
        href: "/products?category=womenswear",
        children: [
          { label: "Wedding", href: "/products?category=womenswear&occasion=wedding" },
          { label: "Engagement", href: "/products?category=womenswear&occasion=engagement" },
          { label: "Sangeet", href: "/products?category=womenswear&occasion=sangeet" },
          { label: "Reception", href: "/products?category=womenswear&occasion=reception" },
        ],
      },
    ],
  },
  {
    label: "MEN",
    href: "/products?category=menswear",
    children: [
      {
        label: "New Arrival",
        href: "/products?category=menswear&sort=newest",
        children: [
          { label: "New Arrivals", href: "/products?category=menswear&sort=newest" },
        ],
      },
      {
        label: "Clothing",
        href: "/products?category=menswear",
        children: [
          { label: "Sherwanis Sets", href: "/products?category=menswear&subcategory=sherwani" },
          { label: "Kurtas Sets", href: "/products?category=menswear&subcategory=kurta" },
          { label: "Bandgala Sets", href: "/products?category=menswear&subcategory=bandgala" },
        ],
      },
      {
        label: "Shop By Occasion",
        href: "/products?category=menswear",
        children: [
          { label: "Wedding", href: "/products?category=menswear&occasion=wedding" },
          { label: "Engagement", href: "/products?category=menswear&occasion=engagement" },
          { label: "Sangeet", href: "/products?category=menswear&occasion=sangeet" },
          { label: "Reception", href: "/products?category=menswear&occasion=reception" },
        ],
      },
    ],
  },
  {
    label: "WEDDING",
    href: "/products?category=weddings",
    children: [
      {
        label: "New Arrivals",
        href: "/products?category=weddings&sort=newest",
        children: [
          { label: "New Arrivals", href: "/products?category=weddings&sort=newest" },
        ],
      },
      {
        label: "Couture",
        href: "/products?category=weddings",
        children: [
          { label: "Nikah & Valima", href: "/products?category=weddings&subcategory=nikah" },
          { label: "Anant Karaj", href: "/products?category=weddings&subcategory=anant-karaj" },
          { label: "Sahi Vivah", href: "/products?category=weddings&subcategory=sahi-vivah" },
        ],
      },
    ],
  },
  {
    label: "WORLD OF LALIT DALIMA",
    href: "/world-of-lalit-dalima",
    children: [
      {
        label: "Our Story",
        href: "/world-of-lalit-dalima/history",
        children: [{ label: "History", href: "/world-of-lalit-dalima/history" }],
      },
      {
        label: "Commitment",
        href: "/world-of-lalit-dalima/social-initiative",
        children: [{ label: "Social Initiative", href: "/world-of-lalit-dalima/social-initiative" }],
      },
      {
        label: "Artisanship",
        href: "/world-of-lalit-dalima/craft-preservation",
        children: [{ label: "Craft Preservation", href: "/world-of-lalit-dalima/craft-preservation" }],
      },
      {
        label: "Retail",
        href: "/world-of-lalit-dalima/art-of-retail",
        children: [{ label: "Art of Retail", href: "/world-of-lalit-dalima/art-of-retail" }],
      },
    ],
  },
];

