import type { Core } from '@strapi/strapi';

const allowedMediaTypes = [
	'image/*',
	'video/*',
	'audio/*',
	'application/pdf',
	'application/msword',
	'application/vnd.openxmlformats-officedocument.*',
	'text/plain',
	'text/csv',
];

const deniedTypes = [
	'image/svg+xml',
	'application/vnd.microsoft.portable-executable',
	'application/x-msdownload',
	'application/x-msdos-program',
	'application/x-executable',
	'application/x-dosexec',
	'application/x-sh',
	'text/x-shellscript',
	'application/x-mach-binary',
];

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => {
	// When a bucket is configured (Cloudflare R2, S3, MinIO...) uploads go there.
	// Without it Strapi keeps files in ./public/uploads, which is fine for local development.
	const bucket = env('AWS_BUCKET');
	const endpoint = env('AWS_ENDPOINT');
	const useBucket = Boolean(bucket && env('AWS_ACCESS_KEY_ID'));

	return {
		'users-permissions': {
			config: {
				jwtManagement: 'refresh',
				sessions: {
					httpOnly: true,
				},
			},
		},
		upload: {
			config: {
				sizeLimit: env.int('UPLOAD_SIZE_LIMIT', 50 * 1024 * 1024),
				security: {
					allowedTypes: allowedMediaTypes,
					deniedTypes,
				},
				...(useBucket
					? {
							provider: 'aws-s3',
							providerOptions: {
								baseUrl: env('AWS_PUBLIC_URL') || undefined,
								rootPath: env('AWS_ROOT_PATH', ''),
								s3: {
									...(endpoint ? { endpoint } : {}),
									region: env('AWS_REGION', 'auto'),
									forcePathStyle: env.bool('AWS_FORCE_PATH_STYLE', true),
									params: {
										Bucket: bucket,
									},
									credentials: {
										accessKeyId: env('AWS_ACCESS_KEY_ID'),
										secretAccessKey: env('AWS_ACCESS_SECRET'),
									},
								},
							},
							actionOptions: {
								upload: {},
								uploadStream: {},
								delete: {},
							},
						}
					: {}),
			},
		},
	};
};

export default config;
