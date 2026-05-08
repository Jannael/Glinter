import type { APIRoute } from 'astro'

export const GET: APIRoute = () => {
	const manifest = {
		name: 'Glinter',
		short_name: 'Glinter',
		description: 'The best way to use Git!',
		start_url: '/',
		display: 'standalone',
		background_color: '#0a0a0a',
		theme_color: '#0a0a0a',
		icons: [
			{
				src: '/logo-192-white.webp',
				sizes: '192x192',
				type: 'image/webp',
			},
			{
				src: '/logo-512-white.webp',
				sizes: '512x512',
				type: 'image/webp',
			},
			{
				src: '/logo-192-black.webp',
				sizes: '192x192',
				type: 'image/webp',
			},
			{
				src: '/logo-512-black.webp',
				sizes: '512x512',
				type: 'image/webp',
			},
		],
	}

	return new Response(JSON.stringify(manifest, null, 2), {
		headers: {
			'Content-Type': 'application/manifest+json; charset=utf-8',
		},
	})
}
