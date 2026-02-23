import type { ScoreResult } from "@/app/api/generate-score/route";

export function buildScoreEmail({
    name,
    result,
}: {
    name: string;
    result: ScoreResult;
}): string {
    const firstName = name.split(" ")[0] || "there";
    const gradeColor = result.score >= 75 ? "#10b981" : result.score >= 55 ? "#f59e0b" : "#ef4444";

    const opportunitiesHtml = result.opportunities
        .map(
            (op, i) => `
      <tr>
        <td style="padding: 16px; border-bottom: 1px solid #1e293b;">
          <div style="display:flex; align-items:flex-start; gap:12px;">
            <div style="background:#10b981;color:#0f172a;font-weight:800;font-size:11px;padding:4px 8px;border-radius:6px;white-space:nowrap;margin-top:2px;">#${i + 1}</div>
            <div>
              <div style="color:#fff;font-weight:700;font-size:15px;margin-bottom:4px;">${op.title}</div>
              <div style="color:#94a3b8;font-size:13px;line-height:1.5;">${op.description}</div>
              <div style="margin-top:8px;color:#10b981;font-size:12px;font-weight:600;">⏱ ~${op.hrs_saved_per_year.toLocaleString()} hrs/year saved</div>
            </div>
          </div>
        </td>
      </tr>`
        )
        .join("");

    const impactColor = (level: string) =>
        level === "high" ? "#10b981" : level === "medium" ? "#f59e0b" : "#94a3b8";

    const checklistHtml = result.checklist
        .sort((a, b) => a.priority - b.priority)
        .map(
            (item) => `
      <tr>
        <td style="padding:14px 16px;border-bottom:1px solid #1e293b;">
          <div style="display:flex;align-items:flex-start;gap:12px;">
            <div style="background:#1e293b;color:#10b981;font-weight:800;font-size:13px;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;">${item.priority}</div>
            <div style="flex:1;">
              <div style="color:#e2e8f0;font-size:14px;line-height:1.5;">${item.action}</div>
              <div style="margin-top:6px;display:flex;gap:8px;">
                <span style="font-size:11px;padding:2px 8px;border-radius:20px;background:${impactColor(item.impact)}22;color:${impactColor(item.impact)};font-weight:600;">${item.impact.toUpperCase()} IMPACT</span>
                <span style="font-size:11px;padding:2px 8px;border-radius:20px;background:#1e293b;color:#64748b;font-weight:600;">${item.effort.toUpperCase()} EFFORT</span>
                <span style="font-size:11px;padding:2px 8px;border-radius:20px;background:#1e293b;color:#64748b;">${item.category}</span>
              </div>
            </div>
          </div>
        </td>
      </tr>`
        )
        .join("");

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.startsWith("http")
        ? process.env.NEXT_PUBLIC_BASE_URL
        : "https://audit.rehabit.ai";

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
        <tr><td style="background:#1e293b;border-radius:16px;padding:32px;text-align:center;margin-bottom:24px;border:1px solid #334155;">
          <div style="color:#94a3b8;font-size:14px;margin-bottom:16px;">Hi ${firstName}, here&rsquo;s your score</div>
          <div style="font-size:80px;font-weight:900;color:${gradeColor};line-height:1;">${result.grade}</div>
          <div style="color:#475569;font-size:14px;margin-top:4px;">${result.score} / 100</div>
          <div style="margin:24px auto;background:#0f172a;border-radius:12px;padding:16px 24px;max-width:420px;">
            <div style="color:#e2e8f0;font-size:15px;line-height:1.6;">${result.key_finding}</div>
          </div>
          <div style="color:#10b981;font-size:24px;font-weight:800;">
            $${Math.round(result.savings_min / 1000)}K&ndash;$${Math.round(result.savings_max / 1000)}K
          </div>
          <div style="color:#64748b;font-size:13px;margin-top:4px;">Estimated annual savings potential</div>
        </td></tr>

        <tr><td style="height:24px;"></td></tr>

        <!-- Opportunities -->
        <tr><td style="background:#1e293b;border-radius:16px;overflow:hidden;border:1px solid #334155;">
          <div style="padding:20px 16px 12px;color:#94a3b8;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;">Your Top 3 AI Opportunities</div>
          <table width="100%" cellpadding="0" cellspacing="0">${opportunitiesHtml}</table>
        </td></tr>

        <tr><td style="height:24px;"></td></tr>

        <!-- Checklist -->
        <tr><td style="background:#1e293b;border-radius:16px;overflow:hidden;border:1px solid #334155;">
          <div style="padding:20px 16px 12px;color:#94a3b8;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;">Your Prioritized AI Action Checklist</div>
          <table width="100%" cellpadding="0" cellspacing="0">${checklistHtml}</table>
        </td></tr>

        <tr><td style="height:32px;"></td></tr>

        <!-- Bonus Video CTA -->
        <tr><td style="background:#1e293b;border-radius:16px;padding:24px 28px;border:1px solid #f59e0b44;">
          <div style="display:flex;align-items:flex-start;gap:16px;">
            <div style="font-size:28px;line-height:1;flex-shrink:0;">🎁</div>
            <div>
              <div style="color:#f59e0b;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:6px;">Free Bonus</div>
              <div style="color:#fff;font-size:16px;font-weight:800;margin-bottom:8px;">Want a video walkthrough of your checklist?</div>
              <div style="color:#94a3b8;font-size:14px;line-height:1.6;margin-bottom:14px;">
                Reply to this email with your thoughts on the checklist — what resonates, what feels hard, where you&apos;re stuck — and I&apos;ll send you a personalized bonus video showing you exactly how to implement your top 3 items.
              </div>
              <div style="color:#f59e0b;font-size:13px;font-weight:600;">Just hit reply → tell me what you&apos;re thinking → get the video. That simple.</div>
            </div>
          </div>
        </td></tr>

        <tr><td style="height:24px;"></td></tr>

        <!-- CTA -->
        <tr><td style="background:#1e293b;border-radius:16px;padding:32px;text-align:center;border:1px solid #334155;">
          <div style="color:#fff;font-size:20px;font-weight:800;margin-bottom:12px;">Ready to implement this?</div>
          <div style="color:#94a3b8;font-size:14px;line-height:1.6;margin-bottom:24px;max-width:380px;margin-left:auto;margin-right:auto;">
            Our 5-day audit turns this roadmap into a concrete implementation plan — with exact tools, costs, and ROI projections. Guaranteed to uncover $20K+ in savings.
          </div>
          <a href="${baseUrl}" style="display:inline-block;background:#10b981;color:#0f172a;font-size:15px;font-weight:800;padding:16px 32px;border-radius:12px;text-decoration:none;">
            → Reserve My Audit Slot ($1,200)
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
