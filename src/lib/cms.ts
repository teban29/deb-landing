/**
 * Read-only client for the Strapi CMS.
 *
 * Every getter degrades gracefully: if the CMS is unreachable or an entry is
 * missing, it returns `null`/`[]` and the Astro component falls back to the
 * static content that already existed in the project. The site never breaks
 * because the CMS is down.
 */

const CMS_URL = (process.env.CMS_URL ?? 'http://localhost:1337').replace(/\/$/, '');
const CMS_PUBLIC_URL = (process.env.CMS_PUBLIC_URL ?? CMS_URL).replace(/\/$/, '');
const CMS_API_TOKEN = process.env.CMS_API_TOKEN ?? '';
const CACHE_TTL_MS = Number(process.env.CMS_CACHE_TTL_MS ?? 300_000);
const REQUEST_TIMEOUT_MS = Number(process.env.CMS_TIMEOUT_MS ?? 4_000);

export const DEFAULT_LANG = 'fr';
export const SUPPORTED_LANGS = ['fr', 'es'] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];

export interface CmsMedia {
	url?: string;
	alternativeText?: string | null;
	width?: number;
	height?: number;
	mime?: string;
}

interface RawService {
	slug: string;
	name: string;
	shortDescription?: string | null;
	description?: string | null;
	icon: string;
	image?: CmsMedia | null;
	steps?: { title: string; description?: string | null }[];
	benefits?: { text: string }[];
	featured?: boolean;
	order?: number;
	seoTitle?: string | null;
	seoDescription?: string | null;
}

interface RawProject {
	slug: string;
	title: string;
	description?: string | null;
	category: string;
	cover?: CmsMedia | null;
	featured?: boolean;
	order?: number;
}

interface RawBeforeAfter {
	documentId?: string;
	title: string;
	category?: string | null;
	beforeImage?: CmsMedia | null;
	afterImage?: CmsMedia | null;
	beforeVideo?: CmsMedia | null;
	afterVideo?: CmsMedia | null;
	aspectRatio?: number | string | null;
	order?: number;
}

interface RawTestimonial {
	documentId?: string;
	text: string;
	author: string;
	rating?: number;
	dateLabel?: string | null;
	source?: string;
	featured?: boolean;
	order?: number;
}

interface RawSiteSettings {
	companyName?: string;
	tagline?: string;
	description?: string;
	phone?: string;
	email?: string;
	whatsapp?: string;
	address?: string;
	hours?: string;
	googleMapsUrl?: string;
	googleRating?: number | string;
	googleReviewCount?: number;
	logo?: CmsMedia | null;
	ogImage?: CmsMedia | null;
	socialLinks?: { platform: string; url: string }[];
	seoTitle?: string;
	seoDescription?: string;
}

interface RawHomePage {
	heroEyebrow?: string;
	heroTitleLine1?: string;
	heroTitleLine2?: string;
	heroTitleHighlight?: string;
	heroSubtitle?: string;
	heroImage?: CmsMedia | null;
	heroPrimaryLabel?: string;
	heroSecondaryLabel?: string;
	stats?: { value: string; label: string; sublabel?: string }[];
	valueTitle?: string;
	valueDescription?: string;
	valueCards?: { title: string; description?: string }[];
	servicesTitle?: string;
	servicesDescription?: string;
	projectsTitle?: string;
	projectsDescription?: string;
	beforeAfterTitle?: string;
	beforeAfterDescription?: string;
	whyUsTitle?: string;
	whyUsDescription?: string;
	whyUsPoints?: { text: string }[];
	processTitle?: string;
	processSteps?: { title: string; description?: string }[];
	testimonialsTitle?: string;
	testimonialsDescription?: string;
	ctaTitle?: string;
	ctaDescription?: string;
	ctaButtonLabel?: string;
	seoTitle?: string;
	seoDescription?: string;
}

export interface ServiceContent {
	slug: string;
	name: string;
	shortDescription: string;
	description?: string;
	icon: string;
	image?: string;
	steps: { title: string; description?: string }[];
	benefits: string[];
	featured: boolean;
	order: number;
	seoTitle?: string;
	seoDescription?: string;
}

export interface ProjectContent {
	slug: string;
	title: string;
	description?: string;
	category: string;
	cover?: string;
	featured: boolean;
	order: number;
}

export interface BeforeAfterContent {
	id: string;
	title: string;
	category: string;
	before: string;
	after: string;
	beforeVideo?: string;
	afterVideo?: string;
	aspectRatio: number;
	order: number;
}

export interface TestimonialContent {
	id: string;
	text: string;
	author: string;
	rating: number;
	dateLabel: string;
	source: string;
	featured: boolean;
	order: number;
}

export interface SiteSettingsContent {
	companyName: string;
	tagline: string;
	description: string;
	phone: string;
	email: string;
	whatsapp: string;
	address: string;
	hours: string;
	googleMapsUrl: string;
	googleRating: number;
	googleReviewCount: number;
	logo?: string;
	ogImage?: string;
	socialLinks: { platform: string; url: string }[];
	seoTitle?: string;
	seoDescription?: string;
}

export interface HomeContent {
	heroEyebrow?: string;
	heroTitleLine1?: string;
	heroTitleLine2?: string;
	heroTitleHighlight?: string;
	heroSubtitle?: string;
	heroImage?: string;
	heroPrimaryLabel?: string;
	heroSecondaryLabel?: string;
	stats?: { value: string; label: string; sublabel?: string }[];
	valueTitle?: string;
	valueDescription?: string;
	valueCards?: { title: string; description?: string }[];
	servicesTitle?: string;
	servicesDescription?: string;
	projectsTitle?: string;
	projectsDescription?: string;
	beforeAfterTitle?: string;
	beforeAfterDescription?: string;
	whyUsTitle?: string;
	whyUsDescription?: string;
	whyUsPoints?: string[];
	processTitle?: string;
	processSteps?: { title: string; description?: string }[];
	testimonialsTitle?: string;
	testimonialsDescription?: string;
	ctaTitle?: string;
	ctaDescription?: string;
	ctaButtonLabel?: string;
	seoTitle?: string;
	seoDescription?: string;
}

const cache = new Map<string, { value: unknown; expiresAt: number }>();
const inflight = new Map<string, Promise<unknown>>();

export function clearCmsCache() {
	cache.clear();
	inflight.clear();
}

function pruneCache() {
	if (cache.size < 500) return;
	const now = Date.now();
	for (const [key, entry] of cache) {
		if (entry.expiresAt <= now) cache.delete(key);
	}
}

async function cached<T>(key: string, loader: () => Promise<T>): Promise<T> {
	const hit = cache.get(key);
	if (hit && hit.expiresAt > Date.now()) {
		return hit.value as T;
	}

	const pending = inflight.get(key);
	if (pending) return pending as Promise<T>;

	const promise = loader()
		.then((value) => {
			cache.set(key, { value, expiresAt: Date.now() + CACHE_TTL_MS });
			pruneCache();
			return value;
		})
		.finally(() => {
			inflight.delete(key);
		});

	inflight.set(key, promise);
	return promise;
}

type QueryParams = Record<string, string | number | boolean | undefined>;

async function request<T>(path: string, params: QueryParams): Promise<T | null> {
	const url = new URL(`${CMS_URL}/api/${path}`);

	for (const [key, value] of Object.entries(params)) {
		if (value !== undefined && value !== '') {
			url.searchParams.set(key, String(value));
		}
	}

	const headers: Record<string, string> = { Accept: 'application/json' };
	if (CMS_API_TOKEN) headers.Authorization = `Bearer ${CMS_API_TOKEN}`;

	try {
		const response = await fetch(url, {
			headers,
			signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
		});

		if (!response.ok) {
			console.warn(`[cms] ${response.status} ${response.statusText} on ${url.pathname}`);
			return null;
		}

		return (await response.json()) as T;
	} catch (error) {
		const reason = error instanceof Error ? error.message : 'unknown error';
		console.warn(`[cms] request failed (${url.pathname}): ${reason}`);
		return null;
	}
}

function mediaUrl(media?: CmsMedia | null): string | undefined {
	if (!media?.url) return undefined;
	return media.url.startsWith('http') ? media.url : `${CMS_PUBLIC_URL}${media.url}`;
}

function normalizeService(raw: RawService): ServiceContent {
	return {
		slug: raw.slug,
		name: raw.name,
		shortDescription: raw.shortDescription ?? '',
		description: raw.description ?? undefined,
		icon: raw.icon,
		image: mediaUrl(raw.image),
		steps: (raw.steps ?? []).map((step) => ({ title: step.title, description: step.description ?? undefined })),
		benefits: (raw.benefits ?? []).map((benefit) => benefit.text),
		featured: raw.featured ?? true,
		order: raw.order ?? 0,
		seoTitle: raw.seoTitle ?? undefined,
		seoDescription: raw.seoDescription ?? undefined,
	};
}

function normalizeProject(raw: RawProject): ProjectContent {
	return {
		slug: raw.slug,
		title: raw.title,
		description: raw.description ?? undefined,
		category: raw.category,
		cover: mediaUrl(raw.cover),
		featured: raw.featured ?? false,
		order: raw.order ?? 0,
	};
}

function normalizeBeforeAfter(raw: RawBeforeAfter, index: number): BeforeAfterContent {
	const aspectRatio = Number(raw.aspectRatio);

	return {
		id: raw.documentId ?? String(index + 1),
		title: raw.title,
		category: raw.category ?? 'autre',
		before: mediaUrl(raw.beforeImage) ?? '',
		after: mediaUrl(raw.afterImage) ?? '',
		beforeVideo: mediaUrl(raw.beforeVideo),
		afterVideo: mediaUrl(raw.afterVideo),
		aspectRatio: Number.isFinite(aspectRatio) && aspectRatio > 0 ? aspectRatio : 1,
		order: raw.order ?? index,
	};
}

function normalizeTestimonial(raw: RawTestimonial, index: number): TestimonialContent {
	return {
		id: raw.documentId ?? String(index + 1),
		text: raw.text,
		author: raw.author,
		rating: raw.rating ?? 5,
		dateLabel: raw.dateLabel ?? '',
		source: raw.source ?? 'Google',
		featured: raw.featured ?? true,
		order: raw.order ?? index,
	};
}

async function collection<T>(path: string, lang: Lang, params: QueryParams = {}): Promise<T[]> {
	return cached(`collection:${path}:${lang}:${JSON.stringify(params)}`, async () => {
		const query: QueryParams = {
			locale: lang,
			populate: '*',
			'pagination[pageSize]': 100,
			sort: 'order:asc',
			...params,
		};

		const result = await request<{ data: T[] }>(path, query);
		if (result?.data?.length) return result.data;

		if (lang !== DEFAULT_LANG) {
			const fallback = await request<{ data: T[] }>(path, { ...query, locale: DEFAULT_LANG });
			return fallback?.data ?? [];
		}

		return [];
	});
}

async function single<T>(path: string, lang: Lang): Promise<T | null> {
	return cached(`single:${path}:${lang}`, async () => {
		const result = await request<{ data: T }>(path, { locale: lang, populate: '*' });
		if (result?.data) return result.data;

		if (lang !== DEFAULT_LANG) {
			const fallback = await request<{ data: T }>(path, { locale: DEFAULT_LANG, populate: '*' });
			return fallback?.data ?? null;
		}

		return null;
	});
}

export async function getServices(lang: Lang): Promise<ServiceContent[]> {
	const raw = await collection<RawService>('services', lang, { 'filters[featured][$eq]': true });
	return raw.map(normalizeService).sort((a, b) => a.order - b.order);
}

export async function getAllServices(lang: Lang): Promise<ServiceContent[]> {
	const raw = await collection<RawService>('services', lang);
	return raw.map(normalizeService).sort((a, b) => a.order - b.order);
}

export async function getService(lang: Lang, slug: string): Promise<ServiceContent | null> {
	const raw = await collection<RawService>('services', lang, {
		'filters[slug][$eq]': slug,
		'pagination[pageSize]': 1,
	});
	const first = raw[0];
	return first ? normalizeService(first) : null;
}

export async function getProjects(lang: Lang, options: { featured?: boolean } = {}): Promise<ProjectContent[]> {
	const params: QueryParams = {};
	if (options.featured) params['filters[featured][$eq]'] = true;

	const raw = await collection<RawProject>('projects', lang, params);
	return raw.map(normalizeProject).sort((a, b) => a.order - b.order);
}

export async function getBeforeAfter(lang: Lang): Promise<BeforeAfterContent[]> {
	const raw = await collection<RawBeforeAfter>('before-afters', lang);
	return raw
		.map(normalizeBeforeAfter)
		.filter((item) => (item.before && item.after) || item.beforeVideo || item.afterVideo)
		.sort((a, b) => a.order - b.order);
}

export async function getTestimonials(lang: Lang): Promise<TestimonialContent[]> {
	const raw = await collection<RawTestimonial>('testimonials', lang, { 'filters[featured][$eq]': true });
	return raw.map(normalizeTestimonial).sort((a, b) => a.order - b.order);
}

export async function getSiteSettings(lang: Lang): Promise<SiteSettingsContent | null> {
	const raw = await single<RawSiteSettings>('site-setting', lang);
	if (!raw) return null;

	const rating = Number(raw.googleRating);

	return {
		companyName: raw.companyName ?? 'D.E.B TOUT CORPS',
		tagline: raw.tagline ?? '',
		description: raw.description ?? '',
		phone: raw.phone ?? '',
		email: raw.email ?? '',
		whatsapp: raw.whatsapp ?? '',
		address: raw.address ?? '',
		hours: raw.hours ?? '',
		googleMapsUrl: raw.googleMapsUrl ?? '',
		googleRating: Number.isFinite(rating) ? rating : 5,
		googleReviewCount: raw.googleReviewCount ?? 0,
		logo: mediaUrl(raw.logo),
		ogImage: mediaUrl(raw.ogImage),
		socialLinks: raw.socialLinks ?? [],
		seoTitle: raw.seoTitle ?? undefined,
		seoDescription: raw.seoDescription ?? undefined,
	};
}

export async function getHomePage(lang: Lang): Promise<HomeContent | null> {
	const raw = await single<RawHomePage>('home-page', lang);
	if (!raw) return null;

	return {
		heroEyebrow: raw.heroEyebrow ?? undefined,
		heroTitleLine1: raw.heroTitleLine1 ?? undefined,
		heroTitleLine2: raw.heroTitleLine2 ?? undefined,
		heroTitleHighlight: raw.heroTitleHighlight ?? undefined,
		heroSubtitle: raw.heroSubtitle ?? undefined,
		heroImage: mediaUrl(raw.heroImage),
		heroPrimaryLabel: raw.heroPrimaryLabel ?? undefined,
		heroSecondaryLabel: raw.heroSecondaryLabel ?? undefined,
		stats: raw.stats,
		valueTitle: raw.valueTitle ?? undefined,
		valueDescription: raw.valueDescription ?? undefined,
		valueCards: raw.valueCards,
		servicesTitle: raw.servicesTitle ?? undefined,
		servicesDescription: raw.servicesDescription ?? undefined,
		projectsTitle: raw.projectsTitle ?? undefined,
		projectsDescription: raw.projectsDescription ?? undefined,
		beforeAfterTitle: raw.beforeAfterTitle ?? undefined,
		beforeAfterDescription: raw.beforeAfterDescription ?? undefined,
		whyUsTitle: raw.whyUsTitle ?? undefined,
		whyUsDescription: raw.whyUsDescription ?? undefined,
		whyUsPoints: raw.whyUsPoints?.map((point) => point.text),
		processTitle: raw.processTitle ?? undefined,
		processSteps: raw.processSteps,
		testimonialsTitle: raw.testimonialsTitle ?? undefined,
		testimonialsDescription: raw.testimonialsDescription ?? undefined,
		ctaTitle: raw.ctaTitle ?? undefined,
		ctaDescription: raw.ctaDescription ?? undefined,
		ctaButtonLabel: raw.ctaButtonLabel ?? undefined,
		seoTitle: raw.seoTitle ?? undefined,
		seoDescription: raw.seoDescription ?? undefined,
	};
}
