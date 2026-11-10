export interface GalleryProject {
	slug: string;
	category: string;
	title: { fr: string; es: string };
	image: string;
	featured?: boolean;
}

export const galleryProjects: GalleryProject[] = [
	{ slug: 'salon-contemporaneo', category: 'peinture', title: { fr: 'Salon contemporain', es: 'Salón contemporáneo' }, image: '/images/gallery/salon-contemporaneo.webp', featured: true },
	{ slug: 'escaleras-residenciales', category: 'parquet', title: { fr: 'Escalier résidentiel', es: 'Escalera residencial' }, image: '/images/gallery/escaleras-residenciales.webp', featured: true },
	{ slug: 'bano-marmol', category: 'plomberie', title: { fr: 'Salle de bain marbre', es: 'Baño mármol' }, image: '/images/gallery/bano-marmol.webp', featured: true },
	{ slug: 'molduras-contemporaneas', category: 'peinture', title: { fr: 'Moulures contemporaines', es: 'Molduras contemporáneas' }, image: '/images/gallery/molduras-contemporaneas.webp', featured: true },
	{ slug: 'parquet-madera', category: 'parquet', title: { fr: 'Parquet bois massif', es: 'Parquet madera' }, image: '/images/gallery/parquet-madera.webp' },
	{ slug: 'pasillo-molduras', category: 'peinture', title: { fr: 'Couloir avec moulures', es: 'Pasillo con molduras' }, image: '/images/gallery/pasillo-molduras.webp' },
	{ slug: 'renovacion-portal', category: 'carrelage', title: { fr: "Rénovation d'entrée", es: 'Renovación portal' }, image: '/images/gallery/renovacion-portal.webp' },
	{ slug: 'escaleras-ventanas', category: 'peinture', title: { fr: 'Escalier et fenêtres', es: 'Escalera y ventanas' }, image: '/images/gallery/escaleras-ventanas.webp' },
	{ slug: 'salon-profesional', category: 'peinture', title: { fr: 'Salon professionnel', es: 'Salón profesional' }, image: '/images/gallery/salon-profesional.webp' },
	{ slug: 'salon-senorial', category: 'peinture', title: { fr: 'Salon seigneurial', es: 'Salón señorial' }, image: '/images/gallery/salon-senorial.webp' },
	{ slug: 'puerta-integrada', category: 'peinture', title: { fr: 'Porte intégrée vert olive', es: 'Puerta integrada verde oliva' }, image: '/images/gallery/puerta-integrada.webp' },
	{ slug: 'dormitorio', category: 'peinture', title: { fr: 'Chambre rénovée', es: 'Dormitorio renovado' }, image: '/images/gallery/dormitorio.webp' },
	{ slug: 'cocina-minimalista', category: 'peinture', title: { fr: 'Cuisine minimaliste', es: 'Cocina minimalista' }, image: '/images/gallery/cocina-minimalista.webp' },
];

export function localizeGalleryProjects(lang: 'fr' | 'es') {
	return galleryProjects.map((project) => ({
		slug: project.slug,
		category: project.category,
		title: project.title[lang],
		image: project.image,
		featured: project.featured ?? false,
	}));
}
