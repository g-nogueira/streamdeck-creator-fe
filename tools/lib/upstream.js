/**
 * MaterialDesignIcons
 */

import request from "request";
import { createWriteStream } from "fs";
import { basename } from "path";
import { open } from "yauzl";

const repo = {
	default: "MaterialDesign",
	light: "MaterialDesignLight"
};
const mdiPackages = {
	default: "@mdi/svg",
	light: "@mdi/light-svg"
};

/**
 * Hits the specified URL, and returns the JSON-decoded response.
 */
const getJson = url => {
	return new Promise((resolve, reject) => {
		request({ url, json: true }, (error, response, body) => {
			if (error) reject(error);
			if (response.statusCode !== 200) {
				reject("Invalid status code <" + response.statusCode + "> from URI " + url);
			}

			resolve(body);
		});
	});
};

/**
 * Returns that latest known version for the specified flavour.
 */
const getLatestVersion = async (flavour = "default") => {
	const packageJsonUrl = `https://raw.githubusercontent.com/Templarian/${repo[flavour]}-SVG/master/package.json`;

	const body = await getJson(packageJsonUrl);
	return body.version;
};

/**
 * Downloads the meta.json file for the specified version and flavour.
 */
const getMeta = async (version, flavour = "default") => {
	const url = `https://cdn.jsdelivr.net/npm/${mdiPackages[flavour]}@${version}/meta.json`;
	return await getJson(url);
};

const download = async (url, destPath) => {
	console.log("Downloading " + url + " to " + destPath);
	return new Promise((resolve, reject) => {
		request(url)
			.on("error", () => reject())
			.on("response", res => {
				if (res.statusCode !== 200) {
					reject(res.statusCode);
					return;
				}

				res.pipe(createWriteStream(destPath));
			})
			.on("end", () => {
				setTimeout(() => {
					resolve();
				}, 500);
			});
	});
};

/**
 * Downloads the SVG ZIP file for the specified flavour in the specified path.
 */
const downloadSvgZip = async (destPath, flavour, version) => {
	return download(`https://github.com/Templarian/${repo[flavour]}-SVG/archive/v${version}.zip`, destPath);
};

const downloadWebfontZip = async (destPath, flavour, version) => {
	return download(`https://github.com/Templarian/${repo[flavour]}-Webfont/archive/v${version}.zip`, destPath);
};

const extractZip = async (zipPath, destDir, filePattern) => {
	if (typeof filePattern === "string") {
		filePattern = new RegExp(filePattern);
	}

	// Extract ZIP
	return new Promise((resolve, reject) => {
		open(zipPath, (err, zipfile) => {
			if (err) {
				reject(err);
			}

			zipfile
				.on("entry", entry => {
					if (filePattern.test(entry.fileName)) {
						zipfile.openReadStream(entry, function (err, readStream) {
							if (err) {
								reject(err);
							}

							readStream.pipe(createWriteStream(`${destDir}/${basename(entry.fileName)}`));
						});
					}
				})
				.on("close", () => {
					resolve();
				});
		});
	});
};

export default {
	getLatestVersion,
	getMeta,
	downloadSvgZip,
	downloadWebfontZip,
	extractZip
};
