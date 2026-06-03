import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

export default defineConfig({
	vite: {
		plugins: [tailwindcss()]
	},
	adapter: vercel(),
	i18n: {
		defaultLocale: 'fr',
		locales: ['fr', 'es'],
		routing: {
			prefixDefaultLocale: true
		}
	}
});
