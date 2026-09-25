import "server-only";

const FROM = process.env.EMAIL_FROM ?? "Truehand <hello@truehand.app>";

/**
 * Sends a plain transactional email through Resend's HTTP API. Without an API
 * key (local development) the message is printed to the server log instead.
 */
export async function sendEmail(to: string, subject: string, text: string, html?: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.info(`[email] to=${to} subject="${subject}"\n${text}`);
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, to, subject, text, html }),
  });
  if (!res.ok) throw new Error(`Email failed: ${res.status} ${await res.text()}`);
}

export function codeEmail(code: string) {
  const text = `Your Truehand sign-in code is ${code}\n\nIt expires in 10 minutes. If you didn't ask for it, you can ignore this email.`;
  const html = `<div style="font-family:system-ui,sans-serif;font-size:15px;color:#111216;line-height:1.5">
<p>Your Truehand sign-in code:</p>
<p style="font-family:ui-monospace,monospace;font-size:28px;letter-spacing:0.2em;margin:12px 0">${code}</p>
<p style="color:#6c6d74">It expires in 10 minutes. If you didn't ask for it, you can ignore this email.</p>
</div>`;
  return { text, html };
}
