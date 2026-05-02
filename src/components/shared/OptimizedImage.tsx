"use client";

import Image, { ImageProps } from "next/image";

const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNmMGVkZTgiLz48L3N2Zz4=";

type OptimizedImageProps = ImageProps & {
  /** Override the default quality (75 set in next.config) */
  quality?: number;
};

export default function OptimizedImage({
  placeholder,
  blurDataURL,
  loading,
  priority,
  sizes,
  quality,
  ...rest
}: OptimizedImageProps) {
  return (
    <Image
      // Default to blur placeholder for a premium loading experience
      placeholder={placeholder ?? "blur"}
      blurDataURL={blurDataURL ?? BLUR_DATA_URL}
      // Lazy-load by default; only priority images load eagerly
      loading={priority ? undefined : loading ?? "lazy"}
      priority={priority}
      // Provide a sensible default sizes if not specified
      sizes={sizes ?? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
      // Default quality 75 for optimal compression vs visual fidelity
      quality={quality ?? 75}
      {...rest}
    />
  );
}
