/**
 * CRM Integration Utility for GoHighLevel (GHL)
 * Handles syncing leads, opportunities, and tags.
 */

const GHL_API_BASE = "https://services.leadconnectorhq.com";

export interface GHLLead {
    name?: string;
    email: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    source?: string;
    tags?: string[];
    customFields?: Record<string, string | number | boolean>;
}

export async function syncLeadToGHL(lead: GHLLead) {
    const accessToken = process.env.GHL_ACCESS_TOKEN;
    const locationId = process.env.GHL_LOCATION_ID;

    if (!accessToken || !locationId) {
        console.warn("GHL Integration skipped: Missing GHL_ACCESS_TOKEN or GHL_LOCATION_ID");
        return null;
    }

    try {
        const [firstName, ...lastNameParts] = (lead.name || "").split(" ");
        const lastName = lastNameParts.join(" ");

        // 1. Create or Update Contact
        const contactRes = await fetch(`${GHL_API_BASE}/contacts/upsert`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json",
                "Version": "2021-07-28"
            },
            body: JSON.stringify({
                locationId,
                email: lead.email,
                firstName: lead.firstName || firstName || "Lead",
                lastName: lead.lastName || lastName || " (rehabit.ai)",
                phone: lead.phone,
                source: lead.source || "rehabit.ai Website",
                tags: lead.tags || [],
                customFields: lead.customFields || {}
            })
        });

        const contactData = await contactRes.json();
        if (!contactRes.ok) {
            console.error("GHL Contact Sync Error:", contactData);
            return null;
        }

        const contactId = contactData.contact?.id || contactData.id;

        // 2. Create/Update Opportunity if tags suggest it's a specific conversion
        if (contactId && (lead.tags?.includes("Purchase") || lead.tags?.includes("Qualified Lead"))) {
            await createGHLOpportunity(contactId, locationId, accessToken, lead);
        }

        return contactId;
    } catch (err) {
        console.error("GHL Sync Exception:", err);
        return null;
    }
}

async function createGHLOpportunity(contactId: string, locationId: string, accessToken: string, lead: GHLLead) {
    // Opportunity stages and pipeline would need to be configured/known
    // Using a default pipeline logic or just tagging the contact is often safer
    // But providing the boilerplate for future customization
    try {
        const pipelineId = process.env.GHL_PIPELINE_ID;
        const stageId = lead.tags?.includes("Purchase")
            ? process.env.GHL_STAGE_PURCHASE_ID
            : process.env.GHL_STAGE_LEAD_ID;

        if (!pipelineId || !stageId) return;

        await fetch(`${GHL_API_BASE}/opportunities`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json",
                "Version": "2021-07-28"
            },
            body: JSON.stringify({
                pipelineId,
                locationId,
                contactId,
                name: `${lead.name || lead.email} - ${lead.tags?.includes("Purchase") ? "Audit Purchase" : "AI Scorecard Lead"}`,
                status: "open",
                stageId
            })
        });
    } catch (err) {
        console.error("GHL Opportunity Creation Error:", err);
    }
}
