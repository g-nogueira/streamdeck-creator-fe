/**
 * Represents a single stop in the gradient.
 */
export interface GradientStop {
	/** The color of the stop. Can be any format tinygradient accepts (hex, rgb, rgba, hsl, css name). */
	color: ColorInput;
	/** The position of the stop, typically between 0 (start) and 1 (end). */
	pos: number;
}

/**
 * Type alias for color inputs, accepting various string formats.
 */
export type ColorInput = string;

/**
 * Possible direction values for linear gradients (keywords or angles).
 * Example keywords: 'to right', 'to bottom left'
 * Example angles: '45deg', '1.2rad'
 */
export type LinearDirection = string;

/**
 * Possible shape values for radial gradients.
 */
export type RadialShape = "circle" | "ellipse";

/**
 * Possible size keywords for radial gradients.
 * Refer to CSS radial-gradient documentation for details:
 * https://developer.mozilla.org/en-US/docs/Web/CSS/gradient/radial-gradient#size
 */
export type RadialSizeKeyword = "closest-side" | "closest-corner" | "farthest-side" | "farthest-corner";

/**
 * Represents the size of a radial gradient (keyword or potentially length/percentage in the future).
 */
export type RadialSize = RadialSizeKeyword | string; // Allow string for potential future length/percentage values

/**
 * Represents the position of a radial gradient center.
 * Can use keywords like 'center', 'top left', or percentages/lengths like '25% 75%'.
 * Refer to CSS background-position documentation:
 * https://developer.mozilla.org/en-US/docs/Web/CSS/background-position
 */
export type RadialPosition = string;

/**
 * Defines the internal state structure managed by the GradientBuilder.
 * This is not typically exported directly but used internally.
 */
export interface GradientState {
	type?: "linear" | "radial";
	stops: GradientStop[];
	direction: LinearDirection; // Default 'to bottom'
	shape: RadialShape; // Default 'ellipse'
	size: RadialSize; // Default 'farthest-corner'
	position: RadialPosition; // Default 'center'
}
