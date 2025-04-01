// src/lib/gradient/gradientBuilder.ts

import tinygradient from 'tinygradient';
import type {
    GradientState,
    GradientStop,
    ColorInput,
    LinearDirection,
    RadialShape,
    RadialSize,
    RadialPosition,
} from './types';

type TinyGradientStop = tinygradient.StopInput;

// Helper to map our stop format to tinygradient's, though they might be compatible
function mapStopsToTinygradient(stops: GradientStop[]): TinyGradientStop[] {
    // tinygradient likely expects {color: string, pos: number (0-1)} which matches our GradientStop
    // If tinygradient had a different structure, we would map here.
    // For now, assume direct compatibility or slight adjustments if needed.
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
            direction: 'to bottom', // Default linear direction
            shape: 'ellipse', // Default radial shape
            size: 'farthest-corner', // Default radial size
            position: 'center', // Default radial position
        };

        // Ensure stops is always an array (defensive)
        if (!Array.isArray(this.state.stops)) {
            this.state.stops = [];
        }

        // Freeze the state object in development environments to help catch mutations
        // Note: This is a shallow freeze. The stops array itself isn't frozen deeply.
        if (process.env.NODE_ENV === 'development') {
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
            ...updates,
        };
        // Ensure the stops array is a new instance if stops weren't part of the update
        // or if they were, ensure the provided one is used.
        if (!updates.stops) {
            newState.stops = [...this.state.stops];
        } else {
            // Ensure the passed stops array is cloned if it came from outside potentially
            newState.stops = [...updates.stops];
        }

        return new GradientBuilder(newState);
    }

    /**
     * Sets the gradient type to linear.
     * Resets radial-specific settings (shape, size, position) to defaults
     * in the new instance.
     * @returns A new GradientBuilder instance configured for linear gradients.
     */
    linear(): GradientBuilder {
        return this.clone({
            type: 'linear',
            // Reset radial specific properties to their defaults when switching to linear
            shape: 'ellipse',
            size: 'farthest-corner',
            position: 'center'
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
            type: 'radial',
            // Reset linear specific properties to their defaults when switching to radial
            direction: 'to bottom'
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
        return this.clone({ stops: [...this.state.stops, newStop] });
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
        if (this.state.type === 'linear') {
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
        if (this.state.type === 'radial') {
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
        if (this.state.type === 'radial') {
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
        if (this.state.type === 'radial') {
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
            throw new Error(
                'Gradient type must be set using .linear() or .radial() before calling .getCss().'
            );
        }

        if (!this.state.stops || this.state.stops.length < 2) {
            throw new Error(
                'At least two gradient stops must be added before calling .getCss(). Requires ' +
                `${this.state.stops?.length ?? 0} stops.` // Corrected error message
            );
        }

        // Map our stops to the format tinygradient expects (assuming minor adjustments needed)
        const tinygradientStops = mapStopsToTinygradient(this.state.stops);

        // Create the tinygradient instance
        const gradientInstance = tinygradient(tinygradientStops);


        try {
            // Generate CSS based on type
            // tinygradient().css([type], [direction])
            // type can be 'linear' or 'radial'
            // direction combines all other params for radial/linear

            let cssString: string;

            if (this.state.type === 'linear') {
                // tinygradient uses the second arg for direction/angle
                cssString = gradientInstance.css('linear', this.state.direction);

            } else { // type === 'radial'
                // For radial, tinygradient combines shape, size, and position into the 'direction' parameter.
                // Format: "[shape] [size] at [position]"
                // We need to construct this string carefully, omitting parts if they are defaults
                // or if tinygradient handles defaults automatically.
                // Let's check tinygradient docs... It seems it expects the full radial params string.

                // Construct the radial parameters string: "[shape] [size] at [position]"
                // Only include parts if they are non-default? Or always include? CSS usually omits defaults.
                // Let's try including them if they are set (they have defaults in our state).
                // Need to be careful with order and syntax.
                // Example: "circle farthest-corner at center"

                // Note: tinygradient's documentation on complex radial CSS generation is sparse.
                // We might need experimentation or look at its source/tests.
                // Let's assume a simple concatenation works for now.
                const radialParams = `${this.state.shape} ${this.state.size} at ${this.state.position}`;

                // According to types/usage, it might just be .css('radial', radialParams)
                cssString = gradientInstance.css('radial', radialParams.trim());

                // Alternative check: Does tinygradient handle object config? Its types suggest not directly for css().

            }

            // The output from tinygradient.css() might already include "background-image: ...".
            // Need to check. Docs say it returns the *gradient* part, not the full property.
            // Example: "linear-gradient(...)" or "radial-gradient(...)"
            // If it includes the full property, we need to strip it. Assuming it doesn't.

            return cssString;

        } catch (error: any) {
            console.error('Error generating CSS with tinygradient:', error);
            // Rethrow a more specific error or handle it
            throw new Error(`Failed to generate gradient CSS: ${error.message}`);
        }
    }
}