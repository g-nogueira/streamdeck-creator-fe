
export interface UserIconGradientDto {
    stops: { position: number; color: string }[];
    type: 'linear' | 'radial';
    angle: number;
    cssStyle: string;
}