import type { DBSchema } from "idb";
import type { UserIconCollectionDto } from "../dto/UserIconCollectionDto";

export interface UserIconCollectionDB extends DBSchema {
	userIconCollections: {
		key: string;
		value: UserIconCollectionDto;
	};
}
