import type {
	GradientState,
	GradientStop,
	LinearDirection,
	RadialPosition,
	RadialShape,
	RadialSize
} from "$lib/gradient";

/**
 * Defines the internal state structure managed by the GradientBuilder.
 * This is not typically exported directly but used internally.
 */
export interface UserIconGradientDto {
	type?: "linear" | "radial";
	stops: GradientStop[];
	direction: LinearDirection;
	shape: RadialShape;
	size: RadialSize;
	position: RadialPosition;
}

export function toDomain(userIconGradientDto: UserIconGradientDto): GradientState {
	return userIconGradientDto as GradientState;
}

export function fromDomain(userIconGradient: GradientState): UserIconGradientDto {
	return userIconGradient as UserIconGradientDto;
}
