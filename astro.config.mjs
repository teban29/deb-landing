import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';

export default defineConfig({
	site: 'https://deb-tout.com',
	vite: {
		plugins: [tailwindcss()]
	},
	output: 'server',
	adapter: node({ mode: 'standalone' }),
	i18n: {
		defaultLocale: 'fr',
		locales: ['fr', 'es'],
		routing: {
			prefixDefaultLocale: true
		}
	}
});
