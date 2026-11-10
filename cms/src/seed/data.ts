export interface LocalizedText {
	fr: string;
	es: string;
}

export interface SeedService {
	slug: string;
	icon: 'electricite' | 'plomberie' | 'carrelage' | 'parquet' | 'peinture' | 'poncage';
	order: number;
	featured: boolean;
	name: LocalizedText;
	shortDescription: LocalizedText;
	steps: { fr: string[]; es: string[] };
	benefits: { fr: string[]; es: string[] };
}

export const services: SeedService[] = [
	{
		slug: 'electricite',
		icon: 'electricite',
		order: 1,
		featured: true,
		name: { fr: 'Électricité', es: 'Electricidad' },
		shortDescription: {
			fr: 'Installation, mise aux normes et rénovation complète de votre système électrique.',
			es: 'Instalación, puesta a norma y renovación completa de su sistema eléctrico.',
		},
		steps: {
			fr: ['Diagnostic complet', 'Étude et devis', 'Installation aux normes', 'Tests et validation'],
			es: ['Diagnóstico completo', 'Estudio y presupuesto', 'Instalación según normativa', 'Pruebas y validación'],
		},
		benefits: {
			fr: ['Conformité NFC 15-100', 'Matériel certifié', 'Garantie décennale', 'Intervention urgente 24/7'],
			es: ['Conformidad NFC 15-100', 'Material certificado', 'Garantía decenal', 'Intervención urgente 24/7'],
		},
	},
	{
		slug: 'plomberie',
		icon: 'plomberie',
		order: 2,
		featured: true,
		name: { fr: 'Plomberie', es: 'Fontanería' },
		shortDescription: {
			fr: "Installation sanitaire, chauffage et résolution de tous problèmes d'étanchéité.",
			es: 'Instalación sanitaria, calefacción y resolución de problemas de estanqueidad.',
		},
		steps: {
			fr: ['Inspection complète', "Plan d'intervention", 'Travaux et remplacement', "Tests d'étanchéité"],
			es: ['Inspección completa', 'Plan de intervención', 'Obras y sustitución', 'Pruebas de estanqueidad'],
		},
		benefits: {
			fr: ['Installation normée', 'Matériel premium', 'Dépannage express', "Garantie pièces et main d'œuvre"],
			es: ['Instalación normativa', 'Material premium', 'Reparación exprés', 'Garantía de piezas y mano de obra'],
		},
	},
	{
		slug: 'carrelage',
		icon: 'carrelage',
		order: 3,
		featured: true,
		name: { fr: 'Carrelage', es: 'Alicatado' },
		shortDescription: {
			fr: 'Pose précise de carrelage intérieur et extérieur, tous formats et matériaux.',
			es: 'Colocación precisa de azulejos interior y exterior, todos los formatos y materiales.',
		},
		steps: {
			fr: ['Mesures précises', 'Préparation du support', 'Pose et coupe', 'Finition et jointoiement'],
			es: ['Mediciones precisas', 'Preparación del soporte', 'Colocación y corte', 'Acabado y rejuntado'],
		},
		benefits: {
			fr: ['Pose garantie 10 ans', 'Large choix de matériaux', 'Découpe sur mesure', 'Conseil design inclus'],
			es: ['Colocación garantizada 10 años', 'Amplia elección de materiales', 'Corte a medida', 'Asesoramiento de diseño incluido'],
		},
	},
	{
		slug: 'parquet',
		icon: 'parquet',
		order: 4,
		featured: true,
		name: { fr: 'Parquet', es: 'Parquet' },
		shortDescription: {
			fr: 'Pose, rénovation et vitrification de parquets pour un sol prestigieux.',
			es: 'Colocación, renovación y vitrificado de parquet para un suelo prestigioso.',
		},
		steps: {
			fr: ["Évaluation de l'existant", 'Préparation du support', 'Pose ou rénovation', 'Finition et vitrification'],
			es: ['Evaluación de lo existente', 'Preparación del soporte', 'Colocación o renovación', 'Acabado y vitrificado'],
		},
		benefits: {
			fr: ['Bois certifié PEFC', 'Pose flottante ou collée', 'Vitrification écologique', 'Entretien conseillé'],
			es: ['Madera certificada PEFC', 'Colocación flotante o encolada', 'Vitrificado ecológico', 'Mantenimiento recomendado'],
		},
	},
	{
		slug: 'peinture',
		icon: 'peinture',
		order: 5,
		featured: true,
		name: { fr: 'Peinture', es: 'Pintura' },
		shortDescription: {
			fr: 'Finitions impeccables, peinture intérieure et décorative sur tous supports.',
			es: 'Acabados impecables, pintura interior y decorativa sobre todos los soportes.',
		},
		steps: {
			fr: ['Préparation des surfaces', 'Protection et masquage', 'Application et finitions', 'Nettoyage et remise en état'],
			es: ['Preparación de superficies', 'Protección y enmascarado', 'Aplicación y acabados', 'Limpieza y puesta a punto'],
		},
		benefits: {
			fr: ['Peintures sans COV', 'Large gamme de couleurs', 'Finitions personnalisables', 'Garantie anti-écaillage'],
			es: ['Pinturas sin COV', 'Amplia gama de colores', 'Acabados personalizables', 'Garantía anti-descamado'],
		},
	},
	{
		slug: 'poncage',
		icon: 'poncage',
		order: 6,
		featured: true,
		name: { fr: 'Ponçage', es: 'Lijado' },
		shortDescription: {
			fr: 'Restauration des sols en bois et préparation des surfaces avec équipement professionnel.',
			es: 'Restauración de suelos de madera y preparación de superficies con equipo profesional.',
		},
		steps: {
			fr: ["Évaluation de l'état", 'Ponçage professionnel', 'Réparations si besoin', 'Protection finale'],
			es: ['Evaluación del estado', 'Lijado profesional', 'Reparaciones si es necesario', 'Protección final'],
		},
		benefits: {
			fr: ['Équipement industriel', 'Récupération de poussière', 'Résultat lisse et uniforme', 'Préparation peinture incluse'],
			es: ['Equipo industrial', 'Recogida de polvo', 'Resultado liso y uniforme', 'Preparación de pintura incluida'],
		},
	},
];

export interface SeedProject {
	slug: string;
	category: string;
	order: number;
	featured: boolean;
	title: LocalizedText;
	asset: string;
}

export const projects: SeedProject[] = [
	{ slug: 'salon-contemporaneo', category: 'peinture', order: 1, featured: true, title: { fr: 'Salon contemporain', es: 'Salón contemporáneo' }, asset: 'images/gallery/salon-contemporaneo.webp' },
	{ slug: 'escaleras-residenciales', category: 'parquet', order: 2, featured: true, title: { fr: 'Escalier résidentiel', es: 'Escalera residencial' }, asset: 'images/gallery/escaleras-residenciales.webp' },
	{ slug: 'bano-marmol', category: 'plomberie', order: 3, featured: true, title: { fr: 'Salle de bain marbre', es: 'Baño mármol' }, asset: 'images/gallery/bano-marmol.webp' },
	{ slug: 'molduras-contemporaneas', category: 'peinture', order: 4, featured: true, title: { fr: 'Moulures contemporaines', es: 'Molduras contemporáneas' }, asset: 'images/gallery/molduras-contemporaneas.webp' },
	{ slug: 'parquet-madera', category: 'parquet', order: 5, featured: false, title: { fr: 'Parquet bois massif', es: 'Parquet madera' }, asset: 'images/gallery/parquet-madera.webp' },
	{ slug: 'pasillo-molduras', category: 'peinture', order: 6, featured: false, title: { fr: 'Couloir avec moulures', es: 'Pasillo con molduras' }, asset: 'images/gallery/pasillo-molduras.webp' },
	{ slug: 'renovacion-portal', category: 'carrelage', order: 7, featured: false, title: { fr: "Rénovation d'entrée", es: 'Renovación portal' }, asset: 'images/gallery/renovacion-portal.webp' },
	{ slug: 'escaleras-ventanas', category: 'peinture', order: 8, featured: false, title: { fr: 'Escalier et fenêtres', es: 'Escalera y ventanas' }, asset: 'images/gallery/escaleras-ventanas.webp' },
	{ slug: 'salon-profesional', category: 'peinture', order: 9, featured: false, title: { fr: 'Salon professionnel', es: 'Salón profesional' }, asset: 'images/gallery/salon-profesional.webp' },
	{ slug: 'salon-senorial', category: 'peinture', order: 10, featured: false, title: { fr: 'Salon seigneurial', es: 'Salón señorial' }, asset: 'images/gallery/salon-senorial.webp' },
	{ slug: 'puerta-integrada', category: 'peinture', order: 11, featured: false, title: { fr: 'Porte intégrée vert olive', es: 'Puerta integrada verde oliva' }, asset: 'images/gallery/puerta-integrada.webp' },
	{ slug: 'dormitorio', category: 'peinture', order: 12, featured: false, title: { fr: 'Chambre rénovée', es: 'Dormitorio renovado' }, asset: 'images/gallery/dormitorio.webp' },
	{ slug: 'cocina-minimalista', category: 'peinture', order: 13, featured: false, title: { fr: 'Cuisine minimaliste', es: 'Cocina minimalista' }, asset: 'images/gallery/cocina-minimalista.webp' },
];

export interface SeedBeforeAfter {
	order: number;
	category: string;
	aspectRatio: number;
	title: LocalizedText;
	before: string;
	after: string;
	beforeVideo?: string;
	afterVideo?: string;
}

export const beforeAfterProjects: SeedBeforeAfter[] = [
	{
		order: 1,
		category: 'peinture',
		aspectRatio: 1440 / 1870,
		title: { fr: 'Salon après rénovation complète', es: 'Salón tras reforma integral' },
		before: 'images/after-before/01/before.webp',
		after: 'images/after-before/01/after.webp',
	},
	{
		order: 2,
		category: 'peinture',
		aspectRatio: 1,
		title: { fr: 'Chambre modernisée', es: 'Dormitorio modernizado' },
		before: 'images/after-before/02/before.webp',
		after: 'images/after-before/02/after.webp',
	},
	{
		order: 3,
		category: 'carrelage',
		aspectRatio: 1440 / 782,
		title: { fr: 'Salle de bain entièrement refaite', es: 'Baño completamente reformado' },
		before: 'images/after-before/03/before.webp',
		after: 'images/after-before/03/after.webp',
	},
	{
		order: 4,
		category: 'peinture',
		aspectRatio: 1440 / 762,
		title: { fr: 'Cuisine ouverte rénovée', es: 'Cocina abierta reformada' },
		before: 'images/after-before/04/before.webp',
		after: 'images/after-before/04/after.webp',
	},
	{
		order: 5,
		category: 'plomberie',
		aspectRatio: 1440 / 1406,
		title: { fr: "Rénovation salle d'eau", es: 'Reforma del cuarto de baño' },
		before: 'images/after-before/05/before.webp',
		after: 'images/after-before/05/after.webp',
	},
	{
		order: 6,
		category: 'peinture',
		aspectRatio: 1108 / 2048,
		title: { fr: 'Couloir et entrée réaménagés', es: 'Pasillo y entrada reformados' },
		before: 'images/after-before/06/before.webp',
		after: 'images/after-before/06/after.webp',
	},
	{
		order: 7,
		category: 'peinture',
		aspectRatio: 1,
		title: { fr: 'Avant / Après en vidéo', es: 'Antes / Después en vídeo' },
		before: 'images/after-before/07/before.webp',
		after: 'images/after-before/07/after.webp',
		beforeVideo: 'videos/before.webm',
		afterVideo: 'videos/after.webm',
	},
];

export interface SeedTestimonial {
	order: number;
	rating: number;
	fr: { text: string; author: string; dateLabel: string };
	es: { text: string; author: string; dateLabel: string };
}

export const testimonials: SeedTestimonial[] = [
	{
		order: 1,
		rating: 5,
		fr: {
			text: "D.E.B TOUT CORPS a transformé notre appartement en un espace moderne et lumineux. Travail soigné, délais respectés. Je recommande à 100%.",
			author: 'Marie & Pierre D.',
			dateLabel: 'il y a 2 semaines',
		},
		es: {
			text: 'D.E.B TOUT CORPS transformó nuestro apartamento en un espacio moderno y luminoso. Trabajo cuidado, plazos respetados. Recomiendo al 100%.',
			author: 'María y Pedro D.',
			dateLabel: 'hace 2 semanas',
		},
	},
	{
		order: 2,
		rating: 5,
		fr: {
			text: 'Parquet massif posé dans notre salon : un travail magnifique. Équipe sérieuse, ponctuelle et très propre. Merci !',
			author: 'Sophie L.',
			dateLabel: 'il y a 1 mois',
		},
		es: {
			text: 'Parquet macizo instalado en nuestro salón: un trabajo magnífico. Equipo serio, puntual y muy limpio. ¡Gracias!',
			author: 'Sofía L.',
			dateLabel: 'hace 1 mes',
		},
	},
	{
		order: 3,
		rating: 5,
		fr: {
			text: 'Rénovation complète de notre salle de bain. Résultat au-delà de nos espérances, budget respecté. Très professionnels.',
			author: 'Jean-Claude M.',
			dateLabel: 'il y a 1 mois',
		},
		es: {
			text: 'Reforma integral de nuestro baño. Resultado por encima de nuestras expectativas, presupuesto respetado. Muy profesionales.',
			author: 'Juan C. M.',
			dateLabel: 'hace 1 mes',
		},
	},
	{
		order: 4,
		rating: 5,
		fr: {
			text: "Carrelage et peinture refaits dans tout l'appartement. Finitions impeccables, chantier laissé propre chaque soir. Je recommande.",
			author: 'Antoine B.',
			dateLabel: 'il y a 2 mois',
		},
		es: {
			text: 'Alicatado y pintura rehechos en todo el piso. Acabados impecables, obra limpia cada tarde. Lo recomiendo.',
			author: 'Antonio B.',
			dateLabel: 'hace 2 meses',
		},
	},
	{
		order: 5,
		rating: 5,
		fr: {
			text: 'Électricien, plombier, peintre : tout a été parfaitement coordonné. Un seul interlocuteur du devis à la livraison, un vrai gain de temps.',
			author: 'Camille R.',
			dateLabel: 'il y a 3 mois',
		},
		es: {
			text: 'Electricista, fontanero, pintor: todo perfectamente coordinado. Un único interlocutor del presupuesto a la entrega, un gran ahorro de tiempo.',
			author: 'Camila R.',
			dateLabel: 'hace 3 meses',
		},
	},
	{
		order: 6,
		rating: 5,
		fr: {
			text: 'Ponçage et vitrification de notre ancien parquet. Le résultat est bluffant, on dirait du neuf. Excellent rapport qualité-prix.',
			author: 'Thomas G.',
			dateLabel: 'il y a 3 mois',
		},
		es: {
			text: 'Lijado y barnizado de nuestro antiguo parquet. El resultado es increíble, parece nuevo. Excelente relación calidad-precio.',
			author: 'Tomás G.',
			dateLabel: 'hace 3 meses',
		},
	},
	{
		order: 7,
		rating: 5,
		fr: {
			text: "Devis clair et détaillé, aucune surprise à la facture. L'équipe est à l'écoute et de très bon conseil. Nous referons appel à eux.",
			author: 'Isabelle F.',
			dateLabel: 'il y a 4 mois',
		},
		es: {
			text: 'Presupuesto claro y detallado, ninguna sorpresa en la factura. El equipo escucha y asesora muy bien. Volveremos a contar con ellos.',
			author: 'Isabel F.',
			dateLabel: 'hace 4 meses',
		},
	},
	{
		order: 8,
		rating: 5,
		fr: {
			text: 'Cuisine ouverte rénovée de A à Z. Le rendu est superbe et le chantier a été bouclé en avance. Une équipe fiable et sympathique.',
			author: 'Laurent V.',
			dateLabel: 'il y a 5 mois',
		},
		es: {
			text: 'Cocina abierta reformada de principio a fin. El resultado es precioso y la obra se entregó antes de tiempo. Un equipo fiable y amable.',
			author: 'Laura V.',
			dateLabel: 'hace 5 meses',
		},
	},
];

export const siteSettings = {
	fr: {
		companyName: 'D.E.B TOUT CORPS',
		tagline: 'Rénovation et Peinture',
		description:
			"Entreprise de bâtiment spécialisée en rénovation complète. Nous transformons votre habitat avec expertise et passion depuis plus de 15 ans.",
		phone: '+33 07 67 59 75 08',
		email: 'professionnels.renovation@gmail.com',
		whatsapp: '330767597508',
		address: 'France',
		hours: 'Lun - Ven: 8h00 - 18h00',
		googleMapsUrl: 'https://www.google.com/maps',
		seoTitle: 'D.E.B TOUT CORPS | Rénovation et Peinture',
		seoDescription:
			'Entreprise de bâtiment spécialisée en rénovation complète. Électricité, plomberie, carrelage, parquet, peinture et ponçage.',
	},
	es: {
		companyName: 'D.E.B TOUT CORPS',
		tagline: 'Reformas y Pintura',
		description:
			'Empresa de construcción especializada en reformas integrales. Transformamos su hogar con experiencia y pasión desde hace más de 15 años.',
		phone: '+33 07 67 59 75 08',
		email: 'professionnels.renovation@gmail.com',
		whatsapp: '330767597508',
		address: 'Francia',
		hours: 'Lun - Vie: 8:00 - 18:00',
		googleMapsUrl: 'https://www.google.com/maps',
		seoTitle: 'D.E.B TOUT CORPS | Reformas y Pintura',
		seoDescription:
			'Empresa de construcción especializada en reformas integrales. Electricidad, fontanería, alicatado, parquet, pintura y lijado.',
	},
	googleRating: 5,
	googleReviewCount: 8,
	logoAsset: 'images/logo.png',
	ogImageAsset: 'images/logo-deb.jpeg',
	socialLinks: [
		{
			platform: 'facebook',
			url: 'https://www.facebook.com/profile.php?id=61572797564274',
		},
	],
};

export const homePage = {
	fr: {
		heroEyebrow: 'Entreprise de Bâtiment',
		heroTitleLine1: 'Transformez',
		heroTitleLine2: 'votre espace',
		heroTitleHighlight: 'avec excellence',
		heroSubtitle:
			'Transformez votre espace avec D.E.B TOUT CORPS. Expertise française en rénovation, électricité, plomberie, carrelage, parquet, peinture et ponçage.',
		heroPrimaryLabel: 'Nos Services',
		heroSecondaryLabel: 'Contactez-nous',
		stats: [
			{ value: '15+', label: 'Années', sublabel: "d'expertise" },
			{ value: '500+', label: 'Projets', sublabel: 'réalisés' },
			{ value: '100%', label: 'Satisfaction', sublabel: 'client' },
		],
		valueTitle: 'Pourquoi nous choisir',
		valueDescription:
			"Chaque projet est une promesse de qualité et d'excellence. Nous ne faisons pas de compromis sur les matériaux ni sur la finition.",
		valueCards: [
			{
				title: 'Expertise Certifiée',
				description: "Plus de 15 ans d'expérience dans la rénovation résidentielle et commerciale.",
			},
			{
				title: 'Matériaux Premium',
				description:
					'Nous sélectionnons uniquement des matériaux de la plus haute qualité pour des résultats durables.',
			},
			{
				title: 'Service Clé en Main',
				description: 'De la conception à la réalisation, nous gérons chaque détail de votre projet.',
			},
		],
		servicesTitle: 'Des solutions complètes pour votre habitat',
		servicesDescription:
			"Du sol au plafond, notre équipe d'artisans qualifiés réalise tous vos travaux de rénovation avec précision et soin.",
		projectsTitle: 'Transformations remarquables',
		projectsDescription:
			'Découvrez nos chantiers récents et laissez-vous inspirer par la qualité de notre travail.',
		beforeAfterTitle: 'La transformation en un coup d\'œil',
		beforeAfterDescription:
			'Découvrez la transformation complète de nos projets à travers des comparaisons avant et après.',
		whyUsTitle: 'La qualité dans chaque détail',
		whyUsDescription:
			"Chez D.E.B TOUT CORPS, nous croyons que l'excellence réside dans l'attention portée à chaque détail. Notre équipe d'artisans passionnés transforme vos espaces avec précision et créativité.",
		whyUsPoints: [
			'Devis détaillé et transparent',
			'Respect des délais convenus',
			'Garantie décennale sur les travaux',
			'Intervention rapide en urgence',
			'Conseil personnalisé et gratuit',
		],
		processTitle: 'Une approche structurée',
		processSteps: [
			{ title: 'Consultation', description: 'Nous évaluons vos besoins sur place et établissons un diagnostic complet.' },
			{ title: 'Conception', description: 'Notre équipe élabore un plan détaillé avec des propositions sur mesure.' },
			{
				title: 'Réalisation',
				description: 'Les artisans qualifiés exécutent les travaux avec précision et professionnalisme.',
			},
			{
				title: 'Livraison',
				description: 'Contrôle qualité rigoureux et remise des clés dans les délais impartis.',
			},
		],
		testimonialsTitle: 'Ce que nos clients disent',
		testimonialsDescription: 'Opinions vérifiées de clients satisfaits.',
		ctaTitle: 'Prêt à transformer votre espace ?',
		ctaDescription:
			"Contactez-nous dès maintenant pour un devis gratuit et personnalisé. Votre projet mérite l'excellence.",
		ctaButtonLabel: 'Demander un devis',
		seoTitle: 'D.E.B TOUT CORPS | Rénovation et Peinture',
		seoDescription:
			'Entreprise de bâtiment spécialisée en rénovation complète. Électricité, plomberie, carrelage, parquet, peinture et ponçage.',
	},
	es: {
		heroEyebrow: 'Empresa de Construcción',
		heroTitleLine1: 'Transforme',
		heroTitleLine2: 'su espacio',
		heroTitleHighlight: 'con excelencia',
		heroSubtitle:
			'Transforme su espacio con D.E.B TOUT CORPS. Experticia francesa en reformas, electricidad, fontanería, alicatado, parquet, pintura y lijado.',
		heroPrimaryLabel: 'Nuestros Servicios',
		heroSecondaryLabel: 'Contáctenos',
		stats: [
			{ value: '15+', label: 'Años', sublabel: 'de experiencia' },
			{ value: '500+', label: 'Proyectos', sublabel: 'realizados' },
			{ value: '100%', label: 'Satisfacción', sublabel: 'cliente' },
		],
		valueTitle: 'Por qué elegirnos',
		valueDescription:
			'Cada proyecto es una promesa de calidad y excelencia. No hacemos compromisos en materiales ni en acabados.',
		valueCards: [
			{
				title: 'Experiencia Certificada',
				description: 'Más de 15 años de experiencia en reformas residenciales y comerciales.',
			},
			{
				title: 'Materiales Premium',
				description: 'Seleccionamos solo materiales de la más alta calidad para resultados duraderos.',
			},
			{
				title: 'Servicio Llave en Mano',
				description: 'Desde el diseño hasta la realización, gestionamos cada detalle de su proyecto.',
			},
		],
		servicesTitle: 'Soluciones completas para su hogar',
		servicesDescription:
			'Del suelo al techo, nuestro equipo de artesanos cualificados realiza todas sus obras de reforma con precisión y cuidado.',
		projectsTitle: 'Transformaciones notables',
		projectsDescription:
			'Descubra nuestras obras recientes y déjese inspirar por la calidad de nuestro trabajo.',
		beforeAfterTitle: 'La transformación de un vistazo',
		beforeAfterDescription:
			'Descubra la transformación completa de nuestros proyectos a través de comparaciones antes y después.',
		whyUsTitle: 'La calidad en cada detalle',
		whyUsDescription:
			'En D.E.B TOUT CORPS, creemos que la excelencia reside en la atención puesta a cada detalle. Nuestro equipo de artesanos apasionados transforma sus espacios con precisión y creatividad.',
		whyUsPoints: [
			'Presupuesto detallado y transparente',
			'Respeto de los plazos acordados',
			'Garantía decenal en las obras',
			'Intervención rápida en urgencias',
			'Asesoramiento personalizado y gratuito',
		],
		processTitle: 'Una metodología estructurada',
		processSteps: [
			{ title: 'Consulta', description: 'Evaluamos sus necesidades in situ y establecemos un diagnóstico completo.' },
			{ title: 'Diseño', description: 'Nuestro equipo elabora un plan detallado con propuestas a medida.' },
			{
				title: 'Realización',
				description: 'Los artesanos cualificados ejecutan las obras con precisión y profesionalismo.',
			},
			{
				title: 'Entrega',
				description: 'Control de calidad riguroso y entrega de llaves en los plazos establecidos.',
			},
		],
		testimonialsTitle: 'Lo que dicen nuestros clientes',
		testimonialsDescription: 'Opiniones verificadas de clientes satisfechos.',
		ctaTitle: '¿Listo para transformar su espacio?',
		ctaDescription:
			'Contáctenos ahora para un presupuesto gratuito y personalizado. Su proyecto merece la excelencia.',
		ctaButtonLabel: 'Solicitar presupuesto',
		seoTitle: 'D.E.B TOUT CORPS | Reformas y Pintura',
		seoDescription:
			'Empresa de construcción especializada en reformas integrales. Electricidad, fontanería, alicatado, parquet, pintura y lijado.',
	},
};
