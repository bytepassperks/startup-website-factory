interface UnsplashImage {
  query: string;
  url: string;
  credit: string;
  thumbUrl: string;
}

const FALLBACK_PHOTOS: Record<string, string[]> = {
  technology: [
    "photo-1518770660439-4636190af475",
    "photo-1531297484001-80022131f5a1",
    "photo-1488590528505-98d2b5aba04b",
    "photo-1526374965328-7f61d4dc18c5",
    "photo-1550751827-4bd374c3f58b",
    "photo-1519389950473-47ba0277781c",
    "photo-1504384308090-c894fdcc538d",
    "photo-1535378917042-10a22c95931a",
    "photo-1573164713988-8665fc963095",
    "photo-1451187580459-43490279c0fa",
  ],
  business: [
    "photo-1556761175-5973dc0f32e7",
    "photo-1560472355-536de3962603",
    "photo-1553877522-43269d4ea984",
    "photo-1542744173-8e7e53415bb0",
    "photo-1552664730-d307ca884978",
    "photo-1600880292203-757bb62b4baf",
    "photo-1559136555-9303baea8ebd",
    "photo-1521737604893-d14cc237f11d",
    "photo-1573167243872-43c6433b9d40",
    "photo-1556745757-8d76bdb6984b",
  ],
  team: [
    "photo-1522071820081-009f0129c71c",
    "photo-1600880292089-90a7e086ee0c",
    "photo-1517245386807-bb43f82c33c4",
    "photo-1552581234-26160f608093",
    "photo-1543269865-cbf427effbad",
    "photo-1556761175-b413da4baf72",
    "photo-1515187029135-18ee286d815b",
    "photo-1531482615713-2afd69097998",
    "photo-1582213782179-e0d53f98f2ca",
    "photo-1529156069898-49953e39b3ac",
  ],
  dashboard: [
    "photo-1551288049-bebda4e38f71",
    "photo-1460925895917-afdab827c52f",
    "photo-1504868584819-f8e8b4b6d7e3",
    "photo-1543286386-713bdd548da4",
    "photo-1611532736597-de2d4265fba3",
    "photo-1587145820098-fa787d739e76",
    "photo-1551434678-e076c223a692",
    "photo-1498050108023-c5249f4df085",
    "photo-1555949963-ff9fe0c870eb",
    "photo-1516321318423-f06f85e504b3",
  ],
  innovation: [
    "photo-1485827404703-89b55fcc595e",
    "photo-1473091534298-04dcbce3278c",
    "photo-1535223289827-42f1e9919769",
    "photo-1620712943543-bcc4688e7485",
    "photo-1581091226825-a6a2a5aee158",
    "photo-1531746790095-e15903fefdd5",
    "photo-1497215728101-856f4ea42174",
    "photo-1517694712202-14dd9538aa97",
    "photo-1550745165-9bc0b252726f",
    "photo-1504639725590-34d0984388bd",
  ],
  professional: [
    "photo-1573497019940-1c28c88b4f3e",
    "photo-1573496359142-b8d87734a5a2",
    "photo-1560250097-0b93528c311a",
    "photo-1507003211169-0a1dd7228f2d",
    "photo-1573167243872-43c6433b9d40",
    "photo-1580489944761-15a19d654956",
    "photo-1519085360753-af0119f7cbe7",
    "photo-1562788869-4ed32648eb72",
    "photo-1598257006458-087169a1f08d",
    "photo-1506794778202-cad84cf45f1d",
  ],
  abstract: [
    "photo-1557672172-298e090bd0f1",
    "photo-1558591710-4b4a1ae0f04d",
    "photo-1550684376-efcbd6e3f031",
    "photo-1579546929518-9e396f3cc809",
    "photo-1553356084-58ef4a67b2a7",
    "photo-1618005182384-a83a8bd57fbe",
    "photo-1614850523459-c2f4c699c52e",
    "photo-1614854262318-831574f15f1f",
    "photo-1620641788421-7a1c342ea42e",
    "photo-1635002962487-6f4f16e01b24",
  ],
  office: [
    "photo-1497366216548-37526070297c",
    "photo-1497366811353-6870744d04b2",
    "photo-1524758631624-e2822e304c36",
    "photo-1568992687947-868a62a9f521",
    "photo-1604328698692-f76ea9498e76",
    "photo-1497215842964-222b430dc094",
    "photo-1562664377-709f2c337eb2",
    "photo-1600508774634-4e11d34730e2",
    "photo-1606836576983-8b458e75221d",
    "photo-1527192491265-7e15203b37a7",
  ],
};

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function matchCategory(query: string): string {
  const q = query.toLowerCase();
  if (/dashboard|analytics|screen|data|chart|metric/.test(q)) return "dashboard";
  if (/team|collaborat|office|meeting|workspace/.test(q)) return "team";
  if (/professional|working|person|founder|people/.test(q)) return "professional";
  if (/innovat|startup|future|robot|ai|machine/.test(q)) return "innovation";
  if (/abstract|digital|pattern|design|creative/.test(q)) return "abstract";
  if (/business|corporate|enterprise|company|finance/.test(q)) return "business";
  if (/office|desk|interior|building/.test(q)) return "office";
  return "technology";
}

function pickFallbackImage(query: string, index: number, usedIds: Set<string>): string {
  const cat = matchCategory(query);
  const pool = FALLBACK_PHOTOS[cat];
  const hash = hashString(query) + index;
  let photoId = pool[hash % pool.length];

  // avoid duplicates across the set
  let tries = 0;
  while (usedIds.has(photoId) && tries < pool.length) {
    photoId = pool[(hash + tries + 1) % pool.length];
    tries++;
  }
  usedIds.add(photoId);
  return photoId;
}

export async function searchUnsplash(
  queries: string[],
  existingQueries: string[][] = []
): Promise<UnsplashImage[]> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    const usedIds = new Set<string>();
    return queries.map((q, i) => {
      const photoId = pickFallbackImage(q, i, usedIds);
      return {
        query: q,
        url: `https://images.unsplash.com/${photoId}?w=1200&q=80`,
        thumbUrl: `https://images.unsplash.com/${photoId}?w=400&q=80`,
        credit: "Unsplash",
      };
    });
  }

  const recentQueries = new Set(existingQueries.flat().map((q) => q.toLowerCase()));
  const results: UnsplashImage[] = [];
  const usedIds = new Set<string>();

  for (let i = 0; i < queries.length; i++) {
    const query = queries[i];
    try {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`,
        { headers: { Authorization: `Client-ID ${accessKey}` } }
      );

      if (!res.ok) {
        const photoId = pickFallbackImage(query, i, usedIds);
        results.push({
          query,
          url: `https://images.unsplash.com/${photoId}?w=1200&q=80`,
          thumbUrl: `https://images.unsplash.com/${photoId}?w=400&q=80`,
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
        const photoId = pickFallbackImage(query, i, usedIds);
        results.push({
          query,
          url: `https://images.unsplash.com/${photoId}?w=1200&q=80`,
          thumbUrl: `https://images.unsplash.com/${photoId}?w=400&q=80`,
          credit: "Unsplash",
        });
      }
    } catch {
      const photoId = pickFallbackImage(query, i, usedIds);
      results.push({
        query,
        url: `https://images.unsplash.com/${photoId}?w=1200&q=80`,
        thumbUrl: `https://images.unsplash.com/${photoId}?w=400&q=80`,
        credit: "Unsplash",
      });
    }
  }

  return results;
}
