import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	vite: {
		plugins: [tailwindcss()]
	},
	i18n: {
		defaultLocale: 'fr',
		locales: ['fr', 'es'],
		routing: {
			prefixDefaultLocale: true
		}
	}
});
