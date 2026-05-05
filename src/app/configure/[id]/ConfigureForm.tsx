"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface SiteConfig {
  startupName: string;
  domainSuggestion: string;
  purchasedDomain: string | null;
  mailgunDomain: string | null;
  mailgunFromEmail: string | null;
  mailgunToEmail: string | null;
  gmailReplyTo: string | null;
  contactFormEmail: string | null;
  mailgunSetup: boolean;
}

export default function ConfigureForm({ generationId }: { generationId: string }) {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testingMail, setTestingMail] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const fetchConfig = useCallback(async () => {
    const res = await fetch(`/api/generations/${generationId}/settings`);
    if (res.ok) setConfig(await res.json());
  }, [generationId]);

  useEffect(() => { fetchConfig(); }, [fetchConfig]);

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    await fetch(`/api/generations/${generationId}/settings`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleTestEmail = async () => {
    setTestingMail(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ generationId }),
      });
      const data = await res.json();
      setTestResult(data.success ? "Test email sent!" : `Failed: ${data.error}`);
    } catch {
      setTestResult("Failed to send test email");
    }
    setTestingMail(false);
  };

  if (!config) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">Loading...</div>;

  const domain = config.purchasedDomain || "";
  const domainBase = domain.replace(/^www\./, "");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">&larr; Dashboard</Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Configure: {config.startupName}</h1>
              <p className="text-xs text-gray-500">Default domain: {config.domainSuggestion}</p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:opacity-50"
          >
            {saving ? "Saving..." : saved ? "Saved!" : "Save Configuration"}
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <section className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-1">Domain Configuration</h2>
          <p className="text-sm text-gray-500 mb-4">
            Set the purchased domain for this specific startup site. Leave blank to use the global default or the auto-generated domain.
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Purchased Domain</label>
              <input
                type="text"
                placeholder={config.domainSuggestion}
                value={config.purchasedDomain || ""}
                onChange={(e) => setConfig({ ...config, purchasedDomain: e.target.value || null })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Form Display Email</label>
              <input
                type="email"
                placeholder={domainBase ? `contact@${domainBase}` : "contact@yourdomain.com"}
                value={config.contactFormEmail || ""}
                onChange={(e) => setConfig({ ...config, contactFormEmail: e.target.value || null })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <p className="text-xs text-gray-400 mt-1">Shown on the contact page of this site.</p>
            </div>
            {domainBase && (
              <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
                <h4 className="text-sm font-medium text-indigo-800 mb-2">Preview</h4>
                <div className="space-y-1 text-xs text-indigo-700">
                  <p>Website domain: <code className="bg-indigo-100 px-1.5 py-0.5 rounded">{domainBase}</code></p>
                  <p>Contact email: <code className="bg-indigo-100 px-1.5 py-0.5 rounded">{config.contactFormEmail || `contact@${domainBase}`}</code></p>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-1">Mailgun Configuration</h2>
          <p className="text-sm text-gray-500 mb-4">
            Per-site Mailgun settings. Leave blank to use the global defaults.
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mailgun Domain</label>
              <input
                type="text"
                placeholder={domainBase ? `mail.${domainBase}` : "mail.yourdomain.com"}
                value={config.mailgunDomain || ""}
                onChange={(e) => setConfig({ ...config, mailgunDomain: e.target.value || null })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Email</label>
              <input
                type="email"
                placeholder={domainBase ? `noreply@mail.${domainBase}` : "noreply@mail.yourdomain.com"}
                value={config.mailgunFromEmail || ""}
                onChange={(e) => setConfig({ ...config, mailgunFromEmail: e.target.value || null })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Email (receive submissions)</label>
              <input
                type="email"
                placeholder={domainBase ? `contact@${domainBase}` : "contact@yourdomain.com"}
                value={config.mailgunToEmail || ""}
                onChange={(e) => setConfig({ ...config, mailgunToEmail: e.target.value || null })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gmail Reply-To</label>
              <input
                type="email"
                placeholder="reply@gmail.com"
                value={config.gmailReplyTo || ""}
                onChange={(e) => setConfig({ ...config, gmailReplyTo: e.target.value || null })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${config.mailgunSetup ? "bg-green-500" : "bg-yellow-500"}`} />
              <span className="text-sm">{config.mailgunSetup ? "Configured" : "Not Configured"}</span>
              <button
                onClick={() => setConfig({ ...config, mailgunSetup: !config.mailgunSetup })}
                className="ml-auto text-sm text-indigo-600 hover:text-indigo-500"
              >
                Toggle
              </button>
            </div>
            <button
              onClick={handleTestEmail}
              disabled={testingMail}
              className="px-3 py-1.5 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-500 disabled:opacity-50"
            >
              {testingMail ? "Sending..." : "Send Test Email"}
            </button>
            {testResult && <p className={`text-sm ${testResult.includes("sent") ? "text-green-600" : "text-red-600"}`}>{testResult}</p>}
          </div>
        </section>

        <div className="flex gap-3">
          <Link
            href={`/site/${generationId}/contact`}
            className="px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-700"
          >
            View Contact Page
          </Link>
          <Link
            href={`/site/${generationId}`}
            className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-500"
          >
            View Full Site
          </Link>
        </div>
      </main>
    </div>
  );
}
