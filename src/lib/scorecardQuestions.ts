export interface Question {
    id: string;
    question: string;
    options: string[];
    category: "Marketing" | "Sales" | "Delivery" | "Operations" | "Basic";
}

export const scorecardQuestions: Question[] = [
    // Basic Info (Application Questions)
    {
        id: "business_model",
        question: "What is your primary business model?",
        options: ["Service-Based / Coaching", "E-commerce / Product", "SaaS / Software", "Agency", "Other"],
        category: "Basic"
    },
    {
        id: "revenue",
        question: "Current annual revenue?",
        options: ["Under $100k", "$100k - $500k", "$500k - $2M", "$2M - $5M", "$5M+"],
        category: "Basic"
    },
    {
        id: "team_size",
        question: "Team size?",
        options: ["Solopreneur", "2-5 people", "6-20 people", "21-50 people", "51+ people"],
        category: "Basic"
    },
    {
        id: "bottleneck",
        question: "What is your biggest operational bottleneck?",
        options: ["Lead Generation", "Sales/Closing", "Onboarding/Delivery", "Admin/Technical Debt", "Hiring/Scaling"],
        category: "Basic"
    },

    // Marketing (The Lead Engine)
    {
        id: "mkt_nurture",
        question: "Do you have a system that automatically nurtures leads who don't book immediately?",
        options: ["Yes, fully automated", "Partial / Basic emails", "No, it's manual", "No nurture system"],
        category: "Marketing"
    },
    {
        id: "mkt_hours",
        question: "Manual hours per week spent on content creation & distribution?",
        options: ["0 - 2 hours", "3 - 5 hours", "5 - 10 hours", "10+ hours"],
        category: "Marketing"
    },
    {
        id: "mkt_ai",
        question: "Are you using AI to personalize your marketing outreach or ads?",
        options: ["Advanced (Custom Agents)", "Basic (Chatting with GPT)", "None yet"],
        category: "Marketing"
    },

    // Sales (The Conversion Engine)
    {
        id: "sales_followup",
        question: "How quickly do you follow up with new inbound leads?",
        options: ["Instantly (Automated)", "Under 15 minutes", "Under 1 hour", "Within 24 hours", "24+ hours"],
        category: "Sales"
    },
    {
        id: "sales_transcripts",
        question: "Are your sales meeting transcripts automatically analyzed for follow-ups?",
        options: ["Yes, fully automated", "We record but manually review", "No records", "What transcripts?"],
        category: "Sales"
    },
    {
        id: "sales_crm",
        question: "Is your CRM data entry fully automated after a prospect call?",
        options: ["100% Automated", "Mostly manual", "Entirely manual", "Don't use a CRM"],
        category: "Sales"
    },

    // Delivery (The Fulfillment Engine)
    {
        id: "del_onboarding",
        question: "How much of your client onboarding process is currently manual?",
        options: ["Mostly Manual (>75%)", "Half & Half", "Mostly Automated", "Fully Automated"],
        category: "Delivery"
    },
    {
        id: "del_twin",
        question: "Do you have a 'Digital Twin' or AI system handling 1st-level client questions?",
        options: ["Yes, and it performs well", "Basic chatbot only", "No, it's all human", "Plan to implement"],
        category: "Delivery"
    },
    {
        id: "del_admin_hrs",
        question: "Manual hours spent weekly on administrative fulfillment tasks?",
        options: ["0 - 5 hours", "5 - 10 hours", "10 - 20 hours", "20+ hours"],
        category: "Delivery"
    },

    // Operations (The Scalability Engine)
    {
        id: "ops_churn",
        question: "Do you have automated systems to identify at-risk clients before they churn?",
        options: ["Yes, data-driven", "Vague intuition", "No system in place"],
        category: "Operations"
    },
    {
        id: "ops_reporting",
        question: "Is your internal team communication and reporting automated?",
        options: ["Fully Automated", "Hybrid / Some dashboards", "Mostly manual spreadsheets", "Non-existent"],
        category: "Operations"
    },
    {
        id: "ops_growth_ratio",
        question: "How much time do you spend 'fighting fires' vs. working on growth?",
        options: ["Mostly Growth (<25% fires)", "Balanced", "Mostly Fires (>50%)", "Constant Firefighting"],
        category: "Operations"
    }
];
