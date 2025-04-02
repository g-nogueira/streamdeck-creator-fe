import type { GradientStop, LinearDirection, RadialPosition, RadialShape, RadialSize } from "$lib/gradient";

export type IconGradient = {
	stops: GradientStop[];
	angle: number;
	cssStyle: string;
	type: 'linear' | 'radial';
	direction: LinearDirection;
	shape: RadialShape;
	size: RadialSize;
	position: RadialPosition;
};
