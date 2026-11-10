import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = () =>
	new Response(JSON.stringify({ status: 'ok', service: 'deb-web' }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
	});
