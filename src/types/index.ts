export type ProductCategory =
  | "womenswear"
  | "menswear"
  | "weddings"
  | "accessories"
  | "jewellery";

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  subcategory?: string;
  price: number;
  currency: string;
  images: string[];
  sizes: string[];
  description: string;
  fabric?: string;
  care?: string;
  availability: "available" | "made-to-order" | "sold-out";
  collection?: string;
  featured: boolean;
  new: boolean;
  tags: string[];
  attributes?: {
    occasion?: string;
    style?: string;
    weddingType?: string[];
  };
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  season: string;
  year: number;
  description: string;
  coverImage: string;
  images: string[];
  category: ProductCategory;
  products: string[];
  featured: boolean;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface Store {
  id: string;
  city: string;
  country: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  coordinates: { lat: number; lng: number };
  image: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface NewsletterFormData {
  email: string;
  firstName?: string;
}

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  storeCity?: string;
}

export interface HeroBanner {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  mobileImage?: string;
  video?: string;
  cta: { label: string; href: string };
  overlayOpacity?: number;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  title?: string;
  image?: string;
}