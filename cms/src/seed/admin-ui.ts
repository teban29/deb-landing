import type { Core } from '@strapi/strapi';

type Strapi = Core.Strapi;

const EDITOR_ROLE_NAME = 'Editor de contenido';

const CONTENT_TYPE_UIDS = [
	'api::service.service',
	'api::project.project',
	'api::before-after.before-after',
	'api::testimonial.testimonial',
	'api::site-setting.site-setting',
	'api::home-page.home-page',
];

const CONTENT_MANAGER_ACTIONS = ['create', 'read', 'update'];
const PUBLISH_LOCALES = ['fr', 'es'];

// Single types (home page, business settings) are editable but not deletable:
// removing them would leave the site without global content.
const DELETABLE_UIDS = new Set([
	'api::service.service',
	'api::project.project',
	'api::before-after.before-after',
	'api::testimonial.testimonial',
]);

const MEDIA_ACTIONS = [
	'plugin::upload.read',
	'plugin::upload.assets.copy-link',
	'plugin::upload.assets.create',
	'plugin::upload.assets.update',
	'plugin::upload.assets.download',
	'plugin::upload.configure-view',
];
// Note: Strapi 5 deletes media files through `plugin::upload.assets.update`
// (see the DELETE /upload/files/:id route), so no separate delete action exists.

interface FieldLabel {
	label: string;
	description?: string;
	placeholder?: string;
}

const CONTENT_TYPE_LABELS: Record<string, Record<string, FieldLabel>> = {
	'api::service.service': {
		slug: {
			label: 'Identificador para la URL',
			description: 'Se genera automáticamente. No lo cambies si el servicio ya está publicado.',
		},
		name: { label: 'Nombre del servicio', placeholder: 'Ej.: Electricidad' },
		shortDescription: {
			label: 'Descripción corta',
			description: 'Aparece en las tarjetas de inicio y de servicios.',
		},
		description: {
			label: 'Descripción completa',
			description: 'Texto largo que se muestra en la página del servicio.',
		},
		icon: { label: 'Icono', description: 'Elige el icono que mejor represente el servicio.' },
		image: { label: 'Imagen del servicio' },
		steps: { label: 'Pasos del proceso', description: 'Pasos que se muestran en la página del servicio.' },
		benefits: { label: 'Ventajas', description: 'Puntos fuertes o garantías del servicio.' },
		featured: { label: 'Destacado en la página de inicio' },
		order: { label: 'Orden', description: 'Un número menor aparece antes.' },
		seoTitle: { label: 'Título para buscadores (SEO)' },
		seoDescription: { label: 'Descripción para buscadores (SEO)' },
	},
	'api::project.project': {
		title: { label: 'Título del proyecto', placeholder: 'Ej.: Salón contemporáneo' },
		slug: { label: 'Identificador para la URL' },
		description: { label: 'Descripción del proyecto' },
		category: { label: 'Categoría', description: 'Servicio al que pertenece este proyecto.' },
		cover: { label: 'Imagen de portada' },
		gallery: { label: 'Galería de imágenes' },
		featured: { label: 'Destacado en la página de inicio' },
		order: { label: 'Orden', description: 'Un número menor aparece antes.' },
	},
	'api::before-after.before-after': {
		title: { label: 'Título de la comparación', placeholder: 'Ej.: Salón tras reforma integral' },
		category: { label: 'Categoría' },
		beforeImage: { label: 'Imagen del antes' },
		afterImage: { label: 'Imagen del después' },
		beforeVideo: { label: 'Vídeo del antes', description: 'Opcional. Si lo añades, se usa en lugar de la imagen.' },
		afterVideo: { label: 'Vídeo del después', description: 'Opcional. Si lo añades, se usa en lugar de la imagen.' },
		aspectRatio: {
			label: 'Proporción de la imagen',
			description: 'Valor numérico. Déjalo en 1 si no estás seguro.',
		},
		order: { label: 'Orden', description: 'Un número menor aparece antes.' },
	},
	'api::testimonial.testimonial': {
		text: { label: 'Texto del testimonio' },
		author: { label: 'Nombre del cliente', placeholder: 'Ej.: María y Pedro D.' },
		rating: { label: 'Valoración (1 a 5)' },
		dateLabel: { label: 'Fecha relativa', description: 'Ej.: hace 2 semanas', placeholder: 'hace 2 semanas' },
		source: { label: 'Fuente de la reseña' },
		featured: { label: 'Mostrar en la página de inicio' },
		order: { label: 'Orden', description: 'Un número menor aparece antes.' },
	},
	'api::site-setting.site-setting': {
		companyName: { label: 'Nombre de la empresa' },
		tagline: { label: 'Eslogan' },
		description: { label: 'Descripción de la empresa', description: 'Se usa en el pie de página y en los datos estructurados.' },
		phone: { label: 'Teléfono', placeholder: '+33 07 67 59 75 08' },
		email: { label: 'Correo electrónico' },
		whatsapp: {
			label: 'Número de WhatsApp',
			description: 'Número internacional sin + ni espacios. Ejemplo: 330767597508',
			placeholder: '330767597508',
		},
		address: { label: 'Dirección' },
		hours: { label: 'Horario de atención' },
		googleMapsUrl: { label: 'Enlace de Google Maps' },
		googleRating: { label: 'Valoración de Google', description: 'Del 1 al 5.' },
		googleReviewCount: { label: 'Número de reseñas de Google' },
		logo: { label: 'Logo de la empresa' },
		ogImage: {
			label: 'Imagen para compartir',
			description: 'Imagen que aparece al compartir el sitio en redes sociales.',
		},
		socialLinks: { label: 'Redes sociales' },
		seoTitle: { label: 'Título para buscadores (SEO)' },
		seoDescription: { label: 'Descripción para buscadores (SEO)' },
	},
	'api::home-page.home-page': {
		heroEyebrow: { label: 'Texto superior del hero', placeholder: 'Empresa de Construcción' },
		heroTitleLine1: { label: 'Título principal: línea 1' },
		heroTitleLine2: { label: 'Título principal: línea 2' },
		heroTitleHighlight: { label: 'Título principal: línea destacada' },
		heroSubtitle: { label: 'Subtítulo del hero' },
		heroImage: { label: 'Imagen de fondo del hero' },
		heroPrimaryLabel: { label: 'Texto del botón principal' },
		heroSecondaryLabel: { label: 'Texto del botón secundario' },
		stats: { label: 'Estadísticas destacadas' },
		valueTitle: { label: 'Título de "Por qué elegirnos"' },
		valueDescription: { label: 'Descripción de "Por qué elegirnos"' },
		valueCards: { label: 'Tarjetas de valores' },
		servicesTitle: { label: 'Título de la sección de servicios' },
		servicesDescription: { label: 'Descripción de la sección de servicios' },
		projectsTitle: { label: 'Título de la sección de proyectos' },
		projectsDescription: { label: 'Descripción de la sección de proyectos' },
		beforeAfterTitle: { label: 'Título de la sección antes/después' },
		beforeAfterDescription: { label: 'Descripción de la sección antes/después' },
		whyUsTitle: { label: 'Título de "Nuestro compromiso"' },
		whyUsDescription: { label: 'Descripción de "Nuestro compromiso"' },
		whyUsPoints: { label: 'Puntos de compromiso' },
		processTitle: { label: 'Título del proceso' },
		processSteps: { label: 'Pasos del proceso' },
		testimonialsTitle: { label: 'Título de testimonios' },
		testimonialsDescription: { label: 'Descripción de testimonios' },
		ctaTitle: { label: 'Título del bloque final (CTA)' },
		ctaDescription: { label: 'Descripción del bloque final (CTA)' },
		ctaButtonLabel: { label: 'Texto del botón del bloque final' },
		seoTitle: { label: 'Título para buscadores (SEO)' },
		seoDescription: { label: 'Descripción para buscadores (SEO)' },
	},
};

const COMPONENT_LABELS: Record<string, Record<string, FieldLabel>> = {
	'shared.step': {
		title: { label: 'Título del paso' },
		description: { label: 'Descripción del paso' },
	},
	'shared.text-item': {
		text: { label: 'Texto' },
	},
	'shared.stat': {
		value: { label: 'Valor', placeholder: '15+' },
		label: { label: 'Etiqueta', placeholder: 'Años' },
		sublabel: { label: 'Detalle', placeholder: 'de experiencia' },
	},
	'shared.card': {
		title: { label: 'Título de la tarjeta' },
		description: { label: 'Descripción de la tarjeta' },
	},
	'shared.social-link': {
		platform: { label: 'Red social' },
		url: { label: 'Enlace' },
	},
};

function getPermissionFields(strapi: Strapi, uid: string): string[] {
	const schema = strapi.contentType(uid as never) as unknown as {
		attributes: Record<string, { type: string; component?: string }>;
	};
	const fields: string[] = [];

	for (const [name, attribute] of Object.entries(schema.attributes)) {
		if (attribute.type === 'component' && attribute.component) {
			const component = strapi.components[
				attribute.component as keyof typeof strapi.components
			] as unknown as { attributes: Record<string, unknown> } | undefined;
			if (!component) continue;
			for (const subField of Object.keys(component.attributes)) {
				fields.push(`${name}.${subField}`);
			}
		} else {
			fields.push(name);
		}
	}

	return fields;
}

async function ensureEditorRole(strapi: Strapi) {
	const existing = await strapi.db.query('admin::role').findOne({
		where: { name: EDITOR_ROLE_NAME },
	});

	if (existing) {
		const permissionCount = await strapi.db.query('admin::permission').count({
			where: { role: { id: existing.id } },
		});
		if (permissionCount > 0) return;
	}

	const role =
		existing ??
		(await strapi.admin.services.role.create({
			name: EDITOR_ROLE_NAME,
			description:
				'Puede administrar el contenido del sitio y la biblioteca de medios, sin acceso a la configuración técnica.',
		}));

	const permissions: Record<string, unknown>[] = [];

	for (const uid of CONTENT_TYPE_UIDS) {
		const allFields = getPermissionFields(strapi, uid);
		const editableFields = allFields.filter((field) => field !== 'slug');

		for (const action of CONTENT_MANAGER_ACTIONS) {
			permissions.push({
				action: `plugin::content-manager.explorer.${action}`,
				subject: uid,
				properties: { fields: action === 'update' ? editableFields : allFields },
				conditions: [],
			});
		}

		permissions.push({
			action: 'plugin::content-manager.explorer.publish',
			subject: uid,
			properties: { locales: PUBLISH_LOCALES },
			conditions: [],
		});

		if (DELETABLE_UIDS.has(uid)) {
			permissions.push({
				action: 'plugin::content-manager.explorer.delete',
				subject: uid,
				properties: { locales: PUBLISH_LOCALES },
				conditions: [],
			});
		}
	}

	for (const action of MEDIA_ACTIONS) {
		permissions.push({ action, subject: null, properties: {}, conditions: [] });
	}

	permissions.push({
		action: 'plugin::i18n.locale.read',
		subject: null,
		properties: {},
		conditions: [],
	});

	try {
		await strapi.admin.services.role.assignPermissions(role.id, permissions);
		strapi.log.info(`[admin] role "${EDITOR_ROLE_NAME}" configured`);
	} catch (error) {
		strapi.log.error(
			`[admin] could not configure role "${EDITOR_ROLE_NAME}": ${(error as Error).message}`
		);
	}
}

async function applyLabels(
	strapi: Strapi,
	key: string,
	labels: Record<string, FieldLabel>
) {
	const store = strapi.db.query('strapi::core-store');
	const row = await store.findOne({ where: { key } });
	if (!row) return;

	const config = JSON.parse(row.value as string) as {
		metadatas?: Record<string, { edit?: Record<string, unknown>; list?: Record<string, unknown> }>;
	};

	let changed = false;

	for (const [field, meta] of Object.entries(labels)) {
		const metadata = config.metadatas?.[field];
		if (!metadata) continue;

		metadata.edit = {
			...metadata.edit,
			label: meta.label,
			description: meta.description ?? '',
			placeholder: meta.placeholder ?? '',
		};
		metadata.list = {
			...metadata.list,
			label: meta.label,
		};
		changed = true;
	}

	if (changed) {
		await store.update({
			where: { id: row.id },
			data: { value: JSON.stringify(config) },
		});
	}
}

export async function configureAdmin(strapi: Strapi) {
	await ensureEditorRole(strapi);

	for (const [uid, labels] of Object.entries(CONTENT_TYPE_LABELS)) {
		await applyLabels(strapi, `plugin_content_manager_configuration_content_types::${uid}`, labels);
	}

	for (const [uid, labels] of Object.entries(COMPONENT_LABELS)) {
		await applyLabels(strapi, `plugin_content_manager_configuration_components::${uid}`, labels);
	}
}
