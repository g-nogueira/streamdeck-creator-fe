export type GradientStop = {
    position: number;
    color: string;
}

export type UserIconGradient = {
    stops: GradientStop[];
    type: 'linear' | 'radial';
    angle: number;
    cssStyle: string;
}