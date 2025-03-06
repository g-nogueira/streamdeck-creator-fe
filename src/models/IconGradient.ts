export type GradientStop = {
    position: number;
    color: string;
}

export type IconGradient = {
    stops: GradientStop[];
    type: 'linear' | 'radial';
    angle: number;
    cssStyle: string;
}