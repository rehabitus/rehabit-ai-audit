// Client-side instant score preview based on survey answers
export interface SurveyAnswers {
    business_type?: string;
    team_size?: string;
    revenue?: string;
    pain_point?: string;
    manual_hours?: string;
}

export interface ScorePreview {
    savingsMin: number;
    savingsMax: number;
    opportunityLevel: "High" | "Very High" | "Exceptional";
    primaryWaste: string;
}

// Weighted scoring → maps to annual savings estimate
const revenueMultiplier: Record<string, number> = {
    "Under $100K": 0.6,
    "$100K–$500K": 1.0,
    "$500K–$1M": 1.6,
    "$1M+": 2.5,
};

const hoursMultiplier: Record<string, number> = {
    "Less than 5 hrs": 0.5,
    "5–15 hrs": 1.0,
    "15–30 hrs": 1.6,
    "30+ hrs": 2.4,
};

const teamMultiplier: Record<string, number> = {
    "Just me": 0.7,
    "2–5": 1.0,
    "6–20": 1.6,
    "20+": 2.2,
};

const painLabel: Record<string, string> = {
    "Manual data entry & copy-paste between tools": "manual data entry",
    "Client onboarding takes too long": "slow client onboarding",
    "Content creation is eating my time": "content production overhead",
    "Clients disengage between sessions": "client retention gaps",
};

export function computeScorePreview(answers: SurveyAnswers): ScorePreview {
    const rev = revenueMultiplier[answers.revenue ?? ""] ?? 1.0;
    const hrs = hoursMultiplier[answers.manual_hours ?? ""] ?? 1.0;
    const team = teamMultiplier[answers.team_size ?? ""] ?? 1.0;

    const base = 18000; // baseline annual savings $18K
    const raw = base * rev * hrs * team;

    const savingsMin = Math.round(raw / 5000) * 5000;
    const savingsMax = Math.round((raw * 2.4) / 5000) * 5000;

    const opportunityLevel: ScorePreview["opportunityLevel"] =
        savingsMin >= 80000
            ? "Exceptional"
            : savingsMin >= 40000
                ? "Very High"
                : "High";

    const primaryWaste =
        painLabel[answers.pain_point ?? ""] ?? "manual operational tasks";

    return { savingsMin, savingsMax, opportunityLevel, primaryWaste };
}

export function formatCurrency(n: number): string {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1000) return `$${Math.round(n / 1000)}K`;
    return `$${n}`;
}
