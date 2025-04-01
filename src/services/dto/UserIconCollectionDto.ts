import type { UserIconCollection } from "../../models/UserIconCollection";
import type { UserIconDto } from "./UserIconDto";
import * as _userIconDto from "./UserIconDto";

export interface UserIconCollectionDto {
	id: string;
	name: string;
	icons: UserIconDto[];
}

export function toUserIconCollection(userIconCollectionDto: UserIconCollectionDto): UserIconCollection {
	return {
		id: userIconCollectionDto.id,
		name: userIconCollectionDto.name,
		icons: userIconCollectionDto.icons.map(_userIconDto.toUserIcon)
	};
}

export function fromUserIconCollection(userIconCollection: UserIconCollection): UserIconCollectionDto {
	return {
		id: userIconCollection.id,
		name: userIconCollection.name,
		icons: userIconCollection.icons.map(_userIconDto.fromUserIcon)
	};
}
