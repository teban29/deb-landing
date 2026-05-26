import { ui, defaultLang } from './ui';

export function getLangFromUrl(url: URL) {
	const [, lang] = url.pathname.split('/');
	if (lang === 'fr' || lang === 'es') return lang;
	return defaultLang;
}

export function useTranslations(lang: string) {
	return function t(key: string) {
		const translations = ui[lang as keyof typeof ui] as Record<string, string>;
		const defaultTranslations = ui[defaultLang] as Record<string, string>;
		return translations[key] || defaultTranslations[key];
	};
}

export function getLocalizedPath(path: string, lang: string) {
	// Remove leading slash and lang prefix if exists
	const cleanPath = path.replace(/^\//, '').replace(/^(fr|es)\//, '');
	return `/${lang}/${cleanPath}`.replace(/\/+$/, '');
}
