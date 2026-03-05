import type { ScoreResult } from "@/app/api/generate-score/route";

export function buildScoreEmail({
  name,
  result,
  resultsUrl,
}: {
  name: string;
  result: ScoreResult;
  resultsUrl: string;
}): string {
  const firstName = name.split(" ")[0] || "there";
  const gradeColor = result.score >= 75 ? "#10b981" : result.score >= 55 ? "#f59e0b" : "#ef4444";

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.startsWith("http")
    ? process.env.NEXT_PUBLIC_BASE_URL
    : "https://audit.rehabit.ai";

  // Build text-based Big 4 bars (email-safe, no images/CSS flex)
  const deptScores = result.department_scores ?? { marketing: 0, sales: 0, delivery: 0, operations: 0 };
  const depts = [
    { label: "Marketing", key: "marketing" as const, color: "#10b981" },
    { label: "Sales", key: "sales" as const, color: "#3b82f6" },
    { label: "Delivery", key: "delivery" as const, color: "#8b5cf6" },
    { label: "Operations", key: "operations" as const, color: "#f97316" },
  ];

  const big4Html = depts
    .map(({ label, key, color }) => {
      const score = deptScores[key] ?? 0;
      const filled = Math.round(score / 10); // 0–10 blocks
      const empty = 10 - filled;
      const blocks = "█".repeat(filled) + "░".repeat(empty);
      const isWeakest = score === Math.min(...Object.values(deptScores));
      return `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #1e293b;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="width:90px;">
                <span style="color:#94a3b8;font-size:12px;font-weight:600;">${label}</span>
              </td>
              <td>
                <span style="color:${color};font-family:monospace;font-size:13px;letter-spacing:1px;">${blocks}</span>
                <span style="color:#475569;font-size:12px;margin-left:8px;">${score}/100</span>
                ${isWeakest ? `<span style="color:#ef4444;font-size:10px;font-weight:700;margin-left:6px;text-transform:uppercase;">← biggest gap</span>` : ""}
              </td>
            </tr>
          </table>
        </td>
      </tr>`;
    })
    .join("");

  // Top 3 opportunities — title + hours only (no implementation detail)
  const opportunitiesHtml = result.opportunities
    .map(
      (op, i) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #1e293b;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="width:28px;vertical-align:top;padding-top:2px;">
                <span style="background:#10b981;color:#0f172a;font-weight:800;font-size:10px;padding:2px 6px;border-radius:4px;">#${i + 1}</span>
              </td>
              <td>
                <div style="color:#e2e8f0;font-size:14px;font-weight:700;">${op.title}</div>
                <div style="color:#10b981;font-size:12px;margin-top:3px;">~${op.hrs_saved_per_year.toLocaleString()} hrs/year saved</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Your AI Readiness Score</title></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:40px 16px;">
    <tr><td>
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;">

        <!-- Header -->
        <tr><td style="padding-bottom:32px;text-align:center;">
          <div style="color:#10b981;font-size:13px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:8px;">rehabit.ai</div>
          <div style="color:#64748b;font-size:13px;">Your AI Readiness Report</div>
        </td></tr>

        <!-- Score Card -->
        <tr><td style="background:#1e293b;border-radius:16px;padding:32px;text-align:center;border:1px solid #334155;">
          <div style="color:#94a3b8;font-size:14px;margin-bottom:16px;">Hi ${firstName}, here&rsquo;s your score</div>
          <div style="font-size:80px;font-weight:900;color:${gradeColor};line-height:1;">${result.grade}</div>
          <div style="color:#475569;font-size:14px;margin-top:4px;">${result.score} / 100</div>
          <div style="margin:20px auto 0;background:#0f172a;border-radius:12px;padding:16px 24px;max-width:440px;">
            <div style="color:#e2e8f0;font-size:14px;line-height:1.7;">${result.key_finding}</div>
          </div>
        </td></tr>

        <tr><td style="height:20px;"></td></tr>

        <!-- Savings + Big 4 -->
        <tr><td style="background:#1e293b;border-radius:16px;padding:24px 28px;border:1px solid #334155;">
          <div style="text-align:center;margin-bottom:20px;">
            <div style="color:#10b981;font-size:28px;font-weight:800;">$${Math.round(result.savings_min / 1000)}K&ndash;$${Math.round(result.savings_max / 1000)}K</div>
            <div style="color:#64748b;font-size:12px;margin-top:4px;">Estimated annual savings potential</div>
          </div>
          <div style="color:#94a3b8;font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:4px;">Your Big 4 Scores</div>
          <table width="100%" cellpadding="0" cellspacing="0">${big4Html}</table>
        </td></tr>

        <tr><td style="height:20px;"></td></tr>

        <!-- Top 3 Opportunities (teaser) -->
        <tr><td style="background:#1e293b;border-radius:16px;padding:24px 28px;border:1px solid #334155;">
          <div style="color:#94a3b8;font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:4px;">Your Top 3 AI Opportunities</div>
          <table width="100%" cellpadding="0" cellspacing="0">${opportunitiesHtml}</table>
          <div style="margin-top:14px;padding:12px 16px;background:#0f172a;border-radius:8px;border-left:3px solid #475569;">
            <div style="color:#475569;font-size:12px;">Implementation roadmap, specific tools, and ROI projections are in your full scorecard.</div>
          </div>
        </td></tr>

        <tr><td style="height:28px;"></td></tr>

        <!-- Primary CTA — View Full Scorecard -->
        <tr><td style="background:#1e293b;border-radius:16px;padding:32px;text-align:center;border:1px solid #10b98133;">
          <div style="color:#fff;font-size:20px;font-weight:800;margin-bottom:8px;">View Your Full Scorecard</div>
          <div style="color:#94a3b8;font-size:14px;line-height:1.6;margin-bottom:24px;">
            Your interactive results include your implementation roadmap, specific AI tools, and exact ROI projections — all personalized to your business.
          </div>
          <a href="${resultsUrl}" style="display:inline-block;background:#10b981;color:#0f172a;font-size:15px;font-weight:800;padding:16px 36px;border-radius:12px;text-decoration:none;letter-spacing:0.01em;">
            View My Full Scorecard &rarr;
          </a>
          <div style="color:#475569;font-size:11px;margin-top:14px;">Or reply to this email — Mike personally reviews every score.</div>
        </td></tr>

        <tr><td style="height:20px;"></td></tr>

        <!-- Secondary CTA — Audit -->
        <tr><td style="background:#1e293b;border-radius:16px;padding:24px 28px;border:1px solid #f59e0b33;">
          <div style="color:#f59e0b;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:6px;">Ready to Act on This?</div>
          <div style="color:#fff;font-size:15px;font-weight:700;margin-bottom:8px;">Our 5-day AI Transformation Audit turns your scorecard into a built system.</div>
          <div style="color:#94a3b8;font-size:13px;line-height:1.6;margin-bottom:16px;">Exact tools, costs, ROI projections — and your first Core AI System built in the same window. Guaranteed to uncover $20K+ in savings.</div>
          <a href="${baseUrl}" style="display:inline-block;background:transparent;color:#f59e0b;font-size:13px;font-weight:700;padding:10px 20px;border-radius:10px;text-decoration:none;border:1px solid #f59e0b44;">
            Reserve My Audit Slot ($1,200) &rarr;
          </a>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:32px 0;text-align:center;color:#334155;font-size:12px;">
          rehabit.ai &mdash; AI Transformation for Modern Businesses<br>
          <a href="${baseUrl}" style="color:#475569;text-decoration:none;">audit.rehabit.ai</a>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function buildBookingSuccessEmail({
  name,
  amountPaid,
}: {
  name: string;
  amountPaid: number;
}): string {
  const firstName = name.split(" ")[0] || "there";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://audit.rehabit.ai";

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Audit Reserved</title></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:40px 16px;">
    <tr><td>
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;">
        <tr><td style="padding-bottom:32px;text-align:center;">
          <div style="color:#10b981;font-size:13px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:8px;">rehabit.ai</div>
          <div style="color:#fff;font-size:24px;font-weight:800;">Audit Reserved!</div>
        </td></tr>
        <tr><td style="background:#1e293b;border-radius:16px;padding:32px;border:1px solid #334155;">
          <p style="color:#e2e8f0;font-size:16px;line-height:1.6;margin-top:0;">Hi ${firstName},</p>
          <p style="color:#94a3b8;font-size:15px;line-height:1.6;">Congratulations on taking the first step to reclaiming your time. We've received your payment of <strong>$${amountPaid}</strong> and your AI Transformation Audit is now officially in the queue.</p>
          
          <div style="margin:32px 0;padding:24px;background:#0f172a;border-radius:12px;border-left:4px solid #10b981;">
            <h3 style="color:#fff;font-size:14px;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 16px 0;">What Happens Now:</h3>
            <ul style="color:#cbd5e1;font-size:14px;line-height:1.8;padding-left:18px;margin:0;">
              <li><strong>Kickoff Call:</strong> We'll reach out within 24 hours to schedule your 1:1 strategy session.</li>
              <li><strong>Audit Phase:</strong> We begin profiling your systems and identifying the "leaks".</li>
              <li><strong>Delivery:</strong> In 5 days, you'll receive your Opportunity Matrix and Roadmap.</li>
            </ul>
          </div>

          <p style="color:#94a3b8;font-size:14px;line-height:1.6;"><strong>Bonus:</strong> Since you paid in full, we're building your first Core AI System for free during this audit. Think about which manual task is bugging you the most — we'll likely start there.</p>
          
          <p style="color:#94a3b8;font-size:14px;line-height:1.6;margin-bottom:0;">Talk soon,<br>Mike Olaski & The Rehabit Team</p>
        </td></tr>
        <tr><td style="padding:32px 0;text-align:center;color:#334155;font-size:12px;">
          rehabit.ai &mdash; <a href="${baseUrl}" style="color:#475569;text-decoration:none;">audit.rehabit.ai</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function buildApplicationReceivedEmail({
  name,
}: {
  name: string;
}): string {
  const firstName = name.split(" ")[0] || "there";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://audit.rehabit.ai";

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Application Received</title></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:40px 16px;">
    <tr><td>
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;">
        <tr><td style="padding-bottom:32px;text-align:center;">
          <div style="color:#10b981;font-size:13px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:8px;">rehabit.ai</div>
          <div style="color:#fff;font-size:24px;font-weight:800;">Application Received</div>
        </td></tr>
        <tr><td style="background:#1e293b;border-radius:16px;padding:32px;border:1px solid #334155;">
          <p style="color:#e2e8f0;font-size:16px;line-height:1.6;margin-top:0;">Hi ${firstName},</p>
          <p style="color:#94a3b8;font-size:15px;line-height:1.6;">We've received your application and survey responses. Mike is personally reviewing them to see if we're a good fit for an AI Transformation Audit.</p>

          <div style="margin:24px 0;padding:20px;background:#0f172a;border-radius:12px;">
            <p style="color:#e2e8f0;font-size:14px;margin:0;"><strong>What's Next?</strong></p>
            <p style="color:#94a3b8;font-size:13px;margin:8px 0 0 0;">If you've already booked a call via Calendly, we'll see you then. If not, we'll reach out within 24 hours if we need any more details.</p>
          </div>

          <p style="color:#94a3b8;font-size:14px;line-height:1.6;margin-bottom:0;">Talk soon,<br>Mike Olaski &mdash; rehabit.ai</p>
        </td></tr>
        <tr><td style="padding:32px 0;text-align:center;color:#334155;font-size:12px;">
          rehabit.ai &mdash; <a href="${baseUrl}" style="color:#475569;text-decoration:none;">audit.rehabit.ai</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/** Sent when the LLM score generation fails — reassures the user their scorecard is coming */
export function buildScorecardProcessingEmail({
  name,
}: {
  name: string;
}): string {
  const firstName = name.split(" ")[0] || "there";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://audit.rehabit.ai";

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Your AI Score is on its way</title></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:40px 16px;">
    <tr><td>
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;">

        <!-- Header -->
        <tr><td style="padding-bottom:32px;text-align:center;">
          <div style="color:#10b981;font-size:13px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:8px;">rehabit.ai</div>
          <div style="color:#fff;font-size:24px;font-weight:800;">Your AI Score is Being Generated</div>
        </td></tr>

        <!-- Body -->
        <tr><td style="background:#1e293b;border-radius:16px;padding:32px;border:1px solid #334155;">
          <p style="color:#e2e8f0;font-size:16px;line-height:1.6;margin-top:0;">Hi ${firstName},</p>
          <p style="color:#94a3b8;font-size:15px;line-height:1.6;">
            Thanks for completing the AI Opportunity Scorecard. Our AI is still analyzing your Big 4 department responses — your full score report will arrive in a second email within the next few minutes.
          </p>

          <div style="margin:24px 0;background:#0f172a;border-radius:12px;padding:20px 24px;border-left:3px solid #10b981;">
            <div style="color:#94a3b8;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:12px;">Your Score Report Will Include</div>
            <table cellpadding="0" cellspacing="0" width="100%">
              ${["AI Readiness Score (0–100) with Letter Grade", "Estimated Annual Savings Potential", "Your Top 3 Highest-ROI Automation Opportunities", "Prioritized 5-Step Implementation Checklist"].map(item => `
              <tr><td style="padding:6px 0;">
                <span style="color:#10b981;font-weight:700;margin-right:10px;">✓</span>
                <span style="color:#cbd5e1;font-size:14px;">${item}</span>
              </td></tr>`).join("")}
            </table>
          </div>

          <p style="color:#94a3b8;font-size:14px;line-height:1.6;">Keep an eye on your inbox — it's on its way.</p>

          <div style="margin-top:24px;">
            <a href="${baseUrl}/scorecard" style="display:inline-block;background:#10b981;color:#0f172a;font-size:14px;font-weight:800;padding:14px 28px;border-radius:10px;text-decoration:none;">
              Retake the Scorecard →
            </a>
          </div>

          <p style="color:#475569;font-size:13px;line-height:1.6;margin-top:24px;margin-bottom:0;">
            Mike Olaski &mdash; rehabit.ai
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:32px 0;text-align:center;color:#334155;font-size:12px;">
          rehabit.ai &mdash; <a href="${baseUrl}" style="color:#475569;text-decoration:none;">audit.rehabit.ai</a>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
