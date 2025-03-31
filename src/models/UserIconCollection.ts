import * as UUID from "$lib/utils/uuid";
import type { UserIcon } from "./UserIcon";

export type UserIconCollection = {
	id: string;
	name: string;
	icons: UserIcon[];
};

export function mkEmpty(): UserIconCollection {
	return {
		id: UUID.empty,
		name: "New Collection",
		icons: []
	};
}
