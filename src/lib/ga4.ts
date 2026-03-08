import { BetaAnalyticsDataClient } from "@google-analytics/data";

export interface GA4Metrics {
    pageviews: number | null;           // linkedin-sourced landing page views
    scorecardStarts: number | null;     // /scorecard page visits
    scorecardCompletions: number | null; // scorecard_complete events
    discoveryClicks: number | null;     // book_call_click events
}

function getClient(): BetaAnalyticsDataClient | null {
    const json = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    if (!json) return null;

    try {
        const credentials = JSON.parse(json);
        return new BetaAnalyticsDataClient({ credentials });
    } catch {
        return null;
    }
}

export async function getGA4Metrics(propertyId: string, days: number): Promise<GA4Metrics> {
    const client = getClient();
    if (!client) {
        return { pageviews: null, scorecardStarts: null, scorecardCompletions: null, discoveryClicks: null };
    }

    const dateRange = { startDate: `${days}daysAgo`, endDate: "today" };

    try {
        const [pageviewRes, eventRes] = await Promise.all([
            // LinkedIn-sourced landing page views
            client.runReport({
                property: `properties/${propertyId}`,
                dateRanges: [dateRange],
                dimensions: [{ name: "sessionSource" }],
                metrics: [{ name: "screenPageViews" }],
                dimensionFilter: {
                    filter: {
                        fieldName: "sessionSource",
                        stringFilter: { matchType: "CONTAINS", value: "linkedin" },
                    },
                },
            }),
            // Event counts for key funnel events
            client.runReport({
                property: `properties/${propertyId}`,
                dateRanges: [dateRange],
                dimensions: [{ name: "eventName" }],
                metrics: [{ name: "eventCount" }],
                dimensionFilter: {
                    filter: {
                        fieldName: "eventName",
                        inListFilter: {
                            values: ["page_view", "scorecard_complete", "book_call_click"],
                        },
                    },
                },
            }),
        ]);

        // Parse linkedin pageviews
        let pageviews: number | null = null;
        for (const row of pageviewRes[0]?.rows ?? []) {
            pageviews = (pageviews ?? 0) + parseInt(row.metricValues?.[0]?.value ?? "0", 10);
        }

        // Parse event counts
        let scorecardStarts: number | null = null;
        let scorecardCompletions: number | null = null;
        let discoveryClicks: number | null = null;

        for (const row of eventRes[0]?.rows ?? []) {
            const eventName = row.dimensionValues?.[0]?.value;
            const count = parseInt(row.metricValues?.[0]?.value ?? "0", 10);
            if (eventName === "scorecard_complete") scorecardCompletions = count;
            if (eventName === "book_call_click") discoveryClicks = count;
            // scorecard_starts: we use page_view on /scorecard — handled via path filter below
        }

        // Scorecard starts: page_view on /scorecard path
        const [scorecardRes] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [dateRange],
            dimensions: [{ name: "pagePath" }],
            metrics: [{ name: "screenPageViews" }],
            dimensionFilter: {
                filter: {
                    fieldName: "pagePath",
                    stringFilter: { matchType: "BEGINS_WITH", value: "/scorecard" },
                },
            },
        });

        for (const row of scorecardRes?.rows ?? []) {
            scorecardStarts = (scorecardStarts ?? 0) + parseInt(row.metricValues?.[0]?.value ?? "0", 10);
        }

        return { pageviews, scorecardStarts, scorecardCompletions, discoveryClicks };
    } catch {
        return { pageviews: null, scorecardStarts: null, scorecardCompletions: null, discoveryClicks: null };
    }
}
