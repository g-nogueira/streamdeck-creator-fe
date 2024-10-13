import { UUID } from "$lib";
import type { UserIcon } from "./UserIcon";

export interface UserIconCollection {
    id: string;
    name: string;
    icons: UserIcon[];
}

export const userIconCollection = {
    mkEmpty(): UserIconCollection {
        return {
            id: UUID.empty,
            name: 'New Collection',
            icons: [],
        };
    }
};