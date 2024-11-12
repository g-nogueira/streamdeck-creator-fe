import { Env } from '$lib/env.public';

export const serviceBaseUrl = Env.getOrThrow("PUBLIC_SERVICE_URL");
export const userCollectionEndpoint = `${serviceBaseUrl}/user-icon-collections`;
export const iconsEndpoint = `${serviceBaseUrl}/icons`;
