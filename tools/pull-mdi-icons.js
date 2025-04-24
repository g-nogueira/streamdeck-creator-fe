/**
 * MaterialDesignIcons
 *
 * Downloads latest MDI & MDI Light releases and extracts the right resources
 * in the right folder.
 */

import fs from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import pkg from "chalk";
import { sync } from "rimraf";
import upstream from "./lib/upstream.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const { readFileSync, existsSync, mkdirSync, copyFileSync, writeFileSync } = fs;
const { blue, underline, red, green } = pkg;
const { downloadWebfontZip, extractZip, downloadSvgZip, getMeta } = upstream;

const log = console.log;
const workspace = resolve(__dirname, "../temp");
const dist = resolve(__dirname, "../static");

const readPackageJson = () => {
	return JSON.parse(readFileSync(resolve(__dirname, "../package.json"), "utf8"));
};

const pullIcons = async () => {
	log(blue.bold("MaterialDesignIcons icons parser🔍"));

	// Check requested version
	const packageJson = readPackageJson();
	const versions = packageJson["materialdesignicons-picker"].version;
	log(`Pulling versions default=${versions.default}, light=${versions.light}`);

	// Create structure: temp directory & dist dir
	const dirs = [workspace, dist + "/css/", dist + "/fonts/", dist + "/data/", dist + "/data/svg/"];
	for (let directory of dirs) {
		// Remove it if exists
		if (existsSync(directory)) {
			sync(directory);
		}

		// Re-create it
		mkdirSync(directory);
	}

	let data = {
		icons: {
			default: [],
			light: []
		},
		version: {
			default: [],
			light: []
		}
	};

	for (let flavour of ["default", "light"]) {
		log(blue(`Handling flavour "${flavour}" 🔍`));

		// Get requested version
		const version = (data.version[flavour] = versions[flavour]);
		log(`Requested version: ${underline(version)} ✔️`);

		// Download CSS file (in dist/css/), woff2 webfont (in dist/fonts/)
		const escapedVersion = version.replace(".", `\\.`);
		const webfontZipPath = `${workspace}/${flavour}-webfont.zip`;
		const webfontExtractedZipPath = `${workspace}/${flavour}-webfont`;
		mkdirSync(webfontExtractedZipPath);
		try {
			await downloadWebfontZip(webfontZipPath, flavour, version);
		} catch (e) {
			log(red(`Failed to download webfont ZIP: ${e.message || e}`));
			return;
		}
		log(`Downloaded webfont ZIP ✔️`);
		try {
			await extractZip(
				webfontZipPath,
				webfontExtractedZipPath,
				`^MaterialDesign(Light)?-Webfont-${escapedVersion}\/(css\/materialdesignicons(-light)?\.min\.css|fonts\/materialdesignicons(-light)?-webfont\.woff2?)$`
			);
		} catch (e) {
			log(red(`Failed to extract webfont ZIP: ${e.message || e}`));
			return;
		}
		log(`Extracted webfont ZIP ✔️`);
		// Copy files
		const webfontZipFiles = [
			`css/materialdesignicons${flavour === "light" ? "-light" : ""}.min.css`,
			`fonts/materialdesignicons${flavour === "light" ? "-light" : ""}-webfont.woff`,
			`fonts/materialdesignicons${flavour === "light" ? "-light" : ""}-webfont.woff2`
		];
		for (const file of webfontZipFiles) {
			const filename = file.split("/")[1]; // css/file.ext -> file.ext
			copyFileSync(`${webfontExtractedZipPath}/${filename}`, `${dist}/${file}`);
		}
		copyFileSync(
			`${webfontExtractedZipPath}/materialdesignicons${flavour === "light" ? "-light" : ""}.min.css`,
			`${dist}/css/materialdesignicons${flavour === "light" ? "-light" : ""}.min.css`
		);
		copyFileSync(
			`${webfontExtractedZipPath}/materialdesignicons${flavour === "light" ? "-light" : ""}-webfont.woff2`,
			`${dist}/fonts/materialdesignicons${flavour === "light" ? "-light" : ""}-webfont.woff2`
		);

		// Download SVG files
		const svgZipPath = `${workspace}/${flavour}-svg.zip`;
		const svgExtractedZipPath = `${workspace}/${flavour}-svg`;
		mkdirSync(svgExtractedZipPath);
		try {
			await downloadSvgZip(svgZipPath, flavour, version);
			log(`Downloaded SVG ZIP ✔️`);
		} catch (e) {
			log(red(`Failed to download SVG ZIP: ${e.message || e}`));
			return;
		}
		await extractZip(svgZipPath, svgExtractedZipPath, `^MaterialDesign(Light)?-SVG-${escapedVersion}\/svg\/.+$`);
		log(`Extracted SVG ZIP ✔️`);

		const iconsMetas = await getMeta(version, flavour);
		log(`Downloaded meta file ✔️`);

		for (let icon of iconsMetas) {
			// Get svg, fine-tune it
			let svg = readFileSync(`${svgExtractedZipPath}/${icon.name}.svg`, "utf-8");

			// Remove xml header
			svg = svg.replace(
				'<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">',
				""
			);
			// Remove xmlns & xmlns:xlink & version attributes
			svg = svg.replace(
				' xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"',
				""
			);
			// Remove id="{icon_name}" attribute
			svg = svg.replace(` id=\"mdi-${icon.name}\"`, "");

			writeFileSync(`${dist}/data/svg/${icon.id}.svg`, svg);

			// Compute 2 "searchable" attributes, to achieve weighted search
			const buildSearchable = strings => {
				strings = strings
					.join(" ") // glue them together
					.split("/")
					.join(" ") // remove "/"
					.split("-")
					.join(" ") // remove "-"
					.toLowerCase() // lowercase
					.split(" ") // back to array
					.filter(s => !!s); // exclude empty strings, caused by duplicate spaces

				// remove duplicate words
				return Array.from(new Set(strings)).join(" ");
			};

			const p1 = buildSearchable([icon.name, ...icon.aliases]);
			const p2 = buildSearchable(icon.tags);

			data.icons[flavour].push({
				id: icon.id,
				name: icon.name,
				author: icon.author,
				codepoint: icon.codepoint,
				keywords1: p1,
				keywords2: p2,
				version: icon.version,
				family: flavour
			});
		}

		// Sort our icons list
		data.icons[flavour].sort((a, b) => a.name.localeCompare(b.name));

		log("");
	}

	// Dump to file
	log("Writing JSON files...");
	writeFileSync(`${dist}/data/icons.json`, JSON.stringify(data, null, 4));
	writeFileSync(`${dist}/data/icons.min.json`, JSON.stringify(data));
	log(green(`Done! ✔`));

	// Clean
	sync(workspace);

	// Report
	log("Download finished!");
	log(`Default flavour: ${versions.default}`);
	log(`Light flavour: ${versions.light}`);
};

pullIcons();
