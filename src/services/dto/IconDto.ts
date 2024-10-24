import type { Icon } from "../../models/Icon";

export interface IconDto {
    id: string;
    label: string;
}

export function toIcon(iconDto: IconDto): Icon {
    return {
        id: iconDto.id,
        label: iconDto.label,
        keywords: iconDto.label.split(' '),
        origin: 'streamdeck',
    };
}