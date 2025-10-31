// src/app/sitemap.ts
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const base = 'https://baturunlu.com';
    return [
        { url: `${base}/`,        changeFrequency: 'weekly',  priority: 1.0 },
        { url: `${base}/about`,   changeFrequency: 'monthly', priority: 0.6 },
        { url: `${base}/contact`, changeFrequency: 'monthly', priority: 0.6 },
    ];
}