"use client";

import { useState, useEffect, useCallback } from "react";
import GenerationCard from "./GenerationCard";
import Link from "next/link";

interface Generation {
  id: string;
  startupName: string;
  category: string;
  tagline: string;
  createdAt: string;
  deploymentStatus: string;
  mailgunStatus: string;
  archived: boolean;
  purchasedDomain: string | null;
  uniquenessScores: { overallScore: number; isUnique: boolean } | null;
  nearestMatches: { id: string; score: number }[] | null;
}

export default function Dashboard() {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchGenerations = useCallback(async () => {
    try {
      const res = await fetch("/api/generations");
      if (res.ok) {
        const data = await res.json();
        setGenerations(data);
      }
    } catch {
      // silently handle
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/generations")
      .then((res) => res.ok ? res.json() : null)
      .then((data) => { if (!cancelled && data) setGenerations(data); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (res.ok) {
        await fetchGenerations();
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleArchive = async (id: string) => {
    await fetch(`/api/generations?id=${id}`, { method: "DELETE" });
    await fetchGenerations();
  };

  const handleDeploy = async (id: string) => {
    const res = await fetch("/api/deploy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ generationId: id }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.message) {
        alert(data.message);
      }
    }
    await fetchGenerations();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Startup Website Factory</h1>
            <p className="text-sm text-gray-500">Generate unique startup websites with one click</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/settings"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Settings
            </Link>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {generating ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating...
                </span>
              ) : (
                "Generate New Startup Site"
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading generations...</div>
        ) : generations.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">&#x1F680;</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No generations yet</h2>
            <p className="text-gray-500 mb-6">Click the button above to generate your first startup website</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {generations.map((gen) => (
              <GenerationCard
                key={gen.id}
                gen={gen}
                onArchive={handleArchive}
                onDeploy={handleDeploy}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
