import fs from 'node:fs';
import path from 'node:path';
import type { Core } from '@strapi/strapi';
import {
	beforeAfterProjects,
	homePage,
	projects,
	services,
	siteSettings,
	testimonials,
} from './data';

const MIME_TYPES: Record<string, string> = {
	'.webp': 'image/webp',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.webm': 'video/webm',
	'.mp4': 'video/mp4',
};

type Strapi = Core.Strapi;

function log(message: string) {
	console.log(`[seed] ${message}`);
}

async function uploadAsset(strapi: Strapi, relativePath: string, alternativeText: string): Promise<number | undefined> {
	const assetsDir = process.env.SEED_ASSETS_DIR;
	if (!assetsDir) return undefined;

	const fullPath = path.join(assetsDir, relativePath);
	if (!fs.existsSync(fullPath)) {
		log(`asset not found, skipping: ${relativePath}`);
		return undefined;
	}

	try {
		const stat = fs.statSync(fullPath);
		const name = path.basename(relativePath);
		const type = MIME_TYPES[path.extname(name).toLowerCase()] ?? 'application/octet-stream';
		const uploaded = await strapi.plugin('upload').service('upload').upload({
			data: { fileInfo: { name, alternativeText } },
			files: {
				filepath: fullPath,
				originalFilename: name,
				mimetype: type,
				size: stat.size,
			},
		});
		const file = Array.isArray(uploaded) ? uploaded[0] : uploaded;
		return file?.id;
	} catch (error) {
		log(`could not upload ${relativePath}: ${(error as Error).message}`);
		return undefined;
	}
}

interface DocumentApi {
	findFirst: (params: Record<string, unknown>) => Promise<{ documentId: string } | null>;
	create: (params: Record<string, unknown>) => Promise<{ documentId: string }>;
	update: (params: Record<string, unknown>) => Promise<unknown>;
	publish: (params: Record<string, unknown>) => Promise<unknown>;
}

function documentApi(strapi: Strapi, uid: string): DocumentApi {
	return strapi.documents(uid as never) as unknown as DocumentApi;
}

async function publishBothLocales(documents: DocumentApi, documentId: string) {
	await documents.publish({ documentId, locale: 'fr' });
	await documents.publish({ documentId, locale: 'es' });
}

/**
 * Creates the French entry with all fields, then creates the Spanish
 * localization through `update()`. All translated fields are explicitly
 * marked with `i18n.localized: true` in their schema, otherwise Strapi
 * treats them as shared and syncs them across locales.
 *
 * Do not pass `status: 'published'` to `update()` here: in Strapi 5 that
 * republishes every locale of the document and mixes their content. Publish
 * each locale explicitly afterwards.
 */
async function createLocalizedEntry(
	strapi: Strapi,
	uid: string,
	slug: string,
	frData: Record<string, unknown>,
	esData: Record<string, unknown>
) {
	const documents = documentApi(strapi, uid);

	const existing = await documents.findFirst({ filters: { slug }, locale: 'fr' });
	if (existing) return;

	const created = await documents.create({ data: frData, locale: 'fr' });
	await documents.update({ documentId: created.documentId, locale: 'es', data: esData });
	await publishBothLocales(documents, created.documentId);
}

async function seedServices(strapi: Strapi) {
	for (const service of services) {
		const imageId = await uploadAsset(strapi, `images/services/${service.slug}.webp`, service.name.fr);

		const buildData = (locale: 'fr' | 'es') => ({
			slug: service.slug,
			icon: service.icon,
			featured: service.featured,
			order: service.order,
			...(imageId ? { image: imageId } : {}),
			name: service.name[locale],
			shortDescription: service.shortDescription[locale],
			steps: service.steps[locale].map((title) => ({ title })),
			benefits: service.benefits[locale].map((text) => ({ text })),
		});

		await createLocalizedEntry(
			strapi,
			'api::service.service',
			service.slug,
			buildData('fr'),
			buildData('es')
		);
	}
	log('services ready');
}

async function seedProjects(strapi: Strapi) {
	for (const project of projects) {
		const coverId = await uploadAsset(strapi, project.asset, project.title.fr);

		const buildData = (locale: 'fr' | 'es') => ({
			slug: project.slug,
			category: project.category,
			featured: project.featured,
			order: project.order,
			...(coverId ? { cover: coverId } : {}),
			title: project.title[locale],
		});

		await createLocalizedEntry(
			strapi,
			'api::project.project',
			project.slug,
			buildData('fr'),
			buildData('es')
		);
	}
	log('projects ready');
}

async function seedBeforeAfter(strapi: Strapi) {
	for (const project of beforeAfterProjects) {
		const beforeId = await uploadAsset(strapi, project.before, `${project.title.fr} — avant`);
		const afterId = await uploadAsset(strapi, project.after, `${project.title.fr} — après`);

		const beforeVideoId = project.beforeVideo
			? await uploadAsset(strapi, project.beforeVideo, `${project.title.fr} — vidéo avant`)
			: undefined;
		const afterVideoId = project.afterVideo
			? await uploadAsset(strapi, project.afterVideo, `${project.title.fr} — vidéo après`)
			: undefined;

		if ((!beforeId || !afterId) && (!beforeVideoId || !afterVideoId)) {
			log(`before/after #${project.order} skipped: missing images and videos`);
			continue;
		}

		const buildData = (locale: 'fr' | 'es') => ({
			category: project.category,
			aspectRatio: project.aspectRatio,
			order: project.order,
			...(beforeId ? { beforeImage: beforeId } : {}),
			...(afterId ? { afterImage: afterId } : {}),
			...(beforeVideoId ? { beforeVideo: beforeVideoId } : {}),
			...(afterVideoId ? { afterVideo: afterVideoId } : {}),
			title: project.title[locale],
		});

		const documents = documentApi(strapi, 'api::before-after.before-after');
		const existing = await documents.findFirst({ filters: { order: project.order }, locale: 'fr' });
		if (existing) continue;

		const created = await documents.create({ data: buildData('fr'), locale: 'fr' });
		await documents.update({ documentId: created.documentId, locale: 'es', data: buildData('es') });
		await publishBothLocales(documents, created.documentId);
	}
	log('before/after ready');
}

async function seedTestimonials(strapi: Strapi) {
	for (const testimonial of testimonials) {
		const buildData = (locale: 'fr' | 'es') => ({
			rating: testimonial.rating,
			source: 'Google',
			featured: true,
			order: testimonial.order,
			text: testimonial[locale].text,
			author: testimonial[locale].author,
			dateLabel: testimonial[locale].dateLabel,
		});

		const documents = documentApi(strapi, 'api::testimonial.testimonial');
		const existing = await documents.findFirst({ filters: { order: testimonial.order }, locale: 'fr' });
		if (existing) continue;

		const created = await documents.create({ data: buildData('fr'), locale: 'fr' });
		await documents.update({ documentId: created.documentId, locale: 'es', data: buildData('es') });
		await publishBothLocales(documents, created.documentId);
	}
	log('testimonials ready');
}

async function seedSingleType(
	strapi: Strapi,
	uid: string,
	frData: Record<string, unknown>,
	esData: Record<string, unknown>
) {
	const documents = documentApi(strapi, uid);

	const existing = await documents.findFirst({ locale: 'fr' });
	if (existing) return;

	const created = await documents.create({ data: frData, locale: 'fr' });
	await documents.update({ documentId: created.documentId, locale: 'es', data: esData });
	await publishBothLocales(documents, created.documentId);
}

async function seedSiteSettings(strapi: Strapi) {
	const logoId = await uploadAsset(strapi, siteSettings.logoAsset, 'Logo D.E.B TOUT CORPS');
	const ogImageId = await uploadAsset(strapi, siteSettings.ogImageAsset, 'D.E.B TOUT CORPS');

	const buildData = (locale: 'fr' | 'es') => ({
		googleRating: siteSettings.googleRating,
		googleReviewCount: siteSettings.googleReviewCount,
		socialLinks: siteSettings.socialLinks,
		...(logoId ? { logo: logoId } : {}),
		...(ogImageId ? { ogImage: ogImageId } : {}),
		companyName: siteSettings[locale].companyName,
		tagline: siteSettings[locale].tagline,
		description: siteSettings[locale].description,
		phone: siteSettings[locale].phone,
		email: siteSettings[locale].email,
		whatsapp: siteSettings[locale].whatsapp,
		address: siteSettings[locale].address,
		hours: siteSettings[locale].hours,
		googleMapsUrl: siteSettings[locale].googleMapsUrl,
		seoTitle: siteSettings[locale].seoTitle,
		seoDescription: siteSettings[locale].seoDescription,
	});

	await seedSingleType(
		strapi,
		'api::site-setting.site-setting',
		buildData('fr'),
		buildData('es')
	);
	log('site settings ready');
}

async function seedHomePage(strapi: Strapi) {
	const heroImageId = await uploadAsset(strapi, 'images/hero-image.png', 'D.E.B TOUT CORPS — rénovation');

	const buildData = (locale: 'fr' | 'es') => {
		const content = homePage[locale];
		return {
			...(heroImageId ? { heroImage: heroImageId } : {}),
			heroEyebrow: content.heroEyebrow,
			heroTitleLine1: content.heroTitleLine1,
			heroTitleLine2: content.heroTitleLine2,
			heroTitleHighlight: content.heroTitleHighlight,
			heroSubtitle: content.heroSubtitle,
			heroPrimaryLabel: content.heroPrimaryLabel,
			heroSecondaryLabel: content.heroSecondaryLabel,
			stats: content.stats,
			valueTitle: content.valueTitle,
			valueDescription: content.valueDescription,
			valueCards: content.valueCards,
			servicesTitle: content.servicesTitle,
			servicesDescription: content.servicesDescription,
			projectsTitle: content.projectsTitle,
			projectsDescription: content.projectsDescription,
			beforeAfterTitle: content.beforeAfterTitle,
			beforeAfterDescription: content.beforeAfterDescription,
			whyUsTitle: content.whyUsTitle,
			whyUsDescription: content.whyUsDescription,
			whyUsPoints: content.whyUsPoints.map((text) => ({ text })),
			processTitle: content.processTitle,
			processSteps: content.processSteps,
			testimonialsTitle: content.testimonialsTitle,
			testimonialsDescription: content.testimonialsDescription,
			ctaTitle: content.ctaTitle,
			ctaDescription: content.ctaDescription,
			ctaButtonLabel: content.ctaButtonLabel,
			seoTitle: content.seoTitle,
			seoDescription: content.seoDescription,
		};
	};

	await seedSingleType(strapi, 'api::home-page.home-page', buildData('fr'), buildData('es'));
	log('home page ready');
}

async function ensureLocales(strapi: Strapi) {
	try {
		const locales = strapi.plugin('i18n').service('locales');
		const existing = await locales.find();
		const wanted = [
			{ code: 'fr', name: 'Français (fr)' },
			{ code: 'es', name: 'Español (es)' },
		];

		for (const locale of wanted) {
			if (!existing.some((item: { code: string }) => item.code === locale.code)) {
				await locales.create(locale);
			}
		}

		const refreshed = await locales.find();
		const french = refreshed.find((item: { code: string }) => item.code === 'fr');
		if (french && !french.isDefault) {
			await locales.setDefaultLocale({ code: 'fr' });
		}

		// Keep the admin simple: only FR/ES. Remove the empty default English
		// locale if no content was ever created in it.
		const english = refreshed.find((item: { code: string }) => item.code === 'en');
		if (english && !english.isDefault) {
			const localizedUids = [
				'api::service.service',
				'api::project.project',
				'api::before-after.before-after',
				'api::testimonial.testimonial',
				'api::site-setting.site-setting',
				'api::home-page.home-page',
			];
			let hasEnglishContent = false;
			for (const uid of localizedUids) {
				const count = await strapi.db.query(uid as never).count({
					where: { locale: 'en' },
				});
				if (count > 0) {
					hasEnglishContent = true;
					break;
				}
			}
			if (!hasEnglishContent) {
				await locales.delete({ id: english.id });
			}
		}
	} catch (error) {
		log(`could not configure locales: ${(error as Error).message}`);
	}
}

export async function seedContent(strapi: Strapi) {
	log('starting content seed');
	await ensureLocales(strapi);
	await seedServices(strapi);
	await seedProjects(strapi);
	await seedBeforeAfter(strapi);
	await seedTestimonials(strapi);
	await seedSiteSettings(strapi);
	await seedHomePage(strapi);
	log('done');
}

const PUBLIC_APIS = ['service', 'project', 'before-after', 'testimonial', 'site-setting', 'home-page'];

export async function grantPublicReadPermissions(strapi: Strapi) {
	const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({
		where: { type: 'public' },
	});

	if (!publicRole) return;

	for (const api of PUBLIC_APIS) {
		const actions = api === 'site-setting' || api === 'home-page' ? ['find'] : ['find', 'findOne'];

		for (const action of actions) {
			const actionId = `api::${api}.${api}.${action}`;
			try {
				const existing = await strapi.db.query('plugin::users-permissions.permission').findOne({
					where: { action: actionId, role: publicRole.id },
				});
				if (!existing) {
					await strapi.db.query('plugin::users-permissions.permission').create({
						data: { action: actionId, role: publicRole.id },
					});
				}
			} catch (error) {
				log(`could not grant ${actionId}: ${(error as Error).message}`);
			}
		}
	}
}
