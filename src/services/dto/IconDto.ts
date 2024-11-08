import type { Icon } from "../../models/Icon";

export type IconOriginDto = 'mdi' | 'streamdeck';

export interface IconDto {
    id: string;
    label: string;
    keywords: string[];
    origin: IconOriginDto;
}

export function toIcon(iconDto: IconDto): Icon {
    return {
        id: iconDto.id,
        label: iconDto.label,
        keywords: iconDto.label.split(' '),
        origin: iconDto.origin,
    };
}