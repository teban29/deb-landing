import { ui, defaultLang } from './ui';

export function getLangFromUrl(url: URL) {
	const [, lang] = url.pathname.split('/');
	if (lang === 'fr' || lang === 'es') return lang;
	return defaultLang;
}

export function useTranslations(lang: string) {
	return function t(key: keyof typeof ui[typeof defaultLang]) {
		return ui[lang as keyof typeof ui][key] || ui[defaultLang][key];
	};
}

export function getLocalizedPath(path: string, lang: string) {
	// Remove leading slash and lang prefix if exists
	const cleanPath = path.replace(/^\//, '').replace(/^(fr|es)\//, '');
	return `/${lang}/${cleanPath}`.replace(/\/+$/, '');
}
