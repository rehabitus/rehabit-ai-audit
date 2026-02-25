/**
 * Review-based pricing tiers.
 * Price steps up every 5 Trustpilot reviews.
 * Update REVIEW_COUNT in env to move tiers.
 */

export interface PricingTier {
  minReviews: number;
  maxReviews: number; // inclusive, use Infinity for the cap tier
  priceUsd: number;
  label: string;
}

export const PRICING_TIERS: PricingTier[] = [
  { minReviews: 0,  maxReviews: 4,        priceUsd: 500,  label: "Early Access"    },
  { minReviews: 5,  maxReviews: 9,        priceUsd: 1000, label: "Founding Member"  },
  { minReviews: 10, maxReviews: 14,       priceUsd: 1500, label: "Early Adopter"    },
  { minReviews: 15, maxReviews: 19,       priceUsd: 2000, label: "Standard"         },
  { minReviews: 20, maxReviews: 24,       priceUsd: 2500, label: "Standard+"        },
  { minReviews: 25, maxReviews: Infinity, priceUsd: 3000, label: "Full Rate"        },
];

export function getReviewCount(): number {
  const raw = process.env.REVIEW_COUNT ?? "0";
  const n = parseInt(raw, 10);
  return isNaN(n) || n < 0 ? 0 : n;
}

export function getTierForReviews(reviewCount: number): PricingTier {
  return (
    PRICING_TIERS.find(
      (t) => reviewCount >= t.minReviews && reviewCount <= t.maxReviews
    ) ?? PRICING_TIERS[PRICING_TIERS.length - 1]
  );
}

export function getNextTier(current: PricingTier): PricingTier | null {
  const idx = PRICING_TIERS.indexOf(current);
  return idx >= 0 && idx < PRICING_TIERS.length - 1
    ? PRICING_TIERS[idx + 1]
    : null;
}

export interface PricingInfo {
  reviewCount: number;
  priceUsd: number;
  priceCents: number;
  label: string;
  nextPriceUsd: number | null;
  reviewsToNextTier: number | null;
  /** Slots remaining at current price. Set SLOTS_REMAINING env var to override
   *  the auto-calculated value (reviewsToNextTier). Use to tighten scarcity. */
  slotsRemaining: number | null;
}

export function getSlotsRemaining(reviewsToNextTier: number | null): number | null {
  const raw = process.env.SLOTS_REMAINING;
  if (raw !== undefined && raw !== "") {
    const n = parseInt(raw, 10);
    if (!isNaN(n) && n >= 0) return n;
  }
  return reviewsToNextTier;
}

export function getCurrentPricing(): PricingInfo {
  const reviewCount = getReviewCount();
  const tier = getTierForReviews(reviewCount);
  const next = getNextTier(tier);
  const reviewsToNextTier = next ? next.minReviews - reviewCount : null;

  return {
    reviewCount,
    priceUsd: tier.priceUsd,
    priceCents: tier.priceUsd * 100,
    label: tier.label,
    nextPriceUsd: next?.priceUsd ?? null,
    reviewsToNextTier,
    slotsRemaining: getSlotsRemaining(reviewsToNextTier),
  };
}
