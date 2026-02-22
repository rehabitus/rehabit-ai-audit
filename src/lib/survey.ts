// Lead capture qualification survey questions
export const surveyQuestions = [
    {
        id: "business_type",
        question: "What type of business do you run?",
        type: "choice" as const,
        options: [
            "Coach / Consultant",
            "Course Creator",
            "Platform or SaaS",
            "Agency",
            "Other",
        ],
    },
    {
        id: "team_size",
        question: "How many people are on your team?",
        type: "choice" as const,
        options: ["Just me", "2–5", "6–20", "20+"],
    },
    {
        id: "revenue",
        question: "What's your approximate annual revenue?",
        type: "choice" as const,
        options: ["Under $100K", "$100K–$500K", "$500K–$1M", "$1M+"],
    },
    {
        id: "pain_point",
        question: "What's your biggest operational pain point right now?",
        type: "choice" as const,
        options: [
            "Manual data entry & copy-paste between tools",
            "Client onboarding takes too long",
            "Content creation is eating my time",
            "Clients disengage between sessions",
            "All of the above, honestly",
        ],
    },
    {
        id: "manual_hours",
        question: "How many hours per week does your team spend on manual, repetitive tasks?",
        type: "choice" as const,
        options: ["Less than 5 hrs", "5–15 hrs", "15–30 hrs", "30+ hrs"],
    },
];

export const CHAT_SYSTEM_PROMPT = `You are a warm, professional AI assistant for rehabit.ai conducting a quick business qualification survey. Your job is to ask the user exactly 5 questions (in a conversational way) to understand their business and where AI can help them most.

The 5 questions you need to cover (ask naturally, one at a time):
1. What type of business do they run? (coach/consultant, course creator, platform/SaaS, agency, or other)
2. How many team members they have (solo, 2-5, 6-20, 20+)
3. Their approximate annual revenue (<$100K, $100K-$500K, $500K-$1M, $1M+)
4. Their biggest operational pain point (manual data entry, client onboarding, content creation, client engagement, other)
5. How many hours/week their team spends on manual repetitive tasks (<5hrs, 5-15hrs, 15-30hrs, 30+hrs)

Rules:
- Be friendly, conversational, and concise. Max 2 sentences per response.
- After each answer, briefly acknowledge it and ask the next question.
- After the 5th answer, respond with a warm closing message and include the exact text "SURVEY_COMPLETE" at the very end (hidden from user, used by the system).
- Start by greeting them and asking the first question immediately. Don't ask for their name (we already have it).`;
