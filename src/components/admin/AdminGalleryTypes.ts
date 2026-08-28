import type { GalleryFrameFormat } from "@/lib/gallery-products";

export type ProductForm = {
  name: string;
  title: string;
  category: string;
  price: string;
  originalPrice: string;
  dimensions: string;
  includedItems: string;
  description: string;
  placeholder: string;
  staticImage: string;
  hoverImage: string;
  frameFormat: GalleryFrameFormat;
  surface: string;
  width: number;
  offset: number;
  rotate: number;
};

export type ImageField = "staticImage" | "hoverImage";

export type UpdateProductForm = <Key extends keyof ProductForm>(key: Key, value: ProductForm[Key]) => void;
