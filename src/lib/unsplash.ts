interface UnsplashImage {
  query: string;
  url: string;
  credit: string;
  thumbUrl: string;
}

export async function searchUnsplash(
  queries: string[],
  existingQueries: string[][] = []
): Promise<UnsplashImage[]> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    return queries.map((q) => ({
      query: q,
      url: `https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200`,
      thumbUrl: `https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400`,
      credit: "Unsplash",
    }));
  }

  const recentQueries = new Set(existingQueries.flat().map((q) => q.toLowerCase()));
  const results: UnsplashImage[] = [];

  for (const query of queries) {
    try {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`,
        { headers: { Authorization: `Client-ID ${accessKey}` } }
      );

      if (!res.ok) {
        results.push({
          query,
          url: `https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200`,
          thumbUrl: `https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400`,
          credit: "Unsplash",
        });
        continue;
      }

      const data = await res.json();
      const photos = data.results || [];

      const selected = photos.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (p: any) => !recentQueries.has(p.alt_description?.toLowerCase() || "")
      ) || photos[0];

      if (selected) {
        results.push({
          query,
          url: selected.urls.regular,
          thumbUrl: selected.urls.thumb,
          credit: `Photo by ${selected.user.name} on Unsplash`,
        });
        recentQueries.add(query.toLowerCase());
      } else {
        results.push({
          query,
          url: `https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200`,
          thumbUrl: `https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400`,
          credit: "Unsplash",
        });
      }
    } catch {
      results.push({
        query,
        url: `https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200`,
        thumbUrl: `https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400`,
        credit: "Unsplash",
      });
    }
  }

  return results;
}
