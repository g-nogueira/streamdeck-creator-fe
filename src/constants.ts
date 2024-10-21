import { env } from '$env/dynamic/public';

export const serviceBaseUrl = env.PUBLIC_SERVICE_URL;
export const userCollectionEndpoint = `${serviceBaseUrl}/user-icon-collections`;
export const iconsEndpoint = `${serviceBaseUrl}/icons`;
