export type UserIconGradient = {
    stops: { position: number; color: string }[];
    type: 'linear' | 'radial';
    angle: number;
    cssStyle: string;
}