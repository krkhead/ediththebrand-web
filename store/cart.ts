"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  getCouponDiscount,
  resolveCoupon,
} from "@/lib/shop-utils";
import type { CouponDefinition } from "@/lib/shop-config";

export interface CartItem {
  id: string;
  name: string;
  price: string | null;
  image: string | null;
  slug: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  appliedCoupon: CouponDefinition | null;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  applyCoupon: (code: string) => { ok: boolean; message: string };
  clearCoupon: () => void;
  totalItems: () => number;
  totalPrice: () => number;
  discountAmount: () => number;
  finalTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      appliedCoupon: null,

      addItem: (item) => {
        const existing = get().items.find((i) => i.id === item.id);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
        } else {
          set({ items: [...get().items, { ...item, quantity: 1 }] });
        }
        set({ isOpen: true });
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => set({ items: [], appliedCoupon: null }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      applyCoupon: (code) => {
        const trimmedCode = code.trim();

        if (!trimmedCode) {
          return { ok: false, message: "Enter a coupon code to apply it." };
        }

        const coupon = resolveCoupon(trimmedCode);
        if (!coupon) {
          return { ok: false, message: "That coupon code is not valid." };
        }

        set({ appliedCoupon: coupon });
        return { ok: true, message: `${coupon.code} applied: ${coupon.label}.` };
      },

      clearCoupon: () => set({ appliedCoupon: null }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () =>
        get().items.reduce((sum, i) => {
          const price = i.price ? parseFloat(i.price) : 0;
          return sum + price * i.quantity;
        }, 0),

      discountAmount: () =>
        getCouponDiscount(get().totalPrice(), get().appliedCoupon),

      finalTotal: () => {
        const subtotal = get().totalPrice();
        return Math.max(0, subtotal - get().discountAmount());
      },
    }),
    {
      name: "etb-cart",
    }
  )
);
