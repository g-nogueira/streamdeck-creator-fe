import { UnleashClient } from 'unleash-proxy-client';
import { Env } from './env.public';

// See mode on https://docs.getunleash.io/reference/sdks/javascript-browser
const unleashClient = new UnleashClient({
    url: Env.getOrThrow("PUBLIC_UNLEASH_URL") + "/api/frontend/",
    clientKey: Env.getOrThrow("PUBLIC_UNLEASH_API_TOKEN"),
    appName: Env.getOrThrow("PUBLIC_UNLEASH_APP_NAME"),
});

let unleashReady = false;

export const startUnleash = () => new Promise((resolve) => {
    if (unleashReady) {
        console.log('Unleash was already started');
        resolve(true);
        return;
    }
    // unleashClient.start();
    resolve(false);
    unleashClient.on('ready', () => {
        console.log('Unleash is ready');
        unleashReady = true;
        resolve(true);
    });
    unleashClient.on('error', (error: Error) => {
        console.error(error);
        resolve(false);
    });

}) as Promise<boolean>;

export const USE_STREAM_DECK_ICONS = () => unleashClient.isEnabled('streamDeckIconsEnabled');