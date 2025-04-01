import { env } from "$env/dynamic/public";

/**
 * Public environment variables.
 * Only includes variables that begin with PUBLIC_ and can therefore safely be exposed to client-side code.
 */
export class Env {
	static getOrThrow(key: keyof typeof env): string {
		const value = env[key];
		if (!value) {
			throw new Error(`Missing environment variable: ${key}`);
		}
		return value;
	}
}
