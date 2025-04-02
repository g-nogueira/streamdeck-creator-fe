// src/lib/gradient/gradientBuilder.ts

import tinygradient from "tinygradient";
import type {
	GradientState,
	GradientStop,
	ColorInput,
	LinearDirection,
	RadialShape,
	RadialSize,
	RadialPosition
} from "./types";

type TinyGradientStop = tinygradient.StopInput;

// Helper to map our stop format to tinygradient's, though they might be compatible
function mapStopsToTinygradient(stops: GradientStop[]): TinyGradientStop[] {
	// Ensure positions are clamped between 0 and 1 just in case.
	return stops.map(stop => ({
		color: stop.color,
		pos: Math.max(0, Math.min(1, stop.pos))
	}));
}

export class GradientBuilder {
	// Internal state - kept private and immutable from the outside
	private readonly state: GradientState;

	/**
	 * Initializes a new GradientBuilder instance.
	 * Private constructor to enforce creation via static methods or initial call.
	 * Users will typically start with `new GradientBuilder()`.
	 */
	constructor(initialState?: GradientState) {
		// Establish default state if none is provided
		this.state = initialState ?? {
			type: undefined,
			stops: [],
			direction: "to bottom", // Default linear direction
			shape: "ellipse", // Default radial shape
			size: "farthest-corner", // Default radial size
			position: "center" // Default radial position
		};

		// Ensure stops is always an array (defensive)
		if (!Array.isArray(this.state.stops)) {
			this.state.stops = [];
		}

		// Freeze the state object in development environments to help catch mutations
		// Note: This is a shallow freeze. The stops array itself isn't frozen deeply.
		if (process.env.NODE_ENV === "development") {
			Object.freeze(this.state);
			Object.freeze(this.state.stops); // Freeze the stops array too
		}
	}

	/**
	 * Creates a shallow clone of the current state and returns a new Builder instance.
	 * Handles creating new array for stops to ensure immutability.
	 */
	private clone(updates: Partial<GradientState>): GradientBuilder {
		const newState: GradientState = {
			...this.state,
			...updates
		};

		// Ensure the stops array is a new instance if stops weren't part of the update
		// or if they were, ensure the provided one is used and cloned defensively.
		if (!updates.stops) {
			// If no new stops provided, clone existing ones
			newState.stops = [...this.state.stops];
		} else {
			// If new stops are provided, ensure we use a copy of that array
			newState.stops = [...updates.stops];
		}

		return new GradientBuilder(newState);
	}

	// --- NEW: Stop Access and Replacement ---

	/**
	 * Gets a copy of the current gradient stops.
	 * @returns A new array containing the current GradientStop objects.
	 */
	getStops(): GradientStop[] {
		// Return a shallow copy to prevent external mutation of internal state
		return [...this.state.stops];
	}

	/**
	 * Creates a new GradientBuilder instance with a completely replaced set of stops.
	 * This is useful for operations like updating or reordering stops.
	 * @param newStops The new array of GradientStop objects.
	 * @returns A new GradientBuilder instance with the specified stops.
	 */
	withStops(newStops: GradientStop[]): GradientBuilder {
		// Ensure the stops are ordered
		newStops.sort((a, b) => a.pos - b.pos);

		// Use clone, providing the new stops array.
		// The clone method handles making a defensive copy of the provided array.
		return this.clone({ stops: newStops });
	}

	// --- Existing Methods ---

	/**
	 * Sets the gradient type to linear.
	 * Resets radial-specific settings (shape, size, position) to defaults
	 * in the new instance.
	 * @returns A new GradientBuilder instance configured for linear gradients.
	 */
	linear(): GradientBuilder {
		return this.clone({
			type: "linear",
			// Reset radial specific properties to their defaults when switching to linear
			shape: "ellipse",
			size: "farthest-corner",
			position: "center"
		});
	}

	/**
	 * Sets the gradient type to radial.
	 * Resets linear-specific settings (direction) to its default
	 * in the new instance.
	 * @returns A new GradientBuilder instance configured for radial gradients.
	 */
	radial(): GradientBuilder {
		return this.clone({
			type: "radial",
			// Reset linear specific properties to their defaults when switching to radial
			direction: "to bottom"
		});
	}

	/**
	 * Adds a single color stop to the gradient.
	 * @param color The color of the stop (e.g., 'red', '#FFF', 'rgba(0,0,0,0.5)').
	 * @param position The position of the stop (0 to 1).
	 * @returns A new GradientBuilder instance with the added stop.
	 */
	addStop(color: ColorInput, position: number): GradientBuilder {
		const newStop: GradientStop = { color, pos: position };

		// Ensure the stops are ordered
		const stops = [...this.state.stops, newStop].sort((a, b) => a.pos - b.pos);

		// Use the existing stops from state and add the new one
		return this.clone({ stops });
	}

	/**
	 * Adds multiple color stops to the gradient.
	 * @param stops An array of GradientStop objects.
	 * @returns A new GradientBuilder instance with the added stops.
	 */
	addStops(stops: GradientStop[]): GradientBuilder {
		if (!stops || stops.length === 0) {
			// Return a new instance with the same state to ensure immutability
			return this.clone({});
		}

		// Ensure the stops are ordered
		stops.sort((a, b) => a.pos - b.pos);

		// Concatenate with existing stops into the new clone's state
		return this.clone({ stops: [...this.state.stops, ...stops] });
	}

	/**
	 * Sets the direction for a linear gradient (e.g., 'to right', '45deg').
	 * This setting is ignored if the gradient type is not 'linear'.
	 * @param direction The direction value.
	 * @returns A new GradientBuilder instance with the updated direction (if applicable).
	 */
	direction(direction: LinearDirection): GradientBuilder {
		// Only apply if the type is linear. Otherwise, return a new instance with same state.
		if (this.state.type === "linear") {
			return this.clone({ direction });
		}
		// Return a new instance even if ignored, to comply with immutability AC
		return this.clone({});
	}

	/**
	 * Sets the shape for a radial gradient ('circle' or 'ellipse').
	 * This setting is ignored if the gradient type is not 'radial'.
	 * @param shape The shape value.
	 * @returns A new GradientBuilder instance with the updated shape (if applicable).
	 */
	shape(shape: RadialShape): GradientBuilder {
		if (this.state.type === "radial") {
			return this.clone({ shape });
		}
		return this.clone({}); // Return new instance even if ignored
	}

	/**
	 * Sets the size for a radial gradient (e.g., 'farthest-corner', 'closest-side').
	 * This setting is ignored if the gradient type is not 'radial'.
	 * @param size The size value.
	 * @returns A new GradientBuilder instance with the updated size (if applicable).
	 */
	size(size: RadialSize): GradientBuilder {
		if (this.state.type === "radial") {
			return this.clone({ size });
		}
		return this.clone({}); // Return new instance even if ignored
	}

	/**
	 * Sets the position for a radial gradient (e.g., 'center', 'top left', '25% 75%').
	 * This setting is ignored if the gradient type is not 'radial'.
	 * @param position The position value.
	 * @returns A new GradientBuilder instance with the updated position (if applicable).
	 */
	position(position: RadialPosition): GradientBuilder {
		if (this.state.type === "radial") {
			return this.clone({ position });
		}
		return this.clone({}); // Return new instance even if ignored
	}

	/**
	 * Generates the CSS background-image string for the configured gradient.
	 * @throws Error if gradient type is not set (.linear() or .radial() was not called).
	 * @throws Error if less than two gradient stops have been added.
	 * @returns The CSS gradient string.
	 */
	getCss(): string {
		if (!this.state.type) {
			throw new Error("Gradient type must be set using .linear() or .radial() before calling .getCss().");
		}

		if (!this.state.stops || this.state.stops.length < 2) {
			throw new Error(
				`At least two gradient stops must be added before calling .getCss(). Found ${
					this.state.stops?.length ?? 0
				} stops.`
			);
		}

		// Map our stops to the format tinygradient expects
		const tinygradientStops = mapStopsToTinygradient(this.state.stops);

		// Create the tinygradient instance
		const gradientInstance = tinygradient(tinygradientStops);

		try {
			let cssString: string;

			if (this.state.type === "linear") {
				cssString = gradientInstance.css("linear", this.state.direction);
			} else {
				// type === 'radial'
				const radialParams = `${this.state.shape} ${this.state.size} at ${this.state.position}`;
				cssString = gradientInstance.css("radial", radialParams.trim());
			}

			return cssString;
		} catch (error: any) {
			console.error("Error generating CSS with tinygradient:", error);
			// Rethrow a more specific error or handle it
			throw new Error(`Failed to generate gradient CSS: ${error.message}`);
		}
	}

	getState(): GradientState {
		return this.clone({}).state; // Return a clone of the current state to prevent external mutations
	}
}
