"use client";

import { useState } from "react";

interface ContactFormProps {
  palette: { primary: string; bg: string; text: string };
}

export default function ContactForm({ palette }: ContactFormProps) {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "", honeypot: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setStatus("success");
      setForm({ name: "", email: "", company: "", message: "", honeypot: "" });
    } else {
      const data = await res.json();
      setErrorMsg(data.error || "Failed to send");
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <input type="text" name="honeypot" value={form.honeypot} onChange={(e) => setForm({ ...form, honeypot: e.target.value })} className="hidden" tabIndex={-1} autoComplete="off" />

      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: palette.text }}>Name *</label>
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:outline-none"
          style={{ focusRingColor: palette.primary } as React.CSSProperties}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: palette.text }}>Email *</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: palette.text }}>Company</label>
        <input
          type="text"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: palette.text }}>Message *</label>
        <textarea
          required
          rows={4}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="px-6 py-2.5 text-sm font-semibold text-white rounded-lg transition-colors disabled:opacity-50"
        style={{ backgroundColor: palette.primary }}
      >
        {status === "sending" ? "Sending..." : "Send Message"}
      </button>

      {status === "success" && (
        <p className="text-sm text-green-600 font-medium">Message sent successfully! We&apos;ll be in touch.</p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-600 font-medium">{errorMsg}</p>
      )}
    </form>
  );
}
