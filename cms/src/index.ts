import type { Core } from '@strapi/strapi';
import { grantPublicReadPermissions, seedContent } from './seed';
import { configureAdmin } from './seed/admin-ui';

export default {
	register() {},

	async bootstrap({ strapi }: { strapi: Core.Strapi }) {
		await grantPublicReadPermissions(strapi);
		await configureAdmin(strapi);

		if (process.env.SEED_ON_BOOT !== 'false') {
			await seedContent(strapi);
		}
	},
};
