export const PAYMENT_DETAILS = {
  bank: "Moniepoint MFB",
  accountNumber: "9049695621",
  accountName: "Ediththebrand",
};

export const PAYMENT_DETAILS_LINE = `${PAYMENT_DETAILS.bank} · ${PAYMENT_DETAILS.accountNumber} · ${PAYMENT_DETAILS.accountName}`;

export const DELIVERY_POLICY_LINES = [
  "Within Lagos: 2–3 working days",
  "Interstate: 4–7 working days",
  "Please note, extreme locations in either category may take longer.",
];

export type CouponDefinition = {
  code: string;
  type: "percent" | "fixed";
  value: number;
  label: string;
};

export const FALLBACK_COUPON_DEFINITIONS: CouponDefinition[] = [
  {
    code: "ETB10",
    type: "percent",
    value: 10,
    label: "10% off your order",
  },
  {
    code: "GLOW1500",
    type: "fixed",
    value: 1500,
    label: "₦1,500 off your order",
  },
];

export const PRODUCT_SPOTLIGHTS = {
  newArrivals: [
    "seoul-1988-serum",
    "numbuzin-glow-set",
    "dr-althea-relief-cream",
  ],
  backInStock: ["centella-toning-set", "eos-body-lotion-set"],
};
