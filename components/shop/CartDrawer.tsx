"use client";

import { useCartStore, type CartItem } from "@/store/cart";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const WHATSAPP_NUMBER = "2349049695621";
const ACCOUNT_DETAILS = "Moniepoint MFB · 9049695621 · Ediththebrand";

function buildWhatsAppLink(items: CartItem[], total: number): string {
  const lines = items
    .map((item) => {
      const unitPrice = item.price
        ? `₦${parseFloat(item.price).toLocaleString()}`
        : "price TBC";
      const lineTotal =
        item.price && item.quantity > 1
          ? ` (₦${(parseFloat(item.price) * item.quantity).toLocaleString()} total)`
          : "";
      return `• ${item.name} × ${item.quantity} — ${unitPrice}${lineTotal}`;
    })
    .join("\n");

  const totalLine =
    total > 0 ? `\n\n*Order Total: ₦${total.toLocaleString()}*` : "";

  const message =
    `Hi Edith! I'd like to place an order from ETBstore 🛍️\n\n` +
    `*My Order:*\n${lines}${totalLine}\n\n` +
    `*Payment:* ${ACCOUNT_DETAILS}\n\n` +
    `Please confirm availability. Thank you!`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function WhatsAppIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.115.553 4.103 1.522 5.83L0 24l6.338-1.498A11.96 11.96 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.003-1.368l-.36-.213-3.761.889.932-3.661-.234-.374A9.77 9.77 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
    </svg>
  );
}

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, totalPrice } =
    useCartStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[70] cart-backdrop"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md z-[80] bg-[#F8F4EE] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E0D8CE]">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-[#3D2E24]" />
            <h2
              className="text-xl text-[#3D2E24]"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              Your Cart
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-1 text-[#8A7D72] hover:text-[#3D2E24] transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingBag size={48} className="text-[#8A7D72]" />
              <p className="text-[#8A7D72]">Your cart is empty.</p>
              <Link
                href="/shop"
                onClick={closeCart}
                className="text-sm text-[#E8A020] border border-[#E8A020] px-5 py-2 hover:bg-[#E8A020] hover:text-white transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4">
                {/* Image */}
                <div className="w-20 h-20 relative flex-shrink-0 bg-[#F0EAE0]">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag size={24} className="text-[#8A7D72]" />
                    </div>
                  )}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#3D2E24] truncate">
                    {item.name}
                  </p>
                  <p className="text-sm text-[#E8A020] mt-0.5">
                    {item.price
                      ? `₦${parseFloat(item.price).toLocaleString()}`
                      : "Price on request"}
                  </p>
                  {/* Quantity */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                      className="w-7 h-7 border border-[#8A7D72] flex items-center justify-center hover:border-[#3D2E24] transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-sm w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      className="w-7 h-7 border border-[#8A7D72] flex items-center justify-center hover:border-[#3D2E24] transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
                {/* Remove */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-[#8A7D72] hover:text-red-500 transition-colors self-start"
                >
                  <X size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-[#E0D8CE] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#8A7D72]">Subtotal</span>
              <span className="text-lg font-medium text-[#3D2E24]">
                {totalPrice() > 0
                  ? `₦${totalPrice().toLocaleString()}`
                  : "Price on request"}
              </span>
            </div>

            {/* Payment info */}
            <div className="bg-[#F0EAE0] px-4 py-3 space-y-1">
              <p className="text-[10px] text-[#8A7D72] tracking-widest uppercase">
                Bank Transfer
              </p>
              <p className="text-sm text-[#3D2E24] font-medium">
                Moniepoint MFB · 9049695621
              </p>
              <p className="text-xs text-[#8A7D72]">Ediththebrand</p>
            </div>

            {/* WhatsApp CTA */}
            <a
              href={buildWhatsAppLink(items, totalPrice())}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white py-3 text-sm tracking-widest hover:bg-[#1ebe5a] transition-colors"
            >
              <WhatsAppIcon />
              ORDER VIA WHATSAPP
            </a>

            <p className="text-xs text-[#8A7D72] text-center leading-relaxed">
              Tap above to send your order to Edith on WhatsApp.
              <br />
              She&apos;ll confirm availability &amp; payment details.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
