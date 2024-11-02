export type IconOrigin = 'mdi' | 'streamdeck';

export interface Icon {
    id: string;
    label: string;
    keywords: string[];
    origin: IconOrigin;
}