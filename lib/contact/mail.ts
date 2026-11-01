import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { inquiryMail, type Inquiry } from "./validation.ts";

export const relayOptions = {
  host: "smtp-relay.gmail.com", port: 587, secure: false, requireTLS: true,
  name: "www.greenridgetechnics.com",
  tls: { minVersion: "TLSv1.2" as const, rejectUnauthorized: true },
  connectionTimeout: 8000, greetingTimeout: 8000, socketTimeout: 15000,
  disableFileAccess: true, disableUrlAccess: true, logger: false, debug: false,
};
export async function sendInquiry(inquiry: Inquiry, recipients: readonly string[], transport: Transporter = nodemailer.createTransport(relayOptions)) {
  // The Google Workspace relay must allow only the VPS's public IPv4 and require TLS.
  // No mailbox password, SMTP auth credential, visitor-selected recipient or HTML.
  const mail = inquiryMail(inquiry, recipients);
  const result = await transport.sendMail(mail);
  // Partial delivery is uncertain too: do not claim all recipients were accepted
  // or automatically resend to recipients who already received the message.
  if (result.accepted?.length !== mail.envelope.to.length || result.rejected?.length) throw new Error("Relay did not accept all recipients");
}
