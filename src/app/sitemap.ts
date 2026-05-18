import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://esskaytonality.com'; // Adjust once the domain is fully live!

  // Static routes
  const routes = [
    '',
    '/about',
    '/artists',
    '/music',
    '/news',
    '/videos',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  return [...routes];
}
