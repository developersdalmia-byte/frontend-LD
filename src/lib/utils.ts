
export function formatPrice(amount: number, currency = "INR"): string {
  if (currency === "INR") {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

// ─── String Helpers ───────────────────────────────────────────────────────────

/** Convert a slug like "my-product-name" → "My Product Name" */
export function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}


export function truncate(str: string, maxLength = 100): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 1) + "…";
}

// ─── Class Name Merging ───────────────────────────────────────────────────────

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

// ─── Availability Labels ──────────────────────────────────────────────────────

const AVAILABILITY_LABELS: Record<string, string> = {
  available: "Available",
  "made-to-order": "Made to Order",
  "sold-out": "Sold Out",
};

export function availabilityLabel(status: string): string {
  return AVAILABILITY_LABELS[status] ?? status;
}

// ─── Image URL Helpers ────────────────────────────────────────────────────────

export function primaryImage(
  images: string[],
  fallback = "https://api.lalitdalmia.com/uploads/websiteImages/images/placeholder.webp"
): string {
  return images[0] ?? fallback;
}

// ─── Google OAuth Helpers ────────────────────────────────────────────────────


export function handleGoogleRedirect(): void {
  if (typeof window === "undefined") return;

  const hash = window.location.hash;
  if (!hash) return;

  const params = new URLSearchParams(hash.replace("#", ""));

  const accessToken = params.get("accessToken");
  const refreshToken = params.get("refreshToken");

  if (accessToken && refreshToken) {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    window.history.replaceState({}, document.title, window.location.pathname);
  }
}
