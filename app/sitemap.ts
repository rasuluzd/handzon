import type { MetadataRoute } from "next";
import { locations, services } from "@/lib/mock-data";
import { publishedPosts } from "@/lib/blog";

const BASE_URL = "https://www.handzonautocare.no";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/booking`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/tjenester`, changeFrequency: "weekly", priority: 0.8 },
    ...services.map((service) => ({
      url: `${BASE_URL}/tjenester/${service.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    { url: `${BASE_URL}/avdelinger`, changeFrequency: "weekly", priority: 0.8 },
    ...locations.map((location) => ({
      url: `${BASE_URL}/avdelinger/${location.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    { url: `${BASE_URL}/kundeklubb`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/nyheter`, changeFrequency: "weekly", priority: 0.6 },
    ...publishedPosts().map((post) => ({
      url: `${BASE_URL}/nyheter/${post.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    { url: `${BASE_URL}/kontakt`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/om-oss`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/min-side`, changeFrequency: "monthly", priority: 0.4 },
  ];
}
