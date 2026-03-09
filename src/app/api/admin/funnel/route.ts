import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getGA4Metrics } from "@/lib/ga4";
import { getLinkedInMetrics } from "@/lib/linkedin";
import { isAdminAuthenticated } from "@/lib/adminAuth";

export interface FunnelStep {
    id: string;
    label: string;
    sublabel?: string;
    value: number | null;
    formatted: string | null;
    detail: string | null;
    source: "stripe" | "ga4" | "linkedin" | "manual" | "calendly";
    connected: boolean;
    note: string | null;
    breakdown?: { label: string; value: number | string }[];
}

export interface FunnelData {
    period: number;
    generatedAt: string;
    steps: FunnelStep[];
}

export async function GET(req: NextRequest) {
    if (!isAdminAuthenticated(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const days = parseInt(req.nextUrl.searchParams.get("days") ?? "30");
    const since = Math.floor(Date.now() / 1000) - days * 24 * 60 * 60;

    // — Stripe data —
    let checkoutStarts = 0;
    let purchaseCount = 0;
    let revenue = 0;
    let stripeError = false;

    try {
        const stripe = getStripe();
        const sessions = await stripe.checkout.sessions.list({ limit: 100, created: { gte: since } });
        // Filter to Audit product only: metadata tag (new sessions) or amount >= $1,000 (historical)
        const auditSessions = sessions.data.filter(
            (s) => s.metadata?.product === "ai_transformation_audit" || (s.amount_total ?? 0) >= 40000
        );
        checkoutStarts = auditSessions.length;
        const paid = auditSessions.filter((s) => s.payment_status === "paid");
        purchaseCount = paid.length;
        revenue = paid.reduce((sum, s) => sum + (s.amount_total ?? 0), 0) / 100;
    } catch {
        stripeError = true;
    }

    // — GA4 data —
    const ga4PropertyId = process.env.GA4_PROPERTY_ID ?? "";
    const hasGA4 = !!ga4PropertyId && (
        (!!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET && !!process.env.GOOGLE_REFRESH_TOKEN)
        || !!process.env.GOOGLE_SERVICE_ACCOUNT_JSON
    );
    const ga4 = hasGA4
        ? await getGA4Metrics(ga4PropertyId, days)
        : { pageviews: null, scorecardStarts: null, scorecardCompletions: null, discoveryClicks: null, sources: {} };

    // — LinkedIn API data —
    const linkedInAccountId = process.env.LINKEDIN_AD_ACCOUNT_ID ?? "";
    const hasLinkedIn = !!linkedInAccountId && !!process.env.LINKEDIN_CLIENT_ID
        && !!process.env.LINKEDIN_CLIENT_SECRET && !!process.env.LINKEDIN_REFRESH_TOKEN;
    const li = hasLinkedIn
        ? await getLinkedInMetrics(linkedInAccountId, days)
        : { spend: null, clicks: null, impressions: null, cpc: null };

    // Fall back to manual ad spend env var if LinkedIn API not connected
    const manualSpend = process.env.LINKEDIN_AD_SPEND ? parseFloat(process.env.LINKEDIN_AD_SPEND) : null;
    const adSpend = li.spend ?? manualSpend;
    const costPerPurchase = adSpend && purchaseCount > 0 ? adSpend / purchaseCount : null;

    const steps: FunnelStep[] = [
        {
            id: "ad_spend",
            label: "LinkedIn Ad Spend",
            sublabel: `Last ${days} days`,
            value: adSpend,
            formatted: adSpend != null ? `$${adSpend.toLocaleString("en-US")}` : null,
            detail: null,
            source: "manual",
            connected: adSpend != null,
            note: adSpend == null ? "Add LINKEDIN_AD_SPEND to Vercel env vars (e.g. 500)" : null,
        },
        {
            id: "ad_clicks",
            label: "Ad Clicks",
            sublabel: "LinkedIn Campaign Manager",
            value: li.clicks,
            formatted: li.clicks != null ? li.clicks.toLocaleString("en-US") : "—",
            detail: li.cpc != null ? `$${li.cpc.toFixed(2)} CPC` : (adSpend != null ? `Target: <$1.00 CPC` : null),
            source: "linkedin",
            connected: hasLinkedIn && li.clicks != null,
            note: hasLinkedIn ? null : "LinkedIn Ads API — connect on Integrations page",
        },
        {
            id: "pageviews",
            label: "Landing Page Views",
            sublabel: "Total across all traffic sources",
            value: ga4.pageviews,
            formatted: ga4.pageviews != null ? ga4.pageviews.toLocaleString("en-US") : null,
            detail: null,
            source: "ga4",
            connected: hasGA4 && ga4.pageviews != null,
            note: !hasGA4 ? "Connect GA4 on Integrations page" : null,
            breakdown: Object.entries(ga4.sources || {})
                .sort(([, a], [, b]) => (b as number) - (a as number))
                .slice(0, 5)
                .map(([label, value]) => ({ label, value: value as number })),
        },
        {
            id: "scorecard_starts",
            label: "Scorecards Started",
            sublabel: "/scorecard page visits",
            value: ga4.scorecardStarts,
            formatted: ga4.scorecardStarts != null ? ga4.scorecardStarts.toLocaleString("en-US") : null,
            detail: null,
            source: "ga4",
            connected: hasGA4 && ga4.scorecardStarts != null,
            note: !hasGA4 ? "Connect GA4 on Integrations page" : null,
        },
        {
            id: "scorecard_completions",
            label: "Scorecards Completed",
            sublabel: "scorecard_complete events",
            value: ga4.scorecardCompletions,
            formatted: ga4.scorecardCompletions != null ? ga4.scorecardCompletions.toLocaleString("en-US") : null,
            detail: null,
            source: "ga4",
            connected: hasGA4 && ga4.scorecardCompletions != null,
            note: !hasGA4 ? "Connect GA4 on Integrations page" : null,
        },
        {
            id: "checkout_starts",
            label: "Checkout Started",
            sublabel: "Stripe sessions opened",
            value: stripeError ? null : checkoutStarts,
            formatted: stripeError ? null : checkoutStarts.toString(),
            detail: null,
            source: "stripe",
            connected: !stripeError,
            note: stripeError ? "STRIPE_SECRET_KEY not configured" : null,
        },
        {
            id: "purchases",
            label: "Purchases",
            sublabel: "Stripe paid sessions",
            value: stripeError ? null : purchaseCount,
            formatted: stripeError ? null : purchaseCount.toString(),
            detail: revenue > 0 ? `$${revenue.toLocaleString("en-US", { minimumFractionDigits: 0 })} revenue` : null,
            source: "stripe",
            connected: !stripeError,
            note: null,
        },
        {
            id: "discovery_clicks",
            label: "Discovery Call Clicks",
            sublabel: "book_call_click events",
            value: ga4.discoveryClicks,
            formatted: ga4.discoveryClicks != null ? ga4.discoveryClicks.toLocaleString("en-US") : null,
            detail: null,
            source: "ga4",
            connected: hasGA4 && ga4.discoveryClicks != null,
            note: !hasGA4 ? "Connect GA4 to track CTA events" : null,
        },
        {
            id: "discovery_booked",
            label: "Discovery Calls Booked",
            sublabel: "Calendly confirmations",
            value: null,
            formatted: null,
            detail: null,
            source: "calendly",
            connected: false,
            note: "Connect Calendly on Integrations page",
        },
    ];

    return NextResponse.json({ period: days, generatedAt: new Date().toISOString(), steps } satisfies FunnelData);
}
