"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Settings {
  purchasedDomain: string | null;
  sendingSubdomain: string | null;
  mailgunDomain: string | null;
  mailgunFromEmail: string | null;
  mailgunToEmail: string | null;
  gmailReplyTo: string | null;
  contactFormEmail: string | null;
  mailgunSetup: boolean;
  renderDeployUrl: string | null;
}

export default function SettingsForm() {
  const [settings, setSettings] = useState<Settings>({
    purchasedDomain: null,
    sendingSubdomain: null,
    mailgunDomain: null,
    mailgunFromEmail: null,
    mailgunToEmail: null,
    gmailReplyTo: null,
    contactFormEmail: null,
    mailgunSetup: false,
    renderDeployUrl: null,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testingMail, setTestingMail] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch {
      // silently handle
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleTestEmail = async () => {
    setTestingMail(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/test-email", { method: "POST" });
      const data = await res.json();
      setTestResult(data.success ? "Test email sent successfully!" : `Failed: ${data.error}`);
    } catch {
      setTestResult("Failed to send test email");
    }
    setTestingMail(false);
  };

  const domain = settings.purchasedDomain || "";
  const domainBase = domain.replace(/^www\./, "");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">&larr; Dashboard</Link>
            <h1 className="text-xl font-bold text-gray-900">Settings</h1>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:opacity-50"
          >
            {saving ? "Saving..." : saved ? "Saved!" : "Save Settings"}
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Domain Configuration */}
        <section className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-1">Domain Configuration</h2>
          <p className="text-sm text-gray-500 mb-4">
            Default domain settings. These apply to any generated site that doesn&apos;t have its own per-site configuration.
            Use the &quot;Configure&quot; button on each site card for per-site overrides.
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Purchased Domain</label>
              <input
                type="text"
                placeholder="myawesomestartup.com"
                value={settings.purchasedDomain || ""}
                onChange={(e) => setSettings({ ...settings, purchasedDomain: e.target.value || null })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <p className="text-xs text-gray-400 mt-1">
                This will be shown on generated websites as the main domain.
              </p>
            </div>
            {domainBase && (
              <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
                <h4 className="text-sm font-medium text-indigo-800 mb-2">Dynamic Values Preview</h4>
                <div className="space-y-1 text-xs text-indigo-700">
                  <p>Website URL: <code className="bg-indigo-100 px-1.5 py-0.5 rounded">https://{domainBase}</code></p>
                  <p>Contact email: <code className="bg-indigo-100 px-1.5 py-0.5 rounded">{settings.contactFormEmail || `contact@${domainBase}`}</code></p>
                  <p>Reply-to: <code className="bg-indigo-100 px-1.5 py-0.5 rounded">{settings.gmailReplyTo || `hello@${domainBase}`}</code></p>
                  <p>Mailgun sending: <code className="bg-indigo-100 px-1.5 py-0.5 rounded">{settings.mailgunFromEmail || `noreply@${settings.sendingSubdomain || `mail.${domainBase}`}`}</code></p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Mailgun Configuration */}
        <section className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-1">Mailgun Configuration</h2>
          <p className="text-sm text-gray-500 mb-4">
            Configure Mailgun to handle contact form submissions from generated websites.
            The Mailgun API Key should be set as an environment variable.
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sending Subdomain</label>
              <input
                type="text"
                placeholder={domainBase ? `mail.${domainBase}` : "mail.yourdomain.com"}
                value={settings.sendingSubdomain || ""}
                onChange={(e) => setSettings({ ...settings, sendingSubdomain: e.target.value || null })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <p className="text-xs text-gray-400 mt-1">
                Add this subdomain to Mailgun and configure DNS records.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mailgun Domain</label>
              <input
                type="text"
                placeholder={domainBase ? `mail.${domainBase}` : "mail.yourdomain.com"}
                value={settings.mailgunDomain || ""}
                onChange={(e) => setSettings({ ...settings, mailgunDomain: e.target.value || null })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <p className="text-xs text-gray-400 mt-1">
                The verified domain in your Mailgun account.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Email</label>
              <input
                type="email"
                placeholder={domainBase ? `noreply@mail.${domainBase}` : "noreply@mail.yourdomain.com"}
                value={settings.mailgunFromEmail || ""}
                onChange={(e) => setSettings({ ...settings, mailgunFromEmail: e.target.value || null })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <p className="text-xs text-gray-400 mt-1">
                The sender address for emails sent from the contact form.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Email (receive submissions)</label>
              <input
                type="email"
                placeholder={domainBase ? `contact@${domainBase}` : "contact@yourdomain.com"}
                value={settings.mailgunToEmail || ""}
                onChange={(e) => setSettings({ ...settings, mailgunToEmail: e.target.value || null })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <p className="text-xs text-gray-400 mt-1">
                The email address that receives contact form submissions.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${settings.mailgunSetup ? "bg-green-500" : "bg-yellow-500"}`} />
              <span className="text-sm">{settings.mailgunSetup ? "Configured & Verified" : "Not Configured"}</span>
              <button
                onClick={() => setSettings({ ...settings, mailgunSetup: !settings.mailgunSetup })}
                className="ml-auto text-sm text-indigo-600 hover:text-indigo-500"
              >
                {settings.mailgunSetup ? "Mark as Unconfigured" : "Mark as Configured"}
              </button>
            </div>
            <div>
              <button
                onClick={handleTestEmail}
                disabled={testingMail}
                className="px-3 py-1.5 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-500 disabled:opacity-50"
              >
                {testingMail ? "Sending..." : "Send Test Email"}
              </button>
              {testResult && (
                <p className={`text-sm mt-2 ${testResult.includes("success") ? "text-green-600" : "text-red-600"}`}>
                  {testResult}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Gmail Reply Configuration */}
        <section className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-1">Gmail Reply-To Configuration</h2>
          <p className="text-sm text-gray-500 mb-4">
            Set the reply-to email address for contact form emails. When someone replies to a contact form notification,
            it will go to this address. You can set this to your Gmail with domain forwarding.
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reply-To Email</label>
              <input
                type="email"
                placeholder={domainBase ? `hello@${domainBase}` : "hello@yourdomain.com"}
                value={settings.gmailReplyTo || ""}
                onChange={(e) => setSettings({ ...settings, gmailReplyTo: e.target.value || null })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <p className="text-xs text-gray-400 mt-1">
                Replies to contact form emails will be directed here.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Form Display Email</label>
              <input
                type="email"
                placeholder={domainBase ? `contact@${domainBase}` : "contact@yourdomain.com"}
                value={settings.contactFormEmail || ""}
                onChange={(e) => setSettings({ ...settings, contactFormEmail: e.target.value || null })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <p className="text-xs text-gray-400 mt-1">
                This email is displayed on the generated website contact pages.
              </p>
            </div>
          </div>
        </section>

        {/* Render Deployment */}
        <section className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Render Deployment</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Render Deploy URL</label>
            <input
              type="text"
              placeholder="https://myapp.onrender.com"
              value={settings.renderDeployUrl || ""}
              onChange={(e) => setSettings({ ...settings, renderDeployUrl: e.target.value || null })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="mt-4 flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${settings.renderDeployUrl ? "bg-green-500" : "bg-gray-300"}`} />
            <span className="text-sm">{settings.renderDeployUrl ? "Configured" : "Not Set"}</span>
          </div>
        </section>

        {/* DNS Setup Guide */}
        {domainBase && (
          <section className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-1">DNS Setup Guide</h2>
            <p className="text-sm text-gray-500 mb-4">
              Add these DNS records in your domain registrar (Wix, Namecheap, etc.) to set up Mailgun.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-4 font-medium text-gray-700">Type</th>
                    <th className="text-left py-2 pr-4 font-medium text-gray-700">Host</th>
                    <th className="text-left py-2 font-medium text-gray-700">Value</th>
                  </tr>
                </thead>
                <tbody className="text-xs text-gray-600">
                  <tr className="border-b">
                    <td className="py-2 pr-4"><code>TXT</code></td>
                    <td className="py-2 pr-4"><code>{settings.sendingSubdomain || `mail.${domainBase}`}</code></td>
                    <td className="py-2"><code>v=spf1 include:mailgun.org ~all</code></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4"><code>TXT</code></td>
                    <td className="py-2 pr-4"><code>smtp._domainkey.{settings.sendingSubdomain || `mail.${domainBase}`}</code></td>
                    <td className="py-2"><code>(Get from Mailgun dashboard)</code></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4"><code>MX</code></td>
                    <td className="py-2 pr-4"><code>{settings.sendingSubdomain || `mail.${domainBase}`}</code></td>
                    <td className="py-2"><code>mxa.mailgun.org (priority 10)</code></td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4"><code>MX</code></td>
                    <td className="py-2 pr-4"><code>{settings.sendingSubdomain || `mail.${domainBase}`}</code></td>
                    <td className="py-2"><code>mxb.mailgun.org (priority 10)</code></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              After adding DNS records, verify them in your Mailgun dashboard. DNS propagation may take up to 48 hours.
            </p>
          </section>
        )}

        {/* Environment Variables */}
        <section className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Environment Variables (set in Render)</h2>
          <div className="space-y-2 text-sm">
            {[
              { env: "DATABASE_URL", desc: "PostgreSQL connection string" },
              { env: "PAGEGRID_API_KEY", desc: "AI content generation" },
              { env: "UNSPLASH_ACCESS_KEY", desc: "Image sourcing" },
              { env: "MAILGUN_API_KEY", desc: "Email delivery" },
            ].map(({ env, desc }) => (
              <div key={env} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gray-300" />
                <code className="text-xs bg-gray-100 px-2 py-0.5 rounded">{env}</code>
                <span className="text-xs text-gray-400">— {desc}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Domain, Mailgun, and email settings are stored in the database (configured above) — not as environment variables.
            Only sensitive API keys need to be set as environment variables in Render.
          </p>
        </section>
      </main>
    </div>
  );
}
