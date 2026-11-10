import { defineMiddleware } from 'astro:middleware';

interface Bucket {
	count: number;
	resetAt: number;
}

interface RateRule {
	name: string;
	path: string;
	limit: number;
	windowMs: number;
}

const buckets = new Map<string, Bucket>();

const RATE_RULES: RateRule[] = [
	{
		name: 'contact',
		path: '/api/contact',
		limit: Number(process.env.RATE_LIMIT_CONTACT ?? 5),
		windowMs: Number(process.env.RATE_LIMIT_CONTACT_WINDOW_MS ?? 10 * 60 * 1000),
	},
	{
		name: 'webhook',
		path: '/api/cms-webhook',
		limit: Number(process.env.RATE_LIMIT_WEBHOOK ?? 60),
		windowMs: Number(process.env.RATE_LIMIT_WEBHOOK_WINDOW_MS ?? 60 * 1000),
	},
];

function getClientIp(request: Request, fallback?: string): string {
	const forwarded = request.headers.get('x-forwarded-for');
	if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown';
	return request.headers.get('x-real-ip') || fallback || 'unknown';
}

function pruneBuckets() {
	if (buckets.size < 5000) return;
	const now = Date.now();
	for (const [key, bucket] of buckets) {
		if (bucket.resetAt <= now) buckets.delete(key);
	}
}

function checkRateLimit(rule: RateRule, ip: string): { allowed: boolean; retryAfter: number } {
	const key = `${rule.name}:${ip}`;
	const now = Date.now();
	let bucket = buckets.get(key);

	if (!bucket || bucket.resetAt <= now) {
		bucket = { count: 0, resetAt: now + rule.windowMs };
		buckets.set(key, bucket);
	}

	bucket.count += 1;

	if (bucket.count > rule.limit) {
		return { allowed: false, retryAfter: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)) };
	}

	return { allowed: true, retryAfter: 0 };
}

export const onRequest = defineMiddleware(async (context, next) => {
	const { pathname } = context.url;
	const rule = RATE_RULES.find((item) => item.path === pathname);

	if (rule) {
		pruneBuckets();
		const ip = getClientIp(context.request, context.clientAddress);
		const { allowed, retryAfter } = checkRateLimit(rule, ip);

		if (!allowed) {
			return new Response(
				JSON.stringify({
					success: false,
					error: 'Demasiadas solicitudes. Inténtalo de nuevo más tarde.',
				}),
				{
					status: 429,
					headers: {
						'Content-Type': 'application/json',
						'Retry-After': String(retryAfter),
						'Cache-Control': 'no-store',
					},
				}
			);
		}
	}

	const response = await next();

	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set('X-Frame-Options', 'SAMEORIGIN');
	response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

	if (pathname.startsWith('/api/')) {
		response.headers.set('Cache-Control', 'no-store');
	} else if (
		context.request.method === 'GET' &&
		response.headers.get('Content-Type')?.includes('text/html')
	) {
		response.headers.set(
			'Cache-Control',
			'public, max-age=0, s-maxage=60, stale-while-revalidate=300'
		);
	}

	return response;
});
