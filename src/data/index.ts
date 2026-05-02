import type {
  NavItem,

} from "@/types";

// ─── Navigation ──────────────────────────────────────────────────────────────

export const NAV_ITEMS: NavItem[] = [
  {
    label: "WOMEN",
    href: "/category/women",
    children: [
      {
        label: "New Arrivals",
        href: "/category/women?filter=new",
        children: [
          { label: "New Arrivals", href: "/category/women?filter=new" },
        ],
      },
      {
        label: "Clothing",
        href: "/category/women",
        children: [
          { label: "Sarees & Blouses", href: "/category/women?subcategory=saree" },
          { label: "Lehenga Sets", href: "/category/women?subcategory=lehenga" },
          { label: "Indowestern Jackets", href: "/category/women?subcategory=jacket" },
          { label: "Gowns", href: "/category/women?subcategory=gown" },
        ],
      },
      {
        label: "Shop By Occasion",
        href: "/category/women",
        children: [
          { label: "Wedding", href: "/category/women?occasion=wedding" },
          { label: "Engagement", href: "/category/women?occasion=engagement" },
          { label: "Sangeet", href: "/category/women?occasion=sangeet" },
          { label: "Reception", href: "/category/women?occasion=reception" },
        ],
      },
    ],
  },
  {
    label: "MEN",
    href: "/category/men",
    children: [
      {
        label: "New Arrival",
        href: "/category/men?filter=new",
        children: [
          { label: "New Arrivals", href: "/category/men?filter=new" },
        ],
      },
      {
        label: "Clothing",
        href: "/category/men",
        children: [
          { label: "Sherwanis Sets", href: "/category/men?subcategory=sherwani" },
          { label: "Kurtas Sets", href: "/category/men?subcategory=kurta" },
          { label: "Bandgala Sets", href: "/category/men?subcategory=bandgala" },
        ],
      },
      {
        label: "Shop By Occasion",
        href: "/category/men",
        children: [
          { label: "Wedding", href: "/category/men?occasion=wedding" },
          { label: "Engagement", href: "/category/men?occasion=engagement" },
          { label: "Sangeet", href: "/category/men?occasion=sangeet" },
          { label: "Reception", href: "/category/men?occasion=reception" },
        ],
      },
    ],
  },
  {
    label: "WEDDING",
    href: "/category/weddings",
    children: [
      {
        label: "New Arrivals",
        href: "/category/weddings?filter=new",
        children: [
          { label: "New Arrivals", href: "/category/weddings?filter=new" },
        ],
      },
      {
        label: "Couture",
        href: "/category/weddings",
        children: [
          { label: "Nikah & Valima", href: "/category/weddings?subcategory=nikah" },
          { label: "Anant Karaj", href: "/category/weddings?subcategory=anant-karaj" },
          { label: "Sahi Vivah", href: "/category/weddings?subcategory=sahi-vivah" },
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
        href: "/world-of-lalit-dalima/social",
        children: [{ label: "Social Initiative", href: "/world-of-lalit-dalima/social" }],
      },
      {
        label: "Artisanship",
        href: "/world-of-lalit-dalima/craft",
        children: [{ label: "Craft Preservation", href: "/world-of-lalit-dalima/craft" }],
      },
      {
        label: "Retail",
        href: "/world-of-lalit-dalima/retail",
        children: [{ label: "Art of Retail", href: "/world-of-lalit-dalima/retail" }],
      },
    ],
  },
];

