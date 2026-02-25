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

/**
 * UPDATE THIS NUMBER when a verified audit client leaves a review.
 * Then: commit + push → Vercel auto-deploys → price, slots, and trust bar all update.
 * Git history becomes the audit trail of every review received.
 */
export const REVIEW_COUNT = 0;

export function getReviewCount(): number {
  return REVIEW_COUNT;
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
  /** How many more reviews until the price jumps to the next tier.
   *  null = already at full rate (no next tier). Auto-computed from REVIEW_COUNT. */
  slotsRemaining: number | null;
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
    slotsRemaining: reviewsToNextTier, // auto-computed — no override needed
  };
}
