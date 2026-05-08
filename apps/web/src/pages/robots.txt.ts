import type { APIRoute } from 'astro'

export const GET: APIRoute = () => {
	const robots = `
User-agent: *
Allow: /

Sitemap: https://glinter.jannael.com/sitemap.xml
`.trim()

	return new Response(robots, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
		},
	})
}
