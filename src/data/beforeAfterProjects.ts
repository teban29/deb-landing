export interface BeforeAfterProject {
	id: string;
	titleKey: string;
	serviceKey: string;
	before: string;
	after: string;
	aspectRatio: number;
}

export const beforeAfterProjects: BeforeAfterProject[] = [
	{
		id: '01',
		titleKey: 'beforeAfter.01.title',
		serviceKey: 'peinture',
		before: '/images/after-before/01/before.webp',
		after: '/images/after-before/01/after.webp',
		aspectRatio: 1440 / 1870,
	},
	{
		id: '02',
		titleKey: 'beforeAfter.02.title',
		serviceKey: 'peinture',
		before: '/images/after-before/02/before.webp',
		after: '/images/after-before/02/after.webp',
		aspectRatio: 1,
	},
	{
		id: '03',
		titleKey: 'beforeAfter.03.title',
		serviceKey: 'carrelage',
		before: '/images/after-before/03/before.webp',
		after: '/images/after-before/03/after.webp',
		aspectRatio: 1440 / 782,
	},
	{
		id: '04',
		titleKey: 'beforeAfter.04.title',
		serviceKey: 'peinture',
		before: '/images/after-before/04/before.webp',
		after: '/images/after-before/04/after.webp',
		aspectRatio: 1440 / 762,
	},
	{
		id: '05',
		titleKey: 'beforeAfter.05.title',
		serviceKey: 'plomberie',
		before: '/images/after-before/05/before.webp',
		after: '/images/after-before/05/after.webp',
		aspectRatio: 1440 / 1406,
	},
	{
		id: '06',
		titleKey: 'beforeAfter.06.title',
		serviceKey: 'peinture',
		before: '/images/after-before/06/before.webp',
		after: '/images/after-before/06/after.webp',
		aspectRatio: 1108 / 2048,
	},
];
