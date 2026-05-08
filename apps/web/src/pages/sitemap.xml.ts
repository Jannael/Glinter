import type { APIRoute } from 'astro'

export const GET: APIRoute = () => {
	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://glinter.jannael.com/</loc>
    <lastmod>2026-04-20</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://glinter.jannael.com/alias</loc>
    <lastmod>2026-04-20</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
		},
	})
}
