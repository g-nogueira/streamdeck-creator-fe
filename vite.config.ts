import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	test: {
		include: ["src/**/*.{test,spec}.{js,ts}"]
	},
	server: {
		fs: {
			// Allow serving files from one level up to the project root
			allow: ["static"]
		}
	}
});
