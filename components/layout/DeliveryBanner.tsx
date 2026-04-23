import { DELIVERY_POLICY_LINES } from "@/lib/shop-config";

const MARQUEE_ITEMS = [...DELIVERY_POLICY_LINES, ...DELIVERY_POLICY_LINES];

export default function DeliveryBanner() {
  return (
    <div className="fixed inset-x-0 top-0 z-[60] overflow-hidden border-b border-[#5A4535] bg-[#2A1F18] text-[#F8F4EE]">
      <div className="delivery-marquee flex min-w-max items-center gap-12 py-2 text-xs tracking-[0.2em] uppercase">
        {MARQUEE_ITEMS.map((item, index) => (
          <span key={`${item}-${index}`} className="whitespace-nowrap">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
