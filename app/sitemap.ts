import type { MetadataRoute } from "next";
import { locations } from "@/lib/mock-data";

const BASE_URL = "https://www.handzonautocare.no";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/booking`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/avdelinger`, changeFrequency: "weekly", priority: 0.8 },
    ...locations.map((location) => ({
      url: `${BASE_URL}/avdelinger/${location.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    { url: `${BASE_URL}/min-side`, changeFrequency: "monthly", priority: 0.4 },
  ];
}
