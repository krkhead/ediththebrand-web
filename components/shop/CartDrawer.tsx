"use client";

import { PAYMENT_DETAILS_LINE, type CouponDefinition } from "@/lib/shop-config";
import { formatNaira } from "@/lib/shop-utils";
import { useCartStore, type CartItem } from "@/store/cart";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const WHATSAPP_NUMBER = "2349049695621";

function buildWhatsAppLink(
  items: CartItem[],
  subtotal: number,
  discount: number,
  finalTotal: number,
  appliedCoupon: CouponDefinition | null
): string {
  const lines = items
    .map((item) => {
      const unitPrice = item.price
        ? formatNaira(parseFloat(item.price))
        : "price TBC";
      const lineTotal =
        item.price && item.quantity > 1
          ? ` (${formatNaira(parseFloat(item.price) * item.quantity)} total)`
          : "";

      return `• ${item.name} × ${item.quantity} — ${unitPrice}${lineTotal}`;
    })
    .join("\n");

  const pricingLines = [
    subtotal > 0 ? `*Subtotal:* ${formatNaira(subtotal)}` : "*Subtotal:* Price on request",
    appliedCoupon && discount > 0
      ? `*Coupon:* ${appliedCoupon.code} (-${formatNaira(discount)})`
      : null,
    finalTotal > 0 ? `*Order Total:* ${formatNaira(finalTotal)}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const message =
    `Hi Edith! I'd like to place an order from ETBstore.\n\n` +
    `*My Order:*\n${lines}\n\n` +
    `${pricingLines}\n\n` +
    `*Payment Details:* ${PAYMENT_DETAILS_LINE}\n\n` +
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
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    totalPrice,
    appliedCoupon,
    applyCoupon,
    clearCoupon,
    discountAmount,
    finalTotal,
    syncCoupons,
  } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMessage, setCouponMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (mounted && isOpen) {
      void syncCoupons();
    }
  }, [isOpen, mounted, syncCoupons]);

  useEffect(() => {
    setCouponCode(appliedCoupon?.code ?? "");
  }, [appliedCoupon]);

  if (!mounted || !isOpen) return null;

  const subtotal = totalPrice();
  const discount = discountAmount();
  const total = finalTotal();

  const handleApplyCoupon = async () => {
    setCouponLoading(true);
    const result = await applyCoupon(couponCode);
    setCouponMessage({
      type: result.ok ? "success" : "error",
      text: result.message,
    });
    setCouponLoading(false);
  };

  const handleClearCoupon = () => {
    clearCoupon();
    setCouponCode("");
    setCouponMessage(null);
  };

  return (
    <>
      <div className="fixed inset-0 z-[70] cart-backdrop" onClick={closeCart} />

      <div className="fixed right-0 top-0 z-[80] flex h-full w-full max-w-md flex-col bg-[#F8F4EE] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#E0D8CE] px-6 py-5">
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
            className="p-1 text-[#8A7D72] transition-colors hover:text-[#3D2E24]"
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <ShoppingBag size={48} className="text-[#8A7D72]" />
              <p className="text-[#8A7D72]">Your cart is empty.</p>
              <Link
                href="/shop"
                onClick={closeCart}
                className="border border-[#E8A020] px-5 py-2 text-sm text-[#E8A020] transition-colors hover:bg-[#E8A020] hover:text-white"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="relative h-20 w-20 flex-shrink-0 bg-[#F0EAE0]">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ShoppingBag size={24} className="text-[#8A7D72]" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[#3D2E24]">
                    {item.name}
                  </p>
                  <p className="mt-0.5 text-sm text-[#E8A020]">
                    {item.price
                      ? formatNaira(parseFloat(item.price))
                      : "Price on request"}
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="flex h-7 w-7 items-center justify-center border border-[#8A7D72] transition-colors hover:border-[#3D2E24]"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-6 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="flex h-7 w-7 items-center justify-center border border-[#8A7D72] transition-colors hover:border-[#3D2E24]"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="self-start text-[#8A7D72] transition-colors hover:text-red-500"
                >
                  <X size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="space-y-4 border-t border-[#E0D8CE] px-6 py-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#8A7D72]">Subtotal</span>
              <span className="text-lg font-medium text-[#3D2E24]">
                {subtotal > 0 ? formatNaira(subtotal) : "Price on request"}
              </span>
            </div>

            <div className="space-y-3 border border-[#E0D8CE] bg-white px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] tracking-widest uppercase text-[#8A7D72]">
                    Coupon Code
                  </p>
                  <p className="text-xs text-[#8A7D72]">
                    Discounts apply to priced items in cart.
                  </p>
                </div>
                {appliedCoupon && (
                  <button
                    type="button"
                    onClick={handleClearCoupon}
                    className="text-[10px] tracking-[0.2em] uppercase text-[#8A7D72] transition-colors hover:text-[#3D2E24]"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  value={couponCode}
                  onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
                  placeholder="Enter coupon"
                  className="min-w-0 flex-1 border border-[#E0D8CE] px-3 py-2 text-sm outline-none transition-colors focus:border-[#E8A020]"
                />
                <button
                  type="button"
                  onClick={() => void handleApplyCoupon()}
                  disabled={couponLoading}
                  className="bg-[#3D2E24] px-4 py-2 text-[10px] tracking-[0.2em] uppercase text-[#F8F4EE] transition-colors hover:bg-[#2A1F18] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {couponLoading ? "Checking" : "Apply"}
                </button>
              </div>

              {couponMessage && (
                <p
                  className={`text-xs ${
                    couponMessage.type === "success"
                      ? "text-[#2C7A2C]"
                      : "text-red-600"
                  }`}
                >
                  {couponMessage.text}
                </p>
              )}

              {appliedCoupon && discount > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#8A7D72]">
                    {appliedCoupon.code} discount
                  </span>
                  <span className="text-[#2C7A2C]">-{formatNaira(discount)}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-[#8A7D72]">Final total</span>
              <span className="text-lg font-medium text-[#3D2E24]">
                {total > 0 ? formatNaira(total) : "Price on request"}
              </span>
            </div>

            <a
              href={buildWhatsAppLink(items, subtotal, discount, total, appliedCoupon)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 bg-[#25D366] py-3 text-sm tracking-widest text-white transition-colors hover:bg-[#1ebe5a]"
            >
              <WhatsAppIcon />
              ORDER VIA WHATSAPP
            </a>

            <p className="text-center text-xs leading-relaxed text-[#8A7D72]">
              Tap above to send your order summary on WhatsApp.
              <br />
              Payment details will appear in the chat with your order.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
