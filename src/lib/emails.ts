import { EMAIL_FROM, resend } from "@/lib/resend";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function emailLayout(title: string, bodyHtml: string): string {
  return `
  <div style="font-family:-apple-system,Helvetica,Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#14121f;">
    <div style="text-align:center;margin-bottom:24px;">
      <span style="display:inline-block;background:#4f3cc9;color:#fff;font-weight:700;padding:8px 16px;border-radius:9999px;font-size:18px;">flippie</span>
    </div>
    <h1 style="font-size:20px;margin:0 0 16px;">${title}</h1>
    ${bodyHtml}
    <p style="margin-top:32px;font-size:12px;color:#6b6875;">flippie — Buying and reselling phones and tablets across Europe.</p>
  </div>`;
}

/** Email failures must never break a real payment or trade-in submission — log and move on. */
async function sendSafely(params: Parameters<typeof resend.emails.send>[0]): Promise<void> {
  try {
    const { error } = await resend.emails.send(params);
    if (error) console.error("Email send failed:", error);
  } catch (err) {
    console.error("Email send threw:", err);
  }
}

export async function sendTradeInConfirmationEmail(input: {
  to: string;
  customerName: string;
  modelName: string;
  storageLabel: string;
  offerEUR: number;
  purchaseId: string;
}): Promise<void> {
  if (!input.to) return;

  const body = `
    <p>Hi ${escapeHtml(input.customerName) || "there"},</p>
    <p>We've received your trade-in submission for your <strong>${escapeHtml(input.modelName)} (${escapeHtml(input.storageLabel)})</strong>.</p>
    <p style="font-size:28px;font-weight:700;color:#4f3cc9;margin:16px 0;">€${input.offerEUR}</p>
    <p>Next, ship your device to us with the shipping label we'll send separately — once it's checked and everything matches, you'll be paid the full offer.</p>
    <p style="font-size:13px;color:#6b6875;">Reference: ${input.purchaseId.slice(0, 8).toUpperCase()}</p>
  `;

  await sendSafely({
    from: EMAIL_FROM,
    to: input.to,
    subject: "We've got your device — flippie",
    html: emailLayout("Thanks — we've got your device", body),
  });
}

export async function sendOrderConfirmationEmail(input: {
  to: string;
  customerName: string;
  items: { name: string; priceEUR: number }[];
  totalEUR: number;
  orderReference: string;
}): Promise<void> {
  if (!input.to) return;

  const rows = input.items
    .map(
      (item) => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #e4e1d9;">${escapeHtml(item.name)}</td>
      <td style="padding:8px 0;border-bottom:1px solid #e4e1d9;text-align:right;">€${item.priceEUR}</td>
    </tr>`,
    )
    .join("");

  const body = `
    <p>Hi ${escapeHtml(input.customerName) || "there"},</p>
    <p>Your payment was successful and your order is confirmed.</p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;">
      ${rows}
      <tr><td style="padding-top:12px;font-weight:700;">Total</td><td style="padding-top:12px;font-weight:700;text-align:right;">€${input.totalEUR}</td></tr>
    </table>
    <p style="font-size:13px;color:#6b6875;">Reference: ${input.orderReference}</p>
  `;

  await sendSafely({
    from: EMAIL_FROM,
    to: input.to,
    subject: "Order confirmed — flippie",
    html: emailLayout("Thank you for your order!", body),
  });
}
