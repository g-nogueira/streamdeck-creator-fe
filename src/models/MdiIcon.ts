import type { Icon } from "./Icon";
import type { UserIcon } from "./UserIcon";
import * as _userIcon from "./UserIcon";

export interface MdiIcon {
    id: string,
    name: string,
    author: string,
    codepoint: string,
    keywords1: string,
    keywords2: string,
    version: string,
    family: 'default' | 'light',
}

export function toUserIcon(icon: MdiIcon): UserIcon {
    return {
        ..._userIcon.mkEmpty(),
        originalIconId: icon.id,
        label: icon.name,
        origin: 'mdi',
        keywords: [...icon.keywords1.split(' '), ...icon.keywords2.split(' ')],
    };
}

export function toIcon(icon: MdiIcon): Icon {
    return {
        id: icon.id,
        label: icon.name,
        keywords: [...icon.keywords1.split(' '), ...icon.keywords2.split(' ')],
        origin: 'mdi',
    };
}