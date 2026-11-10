import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

const TO_EMAIL = process.env.CONTACT_TO_EMAIL;
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL;

const MAX_LENGTHS = {
	name: 120,
	email: 200,
	phone: 40,
	service: 40,
	message: 5000,
} as const;

function json(body: Record<string, unknown>, status = 200) {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});
}

function escapeHtml(value: string): string {
	return value.replace(/[&<>"']/g, (char) => {
		switch (char) {
			case '&':
				return '&amp;';
			case '<':
				return '&lt;';
			case '>':
				return '&gt;';
			case '"':
				return '&quot;';
			default:
				return '&#039;';
		}
	});
}

export const POST: APIRoute = async ({ request }) => {
	const apiKey = process.env.RESEND_API_KEY;
	if (!apiKey) {
		return json({ success: false, error: 'Clé API Resend manquante.' }, 500);
	}

	if (!TO_EMAIL || !FROM_EMAIL) {
		return json({ success: false, error: 'Configuration email manquante.' }, 500);
	}

	const resend = new Resend(apiKey);

	try {
		const formData = await request.formData();
		const honeypot = String(formData.get('website') ?? '').trim();
		const name = String(formData.get('name') ?? '').trim();
		const email = String(formData.get('email') ?? '').trim();
		const phone = String(formData.get('phone') ?? '').trim();
		const service = String(formData.get('service') ?? '').trim();
		const message = String(formData.get('message') ?? '').trim();
		const lang = String(formData.get('lang') ?? 'fr') === 'es' ? 'es' : 'fr';

		// Bots fill hidden fields. Pretend success without sending anything.
		if (honeypot) {
			return json({ success: true });
		}

		if (!name || !email || !message) {
			return json({ success: false, error: 'Champs requis manquants.' }, 400);
		}

		const tooLong =
			name.length > MAX_LENGTHS.name ||
			email.length > MAX_LENGTHS.email ||
			phone.length > MAX_LENGTHS.phone ||
			service.length > MAX_LENGTHS.service ||
			message.length > MAX_LENGTHS.message;

		if (tooLong) {
			return json({ success: false, error: 'Un des champs est trop long.' }, 400);
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return json({ success: false, error: 'Email invalide.' }, 400);
		}

		const serviceLabel = service
			? service.charAt(0).toUpperCase() + service.slice(1)
			: 'Non spécifié';

		const subject =
			lang === 'es'
				? `Nueva solicitud de contacto - ${name}`
				: `Nouvelle demande de contact - ${name}`;

		const safeName = escapeHtml(name);
		const safeEmail = escapeHtml(email);
		const safePhone = escapeHtml(phone || '-');
		const safeService = escapeHtml(serviceLabel);
		const safeMessage = escapeHtml(message);

		const html = `
		<!doctype html>
		<html lang="${lang}">
			<head><meta charset="utf-8" /></head>
			<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
				<div style="background: #253142; color: #F7D051; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
					<h1 style="margin: 0; font-size: 24px;">D.E.B TOUT CORPS</h1>
					<p style="margin: 5px 0 0; color: #fff; font-size: 14px;">
						${lang === 'es' ? 'Nueva solicitud de contacto' : 'Nouvelle demande de contact'}
					</p>
				</div>
				<div style="background: #fff; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
					<table style="width: 100%; border-collapse: collapse;">
						<tr>
							<td style="padding: 8px 0; font-weight: bold; width: 120px; vertical-align: top;">Nom :</td>
							<td style="padding: 8px 0;">${safeName}</td>
						</tr>
						<tr style="border-top: 1px solid #f3f4f6;">
							<td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Email :</td>
							<td style="padding: 8px 0;">${safeEmail}</td>
						</tr>
						<tr style="border-top: 1px solid #f3f4f6;">
							<td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Téléphone :</td>
							<td style="padding: 8px 0;">${safePhone}</td>
						</tr>
						<tr style="border-top: 1px solid #f3f4f6;">
							<td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Service :</td>
							<td style="padding: 8px 0;">${safeService}</td>
						</tr>
						<tr style="border-top: 1px solid #f3f4f6;">
							<td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Message :</td>
							<td style="padding: 8px 0; white-space: pre-wrap;">${safeMessage}</td>
						</tr>
					</table>
				</div>
				<div style="text-align: center; margin-top: 20px; font-size: 12px; color: #9ca3af;">
					© D.E.B TOUT CORPS — ${new Date().getFullYear()}
				</div>
			</body>
		</html>
		`;

		const { error } = await resend.emails.send({
			from: FROM_EMAIL,
			to: TO_EMAIL,
			replyTo: email,
			subject,
			html,
		});

		if (error) {
			return json({ success: false, error: error.message }, 500);
		}

		return json({ success: true });
	} catch (err) {
		console.error('Contact API error:', err);
		return json({ success: false, error: 'Erreur serveur.' }, 500);
	}
};
