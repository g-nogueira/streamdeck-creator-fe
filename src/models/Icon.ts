export type IconOrigin = "mdi" | "streamdeck" | "homarr";

export interface Icon {
	id: string;
	label: string;
	keywords: string[];
	origin: IconOrigin;
	contentType: string;
	url: string | undefined;
}

export function mkEmpty(): Icon {
	return {
		id: "",
		label: "",
		keywords: [],
		origin: "mdi",
		contentType: "img/svg+xml",
		url: undefined,
	};
}
