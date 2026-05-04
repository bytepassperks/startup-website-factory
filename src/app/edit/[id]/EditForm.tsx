"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface EditableFields {
  id: string;
  startupName: string;
  tagline: string;
  founderName: string;
  founderBio: string;
  domainSuggestion: string;
  heroHeadline: string;
  heroSubheadline: string;
  founderEmailPattern: string;
}

export default function EditForm({ generation }: { generation: EditableFields }) {
  const router = useRouter();
  const [form, setForm] = useState(generation);
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/generations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    router.push(`/preview/${generation.id}`);
  };

  const handleRegenerate = async (module: string) => {
    setRegenerating(module);
    const res = await fetch("/api/regenerate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ generationId: generation.id, module }),
    });
    if (res.ok) {
      router.refresh();
    }
    setRegenerating(null);
  };

  const fields: { key: keyof EditableFields; label: string; type: "text" | "textarea"; regenModule?: string }[] = [
    { key: "startupName", label: "Startup Name", type: "text", regenModule: "name" },
    { key: "tagline", label: "Tagline", type: "text", regenModule: "copy" },
    { key: "founderName", label: "Founder Name", type: "text", regenModule: "founder" },
    { key: "founderBio", label: "Founder Bio", type: "textarea", regenModule: "founder" },
    { key: "domainSuggestion", label: "Domain", type: "text", regenModule: "name" },
    { key: "heroHeadline", label: "Hero Headline", type: "text", regenModule: "copy" },
    { key: "heroSubheadline", label: "Hero Subheadline", type: "textarea", regenModule: "copy" },
    { key: "founderEmailPattern", label: "Contact Email", type: "text" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">&larr; Dashboard</Link>
            <h1 className="font-semibold text-gray-900">Edit: {generation.startupName}</h1>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {fields.map((field) => (
          <div key={field.key} className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">{field.label}</label>
              {field.regenModule && (
                <button
                  onClick={() => handleRegenerate(field.regenModule!)}
                  disabled={regenerating !== null}
                  className="text-xs text-indigo-600 hover:text-indigo-500"
                >
                  {regenerating === field.regenModule ? "Regenerating..." : `Regenerate ${field.regenModule}`}
                </button>
              )}
            </div>
            {field.type === "textarea" ? (
              <textarea
                value={form[field.key]}
                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            ) : (
              <input
                type="text"
                value={form[field.key]}
                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            )}
          </div>
        ))}

        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Bulk Regenerate</h3>
          <div className="flex flex-wrap gap-2">
            {["name", "founder", "copy", "layout", "images", "full"].map((mod) => (
              <button
                key={mod}
                onClick={() => handleRegenerate(mod)}
                disabled={regenerating !== null}
                className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
              >
                {regenerating === mod ? "..." : `Regen ${mod}`}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
