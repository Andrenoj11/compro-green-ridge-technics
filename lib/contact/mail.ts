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
export async function sendInquiry(inquiry: Inquiry, transport: Transporter = nodemailer.createTransport(relayOptions)) {
  // The Google Workspace relay must allow only the VPS's public IPv4 and require TLS.
  // No mailbox password, SMTP auth credential, visitor-selected recipient or HTML.
  const result = await transport.sendMail(inquiryMail(inquiry));
  if (!result.accepted?.length || result.rejected?.length) throw new Error("Relay rejected recipient");
}
