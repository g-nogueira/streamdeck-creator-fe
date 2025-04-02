// src/lib/gradient/gradientBuilder.test.ts

import { describe, it, expect, beforeEach } from "vitest";
import { GradientBuilder, type GradientStop } from "../../../lib/gradient/index"; // Import from the barrel file

describe("GradientBuilder", () => {
	let builder: GradientBuilder;

	beforeEach(() => {
		// Start with a fresh builder for most tests
		builder = new GradientBuilder();
	});

	// --- Immutability Tests ---
	describe("Immutability", () => {
		it("should return a new instance when calling .linear()", () => {
			const newBuilder = builder.linear();
			expect(newBuilder).toBeInstanceOf(GradientBuilder);
			expect(newBuilder).not.toBe(builder); // Check instance inequality
		});

		it("should return a new instance when calling .radial()", () => {
			const newBuilder = builder.radial();
			expect(newBuilder).toBeInstanceOf(GradientBuilder);
			expect(newBuilder).not.toBe(builder);
		});

		it("should return a new instance when calling .addStop()", () => {
			const newBuilder = builder.addStop("red", 0);
			expect(newBuilder).toBeInstanceOf(GradientBuilder);
			expect(newBuilder).not.toBe(builder);
		});

		it("should return a new instance when calling .addStops()", () => {
			const stops: GradientStop[] = [{ color: "red", pos: 0 }];
			const newBuilder = builder.addStops(stops);
			expect(newBuilder).toBeInstanceOf(GradientBuilder);
			expect(newBuilder).not.toBe(builder);
		});

		it("should return a new instance when calling .direction() (even if ignored)", () => {
			const linearBuilder = builder.linear();
			const newBuilder1 = linearBuilder.direction("to top");
			expect(newBuilder1).not.toBe(linearBuilder);

			// Test on non-linear type
			const radialBuilder = builder.radial();
			const newBuilder2 = radialBuilder.direction("to top"); // Should be ignored, but still new instance
			expect(newBuilder2).not.toBe(radialBuilder);
		});

		it("should return a new instance when calling .shape() (even if ignored)", () => {
			const radialBuilder = builder.radial();
			const newBuilder1 = radialBuilder.shape("circle");
			expect(newBuilder1).not.toBe(radialBuilder);

			const linearBuilder = builder.linear();
			const newBuilder2 = linearBuilder.shape("circle"); // Should be ignored, but still new instance
			expect(newBuilder2).not.toBe(linearBuilder);
		});
		// Similar tests for .size() and .position()
	});

	// --- State Initialization & Defaults ---
	describe("Initialization & Defaults", () => {
		it("should initialize with an undefined type", () => {
			// Accessing internal state for testing is tricky if truly private.
			// We can test behaviorally via getCss throwing error.
			expect(() => builder.getCss()).toThrow(/Gradient type must be set/);
		});

		it("should initialize with an empty stops array", () => {
			// Again, test behaviorally.
			const linearBuilder = builder.linear();
			expect(() => linearBuilder.getCss()).toThrow(/At least two gradient stops/);
		});

		// We'll test default CSS output later
	});

	// --- Type Setting ---
	describe("Type Setting", () => {
		it(".linear() should set type to linear and allow direction", () => {
			const linearBuilder = builder.linear().direction("90deg");
			// Test via getCss output or by checking internal state if accessible/testable
			// For now, let's plan to check getCss output later.
			// We can add a basic check that it doesn't throw the 'type not set' error anymore
			expect(() => linearBuilder.addStop("red", 0).addStop("blue", 1).getCss()).not.toThrow(
				/Gradient type must be set/
			);
		});

		it(".radial() should set type to radial and allow shape/size/position", () => {
			const radialBuilder = builder.radial().shape("circle");
			expect(() => radialBuilder.addStop("red", 0).addStop("blue", 1).getCss()).not.toThrow(
				/Gradient type must be set/
			);
		});

		it(".linear() should reset radial properties (behavioral check)", () => {
			const initialRadial = builder.radial().shape("circle").size("closest-side").position("top left");
			const switchedToLinear = initialRadial.linear().addStop("red", 0).addStop("blue", 1);
			// Expect default linear gradient ('to bottom')
			expect(switchedToLinear.getCss()).toContain("linear-gradient(to bottom");
			expect(switchedToLinear.getCss()).not.toContain("circle");
		});

		it(".radial() should reset linear properties (behavioral check)", () => {
			const initialLinear = builder.linear().direction("to right");
			const switchedToRadial = initialLinear.radial().addStop("red", 0).addStop("blue", 1);
			// Expect default radial gradient ('ellipse farthest-corner at center')
			expect(switchedToRadial.getCss()).toContain("radial-gradient(ellipse farthest-corner at center");
			expect(switchedToRadial.getCss()).not.toContain("to right");
		});
	});

	// --- Stop Management ---
	describe("Stop Management", () => {
		let typedBuilder: GradientBuilder;
		beforeEach(() => {
			typedBuilder = builder.linear(); // Need a type set to test stops with getCss
		});

		it(".addStop() should add a single stop", () => {
			const stops = [
				{ color: "red", pos: 0 },
				{ color: "blue", pos: 1 }
			];
			const finalBuilder = typedBuilder.addStop(stops[0].color, stops[0].pos).addStop(stops[1].color, stops[1].pos);
			// Check CSS output includes the stops
			const css = finalBuilder.getCss();
			expect(css).toMatch(/rgb\(255,\s*0,\s*0\)\s*0%/); // Check for red at 0%
			expect(css).toMatch(/rgb\(0,\s*0,\s*255\)\s*100%/); // Check for blue at 100%
		});

		it(".addStops() should add multiple stops", () => {
			const stops: GradientStop[] = [
				{ color: "yellow", pos: 0.2 },
				{ color: "lime", pos: 0.8 }
			];
			const finalBuilder = typedBuilder.addStop("red", 0).addStops(stops).addStop("blue", 1);
			const css = finalBuilder.getCss();
			expect(css).toMatch(/rgb\(255,\s*0,\s*0\)\s*0%/); // red 0%
			expect(css).toMatch(/rgb\(255,\s*255,\s*0\)\s*20%/); // yellow 20%
			expect(css).toMatch(/rgb\(0,\s*255,\s*0\)\s*80%/); // lime 80%
			expect(css).toMatch(/rgb\(0,\s*0,\s*255\)\s*100%/); // blue 100%
		});

		it(".addStops() with empty array should not change stops", () => {
			const b1 = typedBuilder.addStop("red", 0).addStop("blue", 1);
			const b2 = b1.addStops([]); // Add empty array
			expect(b2.getCss()).toEqual(b1.getCss());
			expect(b2).not.toBe(b1); // Still immutable
		});
	});

	// --- Configuration Methods ---
	describe("Configuration Methods (Runtime Ignore)", () => {
		it(".direction() should update linear gradient direction", () => {
			const css = builder.linear().direction("to right").addStop("red", 0).addStop("blue", 1).getCss();
			expect(css).toContain("linear-gradient(to right");
		});

		it(".direction() should be ignored for radial gradients", () => {
			const b1 = builder.radial().addStop("red", 0).addStop("blue", 1);
			const b2 = b1.direction("to right"); // Should be ignored
			// Expect default radial output
			expect(b2.getCss()).toEqual(b1.getCss());
			expect(b2.getCss()).toContain("radial-gradient(ellipse farthest-corner at center");
			expect(b2.getCss()).not.toContain("to right");
		});

		it(".shape() should update radial gradient shape", () => {
			const css = builder.radial().shape("circle").addStop("red", 0).addStop("blue", 1).getCss();
			expect(css).toContain("radial-gradient(circle");
		});

		it(".shape() should be ignored for linear gradients", () => {
			const b1 = builder.linear().addStop("red", 0).addStop("blue", 1);
			const b2 = b1.shape("circle"); // Should be ignored
			expect(b2.getCss()).toEqual(b1.getCss());
			expect(b2.getCss()).toContain("linear-gradient(to bottom");
			expect(b2.getCss()).not.toContain("circle");
		});

		// Similar tests for .size() and .position() being applied only to radial
		it(".size() should update radial gradient size", () => {
			const css = builder.radial().size("closest-side").addStop("red", 0).addStop("blue", 1).getCss();
			expect(css).toContain("radial-gradient(ellipse closest-side");
		});

		it(".position() should update radial gradient position", () => {
			const css = builder.radial().position("top left").addStop("red", 0).addStop("blue", 1).getCss();
			expect(css).toContain("radial-gradient(ellipse farthest-corner at top left");
		});
	});

	// --- CSS Output & Validation ---
	describe("getCss()", () => {
		it("should throw error if type is not set", () => {
			expect(() => builder.addStop("red", 0).addStop("blue", 1).getCss()).toThrow("Gradient type must be set");
		});

		it("should throw error if less than 2 stops are added", () => {
			expect(() => builder.linear().addStop("red", 0).getCss()).toThrow("At least two gradient stops must be added");
			expect(() => builder.radial().getCss()).toThrow(
				// No stops
				"At least two gradient stops must be added"
			);
		});

		it("should generate correct default linear gradient CSS", () => {
			const css = builder.linear().addStop("white", 0).addStop("black", 1).getCss();
			// Example output from tinygradient - may need slight adjustment based on actual output
			expect(css).toBe("linear-gradient(to bottom, rgb(255, 255, 255) 0%, rgb(0, 0, 0) 100%)");
		});

		it("should generate correct default radial gradient CSS", () => {
			const css = builder.radial().addStop("white", 0).addStop("black", 1).getCss();
			// Example output from tinygradient
			expect(css).toBe("radial-gradient(ellipse farthest-corner at center, rgb(255, 255, 255) 0%, rgb(0, 0, 0) 100%)");
		});

		it("should generate correct complex linear gradient CSS", () => {
			const css = builder
				.linear()
				.direction("45deg")
				.addStop("rgba(255, 0, 0, 0.5)", 0.1)
				.addStop("hsl(120, 100%, 50%)", 0.8) // Input: HSL Green
				.getCss();

			// Check key parts
			expect(css).toMatch(/linear-gradient\(45deg/);
			// Check first stop (rgba red at 10%)
			expect(css).toMatch(/rgba\(255,\s*0,\s*0,\s*0.5\)\s*10%/);
			// Check second stop (hsl green -> rgb green at 80%) - CORRECTED ASSERTION
			expect(css).toMatch(/rgb\(0,\s*255,\s*0\)\s*80%/);
		});

		it("should generate correct complex radial gradient CSS", () => {
			const css = builder
				.radial()
				.shape("circle")
				.size("closest-side")
				.position("20% 80%")
				.addStop("yellow", 0)
				.addStop("#00FF00", 1) // Lime green hex
				.getCss();
			// Check key parts
			expect(css).toMatch(/radial-gradient\(circle closest-side at 20% 80%/);
			expect(css).toMatch(/rgb\(255,\s*255,\s*0\)\s*0%/); // yellow
			expect(css).toMatch(/rgb\(0,\s*255,\s*0\)\s*100%/); // lime
		});

		it("should handle various color input formats", () => {
			const css = builder
				.linear()
				.addStop("red", 0) // name
				.addStop("#0f0", 0.5) // hex
				.addStop("rgb(0, 0, 255)", 1) // rgb
				.getCss();
			expect(css).toMatch(/rgb\(255,\s*0,\s*0\)\s*0%/); // red
			expect(css).toMatch(/rgb\(0,\s*255,\s*0\)\s*50%/); // #0f0 -> lime
			expect(css).toMatch(/rgb\(0,\s*0,\s*255\)\s*100%/); // blue
		});
	});

	// Stop Access and Replacement Tests ---
	describe("Stop Access and Replacement", () => {
		let builderWithStops: GradientBuilder;
		const initialStops: GradientStop[] = [
			{ color: "red", pos: 0 },
			{ color: "blue", pos: 1 }
		];

		beforeEach(() => {
			// Start with a builder that has some stops and a type
			builderWithStops = new GradientBuilder()
				.linear() // Set type to avoid errors in subsequent calls if needed
				.withStops(initialStops); // Use the new method to set initial state
		});

		// Tests for getStops()
		describe("getStops()", () => {
			it("should return the current list of stops", () => {
				const stops = builderWithStops.getStops();
				expect(stops).toEqual(initialStops);
			});

			it("should return a copy of the stops array, not the internal one", () => {
				const stops = builderWithStops.getStops();
				// Attempt to mutate the returned array
				stops.push({ color: "green", pos: 0.5 });

				// Get the stops again from the original builder
				const stopsAgain = builderWithStops.getStops();

				// Verify the original builder's stops were not affected
				expect(stopsAgain).toEqual(initialStops);
				expect(stopsAgain.length).toBe(2);
			});
		});

		// Tests for withStops()
		describe("withStops()", () => {
			const newStops: GradientStop[] = [
				{ color: "yellow", pos: 0.2 },
				{ color: "lime", pos: 0.8 }
			];

			it("should return a new instance", () => {
				const newBuilder = builderWithStops.withStops(newStops);
				expect(newBuilder).toBeInstanceOf(GradientBuilder);
				expect(newBuilder).not.toBe(builderWithStops);
			});

			it("should replace the stops in the new instance", () => {
				const newBuilder = builderWithStops.withStops(newStops);
				const retrievedStops = newBuilder.getStops();
				expect(retrievedStops).toEqual(newStops);
				expect(retrievedStops).not.toBe(newStops); // Ensure it's a copy
			});

			it("should allow replacing with an empty array", () => {
				const newBuilder = builderWithStops.withStops([]);
				expect(newBuilder.getStops()).toEqual([]);
				// Calling getCss should now throw because there are < 2 stops
				expect(() => newBuilder.getCss()).toThrow(/At least two gradient stops must be added/);
			});

			it("should not modify the original instance", () => {
				builderWithStops.withStops(newStops); // Call the method but don't store the result
				const originalStops = builderWithStops.getStops();
				expect(originalStops).toEqual(initialStops); // Original stops should be unchanged
			});

			it("should preserve other state properties", () => {
				const directedBuilder = builderWithStops.direction("to right"); // Modify another property
				const newStopsBuilder = directedBuilder.withStops(newStops);

				// Check if stops are updated AND direction is preserved
				expect(newStopsBuilder.getStops()).toEqual(newStops);
				// Test direction behaviorally via getCss
				const css = newStopsBuilder.getCss();
				expect(css).toContain("linear-gradient(to right");
			});
		});
	});
});
