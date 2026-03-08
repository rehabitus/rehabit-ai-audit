export interface LinkedInMetrics {
    spend: number | null;       // USD
    clicks: number | null;
    impressions: number | null;
    cpc: number | null;         // cost per click
}

async function getAccessToken(): Promise<string | null> {
    const refreshToken = process.env.LINKEDIN_REFRESH_TOKEN;
    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;

    if (!refreshToken || !clientId || !clientSecret) return null;

    const res = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: refreshToken,
            client_id: clientId,
            client_secret: clientSecret,
        }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.access_token ?? null;
}

export async function getLinkedInMetrics(adAccountId: string, days: number): Promise<LinkedInMetrics> {
    const empty = { spend: null, clicks: null, impressions: null, cpc: null };

    try {
        const accessToken = await getAccessToken();
        if (!accessToken) return empty;

        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - days);

        const url = new URL("https://api.linkedin.com/v2/adAnalyticsV2");
        url.searchParams.set("q", "analytics");
        url.searchParams.set("pivot", "ACCOUNT");
        url.searchParams.set("dateRange.start.year", String(start.getFullYear()));
        url.searchParams.set("dateRange.start.month", String(start.getMonth() + 1));
        url.searchParams.set("dateRange.start.day", String(start.getDate()));
        url.searchParams.set("dateRange.end.year", String(end.getFullYear()));
        url.searchParams.set("dateRange.end.month", String(end.getMonth() + 1));
        url.searchParams.set("dateRange.end.day", String(end.getDate()));
        url.searchParams.set("fields", "costInLocalCurrency,clicks,impressions");
        url.searchParams.set("accounts", `urn:li:sponsoredAccount:${adAccountId}`);
        url.searchParams.set("timeGranularity", "ALL");

        const res = await fetch(url.toString(),
            { headers: { Authorization: `Bearer ${accessToken}`, "LinkedIn-Version": "202401" } }
        );

        if (!res.ok) return empty;

        const data = await res.json();
        const element = data.elements?.[0];
        if (!element) return empty;

        const spend = parseFloat(element.costInLocalCurrency ?? "0");
        const clicks = parseInt(element.clicks ?? "0", 10);
        const impressions = parseInt(element.impressions ?? "0", 10);
        const cpc = clicks > 0 ? spend / clicks : null;

        return { spend, clicks, impressions, cpc };
    } catch {
        return empty;
    }
}
