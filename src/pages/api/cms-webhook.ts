import { timingSafeEqual } from 'node:crypto';
import type { APIRoute } from 'astro';
import { clearCmsCache } from '../../lib/cms';

export const prerender = false;

function safeEqual(a: string, b: string): boolean {
	const left = Buffer.from(a);
	const right = Buffer.from(b);
	return left.length === right.length && timingSafeEqual(left, right);
}

/**
 * Strapi calls this endpoint after publishing content so the site serves
 * fresh data immediately instead of waiting for the cache TTL.
 */
export const POST: APIRoute = async ({ request }) => {
	const secret = process.env.CMS_WEBHOOK_SECRET;
	const provided = request.headers.get('x-webhook-secret');
	const contentType = request.headers.get('content-type') ?? '';

	if (!secret || !provided || !safeEqual(provided, secret)) {
		return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
		});
	}

	if (!contentType.includes('application/json')) {
		return new Response(JSON.stringify({ success: false, error: 'Unsupported media type' }), {
			status: 415,
			headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
		});
	}

	clearCmsCache();

	return new Response(JSON.stringify({ success: true, cache: 'cleared' }), {
		status: 200,
		headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
	});
};
