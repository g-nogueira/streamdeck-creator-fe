import { defineConfig } from "vitest/config";
import { sveltekit } from "@sveltejs/kit/vite";
import { svelteTesting } from "@testing-library/svelte/vite";
import { resolve } from "path";

export default defineConfig({
	plugins: [sveltekit(), svelteTesting()],
	// {
	//   name: 'virtual-modules',
	//   resolveId(id) {
	//     if (id === '$env/dynamic/public') {
	//       return './tests/env.dynamic.public.mock.ts'
	//     }
	//   }
	// }],
	test: {
		environment: "jsdom",
		setupFiles: ["./src/tests/vitest-setup.ts"],
		alias: {
			"$env/dynamic/public": resolve("./src/tests/mocks/env.dynamic.public.mock.ts")
		},
		coverage: {
			enabled: true,
			exclude: [
				"**/node_modules/**",
				"**/cypress/**",
				"**/src/tests/**",
				"**/.svelte-kit/**",
				"**/*.test.ts",
				"*.config.ts",
				"*.config.js"
			],
			provider: "v8"
		}
	}
});
