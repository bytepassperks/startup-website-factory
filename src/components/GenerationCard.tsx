"use client";

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
  uniquenessScores: { overallScore: number; isUnique: boolean } | null;
  nearestMatches: { id: string; score: number }[] | null;
}

export default function GenerationCard({
  gen,
  onArchive,
  onDeploy,
}: {
  gen: Generation;
  onArchive: (id: string) => void;
  onDeploy: (id: string) => void;
}) {
  const score = gen.uniquenessScores?.overallScore ?? 0;
  const scoreColor = score < 0.3 ? "text-green-600" : score < 0.5 ? "text-yellow-600" : "text-red-600";
  const statusColors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-700",
    ready: "bg-blue-100 text-blue-700",
    deployed: "bg-green-100 text-green-700",
  };

  return (
    <div className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-lg text-gray-900">{gen.startupName}</h3>
          <p className="text-sm text-gray-500">{gen.category}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[gen.deploymentStatus] || statusColors.draft}`}>
          {gen.deploymentStatus}
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-3 italic">&ldquo;{gen.tagline}&rdquo;</p>

      <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
        <span>{new Date(gen.createdAt).toLocaleDateString()}</span>
        <span className={`font-medium ${scoreColor}`}>
          Similarity: {(score * 100).toFixed(0)}%
        </span>
        {gen.nearestMatches && gen.nearestMatches.length > 0 && (
          <span className="text-gray-400">
            Nearest: {gen.nearestMatches[0].id.slice(0, 8)}...
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href={`/preview/${gen.id}`}
          className="px-3 py-1.5 text-xs font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Preview
        </Link>
        <Link
          href={`/edit/${gen.id}`}
          className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Edit
        </Link>
        <Link
          href={`/site/${gen.id}`}
          className="px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
        >
          View Site
        </Link>
        <button
          onClick={() => onDeploy(gen.id)}
          className="px-3 py-1.5 text-xs font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-colors"
        >
          Deploy
        </button>
        <button
          onClick={() => onArchive(gen.id)}
          className="px-3 py-1.5 text-xs font-medium bg-white border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
        >
          Archive
        </button>
      </div>
    </div>
  );
}
