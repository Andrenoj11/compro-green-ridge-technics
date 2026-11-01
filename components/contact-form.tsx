"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, Copy, Download, Mail } from "lucide-react";
import { company, m, services, text, url, type Locale } from "@/lib/content";
import { t } from "@/lib/i18n";
import { Turnstile } from "./turnstile";

export function ContactForm({ locale, siteKey }: { locale: Locale; siteKey: string | null }) {
  const [summary, setSummary] = useState("");
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "accepted">("idle");
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [resetKey, setResetKey] = useState(0);
  const inFlight = useRef(false);
  const result = useRef<HTMLDivElement>(null);
  const enabled = !!siteKey;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current || status === "accepted") return;
    const data = new FormData(event.currentTarget);
    setSummary(`${t(locale, "interactive.project_inquiry")} — Green Ridge Technics\n\n${t(locale, "interactive.name")}: ${data.get("name")}\n${t(locale, "ui.email")}: ${data.get("email")}\n${t(locale, "interactive.company")}: ${data.get("company") || "—"}\n${t(locale, "interactive.service")}: ${text(services.find(service => service.slug === data.get("service"))?.name || m("interactive.i_d_like_to_discuss_it_first"), locale)}\n\n${data.get("message")}`);
    setCopied(false); setCopyError(false); setError("");
    if (enabled) {
      if (!token) { setError(t(locale, "contact.verification_failed")); return; }
      inFlight.current = true; setStatus("sending");
      try {
        const response = await fetch("/api/contact", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: data.get("name"), email: data.get("email"), company: data.get("company"), service: data.get("service"), message: data.get("message"), consent: data.get("consent") === "on", website: data.get("website"), locale, token }),
          signal: AbortSignal.timeout(60_000),
        });
        const body = await response.json();
        if (response.ok && body.ok === true) setStatus("accepted");
        else {
          setStatus("idle");
          setError(t(locale, response.status === 429 ? "contact.limited" : body.code === "verification" ? "contact.verification_failed" : body.code === "invalid" ? "contact.invalid" : "contact.uncertain"));
        }
      } catch { setStatus("idle"); setError(t(locale, "contact.uncertain")); }
      finally { inFlight.current = false; setToken(""); setResetKey(value => value + 1); }
    }
    window.requestAnimationFrame(() => result.current?.focus());
  }
  async function copy() {
    try { await navigator.clipboard.writeText(summary); setCopied(true); setCopyError(false); }
    catch { setCopyError(true); }
  }
  function download() {
    const file = URL.createObjectURL(new Blob([summary], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a"); link.href = file; link.download = "green-ridge-project-inquiry.txt"; link.click(); URL.revokeObjectURL(file);
  }
  return <div className="contact-form-wrap" id="project-form">
    <form onSubmit={submit} className="contact-form" aria-busy={status === "sending"}>
      <h2>{t(locale, "interactive.tell_us_about_your_project")}</h2>
      <p>{t(locale, enabled ? "contact.instructions" : "interactive.complete_the_details_below_to_prepare_your")}</p>
      <fieldset className="contact-fields" disabled={status !== "idle"}>
        <div className="form-row">
          <label>{t(locale, "interactive.full_name")} <span>*</span><input name="name" required autoComplete="name" maxLength={100} placeholder={t(locale, "interactive.your_name")} /></label>
          <label>{t(locale, "interactive.work_email")} <span>*</span><input name="email" type="email" required autoComplete="email" maxLength={200} placeholder="you@company.com" /></label>
        </div>
        <div className="form-row">
          <label>{t(locale, "interactive.company")}<input name="company" autoComplete="organization" maxLength={150} placeholder={t(locale, "interactive.company_name")} /></label>
          <label>{t(locale, "interactive.service_required")} <span>*</span><select name="service" defaultValue="" required>
            <option value="" disabled>{t(locale, "interactive.select_a_service")}</option>
            {services.map(service => <option key={service.slug} value={service.slug}>{text(service.name, locale)}</option>)}
            <option value="discuss">{t(locale, "interactive.i_d_like_to_discuss_it_first")}</option>
          </select></label>
        </div>
        <label>{t(locale, "interactive.about_your_project")} <span>*</span><textarea name="message" required minLength={10} maxLength={3000} rows={5} placeholder={t(locale, "interactive.tell_us_about_the_facility_location_scope")} /></label>
        {enabled && <div className="contact-trap" aria-hidden="true"><label>Website<input name="website" type="text" tabIndex={-1} autoComplete="off" /></label></div>}
        <label className="consent"><input name="consent" type="checkbox" required /><span>{t(locale, enabled ? "contact.consent" : "interactive.i_understand_this_form_prepares_a_local")} {enabled && <Link href={url(locale, "privacy")}>{t(locale, "footer.privacy")}</Link>}</span></label>
        {siteKey && status !== "accepted" && <Turnstile siteKey={siteKey} locale={locale} resetKey={resetKey} onToken={setToken} />}
        <button type="submit" className="button button-green" disabled={enabled && !token}>
          <span>{t(locale, enabled ? status === "sending" ? "contact.sending" : status === "accepted" ? "contact.sent" : "contact.send" : "interactive.prepare_project_brief")}</span><ArrowUpRight size={18} />
        </button>
      </fieldset>
    </form>
    {summary && <div className="form-result" ref={result} tabIndex={-1} role="status">
      <div className="result-title"><Check size={22} /><h3>{t(locale, status === "accepted" ? "contact.sent" : "interactive.your_brief_is_ready")}</h3></div>
      <p>{t(locale, enabled ? status === "accepted" ? "contact.accepted" : status === "sending" ? "contact.sending" : "contact.fallback" : "interactive.no_message_has_been_sent_copy_or")}</p>
      {error && <p role="alert">{error}</p>}
      <pre>{summary}</pre>
      <div className="result-actions">
        <button type="button" className="button button-green" onClick={copy}>{copied ? <Check size={17} /> : <Copy size={17} />}{t(locale, copied ? "interactive.copied" : "interactive.copy_brief")}</button>
        <button type="button" className="button button-outline" onClick={download}><Download size={17} />{t(locale, "interactive.download")}</button>
        {company.email && <a className="button button-outline" href={`mailto:${company.email}?subject=${encodeURIComponent("Project inquiry — Green Ridge Technics")}&body=${encodeURIComponent(summary)}`}><Mail size={17} />{t(locale, "ui.email")}</a>}
      </div>
      {copyError && <p>{t(locale, "interactive.automatic_copying_is_unavailable_use_download_or")}</p>}
    </div>}
  </div>;
}
