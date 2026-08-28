import type { ProductForm } from "@/components/admin/AdminGalleryTypes";

export const adminDraftKeys = {
  galleryProduct: "maiara-admin-draft-gallery-product",
  otherProject: "maiara-admin-draft-other-project",
} as const;

type ProductFormDraft = {
  form: ProductForm;
  editingProductId: string | null;
};

export function readAdminProductDraft(key: string, fallback: ProductForm): ProductFormDraft {
  if (typeof window === "undefined") return { form: fallback, editingProductId: null };

  try {
    const rawDraft = window.localStorage.getItem(key);
    if (!rawDraft) return { form: fallback, editingProductId: null };

    const parsed = JSON.parse(rawDraft) as Partial<ProductFormDraft>;
    if (!parsed.form) return { form: fallback, editingProductId: null };

    return {
      form: { ...fallback, ...parsed.form },
      editingProductId: typeof parsed.editingProductId === "string" ? parsed.editingProductId : null,
    };
  } catch {
    return { form: fallback, editingProductId: null };
  }
}

export function writeAdminProductDraft(key: string, draft: ProductFormDraft, fallback: ProductForm) {
  if (typeof window === "undefined") return;

  const hasFormChanges = JSON.stringify(draft.form) !== JSON.stringify(fallback);
  if (!hasFormChanges && !draft.editingProductId) {
    window.localStorage.removeItem(key);
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(draft));
}

export function removeAdminProductDraft(key: string) {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(key);
}

export function clearAdminDrafts() {
  if (typeof window === "undefined") return;
  Object.values(adminDraftKeys).forEach((key) => window.localStorage.removeItem(key));
}
