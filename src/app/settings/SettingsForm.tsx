"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Settings {
  purchasedDomain: string | null;
  sendingSubdomain: string | null;
  mailgunSetup: boolean;
  renderDeployUrl: string | null;
}

export default function SettingsForm() {
  const [settings, setSettings] = useState<Settings>({
    purchasedDomain: null,
    sendingSubdomain: null,
    mailgunSetup: false,
    renderDeployUrl: null,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchSettings = useCallback(async () => {
    const res = await fetch("/api/settings");
    const data = await res.json();
    setSettings(data);
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
    setTimeout(() => setSaved(false), 2000);
  };

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
        <section className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Domain Configuration</h2>
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
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sending Subdomain</label>
              <input
                type="text"
                placeholder="mail.myawesomestartup.com"
                value={settings.sendingSubdomain || ""}
                onChange={(e) => setSettings({ ...settings, sendingSubdomain: e.target.value || null })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Mailgun Status</h2>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${settings.mailgunSetup ? "bg-green-500" : "bg-yellow-500"}`} />
            <span className="text-sm">{settings.mailgunSetup ? "Configured" : "Not Configured"}</span>
            <button
              onClick={() => setSettings({ ...settings, mailgunSetup: !settings.mailgunSetup })}
              className="ml-auto text-sm text-indigo-600 hover:text-indigo-500"
            >
              Toggle Status
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Set MAILGUN_API_KEY, MAILGUN_DOMAIN, MAILGUN_FROM_EMAIL, and MAILGUN_TO_EMAIL environment variables to enable email sending.
          </p>
        </section>

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

        <section className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Environment Variables Checklist</h2>
          <div className="space-y-2 text-sm">
            {[
              "DATABASE_URL", "APP_URL", "UNSPLASH_ACCESS_KEY",
              "MAILGUN_API_KEY", "MAILGUN_DOMAIN", "MAILGUN_FROM_EMAIL", "MAILGUN_TO_EMAIL",
              "UNIQUENESS_NAME_THRESHOLD", "UNIQUENESS_COPY_THRESHOLD",
            ].map((env) => (
              <div key={env} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gray-300" />
                <code className="text-xs bg-gray-100 px-2 py-0.5 rounded">{env}</code>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
