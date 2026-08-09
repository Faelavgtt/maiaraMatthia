import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { createOrder } from "@/lib/api";

export type CartItemInput = {
  productId?: string;
  title: string;
  category?: string;
  price?: string;
  dimensions?: string;
  imageUrl?: string;
  notes?: string;
};

export type CartItem = CartItemInput & {
  id: string;
  quantity: number;
};

type CheckoutInput = {
  customerName: string;
  phone: string;
  email?: string;
  notes?: string;
};

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  itemCount: number;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: CartItemInput) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  checkout: (input: CheckoutInput) => Promise<{ code: string; whatsappUrl: string | null }>;
};

const cartStorageKey = "maiara-cart";
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => readStoredCart());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(cartStorageKey, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((item: CartItemInput) => {
    setItems((current) => {
      const existing = current.find((cartItem) => sameCartItem(cartItem, item));
      if (existing) {
        return current.map((cartItem) =>
          cartItem.id === existing.id ? { ...cartItem, quantity: Math.min(cartItem.quantity + 1, 99) } : cartItem,
        );
      }

      return [...current, { ...item, id: crypto.randomUUID(), quantity: 1 }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, Math.min(quantity, 99)) } : item)),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const checkout = useCallback(async (input: CheckoutInput) => {
    if (items.length === 0) throw new Error("Seu carrinho esta vazio.");

    const response = await createOrder({
      ...input,
      items: items.map((item) => ({
        productId: item.productId,
        title: item.title,
        category: item.category,
        price: item.price,
        dimensions: item.dimensions,
        quantity: item.quantity,
        notes: item.notes,
        imageUrl: item.imageUrl,
      })),
    });

    clearCart();
    setIsOpen(false);
    return { code: response.code, whatsappUrl: response.whatsappUrl };
  }, [clearCart, items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      isOpen,
      itemCount: items.reduce((total, item) => total + item.quantity, 0),
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      checkout,
    }),
    [addItem, checkout, clearCart, isOpen, items, removeItem, updateQuantity],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}

function readStoredCart() {
  if (typeof window === "undefined") return [];

  try {
    const parsed = JSON.parse(window.localStorage.getItem(cartStorageKey) ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isCartItem);
  } catch {
    return [];
  }
}

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Partial<CartItem>;
  return typeof item.id === "string" && typeof item.title === "string" && typeof item.quantity === "number";
}

function sameCartItem(item: CartItem, input: CartItemInput) {
  return item.productId === input.productId && item.title === input.title && item.dimensions === input.dimensions;
}
