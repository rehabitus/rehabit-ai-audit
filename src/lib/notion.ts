/**
 * Notion fallback lead capture.
 * Database: 🎯 Scorecard Leads (fa4d9a5b6534435aa0a54adfd3d505c0)
 * Env vars needed: NOTION_API_KEY, NOTION_LEADS_DB_ID (optional — defaults to the DB above)
 */

const NOTION_API = "https://api.notion.com/v1";
const DEFAULT_DB_ID = "fa4d9a5b6534435aa0a54adfd3d505c0";

export interface NotionLead {
    name: string;
    email: string;
    website?: string;
    source?: "Scorecard" | "Exit Intent" | "Chat" | "Direct";
    grade?: string;
    score?: number;
    savingsRange?: string;
    keyFinding?: string;
    departmentScores?: string;
    businessType?: string;
    teamSize?: string;
    revenue?: string;
    painPoint?: string;
    chatTranscript?: string;
}

function text(content: string) {
    return { rich_text: [{ text: { content: content.slice(0, 2000) } }] };
}

export async function syncLeadToNotion(lead: NotionLead): Promise<boolean> {
    const apiKey = process.env.NOTION_API_KEY;
    if (!apiKey) {
        console.warn("Notion sync skipped: NOTION_API_KEY not set");
        return false;
    }

    const dbId = process.env.NOTION_LEADS_DB_ID || DEFAULT_DB_ID;

    const properties: Record<string, unknown> = {
        Name: { title: [{ text: { content: lead.name || "Unknown" } }] },
        Email: { email: lead.email },
        Source: { select: { name: lead.source || "Scorecard" } },
        Status: { select: { name: "New" } },
    };

    if (lead.website) properties.Website = { url: lead.website };
    if (lead.grade) properties.Grade = { select: { name: lead.grade } };
    if (lead.score != null) properties.Score = { number: lead.score };
    if (lead.savingsRange) properties["Savings Range"] = text(lead.savingsRange);
    if (lead.keyFinding) properties["Key Finding"] = text(lead.keyFinding);
    if (lead.departmentScores) properties["Department Scores"] = text(lead.departmentScores);
    if (lead.businessType) properties["Business Type"] = text(lead.businessType);
    if (lead.teamSize) properties["Team Size"] = text(lead.teamSize);
    if (lead.revenue) properties.Revenue = text(lead.revenue);
    if (lead.painPoint) properties["Pain Point"] = text(lead.painPoint);
    if (lead.chatTranscript) properties["Chat Transcript"] = text(lead.chatTranscript);

    const res = await fetch(`${NOTION_API}/pages`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "Notion-Version": "2022-06-28",
        },
        body: JSON.stringify({ parent: { database_id: dbId }, properties }),
    });

    if (!res.ok) {
        const err = await res.text();
        console.error("Notion lead sync failed:", err);
        return false;
    }

    return true;
}
