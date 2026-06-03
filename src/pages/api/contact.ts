import type { APIRoute } from 'astro';
import { Resend } from 'resend';

const TO_EMAIL = 'professionnels.renovation@gmail.com';
const FROM_EMAIL = 'onboarding@resend.dev';

export const POST: APIRoute = async ({ request }) => {
	const apiKey = import.meta.env.RESEND_API_KEY;
	if (!apiKey) {
		return new Response(
			JSON.stringify({ success: false, error: 'Clé API Resend manquante.' }),
			{ status: 500, headers: { 'Content-Type': 'application/json' } }
		);
	}

	const resend = new Resend(apiKey);

	try {
		const formData = await request.formData();
		const name = String(formData.get('name') ?? '').trim();
		const email = String(formData.get('email') ?? '').trim();
		const phone = String(formData.get('phone') ?? '').trim();
		const service = String(formData.get('service') ?? '').trim();
		const message = String(formData.get('message') ?? '').trim();
		const lang = String(formData.get('lang') ?? 'fr');

		if (!name || !email || !message) {
			return new Response(
				JSON.stringify({ success: false, error: 'Champs requis manquants.' }),
				{ status: 400, headers: { 'Content-Type': 'application/json' } }
			);
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return new Response(
				JSON.stringify({ success: false, error: 'Email invalide.' }),
				{ status: 400, headers: { 'Content-Type': 'application/json' } }
			);
		}

		const serviceLabel = service
			? service.charAt(0).toUpperCase() + service.slice(1)
			: 'Non spécifié';

		const subject = lang === 'es'
			? `Nueva solicitud de contacto - ${name}`
			: `Nouvelle demande de contact - ${name}`;

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
							<td style="padding: 8px 0;">${name}</td>
						</tr>
						<tr style="border-top: 1px solid #f3f4f6;">
							<td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Email :</td>
							<td style="padding: 8px 0;">${email}</td>
						</tr>
						<tr style="border-top: 1px solid #f3f4f6;">
							<td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Téléphone :</td>
							<td style="padding: 8px 0;">${phone || '-'}</td>
						</tr>
						<tr style="border-top: 1px solid #f3f4f6;">
							<td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Service :</td>
							<td style="padding: 8px 0;">${serviceLabel}</td>
						</tr>
						<tr style="border-top: 1px solid #f3f4f6;">
							<td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Message :</td>
							<td style="padding: 8px 0; white-space: pre-wrap;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td>
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
			subject,
			html,
		});

		if (error) {
			return new Response(
				JSON.stringify({ success: false, error: error.message }),
				{ status: 500, headers: { 'Content-Type': 'application/json' } }
			);
		}

		return new Response(
			JSON.stringify({ success: true }),
			{ status: 200, headers: { 'Content-Type': 'application/json' } }
		);
	} catch {
		return new Response(
			JSON.stringify({ success: false, error: 'Erreur serveur.' }),
			{ status: 500, headers: { 'Content-Type': 'application/json' } }
		);
	}
};
