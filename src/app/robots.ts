import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/user/', '/artist/', '/api/'],
    },
    sitemap: 'https://esskaytonality.com/sitemap.xml',
  };
}
