import type { Config } from "tailwindcss";

import { join } from "path";
import { skeleton } from "@skeletonlabs/skeleton/plugin";
import * as themes from "@skeletonlabs/skeleton/themes";
import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} \*/
export default {
	content: [
		"./src/**/*.{html,js,svelte,ts}",
		join(require.resolve("@skeletonlabs/skeleton-svelte"), "../**/*.{html,js,svelte,ts}")
	],
	theme: {
		extend: {}
	},
	plugins: [
		skeleton({
			themes: [themes.wintry]
		}),
		forms
	]
} as Config;
