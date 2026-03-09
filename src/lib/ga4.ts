/* eslint-disable @typescript-eslint/no-explicit-any */
import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { OAuth2Client } from "google-auth-library";

export interface GA4Metrics {
    pageviews: number | null;            // all landing page views
    scorecardStarts: number | null;      // scorecard_start events
    scorecardCompletions: number | null; // scorecard_complete events
    discoveryClicks: number | null;      // book_call_click events
    sources: Record<string, number>;     // Breakdown by utm_source/sessionSource
}

function getClient(): BetaAnalyticsDataClient | null {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

    // Legacy: service account JSON (kept for backwards compat)
    const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

    if (clientId && clientSecret && refreshToken) {
        const oauth2 = new OAuth2Client(clientId, clientSecret);
        oauth2.setCredentials({ refresh_token: refreshToken });
        return new BetaAnalyticsDataClient({ authClient: oauth2 as never });
    }

    if (serviceAccountJson) {
        try {
            const credentials = JSON.parse(serviceAccountJson);
            return new BetaAnalyticsDataClient({ credentials });
        } catch {
            return null;
        }
    }

    return null;
}

export async function getGA4Metrics(propertyId: string, days: number, sourceFilter?: string): Promise<GA4Metrics> {
    const client = getClient();
    if (!client) {
        return { pageviews: null, scorecardStarts: null, scorecardCompletions: null, discoveryClicks: null, sources: {} };
    }

    const dateRange = { startDate: `${days}daysAgo`, endDate: "today" };

    try {
        const [pageviewRes, eventRes] = (await Promise.all([
            // All landing page views (sessions)
            client.runReport({
                property: `properties/${propertyId}`,
                dateRanges: [dateRange],
                dimensions: [{ name: "sessionSource" }],
                metrics: [{ name: "screenPageViews" }],
                ...(sourceFilter ? {
                    dimensionFilter: {
                        filter: {
                            fieldName: "sessionSource",
                            stringFilter: { matchType: "CONTAINS" as any, value: sourceFilter },
                        },
                    }
                } : {}),
            }),
            // Event counts for key funnel events
            client.runReport({
                property: `properties/${propertyId}`,
                dateRanges: [dateRange],
                dimensions: [{ name: "eventName" }],
                metrics: [{ name: "eventCount" }],
                dimensionFilter: {
                    andGroup: {
                        expressions: [
                            {
                                filter: {
                                    fieldName: "eventName",
                                    inListFilter: {
                                        values: ["page_view", "scorecard_start", "scorecard_complete", "book_call_click"],
                                    },
                                },
                            },
                            ...(sourceFilter ? [{
                                filter: {
                                    fieldName: "sessionSource",
                                    stringFilter: { matchType: "CONTAINS" as any, value: sourceFilter },
                                },
                            }] : []),
                        ],
                    },
                } as any,
            }),
        ])) as any;

        // Total pageviews + source breakdown
        let pageviews = 0;
        const sources: Record<string, number> = {};
        for (const row of pageviewRes.rows ?? []) {
            const source = row.dimensionValues?.[0]?.value ?? "Direct";
            const count = parseInt(row.metricValues?.[0]?.value ?? "0", 10);
            pageviews += count;
            sources[source] = (sources[source] ?? 0) + count;
        }

        // Parse event counts
        let scorecardStarts: number | null = 0;
        let scorecardCompletions: number | null = 0;
        let discoveryClicks: number | null = 0;

        for (const row of eventRes.rows ?? []) {
            const eventName = row.dimensionValues?.[0]?.value;
            const count = parseInt(row.metricValues?.[0]?.value ?? "0", 10);
            if (eventName === "scorecard_start") scorecardStarts = count;
            if (eventName === "scorecard_complete") scorecardCompletions = count;
            if (eventName === "book_call_click") discoveryClicks = count;
        }

        // scorecardStarts fallback: if no event exists yet, use page views as estimate
        if (!scorecardStarts) {
            const [scorecardRes] = (await client.runReport({
                property: `properties/${propertyId}`,
                dateRanges: [dateRange],
                dimensions: [{ name: "pagePath" }],
                metrics: [{ name: "screenPageViews" }],
                dimensionFilter: {
                    andGroup: {
                        expressions: [
                            {
                                filter: {
                                    fieldName: "pagePath",
                                    stringFilter: { matchType: "BEGINS_WITH" as any, value: "/scorecard" },
                                },
                            },
                            ...(sourceFilter ? [{
                                filter: {
                                    fieldName: "sessionSource",
                                    stringFilter: { matchType: "CONTAINS" as any, value: sourceFilter },
                                },
                            }] : []),
                        ],
                    },
                } as any,
            })) as any;
            for (const row of scorecardRes.rows ?? []) {
                scorecardStarts = (scorecardStarts ?? 0) + parseInt(row.metricValues?.[0]?.value ?? "0", 10);
            }
        }

        return { pageviews, scorecardStarts, scorecardCompletions, discoveryClicks, sources };
    } catch (e) {
        console.error("GA4 Error:", e);
        return { pageviews: null, scorecardStarts: null, scorecardCompletions: null, discoveryClicks: null, sources: {} };
    }
}
