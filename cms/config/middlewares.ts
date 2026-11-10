import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Middlewares => {
	const mediaHost = env('AWS_PUBLIC_URL') || env('AWS_ENDPOINT');
	const mediaSources = mediaHost ? [mediaHost] : [];

	return [
		'strapi::logger',
		'strapi::errors',
		{
			name: 'strapi::security',
			config: {
				contentSecurityPolicy: {
					useDefaults: true,
					directives: {
						'connect-src': ["'self'", 'https:'],
						'img-src': ["'self'", 'data:', 'blob:', ...mediaSources],
						'media-src': ["'self'", 'data:', 'blob:', ...mediaSources],
						upgradeInsecureRequests: null,
					},
				},
			},
		},
		{
			name: 'strapi::cors',
			config: {
				origin: env.array('CORS_ORIGINS', ['http://localhost:4321']),
				methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
				headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
				keepHeaderOnError: true,
			},
		},
		'strapi::poweredBy',
		'strapi::query',
		'strapi::body',
		'strapi::session',
		'strapi::favicon',
		'strapi::public',
	];
};

export default config;
