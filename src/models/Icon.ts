export type IconOrigin = 'mdi' | 'streamdeck';

export interface Icon {
    id: string;
    label: string;
    keywords: string[];
    origin: IconOrigin;
}

export function mkEmpty(): Icon {
    return {
        id: '',
        label: '',
        keywords: [],
        origin: 'mdi',
    };
}