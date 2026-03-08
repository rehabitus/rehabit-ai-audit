interface Integration {
    name: string;
    description: string;
    status: "connected" | "manual" | "not_connected";
    envVar?: string;
    docsUrl?: string;
    note: string;
}

function StatusBadge({ status }: { status: Integration["status"] }) {
    if (status === "connected") return (
        <span className="text-xs font-medium bg-brand-green/15 text-brand-green border border-brand-green/20 px-2.5 py-1 rounded-full">
            ✓ Connected
        </span>
    );
    if (status === "manual") return (
        <span className="text-xs font-medium bg-brand-gold/15 text-brand-gold border border-brand-gold/20 px-2.5 py-1 rounded-full">
            Manual input
        </span>
    );
    return (
        <span className="text-xs font-medium bg-white/5 text-slate-500 border border-white/10 px-2.5 py-1 rounded-full">
            Not connected
        </span>
    );
}

export default async function IntegrationsPage() {
    // Read env vars server-side to show real status
    const hasStripe = !!process.env.STRIPE_SECRET_KEY;
    const hasLinkedInSpend = !!process.env.LINKEDIN_AD_SPEND;
    const hasGA4 = !!process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    const hasAdminPw = !!process.env.ADMIN_PASSWORD;

    const integrations: Integration[] = [
        {
            name: "Stripe",
            description: "Checkout sessions, purchases, and revenue data.",
            status: hasStripe ? "connected" : "not_connected",
            envVar: "STRIPE_SECRET_KEY",
            docsUrl: "https://dashboard.stripe.com/apikeys",
            note: hasStripe ? "Pulling live data." : "Add STRIPE_SECRET_KEY to Vercel env vars.",
        },
        {
            name: "Google Analytics 4",
            description: "Pageviews, traffic sources, scorecard funnel, CTA click events.",
            status: hasGA4 ? "connected" : "not_connected",
            envVar: "GOOGLE_SERVICE_ACCOUNT_JSON",
            docsUrl: "https://console.cloud.google.com/iam-admin/serviceaccounts",
            note: hasGA4
                ? "GA4 data active."
                : "Create a Google service account, give it Viewer access to your GA4 property, then paste the JSON into GOOGLE_SERVICE_ACCOUNT_JSON in Vercel.",
        },
        {
            name: "LinkedIn Ad Spend",
            description: "Manual ad spend input for ROI calculations.",
            status: hasLinkedInSpend ? "manual" : "not_connected",
            envVar: "LINKEDIN_AD_SPEND",
            note: hasLinkedInSpend
                ? `Currently set. Update in Vercel as spend changes.`
                : "Add LINKEDIN_AD_SPEND=500 (number only, USD) to Vercel env vars. Update monthly.",
        },
        {
            name: "LinkedIn Ads API",
            description: "Live ad clicks, impressions, and CPM data.",
            status: "not_connected",
            docsUrl: "https://learn.microsoft.com/en-us/linkedin/marketing/integrations/ads/",
            note: "Requires LinkedIn OAuth app approval. Lower priority — use Campaign Manager dashboard for now.",
        },
        {
            name: "Calendly",
            description: "Discovery call bookings and confirmation data.",
            status: "not_connected",
            envVar: "CALENDLY_API_KEY",
            docsUrl: "https://calendly.com/integrations/api_webhooks",
            note: "Add CALENDLY_API_KEY from your Calendly account settings.",
        },
        {
            name: "Microsoft Clarity",
            description: "Session recordings and heatmaps.",
            status: "connected",
            note: "Project vsinfwt5xe active. View recordings at clarity.microsoft.com.",
        },
        {
            name: "Admin Password",
            description: "Protects this dashboard.",
            status: hasAdminPw ? "connected" : "not_connected",
            envVar: "ADMIN_PASSWORD",
            note: hasAdminPw ? "Set." : "Add ADMIN_PASSWORD to Vercel env vars to secure this dashboard.",
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-white">Integrations</h1>
                <p className="text-slate-500 text-sm mt-1">
                    Connect data sources to power the funnel dashboard. Most require adding env vars in{" "}
                    <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-brand-green underline underline-offset-2">
                        Vercel
                    </a>
                    .
                </p>
            </div>

            <div className="space-y-3">
                {integrations.map((intg) => (
                    <div
                        key={intg.name}
                        className="bg-white/[0.03] border border-white/10 rounded-2xl p-5"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="font-semibold text-white">{intg.name}</span>
                                    <StatusBadge status={intg.status} />
                                </div>
                                <p className="text-slate-400 text-sm">{intg.description}</p>
                                <p className="text-slate-500 text-xs mt-2">{intg.note}</p>
                                {intg.envVar && (
                                    <code className="text-xs text-brand-green/70 bg-brand-green/5 border border-brand-green/10 px-2 py-0.5 rounded mt-2 inline-block font-mono">
                                        {intg.envVar}
                                    </code>
                                )}
                            </div>
                            {intg.docsUrl && (
                                <a
                                    href={intg.docsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="shrink-0 text-xs text-slate-400 hover:text-white border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg transition-all"
                                >
                                    Docs →
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-brand-green/5 border border-brand-green/20 rounded-2xl p-5 text-sm text-slate-400">
                <p className="font-semibold text-brand-green mb-1">Quick setup order</p>
                <ol className="list-decimal list-inside space-y-1">
                    <li>Add <code className="text-brand-green/80 font-mono text-xs">ADMIN_PASSWORD</code> in Vercel → redeploy → you&apos;re locked in</li>
                    <li>Add <code className="text-brand-green/80 font-mono text-xs">LINKEDIN_AD_SPEND=500</code> → dashboard shows ROI immediately</li>
                    <li>Create Google service account → add <code className="text-brand-green/80 font-mono text-xs">GOOGLE_SERVICE_ACCOUNT_JSON</code> → full funnel unlocks</li>
                    <li>Add <code className="text-brand-green/80 font-mono text-xs">CALENDLY_API_KEY</code> → booking conversions tracked</li>
                </ol>
            </div>
        </div>
    );
}
