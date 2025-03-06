export type IconOrigin = 'mdi' | 'streamdeck';

export interface Icon {
    id: string;
    label: string;
    keywords: string[];
    origin: IconOrigin;
    contentType: string;
}

export function mkEmpty(): Icon {
    return {
        id: '',
        label: '',
        keywords: [],
        origin: 'mdi',
        contentType: 'img/svg+xml'
    };
}