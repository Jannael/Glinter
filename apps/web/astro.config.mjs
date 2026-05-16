// @ts-check

import cloudflare from '@astrojs/cloudflare'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
	site: 'https://glinter.jannael.com',
	trailingSlash: 'always',
	devToolbar: { enabled: false },
	vite: {
		plugins: [tailwindcss()],
	},

	adapter: cloudflare(),
	integrations: [
		sitemap({
			lastmod: new Date(),
			priority: 0.7,
			changefreq: 'weekly',
		}),
	],
})
